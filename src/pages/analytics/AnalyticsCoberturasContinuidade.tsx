import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { coberturas } from "@/lib/analytics-mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell,
} from "recharts";

// ── Gauge semicircular (identical to Resumo Executivo) ──────
function ScoreGauge({ score }: { score: number }) {
  const radius = 36;
  const stroke = 7;
  const cx = 45;
  const cy = 42;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 85 ? "hsl(var(--success))" : score >= 70 ? "#FF5722" : "hsl(var(--destructive))";

  return (
    <svg width="90" height="50" viewBox="0 0 90 50">
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round"
      />
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
      />
    </svg>
  );
}

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

const getScoreColor = (s: number) => s >= 85 ? "text-green-600" : s >= 70 ? "text-orange-500" : s < 60 ? "text-red-600" : "text-yellow-600";
const regularColor = (v: number) => v > 50 ? "text-green-600" : v >= 35 ? "text-orange-500" : "text-red-600";
const heColor = (v: number) => v > 30 ? "text-red-600" : v >= 20 ? "text-orange-500" : "text-green-600";

export default function AnalyticsCoberturasContinuidade({ embedded }: { embedded?: boolean }) {
  const { kpis, distribuicaoTipoEvento, evolucao, regionais } = coberturas;
  const scoreColor = getScoreColor(coberturas.scoreEficiencia);
  const scoreFaixa = coberturas.scoreEficiencia >= 80 ? "Bom" : coberturas.scoreEficiencia >= 70 ? "Atenção" : "Crítico";

  const content = (
    <div className="px-6 py-4 space-y-3">
      {/* ═══ Linha 1: Score Compacto + 2 KPI Cards (mesmo layout do Resumo Executivo) ═══ */}
      <div className="grid grid-cols-3 gap-3">
        {/* Score Cobertura — identical structure to Resumo Executivo */}
        <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Score Cobertura</p>
            <InfoTip text="Índice de eficiência de cobertura calculado a partir de: taxa de ausências cobertas, tipo de evento gerado na apuração, tempo médio de reposição e dias de posto descoberto." />
          </div>
          <ScoreGauge score={coberturas.scoreEficiencia} />
          <p className={`text-3xl font-bold leading-none -mt-1 ${scoreColor}`}>{coberturas.scoreEficiencia}</p>
          <p className={`text-xs font-semibold ${scoreColor} mt-0.5`}>{scoreFaixa}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <TrendingUp size={12} className="text-green-500" />
            <span className="text-[11px] font-medium text-green-600">+{coberturas.scoreDiferenca} vs anterior</span>
          </div>
        </div>

        {/* Ausências Cobertas */}
        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-medium text-muted-foreground">Ausências Cobertas</p>
            <InfoTip text="Percentual das ausências que foram cobertas por algum tipo de reposição." />
          </div>
          <p className={`text-2xl font-bold mt-2 ${kpis.ausenciasCobertas >= 75 ? "text-green-600" : "text-yellow-600"}`}>{kpis.ausenciasCobertas}%</p>
        </div>

        {/* Coberturas com HE */}
        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-medium text-muted-foreground">Coberturas com HE</p>
            <InfoTip text="Percentual das coberturas que geraram eventos de hora extra na apuração." />
          </div>
          <p className="text-2xl font-bold mt-2 text-red-600">{kpis.coberturasComHE}%</p>
        </div>
      </div>

      {/* ═══ Linha 2: Donut + AreaChart lado a lado ═══ */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <h4 className="text-sm font-semibold">Distribuição por Tipo de Evento</h4>
            <InfoTip text="Classificação baseada nos eventos reais de apuração gerados pela cobertura. Hora Regular indica coberturas que geraram apenas horas normais. Hora Extra indica coberturas onde houve eventos de HE." />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={distribuicaoTipoEvento} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" nameKey="name" label={({ value }) => `${value}%`}>
                {distribuicaoTipoEvento.map((e, i) => <Cell key={i} fill={e.cor} />)}
              </Pie>
              <RechartsTooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-0.5">Evolução por Competência</h4>
          <p className="text-[11px] text-muted-foreground mb-2">Distribuição mensal dos tipos de evento na cobertura</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={evolucao}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="competencia" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <RechartsTooltip />
              <Legend />
              <Area type="monotone" dataKey="regular" stackId="1" fill="#22c55e" stroke="#22c55e" fillOpacity={0.6} name="Hora Regular" />
              <Area type="monotone" dataKey="he" stackId="1" fill="#ef4444" stroke="#ef4444" fillOpacity={0.6} name="Hora Extra" />
              <Area type="monotone" dataKey="falta" stackId="1" fill="#f97316" stroke="#f97316" fillOpacity={0.6} name="Falta" />
              <Area type="monotone" dataKey="atrasos" stackId="1" fill="#eab308" stroke="#eab308" fillOpacity={0.6} name="Atrasos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══ Linha 3: Tabela regional com horas ═══ */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Regional</th>
              <th className="text-right px-4 py-2 font-semibold">Coberturas</th>
              <th className="text-center px-4 py-2 font-semibold">Hora Regular</th>
              <th className="text-center px-4 py-2 font-semibold">Hora Extra</th>
              <th className="text-center px-4 py-2 font-semibold">Falta</th>
              <th className="text-center px-4 py-2 font-semibold">Atrasos</th>
              <th className="text-center px-4 py-2 font-semibold">Tendência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {regionais.map((r: any) => (
              <tr key={r.nome} className="hover:bg-muted/20">
                <td className="px-4 py-2 font-medium">{r.nome}</td>
                <td className="text-right px-4 py-2">{r.coberturas?.toLocaleString("pt-BR")}</td>
                <td className="text-center px-4 py-2">
                  <span className={`font-semibold ${regularColor(r.regular)}`}>{r.regular}%</span>
                  <span className="text-muted-foreground text-[11px] ml-1">· {r.regularH}h</span>
                </td>
                <td className="text-center px-4 py-2">
                  <span className={`font-semibold ${heColor(r.he)}`}>{r.he}%</span>
                  <span className="text-muted-foreground text-[11px] ml-1">· {r.heH}h</span>
                </td>
                <td className="text-center px-4 py-2">
                  <span>{r.falta}%</span>
                  <span className="text-muted-foreground text-[11px] ml-1">· {r.faltaH}h</span>
                </td>
                <td className="text-center px-4 py-2">
                  <span>{r.atrasos}%</span>
                  <span className="text-muted-foreground text-[11px] ml-1">· {r.atrasosH}h</span>
                </td>
                <td className="text-center px-4 py-2"><div className="flex justify-center"><TrendIcon t={r.tendencia} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (embedded) return content;
  return content;
}
