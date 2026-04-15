export interface InsightEvidence {
  before: { label: string; value: string };
  after: { label: string; value: string };
}

export interface Insight {
  id: string;
  category: "critical" | "event" | "achievement" | "opportunity" | "trend";
  severity: "critical" | "warning" | "info" | "success";
  tabOrigin: string;
  timestamp: string;
  title: string;
  narrative: string;
  evidence: InsightEvidence | null;
  actionFilter: Record<string, string | number> | null;
}

// Cross-tab insights — populated per customer
export const mockInsights: Insight[] = [];
