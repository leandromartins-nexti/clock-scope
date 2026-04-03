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
        {/* Hero: Economia Gerada + Score Operacional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Economia Gerada - destaque máximo */}
          <div className="md:col-span-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
            <p className="text-sm text-gray-300 mb-1">Economia Gerada</p>
            <h1 className="text-5xl font-bold tracking-tight">{formatCurrencyV3(kpis.valorCapturado)}</h1>
            <p className="text-sm text-gray-400 mt-2">abr/2025 – mar/2026 · Orsegups · 8.000 colaboradores</p>
            <p className="text-xs text-gray-500 mt-1">Soma de todos os drivers monetizados ativos no período</p>
          </div>

          {/* Score Operacional - Velocímetro */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center justify-center">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              Score Operacional
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  Indicador consolidado de saúde operacional (0-100) baseado em absenteísmo, eficiência de cobertura, postos descobertos, reserva técnica, dependência de HE e produtividade do time.
                </TooltipContent>
              </Tooltip>
            </p>
            <SpeedometerGauge value={scoreOp} />
            <p className="text-sm font-semibold mt-2" style={{ color: scoreFaixa.color }}>{scoreFaixa.label}</p>
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
  // Arc from -135deg to +135deg (270deg total)
  const startAngle = -135;
  const totalAngle = 270;
  const valueAngle = startAngle + (clampedValue / 100) * totalAngle;

  const r = 54;
  const cx = 64;
  const cy = 64;

  function polarToCartesian(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const bgStart = polarToCartesian(startAngle);
  const bgEnd = polarToCartesian(startAngle + totalAngle);
  const valEnd = polarToCartesian(valueAngle);
  const largeArcBg = totalAngle > 180 ? 1 : 0;
  const largeArcVal = (clampedValue / 100) * totalAngle > 180 ? 1 : 0;

  const color = clampedValue >= 90 ? "#16a34a" : clampedValue >= 75 ? "#22c55e" : clampedValue >= 60 ? "#eab308" : "#ef4444";

  return (
    <svg width="128" height="90" viewBox="0 0 128 90">
      {/* Background arc */}
      <path
        d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArcBg} 1 ${bgEnd.x} ${bgEnd.y}`}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Value arc */}
      {clampedValue > 0 && (
        <path
          d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArcVal} 1 ${valEnd.x} ${valEnd.y}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
        />
      )}
      {/* Value text */}
      <text x={cx} y={cy + 4} textAnchor="middle" className="text-2xl font-bold" fill={color} fontSize="28" fontWeight="700">
        {clampedValue}
      </text>
    </svg>
  );
}
