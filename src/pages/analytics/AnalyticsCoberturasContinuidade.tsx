import { useState } from "react";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { coberturas, bancoHoras } from "@/lib/analytics-mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, Line, ComposedChart,
} from "recharts";

function InfoTip({ text }: { text: string }) {
  return (
    <UITooltip>
      <TooltipTrigger asChild><Info size={14} className="text-muted-foreground cursor-help" /></TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-xs">{text}</TooltipContent>
    </UITooltip>
  );
}

function TrendIcon({ t }: { t: string }) {
  if (t === "melhorando") return <TrendingUp size={14} className="text-green-500" />;
  if (t === "piorando") return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
}

function InsightCard({ texto, tipo }: { texto: string; tipo: string }) {
  const borderColor = tipo === "positivo" ? "border-l-green-500" : tipo === "negativo" ? "border-l-red-500" : tipo === "atencao" ? "border-l-orange-400" : "border-l-blue-400";
  return (
    <div className={`bg-card border border-border/50 rounded-lg p-4 border-l-[3px] ${borderColor}`}>
      <p className="text-sm text-foreground leading-relaxed">{texto}</p>
    </div>
  );
}

function KPI({ title, value, color, tip }: { title: string; value: string | number; color?: string; tip: string }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4">
      <div className="flex justify-between items-start">
        <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
        <InfoTip text={tip} />
      </div>
      <p className={`text-2xl font-bold mt-1 ${color || "text-foreground"}`}>{value}</p>
    </div>
  );
}

const scoreColor = (s: number) => s >= 80 ? "text-green-600" : s >= 70 ? "text-orange-500" : "text-red-600";
const scoreBg = (s: number) => s >= 80 ? "bg-green-50" : s >= 70 ? "bg-orange-50" : "bg-red-50";

