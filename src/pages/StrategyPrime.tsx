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

// ── Entity names per filter ─────────────────────────────────
const strategyEntidadesPorFiltro: Record<string, string[]> = {
  "Empresa": [
    "Victória da Paz", "PROFISER", "Rio Oregon", "ORSEGUPS MONITORAMENTO", "ORSEGUPS SEGURANÇA",
    "OBJETIVA", "PROSERV", "GUARDIÃO SEG", "VERZANI & SANDRINI", "ORBENK",
    "SEGURPRO", "GOCIL", "HAGANÁ", "GRABER", "FORTESEG",
    "PROTEGE", "ORCALI", "CONSERVO", "AFORT", "LIDERANÇA",
  ],
  "Unidade de Negócio": [
    "UN Sudeste", "UN Sul", "UN Nordeste", "UN Centro-Oeste", "UN Norte",
    "UN São Paulo Capital", "UN Interior SP", "UN Litoral", "UN Minas Gerais", "UN Rio de Janeiro",
    "UN Paraná", "UN Santa Catarina", "UN Rio Grande do Sul", "UN Bahia", "UN Pernambuco",
    "UN Goiás", "UN Distrito Federal", "UN Ceará", "UN Pará", "UN Amazonas",
  ],
  "Cliente": [
    "Carrefour Brasil", "Magazine Luiza", "Grupo Pão de Açúcar", "Raia Drogasil", "Natura &Co",
    "Ambev S.A.", "JBS S.A.", "BRF S.A.", "Localiza Hertz", "TOTVS S.A.",
    "Rede D'Or São Luiz", "Hapvida NotreDame", "Votorantim Cimentos", "Gerdau S.A.", "Suzano S.A.",
    "Klabin S.A.", "WEG S.A.", "Embraer S.A.", "CPFL Energia", "Energisa S.A.",
  ],
  "Posto": [
    "Posto Central 001", "Posto Matriz 002", "Posto Filial Norte 003", "Posto Filial Sul 004", "Posto Leste 005",
    "Posto Oeste 006", "Posto Shopping Center 007", "Posto Hospital 008", "Posto Universidade 009", "Posto Aeroporto 010",
    "Posto Rodoviária 011", "Posto Indústria 012", "Posto Condomínio 013", "Posto Escola 014", "Posto Fórum 015",
    "Posto Estádio 016", "Posto Porto 017", "Posto Refinaria 018", "Posto Datacenter 019", "Posto Logístico 020",
  ],
  "Tipo de Serviço": [
    "Vigilância Patrimonial", "Portaria e Controle de Acesso", "Monitoramento Eletrônico", "Escolta Armada",
    "Segurança Pessoal", "Brigada de Incêndio", "Limpeza e Conservação", "Facilities Management",
    "Recepção Corporativa", "Manutenção Predial", "Jardinagem", "Controle de Pragas",
    "Segurança Eletrônica", "CFTV", "Alarme Monitorado", "Rastreamento Veicular",
    "Consultoria de Segurança", "Treinamento", "Gestão de Terceiros", "Apoio Operacional",
  ],
  "Área": [
    "Área Administrativa", "Área Industrial", "Área Comercial", "Área Logística", "Área TI",
    "Área Financeira", "Área RH", "Área Jurídica", "Área Marketing", "Área Operações",
    "Área Produção", "Área Qualidade", "Área Manutenção", "Área Segurança", "Área Saúde",
    "Área Meio Ambiente", "Área Engenharia", "Área P&D", "Área Supply Chain", "Área Compras",
  ],
  "Filtro de Mesa": [
    "Mesa SP Capital", "Mesa RJ Capital", "Mesa BH", "Mesa Curitiba", "Mesa Porto Alegre",
    "Mesa Florianópolis", "Mesa Salvador", "Mesa Recife", "Mesa Fortaleza", "Mesa Brasília",
    "Mesa Goiânia", "Mesa Manaus", "Mesa Belém", "Mesa Campinas", "Mesa Santos",
    "Mesa Ribeirão Preto", "Mesa Sorocaba", "Mesa São José dos Campos", "Mesa Londrina", "Mesa Maringá",
  ],
};

const getStrategyEntities = (filter: string) => strategyEntidadesPorFiltro[filter] || strategyEntidadesPorFiltro["Empresa"];

const buildStrategyRankingPct = (filter: string, basePcts: string[]) =>
  getStrategyEntities(filter).map((empresa, i) => ({ pos: i + 1, empresa, pct: basePcts[i] }));

