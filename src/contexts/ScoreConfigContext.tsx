import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  qualidadeEmpresaData, qualidadeUnidadeData, qualidadeAreaData,
  composicaoEmpresaData, composicaoUnidadeData, composicaoAreaData,
  ajustesEmpresaData, ajustesUnidadeData, ajustesAreaData,
} from "@/lib/ajustesData";
import dimensionamentoData from "@/data/operacao-ponto/dimensionamento-por-operacao.json";

export interface ScoreConfig {
  weight_quality: number;
  weight_treatment: number;
  weight_pressure: number;
  weight_backoffice: number;
  grade_under_1d: number;
  grade_1_3d: number;
  grade_3_7d: number;
  grade_7_15d: number;
  grade_over_15d: number;
  grade_pressure_under_1: number;
  grade_pressure_1_2: number;
  grade_pressure_2_4: number;
  grade_pressure_4_6: number;
  grade_pressure_over_6: number;
  grade_bo_under_400: number;
  grade_bo_400_700: number;
  grade_bo_700_1000: number;
  grade_bo_1000_1400: number;
  grade_bo_over_1400: number;
  threshold_excellent: number;
  threshold_good: number;
  threshold_warning: number;
  threshold_poor: number;
}

export const DEFAULT_CONFIG: ScoreConfig = {
  weight_quality: 45,
  weight_treatment: 20,
  weight_pressure: 20,
  weight_backoffice: 15,
  grade_under_1d: 100,
  grade_1_3d: 75,
  grade_3_7d: 50,
  grade_7_15d: 20,
  grade_over_15d: 0,
  grade_pressure_under_1: 100,
  grade_pressure_1_2: 75,
  grade_pressure_2_4: 50,
  grade_pressure_4_6: 25,
  grade_pressure_over_6: 0,
  grade_bo_under_400: 100,
  grade_bo_400_700: 75,
  grade_bo_700_1000: 50,
  grade_bo_1000_1400: 25,
  grade_bo_over_1400: 0,
  threshold_excellent: 85,
  threshold_good: 70,
  threshold_warning: 55,
  threshold_poor: 40,
};

export function getScoreClassification(score: number, config: ScoreConfig) {
  if (score >= config.threshold_excellent) return { label: "Excelente", color: "#22c55e", bg: "bg-green-100", text: "text-green-600" };
  if (score >= config.threshold_good) return { label: "Bom", color: "#84cc16", bg: "bg-lime-100", text: "text-lime-600" };
  if (score >= config.threshold_warning) return { label: "Atenção", color: "#f97316", bg: "bg-orange-100", text: "text-orange-600" };
  if (score >= config.threshold_poor) return { label: "Ruim", color: "#f87171", bg: "bg-red-100", text: "text-red-500" };
  return { label: "Crítico", color: "#ef4444", bg: "bg-red-200", text: "text-red-600" };
}

// ── Last 3 months window ──
const LAST_3_MONTHS = ["2026-01-01", "2026-02-01", "2026-03-01"];

/** Compute treatment score from composition data for a given entity/groupBy */
export function computeTreatmentScore(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig
): { score: number; pctUnder1d: number; pct1_3d: number; pct3_7d: number; pct7_15d: number; pctOver15d: number } {
  type Row = { name: string; total: number; f1: number; f2: number; f3: number; f4: number; f5: number };
  let rows: Row[];
  const source = groupBy === "unidade" ? composicaoUnidadeData : groupBy === "area" ? composicaoAreaData : composicaoEmpresaData;
  rows = source
    .filter(r => LAST_3_MONTHS.includes(r.reference_month))
    .map(r => ({ name: r.company_name, total: r.total_ajustes, f1: r.faixa_ate_1_dia, f2: r.faixa_1_3_dias, f3: r.faixa_3_7_dias, f4: r.faixa_7_15_dias, f5: r.faixa_mais_15_dias }));

  const filtered = selectedName ? rows.filter(r => r.name === selectedName) : rows;
  let totalF1 = 0, totalF2 = 0, totalF3 = 0, totalF4 = 0, totalF5 = 0, totalAll = 0;
  for (const r of filtered) {
    totalF1 += r.f1; totalF2 += r.f2; totalF3 += r.f3; totalF4 += r.f4; totalF5 += r.f5;
    totalAll += r.f1 + r.f2 + r.f3 + r.f4 + r.f5;
  }

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

  return { score: +score.toFixed(1), pctUnder1d, pct1_3d, pct3_7d, pct7_15d, pctOver15d };
}

