/**
 * AnalyticsFerias — aba "Férias" do hub Operacional.
 * Estrutura segue o template padrão: 6 KPIs no topo, grid 2×2 de gráficos,
 * sidebar de tipo de operação à direita e 3 insights no rodapé.
 */
import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  ComposedChart,
  Area,
} from "recharts";
import { Check, AlertTriangle, X, Calendar, Clock, CalendarRange } from "lucide-react";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import KPIRow from "@/components/analytics/kpi/KPIRow";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import { vacationData } from "@/lib/analytics-mock-data";

const COLORS = {
  green: "#22c55e",
  blue: "#3b82f6",
  orange: "#f97316",
  red: "#ef4444",
  yellow: "#f59e0b",
  greenLight: "#86efac",
};

function classifColor(level: "Bom" | "Atenção" | "Ruim" | "Crítico" | "Excelente") {
  if (level === "Excelente") return "text-green-600";
  if (level === "Bom") return "text-blue-600";
  if (level === "Atenção") return "text-orange-500";
  if (level === "Ruim") return "text-red-500";
  return "text-red-700";
}

function gaugeColor(score: number) {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#3b82f6";
  if (score >= 55) return "#f97316";
  return "#ef4444";
}

// Cor da bolha por faixa de score (regra fixa: ≥70 verde, 55-69 laranja, <55 vermelho)
function bubbleColor(score: number) {
  if (score >= 70) return "#22c55e";
  if (score >= 55) return "#f97316";
  return "#ef4444";
}

// ── Heatmap helpers ──
function heatmapColor(pct: number) {
  if (pct < 10) return "#dcfce7";
  if (pct < 20) return "#86efac";
  if (pct < 30) return "#fde68a";
  if (pct < 40) return "#fdba74";
  return "#fca5a5";
}

function reserveIcon(status: "ok" | "limit" | "gap") {
  if (status === "ok") return <Check size={9} className="text-green-600" />;
  if (status === "limit") return <AlertTriangle size={9} className="text-orange-500" />;
  return <X size={9} className="text-red-600" />;
}

// Renderiza um insight aplicando <strong> nos trechos especificados.
function renderInsightText(text: string, boldParts: string[]) {
  let nodes: (string | JSX.Element)[] = [text];
  boldParts.forEach((part, idx) => {
    const next: (string | JSX.Element)[] = [];
    nodes.forEach((node, ni) => {
      if (typeof node !== "string") {
        next.push(node);
        return;
      }
      const segments = node.split(part);
      segments.forEach((seg, si) => {
        if (seg) next.push(seg);
        if (si < segments.length - 1) {
          next.push(
            <strong key={`b-${idx}-${ni}-${si}`} className="font-bold">
              {part}
            </strong>
          );
        }
      });
    });
    nodes = next;
  });
  return nodes;
}

const insightBolds: string[][] = [
  ["HE", "41% em jul/25", "39% em jan/26"],
  ["na correria (<3m)", "18% para 42%"],
  ["Ponto batido em férias", "1,8% (set/25)", "0,6% (mar/26)", "Capital BA"],
];

// Cores para retrospectiva (charts A1 e A4)
function volumeBarColor(pct: number) {
  if (pct < 15) return "#22c55e";
  if (pct <= 25) return "#eab308";
  return "#ef4444";
}

type ScoreOption = "Composto" | "Aderência" | "Cobertura" | "Distribuição";

