import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, TableIcon, Code2, FileJson2, Copy, Check } from "lucide-react";

type GroupBy = "empresa" | "unidade" | "area";

export interface ChartDataSource {
  empresa: { data: Record<string, any>[]; sql: string };
  unidade: { data: Record<string, any>[]; sql: string };
  area: { data: Record<string, any>[]; sql: string };
}

interface ChartDataModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Legacy flat mode */
  data?: Record<string, any>[];
  columns: { key: string; label: string; format?: (v: any) => string }[];
  /** Legacy flat SQL */
  sqlQuery?: string;
  /** New: segmented data source by operation type */
  source?: ChartDataSource;
  /** Current active groupBy from parent */
  activeGroupBy?: GroupBy;
}

const GROUP_LABELS: Record<GroupBy, string> = {
  empresa: "Por Empresa",
  unidade: "Por Unidade de Negócio",
  area: "Por Área",
};

// Simple SQL syntax highlighter
function highlightSQL(sql: string) {
  const keywords = /\b(WITH|AS|SELECT|FROM|JOIN|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|CROSS\s+JOIN|ON|WHERE|AND|OR|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|OFFSET|UNION\s+ALL|UNION|CASE|WHEN|THEN|ELSE|END|IN|IS|NOT|NULL|BETWEEN|EXISTS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|ROUND|COALESCE|NULLIF|DATE_FORMAT|LAST_DAY|DATE_ADD|INTERVAL|MONTH|DATEDIFF)\b/gi;
  const strings = /('[^']*')/g;
  const numbers = /\b(\d+\.?\d*)\b/g;
  const aliases = /\bAS\s+(\w+)/gi;
  const comments = /(--[^\n]*)/g;

  let result = sql
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  result = result.replace(comments, '<span class="text-emerald-600 italic">$1</span>');
  result = result.replace(strings, '<span class="text-amber-600">$1</span>');
  result = result.replace(keywords, (match) => `<span class="text-blue-600 font-semibold">${match.toUpperCase()}</span>`);
  result = result.replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g, '<span class="text-purple-600">$1</span>');

  return result;
}

export default function ChartDataModal({ open, onClose, title, data, columns, sqlQuery, source, activeGroupBy = "empresa" }: ChartDataModalProps) {
  const [activeTab, setActiveTab] = useState<"dados" | "json" | "sql">("dados");
  const [viewGroupBy, setViewGroupBy] = useState<GroupBy>(activeGroupBy);
  const [copied, setCopied] = useState(false);

  // Sync viewGroupBy when modal opens
  const effectiveGroupBy = source ? viewGroupBy : activeGroupBy;

  const currentData = useMemo(() => {
    if (source) return source[viewGroupBy].data;
    return data ?? [];
  }, [source, viewGroupBy, data]);

  const currentSQL = useMemo(() => {
    if (source) return source[viewGroupBy].sql;
    return sqlQuery ?? "";
  }, [source, viewGroupBy, sqlQuery]);

  const jsonStr = useMemo(() => JSON.stringify(currentData, null, 2), [currentData]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "dados" as const, label: "Dados Tabulados", icon: TableIcon },
    { id: "json" as const, label: "Dados (JSON)", icon: FileJson2 },
    { id: "sql" as const, label: "Query SQL", icon: Code2 },
  ];

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-[75vw] max-h-[75vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
        </DialogHeader>

        {/* Group-by selector + tabs */}
        <div className="px-5 pt-3 border-b border-border">
          {source && (
            <div className="flex gap-1.5 mb-3">
              {(["empresa", "unidade", "area"] as GroupBy[]).map(g => (
                <button
                  key={g}
                  onClick={() => setViewGroupBy(g)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                    viewGroupBy === g
                      ? "bg-[#FF5722] text-white border-[#FF5722]"
                      : "bg-white text-muted-foreground border-border hover:border-[#FF5722]/40"
                  }`}
                >
                  {GROUP_LABELS[g]}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCopied(false); }}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id ? "border-[#FF5722] text-[#FF5722]" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-5 py-4 min-h-0">
          {activeTab === "dados" && (
            <div className="overflow-auto max-h-[calc(75vh-180px)] border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {columns.map(col => (
                      <TableHead key={col.key} className="text-xs font-semibold whitespace-nowrap">{col.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((row, i) => (
                    <TableRow key={i} className="hover:bg-muted/30">
                      {columns.map(col => (
                        <TableCell key={col.key} className="text-xs py-2 whitespace-nowrap">
                          {col.format ? col.format(row[col.key]) : (typeof row[col.key] === "number" ? row[col.key].toLocaleString("pt-BR") : row[col.key])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {currentData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8 text-sm">
                        Nenhum dado disponível
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "json" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{currentData.length} registros · Agrupamento: {GROUP_LABELS[effectiveGroupBy]}</p>
                <button
                  onClick={() => handleCopy(jsonStr)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado!" : "Copiar JSON"}
                </button>
              </div>
              <pre className="bg-[#1e1e2e] border rounded-lg p-4 text-xs font-mono overflow-auto max-h-[calc(75vh-200px)] whitespace-pre-wrap leading-relaxed text-gray-200">
                {jsonStr}
              </pre>
            </div>
          )}

          {activeTab === "sql" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Query SQL · Agrupamento: {GROUP_LABELS[effectiveGroupBy]}</p>
                <button
                  onClick={() => handleCopy(currentSQL)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado!" : "Copiar SQL"}
                </button>
              </div>
              <pre
                className="bg-[#fafafa] dark:bg-[#1e1e2e] border rounded-lg p-4 text-[13px] font-mono overflow-auto max-h-[calc(75vh-200px)] whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightSQL(currentSQL) }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