export default function AnalyticsCoberturasContinuidade({ embedded }: { embedded?: boolean }) {
  const { kpis, distribuicaoTipo, evolucao, regionais, insights } = coberturas;

  const content = (
    <div className="px-6 py-4 space-y-4">
      {/* Score hero */}
      <div className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4">
        <div className={`text-4xl font-bold ${scoreColor(coberturas.scoreEficiencia)}`}>{coberturas.scoreEficiencia}</div>
        <div>
          <p className="text-sm font-semibold">Score de Eficiência de Cobertura</p>
          <p className={`text-xs font-medium ${scoreColor(coberturas.scoreEficiencia)}`}>{coberturas.scoreFaixa}</p>
        </div>
      </div>

      {/* KPI row 1 */}
      <div className="grid grid-cols-4 gap-3">
        <KPI title="Taxa Cobertura Efetiva" value={`${kpis.taxaCoberturaEfetiva}%`} color={kpis.taxaCoberturaEfetiva < 80 ? "text-yellow-600" : "text-green-600"} tip="Percentual de ausências que foram efetivamente cobertas" />
        <KPI title="% Reserva Técnica" value={`${kpis.reservaTecnica}%`} tip="Percentual do efetivo alocado como reserva técnica" />
        <KPI title="% Hora Extra" value={`${kpis.horaExtra}%`} color="text-red-600" tip="Percentual de coberturas realizadas com hora extra" />
        <KPI title="Tempo Médio Reposição" value={`${kpis.tempoMedioReposicao}h`} tip="Tempo médio para repor um posto descoberto" />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-4 gap-3">
        <KPI title="Horas Posto Descoberto" value={kpis.horasPostoDescoberto} color="text-red-600" tip="Total de horas em que postos ficaram sem cobertura" />
        <KPI title="Horas Cobertas com HE" value={kpis.horasCobertoComHE} color="text-red-600" tip="Horas de cobertura realizadas via hora extra" />
        <KPI title="Horas Cobertas Planejadas" value={kpis.horasCobertosPlanejadas} color="text-green-600" tip="Horas de cobertura realizadas de forma planejada" />
        <KPI title="Score Eficiência" value={kpis.scoreEficiencia} tip="Índice de eficiência de cobertura de 0 a 100" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-2">Distribuição por Tipo de Cobertura</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={distribuicaoTipo} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" nameKey="name" label={({ name, value }) => `${value}%`}>
                {distribuicaoTipo.map((e, i) => <Cell key={i} fill={e.cor} />)}
              </Pie>
              <RechartsTooltip formatter={(value: number, name: string) => {
                const item = distribuicaoTipo.find(d => d.name === name);
                return [`${value}% — ${item?.impacto || ''}`, name];
              }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-2">Evolução por Competência</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={evolucao}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="competencia" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <RechartsTooltip />
              <Legend />
              <Area type="monotone" dataKey="planejada" stackId="1" fill="#00C49F" stroke="#00C49F" fillOpacity={0.6} name="Planejada" />
              <Area type="monotone" dataKey="emergencial" stackId="1" fill="#FF8042" stroke="#FF8042" fillOpacity={0.6} name="Emergencial" />
              <Area type="monotone" dataKey="descoberto" stackId="1" fill="#ef4444" stroke="#ef4444" fillOpacity={0.6} name="Descoberto" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional table */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Regional</th>
              <th className="text-center px-4 py-2 font-semibold">Score</th>
              <th className="text-right px-4 py-2 font-semibold">Horas Cobertas</th>
              <th className="text-right px-4 py-2 font-semibold">Horas Descoberto</th>
              <th className="text-center px-4 py-2 font-semibold">% HE</th>
              <th className="text-center px-4 py-2 font-semibold">Tendência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {regionais.map((r: any) => (
              <tr key={r.nome} className="hover:bg-muted/20">
                <td className="px-4 py-2 font-medium">{r.nome}</td>
                <td className="text-center px-4 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${scoreColor(r.score)} ${scoreBg(r.score)}`}>{r.score}</span></td>
                <td className="text-right px-4 py-2">{r.horasCobertas}</td>
                <td className="text-right px-4 py-2">{r.horasDescoberto}</td>
                <td className="text-center px-4 py-2">{r.percentHE}%</td>
                <td className="text-center px-4 py-2"><div className="flex justify-center"><TrendIcon t={r.tendencia} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══════ BANCO DE HORAS ══════ */}
      <h3 className="text-base font-bold text-foreground pt-2">Banco de Horas</h3>

      <div className="grid grid-cols-4 gap-3">
        <KPI title="Saldo Total" value={`${bancoHoras.saldoTotal} horas`} color="text-orange-500" tip="Saldo acumulado de banco de horas — saldo crescente indica risco" />
        <KPI title="Saldo Médio/Colaborador" value={`${bancoHoras.saldoMedioPorColab}h`} tip="Média de horas acumuladas por colaborador" />
        <KPI title="Colab. com Saldo Crítico" value={bancoHoras.colaboradoresCriticos} color="text-red-600" tip="Colaboradores com saldo acima do limite seguro" />
        <KPI title="Tendência" value={bancoHoras.tendencia} color="text-red-600" tip="Direção do saldo — crescimento indica risco operacional" />
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-4">
        <h4 className="text-sm font-semibold mb-2">Saldo de Banco de Horas por Competência</h4>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={bancoHoras.evolucao}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="competencia" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <RechartsTooltip />
            <Legend />
            <Area type="monotone" dataKey="creditos" fill="#86efac" stroke="#22c55e" fillOpacity={0.3} name="Créditos" />
            <Area type="monotone" dataKey="debitos" fill="#fca5a5" stroke="#ef4444" fillOpacity={0.3} name="Débitos" />
            <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} name="Saldo Líquido" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Regional</th>
              <th className="text-right px-4 py-2 font-semibold">Saldo</th>
              <th className="text-right px-4 py-2 font-semibold">Créditos</th>
              <th className="text-right px-4 py-2 font-semibold">Débitos</th>
              <th className="text-right px-4 py-2 font-semibold">Colab. Críticos</th>
              <th className="text-center px-4 py-2 font-semibold">Tendência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {bancoHoras.regionais.map((r: any) => (
              <tr key={r.nome} className="hover:bg-muted/20">
                <td className="px-4 py-2 font-medium">{r.nome}</td>
                <td className="text-right px-4 py-2 font-semibold">{r.saldo}</td>
                <td className="text-right px-4 py-2">{r.creditos}</td>
                <td className="text-right px-4 py-2">{r.debitos}</td>
                <td className="text-right px-4 py-2">{r.colabCriticos}</td>
                <td className="text-center px-4 py-2"><div className="flex justify-center"><TrendIcon t={r.tendencia} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-3 gap-3">
        {insights.map((ins, i) => <InsightCard key={i} texto={ins.texto} tipo={ins.tipo} />)}
      </div>

      <FeedbackBlock page="coberturas_continuidade" />
    </div>
  );

  if (embedded) return content;
  return content;
}

function FeedbackBlock({ page }: { page: string }) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="border-t border-border pt-4 mt-1 flex items-center justify-center gap-2">
      <span className="text-sm text-green-600">✓ Obrigado pelo feedback!</span>
    </div>
  );

  return (
    <div className="border-t border-border pt-4 mt-1">
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm text-muted-foreground">Como você avalia esta visualização?</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${rating === n ? "bg-[#FF5722] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{n}</button>
          ))}
        </div>
      </div>
      {rating && (
        <div className="mt-4 max-w-lg mx-auto">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Quer compartilhar algo mais? (opcional)" className="w-full border border-border rounded-lg p-3 text-sm resize-none h-20 focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] outline-none" />
          <div className="flex justify-end mt-2">
            <button onClick={() => { console.log({ page, rating, comment }); setSubmitted(true); }} className="bg-[#FF5722] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition">Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}
