import { useState } from "react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BigNumberCard, InsightBlock, SectionTitle, trendStr } from "./ExecutiveShared";
import { areas, getTotals, prevPeriod, formatCurrency, meses } from "@/lib/executiveData";

export default function EconomiaTab() {
  const t = getTotals();
  const [cenario, setCenario] = useState(20); // % redução

  const etT = trendStr(t.economiaTotal, prevPeriod.economiaTotal, true);
  const eaT = trendStr(t.economiaAbsenteismo, prevPeriod.economiaAbsenteismo, true);
  const ecT = trendStr(t.economiaCobertura, prevPeriod.economiaCobertura, true);

  // Simulation data
  const simData = meses.map((mes, i) => ({
    mes,
    atual: 185000 - i * 3000 + Math.round(Math.sin(i) * 12000),
    cenario10: Math.round((185000 - i * 3000 + Math.round(Math.sin(i) * 12000)) * 0.9),
    cenario20: Math.round((185000 - i * 3000 + Math.round(Math.sin(i) * 12000)) * 0.8),
    cenario30: Math.round((185000 - i * 3000 + Math.round(Math.sin(i) * 12000)) * 0.7),
  }));

  const areaEcon = [...areas].sort((a, b) => b.economiaTotal - a.economiaTotal);

  const insights = [
    { severity: "info" as const, text: `Uma redução de 20% no absenteísmo pode gerar economia de ${formatCurrency(t.economiaAbsenteismo)}.` },
    { severity: "info" as const, text: `Reduzir coberturas emergenciais em 30% economizaria ${formatCurrency(Math.round(t.economiaCobertura * 1.5))}.` },
    { severity: "warning" as const, text: `As 3 áreas com maior oportunidade representam ${((areaEcon.slice(0, 3).reduce((s, a) => s + a.economiaTotal, 0) / t.economiaTotal) * 100).toFixed(0)}% do potencial total.` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <BigNumberCard title="Economia Potencial Total" value={formatCurrency(t.economiaTotal)}
          valueColor="text-green-600" footer="Se otimizado" change={etT} />
        <BigNumberCard title="Economia – Absenteísmo" value={formatCurrency(t.economiaAbsenteismo)}
          valueColor="text-green-600" footer="Redução projetada" change={eaT} />
        <BigNumberCard title="Economia – Cobertura" value={formatCurrency(t.economiaCobertura)}
          valueColor="text-green-600" footer="Menos emergenciais" change={ecT} />
      </div>

      {/* Scenario simulation */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Simulação de Cenários de Custo</SectionTitle>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Redução:</span>
            {[10, 20, 30].map(v => (
              <button key={v} onClick={() => setCenario(v)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${cenario === v ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {v}%
              </button>
            ))}
          </div>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={simData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), ""]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="atual" name="Custo Atual" fill="#E63946" opacity={0.3} />
              <Bar dataKey={`cenario${cenario}`} name={`Cenário -${cenario}%`} fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area opportunity */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <SectionTitle>Áreas com Maior Oportunidade de Economia</SectionTitle>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100">
              <th className="text-left py-2 font-medium text-gray-500">#</th>
              <th className="text-left py-2 font-medium text-gray-500">Área</th>
              <th className="text-right py-2 font-medium text-gray-500">Economia Total</th>
              <th className="text-right py-2 font-medium text-gray-500">Econ. Absenteísmo</th>
              <th className="text-right py-2 font-medium text-gray-500">Econ. Cobertura</th>
              <th className="text-right py-2 font-medium text-gray-500">% do Total</th>
            </tr></thead>
            <tbody>
              {areaEcon.map((a, i) => (
                <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 text-gray-400 font-medium">{i + 1}</td>
                  <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                  <td className="py-2.5 text-right text-green-600 font-semibold">{formatCurrency(a.economiaTotal)}</td>
                  <td className="py-2.5 text-right text-gray-600">{formatCurrency(a.economiaAbsenteismo)}</td>
                  <td className="py-2.5 text-right text-gray-600">{formatCurrency(a.economiaCobertura)}</td>
                  <td className="py-2.5 text-right text-gray-500">{((a.economiaTotal / t.economiaTotal) * 100).toFixed(1)}%</td>
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
