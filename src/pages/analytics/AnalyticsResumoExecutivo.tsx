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
import { computePrevTriScore } from "@/lib/scoreComputations";
import { useAbsenteismoScoreConfig } from "@/contexts/AbsenteismoScoreConfigContext";
import {
  computeAbsenteismoEvolution,
  computeAbsenteismoCurrentScore,
  type AbsGroupBy,
} from "@/lib/absenteismoScoreShared";
import {
  useNextiScoreConfig,
  computeNextiScore,
  getNextiScoreClassification,
} from "@/contexts/NextiScoreConfigContext";
import {
  Filter, Eraser, DollarSign, CheckCircle, Rocket,
} from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { Separator } from "@/components/ui/separator";
import InsightsCenter from "@/components/analytics/InsightsCenter";
import AnalyticsChat from "@/components/analytics/AnalyticsChat";

import {
  ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip,
} from "recharts";
import IndicatorTableVariants from "@/components/analytics/IndicatorTableVariants";

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
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2.5 text-xs min-w-[180px] z-[9999] relative">
      <p className="font-semibold text-foreground mb-2">{comp}</p>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pointColor }} />
        <span className="text-muted-foreground">{cardData.label}:</span>
        <span className="font-bold text-foreground">{fmt(valor)}</span>
        <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${getScoreColor(valor)} ${getScoreBg(valor)}`}>Score {valor}</span>
      </div>
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
}
function DraggableBracket({ card }: { card: BracketCard }) {
  const total = card.evolucao.length;
  const windowSize = 3;
  const maxStart = total - windowSize;
  const [startIdx, setStartIdx] = useState(maxStart);
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

  // Recharts distribui os pontos uniformemente entre left=0 e right=100% da área plot.
  // Para alinhar exatamente sob os 3 pontos (do índice startIdx ao startIdx+2):
  const denom = Math.max(1, total - 1);
  const startPct = (startIdx / denom) * 100;
  const endPct = ((startIdx + windowSize - 1) / denom) * 100;
  const leftPct = startPct;
  const widthPct = endPct - startPct;
  const windowMonths = card.evolucao.slice(startIdx, startIdx + windowSize);
  const avgScore = Math.round(windowMonths.reduce((sum, point) => sum + point.valor, 0) / windowMonths.length);
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
      onPointerDown={onPointerDown}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(e) => {
        stopEvent(e);
      }}
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
          stroke={highlightGlow ? scoreColor : "#C8860D"}
          strokeWidth={dragging ? 3.1 : 2.5}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeDasharray={dragging ? "6 2" : "3 2"}
          vectorEffect="non-scaling-stroke"
          style={{ transition: "stroke 180ms ease, stroke-width 180ms ease, stroke-dasharray 180ms ease" }}
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
          className="text-[10px] font-bold px-2 py-[2px] rounded-full text-white shadow-md whitespace-nowrap"
          style={{
            backgroundColor: scoreColor,
            border: "2px solid white",
            boxShadow: highlightGlow ? `0 6px 16px ${scoreColor}33` : undefined,
            transition: "background-color 180ms ease, box-shadow 180ms ease",
          }}
        >
          {avgScore}
        </span>
      </div>

      {released && !dragging && (
        <div
          className="absolute z-30 pointer-events-none animate-in fade-in slide-in-from-top-1"
          style={{ top: -82, left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="relative bg-card border border-border rounded-lg shadow-xl px-3 py-2 text-[10px] whitespace-nowrap">
            <div className="font-semibold text-foreground mb-1 text-center">
              Média 3 meses: <span style={{ color: scoreColor }}>{avgScore}</span>
            </div>
            <div className="flex items-center gap-2">
              {windowMonths.map((m) => (
                <div key={m.competencia} className="flex flex-col items-center">
                  <span className="text-muted-foreground">{m.competencia.replace("/20", "/")}</span>
                  <span
                    className="font-bold px-1.5 py-0.5 rounded mt-0.5 text-white"
                    style={{ backgroundColor: getLineColor(m.valor) }}
                  >
                    {m.valor}
                  </span>
                </div>
              ))}
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
  const activeScore = useMemo(
    () => computeNextiScore(pontoScore, absenteismoScore, nextiConfig),
    [pontoScore, absenteismoScore, nextiConfig]
  );
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
      return {
        competencia: formatMesLabel(m),
        ponto: Math.round(pontoMonth),
        absenteismo: absMatch?.score ?? 0,
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
        perPointColors: false,
        forceColor: "#FF5722",
        highlight: true,
      },
      {
        label: "Ponto",
        evolucao: pontoSeries,
        score: pontoLast,
        variacao: p.variacao,
        corVariacao: p.corVariacao,
        perPointColors: true,
      },
      {
        label: "Absenteísmo",
        evolucao: absSeries,
        score: absLast,
        variacao: a.variacao,
        corVariacao: a.corVariacao,
        perPointColors: true,
      },
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
      {/* Top actions */}
      <div className="px-3 sm:px-6 py-3 border-b border-border bg-card/60 backdrop-blur-sm flex items-center gap-3">
        <button
          onClick={() => setFilterOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </button>
        <button
          onClick={() => { setSelectedRegional(null); setGroupBy("unidade"); }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <Eraser className="w-4 h-4" />
          Limpar Filtros
        </button>
        <Separator orientation="vertical" className="h-6" />
        <div className="text-sm text-muted-foreground">{sidebarSelected ? `Filtro ativo: ${sidebarSelected.nome}` : "Sem filtros aplicados"}</div>
      </div>

      {/* Content: main + sidebar */}
      <div className="flex-1 flex min-h-0">
        {/* Main content */}
        <div className="flex-1 min-w-0 px-3 sm:pl-6 sm:pr-4 py-4 pb-24 sm:pb-4 space-y-3 overflow-y-auto">

          {/* ═══ Linha 1: Score Compacto + 4 KPI Cards ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div data-onboarding="score-operacional">
              <ScoreBoard title="Score Nexti" tooltip="Score consolidado da operação, calculado pela média ponderada dos sub-scores de Ponto e Absenteísmo. Configure os pesos em Configuração → Scores → Score Nexti.">
                <ScoreGauge score={activeScore} label={`${activeScore}`} faixa={scoreClassif.label} color={scoreClassif.color} />
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
            <KPIBoard
              title="Economia Gerada"
              tooltip="Estimativa consolidada de ganho operacional com base na melhoria dos indicadores do período"
              value={kpiSummary.diff}
              valueColor="text-emerald-600"
              subtitle="últimos 3 meses"
              icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
            />
            <KPIBoard
              title="Confiabilidade"
              tooltip="Nível de confiança da leitura com base na consistência e estabilidade da série histórica"
              value={scoreDiffLabel}
              valueColor={scoreDiff >= 0 ? "text-green-600" : "text-red-600"}
              subtitle={scoreClassif.label}
              icon={<CheckCircle className="w-4 h-4 text-primary" />}
            />
          </div>

          {/* ═══ Linha 2: Indicadores — lista vertical com sparklines inline ═══ */}
          <div className="bg-card border border-border/50 rounded-xl" data-onboarding="sparkline-table">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 border-b border-border/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              <div className="w-2" />
              <span className="flex-1 sm:flex-none sm:min-w-[140px]">Indicador</span>
              <div className="flex-1 sm:min-w-[120px] text-center">Histórico 12m</div>
            </div>
            <div className="divide-y divide-border/40">
              {sparklineCards.map((card) => {
                const lastIdx = card.evolucao.length - 1;
                const firstMonth = card.evolucao[0]?.competencia ?? "";
                const lastMonth = card.evolucao[lastIdx]?.competencia ?? "";
                const indicadorRouteMap: Record<string, string> = {
                  "Ponto": "/analytics/operacional",
                  "Absenteísmo": "/analytics/operacional",
                };
                const targetRoute = indicadorRouteMap[card.label];
                const gradId = `grad-${card.label.replace(/\s/g,'')}`;
                const areaGradId = `area-${card.label.replace(/\s/g,'')}`;
                return card.highlight ? (
                  // ═══ Hero Rocket — linha-mestre ═══
                  <div
                    key={card.label}
                    onClick={() => { /* hero não navega */ }}
                  >
                    <div className="bg-[#F5F0E6] relative">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5722]/25 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF5722]/25 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-0 -top-3 h-3 bg-gradient-to-t from-[#FF5722]/15 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-0 -bottom-3 h-3 bg-gradient-to-b from-[#FF5722]/15 to-transparent" />
                      <div className="flex items-center gap-4 py-3 pl-6 pr-3.5 relative">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#D84315] text-white flex items-center justify-center shadow-md shrink-0">
                          <Rocket className="w-5 h-5" />
                        </div>
                        <div className="min-w-[160px]">
                          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF5722]/70">Indicador-mestre</div>
                          <div className="text-base font-extrabold text-[#FF5722] leading-tight">{card.label}</div>
                        </div>
                        <div className="flex-1 h-[28px] relative min-w-0">
                          {card.evolucao.length >= 3 && <DraggableBracket card={card} />}
                          <ResponsiveContainer width="100%" height={28}>
                            <AreaChart data={card.evolucao} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                              <defs>
                                <linearGradient id={areaGradId} x1="0" y1="0" x2="1" y2="0">
                                  {card.evolucao.map((pt, i) => {
                                    const pct = card.evolucao.length > 1 ? (i / (card.evolucao.length - 1)) * 100 : 0;
                                    const stopColor = card.forceColor ?? getLineColor(pt.valor);
                                    return <stop key={i} offset={`${pct}%`} stopColor={stopColor} stopOpacity={0.4} />;
                                  })}
                                </linearGradient>
                                <linearGradient id={`${areaGradId}-stroke`} x1="0" y1="0" x2="1" y2="0">
                                  {card.evolucao.map((pt, i) => {
                                    const pct = card.evolucao.length > 1 ? (i / (card.evolucao.length - 1)) * 100 : 0;
                                    const stopColor = card.forceColor ?? getLineColor(pt.valor);
                                    return <stop key={i} offset={`${pct}%`} stopColor={stopColor} />;
                                  })}
                                </linearGradient>
                              </defs>
                              <RechartsTooltip content={<SparklineTooltip cardData={card} />} cursor={false} wrapperStyle={{ zIndex: 9999 }} />
                              <Area
                                type="monotone"
                                dataKey="valor"
                                stroke={`url(#${areaGradId}-stroke)`}
                                strokeWidth={2.8}
                                fill={`url(#${areaGradId})`}
                                style={{ filter: `drop-shadow(0 1px 4px ${card.forceColor ?? "#FF5722"}55)` }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                <div
                    key={card.label}
                    data-onboarding={card.label === "Ponto" ? "row-qualidade" : undefined}
                    className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-5 transition-colors cursor-pointer group hover:bg-muted/30"
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
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: card.forceColor ?? getLineColor(card.score) }}
                    />
                    <span className="flex-1 sm:flex-none sm:min-w-[202px] truncate text-sm font-medium text-foreground">
                      {card.label}
                    </span>
                    {/* Mobile: heatmap horizontal */}
                    <div className="flex sm:hidden flex-1 min-w-0 h-[27px] flex-col justify-between overflow-hidden self-center mt-[6px]">
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

                    {/* Desktop: Sparkline */}
                    <div className="hidden sm:block flex-1 sm:min-w-[120px] relative h-[17px]">
                      {card.evolucao.length >= 3 && <DraggableBracket card={card} />}
                      <ResponsiveContainer width="100%" height={17}>
                        <AreaChart data={card.evolucao} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id={areaGradId} x1="0" y1="0" x2="1" y2="0">
                              {card.evolucao.map((pt, i) => {
                                const pct = card.evolucao.length > 1 ? (i / (card.evolucao.length - 1)) * 100 : 0;
                                const stopColor = card.forceColor ?? getLineColor(pt.valor);
                                return <stop key={i} offset={`${pct}%`} stopColor={stopColor} stopOpacity={0.45} />;
                              })}
                            </linearGradient>
                            <linearGradient id={`${areaGradId}-stroke`} x1="0" y1="0" x2="1" y2="0">
                              {card.evolucao.map((pt, i) => {
                                const pct = card.evolucao.length > 1 ? (i / (card.evolucao.length - 1)) * 100 : 0;
                                const stopColor = card.forceColor ?? getLineColor(pt.valor);
                                return <stop key={i} offset={`${pct}%`} stopColor={stopColor} />;
                              })}
                            </linearGradient>
                          </defs>
                          <RechartsTooltip content={<SparklineTooltip cardData={card} />} cursor={false} wrapperStyle={{ zIndex: 9999 }} />
                          <Area
                            type="monotone"
                            dataKey="valor"
                            stroke={`url(#${areaGradId}-stroke)`}
                            strokeWidth={2}
                            fill={`url(#${areaGradId})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                  </div>
                );
              })}
            </div>
            {/* Month legend footer (desktop only) */}
            {sparklineCards[0]?.evolucao.length > 0 && (
              <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 border-t border-border/40">
                <div className="w-2" />
                <span className="min-w-[202px]" />
                <div className="flex-1 min-w-[120px] flex justify-between">
                  {sparklineCards[0].evolucao.map((pt) => (
                    <span key={pt.competencia} className="text-[9px] text-muted-foreground">{pt.competencia.replace('/20', '/')}</span>
                  ))}
                </div>
              </div>
            )}
          </div>


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

/** Format "2025-04-01" → "abr/2025" */
function formatMonthShort(dateStr: string): string {
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const parts = dateStr.split("-");
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${months[monthIdx]}/${parts[0]}`;
}
