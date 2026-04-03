import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { disciplinaOperacionalV3, absenteismoV3, formatNumberV3 } from "@/lib/analyticsV3Data";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Activity } from "lucide-react";

type SubTab = "qualidade" | "absenteismo" | "movimentacoes";

export default function V3DisciplinaOperacionalTab() {
  const [subTab, setSubTab] = useState<SubTab>("qualidade");
  const qp = disciplinaOperacionalV3.qualidadePonto;
  const mov = disciplinaOperacionalV3.movimentacoes;
  const abs = absenteismoV3;

  const TendIcon = ({ t }: { t: string }) => {
    if (t === "up") return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
    if (t === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-foreground">Disciplina Operacional</h2>
      <p className="text-sm text-muted-foreground -mt-3">Qualidade da rotina, absenteísmo e estabilidade de escala</p>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        {([
          { id: "qualidade" as SubTab, label: "Qualidade do Ponto", icon: CheckCircle2 },
          { id: "absenteismo" as SubTab, label: "Absenteísmo", icon: AlertTriangle },
          { id: "movimentacoes" as SubTab, label: "Movimentações Operacionais", icon: Activity },
        ]).map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border transition-colors ${subTab === t.id ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:bg-muted"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {subTab === "qualidade" && (
        <div className="space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPI label="Qualidade do Ponto" value={`${qp.percentualGlobal}%`} color={qp.percentualGlobal >= 85 ? "text-green-600" : "text-amber-600"} />
            <KPI label="Registradas" value={formatNumberV3(qp.registradas)} color="text-foreground" />
            <KPI label="Justificadas" value={formatNumberV3(qp.justificadas)} color="text-amber-600" />
            <KPI label="Tendência" value={qp.tendencia === "up" ? "Melhorando" : qp.tendencia === "down" ? "Piorando" : "Estável"} color={qp.tendencia === "up" ? "text-green-600" : "text-red-600"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Evolution */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Evolução da Qualidade do Ponto</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={qp.evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="mes" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[75, 95]} fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <ReferenceLine y={qp.percentualGlobal} stroke="hsl(var(--muted-foreground))" strokeDasharray="6 3" strokeWidth={1.5} label={{ value: `Média: ${qp.percentualGlobal}%`, position: "right", fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                  <Line type="monotone" dataKey="qualidade" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} name="Qualidade %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Composition donut */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Registradas vs Justificadas</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={[{ name: "Registradas", value: qp.registradas, fill: "#22c55e" }, { name: "Justificadas", value: qp.justificadas, fill: "#f59e0b" }]} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                    <Cell fill="#22c55e" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip formatter={(v: number) => formatNumberV3(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional ranking */}
          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs">Regional</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Qualidade %</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Registradas</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Justificadas</th>
                <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground text-xs">Tendência</th>
              </tr></thead>
              <tbody>
                {qp.porEstrutura.map(e => (
                  <tr key={e.nome} className="border-b border-border/50 hover:bg-muted/40">
                    <td className="px-4 py-2.5 font-medium text-foreground">{e.nome}</td>
                    <td className={`px-3 py-2.5 text-right font-semibold ${e.qualidade >= 85 ? "text-green-600" : "text-amber-600"}`}>{e.qualidade}%</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{formatNumberV3(e.registradas)}</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{formatNumberV3(e.justificadas)}</td>
                    <td className="px-3 py-2.5 text-center"><TendIcon t={e.tendencia} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === "absenteismo" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <KPI label="Taxa Global" value={`${abs.taxaGlobal}%`} color={abs.taxaGlobal > 5 ? "text-red-600" : "text-green-600"} />
            <KPI label="Horas Totais" value={formatNumberV3(abs.horasTotaisAusencia)} color="text-foreground" />
            <KPI label="% Não Planejadas" value={`${abs.pctNaoPlanejadas}%`} color="text-amber-600" />
            <KPI label="% Cobertas" value={`${abs.pctCobertas}%`} color="text-blue-600" />
            <KPI label="Regional Crítica" value={abs.regionalCritica} color="text-red-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Atestados e Faltas Não Justificadas por Competência</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={abs.evolucaoMensal} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="mes" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="atestados" stackId="abs" fill="#ef4444" name="Atestados" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="faltasNaoJustificadas" stackId="abs" fill="#f97316" name="Faltas Não Justificadas" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Evolução da Taxa de Absenteísmo</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={abs.evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="mes" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <ReferenceLine y={abs.taxaGlobal} stroke="hsl(var(--muted-foreground))" strokeDasharray="6 3" strokeWidth={1.5} />
                  <Line type="monotone" dataKey="taxa" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} name="Taxa %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs">Regional</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Taxa %</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Horas</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Horas/100</th>
                <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground text-xs">Tendência</th>
              </tr></thead>
              <tbody>
                {abs.porEstrutura.map(e => (
                  <tr key={e.nome} className="border-b border-border/50 hover:bg-muted/40">
                    <td className="px-4 py-2.5 font-medium text-foreground">{e.nome}</td>
                    <td className={`px-3 py-2.5 text-right font-semibold ${e.taxa > 5.5 ? "text-red-600" : "text-green-600"}`}>{e.taxa}%</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{formatNumberV3(e.horas)}</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{e.horasPor100}</td>
                    <td className="px-3 py-2.5 text-center"><TendIcon t={e.tendencia} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === "movimentacoes" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPI label="Trocas de Escala" value={formatNumberV3(mov.totalTrocasEscala)} color="text-foreground" />
            <KPI label="Trocas de Posto" value={formatNumberV3(mov.totalTrocasPosto)} color="text-foreground" />
            <KPI label="Total Movimentações" value={formatNumberV3(mov.totalMovimentacoes)} color="text-amber-600" />
            <KPI label="Tendência" value={mov.tendencia === "up" ? "Melhorando" : mov.tendencia === "down" ? "Piorando" : "Estável"} color={mov.tendencia === "up" ? "text-green-600" : "text-red-600"} />
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Trocas por Competência</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mov.evolucaoMensal} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <ReferenceLine y={Math.round(mov.totalMovimentacoes / 12)} stroke="hsl(var(--muted-foreground))" strokeDasharray="6 3" strokeWidth={1.5} label={{ value: "Média", position: "right", fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                <Bar dataKey="trocasEscala" stackId="mov" fill="#8b5cf6" name="Trocas de Escala" />
                <Bar dataKey="trocasPosto" stackId="mov" fill="#06b6d4" name="Trocas de Posto" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs">Regional</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Trocas Escala</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Trocas Posto</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Total</th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground text-xs">Por 100 Colab.</th>
                <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground text-xs">Tendência</th>
              </tr></thead>
              <tbody>
                {mov.porEstrutura.map(e => (
                  <tr key={e.nome} className="border-b border-border/50 hover:bg-muted/40">
                    <td className="px-4 py-2.5 font-medium text-foreground">{e.nome}</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{formatNumberV3(e.trocasEscala)}</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{formatNumberV3(e.trocasPosto)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-foreground">{formatNumberV3(e.total)}</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{e.por100}</td>
                    <td className="px-3 py-2.5 text-center"><TendIcon t={e.tendencia} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cross insights */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground text-sm mb-3">Insights Cruzados</h3>
        <div className="space-y-2">
          {[
            "As movimentações reduziram ao longo do período, mas a Qualidade do Ponto melhorou, sugerindo maior efetividade da liderança.",
            "A Regional BA apresenta a menor Qualidade do Ponto (82.4%) combinada com maior taxa de absenteísmo (6.8%), indicando piora da disciplina operacional.",
            "A Regional SP lidera em qualidade e estabilidade, com menor pressão sobre trocas de escala proporcionalmente.",
            "O absenteísmo permaneceu estável no período, porém trocas de posto cresceram na Regional PR, sugerindo desequilíbrio de planejamento.",
          ].map((insight, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg border-l-4 border-l-blue-500 bg-blue-50">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-600" />
              <p className="text-xs text-foreground/80 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
