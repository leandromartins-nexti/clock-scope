import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableIcon, Code2, FileJson2, Copy, Check, Info } from "lucide-react";
import type { ChartDataSource } from "./ChartDataModal";

type GroupBy = "empresa" | "unidade" | "area";

interface SourceSection {
  label: string;
  source: ChartDataSource;
  columns: { key: string; label: string; format?: (v: any) => string }[];
}

interface CompositeChartDataModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  sections: SourceSection[];
  activeGroupBy?: GroupBy;
}

const GROUP_LABELS: Record<GroupBy, string> = {
  empresa: "Por Empresa",
  unidade: "Por Unidade de Negócio",
  area: "Por Área",
};

function highlightSQL(sql: string) {
  const keywords = /\b(WITH|AS|SELECT|FROM|JOIN|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|CROSS\s+JOIN|ON|WHERE|AND|OR|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|OFFSET|UNION\s+ALL|UNION|CASE|WHEN|THEN|ELSE|END|IN|IS|NOT|NULL|BETWEEN|EXISTS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|ROUND|COALESCE|NULLIF|DATE_FORMAT|LAST_DAY|DATE_ADD|INTERVAL|MONTH|DATEDIFF)\b/gi;
  const strings = /('[^']*')/g;
  let result = sql.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  result = result.replace(strings, '<span class="text-amber-600">$1</span>');
  result = result.replace(keywords, (match) => `<span class="text-blue-600 font-semibold">${match.toUpperCase()}</span>`);
  result = result.replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g, '<span class="text-purple-600">$1</span>');
  return result;
}

function SectionContent({ section, groupBy }: { section: SourceSection; groupBy: GroupBy }) {
  const [activeTab, setActiveTab] = useState<"dados" | "json" | "sql">("dados");
  const [copied, setCopied] = useState(false);

  const currentData = section.source[groupBy].data;
  const currentSQL = section.source[groupBy].sql;
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
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
      <div className="px-4 pt-3 pb-0 border-b border-border/40">
        <p className="text-xs font-semibold text-foreground mb-2">{section.label}</p>
        <div className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCopied(false); }}
              className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1 ${
                activeTab === tab.id ? "border-[#FF5722] text-[#FF5722]" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === "dados" && (
          <div className="overflow-auto max-h-[240px] border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {section.columns.map(col => (
                    <TableHead key={col.key} className="text-[10px] font-semibold whitespace-nowrap">{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row, i) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    {section.columns.map(col => (
                      <TableCell key={col.key} className="text-[10px] py-1.5 whitespace-nowrap">
                        {col.format ? col.format(row[col.key]) : (typeof row[col.key] === "number" ? row[col.key].toLocaleString("pt-BR") : row[col.key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {currentData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={section.columns.length} className="text-center text-muted-foreground py-6 text-xs">Nenhum dado disponível</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === "json" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">{currentData.length} registros · {GROUP_LABELS[groupBy]}</p>
              <button onClick={() => handleCopy(jsonStr)} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copiado!" : "Copiar JSON"}
              </button>
            </div>
            <pre className="bg-[#1e1e2e] border rounded-lg p-3 text-[10px] font-mono overflow-auto max-h-[200px] whitespace-pre-wrap leading-relaxed text-gray-200">
              {jsonStr}
            </pre>
          </div>
        )}

        {activeTab === "sql" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">Query SQL · {GROUP_LABELS[groupBy]}</p>
              <button onClick={() => handleCopy(currentSQL)} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copiado!" : "Copiar SQL"}
              </button>
            </div>
            <pre
              className="bg-[#fafafa] dark:bg-[#1e1e2e] border rounded-lg p-3 text-[11px] font-mono overflow-auto max-h-[200px] whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightSQL(currentSQL) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompositeChartDataModal({ open, onClose, title, subtitle, sections, activeGroupBy = "empresa" }: CompositeChartDataModalProps) {
  const [viewGroupBy, setViewGroupBy] = useState<GroupBy>(activeGroupBy);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-[75vw] max-h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </DialogHeader>

        {/* Info banner */}
        <div className="mx-5 mt-3 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Este gráfico não tem fonte de dados própria. Reaproveita os dados dos gráficos abaixo para criar uma visão consolidada das operações nos 4 quadrantes.
          </p>
        </div>

        {/* Shared group-by selector */}
        <div className="px-5 pt-3">
          <div className="flex gap-1.5">
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
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-auto px-5 py-4 space-y-4 min-h-0">
          {sections.map((section, i) => (
            <SectionContent key={i} section={section} groupBy={viewGroupBy} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
