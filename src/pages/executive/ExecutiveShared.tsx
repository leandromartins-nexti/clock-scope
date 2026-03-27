import { scoreClass } from "@/lib/executiveData";

/* ── Big Number Card ── */
interface BigNumberProps {
  title: string;
  value: string;
  valueColor?: string;
  footer?: string;
  footerRight?: string;
  change?: { value: string; color: string; icon: string };
}

export const BigNumberCard = ({ title, value, valueColor = "text-gray-800", footer, footerRight, change }: BigNumberProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-[140px] flex flex-col justify-between">
    <p className="text-xs text-gray-500 font-medium text-center">{title}</p>
    <p className={`text-2xl font-bold text-center ${valueColor}`}>{value}</p>
    <div>
      {(footer || footerRight) && (
        <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">{footer}</span>
          <span className="text-[10px] text-gray-400">{footerRight}</span>
        </div>
      )}
      {change && (
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-gray-400">vs anterior</span>
          <span className={`text-[10px] font-medium ${change.color}`}>{change.value} {change.icon}</span>
        </div>
      )}
    </div>
  </div>
);

/* ── Score Badge ── */
export const ScoreBadge = ({ score }: { score: number }) => {
  const s = scoreClass(score);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.color}`}>
      {score} – {s.label}
    </span>
  );
};

/* ── Trend helper ── */
export function trendStr(curr: number, prev: number, invertGood = false) {
  if (prev === 0) return { value: "—", color: "text-gray-400", icon: "" };
  const pct = ((curr - prev) / prev) * 100;
  const isPositive = pct > 0;
  const isGood = invertGood ? isPositive : !isPositive;
  return {
    value: `${isPositive ? "+" : ""}${pct.toFixed(1)}%`,
    color: isGood ? "text-green-600" : "text-red-500",
    icon: isPositive ? "↑" : "↓",
  };
}

/* ── Insight block ── */
interface Insight {
  severity: "critical" | "warning" | "info";
  text: string;
}

const severityConfig = {
  critical: { dot: "bg-red-500", bg: "bg-red-50", border: "border-red-200" },
  warning: { dot: "bg-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" },
  info: { dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
};

export const InsightBlock = ({ insights }: { insights: Insight[] }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5">
    <h3 className="text-sm font-semibold text-gray-800 mb-3">💡 Insights Automáticos</h3>
    <div className="space-y-2">
      {insights.map((ins, i) => {
        const cfg = severityConfig[ins.severity];
        return (
          <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border ${cfg.bg} ${cfg.border}`}>
            <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${cfg.dot}`} />
            <p className="text-xs text-gray-700 leading-relaxed">{ins.text}</p>
          </div>
        );
      })}
    </div>
  </div>
);

/* ── Section title ── */
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-700 mb-3">{children}</h3>
);
