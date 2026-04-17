import { useState } from "react";
import { Database, Gauge, ChevronRight, ChevronDown, Table2, Eye, Info, Users, UserPlus } from "lucide-react";
import ScoreQualidadeConfig from "./ScoreQualidadeConfig";
import ScoreNextiConfig from "./ScoreNextiConfig";
import UserManagementTab from "@/components/analytics/UserManagementTab";
import ScoreAbsenteismoConfig from "./ScoreAbsenteismoConfig";
import ChartDataModal from "@/components/analytics/ChartDataModal";
import CompositeChartDataModal from "@/components/analytics/CompositeChartDataModal";
import type { ChartDataSource } from "@/components/analytics/ChartDataModal";
import ClientManagement from "@/components/analytics/ClientManagement";
import { useCustomer } from "@/contexts/CustomerContext";
import { useAuth } from "@/contexts/AuthContext";

// Import chart sources
import {
  evolucaoQualidadeHeadcountSource,
  evolucaoQualidadeHeadcountColumns,
} from "@/data/chart-sources/evolucao-qualidade-headcount";
import {
  evolucaoTempoTratativaSource,
  evolucaoTempoTratativaColumns,
} from "@/data/chart-sources/evolucao-tempo-tratativa";
import {
  sobrecargaBackofficeSource,
  sobrecargaBackofficeColumns,
} from "@/data/chart-sources/sobrecarga-backoffice";

// ── Registry types ──
interface ChartEntry {
  id: string;
  chartName: string;
  columns: { key: string; label: string; format?: (v: any) => string }[];
  source: ChartDataSource;
  derived?: boolean;
  derivedSources?: { label: string; source: ChartDataSource; columns: { key: string; label: string; format?: (v: any) => string }[] }[];
}

interface TabEntry {
  tabName: string;
  charts: ChartEntry[];
}

interface MenuEntry {
  menuName: string;
  tabs: TabEntry[];
}

// ── Data Registry ──
const dataRegistry: MenuEntry[] = [
  {
    menuName: "Operacional",
    tabs: [
      {
        tabName: "Ponto",
        charts: [
          {
            id: "evo-qualidade-headcount",
            chartName: "Evolução da Qualidade e Headcount",
            columns: evolucaoQualidadeHeadcountColumns,
            source: evolucaoQualidadeHeadcountSource,
          },
          {
            id: "evo-tempo-tratativa",
            chartName: "Evolução do Tempo de Tratativa",
            columns: evolucaoTempoTratativaColumns,
            source: evolucaoTempoTratativaSource,
          },
          {
            id: "mapa-operacoes",
            chartName: "Mapa de Operações",
            columns: evolucaoQualidadeHeadcountColumns,
            source: evolucaoQualidadeHeadcountSource,
            derived: true,
            derivedSources: [
              { label: "Fonte 1: Evolução da Qualidade e Headcount", source: evolucaoQualidadeHeadcountSource, columns: evolucaoQualidadeHeadcountColumns },
              { label: "Fonte 2: Evolução do Tempo de Tratativa", source: evolucaoTempoTratativaSource, columns: evolucaoTempoTratativaColumns },
              { label: "Fonte 3: Sobrecarga do Back-office", source: sobrecargaBackofficeSource, columns: sobrecargaBackofficeColumns },
            ],
          },
          {
            id: "sobrecarga-backoffice",
            chartName: "Sobrecarga do Back-office",
            columns: sobrecargaBackofficeColumns,
            source: sobrecargaBackofficeSource,
          },
        ],
      },
    ],
  },
];

// ── Score sidebar items ──
const scoreMenuItems = [
  { id: "nexti", label: "Score Nexti", icon: "⭐" },
  { id: "qualidade", label: "Ponto", icon: "🎯" },
  { id: "absenteismo", label: "Absenteísmo", icon: "📉" },
];

