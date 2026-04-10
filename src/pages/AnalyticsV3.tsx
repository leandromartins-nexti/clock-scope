import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Eraser } from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import V3ResumoExecutivoTab from "./analytics-v3/V3ResumoExecutivoTab";
import V3AlavancasEconomiaTab from "./analytics-v3/V3AlavancasEconomiaTab";
import V3OperacoesEstruturasTab from "./analytics-v3/V3OperacoesEstruturasTab";
import V3DisciplinaOperacionalTab from "./analytics-v3/V3DisciplinaOperacionalTab";
import V3CoberturasRiscoTab from "./analytics-v3/V3CoberturasRiscoTab";
import V3EvolucaoTab from "./analytics-v3/V3EvolucaoTab";
import V3PlanoAcaoTab from "./analytics-v3/V3PlanoAcaoTab";
import V3MetodologiaTab from "./analytics-v3/V3MetodologiaTab";
import V3RetornoInvestimentoTab from "./analytics-v3/V3RetornoInvestimentoTab";

const tabs = [
  { id: "resumo", label: "Resumo Executivo" },
  { id: "alavancas", label: "Alavancas de Economia" },
  { id: "operacoes", label: "Operações e Estruturas" },
  { id: "disciplina", label: "Disciplina Operacional" },
  { id: "coberturas", label: "Coberturas e Continuidade" },
  { id: "evolucao", label: "Evolução da Operação" },
  { id: "plano", label: "Plano de Ação" },
  { id: "metodologia", label: "Metodologia e Governança" },
  { id: "retorno", label: "Retorno do Investimento" },
];

export default function AnalyticsV3() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("resumo");
  const [filterOpen, setFilterOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "resumo": return <V3ResumoExecutivoTab />;
      case "alavancas": return <V3AlavancasEconomiaTab />;
      case "operacoes": return <V3OperacoesEstruturasTab />;
      case "disciplina": return <V3DisciplinaOperacionalTab />;
      case "coberturas": return <V3CoberturasRiscoTab />;
      case "evolucao": return <V3EvolucaoTab />;
      case "plano": return <V3PlanoAcaoTab />;
      case "metodologia": return <V3MetodologiaTab />;
      case "retorno": return <V3RetornoInvestimentoTab />;
      default: return <V3ResumoExecutivoTab />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="border-b border-gray-200 px-6 py-3 bg-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline" onClick={() => navigate("/nexti-analytics")}>Home</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[#FF5722] font-semibold">Analytics V3</span>
        </div>
      </header>

      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex items-center justify-between">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#FF5722] text-[#FF5722]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setFilterOpen(true)} className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-[#FF5722]" />
            <span className="font-semibold text-gray-700">Filtros Aplicados:</span>
          </div>
          <span className="bg-orange-50 text-[#FF5722] border border-[#FF5722] rounded-full px-3 py-1 text-xs font-medium">Período: abr/2025 - mar/2026</span>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
          <Eraser className="w-4 h-4" /> Limpar Filtros
        </button>
      </div>

      <div className="px-6 py-4">
        {renderTab()}
      </div>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
