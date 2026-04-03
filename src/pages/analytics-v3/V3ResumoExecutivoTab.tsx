import { TrendingUp, ShieldAlert, Lightbulb, Info, Trophy, Target, AlertTriangle, CheckCircle2, Zap, ArrowUpRight } from "lucide-react";
import { getV3KPIs, formatCurrencyV3, generateV3Insights, getNivelConfianca, getScoreOperacional, getScoreFaixa, absenteismoV3, getEvolucaoConsolidada, getEvolucaoOperacional } from "@/lib/analyticsV3Data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import SpeedometerGauge from "./SpeedometerGauge";

export default function V3ResumoExecutivoTab() {
  const kpis = getV3KPIs();
  const insights = generateV3Insights();
  const nivelConfianca = getNivelConfianca();
  const scoreOp = getScoreOperacional();
  const scoreFaixa = getScoreFaixa(scoreOp);
  const evolucao = getEvolucaoConsolidada();
  const evolucaoOp = getEvolucaoOperacional();
  const mediaEconomia = Math.round(evolucao.reduce((s, e) => s + e.economiaGerada, 0) / evolucao.length);

  const insightIcons = [Zap, ArrowUpRight, AlertTriangle, CheckCircle2, Target, AlertTriangle, TrendingUp];
  const insightStyles = [
    "border-l-4 border-l-primary bg-primary/5",
    "border-l-4 border-l-green-500 bg-green-50",
    "border-l-4 border-l-red-500 bg-red-50",
    "border-l-4 border-l-blue-500 bg-blue-50",
    "border-l-4 border-l-green-500 bg-green-50",
    "border-l-4 border-l-amber-500 bg-amber-50",
    "border-l-4 border-l-blue-500 bg-blue-50",
  ];
  const insightIconColors = ["text-primary", "text-green-600", "text-red-500", "text-blue-600", "text-green-600", "text-amber-600", "text-blue-600"];

  return (
    <TooltipProvider>
      <div className="space-y-5">
        {/* Hero: Economia + Score */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Economia Gerada</p>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-none">{formatCurrencyV3(kpis.valorCapturado)}</h1>
              <p className="text-sm text-muted-foreground mt-3">Resultado consolidado da evolução operacional no período analisado</p>
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium">abr/2025 – mar/2026</span>
                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">Orsegups</span>
                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">8.000 colaboradores</span>
              </div>
            </div>
            <div className="p-8 flex flex-col items-center justify-center">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-1.5">
                Score Operacional
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Composição: qualidade do ponto, absenteísmo, coberturas, postos descobertos, reserva técnica e dependência de HE.
                  </TooltipContent>
                </Tooltip>
              </p>
              <SpeedometerGauge value={scoreOp} />
              <p className="text-base font-bold mt-4" style={{ color: scoreFaixa.color }}>{scoreFaixa.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Saúde geral da operação no período</p>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Nível de Confiança
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3 text-muted-foreground/50 cursor-help" /></TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">Confiabilidade da economia: soma(valor × peso_confiança) / soma(valor)</TooltipContent>
                </Tooltip>
              </p>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <p className={`text-2xl font-bold ${nivelConfianca >= 75 ? "text-green-600" : nivelConfianca >= 50 ? "text-amber-600" : "text-red-600"}`}>{nivelConfianca}%</p>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${nivelConfianca}%`, backgroundColor: nivelConfianca >= 75 ? "hsl(142,71%,45%)" : nivelConfianca >= 50 ? "hsl(45,93%,47%)" : "hsl(0,84%,60%)" }} />
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Principal Alavanca</p>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-foreground leading-tight">{topDriverData?.nome}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrencyV3(topDriverData?.valorMonetizado ?? 0)} · {topDriverData?.participacao}%</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Melhor Operação</p>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-lg font-bold text-foreground">{kpis.melhorOperacao}</p>
            <p className="text-xs text-muted-foreground mt-1">Score 88 · Tendência de alta</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Maior Risco</p>
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-lg font-bold text-foreground">{kpis.maiorRisco}</p>
            <p className="text-xs text-muted-foreground mt-1">Score 64 · Absenteísmo {absenteismoV3.porEstrutura.find(e => e.nome === "Regional BA")?.taxa}%</p>
          </div>
        </div>

        {/* Two charts + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Charts column - 3/5 */}
          <div className="lg:col-span-3 space-y-5">
            {/* Chart 1: Evolução Operacional */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground text-sm">Evolução Operacional dos Principais Vetores</h3>
                <p className="text-xs text-muted-foreground">Disciplina, absenteísmo e movimentações por competência</p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 bg-green-500 rounded" /><span className="text-[10px] text-muted-foreground">Qualidade do Ponto (%)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 bg-red-500 rounded" /><span className="text-[10px] text-muted-foreground">Absenteísmo (%)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 bg-amber-500 rounded" /><span className="text-[10px] text-muted-foreground">Pressão Operacional</span></div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={evolucaoOp}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="mes" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="pct" domain={[0, 100]} fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis yAxisId="abs" orientation="right" hide />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-xs">
                          <p className="font-bold text-foreground mb-1.5">{label}</p>
                          {payload.map((p, i) => (
                            <div key={i} className="flex justify-between gap-4 py-0.5">
                              <span className="text-muted-foreground">{p.name}</span>
                              <span className="font-medium text-foreground">{typeof p.value === 'number' ? (p.name?.toString().includes('Moviment') ? p.value.toLocaleString() : `${p.value}%`) : p.value}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                  <Line yAxisId="pct" type="monotone" dataKey="qualidadePonto" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} name="Qualidade do Ponto" />
                  <Line yAxisId="pct" type="monotone" dataKey="absenteismo" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} name="Absenteísmo" />
                  <Line yAxisId="pct" type="monotone" dataKey="pressaoOperacional" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} name="Pressão Operacional" strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Economia por competência */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground text-sm">Economia Gerada por Competência</h3>
                <p className="text-xs text-muted-foreground">Valor capturado mês a mês ao longo do período</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={evolucao} barCategoryGap="15%">
                  <defs>
                    <linearGradient id="barGradResumo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="mes" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrencyV3(v)} />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const dataPoint = evolucao.find(e => e.mes === label);
                      return (
                        <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-xs">
                          <p className="font-bold text-foreground mb-1.5">{label}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Economia</span><span className="font-semibold text-foreground">{formatCurrencyV3(dataPoint?.economiaGerada ?? 0)}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Acumulado</span><span className="font-medium text-muted-foreground">{formatCurrencyV3(dataPoint?.acumulado ?? 0)}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">% Comprovado</span><span className="font-medium text-green-600">{dataPoint?.pctComprovado ?? 0}%</span></div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    y={mediaEconomia}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1.5}
                    strokeDasharray="6 3"
                    label={{ value: `Média: ${formatCurrencyV3(mediaEconomia)}`, position: "right", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Bar dataKey="economiaGerada" fill="url(#barGradResumo)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights - 2/5 */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Insights da Operação</h3>
                <p className="text-[10px] text-muted-foreground">Análise executiva do período</p>
              </div>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {insights.map((insight, i) => {
                const Icon = insightIcons[i % insightIcons.length];
                const style = insightStyles[i % insightStyles.length];
                const iconColor = insightIconColors[i % insightIconColors.length];
                return (
                  <div key={i} className={`flex items-start gap-2.5 rounded-lg p-3 ${style}`}>
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                    <p className="text-xs text-foreground/80 leading-relaxed">{insight}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
