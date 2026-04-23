import { useState } from "react";
import { Filter, Eraser, Lock, Trophy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FilterPanel } from "@/components/layout/FilterPanel";
import InsightsCenter from "@/components/analytics/InsightsCenter";
import AnalyticsChat from "@/components/analytics/AnalyticsChat";
import { resumo, lockedTabs } from "@/lib/analytics-mock-data";
import LockedTabOverlay from "@/components/analytics/LockedTabOverlay";
import { QualidadeTab } from "./AnalyticsDisciplinaOperacional";
import PremiacaoTab from "./compliance/PremiacaoTab";

const TAB_VARIANTS: Record<string, { hue: number; sat: number }> = {
  sancoes: { hue: -8, sat: 1.05 },
  "alertas-preventivos": { hue: 6, sat: 1.0 },
  regulatorio: { hue: -14, sat: 0.95 },
};

const tabs = [
  { id: "premiacao", label: "Premiação", icon: Trophy, locked: false },
  { id: "sancoes", label: "Sanções Disciplinares", icon: Lock, locked: true },
  { id: "alertas-preventivos", label: "Alertas Preventivos", icon: Lock, locked: true },
  { id: "regulatorio", label: "Dossiê Trabalhista", icon: Lock, locked: true },
];

export default function AnalyticsCompliance() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("premiacao");

  const currentLocked = lockedTabs.find((t) => t.id === activeTab);
  const isLocked = activeTab !== "premiacao";

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col overflow-x-hidden">
      <div className="bg-white px-3 sm:px-6 py-3 border-b border-border flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
          <span className="font-semibold text-foreground hidden sm:inline text-sm">Filtros Aplicados:</span>
          <span className="bg-orange-50 text-[#FF5722] border border-orange-200 rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap">Período: {resumo.periodo}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button className="hidden sm:flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
            <Eraser className="w-4 h-4" /> Limpar Filtros
          </button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <button
            onClick={() => setFilterOpen(true)}
            className="sm:hidden text-muted-foreground hover:text-foreground p-1.5 rounded-md transition-colors"
            aria-label="Abrir filtros"
          >
            <Filter className="w-4 h-4" />
          </button>
          <InsightsCenter />
          <AnalyticsChat activeTab={activeTab} />
        </div>
      </div>

      {/* Tabs desktop/tablet (≥ sm) */}
      <div className="hidden sm:block bg-white border-b border-border px-2 sm:px-6 overflow-x-auto">
        <div className="flex gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`flex-1 sm:w-44 sm:flex-none py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                  isActive
                    ? "border-[#FF5722] text-[#FF5722]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 relative min-w-0 w-full max-w-full overflow-hidden pb-16 sm:pb-0">
        {!isLocked && <PremiacaoTab />}
        {isLocked && (
          <LockedTabOverlay
            nome={currentLocked?.nome || activeTab}
            descricao={currentLocked?.descricao || "Funcionalidade em desenvolvimento"}
            backgroundContent={
              <div
                key={activeTab}
                className="w-full max-w-full overflow-x-hidden"
                style={{
                  filter: `hue-rotate(${TAB_VARIANTS[activeTab]?.hue ?? 0}deg) saturate(${TAB_VARIANTS[activeTab]?.sat ?? 1})`,
                }}
              >
                <QualidadeTab />
              </div>
            }
          />
        )}
      </div>

      {/* Tabs fixas no rodapé (mobile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
                  isActive ? "text-[#FF5722]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[10px] leading-tight font-medium text-center px-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
