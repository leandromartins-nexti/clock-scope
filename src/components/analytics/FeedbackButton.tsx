import { useState } from "react";
import { MessageSquare, X, Lightbulb, Bug, BarChartHorizontal, ThumbsUp, CheckCircle } from "lucide-react";
import { toast } from "sonner";

type FeedbackType = "sugestao" | "problema" | "dado_incorreto" | "elogio" | null;

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<FeedbackType>(null);
  const [satisfacao, setSatisfacao] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [indicador, setIndicador] = useState("");
  const [valorEsperado, setValorEsperado] = useState("");
  const [page, setPage] = useState("Resumo Executivo");

  const handleSubmit = () => {
    console.log({ tipo, page, satisfacao, comment, indicador, valorEsperado, timestamp: Date.now() });
    toast.success("Feedback enviado! Obrigado por nos ajudar a melhorar.");
    setOpen(false);
    setTipo(null);
    setSatisfacao(null);
    setComment("");
    setIndicador("");
    setValorEsperado("");
  };

  const tipos: { key: FeedbackType; label: string; icon: React.ElementType }[] = [
    { key: "sugestao", label: "Sugestão", icon: Lightbulb },
    { key: "problema", label: "Problema", icon: Bug },
    { key: "dado_incorreto", label: "Dado incorreto", icon: BarChartHorizontal },
    { key: "elogio", label: "Elogio", icon: ThumbsUp },
  ];

  return (
    <>
      <button
        data-onboarding="feedback-button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#FF5722] text-white pl-4 pr-5 py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 text-sm font-medium"
      >
        <MessageSquare size={16} />
        Feedback
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 z-50 w-[360px] bg-white shadow-2xl overflow-y-auto">
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">Feedback</h3>
                <button onClick={() => setOpen(false)}>
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
                onClick={handleSubmit}
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
