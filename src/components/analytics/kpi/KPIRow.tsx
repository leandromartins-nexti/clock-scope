/**
 * KPIRow — renders exactly 6 BigNumber cards in a responsive grid.
 * Desktop: 6 columns. Tablet: 3×2. Mobile: 2×3.
 *
 * Each slot can be either a BigNumberData config (auto-rendered) or a custom ReactNode.
 */
import { ReactNode } from "react";
import type { BigNumberData } from "../types";
import InfoTip from "../InfoTip";

interface KPIRowProps {
  /** Always 6 items. Items can be BigNumberData or ReactNode for custom cards (e.g. ScoreBoard). */
  items: Array<BigNumberData | ReactNode>;
}

function isReactNode(item: BigNumberData | ReactNode): item is ReactNode {
  return item !== null && typeof item === "object" && "$$typeof" in (item as any);
}

function isBigNumberData(item: BigNumberData | ReactNode): item is BigNumberData {
  return item !== null && typeof item === "object" && "label" in (item as any);
}

export default function KPIRow({ items }: KPIRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      {items.map((item, i) => {
        // Custom render (ReactNode like ScoreBoard)
        if (isReactNode(item) && !isBigNumberData(item)) {
          return <div key={i}>{item}</div>;
        }

        // BigNumberData with custom render override
        if (isBigNumberData(item) && item.render) {
          return <div key={i}>{item.render}</div>;
        }

        // Standard BigNumberData card
        if (isBigNumberData(item)) {
          const bd = item;
          const trendColor =
            bd.trend?.direction === "up"
              ? "text-green-600"
              : bd.trend?.direction === "down"
              ? "text-red-600"
              : "text-muted-foreground";
          const classifColor = bd.classification
            ? ({
                excelente: "text-green-600",
                bom: "text-blue-600",
                atencao: "text-orange-500",
                ruim: "text-red-500",
                critico: "text-red-700",
              }[bd.classification.level] ?? "text-foreground")
            : undefined;

          return (
            <div
              key={i}
              className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
              onClick={bd.onClick}
              role={bd.onClick ? "button" : undefined}
              style={bd.onClick ? { cursor: "pointer" } : undefined}
            >
              <div className="flex items-center gap-1 mb-2">
                <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
                  {bd.label}
                </p>
                {bd.tooltip && <InfoTip text={bd.tooltip} />}
              </div>
              <p className="text-xl font-bold mt-0.5 truncate text-foreground">
                {bd.value}
                {bd.unit && <span className="text-sm font-normal text-muted-foreground ml-0.5">{bd.unit}</span>}
              </p>
              {bd.classification && (
                <p className={`text-[11px] mt-0.5 font-medium ${classifColor}`}>
                  {bd.classification.label}
                </p>
              )}
              {bd.trend && (
                <span className={`text-[10px] flex items-center gap-0.5 mt-1 ${trendColor}`}>
                  {bd.trend.direction === "up" ? "↑" : bd.trend.direction === "down" ? "↓" : "—"}{" "}
                  {bd.trend.value} {bd.trend.label}
                </span>
              )}
            </div>
          );
        }

        // Fallback: render ReactNode directly
        return <div key={i}>{item as ReactNode}</div>;
      })}
    </div>
  );
}
