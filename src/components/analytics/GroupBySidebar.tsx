import { useState, useMemo, useEffect } from "react";
import { Search, ArrowUpDown } from "lucide-react";

// ── Types ──
export type GroupBy = "unidade" | "empresa" | "area";

export const groupByOptions: { id: GroupBy; label: string; short: string }[] = [
  { id: "empresa", label: "Empresa", short: "Empresa" },
  { id: "unidade", label: "Un. Negócio", short: "Un. Negócio" },
  { id: "area", label: "Área", short: "Área" },
];

interface GroupBySidebarProps {
  items: { nome: string; score: number }[];
  selectedRegional: string | null;
  onRegionalClick: (name: string) => void;
  onItemDetail?: (name: string) => void;
  groupBy: GroupBy;
  onGroupByChange: (g: GroupBy) => void;
  onPagedItemsChange?: (names: string[]) => void;
  pageSize?: number;
}

/**
 * GroupBySidebar — a reusable sidebar list with group-by toggle,
 * search, sort, and pagination. Used across Analytics pages.
 */
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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "nome">("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Debounce search
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
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...items];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(i => i.nome.toLowerCase().includes(q));
    }
    const dir = sortDir === "desc" ? -1 : 1;
    if (sortBy === "nome") {
      result.sort((a, b) => dir * a.nome.localeCompare(b.nome));
    } else {
      result.sort((a, b) => dir * (a.score - b.score));
    }
    return result;
  }, [items, debouncedSearch, sortBy, sortDir]);

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize);
  const showPagination = filteredAndSorted.length > pageSize;
  const pagedItems = useMemo(
    () => filteredAndSorted.slice((page - 1) * pageSize, page * pageSize),
    [filteredAndSorted, page, pageSize]
  );

  useEffect(() => {
    onPagedItemsChange?.(pagedItems.map(i => i.nome));
  }, [pagedItems, onPagedItemsChange]);

  return (
    <div className="w-[220px] shrink-0">
      <div className="bg-card border border-border/50 rounded-xl p-3 sticky top-4 max-h-[calc(100vh-120px)] flex flex-col">
        {/* Group by selector */}
        <div className="flex gap-1 mb-1">
          {groupByOptions.map(o => (
            <button
              key={o.id}
              onClick={() => handleGroupChange(o.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
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
          <button
            onClick={() => toggleSort("nome")}
            className="flex-1 flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground text-left"
          >
            Nome <ArrowUpDown size={9} className={sortBy === "nome" ? "text-[#FF5722]" : ""} />
          </button>
          <button
            onClick={() => toggleSort("score")}
            className="shrink-0 flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
          >
            Score <ArrowUpDown size={9} className={sortBy === "score" ? "text-[#FF5722]" : ""} />
          </button>
        </div>

        {/* Items */}
        <div className="space-y-0.5 overflow-y-auto flex-1">
          {pagedItems.length === 0 && (
            <p className="text-[10px] text-muted-foreground text-center py-2">Nenhum resultado</p>
          )}
          {pagedItems.map(op => {
            const isSelected = selectedRegional === op.nome;
            const isDimmed = selectedRegional && !isSelected;
            const scoreColor =
              op.score >= 85 ? "text-green-600" : op.score >= 75 ? "text-orange-500" : "text-red-600";
            return (
              <div
                key={op.nome}
                onClick={() => onRegionalClick(op.nome)}
                onContextMenu={e => {
                  e.preventDefault();
                  onItemDetail?.(op.nome);
                }}
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
