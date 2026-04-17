import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { getScoreColor, getScoreBg, getLineColor } from "@/components/analytics/IndicatorTable";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import { useNavigate } from "react-router-dom";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import { aggregateQualidadeEvolucao, getSidebarItems, getQualidadeKpiSummary, formatMesLabel } from "@/lib/ajustesData";
import { useScoreConfig, getScoreClassification, computeCompositeScore } from "@/contexts/ScoreConfigContext";
import { useQualidadePontoData } from "@/hooks/useQualidadePontoData";
import { buildDataSources } from "@/lib/qualidadeDataSources";
import { computePrevTriScore, computeQualityPercentage, computeTreatmentScore, computeBackofficeScore } from "@/lib/scoreComputations";
import { useAbsenteismoScoreConfig } from "@/contexts/AbsenteismoScoreConfigContext";
import {
  computeAbsenteismoEvolution,
  computeAbsenteismoCurrentScore,
  computeVolumeScoreForMonth,
  computeComposicaoScoreForMonth,
  computeMaturidadeScoreForMonth,
  type AbsGroupBy,
} from "@/lib/absenteismoScoreShared";
import {
  useNextiScoreConfig,
  computeNextiScore,
  getNextiScoreClassification,
} from "@/contexts/NextiScoreConfigContext";
import {
  Filter, Eraser, DollarSign, CheckCircle, Rocket, Clock, UserX,
  TrendingDown, ArrowLeftRight, ShieldCheck,
} from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import InsightsCenter from "@/components/analytics/InsightsCenter";
import AnalyticsChat from "@/components/analytics/AnalyticsChat";

import {
  ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip,
} from "recharts";
import IndicatorTableVariants from "@/components/analytics/IndicatorTableVariants";
import turnoverDecomposicao from "@/data/turnover/decomposicao-score.json";
import { coberturas as coberturasMock } from "@/lib/analytics-mock-data";

