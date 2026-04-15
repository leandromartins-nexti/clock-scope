/**
 * Analytics Data Layer — Shared Types
 * 
 * Every analytics tab hook MUST return AnalyticsTabData.
 * This ensures consistency across all tabs and enables
 * generic tab rendering via the registry.
 * 
 * Naming convention: use{NomeDaAba}Data  (e.g. useQualidadePontoData)
 * Location: src/hooks/analytics/
 */

import type { BigNumberData, Score } from "@/components/analytics/types";

export interface ChartData {
  /** Pre-processed data array for the chart */
  data: any[];
  /** Optional score for this chart's context */
  score?: Score;
  /** Optional metadata */
  meta?: {
    title: string;
    subtitle?: string;
    lastUpdated?: string;
  };
}

/**
 * Standard return type for all analytics tab data hooks.
 * 
 * - kpis: always 6 items (KPIRow rule)
 * - charts: keyed by chart slug (e.g. 'mapa-operacao', 'evolucao-qualidade')
 * - isLoading / error / refetch: standard async state
 */
export interface AnalyticsTabData {
  kpis: BigNumberData[];
  charts: Record<string, ChartData>;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
