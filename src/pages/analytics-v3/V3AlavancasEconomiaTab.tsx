import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, LineChart, Line
} from "recharts";
import {
  driversV3, driversAlavancas, mesesPeriodo, formatCurrencyV3, formatNumberV3,
  confiancaBadgeV3, V3Driver, driverColors
} from "@/lib/analyticsV3Data";
import { TrendingUp, TrendingDown, Minus, X, Zap, AlertTriangle, Trophy } from "lucide-react";

export default function V3AlavancasEconomiaTab() {
  const [selectedDriverId, setSelectedDriverId] = useState(driversAlavancas[0]);
  const [detailDriver, setDetailDriver] = useState<V3Driver | null>(null);

  const alavancas = driversV3.filter(d => driversAlavancas.includes(d.id));
  const selectedDriver = driversV3.find(d => d.id === selectedDriverId) || alavancas[0];

  const sorted = [...alavancas].sort((a, b) => b.valorMonetizado - a.valorMonetizado);
  const principalAlavanca = sorted[0];
  const driverAtencao = [...alavancas].sort((a, b) => {
    const sa = a.tendencia === "down" ? 0 : a.tendencia === "stable" ? 1 : 2;
    const sb = b.tendencia === "down" ? 0 : b.tendencia === "stable" ? 1 : 2;
    return sa - sb;
  })[0];

  const operacionalData = selectedDriver.evolucaoMensal.map(e => ({
    mes: e.mes,
    valor: e.atual,
    baseline: e.baseline,
  }));
  const mediaOp = Math.round(operacionalData.reduce((s, d) => s + d.valor, 0) / operacionalData.length);

  const financeiroData = selectedDriver.evolucaoMensal.map(e => ({
    mes: e.mes,
    economia: e.valor,
  }));
  const mediaFin = Math.round(financeiroData.reduce((s, d) => s + d.economia, 0) / financeiroData.length);

  const TendIcon = ({ t }: { t: string }) => {
    if (t === "up") return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
    if (t === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-foreground">Alavancas de Economia</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Zap className="w-4 h-4 text-primary" /></div>
          <div>
            <p className="text-xs text-muted-foreground">Principal Alavanca</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{principalAlavanca?.nome}</p>
            <p className="text-xs text-muted-foreground">{formatCurrencyV3(principalAlavanca?.valorMonetizado || 0)}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-green-500/10"><Trophy className="w-4 h-4 text-green-600" /></div>
          <div>
            <p className="text-xs text-muted-foreground">Maior Economia no Período</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrencyV3(principalAlavanca?.valorMonetizado || 0)}</p>
            <p className="text-xs text-muted-foreground">{principalAlavanca?.modulo}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10"><AlertTriangle className="w-4 h-4 text-amber-600" /></div>
          <div>
            <p className="text-xs text-muted-foreground">Driver em Atenção</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{driverAtencao?.nome}</p>
            <p className="text-xs text-muted-foreground">Tendência: {driverAtencao?.tendencia === "down" ? "queda" : driverAtencao?.tendencia === "stable" ? "estável" : "alta"}</p>
          </div>
        </div>
      </div>

      {/* Driver selector */}
      <div className="flex gap-2 flex-wrap">
        {alavancas.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDriverId(d.id)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${selectedDriverId === d.id ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:bg-muted"}`}
          >
            {d.nome}
          </button>
        ))}
      </div>

      {/* Dual chart layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Operational chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-1 text-sm">Evolução Operacional: {selectedDriver.nome}</h3>
          <p className="text-xs text-muted-foreground mb-4">Volume em {selectedDriver.unidade} por competência {selectedDriver.direcao === "lower_is_better" ? "· Quanto menor, melhor" : "· Quanto maior, melhor"}</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={operacionalData} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="mes" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => formatNumberV3(v)} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  const variacao = d?.baseline > 0 ? (((d.valor - d.baseline) / d.baseline) * 100).toFixed(1) : "N/A";
                  return (
                    <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-xs">
                      <p className="font-bold text-foreground mb-1">{label}</p>
                      <div className="space-y-0.5">
                        <div className="flex justify-between gap-4"><span className="text-muted-foreground">Volume</span><span className="font-semibold">{formatNumberV3(d?.valor ?? 0)} {selectedDriver.unidade}</span></div>
                        <div className="flex justify-between gap-4"><span className="text-muted-foreground">Baseline</span><span>{formatNumberV3(d?.baseline ?? 0)}</span></div>
                        <div className="flex justify-between gap-4"><span className="text-muted-foreground">Variação</span><span className={Number(variacao) < 0 === (selectedDriver.direcao === "lower_is_better") ? "text-green-600" : "text-red-600"}>{variacao}%</span></div>
                      </div>
                    </div>
                  );
                }}
              />
              <ReferenceLine y={mediaOp} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="6 3" label={{ value: `Média: ${formatNumberV3(mediaOp)}`, position: "right", fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <Bar dataKey="valor" fill={driverColors[selectedDriver.id] || "hsl(var(--primary))"} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-1 text-sm">Economia Gerada: {selectedDriver.nome}</h3>
          <p className="text-xs text-muted-foreground mb-4">Valor em R$ por competência · Confiança: {confiancaBadgeV3(selectedDriver.confianca).label}</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={financeiroData} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="mes" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrencyV3(v)} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const val = payload[0]?.value ?? 0;
                  return (
                    <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-xs">
                      <p className="font-bold text-foreground mb-1">{label}</p>
                      <div className="flex justify-between gap-4"><span className="text-muted-foreground">Economia</span><span className="font-semibold text-foreground">{formatCurrencyV3(val as number)}</span></div>
                    </div>
                  );
                }}
              />
              <ReferenceLine y={mediaFin} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="6 3" label={{ value: `Média: ${formatCurrencyV3(mediaFin)}`, position: "right", fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <Bar dataKey="economia" fill="#22c55e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Consolidado do Período</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs">Driver</th>
                <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground text-xs">Unidade</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Comp. Inicial</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Comp. Atual</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Variação</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Economia</th>
                <th className="text-center px-2 py-2.5 font-semibold text-muted-foreground text-xs">Confiança</th>
                <th className="text-center px-2 py-2.5 font-semibold text-muted-foreground text-xs">Tend.</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Part.</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(d => {
                const badge = confiancaBadgeV3(d.confianca);
                return (
                  <tr key={d.id} onClick={() => setDetailDriver(d)} className="border-b border-border/50 hover:bg-muted/40 cursor-pointer transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: driverColors[d.id] }} />
                        <span className="font-medium text-foreground text-xs">{d.nome}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{d.unidade}</td>
                    <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">{formatNumberV3(d.competenciaAnterior)}</td>
                    <td className="px-3 py-2.5 text-right text-xs font-medium text-foreground">{formatNumberV3(d.atual)}</td>
                    <td className="px-3 py-2.5 text-right text-xs"><span className={d.deltaOperacional < 0 === (d.direcao === "lower_is_better") ? "text-green-600" : "text-red-600"}>{d.deltaOperacional > 0 ? "+" : ""}{d.deltaOperacional}%</span></td>
                    <td className="px-3 py-2.5 text-right font-semibold text-foreground text-xs">{formatCurrencyV3(d.valorMonetizado)}</td>
                    <td className="px-2 py-2.5 text-center"><span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: badge.bg, color: badge.color }}>{badge.label}</span></td>
                    <td className="px-2 py-2.5 text-center"><TendIcon t={d.tendencia} /></td>
                    <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">{d.participacao}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailDriver && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDetailDriver(null)}>
          <div className="bg-card rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: driverColors[detailDriver.id] }} />
                  <h2 className="text-xl font-bold text-foreground">{detailDriver.nome}</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{detailDriver.modulo} · {detailDriver.unidade} · {detailDriver.direcao === "lower_is_better" ? "Quanto menor, melhor" : "Quanto maior, melhor"}</p>
              </div>
              <button onClick={() => setDetailDriver(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-muted/50 rounded-lg p-3 text-center"><p className="text-xs text-muted-foreground">Comp. Inicial</p><p className="text-sm font-bold text-foreground">{formatNumberV3(detailDriver.competenciaAnterior)}</p></div>
              <div className="bg-muted/50 rounded-lg p-3 text-center"><p className="text-xs text-muted-foreground">Comp. Atual</p><p className="text-sm font-bold text-foreground">{formatNumberV3(detailDriver.atual)}</p></div>
              <div className="bg-muted/50 rounded-lg p-3 text-center"><p className="text-xs text-muted-foreground">Variação</p><p className="text-sm font-bold">{detailDriver.deltaOperacional > 0 ? "+" : ""}{detailDriver.deltaOperacional}%</p></div>
              <div className="bg-muted/50 rounded-lg p-3 text-center"><p className="text-xs text-muted-foreground">Economia Total</p><p className="text-sm font-bold text-foreground">{formatCurrencyV3(detailDriver.valorMonetizado)}</p></div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-foreground/80 mb-3 text-sm border-b border-border pb-2">Metodologia</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><span className="font-medium text-foreground">Fórmula:</span> <code className="bg-muted px-2 py-0.5 rounded text-xs">{detailDriver.formulaResumo}</code></p>
                <p><span className="font-medium text-foreground">Fonte baseline:</span> {detailDriver.fonteBaseline}</p>
                <p><span className="font-medium text-foreground">Fonte atual:</span> {detailDriver.fonteAtual}</p>
                <p><span className="font-medium text-foreground">Obs:</span> {detailDriver.observacoes}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/80 mb-3 text-sm border-b border-border pb-2">Drill-down por Operação</h3>
              {detailDriver.porOperacao.map((op, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
                  <div><p className="text-sm font-medium text-foreground">{op.nome}</p><p className="text-xs text-muted-foreground">{op.colaboradores} colaboradores</p></div>
                  <div className="text-right"><p className="text-sm font-semibold text-foreground">{formatCurrencyV3(op.valor)}</p><p className="text-xs text-green-600">Delta: {op.delta}%</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
