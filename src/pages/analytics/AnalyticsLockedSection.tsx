import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Eraser, Lock } from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { resumo, lockedTabs } from "@/lib/analytics-mock-data";
import LockedTabOverlay from "@/components/analytics/LockedTabOverlay";
import { QualidadeTab } from "./AnalyticsDisciplinaOperacional";

// Pequenas variações visuais por aba para dar sensação de "dados diferentes"
// sem reconstruir o dashboard inteiro. Hue-rotate sutil + leve saturação.
const TAB_VARIANTS: Record<string, { hue: number; sat: number; seed: string }> = {
  sancoes: { hue: -8, sat: 1.05, seed: "A" },
  "alertas-preventivos": { hue: 6, sat: 1.0, seed: "B" },
  regulatorio: { hue: -14, sat: 0.95, seed: "C" },
  pesquisas: { hue: 12, sat: 1.08, seed: "D" },
  reconhecimento: { hue: -4, sat: 1.0, seed: "E" },
  comunicacao: { hue: 18, sat: 0.92, seed: "F" },
};

interface TabDef {
  id: string;
  label: string;
}

interface Props {
  sectionName: string;
  sectionId: string;
  tabs: TabDef[];
}

export default function AnalyticsLockedSection({ sectionName, sectionId, tabs }: Props) {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const currentLocked = lockedTabs.find((t) => t.id === activeTab);

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

      {/* Tabs with lock icons */}
      <div className="bg-white border-b border-border px-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-[#FF5722] text-[#FF5722]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <Lock className="w-3 h-3 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        <LockedTabOverlay
          nome={currentLocked?.nome || activeTab}
          descricao={currentLocked?.descricao || "Funcionalidade em desenvolvimento"}
          backgroundContent={<LockedTabMockBackground tabId={activeTab} />}
        />
      </div>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
