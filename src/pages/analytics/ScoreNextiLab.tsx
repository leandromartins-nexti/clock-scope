import { ScoreGauge } from "@/components/analytics/ScoreGauge";
import { TrendingUp, Sparkles, Award, Zap, Activity } from "lucide-react";

const SCORE = 78;
const LABEL = "Bom";
const COLOR = "#22c55e";
const ORANGE = "#FF5722";

const Gauge = () => (
  <ScoreGauge score={SCORE} label={`${SCORE}`} faixa={LABEL} color={COLOR} />
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
    {children}
  </div>
);

const variants = [
  {
    name: "1. Glow Halo",
    desc: "Halo de luz laranja difuso ao redor",
    render: () => (
      <div className="relative rounded-xl bg-[#F5F0E6] p-3 border border-[#FF5722]/30"
        style={{ boxShadow: "0 0 0 4px rgba(255,87,34,0.08), 0 0 24px rgba(255,87,34,0.35)" }}>
        <Title>Score Nexti</Title>
        <Gauge />
      </div>
    ),
  },
  {
    name: "2. Gradient Border",
    desc: "Borda com gradient laranja → âmbar",
    render: () => (
      <div className="rounded-xl p-[2px]" style={{ background: "linear-gradient(135deg,#FF5722,#FFB300,#FF5722)" }}>
        <div className="rounded-[10px] bg-[#F5F0E6] p-3">
          <Title>Score Nexti</Title>
          <Gauge />
        </div>
      </div>
    ),
  },
  {
    name: "3. Premium Dark",
    desc: "Fundo escuro elegante, dourado",
    render: () => (
      <div className="rounded-xl p-3 border border-amber-400/40"
        style={{ background: "linear-gradient(160deg,#1a1a2e,#16213e)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
          <Award className="h-3 w-3" /> Score Nexti
        </div>
        <Gauge />
      </div>
    ),
  },
  {
    name: "4. Glassmorphism",
    desc: "Vidro fosco com blur",
    render: () => (
      <div className="relative rounded-xl p-3 border border-white/40 backdrop-blur-xl overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(255,87,34,0.15),rgba(255,179,0,0.1))", boxShadow: "0 8px 32px rgba(255,87,34,0.2)" }}>
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#FF5722]/30 blur-2xl" />
        <Title>Score Nexti</Title>
        <Gauge />
      </div>
    ),
  },
  {
    name: "5. Top Accent Bar",
    desc: "Barra colorida superior, minimalista",
    render: () => (
      <div className="rounded-xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="h-1.5" style={{ background: "linear-gradient(90deg,#FF5722,#FFB300)" }} />
        <div className="p-3">
          <Title>Score Nexti</Title>
          <Gauge />
        </div>
      </div>
    ),
  },
  {
    name: "6. Ribbon Badge",
    desc: "Fita 'Hero' no canto superior",
    render: () => (
      <div className="relative rounded-xl bg-[#F5F0E6] p-3 border-2 border-[#FF5722] shadow-md">
        <div className="absolute -top-2 -right-2 bg-[#FF5722] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5" /> Master
        </div>
        <Title>Score Nexti</Title>
        <Gauge />
      </div>
    ),
  },
  {
    name: "7. Neon Pulse",
    desc: "Borda neon com sombra interna",
    render: () => (
      <div className="rounded-xl bg-[#0f0f1a] p-3 border border-[#FF5722]"
        style={{ boxShadow: "inset 0 0 20px rgba(255,87,34,0.3), 0 0 16px rgba(255,87,34,0.5)" }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#FF5722] mb-2 flex items-center gap-1.5">
          <Zap className="h-3 w-3" /> Score Nexti
        </div>
        <Gauge />
      </div>
    ),
  },
  {
    name: "8. Embossed Cream",
    desc: "Relevo suave estilo neumorphism",
    render: () => (
      <div className="rounded-2xl bg-[#F5F0E6] p-3"
        style={{ boxShadow: "8px 8px 16px rgba(180,160,130,0.4), -4px -4px 12px rgba(255,255,255,0.8)" }}>
        <Title>Score Nexti</Title>
        <Gauge />
      </div>
    ),
  },
  {
    name: "9. Corner L-Frame",
    desc: "Cantos decorativos estilo HUD",
    render: () => (
      <div className="relative rounded-xl bg-[#F5F0E6] p-3 border border-border/30">
        {[
          "top-1 left-1 border-t-2 border-l-2",
          "top-1 right-1 border-t-2 border-r-2",
          "bottom-1 left-1 border-b-2 border-l-2",
          "bottom-1 right-1 border-b-2 border-r-2",
        ].map((c, i) => (
          <div key={i} className={`absolute w-3 h-3 border-[#FF5722] ${c}`} />
        ))}
        <Title>Score Nexti</Title>
        <Gauge />
      </div>
    ),
  },
  {
    name: "10. Side Stripe",
    desc: "Faixa lateral colorida com ícone",
    render: () => (
      <div className="rounded-xl bg-card border border-border overflow-hidden shadow-sm flex">
        <div className="w-1.5" style={{ background: "linear-gradient(180deg,#FF5722,#FFB300)" }} />
        <div className="flex-1 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-[#FF5722]" /> Score Nexti
          </div>
          <Gauge />
        </div>
      </div>
    ),
  },
];

export default function ScoreNextiLab() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Score Nexti — Lab de Variações</h1>
        <p className="text-sm text-muted-foreground">10 propostas criativas para o card hero. Escolha a que mais combina com a identidade.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {variants.map((v) => (
          <div key={v.name} className="space-y-2">
            <div className="text-xs font-bold text-foreground">{v.name}</div>
            <div className="text-[10px] text-muted-foreground italic">{v.desc}</div>
            <div className="min-h-[140px]">{v.render()}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-muted/40 text-xs text-muted-foreground">
        <strong>Dica:</strong> me diga o número (ex: "quero a 3") e aplico no card real do Resumo Executivo.
      </div>
    </div>
  );
}
