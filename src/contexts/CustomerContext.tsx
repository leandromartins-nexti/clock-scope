// TODO: REMOVER EM PRODUÇÃO
// Este contexto implementa o seletor de cliente para fase de testes.
// Em produção, o customer_id deve vir do contexto OAuth2/JWT.

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import customersIndex from "@/data/customers-index.json";
import { getImportedCustomersIndex, loadChartDataFromStorage, type CustomerEntry } from "@/components/analytics/CustomerZipImporter";

export type { CustomerEntry };

interface CustomerContextType {
  customerId: number;
  customerLabel: string;
  customers: CustomerEntry[];
  setCustomerId: (id: number) => void;
  /** Refresh customer list (after import/removal) */
  refreshCustomers: () => void;
  /** Load JSON data for the current customer. Returns null if not found. */
  loadCustomerData: (tab: string, chart: string, dimension: string) => Promise<any | null>;
}

const STORAGE_KEY = "nexti_active_customer_id";

function getAllCustomers(): CustomerEntry[] {
  const builtin = customersIndex.customers as CustomerEntry[];
  const imported = getImportedCustomersIndex();
  // Merge: imported overrides builtin by customer_id
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
  const [customerId, setCustomerIdState] = useState<number>(getStoredCustomerId);
  const [customers, setCustomers] = useState<CustomerEntry[]>(() => getAllCustomers());

  const customerLabel = customers.find(c => c.customer_id === customerId)?.label ?? `Cliente ${customerId}`;

  const setCustomerId = useCallback((id: number) => {
    setCustomerIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, String(id));
    } catch {}
  }, []);

  const refreshCustomers = useCallback(() => {
    setCustomers(getAllCustomers());
  }, []);

  const loadCustomerData = useCallback(async (tab: string, chart: string, dimension: string): Promise<any | null> => {
    // 1. Try localStorage (imported via ZIP)
    const fromStorage = loadChartDataFromStorage(customerId, tab, chart, dimension);
    if (fromStorage) return fromStorage;

    // 2. Try built-in Vite glob (files in src/data/customers/)
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
      setCustomerId,
      refreshCustomers,
      loadCustomerData,
    }}>
      {children}
    </CustomerContext.Provider>
  );
}
