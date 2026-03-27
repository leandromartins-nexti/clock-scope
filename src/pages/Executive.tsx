import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Eraser, MessageSquare } from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { ImprovementProvider } from "@/contexts/ImprovementContext";
import { ImprovementLayer } from "@/components/improvements/ImprovementLayer";
import { ImprovementCenter } from "@/components/improvements/ImprovementCenter";
import VisaoGeralTab from "./executive/VisaoGeralTab";
import EficienciaTab from "./executive/EficienciaTab";
import AbsenteismoTab from "./executive/AbsenteismoTab";
import CustoTab from "./executive/CustoTab";
import ComparativoTab from "./executive/ComparativoTab";
import RiscoTab from "./executive/RiscoTab";
import EconomiaTab from "./executive/EconomiaTab";

const tabs = [
  { id: "visao-geral", label: "Visão Geral" },
  { id: "eficiencia", label: "Eficiência" },
  { id: "absenteismo", label: "Absenteísmo" },
  { id: "custo", label: "Custo" },
  { id: "comparativo", label: "Comparativo" },
  { id: "risco", label: "Risco" },
  { id: "economia", label: "Economia" },
];

export default function Executive() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [filterOpen, setFilterOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "visao-geral": return <VisaoGeralTab />;
      case "eficiencia": return <EficienciaTab />;
      case "absenteismo": return <AbsenteismoTab />;
      case "custo": return <CustoTab />;
      case "comparativo": return <ComparativoTab />;
      case "risco": return <RiscoTab />;
      case "economia": return <EconomiaTab />;
      default: return <VisaoGeralTab />;
    }
  };

  return (
    <ImprovementProvider>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        {/* Breadcrumb */}
        <header className="border-b border-gray-200 px-6 py-3 bg-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#FF5722] font-medium cursor-pointer hover:underline" onClick={() => navigate("/nexti-analytics")}>Home</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-500">Executive</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-[#FF5722] font-semibold">Prime</span>
          </div>
        </header>

        {/* Tabs Row */}
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
              <button
                onClick={() => setFilterOpen(true)}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-[#FF5722]" />
              <span className="font-semibold text-gray-700">Filtros Aplicados:</span>
            </div>
            <span className="bg-orange-50 text-[#FF5722] border border-[#FF5722] rounded-full px-3 py-1 text-xs font-medium">
              Período: jan/2024 - dez/2024
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
            <Eraser className="w-4 h-4" />
            Limpar Filtros
          </button>
        </div>

        <ImprovementLayer screenId="Executive">
          <div className="px-6 py-4">
            {renderTab()}
          </div>
        </ImprovementLayer>

        <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
      </div>
    </ImprovementProvider>
  );
}
