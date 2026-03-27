import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Bar } from "recharts";
import { BigNumberCard, ScoreBadge, InsightBlock, SectionTitle, trendStr } from "./ExecutiveShared";
import { areas, trendData, getTotals, prevPeriod, formatCurrency, formatNumber, generateInsights, scoreClass } from "@/lib/executiveData";

export default function VisaoGeralTab() {
  const t = getTotals();
  const insights = generateInsights();
  const sorted = [...areas].sort((a, b) => a.scoreGeral - b.scoreGeral);

  const scoreT = trendStr(t.scoreGeral, prevPeriod.scoreGeral, true);
  const horasOpT = trendStr(t.horasOperacionais, prevPeriod.horasOperacionais, true);
  const horasAusT = trendStr(t.horasAusencia, prevPeriod.horasAusencia);
  const horasDescT = trendStr(t.horasDescobertas, prevPeriod.horasDescobertas);
  const custoT = trendStr(t.custoTotal, prevPeriod.custoTotal);
  const econT = trendStr(t.economiaTotal, prevPeriod.economiaTotal, true);

  return (
    <div className="space-y-4">
      {/* Big Numbers */}
      <div className="grid grid-cols-6 gap-3">
        <BigNumberCard title="Score Geral" value={`${t.scoreGeral}/100`}
          valueColor={scoreClass(t.scoreGeral).color} footer="Média ponderada" footerRight="Todas as áreas" change={scoreT} />
        <BigNumberCard title="Horas Operacionais" value={formatNumber(t.horasOperacionais)}
          footer="Total período" change={horasOpT} />
        <BigNumberCard title="Horas de Ausência" value={formatNumber(t.horasAusencia)}
          valueColor="text-red-500" footer="Total período" change={horasAusT} />
        <BigNumberCard title="Horas Descobertas" value={formatNumber(t.horasDescobertas)}
          valueColor="text-red-600" footer="Sem cobertura" change={horasDescT} />
        <BigNumberCard title="Custo Total" value={formatCurrency(t.custoTotal)}
          valueColor="text-[#FF5722]" footer="Estimado + real" change={custoT} />
        <BigNumberCard title="Potencial Economia" value={formatCurrency(t.economiaTotal)}
          valueColor="text-green-600" footer="Se otimizado" change={econT} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Evolução do Score Geral</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="grad-score" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5722" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#FF5722" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Area type="monotone" dataKey="scoreGeral" name="Score" stroke="#FF5722" strokeWidth={2} fill="url(#grad-score)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Evolução de Horas</SectionTitle>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Line type="monotone" dataKey="horasAusencia" name="Ausência" stroke="#E63946" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="horasCobertura" name="Cobertura" stroke="#1A66CC" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="horasDescobertas" name="Descobertas" stroke="#FDB813" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Custo evolution */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <SectionTitle>Evolução de Custo</SectionTitle>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="grad-custo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E63946" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#E63946" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), "Custo"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
              <Area type="monotone" dataKey="custoTotal" name="Custo" stroke="#E63946" strokeWidth={2} fill="url(#grad-custo)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Top Áreas – Pior Score</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-center py-2 font-medium text-gray-500">Score</th>
                <th className="text-center py-2 font-medium text-gray-500">Status</th>
                <th className="text-right py-2 font-medium text-gray-500">Custo</th>
              </tr></thead>
              <tbody>
                {sorted.map((a) => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-center"><ScoreBadge score={a.scoreGeral} /></td>
                    <td className="py-2.5 text-center"><span className={`text-[10px] ${scoreClass(a.scoreGeral).color}`}>{scoreClass(a.scoreGeral).label}</span></td>
                    <td className="py-2.5 text-right text-gray-600">{formatCurrency(a.custoTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <SectionTitle>Top Áreas – Maior Volume de Problemas</SectionTitle>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Área</th>
                <th className="text-right py-2 font-medium text-gray-500">H. Ausência</th>
                <th className="text-right py-2 font-medium text-gray-500">H. Descobertas</th>
                <th className="text-right py-2 font-medium text-gray-500">Absenteísmo</th>
              </tr></thead>
              <tbody>
                {[...areas].sort((a, b) => b.horasAusencia - a.horasAusencia).map((a) => (
                  <tr key={a.nome} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-700">{a.nome}</td>
                    <td className="py-2.5 text-right text-gray-600">{formatNumber(a.horasAusencia)}</td>
                    <td className="py-2.5 text-right text-red-500">{formatNumber(a.horasDescobertas)}</td>
                    <td className="py-2.5 text-right text-gray-600">{a.taxaAbsenteismo}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights */}
      <InsightBlock insights={insights} />
    </div>
  );
}