// ── Custom sparkline tooltip ────────────────────────────────
function SparklineTooltip({ active, payload, cardData }: any) {
  if (!active || !payload?.length) return null;
  const valor = payload[0].value as number;
  const comp = payload[0].payload.competencia as string;
  const evolucao = cardData.evolucao as { competencia: string; valor: number }[];
  const idx = evolucao.findIndex((e) => e.competencia === comp);
  const prev = idx > 0 ? evolucao[idx - 1] : null;
  const next = idx < evolucao.length - 1 ? evolucao[idx + 1] : null;
  const fmt = (v: number) => `${v}`;
  const pointColor = getLineColor(valor);
  const subScores: { label: string; value: number }[] | undefined =
    cardData.subScoresByMonth?.[comp];
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2.5 text-xs min-w-[180px] z-[9999] relative">
      <p className="font-semibold text-foreground mb-2">{comp}</p>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pointColor }} />
        <span className="text-muted-foreground">{cardData.label}:</span>
        <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${getScoreColor(valor)} ${getScoreBg(valor)}`}>Score {valor}</span>
      </div>
      {subScores && subScores.length > 0 && (
        <div className="border-t border-border/50 pt-2 pb-1 mb-1 space-y-1">
          {subScores.map((s) => (
            <div key={s.label} className="flex justify-between gap-3">
              <span className="text-muted-foreground">{s.label}:</span>
              <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${getScoreColor(s.value)} ${getScoreBg(s.value)}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}
      <div className="border-t border-border/50 pt-2 space-y-1">
        {prev && (() => {
          const d = valor - prev.valor;
          const sign = d > 0 ? '+' : '';
          const color = d >= 0 ? 'text-green-600' : 'text-red-500';
          return (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{prev.competencia}:</span>
              <span className={`font-medium ${color}`}>{fmt(prev.valor)} ({sign}{d.toFixed(1)})</span>
            </div>
          );
        })()}
        {next && (() => {
          const d = next.valor - valor;
          const sign = d > 0 ? '+' : '';
          const color = d >= 0 ? 'text-green-600' : 'text-red-500';
          return (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{next.competencia}:</span>
              <span className={`font-medium ${color}`}>{fmt(next.valor)} ({sign}{d.toFixed(1)})</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ── Draggable bracket over sparkline (3-month window) ───────
interface BracketCard {
  evolucao: { competencia: string; valor: number }[];
  score: number;
  forceColor?: string;
  componentsPonto?: { competencia: string; valor: number }[];
  componentsAbs?: { competencia: string; valor: number }[];
  recomputeNexti?: (avgPonto: number, avgAbs: number) => number;
  /** Recalcula score agregando a janela exatamente como o gauge superior. */
  computeWindowScore?: (startIdx: number, endIdxExclusive: number) => number;
}
function DraggableBracket({
  card,
  interactive = true,
  startIdx: controlledStartIdx,
  onStartIdxChange,
}: {
  card: BracketCard;
  interactive?: boolean;
  startIdx?: number;
  onStartIdxChange?: (idx: number) => void;
}) {
  const total = card.evolucao.length;
  const windowSize = 3;
  const maxStart = total - windowSize;
  const [internalStartIdx, setInternalStartIdx] = useState(maxStart);
  const startIdx = controlledStartIdx ?? internalStartIdx;
  const setStartIdx = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? (updater as (p: number) => number)(startIdx) : updater;
    if (controlledStartIdx !== undefined) onStartIdxChange?.(next);
    else setInternalStartIdx(next);
  };
  const [dragging, setDragging] = useState(false);
  const [released, setReleased] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const suppressRowClickRef = useRef(false);
  const dragStateRef = useRef<{
    originX: number;
    originStart: number;
    moved: boolean;
  } | null>(null);

  const denom = Math.max(1, total - 1);
  const startPct = (startIdx / denom) * 100;
  const endPct = ((startIdx + windowSize - 1) / denom) * 100;
  const leftPct = startPct;
  const widthPct = endPct - startPct;
  const windowMonths = card.evolucao.slice(startIdx, startIdx + windowSize);
  const avgScore = (() => {
    if (card.computeWindowScore) {
      return Math.round(card.computeWindowScore(startIdx, startIdx + windowSize));
    }
    if (card.recomputeNexti && card.componentsPonto && card.componentsAbs) {
      const pSlice = card.componentsPonto.slice(startIdx, startIdx + windowSize);
      const aSlice = card.componentsAbs.slice(startIdx, startIdx + windowSize);
      const avgP = pSlice.reduce((s, x) => s + x.valor, 0) / Math.max(1, pSlice.length);
      const avgA = aSlice.reduce((s, x) => s + x.valor, 0) / Math.max(1, aSlice.length);
      return Math.round(card.recomputeNexti(avgP, avgA));
    }
    return Math.round(windowMonths.reduce((sum, point) => sum + point.valor, 0) / windowMonths.length);
  })();
  const scoreColor = card.forceColor ?? getLineColor(avgScore);
  const highlightGlow = dragging || hovered;

  const stopEvent = useCallback((event: Event | React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    stopEvent(e);
    suppressRowClickRef.current = false;
    dragStateRef.current = {
      originX: e.clientX,
      originStart: startIdx,
      moved: false,
    };
    setDragging(true);
    setReleased(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [startIdx, stopEvent]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragStateRef.current || !containerRef.current?.parentElement) return;

    const parentWidth = containerRef.current.parentElement.getBoundingClientRect().width;
    const stepPx = parentWidth / Math.max(1, total - 1);
    const deltaX = e.clientX - dragStateRef.current.originX;
    const deltaSteps = Math.round(deltaX / stepPx);
    const next = Math.min(maxStart, Math.max(0, dragStateRef.current.originStart + deltaSteps));

    if (Math.abs(deltaX) > 4) {
      dragStateRef.current.moved = true;
      suppressRowClickRef.current = true;
    }

    setStartIdx((prev) => (prev === next ? prev : next));
  }, [maxStart, total]);

  const finishDrag = useCallback(() => {
    if (!dragStateRef.current) return;

    const didMove = dragStateRef.current.moved;
    dragStateRef.current = null;
    setDragging(false);
    setReleased(didMove);

    if (didMove) {
      window.setTimeout(() => {
        suppressRowClickRef.current = false;
      }, 320);
    }
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: PointerEvent) => onPointerMove(e);
    const handleUp = () => finishDrag();
    const handleCancel = () => finishDrag();

    window.addEventListener("pointermove", handleMove, { capture: true });
    window.addEventListener("pointerup", handleUp, { capture: true });
    window.addEventListener("pointercancel", handleCancel, { capture: true });

    return () => {
      window.removeEventListener("pointermove", handleMove, { capture: true });
      window.removeEventListener("pointerup", handleUp, { capture: true });
      window.removeEventListener("pointercancel", handleCancel, { capture: true });
    };
  }, [dragging, finishDrag, onPointerMove]);

  useEffect(() => {
    if (!released) return;
    const t = window.setTimeout(() => setReleased(false), 2500);
    return () => window.clearTimeout(t);
  }, [released, startIdx]);

  return (
    <div
      ref={containerRef}
      data-block-row-click="true"
      className="absolute -top-[14px] z-20 select-none"
      style={{
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        height: 14,
        transition: dragging ? "none" : "left 260ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onPointerDown={interactive ? onPointerDown : (e) => { stopEvent(e); }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(e) => { stopEvent(e); }}
    >
      <div
        className="absolute inset-x-0 top-[2px] bottom-0 rounded-sm"
        style={{
          background: highlightGlow ? `linear-gradient(180deg, ${scoreColor}1A 0%, transparent 100%)` : "transparent",
          boxShadow: highlightGlow ? `0 0 0 1px ${scoreColor}30 inset` : "none",
          transition: "background 180ms ease, box-shadow 180ms ease",
        }}
      />

      <svg
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        className={`absolute inset-0 h-full w-full ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          touchAction: "none",
          filter: highlightGlow
            ? `drop-shadow(0 0 10px ${scoreColor}55) drop-shadow(0 4px 10px rgba(0,0,0,0.16))`
            : "none",
          transform: dragging ? "translateY(-1px) scale(1.03)" : hovered ? "translateY(-1px)" : "none",
          transition: dragging ? "filter 120ms ease" : "filter 180ms ease, transform 180ms ease",
        }}
      >
        <path
          d="M 1 13 L 1 3 L 50 3 L 50 1 L 50 3 L 99 3 L 99 13"
          stroke={highlightGlow ? scoreColor : "#B8B2AC"}
          strokeWidth={dragging ? 3.1 : 2.5}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
          style={{ transition: "stroke 180ms ease, stroke-width 180ms ease" }}
        />
      </svg>

      <div
        className="absolute -top-[11px] z-20 pointer-events-none"
        style={{
          left: "50%",
          transform: `translateX(-50%) scale(${dragging ? 1.14 : hovered ? 1.06 : 1})`,
          transition: "transform 180ms ease",
        }}
      >
        <span
          className="text-[10px] font-bold px-2 py-[2px] rounded-sm shadow-md whitespace-nowrap"
          style={{
            backgroundColor: "#ffffff",
            color: getLineColor(avgScore),
            border: `2px solid ${highlightGlow ? scoreColor : "#B8B2AC"}`,
            boxShadow: highlightGlow ? `0 6px 16px ${scoreColor}33` : undefined,
            transition: "color 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
          }}
        >
          {avgScore}
        </span>
      </div>

      {((released && !dragging) || (hovered && !dragging)) && (
        <div
          className="absolute z-30 pointer-events-none animate-in fade-in slide-in-from-top-1"
          style={{ top: -82, left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="relative bg-card border border-border rounded-lg shadow-xl px-3 py-2 text-[10px] whitespace-nowrap">
            <div className="font-semibold text-foreground mb-1 text-center">
              Média 3 meses: <span style={{ color: scoreColor }}>{avgScore}</span>
            </div>
            <div className="flex items-center gap-2">
              {windowMonths.map((m) => {
                // Interpolação linear contínua entre as paradas de cor (55→85)
                const stops = [
                  { v: 55, c: [220, 38, 38] },   // #dc2626
                  { v: 65, c: [234, 88, 12] },   // #ea580c
                  { v: 75, c: [202, 138, 4] },   // #ca8a04
                  { v: 85, c: [101, 163, 13] },  // #65a30d
                  { v: 100, c: [22, 163, 74] },  // #16a34a
                ];
                const v = Math.max(stops[0].v, Math.min(stops[stops.length - 1].v, m.valor));
                let bg = `rgb(${stops[0].c.join(",")})`;
                for (let i = 0; i < stops.length - 1; i++) {
                  if (v >= stops[i].v && v <= stops[i + 1].v) {
                    const t = (v - stops[i].v) / (stops[i + 1].v - stops[i].v);
                    const r = Math.round(stops[i].c[0] + (stops[i + 1].c[0] - stops[i].c[0]) * t);
                    const g = Math.round(stops[i].c[1] + (stops[i + 1].c[1] - stops[i].c[1]) * t);
                    const b = Math.round(stops[i].c[2] + (stops[i + 1].c[2] - stops[i].c[2]) * t);
                    bg = `rgb(${r},${g},${b})`;
                    break;
                  }
                }
                return (
                  <div key={m.competencia} className="flex flex-col items-center">
                    <span className="text-muted-foreground">{m.competencia.replace("/20", "/")}</span>
                    <span
                      className="font-bold px-1.5 py-0.5 rounded mt-0.5 text-white"
                      style={{ backgroundColor: bg }}
                    >
                      {m.valor}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-card border-r border-b border-border" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function AnalyticsResumoExecutivo() {
  const navigate = useNavigate();
  const { config: scoreConfig } = useScoreConfig();
  const { data: customerData } = useQualidadePontoData();
  const sources = useMemo(() => buildDataSources(customerData), [customerData]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");
  const { config: absConfig } = useAbsenteismoScoreConfig();
  const { config: nextiConfig } = useNextiScoreConfig();
  const [bracketStartIdx, setBracketStartIdx] = useState<number | null>(null);

  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };
  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true);
    setFeedbackComment("");
    setRating(null);
  };

  const sidebarItems = useMemo(() => getSidebarItems(groupBy), [groupBy]);
  const sidebarSelected = sidebarItems.find(item => item.nome === selectedRegional) ?? null;

  const chartGroupBy: AbsGroupBy = groupBy === "unidade" ? "unidade" : groupBy === "empresa" ? "empresa" : "area";

  const pontoScore = useMemo(
    () => computeCompositeScore(selectedRegional, groupBy as any, scoreConfig, undefined, sources),
    [selectedRegional, groupBy, scoreConfig, sources]
  );
  const absenteismoScore = useMemo(
    () => computeAbsenteismoCurrentScore(selectedRegional, chartGroupBy, absConfig),
    [selectedRegional, chartGroupBy, absConfig]
  );
  // Score Nexti exibido no gauge: usa o último trimestre (3 meses finais), agregando
  // os componentes Ponto e Absenteísmo da mesma forma que o bracket inicial.
  const activeScore = useMemo(() => {
    // Calcula média de ponto e absenteísmo dos últimos 3 meses
    const months = [
      "2025-04-01","2025-05-01","2025-06-01","2025-07-01","2025-08-01","2025-09-01",
      "2025-10-01","2025-11-01","2025-12-01","2026-01-01","2026-02-01","2026-03-01",
    ];
    const last3 = months.slice(-3);
    const absEvolution = computeAbsenteismoEvolution(selectedRegional, chartGroupBy, absConfig);
    const pontoAvg = last3.reduce((sum, m) => sum + computeCompositeScore(selectedRegional, groupBy as any, scoreConfig, [m], sources), 0) / 3;
    const absAvg = last3.reduce((sum, m) => sum + (absEvolution.find(a => a.month === m)?.score ?? 0), 0) / 3;
    return Math.round(computeNextiScore(pontoAvg, absAvg, nextiConfig));
  }, [selectedRegional, groupBy, scoreConfig, sources, chartGroupBy, absConfig, nextiConfig]);
  const scoreClassif = getNextiScoreClassification(activeScore, nextiConfig);

  // Monthly composite score series for Ponto and Absenteísmo (mesma escala do badge "Score" da coluna).
  const groupedEvolution = useMemo(() => {
    const months = [
      "2025-04-01","2025-05-01","2025-06-01","2025-07-01","2025-08-01","2025-09-01",
      "2025-10-01","2025-11-01","2025-12-01","2026-01-01","2026-02-01","2026-03-01",
    ];
    const abs = computeAbsenteismoEvolution(selectedRegional, chartGroupBy, absConfig);

    return months.map((m) => {
      const pontoMonth = computeCompositeScore(selectedRegional, groupBy as any, scoreConfig, [m], sources);
      const absMatch = abs.find((a) => a.month === m);
      // Sub-componentes Ponto
      const qualPct = computeQualityPercentage(selectedRegional, groupBy as any, [m], sources);
      const treat = computeTreatmentScore(selectedRegional, groupBy as any, scoreConfig, [m], sources);
      const bo = computeBackofficeScore(selectedRegional, groupBy as any, scoreConfig, [m], sources);
      // Sub-componentes Absenteísmo
      const volScore = computeVolumeScoreForMonth(m, selectedRegional, chartGroupBy, absConfig);
      const compScore = computeComposicaoScoreForMonth(m, selectedRegional, chartGroupBy, absConfig);
      const matScore = computeMaturidadeScoreForMonth(m, selectedRegional, chartGroupBy, absConfig);
      return {
        competencia: formatMesLabel(m),
        ponto: Math.round(pontoMonth),
        absenteismo: absMatch?.score ?? 0,
        pontoSubs: [
          { label: "Qualidade", value: Math.round(qualPct) },
          { label: "Tratativa", value: Math.round(treat.score) },
          { label: "Back-office", value: Math.round(bo.score) },
        ],
        absSubs: [
          { label: "Volume", value: Math.round(volScore) },
          { label: "Composição", value: Math.round(compScore) },
          { label: "Maturidade", value: Math.round(matScore) },
        ],
      };
    });
  }, [selectedRegional, groupBy, sources, chartGroupBy, absConfig, scoreConfig]);

  const sparklineCards = useMemo(() => {
    const pontoSeries = groupedEvolution.map((m) => ({ competencia: m.competencia, valor: m.ponto }));
    const absSeries = groupedEvolution.map((m) => ({ competencia: m.competencia, valor: m.absenteismo }));
    const nextiSeries = groupedEvolution.map((m) => ({
      competencia: m.competencia,
      valor: Math.round(computeNextiScore(m.ponto, m.absenteismo, nextiConfig)),
    }));
    const pontoSubsByMonth: Record<string, { label: string; value: number }[]> = {};
    const absSubsByMonth: Record<string, { label: string; value: number }[]> = {};
    const nextiSubsByMonth: Record<string, { label: string; value: number }[]> = {};
    groupedEvolution.forEach((m) => {
      pontoSubsByMonth[m.competencia] = m.pontoSubs;
      absSubsByMonth[m.competencia] = m.absSubs;
      nextiSubsByMonth[m.competencia] = [
        { label: "Ponto", value: m.ponto },
        { label: "Absenteísmo", value: m.absenteismo },
      ];
    });
    const makeDelta = (series: { valor: number }[]) => {
      const prev = series[series.length - 2]?.valor ?? series[series.length - 1]?.valor ?? 0;
      const curr = series[series.length - 1]?.valor ?? 0;
      const d = curr - prev;
      const sign = d > 0 ? "+" : "";
      return {
        variacao: `${sign}${d}`,
        corVariacao: d > 0 ? "text-green-600" : d < 0 ? "text-red-600" : "text-gray-600",
      };
    };
    const n = makeDelta(nextiSeries);
    const p = makeDelta(pontoSeries);
    const a = makeDelta(absSeries);
    const nextiLast = nextiSeries[nextiSeries.length - 1]?.valor ?? 0;
    const pontoLast = pontoSeries[pontoSeries.length - 1]?.valor ?? 0;
    const absLast = absSeries[absSeries.length - 1]?.valor ?? 0;
    return [
      {
        label: "Score Nexti",
        evolucao: nextiSeries,
        score: nextiLast,
        variacao: n.variacao,
        corVariacao: n.corVariacao,
        perPointColors: true,
        forceColor: undefined as string | undefined,
        highlight: true,
        componentsPonto: pontoSeries,
        componentsAbs: absSeries,
        recomputeNexti: (avgP: number, avgA: number) =>
          computeNextiScore(avgP, avgA, nextiConfig),
        subScoresByMonth: nextiSubsByMonth,
      },
      {
        label: "Ponto",
        evolucao: pontoSeries,
        score: pontoLast,
        variacao: p.variacao,
        corVariacao: p.corVariacao,
        perPointColors: true,
        subScoresByMonth: pontoSubsByMonth,
      },
      {
        label: "Absenteísmo",
        evolucao: absSeries,
        score: absLast,
        variacao: a.variacao,
        corVariacao: a.corVariacao,
        perPointColors: true,
        subScoresByMonth: absSubsByMonth,
      },
      ...(() => {
        // Scores reais (último mês) vindos das mesmas fontes usadas nas abas Operacional.
        const turnoverScoreReal = turnoverDecomposicao.score_composto; // 79
        const coberturasScoreReal = coberturasMock.scoreEficiencia;    // 74
        const movimentacoesScoreReal = 65;                              // sem fonte real ainda

        // Gera série de 12m que converge no score real, com leve ondulação para visual.
        const seriesEndingAt = (target: number, seed: number, amp: number) =>
          groupedEvolution.map((m, i) => {
            const n = groupedEvolution.length;
            const wave = Math.sin((i + seed) * 0.7) * amp + Math.cos((i + seed) * 0.3) * (amp / 2);
            // Pondera para terminar exatamente em `target` no último mês
            const weight = i / Math.max(1, n - 1);
            const drift = (1 - weight) * (wave - amp * 0.2);
            const v = i === n - 1 ? target : Math.round(target + drift);
            return { competencia: m.competencia, valor: Math.max(0, Math.min(100, v)) };
          });

        const turnoverSeries = seriesEndingAt(turnoverScoreReal, 1, 6);
        const movSeries = seriesEndingAt(movimentacoesScoreReal, 3, 8);
        const cobSeries = seriesEndingAt(coberturasScoreReal, 5, 5);
        const t = makeDelta(turnoverSeries);
        const mv = makeDelta(movSeries);
        const cb = makeDelta(cobSeries);

        // Sub-scores Turnover por mês (Anual + Precoce do JSON real, repetidos como contexto)
        const turnoverSubsByMonth: Record<string, { label: string; value: number }[]> = {};
        turnoverSeries.forEach((pt) => {
          turnoverSubsByMonth[pt.competencia] = [
            { label: "Turnover Anual", value: turnoverDecomposicao.componentes[0]?.nota ?? 0 },
            { label: "Turnover Precoce", value: turnoverDecomposicao.componentes[1]?.nota ?? 0 },
          ];
        });

        return [
          {
            label: "Turnover",
            evolucao: turnoverSeries,
            score: turnoverScoreReal,
            variacao: t.variacao,
            corVariacao: t.corVariacao,
            perPointColors: true,
            forceColor: undefined as string | undefined,
            highlight: false,
            subScoresByMonth: turnoverSubsByMonth,
          },
          {
            label: "Movimentações",
            evolucao: movSeries,
            score: movimentacoesScoreReal,
            variacao: mv.variacao,
            corVariacao: mv.corVariacao,
            perPointColors: true,
            forceColor: undefined as string | undefined,
            highlight: false,
          },
          {
            label: "Coberturas",
            evolucao: cobSeries,
            score: coberturasScoreReal,
            variacao: cb.variacao,
            corVariacao: cb.corVariacao,
            perPointColors: true,
            forceColor: undefined as string | undefined,
            highlight: false,
          },
        ];
      })(),
    ];
  }, [groupedEvolution, nextiConfig]);

  const kpiSummary = useMemo(
    () => getQualidadeKpiSummary(selectedRegional, groupBy, scoreConfig, null, sources),
    [selectedRegional, groupBy, scoreConfig, sources]
  );

  // Previous period score for trend
  const prevScore = useMemo(
    () => computePrevTriScore(selectedRegional, groupBy as any, scoreConfig, sources),
    [selectedRegional, groupBy, scoreConfig, sources]
  );
  // (activeScore/scoreClassif/scoreDiff são definidos abaixo, após o cálculo do Absenteísmo)

  // Principal Melhora / Piora: entity with biggest positive/negative score change
  const { principalMelhora, principalPiora } = useMemo(() => {
    if (sidebarItems.length <= 1) {
      return {
        principalMelhora: { nome: "-", detalhe: "" },
        principalPiora: { nome: "-", detalhe: "" },
      };
    }

    let bestDelta = -Infinity, bestName = "-", bestDetail = "";
    let worstDelta = Infinity, worstName = "-", worstDetail = "";

    for (const item of sidebarItems) {
      const current = computeCompositeScore(item.nome, groupBy as any, scoreConfig, undefined, sources);
      const prev = computePrevTriScore(item.nome, groupBy as any, scoreConfig, sources);
      const delta = current - prev;
      if (delta > bestDelta) {
        bestDelta = delta;
        bestName = item.nome;
        bestDetail = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} pts`;
      }
      if (delta < worstDelta) {
        worstDelta = delta;
        worstName = item.nome;
        worstDetail = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} pts`;
      }
    }

    return {
      principalMelhora: { nome: bestName, detalhe: bestDetail },
      principalPiora: { nome: worstName, detalhe: worstDetail },
    };
  }, [sidebarItems, groupBy, scoreConfig, sources]);

  const scoreDiff = activeScore - prevScore;
  const scoreDiffLabel = `${scoreDiff > 0 ? "+" : ""}${scoreDiff.toFixed(1)} pts vs trim. anterior`;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="bg-white px-3 sm:px-6 py-3 border-b border-border flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
          <span className="font-semibold text-foreground hidden sm:inline text-sm">Filtros Aplicados:</span>
          <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap">Período: abr/2025 – mar/2026</span>
          {sidebarSelected && (
            <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap">{sidebarSelected.nome}</span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => { setSelectedRegional(null); setGroupBy("unidade"); }}
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline"
          >
            <Eraser className="w-4 h-4" /> Limpar Filtros
          </button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <button
            onClick={() => setFilterOpen(true)}
            className="sm:hidden text-muted-foreground hover:text-foreground p-1.5 rounded-md transition-colors"
            aria-label="Abrir filtros"
          >
            <Filter className="w-4 h-4" />
          </button>
          <InsightsCenter />
          <AnalyticsChat activeTab="resumo" />
        </div>
      </div>

      {/* Content: main + sidebar */}
      <div className="flex-1 flex min-h-0">
        {/* Main content */}
        <div className="flex-1 min-w-0 px-3 sm:pl-6 sm:pr-4 py-4 pb-24 sm:pb-4 space-y-3 overflow-y-auto">

          {/* ═══ Linha 1: Score Compacto + 4 KPI Cards ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div
              data-onboarding="score-operacional"
              className="rounded-xl border border-[#FF5722]/20 bg-[#F5F0E6] p-[2px] [&>div]:bg-[#F5F0E6] [&>div]:border-transparent"
              style={{ boxShadow: '0 -4px 8px -4px rgba(255,87,34,0.25), 0 4px 8px -4px rgba(255,87,34,0.25)' }}
            >
              <ScoreBoard title="Score Nexti" tooltip="Score consolidado da operação, calculado pela média ponderada dos sub-scores de Ponto e Absenteísmo. Configure os pesos em Configuração → Scores → Score Nexti.">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex flex-col items-center gap-0 cursor-pointer" title="Ver decomposição do score">
                      <ScoreGauge score={activeScore} label={`${activeScore}`} faixa={scoreClassif.label} color={scoreClassif.color} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" side="bottom" align="start">
                    <div className="p-3 border-b border-border/50">
                      <p className="text-sm font-semibold">Como o Score {activeScore} foi calculado</p>
                    </div>
                    <div className="p-3 space-y-3">
                      {(() => {
                        const turnoverReal = turnoverDecomposicao.score_composto;
                        const coberturasReal = coberturasMock.scoreEficiencia;
                        const movimentacoesReal = 65;
                        const componentes = [
                          { label: "Score de Ponto", valor: pontoScore, peso: nextiConfig.peso_ponto, bench: 75, informativo: false },
                          { label: "Score de Absenteísmo", valor: absenteismoScore, peso: nextiConfig.peso_absenteismo, bench: 70, informativo: false },
                          { label: "Score de Turnover", valor: turnoverReal, peso: 0, bench: 70, informativo: true },
                          { label: "Score de Movimentações", valor: movimentacoesReal, peso: 0, bench: 70, informativo: true },
                          { label: "Score de Coberturas", valor: coberturasReal, peso: 0, bench: 75, informativo: true },
                        ];
                        return componentes.map((c) => {
                          const contrib = +(c.valor * c.peso / 100).toFixed(1);
                          const cor = c.valor >= 80 ? "#22c55e" : c.valor >= 60 ? "#d4a017" : "#ef4444";
                          const barWidth = Math.max((contrib / Math.max(activeScore, 1)) * 100, 4);
                          const benchDelta = c.valor - c.bench;
                          const benchSign = benchDelta > 0 ? "+" : "";
                          const benchColor = benchDelta >= 0 ? "text-green-600" : "text-red-600";
                          return (
                            <div key={c.label} className={`space-y-1 group ${c.informativo ? "opacity-70" : ""}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium flex items-center gap-1.5">
                                  {c.label}
                                  {c.informativo && (
                                    <span className="text-[8px] font-semibold uppercase tracking-wide bg-muted text-muted-foreground px-1 py-0.5 rounded">informativo</span>
                                  )}
                                </span>
                                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ backgroundColor: cor }}>{c.valor}</span>
                              </div>
                              <div
                                className="h-2 bg-muted/50 rounded-md overflow-hidden border border-border/40 transition-colors"
                                ref={(el) => {
                                  if (!el) return;
                                  const parent = el.parentElement;
                                  if (!parent || (parent as any).__hoverBound) return;
                                  (parent as any).__hoverBound = true;
                                  parent.addEventListener('mouseenter', () => { el.style.borderColor = cor; });
                                  parent.addEventListener('mouseleave', () => { el.style.borderColor = ''; });
                                }}
                              >
                                <div className="h-full rounded-md transition-all" style={{ width: `${barWidth}%`, backgroundColor: cor }} />
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  Bench. setor:
                                  <span
                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white"
                                    style={{ backgroundColor: c.bench >= 80 ? "#22c55e" : c.bench >= 60 ? "#eab308" : "#ef4444" }}
                                  >
                                    {c.bench}
                                  </span>
                                </span>
                                <span className={`font-medium ${benchColor}`}>{benchSign}{benchDelta} vs setor</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                      <div className="border-t border-border/50 pt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">Score composto</span>
                          <span className="text-sm font-bold" style={{ color: scoreClassif.color }}>
                            {activeScore} ({scoreClassif.label})
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>Benchmark do setor (Vigilância/Facilities)</span>
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white"
                            style={{ backgroundColor: 72 >= 80 ? "#22c55e" : 72 >= 60 ? "#eab308" : "#ef4444" }}
                          >
                            72
                          </span>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </ScoreBoard>
            </div>
            <KPIBoard
              title="Melhor Operação"
              tooltip="Operação com maior score composto (média dos últimos 3 meses) no período selecionado"
              value={kpiSummary.melhorOperacao.nome}
              valueColor="text-green-600"
              subtitle={`Score ${kpiSummary.melhorOperacao.score}`}
            />
            <KPIBoard
              title="Maior Risco"
              tooltip="Operação com menor score composto (média dos últimos 3 meses) no período selecionado"
              value={kpiSummary.maiorRisco.nome}
              valueColor="text-red-600"
              subtitle={`Score ${kpiSummary.maiorRisco.score}`}
            />
            {(() => {
              const indicadores = sparklineCards.filter((c) => !c.highlight);
              const best = indicadores.reduce((a, b) => (b.score > a.score ? b : a), indicadores[0]);
              const worst = indicadores.reduce((a, b) => (b.score < a.score ? b : a), indicadores[0]);
              return (
                <>
                  <KPIBoard
                    title="Melhor Indicador"
                    tooltip="Indicador operacional com maior score no último mês"
                    value={best?.label ?? "-"}
                    valueColor="text-green-600"
                    subtitle={`Score ${best?.score ?? "-"}`}
                  />
                  <KPIBoard
                    title="Pior Indicador"
                    tooltip="Indicador operacional com menor score no último mês"
                    value={worst?.label ?? "-"}
                    valueColor="text-red-600"
                    subtitle={`Score ${worst?.score ?? "-"}`}
                  />
                </>
              );
            })()}
          </div>

          {/* ═══ Linha 2: Indicadores — lista vertical com sparklines inline ═══ */}
          <table className="bg-card border border-border/50 rounded-xl w-full border-separate border-spacing-0 table-fixed" data-onboarding="sparkline-table">
            <thead>
              <tr className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <th scope="col" className="px-3 sm:px-4 py-2 border-b border-border/40 text-left font-medium w-[160px] sm:w-[220px]">
                  Indicador
                </th>
                <th scope="col" className="py-2 border-b border-border/40 text-center font-medium">
                  Histórico 12m
                </th>
              </tr>
            </thead>
            <tbody>
              {sparklineCards.map((card, rowIdx) => {
                const lastIdx = card.evolucao.length - 1;
                const firstMonth = card.evolucao[0]?.competencia ?? "";
                const lastMonth = card.evolucao[lastIdx]?.competencia ?? "";
                const indicadorRouteMap: Record<string, string> = {
                  "Ponto": "/analytics/operacional?tab=qualidade",
                  "Absenteísmo": "/analytics/operacional?tab=absenteismo",
                  "Turnover": "/analytics/operacional?tab=turnover",
                  "Movimentações": "/analytics/operacional?tab=movimentacoes",
                  "Coberturas": "/analytics/operacional?tab=coberturas",
                };
                const targetRoute = indicadorRouteMap[card.label];
                const gradId = `grad-${card.label.replace(/\s/g,'')}`;
                const areaGradId = `area-${card.label.replace(/\s/g,'')}`;
                const borderTopCls = rowIdx > 0 ? "border-t border-border/40" : "";
                return card.highlight ? (
                  // ═══ Hero Rocket — linha-mestre ═══
                  <tr key={card.label} className="bg-[#F5F0E6]">
                    <td colSpan={2} className={`p-0 ${borderTopCls}`}>
                      <div className="border border-[#FF5722]/20 relative p-[10px]" style={{ boxShadow: '0 -4px 8px -4px rgba(255,87,34,0.25), 0 4px 8px -4px rgba(255,87,34,0.25)' }}>
                        <div className="pointer-events-none absolute inset-x-0 -top-3 h-3 bg-gradient-to-t from-[#FF5722]/8 to-transparent" />
                        <div className="pointer-events-none absolute inset-x-0 -bottom-3 h-3 bg-gradient-to-b from-[#FF5722]/8 to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 -left-3 w-3 bg-gradient-to-l from-[#FF5722]/8 to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 -right-3 w-3 bg-gradient-to-r from-[#FF5722]/8 to-transparent" />
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#D84315] text-white flex items-center justify-center shadow-md shrink-0">
                            <Rocket className="w-5 h-5" />
                          </div>
                          <div className="shrink-0 w-[120px] sm:w-auto sm:flex-none sm:min-w-[160px] pl-[10px]">
                            <div className="text-base font-extrabold text-[#FF5722] leading-tight whitespace-nowrap">{card.label}</div>
                          </div>
                          {/* Mobile: heatmap horizontal (alinhado com Ponto/Absenteísmo) */}
                          <div className="flex sm:hidden flex-1 min-w-0 h-[27px] flex-col justify-between overflow-hidden self-center mt-[6px] pl-3">
                            <div className="flex items-center gap-[2px] w-full h-[19px]">
                              {card.evolucao.map((pt, i) => {
                                const c = card.forceColor ?? (card.perPointColors ? getLineColor(pt.valor) : getLineColor(card.score));
                                return (
                                  <div
                                    key={i}
                                    className="flex-1 h-full rounded-[2px]"
                                    style={{ backgroundColor: c, opacity: 0.75 }}
                                    title={`${pt.competencia}: ${pt.valor}`}
                                  />
                                );
                              })}
                            </div>
                            <div className="flex justify-between text-[8px] leading-[8px] text-muted-foreground px-0.5">
                              <span>{firstMonth.replace('/20', '/')}</span>
                              <span>{lastMonth.replace('/20', '/')}</span>
                            </div>
                          </div>

                          {/* Desktop: bolhas mensais com bracket */}
                          <div className="hidden sm:block flex-1 h-[34px] relative min-w-0 mt-[3px]">
                            {card.evolucao.length >= 3 && (
                              <DraggableBracket
                                card={card}
                                interactive
                                startIdx={bracketStartIdx ?? card.evolucao.length - 3}
                                onStartIdxChange={setBracketStartIdx}
                              />
                            )}
                            {(() => {
                              const max = Math.max(...card.evolucao.map((p) => p.valor), 100);
                              const denom = Math.max(1, card.evolucao.length - 1);
                              return (
                                <div className="relative w-full h-[34px]">
                                  {card.evolucao.map((pt, i) => {
                                    const c = card.forceColor ?? getLineColor(pt.valor);
                                    const size = 10 + (pt.valor / max) * 20;
                                    const leftPct = (i / denom) * 100;
                                    return (
                                      <div
                                        key={i}
                                        className="absolute top-1/2 rounded-full"
                                        title={`${pt.competencia}: ${pt.valor}`}
                                        style={{
                                          left: `${leftPct}%`,
                                          transform: 'translate(-50%, -50%)',
                                          width: `${size}px`,
                                          height: `${size}px`,
                                          backgroundColor: c,
                                          opacity: 0.85,
                                          boxShadow: `0 0 0 2px ${c}25`,
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={card.label}
                    data-onboarding={card.label === "Ponto" ? "row-qualidade" : undefined}
                    className="cursor-pointer group"
                    onClick={(event) => {
                      const target = event.target as HTMLElement | null;
                      if (target?.closest('[data-block-row-click="true"]')) {
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                      }
                      if (targetRoute) navigate(targetRoute);
                    }}
                    title={`Ver detalhes de ${card.label}`}
                  >
                    <td colSpan={2} className={`p-0 ${borderTopCls}`}>
                      <div className="relative p-[10px]">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                            {card.label === "Ponto" ? (
                              <Clock className="w-5 h-5" style={{ color: "#FF5722" }} />
                            ) : card.label === "Absenteísmo" ? (
                              <UserX className="w-5 h-5" style={{ color: "#FF5722" }} />
                            ) : card.label === "Turnover" ? (
                              <TrendingDown className="w-5 h-5" style={{ color: "#FF5722" }} />
                            ) : card.label === "Movimentações" ? (
                              <ArrowLeftRight className="w-5 h-5" style={{ color: "#FF5722" }} />
                            ) : card.label === "Coberturas" ? (
                              <ShieldCheck className="w-5 h-5" style={{ color: "#FF5722" }} />
                            ) : (
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: card.forceColor ?? getLineColor(card.score) }}
                              />
                            )}
                          </div>
                          <div className="shrink-0 w-[120px] sm:w-auto sm:flex-none sm:min-w-[160px] pl-[10px]">
                            <div className="text-sm font-medium text-foreground leading-tight whitespace-nowrap">{card.label}</div>
                          </div>
                          {/* Mobile: heatmap horizontal */}
                          <div className="flex sm:hidden flex-1 min-w-0 h-[27px] flex-col justify-between overflow-hidden self-center mt-[6px] pl-3">
                            <div className="flex items-center gap-[2px] w-full h-[19px]">
                              {card.evolucao.map((pt, i) => {
                                const c = card.forceColor ?? (card.perPointColors ? getLineColor(pt.valor) : getLineColor(card.score));
                                return (
                                  <div
                                    key={i}
                                    className="flex-1 h-full rounded-[2px]"
                                    style={{ backgroundColor: c, opacity: 0.75 }}
                                    title={`${pt.competencia}: ${pt.valor}`}
                                  />
                                );
                              })}
                            </div>
                            <div className="flex justify-between text-[8px] leading-[8px] text-muted-foreground px-0.5">
                              <span>{firstMonth.replace('/20', '/')}</span>
                              <span>{lastMonth.replace('/20', '/')}</span>
                            </div>
                          </div>

                          {/* Desktop: bolhas mensais com bracket */}
                          <div className="hidden sm:block flex-1 h-[34px] relative min-w-0 mt-[3px]">
                            {card.evolucao.length >= 3 && (
                              <DraggableBracket
                                card={card}
                                interactive={false}
                                startIdx={bracketStartIdx ?? card.evolucao.length - 3}
                                onStartIdxChange={setBracketStartIdx}
                              />
                            )}
                            {(() => {
                              const max = Math.max(...card.evolucao.map((p) => p.valor), 100);
                              const denom = Math.max(1, card.evolucao.length - 1);
                              return (
                                <div className="relative w-full h-[34px]">
                                  {card.evolucao.map((pt, i) => {
                                    const c = card.forceColor ?? getLineColor(pt.valor);
                                    const size = 10 + (pt.valor / max) * 20;
                                    const leftPct = (i / denom) * 100;
                                    return (
                                      <div
                                        key={i}
                                        className="absolute top-1/2 rounded-full"
                                        title={`${pt.competencia}: ${pt.valor}`}
                                        style={{
                                          left: `${leftPct}%`,
                                          transform: 'translate(-50%, -50%)',
                                          width: `${size}px`,
                                          height: `${size}px`,
                                          backgroundColor: c,
                                          opacity: 0.85,
                                          boxShadow: `0 0 0 2px ${c}25`,
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Month legend footer (desktop only) */}
            {sparklineCards[0]?.evolucao.length > 0 && (
              <tfoot className="hidden sm:table-footer-group">
                <tr>
                  <td className="border-t border-border/40 px-4 py-1.5" />
                  <td className="border-t border-border/40 py-1.5">
                    <div className="flex justify-between">
                      {sparklineCards[0].evolucao.map((pt) => (
                        <span key={pt.competencia} className="text-[9px] text-muted-foreground">{pt.competencia.replace('/20', '/')}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>


          {/* ═══ CTA Financeiro ═══ */}
          <div className="bg-surface border border-border/50 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <DollarSign size={20} className="text-[#FF5722]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Visão Financeira em breve</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Prepare seus parâmetros agora para que a visão em R$ já esteja pronta quando liberada.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/analytics/configuracao")}
              className="bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shrink-0 w-full sm:w-auto"
            >
              Configurar parâmetros
            </button>
          </div>

          {/* ═══ Feedback inline ═══ */}
          <div className="border-t border-border pt-4 mt-1">
            {!feedbackSubmitted ? (
              <>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm text-muted-foreground">Como você avalia esta visualização?</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          rating === n
                            ? "bg-[#FF5722] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center gap-16 mt-1">
                  <span className="text-[10px] text-muted-foreground">Ruim</span>
                  <span className="text-[10px] text-muted-foreground">Excelente</span>
                </div>
                {rating && (
                  <div className="mt-4 max-w-lg mx-auto">
                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Quer compartilhar algo mais? (opcional)"
                      className="w-full border border-border rounded-lg p-3 text-sm resize-none h-20 focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] outline-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleFeedbackSubmit}
                        className="bg-[#FF5722] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 mt-4">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-green-600">Obrigado pelo feedback!</span>
              </div>
            )}
          </div>
        </div>
        {/* Sidebar */}
        <GroupBySidebar
          items={sidebarItems}
          selectedRegional={selectedRegional}
          onRegionalClick={handleRegionalClick}
          groupBy={groupBy}
          onGroupByChange={handleGroupByChange}
        />
      </div>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}

/** Variant table reusing the indicator list with custom 12m visualization */
function IndicatorVariantTable({
  title,
  cards,
  renderViz,
}: {
  title: string;
  cards: Array<{
    label: string;
    score: number;
    evolucao: { competencia: string; valor: number }[];
    forceColor?: string;
    perPointColors?: boolean;
    highlight?: boolean;
  }>;
  renderViz: (card: any) => React.ReactNode;
}) {
  const first = cards[0]?.evolucao ?? [];
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">{title}</h3>
      <table className="bg-card border border-border/50 rounded-xl w-full border-separate border-spacing-0 table-fixed">
        <thead>
          <tr className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <th scope="col" className="px-3 sm:px-4 py-2 border-b border-border/40 text-left font-medium w-[160px] sm:w-[220px]">
              Indicador
            </th>
            <th scope="col" className="py-2 border-b border-border/40 text-center font-medium">
              Histórico 12m
            </th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, rowIdx) => {
            const borderTopCls = rowIdx > 0 ? "border-t border-border/40" : "";
            const isHero = card.highlight;
            return (
              <tr key={card.label} className={isHero ? "bg-[#F5F0E6]" : ""}>
                <td colSpan={2} className={`p-0 ${borderTopCls}`}>
                  <div className={`relative p-[10px] ${isHero ? "border border-[#FF5722]/20" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isHero ? "bg-gradient-to-br from-[#FF5722] to-[#D84315] text-white shadow-md" : ""}`}>
                        {isHero ? (
                          <Rocket className="w-5 h-5" />
                        ) : card.label === "Ponto" ? (
                          <Clock className="w-5 h-5" style={{ color: "#FF5722" }} />
                        ) : card.label === "Absenteísmo" ? (
                          <UserX className="w-5 h-5" style={{ color: "#FF5722" }} />
                        ) : card.label === "Turnover" ? (
                          <TrendingDown className="w-5 h-5" style={{ color: "#FF5722" }} />
                        ) : card.label === "Movimentações" ? (
                          <ArrowLeftRight className="w-5 h-5" style={{ color: "#FF5722" }} />
                        ) : card.label === "Coberturas" ? (
                          <ShieldCheck className="w-5 h-5" style={{ color: "#FF5722" }} />
                        ) : (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.forceColor ?? getLineColor(card.score) }} />
                        )}
                      </div>
                      <div className="shrink-0 w-[120px] sm:w-auto sm:flex-none sm:min-w-[160px]">
                        <div className={`text-sm leading-tight whitespace-nowrap ${isHero ? "text-base font-extrabold text-[#FF5722]" : "font-medium text-foreground"}`}>
                          {card.label}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">{renderViz(card)}</div>
                      <div
                        className="shrink-0 w-9 text-center text-[11px] font-semibold rounded px-1.5 py-0.5"
                        style={{
                          color: card.forceColor ?? getLineColor(card.score),
                          backgroundColor: `${card.forceColor ?? getLineColor(card.score)}15`,
                        }}
                      >
                        {card.score}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        {first.length > 0 && (
          <tfoot className="hidden sm:table-footer-group">
            <tr>
              <td className="border-t border-border/40 px-4 py-1.5" />
              <td className="border-t border-border/40 py-1.5">
                <div className="flex pr-12">
                  {first.map((pt) => (
                    <span key={pt.competencia} className="text-[9px] text-muted-foreground flex-1 text-center">
                      {pt.competencia.replace("/20", "/")}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

/** Format "2025-04-01" → "abr/2025" */
function formatMonthShort(dateStr: string): string {
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const parts = dateStr.split("-");
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${months[monthIdx]}/${parts[0]}`;
}
