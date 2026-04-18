/**
 * InsightsTourContext — orquestra:
 *  1) Hover bidirecional pin↔card (hoveredId compartilhado)
 *  2) Tour guiado auto-play (severity-first, timer ~8s, pause/skip)
 *
 * Consumido por: RightSidebarInsightsPanel (cards), InsightOverlayPins (pins)
 * e InsightsTourOverlay (popover do tour).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { QualidadeInsight } from "@/data/qualidadeInsightsData";

const DEFAULT_STEP_MS = 8000;
const MIN_STEP_MS = 2000;
const MAX_STEP_MS = 30000;
const STORAGE_KEY = "insights_tour_settings_v1";
const SEV_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, info: 3, success: 4 };

function loadSettings(): { stepMs: number; loop: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { stepMs: DEFAULT_STEP_MS, loop: false };
    const p = JSON.parse(raw);
    return {
      stepMs: Math.max(MIN_STEP_MS, Math.min(MAX_STEP_MS, Number(p.stepMs) || DEFAULT_STEP_MS)),
      loop: Boolean(p.loop),
    };
  } catch { return { stepMs: DEFAULT_STEP_MS, loop: false }; }
}

export interface PinPosition { x: number; y: number; }

interface InsightsTourContextValue {
  // Hover sync
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;

  // Pin registry — usado para posicionar popover do tour e filtrar insights "com pin"
  registerPin: (insightId: string, pos: PinPosition) => void;
  unregisterPin: (insightId: string) => void;
  getPinPosition: (insightId: string) => PinPosition | null;
  pinnedIds: Set<string>;

  // Tour
  tourActive: boolean;
  tourPaused: boolean;
  tourIndex: number;
  tourTotal: number;
  tourCurrentInsight: QualidadeInsight | null;
  tourProgress: number; // 0..1 dentro do step atual
  startTour: (insights: QualidadeInsight[]) => void;
  stopTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  nextStep: () => void;
  prevStep: () => void;

  // Settings (persistidos em localStorage)
  stepMs: number;
  setStepMs: (ms: number) => void;
  loop: boolean;
  setLoop: (v: boolean) => void;
}

const Ctx = createContext<InsightsTourContextValue | null>(null);

export function InsightsTourProvider({ children }: { children: ReactNode }) {
  const [hoveredId, setHoveredIdState] = useState<string | null>(null);
  const [queue, setQueue] = useState<QualidadeInsight[]>([]);
  const [tourActive, setTourActive] = useState(false);
  const [tourPaused, setTourPaused] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [tourProgress, setTourProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const stepStartRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const pinPositionsRef = useRef<Map<string, PinPosition>>(new Map());
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const initialSettings = loadSettings();
  const [stepMs, setStepMsState] = useState<number>(initialSettings.stepMs);
  const [loop, setLoopState] = useState<boolean>(initialSettings.loop);

  const persist = useCallback((s: { stepMs: number; loop: boolean }) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
  }, []);
  const setStepMs = useCallback((ms: number) => {
    const clamped = Math.max(MIN_STEP_MS, Math.min(MAX_STEP_MS, ms));
    setStepMsState(clamped);
    persist({ stepMs: clamped, loop });
  }, [loop, persist]);
  const setLoop = useCallback((v: boolean) => {
    setLoopState(v);
    persist({ stepMs, loop: v });
  }, [stepMs, persist]);

  const setHoveredId = useCallback((id: string | null) => setHoveredIdState(id), []);

  const registerPin = useCallback((insightId: string, pos: PinPosition) => {
    const cur = pinPositionsRef.current.get(insightId);
    if (cur && Math.abs(cur.x - pos.x) < 0.5 && Math.abs(cur.y - pos.y) < 0.5) return;
    pinPositionsRef.current.set(insightId, pos);
    setPinnedIds(new Set(pinPositionsRef.current.keys()));
  }, []);

  const unregisterPin = useCallback((insightId: string) => {
    if (!pinPositionsRef.current.has(insightId)) return;
    pinPositionsRef.current.delete(insightId);
    setPinnedIds(new Set(pinPositionsRef.current.keys()));
  }, []);

  const getPinPosition = useCallback((insightId: string) => {
    return pinPositionsRef.current.get(insightId) ?? null;
  }, []);

  const stopTour = useCallback(() => {
    setTourActive(false);
    setTourPaused(false);
    setTourIndex(0);
    setTourProgress(0);
    setQueue([]);
    setHoveredIdState(null);
    accumulatedRef.current = 0;
  }, []);

  const startTour = useCallback((insights: QualidadeInsight[]) => {
    if (!insights.length) return;
    const sorted = [...insights].sort(
      (a, b) => (SEV_RANK[a.severity] ?? 9) - (SEV_RANK[b.severity] ?? 9)
    );
    setQueue(sorted);
    setTourIndex(0);
    setTourProgress(0);
    setTourActive(true);
    setTourPaused(false);
    accumulatedRef.current = 0;
    stepStartRef.current = performance.now();
  }, []);

  const goTo = useCallback((nextIdx: number) => {
    setTourIndex((cur) => {
      const target = Math.max(0, nextIdx);
      if (target >= queue.length) {
        // Acabou
        setTimeout(() => stopTour(), 0);
        return cur;
      }
      return target;
    });
    setTourProgress(0);
    accumulatedRef.current = 0;
    stepStartRef.current = performance.now();
  }, [queue.length, stopTour]);

  const nextStep = useCallback(() => goTo(tourIndex + 1), [goTo, tourIndex]);
  const prevStep = useCallback(() => goTo(Math.max(0, tourIndex - 1)), [goTo, tourIndex]);
  const pauseTour = useCallback(() => {
    if (!tourActive || tourPaused) return;
    accumulatedRef.current += performance.now() - stepStartRef.current;
    setTourPaused(true);
  }, [tourActive, tourPaused]);
  const resumeTour = useCallback(() => {
    if (!tourActive || !tourPaused) return;
    stepStartRef.current = performance.now();
    setTourPaused(false);
  }, [tourActive, tourPaused]);

  // Sincroniza hover com o insight atual do tour
  useEffect(() => {
    if (tourActive && queue[tourIndex]) {
      setHoveredIdState(queue[tourIndex].id);
    }
  }, [tourActive, tourIndex, queue]);

  // Loop de animação do progresso + auto-advance
  useEffect(() => {
    if (!tourActive || tourPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      const elapsed = accumulatedRef.current + (performance.now() - stepStartRef.current);
      const p = Math.min(1, elapsed / stepMs);
      setTourProgress(p);
      if (p >= 1) {
        if (tourIndex + 1 >= queue.length) {
          if (loop && queue.length > 0) {
            setTourIndex(0);
            setTourProgress(0);
            accumulatedRef.current = 0;
            stepStartRef.current = performance.now();
          } else {
            stopTour();
            return;
          }
        } else {
          setTourIndex((i) => i + 1);
          setTourProgress(0);
          accumulatedRef.current = 0;
          stepStartRef.current = performance.now();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tourActive, tourPaused, tourIndex, queue.length, stopTour, stepMs, loop]);

  // ESC encerra o tour
  useEffect(() => {
    if (!tourActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopTour();
      else if (e.key === "ArrowRight") nextStep();
      else if (e.key === "ArrowLeft") prevStep();
      else if (e.key === " ") {
        e.preventDefault();
        tourPaused ? resumeTour() : pauseTour();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourActive, tourPaused, stopTour, nextStep, prevStep, pauseTour, resumeTour]);

  const value = useMemo<InsightsTourContextValue>(() => ({
    hoveredId,
    setHoveredId,
    registerPin,
    unregisterPin,
    getPinPosition,
    pinnedIds,
    tourActive,
    tourPaused,
    tourIndex,
    tourTotal: queue.length,
    tourCurrentInsight: queue[tourIndex] ?? null,
    tourProgress,
    startTour,
    stopTour,
    pauseTour,
    resumeTour,
    nextStep,
    prevStep,
    stepMs,
    setStepMs,
    loop,
    setLoop,
  }), [hoveredId, setHoveredId, registerPin, unregisterPin, getPinPosition, pinnedIds, tourActive, tourPaused, tourIndex, queue, tourProgress, startTour, stopTour, pauseTour, resumeTour, nextStep, prevStep, stepMs, setStepMs, loop, setLoop]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInsightsTour() {
  const v = useContext(Ctx);
  if (!v) {
    // Safe no-op default — permite componentes funcionarem fora do provider
    return {
      hoveredId: null,
      setHoveredId: () => {},
      registerPin: () => {},
      unregisterPin: () => {},
      getPinPosition: () => null,
      pinnedIds: new Set<string>(),
      tourActive: false,
      tourPaused: false,
      tourIndex: 0,
      tourTotal: 0,
      tourCurrentInsight: null,
      tourProgress: 0,
      startTour: () => {},
      stopTour: () => {},
      pauseTour: () => {},
      resumeTour: () => {},
      nextStep: () => {},
      prevStep: () => {},
      stepMs: DEFAULT_STEP_MS,
      setStepMs: () => {},
      loop: false,
      setLoop: () => {},
    } as InsightsTourContextValue;
  }
  return v;
}
