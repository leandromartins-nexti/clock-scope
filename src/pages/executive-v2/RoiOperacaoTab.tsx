import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { operacoes, formatCurrency, capturaScoreClass, formatNumber } from "@/lib/roiData";
import { Info } from "lucide-react";

type ViewMode = "absoluto" | "por_colaborador";

export default function RoiOperacaoTab() {
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<ViewMode>("absoluto");
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  const filtered = filterTipo === "todos" ? operacoes : operacoes.filter(o => o.tipo === filterTipo);
  const sorted = [...filtered].sort((a, b) => b.economiaLiquida - a.economiaLiquida);

  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const bestROI = [...filtered].sort((a, b) => b.roiTotal - a.roiTotal)[0];
  const worstTrend = [...filtered].sort((a, b) => a.tendencia - b.tendencia)[0];

  const getValue = (op: typeof operacoes[0]) => {
    if (viewMode === "por_colaborador") return Math.round(op.economiaLiquida / op.colaboradores);
    return op.economiaLiquida;
  };

  const rankData = sorted.map(o => ({
    name: o.nome.length > 20 ? o.nome.slice(0, 18) + "…" : o.nome,
    value: getValue(o),
    score: o.scoreCaptura,
  }));

  return (
    <div className="space-y-6">
      {/* Filters and view mode */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["todos", "regional", "contrato", "unidade"].map(t => (
            <button key={t} onClick={() => setFilterTipo(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterTipo === t ? "bg-[#FF5722] text-white border-[#FF5722]" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>
              {t === "todos" ? "Todos" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {([["absoluto", "Valor Absoluto"], ["por_colaborador", "Por Colaborador"]] as const).map(([mode, label]) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${viewMode === mode ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-300"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Big Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Melhor Operação", value: best?.nome || "—", sub: best ? formatCurrency(getValue(best)) : "", color: "text-green-600" },
          { label: "Pior Operação", value: worst?.nome || "—", sub: worst ? formatCurrency(getValue(worst)) : "", color: "text-red-500" },
          { label: "Maior ROI", value: bestROI?.nome || "—", sub: bestROI ? `${bestROI.roiTotal.toFixed(1)}x` : "", color: "text-[#FF5722]" },
          { label: "Maior Queda", value: worstTrend?.nome || "—", sub: worstTrend ? `${worstTrend.tendencia.toFixed(1)}%` : "", color: "text-red-500" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-[10px] text-gray-500 font-medium uppercase">{kpi.label}</p>
            <p className={`text-sm font-bold mt-1 ${kpi.color} truncate`}>{kpi.value}</p>
            {kpi.sub && <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Ranking por {viewMode === "por_colaborador" ? "Economia por Colaborador" : "Economia Líquida"}
          </h3>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Score ≥ 80</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Score 60-79</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Score &lt; 60</span>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rankData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => viewMode === "por_colaborador" ? `R$ ${(v / 1000).toFixed(0)}k` : `R$ ${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {rankData.map((d, i) => <Cell key={i} fill={d.score >= 80 ? "#22c55e" : d.score >= 60 ? "#eab308" : "#ef4444"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score explanation */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <button onClick={() => setShowScoreInfo(!showScoreInfo)} className="flex items-center gap-2 text-sm font-semibold text-gray-800 w-full text-left">
          <Info className="w-4 h-4 text-[#FF5722]" />
          Como o Score de Captura é calculado?
        </button>
        {showScoreInfo && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-2">
            <p>O Score de Captura (0-100) considera cinco dimensões ponderadas:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Economia líquida capturada</strong> — peso relativo do valor gerado pela operação</li>
              <li><strong>% do valor comprovado</strong> — quanto do valor está validado com dados reais</li>
              <li><strong>Tendência do período</strong> — se a operação está melhorando ou piorando</li>
              <li><strong>Diversificação de drivers ativos</strong> — quantidade de drivers gerando valor</li>
              <li><strong>Penalização por excesso referencial</strong> — redução para operações com alta dependência de benchmarks</li>
            </ul>
            <p className="text-[10px] text-gray-400 mt-2">Score ≥ 80: Captura Forte | 60-79: Captura Moderada | &lt; 60: Captura Fraca</p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Comparativo por Operação</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                {["Operação", "Tipo", "Colab.", "Economia Bruta", "Ownership", "Economia Líquida", viewMode === "por_colaborador" ? "Eco/Colab" : "ROI", "Drivers Principais", "% Comprov.", "Tendência", "Score"].map(h => (
                  <th key={h} className="text-left py-2 px-2 text-gray-500 font-medium uppercase text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(op => {
                const sc = capturaScoreClass(op.scoreCaptura);
                return (
                  <tr key={op.nome} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2 font-medium text-gray-700">{op.nome}</td>
                    <td className="py-2 px-2 text-gray-500 capitalize">{op.tipo}</td>
                    <td className="py-2 px-2 text-gray-500">{formatNumber(op.colaboradores)}</td>
                    <td className="py-2 px-2 text-green-600 font-medium">{formatCurrency(op.economiaBruta)}</td>
                    <td className="py-2 px-2">{formatCurrency(op.ownershipAtribuido)}</td>
                    <td className="py-2 px-2 text-green-600 font-bold">{formatCurrency(op.economiaLiquida)}</td>
                    <td className="py-2 px-2 font-bold text-[#FF5722]">
                      {viewMode === "por_colaborador" ? formatCurrency(Math.round(op.economiaLiquida / op.colaboradores)) : `${op.roiTotal.toFixed(1)}x`}
                    </td>
                    <td className="py-2 px-2 text-gray-500">{op.driversPrincipais.join(", ")}</td>
                    <td className="py-2 px-2">{op.pctComprovado}%</td>
                    <td className={`py-2 px-2 font-medium ${op.tendencia >= 0 ? "text-green-600" : "text-red-500"}`}>{op.tendencia > 0 ? "+" : ""}{op.tendencia}%</td>
                    <td className="py-2 px-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.color}`}>{op.scoreCaptura} – {sc.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
