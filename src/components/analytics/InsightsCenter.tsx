import { useState, useMemo } from "react";
import { Lightbulb, ExternalLink, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { mockInsights, type Insight } from "@/data/insightsMockData";
import { useDismissedInsights } from "@/hooks/useDismissedInsights";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

type Cat = Insight["category"];

const chipColors: Record<string, { bg: string; text: string; bgActive: string; textActive: string }> = {
  all:         { bg: "#F1EFE8", text: "#444441", bgActive: "#2C2C2A", textActive: "#ffffff" },
  critical:    { bg: "#FCEBEB", text: "#791F1F", bgActive: "#A32D2D", textActive: "#ffffff" },
  achievement: { bg: "#EAF3DE", text: "#27500A", bgActive: "#3B6D11", textActive: "#ffffff" },
  event:       { bg: "#E6F1FB", text: "#0C447C", bgActive: "#185FA5", textActive: "#ffffff" },
  opportunity: { bg: "#FAEEDA", text: "#633806", bgActive: "#BA7517", textActive: "#ffffff" },
  trend:       { bg: "#F1EFE8", text: "#444441", bgActive: "#5F5E5A", textActive: "#ffffff" },
};

const cardColors: Record<Cat, { border: string; borderLeft: string; badgeBg: string; badgeText: string }> = {
  critical:    { border: "#F09595", borderLeft: "#A32D2D", badgeBg: "#FCEBEB", badgeText: "#791F1F" },
  achievement: { border: "#97C459", borderLeft: "#3B6D11", badgeBg: "#EAF3DE", badgeText: "#27500A" },
  event:       { border: "#85B7EB", borderLeft: "#185FA5", badgeBg: "#E6F1FB", badgeText: "#0C447C" },
  opportunity: { border: "#EF9F27", borderLeft: "#BA7517", badgeBg: "#FAEEDA", badgeText: "#633806" },
  trend:       { border: "#B4B2A9", borderLeft: "#5F5E5A", badgeBg: "#F1EFE8", badgeText: "#444441" },
};

const catLabel: Record<Cat, string> = {
  critical: "RISCO CRÍTICO", achievement: "CONQUISTA", event: "EVENTO DETECTADO",
  opportunity: "OPORTUNIDADE", trend: "TENDÊNCIA",
};

const chipLabel: Record<string, string> = {
  all: "Todos", critical: "Riscos", achievement: "Conquistas",
  event: "Eventos", opportunity: "Oportunidades", trend: "Tendências",
};

const severityBadgeColor: Record<string, string> = {
  critical: "#A32D2D", warning: "#BA7517", info: "#185FA5", success: "#3B6D11",
};

const catPriority: Record<Cat, number> = { critical: 0, event: 1, achievement: 2, opportunity: 3, trend: 4 };

export default function InsightsCenter() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const { dismissed, dismiss, restore } = useDismissedInsights("642");
  const [fadingOut, setFadingOut] = useState<string | null>(null);

  const activeInsights = useMemo(
    () => mockInsights.filter((i) => !dismissed.includes(i.id)).sort((a, b) => catPriority[a.category] - catPriority[b.category]),
    [dismissed]
  );

  const filtered = useMemo(
    () => (filter === "all" ? activeInsights : activeInsights.filter((i) => i.category === filter)),
    [activeInsights, filter]
  );

  const maxSeverity = useMemo(() => {
    for (const s of ["critical", "warning", "info", "success"]) {
      if (activeInsights.some((i) => i.severity === s)) return s;
    }
    return "info";
  }, [activeInsights]);

  const countByCategory = useMemo(() => {
    const m: Record<string, number> = { all: activeInsights.length };
    for (const i of activeInsights) m[i.category] = (m[i.category] || 0) + 1;
    return m;
  }, [activeInsights]);

  const handleDismiss = (id: string) => {
    setFadingOut(id);
    setTimeout(() => { dismiss(id); setFadingOut(null); }, 200);
  };

  const chipKeys = ["all", "critical", "achievement", "event", "opportunity", "trend"];

  return (
    <>
      {/* Icon-only trigger */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Lightbulb size={18} />
            {activeInsights.length > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center text-white"
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 9999,
                  padding: "0 4px",
                  background: severityBadgeColor[maxSeverity],
                }}
              >
                {activeInsights.length}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Insights gerados dos seus dados</TooltipContent>
      </Tooltip>

      {/* Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="p-0 w-[480px] max-w-full flex flex-col [&>button]:hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-[#FF5722]" />
                <span className="text-sm font-semibold text-foreground">Central de Insights</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {activeInsights.length} ativos · gerados dos seus dados
            </p>
            <div className="flex gap-1.5 flex-wrap mt-3">
              {chipKeys.map((key) => {
                const count = countByCategory[key] || 0;
                if (key !== "all" && count === 0) return null;
                const active = filter === key;
                const c = chipColors[key];
                return (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className="transition-all"
                    style={{
                      padding: "4px 10px",
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 500,
                      background: active ? c.bgActive : c.bg,
                      color: active ? c.textActive : c.text,
                    }}
                  >
                    {chipLabel[key]}·{count}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
            {filtered.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
                <Lightbulb size={32} className="text-muted-foreground/30" />
                <p className="text-[13px] text-muted-foreground">Nenhum insight ativo no momento.</p>
                {dismissed.length > 0 && (
                  <button onClick={restore} className="text-[11px] text-muted-foreground underline hover:text-foreground">
                    Restaurar dispensados
                  </button>
                )}
              </div>
            ) : (
              filtered.map((ins, idx) => {
                const cc = cardColors[ins.category];
                const isFading = fadingOut === ins.id;
                return (
                  <div
                    key={ins.id}
                    className="bg-white"
                    style={{
                      border: `0.5px solid ${cc.border}`,
                      borderLeft: `3px solid ${cc.borderLeft}`,
                      borderRadius: 8,
                      padding: 12,
                      opacity: isFading ? 0 : 1,
                      transform: isFading ? "translateY(8px)" : "translateY(0)",
                      transition: "opacity 200ms, transform 200ms",
                      animation: `insightCardIn 250ms ease-out ${idx * 50}ms both`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        style={{
                          padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 500,
                          textTransform: "uppercase", letterSpacing: "0.4px",
                          background: cc.badgeBg, color: cc.badgeText,
                        }}
                      >
                        {catLabel[ins.category]}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {ins.tabOrigin} · {ins.timestamp}
                      </span>
                    </div>

                    <p className="text-[13px] font-medium leading-tight mb-1 text-foreground">{ins.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground mb-2">{ins.narrative}</p>

                    {ins.evidence && (
                      <div className="flex items-center gap-2 mb-2 bg-muted/50 rounded p-2">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">{ins.evidence.before.label}</span>
                          <span className="text-[13px] font-semibold">{ins.evidence.before.value}</span>
                        </div>
                        <span className="text-muted-foreground/50 text-sm">→</span>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">{ins.evidence.after.label}</span>
                          <span className="text-[13px] font-semibold">{ins.evidence.after.value}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-1.5">
                      {ins.actionFilter && (
                        <button
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 bg-foreground text-background text-[11px] px-2.5 py-1 rounded hover:opacity-90 transition-opacity"
                        >
                          Filtrar contexto <ExternalLink size={10} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(ins.id)}
                        className="text-[11px] text-muted-foreground border border-border px-2.5 py-1 rounded hover:bg-muted/50 transition-colors"
                      >
                        Dispensar
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {dismissed.length > 0 && filtered.length > 0 && (
              <div className="text-center pt-2 pb-4">
                <button onClick={restore} className="text-[11px] text-muted-foreground underline hover:text-foreground">
                  Restaurar dispensados
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <style>{`
        @keyframes insightCardIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
