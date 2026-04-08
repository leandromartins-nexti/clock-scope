import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// ── Gauge semicircular (compact) ────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const radius = 36;
  const stroke = 7;
  const cx = 45;
  const cy = 42;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 85 ? "hsl(var(--success))" : score >= 70 ? "#FF5722" : "hsl(var(--destructive))";

  return (
    <svg width="90" height="50" viewBox="0 0 90 50">
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round"
      />
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
      />
    </svg>
  );
}

// ── InfoTip ─────────────────────────────────────────────────
function InfoTip({ text }: { text: string }) {
  return (
    <UITooltip>
      <TooltipTrigger asChild>
        <Info size={14} className="text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-xs">{text}</TooltipContent>
    </UITooltip>
  );
}

// ── Sparkline cards config ──────────────────────────────────
const sparklineCards = [
  sparklineData.qualidadePonto,
  sparklineData.absenteismo,
  sparklineData.volumeHE,
  sparklineData.movimentacoes,
  sparklineData.coberturaEfetiva,
];

const scoreGeral = Math.round(
  sparklineCards.reduce((sum, c) => sum + c.score * c.peso, 0)
);

const getScoreColor = (s: number) => s >= 85 ? "text-green-600" : s >= 70 ? "text-orange-500" : s < 60 ? "text-red-600" : "text-yellow-600";
const getScoreBg = (s: number) => s >= 85 ? "bg-green-50" : s >= 70 ? "bg-orange-50" : s < 60 ? "bg-red-50" : "bg-yellow-50";

// Score-based line color: gradient from red (low) → orange → yellow → green (high)
const getLineColor = (s: number) => {
  if (s >= 85) return "#16a34a"; // green-600
  if (s >= 75) return "#65a30d"; // lime-600
  if (s >= 65) return "#ca8a04"; // yellow-600
  if (s >= 55) return "#ea580c"; // orange-600
  return "#dc2626"; // red-600
};

