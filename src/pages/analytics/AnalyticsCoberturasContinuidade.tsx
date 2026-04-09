import { useState, useMemo } from "react";
import { Info, TrendingUp, TrendingDown, Minus, Eraser } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { coberturas } from "@/lib/analytics-mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell,
} from "recharts";

// ── Gauge semicircular (identical to Resumo Executivo) ──────
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

function InfoTip({ text }: { text: string }) {
  return (
    <UITooltip>
      <TooltipTrigger asChild><Info size={14} className="text-muted-foreground cursor-help" /></TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-xs">{text}</TooltipContent>
    </UITooltip>
  );
}

function TrendIcon({ t }: { t: string }) {
  if (t === "melhorando") return <TrendingUp size={14} className="text-green-500" />;
  if (t === "piorando") return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
}

const getScoreColor = (s: number) => s >= 85 ? "text-green-600" : s >= 70 ? "text-orange-500" : s < 60 ? "text-red-600" : "text-yellow-600";

export default function AnalyticsCoberturasContinuidade({ embedded }: { embedded?: boolean }) {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);

  const { kpis, distribuicaoTipoEvento, evolucao, regionais } = coberturas;

  // Cross-filter: compute active values based on selected regional
  const activeData = useMemo(() => {
    if (!selectedRegional) {
      return {
        score: coberturas.scoreEficiencia,
        scoreDiff: coberturas.scoreDiferenca,
        ausenciasCobertas: kpis.ausenciasCobertas,
        coberturasComHE: kpis.coberturasComHE,
        donut: distribuicaoTipoEvento,
      };
    }
    const r = regionais.find((reg: any) => reg.nome === selectedRegional);
    if (!r) return { score: coberturas.scoreEficiencia, scoreDiff: coberturas.scoreDiferenca, ausenciasCobertas: kpis.ausenciasCobertas, coberturasComHE: kpis.coberturasComHE, donut: distribuicaoTipoEvento };
    return {
      score: r.score,
      scoreDiff: Math.round((r.score - coberturas.scoreEficiencia) + coberturas.scoreDiferenca),
      ausenciasCobertas: Math.round(r.regular * 1.24), // derived
      coberturasComHE: r.he,
      donut: [
        { name: "Hora Regular", value: r.regular, cor: "#22c55e" },
        { name: "Hora Extra", value: r.he, cor: "#ef4444" },
        { name: "Falta", value: r.falta, cor: "#f97316" },
        { name: "Atrasos", value: r.atrasos, cor: "#eab308" },
      ],
    };
  }, [selectedRegional, regionais, kpis, distribuicaoTipoEvento]);

  const scoreColor = getScoreColor(activeData.score);
  const scoreFaixa = activeData.score >= 80 ? "Bom" : activeData.score >= 70 ? "Atenção" : "Crítico";

  const handleRegionalClick = (nome: string) => {
    setSelectedRegional(prev => prev === nome ? null : nome);
  };

  const content = (
    <div className="px-6 py-4 space-y-3">
      {/* ═══ Linha 1: Score Compacto + 2 KPI Cards ═══ */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Score Cobertura</p>
            <InfoTip text="Índice de eficiência de cobertura calculado a partir de: taxa de ausências cobertas, tipo de evento gerado na apuração, tempo médio de reposição e dias de posto descoberto." />
          </div>
          <ScoreGauge score={activeData.score} />
          <p className={`text-3xl font-bold leading-none -mt-1 ${scoreColor}`}>{activeData.score}</p>
          <p className={`text-xs font-semibold ${scoreColor} mt-0.5`}>{scoreFaixa}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <TrendingUp size={12} className="text-green-500" />
            <span className="text-[11px] font-medium text-green-600">+{activeData.scoreDiff} vs anterior</span>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-medium text-muted-foreground">Ausências Cobertas</p>
            <InfoTip text="Percentual das ausências que foram cobertas por algum tipo de reposição." />
          </div>
          <p className={`text-2xl font-bold mt-2 ${activeData.ausenciasCobertas >= 75 ? "text-green-600" : "text-yellow-600"}`}>{activeData.ausenciasCobertas}%</p>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-medium text-muted-foreground">Coberturas com HE</p>
            <InfoTip text="Percentual das coberturas que geraram eventos de hora extra na apuração." />
          </div>
          <p className="text-2xl font-bold mt-2 text-red-600">{activeData.coberturasComHE}%</p>
        </div>
      </div>

      {/* ═══ Linha 2: Donut + AreaChart lado a lado ═══ */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <h4 className="text-sm font-semibold">Distribuição por Tipo de Evento</h4>
            <InfoTip text="Classificação baseada nos eventos reais de apuração gerados pela cobertura. Hora Regular indica coberturas que geraram apenas horas normais. Hora Extra indica coberturas onde houve eventos de HE." />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart margin={{ top: 20, right: 20, bottom: 0, left: 20 }}>
              <Pie data={activeData.donut} cx="50%" cy="45%" innerRadius={55} outerRadius={90} dataKey="value" nameKey="name" label={({ value }) => `${value}%`}>
                {activeData.donut.map((e: any, i: number) => <Cell key={i} fill={e.cor} />)}
              </Pie>
              <RechartsTooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-0.5">Evolução por Competência</h4>
          <p className="text-[11px] text-muted-foreground mb-2">Distribuição mensal dos tipos de evento na cobertura</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={evolucao}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="competencia" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <RechartsTooltip />
              <Legend />
              <Area type="monotone" dataKey="regular" stackId="1" fill="#22c55e" stroke="#22c55e" fillOpacity={0.6} name="Hora Regular" />
              <Area type="monotone" dataKey="he" stackId="1" fill="#ef4444" stroke="#ef4444" fillOpacity={0.6} name="Hora Extra" />
              <Area type="monotone" dataKey="falta" stackId="1" fill="#f97316" stroke="#f97316" fillOpacity={0.6} name="Falta" />
              <Area type="monotone" dataKey="atrasos" stackId="1" fill="#eab308" stroke="#eab308" fillOpacity={0.6} name="Atrasos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══ Linha 3: Ranking de Regionais (mesmo layout do Resumo Executivo) ═══ */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold">Ranking de Coberturas por Regional</h3>
          {selectedRegional && (
            <button onClick={() => setSelectedRegional(null)} className="text-[11px] text-[#FF5722] hover:underline flex items-center gap-1">
              <Eraser size={12} /> Limpar seleção
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">Score de cobertura e distribuição por tipo de evento · clique para filtrar</p>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-green-500" /> Hora Regular</div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-yellow-400" /> Atrasos</div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-orange-400" /> Falta</div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Hora Extra</div>
        </div>

        <div>
          <div className="space-y-3">
            {regionais.map((op: any) => {
              const isSelected = selectedRegional === op.nome;
              const isDimmed = selectedRegional && !isSelected;
              const barScoreColor = op.score >= 85 ? "text-green-600" : op.score >= 70 ? "text-orange-500" : "text-red-600";
              return (
                <div
                  key={op.nome}
                  className={`flex items-center gap-4 cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-all ${
                    isSelected ? 'bg-orange-50 ring-1 ring-[#FF5722]/30' : 'hover:bg-muted/30'
                  } ${isDimmed ? 'opacity-35' : ''}`}
                  onClick={() => handleRegionalClick(op.nome)}
                >
                  <span className="text-sm font-medium min-w-[120px]">{op.nome}</span>
                  <div className="flex-1 relative h-4">
                    {/* Dashed grid lines on top */}
                    {[20, 40, 60, 80].map(p => (
                      <div
                        key={p}
                        className="absolute top-0 bottom-0 z-20 pointer-events-none"
                        style={{
                          left: `${p}%`,
                          backgroundImage: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, transparent 2px, transparent 5px)',
                          width: '1px',
                        }}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full flex">
                        {[
                          { pct: op.regular, hours: op.regularH, label: "Hora Regular", bg: "bg-green-500" },
                          { pct: op.atrasos, hours: op.atrasosH, label: "Atrasos", bg: "bg-yellow-400" },
                          { pct: op.falta, hours: op.faltaH, label: "Falta", bg: "bg-orange-400" },
                          { pct: op.he, hours: op.heH, label: "Hora Extra", bg: "bg-red-500" },
                        ].map((seg, idx) => (
                          <UITooltip key={idx}>
                            <TooltipTrigger asChild>
                              <div className={`h-4 ${seg.bg} transition-all cursor-default`} style={{ width: `${seg.pct}%` }} />
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">
                              <span className="font-semibold">{seg.label}</span>: {seg.pct}% · {seg.hours}h
                            </TooltipContent>
                          </UITooltip>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold min-w-[40px] text-right ${barScoreColor}`}>
                    {op.score}
                  </span>
                  <TrendIcon t={op.tendencia} />
                </div>
              );
            })}
          </div>

          {/* Footer percentage labels */}
          <div className="flex items-center gap-4 mt-1 -mx-2 px-2">
            <span className="min-w-[120px]" />
            <div className="flex-1 relative h-4">
              {[0, 20, 40, 60, 80, 100].map(p => (
                <span
                  key={p}
                  className="absolute text-[10px] text-muted-foreground -translate-x-1/2"
                  style={{ left: `${p}%` }}
                >
                  {p}%
                </span>
              ))}
            </div>
            <span className="min-w-[40px]" />
            <span className="w-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) return content;
  return content;
}
