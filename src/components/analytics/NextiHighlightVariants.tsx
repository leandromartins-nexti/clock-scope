import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { Crown, Sparkles, Star, Zap, Flame, Trophy, TrendingUp, Target } from "lucide-react";
import { getLineColor } from "@/components/analytics/IndicatorTable";

interface EvoPoint { competencia: string; valor: number; }
export interface NextiCard {
  label: string;
  evolucao: EvoPoint[];
  score: number;
  variacao: string;
  corVariacao: string;
  perPointColors?: boolean;
  forceColor?: string;
  highlight?: boolean;
}

interface Props { cards: NextiCard[]; }

const ORANGE = "#FF5722";

function Sparkline({ card, gradId, heightOverride }: { card: NextiCard; gradId: string; heightOverride?: number }) {
  const h = heightOverride ?? (card.highlight ? 28 : 17);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart data={card.evolucao} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            {card.evolucao.map((pt, i) => {
              const pct = card.evolucao.length > 1 ? (i / (card.evolucao.length - 1)) * 100 : 0;
              const stopColor = card.forceColor ?? (card.perPointColors ? getLineColor(pt.valor) : getLineColor(card.score));
              return <stop key={i} offset={`${pct}%`} stopColor={stopColor} stopOpacity={card.highlight ? 0.4 : 0.45} />;
            })}
          </linearGradient>
          <linearGradient id={`${gradId}-stroke`} x1="0" y1="0" x2="1" y2="0">
            {card.evolucao.map((pt, i) => {
              const pct = card.evolucao.length > 1 ? (i / (card.evolucao.length - 1)) * 100 : 0;
              const stopColor = card.forceColor ?? (card.perPointColors ? getLineColor(pt.valor) : getLineColor(card.score));
              return <stop key={i} offset={`${pct}%`} stopColor={stopColor} />;
            })}
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="valor"
          stroke={`url(#${gradId}-stroke)`}
          strokeWidth={card.highlight ? 2.8 : 2}
          fill={`url(#${gradId})`}
          style={card.highlight ? { filter: `drop-shadow(0 1px 4px ${card.forceColor ?? ORANGE}55)` } : undefined}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * Each variant renders ONE complete table (3 rows) with its own custom layout.
 * The Score Nexti row gets a unique premium treatment in each variant.
 */
const VARIANTS: { id: string; nome: string; descricao: string; render: (cards: NextiCard[]) => JSX.Element }[] = [
  // ───────── 1 — Hero panel
  {
    id: "v1",
    nome: "1. Hero Panel",
    descricao: "Score Nexti como card hero acima das demais linhas",
    render: (cards) => {
      const nexti = cards.find((c) => c.highlight)!;
      const others = cards.filter((c) => !c.highlight);
      return (
        <div className="p-3">
          <div className="rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FF8A65] p-[1.5px] shadow-[0_8px_24px_-8px_rgba(255,87,34,0.5)]">
            <div className="flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-orange-50 via-white to-orange-50/40 rounded-[10px]">
              <div className="w-10 h-10 rounded-lg bg-[#FF5722] text-white flex items-center justify-center shadow-md">
                <Crown className="w-5 h-5" />
              </div>
              <div className="min-w-[160px]">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF5722]/70">Indicador-mestre</div>
                <div className="text-base font-extrabold text-[#FF5722] leading-tight">{nexti.label}</div>
              </div>
              <div className="flex-1 h-[28px]"><Sparkline card={nexti} gradId="v1-nexti" /></div>
              <div className="text-2xl font-black text-[#FF5722] tabular-nums">{nexti.score}</div>
            </div>
          </div>
          <div className="mt-2 divide-y divide-border/40">
            {others.map((c) => (
              <div key={c.label} className="flex items-center gap-4 px-3 py-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLineColor(c.score) }} />
                <span className="min-w-[160px] text-sm text-foreground">{c.label}</span>
                <div className="flex-1 h-[17px]"><Sparkline card={c} gradId={`v1-${c.label}`} /></div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },

  // ───────── 2 — Vertical tag book
  {
    id: "v2",
    nome: "2. Marcador vertical",
    descricao: "Tag vertical 'NEXTI' à esquerda da linha",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div key={c.label} className="relative flex items-center gap-4 px-4 py-4 pl-10">
            {c.highlight && (
              <div className="absolute left-0 top-0 bottom-0 w-7 bg-[#FF5722] flex items-center justify-center">
                <span className="text-[9px] font-black text-white tracking-[0.2em]" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>NEXTI</span>
              </div>
            )}
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score) }} />
            <span className={`min-w-[160px] ${c.highlight ? "text-sm font-bold text-[#FF5722]" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v2-${c.label}`} /></div>
            {c.highlight && <span className="text-xs font-bold text-[#FF5722] tabular-nums">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 3 — Spotlight
  {
    id: "v3",
    nome: "3. Spotlight",
    descricao: "Foco radial laranja vindo de baixo",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-4 px-4 py-4"
            style={c.highlight ? { background: "radial-gradient(ellipse 60% 100% at 30% 100%, rgba(255,87,34,0.22), rgba(255,87,34,0.05) 50%, transparent 80%)" } : undefined}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${c.highlight ? "text-[#FF5722]" : "opacity-0"}`} />
            <span className={`min-w-[160px] ${c.highlight ? "text-base font-extrabold text-[#FF5722] tracking-tight" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[28px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v3-${c.label}`} /></div>
            {c.highlight && <span className="text-lg font-black text-[#FF5722] tabular-nums">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 4 — Glassmorphism
  {
    id: "v4",
    nome: "4. Glass premium",
    descricao: "Painel glass com blur e borda iridescente",
    render: (cards) => (
      <div className="p-3 space-y-2 bg-[radial-gradient(ellipse_at_top_left,#FFE0D2_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,#FFCCBC_0%,transparent_50%)] rounded-lg">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg backdrop-blur-md ${
              c.highlight
                ? "bg-white/70 ring-1 ring-[#FF5722]/40 shadow-[0_4px_20px_-4px_rgba(255,87,34,0.35)]"
                : "bg-white/40"
            }`}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score), boxShadow: c.highlight ? `0 0 8px ${ORANGE}` : undefined }} />
            <span className={`min-w-[160px] ${c.highlight ? "text-sm font-bold text-[#FF5722]" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v4-${c.label}`} /></div>
            {c.highlight && <span className="text-sm font-black text-[#FF5722] tabular-nums">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 5 — Trophy badge
  {
    id: "v5",
    nome: "5. Troféu",
    descricao: "Ícone de troféu + badge de posição",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div key={c.label} className={`flex items-center gap-4 px-4 py-4 ${c.highlight ? "bg-amber-50/40" : ""}`}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={c.highlight ? { background: "linear-gradient(135deg,#FF5722,#FFB74D)" } : { background: "transparent" }}>
              {c.highlight && <Trophy className="w-4 h-4 text-white" />}
            </div>
            <span className={`min-w-[160px] ${c.highlight ? "text-sm font-bold text-[#BF360C] uppercase tracking-wide" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v5-${c.label}`} /></div>
            {c.highlight && <span className="text-base font-black text-[#FF5722] tabular-nums">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 6 — Stripe ticker
  {
    id: "v6",
    nome: "6. Stripe diagonal",
    descricao: "Listras diagonais sutis no fundo da linha",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-4 px-4 py-4 relative overflow-hidden"
            style={c.highlight ? { backgroundImage: "repeating-linear-gradient(135deg, rgba(255,87,34,0.08) 0 8px, transparent 8px 16px)", borderLeft: `4px solid ${ORANGE}` } : undefined}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score) }} />
            <span className={`min-w-[160px] ${c.highlight ? "text-sm font-bold text-[#FF5722]" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v6-${c.label}`} /></div>
            {c.highlight && <span className="text-sm font-bold text-[#FF5722] tabular-nums px-2 py-0.5 bg-white rounded shadow-sm">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 7 — Big number left
  {
    id: "v7",
    nome: "7. Mega-número",
    descricao: "Score gigante à esquerda da linha Nexti",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div key={c.label} className={`flex items-center gap-4 px-4 ${c.highlight ? "py-2 bg-orange-50/30" : "py-4"}`}>
            {c.highlight ? (
              <div className="w-14 text-right">
                <div className="text-3xl font-black leading-none text-[#FF5722] tabular-nums">{c.score}</div>
                <div className="text-[8px] font-bold text-[#FF5722]/70 uppercase tracking-wider mt-0.5">Score</div>
              </div>
            ) : (
              <div className="w-2 h-2 rounded-full ml-6" style={{ backgroundColor: getLineColor(c.score) }} />
            )}
            <span className={`min-w-[140px] ${c.highlight ? "text-sm font-bold text-[#FF5722] uppercase tracking-wide" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[34px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v7-${c.label}`} heightOverride={c.highlight ? 34 : 17} /></div>
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 8 — Layered dual row
  {
    id: "v8",
    nome: "8. Camada dupla",
    descricao: "Linha Nexti em duas camadas (badge + barra)",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          c.highlight ? (
            <div key={c.label} className="px-4 py-3 bg-gradient-to-b from-orange-50/60 to-transparent">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-[#FF5722] fill-[#FF5722]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">Score Nexti — indicador consolidado</span>
                </div>
                <span className="text-xl font-black text-[#FF5722] tabular-nums">{c.score}</span>
              </div>
              <div className="h-[28px]"><Sparkline card={c} gradId={`v8-${c.label}`} /></div>
            </div>
          ) : (
            <div key={c.label} className="flex items-center gap-4 px-4 py-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLineColor(c.score) }} />
              <span className="min-w-[160px] text-sm text-foreground">{c.label}</span>
              <div className="flex-1 h-[17px]"><Sparkline card={c} gradId={`v8-${c.label}`} /></div>
            </div>
          )
        ))}
      </div>
    ),
  },

  // ───────── 9 — Neon outline
  {
    id: "v9",
    nome: "9. Neon outline",
    descricao: "Contorno luminoso na linha Nexti",
    render: (cards) => (
      <div className="p-3 bg-slate-950 rounded-lg space-y-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg ${
              c.highlight
                ? "bg-slate-900 ring-1 ring-[#FF5722] shadow-[0_0_24px_rgba(255,87,34,0.45),inset_0_0_12px_rgba(255,87,34,0.15)]"
                : "bg-slate-900/40"
            }`}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score), boxShadow: c.highlight ? `0 0 10px ${ORANGE}` : undefined }} />
            <span className={`min-w-[160px] ${c.highlight ? "text-sm font-bold text-[#FF5722] uppercase tracking-wider" : "text-sm text-slate-300"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v9-${c.label}`} /></div>
            {c.highlight && <span className="text-sm font-black text-[#FF5722] tabular-nums" style={{ textShadow: `0 0 8px ${ORANGE}` }}>{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 10 — Magazine cover
  {
    id: "v10",
    nome: "10. Capa de revista",
    descricao: "Composição editorial com tipografia hierárquica",
    render: (cards) => {
      const nexti = cards.find((c) => c.highlight)!;
      const others = cards.filter((c) => !c.highlight);
      return (
        <div>
          <div className="px-5 py-4 border-b-4 border-[#FF5722] bg-orange-50/20">
            <div className="flex items-end gap-5">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF5722]/70">Edição · 12 meses</div>
                <div className="text-[28px] font-black text-foreground leading-none mt-1">{nexti.label}</div>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[8px] uppercase tracking-wider text-muted-foreground">atual</div>
                  <div className="text-3xl font-black text-[#FF5722] tabular-nums leading-none">{nexti.score}</div>
                </div>
                <div className="w-[180px] h-[34px]"><Sparkline card={nexti} gradId="v10-nexti" heightOverride={34} /></div>
              </div>
            </div>
          </div>
          <div className="divide-y divide-border/40">
            {others.map((c) => (
              <div key={c.label} className="flex items-center gap-4 px-5 py-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLineColor(c.score) }} />
                <span className="min-w-[160px] text-sm text-foreground">{c.label}</span>
                <div className="flex-1 h-[17px]"><Sparkline card={c} gradId={`v10-${c.label}`} /></div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },

  // ───────── 11 — Notch ribbon
  {
    id: "v11",
    nome: "11. Fita lateral",
    descricao: "Ribbon recortada com chevron à esquerda",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div key={c.label} className="flex items-center gap-4 px-4 py-4 relative">
            {c.highlight && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-stretch h-9">
                <div className="bg-[#FF5722] text-white px-3 flex items-center text-[10px] font-black uppercase tracking-widest shadow-md">Nexti</div>
                <div className="w-0 h-0 border-y-[18px] border-y-transparent border-l-[12px] border-l-[#FF5722]" />
              </div>
            )}
            <div className={c.highlight ? "ml-[88px]" : ""}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score) }} />
            </div>
            <span className={`min-w-[140px] ${c.highlight ? "text-sm font-bold text-[#FF5722]" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v11-${c.label}`} /></div>
            {c.highlight && <span className="text-sm font-bold text-[#FF5722] tabular-nums">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 12 — Soft 3D card
  {
    id: "v12",
    nome: "12. Card 3D suave",
    descricao: "Linha Nexti elevada com sombra dupla",
    render: (cards) => (
      <div className="p-3 space-y-2 bg-orange-50/20">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl bg-white ${
              c.highlight
                ? "shadow-[0_1px_0_rgba(255,87,34,0.4),0_8px_20px_-6px_rgba(255,87,34,0.4)] -translate-y-px"
                : "shadow-sm"
            }`}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score) }} />
            <span className={`min-w-[160px] ${c.highlight ? "text-sm font-bold text-[#FF5722]" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v12-${c.label}`} /></div>
            {c.highlight && <span className="text-sm font-black text-[#FF5722] tabular-nums">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 13 — Underline accent
  {
    id: "v13",
    nome: "13. Sublinhado animado",
    descricao: "Borda inferior gradiente sob a linha Nexti",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-4 px-4 py-4 relative"
            style={c.highlight ? { borderImage: `linear-gradient(90deg, ${ORANGE}, transparent) 1`, borderBottom: `2px solid` } : undefined}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score) }} />
            <span className={`min-w-[160px] ${c.highlight ? "text-base font-black text-[#FF5722] tracking-tight" : "text-sm text-foreground"}`}>
              {c.label}
              {c.highlight && <span className="ml-1 text-[#FF5722]">.</span>}
            </span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v13-${c.label}`} /></div>
            {c.highlight && <span className="text-sm font-bold text-[#FF5722] tabular-nums">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 14 — Inset card
  {
    id: "v14",
    nome: "14. Inset embutido",
    descricao: "Linha Nexti embutida dentro de um painel",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          c.highlight ? (
            <div key={c.label} className="p-2">
              <div className="flex items-center gap-4 px-4 py-3 bg-[#FFF3EE] rounded-lg shadow-[inset_0_2px_4px_rgba(255,87,34,0.18)] border border-[#FF5722]/20">
                <Flame className="w-4 h-4 text-[#FF5722]" />
                <span className="min-w-[160px] text-sm font-bold text-[#FF5722]">{c.label}</span>
                <div className="flex-1 h-[26px]"><Sparkline card={c} gradId={`v14-${c.label}`} /></div>
                <span className="text-sm font-black text-[#FF5722] tabular-nums">{c.score}</span>
              </div>
            </div>
          ) : (
            <div key={c.label} className="flex items-center gap-4 px-4 py-4">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLineColor(c.score) }} />
              <span className="min-w-[160px] text-sm text-foreground">{c.label}</span>
              <div className="flex-1 h-[17px]"><Sparkline card={c} gradId={`v14-${c.label}`} /></div>
            </div>
          )
        ))}
      </div>
    ),
  },

  // ───────── 15 — Corner ribbon
  {
    id: "v15",
    nome: "15. Cantoneira",
    descricao: "Triângulo decorativo no canto superior",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div key={c.label} className={`flex items-center gap-4 px-4 py-4 relative overflow-hidden ${c.highlight ? "bg-orange-50/30" : ""}`}>
            {c.highlight && (
              <>
                <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-[#FF5722] border-r-[40px] border-r-transparent" />
                <Star className="absolute top-1 left-1 w-3 h-3 text-white fill-white" />
              </>
            )}
            <div className={c.highlight ? "ml-8" : ""}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score) }} />
            </div>
            <span className={`min-w-[140px] ${c.highlight ? "text-sm font-bold text-[#FF5722]" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v15-${c.label}`} /></div>
            {c.highlight && <span className="text-sm font-bold text-[#FF5722] tabular-nums">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 16 — Trend gauge
  {
    id: "v16",
    nome: "16. Mini-gauge à esquerda",
    descricao: "Anel circular do score na lateral",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div key={c.label} className={`flex items-center gap-4 px-4 py-4 ${c.highlight ? "bg-orange-50/20" : ""}`}>
            {c.highlight ? (
              <div className="relative w-10 h-10 shrink-0">
                <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#FFE0D2" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(c.score / 100) * 94.2} 94.2`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-[#FF5722] tabular-nums">{c.score}</div>
              </div>
            ) : (
              <div className="w-2 h-2 rounded-full ml-4" style={{ backgroundColor: getLineColor(c.score) }} />
            )}
            <span className={`min-w-[140px] ${c.highlight ? "text-sm font-bold text-[#FF5722]" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v16-${c.label}`} /></div>
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 17 — Banner above
  {
    id: "v17",
    nome: "17. Banner superior",
    descricao: "Faixa fina laranja sobre a linha Nexti",
    render: (cards) => (
      <div>
        {cards.map((c) => (
          <div key={c.label}>
            {c.highlight && (
              <div className="flex items-center gap-2 px-4 py-1 bg-[#FF5722] text-white text-[9px] font-black uppercase tracking-[0.25em]">
                <Zap className="w-3 h-3" />
                Score consolidado · resultado da operação
              </div>
            )}
            <div className={`flex items-center gap-4 px-4 py-4 border-b border-border/40 ${c.highlight ? "bg-orange-50/30" : ""}`}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score) }} />
              <span className={`min-w-[160px] ${c.highlight ? "text-base font-extrabold text-[#FF5722]" : "text-sm text-foreground"}`}>{c.label}</span>
              <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v17-${c.label}`} /></div>
              {c.highlight && <span className="text-base font-black text-[#FF5722] tabular-nums">{c.score}</span>}
            </div>
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 18 — Bracket frame
  {
    id: "v18",
    nome: "18. Moldura em colchete",
    descricao: "Colchetes laranja envolvendo a linha",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div key={c.label} className="flex items-center gap-4 px-4 py-4 relative">
            {c.highlight && (
              <>
                <div className="absolute left-2 top-2 bottom-2 w-2 border-l-2 border-y-2 border-[#FF5722] rounded-l-md" />
                <div className="absolute right-2 top-2 bottom-2 w-2 border-r-2 border-y-2 border-[#FF5722] rounded-r-md" />
              </>
            )}
            <div className={c.highlight ? "ml-4" : ""}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score) }} />
            </div>
            <span className={`min-w-[150px] ${c.highlight ? "text-sm font-bold text-[#FF5722] uppercase tracking-wide" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v18-${c.label}`} /></div>
            {c.highlight && <span className="mr-4 text-sm font-bold text-[#FF5722] tabular-nums">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 19 — Watermark big
  {
    id: "v19",
    nome: "19. Marca d’água",
    descricao: "Score gigante translúcido atrás do gráfico",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          <div key={c.label} className={`flex items-center gap-4 px-4 py-4 relative overflow-hidden ${c.highlight ? "bg-orange-50/20" : ""}`}>
            {c.highlight && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[64px] font-black leading-none text-[#FF5722]/8 select-none pointer-events-none tabular-nums">
                {c.score}
              </span>
            )}
            <div className="w-2 h-2 rounded-full relative z-10" style={{ backgroundColor: c.forceColor ?? getLineColor(c.score) }} />
            <span className={`min-w-[160px] relative z-10 ${c.highlight ? "text-base font-black text-[#FF5722]" : "text-sm text-foreground"}`}>{c.label}</span>
            <div className={`flex-1 relative z-10 ${c.highlight ? "h-[26px]" : "h-[17px]"}`}><Sparkline card={c} gradId={`v19-${c.label}`} /></div>
            {c.highlight && <span className="text-sm font-bold text-[#FF5722] tabular-nums relative z-10">{c.score}</span>}
          </div>
        ))}
      </div>
    ),
  },

  // ───────── 20 — Editorial split
  {
    id: "v20",
    nome: "20. Split editorial",
    descricao: "Coluna lateral colorida com tag e métrica",
    render: (cards) => (
      <div className="divide-y divide-border/40">
        {cards.map((c) => (
          c.highlight ? (
            <div key={c.label} className="grid grid-cols-[200px_1fr] gap-0">
              <div className="bg-gradient-to-br from-[#FF5722] to-[#E64A19] text-white px-4 py-4 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] opacity-90">
                  <Target className="w-3 h-3" /> Indicador-mestre
                </div>
                <div className="text-base font-black mt-1 leading-tight">{c.label}</div>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-2xl font-black tabular-nums leading-none">{c.score}</span>
                  <span className="text-[10px] font-semibold opacity-80">/100</span>
                </div>
              </div>
              <div className="px-4 py-4 flex items-center bg-orange-50/20">
                <div className="w-full h-[34px]"><Sparkline card={c} gradId={`v20-${c.label}`} heightOverride={34} /></div>
              </div>
            </div>
          ) : (
            <div key={c.label} className="grid grid-cols-[200px_1fr] gap-0">
              <div className="px-4 py-4 flex items-center gap-2 bg-muted/20">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLineColor(c.score) }} />
                <span className="text-sm text-foreground">{c.label}</span>
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">{c.score}</span>
              </div>
              <div className="px-4 py-4 flex items-center">
                <div className="w-full h-[17px]"><Sparkline card={c} gradId={`v20-${c.label}`} /></div>
              </div>
            </div>
          )
        ))}
      </div>
    ),
  },
];

export default function NextiHighlightVariants({ cards }: Props) {
  return (
    <div className="space-y-4">
      <div className="px-1">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FF5722]" />
          20 variações de destaque — Score Nexti
        </h3>
        <p className="text-xs text-muted-foreground">Escolha a estética que melhor representa o indicador-mestre</p>
      </div>

      {VARIANTS.map((variant) => (
        <div key={variant.id} className="bg-card border border-border/50 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-muted/30">
            <span className="text-xs font-bold text-foreground">{variant.nome}</span>
            <span className="text-[10px] text-muted-foreground italic">{variant.descricao}</span>
          </div>
          {variant.render(cards)}
        </div>
      ))}
    </div>
  );
}
