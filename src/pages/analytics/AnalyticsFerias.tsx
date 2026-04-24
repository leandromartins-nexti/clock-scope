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
  BarChart,
  Bar,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import { Check, AlertTriangle, X, Calendar } from "lucide-react";
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

export default function AnalyticsFerias() {
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [heatmapGroup, setHeatmapGroup] = useState<"Regional" | "Contrato" | "Posto" | "Service Type">("Regional");

  const sidebarItems = useMemo(
    () => vacationData.sidebar.items.map(i => ({ nome: i.name, score: i.score })),
    []
  );

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
              <ScoreGauge score={vacationData.kpis.score.value} color={gaugeColor(vacationData.kpis.score.value)} />
              <p className={`text-[11px] font-medium ${classifColor(vacationData.kpis.score.classification as any)}`}>
                {vacationData.kpis.score.classification}
              </p>
              <p className="text-[10px] text-green-600 mt-0.5">↑ {vacationData.kpis.score.variation.value} {vacationData.kpis.score.variation.unit}</p>
            </ScoreBoard>,
            <KPIBoard
              key="aprogramar"
              title="A Programar 30d"
              tooltip={vacationData.kpis.aProgramar.tooltip}
              value={vacationData.kpis.aProgramar.value}
              valueColor="text-orange-500"
              subtitle={`${vacationData.kpis.aProgramar.classification} · ↑ ${vacationData.kpis.aProgramar.variation.value} ${vacationData.kpis.aProgramar.variation.unit}`}
            />,
            <KPIBoard
              key="semcobertura"
              title="Sem Cobertura"
              tooltip={vacationData.kpis.semCobertura.tooltip}
              value={vacationData.kpis.semCobertura.value}
              valueColor="text-orange-500"
              subtitle={`${vacationData.kpis.semCobertura.classification} · ↓ ${vacationData.kpis.semCobertura.variation.value} ${vacationData.kpis.semCobertura.variation.unit}`}
            />,
            <KPIBoard
              key="dobra"
              title="Risco de Dobra"
              tooltip={vacationData.kpis.riscoDobra.tooltip}
              value={vacationData.kpis.riscoDobra.value}
              valueColor="text-red-600"
              subtitle={`${vacationData.kpis.riscoDobra.classification} · ↑ ${vacationData.kpis.riscoDobra.variation.value} ${vacationData.kpis.riscoDobra.variation.unit}`}
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

        {/* ───────── Linha 2 — Grid 2×2 de gráficos ───────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {/* Posição 1 — Mapa de Operações (scatter Headcount × Score) */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-semibold text-foreground">Mapa de Operações</h3>
                <InfoTip text="Bolha = headcount da unidade. Eixo X: headcount; Eixo Y: Score de Férias." />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">{vacationData.charts.mapa.subtitle}</p>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" dataKey="headcount" name="Headcount" tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="score" name="Score" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <ZAxis type="number" dataKey="headcount" range={[80, 600]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-md px-2 py-1 text-xs shadow-md">
                        <p className="font-semibold">{d.name}</p>
                        <p>Headcount: {d.headcount}</p>
                        <p>Score: {d.score}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine y={70} stroke="#C8860B" strokeDasharray="4 4" />
                <Scatter
                  data={vacationData.charts.mapa.data}
                  fill={COLORS.blue}
                  shape={(props: any) => {
                    const c = gaugeColor(props.payload.score);
                    return <circle cx={props.cx} cy={props.cy} r={Math.sqrt(props.payload.headcount) * 1.4} fill={c} fillOpacity={0.55} stroke={c} strokeWidth={1.5} />;
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
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
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
                <ReferenceLine y={75} stroke="#C8860B" strokeDasharray="4 4" label={{ value: "Meta 75%", fontSize: 10, fill: "#C8860B" }} />
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
                <p className="text-xs text-foreground leading-relaxed">{ins.text}</p>
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
      />
    </div>
  );
}
