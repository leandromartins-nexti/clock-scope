/**
 * Score de Qualidade do Ponto — Computation Engine (3 componentes)
 * 
 * Components:
 * 1. Quality: registered_count / clocking_count from headcount JSONs (weight 50%)
 * 2. Treatment: faixa distribution from composição data (weight 30%)
 * 3. Back-office: qtd_ajustes / (operadores × months) + HE from esforco-tratativa JSONs (weight 20%)
 */

import type { ScoreConfig } from "@/contexts/ScoreConfigContext";
import type { QualidadeDataSources } from "@/lib/qualidadeDataSources";
import {
  composicaoEmpresaData, composicaoUnidadeData, composicaoAreaData,
} from "@/lib/ajustesData";

// ── Import JSON data sources (defaults for customer 642) ──
import hcEmpresa from "@/data/qualidade-ponto/headcount-por-empresa.json";
import hcUnidade from "@/data/qualidade-ponto/headcount-por-un-negocio.json";
import hcArea from "@/data/qualidade-ponto/headcount-por-area.json";
import efEmpresa from "@/data/qualidade-ponto/sobrecarga-por-empresa.json";
import efUnidade from "@/data/qualidade-ponto/sobrecarga-por-un-negocio.json";
import efArea from "@/data/qualidade-ponto/sobrecarga-por-area.json";

// ── Rolling 3-month window (last 3 complete months before today) ──
const LAST_3_MONTHS = ["2026-01-01", "2026-02-01", "2026-03-01"];
const PREV_3_MONTHS = ["2025-10-01", "2025-11-01", "2025-12-01"];

/** Normalize competencia "2026-01" → "2026-01-01" */
function normComp(comp: string): string {
  return comp.length === 10 ? comp : comp + "-01";
}

/** Strip "VIG EYES " prefix for entity name matching */
function normName(name: string): string {
  return name.replace(/^VIG EYES\s+/i, "").trim();
}

/** Check if a normalized name matches (stripping prefix from both sides) */
function nameMatches(jsonName: string, selectedName: string): boolean {
  return normName(jsonName) === normName(selectedName);
}

// ── Headcount data accessor ──
type HcRow = { reference_month: string; registered_count: number; clocking_count: number; justified_count: number; active_headcount: number; [k: string]: any };

function getHcSource(groupBy: "empresa" | "unidade" | "area", sources?: QualidadeDataSources): { data: HcRow[]; nameField: string } {
  if (sources) {
    const data = sources.hc[groupBy] as HcRow[];
    const nameField = groupBy === "area" ? "area_name" : groupBy === "unidade" ? "business_unit_name" : "company_name";
    return { data, nameField };
  }
  if (groupBy === "area") return { data: hcArea as HcRow[], nameField: "area_name" };
  if (groupBy === "unidade") return { data: hcUnidade as HcRow[], nameField: "business_unit_name" };
  return { data: hcEmpresa as HcRow[], nameField: "company_name" };
}

// ── Esforço-tratativa data accessor ──
type EfRow = { competencia: string; qtd_ajustes: number; operadores_ativos: number; horas_extras_rateadas: number; [k: string]: any };

function getEfSource(groupBy: "empresa" | "unidade" | "area", sources?: QualidadeDataSources): { data: EfRow[]; nameField: string } {
  if (sources) {
    const data = sources.esforco[groupBy] as EfRow[];
    const nameField = groupBy === "area" ? "area_name" : groupBy === "unidade" ? "business_unit_name" : "company_name";
    return { data, nameField };
  }
  if (groupBy === "area") return { data: efArea as EfRow[], nameField: "area_name" };
  if (groupBy === "unidade") return { data: efUnidade as EfRow[], nameField: "business_unit_name" };
  return { data: efEmpresa as EfRow[], nameField: "company_name" };
}

// ═══════════════════════════════════════════════════════
// 1. QUALITY — registered_count / clocking_count
// ═══════════════════════════════════════════════════════

export function computeQualityPercentage(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  window: string[] = LAST_3_MONTHS,
  sources?: QualidadeDataSources
): number {
  const { data, nameField } = getHcSource(groupBy, sources);
  const rows = data.filter(r => window.includes(r.reference_month));
  const filtered = selectedName ? rows.filter(r => nameMatches(r[nameField], selectedName)) : rows;

  let totalReg = 0, totalClock = 0;
  for (const r of filtered) {
    totalReg += r.registered_count;
    totalClock += r.clocking_count;
  }

  return totalClock > 0 ? +((totalReg / totalClock) * 100).toFixed(1) : 100;
}

// ═══════════════════════════════════════════════════════
// 2. TREATMENT — weighted faixa distribution
// ═══════════════════════════════════════════════════════

