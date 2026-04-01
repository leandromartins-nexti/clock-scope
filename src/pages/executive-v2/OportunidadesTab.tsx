import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import {
  getDriversMonetarios, getEconomiaBruta, getConfiancaBreakdown,
  formatCurrency, confidenceBadge, OportunidadeCategoria,
} from "@/lib/roiData";
import { Zap, Database, Settings, Puzzle } from "lucide-react";

const categoriaConfig: Record<OportunidadeCategoria, { label: string; icon: typeof Zap; color: string; bg: string }> = {
  quick_win: { label: "Quick Win", icon: Zap, color: "text-green-700", bg: "bg-green-50" },
  dependente_dados: { label: "Depende de Dados", icon: Database, color: "text-blue-700", bg: "bg-blue-50" },
  dependente_operacional: { label: "Mudança Operacional", icon: Settings, color: "text-yellow-700", bg: "bg-yellow-50" },
  dependente_modulo: { label: "Ativação de Módulo", icon: Puzzle, color: "text-purple-700", bg: "bg-purple-50" },
};

export default function OportunidadesTab() {
  const monetarios = getDriversMonetarios();
  const ecoBruta = getEconomiaBruta();
  const conf = getConfiancaBreakdown();

  const potencialPorDriver = monetarios.map(d => {
    const potencial = d.confianca === "comprovado" ? d.ganhoBruto * 0.1 : d.confianca === "hibrido" ? d.ganhoBruto * 0.35 : d.ganhoBruto * 0.6;
    const categoria: OportunidadeCategoria = d.confianca === "referencial" ? "dependente_dados"
      : d.confianca === "hibrido" ? (d.tendencia < -10 ? "quick_win" : "dependente_operacional")
      : "quick_win";
    const esforco = categoria === "quick_win" ? 1 : categoria === "dependente_operacional" ? 2 : 3;
    const prazoEstimado = categoria === "quick_win" ? "1-2 meses" : categoria === "dependente_operacional" ? "3-6 meses" : "6-12 meses";
    return { ...d, potencialAdicional: Math.round(potencial), categoria, esforco, prazoEstimado };
  });

  const potencialTotal = potencialPorDriver.reduce((s, d) => s + d.potencialAdicional, 0);
  const maiorAlavanca = [...potencialPorDriver].sort((a, b) => b.potencialAdicional - a.potencialAdicional)[0];
  const semComprovacao = monetarios.filter(d => d.confianca === "referencial").length;
  const valorReferencial = monetarios.filter(d => d.confianca === "referencial").reduce((s, d) => s + d.ganhoBruto, 0);

  const quickWins = potencialPorDriver.filter(d => d.categoria === "quick_win");
  const estruturais = potencialPorDriver.filter(d => d.categoria !== "quick_win");

  const capturadoVsPotencial = [
    { name: "Valor Capturado", value: ecoBruta },
    { name: "Potencial Adicional", value: potencialTotal },
  ];

  const oportunidadeData = [...potencialPorDriver]
    .sort((a, b) => b.potencialAdicional - a.potencialAdicional)
    .slice(0, 8)
    .map(d => ({
      name: d.nome.length > 18 ? d.nome.slice(0, 16) + "…" : d.nome,
      potencial: d.potencialAdicional,
      esforco: d.esforco,
      fill: d.categoria === "quick_win" ? "#22c55e" : d.categoria === "dependente_dados" ? "#3b82f6" : d.categoria === "dependente_operacional" ? "#eab308" : "#a855f7",
    }));

  const scenarios = [
    { label: "Redução de 20% no absenteísmo", economia: Math.round(ecoBruta * 0.08), categoria: "dependente_operacional" as OportunidadeCategoria },
    { label: "Eliminação de HE irregulares", economia: Math.round(ecoBruta * 0.12), categoria: "quick_win" as OportunidadeCategoria },
    { label: "Melhoria de cobertura planejada", economia: Math.round(ecoBruta * 0.05), categoria: "dependente_operacional" as OportunidadeCategoria },
    { label: "Digitalização completa de documentos", economia: Math.round(ecoBruta * 0.03), categoria: "quick_win" as OportunidadeCategoria },
    { label: "Importação de dados reais de folha", economia: Math.round(valorReferencial * 0.3), categoria: "dependente_dados" as OportunidadeCategoria },
    { label: "Ativação do módulo de Dimensionamento", economia: Math.round(ecoBruta * 0.1), categoria: "dependente_modulo" as OportunidadeCategoria },
  ];

  return (
    <div className="space-y-6">
      {/* Big Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Potencial Adicional", value: formatCurrency(potencialTotal), color: "text-[#FF5722]" },
          { label: "Maior Alavanca", value: maiorAlavanca?.nome || "—", sub: formatCurrency(maiorAlavanca?.potencialAdicional || 0), color: "text-green-600" },
          { label: "Drivers sem Comprovação", value: `${semComprovacao}`, color: "text-yellow-600" },
          { label: "Valor sob Referência", value: formatCurrency(valorReferencial), color: "text-gray-600" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-[10px] text-gray-500 font-medium uppercase">{kpi.label}</p>
            <p className={`text-lg font-bold mt-1 ${kpi.color} truncate`}>{kpi.value}</p>
            {kpi.sub && <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>}
          </div>
        ))}
      </div>

      {/* Quick Wins vs Estruturais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg border border-green-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-semibold text-green-800">Quick Wins</h3>
            <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{quickWins.length} oportunidades</span>
          </div>
          <div className="space-y-2">
            {quickWins.slice(0, 4).map(d => (
              <div key={d.id} className="flex items-center justify-between py-2 px-3 bg-white rounded border border-green-100">
                <div>
                  <p className="text-xs font-medium text-gray-700">{d.nome}</p>
                  <p className="text-[10px] text-gray-400">Prazo: {d.prazoEstimado}</p>
                </div>
                <span className="text-xs font-bold text-green-600">{formatCurrency(d.potencialAdicional)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-blue-800">Oportunidades Estruturais</h3>
            <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{estruturais.length} oportunidades</span>
          </div>
          <div className="space-y-2">
            {estruturais.slice(0, 4).map(d => {
              const cat = categoriaConfig[d.categoria];
              return (
                <div key={d.id} className="flex items-center justify-between py-2 px-3 bg-white rounded border border-blue-100">
                  <div>
                    <p className="text-xs font-medium text-gray-700">{d.nome}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[10px] ${cat.color} ${cat.bg} px-1.5 py-0.5 rounded`}>{cat.label}</span>
                      <span className="text-[10px] text-gray-400">• {d.prazoEstimado}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600">{formatCurrency(d.potencialAdicional)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Capturado vs Potencial */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Valor Capturado vs Potencial</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={capturadoVsPotencial} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${(value / 1000000).toFixed(1)}M`} labelLine={false}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#FF5722" />
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Oportunidade por Driver */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Oportunidade por Driver (Impacto)</h3>
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              {(Object.entries(categoriaConfig) as [OportunidadeCategoria, typeof categoriaConfig[OportunidadeCategoria]][]).map(([key, cfg]) => (
                <span key={key} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: key === "quick_win" ? "#22c55e" : key === "dependente_dados" ? "#3b82f6" : key === "dependente_operacional" ? "#eab308" : "#a855f7" }} />
                  {cfg.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oportunidadeData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="potencial" radius={[0, 4, 4, 0]} name="Potencial">
                  {oportunidadeData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Simulation Scenarios */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">🎯 Simulação de Cenários</h3>
        <div className="space-y-3">
          {scenarios.map((s, i) => {
            const cat = categoriaConfig[s.categoria];
            const CatIcon = cat.icon;
            return (
              <div key={i} className="flex items-center justify-between py-3 px-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center`}>
                    <CatIcon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{s.label}</p>
                    <span className={`text-[10px] ${cat.color} ${cat.bg} px-1.5 py-0.5 rounded`}>{cat.label}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">{formatCurrency(s.economia)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table: Drivers com oportunidade */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Drivers com Oportunidade de Comprovação</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                {["Driver", "Módulo", "Valor Atual", "Confiança", "Categoria", "Prazo Est.", "Potencial Adicional", "Ação Sugerida"].map(h => (
                  <th key={h} className="text-left py-2 px-2 text-gray-500 font-medium uppercase text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {potencialPorDriver.filter(d => d.confianca !== "comprovado").sort((a, b) => b.potencialAdicional - a.potencialAdicional).map(d => {
                const badge = confidenceBadge(d.confianca);
                const cat = categoriaConfig[d.categoria];
                return (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2 font-medium text-gray-700">{d.nome}</td>
                    <td className="py-2 px-2 text-gray-500">{d.moduloNexti}</td>
                    <td className="py-2 px-2 text-green-600 font-medium">{formatCurrency(d.ganhoBruto)}</td>
                    <td className="py-2 px-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.color} border ${badge.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} /> {badge.label}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`text-[10px] font-medium ${cat.color} ${cat.bg} px-2 py-0.5 rounded`}>{cat.label}</span>
                    </td>
                    <td className="py-2 px-2 text-gray-500">{d.prazoEstimado}</td>
                    <td className="py-2 px-2 font-bold text-[#FF5722]">{formatCurrency(d.potencialAdicional)}</td>
                    <td className="py-2 px-2 text-gray-500">
                      {d.confianca === "referencial" ? "Importar dados reais do cliente" : "Validar baseline com dados reais"}
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
