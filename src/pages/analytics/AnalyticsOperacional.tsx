import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Filter, Eraser } from "lucide-react";
import InsightsCenter from "@/components/analytics/InsightsCenter";
// TODO: REMOVER EM PRODUÇÃO — TestModeBadge é do modo de teste multi-cliente
import TestModeBadge from "@/components/analytics/TestModeBadge";
import AnalyticsChat from "@/components/analytics/AnalyticsChat";
import { Separator } from "@/components/ui/separator";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { resumo } from "@/lib/analytics-mock-data";
import { QualidadeTab, AbsenteismoTab, MovimentacoesTab } from "./AnalyticsDisciplinaOperacional";
import TurnoverTab from "./TurnoverTab";
import AnalyticsCoberturasContinuidade from "./AnalyticsCoberturasContinuidade";
import { OPERACIONAL_SUB_TABS } from "@/config/analytics-tabs";

const tabs = OPERACIONAL_SUB_TABS.map(t => ({ id: t.id, label: t.label, icon: t.icon }));

export default function AnalyticsOperacional() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("qualidade");

  // Sync tab from URL query param
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabs.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const renderTab = () => {
    switch (activeTab) {
      case "qualidade": return <QualidadeTab />;
      case "absenteismo": return <AbsenteismoTab />;
      case "turnover": return <TurnoverTab />;
      case "movimentacoes": return <MovimentacoesTab />;
      case "coberturas": return <AnalyticsCoberturasContinuidade embedded />;
      default: return <QualidadeTab />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col overflow-x-hidden">
      <div className="bg-white px-3 sm:px-6 py-3 border-b border-border flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-[#FF5722]" />
            <span className="font-semibold text-foreground hidden sm:inline">Filtros Aplicados:</span>
          </div>
          <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap">Período: {resumo.periodo}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button onClick={() => setFilterOpen(true)} className="border border-border text-muted-foreground px-2 sm:px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="hidden sm:flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
            <Eraser className="w-4 h-4" /> Limpar Filtros
          </button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <InsightsCenter />
          <AnalyticsChat activeTab={activeTab} />
          {/* TODO: REMOVER EM PRODUÇÃO — Badge de cliente ativo */}
          <TestModeBadge />
        </div>
      </div>

      <div className="bg-white border-b border-border px-2 sm:px-6 overflow-x-auto">
        <div className="flex gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`flex-1 sm:w-40 sm:flex-none py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                  isActive
                    ? "border-[#FF5722] text-[#FF5722]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="flex flex-1 min-w-0">
          {renderTab()}
        </div>
      </div>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
