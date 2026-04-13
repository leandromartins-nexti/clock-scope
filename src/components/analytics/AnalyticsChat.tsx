import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, FileDown, Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  pdfUrl?: string;
  pdfFileName?: string;
}

const WELCOME_MSG: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Olá! Sou o assistente de dados do Analytics. Pergunte qualquer coisa sobre os indicadores da aba carregada — qualidade, absenteísmo, movimentações, coberturas e mais.\n\nVocê também pode pedir um **relatório em PDF** da aba atual.",
  timestamp: new Date(),
};

interface AnalyticsChatProps {
  activeTab?: string;
}

const tabLabels: Record<string, string> = {
  qualidade: "Qualidade do Ponto",
  absenteismo: "Absenteísmo",
  movimentacoes: "Movimentações",
  coberturas: "Coberturas e Continuidade",
  violacoes: "Violações Trabalhistas",
  bancoHoras: "Banco de Horas",
  operacoes: "Operações e Estruturas",
};

function isPdfRequest(text: string): boolean {
  const q = text.toLowerCase();
  return (
    q.includes("pdf") ||
    q.includes("relatório") ||
    q.includes("relatorio") ||
    q.includes("exportar") ||
    q.includes("exporta") ||
    q.includes("baixar") ||
    q.includes("download") ||
    q.includes("gerar documento") ||
    q.includes("gera documento") ||
    (q.includes("gerar") && q.includes("report")) ||
    (q.includes("gera") && q.includes("report"))
  );
}

