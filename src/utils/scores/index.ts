/**
 * Score utilities — barrel export.
 * 
 * Usage:
 *   import { classify, classifyWithMeta, SCORE_LEVEL_META } from '@/utils/scores';
 *   import type { Score, ScoreLevel, ScoreCalculator } from '@/utils/scores';
 */

export { classify, classifyWithMeta, SCORE_LEVEL_META } from "./classify";
export type { Score, ScoreLevel, ScoreCalculator } from "./types";
