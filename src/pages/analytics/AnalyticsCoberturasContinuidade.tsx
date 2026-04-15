import { useState, useMemo } from "react";
import { Info, TrendingUp, TrendingDown, Minus, Eraser, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { coberturas } from "@/lib/analytics-mock-data";
import { getSidebarItems } from "@/lib/ajustesData";
import { useQualidadePontoData } from "@/hooks/useQualidadePontoData";
import { buildDataSources } from "@/lib/qualidadeDataSources";
import { useScoreConfig, getScoreClassification } from "@/contexts/ScoreConfigContext";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell,
} from "recharts";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import { TrendIcon, getScoreColor } from "@/components/analytics/IndicatorTable";

export default function AnalyticsCoberturasContinuidade({ embedded }: { embedded?: boolean }) {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");

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
        melhorOperacao: { nome: "Regional SP", score: 88 },
        maiorRisco: { nome: "Regional BA", score: 52, indicador: "Cobertura 41%" },
        horaRegular: { valor: "68%", detalhe: "Estável vs anterior" },
        horaExtra: { valor: "24%", detalhe: "+3.2 pp vs anterior" },
      };
    }
    const r = regionais.find((reg: any) => reg.nome === selectedRegional);
    if (!r) return { score: coberturas.scoreEficiencia, scoreDiff: coberturas.scoreDiferenca, ausenciasCobertas: kpis.ausenciasCobertas, coberturasComHE: kpis.coberturasComHE, donut: distribuicaoTipoEvento, melhorOperacao: { nome: "Regional SP", score: 88 }, maiorRisco: { nome: "Regional BA", score: 52, indicador: "Cobertura 41%" }, horaRegular: { valor: "68%", detalhe: "Estável vs anterior" }, horaExtra: { valor: "24%", detalhe: "+3.2 pp vs anterior" } };
    return {
      score: r.score,
      scoreDiff: Math.round((r.score - coberturas.scoreEficiencia) + coberturas.scoreDiferenca),
      ausenciasCobertas: Math.round(r.regular * 1.24),
      coberturasComHE: r.he,
      donut: [
        { name: "Hora Regular", value: r.regular, cor: "#22c55e" },
        { name: "Hora Extra", value: r.he, cor: "#ef4444" },
        { name: "Falta", value: r.falta, cor: "#f97316" },
        { name: "Atrasos", value: r.atrasos, cor: "#eab308" },
      ],
      melhorOperacao: { nome: r.nome, score: r.score },
      maiorRisco: { nome: "Regional BA", score: 52, indicador: `HE ${r.he}%` },
      horaRegular: { valor: `${r.regular}%`, detalhe: "Cobertura regular" },
      horaExtra: { valor: `${r.he}%`, detalhe: "Cobertura com HE" },
    };
  }, [selectedRegional, regionais, kpis, distribuicaoTipoEvento]);

  const { config: scoreConfig } = useScoreConfig();
  const scoreClassif = getScoreClassification(activeData.score, scoreConfig);
  const scoreColor = scoreClassif.text;
  const scoreFaixa = scoreClassif.label;

  const handleRegionalClick = (nome: string) => {
    setSelectedRegional(prev => prev === nome ? null : nome);
  };
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };

  const { data: customerData } = useQualidadePontoData();
  const dataSources = useMemo(() => buildDataSources(customerData), [customerData]);
  const sidebarItems = useMemo(() => getSidebarItems(groupBy, undefined, dataSources), [groupBy, dataSources]);

  const content = (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 min-w-0 pl-6 pr-4 py-4 space-y-3 overflow-y-auto">
      {/* ═══ Linha 1: Score + 4 KPI Cards (idêntico ao Resumo Executivo) ═══ */}
      <div className="grid grid-cols-5 gap-3">
        {/* Score Cobertura */}
        <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Score Cobertura</p>
            <InfoTip text="Índice de eficiência de cobertura calculado a partir de: taxa de ausências cobertas, tipo de evento gerado na apuração, tempo médio de reposição e dias de posto descoberto." />
          </div>
          <ScoreGauge score={activeData.score} color={scoreClassif.color} />
          <p className={`text-3xl font-bold leading-none -mt-1 ${scoreColor}`}>{activeData.score}</p>
          <p className={`text-xs font-semibold ${scoreColor} mt-0.5`}>{scoreFaixa}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <TrendingUp size={12} className="text-green-500" />
            <span className="text-[11px] font-medium text-green-600">+{activeData.scoreDiff} vs anterior</span>
          </div>
        </div>

        {/* Melhor Operação */}
        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
          <div className="flex justify-between items-start">
            <TrendingUp size={16} className="text-green-500" />
            <InfoTip text="Operação com maior score de cobertura no período" />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Melhor Operação</p>
          <p className="text-base font-semibold mt-0.5 truncate">{activeData.melhorOperacao.nome}</p>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">Score {activeData.melhorOperacao.score} · Alta</p>
        </div>

        {/* Maior Risco */}
        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
          <div className="flex justify-between items-start">
            <AlertTriangle size={16} className="text-red-500" />
            <InfoTip text="Operação com menor cobertura e maior concentração de risco" />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Maior Risco</p>
          <p className="text-base font-semibold mt-0.5 text-red-600 truncate">{activeData.maiorRisco.nome}</p>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">Score {activeData.maiorRisco.score} · {activeData.maiorRisco.indicador}</p>
        </div>

        {/* Hora Regular */}
        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
          <div className="flex justify-between items-start">
            <ArrowDownRight size={16} className="text-green-500" />
            <InfoTip text="Percentual das coberturas realizadas em hora regular" />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Hora Regular</p>
          <p className="text-base font-semibold mt-0.5 text-green-600 truncate">{activeData.horaRegular.valor}</p>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">{activeData.horaRegular.detalhe}</p>
        </div>

        {/* Hora Extra */}
        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
          <div className="flex justify-between items-start">
            <ArrowUpRight size={16} className="text-red-500" />
            <InfoTip text="Percentual das coberturas que geraram hora extra" />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Hora Extra</p>
          <p className="text-base font-semibold mt-0.5 text-red-600 truncate">{activeData.horaExtra.valor}</p>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">{activeData.horaExtra.detalhe}</p>
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
              const barScoreClassif = getScoreClassification(op.score, scoreConfig);
              const barScoreColor = barScoreClassif.text;
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
                      <svg
                        key={p}
                        className="absolute top-0 z-20 pointer-events-none"
                        width="2"
                        height="16"
                        style={{ left: `${p}%` }}
                      >
                        <line x1="1" y1="0" x2="1" y2="16" stroke="rgba(0,0,0,0.35)" strokeWidth="1" strokeDasharray="3 3" />
                      </svg>
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
      <GroupBySidebar items={sidebarItems} selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} groupBy={groupBy} onGroupByChange={handleGroupByChange} />
    </div>
  );

  if (embedded) return content;
  return content;
}
