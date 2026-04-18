import { useState, useMemo, useEffect } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Search, ArrowUpDown, Building2, Network, LayoutGrid, Filter, Lightbulb, MessageCircle } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useScoreConfig, getScoreClassification } from "@/contexts/ScoreConfigContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSearchParams } from "react-router-dom";
import RightSidebarInsightsPanel from "./RightSidebarInsightsPanel";
import InlineAnalyticsChat from "./InlineAnalyticsChat";

type SidebarMode = "ops" | "insights" | "chat";

// ── Types ──
export type GroupBy = "unidade" | "empresa" | "area";

export const groupByOptions: { id: GroupBy; label: string; short: string; icon: typeof Building2 }[] = [
  { id: "empresa", label: "Empresa", short: "Empresa", icon: Building2 },
  { id: "unidade", label: "Un. Negócio", short: "Un. Negócio", icon: Network },
  { id: "area", label: "Área", short: "Área", icon: LayoutGrid },
];

interface GroupBySidebarProps {
  items: { nome: string; score: number; value?: string }[];
  selectedRegional: string | null;
  onRegionalClick: (value: string) => void;
  onItemDetail?: (value: string) => void;
  groupBy: GroupBy;
  onGroupByChange: (g: GroupBy) => void;
  onPagedItemsChange?: (names: string[]) => void;
  pageSize?: number;
}

