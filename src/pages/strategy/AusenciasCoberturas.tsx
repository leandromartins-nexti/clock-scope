import { useState, useMemo } from "react";
import { Settings, Lightbulb, RefreshCw, Eraser, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LabelList, Legend, ComposedChart, Area,
} from "recharts";

// ── Mock Data ─────────────────────────────────────────────────

const evolucaoTemporal = [
  { mes: "Jan", absenteismo: 5.2, cobertura: 87.3, horasDescobertas: 1240, custoCobertura: 48500 },
  { mes: "Fev", absenteismo: 5.8, cobertura: 84.1, horasDescobertas: 1560, custoCobertura: 52300 },
  { mes: "Mar", absenteismo: 4.9, cobertura: 89.2, horasDescobertas: 980, custoCobertura: 45100 },
  { mes: "Abr", absenteismo: 6.1, cobertura: 82.5, horasDescobertas: 1780, custoCobertura: 58200 },
  { mes: "Mai", absenteismo: 5.5, cobertura: 86.0, horasDescobertas: 1380, custoCobertura: 50800 },
  { mes: "Jun", absenteismo: 6.4, cobertura: 81.3, horasDescobertas: 1920, custoCobertura: 61500 },
  { mes: "Jul", absenteismo: 5.7, cobertura: 85.5, horasDescobertas: 1450, custoCobertura: 53200 },
  { mes: "Ago", absenteismo: 6.8, cobertura: 79.8, horasDescobertas: 2100, custoCobertura: 65800 },
  { mes: "Set", absenteismo: 5.3, cobertura: 87.9, horasDescobertas: 1150, custoCobertura: 47600 },
  { mes: "Out", absenteismo: 6.0, cobertura: 83.7, horasDescobertas: 1680, custoCobertura: 56900 },
  { mes: "Nov", absenteismo: 5.9, cobertura: 84.8, horasDescobertas: 1520, custoCobertura: 54100 },
  { mes: "Dez", absenteismo: 6.2, cobertura: 82.1, horasDescobertas: 1850, custoCobertura: 59700 },
];

const distribuicaoAusencias = [
  { mes: "Jan", falta: 320, atestado: 580, ferias: 210, outros: 130 },
  { mes: "Fev", falta: 380, atestado: 620, ferias: 190, outros: 150 },
  { mes: "Mar", falta: 290, atestado: 540, ferias: 230, outros: 110 },
  { mes: "Abr", falta: 410, atestado: 650, ferias: 200, outros: 170 },
  { mes: "Mai", falta: 350, atestado: 590, ferias: 220, outros: 140 },
  { mes: "Jun", falta: 430, atestado: 680, ferias: 180, outros: 160 },
  { mes: "Jul", falta: 360, atestado: 610, ferias: 250, outros: 130 },
  { mes: "Ago", falta: 450, atestado: 720, ferias: 190, outros: 180 },
  { mes: "Set", falta: 310, atestado: 560, ferias: 240, outros: 120 },
  { mes: "Out", falta: 400, atestado: 640, ferias: 210, outros: 155 },
  { mes: "Nov", falta: 370, atestado: 600, ferias: 225, outros: 145 },
  { mes: "Dez", falta: 420, atestado: 670, ferias: 195, outros: 165 },
];

const eficienciaCobertura = [
  { mes: "Jan", planejada: 72, emergencial: 28, tempoMedio: 4.2, horaExtra: 35 },
  { mes: "Fev", planejada: 68, emergencial: 32, tempoMedio: 5.1, horaExtra: 42 },
  { mes: "Mar", planejada: 75, emergencial: 25, tempoMedio: 3.8, horaExtra: 30 },
  { mes: "Abr", planejada: 65, emergencial: 35, tempoMedio: 5.6, horaExtra: 48 },
  { mes: "Mai", planejada: 70, emergencial: 30, tempoMedio: 4.5, horaExtra: 38 },
  { mes: "Jun", planejada: 62, emergencial: 38, tempoMedio: 6.1, horaExtra: 52 },
  { mes: "Jul", planejada: 71, emergencial: 29, tempoMedio: 4.3, horaExtra: 36 },
  { mes: "Ago", planejada: 60, emergencial: 40, tempoMedio: 6.5, horaExtra: 55 },
  { mes: "Set", planejada: 74, emergencial: 26, tempoMedio: 3.9, horaExtra: 31 },
  { mes: "Out", planejada: 66, emergencial: 34, tempoMedio: 5.3, horaExtra: 45 },
  { mes: "Nov", planejada: 69, emergencial: 31, tempoMedio: 4.7, horaExtra: 40 },
  { mes: "Dez", planejada: 63, emergencial: 37, tempoMedio: 5.9, horaExtra: 50 },
];

