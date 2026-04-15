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

const tabs = [
  { id: "qualidade", label: "Qualidade do Ponto" },
  { id: "absenteismo", label: "Absenteísmo" },
  { id: "turnover", label: "Turnover" },
  { id: "movimentacoes", label: "Movimentações" },
  { id: "coberturas", label: "Coberturas" },
];

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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-[#FF5722]" />
            <span className="font-semibold text-foreground">Filtros Aplicados:</span>
          </div>
          <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-3 py-1 text-[11px] font-medium">Período: {resumo.periodo}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setFilterOpen(true)} className="border border-border text-muted-foreground px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button className="flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
            <Eraser className="w-4 h-4" /> Limpar Filtros
          </button>
          <Separator orientation="vertical" className="h-6" />
          <InsightsCenter />
          <AnalyticsChat activeTab={activeTab} />
          {/* TODO: REMOVER EM PRODUÇÃO — Badge de cliente ativo */}
          <TestModeBadge />
        </div>
      </div>

      <div className="bg-white border-b border-border px-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#FF5722] text-[#FF5722]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {renderTab()}
      </div>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
