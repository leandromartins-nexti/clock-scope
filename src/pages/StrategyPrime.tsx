import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Settings, Eraser, Lightbulb, RefreshCw } from "lucide-react";
import { ImprovementProvider } from "@/contexts/ImprovementContext";
import { ImprovementPin } from "@/components/improvements/ImprovementPin";
import { ImprovementCenter } from "@/components/improvements/ImprovementCenter";
import { ImprovementLayer } from "@/components/improvements/ImprovementLayer";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LabelList, Legend
} from "recharts";

// Mock data
const qualidadeEvolucao = [
  { mes: "Jun", valor: 56 },
  { mes: "Jul", valor: 14 },
  { mes: "Ago", valor: 70 },
  { mes: "Set", valor: 88 },
  { mes: "Out", valor: 70 },
];

const topPiorQualidade = [
  { pos: 1, empresa: "Victória da Paz", pct: "0,3%" },
  { pos: 2, empresa: "PROFISER", pct: "1,7%" },
  { pos: 3, empresa: "Rio Oregon", pct: "6,8%" },
  { pos: 4, empresa: "ORSEGUPS MONITORAMENTO", pct: "39,2%" },
  { pos: 5, empresa: "ORSEGUPS SEGURANÇA", pct: "52,5%" },
  { pos: 6, empresa: "OBJETIVA", pct: "52,8%" },
  { pos: 7, empresa: "PROSERV", pct: "54,6%" },
];

const marcacoesPorTipo = [
  { tipo: "INVALID_TIME", pct: 100, cor: "#FF5722" },
  { tipo: "NOT_REGISTERED", pct: 100, cor: "#FF5722" },
];

const evolucaoMarcacoesPorTipo = [
  { mes: "Jan", INVALID_TIME: 52, NOT_REGISTERED: 48 },
  { mes: "Fev", INVALID_TIME: 55, NOT_REGISTERED: 45 },
  { mes: "Mar", INVALID_TIME: 50, NOT_REGISTERED: 50 },
  { mes: "Abr", INVALID_TIME: 58, NOT_REGISTERED: 42 },
  { mes: "Mai", INVALID_TIME: 53, NOT_REGISTERED: 47 },
  { mes: "Jun", INVALID_TIME: 60, NOT_REGISTERED: 40 },
  { mes: "Jul", INVALID_TIME: 57, NOT_REGISTERED: 43 },
  { mes: "Ago", INVALID_TIME: 62, NOT_REGISTERED: 38 },
  { mes: "Set", INVALID_TIME: 55, NOT_REGISTERED: 45 },
  { mes: "Out", INVALID_TIME: 59, NOT_REGISTERED: 41 },
  { mes: "Nov", INVALID_TIME: 61, NOT_REGISTERED: 39 },
  { mes: "Dez", INVALID_TIME: 56, NOT_REGISTERED: 44 },
];

const colaboradoresPorColetor = [
  { coletor: "SYSTEM", valor: 6749, cor: "#FF5722" },
  { coletor: "TERMINAL", valor: 6170, cor: "#FF5722" },
  { coletor: "MOBILE", valor: 115, cor: "#FF5722" },
];

const evolucaoMarcacoesPorColetor = [
  { mes: "Jan", SYSTEM: 52.3, TERMINAL: 46.9, MOBILE: 0.8 },
  { mes: "Fev", SYSTEM: 52.2, TERMINAL: 46.9, MOBILE: 0.9 },
  { mes: "Mar", SYSTEM: 51.8, TERMINAL: 47.4, MOBILE: 0.8 },
  { mes: "Abr", SYSTEM: 51.7, TERMINAL: 47.5, MOBILE: 0.8 },
  { mes: "Mai", SYSTEM: 51.6, TERMINAL: 47.5, MOBILE: 0.9 },
  { mes: "Jun", SYSTEM: 51.6, TERMINAL: 47.5, MOBILE: 0.9 },
  { mes: "Jul", SYSTEM: 51.5, TERMINAL: 47.5, MOBILE: 1.0 },
  { mes: "Ago", SYSTEM: 51.5, TERMINAL: 47.6, MOBILE: 0.9 },
  { mes: "Set", SYSTEM: 51.7, TERMINAL: 47.4, MOBILE: 0.9 },
  { mes: "Out", SYSTEM: 51.8, TERMINAL: 47.3, MOBILE: 0.9 },
  { mes: "Nov", SYSTEM: 52.0, TERMINAL: 47.1, MOBILE: 0.9 },
  { mes: "Dez", SYSTEM: 51.9, TERMINAL: 47.3, MOBILE: 0.8 },
];

