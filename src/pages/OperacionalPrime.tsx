import { useState } from "react";
import { ChevronRight, Filter, Settings, Eraser, Lightbulb, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";

// ── Mock data ──────────────────────────────────────────────

const evolucaoBacklog = [
  { mes: "Jan", valor: 7000 }, { mes: "Fev", valor: 7000 }, { mes: "Mar", valor: 7000 },
  { mes: "Abr", valor: 7000 }, { mes: "Mai", valor: 2000 }, { mes: "Jun", valor: 182000 },
  { mes: "Jul", valor: 47000 }, { mes: "Ago", valor: 7000 }, { mes: "Set", valor: 24000 },
  { mes: "Out", valor: 27000 }, { mes: "Nov", valor: 7000 }, { mes: "Dez", valor: 7000 },
];

const heatmapData = [
  { dia: "seg", hours: [3, 2, 1, 0, 0, 1, 2, 3, 8, 9, 7, 6, 5] },
  { dia: "ter", hours: [2, 1, 0, 0, 0, 1, 2, 4, 7, 8, 6, 5, 4] },
  { dia: "qua", hours: [2, 1, 1, 0, 0, 1, 3, 4, 7, 8, 7, 6, 4] },
  { dia: "qui", hours: [3, 2, 1, 0, 0, 1, 2, 3, 8, 9, 8, 7, 5] },
  { dia: "sex", hours: [2, 1, 0, 0, 0, 1, 2, 4, 7, 8, 6, 5, 4] },
  { dia: "sáb", hours: [1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0] },
  { dia: "dom", hours: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0] },
];

const tiposInconsistencias = [
  { tipo: "REGISTERED", pct: 135 },
  { tipo: "NOT_REGISTERED", pct: 76 },
  { tipo: "INVALID_TIME", pct: 24 },
  { tipo: "DUPLICATE", pct: 3 },
  { tipo: "ADJUSTED", pct: 1 },
  { tipo: "CANCELED", pct: 1 },
];

const motivoAjustes = [
  { motivo: "Esquecimento", pct: 42 },
  { motivo: "Falha Sistema", pct: 28 },
  { motivo: "Troca Turno", pct: 15 },
  { motivo: "Hora Extra", pct: 10 },
  { motivo: "Outros", pct: 5 },
];

// ── Constants ──────────────────────────────────────────────

const tabs = [
  "Registro de Ponto", "Operacional", "Coletor",
  "Engajamento e Retenção", "Ausências e Coberturas",
];

const subNavItems = ["Backlog", "Solicitações", "Qualidade"];
const filterOptions = ["Empresa", "Unidade de Negócio", "Cliente", "Posto", "Tipo de Serviço"];

// ── Helpers ────────────────────────────────────────────────

const formatNumber = (n: number) => n.toLocaleString("pt-BR");

const getHeatColor = (v: number) => {
  if (v === 0) return "#FFF5F0";
  if (v <= 2) return "#FDCDB9";
  if (v <= 4) return "#FC9272";
  if (v <= 6) return "#FB6A4A";
  if (v <= 8) return "#EF3B2C";
  return "#CB181D";
};

// ── Page ───────────────────────────────────────────────────