const buildStrategyRankingQtd = (filter: string, baseQtds: number[]) =>
  getStrategyEntities(filter).map((empresa, i) => ({ pos: i + 1, empresa, qtd: baseQtds[i] }));

// Base numeric values extracted from original data
const basePiorQualidadePcts = ["0,3%", "1,7%", "6,8%", "39,2%", "52,5%", "52,8%", "54,6%", "56,1%", "58,3%", "60,2%", "61,5%", "63,0%", "64,8%", "66,1%", "67,9%", "69,4%", "71,2%", "72,8%", "74,3%", "75,6%"];
const baseIncTratadasPcts = ["12,3%", "15,8%", "18,2%", "22,5%", "25,1%", "28,7%", "31,4%", "35,9%", "38,2%", "41,6%", "44,3%", "47,8%", "50,1%", "53,5%", "56,9%", "60,2%", "63,7%", "67,4%", "70,8%", "74,1%"];
const baseSolTratadasPcts = ["8,1%", "12,4%", "15,7%", "19,3%", "22,8%", "26,1%", "29,5%", "33,2%", "36,8%", "40,3%", "43,9%", "47,2%", "50,6%", "54,1%", "57,8%", "61,4%", "65,0%", "68,7%", "72,3%", "75,9%"];
const baseMaisIncQtds = [1245, 1102, 987, 876, 823, 754, 698, 645, 612, 578, 534, 498, 467, 423, 389, 356, 312, 287, 254, 221];
const baseMaisSolQtds = [2345, 2102, 1987, 1876, 1723, 1654, 1598, 1445, 1312, 1278, 1134, 1098, 967, 923, 889, 756, 712, 687, 654, 621];
const baseJustPontoQtds = [4250, 3890, 3520, 3180, 2950, 2780, 2610, 2440, 2280, 2150, 1980, 1820, 1690, 1540, 1380, 1250, 1120, 980, 850, 720];

const qualidadeEvolucao = [
  { mes: "Jun", valor: 56 }, { mes: "Jul", valor: 14 }, { mes: "Ago", valor: 70 },
  { mes: "Set", valor: 88 }, { mes: "Out", valor: 70 },
];

const marcacoesPorTipo = [
  { tipo: "INVALID_TIME", pct: 100, cor: "#FF5722" },
  { tipo: "NOT_REGISTERED", pct: 100, cor: "#FF5722" },
];

const evolucaoMarcacoesPorTipo = [
  { mes: "Jan", INVALID_TIME: 52, NOT_REGISTERED: 48 }, { mes: "Fev", INVALID_TIME: 55, NOT_REGISTERED: 45 },
  { mes: "Mar", INVALID_TIME: 50, NOT_REGISTERED: 50 }, { mes: "Abr", INVALID_TIME: 58, NOT_REGISTERED: 42 },
  { mes: "Mai", INVALID_TIME: 53, NOT_REGISTERED: 47 }, { mes: "Jun", INVALID_TIME: 60, NOT_REGISTERED: 40 },
  { mes: "Jul", INVALID_TIME: 57, NOT_REGISTERED: 43 }, { mes: "Ago", INVALID_TIME: 62, NOT_REGISTERED: 38 },
  { mes: "Set", INVALID_TIME: 55, NOT_REGISTERED: 45 }, { mes: "Out", INVALID_TIME: 59, NOT_REGISTERED: 41 },
  { mes: "Nov", INVALID_TIME: 61, NOT_REGISTERED: 39 }, { mes: "Dez", INVALID_TIME: 56, NOT_REGISTERED: 44 },
];

const colaboradoresPorColetor = [
  { coletor: "SYSTEM", valor: 6749, cor: "#FF5722" },
  { coletor: "TERMINAL", valor: 6170, cor: "#FF5722" },
  { coletor: "MOBILE", valor: 115, cor: "#FF5722" },
];