const evolucaoInconsistenciasReincidentes = [
  { mes: "Jan", valor: 32.1 }, { mes: "Fev", valor: 34.5 }, { mes: "Mar", valor: 31.8 },
  { mes: "Abr", valor: 35.2 }, { mes: "Mai", valor: 33.7 }, { mes: "Jun", valor: 36.4 },
  { mes: "Jul", valor: 38.1 }, { mes: "Ago", valor: 35.9 }, { mes: "Set", valor: 37.3 },
  { mes: "Out", valor: 34.8 }, { mes: "Nov", valor: 36.7 }, { mes: "Dez", valor: 33.2 },
];

const tempoMedioTratativaInconsistencias = [
  { mes: "Jan", valor: 12.3 }, { mes: "Fev", valor: 11.8 }, { mes: "Mar", valor: 13.1 },
  { mes: "Abr", valor: 10.5 }, { mes: "Mai", valor: 9.8 }, { mes: "Jun", valor: 11.2 },
  { mes: "Jul", valor: 10.1 }, { mes: "Ago", valor: 9.5 }, { mes: "Set", valor: 8.7 },
  { mes: "Out", valor: 9.2 }, { mes: "Nov", valor: 8.4 }, { mes: "Dez", valor: 7.9 },
];

const topInconsistenciasTratadas = [
  { pos: 1, empresa: "ORSEGUPS SEGURANÇA", pct: "12,3%" },
  { pos: 2, empresa: "ORSEGUPS MONITORAMENTO", pct: "15,8%" },
  { pos: 3, empresa: "OBJETIVA", pct: "18,2%" },
  { pos: 4, empresa: "PROSERV", pct: "22,5%" },
  { pos: 5, empresa: "Victória da Paz", pct: "25,1%" },
  { pos: 6, empresa: "PROFISER", pct: "28,7%" },
  { pos: 7, empresa: "Rio Oregon", pct: "31,4%" },
  { pos: 8, empresa: "SEGURPRO", pct: "35,9%" },
  { pos: 9, empresa: "GOCIL", pct: "38,2%" },
  { pos: 10, empresa: "SERVIAN", pct: "41,6%" },
  { pos: 11, empresa: "PROTEGE", pct: "44,3%" },
  { pos: 12, empresa: "HAGANÁ", pct: "47,8%" },
  { pos: 13, empresa: "GRABER", pct: "50,1%" },
  { pos: 14, empresa: "PREMIUM", pct: "53,5%" },
  { pos: 15, empresa: "FORTE", pct: "56,9%" },
  { pos: 16, empresa: "CONTINENTAL", pct: "60,2%" },
  { pos: 17, empresa: "NORDESTE SEG.", pct: "63,7%" },
  { pos: 18, empresa: "ASERP", pct: "67,4%" },
  { pos: 19, empresa: "ALIANÇA", pct: "70,8%" },
  { pos: 20, empresa: "KEEP SAFE", pct: "74,1%" },
];

const origemSolicitacoes = [
  { name: "% Total Ajustadas", value: 100, color: "#F5A623" },
  { name: "% Ajustes Origem Solicitações", value: 0, color: "#E8E8E8" },
];

