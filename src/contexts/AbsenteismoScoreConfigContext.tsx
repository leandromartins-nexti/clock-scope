import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ── Types ──

export type AbsenteismoProfile = "vigilancia_facilities" | "industria" | "servicos" | "customizado";

export interface AbsenteismoScoreConfig {
  profile_type: AbsenteismoProfile;

  /** Sub-score weights (must sum to 100) */
  peso_volume: number;
  peso_composicao: number;
  peso_maturidade: number;

  /** Volume bands — taxa % thresholds */
  volume_excelente_ate: number;
  volume_bom_ate: number;
  volume_atencao_ate: number;
  volume_ruim_ate: number;

  /** Maturity bands — % planejado thresholds */
  maturidade_excelente_acima: number;
  maturidade_bom_acima: number;
  maturidade_atencao_acima: number;
  maturidade_ruim_acima: number;

  /** Composition category weights (0-100 each) */
  cat_peso_planejada: number;
  cat_peso_saude: number;
  cat_peso_operacional: number;
  cat_peso_nao_categorizada: number;
  cat_peso_falta: number;

  /** Operational settings */
  horas_previstas_mes: number;
  limite_saudavel_mapa: number;
  limite_critico_mapa: number;

  /** Score classification thresholds */
  score_excellent: number;
  score_good: number;
  score_warning: number;
  score_poor: number;

  /** Semantic mapping (absence_situation_id → category) */
  mapping_semantico: Record<number, string>;
}

// ── Profiles ──

const BASE_PROFILE: Omit<AbsenteismoScoreConfig, "profile_type"> = {
  peso_volume: 50,
  peso_composicao: 30,
  peso_maturidade: 20,
  volume_excelente_ate: 2.5,
  volume_bom_ate: 4.0,
  volume_atencao_ate: 6.0,
  volume_ruim_ate: 8.0,
  maturidade_excelente_acima: 95,
  maturidade_bom_acima: 85,
  maturidade_atencao_acima: 70,
  maturidade_ruim_acima: 50,
  cat_peso_planejada: 100,
  cat_peso_saude: 80,
  cat_peso_operacional: 60,
  cat_peso_nao_categorizada: 50,
  cat_peso_falta: 0,
  horas_previstas_mes: 220,
  limite_saudavel_mapa: 70,
  limite_critico_mapa: 50,
  score_excellent: 85,
  score_good: 70,
  score_warning: 55,
  score_poor: 40,
  mapping_semantico: {
    18345: "planejada", 18352: "planejada", 18549: "planejada", 18550: "planejada", 18548: "planejada", 18545: "planejada",
    18351: "saude", 18348: "saude", 18546: "saude", 18547: "saude",
    18349: "operacional", 18350: "operacional",
    18346: "falta",
  },
};

export const ABS_PROFILES: Record<string, Omit<AbsenteismoScoreConfig, "profile_type">> = {
  vigilancia_facilities: {
    ...BASE_PROFILE,
    peso_volume: 50,
    peso_composicao: 30,
    peso_maturidade: 20,
    volume_excelente_ate: 2.5,
    volume_bom_ate: 4.0,
    volume_atencao_ate: 6.0,
    volume_ruim_ate: 8.0,
    maturidade_excelente_acima: 95,
    maturidade_bom_acima: 85,
    maturidade_atencao_acima: 70,
    maturidade_ruim_acima: 50,
    horas_previstas_mes: 220,
  },
  industria: {
    ...BASE_PROFILE,
    peso_volume: 40,
    peso_composicao: 30,
    peso_maturidade: 30,
    volume_excelente_ate: 3.5,
    volume_bom_ate: 5.5,
    volume_atencao_ate: 7.0,
    volume_ruim_ate: 9.0,
    maturidade_excelente_acima: 90,
    maturidade_bom_acima: 80,
    maturidade_atencao_acima: 65,
    maturidade_ruim_acima: 45,
    horas_previstas_mes: 189,
  },
  servicos: {
    ...BASE_PROFILE,
    peso_volume: 45,
    peso_composicao: 35,
    peso_maturidade: 20,
    volume_excelente_ate: 3.0,
    volume_bom_ate: 5.0,
    volume_atencao_ate: 7.0,
    volume_ruim_ate: 10.0,
    maturidade_excelente_acima: 90,
    maturidade_bom_acima: 80,
    maturidade_atencao_acima: 65,
    maturidade_ruim_acima: 45,
    horas_previstas_mes: 176,
  },
};

export const DEFAULT_ABS_CONFIG: AbsenteismoScoreConfig = {
  profile_type: "vigilancia_facilities",
  ...ABS_PROFILES.vigilancia_facilities,
};

// ── Score computation functions ──

/** Sub-score Volume: maps taxa % → 0-100 using 5-band config */
export function computeVolumeScore(taxa: number, config: AbsenteismoScoreConfig): number {
  if (taxa <= config.volume_excelente_ate) return 100;
  if (taxa <= config.volume_bom_ate) return 75;
  if (taxa <= config.volume_atencao_ate) return 50;
  if (taxa <= config.volume_ruim_ate) return 25;
  return 0;
}

/** Sub-score Composição: weighted average of category proportions */
export function computeComposicaoScore(
  dist: { planejada: number; saude: number; operacional: number; falta: number; nao_categorizada: number },
  config: AbsenteismoScoreConfig,
): number {
  const weights: Record<string, number> = {
    planejada: config.cat_peso_planejada,
    saude: config.cat_peso_saude,
    operacional: config.cat_peso_operacional,
    nao_categorizada: config.cat_peso_nao_categorizada,
    falta: config.cat_peso_falta,
  };
  const total = Object.values(dist).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let weighted = 0;
  for (const [cat, pct] of Object.entries(dist)) {
    weighted += (pct / total) * (weights[cat] ?? 50);
  }
  return Math.round(weighted);
}