export default function AnalyticsFerias() {
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [heatmapGroup, setHeatmapGroup] = useState<"Regional" | "Contrato" | "Posto" | "Service Type">("Regional");
  const [scoreOption, setScoreOption] = useState<ScoreOption>("Composto");
  const [periodMode, setPeriodMode] = useState<"anual" | "mensal">("anual");

  const sidebarItems = useMemo(
    () => {
      const source = periodMode === "anual" ? vacationData.sidebar.items : vacationData.sidebar.itemsMensal;
      return source.map(i => ({ nome: i.name, score: i.score }));
    },
    [periodMode]
  );

  const mapaData = useMemo(
    () => (vacationData.charts.mapa.datasets as Record<ScoreOption, typeof vacationData.charts.mapa.data>)[scoreOption],
    [scoreOption]
  );

  // Variação semântica dos KPIs (lower-is-better vs higher-is-better)
  const variations = {
    score: { color: "text-green-600", arrow: "↑", value: vacationData.kpis.score.variation.value, unit: vacationData.kpis.score.variation.unit }, // higher-is-better, ↑ = bom
    aProgramar: { color: "text-red-600", arrow: "↑", value: vacationData.kpis.aProgramar.variation.value, unit: vacationData.kpis.aProgramar.variation.unit },
    semCobertura: { color: "text-green-600", arrow: "↓", value: vacationData.kpis.semCobertura.variation.value, unit: vacationData.kpis.semCobertura.variation.unit },
    riscoDobra: { color: "text-red-600", arrow: "↑", value: vacationData.kpis.riscoDobra.variation.value, unit: vacationData.kpis.riscoDobra.variation.unit },
  };

  return (
    <div className="flex w-full">
      <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4 overflow-y-auto">
        {/* ───────── Linha 1 — 6 Big Numbers ───────── */}
        <KPIRow
          items={[
            <ScoreBoard
              key="score"
              title="Score de Férias"
              tooltip={vacationData.kpis.score.tooltip}
            >
              <ScoreGauge
                score={vacationData.kpis.score.value}
                label={`${vacationData.kpis.score.value}`}
                color={gaugeColor(vacationData.kpis.score.value)}
              />
              <p className={`text-[11px] font-medium ${classifColor(vacationData.kpis.score.classification as any)}`}>
                {vacationData.kpis.score.classification}
              </p>
              <p className={`text-[10px] mt-0.5 ${variations.score.color}`}>
                {variations.score.arrow} {variations.score.value} {variations.score.unit}
              </p>
            </ScoreBoard>,
            <KPIBoard
              key="aprogramar"
              title="A Programar 30d"
              tooltip={vacationData.kpis.aProgramar.tooltip}
              value={vacationData.kpis.aProgramar.value}
              valueColor="text-orange-500"
              subtitle={vacationData.kpis.aProgramar.classification}
            />,
            <KPIBoard
              key="cobhe"
              title="Coberturas com HE (12m)"
              tooltip={vacationData.kpisTopo.coberturasHE12m.tooltip}
              value={`${vacationData.kpisTopo.coberturasHE12m.valor}%`}
              valueColor="text-orange-500"
              subtitle={vacationData.kpisTopo.coberturasHE12m.classification}
            />,
            <KPIBoard
              key="antmed"
              title="Antecedência Média"
              tooltip={vacationData.kpisTopo.antecedenciaMedia.tooltip}
              value={`${vacationData.kpisTopo.antecedenciaMedia.valor.toString().replace(".", ",")} meses`}
              valueColor="text-orange-500"
              subtitle={vacationData.kpisTopo.antecedenciaMedia.classification}
            />,
            <KPIBoard
              key="melhor"
              title="Melhor Operação"
              tooltip={vacationData.kpis.melhorOperacao.tooltip}
              value={vacationData.kpis.melhorOperacao.operationName}
              valueColor="text-green-600"
              subtitle={`Score ${vacationData.kpis.melhorOperacao.score} · ${vacationData.kpis.melhorOperacao.classification}`}
            />,
            <KPIBoard
              key="risco"
              title="Maior Risco"
              tooltip={vacationData.kpis.maiorRisco.tooltip}
              value={vacationData.kpis.maiorRisco.operationName}
              valueColor="text-red-500"
              subtitle={`Score ${vacationData.kpis.maiorRisco.score} · ${vacationData.kpis.maiorRisco.classification}`}
            />,
          ]}
        />

        {/* Linha de variações reposicionadas para os KPIs 2-4 (cor semântica) */}
        <div className="grid grid-cols-6 gap-3 -mt-2">
          <div />
          <p className={`text-[10px] text-center ${variations.aProgramar.color}`}>
            {variations.aProgramar.arrow} {variations.aProgramar.value} {variations.aProgramar.unit}
          </p>
          <p className={`text-[10px] text-center ${variations.semCobertura.color}`}>
            {variations.semCobertura.arrow} {variations.semCobertura.value} {variations.semCobertura.unit}
          </p>
          <p className={`text-[10px] text-center ${variations.riscoDobra.color}`}>
            {variations.riscoDobra.arrow} {variations.riscoDobra.value} {variations.riscoDobra.unit}
          </p>
          <div />
          <div />
        </div>

        {/* ───────── Linha 2 — Grid 2×2 de gráficos ───────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {/* Posição 1 — Mapa de Operações (scatter Headcount × Score) */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-semibold text-foreground">Mapa de Operações</h3>
                <InfoTip text="Bolha = headcount da unidade. Eixo X: headcount; Eixo Y: Score selecionado. Cor da bolha varia pela faixa de score." />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] text-muted-foreground">Score:</label>
                <select
                  value={scoreOption}
                  onChange={e => setScoreOption(e.target.value as ScoreOption)}
                  className="text-[11px] border border-border rounded px-1.5 py-0.5 bg-background"
                >
                  {vacationData.charts.mapa.scoreOptions.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">{vacationData.charts.mapa.subtitle}</p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 8, right: 12, bottom: 24, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  dataKey="headcount"
                  name="Headcount"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Headcount", position: "insideBottom", offset: -10, fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis type="number" dataKey="score" name="Score" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <ZAxis type="number" dataKey="headcount" range={[80, 600]} />
                {/* Zona Baixa performance (Score 0-55) */}
                <ReferenceArea y1={0} y2={55} fill="#fee2e2" fillOpacity={0.5} label={{ value: "Baixa performance", position: "insideBottomLeft", fontSize: 11, fill: "#9ca3af" }} />
                {/* Zona Escala produtiva (Score >= 85 e Headcount >= 250) */}
                <ReferenceArea x1={250} y1={85} y2={100} fill="#dcfce7" fillOpacity={0.5} label={{ value: "Escala produtiva", position: "insideTopRight", fontSize: 11, fill: "#9ca3af" }} />
                {/* Linha "Limite saudável" no Score 70 */}
                <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Limite saudável", position: "right", fontSize: 11, fill: "#22c55e" }} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-md px-2 py-1 text-xs shadow-md">
                        <p className="font-semibold">{d.name}</p>
                        <p>Headcount: {d.headcount}</p>
                        <p>Score ({scoreOption}): {d.score}</p>
                      </div>
                    );
                  }}
                />
                <Scatter
                  data={mapaData}
                  shape={(props: any) => {
                    const c = bubbleColor(props.payload.score);
                    const r = Math.sqrt(props.payload.headcount) * 1.4;
                    // Cor do texto: branco se score >= 70 (verde escuro o bastante), preto caso contrário (laranja/vermelho com opacidade ficam claros).
                    // Para garantir contraste, usamos preto sempre que a bolha for vermelha/laranja claros e branco quando bolha for densa.
                    const textColor = props.payload.score >= 70 ? "#ffffff" : "#1f2937";
                    return (
                      <g>
                        <circle cx={props.cx} cy={props.cy} r={r} fill={c} fillOpacity={0.6} stroke={c} strokeWidth={1.5} />
                        <text x={props.cx} y={props.cy - 1} textAnchor="middle" fontSize={Math.max(9, Math.min(11, r / 1.6))} fontWeight="700" fill={textColor}>
                          {props.payload.shortName}
                        </text>
                        <text x={props.cx} y={props.cy + Math.max(9, Math.min(11, r / 1.6))} textAnchor="middle" fontSize={Math.max(8, Math.min(10, r / 2))} fontWeight="600" fill={textColor}>
                          {props.payload.score}
                        </text>
                      </g>
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Posição 2 — Calendário de Férias (heatmap) */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Calendário de Férias</h3>
                <InfoTip text={vacationData.charts.calendario.tooltip} />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={heatmapGroup}
                  onChange={e => setHeatmapGroup(e.target.value as any)}
                  className="text-[11px] border border-border rounded px-1.5 py-0.5 bg-background"
                >
                  {vacationData.charts.calendario.groupByOptions.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyProblems}
                    onChange={e => setOnlyProblems(e.target.checked)}
                    className="accent-[#FF5722]"
                  />
                  Só problemas
                </label>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">{vacationData.charts.calendario.subtitle}</p>

            <div className="overflow-x-auto">
              <table className="text-[10px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-1 font-semibold text-muted-foreground sticky left-0 bg-card">Regional</th>
                    {vacationData.charts.calendario.weeks.map(w => (
                      <th key={w.label} className="p-1 text-center font-medium text-muted-foreground rotate-[-35deg] origin-bottom-left h-12 whitespace-nowrap">
                        {w.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vacationData.charts.calendario.cells.map((row) => (
                    <tr key={row.regional}>
                      <td className="p-1 font-medium text-foreground sticky left-0 bg-card whitespace-nowrap pr-2">
                        {row.regional}
                      </td>
                      {row.weeks.map((cell, i) => {
                        const hide = onlyProblems && cell.pct < 20;
                        return (
                          <td key={i} className="p-0.5">
                            <div
                              className="relative w-7 h-7 rounded flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#FF5722]/40 transition-all"
                              style={{ background: hide ? "transparent" : heatmapColor(cell.pct) }}
                              title={`${row.regional} · ${cell.pct}%`}
                            >
                              {!hide && (
                                <>
                                  <span className="text-[9px] font-semibold text-foreground/80">{cell.pct}</span>
                                  <span className="absolute top-0 right-0">{reserveIcon(cell.status)}</span>
                                </>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "#dcfce7" }} /> 0–10%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "#86efac" }} /> 10–20%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "#fde68a" }} /> 20–30%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "#fdba74" }} /> 30–40%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "#fca5a5" }} /> &gt;40%</span>
            </div>
          </div>

          {/* Posição 3 — Distribuição Mensal por Status (stacked bar + linha capacidade) */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-semibold text-foreground">Distribuição por Status</h3>
                <InfoTip text={vacationData.charts.distribuicao.tooltip} />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">{vacationData.charts.distribuicao.subtitle}</p>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={vacationData.charts.distribuicao.data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="firmes" stackId="s" name="Firmes" fill={COLORS.green} fillOpacity={0.85} />
                <Bar dataKey="provisorias" stackId="s" name="Provisórias" fill={COLORS.blue} fillOpacity={0.85} />
                <Bar dataKey="aProgramar" stackId="s" name="A Programar" fill={COLORS.orange} fillOpacity={0.85} />
                <Bar dataKey="naoPlanejadas" stackId="s" name="Não Planejadas" fill={COLORS.red} fillOpacity={0.85} />
                <Line type="monotone" dataKey="capacidade" name="Capacidade Reserva" stroke="#111827" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Posição 4 — Aderência vs Volume (scatter) */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-semibold text-foreground">Aderência vs Volume</h3>
                <InfoTip text={vacationData.charts.aderencia.tooltip} />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">{vacationData.charts.aderencia.subtitle}</p>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ top: 8, right: 60, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" dataKey="x" name="Volume" tick={{ fontSize: 11 }} label={{ value: "Volume de férias", position: "insideBottom", offset: -2, fontSize: 10 }} />
                <YAxis type="number" dataKey="y" name="Aderência" domain={[0, 100]} tick={{ fontSize: 11 }} label={{ value: "% antecedência ≥30d", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-md px-2 py-1 text-xs shadow-md">
                        <p className="font-semibold">{d.name}</p>
                        <p>Volume: {d.x}</p>
                        <p>Aderência: {d.y}%</p>
                        <p>Headcount: {d.headcount}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={75}
                  stroke="#C8860B"
                  strokeDasharray="4 4"
                  label={{
                    position: "right",
                    content: (props: any) => {
                      const { viewBox } = props;
                      const x = viewBox.x + viewBox.width - 4;
                      const y = viewBox.y;
                      return (
                        <g>
                          <rect x={x - 2} y={y - 8} width={50} height={14} fill="#ffffff" fillOpacity={0.9} rx={2} />
                          <text x={x + 3} y={y + 2} fontSize={11} fill="#374151">Meta 75%</text>
                        </g>
                      );
                    },
                  }}
                />
                <Scatter
                  data={vacationData.charts.aderencia.data}
                  shape={(props: any) => {
                    const y = props.payload.y;
                    const c = y >= 70 ? COLORS.green : y >= 55 ? COLORS.orange : COLORS.red;
                    return <circle cx={props.cx} cy={props.cy} r={Math.sqrt(props.payload.headcount) * 0.9} fill={c} fillOpacity={0.55} stroke={c} strokeWidth={1.5} />;
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ───────── Linha 3 — Insights ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
          {vacationData.insights.map((ins, i) => {
            const toneStyle =
              ins.tone === "positive"
                ? "border-l-green-500 bg-green-50/50"
                : ins.tone === "warning"
                ? "border-l-orange-500 bg-orange-50/50"
                : "border-l-red-500 bg-red-50/50";
            return (
              <div key={i} className={`border-l-4 ${toneStyle} border border-border/50 rounded-r-xl p-3`}>
                <p className="text-xs text-foreground leading-relaxed text-left">
                  {renderInsightText(ins.text, insightBolds[i] ?? [])}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar de tipo de operação */}
      <GroupBySidebar
        items={sidebarItems}
        selectedRegional={selectedRegional}
        onRegionalClick={(v) => setSelectedRegional(v === selectedRegional ? null : v)}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        periodToggle={{
          options: [
            { id: "anual", label: "Anual" },
            { id: "mensal", label: "Mensal" },
          ],
          value: periodMode,
          onChange: (id) => setPeriodMode(id as "anual" | "mensal"),
        }}
      />
    </div>
  );
}
