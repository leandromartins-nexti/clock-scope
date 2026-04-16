import { useState, useRef, useEffect } from "react";
import { MessageSquare, Navigation, X, Lightbulb, Bug, BarChartHorizontal, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { resetOnboardingTour } from "@/components/onboarding/OnboardingTour";

type FeedbackType = "sugestao" | "problema" | "dado_incorreto" | "elogio" | null;


export function FloatingActionMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Feedback state
  const [tipo, setTipo] = useState<FeedbackType>(null);
  const [satisfacao, setSatisfacao] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [indicador, setIndicador] = useState("");
  const [valorEsperado, setValorEsperado] = useState("");
  const [page, setPage] = useState("Resumo Executivo");

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleFeedbackSubmit = () => {
    console.log({ tipo, page, satisfacao, comment, indicador, valorEsperado, timestamp: Date.now() });
    toast.success("Feedback enviado! Obrigado por nos ajudar a melhorar.");
    setFeedbackOpen(false);
    setMenuOpen(false);
    setTipo(null);
    setSatisfacao(null);
    setComment("");
    setIndicador("");
    setValorEsperado("");
  };

  const handleStartTour = () => {
    resetOnboardingTour();
    setMenuOpen(false);
    if (location.pathname !== "/analytics") {
      navigate("/analytics");
    }
  };

  const tipos: { key: FeedbackType; label: string; icon: React.ElementType }[] = [
    { key: "sugestao", label: "Sugestão", icon: Lightbulb },
    { key: "problema", label: "Problema", icon: Bug },
    { key: "dado_incorreto", label: "Dado incorreto", icon: BarChartHorizontal },
    { key: "elogio", label: "Elogio", icon: ThumbsUp },
  ];

  return (
    <>
      {/* FAB + popup menu */}
      <div ref={menuRef} className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Popup options */}
        {menuOpen && !feedbackOpen && (
          <div className="flex flex-col gap-2 animate-fade-in mb-1">
            <button
              onClick={handleStartTour}
              className="flex items-center gap-2.5 bg-white text-foreground pl-4 pr-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm font-medium border border-border"
            >
              <Navigation size={16} className="text-[#FF5722]" />
              Refazer tour guiado
            </button>
            <button
              onClick={() => { setFeedbackOpen(true); setMenuOpen(false); }}
              className="flex items-center gap-2.5 bg-white text-foreground pl-4 pr-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm font-medium border border-border"
              data-onboarding="feedback-button"
            >
              <MessageSquare size={16} className="text-[#FF5722]" />
              Enviar feedback
            </button>
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => { setMenuOpen(!menuOpen); if (feedbackOpen) setFeedbackOpen(false); }}
          className={cn(
            "w-14 h-14 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center",
            menuOpen || feedbackOpen
              ? "bg-white border border-border text-muted-foreground"
              : "bg-[#FF5722] text-white"
          )}
          aria-label="Menu de ações"
        >
          {menuOpen || feedbackOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </button>
      </div>

      {/* Feedback slide-over panel */}
      {feedbackOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setFeedbackOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 z-50 w-[360px] bg-white shadow-2xl overflow-y-auto animate-fade-in">
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">Feedback</h3>
                <button onClick={() => setFeedbackOpen(false)}>
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Tipo</p>
                <div className="grid grid-cols-2 gap-2">
                  {tipos.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTipo(t.key)}
                      className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition ${
                        tipo === t.key
                          ? "border-[#FF5722] bg-orange-50 text-[#FF5722]"
                          : "border-border hover:bg-gray-50"
                      }`}
                    >
                      <t.icon size={16} /> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Página</p>
                <select
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  className="w-full border border-border rounded-lg p-2.5 text-sm"
                >
                  <option>Resumo Executivo</option>
                  <option>Disciplina Operacional</option>
                  <option>Coberturas e Continuidade</option>
                  <option>Violações Trabalhistas</option>
                  <option>Operações e Estruturas</option>
                </select>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Satisfação</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSatisfacao(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        satisfacao === n
                          ? "bg-[#FF5722] text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">O que você gostaria de compartilhar?</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Descreva aqui..."
                  className="w-full border border-border rounded-lg p-3 text-sm resize-none h-24 focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] outline-none"
                />
              </div>

              {tipo === "dado_incorreto" && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Qual indicador parece incorreto?</p>
                    <input
                      value={indicador}
                      onChange={(e) => setIndicador(e.target.value)}
                      className="w-full border border-border rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Qual valor você esperava?</p>
                    <input
                      value={valorEsperado}
                      onChange={(e) => setValorEsperado(e.target.value)}
                      className="w-full border border-border rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleFeedbackSubmit}
                className="w-full bg-[#FF5722] text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                Enviar feedback
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
