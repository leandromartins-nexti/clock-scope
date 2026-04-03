import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, Legend
} from "recharts";
import {
  driversV3, mesesPeriodo, formatCurrencyV3, formatNumberV3,
  confiancaBadgeV3, V3Driver
} from "@/lib/analyticsV3Data";
import { TrendingUp, TrendingDown, Minus, X, Zap, AlertTriangle, Trophy } from "lucide-react";

const DRIVER_COLORS: Record<string, string> = {
  he: "#FF5722",
  an: "#2196F3",
  desc: "#4CAF50",
  rhd: "#9C27B0",
  fech: "#FF9800",
  disp: "#E91E63",
  quad: "#00BCD4",
  hpnf: "#607D8B",
  benef: "#795548",
};

export default function V3DriversValorTab() {
  const [selectedDriver, setSelectedDriver] = useState<V3Driver | null>(null);
  const monetarios = driversV3.filter(d => d.categoria === "monetario" && d.ativo);

  // Build stacked bar data per competência
  const stackedData = useMemo(() => {
    return mesesPeriodo.map(mes => {
      const row: Record<string, any> = { mes };
      let total = 0;
      monetarios.forEach(d => {
        const mesData = d.evolucaoMensal.find(e => e.mes === mes);
        const val = mesData?.valor ?? 0;
        row[d.id] = val;
        total += val;
      });
      row._total = total;
      return row;
    });
  }, [monetarios]);

  // Summary cards
  const sorted = [...monetarios].sort((a, b) => b.valorMonetizado - a.valorMonetizado);
  const principalAlavanca = sorted[0];
  const maiorEconomia = sorted[0];
  const driverAtencao = [...monetarios].sort((a, b) => {
    const scoreA = a.tendencia === "down" ? 0 : a.tendencia === "stable" ? 1 : 2;
    const scoreB = b.tendencia === "down" ? 0 : b.tendencia === "stable" ? 1 : 2;
    return scoreA - scoreB;
  })[0];

  const TendIcon = ({ t }: { t: string }) => {
    if (t === "up") return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
    if (t === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
    return (
      <div className="bg-background border border-border rounded-lg shadow-xl p-3 text-xs max-w-[260px]">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.filter((p: any) => p.value > 0).sort((a: any, b: any) => b.value - a.value).map((p: any) => {
          const driver = monetarios.find(d => d.id === p.dataKey);
          const badge = driver ? confiancaBadgeV3(driver.confianca) : null;
          const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : "0";
          return (
            <div key={p.dataKey} className="flex items-center justify-between gap-3 py-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.fill || p.color }} />
                <span className="text-muted-foreground truncate max-w-[120px]">{driver?.nome || p.dataKey}</span>
              </div>
              <div className="flex items-center gap-2">
                {badge && (
                  <span className="text-[10px] px-1 py-0 rounded" style={{ backgroundColor: badge.bg, color: badge.color }}>
                    {badge.label[0]}
                  </span>
                )}
                <span className="font-medium text-foreground">{formatCurrencyV3(p.value)}</span>
                <span className="text-muted-foreground">({pct}%)</span>
              </div>
            </div>
          );
        })}
        <div className="border-t border-border mt-1.5 pt-1.5 flex justify-between font-semibold text-foreground">
          <span>Total</span>
          <span>{formatCurrencyV3(total)}</span>
        </div>
      </div>
    );
  };

  const handleBarClick = (data: any, _index: number, e: any) => {
    // Find which driver segment was clicked via activeTooltipIndex
    // Fallback: use the largest driver
    if (data?.activePayload?.length) {
      const topPayload = data.activePayload.sort((a: any, b: any) => b.value - a.value)[0];
      const driver = monetarios.find(d => d.id === topPayload.dataKey);
      if (driver) setSelectedDriver(driver);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-foreground">Drivers de Valor</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Principal Alavanca</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{principalAlavanca?.nome}</p>
            <p className="text-xs text-muted-foreground">{formatCurrencyV3(principalAlavanca?.valorMonetizado || 0)}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Trophy className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Maior Economia no Período</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrencyV3(maiorEconomia?.valorMonetizado || 0)}</p>
            <p className="text-xs text-muted-foreground">{maiorEconomia?.modulo}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Driver em Atenção</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{driverAtencao?.nome}</p>
            <p className="text-xs text-muted-foreground">Tendência: {driverAtencao?.tendencia === "down" ? "queda" : driverAtencao?.tendencia === "stable" ? "estável" : "alta"}</p>
          </div>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
        {/* Stacked bar chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-1 text-sm">Composição da Economia por Competência</h3>
          <p className="text-xs text-muted-foreground mb-4">Evolução da contribuição de cada driver ao longo do período</p>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={stackedData} onClick={handleBarClick} className="cursor-pointer">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="mes" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis fontSize={11} tickFormatter={(v) => formatCurrencyV3(v)} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value: string) => {
                  const d = monetarios.find(dr => dr.id === value);
                  return <span className="text-xs text-muted-foreground">{d?.nome || value}</span>;
                }}
                wrapperStyle={{ fontSize: 11 }}
              />
              {monetarios.map(d => (
                <Bar
                  key={d.id}
                  dataKey={d.id}
                  stackId="economia"
                  fill={DRIVER_COLORS[d.id] || "#888"}
                  radius={0}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">Ranking de Drivers</h3>
            <p className="text-xs text-muted-foreground">Consolidado do período</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs">Driver</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Economia</th>
                  <th className="text-center px-2 py-2.5 font-semibold text-muted-foreground text-xs">Conf.</th>
                  <th className="text-center px-2 py-2.5 font-semibold text-muted-foreground text-xs">Tend.</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Part.</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(d => {
                  const badge = confiancaBadgeV3(d.confianca);
                  return (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDriver(d)}
                      className="border-b border-border/50 hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: DRIVER_COLORS[d.id] }} />
                          <span className="font-medium text-foreground text-xs leading-tight">{d.nome}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-foreground text-xs">{formatCurrencyV3(d.valorMonetizado)}</td>
                      <td className="px-2 py-2.5 text-center">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-center"><TendIcon t={d.tendencia} /></td>
                      <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">{d.participacao}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedDriver && (
        <DriverModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
      )}
    </div>
  );
}

function DriverModal({ driver, onClose }: { driver: V3Driver; onClose: () => void }) {
  const badge = confiancaBadgeV3(driver.confianca);
  const first = driver.evolucaoMensal[0];
  const last = driver.evolucaoMensal[driver.evolucaoMensal.length - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: DRIVER_COLORS[driver.id] }} />
              <h2 className="text-xl font-bold text-foreground">{driver.nome}</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{driver.modulo} · {driver.unidade}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        {/* Evolução */}
        <Section title="Evolução por Competência">
          <div className="grid grid-cols-4 gap-3 mb-4">
            <MiniKPI label="Primeira Comp." value={formatNumberV3(first?.atual ?? 0)} />
            <MiniKPI label="Comp. Atual" value={formatNumberV3(last?.atual ?? 0)} />
            <MiniKPI label="Delta Período" value={`${driver.deltaOperacional > 0 ? "+" : ""}${driver.deltaOperacional}%`} />
            <MiniKPI label="Economia Total" value={formatCurrencyV3(driver.valorMonetizado)} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={driver.evolucaoMensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip formatter={(v: number) => formatCurrencyV3(v)} />
              <Bar dataKey="baseline" fill="hsl(var(--muted))" name="Baseline" />
              <Bar dataKey="atual" fill={DRIVER_COLORS[driver.id] || "#FF5722"} name="Atual" />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        {/* Conversão Financeira */}
        <Section title="Conversão Financeira">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-medium text-foreground">Fórmula:</span>{" "}
            <code className="bg-muted px-2 py-0.5 rounded text-xs">{driver.formulaResumo}</code>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: badge.bg, color: badge.color }}>{badge.label}</span>
            <span className="text-xs text-muted-foreground">{driver.tipoValor === "custo_evitado" ? "Custo Evitado" : "Perda Evitada"}</span>
          </div>
        </Section>

        {/* Metodologia */}
        <Section title="Metodologia">
          <div className="text-sm space-y-1 text-muted-foreground">
            <p><span className="font-medium text-foreground">Fonte baseline:</span> {driver.fonteBaseline}</p>
            <p><span className="font-medium text-foreground">Fonte atual:</span> {driver.fonteAtual}</p>
            <p><span className="font-medium text-foreground">Janela:</span> {driver.janelaComparacao}</p>
            <p><span className="font-medium text-foreground">Obs:</span> {driver.observacoes}</p>
          </div>
        </Section>

        {/* Drill-down */}
        <Section title="Drill-down por Operação">
          <div className="space-y-2">
            {driver.porOperacao.map((op, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{op.nome}</p>
                  <p className="text-xs text-muted-foreground">{op.colaboradores} colaboradores</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatCurrencyV3(op.valor)}</p>
                  <p className="text-xs text-green-600">Delta: {op.delta}%</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {driver.upgradePaths && driver.upgradePaths.length > 0 && (
          <Section title="Caminho de Elevação">
            {driver.upgradePaths.map((up, i) => (
              <div key={i} className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                <p className="font-medium text-foreground">{up.acao}</p>
                <p className="text-xs text-muted-foreground mt-1">{up.de} → {up.para} · {up.impacto}</p>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-foreground/80 mb-3 text-sm border-b border-border pb-2">{title}</h3>
      {children}
    </div>
  );
}

function MiniKPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
