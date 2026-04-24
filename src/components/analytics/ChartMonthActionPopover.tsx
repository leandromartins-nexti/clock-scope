/**
 * ChartMonthActionPopover
 * ------------------------------------------------------------------
 * Popover que aparece ao clicar em um mês de um gráfico, oferecendo:
 *  - Aplicar filtro: filtra o dashboard pelo mês selecionado
 *  - Carregar dados: troca a granularidade para "Mensal" e foca no mês
 *
 * Visual segue o padrão dos botões flutuantes (FloatingActionMenu):
 * cápsulas brancas com ícone laranja + label, sombra suave.
 */
import { Filter, CalendarDays, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface Props {
  /** Coordenadas (em pixels relativas ao viewport) onde ancorar o popover. */
  x: number;
  y: number;
  /** Label do mês selecionado (ex: "set/25"). Usado apenas para texto. */
  monthLabel: string;
  onApplyFilter: () => void;
  onLoadDaily: () => void;
  onClose: () => void;
}

export default function ChartMonthActionPopover({
  x,
  y,
  monthLabel,
  onApplyFilter,
  onLoadDaily,
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Aguarda 1 tick para evitar fechar pelo mesmo clique que abriu
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  // Clamp dentro do viewport
  const POPOVER_W = 220;
  const POPOVER_H = 150;
  const left = Math.min(Math.max(8, x), window.innerWidth - POPOVER_W - 8);
  const top = Math.min(Math.max(8, y), window.innerHeight - POPOVER_H - 8);

  return (
    <div
      ref={ref}
      className="fixed z-[60] flex flex-col gap-2 animate-fade-in"
      style={{ left, top }}
    >
      <div className="flex items-center justify-between bg-white rounded-full shadow-lg border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground">
        <span>Mês: <span className="text-foreground font-semibold">{monthLabel}</span></span>
        <button onClick={onClose} className="ml-2 hover:text-foreground" aria-label="Fechar">
          <X size={12} />
        </button>
      </div>
      <button
        onClick={onApplyFilter}
        className="flex items-center gap-2.5 bg-white text-foreground pl-4 pr-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm font-medium border border-border"
      >
        <Filter size={16} className="text-[#FF5722]" />
        Aplicar filtro
      </button>
      <button
        onClick={onLoadDaily}
        className="flex items-center gap-2.5 bg-white text-foreground pl-4 pr-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm font-medium border border-border"
      >
        <CalendarDays size={16} className="text-[#FF5722]" />
        Carregar dados
      </button>
    </div>
  );
}
