/**
 * PeriodGranularityToggle
 * ------------------------------------------------------------------
 * Gmail-style segmented control to switch chart time granularity
 * between "Anual" (12 meses) and "Mensal" (dias do mês).
 *
 * Usage:
 *   <PeriodGranularityToggle value={mode} onChange={setMode} />
 *
 * Default mode is "anual" (mantém o comportamento atual dos gráficos).
 * Posicionado acima da GroupBySidebar nas abas operacionais.
 */
import { Calendar, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export type PeriodGranularity = "anual" | "mensal";

interface Props {
  value: PeriodGranularity;
  onChange: (v: PeriodGranularity) => void;
  className?: string;
}

const OPTIONS: { id: PeriodGranularity; label: string; icon: typeof Calendar }[] = [
  { id: "anual", label: "Anual", icon: Calendar },
  { id: "mensal", label: "Mensal", icon: CalendarDays },
];

export default function PeriodGranularityToggle({ value, onChange, className }: Props) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-white p-0.5 shadow-sm",
        className,
      )}
      role="tablist"
      aria-label="Granularidade do período"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-colors",
              active
                ? "bg-[#FF5722] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
