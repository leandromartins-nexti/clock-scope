import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { BigNumberCard, InsightBlock, SectionTitle, ScoreBadge } from "./ExecutiveShared";
import { areas, scoreClass, formatCurrency } from "@/lib/executiveData";

export default function ComparativoTab() {
  const sorted = [...areas].sort((a, b) => b.scoreGeral - a.scoreGeral);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  // Simulated evolution
  const bestEvol = sorted.find(a => a.scoreGeral > 70 && a.scoreEficiencia > 70) || best;
  const worstEvol = sorted.find(a => a.scoreGeral < 50) || worst;

  const scoreData = sorted.map(a => ({
    nome: a.nome.length > 14 ? a.nome.slice(0, 12) + "…" : a.nome,
    score: a.scoreGeral, full: a.nome,
  }));

  const efData = [...areas].sort((a, b) => b.scoreEficiencia - a.scoreEficiencia).map(a => ({
    nome: a.nome.length > 14 ? a.nome.slice(0, 12) + "…" : a.nome,
    eficiencia: a.scoreEficiencia, full: a.nome,
  }));

  const absData = [...areas].sort((a, b) => a.taxaAbsenteismo - b.taxaAbsenteismo).map(a => ({
    nome: a.nome.length > 14 ? a.nome.slice(0, 12) + "…" : a.nome,
    absenteismo: a.taxaAbsenteismo, full: a.nome,
  }));

  const insights = [
    { severity: "info" as const, text: `${best.nome} lidera com score ${best.scoreGeral}/100 e pode ser referência para outras áreas.` },
    { severity: "critical" as const, text: `${worst.nome} apresenta o pior desempenho (${worst.scoreGeral}/100) e requer atenção imediata.` },
    { severity: "warning" as const, text: `A diferença entre melhor e pior área é de ${best.scoreGeral - worst.scoreGeral} pontos, indicando grande desigualdade operacional.` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <BigNumberCard title="Melhor Área" value={best.nome.length > 20 ? best.nome.slice(0, 18) + "…" : best.nome}
          valueColor="text-green-600" footer={`Score: ${best.scoreGeral}/100`} footerRight={scoreClass(best.scoreGeral).label} />
        <BigNumberCard title="Pior Área" value={worst.nome.length > 20 ? worst.nome.slice(0, 18) + "…" : worst.nome}
          valueColor="text-red-500" footer={`Score: ${worst.scoreGeral}/100`} footerRight={scoreClass(worst.scoreGeral).label} />
        <BigNumberCard title="Maior Evolução" value={bestEvol.nome.length > 20 ? bestEvol.nome.slice(0, 18) + "…" : bestEvol.nome}
          valueColor="text-green-600" footer="Tendência positiva" footerRight="+8.2%" />
        <BigNumberCard title="Maior Queda" value={worstEvol.nome.length > 20 ? worstEvol.nome.slice(0, 18) + "…" : worstEvol.nome}
          valueColor="text-red-500" footer="Tendência negativa" footerRight="-5.4%" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <SectionTitle>Ranking de Score Geral</SectionTitle>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <Tooltip formatter={(v: number) => [`${v}/100`, "Score"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={18}>
                {scoreData.map((d, i) => (
                  <Cell key={i} fill={d.score >= 80 ? "#22c55e" : d.score >= 60 ? "#eab308" : "#E63946"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Ranking de Eficiência</SectionTitle>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                <Tooltip formatter={(v: number) => [`${v}/100`, "Eficiência"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Bar dataKey="eficiencia" fill="#1A66CC" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Ranking de Absenteísmo (menor é melhor)</SectionTitle>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={absData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Absenteísmo"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Bar dataKey="absenteismo" fill="#E63946" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Consolidated table */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <SectionTitle>Comparação Consolidada entre Áreas</SectionTitle>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100">
              <th className="text-left py-2 font-medium text-gray-500">Área</th>
              <th className="text-center py-2 font-medium text-gray-500">Score Geral</th>
              <th className="text-center py-2 font-medium text-gray-500">Eficiência</th>
              <th className="text-center py-2 font-medium text-gray-500">Absenteísmo</th>
              <th className="text-center py-2 font-medium text-gray-500">Cobertura</th>
              <th className="text-center py-2 font-medium text-gray-500">Risco</th>
              <th className="text-right py-2 font-medium text-gray-500">Custo</th>
            </tr></thead>
            <tbody>
              {sorted.map(a => (
                <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                  <td className="py-2.5 text-center"><ScoreBadge score={a.scoreGeral} /></td>
                  <td className="py-2.5 text-center"><ScoreBadge score={a.scoreEficiencia} /></td>
                  <td className="py-2.5 text-center text-gray-600">{a.taxaAbsenteismo}%</td>
                  <td className="py-2.5 text-center text-gray-600">{a.taxaCobertura}%</td>
                  <td className="py-2.5 text-center"><ScoreBadge score={a.scoreRisco} /></td>
                  <td className="py-2.5 text-right text-gray-600">{formatCurrency(a.custoTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InsightBlock insights={insights} />
    </div>
  );
}