const evolucaoMarcacoesPorColetor = [
  { mes: "Jan", SYSTEM: 52.3, TERMINAL: 46.9, MOBILE: 0.8 }, { mes: "Fev", SYSTEM: 52.2, TERMINAL: 46.9, MOBILE: 0.9 },
  { mes: "Mar", SYSTEM: 51.8, TERMINAL: 47.4, MOBILE: 0.8 }, { mes: "Abr", SYSTEM: 51.7, TERMINAL: 47.5, MOBILE: 0.8 },
  { mes: "Mai", SYSTEM: 51.6, TERMINAL: 47.5, MOBILE: 0.9 }, { mes: "Jun", SYSTEM: 51.6, TERMINAL: 47.5, MOBILE: 0.9 },
  { mes: "Jul", SYSTEM: 51.5, TERMINAL: 47.5, MOBILE: 1.0 }, { mes: "Ago", SYSTEM: 51.5, TERMINAL: 47.6, MOBILE: 0.9 },
  { mes: "Set", SYSTEM: 51.7, TERMINAL: 47.4, MOBILE: 0.9 }, { mes: "Out", SYSTEM: 51.8, TERMINAL: 47.3, MOBILE: 0.9 },
  { mes: "Nov", SYSTEM: 51.9, TERMINAL: 47.2, MOBILE: 0.9 }, { mes: "Dez", SYSTEM: 52.0, TERMINAL: 47.1, MOBILE: 0.9 },
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

const origemJustificativas = [
  { name: "Solicitação de Justificativa de Ponto", value: 68, color: "#FF5722" },
  { name: "Outras Fontes", value: 32, color: "#E8E8E8" },
];

const evolucaoJustificativasPonto = [
  { mes: "Jan", valor: 12500 }, { mes: "Fev", valor: 13200 }, { mes: "Mar", valor: 11800 },
  { mes: "Abr", valor: 14100 }, { mes: "Mai", valor: 13700 }, { mes: "Jun", valor: 15200 },
  { mes: "Jul", valor: 14800 }, { mes: "Ago", valor: 16100 }, { mes: "Set", valor: 15500 },
  { mes: "Out", valor: 14300 }, { mes: "Nov", valor: 15800 }, { mes: "Dez", valor: 16500 },
];

const evolucaoReincidentesJustificativas = [
  { mes: "Jan", valor: 18.5 }, { mes: "Fev", valor: 19.2 }, { mes: "Mar", valor: 17.8 },
  { mes: "Abr", valor: 20.1 }, { mes: "Mai", valor: 21.3 }, { mes: "Jun", valor: 19.7 },
  { mes: "Jul", valor: 22.4 }, { mes: "Ago", valor: 21.8 }, { mes: "Set", valor: 20.5 },
  { mes: "Out", valor: 23.1 }, { mes: "Nov", valor: 22.6 }, { mes: "Dez", valor: 21.9 },
];

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

const solicitacoesReincidentes = [
  { mes: "Jan", valor: 12.5 }, { mes: "Fev", valor: 14.2 }, { mes: "Mar", valor: 11.8 },
  { mes: "Abr", valor: 13.1 }, { mes: "Mai", valor: 15.7 }, { mes: "Jun", valor: 10.9 },
  { mes: "Jul", valor: 16.3 }, { mes: "Ago", valor: 14.8 }, { mes: "Set", valor: 12.1 },
  { mes: "Out", valor: 13.6 }, { mes: "Nov", valor: 11.4 }, { mes: "Dez", valor: 15.2 },
];

const tempoMedioTratativa = [
  { mes: "Jan", valor: 2850 }, { mes: "Fev", valor: 3120 }, { mes: "Mar", valor: 2690 },
  { mes: "Abr", valor: 3480 }, { mes: "Mai", valor: 3150 }, { mes: "Jun", valor: 2970 },
  { mes: "Jul", valor: 3610 }, { mes: "Ago", valor: 2780 }, { mes: "Set", valor: 3250 },
  { mes: "Out", valor: 3420 }, { mes: "Nov", valor: 2910 }, { mes: "Dez", valor: 3180 },
];

const piorTempoMedioOperadores = [
  { operador: "Carlos Mendes", tempoMedio: 30 }, { operador: "Ana Rodrigues", tempoMedio: 29 },
  { operador: "Felipe Santos", tempoMedio: 27 }, { operador: "Juliana Costa", tempoMedio: 27 },
  { operador: "Ricardo Almeida", tempoMedio: 26 }, { operador: "Patrícia Lima", tempoMedio: 25 },
  { operador: "Eduardo Ferreira", tempoMedio: 21 },
];

const top10TratativaOperadores = [
  { operador: "Marcos Silva", tratativas: 30 }, { operador: "Luciana Pereira", tratativas: 29 },
  { operador: "Bruno Oliveira", tratativas: 27 }, { operador: "Camila Souza", tratativas: 27 },
  { operador: "Thiago Martins", tratativas: 26 }, { operador: "Renata Barbosa", tratativas: 25 },
  { operador: "Diego Nascimento", tratativas: 21 },
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
  { mes: "Jan", valor: 35.2 }, { mes: "Fev", valor: 33.8 }, { mes: "Mar", valor: 34.5 },
  { mes: "Abr", valor: 32.1 }, { mes: "Mai", valor: 30.9 }, { mes: "Jun", valor: 31.6 },
  { mes: "Jul", valor: 28.4 }, { mes: "Ago", valor: 26.7 }, { mes: "Set", valor: 24.3 },
  { mes: "Out", valor: 22.0 }, { mes: "Nov", valor: 20.5 }, { mes: "Dez", valor: 19.8 },
];

const tabs = [
  "Registro de Ponto",
  "Operacional",
  "Coletor",
  "Engajamento e Retenção",
  "Ausências e Coberturas",
];

const subNavItems = ["Visão Geral", "Inconsistências", "Solicitações", "Justificativa", "Eficiência"];

const filterOptions = ["Empresa", "Unidade de Negócio", "Cliente", "Posto", "Tipo de Serviço", "Área", "Filtro de Mesa"];

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
        {activeSubNav === "Justificativa" && <AjustesContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
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
        <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col" style={{ height: '320px' }}>
          <h3 className="font-bold text-sm text-gray-800">Top 20 Pior Qualidade de Marcação</h3>
          <p className="text-xs text-gray-400 mb-4">por {activeFilter}</p>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">👤 {activeFilter}</th>
                  <th className="text-right py-2 text-gray-500 font-medium">▲ %</th>
                </tr>
              </thead>
              <tbody>
                {buildStrategyRankingPct(activeFilter, basePiorQualidadePcts).map((item) => (
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
        <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col" style={{ height: '320px' }}>
          <h3 className="font-bold text-sm text-gray-800 mb-4">Evolução da Qualidade das Marcações</h3>
          <div className="flex-1">
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
      {/* Row 1: Inconsistências x Tratadas - full width */}
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
      {/* Row 2: Top 20 mais inconsistências + Top 20 pior % tratadas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Top 20 com Mais Inconsistências</h3>
          <p className="text-xs text-gray-400 mb-4">por {activeFilter}</p>
          <div className="max-h-[252px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">👤 {activeFilter}</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Qtd</th>
                </tr>
              </thead>
              <tbody>
                {buildStrategyRankingQtd(activeFilter, baseMaisIncQtds).map((item) => (
                  <tr key={item.pos} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700">
                      <span className="text-gray-400 mr-2">{item.pos}</span>
                      {item.empresa}
                    </td>
                    <td className="py-2 text-right text-gray-600">{item.qtd.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Top 20 pior % Inconsistências Tratadas</h3>
          <p className="text-xs text-gray-400 mb-4">por {activeFilter}</p>
          <div className="max-h-[252px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">👤 {activeFilter}</th>
                  <th className="text-right py-2 text-gray-500 font-medium">▲ %</th>
                </tr>
              </thead>
              <tbody>
                {buildStrategyRankingPct(activeFilter, baseIncTratadasPcts).map((item) => (
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
      {/* Row 3: Reincidentes + Tempo Médio */}
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
      {/* Row 1: Evolução da Quantidade de Justificativas - full width */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-bold text-sm text-gray-800">Evolução da Quantidade de Justificativas de Ponto</h3>
        <p className="text-xs text-gray-400 mb-4">por Período</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolucaoJustificativasPonto} margin={{ top: 20, right: 20, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
              <YAxis hide />
              <Tooltip formatter={(value: number) => value.toLocaleString("pt-BR")} />
              <Line type="monotone" dataKey="valor" stroke="#FF5722" strokeWidth={2} dot={{ r: 4, fill: "#FF5722" }}
                label={{ position: "top", fontSize: 10, fill: "#333", formatter: (v: number) => `${(v / 1000).toFixed(1)} Mil` }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Row 2: Reincidentes + Top 20 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">% Origem das Justificativas de Ponto</h3>
          <div className="flex items-center gap-4 mt-1 mb-2 flex-wrap">
            {origemJustificativas.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-500">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
          <div className="h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={origemJustificativas} cx="50%" cy="50%" innerRadius={70} outerRadius={95} dataKey="value" startAngle={90} endAngle={-270}>
                  {origemJustificativas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col" style={{ height: 320 }}>
          <h3 className="font-bold text-sm text-gray-800">Top 20 com Justificativas de Ponto</h3>
          <p className="text-xs text-gray-400 mb-2">por {activeFilter}</p>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">#</th>
                  <th className="text-left py-2 text-gray-500 font-medium">{activeFilter}</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Qtd</th>
                </tr>
              </thead>
              <tbody>
                {buildStrategyRankingQtd(activeFilter, baseJustPontoQtds).map((item) => (
                  <tr key={item.pos} className="border-b border-gray-50">
                    <td className="py-1.5 text-gray-400 text-xs">{item.pos}</td>
                    <td className="py-1.5 text-gray-700 text-xs">{item.empresa}</td>
                    <td className="py-1.5 text-right text-gray-600 text-xs font-medium">{item.qtd.toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Row 3: Origem Justificativas + Evolução Marcações Manuais */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Colaboradores Reincidentes nas Justificativas de Ponto</h3>
          <p className="text-xs text-gray-400 mb-4">% Reincidência por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoReincidentesJustificativas} margin={{ top: 20, right: 20, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
                <YAxis hide />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Line type="monotone" dataKey="valor" stroke="#FF5722" strokeWidth={2} dot={{ r: 4, fill: "#FF5722" }}
                  label={{ position: "top", fontSize: 10, fill: "#333", formatter: (v: number) => `${v}%` }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Evolução das Marcações Inseridas Manualmente</h3>
          <p className="text-xs text-gray-400 mb-4">por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoMarcacoesManuais} margin={{ top: 20, right: 20, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Line type="monotone" dataKey="valor" stroke="#FF5722" strokeWidth={2} dot={{ r: 4, fill: "#FF5722" }}
                  label={{ position: "top", fontSize: 10, fill: "#333", formatter: (v: number) => `${v}%` }}
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

// Solicitações Content
const SolicitacoesContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex gap-4">
    <div className="flex-1 space-y-4">
      {/* Row 1: Solicitações de Justificativa de Ponto - full width */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
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
      {/* Row 2: Top 20 Mais Solicitações + Top 20 pior % Tratadas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col" style={{ height: 320 }}>
          <h3 className="font-bold text-sm text-gray-800">Top 20 com Mais Solicitações</h3>
          <p className="text-xs text-gray-400 mb-2">por {activeFilter}</p>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">👤 {activeFilter}</th>
                  <th className="text-right py-2 text-gray-500 font-medium">▲ Qtd</th>
                </tr>
              </thead>
              <tbody>
                {buildStrategyRankingQtd(activeFilter, baseMaisSolQtds).map((item) => (
                  <tr key={item.pos} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700">
                      <span className="text-gray-400 mr-2">{item.pos}</span>
                      {item.empresa}
                    </td>
                    <td className="py-2 text-right text-gray-600">{item.qtd.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col" style={{ height: 320 }}>
          <h3 className="font-bold text-sm text-gray-800">Top 20 pior % Solicitações Tratadas</h3>
          <p className="text-xs text-gray-400 mb-2">por {activeFilter}</p>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">👤 {activeFilter}</th>
                  <th className="text-right py-2 text-gray-500 font-medium">▲ %</th>
                </tr>
              </thead>
              <tbody>
                {buildStrategyRankingPct(activeFilter, baseSolTratadasPcts).map((item) => (
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
          <h3 className="font-bold text-sm text-gray-800">% Solicitações Reincidentes</h3>
          <p className="text-xs text-gray-400 mb-4">por Período</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={solicitacoesReincidentes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} />
                <YAxis hide domain={[0, 20]} />
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
                <YAxis hide domain={[0, 4000]} />
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
          <h3 className="font-bold text-sm text-gray-800">Tempo Médio de Tratativa de Inconsistência</h3>
          <p className="text-xs text-gray-400 mb-4">por Operador</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Operador</th>
                <th className="text-right py-2 text-gray-500 font-medium">Tempo Médio (h)</th>
              </tr>
            </thead>
            <tbody>
              {piorTempoMedioOperadores.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-gray-700">{item.operador}</td>
                  <td className="py-2 text-right text-gray-600">{item.tempoMedio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-800">Quantidade de Tratativa de Marcações</h3>
          <p className="text-xs text-gray-400 mb-4">por Operador</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Operador</th>
                <th className="text-right py-2 text-gray-500 font-medium">Tratativas</th>
              </tr>
            </thead>
            <tbody>
              {top10TratativaOperadores.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-gray-700">{item.operador}</td>
                  <td className="py-2 text-right text-gray-600">{item.tratativas}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
