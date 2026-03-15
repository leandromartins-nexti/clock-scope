import { useState } from "react";
import { ChevronRight, Filter, Settings, Eraser, Lightbulb, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ImprovementProvider } from "@/contexts/ImprovementContext";
import { ImprovementCenter } from "@/components/improvements/ImprovementCenter";
import { ImprovementLayer } from "@/components/improvements/ImprovementLayer";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend,
} from "recharts";

// ── Mock data ──────────────────────────────────────────────

const evolucaoBacklogDiario = [
  { dia: "01", inconsistencias: 1250, solicitacoes: 380 },
  { dia: "02", inconsistencias: 1180, solicitacoes: 420 },
  { dia: "03", inconsistencias: 1320, solicitacoes: 350 },
  { dia: "04", inconsistencias: 980, solicitacoes: 290 },
  { dia: "05", inconsistencias: 1450, solicitacoes: 510 },
  { dia: "06", inconsistencias: 1100, solicitacoes: 370 },
  { dia: "07", inconsistencias: 890, solicitacoes: 260 },
  { dia: "08", inconsistencias: 1380, solicitacoes: 440 },
  { dia: "09", inconsistencias: 1520, solicitacoes: 480 },
  { dia: "10", inconsistencias: 1210, solicitacoes: 390 },
  { dia: "11", inconsistencias: 1060, solicitacoes: 310 },
  { dia: "12", inconsistencias: 1430, solicitacoes: 460 },
  { dia: "13", inconsistencias: 1150, solicitacoes: 340 },
  { dia: "14", inconsistencias: 970, solicitacoes: 280 },
  { dia: "15", inconsistencias: 1340, solicitacoes: 410 },
  { dia: "16", inconsistencias: 1280, solicitacoes: 370 },
  { dia: "17", inconsistencias: 1490, solicitacoes: 520 },
  { dia: "18", inconsistencias: 1100, solicitacoes: 350 },
  { dia: "19", inconsistencias: 1030, solicitacoes: 300 },
  { dia: "20", inconsistencias: 1260, solicitacoes: 430 },
  { dia: "21", inconsistencias: 880, solicitacoes: 240 },
  { dia: "22", inconsistencias: 1370, solicitacoes: 450 },
  { dia: "23", inconsistencias: 1190, solicitacoes: 380 },
  { dia: "24", inconsistencias: 1410, solicitacoes: 470 },
  { dia: "25", inconsistencias: 1050, solicitacoes: 320 },
  { dia: "26", inconsistencias: 1300, solicitacoes: 400 },
  { dia: "27", inconsistencias: 920, solicitacoes: 270 },
  { dia: "28", inconsistencias: 1160, solicitacoes: 360 },
  { dia: "29", inconsistencias: 1480, solicitacoes: 500 },
  { dia: "30", inconsistencias: 1220, solicitacoes: 390 },
];

