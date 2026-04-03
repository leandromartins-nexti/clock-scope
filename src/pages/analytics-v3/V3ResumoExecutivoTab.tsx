import { TrendingUp, ShieldAlert, Lightbulb, Info, Trophy, Target, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import { getV3KPIs, formatCurrencyV3, generateV3Insights, driversV3, getNivelConfianca, getScoreOperacional, getScoreFaixa, coberturaRiscoV3, absenteismoV3, getEvolucaoConsolidada } from "@/lib/analyticsV3Data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

export default function V3ResumoExecutivoTab() {
  const kpis = getV3KPIs();
  const insights = generateV3Insights();
  const nivelConfianca = getNivelConfianca();
  const scoreOp = getScoreOperacional();
  const scoreFaixa = getScoreFaixa(scoreOp);
  const topDriver = driversV3.filter(d => d.categoria === "monetario" && d.ativo).sort((a, b) => b.valorMonetizado - a.valorMonetizado)[0];
  const evolucao = getEvolucaoConsolidada();

  const insightIcons = [CheckCircle2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, TrendingDown];
  const insightColors = ["text-green-600", "text-primary", "text-amber-600", "text-red-500", "text-green-600", "text-amber-600"];
  const insightBgs = ["bg-green-50 border-green-200", "bg-primary/5 border-primary/20", "bg-amber-50 border-amber-200", "bg-red-50 border-red-200", "bg-green-50 border-green-200", "bg-amber-50 border-amber-200"];

  return (
    <TooltipProvider>
      <div className="space-y-5">
        {/* Hero: Economia + Score lado a lado */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Economia Gerada</p>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-none">{formatCurrencyV3(kpis.valorCapturado)}</h1>
              <div className="mt-5 flex items-center gap-2 flex-wrap">
                <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium">abr/2025 – mar/2026</span>
                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">Orsegups</span>
                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">8.000 colaboradores</span>
              </div>
              <p className="text-xs text-muted-foreground/60 mt-3">Soma de todos os drivers monetizados ativos no período</p>
            </div>
            <div className="p-8 flex flex-col items-center justify-center">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-1.5">
                Score Operacional
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Indicador consolidado de saúde operacional (0-100) baseado em absenteísmo, eficiência de cobertura, postos descobertos, reserva técnica, dependência de HE e produtividade do time.
                  </TooltipContent>
                </Tooltip>
              </p>
              <SpeedometerGauge value={scoreOp} />
              <p className="text-base font-bold mt-4" style={{ color: scoreFaixa.color }}>{scoreFaixa.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Saúde geral da operação</p>
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
                  <TooltipContent className="max-w-xs text-xs">Confiabilidade da economia gerada, considerando drivers comprovados, híbridos e referenciais.</TooltipContent>
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
            <p className="text-sm font-bold text-foreground leading-tight">{topDriver.nome}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrencyV3(topDriver.valorMonetizado)} · {topDriver.participacao}%</p>
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

        {/* Evolução + Insights lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Evolução mensal - 3 colunas */}
          <div className="lg:col-span-3 bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Evolução da Economia</h3>
                <p className="text-xs text-muted-foreground">Valor capturado mês a mês no período</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={evolucao} barCategoryGap="20%">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const valor = payload.find(p => p.dataKey === "valorCapturado")?.value as number;
                    const meta = payload.find(p => p.dataKey === "meta")?.value as number;
                    const acum = payload.find(p => p.dataKey === "acumulado")?.value as number;
                    const diff = valor && meta ? ((valor - meta) / meta * 100).toFixed(1) : null;
                    return (
                      <div className="bg-card border border-border rounded-xl shadow-xl p-3.5 text-xs min-w-[180px]">
                        <p className="font-bold text-foreground mb-2">{label}</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Economia</span>
                            <span className="font-bold text-foreground">{formatCurrencyV3(valor)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Meta</span>
                            <span className="font-medium text-muted-foreground">{formatCurrencyV3(meta)}</span>
                          </div>
                          {diff && (
                            <div className="flex justify-between border-t border-border pt-1.5 mt-1">
                              <span className="text-muted-foreground">vs Meta</span>
                              <span className={`font-bold ${Number(diff) >= 0 ? "text-green-600" : "text-red-500"}`}>{Number(diff) >= 0 ? "+" : ""}{diff}%</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Acumulado</span>
                            <span className="font-medium text-foreground">{formatCurrencyV3(acum)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="valorCapturado"
                  fill="url(#barGrad)"
                  radius={[4, 4, 0, 0]}
                  name="Economia"
                />
                <Line
                  type="monotone"
                  dataKey="meta"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  name="Meta"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Insights - 2 colunas */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Insights da Operação</h3>
            </div>
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {insights.map((insight, i) => {
                const Icon = insightIcons[i % insightIcons.length];
                const colorClass = insightColors[i % insightColors.length];
                const bgClass = insightBgs[i % insightBgs.length];
                return (
                  <div key={i} className={`flex items-start gap-2.5 rounded-lg border p-3 ${bgClass}`}>
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colorClass}`} />
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

// ====== Speedometer Gauge Component ======
function SpeedometerGauge({ value }: { value: number }) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const size = 160;
  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const arcRatio = 0.75; // 270deg arc
  const arcLength = circumference * arcRatio;
  const valueLength = arcLength * (clampedValue / 100);
  const gapLength = arcLength - valueLength;
  const rotation = 135; // start at bottom-left

  const color = clampedValue >= 90 ? "hsl(142, 71%, 45%)" : clampedValue >= 75 ? "hsl(142, 71%, 45%)" : clampedValue >= 60 ? "hsl(var(--primary))" : "hsl(0, 84%, 60%)";

  return (
    <div className="relative" style={{ width: size, height: size * 0.7 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute top-0 left-0" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* Background track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
        />
        {/* Value arc */}
        {clampedValue > 0 && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${valueLength} ${circumference - valueLength}`}
            className="transition-all duration-700 ease-out"
          />
        )}
      </svg>
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: 8 }}>
        <span className="text-4xl font-extrabold" style={{ color }}>{clampedValue}</span>
      </div>
    </div>
  );
}
