import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Clock, TrendingUp, TrendingDown, AlertTriangle, Users, ShieldAlert, Timer, XCircle, Target, Scale, UserCheck, UserMinus, Activity } from "lucide-react";
import {
  heroKPIs,
  pressaoJornadaData,
  qualidadeJornadaData,
  bancoHorasDistribuicao,
  bancoHorasEvolucao,
  horasAVencerData,
  violacoesTipoData,
  heatmapViolacoesData,
  taxaGlobalAprovacao,
  aprovacaoReprovacaoPorGestor,
  rankingGestoresAprovacao,
  rankingGestoresReprovacao,
  jornadaMensalV2,
  jornadaPorUnidadeV2,
  kpisJornada,
} from "@/lib/timeV2Data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area } from "recharts";

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
  const [rankingAprovacaoMetrica, setRankingAprovacaoMetrica] = useState<'volume' | 'taxa'>('volume');
  const [rankingReprovacaoMetrica, setRankingReprovacaoMetrica] = useState<'volume' | 'taxa'>('volume');

  const maxViolacao = Math.max(
    ...heatmapViolacoesData.flatMap(d => [d.jornada, d.descanso, d.dsr, d.intrajornada])
  );

  const sortedRankingAprovacao = useMemo(() => {
    return [...rankingGestoresAprovacao].sort((a, b) => 
      rankingAprovacaoMetrica === 'volume' 
        ? b.horasAprovadas - a.horasAprovadas 
        : b.taxaAprovacao - a.taxaAprovacao
    );
  }, [rankingAprovacaoMetrica]);

  const sortedRankingReprovacao = useMemo(() => {
    return [...rankingGestoresReprovacao].sort((a, b) => 
      rankingReprovacaoMetrica === 'volume' 
        ? b.horasReprovadas - a.horasReprovadas 
        : b.taxaReprovacao - a.taxaReprovacao
    );
  }, [rankingReprovacaoMetrica]);

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

          {/* Primeira linha - 4 KPIs originais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Horas Extras Totais */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] px-1">
                    +{heroKPIs.horasExtrasTotais.variation}%
                  </Badge>
                </div>
                <p className="text-xl font-bold">{heroKPIs.horasExtrasTotais.value.toLocaleString('pt-BR')}h</p>
                <p className="text-xs text-muted-foreground">Horas Extras Totais</p>
              </CardContent>
            </Card>

            {/* Saldo Banco de Horas */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Timer className="h-4 w-4 text-warning" />
                </div>
                <p className="text-xl font-bold">{heroKPIs.saldoBancoHoras.value.toLocaleString('pt-BR')}h</p>
                <p className="text-xs text-muted-foreground">Saldo Banco Horas</p>
                <Badge variant="outline" className={`${getRiskColor(heroKPIs.saldoBancoHoras.risk)} text-[9px] mt-1`}>
                  {getRiskLabel(heroKPIs.saldoBancoHoras.risk)}
                </Badge>
              </CardContent>
            </Card>

            {/* Violações Trabalhistas */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[9px] px-1">
                    {heroKPIs.violacoesTrabalhistas.variation}%
                  </Badge>
                </div>
                <p className="text-xl font-bold">{heroKPIs.violacoesTrabalhistas.value}%</p>
                <p className="text-xs text-muted-foreground">Colab. c/ Violações</p>
              </CardContent>
            </Card>

            {/* Horas Próximas Vencimento */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-xl font-bold">{heroKPIs.horasProximasVencimento.value.toLocaleString('pt-BR')}h</p>
                <p className="text-xs text-muted-foreground">Horas Próx. Venc.</p>
                <Badge variant="outline" className={`${getRiskColor(heroKPIs.horasProximasVencimento.risk)} text-[9px] mt-1`}>
                  {getRiskLabel(heroKPIs.horasProximasVencimento.risk)}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Segunda linha - 4 KPIs de Jornada */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Horas Previstas */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xl font-bold">{kpisJornada.horasPrevistas.toLocaleString('pt-BR')}h</p>
                <p className="text-xs text-muted-foreground">Horas Previstas</p>
              </CardContent>
            </Card>

            {/* Horas Realizadas */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-4 w-4 text-chart-1" />
                </div>
                <p className="text-xl font-bold">{kpisJornada.horasRealizadas.toLocaleString('pt-BR')}h</p>
                <p className="text-xs text-muted-foreground">Horas Realizadas</p>
              </CardContent>
            </Card>

            {/* Desvio Absoluto */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-warning/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-4 w-4 text-warning" />
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[9px] px-1">
                    +{kpisJornada.desvioPercentual.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-xl font-bold text-warning">+{kpisJornada.desvioAbsoluto.toLocaleString('pt-BR')}h</p>
                <p className="text-xs text-muted-foreground">Desvio Absoluto</p>
              </CardContent>
            </Card>

            {/* Colaboradores Acima da Média */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-xl font-bold">{kpisJornada.colaboradoresAcimaMedia}%</p>
                <p className="text-xs text-muted-foreground">Colab. Acima Média</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO - Jornada Prevista x Realizada */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-chart-2 rounded-full" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Jornada Prevista x Realizada
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Evolução Mensal */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Evolução Mensal - Previsto vs Realizado</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={jornadaMensalV2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => [`${value.toLocaleString('pt-BR')}h`, name]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="previstas" stroke={COLORS.chart1} fill={COLORS.chart1} fillOpacity={0.3} name="Previstas" />
                    <Area type="monotone" dataKey="realizadas" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.3} name="Realizadas" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Taxa de Aderência */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Taxa de Aderência Mensal (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={jornadaMensalV2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis domain={[100, 112]} stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Aderência']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aderencia" 
                      stroke={COLORS.chart2} 
                      strokeWidth={3} 
                      dot={{ fill: COLORS.chart2, r: 5 }} 
                      name="Aderência (%)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detalhamento por Unidade */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Detalhamento por Unidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[320px] overflow-auto rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidade</TableHead>
                      <TableHead className="text-right">Previstas (h)</TableHead>
                      <TableHead className="text-right">Realizadas (h)</TableHead>
                      <TableHead className="text-right">Desvio (h)</TableHead>
                      <TableHead className="text-right">Aderência</TableHead>
                      <TableHead className="text-right">Colaboradores</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jornadaPorUnidadeV2.map((row) => (
                      <TableRow key={row.unidade} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{row.unidade}</TableCell>
                        <TableCell className="text-right">{row.previstas.toLocaleString('pt-BR')}</TableCell>
                        <TableCell className="text-right">{row.realizadas.toLocaleString('pt-BR')}</TableCell>
                        <TableCell className={`text-right font-medium ${row.desvio > 0 ? 'text-warning' : 'text-success'}`}>
                          {row.desvio > 0 ? '+' : ''}{row.desvio.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant="outline" 
                            className={row.aderencia > 110 ? 'bg-destructive/10 text-destructive border-destructive/20' : row.aderencia > 105 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-success/10 text-success border-success/20'}
                          >
                            {row.aderencia.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{row.colaboradores}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
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

        {/* SEÇÃO - Aprovação de Horas Extras (Visão Estratégica) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-success rounded-full" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Aprovação de Horas Extras – Visão Estratégica
            </h2>
          </div>

          {/* Widget 1 - Aprovação vs Reprovação por Gestor */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Aprovação vs Reprovação por Gestor</CardTitle>
                <span className="text-xs text-muted-foreground">Ordenado por volume total</span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart 
                  data={[...aprovacaoReprovacaoPorGestor].sort((a, b) => b.total - a.total)} 
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="gestor" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={110} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover border border-border rounded-md p-3 shadow-lg min-w-[220px]">
                            <p className="font-semibold text-sm mb-2">{data.gestor}</p>
                            <div className="space-y-1 text-xs">
                              <p className="flex justify-between"><span>Total de solicitações:</span> <strong>{data.total}</strong></p>
                              <p className="flex justify-between"><span className="text-success">Aprovadas:</span> <strong>{data.aprovadas}h</strong></p>
                              <p className="flex justify-between"><span className="text-destructive">Reprovadas:</span> <strong>{data.reprovadas}h</strong></p>
                              <p className="flex justify-between"><span>Taxa de aprovação:</span> <strong>{data.taxaAprovacao}%</strong></p>
                              <hr className="border-border my-1" />
                              <p className="flex justify-between text-muted-foreground"><span>Média por solicitação:</span> <strong>{data.mediaHE}h</strong></p>
                              <p className="flex justify-between text-muted-foreground"><span>vs Média empresa:</span> 
                                <strong className={data.taxaAprovacao > taxaGlobalAprovacao.mediaEmpresa ? 'text-success' : 'text-warning'}>
                                  {data.taxaAprovacao > taxaGlobalAprovacao.mediaEmpresa ? '+' : ''}{(data.taxaAprovacao - taxaGlobalAprovacao.mediaEmpresa).toFixed(1)}%
                                </strong>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="aprovadas" stackId="a" fill={COLORS.success} name="Aprovadas" />
                  <Bar dataKey="reprovadas" stackId="a" fill={COLORS.destructive} name="Reprovadas" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Widget 3 e 4 - Rankings lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Widget 3 - Ranking de Gestores por Aprovação */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-success" />
                    <CardTitle className="text-lg font-semibold">Top Gestores – Aprovação</CardTitle>
                  </div>
                  <Tabs value={rankingAprovacaoMetrica} onValueChange={(v) => setRankingAprovacaoMetrica(v as 'volume' | 'taxa')} className="h-8">
                    <TabsList className="h-8">
                      <TabsTrigger value="volume" className="text-xs h-7 px-3">Volume</TabsTrigger>
                      <TabsTrigger value="taxa" className="text-xs h-7 px-3">Taxa %</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={sortedRankingAprovacao.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(v) => rankingAprovacaoMetrica === 'taxa' ? `${v}%` : `${v}h`}
                    />
                    <YAxis dataKey="gestor" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-3 shadow-lg">
                              <p className="font-semibold text-sm">{data.gestor}</p>
                              <p className="text-xs text-muted-foreground mb-2">{data.area}</p>
                              <div className="space-y-1 text-xs">
                                <p>Volume: <strong>{data.horasAprovadas}h</strong></p>
                                <p>Taxa: <strong>{data.taxaAprovacao}%</strong></p>
                                <p className="text-muted-foreground">
                                  vs Empresa: <span className={data.comparativoEmpresa >= 0 ? 'text-success' : 'text-warning'}>
                                    {data.comparativoEmpresa >= 0 ? '+' : ''}{data.comparativoEmpresa}%
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey={rankingAprovacaoMetrica === 'volume' ? 'horasAprovadas' : 'taxaAprovacao'} 
                      fill={COLORS.success} 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Widget 4 - Ranking de Gestores por Reprovação */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserMinus className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-lg font-semibold">Top Gestores – Reprovação</CardTitle>
                  </div>
                  <Tabs value={rankingReprovacaoMetrica} onValueChange={(v) => setRankingReprovacaoMetrica(v as 'volume' | 'taxa')} className="h-8">
                    <TabsList className="h-8">
                      <TabsTrigger value="volume" className="text-xs h-7 px-3">Volume</TabsTrigger>
                      <TabsTrigger value="taxa" className="text-xs h-7 px-3">Taxa %</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={sortedRankingReprovacao.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(v) => rankingReprovacaoMetrica === 'taxa' ? `${v}%` : `${v}h`}
                    />
                    <YAxis dataKey="gestor" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-3 shadow-lg">
                              <p className="font-semibold text-sm">{data.gestor}</p>
                              <p className="text-xs text-muted-foreground mb-2">{data.area}</p>
                              <div className="space-y-1 text-xs">
                                <p>Volume: <strong>{data.horasReprovadas}h</strong></p>
                                <p>Taxa: <strong>{data.taxaReprovacao}%</strong></p>
                                <p className="text-muted-foreground">Motivo principal: <span className="text-foreground">{data.motivoPrincipal}</span></p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey={rankingReprovacaoMetrica === 'volume' ? 'horasReprovadas' : 'taxaReprovacao'} 
                      fill={COLORS.destructive} 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
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
