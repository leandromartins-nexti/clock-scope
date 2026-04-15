// TODO: REMOVER EM PRODUÇÃO
// Este contexto implementa o seletor de cliente para fase de testes.
// Em produção, o customer_id deve vir do contexto OAuth2/JWT.

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import customersIndex from "@/data/customers-index.json";
import { getImportedCustomersIndex, loadChartDataFromStorage } from "@/components/analytics/CustomerZipImporter";
import { useAuth } from "@/contexts/AuthContext";
import type { CustomerEntry } from "@/types/customer";
export type { CustomerEntry };

interface CustomerContextType {
  customerId: number;
  customerLabel: string;
  customers: CustomerEntry[];
  customerDataVersion: number;
  /** Current logged-in client slug */
  activeClient: string;
  /** Whether the user can switch clients (only nexti) */
  canSwitchClient: boolean;
  setCustomerId: (id: number) => void;
  refreshCustomers: () => void;
  loadCustomerData: (tab: string, chart: string, dimension: string) => Promise<any | null>;
}

const STORAGE_KEY = "nexti_active_customer_id";

/** Map client slugs to customer_ids when we have them */
const CLIENT_CUSTOMER_MAP: Record<string, number> = {
  nexti: 642,
  orsegups: 643,
  atitudeservicos: 644,
  vigeyes: 645,
};

function getAllCustomers(): CustomerEntry[] {
  const builtin = customersIndex.customers as CustomerEntry[];
  const imported = getImportedCustomersIndex();
  const map = new Map<number, CustomerEntry>();
  for (const c of builtin) map.set(c.customer_id, c);
  for (const c of imported) map.set(c.customer_id, c);
  return Array.from(map.values()).sort((a, b) => a.customer_id - b.customer_id);
}

function getStoredCustomerId(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const id = parseInt(stored, 10);
      if (!isNaN(id)) return id;
    }
  } catch {}
  return customersIndex.customers[0]?.customer_id ?? 642;
}

// TODO: REMOVER EM PRODUÇÃO — cor determinística por customer_id
export function getCustomerColor(customerId: number): string {
  const hue = (customerId * 137.508) % 360;
  return `hsl(${Math.round(hue)}, 70%, 50%)`;
}

const CustomerContext = createContext<CustomerContextType>({
  customerId: 642,
  customerLabel: "Cliente 642",
  customers: [],
  customerDataVersion: 0,
  activeClient: "nexti",
  canSwitchClient: true,
  setCustomerId: () => {},
  refreshCustomers: () => {},
  loadCustomerData: async () => null,
});

export function useCustomer() {
  return useContext(CustomerContext);
}

// Vite glob for dynamic JSON loading from built-in customers folder
const customerJsonModules = import.meta.glob<Record<string, any>>(
  "/src/data/customers/*/qualidade-ponto/*.json",
  { eager: false }
);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const activeClient = user?.client ?? "nexti";
  const canSwitchClient = activeClient === "nexti";

  const getDefaultCustomerId = () => {
    if (canSwitchClient) return getStoredCustomerId();
    return CLIENT_CUSTOMER_MAP[activeClient] ?? 642;
  };

  const [customerId, setCustomerIdState] = useState<number>(getDefaultCustomerId);
  const [customers, setCustomers] = useState<CustomerEntry[]>(() => getAllCustomers());
  const [customerDataVersion, setCustomerDataVersion] = useState(0);

  // Lock to client's customer when not nexti
  useEffect(() => {
    if (!canSwitchClient) {
      const forcedId = CLIENT_CUSTOMER_MAP[activeClient] ?? 642;
      setCustomerIdState(forcedId);
    }
  }, [activeClient, canSwitchClient]);

  const customerLabel = customers.find(c => c.customer_id === customerId)?.label ?? `Cliente ${customerId}`;

  const setCustomerId = useCallback((id: number) => {
    if (!canSwitchClient) return; // Prevent switching for non-nexti
    setCustomerIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, String(id));
    } catch {}
  }, [canSwitchClient]);

  const refreshCustomers = useCallback(() => {
    setCustomers(getAllCustomers());
    setCustomerDataVersion((version) => version + 1);
  }, []);

  const loadCustomerData = useCallback(async (tab: string, chart: string, dimension: string): Promise<any | null> => {
    const fromStorage = loadChartDataFromStorage(customerId, tab, chart, dimension);
    if (fromStorage) return fromStorage;

    const path = `/src/data/customers/${customerId}/${tab}/${chart}-${dimension}.json`;
    const loader = customerJsonModules[path];
    if (loader) {
      try {
        const mod = await loader();
        return (mod as any).default ?? mod;
      } catch {
        return null;
      }
    }

    return null;
  }, [customerId]);

  return (
    <CustomerContext.Provider value={{
      customerId,
      customerLabel,
      customers,
      customerDataVersion,
      activeClient,
      canSwitchClient,
      setCustomerId,
      refreshCustomers,
      loadCustomerData,
    }}>
      {children}
    </CustomerContext.Provider>
  );
}
