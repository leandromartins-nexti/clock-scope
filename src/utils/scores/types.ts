/**
 * Score Calculator — Shared Types
 * 
 * All score computations in the system use these types.
 * ScoreCalculator is a pure function: (entity, config) → Score.
 */

import type { ScoreConfig } from "@/contexts/ScoreConfigContext";

export type ScoreLevel = "excelente" | "bom" | "atencao" | "ruim" | "critico";

export interface Score {
  value: number;
  classification: ScoreLevel;
}

/**
 * Generic score calculator signature.
 * Each analytics tab provides its own calculator conforming to this type.
 * 
 * @param entity - Domain-specific data for the entity being scored
 * @param config - Score configuration (weights, thresholds, grades)
 * @returns Score with numeric value and classification level
 */
export type ScoreCalculator<TEntity = unknown> = (
  entity: TEntity,
  config: ScoreConfig
) => Score;
