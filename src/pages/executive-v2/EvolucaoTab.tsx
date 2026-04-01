import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar } from "recharts";
import { trendROI, getDriversMonetarios, formatCurrency, ownership, mesesROI } from "@/lib/roiData";

export default function EvolucaoTab() {
  const monetarios = getDriversMonetarios();
  const baselineAvg = Math.round(monetarios.reduce((s, d) => s + d.baseline, 0) / monetarios.length);
  const atualAvg = Math.round(monetarios.reduce((s, d) => s + d.atual, 0) / monetarios.length);
  const ganhoPeriodo = monetarios.reduce((s, d) => s + d.ganhoBruto, 0);
  const variacao = baselineAvg > 0 ? (((atualAvg - baselineAvg) / baselineAvg) * 100).toFixed(1) : "0";

  const ownershipMensal = ownership.ownershipTotal / 12;
  const paybackData = trendROI.map((t, i) => ({
    mes: t.mes,
    custoAcumulado: Math.round(ownershipMensal * (i + 1)),
    economiaAcumulada: t.economiaAcumulada,
  }));

  const topDrivers = [...monetarios].sort((a, b) => b.ganhoBruto - a.ganhoBruto).slice(0, 5);
  const beforeAfterData = topDrivers.map(d => ({
    name: d.nome.length > 16 ? d.nome.slice(0, 14) + "…" : d.nome,
    antes: d.baseline,
    depois: d.atual,
  }));

  return (
    <div className="space-y-6">
      {/* Big Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Baseline Médio", value: baselineAvg.toLocaleString("pt-BR"), color: "text-gray-700" },
          { label: "Resultado Atual", value: atualAvg.toLocaleString("pt-BR"), color: "text-gray-700" },
          { label: "Ganho do Período", value: formatCurrency(ganhoPeriodo), color: "text-green-600" },
          { label: "Variação", value: `${variacao}%`, color: Number(variacao) < 0 ? "text-green-600" : "text-red-500" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-[10px] text-gray-500 font-medium uppercase">{kpi.label}</p>
            <p className={`text-xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Evolução separada: comprovado vs referencial */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Evolução: Valor Comprovado vs Referencial</h3>
        <p className="text-[10px] text-gray-400 mb-3">O valor comprovado está crescendo em relação ao referencial?</p>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendROI}>
              <defs>
                <linearGradient id="gradComprov" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRef" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="valorComprovado" stroke="#22c55e" fill="url(#gradComprov)" name="Comprovado" />
              <Area type="monotone" dataKey="valorReferencial" stroke="#9ca3af" fill="url(#gradRef)" name="Referencial" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Economia Bruta vs Líquida */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Economia Bruta vs Líquida (Mensal)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendROI}>
                <defs>
                  <linearGradient id="gradBruta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradLiquida" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5722" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF5722" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="economiaBruta" stroke="#22c55e" fill="url(#gradBruta)" name="Bruta" />
                <Area type="monotone" dataKey="economiaLiquida" stroke="#FF5722" fill="url(#gradLiquida)" name="Líquida" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payback Curve */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Curva de Payback</h3>
          <p className="text-[10px] text-gray-400 mb-2">O cruzamento das linhas indica o momento em que o investimento se paga</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paybackData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `R$ ${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="custoAcumulado" stroke="#ef4444" strokeWidth={2} name="Custo Acumulado" dot={false} />
                <Line type="monotone" dataKey="economiaAcumulada" stroke="#22c55e" strokeWidth={2} name="Economia Acumulada" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Before vs After */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Antes vs Depois – Top 5 Drivers</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={beforeAfterData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="antes" fill="#94a3b8" name="Antes" barSize={12} radius={[0, 4, 4, 0]} />
              <Bar dataKey="depois" fill="#FF5722" name="Depois" barSize={12} radius={[0, 4, 4, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* % Comprovado Evolution */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Evolução do % Comprovado</h3>
        <p className="text-[10px] text-gray-400 mb-2">O valor está ficando mais comprovado ao longo do tempo?</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendROI}>
              <defs>
                <linearGradient id="gradComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Area type="monotone" dataKey="pctComprovado" stroke="#22c55e" fill="url(#gradComp)" name="% Comprovado" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
