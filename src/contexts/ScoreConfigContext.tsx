import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface ScoreConfig {
  weight_quality: number;
  weight_treatment: number;
  weight_backoffice: number;
  grade_under_1d: number;
  grade_1_3d: number;
  grade_3_7d: number;
  grade_7_15d: number;
  grade_over_15d: number;
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
  weight_quality: 50,
  weight_treatment: 30,
  weight_backoffice: 20,
  grade_under_1d: 100,
  grade_1_3d: 75,
  grade_3_7d: 50,
  grade_7_15d: 20,
  grade_over_15d: 0,
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

// Re-export computation functions from the dedicated module
export {
  computeQualityPercentage,
  computeTreatmentScore,
  computeBackofficeScore,
  computeCompositeScore,
  computeFullBreakdown,
  computePrevTriScore,
} from "@/lib/scoreComputations";

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

const STORAGE_KEY = "score_config_qualidade_ponto";

export function ScoreConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ScoreConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_CONFIG;
  });
  const [loading] = useState(false);

  const saveConfig = useCallback(async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save score config:", e);
    }
  }, [config]);

  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ScoreConfigContext.Provider value={{ config, setConfig, saveConfig, resetToDefault, loading }}>
      {children}
    </ScoreConfigContext.Provider>
  );
}