const agingInconsistencias = [
  { faixa: "0–2 dias", inconsistencias: 12450, solicitacoes: 3820, cor: "#4CAF50" },
  { faixa: "3–5 dias", inconsistencias: 8320, solicitacoes: 2150, cor: "#FFC107" },
  { faixa: "6–10 dias", inconsistencias: 5180, solicitacoes: 1340, cor: "#FF9800" },
  { faixa: "11–20 dias", inconsistencias: 3740, solicitacoes: 890, cor: "#FF5722" },
  { faixa: "+20 dias", inconsistencias: 2185, solicitacoes: 620, cor: "#D32F2F" },
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

const heatmapSolicitacoes = [
  { dia: "seg", hours: [1, 1, 0, 0, 0, 0, 1, 2, 5, 7, 6, 4, 3] },
  { dia: "ter", hours: [1, 0, 0, 0, 0, 1, 1, 3, 6, 7, 5, 4, 2] },
  { dia: "qua", hours: [1, 1, 0, 0, 0, 0, 2, 3, 5, 6, 5, 3, 2] },
  { dia: "qui", hours: [2, 1, 0, 0, 0, 1, 1, 2, 6, 7, 6, 5, 3] },
  { dia: "sex", hours: [1, 0, 0, 0, 0, 0, 1, 3, 5, 6, 4, 3, 2] },
  { dia: "sáb", hours: [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0] },
  { dia: "dom", hours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
];

const tiposInconsistenciasBase = [
  { tipo: "Esquecimento", pct: 76 },
  { tipo: "Horário Inválido", pct: 24 },
  { tipo: "Duplicada", pct: 3 },
  { tipo: "Ajustada", pct: 1 },
  { tipo: "Terminal Não Autorizado", pct: 8 },
  { tipo: "Fora de Perímetro", pct: 5 },
];

const evolucaoInconsistenciasMensal = [
  { mes: "Jan", emAberto: 420, tratadas: 4850, canceladas: 980 },
  { mes: "Fev", emAberto: 380, tratadas: 5120, canceladas: 910 },
  { mes: "Mar", emAberto: 510, tratadas: 4680, canceladas: 1050 },
  { mes: "Abr", emAberto: 350, tratadas: 5340, canceladas: 870 },
  { mes: "Mai", emAberto: 460, tratadas: 4920, canceladas: 1020 },
  { mes: "Jun", emAberto: 390, tratadas: 5200, canceladas: 940 },
  { mes: "Jul", emAberto: 340, tratadas: 5450, canceladas: 860 },
  { mes: "Ago", emAberto: 580, tratadas: 4600, canceladas: 1130 },
  { mes: "Set", emAberto: 410, tratadas: 5050, canceladas: 970 },
  { mes: "Out", emAberto: 370, tratadas: 5280, canceladas: 900 },
  { mes: "Nov", emAberto: 490, tratadas: 4780, canceladas: 1060 },
  { mes: "Dez", emAberto: 400, tratadas: 5150, canceladas: 920 },
];

// ── Entity names per filter ─────────────────────────────────

const entidadesPorFiltro: Record<string, string[]> = {
  "Empresa": [
    "EBS2 TRADE E GESTAO LTDA", "WORKS CONSTRUCAO E SERVICOS", "SAFEMED Filial 0006", "GOCIL VIGILANCIA",
    "CONSTRUPOPP", "GOCIL SERVICOS", "TELOS CONSULTORIA EMPRESARIAL LTDA", "ANCORA BADOTTI PARTICIPACOES LTDA",
    "CARIOCA CALCADOS LTDA", "LOJAS RENNER S.A.", "SHOPPING MUELLER", "CONDOMÍNIO EDIFÍCIO AURORA",
    "HOSPITAL SÃO LUCAS", "UNIVERSIDADE FEDERAL", "BANCO DO BRASIL", "SUPERMERCADO ANGELONI",
    "TRIBUNAL DE JUSTIÇA", "PREFEITURA MUNICIPAL", "CENTRO EMPRESARIAL ALPHA", "PARQUE INDUSTRIAL SUL",
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
  "Colaborador": [
    "João Silva (1001)", "Maria Santos (1002)", "Carlos Oliveira (1003)", "Ana Souza (1004)", "Pedro Lima (1005)",
    "Fernanda Costa (1006)", "Ricardo Alves (1007)", "Juliana Pereira (1008)", "Bruno Ferreira (1009)", "Camila Rodrigues (1010)",
    "Diego Martins (1011)", "Patrícia Nascimento (1012)", "Rafael Barbosa (1013)", "Luciana Gomes (1014)", "Thiago Ribeiro (1015)",
    "Amanda Carvalho (1016)", "Marcos Teixeira (1017)", "Beatriz Moura (1018)", "Felipe Araújo (1019)", "Daniela Pinto (1020)",
  ],
};

const getEntidadesForFilter = (filter: string) => entidadesPorFiltro[filter] || entidadesPorFiltro["Empresa"];

// Helper to build ranking data dynamically
const buildTop20Totais = (filter: string, baseTotals: number[]) =>
  getEntidadesForFilter(filter).map((entidade, i) => ({ entidade, total: baseTotals[i] }));

const buildTop20Reincidentes = (filter: string, baseOcorrencias: number[], meses: string[]) =>
  getEntidadesForFilter(filter).map((entidade, i) => ({ entidade, ocorrencias: baseOcorrencias[i], ultimaOcorrencia: meses[i % meses.length] }));

const buildTop20Qualidade = (filter: string, basePcts: number[]) =>
  getEntidadesForFilter(filter).map((entidade, i) => ({ entidade, pct: basePcts[i] }));

// Base values (numeric only, reused across filters)
const baseInconsistenciasTabTotais = [18420, 15380, 12750, 11200, 9840, 8650, 7920, 7100, 6540, 5980, 5420, 4870, 4350, 3920, 3480, 3100, 2750, 2380, 2100, 1850];
const baseInconsistenciasReincOcorrencias = [12, 11, 10, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 5, 4, 4, 3, 3, 3, 2];
const baseInconsistenciasBacklogTotais = [18420, 15380, 12750, 11200, 9840, 8650, 7920, 7100, 6540, 5980, 5420, 4870, 4350, 3920, 3480, 3100, 2750, 2380, 2010, 1640];
const baseSolicitacoesBacklogTotais = [4820, 4350, 3680, 3210, 2890, 2540, 2180, 1950, 1720, 1530, 1380, 1210, 1050, 920, 810, 720, 640, 550, 480, 390];
const baseSolicitacoesJustTotais = [1820, 1650, 1480, 1310, 1190, 1040, 980, 850, 720, 630, 580, 510, 450, 390, 340, 290, 250, 210, 180, 150];
const baseSolicitacoesReincOcorrencias = [14, 12, 11, 10, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 3, 2];
const baseQualidadePcts = [100.0, 100.0, 100.0, 98.5, 97.2, 96.8, 95.3, 94.7, 93.1, 92.4, 91.8, 90.5, 89.2, 88.6, 87.1, 86.4, 85.7, 84.3, 83.9, 82.5];
const baseMeses = ["Mar/2026", "Mar/2026", "Fev/2026", "Mar/2026", "Jan/2026", "Mar/2026", "Fev/2026", "Mar/2026", "Fev/2026", "Mar/2026", "Jan/2026", "Mar/2026", "Fev/2026", "Jan/2026", "Mar/2026", "Fev/2026", "Mar/2026", "Fev/2026", "Jan/2026", "Fev/2026"];

const motivoAjustesBase = [
  { motivo: "Esquecimento", pct: 42 },
  { motivo: "Falha Sistema", pct: 28 },
  { motivo: "Troca Turno", pct: 15 },
  { motivo: "Hora Extra", pct: 10 },
  { motivo: "Outros", pct: 5 },
];

const variarTiposPorMes = (base: { tipo: string; pct: number }[], mesIdx: number) => {
  const seed = mesIdx + 1;
  return base.map((item, i) => {
    const variation = ((seed * (i + 2) * 5) % 11) - 5;
    const newPct = Math.max(0.5, +(item.pct + variation * (item.pct / 25)).toFixed(1));
    return { ...item, pct: newPct };
  });
};

const variarMotivoAjustesPorMes = (base: { motivo: string; pct: number }[], mesIdx: number) => {
  const seed = mesIdx + 1;
  return base.map((item, i) => {
    const variation = ((seed * (i + 4) * 3) % 13) - 6;
    const newPct = Math.max(0.5, +(item.pct + variation * (item.pct / 28)).toFixed(1));
    return { ...item, pct: newPct };
  });
};

const colaboradoresSemTemplateList = [
  { colaborador: "João Silva", template: "Facial", inconsistencias: 300 },
  { colaborador: "Maria Santos", template: "Facial", inconsistencias: 253 },
  { colaborador: "Carlos Oliveira", template: "Digital", inconsistencias: 228 },
  { colaborador: "Ana Souza", template: "Facial", inconsistencias: 195 },
  { colaborador: "Pedro Lima", template: "Digital", inconsistencias: 182 },
  { colaborador: "Fernanda Costa", template: "Facial", inconsistencias: 167 },
  { colaborador: "Ricardo Alves", template: "Digital", inconsistencias: 154 },
  { colaborador: "Juliana Pereira", template: "Facial", inconsistencias: 143 },
  { colaborador: "Bruno Ferreira", template: "Digital", inconsistencias: 131 },
  { colaborador: "Camila Rodrigues", template: "Facial", inconsistencias: 120 },
  { colaborador: "Diego Martins", template: "Digital", inconsistencias: 108 },
  { colaborador: "Patrícia Nascimento", template: "Facial", inconsistencias: 97 },
  { colaborador: "Rafael Barbosa", template: "Facial", inconsistencias: 89 },
  { colaborador: "Luciana Gomes", template: "Facial", inconsistencias: 78 },
  { colaborador: "Thiago Ribeiro", template: "Digital", inconsistencias: 65 },
  { colaborador: "Amanda Carvalho", template: "Facial", inconsistencias: 54 },
  { colaborador: "Marcos Teixeira", template: "Digital", inconsistencias: 42 },
  { colaborador: "Beatriz Moura", template: "Digital", inconsistencias: 38 },
  { colaborador: "Felipe Araújo", template: "Facial", inconsistencias: 27 },
  { colaborador: "Daniela Pinto", template: "Digital", inconsistencias: 19 },
];

// ── Constants ──────────────────────────────────────────────

const tabs = [
  "Registro de Ponto", "Operacional", "Coletor",
  "Engajamento e Retenção", "Ausências e Coberturas",
];

const subNavItems = ["Backlog", "Análise de Padrões", "Solicitações", "Inconsistências"];
const filterOptions = ["Empresa", "Unidade de Negócio", "Cliente", "Posto", "Tipo de Serviço", "Área", "Filtro de Mesa", "Colaborador"];

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
    <ImprovementProvider>
    <ImprovementLayer screenId={activeSubNav}>
    <div className="flex-1 overflow-auto bg-gray-50 min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <header className="border-b border-gray-200 px-6 py-3 bg-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline" onClick={() => navigate("/nexti-analytics")}>Home</span>
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
        <div className="grid grid-cols-3 gap-4">
          <OperacionalKPI title="Inconsistências em Aberto" value="282.873" yoy="-" />
          <OperacionalKPI title="Solicitações em Aberto" value="7.261" yoy="0,0%" trend="down" />
          <OperacionalKPI title="Colaboradores sem Template" value="1.842" yoy="12,3%" trend="up" />
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
        {activeSubNav === "Análise de Padrões" && <AnalisePadroesContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
        {activeSubNav === "Solicitações" && <SolicitacoesContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
        {activeSubNav === "Inconsistências" && <InconsistenciasContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
        
      </div>
    </div>
    </ImprovementLayer>
    </ImprovementProvider>
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
            className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${
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
    <div className="flex-1 space-y-4">
      {/* Row 1: Aging + Colaboradores sem Template */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-800 mb-1">Aging de Justificativas em Aberto</h3>
          <p className="text-xs text-gray-400 mb-4">Por faixa de dias pendentes</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingInconsistencias} barGap={4} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="faixa" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                  formatter={(v: number) => formatNumber(v)}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="inconsistencias" fill="#FF5722" radius={[4, 4, 0, 0]} name="Inconsistências">
                  <LabelList dataKey="inconsistencias" position="top" formatter={(v: number) => formatNumber(v)} style={{ fontSize: 9, fill: "#374151", fontWeight: 600 }} />
                </Bar>
                <Bar dataKey="solicitacoes" fill="#FDB813" radius={[4, 4, 0, 0]} name="Solicitações">
                  <LabelList dataKey="solicitacoes" position="top" formatter={(v: number) => formatNumber(v)} style={{ fontSize: 9, fill: "#374151", fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-800 mb-0.5">Colaboradores sem Template</h3>
          <p className="text-xs text-gray-400 mb-3">Lista de colaboradores sem template cadastrado</p>
          <div className="max-h-[252px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">Colaborador</th>
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">Template</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Inconsistências</th>
                </tr>
              </thead>
              <tbody>
                {colaboradoresSemTemplateList.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="text-xs text-gray-700 py-2">{item.colaborador}</td>
                    <td className="text-xs text-gray-500 py-2">{item.template}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{formatNumber(item.inconsistencias)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Row 2: Top 20 Entidades */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold text-sm text-gray-800">Top 20 com Mais Inconsistências em Aberto</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">por {activeFilter}</p>
          <div className="max-h-[252px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-medium text-left pb-2 w-6">#</th>
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">{activeFilter}</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {buildTop20Totais(activeFilter, baseInconsistenciasBacklogTotais).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                    <td className="text-xs text-gray-500 py-2">{idx + 1}</td>
                    <td className="text-xs text-gray-700 py-2">{item.entidade}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{formatNumber(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold text-sm text-gray-800">Top 20 com Mais Solicitações em Aberto</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">por {activeFilter}</p>
          <div className="max-h-[252px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-medium text-left pb-2 w-6">#</th>
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">{activeFilter}</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {buildTop20Totais(activeFilter, baseSolicitacoesBacklogTotais).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                    <td className="text-xs text-gray-500 py-2">{idx + 1}</td>
                    <td className="text-xs text-gray-700 py-2">{item.entidade}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{formatNumber(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
  </div>
);

// ── Análise de Padrões Content ─────────────────────────────

const AnalisePadroesContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => (
  <div className="flex gap-4">
    <div className="flex-1 space-y-4">
      {/* Row 1: Evolução do Backlog */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-sm text-gray-800 mb-1">Evolução do Backlog</h3>
        <p className="text-xs text-gray-400 mb-4">Inconsistências e Solicitações por Dia</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evolucaoBacklogDiario} barGap={2} barSize={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="dia" tick={{ fontSize: 9 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                formatter={(v: number) => formatNumber(v)}
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="inconsistencias" fill="#FF5722" radius={[2, 2, 0, 0]} name="Inconsistências" />
              <Bar dataKey="solicitacoes" fill="#FDB813" radius={[2, 2, 0, 0]} name="Solicitações" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Heatmaps */}
      <div className="grid grid-cols-2 gap-4">
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
                    <th key={i} className="text-[10px] text-gray-400 font-normal pb-1 px-0.5">{String(i).padStart(2, "0")}h</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.dia}>
                    <td className="text-[11px] text-gray-500 pr-2 py-0.5">{row.dia}</td>
                    {row.hours.map((v, i) => (
                      <td key={i} className="px-0.5 py-0.5">
                        <div className="w-full h-6 rounded-sm" style={{ backgroundColor: getHeatColor(v), minWidth: 28 }} title={`${row.dia} ${String(i).padStart(2, "0")}h: ${v}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-1 mt-3 justify-center">
              <span className="text-[10px] text-gray-400">Menos</span>
              {[0, 2, 4, 6, 8, 10].map((v) => (
                <div key={v} className="w-5 h-3 rounded-sm" style={{ backgroundColor: getHeatColor(v) }} />
              ))}
              <span className="text-[10px] text-gray-400">Mais</span>
            </div>
          </div>
        </div>

        {/* Heatmap – Total de Solicitações por Dia e Horário */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-800 mb-1">Total de Solicitações</h3>
          <p className="text-xs text-gray-400 mb-4">por Dia e Horário</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-[10px] text-gray-400 font-normal text-left pr-2 pb-1">Dia</th>
                  {Array.from({ length: 13 }, (_, i) => (
                    <th key={i} className="text-[10px] text-gray-400 font-normal pb-1 px-0.5">{String(i).padStart(2, "0")}h</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapSolicitacoes.map((row) => (
                  <tr key={row.dia}>
                    <td className="text-[11px] text-gray-500 pr-2 py-0.5">{row.dia}</td>
                    {row.hours.map((v, i) => (
                      <td key={i} className="px-0.5 py-0.5">
                        <div className="w-full h-6 rounded-sm" style={{ backgroundColor: getHeatColor(v), minWidth: 28 }} title={`${row.dia} ${String(i).padStart(2, "0")}h: ${v}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-1 mt-3 justify-center">
              <span className="text-[10px] text-gray-400">Menos</span>
              {[0, 2, 4, 6, 8, 10].map((v) => (
                <div key={v} className="w-5 h-3 rounded-sm" style={{ backgroundColor: getHeatColor(v) }} />
              ))}
              <span className="text-[10px] text-gray-400">Mais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Top 20 Pior Qualidade + Top 10 Inconsistências por Escala */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold text-sm text-gray-800">Top 20 Pior Qualidade de Marcação</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">por {activeFilter}</p>
          <div className="max-h-[252px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-medium text-left pb-2 w-6">#</th>
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">{activeFilter}</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">%</th>
                </tr>
              </thead>
              <tbody>
                {buildTop20Qualidade(activeFilter, baseQualidadePcts).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="text-xs text-gray-500 py-2">{idx + 1}</td>
                    <td className="text-xs text-gray-700 py-2 pr-4">{item.entidade}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{item.pct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-800 mb-0.5">Top 20 Inconsistências e Solicitações por Escala</h3>
          <p className="text-xs text-gray-400 mb-3">por Escala</p>
          <div className="max-h-[252px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-medium text-left pb-2 w-6">#</th>
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">Escala</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Inconsistências</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Solicitações</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {top20EscalaInconsistenciasSolicitacoes.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="text-xs text-gray-500 py-2">{idx + 1}</td>
                    <td className="text-xs text-gray-700 py-2">{item.escala}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{formatNumber(item.inconsistencias)}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{formatNumber(item.solicitacoes)}</td>
                    <td className="text-xs font-semibold text-[#FF5722] text-right py-2">{formatNumber(item.inconsistencias + item.solicitacoes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
  </div>
);

// ── Mock data – Solicitações ───────────────────────────────

const motivosJustificativaBase = [
  { motivo: "Esquecimento de Marcação", pct: 44.7 },
  { motivo: "Falha no Equipamento", pct: 12.5 },
  { motivo: "Troca de Turno", pct: 9.5 },
  { motivo: "Hora Extra Não Prevista", pct: 9.1 },
  { motivo: "Atraso Justificado", pct: 7.0 },
  { motivo: "Saída Antecipada", pct: 5.0 },
  { motivo: "Erro de Digitação", pct: 3.8 },
  { motivo: "Falta de Energia", pct: 3.6 },
  { motivo: "Outros", pct: 2.5 },
];

const motivosTratativaBase = [
  { motivo: "Ajuste Manual pelo Gestor", pct: 38.2 },
  { motivo: "Aprovação Automática", pct: 22.5 },
  { motivo: "Análise de Documentação", pct: 14.8 },
  { motivo: "Validação com Supervisor", pct: 10.3 },
  { motivo: "Cancelamento por Duplicidade", pct: 6.1 },
  { motivo: "Rejeição por Prazo", pct: 4.5 },
  { motivo: "Outros", pct: 3.6 },
];

// Seed-based variation per month index
const variarPorMes = (base: { motivo: string; pct: number }[], mesIdx: number) => {
  const seed = mesIdx + 1;
  return base.map((item, i) => {
    const variation = ((seed * (i + 3) * 7) % 15) - 7; // -7 to +7
    const newPct = Math.max(0.5, +(item.pct + variation * (item.pct / 30)).toFixed(1));
    return { ...item, pct: newPct };
  });
};

const mesesLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const evolucaoSolicitacoesMensal = [
  { mes: "Jan", emAberto: 520, ajustadas: 5920, canceladas: 1330 },
  { mes: "Fev", emAberto: 480, ajustadas: 6100, canceladas: 1280 },
  { mes: "Mar", emAberto: 610, ajustadas: 5750, canceladas: 1410 },
  { mes: "Abr", emAberto: 390, ajustadas: 6340, canceladas: 1190 },
  { mes: "Mai", emAberto: 550, ajustadas: 5880, canceladas: 1350 },
  { mes: "Jun", emAberto: 470, ajustadas: 6200, canceladas: 1260 },
  { mes: "Jul", emAberto: 430, ajustadas: 6450, canceladas: 1150 },
  { mes: "Ago", emAberto: 680, ajustadas: 5600, canceladas: 1480 },
  { mes: "Set", emAberto: 510, ajustadas: 6050, canceladas: 1300 },
  { mes: "Out", emAberto: 440, ajustadas: 6280, canceladas: 1220 },
  { mes: "Nov", emAberto: 560, ajustadas: 5950, canceladas: 1370 },
  { mes: "Dez", emAberto: 490, ajustadas: 6150, canceladas: 1290 },
];

// ── Solicitações Content ───────────────────────────────────

const SolicitacoesContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => {
  const [selectedMes, setSelectedMes] = useState<string | null>(null);

  const mesIdx = selectedMes ? mesesLabels.indexOf(selectedMes) : -1;
  const motivosJustificativa = mesIdx >= 0 ? variarPorMes(motivosJustificativaBase, mesIdx) : motivosJustificativaBase;
  const motivosTratativa = mesIdx >= 0 ? variarPorMes(motivosTratativaBase, mesIdx) : motivosTratativaBase;
  const maxJustificativa = Math.max(...motivosJustificativa.map(m => m.pct));
  const maxTratativa = Math.max(...motivosTratativa.map(m => m.pct));

  const handleBarClick = (data: any) => {
    if (data?.activeLabel) {
      setSelectedMes(prev => prev === data.activeLabel ? null : data.activeLabel);
    }
  };

  return (
  <div className="flex gap-4">
    <div className="flex-1 space-y-4">
      {/* Row 1: Evolução Mensal por Status - Largura total */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-semibold text-sm text-gray-800">Evolução das Solicitações por Status</h3>
          {selectedMes && (
            <button
              onClick={() => setSelectedMes(null)}
              className="text-xs text-[#FF5722] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Limpar filtro ({selectedMes})
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-4">Volume mensal por status · Clique em um mês para filtrar</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evolucaoSolicitacoesMensal} barSize={28} onClick={handleBarClick} style={{ cursor: "pointer" }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                formatter={(v: number, name: string) => [formatNumber(v), name]}
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="ajustadas" stackId="a" fill="#FDB813" name="Ajustadas" radius={[0, 0, 0, 0]}
                opacity={selectedMes ? 0.4 : 1}
              />
              <Bar dataKey="canceladas" stackId="a" fill="#9CA3AF" name="Canceladas" radius={[0, 0, 0, 0]}
                opacity={selectedMes ? 0.4 : 1}
              />
              <Bar dataKey="emAberto" stackId="a" fill="#FF5722" name="Em Aberto" radius={[4, 4, 0, 0]}
                opacity={selectedMes ? 0.4 : 1}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Motivos + Tratativa */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold text-sm text-gray-800">% Motivos de Abertura de Justificativa</h3>
            {selectedMes && <span className="text-[10px] bg-orange-50 text-[#FF5722] border border-[#FF5722] rounded-full px-2 py-0.5 font-medium">{selectedMes}</span>}
          </div>
          <p className="text-xs text-gray-400 mb-4">Motivo de abertura das solicitações</p>
          <div className="space-y-2.5">
            {motivosJustificativa.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-40 shrink-0 truncate" title={item.motivo}>{item.motivo}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full rounded transition-all duration-300" style={{ width: `${(item.pct / maxJustificativa) * 100}%`, backgroundColor: "#FF5722" }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-12 text-right">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold text-sm text-gray-800">% Motivo de Tratativa</h3>
            {selectedMes && <span className="text-[10px] bg-orange-50 text-[#FF5722] border border-[#FF5722] rounded-full px-2 py-0.5 font-medium">{selectedMes}</span>}
          </div>
          <p className="text-xs text-gray-400 mb-4">Tratativa das solicitações de justificativa</p>
          <div className="space-y-2.5">
            {motivosTratativa.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-40 shrink-0 truncate" title={item.motivo}>{item.motivo}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full rounded transition-all duration-300" style={{ width: `${(item.pct / maxTratativa) * 100}%`, backgroundColor: "#FDB813" }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-12 text-right">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Top 20 + Reincidentes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-800 mb-0.5">Top 20 com mais Solicitações</h3>
          <p className="text-xs text-gray-400 mb-3">Solicitações de justificativa de ponto</p>
          <div className="max-h-[320px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-medium text-left pb-2 w-6">#</th>
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">{activeFilter}</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {buildTop20Totais(activeFilter, baseSolicitacoesJustTotais).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="text-xs text-gray-500 py-2">{idx + 1}</td>
                    <td className="text-xs text-gray-700 py-2 pr-4">{item.entidade}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{formatNumber(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-800 mb-0.5">Top 20 Reincidentes</h3>
          <p className="text-xs text-gray-400 mb-3">{activeFilter} com solicitações recorrentes</p>
          <div className="max-h-[320px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-medium text-left pb-2 w-6">#</th>
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">{activeFilter}</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Ocorrências</th>
                </tr>
              </thead>
              <tbody>
                {buildTop20Reincidentes(activeFilter, baseSolicitacoesReincOcorrencias, baseMeses).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="text-xs text-gray-500 py-2">{idx + 1}</td>
                    <td className="text-xs text-gray-700 py-2 pr-4">{item.entidade}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{item.ocorrencias}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
  </div>
  );
};

// ── Inconsistências Content ────────────────────────────────

const InconsistenciasContent = ({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) => {
  const [selectedMes, setSelectedMes] = useState<string | null>(null);

  const mesIdx = selectedMes ? mesesLabels.indexOf(selectedMes) : -1;
  const tiposInconsistencias = mesIdx >= 0 ? variarTiposPorMes(tiposInconsistenciasBase, mesIdx) : tiposInconsistenciasBase;
  const motivoAjustes = mesIdx >= 0 ? variarMotivoAjustesPorMes(motivoAjustesBase, mesIdx) : motivoAjustesBase;
  const maxTipos = Math.max(...tiposInconsistencias.map(t => t.pct));
  const maxAjustes = Math.max(...motivoAjustes.map(m => m.pct));

  const handleBarClick = (data: any) => {
    if (data?.activeLabel) {
      setSelectedMes(prev => prev === data.activeLabel ? null : data.activeLabel);
    }
  };

  return (
  <div className="flex gap-4">
    <div className="flex-1 space-y-4">
      {/* Row 1: Evolução Mensal por Status - Largura total */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-semibold text-sm text-gray-800">Evolução das Inconsistências por Status</h3>
          {selectedMes && (
            <button
              onClick={() => setSelectedMes(null)}
              className="text-xs text-[#FF5722] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Limpar filtro ({selectedMes})
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-4">Volume mensal por status · Clique em um mês para filtrar</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evolucaoInconsistenciasMensal} barSize={28} onClick={handleBarClick} style={{ cursor: "pointer" }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                formatter={(v: number, name: string) => [formatNumber(v), name]}
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="tratadas" stackId="a" fill="#FDB813" name="Tratadas" radius={[0, 0, 0, 0]} opacity={selectedMes ? 0.4 : 1} />
              <Bar dataKey="canceladas" stackId="a" fill="#9CA3AF" name="Canceladas" radius={[0, 0, 0, 0]} opacity={selectedMes ? 0.4 : 1} />
              <Bar dataKey="emAberto" stackId="a" fill="#FF5722" name="Em Aberto" radius={[4, 4, 0, 0]} opacity={selectedMes ? 0.4 : 1} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Tipos + Motivo de Ajustes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold text-sm text-gray-800">% Tipos de Inconsistências</h3>
            {selectedMes && <span className="text-[10px] bg-orange-50 text-[#FF5722] border border-[#FF5722] rounded-full px-2 py-0.5 font-medium">{selectedMes}</span>}
          </div>
          <p className="text-xs text-gray-400 mb-3">Distribuição por tipo</p>
          <div className="space-y-3">
            {tiposInconsistencias.map((item) => (
              <div key={item.tipo} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-40 shrink-0 text-right">{item.tipo}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full rounded transition-all duration-300" style={{ width: `${(item.pct / maxTipos) * 100}%`, backgroundColor: "#FF5722" }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-10">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold text-sm text-gray-800">% Motivo de Ajustes de Inconsistências</h3>
            {selectedMes && <span className="text-[10px] bg-orange-50 text-[#FF5722] border border-[#FF5722] rounded-full px-2 py-0.5 font-medium">{selectedMes}</span>}
          </div>
          <p className="text-xs text-gray-400 mb-3">Motivo dos ajustes</p>
          <div className="space-y-3">
            {motivoAjustes.map((item) => (
              <div key={item.motivo} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-28 shrink-0 text-right">{item.motivo}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full rounded transition-all duration-300" style={{ width: `${(item.pct / maxAjustes) * 100}%`, background: `linear-gradient(90deg, #FF5722, #FDB813)` }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-10">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Top 20 Entidades + Top 20 Reincidentes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-800 mb-0.5">Top 20 com mais Inconsistências</h3>
          <p className="text-xs text-gray-400 mb-3">por {activeFilter}</p>
          <div className="max-h-[320px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-medium text-left pb-2 w-6">#</th>
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">{activeFilter}</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {buildTop20Totais(activeFilter, baseInconsistenciasTabTotais).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="text-xs text-gray-500 py-2">{idx + 1}</td>
                    <td className="text-xs text-gray-700 py-2 pr-4">{item.entidade}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{formatNumber(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-800 mb-0.5">Top 20 Reincidentes</h3>
          <p className="text-xs text-gray-400 mb-3">{activeFilter} com inconsistências recorrentes</p>
          <div className="max-h-[320px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-medium text-left pb-2 w-6">#</th>
                  <th className="text-xs text-gray-400 font-medium text-left pb-2">{activeFilter}</th>
                  <th className="text-xs text-gray-400 font-medium text-right pb-2">Ocorrências</th>
                </tr>
              </thead>
              <tbody>
                {buildTop20Reincidentes(activeFilter, baseInconsistenciasReincOcorrencias, baseMeses).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="text-xs text-gray-500 py-2">{idx + 1}</td>
                    <td className="text-xs text-gray-700 py-2 pr-4">{item.entidade}</td>
                    <td className="text-xs font-semibold text-gray-800 text-right py-2">{item.ocorrencias}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <SidePanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
  </div>
  );
};


const top20EscalaInconsistenciasSolicitacoes = [
  { escala: "07:00-19:00 12x36 (MO)", inconsistencias: 157, solicitacoes: 83 },
  { escala: "19:00-07:00 12x36 (MO)", inconsistencias: 139, solicitacoes: 72 },
  { escala: "20:00-22:00/23:12-06:00 RFL", inconsistencias: 128, solicitacoes: 65 },
  { escala: "19:00-07:00 12X36", inconsistencias: 113, solicitacoes: 58 },
  { escala: "06:00-18:00 12x36", inconsistencias: 109, solicitacoes: 54 },
  { escala: "07:00-12:00/13:12-17:00 RFL", inconsistencias: 95, solicitacoes: 48 },
  { escala: "07:00-19:00 12X36", inconsistencias: 88, solicitacoes: 42 },
  { escala: "08:00-18:00 5x2", inconsistencias: 82, solicitacoes: 39 },
  { escala: "22:00-06:00 5x1", inconsistencias: 76, solicitacoes: 35 },
  { escala: "06:00-14:00 6x1", inconsistencias: 71, solicitacoes: 31 },
  { escala: "14:00-22:00 6x1", inconsistencias: 65, solicitacoes: 28 },
  { escala: "07:00-15:00 5x2", inconsistencias: 59, solicitacoes: 25 },
  { escala: "08:00-14:00/15:00-17:00 RFL", inconsistencias: 54, solicitacoes: 22 },
  { escala: "18:00-06:00 12x36", inconsistencias: 48, solicitacoes: 19 },
  { escala: "06:00-12:00 6x1", inconsistencias: 43, solicitacoes: 17 },
  { escala: "12:00-18:00 6x1", inconsistencias: 39, solicitacoes: 15 },
  { escala: "07:00-16:00 5x2", inconsistencias: 35, solicitacoes: 13 },
  { escala: "09:00-18:00 5x2", inconsistencias: 31, solicitacoes: 11 },
  { escala: "10:00-19:00 5x2", inconsistencias: 27, solicitacoes: 9 },
  { escala: "06:00-15:00 6x1", inconsistencias: 24, solicitacoes: 8 },
];

export default OperacionalPrime;
