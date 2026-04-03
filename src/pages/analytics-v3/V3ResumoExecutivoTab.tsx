import { TrendingUp, ShieldAlert, Lightbulb, Info, Gauge, Trophy, Target, AlertTriangle } from "lucide-react";
import { getV3KPIs, formatCurrencyV3, generateV3Insights, driversV3, getNivelConfianca, getScoreOperacional, getScoreFaixa, coberturaRiscoV3, absenteismoV3 } from "@/lib/analyticsV3Data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function V3ResumoExecutivoTab() {
  const kpis = getV3KPIs();
  const insights = generateV3Insights();
  const nivelConfianca = getNivelConfianca();
  const scoreOp = getScoreOperacional();
  const scoreFaixa = getScoreFaixa(scoreOp);
  const topDriver = driversV3.filter(d => d.categoria === "monetario" && d.ativo).sort((a, b) => b.valorMonetizado - a.valorMonetizado)[0];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Hero: Economia + Score lado a lado */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Economia Gerada */}
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

            {/* Score Operacional */}
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
          {/* Nível de Confiança */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                Nível de Confiança
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Indicador que representa a confiabilidade da economia gerada, considerando a composição entre drivers comprovados, híbridos e referenciais e os pesos definidos na configuração.
                  </TooltipContent>
                </Tooltip>
              </p>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <p className={`text-2xl font-bold ${nivelConfianca >= 75 ? "text-green-600" : nivelConfianca >= 50 ? "text-yellow-600" : "text-red-600"}`}>{nivelConfianca}%</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${nivelConfianca}%`, backgroundColor: nivelConfianca >= 75 ? "#16a34a" : nivelConfianca >= 50 ? "#eab308" : "#ef4444" }} />
            </div>
          </div>

          {/* Principal Alavanca */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500">Principal Alavanca</p>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{topDriver.nome}</p>
            <p className="text-xs text-gray-400 mt-1">{formatCurrencyV3(topDriver.valorMonetizado)} · {topDriver.participacao}%</p>
          </div>

          {/* Melhor Operação */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500">Melhor Operação</p>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{kpis.melhorOperacao}</p>
            <p className="text-xs text-gray-400 mt-1">Score 88 · Tendência de alta</p>
          </div>

          {/* Maior Risco */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500">Maior Risco</p>
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{kpis.maiorRisco}</p>
            <p className="text-xs text-gray-400 mt-1">Score 64 · Absenteísmo {absenteismoV3.porEstrutura.find(e => e.nome === "Regional BA")?.taxa}%</p>
          </div>
        </div>

        {/* Destaques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Principal Alavanca</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">{topDriver.nome}</p>
            <p className="text-sm text-gray-500 mt-1">
              {formatCurrencyV3(topDriver.valorMonetizado)} · {topDriver.participacao}% da economia · {topDriver.confianca === "comprovado" ? "Dados reais" : topDriver.confianca === "hibrido" ? "Dados parciais" : "Benchmark"}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Delta operacional: {topDriver.deltaOperacional > 0 ? "+" : ""}{topDriver.deltaOperacional}% vs competência anterior
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-800">Principal Preocupação</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">Regional BA</p>
            <p className="text-sm text-gray-500 mt-1">
              Score de cobertura: 58 · Absenteísmo: {absenteismoV3.porEstrutura.find(e => e.nome === "Regional BA")?.taxa}% · Tendência de piora
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Maior taxa de absenteísmo e menor score de eficiência operacional
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#FF5722]" />
            <h3 className="font-semibold text-gray-800">Insights da Operação</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF5722] mt-2 shrink-0" />
                <p className="text-sm text-gray-600">{insight}</p>
              </div>
            ))}
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
