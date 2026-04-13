import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, TableIcon } from "lucide-react";

interface ChartDataModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>[];
  columns: { key: string; label: string; format?: (v: any) => string }[];
  sqlQuery: string;
}

export default function ChartDataModal({ open, onClose, title, data, columns, sqlQuery }: ChartDataModalProps) {
  const [activeTab, setActiveTab] = useState<"dados" | "sql">("dados");

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-[70vw] max-h-[70vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-4 px-5 pt-3 border-b border-border">
          <button
            onClick={() => setActiveTab("dados")}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "dados" ? "border-[#FF5722] text-[#FF5722]" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Dados Tabulados
          </button>
          <button
            onClick={() => setActiveTab("sql")}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "sql" ? "border-[#FF5722] text-[#FF5722]" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Select no Banco
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-5 py-4 min-h-0">
          {activeTab === "dados" ? (
            <div className="overflow-auto max-h-[calc(70vh-140px)] border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {columns.map(col => (
                      <TableHead key={col.key} className="text-xs font-semibold whitespace-nowrap">{col.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={i} className="hover:bg-muted/30">
                      {columns.map(col => (
                        <TableCell key={col.key} className="text-xs py-2 whitespace-nowrap">
                          {col.format ? col.format(row[col.key]) : row[col.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8 text-sm">
                        Nenhum dado disponível
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Query SQL utilizada para extrair os dados deste gráfico:</p>
              <pre className="bg-muted/50 border rounded-lg p-4 text-xs font-mono overflow-auto max-h-[calc(70vh-180px)] whitespace-pre-wrap leading-relaxed text-foreground">
                {sqlQuery}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
