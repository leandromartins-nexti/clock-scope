import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Clock, CheckCircle2, XCircle, AlertTriangle, UserX, Timer, Filter, Calendar } from "lucide-react";
import {
  heroKPIsOperational,
  horasExtrasPorStatus,
  horasExtrasPorColaborador,
  ocorrenciasPorTipo,
  ocorrenciasPorColaborador,
  saldoBancoHorasPorColaborador,
  creditosDebitosData,
  horasDisponiveis,
  periodosBancoHoras,
  violacoesPorTipoOperacional,
  violacoesPorColaborador,
} from "@/lib/timeV2OperationalData";

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
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pendente':
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pendente</Badge>;
    case 'aprovada':
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Aprovada</Badge>;
    case 'reprovada':
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Reprovada</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getSituacaoBadge = (situacao: 'normal' | 'alerta') => {
  if (situacao === 'alerta') {
    return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Alerta</Badge>;
  }
  return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Normal</Badge>;
};

const getJustificadaBadge = (justificada: string) => {
  if (justificada === 'Sim') {
    return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Sim</Badge>;
  }
  return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Não</Badge>;
};

export default function TimeV2Operational() {
  const [periodoFilter, setPeriodoFilter] = useState("ultimos7dias");
  const [unidadeFilter, setUnidadeFilter] = useState("todas");
  const [areaFilter, setAreaFilter] = useState("todas");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Time V2 - Acompanhamento Operacional
            </h1>
            <p className="text-muted-foreground">
              Apuração de ponto, banco de horas e compliance
            </p>
          </div>

          {/* Filtros Globais */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="ultimos7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="ultimos15dias">Últimos 15 dias</SelectItem>
                  <SelectItem value="ultimos30dias">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={unidadeFilter} onValueChange={setUnidadeFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="matriz">Matriz</SelectItem>
                <SelectItem value="filial-sp">Filial SP</SelectItem>
                <SelectItem value="filial-rj">Filial RJ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="operacoes">Operações</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Mais filtros
            </Button>
          </div>
        </div>

        {/* HERO SECTION - Status Atual */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-primary rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status Atual
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <p className="text-2xl font-bold">{heroKPIsOperational.horasExtrasPendentes}</p>
                <p className="text-xs text-muted-foreground">HE Pendentes</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <p className="text-2xl font-bold">{heroKPIsOperational.horasExtrasAprovadas.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-muted-foreground">HE Aprovadas</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-2xl font-bold">{heroKPIsOperational.horasExtrasReprovadas}</p>
                <p className="text-xs text-muted-foreground">HE Reprovadas</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <UserX className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-2xl font-bold">{heroKPIsOperational.faltasRegistradas}</p>
                <p className="text-xs text-muted-foreground">Faltas</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Timer className="h-4 w-4 text-warning" />
                </div>
                <p className="text-2xl font-bold">{heroKPIsOperational.atrasosRegistrados}</p>
                <p className="text-xs text-muted-foreground">Atrasos</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-2xl font-bold">{heroKPIsOperational.violacoesAtivas}</p>
                <p className="text-xs text-muted-foreground">Violações Ativas</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO 2 - Horas Extras */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-secondary rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Horas Extras
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Horas Extras por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={horasExtrasPorStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="periodo" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="pendente" stackId="a" fill={COLORS.warning} name="Pendente" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="aprovada" stackId="a" fill={COLORS.success} name="Aprovada" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="reprovada" stackId="a" fill={COLORS.destructive} name="Reprovada" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Lista de Horas Extras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[240px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Colaborador</TableHead>
                        <TableHead className="text-xs">Data</TableHead>
                        <TableHead className="text-xs">Qtd</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {horasExtrasPorColaborador.slice(0, 6).map((row) => (
                        <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="text-xs font-medium py-2">{row.colaborador}</TableCell>
                          <TableCell className="text-xs py-2">{row.data}</TableCell>
                          <TableCell className="text-xs py-2">{row.quantidade}</TableCell>
                          <TableCell className="py-2">{getStatusBadge(row.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO 3 - Faltas, Atrasos e Ausências */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-chart-3 rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Faltas, Atrasos e Ausências
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Ocorrências por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ocorrenciasPorTipo} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis dataKey="tipo" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={140} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="quantidade" fill={COLORS.chart1} name="Quantidade" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Ocorrências por Colaborador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[200px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Colaborador</TableHead>
                        <TableHead className="text-xs">Tipo</TableHead>
                        <TableHead className="text-xs">Data</TableHead>
                        <TableHead className="text-xs">Justif.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ocorrenciasPorColaborador.slice(0, 5).map((row) => (
                        <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="text-xs font-medium py-2">{row.colaborador}</TableCell>
                          <TableCell className="text-xs py-2">{row.tipo}</TableCell>
                          <TableCell className="text-xs py-2">{row.data}</TableCell>
                          <TableCell className="py-2">{getJustificadaBadge(row.justificada)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO 4 - Banco de Horas */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-success rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Banco de Horas
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Saldo por Colaborador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[240px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Colaborador</TableHead>
                        <TableHead className="text-xs text-right">Saldo</TableHead>
                        <TableHead className="text-xs text-right">Limite</TableHead>
                        <TableHead className="text-xs">Situação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {saldoBancoHorasPorColaborador.map((row) => (
                        <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="text-xs font-medium py-2">{row.colaborador}</TableCell>
                          <TableCell className={`text-xs text-right py-2 font-medium ${row.saldoAtual.startsWith('-') ? 'text-destructive' : 'text-success'}`}>
                            {row.saldoAtual}
                          </TableCell>
                          <TableCell className="text-xs text-right py-2">{row.limite}</TableCell>
                          <TableCell className="py-2">{getSituacaoBadge(row.situacao)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Créditos vs Débitos no Período</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={creditosDebitosData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="periodo" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="creditos" fill={COLORS.success} name="Créditos" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="debitos" fill={COLORS.destructive} name="Débitos" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO 5 - Compensação de Banco de Horas */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-warning rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Compensação de Banco de Horas
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md bg-gradient-to-br from-card to-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Timer className="h-5 w-5 text-warning" />
                </div>
                <p className="text-3xl font-bold text-foreground">{horasDisponiveis.toLocaleString('pt-BR')}h</p>
                <p className="text-sm text-muted-foreground mt-1">Horas disponíveis para compensação</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Períodos de Banco de Horas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Período</TableHead>
                        <TableHead className="text-xs text-right">Disponíveis</TableHead>
                        <TableHead className="text-xs text-right">Compensadas</TableHead>
                        <TableHead className="text-xs text-right">Pendentes</TableHead>
                        <TableHead className="text-xs">Vencimento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {periodosBancoHoras.map((row) => (
                        <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="text-xs font-medium py-2">{row.periodo}</TableCell>
                          <TableCell className="text-xs text-right py-2">{row.disponiveis}</TableCell>
                          <TableCell className="text-xs text-right py-2 text-success">{row.compensadas}</TableCell>
                          <TableCell className="text-xs text-right py-2 text-warning">{row.pendentes}</TableCell>
                          <TableCell className="text-xs py-2">{row.vencimento}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SEÇÃO 6 - Compliance Operacional */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-destructive rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Compliance Operacional
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Violações por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={violacoesPorTipoOperacional}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tipo" stroke="hsl(var(--muted-foreground))" fontSize={9} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="quantidade" fill={COLORS.destructive} name="Quantidade" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Violações por Colaborador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[200px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Colaborador</TableHead>
                        <TableHead className="text-xs">Tipo</TableHead>
                        <TableHead className="text-xs">Data</TableHead>
                        <TableHead className="text-xs">Área</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {violacoesPorColaborador.map((row) => (
                        <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="text-xs font-medium py-2">{row.colaborador}</TableCell>
                          <TableCell className="text-xs py-2">{row.tipo}</TableCell>
                          <TableCell className="text-xs py-2">{row.data}</TableCell>
                          <TableCell className="text-xs py-2">{row.area}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
