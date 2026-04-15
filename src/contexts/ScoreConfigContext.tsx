import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

export interface ScoreConfig {
  weight_quality: number;
  weight_treatment: number;
  weight_backoffice: number;
  grade_under_1d: number;
  grade_1_3d: number;
  grade_3_7d: number;
  grade_7_15d: number;
  grade_over_15d: number;
  // Dynamic BO adjustment thresholds & grades (Part 1.1)
  bo_adjustment_thresholds: number[];   // e.g. [200, 400, 700, 1000]
  bo_adjustment_grades: number[];       // e.g. [100, 75, 50, 25, 0] — one more than thresholds
  // HE multiplier (Part 1.2)
  he_multiplier: number;
  // BO sub-component weights (Part 1.3)
  bo_weight_adjustments: number;
  bo_weight_overtime: number;
  // Classification thresholds
  threshold_excellent: number;
  threshold_good: number;
  threshold_warning: number;
  threshold_poor: number;
}

export const DEFAULT_CONFIG: ScoreConfig = {
  weight_quality: 40,
  weight_treatment: 30,
  weight_backoffice: 30,
  grade_under_1d: 100,
  grade_1_3d: 70,
  grade_3_7d: 40,
  grade_7_15d: 15,
  grade_over_15d: 0,
  bo_adjustment_thresholds: [200, 400, 700, 1000],
  bo_adjustment_grades: [100, 75, 50, 25, 0],
  he_multiplier: 2.5,
  bo_weight_adjustments: 50,
  bo_weight_overtime: 50,
  threshold_excellent: 85,
  threshold_good: 70,
  threshold_warning: 55,
  threshold_poor: 40,
};

/** Migrate old config schema to new schema */
function migrateConfig(raw: any): ScoreConfig {
  const cfg = { ...DEFAULT_CONFIG, ...raw };

  // Migrate old fixed BO grade keys to dynamic arrays
  if (raw.grade_bo_under_400 !== undefined && raw.bo_adjustment_thresholds === undefined) {
    cfg.bo_adjustment_thresholds = [400, 700, 1000, 1400];
    cfg.bo_adjustment_grades = [
      raw.grade_bo_under_400 ?? 100,
      raw.grade_bo_400_700 ?? 75,
      raw.grade_bo_700_1000 ?? 50,
      raw.grade_bo_1000_1400 ?? 25,
      raw.grade_bo_over_1400 ?? 0,
    ];
    // Remove old keys
    delete cfg.grade_bo_under_400;
    delete cfg.grade_bo_400_700;
    delete cfg.grade_bo_700_1000;
    delete cfg.grade_bo_1000_1400;
    delete cfg.grade_bo_over_1400;
  }

  if (cfg.he_multiplier === undefined) cfg.he_multiplier = 2;
  if (cfg.bo_weight_adjustments === undefined) {
    cfg.bo_weight_adjustments = 50;
    cfg.bo_weight_overtime = 50;
  }

  return cfg;
}

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
  const [config, setConfigState] = useState<ScoreConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return migrateConfig(JSON.parse(stored));
    } catch {}
    return DEFAULT_CONFIG;
  });
  const [loading] = useState(false);

  // Keep a ref so saveConfig always writes the latest value
  const configRef = React.useRef(config);
  configRef.current = config;

  const setConfig = useCallback((newConfig: ScoreConfig) => {
    setConfigState(newConfig);
    configRef.current = newConfig;
  }, []);

  const saveConfig = useCallback(async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configRef.current));
    } catch (e) {
      console.error("Failed to save score config:", e);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
    } catch {}
  }, [setConfig]);

  return (
    <ScoreConfigContext.Provider value={{ config, setConfig, saveConfig, resetToDefault, loading }}>
      {children}
    </ScoreConfigContext.Provider>
  );
}