export default function GroupBySidebar({
  items,
  selectedRegional,
  onRegionalClick,
  onItemDetail,
  groupBy,
  onGroupByChange,
  onPagedItemsChange,
  pageSize = 25,
}: GroupBySidebarProps) {
  const { config: scoreConfig } = useScoreConfig();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "qualidade";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState<SidebarMode>("ops");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "nome">("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const searchTimerRef = useState<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimerRef[0]) clearTimeout(searchTimerRef[0]);
    searchTimerRef[0] = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500);
  };

  const handleGroupChange = (g: GroupBy) => {
    onGroupByChange(g);
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const toggleSort = (col: "score" | "nome") => {
    if (sortBy === col) setSortDir(d => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...items];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(i => i.nome.toLowerCase().includes(q));
    }
    const dir = sortDir === "desc" ? -1 : 1;
    if (sortBy === "nome") result.sort((a, b) => dir * a.nome.localeCompare(b.nome));
    else result.sort((a, b) => dir * (a.score - b.score));
    return result;
  }, [items, debouncedSearch, sortBy, sortDir]);

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize);
  const showPagination = filteredAndSorted.length > pageSize;
  const pagedItems = useMemo(
    () => filteredAndSorted.slice((page - 1) * pageSize, page * pageSize),
    [filteredAndSorted, page, pageSize]
  );

  useEffect(() => {
    onPagedItemsChange?.(pagedItems.map(i => i.value ?? i.nome));
  }, [pagedItems, onPagedItemsChange]);

  // Listen to global event to open the mobile sheet (triggered from page header button)
  useEffect(() => {
    if (!isMobile) return;
    const handler = () => setMobileOpen(true);
    window.addEventListener("open-tipo-operacao", handler);
    return () => window.removeEventListener("open-tipo-operacao", handler);
  }, [isMobile]);

  // Header toggle: 3 icon buttons (Filtro / Insights / Chat AI)
  const HeaderToggle = () => (
    <div className="flex items-center gap-1 mb-1.5">
      {([
        { id: "ops" as const, icon: Filter, label: "Tipo de Operação" },
        { id: "insights" as const, icon: Lightbulb, label: "Insights" },
        { id: "chat" as const, icon: MessageCircle, label: "Chat AI" },
      ]).map(o => {
        const active = mode === o.id;
        const Icon = o.icon;
        return (
          <UITooltip key={o.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setMode(o.id)}
                className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${
                  active
                    ? "bg-[#FF5722] text-white"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
                aria-label={o.label}
              >
                <Icon size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6} className="text-xs">
              {o.label}
              <TooltipPrimitive.Arrow className="fill-popover" width={10} height={5} />
            </TooltipContent>
          </UITooltip>
        );
      })}
    </div>
  );

  // ── Mobile: Sheet drawer (fullscreen) ──
  if (isMobile) {
    const mobileMode = mode;
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full max-w-full p-0 flex flex-col">
          <SheetHeader className="px-4 py-3 border-b border-border flex-row items-center justify-between space-y-0">
            <SheetTitle className="text-sm font-semibold">{mobileMode === "ops" ? "Tipo de Operação" : mobileMode === "insights" ? "Insights" : "Chat AI"}</SheetTitle>
          </SheetHeader>
          <div className="px-3 pt-2 flex gap-1">
            {([
              { id: "ops" as const, icon: Filter, label: "Filtro" },
              { id: "insights" as const, icon: Lightbulb, label: "Insights" },
              { id: "chat" as const, icon: MessageCircle, label: "Chat" },
            ]).map(o => {
              const active = mobileMode === o.id;
              const Icon = o.icon;
              return (
                <button
                  key={o.id}
                  onClick={() => setMode(o.id)}
                  className={`flex-1 px-2 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1 ${
                    active ? "bg-[#FF5722] text-white" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-border"
                  }`}
                >
                  <Icon size={13} />
                  <span className="text-[11px] font-semibold">{o.label}</span>
                </button>
              );
            })}
          </div>
          {mobileMode === "chat" ? (
            <div className="flex-1 overflow-y-auto p-3"><InlineAnalyticsChat activeTab={activeTab} groupBy={groupBy} /></div>
          ) : mobileMode === "insights" ? (
            <div className="flex-1 overflow-y-auto p-3"><RightSidebarInsightsPanel /></div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="flex gap-2">
                {groupByOptions.map(o => (
                  <button
                    key={o.id}
                    onClick={() => handleGroupChange(o.id)}
                    className={`px-3 py-2 rounded text-xs font-medium border transition-colors flex-1 whitespace-nowrap ${
                      groupBy === o.id
                        ? "bg-[#FF5722] text-white border-[#FF5722]"
                        : "text-muted-foreground border-border hover:border-[#FF5722]/40"
                    }`}
                  >
                    {o.short}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="w-full pl-7 pr-2 py-2 text-sm rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#FF5722]/40"
                />
              </div>
              {showPagination && (
                <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                        page === p ? "bg-[#FF5722] text-white" : "text-muted-foreground border border-border hover:border-[#FF5722]/40"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 px-1 pt-1">
                <button onClick={() => toggleSort("nome")} className="flex-1 flex items-center gap-0.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground text-left">
                  Nome <ArrowUpDown size={10} className={sortBy === "nome" ? "text-[#FF5722]" : ""} />
                </button>
                <button onClick={() => toggleSort("score")} className="shrink-0 flex items-center gap-0.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                  Score <ArrowUpDown size={10} className={sortBy === "score" ? "text-[#FF5722]" : ""} />
                </button>
              </div>
              <div className="space-y-1">
                {pagedItems.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">Nenhum resultado</p>
                )}
                {pagedItems.map(op => {
                  const itemValue = op.value ?? op.nome;
                  const isSelected = selectedRegional === itemValue;
                  const isDimmed = selectedRegional && !isSelected;
                  const scoreColor = getScoreClassification(op.score, scoreConfig).text;
                  return (
                    <div
                      key={itemValue}
                      onClick={() => { onRegionalClick(itemValue); setMobileOpen(false); }}
                      className={`flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer transition-all text-sm ${
                        isSelected ? "bg-orange-50 border border-[#FF5722]/30" : "hover:bg-muted/40 border border-transparent"
                      } ${isDimmed ? "opacity-50" : ""}`}
                    >
                      <span className="flex-1 font-medium truncate text-foreground">{op.nome}</span>
                      <span className={`font-bold tabular-nums shrink-0 ${scoreColor}`}>{op.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  // ── Desktop: always-open sidebar with header toggle ──
  const titleByMode = mode === "ops" ? "Tipo de Operação" : mode === "insights" ? "Insights" : "Chat AI";
  const widthClass = "w-[240px]";
  return (
    <div className="flex shrink-0 self-stretch" data-onboarding="tipo-operacao">
      <div className={`${widthClass} bg-white border-l border-border/40 pl-3 pr-1 pt-2 flex flex-col`}>
        {/* Header: toggle + title */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <HeaderToggle />
          <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase truncate">
            {titleByMode}
          </p>
        </div>

        {mode === "chat" ? (
          <InlineAnalyticsChat activeTab={activeTab} groupBy={groupBy} />
        ) : mode === "insights" ? (
          <RightSidebarInsightsPanel />
        ) : (
          <>
            {/* Group toggles */}
            <div className="flex gap-1 mb-1.5">
              {groupByOptions.map(o => (
                <button
                  key={o.id}
                  onClick={() => handleGroupChange(o.id)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors flex-1 whitespace-nowrap ${
                    groupBy === o.id
                      ? "bg-[#FF5722] text-white border-[#FF5722]"
                      : "text-muted-foreground border-border hover:border-[#FF5722]/40"
                  }`}
                >
                  {o.short}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-1">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                className="w-full pl-6 pr-2 py-1 text-[11px] rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#FF5722]/40"
              />
            </div>

            {/* Pagination */}
            {showPagination && (
              <div className="flex gap-1 mb-1 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-5 h-5 rounded text-[10px] font-medium transition-colors ${
                      page === p
                        ? "bg-[#FF5722] text-white"
                        : "text-muted-foreground border border-border hover:border-[#FF5722]/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Column headers */}
            <div className="flex items-center gap-2 px-0.5 mb-1">
              <button onClick={() => toggleSort("nome")} className="flex-1 flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground text-left">
                Nome <ArrowUpDown size={9} className={sortBy === "nome" ? "text-[#FF5722]" : ""} />
              </button>
              <button onClick={() => toggleSort("score")} className="shrink-0 flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground">
                Score <ArrowUpDown size={9} className={sortBy === "score" ? "text-[#FF5722]" : ""} />
              </button>
            </div>

            {/* Items */}
            <div className="space-y-0.5 overflow-y-auto flex-1">
              {pagedItems.length === 0 && (
                <p className="text-[10px] text-muted-foreground text-center py-2">Nenhum resultado</p>
              )}
              {pagedItems.map(op => {
                const itemValue = op.value ?? op.nome;
                const isSelected = selectedRegional === itemValue;
                const isDimmed = selectedRegional && !isSelected;
                const scoreColor = getScoreClassification(op.score, scoreConfig).text;
                return (
                  <div
                    key={itemValue}
                    onClick={() => onRegionalClick(itemValue)}
                    onContextMenu={e => { e.preventDefault(); onItemDetail?.(itemValue); }}
                    className={`flex items-center gap-2 px-0.5 py-1 rounded-md cursor-pointer transition-all text-xs ${
                      isSelected
                        ? "bg-orange-50 border border-[#FF5722]/30"
                        : "hover:bg-muted/40 border border-transparent"
                    } ${isDimmed ? "opacity-35" : ""}`}
                    title="Clique para filtrar · Botão direito para detalhes"
                  >
                    <span className="flex-1 font-medium truncate text-foreground">{op.nome}</span>
                    <span className={`font-bold tabular-nums shrink-0 ${scoreColor}`}>{op.score}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
