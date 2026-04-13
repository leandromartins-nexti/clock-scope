import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, FileDown, Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buildAnalyticsPdf } from "@/lib/analyticsPdfBuilder";

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
  groupBy?: "empresa" | "unidade" | "area";
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

export default function AnalyticsChat({ activeTab, groupBy = "unidade" }: AnalyticsChatProps) {
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
          const { url, fileName } = await buildAnalyticsPdf(tab, groupBy);
          const groupLabel = groupBy === "empresa" ? "Empresa" : groupBy === "area" ? "Área" : "Unidade de Negócio";
          const botMsg: ChatMessage = {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: `Relatório completo de **${tabLabels[tab] || tab}** gerado com sucesso!\n\nAgrupamento: **${groupLabel}**\nInclui: KPIs, ranking, evolução mensal, composição de faixas, dispersão qualidade vs volume, e detalhe por operação.\n\nClique no botão abaixo para baixar.`,
            timestamp: new Date(),
            pdfUrl: url,
            pdfFileName: fileName,
          };
          setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
          console.error("PDF generation error:", err);
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
  }, [input, activeTab, groupBy]);

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
                      Gerando relatório PDF completo...
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
