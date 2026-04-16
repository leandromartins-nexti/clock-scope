import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export interface NextiScoreConfig {
  /** Pesos por indicador — devem somar 100 */
  peso_ponto: number;
  peso_absenteismo: number;

  /** Faixas de classificação do score final (0-100) */
  score_excellent: number;
  score_good: number;
  score_warning: number;
  score_poor: number;
}

export const DEFAULT_NEXTI_CONFIG: NextiScoreConfig = {
  peso_ponto: 50,
  peso_absenteismo: 50,
  score_excellent: 85,
  score_good: 70,
  score_warning: 55,
  score_poor: 40,
};

const STORAGE_KEY = "nexti_score_config";

interface ContextType {
  config: NextiScoreConfig;
  setConfig: (next: NextiScoreConfig) => void;
  reset: () => void;
}

const NextiScoreConfigContext = createContext<ContextType>({
  config: DEFAULT_NEXTI_CONFIG,
  setConfig: () => {},
  reset: () => {},
});

export function useNextiScoreConfig() {
  return useContext(NextiScoreConfigContext);
}

export function NextiScoreConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<NextiScoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_NEXTI_CONFIG, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_NEXTI_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  const setConfig = useCallback((next: NextiScoreConfig) => setConfigState(next), []);
  const reset = useCallback(() => setConfigState(DEFAULT_NEXTI_CONFIG), []);

  return (
    <NextiScoreConfigContext.Provider value={{ config, setConfig, reset }}>
      {children}
    </NextiScoreConfigContext.Provider>
  );
}

/** Composição ponderada dos sub-scores (Ponto + Absenteísmo) */
export function computeNextiScore(
  pontoScore: number,
  absenteismoScore: number,
  config: NextiScoreConfig,
): number {
  const total = config.peso_ponto + config.peso_absenteismo;
  if (total <= 0) return 0;
  return Math.round(
    (pontoScore * config.peso_ponto + absenteismoScore * config.peso_absenteismo) / total
  );
}

export function getNextiScoreClassification(score: number, config: NextiScoreConfig) {
  if (score >= config.score_excellent) return { label: "Excelente", color: "#22c55e" };
  if (score >= config.score_good) return { label: "Bom", color: "#84cc16" };
  if (score >= config.score_warning) return { label: "Atenção", color: "#f97316" };
  if (score >= config.score_poor) return { label: "Ruim", color: "#f87171" };
  return { label: "Crítico", color: "#ef4444" };
}
