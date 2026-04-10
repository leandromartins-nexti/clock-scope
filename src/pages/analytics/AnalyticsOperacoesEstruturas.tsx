import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Eraser } from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import { resumo } from "@/lib/analytics-mock-data";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import { getSidebarItems } from "@/lib/ajustesData";

export default function AnalyticsOperacoesEstruturas({ embedded }: { embedded?: boolean }) {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");

  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };
  const sidebarItems = useMemo(() => getSidebarItems(groupBy), [groupBy]);

  const content = (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 min-w-0 pl-6 pr-4 py-6 overflow-y-auto">
        <p className="text-muted-foreground">Operações e Estruturas — em construção.</p>
      </div>
      <GroupBySidebar items={sidebarItems} selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} groupBy={groupBy} onGroupByChange={handleGroupByChange} />
    </div>
  );

  if (embedded) return content;

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
      {content}
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
