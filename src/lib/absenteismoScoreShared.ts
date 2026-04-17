/**
 * Lógica compartilhada de cálculo do score de Absenteísmo,
 * replicando exatamente a aba AbsenteismoV2Content.
 *
 * Usada por:
 *  - AnalyticsResumoExecutivo (sparkline + card + Score Nexti por entidade)
 *  - AbsenteismoV2Content (fonte original da lógica)
 */

import volumeEmpresa from "@/data/customers/642/absenteismo/volume-mensal-por-empresa.json";
import volumeUnNegocio from "@/data/customers/642/absenteismo/volume-mensal-por-un-negocio.json";
import volumeArea from "@/data/customers/642/absenteismo/volume-mensal-por-area.json";
import composicaoEmpresa from "@/data/customers/642/absenteismo/composicao-por-empresa.json";
import composicaoUnNegocio from "@/data/customers/642/absenteismo/composicao-por-un-negocio.json";
import composicaoArea from "@/data/customers/642/absenteismo/composicao-por-area.json";
import maturidadeEmpresa from "@/data/customers/642/absenteismo/maturidade-por-empresa.json";
import maturidadeUnNegocio from "@/data/customers/642/absenteismo/maturidade-por-un-negocio.json";
import maturidadeArea from "@/data/customers/642/absenteismo/maturidade-por-area.json";

import {
  computeVolumeScore,
  computeComposicaoScore,
  computeMaturidadeScore,
  computeAbsCompositeScore,
  type AbsenteismoScoreConfig,
} from "@/contexts/AbsenteismoScoreConfigContext";

export type AbsGroupBy = "empresa" | "unidade" | "area";

// ── Constantes idênticas à AbsenteismoV2Content ──
const HC_BY_MONTH: Record<string, number> = {
  "2025-04-01": 470, "2025-05-01": 472, "2025-06-01": 475, "2025-07-01": 478,
  "2025-08-01": 480, "2025-09-01": 480, "2025-10-01": 482, "2025-11-01": 483,
  "2025-12-01": 485, "2026-01-01": 484, "2026-02-01": 484, "2026-03-01": 484,
};

const HC_BY_ENTITY: Record<string, number> = {
  "PORTARIA E LIMPEZA": 310,
  "SEGURANCA PATRIMONIAL": 98,
  "TERCEIRIZACAO": 76,
  PIRACICABA: 145,
  "SAO PAULO": 220,
  SOROCABA: 119,
};

const CATEGORY_MAP: Record<number, string> = {
  18345: "planejada", 18352: "planejada", 18549: "planejada", 18550: "planejada", 18548: "planejada", 18545: "planejada",
  18351: "saude", 18348: "saude", 18546: "saude", 18547: "saude",
  18349: "operacional", 18350: "operacional",
  18346: "falta",
};

