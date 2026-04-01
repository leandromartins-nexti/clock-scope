import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from "recharts";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  drivers, getDriversMonetarios, getDriversIntangiveis, getEconomiaBruta,
  formatCurrency, formatNumber, confidenceBadge, ownership, hierarquiaBaselineLabel,
} from "@/lib/roiData";

export default function DriversValorTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const monetarios = getDriversMonetarios();
  const intangiveis = getDriversIntangiveis();
  const ecoBruta = getEconomiaBruta();
  const comprovados = monetarios.filter(d => d.confianca === "comprovado").length;
  const hibridos = monetarios.filter(d => d.confianca === "hibrido").length;
  const referenciais = monetarios.filter(d => d.confianca === "referencial").length;
  const topDriver = [...monetarios].sort((a, b) => b.ganhoBruto - a.ganhoBruto)[0];
  const worstTrend = [...monetarios].sort((a, b) => a.tendencia - b.tendencia)[0];

  const paretoData = [...monetarios].sort((a, b) => b.ganhoBruto - a.ganhoBruto)
    .map(d => ({
      name: d.nome.length > 18 ? d.nome.slice(0, 16) + "…" : d.nome,
      value: d.ganhoBruto,
      fill: d.confianca === "comprovado" ? "#22c55e" : d.confianca === "hibrido" ? "#eab308" : "#9ca3af",
    }));

  const scatterData = monetarios.map(d => ({
    name: d.nome,
    x: d.confianca === "comprovado" ? 3 : d.confianca === "hibrido" ? 2 : 1,
    y: d.ganhoBruto,
    z: Math.abs(d.tendencia) * 10 + 100,
  }));

  return (
    <div className="space-y-6">
      {/* Big Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Drivers Monetários Ativos", value: `${monetarios.length}`, color: "text-gray-700" },
          { label: "Comprovados", value: `${comprovados}`, color: "text-green-600" },
          { label: "Híbridos", value: `${hibridos}`, color: "text-yellow-600" },
          { label: "Referenciais", value: `${referenciais}`, color: "text-gray-500" },
          { label: "Maior Contribuição", value: topDriver?.nome || "—", sub: topDriver ? formatCurrency(topDriver.ganhoBruto) : "", color: "text-[#FF5722]" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-[10px] text-gray-500 font-medium uppercase">{kpi.label}</p>
            <p className={`text-lg font-bold mt-1 ${kpi.color} truncate`}>{kpi.value}</p>
            {kpi.sub && <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>}
          </div>
        ))}
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Tabela de Drivers Monetários</h3>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Info className="w-3 h-3" />
            <span>Clique em um driver para ver detalhes do cálculo</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                {["", "Driver", "Módulo", "Baseline", "Atual", "Delta", "Custo Unit.", "Contribuição", "% do Total", "Peso no ROI", "Confiança", "Tendência"].map(h => (
                  <th key={h} className="text-left py-2 px-2 text-gray-500 font-medium uppercase text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monetarios.map(d => {
                const badge = confidenceBadge(d.confianca);
                const pctEco = ecoBruta > 0 ? (d.ganhoBruto / ecoBruta * 100).toFixed(1) : "0";
                const pesoROI = ownership.ownershipTotal > 0 ? (d.ganhoBruto / ownership.ownershipTotal).toFixed(1) : "0";
                const isExpanded = expandedId === d.id;
                return (
                  <>
                    <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : d.id)}>
                      <td className="py-2 px-2">{isExpanded ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}</td>
                      <td className="py-2 px-2 font-medium text-gray-700">{d.nome}</td>
                      <td className="py-2 px-2 text-gray-500">{d.moduloNexti}</td>
                      <td className="py-2 px-2">{formatNumber(d.baseline)}</td>
                      <td className="py-2 px-2">{formatNumber(d.atual)}</td>
                      <td className={`py-2 px-2 font-medium ${d.delta < 0 ? "text-green-600" : d.delta > 0 ? (["d5", "d10"].includes(d.id) ? "text-green-600" : "text-red-500") : "text-gray-500"}`}>{formatNumber(d.delta)}</td>
                      <td className="py-2 px-2">{formatCurrency(d.custoUnitario)}</td>
                      <td className={`py-2 px-2 font-bold ${d.ganhoBruto >= 0 ? "text-green-600" : "text-red-500"}`}>{formatCurrency(d.ganhoBruto)}</td>
                      <td className="py-2 px-2">{pctEco}%</td>
                      <td className="py-2 px-2">{pesoROI}x</td>
                      <td className="py-2 px-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.color} border ${badge.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} /> {badge.label}
                        </span>
                      </td>
                      <td className={`py-2 px-2 font-medium ${d.tendencia < 0 ? "text-green-600" : d.tendencia > 0 ? "text-red-500" : "text-gray-500"}`}>{d.tendencia > 0 ? "+" : ""}{d.tendencia}%</td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${d.id}-detail`}>
                        <td colSpan={12} className="bg-gray-50 px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="text-gray-400 uppercase text-[10px] font-medium">Fonte do Baseline</span>
                              <p className="font-medium text-gray-700 mt-0.5">{d.fonteBaseline}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase text-[10px] font-medium">Hierarquia do Baseline</span>
                              <p className="font-medium text-gray-700 mt-0.5">{hierarquiaBaselineLabel(d.hierarquiaBaseline)}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase text-[10px] font-medium">Janela do Baseline</span>
                              <p className="font-medium text-gray-700 mt-0.5">{d.janelaBaseline}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase text-[10px] font-medium">Fonte Atual</span>
                              <p className="font-medium text-gray-700 mt-0.5">{d.fonteAtual}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase text-[10px] font-medium">Unidade de Medida</span>
                              <p className="font-medium text-gray-700 mt-0.5">{d.unidadeMedida}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase text-[10px] font-medium">Fator de Redução</span>
                              <p className="font-medium text-gray-700 mt-0.5">{d.fatorReducao}%</p>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <span className="text-gray-400 uppercase text-[10px] font-medium">Fórmula do Cálculo</span>
                            <p className="font-mono text-xs text-[#FF5722] mt-1">{d.formulaResumo}</p>
                          </div>
                          {d.observacaoMetodologica && (
                            <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                              <span className="text-blue-400 uppercase text-[10px] font-medium">Observação Metodológica</span>
                              <p className="text-xs text-gray-600 mt-1">{d.observacaoMetodologica}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intangíveis */}
      {intangiveis.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">🌟 Ganhos Intangíveis</h3>
          <p className="text-[10px] text-gray-400 mb-3">Valores qualitativos que não compõem o ROI monetário, mas demonstram valor complementar da solução</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {intangiveis.map(d => {
              const badge = confidenceBadge(d.confianca);
              return (
                <div key={d.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-medium text-gray-700">{d.nome}</p>
                      <p className="text-[10px] text-gray-400">{d.moduloNexti}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} /> {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-700">{formatNumber(d.baseline)} → {formatNumber(d.atual)} <span className="text-[10px] text-gray-400">{d.unidadeMedida}</span></p>
                    <p className={`text-xs font-medium ${d.delta > 0 ? "text-green-600" : d.delta < 0 ? "text-green-600" : "text-gray-500"}`}>
                      Δ {d.delta > 0 ? "+" : ""}{formatNumber(d.delta)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Pareto de Contribuição por Driver</h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Comprovado</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Híbrido</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> Referencial</span>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paretoData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {paretoData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Confiança vs Valor Financeiro</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" domain={[0, 4]} tick={{ fontSize: 10 }} tickFormatter={(v) => v === 1 ? "Ref." : v === 2 ? "Híbrido" : v === 3 ? "Comprov." : ""} name="Confiança" />
                <YAxis type="number" dataKey="y" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} name="Contribuição" />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip formatter={(v: number, name: string) => name === "Contribuição" ? formatCurrency(v) : v} />
                <Scatter data={scatterData} fill="#FF5722">
                  {scatterData.map((d, i) => <Cell key={i} fill={d.x === 3 ? "#22c55e" : d.x === 2 ? "#eab308" : "#9ca3af"} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
