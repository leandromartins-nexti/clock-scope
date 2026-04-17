import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { getScoreColor, getScoreBg, getLineColor } from "@/components/analytics/IndicatorTable";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import { useNavigate } from "react-router-dom";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import { getSidebarItems, getQualidadeKpiSummary, formatMesLabel } from "@/lib/ajustesData";
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
  Filter, Eraser, DollarSign, CheckCircle,
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
}
function DraggableBracket({ card }: { card: BracketCard }) {
  const total = card.evolucao.length;
  const windowSize = 3;
  const maxStart = total - windowSize;
  // Default: rightmost 3 months
  const [startIdx, setStartIdx] = useState(maxStart);
  const [dragging, setDragging] = useState(false);
  const [released, setReleased] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ originX: number; originStart: number } | null>(null);

  const widthPct = (windowSize / total) * 100;
  const leftPct = (startIdx / total) * 100;

  const windowMonths = card.evolucao.slice(startIdx, startIdx + windowSize);
  const avgScore = Math.round(
    windowMonths.reduce((s, p) => s + p.valor, 0) / windowMonths.length
  );
  const scoreColor = getLineColor(avgScore);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    setReleased(false);
    dragStateRef.current = { originX: e.clientX, originStart: startIdx };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragStateRef.current || !containerRef.current?.parentElement) return;
    const parentWidth = containerRef.current.parentElement.getBoundingClientRect().width;
    const stepPx = parentWidth / total;
    const deltaSteps = Math.round((e.clientX - dragStateRef.current.originX) / stepPx);
    const next = Math.min(maxStart, Math.max(0, dragStateRef.current.originStart + deltaSteps));
    setStartIdx(next);
  }, [total, maxStart]);

  const onPointerUp = useCallback(() => {
    if (!dragStateRef.current) return;
    dragStateRef.current = null;
    setDragging(false);
    setReleased(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging, onPointerMove, onPointerUp]);

  // Auto-hide the released tooltip after 2.5s
  useEffect(() => {
    if (!released) return;
    const t = setTimeout(() => setReleased(false), 2500);
    return () => clearTimeout(t);
  }, [released, startIdx]);

  return (
    <div
      ref={containerRef}
      className="absolute -top-[14px] z-10"
      style={{
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        height: 14,
        transition: dragging ? "none" : "left 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Bracket SVG (drag handle) */}
      <svg
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        className={`absolute inset-0 w-full h-full ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          touchAction: "none",
          filter: dragging
            ? `drop-shadow(0 0 6px ${scoreColor}) drop-shadow(0 2px 4px rgba(0,0,0,0.25))`
            : "none",
          transition: "filter 200ms ease",
        }}
        onPointerDown={onPointerDown}
      >
        <path
          d="M 1 13 L 1 3 L 50 3 L 50 1 L 50 3 L 99 3 L 99 13"
          stroke={dragging ? scoreColor : "#C8860D"}
          strokeWidth={dragging ? 3 : 2.5}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeDasharray={dragging ? "5 2" : "3 2"}
          vectorEffect="non-scaling-stroke"
          style={{ transition: "stroke 180ms ease, stroke-width 180ms ease" }}
        />
      </svg>

      {/* Score pill (live while dragging) */}
      <div
        className="absolute -top-[11px] z-20 pointer-events-none"
        style={{ left: "50%", transform: `translateX(-50%) scale(${dragging ? 1.15 : 1})`, transition: "transform 180ms ease" }}
      >
        <span
          className="text-[10px] font-bold px-2 py-[2px] rounded-full text-white shadow-md whitespace-nowrap"
          style={{
            backgroundColor: scoreColor,
            border: "2px solid white",
            transition: "background-color 200ms ease",
          }}
        >
          {avgScore}
        </span>
      </div>

      {/* Released tooltip — shows the 3 months and their scores */}
      {released && !dragging && (
        <div
          className="absolute z-30 pointer-events-none animate-in fade-in slide-in-from-top-1"
          style={{
            top: -82,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="bg-card border border-border rounded-lg shadow-xl px-3 py-2 text-[10px] whitespace-nowrap">
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
            {/* Caret */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-card border-r border-b border-border"
            />
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

  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };

  // Score Nexti config (precisa estar disponível antes da sidebar)
  const { config: nextiConfig } = useNextiScoreConfig();

  // Sidebar items: combina Ponto + Absenteísmo via Score Nexti por entidade
  const sidebarItemsRaw = useMemo(
    () => getSidebarItems(groupBy, scoreConfig, sources),
    [groupBy, scoreConfig, sources]
  );
  const sidebarItems = useMemo(
    () =>
      sidebarItemsRaw
        .map((item) => {
          const absScore = computeAbsenteismoCurrentScore(item.nome, groupBy as AbsGroupBy, absConfig);
          const nextiScore = computeNextiScore(item.score, absScore, nextiConfig);
          return { nome: item.nome, score: nextiScore };
        })
        .sort((a, b) => b.score - a.score),
    [sidebarItemsRaw, groupBy, absConfig, nextiConfig]
  );

  // KPI summary from real JSON
  const kpiSummary = useMemo(
    () => getQualidadeKpiSummary(selectedRegional, groupBy, scoreConfig, null, sources),
    [selectedRegional, groupBy, scoreConfig, sources]
  );

  // KPIs from periodo anterior JSON
  const kpisPeriodo = customerData.kpisPeriodoAnterior;
  const periodoLabel = kpisPeriodo?.periodo_atual
    ? `${formatMonthShort(kpisPeriodo.periodo_atual.inicio)} – ${formatMonthShort(kpisPeriodo.periodo_atual.fim)}`
    : "abr/2025 – mar/2026";

  // Compute months from real data
  const allMonths = useMemo(() => {
    const months = new Set<string>();
    for (const r of sources.hc.empresa) months.add(r.reference_month);
    for (const r of sources.hc.unidade) months.add(r.reference_month);
    for (const r of sources.hc.area) months.add(r.reference_month);
    return [...months].sort();
  }, [sources]);

  // Score sparkline per month from real data
  const qualidadeCard = useMemo(() => {
    const evolucao = allMonths.map(month => {
      const score = computeCompositeScore(selectedRegional, groupBy as any, scoreConfig, [month], sources);
      return { competencia: formatMesLabel(month), valor: score };
    });
    const lastScore = kpiSummary.score;
    const firstScore = evolucao[0]?.valor ?? 0;
    const diff = lastScore - firstScore;
    const variacao = diff >= 0 ? `+${diff} pts` : `${diff} pts`;
    const corVariacao = diff >= 0 ? "text-green-600" : "text-red-600";
    return {
      label: "Ponto",
      valor: `${lastScore}`,
      variacao,
      corVariacao,
      score: lastScore,
      evolucao,
      perPointColors: true,
    };
  }, [selectedRegional, groupBy, scoreConfig, sources, allMonths, kpiSummary.score]);

  // Score Nexti — composição ponderada de Ponto + Absenteísmo (nextiConfig já carregado acima)
  const pontoScore = kpiSummary.score;

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
      if (delta > bestDelta) { bestDelta = delta; bestName = item.nome; bestDetail = `${delta >= 0 ? '+' : ''}${delta} pts (${prev} → ${current})`; }
      if (delta < worstDelta) { worstDelta = delta; worstName = item.nome; worstDetail = `${delta >= 0 ? '+' : ''}${delta} pts (${prev} → ${current})`; }
    }

    return {
      principalMelhora: { nome: bestName, detalhe: bestDetail },
      principalPiora: { nome: worstName, detalhe: worstDetail },
    };
  }, [sidebarItems, groupBy, scoreConfig, sources]);

  const handleFeedbackSubmit = () => {
    console.log({ page: "resumo_executivo", rating, comment: feedbackComment, timestamp: Date.now() });
    setFeedbackSubmitted(true);
  };

  // ── Absenteismo card: usa exatamente a mesma lógica da aba Absenteísmo ──
  // Reage ao selectedRegional + groupBy (filtra por entidade quando aplicável)
  const absGroupBy: AbsGroupBy = groupBy as AbsGroupBy;
  const absenteismoCard = useMemo(() => {
    const evolucaoRaw = computeAbsenteismoEvolution(selectedRegional, absGroupBy, absConfig);
    const evolucao = evolucaoRaw.map((e) => ({
      competencia: formatMesLabel(e.month),
      valor: e.score,
    }));
    const lastScore = evolucao[evolucao.length - 1]?.valor ?? 0;
    const firstScore = evolucao[0]?.valor ?? 0;
    const diff = lastScore - firstScore;
    const variacao = diff >= 0 ? `+${diff} pts` : `${diff} pts`;
    const corVariacao = diff >= 0 ? "text-green-600" : "text-red-600";
    return {
      label: "Absenteísmo",
      valor: `${lastScore}`,
      variacao,
      corVariacao,
      score: lastScore,
      evolucao,
      perPointColors: true,
    };
  }, [absConfig, selectedRegional, absGroupBy]);

  const sparklineCards = [qualidadeCard, absenteismoCard];

  // Score Nexti final (gauge): combinação ponderada de Ponto + Absenteísmo
  const absenteismoScore = absenteismoCard.score;
  const activeScore = computeNextiScore(pontoScore, absenteismoScore, nextiConfig);
  const scoreClassif = getNextiScoreClassification(activeScore, nextiConfig);
  const scoreDiff = activeScore - prevScore;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col overflow-x-hidden">
      {/* Filter bar */}
      <div className="bg-white px-3 sm:px-6 py-3 border-b border-border flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground hidden sm:inline">Filtros Aplicados:</span>
          </div>
          <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap">Período: {periodoLabel}</span>
          {selectedRegional && (
            <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-3 py-1 text-[11px] font-medium flex items-center gap-1 max-w-[160px] sm:max-w-none truncate">
              <span className="truncate">{groupBy === "empresa" ? "Empresa" : groupBy === "unidade" ? "Un. Negócio" : "Área"}: {selectedRegional}</span>
              <button onClick={() => setSelectedRegional(null)} className="ml-1 hover:text-red-600 shrink-0">✕</button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button onClick={() => setSelectedRegional(null)} className="hidden sm:flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
            <Eraser className="w-4 h-4" /> Limpar Filtros
          </button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <button
            onClick={() => window.dispatchEvent(new Event("open-tipo-operacao"))}
            className="sm:hidden text-muted-foreground hover:text-foreground p-1.5 rounded-md transition-colors"
            aria-label="Abrir tipo de operação"
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
              subtitle={`Score ${kpiSummary.maiorRisco.score} · ${kpiSummary.maiorRisco.indicador}`}
            />
            <KPIBoard
              title="Principal Melhora"
              tooltip="Operação que mais evoluiu comparando o score dos últimos 3 meses com o trimestre anterior"
              value={principalMelhora.nome}
              valueColor="text-green-600"
              subtitle={principalMelhora.detalhe}
            />
            <KPIBoard
              title="Principal Piora"
              tooltip="Operação com maior queda de score comparando os últimos 3 meses com o trimestre anterior"
              value={principalPiora.nome}
              valueColor="text-red-600"
              subtitle={principalPiora.detalhe}
            />
          </div>

          {/* ═══ Linha 2: Indicadores — lista vertical com sparklines inline ═══ */}
          <div className="bg-card border border-border/50 rounded-xl" data-onboarding="sparkline-table">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 border-b border-border/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              <div className="w-2" />
              <span className="flex-1 sm:flex-none sm:min-w-[140px]">Indicador</span>
              <div className="flex-1 sm:min-w-[120px] text-center">Histórico 12m</div>
              <span className="hidden sm:inline-block min-w-[65px] text-center">Variação</span>
              <span className="min-w-[45px] text-center">Score</span>
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
                return (
                <div
                    key={card.label}
                    data-onboarding={card.label === "Ponto" ? "row-qualidade" : undefined}
                    className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-5 hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => targetRoute && navigate(targetRoute)}
                    title={`Ver detalhes de ${card.label}`}
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getLineColor(card.score) }} />
                    <span className="text-sm font-medium text-foreground flex-1 sm:flex-none sm:min-w-[140px] truncate">{card.label}</span>
                    {/* Mobile: heatmap horizontal — altura total idêntica ao badge de score */}
                    <div className="flex sm:hidden flex-1 min-w-0 h-[27px] flex-col justify-between overflow-hidden self-center mt-[6px]">
                      <div className="flex items-center gap-[2px] w-full h-[19px]">
                        {card.evolucao.map((pt, i) => {
                          const c = card.perPointColors ? getLineColor(pt.valor) : getLineColor(card.score);
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

                    {/* Desktop: Sparkline com área gradiente semântica + highlight dos últimos 3 meses */}
                    <div className="hidden sm:block flex-1 sm:min-w-[120px] h-[17px] relative">
                      {card.evolucao.length >= 3 && <DraggableBracket card={card} />}
                      <ResponsiveContainer width="100%" height={17}>
                        <AreaChart data={card.evolucao} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id={areaGradId} x1="0" y1="0" x2="1" y2="0">
                              {card.evolucao.map((pt, i) => {
                                const pct = card.evolucao.length > 1 ? (i / (card.evolucao.length - 1)) * 100 : 0;
                                return <stop key={i} offset={`${pct}%`} stopColor={getLineColor(pt.valor)} stopOpacity={0.45} />;
                              })}
                            </linearGradient>
                            <linearGradient id={`${areaGradId}-stroke`} x1="0" y1="0" x2="1" y2="0">
                              {card.evolucao.map((pt, i) => {
                                const pct = card.evolucao.length > 1 ? (i / (card.evolucao.length - 1)) * 100 : 0;
                                return <stop key={i} offset={`${pct}%`} stopColor={getLineColor(pt.valor)} />;
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

                    <span className={`hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full min-w-[65px] text-center ${card.corVariacao} ${
                      card.corVariacao.includes('green') ? 'bg-green-50' : card.corVariacao.includes('red') ? 'bg-red-50' : 'bg-gray-50'
                    }`}>{card.variacao}</span>
                    <span className={`text-xs font-bold min-w-[45px] text-center px-1.5 py-0.5 rounded ${getScoreColor(card.score)} ${getScoreBg(card.score)}`}>{card.score}</span>
                  </div>
                );
              })}
            </div>
            {/* Month legend footer (desktop only) */}
            {sparklineCards[0]?.evolucao.length > 0 && (
              <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 border-t border-border/40">
                <div className="w-2" />
                <span className="min-w-[140px]" />
                <div className="flex-1 min-w-[120px] flex justify-between">
                  {sparklineCards[0].evolucao.map((pt) => (
                    <span key={pt.competencia} className="text-[9px] text-muted-foreground">{pt.competencia.replace('/20', '/')}</span>
                  ))}
                </div>
                <span className="min-w-[65px]" />
                <span className="min-w-[45px]" />
              </div>
            )}
          </div>

          {/* Variantes de teste removidas */}

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
