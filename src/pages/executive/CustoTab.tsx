import { AreaChart, Area, BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { BigNumberCard, InsightBlock, SectionTitle, trendStr } from "./ExecutiveShared";
import { areas, trendData, getTotals, prevPeriod, formatCurrency, costLevelLabel } from "@/lib/executiveData";

const COLORS = ["#E63946", "#1A66CC", "#FDB813", "#9CA3AF"];

export default function CustoTab() {
  const t = getTotals();
  const ctT = trendStr(t.custoTotal, prevPeriod.custoTotal);
  const caT = trendStr(t.custoAusencia, prevPeriod.custoAusencia);
  const ccT = trendStr(t.custoCobertura, prevPeriod.custoCobertura);
  const ciT = trendStr(t.custoIneficiencia, prevPeriod.custoIneficiencia);
  const cmT = trendStr(t.custoMedioArea, prevPeriod.custoMedioArea);

  const pieData = [
    { name: "Ausência", value: t.custoAusencia },
    { name: "Cobertura", value: t.custoCobertura },
    { name: "Ineficiência", value: t.custoIneficiencia },
  ];

  const areaCusto = [...areas].sort((a, b) => b.custoTotal - a.custoTotal).map(a => ({
    nome: a.nome.length > 16 ? a.nome.slice(0, 14) + "…" : a.nome,
    custo: a.custoTotal,
    full: a.nome,
  }));

  const insights = [
    { severity: "critical" as const, text: `${[...areas].sort((a, b) => b.custoTotal - a.custoTotal)[0].nome} concentra ${formatCurrency([...areas].sort((a, b) => b.custoTotal - a.custoTotal)[0].custoTotal)} em custo — ${(([...areas].sort((a, b) => b.custoTotal - a.custoTotal)[0].custoTotal / t.custoTotal) * 100).toFixed(0)}% do total.` },
    { severity: "warning" as const, text: `Custos com cobertura representam ${((t.custoCobertura / t.custoTotal) * 100).toFixed(0)}% do custo total operacional.` },
    { severity: "info" as const, text: `${areas.filter(a => a.costLevel === 1).length} áreas operam sem dados de custo (Nível 1) — recomendável coletar dados salariais.` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        <BigNumberCard title="Custo Total" value={formatCurrency(t.custoTotal)}
          valueColor="text-[#FF5722]" footer="Estimado + real" change={ctT} />
        <BigNumberCard title="Custo por Ausência" value={formatCurrency(t.custoAusencia)}
          valueColor="text-red-500" footer="Horas perdidas" change={caT} />
        <BigNumberCard title="Custo por Cobertura" value={formatCurrency(t.custoCobertura)}
          valueColor="text-blue-600" footer="Horas coberta" change={ccT} />
        <BigNumberCard title="Custo Ineficiência" value={formatCurrency(t.custoIneficiencia)}
          valueColor="text-yellow-600" footer="Retrabalho + emergencial" change={ciT} />
        <BigNumberCard title="Custo Médio / Área" value={formatCurrency(t.custoMedioArea)}
          footer="Média geral" change={cmT} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Evolução de Custo</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="grad-c2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E63946" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#E63946" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), "Custo"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Area type="monotone" dataKey="custoTotal" name="Custo" stroke="#E63946" strokeWidth={2} fill="url(#grad-c2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Composição do Custo</SectionTitle>
          <div className="h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <SectionTitle>Custo por Área</SectionTitle>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={areaCusto} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), "Custo"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
              <Bar dataKey="custo" name="Custo" fill="#FF5722" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Áreas com Maior Custo</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-right py-2 font-medium text-gray-500">Custo Total</th>
                <th className="text-right py-2 font-medium text-gray-500">Nível</th>
                <th className="text-right py-2 font-medium text-gray-500">R$/h</th>
              </tr></thead>
              <tbody>
                {[...areas].sort((a, b) => b.custoTotal - a.custoTotal).map(a => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-right text-[#FF5722]">{formatCurrency(a.custoTotal)}</td>
                    <td className="py-2.5 text-right"><span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">{costLevelLabel(a.costLevel)}</span></td>
                    <td className="py-2.5 text-right text-gray-600">R$ {a.custoPorHora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Contratos com Maior Impacto Financeiro</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-right py-2 font-medium text-gray-500">Custo Ausência</th>
                <th className="text-right py-2 font-medium text-gray-500">Custo Cobertura</th>
                <th className="text-right py-2 font-medium text-gray-500">Ineficiência</th>
              </tr></thead>
              <tbody>
                {[...areas].sort((a, b) => b.custoIneficiencia - a.custoIneficiencia).map(a => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-right text-gray-600">{formatCurrency(a.custoAusencia)}</td>
                    <td className="py-2.5 text-right text-gray-600">{formatCurrency(a.custoCobertura)}</td>
                    <td className="py-2.5 text-right text-red-500">{formatCurrency(a.custoIneficiencia)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <InsightBlock insights={insights} />
    </div>
  );
}
