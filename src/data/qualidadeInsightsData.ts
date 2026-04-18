export interface InsightEvidence {
  before: { label: string; value: string };
  after: { label: string; value: string };
}

export interface InsightModal {
  diagnosis: string;
  evidence: Array<{ label: string; value: string; context?: string }>;
  action_plan: string[];
  related_cards: string[];
}

/**
 * Escopo do insight — define a qual entidade ele pertence.
 * - "global"        → aparece sempre (consolidado)
 * - "company"       → aparece quando empresa correspondente está selecionada
 * - "business_unit" → idem para unidade de negócio
 * - "area"          → idem para área
 */
export interface InsightScope {
  level: "global" | "company" | "business_unit" | "area";
  company_id?: number;
  company_name?: string;
  business_unit_id?: number;
  business_unit_name?: string;
  area_id?: number;
  area_name?: string;
}

/**
 * Âncora visual do insight num gráfico específico — define onde o pin aparece.
 */
export type InsightChartId = "qualidade_headcount" | "tratativa_tempo" | "sobrecarga_backoffice";

export interface InsightAnchor {
  chart: InsightChartId;
  /** YYYY-MM ou YYYY-MM-DD (parsing tolerante) */
  month: string;
  /** Nome da série naquele gráfico — usada para resolver y/value */
  series: string;
  axis: "left" | "right";
}

export interface QualidadeInsight {
  id: string;
  numeric_id?: number;
  category: "risk" | "achievement" | "opportunity" | "event";
  severity: "critical" | "high" | "medium" | "info" | "success";
  title: string;
  narrative: string;
  evidence: InsightEvidence | null;
  action: string;
  actionFilter?: Record<string, string | number>;
  crossRef?: { targetId: string; label: string };
  modal?: InsightModal;
  /** Vínculo com a entidade (empresa/unidade/area) ou marca como global */
  scope?: InsightScope;
  /** Pontos onde o insight gera pin nos gráficos */
  anchors?: InsightAnchor[];
}

import { AlertTriangle, Trophy, Lightbulb, TrendingUp, type LucideIcon } from "lucide-react";
import insights642 from "@/data/customers/642/qualidade-ponto/insights.json";
import insights1 from "@/data/customers/1/insights.json";
import insights2 from "@/data/customers/2/insights.json";
import insights391 from "@/data/customers/391/insights.json";

const insightsByCustomer: Record<number, QualidadeInsight[]> = {
  642: insights642 as QualidadeInsight[],
  1: insights1 as QualidadeInsight[],
  2: insights2 as QualidadeInsight[],
  391: insights391 as QualidadeInsight[],
};

export function getInsightsForCustomer(customerId: number): QualidadeInsight[] {
  return insightsByCustomer[customerId] ?? [];
}

export function findInsightByNumericId(customerId: number, numericId: number): QualidadeInsight | undefined {
  return getInsightsForCustomer(customerId).find(i => i.numeric_id === numericId);
}

/**
 * Normaliza nomes de entidade (remove "VIG EYES" e " LTDA") para tolerar
 * pequenas variações entre datasets, scope e seleções da sidebar.
 */
const normalizeName = (n: string | undefined | null): string =>
  String(n ?? "").replace(/^VIG\s*EYES\s*/i, "").replace(/\s+LTDA$/i, "").trim().toUpperCase();

export type GroupByLevel = "empresa" | "unidade" | "area";

/**
 * Filtra insights pelo escopo + entidade selecionada.
 * - selectedEntity = null → mostra apenas insights "global" (visão consolidada)
 * - selectedEntity = "X"  → mostra global + insights cujo scope bate com X
 */
export function filterInsightsByEntity(
  insights: QualidadeInsight[],
  groupBy: GroupByLevel,
  selectedEntity: string | null,
): QualidadeInsight[] {
  return insights.filter((ins) => {
    const scope = ins.scope;
    if (!scope || scope.level === "global") return true;
    if (!selectedEntity) return false;

    const sel = normalizeName(selectedEntity);
    if (groupBy === "empresa" && scope.level === "company") {
      return normalizeName(scope.company_name) === sel;
    }
    if (groupBy === "unidade" && scope.level === "business_unit") {
      return normalizeName(scope.business_unit_name) === sel;
    }
    if (groupBy === "area" && scope.level === "area") {
      return normalizeName(scope.area_name) === sel;
    }
    // Cross-level: empresa↔unidade equivalentes
    if (groupBy === "unidade" && scope.level === "company") {
      return normalizeName(scope.business_unit_name ?? scope.company_name) === sel;
    }
    if (groupBy === "empresa" && scope.level === "business_unit") {
      return normalizeName(scope.company_name ?? scope.business_unit_name) === sel;
    }
    return false;
  });
}

export interface ResolvedAnchor {
  insightId: string;
  numericId?: number;
  type: PinType;
  monthKey: string;     // sempre normalizado YYYY-MM
  series: string;
  axis: "left" | "right";
}

const categoryToPinType = (cat: QualidadeInsight["category"]): PinType => {
  switch (cat) {
    case "risk": return "risk";
    case "achievement": return "achievement";
    case "opportunity": return "opportunity";
    case "event": return "trend";
  }
};

/**
 * Extrai pins de um conjunto de insights para um gráfico específico.
 * O componente consumidor mapeia monthKey → mesIndex no eixo X.
 */
export function buildAnchorsForChart(
  insights: QualidadeInsight[],
  chart: InsightChartId,
): ResolvedAnchor[] {
  const out: ResolvedAnchor[] = [];
  for (const ins of insights) {
    if (!ins.anchors) continue;
    for (const a of ins.anchors) {
      if (a.chart !== chart) continue;
      out.push({
        insightId: ins.id,
        numericId: ins.numeric_id,
        type: categoryToPinType(ins.category),
        monthKey: a.month.slice(0, 7),
        series: a.series,
        axis: a.axis,
      });
    }
  }
  return out;
}

export type PinType = "risk" | "achievement" | "opportunity" | "trend";

/** Visual mapping for the 4 pin types (matches Insights Center icons) */
export const PIN_TYPE_VISUALS: Record<PinType, { color: string; icon: LucideIcon; label: string }> = {
  risk:        { color: "#ef4444", icon: AlertTriangle, label: "Risco" },
  achievement: { color: "#22c55e", icon: Trophy,        label: "Conquista" },
  opportunity: { color: "#facc15", icon: Lightbulb,     label: "Oportunidade" },
  trend:       { color: "#3b82f6", icon: TrendingUp,    label: "Tendência" },
};

// Legacy export for backward compat
export const qualidadeInsights: QualidadeInsight[] = insights642 as QualidadeInsight[];

export const categoryConfig = {
  risk: {
    label: "Riscos",
    icon: "AlertTriangle" as const,
    borderColor: "#ef4444",
    bgColor: "#fef2f2",
    textColor: "#991b1b",
    badgeBg: "#fee2e2",
  },
  achievement: {
    label: "Conquistas",
    icon: "Trophy" as const,
    borderColor: "#22c55e",
    bgColor: "#f0fdf4",
    textColor: "#166534",
    badgeBg: "#dcfce7",
  },
  opportunity: {
    label: "Oportunidades",
    icon: "Lightbulb" as const,
    borderColor: "#f59e0b",
    bgColor: "#fffbeb",
    textColor: "#92400e",
    badgeBg: "#fef3c7",
  },
  event: {
    label: "Eventos e Tendências",
    icon: "Activity" as const,
    borderColor: "#6b7280",
    bgColor: "#f9fafb",
    textColor: "#374151",
    badgeBg: "#f3f4f6",
  },
} as const;
