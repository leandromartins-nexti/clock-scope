import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, FileDown, Loader2 } from "lucide-react";
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
  content:
    "Olá! Sou o assistente do Analytics. Pergunte sobre os indicadores da aba atual ou peça um **relatório PDF**.",
  timestamp: new Date(),
};

interface Props {
  activeTab?: string;
  groupBy?: "empresa" | "unidade" | "area";
}

const tabLabels: Record<string, string> = {
  qualidade: "Ponto",
  absenteismo: "Absenteísmo",
  turnover: "Turnover",
  movimentacoes: "Movimentações",
  coberturas: "Coberturas",
  insights: "Insights",
};

function isPdfRequest(text: string): boolean {
  const q = text.toLowerCase();
  return (
    q.includes("pdf") ||
    q.includes("relatório") ||
    q.includes("relatorio") ||
    q.includes("exportar") ||
    q.includes("baixar") ||
    q.includes("download")
  );
}

function getMockResponse(question: string, tab?: string): string {
  const q = question.toLowerCase();
  if (q.includes("absente")) return "Taxa de absenteísmo geral em 4,2%.";
  if (q.includes("qualidade") || q.includes("score") || q.includes("ponto"))
    return "Score geral de qualidade em 71 pontos.";
  if (q.includes("cobertura")) return "Taxa de cobertura atual: 91,3%.";
  return `Indicadores da aba ${tabLabels[tab || ""] || tab || "atual"} dentro dos parâmetros esperados.`;
}

export default function InlineAnalyticsChat({ activeTab, groupBy = "unidade" }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", content: text, timestamp: new Date() }]);
    setInput("");
    setIsTyping(true);

    if (isPdfRequest(text)) {
      setIsGeneratingPdf(true);
      try {
        const tab = activeTab || "qualidade";
        const { url, fileName } = await buildAnalyticsPdf(tab, groupBy);
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: `Relatório de **${tabLabels[tab] || tab}** gerado!`,
            timestamp: new Date(),
            pdfUrl: url,
            pdfFileName: fileName,
          },
        ]);
      } catch {
        setMessages((p) => [
          ...p,
          { id: `a-${Date.now()}`, role: "assistant", content: "Erro ao gerar PDF.", timestamp: new Date() },
        ]);
      } finally {
        setIsTyping(false);
        setIsGeneratingPdf(false);
      }
    } else {
      setTimeout(() => {
        setMessages((p) => [
          ...p,
          { id: `a-${Date.now()}`, role: "assistant", content: getMockResponse(text, activeTab), timestamp: new Date() },
        ]);
        setIsTyping(false);
      }, 800);
    }
  }, [input, activeTab, groupBy]);

  const handleDownload = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-1.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                msg.role === "assistant" ? "bg-[#FF5722]" : "bg-slate-200"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot size={10} className="text-white" />
              ) : (
                <User size={10} className="text-slate-500" />
              )}
            </div>
            <div className="max-w-[85%]">
              <div
                className={`rounded-md px-2 py-1.5 text-[11px] leading-relaxed ${
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
                  className="mt-1.5 inline-flex items-center gap-1 bg-[#FF5722] text-white text-[10px] font-medium px-2 py-1 rounded hover:opacity-90"
                >
                  <FileDown size={11} /> Baixar
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#FF5722] flex items-center justify-center shrink-0">
              <Bot size={10} className="text-white" />
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-md px-2 py-1.5">
              {isGeneratingPdf ? (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Loader2 size={10} className="animate-spin" /> Gerando PDF...
                </div>
              ) : (
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-muted-foreground/40 rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-border pt-2 mt-2">
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Pergunte ou peça um PDF..."
            className="flex-1 text-[11px] bg-muted/30 border border-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#FF5722]/30 placeholder:text-muted-foreground/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-1.5 rounded bg-[#FF5722] text-white hover:opacity-90 disabled:opacity-40"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
