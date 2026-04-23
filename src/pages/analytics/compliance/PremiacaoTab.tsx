/**
 * Aba Premiação — Compliance
 *
 * Segue o padrão visual da aba Qualidade do Ponto (Operacional):
 *  - Header de 6 colunas: ScoreBoard (Score Médio) + 5 KPIBoards (1 por pilar)
 *  - 3 cards de gráficos (distribuição, medalhas por pilar, top de elegíveis)
 *  - Tabela de ranking Top 20 / Top 50 alternável
 */

import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Cell, LabelList, ReferenceLine, Legend,
} from "recharts";
import { Trophy, Medal, Award, Star, Sparkles, TrendingUp, Search } from "lucide-react";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import {
  colaboradoresPremiacao, computeScoreComposto, getColaboradorScore, rankColaboradores,
  PILAR_LABELS, PILAR_PESOS, type PilarKey, type ColaboradorPremiacao,
} from "@/data/premiacao/colaboradores";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Cores ─────────────────────────────────────────────────────
const COLOR_OURO = "#D4AF37";
const COLOR_PRATA = "#9CA3AF";
const COLOR_BRONZE = "#CD7F32";
const COLOR_ORANGE = "#FF5722";

function scoreColor(s: number): string {
  if (s >= 85) return "#22c55e";
  if (s >= 70) return COLOR_ORANGE;
  if (s >= 55) return "#f59e0b";
  return "#ef4444";
}

function scoreLabel(s: number): string {
  if (s >= 85) return "Excelente";
  if (s >= 70) return "Bom";
  if (s >= 55) return "Atenção";
  return "Crítico";
}

// ── Header KPIs ───────────────────────────────────────────────
function PremiacaoHeader({ scores }: { scores: ReturnType<typeof useScoresAggregates> }) {
  const pesoLabel = (k: keyof typeof PILAR_PESOS) =>
    `Peso no Score Composto: ${PILAR_PESOS[k]}%`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
      <ScoreBoard
        title="Score Médio"
        tooltip="Média do Score Composto de Premiação dos colaboradores ativos no período. Score = média ponderada dos 5 pilares (Ponto 25%, Assiduidade 25%, Tratativa 20%, Pontualidade 15%, Permanência 15%)."
      >
        <ScoreGauge score={scores.medio} faixa={scoreLabel(scores.medio)} />
      </ScoreBoard>

      <KPIBoard
        title="Qualidade do Ponto"
        tooltip={pesoLabel("ponto")}
        value={`${scores.medioPonto.toFixed(1)}`}
        valueColor=""
        valueStyle={{ color: scoreColor(scores.medioPonto) }}
        subtitle={scoreLabel(scores.medioPonto)}
        subtitleStyle={{ color: scoreColor(scores.medioPonto) }}
        icon={<Star className="w-3.5 h-3.5 text-muted-foreground" />}
      />
      <KPIBoard
        title="Assiduidade"
        tooltip={pesoLabel("absenteismo")}
        value={`${scores.medioAbs.toFixed(1)}`}
        valueColor=""
        valueStyle={{ color: scoreColor(scores.medioAbs) }}
        subtitle={scoreLabel(scores.medioAbs)}
        subtitleStyle={{ color: scoreColor(scores.medioAbs) }}
        icon={<Sparkles className="w-3.5 h-3.5 text-muted-foreground" />}
      />
      <KPIBoard
        title="Tratativa Rápida"
        tooltip={pesoLabel("tratativa")}
        value={`${scores.medioTrat.toFixed(1)}`}
        valueColor=""
        valueStyle={{ color: scoreColor(scores.medioTrat) }}
        subtitle={scoreLabel(scores.medioTrat)}
        subtitleStyle={{ color: scoreColor(scores.medioTrat) }}
        icon={<TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />}
      />
      <KPIBoard
        title="Pontualidade"
        tooltip={pesoLabel("pontualidade")}
        value={`${scores.medioPont.toFixed(1)}`}
        valueColor=""
        valueStyle={{ color: scoreColor(scores.medioPont) }}
        subtitle={scoreLabel(scores.medioPont)}
        subtitleStyle={{ color: scoreColor(scores.medioPont) }}
        icon={<Award className="w-3.5 h-3.5 text-muted-foreground" />}
      />
      <KPIBoard
        title="Permanência"
        tooltip={pesoLabel("permanencia")}
        value={`${scores.medioPerm.toFixed(1)}`}
        valueColor=""
        valueStyle={{ color: scoreColor(scores.medioPerm) }}
        subtitle={scoreLabel(scores.medioPerm)}
        subtitleStyle={{ color: scoreColor(scores.medioPerm) }}
        icon={<Trophy className="w-3.5 h-3.5 text-muted-foreground" />}
      />
    </div>
  );
}

