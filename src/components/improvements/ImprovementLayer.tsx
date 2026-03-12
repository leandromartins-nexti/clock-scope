import { useState, useCallback, useRef, ReactNode } from "react";
import { useImprovement } from "@/contexts/ImprovementContext";
import { ImprovementPin } from "./ImprovementPin";
import { Send, X, MessageSquareMore } from "lucide-react";
import { useLocation } from "react-router-dom";

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  scrollY: number;
}

interface FormState {
  visible: boolean;
  x: number;
  y: number;
  scrollY: number;
}

interface ImprovementLayerProps {
  children: ReactNode;
  screenId?: string;
}

export function ImprovementLayer({ children, screenId }: ImprovementLayerProps) {
  const { items, addItem, updatePosition, showPins } = useImprovement();
  const location = useLocation();
  const currentRoute = screenId ? `${location.pathname}#${screenId}` : location.pathname;
  const containerRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false, x: 0, y: 0, scrollY: 0,
  });
  const [form, setForm] = useState<FormState>({
    visible: false, x: 0, y: 0, scrollY: 0,
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setContextMenu({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top + container.scrollTop,
      scrollY: container.scrollTop,
    });
  }, []);

  const handleAddPin = () => {
    setForm({
      visible: true,
      x: contextMenu.x,
      y: contextMenu.y,
      scrollY: contextMenu.scrollY,
    });
    setContextMenu({ ...contextMenu, visible: false });
    setTitle("");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const container = containerRef.current;
    if (!container) return;

    const xPct = (form.x / container.scrollWidth) * 100;

    addItem({
      title: title.trim(),
      description: description.trim(),
      position: {
        x: xPct,
        y: form.y,
        route: currentRoute,
      },
    });
    setForm({ visible: false, x: 0, y: 0, scrollY: 0 });
  };

  const handleDragEnd = useCallback((itemId: string, currentX: number, currentY: number) => {
    return (deltaX: number, deltaY: number) => {
      const container = containerRef.current;
      if (!container) return;

      const newXPx = (currentX / 100) * container.scrollWidth + deltaX;
      const newYPx = currentY + deltaY;

      const newXPct = (newXPx / container.scrollWidth) * 100;

      updatePosition(itemId, newXPct, newYPx);
    };
  }, [updatePosition]);

  const floatingPins = items.filter(
    (item) => item.position && item.position.route === currentRoute
  );

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-auto"
      onContextMenu={handleContextMenu}
      onClick={() => {
        if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
      }}
    >
      {children}

      {/* Floating pins */}
      {showPins &&
        floatingPins.map((item) => (
          <div
            key={item.id}
            className="absolute z-30"
            style={{
              left: `${item.position!.x}%`,
              top: `${item.position!.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <ImprovementPin
              itemId={item.id}
              onDragEnd={handleDragEnd(item.id, item.position!.x, item.position!.y)}
            />
          </div>
        ))}

      {/* Context menu */}
      {contextMenu.visible && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setContextMenu({ ...contextMenu, visible: false })}
          />
          <div
            className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <button
              onClick={handleAddPin}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF5722] transition-colors"
            >
              <MessageSquareMore className="w-4 h-4" />
              Adicionar comentário aqui
            </button>
          </div>
        </>
      )}

      {/* New comment form */}
      {form.visible && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/10"
            onClick={() => setForm({ visible: false, x: 0, y: 0, scrollY: 0 })}
          />
          <div
            className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-[320px] overflow-hidden"
            style={{
              left: Math.min(form.x, (containerRef.current?.clientWidth || 800) - 340),
              top: form.y,
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareMore className="w-4 h-4 text-[#FF5722]" />
                <h4 className="font-bold text-sm text-gray-800">Novo Comentário</h4>
              </div>
              <button
                onClick={() => setForm({ visible: false, x: 0, y: 0, scrollY: 0 })}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase mb-1 block">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && description && handleSubmit()}
                  placeholder="Ex: Melhorar legibilidade do gráfico"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-300"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase mb-1 block">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o comentário..."
                  rows={3}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-300 resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!title.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#FF5722] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#E64A19] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                Criar Comentário
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