// Solicitações mock data
const solicitacoesJustificativa = [
  { mes: "Jan", emAberto: 580, ajustadas: 67500, canceladas: 15100 },
  { mes: "Fev", emAberto: 620, ajustadas: 68200, canceladas: 15300 },
  { mes: "Mar", emAberto: 550, ajustadas: 67800, canceladas: 15000 },
  { mes: "Abr", emAberto: 610, ajustadas: 67000, canceladas: 15200 },
  { mes: "Mai", emAberto: 590, ajustadas: 68500, canceladas: 15400 },
  { mes: "Jun", emAberto: 640, ajustadas: 67200, canceladas: 14900 },
  { mes: "Jul", emAberto: 570, ajustadas: 68000, canceladas: 15100 },
  { mes: "Ago", emAberto: 600, ajustadas: 67600, canceladas: 15300 },
  { mes: "Set", emAberto: 630, ajustadas: 67900, canceladas: 15000 },
  { mes: "Out", emAberto: 560, ajustadas: 68300, canceladas: 15200 },
  { mes: "Nov", emAberto: 610, ajustadas: 67700, canceladas: 15100 },
  { mes: "Dez", emAberto: 700, ajustadas: 67400, canceladas: 14700 },
];

const solicitacoesPorTipo = [
  { tipo: "752", pct: 29.1 },
  { tipo: "7348", pct: 24.3 },
  { tipo: "7349", pct: 7.6 },
  { tipo: "4911", pct: 4.5 },
  { tipo: "218", pct: 2.0 },
  { tipo: "7609", pct: 1.8 },
  { tipo: "4909", pct: 1.7 },
  { tipo: "3512", pct: 1.6 },
  { tipo: "3521", pct: 1.4 },
];

const solicitacoesTratadas = [
  { mes: "Jan", valor: 99.3 }, { mes: "Fev", valor: 99.3 }, { mes: "Mar", valor: 99.3 },
  { mes: "Abr", valor: 99.3 }, { mes: "Mai", valor: 99.3 }, { mes: "Jun", valor: 99.3 },
  { mes: "Jul", valor: 99.3 }, { mes: "Ago", valor: 99.3 }, { mes: "Set", valor: 99.3 },
  { mes: "Out", valor: 99.3 }, { mes: "Nov", valor: 99.3 }, { mes: "Dez", valor: 99.3 },
];

const tempoMedioTratativa = [
  { mes: "Jan", valor: 3357.5 }, { mes: "Fev", valor: 3357.5 }, { mes: "Mar", valor: 3357.5 },
  { mes: "Abr", valor: 3357.5 }, { mes: "Mai", valor: 3357.5 }, { mes: "Jun", valor: 3357.5 },
  { mes: "Jul", valor: 3357.5 }, { mes: "Ago", valor: 3357.5 }, { mes: "Set", valor: 3357.5 },
  { mes: "Out", valor: 3357.5 }, { mes: "Nov", valor: 3357.5 }, { mes: "Dez", valor: 3357.5 },
];

// Eficiência mock data
const piorTempoMedioOperadores = [
  { operador: "552", cargo: "VIGILANTE", tempoMedio: 30 },
  { operador: "799", cargo: "VIGILANTE", tempoMedio: 29 },
  { operador: "4358", cargo: "VIGILANTE", tempoMedio: 27 },
  { operador: "762", cargo: "VIGILANTE", tempoMedio: 27 },
  { operador: "7370", cargo: "MONITOR DE ACESSO", tempoMedio: 26 },
  { operador: "4465", cargo: "VIGILANTE", tempoMedio: 25 },
  { operador: "609", cargo: "VIGILANTE", tempoMedio: 21 },
];

const top10TratativaOperadores = [
  { operador: "552", cargo: "VIGILANTE", tratativas: 30 },
  { operador: "799", cargo: "VIGILANTE", tratativas: 29 },
  { operador: "4358", cargo: "VIGILANTE", tratativas: 27 },
  { operador: "762", cargo: "VIGILANTE", tratativas: 27 },
  { operador: "7370", cargo: "MONITOR DE ACESSO", tratativas: 26 },
  { operador: "4465", cargo: "VIGILANTE", tratativas: 25 },
  { operador: "609", cargo: "VIGILANTE", tratativas: 21 },
];

const evolucaoInconsistenciasTratadas = [
  { mes: "Jan", total: 320, tratadas: 144 }, { mes: "Fev", total: 298, tratadas: 145 }, { mes: "Mar", total: 345, tratadas: 180 },
  { mes: "Abr", total: 310, tratadas: 157 }, { mes: "Mai", total: 330, tratadas: 182 }, { mes: "Jun", total: 305, tratadas: 180 },
  { mes: "Jul", total: 289, tratadas: 178 }, { mes: "Ago", total: 312, tratadas: 197 }, { mes: "Set", total: 278, tratadas: 169 },
  { mes: "Out", total: 335, tratadas: 218 }, { mes: "Nov", total: 342, tratadas: 234 }, { mes: "Dez", total: 318, tratadas: 230 },
];

