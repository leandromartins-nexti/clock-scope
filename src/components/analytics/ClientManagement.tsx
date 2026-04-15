// TODO: REMOVER EM PRODUÇÃO
// Gestão de clientes para fase de testes.

import { useState, useCallback } from "react";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CustomerZipImporter, {
  getImportedCustomersIndex,
  loadCustomerFromStorage,
  removeCustomerFromStorage,
  saveCustomerToStorage,
} from "@/components/analytics/CustomerZipImporter";
import type { CustomerEntry } from "@/types/customer";
import {
  Upload,
  Users,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { ImportedCustomer } from "@/components/analytics/CustomerZipImporter";

export default function ClientManagement() {
  const { customerId, customers, setCustomerId, refreshCustomers } = useCustomer();
  const [importedCustomers, setImportedCustomers] = useState<CustomerEntry[]>(
    () => getImportedCustomersIndex()
  );
  const [expandedCustomer, setExpandedCustomer] = useState<number | null>(null);
  const [customerDetails, setCustomerDetails] =
    useState<ImportedCustomer | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const activeCustomer = customers.find((c) => c.customer_id === customerId);

  const refreshList = useCallback(() => {
    setImportedCustomers(getImportedCustomersIndex());
    refreshCustomers();
  }, [refreshCustomers]);

  const handleRemove = useCallback(
    (id: number) => {
      removeCustomerFromStorage(id);
      refreshList();
      if (expandedCustomer === id) {
        setExpandedCustomer(null);
        setCustomerDetails(null);
      }
      toast.success("Cliente removido");
    },
    [expandedCustomer, refreshList]
  );

  const toggleExpand = useCallback(
    (id: number) => {
      if (expandedCustomer === id) {
        setExpandedCustomer(null);
        setCustomerDetails(null);
      } else {
        setExpandedCustomer(id);
        setCustomerDetails(loadCustomerFromStorage(id));
      }
    },
    [expandedCustomer]
  );

  const startRename = useCallback((id: number, currentLabel: string) => {
    setEditingId(id);
    setEditName(currentLabel);
  }, []);

  const confirmRename = useCallback(() => {
    if (!editingId || !editName.trim()) return;
    const data = loadCustomerFromStorage(editingId);
    if (data) {
      data.label = editName.trim();
      try {
        saveCustomerToStorage(data);
        refreshList();
        toast.success(`Renomeado para "${editName.trim()}"`);
      } catch (e: any) {
        toast.error(e.message);
      }
    }
    setEditingId(null);
    setEditName("");
  }, [editingId, editName, refreshList]);

  const cancelRename = useCallback(() => {
    setEditingId(null);
    setEditName("");
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Active client selector */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#FF5722]/10 flex items-center justify-center">
            <Users className="w-4.5 h-4.5 text-[#FF5722]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Cliente Ativo
            </h3>
            <p className="text-xs text-muted-foreground">
              Selecione o cliente cujos dados serão exibidos nos dashboards
            </p>
          </div>
        </div>

        <Select
          value={String(customerId)}
          onValueChange={(v) => {
            setCustomerId(Number(v));
            const label = customers.find(
              (c) => c.customer_id === Number(v)
            )?.label;
            toast.success(`Cliente ativo: ${label}`);
          }}
        >
          <SelectTrigger className="w-64 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {customers.map((c) => (
              <SelectItem key={c.customer_id} value={String(c.customer_id)}>
                <span className="flex items-center gap-2">
                  {c.label}
                  <span className="text-[10px] text-muted-foreground">
                    #{c.customer_id}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-[11px] text-muted-foreground mt-3">
          Em produção, o cliente será identificado automaticamente pelo
          subdomínio (ex: vigeyes.nexti.com) via OAuth2.
        </p>
      </div>

      {/* Import section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Upload className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Importar Dados
            </h3>
            <p className="text-xs text-muted-foreground">
              Importe um ZIP com a estrutura de dados de um cliente
            </p>
          </div>
        </div>

        <CustomerZipImporter />
      </div>

      {/* Client registry */}
      {importedCustomers.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Database className="w-4.5 h-4.5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Clientes Cadastrados
                </h3>
                <p className="text-xs text-muted-foreground">
                  {importedCustomers.length} cliente
                  {importedCustomers.length > 1 ? "s" : ""} importado
                  {importedCustomers.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border/40">
            {importedCustomers.map((c) => {
              const isActive = customerId === c.customer_id;
              const isEditing = editingId === c.customer_id;

              return (
                <div key={c.customer_id}>
                  <div
                    className={`flex items-center gap-3 px-6 py-3.5 transition-colors ${
                      isActive ? "bg-[#FF5722]/5" : "hover:bg-muted/30"
                    }`}
                  >
                    {/* Expand toggle */}
                    <button
                      onClick={() => toggleExpand(c.customer_id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {expandedCustomer === c.customer_id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Active indicator */}
                    {isActive && (
                      <CheckCircle2 className="w-4 h-4 text-[#FF5722] shrink-0" />
                    )}

                    {/* Name + ID */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") confirmRename();
                              if (e.key === "Escape") cancelRename();
                            }}
                            className="h-7 px-2 text-sm rounded-md border border-border bg-background text-foreground w-48 focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                          />
                          <button
                            onClick={confirmRename}
                            className="text-emerald-500 hover:text-emerald-600"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelRename}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate">
                            {c.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                            #{c.customer_id}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => startRename(c.customer_id, c.label)}
                          title="Renomear"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      {!isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-[#FF5722] hover:text-[#FF5722] hover:bg-[#FF5722]/10"
                          onClick={() => {
                            setCustomerId(c.customer_id);
                            toast.success(`Cliente ativo: ${c.label}`);
                          }}
                        >
                          Ativar
                        </Button>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-medium text-[#FF5722] px-2">
                          Ativo
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleRemove(c.customer_id)}
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expandedCustomer === c.customer_id && customerDetails && (
                    <div className="border-t border-border/30 px-6 py-4 bg-muted/5 space-y-3">
                      {customerDetails.menus.map((menu) => (
                        <div key={menu.menuSlug}>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {menu.menuLabel}
                          </p>
                          {menu.tabs.map((tab) => (
                            <div key={tab.tabSlug} className="ml-3 mt-1.5">
                              <p className="text-xs font-medium text-foreground/80">
                                {tab.tabLabel}
                              </p>
                              <div className="ml-3 mt-1 space-y-1">
                                {tab.charts.map((chart) => {
                                  const dims = Object.keys(chart.dimensions);
                                  const totalRecords = Object.values(
                                    chart.dimensions
                                  ).reduce(
                                    (a, d) =>
                                      a + (Array.isArray(d) ? d.length : 0),
                                    0
                                  );
                                  return (
                                    <div
                                      key={chart.chartSlug}
                                      className="flex items-center gap-2 text-[11px] text-muted-foreground"
                                    >
                                      <Database className="w-3 h-3" />
                                      <span className="text-foreground/70">
                                        {chart.chartLabel}
                                      </span>
                                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                                        {dims.length} dims · {totalRecords} reg
                                      </span>
                                      {chart.sql && (
                                        <FileText className="w-3 h-3 text-blue-400" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