const OperacionalPrime = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Registro de Ponto");
  const [activeSubNav, setActiveSubNav] = useState("Backlog");
  const [activeFilter, setActiveFilter] = useState("Empresa");

  return (
    <div className="flex-1 overflow-auto bg-gray-50 min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <header className="border-b border-gray-200 px-6 py-3 bg-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Home</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-gray-500">Operacional Analytics</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[#FF5722] font-semibold">Prime</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex items-center justify-between">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-[#FF5722] text-[#FF5722]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/strategy-prime")}
              className="bg-[#FF5722] text-white px-5 py-2 rounded text-sm font-semibold"
            >
              Strategy
            </button>
            <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Filtros Aplicados */}
      <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-[#FF5722]" />
            <span className="font-semibold text-gray-700">Filtros Aplicados:</span>
          </div>
          <span className="bg-orange-50 text-[#FF5722] border border-[#FF5722] rounded-full px-3 py-1 text-xs font-medium">
            Período: jan/2017 - dez/2017
          </span>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
          <Eraser className="w-4 h-4" />
          Limpar Filtros
        </button>
      </div>

      {/* KPI Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-4">
          <OperacionalKPI title="Inconsistências em Aberto" value="282.873" yoy="-" />
          <OperacionalKPI title="Solicitações em Aberto" value="7.261" yoy="0,0%" trend="down" />
          <OperacionalKPI title="Movimentações em Aberto" value="22" yoy="0,0%" trend="down" />
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="px-6 pb-2">
        <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3">
          <Settings className="w-4 h-4 text-[#FF5722]" />
          {subNavItems.map((item, index) => (
            <div key={item} className="flex items-center gap-3">
              <button
                onClick={() => setActiveSubNav(item)}
                className={`text-sm font-medium transition-colors ${
                  activeSubNav === item ? "text-[#FF5722]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {item}
              </button>
              {index < subNavItems.length - 1 && (
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-4 flex-1">
        {activeSubNav === "Backlog" && <BacklogContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
        {activeSubNav === "Solicitações" && <PlaceholderContent label="Solicitações" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
        {activeSubNav === "Qualidade" && <PlaceholderContent label="Qualidade" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
      </div>
    </div>
  );
};

// ── KPI Card ───────────────────────────────────────────────

const OperacionalKPI = ({
  title, value, yoy, trend,
}: {
  title: string;
  value: string;
  yoy: string;
  trend?: "up" | "down";
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5">
    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-400 font-medium">YoY</span>
      <span className={`font-semibold ${
        trend === "up" ? "text-green-500" : trend === "down" ? "text-[#FF5722]" : "text-gray-400"
      }`}>
        {yoy} {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}
      </span>
    </div>
  </div>
);

// ── Side Panel (shared) ────────────────────────────────────

const SidePanel = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="w-[220px] shrink-0 flex flex-col gap-4">
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
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-[#FF5722]" />
        <span className="font-bold text-sm text-gray-800">Insights</span>
      </div>
      <div className="border-l-4 border-[#FF5722] bg-orange-50 rounded-r-lg p-3">
        <p className="text-xs text-gray-600 leading-relaxed">
          O volume operacional apresenta <strong>alto nível de inconsistências pendentes</strong>,
          indicando risco de impacto na qualidade e na <strong>estabilidade dos processos</strong>.
        </p>
      </div>
    </div>
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
      <RefreshCw className="w-4 h-4 text-gray-400" />
      <div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Updated</p>
        <p className="text-xs text-gray-700 font-medium">Feb 25, 2026 às 17:07</p>
      </div>
    </div>
  </div>
);

// ── Backlog Content ────────────────────────────────────────

const BacklogContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex gap-4">
    <div className="flex-1 grid grid-cols-2 gap-4">
      {/* Evolução do Backlog */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-sm text-gray-800 mb-1">Evolução do Backlog</h3>
        <p className="text-xs text-gray-400 mb-4">Inconsistências e Solicitações em Aberto</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evolucaoBacklog}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#9CA3AF"
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)} Mil` : v}
              />
              <Tooltip
                formatter={(v: number) => [formatNumber(v), "Total"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
              />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                {evolucaoBacklog.map((entry, i) => (
                  <rect key={i} fill={entry.valor > 50000 ? "#FF5722" : "#FDB813"} />
                ))}
                <LabelList
                  dataKey="valor"
                  position="top"
                  formatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)} Mil` : v}
                  style={{ fontSize: 10, fill: "#6B7280" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap – Total de Inconsistências por Dia e Horário */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-sm text-gray-800 mb-1">Total de Inconsistências</h3>
        <p className="text-xs text-gray-400 mb-4">por Dia e Horário</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-[10px] text-gray-400 font-normal text-left pr-2 pb-1">Dia</th>
                {Array.from({ length: 13 }, (_, i) => (
                  <th key={i} className="text-[10px] text-gray-400 font-normal pb-1 px-0.5">
                    {String(i).padStart(2, "0")}h
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.dia}>
                  <td className="text-[11px] text-gray-500 pr-2 py-0.5">{row.dia}</td>
                  {row.hours.map((v, i) => (
                    <td key={i} className="px-0.5 py-0.5">
                      <div
                        className="w-full h-6 rounded-sm"
                        style={{ backgroundColor: getHeatColor(v), minWidth: 28 }}
                        title={`${row.dia} ${String(i).padStart(2, "0")}h: ${v}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Legend gradient */}
          <div className="flex items-center gap-1 mt-3 justify-center">
            <span className="text-[10px] text-gray-400">Menos</span>
            {[0, 2, 4, 6, 8, 10].map((v) => (
              <div
                key={v}
                className="w-5 h-3 rounded-sm"
                style={{ backgroundColor: getHeatColor(v) }}
              />
            ))}
            <span className="text-[10px] text-gray-400">Mais</span>
          </div>
        </div>
      </div>

      {/* % Tipos de Inconsistências */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-sm text-gray-800 mb-4">% Tipos de Inconsistências</h3>
        <div className="space-y-3">
          {tiposInconsistencias.map((item) => (
            <div key={item.tipo} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-32 shrink-0 text-right">{item.tipo}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${Math.min((item.pct / 135) * 100, 100)}%`,
                    backgroundColor: "#FF5722",
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-10">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* % Motivo de Ajustes de Inconsistências */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-sm text-gray-800 mb-4">% Motivo de Ajustes de Inconsistências</h3>
        <div className="space-y-3">
          {motivoAjustes.map((item) => (
            <div key={item.motivo} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-28 shrink-0 text-right">{item.motivo}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${(item.pct / 42) * 100}%`,
                    background: `linear-gradient(90deg, #FF5722, #FDB813)`,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-10">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
  </div>
);

// ── Placeholder for other sub-tabs ─────────────────────────

const PlaceholderContent = ({ label, activeFilter, setActiveFilter }: { label: string; activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex gap-4">
    <div className="flex-1 flex items-center justify-center min-h-[400px] bg-white rounded-lg border border-gray-200">
      <p className="text-gray-400 text-lg font-medium">{label} — Em breve</p>
    </div>
    <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
  </div>
);

export default OperacionalPrime;
