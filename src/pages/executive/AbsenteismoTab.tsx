import { AreaChart, Area, BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Line } from "recharts";
import { BigNumberCard, InsightBlock, SectionTitle, trendStr } from "./ExecutiveShared";
import { areas, trendData, getTotals, prevPeriod, formatNumber, meses } from "@/lib/executiveData";

export default function AbsenteismoTab() {
  const t = getTotals();
  const absT = trendStr(t.taxaAbsenteismo, prevPeriod.taxaAbsenteismo);
  const haT = trendStr(t.horasAusencia, prevPeriod.horasAusencia);
  const cobT = trendStr(t.taxaCobertura, prevPeriod.taxaCobertura, true);
  const hdT = trendStr(t.horasDescobertas, prevPeriod.horasDescobertas);

  const distData = meses.map((mes, i) => ({
    mes,
    falta: 320 + Math.round(Math.sin(i * 0.8) * 60),
    atestado: 580 + Math.round(Math.cos(i) * 80),
    ferias: 300 + Math.round(Math.sin(i * 1.2) * 40),
    outros: 120 + Math.round(Math.sin(i * 0.5) * 30),
  }));

  const previstoData = meses.map((mes, i) => ({
    mes,
    prevista: 300 + Math.round(Math.sin(i * 1.2) * 40),
    naoPrevista: 920 - i * 20 + Math.round(Math.sin(i) * 80),
  }));

  const areaCompare = [...areas].sort((a, b) => b.taxaAbsenteismo - a.taxaAbsenteismo).map(a => ({
    nome: a.nome.length > 16 ? a.nome.slice(0, 14) + "…" : a.nome,
    absenteismo: a.taxaAbsenteismo,
    full: a.nome,
  }));

  const insights = [
    { severity: "critical" as const, text: `${[...areas].sort((a, b) => b.taxaAbsenteismo - a.taxaAbsenteismo)[0].nome} tem ${[...areas].sort((a, b) => b.taxaAbsenteismo - a.taxaAbsenteismo)[0].taxaAbsenteismo}% de absenteísmo — o mais alto do período.` },
    { severity: "warning" as const, text: `Atestados médicos representam a maior causa de ausência, seguidos por faltas não justificadas.` },
    { severity: "info" as const, text: `A taxa de cobertura geral é ${t.taxaCobertura}% — ${formatNumber(t.horasDescobertas)}h permanecem descobertas.` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <BigNumberCard title="Taxa de Absenteísmo" value={`${t.taxaAbsenteismo}%`}
          valueColor="text-red-500" footer="Sobre horas operacionais" change={absT} />
        <BigNumberCard title="Horas de Ausência" value={formatNumber(t.horasAusencia)}
          valueColor="text-red-600" footer="Total período" change={haT} />
        <BigNumberCard title="Taxa de Cobertura" value={`${t.taxaCobertura}%`}
          valueColor="text-green-600" footer="Ausências cobertas" change={cobT} />
        <BigNumberCard title="Horas Descobertas" value={formatNumber(t.horasDescobertas)}
          valueColor="text-red-600" footer="Sem cobertura" change={hdT} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Evolução do Absenteísmo</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="grad-abs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E63946" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#E63946" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Area type="monotone" dataKey="absenteismo" name="Absenteísmo %" stroke="#E63946" strokeWidth={2} fill="url(#grad-abs)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Distribuição por Tipo de Ausência</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="falta" name="Falta" fill="#E63946" stackId="a" />
                <Bar dataKey="atestado" name="Atestado" fill="#FDB813" stackId="a" />
                <Bar dataKey="ferias" name="Férias" fill="#1A66CC" stackId="a" />
                <Bar dataKey="outros" name="Outros" fill="#9CA3AF" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Previsto vs Não Previsto</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={previstoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="prevista" name="Prevista" fill="#22c55e" />
                <Bar dataKey="naoPrevista" name="Não Prevista" fill="#E63946" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Comparação entre Áreas</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaCompare} layout="vertical" margin={{ left: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Absenteísmo"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Bar dataKey="absenteismo" name="%" fill="#E63946" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Top Áreas – Maior Absenteísmo</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-right py-2 font-medium text-gray-500">Absenteísmo</th>
                <th className="text-right py-2 font-medium text-gray-500">H. Ausência</th>
                <th className="text-right py-2 font-medium text-gray-500">Nível Custo</th>
              </tr></thead>
              <tbody>
                {[...areas].sort((a, b) => b.taxaAbsenteismo - a.taxaAbsenteismo).map(a => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-right text-red-500">{a.taxaAbsenteismo}%</td>
                    <td className="py-2.5 text-right text-gray-600">{formatNumber(a.horasAusencia)}</td>
                    <td className="py-2.5 text-right"><span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">Nível {a.costLevel}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Top Áreas – Maior Descoberta</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-right py-2 font-medium text-gray-500">Descoberta</th>
                <th className="text-right py-2 font-medium text-gray-500">H. Descobertas</th>
                <th className="text-right py-2 font-medium text-gray-500">Cobertura</th>
              </tr></thead>
              <tbody>
                {[...areas].sort((a, b) => b.taxaDescoberta - a.taxaDescoberta).map(a => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-right text-red-500">{a.taxaDescoberta}%</td>
                    <td className="py-2.5 text-right text-gray-600">{formatNumber(a.horasDescobertas)}</td>
                    <td className="py-2.5 text-right text-green-600">{a.taxaCobertura}%</td>
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