function useScoresAggregates() {
  return useMemo(() => {
    const list = colaboradoresPremiacao;
    const avg = (sel: (c: ColaboradorPremiacao) => number) =>
      list.reduce((s, c) => s + sel(c), 0) / list.length;
    return {
      medio: avg(computeScoreComposto),
      medioPonto: avg(c => c.scorePonto),
      medioAbs: avg(c => c.scoreAbsenteismo),
      medioTrat: avg(c => c.scoreTratativa),
      medioPont: avg(c => c.scorePontualidade),
      medioPerm: avg(c => c.scorePermanencia),
    };
  }, []);
}

// ── Gráfico 1: Distribuição de Scores ─────────────────────────
function DistribuicaoScores() {
  const data = useMemo(() => {
    const buckets = [
      { faixa: "Crítico (<55)", min: 0, max: 55, color: "#ef4444" },
      { faixa: "Atenção (55-69)", min: 55, max: 70, color: "#f59e0b" },
      { faixa: "Bom (70-84)", min: 70, max: 85, color: COLOR_ORANGE },
      { faixa: "Excelente (≥85)", min: 85, max: 101, color: "#22c55e" },
    ];
    return buckets.map(b => ({
      ...b,
      total: colaboradoresPremiacao.filter(c => {
        const s = computeScoreComposto(c);
        return s >= b.min && s < b.max;
      }).length,
    }));
  }, []);

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">Distribuição de Colaboradores por Faixa de Score</h3>
          <InfoTip text="Distribuição da população por faixa do Score Composto de Premiação. Quanto maior a concentração em Excelente, mais saudável o programa de reconhecimento." />
        </div>
        <Badge variant="outline" className="text-[10px]">
          Total: {colaboradoresPremiacao.length} colaboradores
        </Badge>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="faixa" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} label={{ value: "Colaboradores", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#6b7280" } }} />
          <RechartsTooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            formatter={(v: number) => [`${v} colaboradores`, "Total"]}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} fillOpacity={0.85} />
            ))}
            <LabelList dataKey="total" position="top" style={{ fontSize: 11, fontWeight: 600, fill: "#374151" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Gráfico 2: Medalhas Ouro / Prata / Bronze por Pilar ───────
function MedalhasPorPilar({ onSelectPilar }: { onSelectPilar: (p: PilarKey) => void }) {
  const pilares: { key: PilarKey; label: string }[] = [
    { key: "geral", label: "Geral" },
    { key: "ponto", label: "Ponto" },
    { key: "absenteismo", label: "Assiduidade" },
    { key: "tratativa", label: "Tratativa" },
    { key: "pontualidade", label: "Pontualidade" },
    { key: "permanencia", label: "Permanência" },
  ];

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <h3 className="text-sm font-semibold text-foreground">Medalhistas por Pilar</h3>
        <InfoTip text="Top 3 colaboradores em cada pilar — Ouro (1º), Prata (2º) e Bronze (3º). Clique em um pilar para abrir o ranking completo desse critério." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pilares.map(p => {
          const top3 = rankColaboradores(p.key).slice(0, 3);
          return (
            <button
              key={p.key}
              onClick={() => onSelectPilar(p.key)}
              className="text-left bg-gray-50 hover:bg-orange-50 border border-border/50 hover:border-orange-200 rounded-lg p-3 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground uppercase tracking-wide">{p.label}</span>
                <Trophy className="w-4 h-4 text-[#FF5722]" />
              </div>
              <ol className="space-y-2">
                {top3.map((c, i) => {
                  const cor = i === 0 ? COLOR_OURO : i === 1 ? COLOR_PRATA : COLOR_BRONZE;
                  const Icon = i === 0 ? Trophy : i === 1 ? Medal : Award;
                  return (
                    <li key={c.id} className="flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 shrink-0" style={{ color: cor }} />
                      <span className="font-medium text-foreground truncate flex-1">{c.nome}</span>
                      <span className="font-bold tabular-nums" style={{ color: scoreColor(c.scoreFinal) }}>
                        {c.scoreFinal.toFixed(0)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Tabela de Ranking ─────────────────────────────────────────
function RankingColaboradores({
  pilar, onPilarChange,
}: {
  pilar: PilarKey;
  onPilarChange: (p: PilarKey) => void;
}) {
  const [topN, setTopN] = useState<20 | 50>(20);
  const [search, setSearch] = useState("");

  const ranked = useMemo(() => {
    const all = rankColaboradores(pilar);
    const filtered = search.trim()
      ? all.filter(c =>
          c.nome.toLowerCase().includes(search.toLowerCase()) ||
          c.matricula.toLowerCase().includes(search.toLowerCase()) ||
          c.area.toLowerCase().includes(search.toLowerCase()),
        )
      : all;
    return filtered.slice(0, topN);
  }, [pilar, topN, search]);

  const pilarOptions: { key: PilarKey; label: string }[] = [
    { key: "geral", label: "Score Geral" },
    { key: "ponto", label: "Ponto" },
    { key: "absenteismo", label: "Assiduidade" },
    { key: "tratativa", label: "Tratativa" },
    { key: "pontualidade", label: "Pontualidade" },
    { key: "permanencia", label: "Permanência" },
  ];

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">
            Top {topN} Colaboradores — {PILAR_LABELS[pilar]}
          </h3>
          <InfoTip text="Ranking de colaboradores pelo critério selecionado. Indicação direta para premiação mensal (Top 20) ou menções honrosas (Top 50)." />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-gray-100 rounded-md p-0.5">
            {pilarOptions.map(p => (
              <button
                key={p.key}
                onClick={() => onPilarChange(p.key)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  pilar === p.key ? "bg-white text-[#FF5722] shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex bg-gray-100 rounded-md p-0.5">
            {[20, 50].map(n => (
              <button
                key={n}
                onClick={() => setTopN(n as 20 | 50)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  topN === n ? "bg-white text-[#FF5722] shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Top {n}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="pl-7 h-8 w-44 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground">
              <th className="text-left py-2.5 px-2 font-semibold w-12">#</th>
              <th className="text-left py-2.5 px-2 font-semibold">Colaborador</th>
              <th className="text-left py-2.5 px-2 font-semibold">Cargo</th>
              <th className="text-left py-2.5 px-2 font-semibold">Área</th>
              <th className="text-left py-2.5 px-2 font-semibold">Unidade</th>
              <th className="text-right py-2.5 px-2 font-semibold">Tempo Casa</th>
              <th className="text-right py-2.5 px-2 font-semibold">Score</th>
              <th className="text-center py-2.5 px-2 font-semibold">Reconhecimento</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map(c => {
              const isOuro = c.rank === 1;
              const isPrata = c.rank === 2;
              const isBronze = c.rank === 3;
              const isTop10 = c.rank <= 10;
              return (
                <tr key={c.id} className="border-b border-border/30 hover:bg-orange-50/40 transition-colors">
                  <td className="py-2.5 px-2 font-bold tabular-nums">
                    {isOuro && <Trophy className="w-4 h-4 inline" style={{ color: COLOR_OURO }} />}
                    {isPrata && <Medal className="w-4 h-4 inline" style={{ color: COLOR_PRATA }} />}
                    {isBronze && <Award className="w-4 h-4 inline" style={{ color: COLOR_BRONZE }} />}
                    {!isOuro && !isPrata && !isBronze && <span className="text-muted-foreground">{c.rank}</span>}
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="font-semibold text-foreground">{c.nome}</div>
                    <div className="text-xs text-muted-foreground">{c.matricula}</div>
                  </td>
                  <td className="py-2.5 px-2 text-muted-foreground">{c.cargo}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{c.area}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{c.unidade}</td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-muted-foreground">
                    {Math.floor(c.tempoCasaMeses / 12)}a {c.tempoCasaMeses % 12}m
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="font-bold tabular-nums" style={{ color: scoreColor(c.scoreFinal) }}>
                      {c.scoreFinal.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {isOuro && <Badge style={{ background: COLOR_OURO, color: "#fff" }} className="text-xs">🏆 Ouro</Badge>}
                    {isPrata && <Badge style={{ background: COLOR_PRATA, color: "#fff" }} className="text-xs">🥈 Prata</Badge>}
                    {isBronze && <Badge style={{ background: COLOR_BRONZE, color: "#fff" }} className="text-xs">🥉 Bronze</Badge>}
                    {!isOuro && !isPrata && !isBronze && isTop10 && (
                      <Badge variant="outline" className="text-xs border-orange-300 text-[#FF5722]">Destaque</Badge>
                    )}
                    {!isTop10 && c.rank <= 20 && (
                      <Badge variant="outline" className="text-xs">Premiável</Badge>
                    )}
                    {c.rank > 20 && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">Menção Honrosa</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
            {ranked.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground">
                  Nenhum colaborador encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Insights inline (resumo executivo da Premiação) ───────────
function PremiacaoInsights({ scores }: { scores: ReturnType<typeof useScoresAggregates> }) {
  const top = rankColaboradores("geral")[0];
  const excelentes = colaboradoresPremiacao.filter(c => computeScoreComposto(c) >= 85).length;
  const pctExcelente = ((excelentes / colaboradoresPremiacao.length) * 100).toFixed(1);

  const insights = [
    {
      icon: Trophy,
      titulo: "Destaque do mês",
      texto: `${top.nome} lidera o ranking geral com Score ${computeScoreComposto(top).toFixed(1)} — indicação imediata para premiação Ouro.`,
      cor: COLOR_OURO,
    },
    {
      icon: Sparkles,
      titulo: "Programa saudável",
      texto: `${pctExcelente}% dos colaboradores estão na faixa Excelente (≥85). Score médio do time: ${scores.medio.toFixed(1)}.`,
      cor: "#22c55e",
    },
    {
      icon: TrendingUp,
      titulo: "Pilar mais forte",
      texto: (() => {
        const map = [
          { k: "Pontualidade", v: scores.medioPont },
          { k: "Assiduidade", v: scores.medioAbs },
          { k: "Ponto", v: scores.medioPonto },
          { k: "Tratativa", v: scores.medioTrat },
          { k: "Permanência", v: scores.medioPerm },
        ].sort((a, b) => b.v - a.v)[0];
        return `${map.k} é o pilar com melhor desempenho coletivo (média ${map.v.toFixed(1)}). Reforce a comunicação dessa cultura.`;
      })(),
      cor: COLOR_ORANGE,
    },
  ];

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <h3 className="text-sm font-semibold text-foreground">Insights de Premiação</h3>
        <InfoTip text="Resumo automático com sugestões para o programa de reconhecimento, baseado no Score Composto e nos pilares." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div key={i} className="bg-gray-50 border border-border/40 rounded-lg p-3 flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-4 h-4 shrink-0" style={{ color: ins.cor }} />
                <span className="text-xs font-semibold text-foreground">{ins.titulo}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">{ins.texto}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Aba completa ──────────────────────────────────────────────
export default function PremiacaoTab() {
  const scores = useScoresAggregates();
  const [pilar, setPilar] = useState<PilarKey>("geral");

  return (
    <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4 overflow-y-auto">
      <PremiacaoHeader scores={scores} />
      <DistribuicaoScores />
      <MedalhasPorPilar onSelectPilar={setPilar} />
      <RankingColaboradores pilar={pilar} onPilarChange={setPilar} />
      <PremiacaoInsights scores={scores} />
    </div>
  );
}