async function generateTabPdf(tab: string): Promise<{ url: string; fileName: string }> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const tabName = tabLabels[tab] || tab;
  const now = new Date();
  const dateStr = `${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

  // Header bar
  doc.setFillColor(255, 87, 34);
  doc.rect(0, 0, pageW, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Nexti Analytics", 14, 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(dateStr, pageW - 14, 12, { align: "right" });

  // Tab title
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Relatório: ${tabName}`, 14, 30);
  doc.setDrawColor(255, 87, 34);
  doc.setLineWidth(0.5);
  doc.line(14, 33, pageW - 14, 33);

  let y = 42;

  // KPI section
  const kpis = getTabKpis(tab);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("Indicadores Principais", 14, y);
  y += 8;

  const kpiBoxW = (pageW - 28 - 12) / 4;
  kpis.forEach((kpi, i) => {
    const x = 14 + i * (kpiBoxW + 4);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(x, y, kpiBoxW, 22, 2, 2, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(kpi.label, x + 4, y + 7);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 33, 33);
    doc.text(kpi.value, x + 4, y + 17);
  });
  y += 30;

  // Table section
  const tableData = getTabTableData(tab);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text(tableData.title, 14, y);
  y += 4;

  (doc as any).autoTable({
    startY: y,
    head: [tableData.headers],
    body: tableData.rows,
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8, cellPadding: 3, textColor: [60, 60, 60] },
    headStyles: { fillColor: [255, 87, 34], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    alternateRowStyles: { fillColor: [252, 252, 252] },
    tableLineColor: [230, 230, 230],
    tableLineWidth: 0.2,
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Summary section
  const summaryLines = getTabSummary(tab);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("Análise Resumida", 14, y);
  y += 6;
  doc.setFillColor(255, 248, 240);
  doc.roundedRect(14, y, pageW - 28, summaryLines.length * 6 + 8, 2, 2, "F");
  doc.setDrawColor(255, 87, 34);
  doc.setLineWidth(0.3);
  doc.line(14, y, 14, y + summaryLines.length * 6 + 8);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  summaryLines.forEach((line, i) => {
    doc.text(`• ${line}`, 20, y + 6 + i * 6);
  });

  // Footer
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text("Gerado automaticamente pelo Nexti Analytics AI", 14, pageH - 8);
  doc.text(`Página 1 de 1`, pageW - 14, pageH - 8, { align: "right" });

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const fileName = `analytics-${tab}-${now.toISOString().slice(0, 10)}.pdf`;
  return { url, fileName };
}

function getTabKpis(tab: string): { label: string; value: string }[] {
  switch (tab) {
    case "qualidade":
      return [
        { label: "Score Geral", value: "71" },
        { label: "Marcações", value: "245K" },
        { label: "Justificadas", value: "1.318" },
        { label: "Tempo Médio", value: "6 dias" },
      ];
    case "absenteismo":
      return [
        { label: "Taxa Absenteísmo", value: "4,2%" },
        { label: "Horas Ausência", value: "12.480" },
        { label: "Cobertura", value: "91,3%" },
        { label: "Horas Descobertas", value: "2.400" },
      ];
    case "movimentacoes":
      return [
        { label: "Admissões", value: "156" },
        { label: "Demissões", value: "89" },
        { label: "Saldo", value: "+67" },
        { label: "Turnover", value: "3,8%" },
      ];
    default:
      return [
        { label: "Indicador 1", value: "85%" },
        { label: "Indicador 2", value: "1.240" },
        { label: "Indicador 3", value: "92%" },
        { label: "Indicador 4", value: "340" },
      ];
  }
}

function getTabTableData(tab: string): { title: string; headers: string[]; rows: string[][] } {
  switch (tab) {
    case "qualidade":
      return {
        title: "Ranking por Operação",
        headers: ["Operação", "Score", "Marcações", "Justificadas", "Tempo Médio"],
        rows: [
          ["SEG", "89", "82.000", "210", "3 dias"],
          ["POR", "78", "95.000", "480", "5 dias"],
          ["ADM", "72", "45.000", "320", "7 dias"],
          ["LOG", "65", "18.000", "198", "9 dias"],
          ["TER", "50", "12.000", "110", "12 dias"],
        ],
      };
    case "absenteismo":
      return {
        title: "Absenteísmo por Operação",
        headers: ["Operação", "Taxa", "Horas Ausência", "Cobertura", "Horas Descobertas"],
        rows: [
          ["TER", "6,8%", "3.200", "82%", "576"],
          ["LOG", "5,1%", "2.800", "88%", "336"],
          ["ADM", "4,0%", "2.480", "93%", "174"],
          ["POR", "3,5%", "2.400", "95%", "120"],
          ["SEG", "2,8%", "1.600", "97%", "48"],
        ],
      };
    case "movimentacoes":
      return {
        title: "Movimentação por Operação",
        headers: ["Operação", "Admissões", "Demissões", "Saldo", "Turnover"],
        rows: [
          ["POR", "70", "22", "+48", "2,1%"],
          ["SEG", "35", "18", "+17", "3,2%"],
          ["ADM", "25", "20", "+5", "4,5%"],
          ["LOG", "16", "15", "+1", "5,0%"],
          ["TER", "10", "14", "-4", "6,2%"],
        ],
      };
    default:
      return {
        title: "Dados Consolidados",
        headers: ["Operação", "Indicador 1", "Indicador 2", "Status"],
        rows: [
          ["SEG", "92%", "1.200", "Normal"],
          ["POR", "88%", "980", "Normal"],
          ["ADM", "75%", "640", "Atenção"],
          ["LOG", "68%", "420", "Risco"],
          ["TER", "52%", "180", "Crítico"],
        ],
      };
  }
}

function getTabSummary(tab: string): string[] {
  switch (tab) {
    case "qualidade":
      return [
        "SEG lidera com score 89, demonstrando maturidade operacional.",
        "TER opera abaixo do limite mínimo (50 vs 70) — ação corretiva necessária.",
        "Justificadas em queda: de 8.000/mês para 1.318 nos últimos 6 meses.",
        "Tempo médio de tratativa em 6 dias — melhor operação (SEG) em 3 dias.",
      ];
    case "absenteismo":
      return [
        "TER apresenta maior taxa de absenteísmo (6,8%), bem acima da média (4,2%).",
        "Atestados médicos são a causa principal (42%), seguidos por faltas (28%).",
        "Cobertura geral em 91,3% — 2.400h permanecem sem cobertura.",
        "SEG tem melhor performance com apenas 2,8% de absenteísmo.",
      ];
    case "movimentacoes":
      return [
        "Saldo positivo de +67 no período, puxado pela POR (+48 sozinha).",
        "TER é a única operação com saldo negativo (-4) — possível ponto de atenção.",
        "POR concentrou 45% das admissões — provável entrada de novo contrato.",
        "Turnover geral em 3,8%, com TER em 6,2% (maior do grupo).",
      ];
    default:
      return [
        "Os indicadores estão dentro dos parâmetros esperados para o período.",
        "Recomenda-se atenção às operações com status 'Risco' e 'Crítico'.",
        "Análise detalhada disponível ao navegar pelas sub-abas do operacional.",
      ];
  }
}

export default function AnalyticsChat({ activeTab }: AnalyticsChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (isPdfRequest(text)) {
      setIsGeneratingPdf(true);
      setTimeout(async () => {
        try {
          const tab = activeTab || "qualidade";
          const { url, fileName } = await generateTabPdf(tab);
          const botMsg: ChatMessage = {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: `Relatório de **${tabLabels[tab] || tab}** gerado com sucesso! Clique no botão abaixo para baixar.`,
            timestamp: new Date(),
            pdfUrl: url,
            pdfFileName: fileName,
          };
          setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
          const botMsg: ChatMessage = {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: "Desculpe, houve um erro ao gerar o relatório. Tente novamente.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMsg]);
        } finally {
          setIsTyping(false);
          setIsGeneratingPdf(false);
        }
      }, 800);
    } else {
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: getMockResponse(text, activeTab),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 1200);
    }
  }, [input, activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <MessageCircle size={18} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Pergunte ao AI sobre os dados</TooltipContent>
      </Tooltip>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="p-0 w-[480px] max-w-full flex flex-col [&>button]:hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#FF5722] flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">Analytics AI</span>
                  {activeTab && (
                    <span className="text-[10px] text-muted-foreground ml-2">
                      contexto: {tabLabels[activeTab] || activeTab}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === "assistant" ? "bg-[#FF5722]" : "bg-slate-200"
                }`}>
                  {msg.role === "assistant" ? (
                    <Bot size={12} className="text-white" />
                  ) : (
                    <User size={12} className="text-slate-500" />
                  )}
                </div>
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-slate-100 text-foreground border border-slate-200"
                        : "bg-orange-50 text-foreground border border-orange-100"
                    }`}
                  >
                    {msg.content.split("**").map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                    )}
                  </div>
                  {msg.pdfUrl && msg.pdfFileName && (
                    <button
                      onClick={() => handleDownload(msg.pdfUrl!, msg.pdfFileName!)}
                      className="mt-2 inline-flex items-center gap-1.5 bg-[#FF5722] text-white text-[11px] font-medium px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <FileDown size={14} />
                      Baixar {msg.pdfFileName}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-[#FF5722] flex items-center justify-center shrink-0">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                  {isGeneratingPdf ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 size={12} className="animate-spin" />
                      Gerando relatório PDF...
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre os dados ou peça um PDF..."
                className="flex-1 text-sm bg-muted/30 border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#FF5722]/30 focus:border-[#FF5722]/50 placeholder:text-muted-foreground/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 rounded-lg bg-[#FF5722] text-white hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function getMockResponse(question: string, tab?: string): string {
  const q = question.toLowerCase();
  if (q.includes("absenteísmo") || q.includes("absenteismo") || q.includes("ausência")) {
    return "A taxa de absenteísmo geral está em 4,2% no período atual. A principal causa são atestados médicos (42%), seguidos por faltas não justificadas (28%). A operação TER apresenta o maior índice (6,8%), bem acima da média.";
  }
  if (q.includes("qualidade") || q.includes("score") || q.includes("ponto")) {
    return "O score geral de qualidade está em 71 pontos. A melhor operação é SEG com score 89, enquanto TER está com 50 — abaixo do limite mínimo de 70. O tempo médio de tratativa é de 6 dias.";
  }
  if (q.includes("movimentaç") || q.includes("admiss") || q.includes("demiss")) {
    return "No último mês, tivemos 156 admissões e 89 demissões, resultando em saldo positivo de +67. A operação POR concentrou 45% das admissões devido à entrada de um novo contrato.";
  }
  if (q.includes("cobertura")) {
    return "A taxa de cobertura atual é de 91,3%. As 8,7% de horas descobertas representam ~2.400h no período. A área com menor cobertura é Logística Norte (82%).";
  }
  return `Com base nos dados da aba ${tabLabels[tab || ""] || tab || "atual"}, posso informar que os indicadores estão dentro dos parâmetros esperados. Para uma análise mais específica, tente perguntar sobre absenteísmo, qualidade do ponto, movimentações ou coberturas.`;
}