// ── Custom sparkline tooltip ────────────────────────────────
function SparklineTooltip({ active, payload, cardData }: any) {
  if (!active || !payload?.length) return null;
  const valor = payload[0].value as number;
  const comp = payload[0].payload.competencia as string;
  const evolucao = cardData.evolucao as { competencia: string; valor: number }[];
  const idx = evolucao.findIndex((e) => e.competencia === comp);
  const prev = idx > 0 ? evolucao[idx - 1] : null;
  const next = idx < evolucao.length - 1 ? evolucao[idx + 1] : null;
  const fmt = (v: number) => {
    if (cardData.label === "Qualidade do Ponto" || cardData.label === "Absenteísmo" || cardData.label === "Cobertura Efetiva") return `${v}%`;
    return `${v}K`;
  };
  const diff = (a: number, b: number) => {
    const d = a - b;
    return d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1);
  };
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2.5 text-xs min-w-[180px] z-[9999] relative">
      <p className="font-semibold text-foreground mb-2">{comp}</p>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLineColor(cardData.score) }} />
        <span className="text-muted-foreground">{cardData.label}:</span>
        <span className="font-bold text-foreground">{fmt(valor)}</span>
        <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${getScoreColor(cardData.score)} ${getScoreBg(cardData.score)}`}>Score {cardData.score}</span>
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

import { useMemo } from "react";

// ── Main Page ───────────────────────────────────────────────
export default function AnalyticsResumoExecutivo() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);

  const regionalData = selectedRegional ? dadosPorRegional[selectedRegional] : null;

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
  }, [selectedRegional]);

  const handleFeedbackSubmit = () => {
    console.log({ page: "resumo_executivo", rating, comment: feedbackComment, timestamp: Date.now() });
    setFeedbackSubmitted(true);
  };

  const handleRegionalClick = (nome: string) => {
    setSelectedRegional(prev => prev === nome ? null : nome);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <header className="border-b border-border px-6 py-3 bg-white">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline" onClick={() => navigate("/analytics")}>Home</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline" onClick={() => navigate("/analytics")}>Analytics</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-foreground font-semibold">Resumo Executivo</span>
        </div>
      </header>

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
          <button className="flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
            <Eraser className="w-4 h-4" /> Limpar Filtros
          </button>
        </div>
      </div>

      {/* Content: main + sidebar */}
      <div className="px-6 py-4 flex-1">
        <div>
          {/* Main content */}
          <div className="flex-1 space-y-3">

            {/* ═══ Linha 1: Score Compacto + 4 KPI Cards ═══ */}
            <div className="grid grid-cols-5 gap-3">
              {/* Score Operacional compacto */}
              <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Score Operacional</p>
                  <InfoTip text="Índice de saúde da operação calculado a partir de 5 indicadores: qualidade do ponto, absenteísmo, volume de horas extras, movimentações e cobertura efetiva. Pesos configuráveis em Configuração." />
                </div>
                <ScoreGauge score={activeScore} />
                <p className={`text-3xl font-bold leading-none -mt-1 ${scoreColor}`}>{activeScore}</p>
                <p className={`text-xs font-semibold ${scoreColor} mt-0.5`}>{activeFaixa}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp size={12} className="text-green-500" />
                  <span className="text-[11px] font-medium text-green-600">+{activeDiff} vs anterior</span>
                </div>
              </div>

              {/* Melhor Operação */}
              <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="flex justify-between items-start">
                  <TrendingUp size={16} className="text-green-500" />
                  <InfoTip text="Operação com maior score operacional no período" />
                </div>
                <p className="text-[11px] font-medium text-muted-foreground mt-2">Melhor Operação</p>
                <p className="text-base font-semibold mt-0.5 truncate">{resumo.melhorOperacao.nome}</p>
                <p className="text-[11px] text-muted-foreground mt-1 truncate">Score {resumo.melhorOperacao.score} · Alta</p>
              </div>

              {/* Maior Risco */}
              <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="flex justify-between items-start">
                  <AlertTriangle size={16} className="text-red-500" />
                  <InfoTip text="Operação com menor score e maior concentração de risco" />
                </div>
                <p className="text-[11px] font-medium text-muted-foreground mt-2">Maior Risco</p>
                <p className="text-base font-semibold mt-0.5 text-red-600 truncate">{resumo.maiorRisco.nome}</p>
                <p className="text-[11px] text-muted-foreground mt-1 truncate">Score {resumo.maiorRisco.score} · {resumo.maiorRisco.indicador}</p>
              </div>

              {/* Principal Melhora */}
              <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="flex justify-between items-start">
                  <ArrowDownRight size={16} className="text-green-500" />
                  <InfoTip text="Indicador com maior evolução positiva no período" />
                </div>
                <p className="text-[11px] font-medium text-muted-foreground mt-2">Principal Melhora</p>
                <p className="text-base font-semibold mt-0.5 text-green-600 truncate">Qualidade Ponto</p>
                <p className="text-[11px] text-muted-foreground mt-1 truncate">+4.1 pp (83.2% → 87.3%)</p>
              </div>

              {/* Principal Piora */}
              <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="flex justify-between items-start">
                  <ArrowUpRight size={16} className="text-red-500" />
                  <InfoTip text="Indicador com maior deterioração no período" />
                </div>
                <p className="text-[11px] font-medium text-muted-foreground mt-2">Principal Piora</p>
                <p className="text-base font-semibold mt-0.5 text-red-600 truncate">Atrasos e Faltas</p>
                <p className="text-[11px] text-muted-foreground mt-1 truncate">+52.4% no período</p>
              </div>
            </div>

            {/* ═══ Linha 2: Indicadores — lista vertical com sparklines inline ═══ */}
            <div className="bg-card border border-border/50 rounded-xl">
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
              {sparklineCards.map((card) => {
                const lastIdx = card.evolucao.length - 1;
                return (
                  <div key={card.label} className="flex items-center gap-4 px-4 py-2.5 hover:bg-muted/30 transition-colors">
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
                          <RechartsTooltip
                            content={<SparklineTooltip cardData={card} />}
                            cursor={false}
                            wrapperStyle={{ zIndex: 9999 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="valor"
                            stroke={getLineColor(card.score)}
                            strokeWidth={3}
                            dot={(props: any) => (
                              <circle
                                key={props.index}
                                cx={props.cx}
                                cy={props.cy}
                                r={props.index === lastIdx ? 5 : 3.5}
                                fill={getLineColor(card.score)}
                                stroke="white"
                                strokeWidth={2}
                                className="cursor-pointer"
                              />
                            )}
                            activeDot={{ r: 4, fill: getLineColor(card.score), stroke: 'white', strokeWidth: 2 }}
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

            {/* ═══ Linha 3: Ranking ═══ */}
            <div className="bg-card border border-border/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">Ranking de Operações</h3>
              <p className="text-xs text-muted-foreground mb-4">Score operacional por regional</p>
              <div className="space-y-3">
                {rankingOperacoes.map((op) => (
                  <div key={op.nome} className="flex items-center gap-4">
                    <span className="text-sm font-medium min-w-[120px]">{op.nome}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 relative">
                      <div
                        className={`h-3 rounded-full ${
                          op.score >= 85 ? "bg-green-500" :
                          op.score >= 70 ? "bg-orange-400" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${op.score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-semibold min-w-[40px] text-right ${
                      op.score >= 85 ? "text-green-600" :
                      op.score >= 70 ? "text-orange-500" :
                      "text-red-600"
                    }`}>
                      {op.score}
                    </span>
                    {op.tendencia === "melhorando" && <TrendingUp size={14} className="text-green-500" />}
                    {op.tendencia === "estavel" && <Minus size={14} className="text-gray-400" />}
                    {op.tendencia === "piorando" && <TrendingDown size={14} className="text-red-500" />}
                  </div>
                ))}
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
        </div>
      </div>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
