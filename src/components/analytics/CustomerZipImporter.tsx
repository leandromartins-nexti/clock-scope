// TODO: REMOVER EM PRODUÇÃO
// Importador de ZIP de dados de clientes para fase de testes.

import { useState, useCallback } from "react";
import JSZip from "jszip";
import { Upload, FileArchive, Check, AlertTriangle, Trash2, ChevronDown, ChevronRight, Database, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/contexts/CustomerContext";
import type { CustomerEntry } from "@/types/customer";
import { toast } from "sonner";

// ── Mapping from ZIP folder/file names to internal slugs ──

const DIMENSION_MAP: Record<string, string> = {
  "empresa": "empresa",
  "unidade de negócio": "unidade",
  "unidade de negocio": "unidade",
  "área": "area",
  "area": "area",
};

const CHART_SLUG_MAP: Record<string, string> = {
  "evolução da qualidade e headcount": "evolucao-qualidade-headcount",
  "evolucao da qualidade e headcount": "evolucao-qualidade-headcount",
  "evolução do tempo de tratativa": "evolucao-tempo-tratativa",
  "evolucao do tempo de tratativa": "evolucao-tempo-tratativa",
  "matriz de saúde operacional": "matriz-de-saude-operacional",
  "matriz de saude operacional": "matriz-de-saude-operacional",
  "sobrecarga do back-office": "sobrecarga-backoffice",
  "sobrecarga do backoffice": "sobrecarga-backoffice",
};

const TAB_SLUG_MAP: Record<string, string> = {
  "qualidade do ponto": "qualidade-ponto",
};

const MENU_SLUG_MAP: Record<string, string> = {
  "operacional": "operacional",
  "resumo executivo": "resumo-executivo",
};

/** Normalize unicode combining chars and lowercase */
function norm(s: string): string {
  return s.normalize("NFC").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/** Parse root folder name like "642 - Vig Eyes" */
function parseRootFolder(name: string): { customerId: number; label: string } | null {
  const match = name.match(/^(\d+)\s*-\s*(.+)$/);
  if (!match) return null;
  return { customerId: parseInt(match[1], 10), label: match[2].trim() };
}

/** Parse chart folder name like "1. Evolução da Qualidade e Headcount" */
function parseChartFolder(name: string): { index: number; chartSlug: string; chartLabel: string } | null {
  const match = name.match(/^(\d+)\.\s*(.+)$/);
  if (!match) return null;
  const label = match[2].trim();
  const slug = CHART_SLUG_MAP[norm(label)];
  if (!slug) return null;
  return { index: parseInt(match[1], 10), chartSlug: slug, chartLabel: label };
}

/** Parse JSON filename like "JSON Evolução da Qualidade e Headcount Por Empresa.json" */
function parseDimensionFromFilename(filename: string): string | null {
  const normed = norm(filename);
  // Try to find a known dimension key anywhere after "por "
  const porIdx = normed.lastIndexOf("por ");
  if (porIdx < 0) return null;
  const afterPor = normed.slice(porIdx + 4).replace(/\.json$/, "").trim();
  // Check each known dimension key — longest match first to avoid partial hits
  const keys = Object.keys(DIMENSION_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (afterPor.startsWith(key)) return DIMENSION_MAP[key];
  }
  return null;
}

function normalizeImportedJsonData(value: unknown): any {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return value;

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 1) {
    const [, nested] = entries[0];
    if (Array.isArray(nested)) return nested;
  }

  if ("data" in (value as Record<string, unknown>) && Array.isArray((value as Record<string, unknown>).data)) {
    return (value as Record<string, unknown>).data;
  }

  return value;
}

export interface ImportedChart {
  chartSlug: string;
  chartLabel: string;
  index: number;
  sql?: string;
  dimensions: Record<string, any[]>; // empresa/unidade/area → JSON data
}

export interface ImportedTab {
  tabSlug: string;
  tabLabel: string;
  charts: ImportedChart[];
}

export interface ImportedCustomer {
  customerId: number;
  label: string;
  menus: {
    menuSlug: string;
    menuLabel: string;
    tabs: ImportedTab[];
  }[];
}

const STORAGE_KEY_PREFIX = "nexti_customer_data_";
const STORAGE_INDEX_KEY = "nexti_imported_customers";

/** Save imported customer data to localStorage */
export function saveCustomerToStorage(customer: ImportedCustomer) {
  const dataStr = JSON.stringify(customer);
  const dataSizeKB = Math.round(dataStr.length / 1024);

  // Save data — catch quota errors
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${customer.customerId}`,
      dataStr
    );
  } catch (e: any) {
    console.error(`[CustomerZipImporter] Falha ao salvar dados (${dataSizeKB} KB):`, e);
    throw new Error(
      `Dados muito grandes para o armazenamento local (${dataSizeKB} KB). ` +
      `O limite do navegador é ~5 MB. Tente reduzir os datasets do ZIP.`
    );
  }

  // Update index
  const index = getImportedCustomersIndex();
  const existing = index.findIndex(c => c.customer_id === customer.customerId);
  const entry: CustomerEntry = {
    customer_id: customer.customerId,
    label: customer.label,
    tabs_available: customer.menus.flatMap(m => m.tabs.map(t => t.tabSlug)),
  };
  if (existing >= 0) {
    index[existing] = entry;
  } else {
    index.push(entry);
  }
  localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
  console.log(`[CustomerZipImporter] Cliente ${customer.customerId} salvo com sucesso (${dataSizeKB} KB)`);
}

/** Get list of imported customers from localStorage */
export function getImportedCustomersIndex(): CustomerEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Load full customer data from localStorage */
export function loadCustomerFromStorage(customerId: number): ImportedCustomer | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${customerId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Load specific chart data from localStorage */
export function loadChartDataFromStorage(
  customerId: number,
  tabSlug: string,
  chartSlug: string,
  dimension: string
): any[] | null {
  const customer = loadCustomerFromStorage(customerId);
  if (!customer) return null;

  for (const menu of customer.menus) {
    for (const tab of menu.tabs) {
      if (tab.tabSlug !== tabSlug) continue;
      for (const chart of tab.charts) {
        if (chart.chartSlug !== chartSlug) continue;
        return normalizeImportedJsonData(chart.dimensions[dimension] ?? null);
      }
    }
  }
  return null;
}

/** Remove imported customer from localStorage */
export function removeCustomerFromStorage(customerId: number) {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${customerId}`);
  const index = getImportedCustomersIndex().filter(c => c.customer_id !== customerId);
  localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
}

