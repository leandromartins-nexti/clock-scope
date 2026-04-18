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
