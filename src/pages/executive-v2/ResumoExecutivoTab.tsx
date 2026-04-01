import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import {
  getEconomiaBruta, getEconomiaLiquida, getROITotal, getPaybackMeses,
  getConfiancaBreakdown, getDriversMonetarios, ownership, trendROI,
  formatCurrency, formatNumber, generateROIInsights, drivers, operacoes,
  confidenceBadge,
} from "@/lib/roiData";
import { Info } from "lucide-react";

const COLORS_CONF = ["#22c55e", "#eab308", "#9ca3af"];

export default function ResumoExecutivoTab() {
  const eco = getEconomiaBruta();
  const liq = getEconomiaLiquida();
  const roi = getROITotal();
  const payback = getPaybackMeses();
  const conf = getConfiancaBreakdown();
  const monetarios = getDriversMonetarios();
  const driversAtivos = drivers.filter(d => d.status === "ativo").length;
  const insights = generateROIInsights();

  const confDonut = [
    { name: "Comprovado", value: conf.comprovado },
    { name: "Híbrido", value: conf.hibrido },
    { name: "Referencial", value: conf.referencial },
  ];

  const waterfallData = [...monetarios]
    .sort((a, b) => b.ganhoBruto - a.ganhoBruto)
    .slice(0, 8)
    .map(d => {
      const badge = confidenceBadge(d.confianca);
      return {
        name: d.nome.length > 20 ? d.nome.slice(0, 18) + "…" : d.nome,
        value: d.ganhoBruto,
        confianca: d.confianca,
        fill: d.confianca === "comprovado" ? "#22c55e" : d.confianca === "hibrido" ? "#eab308" : "#9ca3af",
      };
    });

  const topOps = [...operacoes].sort((a, b) => b.economiaLiquida - a.economiaLiquida).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ROI Hero Banner */}
      <div className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">RETORNO SOBRE INVESTIMENTO</p>
            <p className="text-5xl font-bold mt-1">{roi.toFixed(1)}x</p>
            <p className="text-xs opacity-75 mt-1">Payback em {payback.toFixed(1)} meses</p>
          </div>
          <div className="flex gap-8 text-right">
            <div>
              <p className="text-xs opacity-80">ECONOMIA BRUTA</p>
              <p className="text-2xl font-bold">{formatCurrency(eco)}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">ECONOMIA LÍQUIDA</p>
              <p className="text-2xl font-bold">{formatCurrency(liq)}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">OWNERSHIP NEXTI</p>
              <p className="text-2xl font-bold">{formatCurrency(ownership.ownershipTotal)}</p>
            </div>
          </div>
        </div>
        {/* Confidence strip */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
            <span className="text-xs opacity-90">Comprovado: <strong>{formatCurrency(conf["comprovadoR$"])}</strong> ({conf.comprovado.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
            <span className="text-xs opacity-90">Híbrido: <strong>{formatCurrency(conf["hibridoR$"])}</strong> ({conf.hibrido.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="text-xs opacity-90">Referencial: <strong>{formatCurrency(conf["referencialR$"])}</strong> ({conf.referencial.toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* Big Numbers with confidence values */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "ROI Total", value: `${roi.toFixed(1)}x`, color: "text-[#FF5722]" },
          { label: "Economia Bruta", value: formatCurrency(eco), color: "text-green-600" },
          { label: "Economia Líquida", value: formatCurrency(liq), color: "text-green-600" },
          { label: "Payback", value: `${payback.toFixed(1)} meses`, color: "text-gray-700" },
          { label: "Drivers Ativos", value: `${driversAtivos}`, color: "text-gray-700" },
          { label: "Módulos com Valor", value: `${new Set(monetarios.map(d => d.moduloNexti)).size}`, color: "text-gray-700" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <p className="text-[10px] text-gray-500 font-medium uppercase">{kpi.label}</p>
            <p className={`text-lg font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Confidence breakdown cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg border-2 border-green-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <p className="text-[10px] text-gray-500 font-medium uppercase">Valor Comprovado</p>
          </div>
          <p className="text-xl font-bold text-green-600">{formatCurrency(conf["comprovadoR$"])}</p>
          <p className="text-xs text-gray-400 mt-0.5">{conf.comprovado.toFixed(0)}% do total — dado real + custo real</p>
        </div>
        <div className="bg-white rounded-lg border-2 border-yellow-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <p className="text-[10px] text-gray-500 font-medium uppercase">Valor Híbrido</p>
          </div>
          <p className="text-xl font-bold text-yellow-600">{formatCurrency(conf["hibridoR$"])}</p>
          <p className="text-xs text-gray-400 mt-0.5">{conf.hibrido.toFixed(0)}% do total — dado real + premissa ajustável</p>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            <p className="text-[10px] text-gray-500 font-medium uppercase">Valor Referencial</p>
          </div>
          <p className="text-xl font-bold text-gray-600">{formatCurrency(conf["referencialR$"])}</p>
          <p className="text-xs text-gray-400 mt-0.5">{conf.referencial.toFixed(0)}% do total — benchmark / Base Case</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Waterfall – Top Drivers colored by confidence */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Composição da Economia por Driver</h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Comprovado</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Híbrido</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> Referencial</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {waterfallData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Donut */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Composição de Confiança do ROI</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={confDonut} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" label={({ name, value }) => `${value.toFixed(0)}%`} labelLine={false}>
                  {confDonut.map((_, i) => <Cell key={i} fill={COLORS_CONF[i]} />)}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">Quanto maior o % comprovado, mais defensável o ROI</p>
        </div>
      </div>

      {/* Evolution charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Evolução Mensal do ROI</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendROI}>
                <defs>
                  <linearGradient id="gradRoi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5722" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF5722" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="roiTotal" stroke="#FF5722" fill="url(#gradRoi)" name="ROI (x)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Economia Acumulada</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendROI}>
                <defs>
                  <linearGradient id="gradEco" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `R$ ${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="economiaAcumulada" stroke="#22c55e" fill="url(#gradEco)" name="Acumulada" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Drivers */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Top Drivers por Contribuição</h3>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {[...monetarios].sort((a, b) => b.ganhoBruto - a.ganhoBruto).slice(0, 6).map((d, i) => {
              const badge = confidenceBadge(d.confianca);
              return (
                <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                    <div>
                      <p className="text-xs font-medium text-gray-700">{d.nome}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <p className="text-[10px] text-gray-400">{badge.label}</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-600">{formatCurrency(d.ganhoBruto)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Operações */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Top Operações por Valor</h3>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {topOps.map((op, i) => (
              <div key={op.nome} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{op.nome}</p>
                    <span className="text-[10px] text-gray-400">{op.pctComprovado}% comprovado</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-600">{formatCurrency(op.economiaLiquida)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">💡 Narrativa Executiva</h3>
          <div className="space-y-2">
            {insights.map((ins, i) => {
              const cfg = ins.severity === "critical"
                ? { dot: "bg-red-500", bg: "bg-red-50", border: "border-red-200" }
                : ins.severity === "warning"
                ? { dot: "bg-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" }
                : { dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200" };
              return (
                <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                  <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${cfg.dot}`} />
                  <p className="text-xs text-gray-700 leading-relaxed">{ins.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