/** Parse a ZIP file and extract customer data */
export async function parseCustomerZip(file: File): Promise<ImportedCustomer> {
  const zip = await JSZip.loadAsync(file);
  const paths = Object.keys(zip.files).filter(
    p => !p.startsWith("__MACOSX") && !p.endsWith(".DS_Store") && !zip.files[p].dir
  );

  // Find root folder
  const allParts = paths.map(p => p.split("/"));
  const rootName = allParts[0]?.[0] ?? "";
  const parsed = parseRootFolder(rootName);
  if (!parsed) throw new Error(`Pasta raiz inválida: "${rootName}". Esperado formato "ID - Nome" (ex: "642 - Vig Eyes")`);

  const { customerId, label } = parsed;

  // Build menu → tab → chart → files tree
  const menusMap = new Map<string, { label: string; tabs: Map<string, { label: string; charts: Map<string, ImportedChart> }> }>();

  for (const path of paths) {
    const parts = path.split("/").filter(Boolean);
    // Expected: root / menu / tab / chart / file
    if (parts.length < 5) continue;

    const [, menuPart, tabPart, chartPart, fileName] = parts;
    const menuSlug = MENU_SLUG_MAP[norm(menuPart)] ?? norm(menuPart).replace(/\s+/g, "-");
    const tabSlug = TAB_SLUG_MAP[norm(tabPart)] ?? norm(tabPart).replace(/\s+/g, "-");
    const chartInfo = parseChartFolder(chartPart);
    if (!chartInfo) continue;

    // Get or create menu
    if (!menusMap.has(menuSlug)) {
      menusMap.set(menuSlug, { label: menuPart, tabs: new Map() });
    }
    const menu = menusMap.get(menuSlug)!;

    // Get or create tab
    if (!menu.tabs.has(tabSlug)) {
      menu.tabs.set(tabSlug, { label: tabPart, charts: new Map() });
    }
    const tab = menu.tabs.get(tabSlug)!;

    // Get or create chart
    if (!tab.charts.has(chartInfo.chartSlug)) {
      tab.charts.set(chartInfo.chartSlug, {
        chartSlug: chartInfo.chartSlug,
        chartLabel: chartInfo.chartLabel,
        index: chartInfo.index,
        dimensions: {},
      });
    }
    const chart = tab.charts.get(chartInfo.chartSlug)!;

    // Parse file content
    const zipFile = zip.files[path];
    if (fileName.endsWith(".sql")) {
      chart.sql = await zipFile.async("string");
    } else if (fileName.endsWith(".json")) {
      const dimension = parseDimensionFromFilename(fileName);
      if (dimension) {
        try {
          const content = await zipFile.async("string");
          chart.dimensions[dimension] = normalizeImportedJsonData(JSON.parse(content));
        } catch (e) {
          console.warn(`Failed to parse JSON: ${path}`, e);
        }
      }
    }
  }

  // Convert maps to arrays
  const menus = Array.from(menusMap.entries()).map(([menuSlug, menu]) => ({
    menuSlug,
    menuLabel: menu.label,
    tabs: Array.from(menu.tabs.entries()).map(([tabSlug, tab]) => ({
      tabSlug,
      tabLabel: tab.label,
      charts: Array.from(tab.charts.values()).sort((a, b) => a.index - b.index),
    })),
  }));

  return { customerId, label, menus };
}

