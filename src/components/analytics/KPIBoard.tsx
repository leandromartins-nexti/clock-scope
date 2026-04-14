import { ReactNode } from "react";
import InfoTip from "./InfoTip";

/**
 * ScoreBoard — the gauge card (first card in the 5-card header).
 */
export function ScoreBoard({
  title,
  tooltip,
  children,
}: {
  title: string;
  tooltip: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-1 mb-1">
        <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
          {title}
        </p>
        <InfoTip text={tooltip} />
      </div>
      {children}
    </div>
  );
}

/**
 * KPIBoard — a big-number card with title, value, subtitle, and optional icon.
 */
export function KPIBoard({
  title,
  tooltip,
  value,
  valueColor = "text-foreground",
  subtitle,
  icon,
}: {
  title: string;
  tooltip: string;
  value: string;
  valueColor?: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
      <div className="flex items-center gap-1 mb-2">
        {icon && <span className="shrink-0">{icon}</span>}
        <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
          {title}
        </p>
        <InfoTip text={tooltip} />
      </div>
      <p className={`text-xl font-bold mt-0.5 truncate ${valueColor}`}>{value}</p>
      {subtitle && (
        <p className="text-[11px] text-muted-foreground mt-1 truncate">{subtitle}</p>
      )}
    </div>
  );
}
