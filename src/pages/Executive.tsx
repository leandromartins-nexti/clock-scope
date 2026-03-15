import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Eraser, AlertTriangle, FileText, Wrench, DollarSign, Clock, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FilterPanel } from "@/components/layout/FilterPanel";

/* ── Mock data ── */
const meses = ["Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

const categories = [
  {
    id: "inconsistencias",
    title: "Inconsistências de Ponto",
    icon: AlertTriangle,
    color: "#E63946",
    volume: 2350, volumePrev: 2098,
    esforco: 137, esforcoPrev: 152,
    custoMin: 2700, custoMax: 4100, custoMinPrev: 3000, custoMaxPrev: 4600,
    trend: [3200, 3500, 3100, 2900, 3400, 3800, 3600, 3300, 3000, 2800, 2950, 2700],
  },
  {
    id: "justificativas",
    title: "Justificativas de Ponto",
    icon: FileText,
    color: "#FDB813",
    volume: 1870, volumePrev: 1650,
    esforco: 98, esforcoPrev: 87,
    custoMin: 1900, custoMax: 2900, custoMinPrev: 1700, custoMaxPrev: 2600,
    trend: [1800, 2100, 2400, 2200, 2000, 2300, 2500, 2700, 2600, 2400, 2200, 1900],
  },
  {
    id: "ajustes",
    title: "Ajustes Manuais",
    icon: Wrench,
    color: "#1A66CC",
    volume: 980, volumePrev: 1120,
    esforco: 54, esforcoPrev: 62,
    custoMin: 1100, custoMax: 1600, custoMinPrev: 1250, custoMaxPrev: 1850,
    trend: [1600, 1500, 1400, 1550, 1450, 1350, 1300, 1250, 1200, 1150, 1100, 1100],
  },
];

function pctChange(curr: number, prev: number) {
  if (prev === 0) return 0;
  return ((curr - prev) / prev) * 100;
}

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/* ── KPI Card (same pattern as Strategy/Operacional) ── */
interface KPICardProps {
  title: string;
  value: string;
  valueColor: string;
  metaLabel: string;
  metaTarget: string;
  yoyValue: string;
  yoyColor: string;
  yoyIcon?: string;
}

const KPICard = ({ title, value, valueColor, metaLabel, metaTarget, yoyValue, yoyColor, yoyIcon }: KPICardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-[140px] flex flex-col justify-between">
    <p className="text-xs text-gray-500 font-medium text-center">{title}</p>
    <p className={`text-3xl font-bold text-center ${valueColor}`}>{value}</p>
    <div>
      <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
        <div className="text-[10px] text-gray-400"><span>{metaLabel}</span></div>
        <div className="text-[10px] text-gray-400">{metaTarget}</div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-gray-400">vs anterior</span>
        <span className={`text-[10px] font-medium ${yoyColor}`}>{yoyValue} {yoyIcon || ""}</span>
      </div>
    </div>
  </div>
);

/* ── Trend helpers ── */
function trendStr(curr: number, prev: number) {
  const pct = pctChange(curr, prev);
  const isPositive = pct > 0;
  // For cost/effort, decrease is good
  const isGood = !isPositive;
  return {
    value: `${isPositive ? "+" : ""}${pct.toFixed(1)}%`,
    color: isGood ? "text-green-600" : "text-red-500",
    icon: isPositive ? "↑" : "↓",
  };
}

/* ── Category Card with chart ── */
function CategoryCard({ cat }: { cat: typeof categories[0] }) {
  const Icon = cat.icon;
  const fte = cat.esforco / 160;
  const chartData = meses.map((m, i) => ({ mes: m, custo: cat.trend[i] }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${cat.color}15` }}>
          <Icon className="w-5 h-5" style={{ color: cat.color }} />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{cat.title}</h3>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[
          { label: "Volume", val: cat.volume.toLocaleString("pt-BR"), prev: cat.volumePrev, curr: cat.volume },
          { label: "Esforço", val: `${cat.esforco}h`, prev: cat.esforcoPrev, curr: cat.esforco },
          { label: "FTE", val: fte.toFixed(2), prev: cat.esforcoPrev / 160, curr: fte },
          { label: "Custo Est.", val: `${formatCurrency(cat.custoMin)} – ${formatCurrency(cat.custoMax)}`, prev: (cat.custoMinPrev + cat.custoMaxPrev) / 2, curr: (cat.custoMin + cat.custoMax) / 2 },
        ].map((item) => {
          const t = trendStr(item.curr, item.prev);
          return (
            <div key={item.label} className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{item.label}</span>
              <span className="text-lg font-bold text-gray-800 leading-tight">{item.val}</span>
              <span className={`text-[10px] font-medium ${t.color}`}>{t.value} {t.icon}</span>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${cat.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cat.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={cat.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`} />
            <Tooltip
              formatter={(v: number) => [formatCurrency(v), "Impacto"]}
              contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff" }}
            />
            <Area type="monotone" dataKey="custo" stroke={cat.color} strokeWidth={2}
              fill={`url(#grad-${cat.id})`} dot={false} activeDot={{ r: 4, strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function Executive() {
  const navigate = useNavigate();
  const [activeTab] = useState("Prime");
  const [filterOpen, setFilterOpen] = useState(false);

  // Totals for KPI cards
  const totalVolume = categories.reduce((s, c) => s + c.volume, 0);
  const totalVolumePrev = categories.reduce((s, c) => s + c.volumePrev, 0);
  const totalEsforco = categories.reduce((s, c) => s + c.esforco, 0);
  const totalEsforcoPrev = categories.reduce((s, c) => s + c.esforcoPrev, 0);
  const totalFte = totalEsforco / 160;
  const totalFtePrev = totalEsforcoPrev / 160;
  const totalCustoMin = categories.reduce((s, c) => s + c.custoMin, 0);
  const totalCustoMax = categories.reduce((s, c) => s + c.custoMax, 0);
  const totalCustoMid = (totalCustoMin + totalCustoMax) / 2;
  const totalCustoMidPrev = (categories.reduce((s, c) => s + c.custoMinPrev, 0) + categories.reduce((s, c) => s + c.custoMaxPrev, 0)) / 2;

  const volT = trendStr(totalVolume, totalVolumePrev);
  const esfT = trendStr(totalEsforco, totalEsforcoPrev);
  const fteT = trendStr(totalFte, totalFtePrev);
  const custoT = trendStr(totalCustoMid, totalCustoMidPrev);

  const tabs = ["Prime"];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <header className="border-b border-gray-200 px-6 py-3 bg-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline" onClick={() => navigate("/nexti-analytics")}>Home</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-gray-500">Executive</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[#FF5722] font-semibold">Prime</span>
        </div>
      </header>

      {/* Tabs Row */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex items-center justify-between">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-[#FF5722] text-[#FF5722]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(true)}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Filtros Aplicados */}
      <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-[#FF5722]" />
            <span className="font-semibold text-gray-700">Filtros Aplicados:</span>
          </div>
          <span className="bg-orange-50 text-[#FF5722] border border-[#FF5722] rounded-full px-3 py-1 text-xs font-medium">
            Período: jan/2017 - dez/2017
          </span>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-[#FF5722] hover:underline">
          <Eraser className="w-4 h-4" />
          Limpar Filtros
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            title="Volume Total de Atividades"
            value={totalVolume.toLocaleString("pt-BR")}
            valueColor="text-gray-800"
            metaLabel="Ocorrências"
            metaTarget="Período atual"
            yoyValue={volT.value}
            yoyColor={volT.color}
            yoyIcon={volT.icon}
          />
          <KPICard
            title="Esforço Operacional"
            value={`${totalEsforco}h`}
            valueColor="text-[#E63946]"
            metaLabel="Horas estimadas"
            metaTarget="Tratativas"
            yoyValue={esfT.value}
            yoyColor={esfT.color}
            yoyIcon={esfT.icon}
          />
          <KPICard
            title="FTE Equivalente"
            value={totalFte.toFixed(2)}
            valueColor="text-[#1A66CC]"
            metaLabel="Dedicação"
            metaTarget="= Horas / 160"
            yoyValue={fteT.value}
            yoyColor={fteT.color}
            yoyIcon={fteT.icon}
          />
          <KPICard
            title="Impacto Financeiro"
            value={`${formatCurrency(totalCustoMin)} – ${formatCurrency(totalCustoMax)}`}
            valueColor="text-[#FF5722]"
            metaLabel="Custo estimado"
            metaTarget="Faixa de valor"
            yoyValue={custoT.value}
            yoyColor={custoT.color}
            yoyIcon={custoT.icon}
          />
        </div>
      </div>

      {/* Category Cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
