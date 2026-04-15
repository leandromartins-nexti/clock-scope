import { useState, useMemo } from "react";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { bancoHoras } from "@/lib/analytics-mock-data";
import { getSidebarItems } from "@/lib/ajustesData";
import { useQualidadePontoData } from "@/hooks/useQualidadePontoData";
import { buildDataSources } from "@/lib/qualidadeDataSources";
import {
  ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend,
} from "recharts";
import InfoTip from "@/components/analytics/InfoTip";
import { TrendIcon } from "@/components/analytics/IndicatorTable";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";


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

export default function AnalyticsBancoHoras({ embedded }: { embedded?: boolean }) {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");

  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };

  const { data: customerData } = useQualidadePontoData();
  const dataSources = useMemo(() => buildDataSources(customerData), [customerData]);
  const sidebarItems = useMemo(() => getSidebarItems(groupBy, undefined, dataSources), [groupBy, dataSources]);

  const content = (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 min-w-0 pl-6 pr-4 py-4 space-y-4 overflow-y-auto">
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

        <FeedbackBlock page="banco_horas" />
      </div>
      <GroupBySidebar items={sidebarItems} selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} groupBy={groupBy} onGroupByChange={handleGroupByChange} />
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
