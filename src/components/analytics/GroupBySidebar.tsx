import { useState, useMemo, useEffect } from "react";
import { Search, ArrowUpDown, PanelRightClose, PanelRightOpen, Building2, Network, LayoutGrid, SlidersHorizontal, X, Filter } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useScoreConfig, getScoreClassification } from "@/contexts/ScoreConfigContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// ── Types ──
export type GroupBy = "unidade" | "empresa" | "area";

export const groupByOptions: { id: GroupBy; label: string; short: string; icon: typeof Building2 }[] = [
  { id: "empresa", label: "Empresa", short: "Empresa", icon: Building2 },
  { id: "unidade", label: "Un. Negócio", short: "Un. Negócio", icon: Network },
  { id: "area", label: "Área", short: "Área", icon: LayoutGrid },
];

function abreviar(nome: string): string {
  const clean = nome.replace(/^VIG\s*EYES\s*/i, "").trim();
  if (!clean) return nome.slice(0, 3).toUpperCase();
  return clean.split(/\s+/)[0]?.slice(0, 3).toUpperCase() || nome.slice(0, 3).toUpperCase();
}

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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // ── Mobile: Sheet drawer (fullscreen) — opened by external header button ──
  if (isMobile) {
    return (
      <>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right" className="w-full max-w-full p-0 flex flex-col">
            <SheetHeader className="px-4 py-3 border-b border-border flex-row items-center justify-between space-y-0">
              <SheetTitle className="text-sm font-semibold">Tipo de Operação</SheetTitle>
            </SheetHeader>
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
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // ── Collapsed mode (desktop) ──
  if (collapsed) {
    return (
      <div className="w-[52px] shrink-0 self-stretch">
        <div className="bg-white border-l border-border/40 p-1.5 h-full flex flex-col items-center gap-1">
          {/* Expand button */}
          <button
            onClick={() => setCollapsed(false)}
            className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors mb-1"
            title="Expandir sidebar"
          >
            <PanelRightClose size={14} />
          </button>

          {/* GroupBy icon buttons */}
          <div className="flex flex-col gap-0.5 mb-1.5">
            {groupByOptions.map(o => (
              <UITooltip key={o.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleGroupChange(o.id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      groupBy === o.id
                        ? "bg-[#FF5722] text-white"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <o.icon size={13} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">{o.label}</TooltipContent>
              </UITooltip>
            ))}
          </div>

          {/* Divider */}
          <div className="w-6 border-t border-border/50 mb-1" />

          {/* Abbreviated items */}
          <div className="flex flex-col gap-0.5 overflow-y-auto flex-1">
            {pagedItems.map(op => {
              const itemValue = op.value ?? op.nome;
              const isSelected = selectedRegional === itemValue;
              const isDimmed = selectedRegional && !isSelected;
              const scoreColor = getScoreClassification(op.score, scoreConfig).text;
              const abbr = abreviar(op.nome);
              return (
                <UITooltip key={itemValue}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onRegionalClick(itemValue)}
                      onContextMenu={e => { e.preventDefault(); onItemDetail?.(itemValue); }}
                      className={`flex flex-col items-center px-1 py-1 rounded-md cursor-pointer transition-all text-[9px] leading-tight ${
                        isSelected
                          ? "bg-orange-50 border border-[#FF5722]/30"
                          : "hover:bg-muted/40 border border-transparent"
                      } ${isDimmed ? "opacity-35" : ""}`}
                    >
                      <span className="font-bold text-foreground">{abbr}</span>
                      <span className={`font-bold tabular-nums ${scoreColor}`}>{op.score}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-xs max-w-[200px]">
                    <p className="font-semibold">{op.nome}</p>
                    <p className="text-muted-foreground">Score: {op.score}</p>
                  </TooltipContent>
                </UITooltip>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Expanded mode ──
  return (
    <div className="w-[240px] shrink-0 self-stretch" data-onboarding="tipo-operacao">
       <div className="bg-white border-l border-border/40 pl-3 pr-1 pt-2 h-full flex flex-col">
        {/* Header: title + collapse button */}
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Tipo de Operação</p>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Recolher sidebar"
          >
            <PanelRightOpen size={13} />
          </button>
        </div>

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
      </div>
    </div>
  );
}
