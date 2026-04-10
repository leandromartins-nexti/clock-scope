import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Eraser } from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { resumo } from "@/lib/analytics-mock-data";
import { QualidadeTab, AbsenteismoTab, MovimentacoesTab } from "./AnalyticsDisciplinaOperacional";
import AnalyticsCoberturasContinuidade from "./AnalyticsCoberturasContinuidade";
import AnalyticsViolacoesTrabalhistas from "./AnalyticsViolacoesTrabalhistas";
import AnalyticsBancoHoras from "./AnalyticsBancoHoras";
import AnalyticsOperacoesEstruturas from "./AnalyticsOperacoesEstruturas";

const tabs = [
  { id: "qualidade", label: "Qualidade do Ponto" },
  { id: "absenteismo", label: "Absenteísmo" },
  { id: "movimentacoes", label: "Movimentações" },
  { id: "coberturas", label: "Coberturas" },
  { id: "violacoes", label: "Violações Trabalhistas" },
  { id: "bancoHoras", label: "Banco de Horas" },
  { id: "operacoes", label: "Operações e Estruturas" },
];

export default function AnalyticsOperacional() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("qualidade");

  const renderTab = () => {
    switch (activeTab) {
      case "qualidade": return <QualidadeTab />;
      case "absenteismo": return <AbsenteismoTab />;
      case "movimentacoes": return <MovimentacoesTab />;
      case "coberturas": return <AnalyticsCoberturasContinuidade embedded />;
      case "violacoes": return <AnalyticsViolacoesTrabalhistas embedded />;
      case "bancoHoras": return <AnalyticsBancoHoras embedded />;
      case "operacoes": return <AnalyticsOperacoesEstruturas embedded />;
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