export function normalizeAbsEntityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^VIG\s*EYES\s*/i, "")
    .replace(/\s+TERCEIRIZACAO\s+DE\s+SERVICOS\s+LTDA$/i, " TERCEIRIZACAO")
    .replace(/\s+SEGURANCA\s+PATRIMONIAL\s+LTDA$/i, " SEGURANCA PATRIMONIAL")
    .replace(/\s+PORTARIA\s+E\s+LIMPEZA\s+LTDA$/i, " PORTARIA E LIMPEZA")
    .replace(/\s+LTDA$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

const ALL_MONTHS = Object.keys(HC_BY_MONTH).sort();

function getNameField(groupBy: AbsGroupBy): string {
  return groupBy === "empresa" ? "company_name" : groupBy === "area" ? "area_name" : "business_unit_name";
}

function getVolumeRows(groupBy: AbsGroupBy): Array<Record<string, any>> {
  return (groupBy === "empresa" ? volumeEmpresa : groupBy === "area" ? volumeArea : volumeUnNegocio) as any[];
}
function getCompRows(groupBy: AbsGroupBy): Array<Record<string, any>> {
  return (groupBy === "empresa" ? composicaoEmpresa : groupBy === "area" ? composicaoArea : composicaoUnNegocio) as any[];
}
function getMatRows(groupBy: AbsGroupBy): Array<Record<string, any>> {
  return (groupBy === "empresa" ? maturidadeEmpresa : groupBy === "area" ? maturidadeArea : maturidadeUnNegocio) as any[];
}

// ── Computações por mês ──

export function computeVolumeScoreForMonth(
  month: string,
  entityName: string | null,
  groupBy: AbsGroupBy,
  config: AbsenteismoScoreConfig,
): number {
  const rows = getVolumeRows(groupBy);
  const nameField = getNameField(groupBy);

  if (entityName) {
    const norm = normalizeAbsEntityName(entityName);
    const filtered = rows.filter(
      (r) => r.reference_date === month && normalizeAbsEntityName(String(r[nameField] ?? "")) === norm,
    );
    const horas = filtered.reduce((s, r) => s + (r.horas_ausencia ?? 0), 0);
    const hc = HC_BY_ENTITY[norm] ?? 0;
    const taxa = hc > 0 ? (horas / (hc * config.horas_previstas_mes)) * 100 : 0;
    return computeVolumeScore(taxa, config);
  }

  // Consolidado: usa horas_ausencia_nao_planejada (igual aba)
  const horas = rows
    .filter((r) => r.reference_date === month)
    .reduce((s, r) => s + (r.horas_ausencia_nao_planejada ?? r.horas_ausencia ?? 0), 0);
  const hc = HC_BY_MONTH[month] ?? 0;
  const taxa = hc > 0 ? (horas / (hc * config.horas_previstas_mes)) * 100 : 0;
  return computeVolumeScore(taxa, config);
}

export function computeComposicaoScoreForMonth(
  month: string,
  entityName: string | null,
  groupBy: AbsGroupBy,
  config: AbsenteismoScoreConfig,
): number {
  const rows = getCompRows(groupBy);
  const nameField = getNameField(groupBy);
  const norm = entityName ? normalizeAbsEntityName(entityName) : null;

  const filtered = rows.filter((r) => {
    if (r.reference_date !== month) return false;
    if (!norm) return true;
    return normalizeAbsEntityName(String(r[nameField] ?? "")) === norm;
  });

  const totals = { planejada: 0, saude: 0, operacional: 0, falta: 0, nao_categorizada: 0 };
  let totalHoras = 0;
  for (const row of filtered) {
    const cat = CATEGORY_MAP[row.absence_situation_id] ?? "nao_categorizada";
    const horas = row.horas_total ?? 0;
    totals[cat as keyof typeof totals] += horas;
    totalHoras += horas;
  }
  if (totalHoras === 0) return 0;

  const dist = {
    planejada: (totals.planejada / totalHoras) * 100,
    saude: (totals.saude / totalHoras) * 100,
    operacional: (totals.operacional / totalHoras) * 100,
    falta: (totals.falta / totalHoras) * 100,
    nao_categorizada: (totals.nao_categorizada / totalHoras) * 100,
  };
  return computeComposicaoScore(dist, config);
}

export function computeMaturidadeScoreForMonth(
  month: string,
  entityName: string | null,
  groupBy: AbsGroupBy,
  config: AbsenteismoScoreConfig,
): number {
  const rows = getMatRows(groupBy);
  const nameField = getNameField(groupBy);
  const norm = entityName ? normalizeAbsEntityName(entityName) : null;

  const filtered = rows.filter((r) => {
    if (r.reference_date !== month) return false;
    if (!norm) return true;
    return normalizeAbsEntityName(String(r[nameField] ?? "")) === norm;
  });

  let planejado = 0;
  let total = 0;
  for (const row of filtered) {
    const categoria = String(row.categoria ?? "").replace(/-/g, "_");
    const horas = row.horas_total ?? 0;
    total += horas;
    if (categoria === "1_planejado") planejado += horas;
  }
  const pct = total > 0 ? (planejado / total) * 100 : 0;
  return computeMaturidadeScore(pct, config);
}

// ── API pública ──

/** Score composto de absenteísmo para um mês específico (entidade opcional). */
export function computeAbsenteismoScoreMonth(
  month: string,
  entityName: string | null,
  groupBy: AbsGroupBy,
  config: AbsenteismoScoreConfig,
): number {
  const v = computeVolumeScoreForMonth(month, entityName, groupBy, config);
  const c = computeComposicaoScoreForMonth(month, entityName, groupBy, config);
  const m = computeMaturidadeScoreForMonth(month, entityName, groupBy, config);
  return computeAbsCompositeScore(v, c, m, config);
}

/** Evolução mensal do score de absenteísmo (12 meses do horizonte fixo). */
export function computeAbsenteismoEvolution(
  entityName: string | null,
  groupBy: AbsGroupBy,
  config: AbsenteismoScoreConfig,
): Array<{ month: string; score: number }> {
  return ALL_MONTHS.map((month) => ({
    month,
    score: computeAbsenteismoScoreMonth(month, entityName, groupBy, config),
  }));
}

/** Score de absenteísmo do último mês (mar/2026). */
export function computeAbsenteismoCurrentScore(
  entityName: string | null,
  groupBy: AbsGroupBy,
  config: AbsenteismoScoreConfig,
): number {
  const last = ALL_MONTHS[ALL_MONTHS.length - 1];
  return computeAbsenteismoScoreMonth(last, entityName, groupBy, config);
}

export const ABS_HORIZON_MONTHS = ALL_MONTHS;