/** Sub-score Maturidade: maps % planejado → 0-100 using 5-band config */
export function computeMaturidadeScore(pctPlanejado: number, config: AbsenteismoScoreConfig): number {
  if (pctPlanejado >= config.maturidade_excelente_acima) return 100;
  if (pctPlanejado >= config.maturidade_bom_acima) return 75;
  if (pctPlanejado >= config.maturidade_atencao_acima) return 50;
  if (pctPlanejado >= config.maturidade_ruim_acima) return 25;
  return 0;
}

/** Composite score from all 3 sub-scores */
export function computeAbsCompositeScore(
  volumeScore: number,
  composicaoScore: number,
  maturidadeScore: number,
  config: AbsenteismoScoreConfig,
): number {
  return Math.round(
    (volumeScore * config.peso_volume / 100) +
    (composicaoScore * config.peso_composicao / 100) +
    (maturidadeScore * config.peso_maturidade / 100)
  );
}

/** Score label from final score */
export function getAbsScoreLabel(score: number, config: AbsenteismoScoreConfig): string {
  if (score >= config.score_excellent) return "Excelente";
  if (score >= config.score_good) return "Bom";
  if (score >= config.score_warning) return "Atenção";
  if (score >= config.score_poor) return "Ruim";
  return "Crítico";
}

/** Score color from final score */
export function getAbsScoreColor(score: number, config: AbsenteismoScoreConfig): string {
  if (score >= config.score_excellent) return "#22c55e";
  if (score >= config.score_good) return "#84cc16";
  if (score >= config.score_warning) return "#f97316";
  if (score >= config.score_poor) return "#f87171";
  return "#ef4444";
}

/** Full classification metadata */
export function getAbsScoreClassification(score: number, config: AbsenteismoScoreConfig) {
  if (score >= config.score_excellent) return { label: "Excelente", color: "#22c55e", bg: "bg-green-100", text: "text-green-700" };
  if (score >= config.score_good) return { label: "Bom", color: "#84cc16", bg: "bg-lime-100", text: "text-lime-600" };
  if (score >= config.score_warning) return { label: "Atenção", color: "#f97316", bg: "bg-orange-100", text: "text-orange-600" };
  if (score >= config.score_poor) return { label: "Ruim", color: "#f87171", bg: "bg-red-100", text: "text-red-500" };
  return { label: "Crítico", color: "#ef4444", bg: "bg-red-200", text: "text-red-600" };
}

/** Get category for an absence_situation_id */
export function getCategoryForSituation(id: number, config: AbsenteismoScoreConfig): string {
  return config.mapping_semantico[id] ?? "nao_categorizada";
}

/** Volume score label helper */
export function getVolumeScoreLabel(score: number): string {
  if (score >= 100) return "Excelente";
  if (score >= 75) return "Bom";
  if (score >= 50) return "Atenção";
  if (score >= 25) return "Ruim";
  return "Crítico";
}

/** Maturidade score label helper */
export function getMaturidadeScoreLabel(score: number): string {
  return getVolumeScoreLabel(score);
}

// ── Legacy compatibility ──
// These maintain backward compatibility with the old API used by AnalyticsDisciplinaOperacional

/** @deprecated Use computeAbsCompositeScore with 3 sub-scores instead */
export function computeAbsenteeismScore(taxa: number, config: AbsenteismoScoreConfig): number {
  return computeVolumeScore(taxa, config);
}

/** @deprecated Turnover has its own config now */
export function computeTurnoverScore(taxaAnual: number, _config: AbsenteismoScoreConfig): number {
  // Legacy linear interpolation with old defaults
  const excellent = 24;
  const critical = 144;
  if (taxaAnual <= excellent) return 100;
  if (taxaAnual >= critical) return 0;
  return +(100 - ((taxaAnual - excellent) / (critical - excellent)) * 100).toFixed(1);
}

// ── Context ──

interface AbsenteismoScoreConfigContextType {
  config: AbsenteismoScoreConfig;
  setConfig: (config: AbsenteismoScoreConfig) => void;
  saveConfig: () => Promise<void>;
  resetToDefault: (profile?: string) => void;
  loading: boolean;
}

const AbsenteismoScoreConfigContext = createContext<AbsenteismoScoreConfigContextType>({
  config: DEFAULT_ABS_CONFIG,
  setConfig: () => {},
  saveConfig: async () => {},
  resetToDefault: () => {},
  loading: true,
});

export function useAbsenteismoScoreConfig() {
  return useContext(AbsenteismoScoreConfigContext);
}

const ABS_STORAGE_KEY = "score_config_absenteismo_v2";

export function AbsenteismoScoreConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AbsenteismoScoreConfig>(() => {
    try {
      const stored = localStorage.getItem(ABS_STORAGE_KEY);
      if (stored) return { ...DEFAULT_ABS_CONFIG, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_ABS_CONFIG;
  });
  const [loading] = useState(false);

  const saveConfig = useCallback(async () => {
    try {
      localStorage.setItem(ABS_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save absenteismo score config:", e);
    }
  }, [config]);

  const resetToDefault = useCallback((profile?: string) => {
    const p = profile || "vigilancia_facilities";
    const vals = ABS_PROFILES[p] || ABS_PROFILES.vigilancia_facilities;
    setConfig({ profile_type: p as AbsenteismoProfile, ...vals });
    localStorage.removeItem(ABS_STORAGE_KEY);
  }, []);

  return (
    <AbsenteismoScoreConfigContext.Provider value={{ config, setConfig, saveConfig, resetToDefault, loading }}>
      {children}
    </AbsenteismoScoreConfigContext.Provider>
  );
}
