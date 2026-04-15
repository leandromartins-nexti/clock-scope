import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface AbsenteismoScoreConfig {
  profile_type: "vigilancia" | "industria" | "customizado";
  weight_absenteeism: number;
  weight_turnover: number;
  absenteeism_excellent_threshold: number;
  absenteeism_critical_threshold: number;
  turnover_excellent_threshold: number;
  turnover_critical_threshold: number;
  score_excellent: number;
  score_good: number;
  score_warning: number;
  score_poor: number;
}

export const PROFILES: Record<string, Omit<AbsenteismoScoreConfig, "profile_type">> = {
  vigilancia: {
    weight_absenteeism: 65,
    weight_turnover: 35,
    absenteeism_excellent_threshold: 4,
    absenteeism_critical_threshold: 20,
    turnover_excellent_threshold: 24,
    turnover_critical_threshold: 144,
    score_excellent: 85,
    score_good: 70,
    score_warning: 55,
    score_poor: 40,
  },
  industria: {
    weight_absenteeism: 60,
    weight_turnover: 40,
    absenteeism_excellent_threshold: 1.5,
    absenteeism_critical_threshold: 8,
    turnover_excellent_threshold: 12,
    turnover_critical_threshold: 60,
    score_excellent: 85,
    score_good: 70,
    score_warning: 55,
    score_poor: 40,
  },
};

export const DEFAULT_ABS_CONFIG: AbsenteismoScoreConfig = {
  profile_type: "vigilancia",
  ...PROFILES.vigilancia,
};

/** Score de Absenteísmo (0-100) a partir da taxa % */
export function computeAbsenteeismScore(taxa: number, config: AbsenteismoScoreConfig): number {
  if (taxa <= config.absenteeism_excellent_threshold) return 100;
  if (taxa >= config.absenteeism_critical_threshold) return 0;
  const range = config.absenteeism_critical_threshold - config.absenteeism_excellent_threshold;
  return +(100 - ((taxa - config.absenteeism_excellent_threshold) / range) * 100).toFixed(1);
}

/** Score de Turnover (0-100) a partir da taxa anual % */
export function computeTurnoverScore(taxaAnual: number, config: AbsenteismoScoreConfig): number {
  if (taxaAnual <= config.turnover_excellent_threshold) return 100;
  if (taxaAnual >= config.turnover_critical_threshold) return 0;
  const range = config.turnover_critical_threshold - config.turnover_excellent_threshold;
  return +(100 - ((taxaAnual - config.turnover_excellent_threshold) / range) * 100).toFixed(1);
}

/** Score composto da aba */
export function computeAbsCompositeScore(
  absTaxa: number,
  turnoverAnual: number,
  config: AbsenteismoScoreConfig
): { score: number; absScore: number; turnScore: number } {
  const absScore = computeAbsenteeismScore(absTaxa, config);
  const turnScore = computeTurnoverScore(turnoverAnual, config);
  const score = +((absScore * config.weight_absenteeism / 100) + (turnScore * config.weight_turnover / 100)).toFixed(1);
  return { score, absScore, turnScore };
}

/** Classificação por faixa */
export function getAbsScoreClassification(score: number, config: AbsenteismoScoreConfig) {
  if (score >= config.score_excellent) return { label: "Excelente", color: "#16a34a", bg: "bg-green-100", text: "text-green-700" };
  if (score >= config.score_good) return { label: "Bom", color: "#22c55e", bg: "bg-green-50", text: "text-green-600" };
  if (score >= config.score_warning) return { label: "Atenção", color: "#f97316", bg: "bg-orange-100", text: "text-orange-600" };
  if (score >= config.score_poor) return { label: "Ruim", color: "#f87171", bg: "bg-red-100", text: "text-red-500" };
  return { label: "Crítico", color: "#ef4444", bg: "bg-red-200", text: "text-red-600" };
}

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

const ABS_STORAGE_KEY = "score_config_absenteismo";

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
    const p = profile || "vigilancia";
    const vals = PROFILES[p] || PROFILES.vigilancia;
    setConfig({ profile_type: p as any, ...vals });
    localStorage.removeItem(ABS_STORAGE_KEY);
  }, []);

  return (
    <AbsenteismoScoreConfigContext.Provider value={{ config, setConfig, saveConfig, resetToDefault, loading }}>
      {children}
    </AbsenteismoScoreConfigContext.Provider>
  );
}
