import { AreaChart, Area, BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BigNumberCard, InsightBlock, SectionTitle, ScoreBadge, trendStr } from "./ExecutiveShared";
import { areas, trendData, getTotals, prevPeriod, formatNumber, formatCurrency, scoreClass } from "@/lib/executiveData";

export default function RiscoTab() {
  const t = getTotals();
  const rT = trendStr(t.scoreRisco, prevPeriod.scoreRisco);
  const dT = trendStr(t.taxaDescoberta, prevPeriod.taxaDescoberta);
  const hdT = trendStr(t.horasDescobertas, prevPeriod.horasDescobertas);
  const criticalAreas = areas.filter(a => a.scoreRisco < 60);

  const riskBar = [...areas].sort((a, b) => a.scoreRisco - b.scoreRisco).map(a => ({
    nome: a.nome.length > 14 ? a.nome.slice(0, 12) + "…" : a.nome,
    risco: a.scoreRisco, full: a.nome,
  }));

  const insights = [
    { severity: "critical" as const, text: `${criticalAreas.length} áreas operam com score de risco abaixo de 60 — nível crítico.` },
    { severity: "warning" as const, text: `${t.taxaDescoberta}% das ausências não possuem cobertura, gerando exposição operacional.` },
    { severity: "info" as const, text: `Monitorar áreas com score abaixo de 50 deve ser prioridade imediata da gestão.` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <BigNumberCard title="Score de Risco" value={`${t.scoreRisco}/100`}
          valueColor={scoreClass(t.scoreRisco).color} footer="Média geral" change={rT} />
        <BigNumberCard title="% Descoberta" value={`${t.taxaDescoberta}%`}
          valueColor="text-red-500" footer="Sem cobertura" change={dT} />
        <BigNumberCard title="Horas Descobertas" value={formatNumber(t.horasDescobertas)}
          valueColor="text-red-600" footer="Total período" change={hdT} />
        <BigNumberCard title="Áreas Críticas" value={`${criticalAreas.length}`}
          valueColor="text-red-600" footer="Score < 60" footerRight={`de ${areas.length} áreas`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Evolução do Risco</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="grad-risk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E63946" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#E63946" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Area type="monotone" dataKey="risco" name="Risco" stroke="#E63946" strokeWidth={2} fill="url(#grad-risk)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Distribuição de Risco por Área</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBar} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                <Tooltip formatter={(v: number) => [`${v}/100`, "Risco"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Bar dataKey="risco" radius={[0, 4, 4, 0]} barSize={16}>
                  {riskBar.map((d, i) => (
                    <Cell key={i} fill={d.risco >= 80 ? "#22c55e" : d.risco >= 60 ? "#eab308" : "#E63946"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Áreas com Maior Risco</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-center py-2 font-medium text-gray-500">Score</th>
                <th className="text-right py-2 font-medium text-gray-500">Descoberta</th>
                <th className="text-right py-2 font-medium text-gray-500">H. Descobertas</th>
              </tr></thead>
              <tbody>
                {[...areas].sort((a, b) => a.scoreRisco - b.scoreRisco).map(a => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-center"><ScoreBadge score={a.scoreRisco} /></td>
                    <td className="py-2.5 text-right text-red-500">{a.taxaDescoberta}%</td>
                    <td className="py-2.5 text-right text-gray-600">{formatNumber(a.horasDescobertas)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Contratos Críticos</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-right py-2 font-medium text-gray-500">Absenteísmo</th>
                <th className="text-right py-2 font-medium text-gray-500">Cobertura</th>
                <th className="text-right py-2 font-medium text-gray-500">Custo</th>
              </tr></thead>
              <tbody>
                {[...areas].filter(a => a.scoreRisco < 60).sort((a, b) => a.scoreRisco - b.scoreRisco).map(a => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-right text-red-500">{a.taxaAbsenteismo}%</td>
                    <td className="py-2.5 text-right text-gray-600">{a.taxaCobertura}%</td>
                    <td className="py-2.5 text-right text-[#FF5722]">{formatCurrency(a.custoTotal)}</td>
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
