import { useState, useMemo } from "react";
import { Lightbulb, ExternalLink, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { mockInsights, type Insight } from "@/data/insightsMockData";
import { useDismissedInsights } from "@/hooks/useDismissedInsights";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/* ── colour maps ────────────────────────────────────── */
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
  critical: "RISCO CRÍTICO",
  achievement: "CONQUISTA",
  event: "EVENTO DETECTADO",
  opportunity: "OPORTUNIDADE",
  trend: "TENDÊNCIA",
};

const chipLabel: Record<string, string> = {
  all: "Todos",
  critical: "Riscos",
  achievement: "Conquistas",
  event: "Eventos",
  opportunity: "Oportunidades",
  trend: "Tendências",
};

const severityBadgeColor: Record<string, string> = {
  critical: "#A32D2D",
  warning: "#BA7517",
  info: "#185FA5",
  success: "#3B6D11",
};

/* priority sort order */
const catPriority: Record<Cat, number> = { critical: 0, event: 1, achievement: 2, opportunity: 3, trend: 4 };

/* ── Component ──────────────────────────────────────── */
export default function InsightsCenter() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const { dismissed, dismiss, restore } = useDismissedInsights("642");
  const [fadingOut, setFadingOut] = useState<string | null>(null);

  const activeInsights = useMemo(
    () =>
      mockInsights
        .filter((i) => !dismissed.includes(i.id))
        .sort((a, b) => catPriority[a.category] - catPriority[b.category]),
    [dismissed]
  );

  const filtered = useMemo(
    () => (filter === "all" ? activeInsights : activeInsights.filter((i) => i.category === filter)),
    [activeInsights, filter]
  );

  const maxSeverity = useMemo(() => {
    const order = ["critical", "warning", "info", "success"];
    for (const s of order) {
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
    setTimeout(() => {
      dismiss(id);
      setFadingOut(null);
    }, 200);
  };

  const handleFilter = (ins: Insight) => {
    if (!ins.actionFilter) return;
    // Future: apply filters to the main page via context
    setOpen(false);
  };

  const chipKeys = ["all", "critical", "achievement", "event", "opportunity", "trend"];

  return (
    <>
      {/* ── Trigger button ── */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 transition-all hover:brightness-[0.97]"
            style={{
              padding: "6px 12px",
              borderRadius: 9999,
              background: "linear-gradient(180deg, #FAEEDA 0%, #F5C4B3 100%)",
              border: "0.5px solid #BA7517",
              color: "#854F0B",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <Lightbulb size={14} />
            <span>Insights</span>
            <span
              style={{
                padding: "1px 6px",
                borderRadius: 9999,
                fontSize: 10,
                fontWeight: 500,
                minWidth: 16,
                textAlign: "center",
                background: severityBadgeColor[maxSeverity],
                color: "white",
              }}
            >
              {activeInsights.length}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent>Ver insights gerados a partir dos seus dados</TooltipContent>
      </Tooltip>

      {/* ── Sheet ── */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="p-0 w-[480px] max-w-full flex flex-col [&>button]:hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b px-4 py-4" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} style={{ color: "#BA7517" }} />
                <span style={{ fontSize: 15, fontWeight: 500 }}>Central de Insights</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
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
                    style={{
                      padding: "4px 10px",
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 500,
                      background: active ? c.bgActive : c.bg,
                      color: active ? c.textActive : c.text,
                      transition: "all 150ms",
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
                <Lightbulb size={32} className="text-gray-300" />
                <p style={{ fontSize: 13, color: "#6b7280" }}>Nenhum insight ativo no momento.</p>
                {dismissed.length > 0 && (
                  <button onClick={restore} style={{ fontSize: 11, color: "#6b7280", textDecoration: "underline" }}>
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
                    {/* Row 1: meta */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                          background: cc.badgeBg,
                          color: cc.badgeText,
                        }}
                      >
                        {catLabel[ins.category]}
                      </span>
                      <span style={{ fontSize: 10, color: "#9ca3af" }}>
                        {ins.tabOrigin} · {ins.timestamp}
                      </span>
                    </div>

                    {/* Row 2: título */}
                    <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, marginBottom: 4, color: "#111827" }}>
                      {ins.title}
                    </p>

                    {/* Row 3: narrativa */}
                    <p style={{ fontSize: 12, lineHeight: 1.4, color: "#4b5563", marginBottom: 8 }}>
                      {ins.narrative}
                    </p>

                    {/* Row 4: evidence */}
                    {ins.evidence && (
                      <div
                        className="flex items-center gap-2 mb-2"
                        style={{ background: "#F1EFE8", borderRadius: 4, padding: 8 }}
                      >
                        <div>
                          <span style={{ fontSize: 10, color: "#9ca3af", display: "block" }}>{ins.evidence.before.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{ins.evidence.before.value}</span>
                        </div>
                        <span style={{ color: "#d1d5db", fontSize: 14 }}>→</span>
                        <div>
                          <span style={{ fontSize: 10, color: "#9ca3af", display: "block" }}>{ins.evidence.after.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{ins.evidence.after.value}</span>
                        </div>
                      </div>
                    )}

                    {/* Row 5: ações */}
                    <div className="flex gap-1.5">
                      {ins.actionFilter && (
                        <button
                          onClick={() => handleFilter(ins)}
                          className="inline-flex items-center gap-1"
                          style={{
                            background: "#2C2C2A",
                            color: "white",
                            padding: "4px 10px",
                            borderRadius: 4,
                            fontSize: 11,
                          }}
                        >
                          Filtrar contexto <ExternalLink size={10} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(ins.id)}
                        style={{
                          background: "transparent",
                          color: "#6b7280",
                          border: "0.5px solid #e5e7eb",
                          padding: "4px 10px",
                          borderRadius: 4,
                          fontSize: 11,
                        }}
                      >
                        Dispensar
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Restore footer */}
            {dismissed.length > 0 && filtered.length > 0 && (
              <div className="text-center pt-2 pb-4">
                <button onClick={restore} style={{ fontSize: 11, color: "#6b7280", textDecoration: "underline" }}>
                  Restaurar dispensados
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Keyframe for cascade animation */}
      <style>{`
        @keyframes insightCardIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