export function computeTreatmentScore(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig,
  window: string[] = LAST_3_MONTHS,
  sources?: QualidadeDataSources
): { score: number; pctUnder1d: number; pct1_3d: number; pct3_7d: number; pct7_15d: number; pctOver15d: number } {
  const source = sources
    ? sources.composicao[groupBy]
    : (groupBy === "unidade" ? composicaoUnidadeData : groupBy === "area" ? composicaoAreaData : composicaoEmpresaData);
  const rows = source.filter((r: any) => window.includes(r.reference_month));
  const filtered = selectedName ? rows.filter((r: any) => nameMatches(r.company_name, selectedName)) : rows;

  let totalF1 = 0, totalF2 = 0, totalF3 = 0, totalF4 = 0, totalF5 = 0;
  for (const r of filtered) {
    totalF1 += r.faixa_ate_1_dia;
    totalF2 += r.faixa_1_3_dias;
    totalF3 += r.faixa_3_7_dias;
    totalF4 += r.faixa_7_15_dias;
    totalF5 += r.faixa_mais_15_dias;
  }

  const totalAll = totalF1 + totalF2 + totalF3 + totalF4 + totalF5;
  if (totalAll === 0) return { score: 100, pctUnder1d: 0, pct1_3d: 0, pct3_7d: 0, pct7_15d: 0, pctOver15d: 0 };

  const pctUnder1d = (totalF1 / totalAll) * 100;
  const pct1_3d = (totalF2 / totalAll) * 100;
  const pct3_7d = (totalF3 / totalAll) * 100;
  const pct7_15d = (totalF4 / totalAll) * 100;
  const pctOver15d = (totalF5 / totalAll) * 100;

  const score =
    (pctUnder1d * config.grade_under_1d / 100) +
    (pct1_3d * config.grade_1_3d / 100) +
    (pct3_7d * config.grade_3_7d / 100) +
    (pct7_15d * config.grade_7_15d / 100) +
    (pctOver15d * config.grade_over_15d / 100);

  return { score: Math.round(score), pctUnder1d, pct1_3d, pct3_7d, pct7_15d, pctOver15d };
}

// ═══════════════════════════════════════════════════════
// 3. BACK-OFFICE HEALTH — (ajustes/operador × 50%) + (HE × 50%)
// ═══════════════════════════════════════════════════════

function boAjustesToGrade(ajustesPerOp: number, config: ScoreConfig): number {
  if (ajustesPerOp <= 400) return config.grade_bo_under_400;
  if (ajustesPerOp <= 700) return config.grade_bo_400_700;
  if (ajustesPerOp <= 1000) return config.grade_bo_700_1000;
  if (ajustesPerOp <= 1400) return config.grade_bo_1000_1400;
  return config.grade_bo_over_1400;
}

export function computeBackofficeScore(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig,
  window: string[] = LAST_3_MONTHS,
  sources?: QualidadeDataSources
): { score: number; ajustesPerOp: number; hePerOp: number; notaAjustes: number; notaHE: number } {
  const { data, nameField } = getEfSource(groupBy, sources);

  // Normalize window dates to match competencia format
  const windowNorm = window.map(w => w.substring(0, 7)); // "2026-01-01" → "2026-01"

  const rows = data.filter(r => windowNorm.includes(normComp(r.competencia).substring(0, 7)));
  const filtered = selectedName ? rows.filter(r => nameMatches(r[nameField], selectedName)) : rows;

  if (filtered.length === 0) {
    return { score: 100, ajustesPerOp: 0, hePerOp: 0, notaAjustes: 100, notaHE: 100 };
  }

  // Total ajustes over the window
  const totalAjustes = filtered.reduce((s, r) => s + r.qtd_ajustes, 0);
  // Total HE over the window
  const totalHE = filtered.reduce((s, r) => s + (r.horas_extras_rateadas ?? 0), 0);

  // Operadores: max across months as approximation
  const byMonth = new Map<string, number>();
  for (const r of filtered) {
    const m = r.competencia.substring(0, 7);
    byMonth.set(m, (byMonth.get(m) ?? 0) + r.operadores_ativos);
  }
  const monthlyOps = Array.from(byMonth.values());
  const maxOps = monthlyOps.length > 0 ? Math.max(...monthlyOps) : 0;

  const months = window.length;
  const ajustesPerOp = maxOps > 0 ? totalAjustes / (maxOps * months) : 0;
  const hePerOp = maxOps > 0 ? totalHE / (maxOps * months) : 0;

  const notaAjustes = boAjustesToGrade(ajustesPerOp, config);
  const notaHE = Math.max(0, 100 - (hePerOp * 2));
  const score = Math.round(notaAjustes * 0.5 + notaHE * 0.5);

  return { score, ajustesPerOp: +ajustesPerOp.toFixed(0), hePerOp: +hePerOp.toFixed(1), notaAjustes: Math.round(notaAjustes), notaHE: Math.round(notaHE) };
}

// ═══════════════════════════════════════════════════════
// COMPOSITE SCORE (3 components)
// ═══════════════════════════════════════════════════════

export function computeCompositeScore(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig,
  window: string[] = LAST_3_MONTHS,
  sources?: QualidadeDataSources
): number {
  const qualPct = computeQualityPercentage(selectedName, groupBy, window, sources);
  const treat = computeTreatmentScore(selectedName, groupBy, config, window, sources);
  const bo = computeBackofficeScore(selectedName, groupBy, config, window, sources);
  return Math.round((qualPct * config.weight_quality / 100) +
           (treat.score * config.weight_treatment / 100) +
           (bo.score * config.weight_backoffice / 100));
}

export function computeFullBreakdown(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig,
  window: string[] = LAST_3_MONTHS,
  sources?: QualidadeDataSources
) {
  const qualPct = computeQualityPercentage(selectedName, groupBy, window, sources);
  const treat = computeTreatmentScore(selectedName, groupBy, config, window, sources);
  const bo = computeBackofficeScore(selectedName, groupBy, config, window, sources);

  const qualContrib = Math.round(qualPct * config.weight_quality / 100);
  const treatContrib = Math.round(treat.score * config.weight_treatment / 100);
  const boContrib = Math.round(bo.score * config.weight_backoffice / 100);
  const compositeScore = Math.round(qualContrib + treatContrib + boContrib);

  return {
    qualPct, qualContrib,
    treatScore: treat.score, treatContrib, treatData: treat,
    boScore: bo.score, boContrib, boData: bo,
    compositeScore,
  };
}

/** Compute previous trimester score for trend comparison */
export function computePrevTriScore(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig,
  sources?: QualidadeDataSources
): number {
  return computeCompositeScore(selectedName, groupBy, config, PREV_3_MONTHS, sources);
}