const tempoMedioMovimentacoes = [
  { mes: "Jan", valor: 9100 }, { mes: "Fev", valor: 9100 }, { mes: "Mar", valor: 9100 },
  { mes: "Abr", valor: 9100 }, { mes: "Mai", valor: 9100 }, { mes: "Jun", valor: 9100 },
  { mes: "Jul", valor: 9100 }, { mes: "Ago", valor: 9100 }, { mes: "Set", valor: 9100 },
  { mes: "Out", valor: 9100 }, { mes: "Nov", valor: 9100 }, { mes: "Dez", valor: 9100 },
];

const evolucaoMarcacoesManuais = [
  { mes: "Jun", valor: 31.6 },
  { mes: "Out", valor: 22.0 },
];

const tabs = [
  "Registro de Ponto",
  "Operacional",
  "Coletor",
  "Engajamento e Retenção",
  "Ausências e Coberturas",
];

const subNavItems = ["Visão Geral", "Inconsistências", "Solicitações", "Ajustes", "Eficiência"];

const filterOptions = ["Empresa", "Unidade de Negócio", "Cliente", "Posto", "Tipo de Serviço"];

const StrategyPrime = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Registro de Ponto");
  const [activeSubNav, setActiveSubNav] = useState("Visão Geral");
  const [activeFilter, setActiveFilter] = useState("Empresa");

  return (
    <ImprovementProvider>
    <ImprovementLayer screenId={activeSubNav}>
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <header className="border-b border-gray-200 px-6 py-3 bg-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Home</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-gray-500">Strategy Analytics</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[#FF5722] font-semibold">Prime</span>
        </div>
      </header>

      {/* Tabs Row */}
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
              onClick={() => navigate("/operacional-prime")}
              className="bg-[#FF5722] text-white px-5 py-2 rounded text-sm font-semibold"
            >
              Operacional
            </button>
            <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <ImprovementCenter />
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
        <div className="grid grid-cols-5 gap-4">
          <KPICard
            title="Qualidade da Marcação"
            value="57,5%"
            valueColor="text-green-500"
            metaLabel="Taxa Qualidade"
            metaTarget="≥ 75%"
            yoyValue="57,5%"
            yoyColor="text-green-500"
            yoyIcon="↑"
          />
          <KPICard
            title="Inconsistência Tratada"
            value="-"
            valueColor="text-gray-400"
            metaLabel="Taxa Tratada"
            metaTarget="≥ 90%"
            yoyValue="-"
            yoyColor="text-gray-400"
          />
          <KPICard
            title="Tratativa Inconsistência"
            value="-"
            valueColor="text-gray-400"
            metaLabel="Tempo Médio"
            metaTarget="≤ 8h"
            yoyValue="-"
            yoyColor="text-gray-400"
          />
          <KPICard
            title="Solicitações Tratadas"
            value="99,3%"
            valueColor="text-green-500"
            metaLabel="Taxa Tratada"
            metaTarget="≥ 90%"
            yoyValue="0,0%"
            yoyColor="text-green-500"
            yoyIcon="↑"
          />
          <KPICard
            title="Tratativa de Solicitações"
            value="3357,5h"
            valueColor="text-red-500"
            metaLabel="Tempo Médio"
            metaTarget="≤ 8h"
            yoyValue="0,0%"
            yoyColor="text-green-500"
            yoyIcon="↑"
          />
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

      {/* Main Content Grid */}
      <div className="px-6 pb-4 flex-1">
        {activeSubNav === "Visão Geral" && <VisaoGeralContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
        {activeSubNav === "Inconsistências" && <InconsistenciasContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
        {activeSubNav === "Solicitações" && <SolicitacoesContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
        {activeSubNav === "Ajustes" && <AjustesContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
        {activeSubNav === "Eficiência" && <EficienciaContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
      </div>
    </div>
    </ImprovementLayer>
    </ImprovementProvider>
  );
};

// Shared sidebar + insights + updated
const SidePanel = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex flex-col gap-4">
    {/* Selecione por */}
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
      <div className="border-l-4 border-[#FF5722] bg-orange-50 rounded-r-lg p-3">
        <p className="text-xs text-gray-600 leading-relaxed">
          Os resultados apresentam <strong>aderência parcial às metas</strong>.
          Embora a operação mantenha consistência, há indicadores que exigem
          <strong> atenção e ajustes pontuais</strong>.
        </p>
      </div>
    </div>
    {/* Updated */}
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
      <RefreshCw className="w-4 h-4 text-gray-400" />
      <div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Updated</p>
        <p className="text-xs text-gray-700 font-medium">Feb 25, 2026 às 17:07</p>
      </div>
    </div>
  </div>
);

// Visão Geral Content
const VisaoGeralContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex gap-4">
    {/* Left content */}
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Top 10 Pior Qualidade */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Top 10 Pior Qualidade de Marcação</h3>
          <p className="text-xs text-gray-400 mb-4">por Entidade</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">👤 Empresa</th>
                <th className="text-right py-2 text-gray-500 font-medium">▲ %</th>
              </tr>
            </thead>
            <tbody>
              {topPiorQualidade.map((item) => (
                <tr key={item.pos} className="border-b border-gray-50">
                  <td className="py-2 text-gray-700">
                    <span className="text-gray-400 mr-2">{item.pos}</span>
                    {item.empresa}
                  </td>
                  <td className="py-2 text-right text-gray-600">{item.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Evolução da Qualidade */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800 mb-4">Evolução da Qualidade das Marcações</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualidadeEvolucao}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#999" }} />
                <YAxis hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#FF5722"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#FF5722" }}
                  label={{ position: "top", fontSize: 11, fill: "#333", formatter: (v: number) => `${v}%` }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Evolução % Marcações por Tipo - Stacked Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm text-gray-800">Evolução % Marcações por Tipo</h3>
            <ImprovementPin itemId="evolucao-marcacoes-tipo-substituir" />
          </div>
          <p className="text-xs text-gray-400 mb-4">Percentual mensal por tipo de marcação</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolucaoMarcacoesPorTipo}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#999" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#999" }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="INVALID_TIME" stackId="a" fill="#FF5722" name="Horário Inválido" radius={[0, 0, 0, 0]} />
                <Bar dataKey="NOT_REGISTERED" stackId="a" fill="#FF9800" name="Esquecimento" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Evolução Colaboradores por Coletor - Stacked Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm text-gray-800">Evolução % Marcações por Coletor</h3>
            <ImprovementPin itemId="evolucao-colaboradores-coletor-substituir" />
          </div>
          <p className="text-xs text-gray-400 mb-4">Percentual mensal de marcações por tipo de coletor</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolucaoMarcacoesPorColetor}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#999" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#999" }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="SYSTEM" stackId="a" fill="#FF5722" name="System" radius={[0, 0, 0, 0]} />
                <Bar dataKey="TERMINAL" stackId="a" fill="#FF9800" name="Terminal" radius={[0, 0, 0, 0]} />
                <Bar dataKey="MOBILE" stackId="a" fill="#FFC107" name="Mobile" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
    {/* Right side panel */}
    <div className="w-[280px] shrink-0">
      <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  </div>
);

// Inconsistências Content
const InconsistenciasContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex gap-4">
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Inconsistências x Tratadas</h3>
          <p className="text-xs text-gray-400 mb-4">Volume por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolucaoInconsistenciasTratadas} barGap={2} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#999" }} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="total" fill="#BDBDBD" radius={[2, 2, 0, 0]} name="Total Inconsistências" />
                <Bar dataKey="tratadas" fill="#FF5722" radius={[2, 2, 0, 0]} name="Tratadas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Top 20 pior % Inconsistências Tratadas</h3>
          <p className="text-xs text-gray-400 mb-4">por Entidade</p>
          <div className="max-h-[252px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">👤 Empresa</th>
                  <th className="text-right py-2 text-gray-500 font-medium">▲ %</th>
                </tr>
              </thead>
              <tbody>
                {topInconsistenciasTratadas.map((item) => (
                  <tr key={item.pos} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700">
                      <span className="text-gray-400 mr-2">{item.pos}</span>
                      {item.empresa}
                    </td>
                    <td className="py-2 text-right text-gray-600">{item.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">% Inconsistências Reincidentes</h3>
          <p className="text-xs text-gray-400 mb-4">por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoInconsistenciasReincidentes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#999" }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="valor" stroke="#FF5722" strokeWidth={2} dot={{ fill: "#FF5722", r: 3 }} name="% Reincidentes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Tempo Médio Tratativa de Inconsistências</h3>
          <p className="text-xs text-gray-400 mb-4">por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempoMedioTratativaInconsistencias}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#999" }} />
                <YAxis hide />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}h`} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="valor" stroke="#FF5722" strokeWidth={2} dot={{ fill: "#FF5722", r: 3 }} name="Tempo Médio (h)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
    <div className="w-[280px] shrink-0">
      <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  </div>
);

// Ajustes Content
const AjustesContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex gap-4">
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">% Origem de Solicitações dos Ajustes de Ponto</h3>
          <div className="flex items-center gap-4 mt-1 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5722] inline-block" />
              <span className="text-[10px] text-gray-500">% Total Ajustadas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#F5A623] inline-block" />
              <span className="text-[10px] text-gray-500">% Ajustes Origem Solicitações</span>
            </div>
          </div>
          <div className="h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={origemSolicitacoes} cx="50%" cy="50%" innerRadius={70} outerRadius={95} dataKey="value" startAngle={90} endAngle={-270}>
                  {origemSolicitacoes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around text-xs text-gray-500 mt-1">
            <span>100%</span>
            <span>0%</span>
          </div>
        </div>
      </div>
    </div>
    <div className="w-[280px] shrink-0">
      <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  </div>
);

// Solicitações Content
const SolicitacoesContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex gap-4">
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Solicitações de Justificativa de Ponto</h3>
          <h3 className="font-bold text-sm text-gray-800">Solicitações de Justificativa de Ponto</h3>
          <div className="flex items-center gap-4 mt-1 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF8A65] inline-block" />
              <span className="text-[10px] text-gray-500">Em Aberto: 7.261</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#F5A623] inline-block" />
              <span className="text-[10px] text-gray-500">Ajustadas: 811.112</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#E91E63] inline-block" />
              <span className="text-[10px] text-gray-500">Canceladas: 181.627</span>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={solicitacoesJustificativa} barGap={2} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="emAberto" fill="#FF8A65" radius={[2, 2, 0, 0]} />
                <Bar dataKey="ajustadas" fill="#F5A623" radius={[2, 2, 0, 0]} />
                <Bar dataKey="canceladas" fill="#E91E63" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* % Solicitações por Tipo */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">% Solicitações de Justificativa de Ponto por Tipo</h3>
          <p className="text-xs text-gray-400 mb-4">por Código</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={solicitacoesPorTipo} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 35]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="tipo" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} width={45} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="pct" fill="#FF5722" radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="pct" position="right" fontSize={10} fill="#666" formatter={(v: number) => `${v}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">% Solicitações de Justificativa de Pontos Tratadas</h3>
          <h3 className="font-bold text-sm text-gray-800">% Solicitações de Justificativa de Pontos Tratadas</h3>
          <p className="text-xs text-gray-400 mb-4">por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={solicitacoesTratadas}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
                <YAxis domain={[98, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Line type="monotone" dataKey="valor" stroke="#FF5722" strokeWidth={2} dot={{ r: 3, fill: "#FF5722" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Tempo Médio Tratativa */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">% Tempo Médio Tratativa de Solicitações</h3>
          <p className="text-xs text-gray-400 mb-4">por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempoMedioTratativa}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
                <YAxis domain={[0, 4000]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
                <Tooltip formatter={(value: number) => value.toLocaleString("pt-BR")} />
                <Line type="monotone" dataKey="valor" stroke="#FF5722" strokeWidth={2} dot={{ r: 3, fill: "#FF5722" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
    <div className="w-[280px] shrink-0">
      <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  </div>
);

// Eficiência Content
const EficienciaContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex gap-4">
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Pior Tempo Médio de Tratativa de Marcações</h3>
          <h3 className="font-bold text-sm text-gray-800">Pior Tempo Médio de Tratativa de Marcações</h3>
          <p className="text-xs text-gray-400 mb-4">por Operador</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Operador</th>
                <th className="text-left py-2 text-gray-500 font-medium">Cargo</th>
                <th className="text-right py-2 text-gray-500 font-medium">Tempo Médio (h)</th>
              </tr>
            </thead>
            <tbody>
              {piorTempoMedioOperadores.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-gray-700">{item.operador}</td>
                  <td className="py-2 text-gray-500 text-xs">{item.cargo}</td>
                  <td className="py-2 text-right text-gray-600">{item.tempoMedio}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 pt-3 border-t border-gray-100 text-right">
            <span className="text-2xl font-bold text-gray-800">3.357,5</span>
          </div>
        </div>
        {/* Top 10 Quantidade de Tratativa de Marcações */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Top 10 Quantidade de Tratativa de Marcações</h3>
          <p className="text-xs text-gray-400 mb-4">por Operador</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Operador</th>
                <th className="text-left py-2 text-gray-500 font-medium">Cargo</th>
                <th className="text-right py-2 text-gray-500 font-medium">Tratativas</th>
              </tr>
            </thead>
            <tbody>
              {top10TratativaOperadores.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-gray-700">{item.operador}</td>
                  <td className="py-2 text-gray-500 text-xs">{item.cargo}</td>
                  <td className="py-2 text-right text-gray-600">{item.tratativas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Tempo Médio de Tratativa de Movimentações</h3>
          <h3 className="font-bold text-sm text-gray-800">Tempo Médio de Tratativa de Movimentações</h3>
          <p className="text-xs text-gray-400 mb-4">por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempoMedioMovimentacoes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} tickFormatter={(v) => `${(v / 1000).toFixed(1)} Mil`} />
                <Tooltip formatter={(value: number) => value.toLocaleString("pt-BR")} />
                <Line type="monotone" dataKey="valor" stroke="#FF5722" strokeWidth={2} dot={{ r: 3, fill: "#FF5722" }}
                  label={{ position: "top", fontSize: 10, fill: "#666", formatter: (v: number) => `${(v / 1000).toFixed(1)} Mil` }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Evolução das Marcações Inseridas Manualmente */}
        <div className="col-span-5 bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Evolução das Marcações Inseridas Manualmente</h3>
          <p className="text-xs text-gray-400 mb-4">por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoMarcacoesManuais}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
                <YAxis domain={[0, 40]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Line type="monotone" dataKey="valor" stroke="#FF5722" strokeWidth={2} dot={{ r: 4, fill: "#FF5722" }}
                  label={{ position: "top", fontSize: 11, fill: "#333", formatter: (v: number) => `${v}%` }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
    <div className="w-[280px] shrink-0">
      <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  </div>
);

// Placeholder for tabs not yet built
const PlaceholderContent = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
    <p className="text-gray-400 text-lg">{title} - Em desenvolvimento</p>
  </div>
);

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string;
  valueColor: string;
  metaLabel: string;
  metaTarget: string;
  yoyValue: string;
  yoyColor: string;
  yoyIcon?: string;
}

const KPICard = ({ title, value, valueColor, metaLabel, metaTarget, yoyValue, yoyColor, yoyIcon }: KPICardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-[140px] flex flex-col justify-between">
    <p className="text-xs text-gray-500 font-medium text-center">{title}</p>
    <p className={`text-3xl font-bold text-center ${valueColor}`}>{value}</p>
    <div>
      <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
        <div className="text-[10px] text-gray-400"><span>{metaLabel}</span></div>
        <div className="text-[10px] text-gray-400">{metaTarget}</div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-gray-400">YoY</span>
        <span className={`text-[10px] font-medium ${yoyColor}`}>{yoyValue} {yoyIcon || ""}</span>
      </div>
    </div>
  </div>
);

export default StrategyPrime;
