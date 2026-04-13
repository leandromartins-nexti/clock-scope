import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MSG: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Olá! Sou o assistente de dados do Analytics. Pergunte qualquer coisa sobre os indicadores da aba carregada — qualidade, absenteísmo, movimentações, coberturas e mais.",
  timestamp: new Date(),
};

interface AnalyticsChatProps {
  activeTab?: string;
}

export default function AnalyticsChat({ activeTab }: AnalyticsChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
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

    // Simulated response (UI-only)
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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
                      contexto: {activeTab}
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
                  msg.role === "assistant" ? "bg-[#FF5722]" : "bg-muted"
                }`}>
                  {msg.role === "assistant" ? (
                    <Bot size={12} className="text-white" />
                  ) : (
                    <User size={12} className="text-muted-foreground" />
                  )}
                </div>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-muted text-foreground"
                      : "bg-orange-50 text-foreground border border-orange-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-[#FF5722] flex items-center justify-center shrink-0">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="bg-muted/50 border border-border rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
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
                placeholder="Pergunte sobre os dados..."
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
  return `Com base nos dados da aba ${tab || "atual"}, posso informar que os indicadores estão dentro dos parâmetros esperados. Para uma análise mais específica, tente perguntar sobre absenteísmo, qualidade do ponto, movimentações ou coberturas.`;
}
