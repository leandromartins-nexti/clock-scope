import { useState, useMemo, useEffect, ReactNode } from "react";
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ── Score helpers ──
export const getScoreColor = (s: number) =>
  s >= 85 ? "text-green-600" : s >= 70 ? "text-orange-500" : s < 60 ? "text-red-600" : "text-yellow-600";
export const getScoreBg = (s: number) =>
  s >= 85 ? "bg-green-50" : s >= 70 ? "bg-orange-50" : s < 60 ? "bg-red-50" : "bg-yellow-50";
export const getLineColor = (s: number) => {
  if (s >= 85) return "#16a34a";
  if (s >= 75) return "#65a30d";
  if (s >= 65) return "#ca8a04";
  if (s >= 55) return "#ea580c";
  return "#dc2626";
};

export function TrendIcon({ t }: { t: string }) {
  if (t === "melhorando") return <TrendingUp size={14} className="text-green-500" />;
  if (t === "piorando") return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
}

// ── Column definition ──
export interface TableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
  format?: (value: any, row: T) => ReactNode;
}

// ── Props ──
interface IndicatorTableProps<T extends Record<string, any>> {
  data: T[];
  columns: TableColumn<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
  showSearch?: boolean;
  showPagination?: boolean;
}

export default function IndicatorTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Filtrar...",
  pageSize = 10,
  showSearch = true,
  showPagination = true,
}: IndicatorTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({
    key: columns[1]?.key || columns[0].key,
    dir: "desc",
  });
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [search]);

  const toggleSort = (key: string) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === "desc" ? "asc" : "desc" }
        : { key, dir: "desc" }
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      columns.some(c => String(row[c.key]).toLowerCase().includes(q))
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      const dir = sort.dir === "desc" ? -1 : 1;
      if (typeof aVal === "string" && typeof bVal === "string")
        return dir * aVal.localeCompare(bVal);
      return dir * ((aVal as number) - (bVal as number));
    });
  }, [filtered, sort]);

  const totalPages = showPagination ? Math.ceil(sorted.length / pageSize) : 1;
  const paged = showPagination
    ? sorted.slice((page - 1) * pageSize, page * pageSize)
    : sorted;

  return (
    <div className="flex flex-col h-full">
      {showSearch && (
        <div className="relative mb-2">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#FF5722]/40"
          />
        </div>
      )}

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden flex-1">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          <div className="w-2" />
          {columns.map(col => (
            <span
              key={col.key}
              onClick={() => toggleSort(col.key)}
              style={col.width ? { width: col.width, minWidth: col.width, flexShrink: 0 } : undefined}
              className={`cursor-pointer hover:text-foreground transition-colors select-none inline-flex items-center gap-0.5 ${
                !col.width ? "flex-1 min-w-[120px]" : ""
              } ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : ""}`}
            >
              {col.label}
              <ArrowUpDown size={9} className={sort.key === col.key ? "text-[#FF5722]" : "opacity-40"} />
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/40">
          {paged.length === 0 && (
            <div className="px-4 py-4 text-center text-xs text-muted-foreground">
              Nenhum resultado encontrado
            </div>
          )}
          {paged.map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-2.5 hover:bg-muted/30 transition-colors"
            >
              {/* Colored dot — derive from first numeric col or score */}
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: getLineColor(
                    typeof row.score === "number"
                      ? row.score
                      : typeof row.qualidade === "number"
                      ? row.qualidade
                      : typeof row.taxaAcerto === "number"
                      ? row.taxaAcerto
                      : 75
                  ),
                }}
              />
              {columns.map(col => (
                <span
                  key={col.key}
                  style={col.width ? { width: col.width, minWidth: col.width, flexShrink: 0 } : undefined}
                  className={`${!col.width ? "flex-1 min-w-[120px]" : ""} ${
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {col.format ? col.format(row[col.key], row) : row[col.key]}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-muted-foreground">
            {sorted.length} registro{sorted.length !== 1 ? "s" : ""} · Página {page} de{" "}
            {totalPages || 1}
          </p>
          {totalPages > 1 && (
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-6 h-6 rounded text-[10px] font-medium transition-colors ${
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
        </div>
      )}
    </div>
  );
}
