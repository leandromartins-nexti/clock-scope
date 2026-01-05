import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Clock, TrendingUp, TrendingDown, AlertTriangle, Users, ShieldAlert, Timer } from "lucide-react";
import {
  heroKPIs,
  pressaoJornadaData,
  qualidadeJornadaData,
  bancoHorasDistribuicao,
  bancoHorasEvolucao,
  horasAVencerData,
  violacoesTipoData,
  heatmapViolacoesData,
} from "@/lib/timeV2Data";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
  muted: "hsl(var(--muted))",
  chart1: "hsl(var(--chart-1))",
  chart2: "hsl(var(--chart-2))",
  chart3: "hsl(var(--chart-3))",
  chart4: "hsl(var(--chart-4))",
};

const getRiskColor = (risk: 'baixo' | 'medio' | 'alto') => {
  switch (risk) {
    case 'baixo': return 'bg-success/10 text-success border-success/20';
    case 'medio': return 'bg-warning/10 text-warning border-warning/20';
    case 'alto': return 'bg-destructive/10 text-destructive border-destructive/20';
  }
};

const getRiskLabel = (risk: 'baixo' | 'medio' | 'alto') => {
  switch (risk) {
    case 'baixo': return 'Risco Baixo';
    case 'medio': return 'Risco Médio';
    case 'alto': return 'Risco Alto';
  }
};

const getHeatmapColor = (value: number, max: number) => {
  const intensity = value / max;
  if (intensity > 0.7) return 'bg-destructive/80 text-white';
  if (intensity > 0.4) return 'bg-warning/80 text-foreground';
  return 'bg-success/30 text-foreground';
};

export default function TimeV2() {
  const maxViolacao = Math.max(
    ...heatmapViolacoesData.flatMap(d => [d.jornada, d.descanso, d.dsr, d.intrajornada])
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Visão estratégica sobre jornada, banco de horas e compliance trabalhista
          </p>
        </div>

        {/* HERO SECTION - Snapshot Executivo */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Snapshot Executivo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Horas Extras Totais */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Horas Extras Totais
                  </CardTitle>
                  <Clock className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-foreground">
                    {heroKPIs.horasExtrasTotais.value.toLocaleString('pt-BR')}h
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive font-medium">
                      +{heroKPIs.horasExtrasTotais.variation}%
                    </span>
                    <span className="text-xs text-muted-foreground">vs período anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saldo Banco de Horas */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-full -translate-y-8 translate-x-8" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saldo Total Banco de Horas
                  </CardTitle>
                  <Timer className="h-5 w-5 text-warning" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-foreground">
                    {heroKPIs.saldoBancoHoras.value.toLocaleString('pt-BR')}h
                  </p>
                  <Badge variant="outline" className={getRiskColor(heroKPIs.saldoBancoHoras.risk)}>
                    {getRiskLabel(heroKPIs.saldoBancoHoras.risk)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Violações Trabalhistas */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full -translate-y-8 translate-x-8" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Colaboradores c/ Violações
                  </CardTitle>
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-foreground">
                    {heroKPIs.violacoesTrabalhistas.value}%
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-success" />
                    <span className="text-sm text-success font-medium">
                      {heroKPIs.violacoesTrabalhistas.variation}%
                    </span>
                    <span className="text-xs text-muted-foreground">vs período anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horas Próximas Vencimento */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-full -translate-y-8 translate-x-8" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Horas Próx. Vencimento
                  </CardTitle>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-foreground">
                    {heroKPIs.horasProximasVencimento.value.toLocaleString('pt-BR')}h
                  </p>
                  <Badge variant="outline" className={getRiskColor(heroKPIs.horasProximasVencimento.risk)}>
                    {getRiskLabel(heroKPIs.horasProximasVencimento.risk)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO 2 - Pressão de Jornada */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-secondary rounded-full" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Pressão de Jornada
            </h2>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Evolução de Horas Extras vs Exposição Operacional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={pressaoJornadaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="periodo" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="horasExtras" fill={COLORS.chart1} name="Horas Extras" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="percentualColaboradores" stroke={COLORS.warning} strokeWidth={3} name="% Colaboradores c/ HE" dot={{ fill: COLORS.warning, r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* SEÇÃO 3 - Qualidade da Jornada */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-chart-3 rounded-full" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Qualidade da Jornada
            </h2>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Faltas, Atrasos e Ausências por Unidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={qualidadeJornadaData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="unidade" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="faltas" fill={COLORS.destructive} name="Faltas" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="atrasos" fill={COLORS.warning} name="Atrasos" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="ausenciasNaoJustificadas" fill={COLORS.chart3} name="Ausências não justificadas" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* SEÇÃO 4 - Banco de Horas */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-success rounded-full" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Banco de Horas - Saúde Financeira
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Distribuição */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Distribuição de Saldo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={bancoHorasDistribuicao}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {bancoHorasDistribuicao.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Evolução */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Evolução do Saldo Total</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={bancoHorasEvolucao}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value.toLocaleString('pt-BR')}h`, 'Saldo']}
                    />
                    <Line type="monotone" dataKey="saldo" stroke={COLORS.success} strokeWidth={3} dot={{ fill: COLORS.success, r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO 5 - Compensação e Risco Financeiro */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-warning rounded-full" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Compensação e Risco Financeiro
            </h2>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Horas de Banco a Vencer</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={horasAVencerData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="faixa" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value.toLocaleString('pt-BR')}h`, 'Horas']}
                  />
                  <Bar dataKey="horas" radius={[0, 4, 4, 0]}>
                    {horasAVencerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* SEÇÃO 6 - Compliance Trabalhista */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-destructive rounded-full" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Compliance Trabalhista
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Violações por Tipo */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Violações por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={violacoesTipoData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tipo" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="ocorrencias" fill={COLORS.destructive} name="Ocorrências" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Heatmap */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Concentração de Violações por Área</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Unidade</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Jornada</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Descanso</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">DSR</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Intrajornada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {heatmapViolacoesData.map((row, idx) => (
                        <tr key={idx} className="border-b border-border/50">
                          <td className="py-3 px-2 text-sm font-medium">{row.unidade}</td>
                          <td className="py-2 px-2">
                            <div className={`text-center py-2 px-3 rounded-md text-sm font-medium ${getHeatmapColor(row.jornada, maxViolacao)}`}>
                              {row.jornada}
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            <div className={`text-center py-2 px-3 rounded-md text-sm font-medium ${getHeatmapColor(row.descanso, maxViolacao)}`}>
                              {row.descanso}
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            <div className={`text-center py-2 px-3 rounded-md text-sm font-medium ${getHeatmapColor(row.dsr, maxViolacao)}`}>
                              {row.dsr}
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            <div className={`text-center py-2 px-3 rounded-md text-sm font-medium ${getHeatmapColor(row.intrajornada, maxViolacao)}`}>
                              {row.intrajornada}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
