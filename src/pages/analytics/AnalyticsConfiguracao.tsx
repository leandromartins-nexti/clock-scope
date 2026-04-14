import { useState } from "react";
import { Database, Gauge, ChevronRight, ChevronDown, Table2, Eye } from "lucide-react";
import ScoreQualidadeConfig from "./ScoreQualidadeConfig";
import ScoreAbsenteismoConfig from "./ScoreAbsenteismoConfig";
import ChartDataModal from "@/components/analytics/ChartDataModal";
import type { ChartDataSource } from "@/components/analytics/ChartDataModal";

// Import chart sources
import {
  evolucaoQualidadeHeadcountSource,
  evolucaoQualidadeHeadcountColumns,
} from "@/data/chart-sources/evolucao-qualidade-headcount";

// ── Registry types ──
interface ChartEntry {
  id: string;
  chartName: string;
  columns: { key: string; label: string; format?: (v: any) => string }[];
  source: ChartDataSource;
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
        tabName: "Qualidade do Ponto",
        charts: [
          {
            id: "evo-qualidade-headcount",
            chartName: "Evolução da Qualidade e Headcount",
            columns: evolucaoQualidadeHeadcountColumns,
            source: evolucaoQualidadeHeadcountSource,
          },
        ],
      },
    ],
  },
];

// ── Score sidebar items ──
const scoreMenuItems = [
  { id: "qualidade", label: "Qualidade do Ponto", icon: "🎯" },
  { id: "absenteismo", label: "Absenteísmo + Turnover", icon: "📉" },
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
          <p className="text-xs font-medium text-foreground truncate">{chart.chartName}</p>
          <p className="text-[10px] text-muted-foreground truncate">
            {totalRecords} registros · 3 agrupamentos (Empresa, Unidade, Área)
          </p>
        </div>
        <button className="h-7 px-2.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" /> Ver dados
        </button>
      </div>
      <ChartDataModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={chart.chartName}
        columns={chart.columns}
        source={chart.source}
        activeGroupBy="empresa"
      />
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
const tabs = [
  { id: "base-dados", label: "Base de Dados", icon: Database },
  { id: "scores", label: "Scores", icon: Gauge },
];

export default function AnalyticsConfiguracao() {
  const [activeTab, setActiveTab] = useState("base-dados");
  const [activeScore, setActiveScore] = useState("qualidade");

  const totalCharts = dataRegistry.reduce((acc, m) => acc + m.tabs.reduce((a, t) => a + t.charts.length, 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Tab bar */}
      <div className="bg-white border-b border-border px-6">
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
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
      <div className="flex-1 flex min-h-0">
        {activeTab === "base-dados" && (
          <div className="flex-1 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Base de Dados</h2>
                <p className="text-xs text-muted-foreground">
                  Todos os datasets organizados por Menu → Aba → Gráfico · Cliente: <span className="font-semibold text-foreground">Vig Eyes</span>
                </p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
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
          <div className="flex flex-1 min-h-0">
            {/* Left sidebar */}
            <div className="w-56 bg-white border-r border-border py-4 shrink-0">
              <p className="px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scores Configuráveis</p>
              {scoreMenuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveScore(item.id)}
                  className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left transition-colors ${
                    activeScore === item.id
                      ? "bg-orange-50 text-[#FF5722] border-r-2 border-[#FF5722] font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right content */}
            <div className="flex-1 px-6 py-5 overflow-auto">
              {activeScore === "qualidade" && (
                <>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-foreground">Score de Qualidade do Ponto</h2>
                    <p className="text-xs text-muted-foreground">
                      Configure os pesos dos componentes e as notas por faixa de tempo de tratativa
                    </p>
                  </div>
                  <ScoreQualidadeConfig />
                </>
              )}
              {activeScore === "absenteismo" && (
                <>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-foreground">Score de Absenteísmo + Turnover</h2>
                    <p className="text-xs text-muted-foreground">
                      Configure os pesos e limites para classificar absenteísmo e turnover
                    </p>
                  </div>
                  <ScoreAbsenteismoConfig />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