// ── UI Component ──

export default function CustomerZipImporter() {
  const { refreshCustomers } = useCustomer();
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".zip")) {
      toast.error("Arquivo deve ser .zip");
      return;
    }

    setImporting(true);
    setLastResult(null);

    try {
      const customer = await parseCustomerZip(file);

      const totalJsons = customer.menus.reduce((acc, m) =>
        acc + m.tabs.reduce((a, t) =>
          a + t.charts.reduce((c, ch) => c + Object.keys(ch.dimensions).length, 0), 0), 0);

      saveCustomerToStorage(customer);
      refreshCustomers();

      setLastResult({
        success: true,
        message: `Cliente ${customer.customerId} (${customer.label}) importado · ${totalJsons} datasets`,
      });

      toast.success(`Cliente ${customer.label} importado!`);
    } catch (e: any) {
      setLastResult({ success: false, message: e.message || "Erro ao processar ZIP" });
      toast.error("Erro na importação");
    } finally {
      setImporting(false);
    }
  }, [refreshCustomers]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-[#FF5722] bg-[#FF5722]/5"
            : "border-border hover:border-muted-foreground/40 hover:bg-muted/20"
        }`}
        onClick={() => document.getElementById("zip-input")?.click()}
      >
        <input
          id="zip-input"
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center gap-3">
          {importing ? (
            <>
              <div className="w-8 h-8 border-2 border-[#FF5722] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Processando ZIP...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Arraste um ZIP aqui ou clique para selecionar</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Formato: <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">ID – Nome / Menu / Aba / N. Gráfico / arquivos</code>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Result */}
      {lastResult && (
        <div className={`flex items-start gap-2 px-4 py-3 rounded-lg text-sm ${
          lastResult.success
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {lastResult.success ? <Check className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
          <span>{lastResult.message}</span>
        </div>
      )}

      {/* Template info (collapsible) */}
      <details className="group">
        <summary className="text-[11px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none">
          Ver estrutura esperada do ZIP
        </summary>
        <div className="mt-2 bg-muted/30 border border-border/40 rounded-lg px-4 py-3">
          <pre className="text-[10px] text-muted-foreground leading-relaxed font-mono">{`{ID} – {Nome do Cliente}/
  {Menu}/                              (ex: Operacional)
    {Aba}/                             (ex: Qualidade do Ponto)
      {N}. {Nome do Gráfico}/          (ex: 1. Evolução da Qualidade e Headcount)
        {slug}.sql                     (query de referência)
        JSON {Nome} Por Empresa.json
        JSON {Nome} Por Unidade de Negócio.json
        JSON {Nome} Por Área.json`}</pre>
        </div>
      </details>
    </div>
  );
}