const topRiscosOperacionais = [
  { entidade: "Carrefour Brasil", tipo: "Cliente", absenteismo: 8.2, descoberta: 22.5, custoCobertura: 89500, risco: 9.4 },
  { entidade: "Posto Aeroporto 010", tipo: "Posto", absenteismo: 7.8, descoberta: 20.1, custoCobertura: 76200, risco: 8.9 },
  { entidade: "UN Sudeste", tipo: "Unidade", absenteismo: 7.5, descoberta: 18.7, custoCobertura: 125800, risco: 8.7 },
  { entidade: "Magazine Luiza", tipo: "Cliente", absenteismo: 7.1, descoberta: 19.3, custoCobertura: 68900, risco: 8.3 },
  { entidade: "Posto Shopping Center 007", tipo: "Posto", absenteismo: 6.9, descoberta: 17.8, custoCobertura: 54300, risco: 7.8 },
  { entidade: "Posto Hospital 008", tipo: "Posto", absenteismo: 6.7, descoberta: 16.5, custoCobertura: 61200, risco: 7.5 },
  { entidade: "Ambev S.A.", tipo: "Cliente", absenteismo: 6.5, descoberta: 15.9, custoCobertura: 72400, risco: 7.2 },
  { entidade: "UN Norte", tipo: "Unidade", absenteismo: 6.3, descoberta: 21.2, custoCobertura: 48900, risco: 7.0 },
  { entidade: "Grupo Pão de Açúcar", tipo: "Cliente", absenteismo: 6.1, descoberta: 14.8, custoCobertura: 58700, risco: 6.8 },
  { entidade: "Posto Indústria 012", tipo: "Posto", absenteismo: 5.9, descoberta: 13.5, custoCobertura: 43200, risco: 6.5 },
];

const rankingIneficiencia = {
  custoCobertura: [
    { entidade: "UN Sudeste", valor: "R$ 125.800" },
    { entidade: "Carrefour Brasil", valor: "R$ 89.500" },
    { entidade: "Posto Aeroporto 010", valor: "R$ 76.200" },
    { entidade: "Ambev S.A.", valor: "R$ 72.400" },
    { entidade: "Magazine Luiza", valor: "R$ 68.900" },
    { entidade: "Posto Hospital 008", valor: "R$ 61.200" },
    { entidade: "Grupo Pão de Açúcar", valor: "R$ 58.700" },
    { entidade: "Posto Shopping Center 007", valor: "R$ 54.300" },
    { entidade: "UN Norte", valor: "R$ 48.900" },
    { entidade: "Posto Indústria 012", valor: "R$ 43.200" },
  ],
  absenteismo: [
    { entidade: "Carrefour Brasil", valor: "8,2%" },
    { entidade: "Posto Aeroporto 010", valor: "7,8%" },
    { entidade: "UN Sudeste", valor: "7,5%" },
    { entidade: "Magazine Luiza", valor: "7,1%" },
    { entidade: "Posto Shopping Center 007", valor: "6,9%" },
    { entidade: "Posto Hospital 008", valor: "6,7%" },
    { entidade: "Ambev S.A.", valor: "6,5%" },
    { entidade: "UN Norte", valor: "6,3%" },
    { entidade: "Grupo Pão de Açúcar", valor: "6,1%" },
    { entidade: "Posto Indústria 012", valor: "5,9%" },
  ],
  horasDescobertas: [
    { entidade: "UN Sudeste", valor: "3.250h" },
    { entidade: "Carrefour Brasil", valor: "2.890h" },
    { entidade: "UN Norte", valor: "2.540h" },
    { entidade: "Posto Aeroporto 010", valor: "2.180h" },
    { entidade: "Magazine Luiza", valor: "1.960h" },
    { entidade: "Ambev S.A.", valor: "1.780h" },
    { entidade: "Posto Hospital 008", valor: "1.650h" },
    { entidade: "Posto Shopping Center 007", valor: "1.420h" },
    { entidade: "Grupo Pão de Açúcar", valor: "1.280h" },
    { entidade: "Posto Indústria 012", valor: "1.050h" },
  ],
};

const filterOptions = ["Empresa", "Unidade de Negócio", "Cliente", "Posto", "Tipo de Serviço", "Área", "Supervisor"];

