import { useState } from "react";
import { Filter, Eraser, Lock } from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { resumo, lockedTabs } from "@/lib/analytics-mock-data";
import LockedTabOverlay from "@/components/analytics/LockedTabOverlay";
import LockedTabMockBackground from "@/components/analytics/LockedTabMockBackground";

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const currentLocked = lockedTabs.find((t) => t.id === activeTab);

  return (
    <div className="bg-[hsl(var(--surface))] min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      <div className="bg-card px-3 sm:px-6 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full max-w-full">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Filter className="w-4 h-4 text-[#FF5722] shrink-0" />
            <span className="font-semibold text-foreground">Filtros Aplicados:</span>
          </div>
          <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium whitespace-nowrap">Período: {resumo.periodo}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button onClick={() => setFilterOpen(true)} className="border border-border text-muted-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 hover:bg-muted">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Filtros
          </button>
          <button className="flex items-center gap-1.5 text-xs sm:text-sm text-[#FF5722] hover:underline whitespace-nowrap">
            <Eraser className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Limpar Filtros
          </button>
        </div>
      </div>

      {/* Tabs with lock icons */}
      <div className="bg-card border-b border-border px-3 sm:px-6 w-full max-w-full overflow-hidden">
        <div className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
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

      <div className="flex-1 relative min-w-0 w-full max-w-full overflow-hidden">
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
