import { useState } from "react";
import { useImprovement, ImprovementStatus } from "@/contexts/ImprovementContext";
import { Wrench, Eye, EyeOff, CheckCircle2, XCircle, Clock, MessageSquare, Send } from "lucide-react";

const statusColors: Record<ImprovementStatus, string> = {
  pending: "bg-amber-400",
  resolved: "bg-emerald-400",
  cancelled: "bg-gray-400",
};

const statusLabels: Record<ImprovementStatus, string> = {
  pending: "Pendente",
  resolved: "Resolvido",
  cancelled: "Cancelado",
};

const statusBadge: Record<ImprovementStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export function ImprovementCenter() {
  const { items, showPins, togglePins, addComment, setStatus } = useImprovement();
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

  const pendingCount = items.filter((i) => i.status === "pending").length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors relative"
      >
        <Wrench className="w-4 h-4" />
        Melhorias
        {pendingCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-[400px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#FF5722]" />
                  Central de Melhorias
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{items.length} itens registrados</p>
              </div>
              <button
                onClick={togglePins}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors"
              >
                {showPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPins ? "Ocultar Pins" : "Mostrar Pins"}
              </button>
            </div>

            {/* Stats */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3 h-3 text-amber-500" />
                <span className="text-gray-600">{items.filter(i => i.status === "pending").length} Pendentes</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-gray-600">{items.filter(i => i.status === "resolved").length} Resolvidos</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <XCircle className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{items.filter(i => i.status === "cancelled").length} Cancelados</span>
              </div>
            </div>

            {/* Items list */}
            <div className="max-h-[400px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full px-5 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-3 h-3 rounded-full ${statusColors[item.status]} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusBadge[item.status]}`}>
                          {statusLabels[item.status]}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {item.createdAt.toLocaleDateString("pt-BR")} · {item.comments.length} comentário(s)
                      </p>
                    </div>
                  </button>

                  {expandedId === item.id && (
                    <div className="px-5 pb-4">
                      <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed mb-3 bg-gray-50 p-3 rounded-lg">
                        {item.description}
                      </p>

                      {/* Status actions */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Alterar:</span>
                        {(["pending", "resolved", "cancelled"] as ImprovementStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => setStatus(item.id, s)}
                            className={`text-[11px] px-2 py-1 rounded-md transition-colors ${
                              item.status === s
                                ? `${statusBadge[s]} font-semibold`
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                          >
                            {statusLabels[s]}
                          </button>
                        ))}
                      </div>

                      {/* Comments */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">Comentários</span>
                        </div>
                        {item.comments.map((c) => (
                          <div key={c.id} className="p-2 bg-gray-50 rounded-lg">
                            <div className="flex justify-between mb-1">
                              <span className="text-[10px] font-semibold text-gray-600">{c.author}</span>
                              <span className="text-[10px] text-gray-400">{c.createdAt.toLocaleDateString("pt-BR")}</span>
                            </div>
                            <p className="text-[11px] text-gray-600">{c.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add comment */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentTexts[item.id] || ""}
                          onChange={(e) => setCommentTexts({ ...commentTexts, [item.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (commentTexts[item.id] || "").trim()) {
                              addComment(item.id, commentTexts[item.id].trim());
                              setCommentTexts({ ...commentTexts, [item.id]: "" });
                            }
                          }}
                          placeholder="Comentar..."
                          className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-300"
                        />
                        <button
                          onClick={() => {
                            if ((commentTexts[item.id] || "").trim()) {
                              addComment(item.id, commentTexts[item.id].trim());
                              setCommentTexts({ ...commentTexts, [item.id]: "" });
                            }
                          }}
                          className="bg-[#FF5722] text-white p-2 rounded-lg hover:bg-[#E64A19] transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