/** Compute quality percentage from real data (last 3 months) */
export function computeQualityPercentage(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area"
): number {
  type Row = { name: string; reg: number; just: number };
  let rows: Row[];
  if (groupBy === "unidade") {
    rows = qualidadeUnidadeData.filter(r => LAST_3_MONTHS.includes(r.reference_month)).map(r => ({ name: r.business_unit_name, reg: r.registradas, just: r.justificadas }));
  } else if (groupBy === "area") {
    rows = qualidadeAreaData.filter(r => LAST_3_MONTHS.includes(r.reference_month)).map(r => ({ name: r.area_name, reg: r.registradas, just: r.justificadas }));
  } else {
    rows = qualidadeEmpresaData.filter(r => LAST_3_MONTHS.includes(r.reference_month)).map(r => ({ name: r.company_name, reg: r.registradas, just: r.justificadas }));
  }
  const filtered = selectedName ? rows.filter(r => r.name === selectedName) : rows;
  let totalReg = 0, totalJust = 0;
  for (const r of filtered) { totalReg += r.reg; totalJust += r.just; }
  const total = totalReg + totalJust;
  return total > 0 ? +((totalReg / total) * 100).toFixed(1) : 100;
}

/** Convert pressure value to grade using config bands */
function pressureToGrade(ajustesPerColab: number, config: ScoreConfig): number {
  if (ajustesPerColab <= 1) return config.grade_pressure_under_1;
  if (ajustesPerColab <= 2) return config.grade_pressure_1_2;
  if (ajustesPerColab <= 4) return config.grade_pressure_2_4;
  if (ajustesPerColab <= 6) return config.grade_pressure_4_6;
  return config.grade_pressure_over_6;
}

/** Convert back-office ajustes/operador to grade */
function boAjustesToGrade(ajustesPerOp: number, config: ScoreConfig): number {
  if (ajustesPerOp <= 400) return config.grade_bo_under_400;
  if (ajustesPerOp <= 700) return config.grade_bo_400_700;
  if (ajustesPerOp <= 1000) return config.grade_bo_700_1000;
  if (ajustesPerOp <= 1400) return config.grade_bo_1000_1400;
  return config.grade_bo_over_1400;
}

/** Compute pressure score: ajustes/colab/month over last 3 months */
export function computePressureScore(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig
): { score: number; ajustesPerColab: number } {
  const source = groupBy === "area" ? ajustesAreaData : groupBy === "empresa" ? ajustesEmpresaData : ajustesUnidadeData;
  const last3 = source.filter(r => LAST_3_MONTHS.includes(r.reference_month));
  const filtered = selectedName ? last3.filter(r => r.business_unit_name === selectedName) : last3;

  if (filtered.length === 0) return { score: 100, ajustesPerColab: 0 };

  const totalAjustes = filtered.reduce((s, r) => s + r.volume_marcacoes, 0);
  const avgHeadcount = filtered.reduce((s, r) => s + r.headcount, 0) / filtered.length;
  const ajustesPerColab = avgHeadcount > 0 ? totalAjustes / (avgHeadcount * 3) : 0;
  const score = pressureToGrade(ajustesPerColab, config);

  return { score, ajustesPerColab: +ajustesPerColab.toFixed(1) };
}

/** Compute back-office health score: (ajustes/operador × 50%) + (HE score × 50%) */
export function computeBackofficeScore(
  selectedName: string | null,
  _groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig
): { score: number; ajustesPerOp: number; hePerOp: number; notaAjustes: number; notaHE: number } {
  // Use dimensionamento data (by unidade only)
  const dimData = (dimensionamentoData as any).dados as { business_unit_name: string; operadores_ativos: number; qtd_ajustes: number; ajustes_por_operador_mensal: number }[];
  
  let totalAjustes = 0, totalOps = 0;
  const filtered = selectedName 
    ? dimData.filter(d => d.business_unit_name === selectedName)
    : dimData;
  
  for (const d of filtered) {
    totalAjustes += d.qtd_ajustes;
    totalOps += d.operadores_ativos;
  }

  const ajustesPerOp = totalOps > 0 ? totalAjustes / (totalOps * 3) : 0; // monthly avg over 3 months
  
  // Mock HE data per operador/mês (realistic values)
  const heMap: Record<string, number> = {
    "PORTARIA E LIMPEZA": 18,
    "SEGURANCA PATRIMONIAL": 12,
    "TERCEIRIZACAO": 28,
  };
  
  let hePerOp: number;
  if (selectedName && heMap[selectedName]) {
    hePerOp = heMap[selectedName];
  } else {
    // weighted average
    const totalHE = dimData.reduce((s, d) => s + (heMap[d.business_unit_name] ?? 15) * d.operadores_ativos, 0);
    hePerOp = totalOps > 0 ? totalHE / totalOps : 0;
  }

  const notaAjustes = boAjustesToGrade(ajustesPerOp, config);
  const notaHE = Math.max(0, 100 - (hePerOp * 2));
  const score = +(notaAjustes * 0.5 + notaHE * 0.5).toFixed(1);

  return { score, ajustesPerOp: +ajustesPerOp.toFixed(0), hePerOp: +hePerOp.toFixed(1), notaAjustes, notaHE: +notaHE.toFixed(0) };
}

