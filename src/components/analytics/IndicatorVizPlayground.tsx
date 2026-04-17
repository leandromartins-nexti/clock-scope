import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  RadialBarChart, RadialBar, ComposedChart, Cell, ReferenceLine, XAxis, YAxis,
} from "recharts";
import { getLineColor, getScoreColor, getScoreBg } from "@/components/analytics/IndicatorTable";

interface EvoPoint { competencia: string; valor: number; }
interface CardData {
  label: string;
  evolucao: EvoPoint[];
  score: number;
  variacao: string;
  corVariacao: string;
  perPointColors?: boolean;
}

interface Props { card: CardData; }

const VIZ: { id: number; nome: string; render: (c: CardData) => JSX.Element }[] = [
  // 4 — Bar chart vertical mini (cores semânticas por barra)
  {
    id: 4,
    nome: "Barras verticais",
    render: (c) => (
      <ResponsiveContainer width="100%" height={32}>
        <BarChart data={c.evolucao} barGap={1}>
          <Bar dataKey="valor" radius={[2, 2, 0, 0]}>
            {c.evolucao.map((pt, i) => (
              <Cell key={i} fill={getLineColor(pt.valor)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    ),
  },
  // 5 — Dots only (sem linha) com tamanho proporcional ao valor
  {
    id: 5,
    nome: "Pontos sem linha",
    render: (c) => (
      <div className="flex items-center gap-[3px] h-full">
        {c.evolucao.map((pt, i) => {
          const size = 4 + (pt.valor / 100) * 8;
          return (
            <div key={i} className="flex-1 flex items-center justify-center" title={`${pt.competencia}: ${pt.valor}`}>
              <div className="rounded-full" style={{ width: size, height: size, backgroundColor: getLineColor(pt.valor) }} />
            </div>
          );
        })}
      </div>
    ),
  },
  // 6 — Sparkline degradê (linha grossa com gradiente vertical)
  {
    id: 6,
    nome: "Linha grossa gradiente",
    render: (c) => {
      const gradId = `vlin-${c.label}`;
      return (
        <ResponsiveContainer width="100%" height={32}>
          <LineChart data={c.evolucao}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey="valor" stroke={`url(#${gradId})`} strokeWidth={4} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      );
    },
  },
  // 7 — Heatmap com label de mês embaixo (compact)
  {
    id: 7,
    nome: "Heatmap com labels",
    render: (c) => (
      <div className="flex flex-col gap-0.5 h-full justify-center">
        <div className="flex items-center gap-[2px] h-4">
          {c.evolucao.map((pt, i) => (
            <div key={i} className="flex-1 h-full rounded-sm" style={{ backgroundColor: getLineColor(pt.valor) }} title={`${pt.competencia}: ${pt.valor}`} />
          ))}
        </div>
        <div className="flex items-center gap-[2px]">
          {c.evolucao.map((pt, i) => (
            <span key={i} className="flex-1 text-[7px] text-center text-muted-foreground leading-none">
              {pt.competencia.split('/')[0].slice(0, 1)}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  // 8 — Step line (escada) — bom pra mostrar mudanças bruscas
  {
    id: 8,
    nome: "Step line (escada)",
    render: (c) => (
      <ResponsiveContainer width="100%" height={32}>
        <LineChart data={c.evolucao}>
          <Line type="stepAfter" dataKey="valor" stroke={getLineColor(c.score)} strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    ),
  },
  // 9 — Lollipop (bolinha + haste vertical)
  {
    id: 9,
    nome: "Lollipop",
    render: (c) => {
      const max = Math.max(...c.evolucao.map(p => p.valor), 100);
      return (
        <div className="flex items-end gap-[3px] h-full pb-0.5">
          {c.evolucao.map((pt, i) => {
            const h = (pt.valor / max) * 100;
            const color = getLineColor(pt.valor);
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${pt.competencia}: ${pt.valor}`}>
                <div className="w-[2px]" style={{ height: `${h}%`, backgroundColor: color, opacity: 0.4 }} />
                <div className="w-2 h-2 rounded-full -mb-1" style={{ backgroundColor: color }} />
              </div>
            );
          })}
        </div>
      );
    },
  },
  // 10 — Faixa de status (verde/amarelo/vermelho) com marcador de score atual
  {
    id: 10,
    nome: "Bullet bar com benchmark",
    render: (c) => (
      <div className="relative h-3 rounded-full overflow-hidden flex w-full self-center">
        <div className="flex-1 bg-red-500/70" />
        <div className="flex-1 bg-yellow-500/70" />
        <div className="flex-1 bg-green-500/70" />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-foreground rounded shadow"
          style={{ left: `${c.score}%`, transform: `translate(-50%, -50%)` }}
          title={`Score atual: ${c.score}`}
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/60" style={{ left: '70%' }} title="Meta: 70" />
      </div>
    ),
  },
  // 11 — Stacked horizontal: distribuição de meses por faixa
  {
    id: 11,
    nome: "Distribuição por faixa",
    render: (c) => {
      const ruim = c.evolucao.filter(p => p.valor < 50).length;
      const med = c.evolucao.filter(p => p.valor >= 50 && p.valor < 70).length;
      const bom = c.evolucao.filter(p => p.valor >= 70).length;
      const total = c.evolucao.length;
      return (
        <div className="flex flex-col gap-1 justify-center h-full">
          <div className="flex h-3 rounded overflow-hidden">
            {ruim > 0 && <div className="bg-red-500" style={{ width: `${(ruim/total)*100}%` }} title={`${ruim} meses ruins`} />}
            {med > 0 && <div className="bg-yellow-500" style={{ width: `${(med/total)*100}%` }} title={`${med} meses médios`} />}
            {bom > 0 && <div className="bg-green-500" style={{ width: `${(bom/total)*100}%` }} title={`${bom} meses bons`} />}
          </div>
          <div className="flex justify-between text-[8px] text-muted-foreground">
            <span>{ruim} ruim</span>
            <span>{med} médio</span>
            <span>{bom} bom</span>
          </div>
        </div>
      );
    },
  },
  // 12 — Área com baseline em 70 (meta)
  {
    id: 12,
    nome: "Área com linha de meta",
    render: (c) => {
      const gradId = `meta-${c.label}`;
      return (
        <ResponsiveContainer width="100%" height={32}>
          <AreaChart data={c.evolucao}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={getLineColor(c.score)} stopOpacity={0.5} />
                <stop offset="100%" stopColor={getLineColor(c.score)} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 100]} />
            <ReferenceLine y={70} stroke="#94a3b8" strokeDasharray="2 2" strokeWidth={1} />
            <Area type="monotone" dataKey="valor" stroke={getLineColor(c.score)} strokeWidth={2} fill={`url(#${gradId})`} />
          </AreaChart>
        </ResponsiveContainer>
      );
    },
  },
  // 13 — Setas de tendência por mês (▲ ▼ ●)
  {
    id: 13,
    nome: "Setas de tendência",
    render: (c) => (
      <div className="flex items-center gap-[2px] h-full">
        {c.evolucao.map((pt, i) => {
          const prev = i > 0 ? c.evolucao[i - 1].valor : pt.valor;
          const diff = pt.valor - prev;
          const arrow = diff > 1 ? "▲" : diff < -1 ? "▼" : "●";
          const color = diff > 1 ? "#16a34a" : diff < -1 ? "#dc2626" : "#94a3b8";
          return (
            <div key={i} className="flex-1 flex items-center justify-center text-[10px] leading-none font-bold" style={{ color }} title={`${pt.competencia}: ${pt.valor}`}>
              {arrow}
            </div>
          );
        })}
      </div>
    ),
  },
];

export default function IndicatorVizPlayground({ card }: Props) {
  return (
    <div className="bg-card border border-border/50 rounded-xl mt-4">
      <div className="px-4 py-3 border-b border-border/40">
        <p className="text-xs font-semibold text-foreground">🧪 Validação de visualizações — opções 4 a 13</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Cada linha replica o indicador "{card.label}" usando uma visualização diferente</p>
      </div>
      <div className="divide-y divide-border/40">
        {VIZ.map((v) => (
          <div key={v.id} className="flex items-center gap-4 px-4 py-2.5 hover:bg-muted/30 transition-colors">
            <span className="text-[10px] font-mono text-muted-foreground w-6 shrink-0">#{v.id}</span>
            <span className="text-sm font-medium text-foreground min-w-[180px]">{v.nome}</span>
            <div className="flex-1 min-w-[120px] h-[32px]">
              {v.render(card)}
            </div>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full min-w-[65px] text-center ${card.corVariacao} ${
              card.corVariacao.includes('green') ? 'bg-green-50' : card.corVariacao.includes('red') ? 'bg-red-50' : 'bg-gray-50'
            }`}>{card.variacao}</span>
            <span className={`text-xs font-bold min-w-[45px] text-center px-1.5 py-0.5 rounded ${getScoreColor(card.score)} ${getScoreBg(card.score)}`}>{card.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