// ── Chart row in Base de Dados ──
function ChartRow({ chart }: { chart: ChartEntry }) {
  const [modalOpen, setModalOpen] = useState(false);
  const totalRecords = chart.source.empresa.data.length + chart.source.unidade.data.length + chart.source.area.data.length;

  return (
    <>
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer" onClick={() => setModalOpen(true)}>
        <Table2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-foreground truncate">{chart.chartName}</p>
            {chart.derived && (
              <span className="shrink-0 text-[9px] font-medium bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded">derivado</span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground truncate">
            {chart.derived ? `2 fontes · ${totalRecords} registros` : `${totalRecords} registros · 3 agrupamentos (Empresa, Unidade, Área)`}
          </p>
        </div>
        <button className="h-7 px-2.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" /> Ver dados
        </button>
      </div>
      {chart.derived && chart.derivedSources ? (
        <CompositeChartDataModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={chart.chartName}
          subtitle="Gráfico derivado · consolida dados de 2 fontes"
          sections={chart.derivedSources}
          activeGroupBy="empresa"
        />
      ) : (
        <ChartDataModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={chart.chartName}
          columns={chart.columns}
          source={chart.source}
          activeGroupBy="empresa"
        />
      )}
    </>
  );
}

// ── Tab section (collapsible) ──
function TabSection({ tab }: { tab: TabEntry }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/20 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-6 py-2.5 text-left hover:bg-muted/20 transition-colors"
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        <span className="text-sm font-medium text-foreground/90">{tab.tabName}</span>
        <span className="ml-auto text-[10px] text-muted-foreground">{tab.charts.length} gráficos</span>
      </button>
      {open && (
        <div className="px-6 pb-3 space-y-1.5">
          {tab.charts.map(chart => (
            <ChartRow key={chart.id} chart={chart} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Menu section (collapsible) ──
function MenuSection({ menu }: { menu: MenuEntry }) {
  const [open, setOpen] = useState(true);
  const totalCharts = menu.tabs.reduce((acc, t) => acc + t.charts.length, 0);

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        <span className="font-semibold text-sm text-foreground">{menu.menuName}</span>
        <span className="ml-auto text-[11px] text-muted-foreground">{totalCharts} gráficos</span>
      </button>
      {open && (
        <div className="border-t border-border/40">
          {menu.tabs.map(tab => (
            <TabSection key={tab.tabName} tab={tab} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──
export default function AnalyticsConfiguracao() {
  const { canSwitchClient } = useCustomer();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("base-dados");
  const [activeScore, setActiveScore] = useState("nexti");

  const tabs = [
    { id: "base-dados", label: "Base de Dados", icon: Database },
    { id: "scores", label: "Scores", icon: Gauge },
    ...(canSwitchClient ? [{ id: "clientes", label: "Clientes", icon: Users }] : []),
    ...(user?.role === "admin" ? [{ id: "usuarios", label: "Usuários", icon: UserPlus }] : []),
  ];

  const totalCharts = dataRegistry.reduce((acc, m) => acc + m.tabs.reduce((a, t) => a + t.charts.length, 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* Tab bar */}
      <div className="bg-white border-b border-border px-3 sm:px-6">
        <div className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? "border-[#FF5722] text-[#FF5722]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex min-h-0 w-full">

        {activeTab === "base-dados" && (
          <div className="flex-1 px-3 sm:px-6 py-4 sm:py-5 min-w-0">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">Base de Dados</h2>
                <p className="text-xs text-muted-foreground">
                  Todos os datasets organizados por Menu → Aba → Gráfico · Cliente: <span className="font-semibold text-foreground">Vig Eyes</span>
                </p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border self-start sm:self-auto">
                {totalCharts} gráficos mapeados
              </div>
            </div>
            <div className="space-y-3">
              {dataRegistry.map(menu => (
                <MenuSection key={menu.menuName} menu={menu} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "scores" && (
          <div className="flex flex-col md:flex-row flex-1 min-h-0 w-full">
            {/* Left sidebar (desktop) / Top scroll (mobile) */}
            <div className="md:w-56 bg-white border-b md:border-b-0 md:border-r border-border md:py-4 shrink-0">
              <p className="hidden md:block px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scores Configuráveis</p>
              <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar">
                {scoreMenuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveScore(item.id)}
                    className={`flex items-center gap-2 md:gap-2.5 px-4 py-2.5 text-xs md:text-sm text-left transition-colors whitespace-nowrap shrink-0 md:w-full ${
                      activeScore === item.id
                        ? "bg-orange-50 text-[#FF5722] border-b-2 md:border-b-0 md:border-r-2 border-[#FF5722] font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 px-3 sm:px-6 py-4 sm:py-5 overflow-auto min-w-0">
              {activeScore === "nexti" && (
                <>
                  <div className="mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">Score Nexti</h2>
                    <p className="text-xs text-muted-foreground">
                      Equilibre os pesos dos indicadores que compõem o score operacional consolidado
                    </p>
                  </div>
                  <ScoreNextiConfig />
                </>
              )}
              {activeScore === "qualidade" && (
                <>
                  <div className="mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">Score de Ponto</h2>
                    <p className="text-xs text-muted-foreground">
                      Configure os pesos dos 4 componentes, as notas por faixa e os limites de classificação
                    </p>
                  </div>
                  <ScoreQualidadeConfig />
                </>
              )}
              {activeScore === "absenteismo" && (
                <>
                  <div className="mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">Score de Absenteísmo</h2>
                    <p className="text-xs text-muted-foreground">
                      Configure os 3 sub-scores (Volume, Composição, Maturidade), as faixas e os limites de classificação
                    </p>
                  </div>
                  <ScoreAbsenteismoConfig />
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "clientes" && canSwitchClient && (
          <div className="flex-1 px-3 sm:px-6 py-4 sm:py-5 min-w-0 overflow-auto">
            <ClientManagement />
          </div>
        )}

        {activeTab === "usuarios" && user?.role === "admin" && (
          <div className="flex-1 px-3 sm:px-6 py-4 sm:py-5 overflow-auto min-w-0">
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-foreground">Gestão de Usuários</h2>
              <p className="text-xs text-muted-foreground">Cadastre novos usuários e gerencie acessos</p>
            </div>
            <UserManagementTab />
          </div>
        )}
      </div>
    </div>
  );
}
