import { useState, useCallback, useRef } from "react";
import { useImprovement, ImprovementStatus } from "@/contexts/ImprovementContext";
import { MessageSquareMore, CheckCircle2, XCircle, Send } from "lucide-react";

const statusColors: Record<ImprovementStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-amber-400", text: "text-white" },
  resolved: { bg: "bg-emerald-400", text: "text-white" },
  cancelled: { bg: "bg-gray-400", text: "text-white" },
};

const statusLabels: Record<ImprovementStatus, string> = {
  pending: "Pendente",
  resolved: "Resolvido",
  cancelled: "Cancelado",
};

interface ImprovementPinProps {
  itemId: string;
  className?: string;
  onDragEnd?: (deltaX: number, deltaY: number) => void;
}

export function ImprovementPin({ itemId, className = "", onDragEnd }: ImprovementPinProps) {
  const { items, addComment, setStatus, showPins } = useImprovement();
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const dragRef = useRef<{ startX: number; startY: number; dragging: boolean }>({ startX: 0, startY: 0, dragging: false });

  const item = items.find((i) => i.id === itemId);
  if (!item || !showPins) return null;

  const colors = statusColors[item.status];

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, dragging: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (d.startX === 0 && d.startY === 0) return;
    const dx = Math.abs(e.clientX - d.startX);
    const dy = Math.abs(e.clientY - d.startY);
    if (dx > 4 || dy > 4) {
      d.dragging = true;
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (d.dragging && onDragEnd) {
      onDragEnd(e.clientX - d.startX, e.clientY - d.startY);
    } else if (!d.dragging) {
      setOpen((prev) => !prev);
    }
    dragRef.current = { startX: 0, startY: 0, dragging: false };
  }, [onDragEnd]);

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Comment bubble icon */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`${colors.bg} ${colors.text} rounded-full p-1.5 cursor-grab active:cursor-grabbing shadow-lg hover:scale-110 transition-transform z-10`}
        title="Comentário"
        style={{ touchAction: "none" }}
      >
        <MessageSquareMore className="w-4 h-4" />
      </div>

      {/* Popover */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-8 top-0 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                  <MessageSquareMore className="w-4 h-4 text-[#FF5722]" />
                  Comentário
                </h4>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.status === "pending" ? "bg-amber-100 text-amber-700" :
                  item.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {statusLabels[item.status]}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{item.title}</p>
            </div>

            {/* Description */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{item.description}</p>
            </div>

            {/* Status actions */}
            <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-semibold uppercase mr-1">Status:</span>
              <button
                onClick={() => setStatus(item.id, "resolved")}
                className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors ${
                  item.status === "resolved"
                    ? "bg-emerald-100 text-emerald-700 font-semibold"
                    : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" /> Resolvido
              </button>
              <button
                onClick={() => setStatus(item.id, "cancelled")}
                className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors ${
                  item.status === "cancelled"
                    ? "bg-gray-200 text-gray-700 font-semibold"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                <XCircle className="w-3 h-3" /> Cancelado
              </button>
              {item.status !== "pending" && (
                <button
                  onClick={() => setStatus(item.id, "pending")}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md text-gray-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  Reabrir
                </button>
              )}
            </div>

            {/* Comments */}
            <div className="px-4 py-3 max-h-40 overflow-y-auto">
              <div className="flex items-center gap-1 mb-2">
                <MessageSquareMore className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-semibold uppercase">
                  Respostas ({item.comments.length})
                </span>
              </div>
              {item.comments.length === 0 && (
                <p className="text-[11px] text-gray-400 italic">Nenhuma resposta ainda.</p>
              )}
              {item.comments.map((c) => (
                <div key={c.id} className="mb-2 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-gray-600">{c.author}</span>
                    <span className="text-[10px] text-gray-400">
                      {c.createdAt.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && commentText.trim()) {
                    addComment(item.id, commentText.trim());
                    setCommentText("");
                  }
                }}
                placeholder="Adicionar resposta..."
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-300"
              />
              <button
                onClick={() => {
                  if (commentText.trim()) {
                    addComment(item.id, commentText.trim());
                    setCommentText("");
                  }
                }}
                className="bg-[#FF5722] text-white p-2 rounded-lg hover:bg-[#E64A19] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
