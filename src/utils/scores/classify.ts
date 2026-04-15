/**
 * Score Classification — Single Source of Truth
 * 
 * Every classification in the system MUST use this function.
 * Never duplicate classification logic elsewhere.
 */

import type { ScoreConfig } from "@/contexts/ScoreConfigContext";
import type { ScoreLevel } from "./types";

/**
 * Classify a numeric score (0-100) into a ScoreLevel using config thresholds.
 * This is the ONLY function in the codebase that maps score → level.
 */
export function classify(value: number, config: ScoreConfig): ScoreLevel {
  if (value >= config.threshold_excellent) return "excelente";
  if (value >= config.threshold_good) return "bom";
  if (value >= config.threshold_warning) return "atencao";
  if (value >= config.threshold_poor) return "ruim";
  return "critico";
}

/** Visual metadata for each classification level */
export const SCORE_LEVEL_META: Record<ScoreLevel, { label: string; color: string; bg: string; text: string }> = {
  excelente: { label: "Excelente", color: "#22c55e", bg: "bg-green-100", text: "text-green-600" },
  bom:       { label: "Bom",       color: "#84cc16", bg: "bg-lime-100",  text: "text-lime-600" },
  atencao:   { label: "Atenção",   color: "#f97316", bg: "bg-orange-100", text: "text-orange-600" },
  ruim:      { label: "Ruim",      color: "#f87171", bg: "bg-red-100",   text: "text-red-500" },
  critico:   { label: "Crítico",   color: "#ef4444", bg: "bg-red-200",   text: "text-red-600" },
};

/**
 * Get full classification metadata for a score value.
 * Drop-in replacement for getScoreClassification.
 */
export function classifyWithMeta(value: number, config: ScoreConfig) {
  const level = classify(value, config);
  return SCORE_LEVEL_META[level];
}
