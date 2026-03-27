import { AreaChart, Area, BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Cell, Legend } from "recharts";
import { BigNumberCard, InsightBlock, SectionTitle, ScoreBadge, trendStr } from "./ExecutiveShared";
import { areas, trendData, getTotals, prevPeriod, scoreClass } from "@/lib/executiveData";

export default function EficienciaTab() {
  const t = getTotals();

  const efT = trendStr(t.scoreEficiencia, prevPeriod.scoreEficiencia, true);
  const cpT = trendStr(t.pctCobPlanejada, prevPeriod.pctCobPlanejada, true);
  const ceT = trendStr(t.pctCobEmergencial, prevPeriod.pctCobEmergencial);
  const tmT = trendStr(t.tempoMedioCobertura, prevPeriod.tempoMedioCobertura);
  const heT = trendStr(t.pctHoraExtra, prevPeriod.pctHoraExtra);

  const barData = [...areas].sort((a, b) => a.scoreEficiencia - b.scoreEficiencia).map(a => ({
    nome: a.nome.length > 18 ? a.nome.slice(0, 16) + "…" : a.nome,
    eficiencia: a.scoreEficiencia,
    full: a.nome,
  }));

  const recorrencia = [...areas].sort((a, b) => b.coberturasEmergenciais - a.coberturasEmergenciais);

  const insights = [
    { severity: "critical" as const, text: `${recorrencia[0].nome} concentra ${recorrencia[0].coberturasEmergenciais} coberturas emergenciais, a maior do período.` },
    { severity: "warning" as const, text: `O tempo médio de cobertura de ${t.tempoMedioCobertura}min indica necessidade de processos mais ágeis.` },
    { severity: "info" as const, text: `${t.pctCobPlanejada}% das coberturas são planejadas — meta ideal é acima de 75%.` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        <BigNumberCard title="Score Eficiência" value={`${t.scoreEficiencia}/100`}
          valueColor={scoreClass(t.scoreEficiencia).color} footer="Média geral" change={efT} />
        <BigNumberCard title="% Cobertura Planejada" value={`${t.pctCobPlanejada}%`}
          valueColor="text-green-600" footer="Do total" change={cpT} />
        <BigNumberCard title="% Cobertura Emergencial" value={`${t.pctCobEmergencial}%`}
          valueColor="text-red-500" footer="Do total" change={ceT} />
        <BigNumberCard title="Tempo Médio Cobertura" value={`${t.tempoMedioCobertura}min`}
          footer="Média geral" change={tmT} />
        <BigNumberCard title="% Hora Extra" value={`${t.pctHoraExtra}%`}
          valueColor="text-yellow-600" footer="Sobre cobertura" change={heT} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Evolução da Eficiência</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="grad-ef" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A66CC" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#1A66CC" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Area type="monotone" dataKey="eficiencia" name="Eficiência" stroke="#1A66CC" strokeWidth={2} fill="url(#grad-ef)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Cobertura Planejada vs Emergencial</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="cobPlanejada" name="Planejada %" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cobEmergencial" name="Emergencial %" stroke="#E63946" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <SectionTitle>Distribuição de Eficiência por Área</SectionTitle>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <Tooltip formatter={(v: number) => [`${v}/100`, "Eficiência"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
              <Bar dataKey="eficiencia" name="Score" radius={[0, 4, 4, 0]} barSize={18}>
                {barData.map((d, i) => (
                  <Cell key={i} fill={d.eficiencia >= 80 ? "#22c55e" : d.eficiencia >= 60 ? "#eab308" : "#E63946"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Ranking – Pior Eficiência</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-center py-2 font-medium text-gray-500">Score</th>
                <th className="text-right py-2 font-medium text-gray-500">Cob. Plan.</th>
                <th className="text-right py-2 font-medium text-gray-500">Cob. Emerg.</th>
              </tr></thead>
              <tbody>
                {[...areas].sort((a, b) => a.scoreEficiencia - b.scoreEficiencia).map(a => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-center"><ScoreBadge score={a.scoreEficiencia} /></td>
                    <td className="py-2.5 text-right text-gray-600">{a.coberturasPlanejadas}</td>
                    <td className="py-2.5 text-right text-red-500">{a.coberturasEmergenciais}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Postos com Maior Recorrência de Cobertura</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-right py-2 font-medium text-gray-500">Emergenciais</th>
                <th className="text-right py-2 font-medium text-gray-500">Tempo Médio</th>
                <th className="text-right py-2 font-medium text-gray-500">H. Extra</th>
              </tr></thead>
              <tbody>
                {recorrencia.map(a => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-right text-red-500">{a.coberturasEmergenciais}</td>
                    <td className="py-2.5 text-right text-gray-600">{a.tempoMedioCobertura}min</td>
                    <td className="py-2.5 text-right text-yellow-600">{a.horasExtras}h</td>
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
