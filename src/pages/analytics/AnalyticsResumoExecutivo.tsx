import { useState, useMemo } from "react";
import { getScoreColor, getScoreBg, getLineColor } from "@/components/analytics/IndicatorTable";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import { useNavigate } from "react-router-dom";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import { getSidebarItems, getQualidadeKpiSummary, ajustesMeses, formatMesLabel } from "@/lib/ajustesData";
import { useScoreConfig, getScoreClassification } from "@/contexts/ScoreConfigContext";
import {
  ChevronRight, Filter, Eraser, TrendingUp, TrendingDown, Minus,
  AlertTriangle, ArrowDownRight, ArrowUpRight, Info, DollarSign, CheckCircle,
} from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import {
  resumo, resumoComparativo, rankingOperacoes, sparklineData, dadosPorRegional,
} from "@/lib/analytics-mock-data";
import {
  ResponsiveContainer, LineChart, Line, Tooltip as RechartsTooltip,
} from "recharts";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


// ── Sparkline cards config (mock for non-qualidade indicators) ──
const mockSparklineCards = [
  sparklineData.absenteismo,
  sparklineData.volumeHE,
  sparklineData.movimentacoes,
  sparklineData.coberturaEfetiva,
];




// ── Custom sparkline tooltip ────────────────────────────────
function SparklineTooltip({ active, payload, cardData }: any) {
  if (!active || !payload?.length) return null;
  const valor = payload[0].value as number;
  const comp = payload[0].payload.competencia as string;
  const evolucao = cardData.evolucao as { competencia: string; valor: number }[];
  const idx = evolucao.findIndex((e) => e.competencia === comp);
  const prev = idx > 0 ? evolucao[idx - 1] : null;
  const next = idx < evolucao.length - 1 ? evolucao[idx + 1] : null;
  const isScore = cardData.perPointColors;
  const fmt = (v: number) => {
    if (isScore) return `${v}`;
    if (cardData.label === "Absenteísmo" || cardData.label === "Cobertura Efetiva") return `${v}%`;
    return `${v}K`;
  };
  const pointColor = isScore ? getLineColor(valor) : getLineColor(cardData.score);
  const pointScore = isScore ? valor : cardData.score;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2.5 text-xs min-w-[180px] z-[9999] relative">
      <p className="font-semibold text-foreground mb-2">{comp}</p>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pointColor }} />
        <span className="text-muted-foreground">{cardData.label}:</span>
        <span className="font-bold text-foreground">{fmt(valor)}</span>
        <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${getScoreColor(pointScore)} ${getScoreBg(pointScore)}`}>Score {pointScore}</span>
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


// ── Sidebar data from real JSON ──
const resumoGroupData: Record<string, { nome: string; score: number }[]> = {
  unidade: getSidebarItems("unidade"),
  empresa: getSidebarItems("empresa"),
  area: getSidebarItems("area"),
};


// ── Main Page ───────────────────────────────────────────────
export default function AnalyticsResumoExecutivo() {
  const navigate = useNavigate();
  const { config: scoreConfig } = useScoreConfig();
  const [filterOpen, setFilterOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");

  const sidebarItems = resumoGroupData[groupBy] || resumoGroupData.unidade;
  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };

  const regionalData = selectedRegional ? dadosPorRegional[selectedRegional] : null;

  // Build real Qualidade do Ponto sparkline card — score per month
  const qualidadeCard = useMemo(() => {
    // Compute composite score for each month
    const evolucao = ajustesMeses.map(month => {
      const kpi = getQualidadeKpiSummary(selectedRegional, groupBy as any, scoreConfig, month);
      return { competencia: formatMesLabel(month), valor: kpi.score };
    });
    const lastScore = evolucao[evolucao.length - 1]?.valor ?? 0;
    const firstScore = evolucao[0]?.valor ?? 0;
    const diff = lastScore - firstScore;
    const variacao = diff >= 0 ? `+${diff} pts` : `${diff} pts`;
    const corVariacao = diff >= 0 ? "text-green-600" : "text-red-600";
    return {
      label: "Qualidade do Ponto",
      valor: `${lastScore}`,
      variacao,
      corVariacao,
      corLinha: getLineColor(lastScore),
      score: lastScore,
      peso: 0.25,
      evolucao,
      perPointColors: true, // flag for gradient rendering
    };
  }, [selectedRegional, groupBy, scoreConfig]);

  // Combine real qualidade + mock others
  const sparklineCards = useMemo(() => [qualidadeCard, ...mockSparklineCards], [qualidadeCard]);

  const activeScore = regionalData?.scoreOperacional ?? resumo.scoreOperacional;
  const activeFaixa = regionalData?.scoreFaixa ?? resumo.scoreFaixa;
  const activeDiff = regionalData?.scoreDiferenca ?? resumoComparativo.scoreDiferenca;
  const scoreColor = activeScore >= 85 ? "text-green-600" : activeScore >= 70 ? "text-[#FF5722]" : "text-red-600";

  // Filtered sparkline data
  const filteredSparklines = useMemo(() => {
    if (!regionalData) return sparklineCards;
    return sparklineCards.map((card) => {
      const mult = regionalData.sparklineMultipliers[card.label];
      if (!mult) return card;
      // For qualidade, the card is already filtered by selectedRegional, skip multiplier
      if (card.label === "Qualidade do Ponto") return card;
      return {
        ...card,
        score: mult.scoreOverride,
        variacao: mult.variacaoOverride,
        corVariacao: mult.corVariacaoOverride,
        evolucao: card.evolucao.map((e) => ({
          ...e,
          valor: Math.round(e.valor * mult.valorMultiplier * 10) / 10,
        })),
      };
    });
  }, [selectedRegional, sparklineCards]);

  const handleFeedbackSubmit = () => {
    console.log({ page: "resumo_executivo", rating, comment: feedbackComment, timestamp: Date.now() });
    setFeedbackSubmitted(true);
  };


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Filter bar */}
      <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-[#FF5722]" />
            <span className="font-semibold text-foreground">Filtros Aplicados:</span>
          </div>
          <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-3 py-1 text-[11px] font-medium">Período: {resumo.periodo}</span>
          {selectedRegional && (
            <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-3 py-1 text-[11px] font-medium flex items-center gap-1">
              Regional: {selectedRegional}
              <button onClick={() => setSelectedRegional(null)} className="ml-1 hover:text-red-600">✕</button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setFilterOpen(true)} className="border border-border text-muted-foreground px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button onClick={() => setSelectedRegional(null)} className="flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
            <Eraser className="w-4 h-4" /> Limpar Filtros
          </button>
        </div>
      </div>

      {/* Content: main + sidebar */}
      <div className="flex-1 flex min-h-0">
          {/* Main content */}
          <div className="flex-1 min-w-0 pl-6 pr-4 py-4 space-y-3 overflow-y-auto">

            {/* ═══ Linha 1: Score Compacto + 4 KPI Cards ═══ */}
            <div className="grid grid-cols-5 gap-3">
              <div data-onboarding="score-operacional"><ScoreBoard title="Score Operacional" tooltip="Índice de saúde da operação calculado a partir de 5 indicadores: qualidade do ponto, absenteísmo, volume de horas extras, movimentações e cobertura efetiva. Pesos configuráveis em Configuração.">
                <ScoreGauge score={activeScore} label={`${activeScore}`} faixa={activeFaixa} />
              </ScoreBoard></div>
              <KPIBoard title="Melhor Operação" tooltip="Operação com maior score operacional no período" value={resumo.melhorOperacao.nome} valueColor="text-green-600" subtitle={`Score ${resumo.melhorOperacao.score} · Alta`} />
              <KPIBoard title="Maior Risco" tooltip="Operação com menor score e maior concentração de risco" value={resumo.maiorRisco.nome} valueColor="text-red-600" subtitle={`Score ${resumo.maiorRisco.score} · ${resumo.maiorRisco.indicador}`} />
              <KPIBoard title="Principal Melhora" tooltip="Indicador com maior evolução positiva no período" value={regionalData?.melhorIndicador ?? "Qualidade Ponto"} valueColor="text-green-600" subtitle={regionalData?.melhorIndicadorDetalhe ?? "+4.1 pp (83.2% → 87.3%)"} />
              <KPIBoard title="Principal Piora" tooltip="Indicador com maior deterioração no período" value={regionalData?.piorIndicador ?? "Atrasos e Faltas"} valueColor="text-red-600" subtitle={regionalData?.piorIndicadorDetalhe ?? "+52.4% no período"} />
            </div>

            {/* ═══ Linha 2: Indicadores — lista vertical com sparklines inline ═══ */}
            <div className="bg-card border border-border/50 rounded-xl" data-onboarding="sparkline-table">
              {/* Header */}
              <div className="flex items-center gap-4 px-4 py-2 border-b border-border/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <div className="w-2" />
                <span className="min-w-[140px]">Indicador</span>
                <span className="min-w-[45px] text-center">Score</span>
                <span className="min-w-[70px]">Atual</span>
                <span className="min-w-[65px] text-center">Variação</span>
                <div className="flex-1 min-w-[120px]" />
              </div>
              <div className="divide-y divide-border/40">
              {filteredSparklines.map((card) => {
                const lastIdx = card.evolucao.length - 1;
                const indicadorRouteMap: Record<string, string> = {
                  "Qualidade do Ponto": "/analytics/operacional",
                  "Absenteísmo": "/analytics/operacional?tab=absenteismo",
                  "Volume HE": "/analytics/operacional?tab=bancoHoras",
                  "Movimentações": "/analytics/operacional?tab=movimentacoes",
                  "Cobertura Efetiva": "/analytics/operacional?tab=coberturas",
                };
                const targetRoute = indicadorRouteMap[card.label];
                return (
                  <div
                    key={card.label}
                    className="flex items-center gap-4 px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => targetRoute && navigate(targetRoute)}
                    title={`Ver detalhes de ${card.label}`}
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getLineColor(card.score) }} />
                    <span className="text-sm font-medium text-foreground min-w-[140px]">{card.label}</span>
                    <span className={`text-xs font-bold min-w-[45px] text-center px-1.5 py-0.5 rounded ${getScoreColor(card.score)} ${getScoreBg(card.score)}`}>{card.score}</span>
                    <span className="text-sm font-semibold text-foreground min-w-[70px]">{card.valor}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full min-w-[65px] text-center ${card.corVariacao} ${
                      card.corVariacao.includes('green') ? 'bg-green-50' : card.corVariacao.includes('red') ? 'bg-red-50' : 'bg-gray-50'
                    }`}>{card.variacao}</span>
                    <div className="flex-1 h-[36px] min-w-[120px]">
                      <ResponsiveContainer width="100%" height={36}>
                        <LineChart data={card.evolucao}>
                          {(card as any).perPointColors && (
                            <defs>
                              <linearGradient id={`grad-${card.label.replace(/\s/g,'')}`} x1="0" y1="0" x2="1" y2="0">
                                {card.evolucao.map((pt, i) => {
                                  const pct = card.evolucao.length > 1 ? (i / (card.evolucao.length - 1)) * 100 : 0;
                                  return <stop key={i} offset={`${pct}%`} stopColor={getLineColor(pt.valor)} />;
                                })}
                              </linearGradient>
                            </defs>
                          )}
                          <RechartsTooltip
                            content={<SparklineTooltip cardData={card} />}
                            cursor={false}
                            wrapperStyle={{ zIndex: 9999 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="valor"
                            stroke={(card as any).perPointColors ? `url(#grad-${card.label.replace(/\s/g,'')})` : getLineColor(card.score)}
                            strokeWidth={3}
                            dot={(props: any) => {
                              const ptColor = (card as any).perPointColors ? getLineColor(props.payload.valor) : getLineColor(card.score);
                              return (
                                <circle
                                  key={props.index}
                                  cx={props.cx}
                                  cy={props.cy}
                                  r={props.index === lastIdx ? 5 : 3.5}
                                  fill={ptColor}
                                  stroke="white"
                                  strokeWidth={2}
                                  className="cursor-pointer"
                                />
                              );
                            }}
                            activeDot={(props: any) => {
                              const ptColor = (card as any).perPointColors ? getLineColor(props.payload.valor) : getLineColor(card.score);
                              return <circle cx={props.cx} cy={props.cy} r={4} fill={ptColor} stroke="white" strokeWidth={2} />;
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
              </div>
              {/* Month legend footer */}
              <div className="flex items-center gap-4 px-4 py-1.5 border-t border-border/40">
                <div className="w-2" />
                <span className="min-w-[140px]" />
                <span className="min-w-[45px]" />
                <span className="min-w-[70px]" />
                <span className="min-w-[65px]" />
                <div className="flex-1 min-w-[120px] flex justify-between">
                  {sparklineCards[0].evolucao.map((pt) => (
                    <span key={pt.competencia} className="text-[9px] text-muted-foreground">{pt.competencia.replace('/20', '/')}</span>
                  ))}
                </div>
              </div>
            </div>


            {/* ═══ Linha 4: CTA Financeiro ═══ */}
            <div className="bg-surface border border-border/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <DollarSign size={20} className="text-[#FF5722]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Visão Financeira em breve</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Prepare seus parâmetros agora para que a visão em R$ já esteja pronta quando liberada.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/analytics/configuracao")}
                className="bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shrink-0"
              >
                Configurar parâmetros
              </button>
            </div>

            {/* ═══ Linha 5: Feedback inline ═══ */}
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