// ── Big Number Card ──────────────────────────────────────────
const BigNumber = ({
  title, value, previous, unit, isPositive, icon: Icon,
}: {
  title: string; value: string; previous: string; unit?: string;
  isPositive?: boolean; icon?: React.ElementType;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between h-[130px]">
    <p className="text-xs text-gray-500 font-medium">{title}</p>
    <p className="text-2xl font-bold text-gray-800">{value}{unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}</p>
    <div className="flex items-center gap-1 text-[10px]">
      {isPositive !== undefined && (
        isPositive
          ? <TrendingUp className="w-3 h-3 text-green-500" />
          : <TrendingDown className="w-3 h-3 text-red-500" />
      )}
      <span className={isPositive ? "text-green-500 font-medium" : "text-red-500 font-medium"}>{previous}</span>
      <span className="text-gray-400">vs período anterior</span>
    </div>
  </div>
);

// ── Side Panel (reusable) ────────────────────────────────────
const AusenciasSidePanel = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex flex-col gap-4">
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-[#FF5722]" />
        <span className="font-bold text-sm text-gray-800">Selecione por:</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => setActiveFilter(option)}
            className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${
              activeFilter === option
                ? "border-[#FF5722] text-[#FF5722] bg-orange-50"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
    {/* Insights */}
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-[#FF5722]" />
        <span className="font-bold text-sm text-gray-800">Insights</span>
      </div>
      <div className="space-y-3">
        <div className="border-l-4 border-red-400 bg-red-50 rounded-r-lg p-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Absenteísmo crescente:</strong> Taxa subiu de 5,2% para 6,2% nos últimos 12 meses, 
            com pico em agosto (6,8%).
          </p>
        </div>
        <div className="border-l-4 border-[#FF5722] bg-orange-50 rounded-r-lg p-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Custo elevado:</strong> Cobertura emergencial representa 38% do total, 
            gerando <strong>R$ 59.700/mês</strong> de custo adicional.
          </p>
        </div>
        <div className="border-l-4 border-yellow-400 bg-yellow-50 rounded-r-lg p-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Concentração de risco:</strong> 3 clientes concentram 42% das horas descobertas. 
            Priorizar atuação nesses postos.
          </p>
        </div>
        <div className="border-l-4 border-blue-400 bg-blue-50 rounded-r-lg p-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Hora extra excessiva:</strong> 55% das coberturas em agosto foram com HE, 
            indicando falha no planejamento.
          </p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
      <RefreshCw className="w-4 h-4 text-gray-400" />
      <div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Updated</p>
        <p className="text-xs text-gray-700 font-medium">Mar 27, 2026 às 09:15</p>
      </div>
    </div>
  </div>
);

// ── Main Component ──────────────────────────────────────────
export const AusenciasCoberturasContent = () => {
  const [activeFilter, setActiveFilter] = useState("Empresa");
  const [selectedRisco, setSelectedRisco] = useState<string | null>(null);
  const [rankingTab, setRankingTab] = useState<"custoCobertura" | "absenteismo" | "horasDescobertas">("custoCobertura");

  const rankingLabels = {
    custoCobertura: "Maior Custo de Cobertura",
    absenteismo: "Maior Absenteísmo",
    horasDescobertas: "Mais Horas Descobertas",
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-4">
        {/* Big Numbers */}
        <div className="grid grid-cols-6 gap-3">
          <BigNumber title="Taxa de Absenteísmo" value="5,9%" previous="+0,7pp" isPositive={false} />
          <BigNumber title="Total Horas Ausência" value="18.610" unit="h" previous="+12,3%" isPositive={false} />
          <BigNumber title="Taxa de Cobertura" value="84,5%" previous="-2,1pp" isPositive={false} />
          <BigNumber title="Horas Descobertas" value="1.551" unit="h/mês" previous="+18,5%" isPositive={false} />
          <BigNumber title="Custo de Cobertura" value="R$ 653k" previous="+15,2%" isPositive={false} />
          <BigNumber title="Ineficiência Operacional" value="23,4%" previous="+3,1pp" isPositive={false} />
        </div>

        {/* Charts Row 1 - Evolução Temporal */}
        <div className="bg-white rounded-lg border border-gray-200 p-5" style={{ height: 280 }}>
          <h3 className="font-bold text-sm text-gray-800 mb-1">Evolução Temporal</h3>
          <p className="text-xs text-gray-400 mb-3">Absenteísmo, cobertura, horas descobertas e custo ao longo do tempo</p>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={evolucaoTemporal}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" hide />
              <YAxis yAxisId="right" orientation="right" hide />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(value: any, name: string) => {
                  const labels: Record<string, string> = { absenteismo: "Absenteísmo (%)", cobertura: "Cobertura (%)", horasDescobertas: "Horas Descobertas", custoCobertura: "Custo (R$)" };
                  return [typeof value === "number" && name === "custoCobertura" ? `R$ ${value.toLocaleString("pt-BR")}` : value, labels[name] || name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line yAxisId="left" type="monotone" dataKey="absenteismo" name="Absenteísmo (%)" stroke="#EF4444" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="cobertura" name="Cobertura (%)" stroke="#22C55E" strokeWidth={2} dot={false} />
              <Bar yAxisId="right" dataKey="horasDescobertas" name="Horas Descobertas" fill="#FF5722" opacity={0.3} barSize={16} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Distribuição de Ausências */}
          <div className="bg-white rounded-lg border border-gray-200 p-5" style={{ height: 280 }}>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Distribuição de Ausências</h3>
            <p className="text-xs text-gray-400 mb-3">Por tipo: Falta, Atestado, Férias e Outros</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={distribuicaoAusencias}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="falta" name="Falta" stackId="a" fill="#EF4444" />
                <Bar dataKey="atestado" name="Atestado" stackId="a" fill="#F97316" />
                <Bar dataKey="ferias" name="Férias" stackId="a" fill="#3B82F6" />
                <Bar dataKey="outros" name="Outros" stackId="a" fill="#94A3B8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Eficiência de Cobertura */}
          <div className="bg-white rounded-lg border border-gray-200 p-5" style={{ height: 280 }}>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Eficiência de Cobertura</h3>
            <p className="text-xs text-gray-400 mb-3">Planejada vs emergencial e % com hora extra</p>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={eficienciaCobertura}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any, n: string) => {
                  const l: Record<string, string> = { planejada: "Planejada (%)", emergencial: "Emergencial (%)", horaExtra: "Com Hora Extra (%)" };
                  return [v, l[n] || n];
                }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="planejada" name="Planejada (%)" stackId="a" fill="#22C55E" />
                <Bar dataKey="emergencial" name="Emergencial (%)" stackId="a" fill="#EF4444" />
                <Line type="monotone" dataKey="horaExtra" name="Com Hora Extra (%)" stroke="#FF5722" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top Riscos Operacionais */}
          <div className="bg-white rounded-lg border border-gray-200 p-5" style={{ height: 380 }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Top Riscos Operacionais
              </h3>
              {selectedRisco && (
                <button onClick={() => setSelectedRisco(null)} className="text-xs text-[#FF5722] hover:underline flex items-center gap-1">
                  <Eraser className="w-3 h-3" /> Limpar
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-3">Ordenado por score de risco</p>
            <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium text-xs">Entidade</th>
                    <th className="text-right py-2 text-gray-500 font-medium text-xs">Absent.</th>
                    <th className="text-right py-2 text-gray-500 font-medium text-xs">Descob.</th>
                    <th className="text-right py-2 text-gray-500 font-medium text-xs">Custo</th>
                    <th className="text-right py-2 text-gray-500 font-medium text-xs">Risco</th>
                  </tr>
                </thead>
                <tbody>
                  {topRiscosOperacionais.map((item, idx) => {
                    const isSelected = selectedRisco === item.entidade;
                    return (
                      <tr
                        key={idx}
                        className={`border-b border-gray-50 cursor-pointer transition-colors ${
                          isSelected ? "bg-orange-50 border-l-2 border-l-[#FF5722]" : selectedRisco ? "opacity-50 hover:opacity-80" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedRisco(isSelected ? null : item.entidade)}
                      >
                        <td className="py-2">
                          <div className="text-gray-700 text-xs font-medium">{item.entidade}</div>
                          <div className="text-[10px] text-gray-400">{item.tipo}</div>
                        </td>
                        <td className="py-2 text-right text-xs text-red-500 font-semibold">{item.absenteismo}%</td>
                        <td className="py-2 text-right text-xs text-orange-500 font-semibold">{item.descoberta}%</td>
                        <td className="py-2 text-right text-xs text-gray-700">R$ {(item.custoCobertura / 1000).toFixed(1)}k</td>
                        <td className="py-2 text-right">
                          <span className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold text-white ${
                            item.risco >= 8.5 ? "bg-red-500" : item.risco >= 7 ? "bg-orange-500" : "bg-yellow-500"
                          }`}>
                            {item.risco}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ranking de Ineficiência */}
          <div className="bg-white rounded-lg border border-gray-200 p-5" style={{ height: 380 }}>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Ranking de Ineficiência</h3>
            <p className="text-xs text-gray-400 mb-3">Direcionamento de ação da gestão</p>
            <div className="flex gap-1 mb-3">
              {(Object.keys(rankingLabels) as Array<keyof typeof rankingLabels>).map((key) => (
                <button
                  key={key}
                  onClick={() => setRankingTab(key)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    rankingTab === key
                      ? "bg-[#FF5722] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {rankingLabels[key]}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 260 }}>
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium text-xs">#</th>
                    <th className="text-left py-2 text-gray-500 font-medium text-xs">Entidade</th>
                    <th className="text-right py-2 text-gray-500 font-medium text-xs">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingIneficiencia[rankingTab].map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="py-2 text-gray-700 text-xs font-medium">{item.entidade}</td>
                      <td className="py-2 text-right text-xs font-semibold text-gray-800">{item.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-[280px] shrink-0">
        <AusenciasSidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      </div>
    </div>
  );
};