/** Compute 4-component composite score */
export function computeCompositeScore(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig
): number {
  const qualPct = computeQualityPercentage(selectedName, groupBy);
  const treat = computeTreatmentScore(selectedName, groupBy, config);
  const pressure = computePressureScore(selectedName, groupBy, config);
  const bo = computeBackofficeScore(selectedName, groupBy, config);
  return +((qualPct * config.weight_quality / 100) + 
           (treat.score * config.weight_treatment / 100) + 
           (pressure.score * config.weight_pressure / 100) + 
           (bo.score * config.weight_backoffice / 100)).toFixed(1);
}

/** Compute full breakdown for preview */
export function computeFullBreakdown(
  selectedName: string | null,
  groupBy: "empresa" | "unidade" | "area",
  config: ScoreConfig
) {
  const qualPct = computeQualityPercentage(selectedName, groupBy);
  const treat = computeTreatmentScore(selectedName, groupBy, config);
  const pressure = computePressureScore(selectedName, groupBy, config);
  const bo = computeBackofficeScore(selectedName, groupBy, config);
  
  const qualContrib = +(qualPct * config.weight_quality / 100).toFixed(1);
  const treatContrib = +(treat.score * config.weight_treatment / 100).toFixed(1);
  const pressureContrib = +(pressure.score * config.weight_pressure / 100).toFixed(1);
  const boContrib = +(bo.score * config.weight_backoffice / 100).toFixed(1);
  const compositeScore = +(qualContrib + treatContrib + pressureContrib + boContrib).toFixed(1);
  
  return {
    qualPct, qualContrib,
    treatScore: treat.score, treatContrib, treatData: treat,
    pressureScore: pressure.score, pressureContrib, pressureData: pressure,
    boScore: bo.score, boContrib, boData: bo,
    compositeScore,
  };
}

interface ScoreConfigContextType {
  config: ScoreConfig;
  setConfig: (config: ScoreConfig) => void;
  saveConfig: () => Promise<void>;
  resetToDefault: () => void;
  loading: boolean;
}

const ScoreConfigContext = createContext<ScoreConfigContextType>({
  config: DEFAULT_CONFIG,
  setConfig: () => {},
  saveConfig: async () => {},
  resetToDefault: () => {},
  loading: true,
});

export function useScoreConfig() {
  return useContext(ScoreConfigContext);
}

export function ScoreConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ScoreConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await (supabase as any).from("score_config").select("*").eq("config_key", "qualidade_ponto").single();
        if (data) {
          setConfig({
            weight_quality: data.weight_quality,
            weight_treatment: data.weight_treatment,
            weight_pressure: data.weight_pressure ?? DEFAULT_CONFIG.weight_pressure,
            weight_backoffice: data.weight_backoffice ?? DEFAULT_CONFIG.weight_backoffice,
            grade_under_1d: data.grade_under_1d,
            grade_1_3d: data.grade_1_3d,
            grade_3_7d: data.grade_3_7d,
            grade_7_15d: data.grade_7_15d,
            grade_over_15d: data.grade_over_15d,
            grade_pressure_under_1: data.grade_pressure_under_1 ?? DEFAULT_CONFIG.grade_pressure_under_1,
            grade_pressure_1_2: data.grade_pressure_1_2 ?? DEFAULT_CONFIG.grade_pressure_1_2,
            grade_pressure_2_4: data.grade_pressure_2_4 ?? DEFAULT_CONFIG.grade_pressure_2_4,
            grade_pressure_4_6: data.grade_pressure_4_6 ?? DEFAULT_CONFIG.grade_pressure_4_6,
            grade_pressure_over_6: data.grade_pressure_over_6 ?? DEFAULT_CONFIG.grade_pressure_over_6,
            grade_bo_under_400: data.grade_bo_under_400 ?? DEFAULT_CONFIG.grade_bo_under_400,
            grade_bo_400_700: data.grade_bo_400_700 ?? DEFAULT_CONFIG.grade_bo_400_700,
            grade_bo_700_1000: data.grade_bo_700_1000 ?? DEFAULT_CONFIG.grade_bo_700_1000,
            grade_bo_1000_1400: data.grade_bo_1000_1400 ?? DEFAULT_CONFIG.grade_bo_1000_1400,
            grade_bo_over_1400: data.grade_bo_over_1400 ?? DEFAULT_CONFIG.grade_bo_over_1400,
            threshold_excellent: data.threshold_excellent,
            threshold_good: data.threshold_good,
            threshold_warning: data.threshold_warning,
            threshold_poor: data.threshold_poor,
          });
        }
      } catch (e) {
        console.error("Failed to load score config:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveConfig = useCallback(async () => {
    try {
      await (supabase as any).from("score_config").update({
        ...config,
        updated_at: new Date().toISOString(),
      }).eq("config_key", "qualidade_ponto");
    } catch (e) {
      console.error("Failed to save score config:", e);
    }
  }, [config]);

  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  return (
    <ScoreConfigContext.Provider value={{ config, setConfig, saveConfig, resetToDefault, loading }}>
      {children}
    </ScoreConfigContext.Provider>
  );
}
