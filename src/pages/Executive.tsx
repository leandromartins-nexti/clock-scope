import { useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, FileText, Wrench, DollarSign, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

/* ── Mock data helpers ── */
const meses = ["Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

const categories = [
  {
    id: "inconsistencias",
    title: "Inconsistências de Ponto",
    icon: AlertTriangle,
    color: "hsl(var(--destructive))",
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    borderClass: "border-destructive/20",
    volume: 2350,
    volumePrev: 2098,
    esforco: 137,
    esforcoPrev: 152,
    custoMin: 2700,
    custoMax: 4100,
    custoMinPrev: 3000,
    custoMaxPrev: 4600,
    trend: [3200, 3500, 3100, 2900, 3400, 3800, 3600, 3300, 3000, 2800, 2950, 2700],
  },
  {
    id: "justificativas",
    title: "Justificativas de Ponto",
    icon: FileText,
    color: "hsl(var(--warning))",
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/20",
    volume: 1870,
    volumePrev: 1650,
    esforco: 98,
    esforcoPrev: 87,
    custoMin: 1900,
    custoMax: 2900,
    custoMinPrev: 1700,
    custoMaxPrev: 2600,
    trend: [1800, 2100, 2400, 2200, 2000, 2300, 2500, 2700, 2600, 2400, 2200, 1900],
  },
  {
    id: "ajustes",
    title: "Ajustes Manuais",
    icon: Wrench,
    color: "hsl(var(--secondary))",
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    borderClass: "border-secondary/20",
    volume: 980,
    volumePrev: 1120,
    esforco: 54,
    esforcoPrev: 62,
    custoMin: 1100,
    custoMax: 1600,
    custoMinPrev: 1250,
    custoMaxPrev: 1850,
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

interface TrendBadgeProps {
  current: number;
  previous: number;
  invert?: boolean; // true = decrease is good
}

function TrendBadge({ current, previous, invert = false }: TrendBadgeProps) {
  const pct = pctChange(current, previous);
  const isPositive = pct > 0;
  const isGood = invert ? !isPositive : isPositive;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
      isGood ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
    }`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? "+" : ""}{pct.toFixed(1)}%
    </span>
  );
}

function BigNumber({ label, value, icon: Icon, trend, invert }: {
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: { current: number; previous: number };
  invert?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground leading-none">{value}</span>
        {trend && <TrendBadge current={trend.current} previous={trend.previous} invert={invert} />}
      </div>
    </div>
  );
}

/* ── Totals ── */
function TotalsSummary() {
  const totalVolume = categories.reduce((s, c) => s + c.volume, 0);
  const totalVolumePrev = categories.reduce((s, c) => s + c.volumePrev, 0);
  const totalEsforco = categories.reduce((s, c) => s + c.esforco, 0);
  const totalEsforcoPrev = categories.reduce((s, c) => s + c.esforcoPrev, 0);
  const totalFte = totalEsforco / 160;
  const totalFtePrev = totalEsforcoPrev / 160;
  const totalCustoMin = categories.reduce((s, c) => s + c.custoMin, 0);
  const totalCustoMax = categories.reduce((s, c) => s + c.custoMax, 0);
  const totalCustoMinPrev = categories.reduce((s, c) => s + c.custoMinPrev, 0);
  const totalCustoMaxPrev = categories.reduce((s, c) => s + c.custoMaxPrev, 0);

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Resumo Consolidado — Impacto Operacional do Ponto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <BigNumber label="Volume Total" value={totalVolume.toLocaleString("pt-BR")} icon={AlertTriangle}
            trend={{ current: totalVolume, previous: totalVolumePrev }} invert />
          <BigNumber label="Esforço Total" value={`${totalEsforco}h`} icon={Clock}
            trend={{ current: totalEsforco, previous: totalEsforcoPrev }} invert />
          <BigNumber label="FTE Equivalente" value={totalFte.toFixed(2)} icon={Users}
            trend={{ current: totalFte, previous: totalFtePrev }} invert />
          <BigNumber label="Impacto Financeiro" value={`${formatCurrency(totalCustoMin)} – ${formatCurrency(totalCustoMax)}`} icon={DollarSign}
            trend={{ current: (totalCustoMin + totalCustoMax) / 2, previous: (totalCustoMinPrev + totalCustoMaxPrev) / 2 }} invert />
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Category Block ── */
function CategoryBlock({ cat }: { cat: typeof categories[0] }) {
  const Icon = cat.icon;
  const fte = cat.esforco / 160;
  const ftePrev = cat.esforcoPrev / 160;
  const chartData = meses.map((m, i) => ({ mes: m, custo: cat.trend[i] }));

  return (
    <Card className={`border ${cat.borderClass} bg-card shadow-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${cat.bgClass}`}>
            <Icon className={`w-5 h-5 ${cat.colorClass}`} />
          </div>
          <CardTitle className="text-base font-semibold text-foreground">{cat.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Big numbers grid */}
        <div className="grid grid-cols-2 gap-5">
          <BigNumber label="Volume" value={cat.volume.toLocaleString("pt-BR")} icon={AlertTriangle}
            trend={{ current: cat.volume, previous: cat.volumePrev }} invert />
          <BigNumber label="Esforço Operacional" value={`${cat.esforco}h`} icon={Clock}
            trend={{ current: cat.esforco, previous: cat.esforcoPrev }} invert />
          <BigNumber label="FTE Equivalente" value={fte.toFixed(2)} icon={Users}
            trend={{ current: fte, previous: ftePrev }} invert />
          <BigNumber label="Impacto Financeiro" value={`${formatCurrency(cat.custoMin)} – ${formatCurrency(cat.custoMax)}`} icon={DollarSign}
            trend={{ current: (cat.custoMin + cat.custoMax) / 2, previous: (cat.custoMinPrev + cat.custoMaxPrev) / 2 }} invert />
        </div>

        {/* Trend chart */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Evolução do Impacto Financeiro</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${cat.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cat.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={cat.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`} />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Impacto"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                />
                <Area type="monotone" dataKey="custo" stroke={cat.color} strokeWidth={2.5}
                  fill={`url(#grad-${cat.id})`} dot={false} activeDot={{ r: 4, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Main Page ── */
export default function Executive() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Executive</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Impacto operacional e financeiro das atividades de ponto — visão para alta liderança
        </p>
      </div>

      {/* Consolidated summary */}
      <TotalsSummary />

      {/* Category blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <CategoryBlock key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}
