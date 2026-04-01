import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Eraser } from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { ImprovementProvider } from "@/contexts/ImprovementContext";
import { ImprovementLayer } from "@/components/improvements/ImprovementLayer";
import { ImprovementCenter } from "@/components/improvements/ImprovementCenter";
import ResumoExecutivoTab from "./executive-v2/ResumoExecutivoTab";
import DriversValorTab from "./executive-v2/DriversValorTab";
import RoiOperacaoTab from "./executive-v2/RoiOperacaoTab";
import EvolucaoTab from "./executive-v2/EvolucaoTab";
import OportunidadesTab from "./executive-v2/OportunidadesTab";
import MetodologiaTab from "./executive-v2/MetodologiaTab";

const tabs = [
  { id: "resumo", label: "Resumo Executivo" },
  { id: "drivers", label: "Drivers de Valor" },
  { id: "operacao", label: "ROI por Operação" },
  { id: "evolucao", label: "Evolução" },
  { id: "oportunidades", label: "Oportunidades" },
  { id: "metodologia", label: "Metodologia" },
];

export default function ExecutiveV2() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("resumo");
  const [filterOpen, setFilterOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "resumo": return <ResumoExecutivoTab />;
      case "drivers": return <DriversValorTab />;
      case "operacao": return <RoiOperacaoTab />;
      case "evolucao": return <EvolucaoTab />;
      case "oportunidades": return <OportunidadesTab />;
      case "metodologia": return <MetodologiaTab />;
      default: return <ResumoExecutivoTab />;
    }
  };

  return (
    <ImprovementProvider>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <header className="border-b border-gray-200 px-6 py-3 bg-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#FF5722] font-medium cursor-pointer hover:underline" onClick={() => navigate("/nexti-analytics")}>Home</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-500">Executive V2</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-[#FF5722] font-semibold">ROI Realizado</span>
          </div>
        </header>

        <div className="border-b border-gray-200 bg-white px-6">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
              <ImprovementCenter />
              <button onClick={() => setFilterOpen(true)} className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
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

        <ImprovementLayer screenId="ExecutiveV2">
          <div className="px-6 py-4">
            {renderTab()}
          </div>
        </ImprovementLayer>

        <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
      </div>
    </ImprovementProvider>
  );
}
