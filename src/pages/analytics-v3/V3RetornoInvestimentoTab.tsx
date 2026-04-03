import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import { getV3KPIs, formatCurrencyV3, ownershipV3, getEvolucaoConsolidada } from "@/lib/analyticsV3Data";

export default function V3RetornoInvestimentoTab() {
  const kpis = getV3KPIs();
  const evolucao = getEvolucaoConsolidada();
  const roiTotal = kpis.valorCapturado / ownershipV3.custoAnual;
  const roiComprovado = kpis.comprovado / ownershipV3.custoAnual;
  const paybackData = evolucao.map((e, i) => ({
    mes: e.mes,
    custoAcumulado: ownershipV3.custoMensal * (i + 1),
    valorAcumulado: evolucao.slice(0, i + 1).reduce((s, x) => s + x.economiaGerada, 0),
  }));
  const paybackMes = paybackData.findIndex(d => d.valorAcumulado >= d.custoAcumulado);
  const roiMensal = evolucao.map(e => ({ mes: e.mes, retorno: Math.round((e.economiaGerada / ownershipV3.custoMensal) * 100) / 100 }));
  const cobertura = Math.round((kpis.valorCapturado / ownershipV3.custoAnual) * 100);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Retorno do Investimento</h2>
      <p className="text-sm text-muted-foreground">Conclusão da narrativa — quanto foi investido e quanto foi gerado</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Ownership Mensal" value={formatCurrencyV3(ownershipV3.custoMensal)} />
        <KPI label="Ownership Anual" value={formatCurrencyV3(ownershipV3.custoAnual)} />
        <KPI label="Economia Gerada Acum." value={formatCurrencyV3(kpis.valorCapturado)} color="text-green-600" />
        <KPI label="Valor Comprovado Acum." value={formatCurrencyV3(kpis.comprovado)} color="text-green-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-700">ROI Total</p>
          <p className="text-3xl font-bold text-green-700">{roiTotal.toFixed(1)}x</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-700">ROI Comprovado</p>
          <p className="text-3xl font-bold text-green-700">{roiComprovado.toFixed(1)}x</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Payback</p>
          <p className="text-3xl font-bold text-foreground">{paybackMes >= 0 ? `${paybackMes + 1} meses` : "> 12 meses"}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Cobertura do Investimento</p>
          <p className="text-3xl font-bold text-foreground">{cobertura}%</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Economia Gerada vs Investimento Acumulado</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={paybackData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={v => formatCurrencyV3(v)} fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip formatter={(v: number) => formatCurrencyV3(v)} />
            <Legend />
            <Line type="monotone" dataKey="custoAcumulado" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Investimento" />
            <Line type="monotone" dataKey="valorAcumulado" stroke="#16a34a" strokeWidth={2} name="Economia Gerada" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Retorno Mensal (x ownership)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={roiMensal}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis fontSize={11} tickFormatter={v => `${v}x`} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip formatter={(v: number) => `${v}x`} />
            <Bar dataKey="retorno" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Retorno" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KPI({ label, value, color = "text-foreground" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
