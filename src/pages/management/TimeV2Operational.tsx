import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Clock, CheckCircle2, XCircle, AlertTriangle, UserX, Timer, Filter, Calendar, X, TrendingUp, Users, Download, ExternalLink } from "lucide-react";
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
  rankingHorasExtras,
  rankingOcorrencias,
  rankingSaldoPositivo,
  rankingSaldoNegativo,
  rankingHorasVencer,
  rankingViolacoes,
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
  chart4: "hsl(var(--chart-4))",
};

type FilterType = {
  kpiType?: string;
  status?: string;
  tipoOcorrencia?: string;
  saldoTipo?: 'positivo' | 'negativo';
  periodo?: string;
  tipoViolacao?: string;
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pendente':
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">Pendente</Badge>;
    case 'aprovada':
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">Aprovada</Badge>;
    case 'reprovada':
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Reprovada</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
};

const getSituacaoBadge = (situacao: 'normal' | 'alerta') => {
  if (situacao === 'alerta') {
    return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">Alerta</Badge>;
  }
  return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">Normal</Badge>;
};

const getJustificadaBadge = (justificada: string) => {
  if (justificada === 'Sim') {
    return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">Sim</Badge>;
  }
  return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Não</Badge>;
};

// Mini Sparkline Component
const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => (
  <div className="w-16 h-6">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.map((v, i) => ({ v, i }))}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default function TimeV2Operational() {
  const [periodoFilter, setPeriodoFilter] = useState("ultimos7dias");
  const [unidadeFilter, setUnidadeFilter] = useState("todas");
  const [areaFilter, setAreaFilter] = useState("todas");
  
  // Cross-filter state
  const [filters, setFilters] = useState<FilterType>({});
  
  // Modal state
  const [detailModal, setDetailModal] = useState<{ type: string; data: any } | null>(null);
  
  // Toggle states
  const [ocorrenciasMetrica, setOcorrenciasMetrica] = useState<'quantidade' | 'horas'>('quantidade');
  const [saldoTipo, setSaldoTipo] = useState<'positivo' | 'negativo'>('positivo');

  // Clear specific filter
  const clearFilter = useCallback((key: keyof FilterType) => {
    setFilters(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Check if any filters are active
  const hasActiveFilters = Object.keys(filters).length > 0;

  // Filtered data based on cross-filters
  const filteredHorasExtras = useMemo(() => {
    let data = [...horasExtrasPorColaborador];
    if (filters.status) {
      data = data.filter(d => d.status.toLowerCase() === filters.status?.toLowerCase());
    }
    if (filters.kpiType === 'horasExtrasPendentes') {
      data = data.filter(d => d.status === 'Pendente');
    } else if (filters.kpiType === 'horasExtrasAprovadas') {
      data = data.filter(d => d.status === 'Aprovada');
    } else if (filters.kpiType === 'horasExtrasReprovadas') {
      data = data.filter(d => d.status === 'Reprovada');
    }
    return data;
  }, [filters]);

  const filteredRankingHE = useMemo(() => {
    return [...rankingHorasExtras];
  }, []);

  const filteredOcorrencias = useMemo(() => {
    let data = [...ocorrenciasPorColaborador];
    if (filters.tipoOcorrencia) {
      data = data.filter(d => d.tipo === filters.tipoOcorrencia);
    }
    if (filters.kpiType === 'faltasRegistradas') {
      data = data.filter(d => d.tipo === 'Falta');
    } else if (filters.kpiType === 'atrasosRegistrados') {
      data = data.filter(d => d.tipo === 'Atraso');
    }
    return data;
  }, [filters]);

  const filteredRankingOcorrencias = useMemo(() => {
    let data = [...rankingOcorrencias];
    if (filters.tipoOcorrencia) {
      data = data.filter(d => d.tipo.toLowerCase().includes(filters.tipoOcorrencia?.toLowerCase() || ''));
    }
    return data;
  }, [filters]);

  const filteredBancoHoras = useMemo(() => {
    let data = [...saldoBancoHorasPorColaborador];
    if (filters.saldoTipo === 'positivo') {
      data = data.filter(d => d.saldoNum >= 0);
    } else if (filters.saldoTipo === 'negativo') {
      data = data.filter(d => d.saldoNum < 0);
    }
    return data;
  }, [filters]);

  const filteredPeriodos = useMemo(() => {
    let data = [...periodosBancoHoras];
    if (filters.periodo) {
      data = data.filter(d => d.id === filters.periodo);
    }
    return data;
  }, [filters]);

  const filteredViolacoes = useMemo(() => {
    let data = [...violacoesPorColaborador];
    if (filters.tipoViolacao) {
      data = data.filter(d => d.tipo === filters.tipoViolacao);
    }
    if (filters.kpiType === 'violacoesAtivas') {
      // Show all violations when this KPI is selected
    }
    return data;
  }, [filters]);

  const filteredRankingViolacoes = useMemo(() => {
    let data = [...rankingViolacoes];
    if (filters.tipoViolacao) {
      data = data.filter(d => d.regras.includes(filters.tipoViolacao || ''));
    }
    return data;
  }, [filters]);

  // KPI Card click handler
  const handleKPIClick = (kpiType: string) => {
    if (filters.kpiType === kpiType) {
      clearFilter('kpiType');
    } else {
      setFilters(prev => ({ ...prev, kpiType }));
    }
  };

  // Active filter badges
  const renderActiveFilters = () => {
    if (!hasActiveFilters) return null;
    
    return (
      <div className="flex items-center gap-2 flex-wrap mb-4 p-3 bg-muted/30 rounded-lg">
        <span className="text-xs font-medium text-muted-foreground">Filtros ativos:</span>
        {filters.kpiType && (
          <Badge variant="secondary" className="gap-1 text-xs">
            KPI: {filters.kpiType.replace(/([A-Z])/g, ' $1').trim()}
            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('kpiType')} />
          </Badge>
        )}
        {filters.status && (
          <Badge variant="secondary" className="gap-1 text-xs">
            Status: {filters.status}
            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('status')} />
          </Badge>
        )}
        {filters.tipoOcorrencia && (
          <Badge variant="secondary" className="gap-1 text-xs">
            Tipo: {filters.tipoOcorrencia}
            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('tipoOcorrencia')} />
          </Badge>
        )}
        {filters.tipoViolacao && (
          <Badge variant="secondary" className="gap-1 text-xs">
            Violação: {filters.tipoViolacao}
            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('tipoViolacao')} />
          </Badge>
        )}
        {filters.periodo && (
          <Badge variant="secondary" className="gap-1 text-xs">
            Período selecionado
            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('periodo')} />
          </Badge>
        )}
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs">
          Limpar todos
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Time V2 - Acompanhamento Operacional
            </h1>
            <p className="text-muted-foreground text-sm">
              Apuração de ponto, banco de horas e compliance • Clique nos widgets para filtrar
            </p>
          </div>

          {/* Filtros Globais */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger className="w-[150px] h-8 text-xs">
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
              <SelectTrigger className="w-[120px] h-8 text-xs">
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
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="operacoes">Operações</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {renderActiveFilters()}

        {/* HERO SECTION - Status Atual */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-primary rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status Atual
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'horasExtrasPendentes', value: heroKPIsOperational.horasExtrasPendentes, label: 'HE Pendentes', icon: Clock, color: 'text-warning' },
              { key: 'horasExtrasAprovadas', value: heroKPIsOperational.horasExtrasAprovadas, label: 'HE Aprovadas', icon: CheckCircle2, color: 'text-success' },
              { key: 'horasExtrasReprovadas', value: heroKPIsOperational.horasExtrasReprovadas, label: 'HE Reprovadas', icon: XCircle, color: 'text-destructive' },
              { key: 'faltasRegistradas', value: heroKPIsOperational.faltasRegistradas, label: 'Faltas', icon: UserX, color: 'text-destructive' },
              { key: 'atrasosRegistrados', value: heroKPIsOperational.atrasosRegistrados, label: 'Atrasos', icon: Timer, color: 'text-warning' },
              { key: 'violacoesAtivas', value: heroKPIsOperational.violacoesAtivas, label: 'Violações Ativas', icon: AlertTriangle, color: 'text-destructive' },
            ].map((kpi) => (
              <Card 
                key={kpi.key}
                className={`border-0 shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${filters.kpiType === kpi.key ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                onClick={() => handleKPIClick(kpi.key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                    {filters.kpiType === kpi.key && <Badge variant="default" className="text-[10px] px-1.5 py-0">Ativo</Badge>}
                  </div>
                  <p className="text-2xl font-bold">{kpi.value.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SEÇÃO 2 – Horas Extras */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-secondary rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Horas Extras
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Stacked Bar Chart */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Horas Extras por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={horasExtrasPorStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="periodo" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar 
                      dataKey="pendente" 
                      stackId="a" 
                      fill={COLORS.warning} 
                      name="Pendente" 
                      cursor="pointer"
                      onClick={() => setFilters(prev => ({ ...prev, status: prev.status === 'Pendente' ? undefined : 'Pendente' }))}
                    >
                      {horasExtrasPorStatus.map((_, index) => (
                        <Cell key={index} opacity={filters.status && filters.status !== 'Pendente' ? 0.3 : 1} />
                      ))}
                    </Bar>
                    <Bar 
                      dataKey="aprovada" 
                      stackId="a" 
                      fill={COLORS.success} 
                      name="Aprovada"
                      cursor="pointer"
                      onClick={() => setFilters(prev => ({ ...prev, status: prev.status === 'Aprovada' ? undefined : 'Aprovada' }))}
                    >
                      {horasExtrasPorStatus.map((_, index) => (
                        <Cell key={index} opacity={filters.status && filters.status !== 'Aprovada' ? 0.3 : 1} />
                      ))}
                    </Bar>
                    <Bar 
                      dataKey="reprovada" 
                      stackId="a" 
                      fill={COLORS.destructive} 
                      name="Reprovada" 
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={() => setFilters(prev => ({ ...prev, status: prev.status === 'Reprovada' ? undefined : 'Reprovada' }))}
                    >
                      {horasExtrasPorStatus.map((_, index) => (
                        <Cell key={index} opacity={filters.status && filters.status !== 'Reprovada' ? 0.3 : 1} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ranking de Horas Extras */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Top 10 - Horas Extras</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={filteredRankingHE.slice(0, 10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis dataKey="colaborador" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} width={90} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                              <p className="font-semibold text-xs">{data.colaborador}</p>
                              <p className="text-xs">{data.horasExtras}h ({data.percentual}%)</p>
                              <div className="mt-1">
                                <span className="text-[10px] text-muted-foreground">Tendência:</span>
                                <MiniSparkline data={data.historico} color={COLORS.chart1} />
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="horasExtras" 
                      fill={COLORS.chart1} 
                      radius={[0, 4, 4, 0]} 
                    >
                      {filteredRankingHE.slice(0, 10).map((entry) => (
                        <Cell 
                          key={entry.id} 
                          fill={COLORS.chart1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Horas Extras */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Lista de Horas Extras</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setDetailModal({ type: 'exportar', data: filteredHorasExtras })}>
                    <Download className="h-3 w-3" /> Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[200px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs">Qtd</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Gestor</TableHead>
                      <TableHead className="text-xs w-[60px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHorasExtras.slice(0, 8).map((row) => (
                      <TableRow 
                        key={row.id} 
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="text-xs font-medium py-2">{row.colaborador}</TableCell>
                        <TableCell className="text-xs py-2">{row.data}</TableCell>
                        <TableCell className="text-xs py-2">{row.quantidade}</TableCell>
                        <TableCell className="py-2">{getStatusBadge(row.status)}</TableCell>
                        <TableCell className="text-xs py-2">{row.gestor}</TableCell>
                        <TableCell className="py-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetailModal({ type: 'colaborador', data: row })}>
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p className="text-xs">Ver detalhes</p></TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SEÇÃO 3 – Faltas, Atrasos e Ausências */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-chart-3 rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Faltas, Atrasos e Ausências
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar Chart por Tipo */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Ocorrências por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={ocorrenciasPorTipo} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis dataKey="tipo" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} width={130} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "11px" }} />
                    <Bar 
                      dataKey="quantidade" 
                      fill={COLORS.chart3} 
                      radius={[0, 4, 4, 0]} 
                      cursor="pointer"
                      onClick={(data) => setFilters(prev => ({ ...prev, tipoOcorrencia: prev.tipoOcorrencia === data.tipo ? undefined : data.tipo }))}
                    >
                      {ocorrenciasPorTipo.map((entry) => (
                        <Cell 
                          key={entry.tipo} 
                          fill={filters.tipoOcorrencia === entry.tipo ? COLORS.primary : COLORS.chart3}
                          opacity={filters.tipoOcorrencia && filters.tipoOcorrencia !== entry.tipo ? 0.4 : 1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ranking de Ocorrências */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Top 10 - Ocorrências</CardTitle>
                  <Tabs value={ocorrenciasMetrica} onValueChange={(v) => setOcorrenciasMetrica(v as 'quantidade' | 'horas')} className="h-7">
                    <TabsList className="h-7">
                      <TabsTrigger value="quantidade" className="text-[10px] h-6 px-2">Qtd</TabsTrigger>
                      <TabsTrigger value="horas" className="text-[10px] h-6 px-2">Horas</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={filteredRankingOcorrencias.slice(0, 10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis dataKey="colaborador" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} width={90} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "11px" }} />
                    <Bar 
                      dataKey={ocorrenciasMetrica === 'quantidade' ? 'ocorrencias' : 'horasImpactadas'} 
                      fill={COLORS.warning} 
                      radius={[0, 4, 4, 0]}
                    >
                      {filteredRankingOcorrencias.slice(0, 10).map((entry) => (
                        <Cell 
                          key={entry.id} 
                          fill={COLORS.warning}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Ocorrências */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Ocorrências por Colaborador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[180px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">Tipo</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs">Justif.</TableHead>
                      <TableHead className="text-xs">Gestor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOcorrencias.slice(0, 6).map((row) => (
                      <TableRow 
                        key={row.id} 
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="text-xs font-medium py-2">{row.colaborador}</TableCell>
                        <TableCell className="text-xs py-2">{row.tipo}</TableCell>
                        <TableCell className="text-xs py-2">{row.data}</TableCell>
                        <TableCell className="py-2">{getJustificadaBadge(row.justificada)}</TableCell>
                        <TableCell className="text-xs py-2">{row.gestor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SEÇÃO 4 – Banco de Horas */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-success rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Banco de Horas
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Créditos vs Débitos */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Créditos vs Débitos no Período</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={creditosDebitosData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="periodo" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="creditos" fill={COLORS.success} name="Créditos" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="debitos" fill={COLORS.destructive} name="Débitos" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ranking de Saldo */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Ranking de Saldo</CardTitle>
                  <Tabs value={saldoTipo} onValueChange={(v) => { setSaldoTipo(v as 'positivo' | 'negativo'); setFilters(prev => ({ ...prev, saldoTipo: v as 'positivo' | 'negativo' })); }} className="h-7">
                    <TabsList className="h-7">
                      <TabsTrigger value="positivo" className="text-[10px] h-6 px-2">+ Positivo</TabsTrigger>
                      <TabsTrigger value="negativo" className="text-[10px] h-6 px-2">- Negativo</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={(saldoTipo === 'positivo' ? rankingSaldoPositivo : rankingSaldoNegativo).slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis dataKey="colaborador" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} width={90} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                              <p className="font-semibold text-xs">{data.colaborador}</p>
                              <p className="text-xs">Saldo: {data.saldo}h</p>
                              <p className="text-[10px] text-muted-foreground">Acumulado: {data.acumulado}h | Compensado: {data.compensado}h</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="saldo" 
                      fill={saldoTipo === 'positivo' ? COLORS.success : COLORS.destructive} 
                      radius={[0, 4, 4, 0]}
                    >
                      {(saldoTipo === 'positivo' ? rankingSaldoPositivo : rankingSaldoNegativo).slice(0, 8).map((entry) => (
                        <Cell 
                          key={entry.id} 
                          fill={saldoTipo === 'positivo' ? COLORS.success : COLORS.destructive}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Saldos */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Saldo por Colaborador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[180px] overflow-auto">
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
                    {filteredBancoHoras.map((row) => (
                      <TableRow 
                        key={row.id} 
                        className="hover:bg-muted/50"
                      >
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
        </section>

        {/* SEÇÃO 5 – Compensação de Banco de Horas */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-warning rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Compensação de Banco de Horas
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* KPI Card */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-card to-warning/5">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Timer className="h-5 w-5 text-warning" />
                </div>
                <p className="text-3xl font-bold text-foreground">{horasDisponiveis.toLocaleString('pt-BR')}h</p>
                <p className="text-sm text-muted-foreground mt-1">Horas disponíveis para compensação</p>
              </CardContent>
            </Card>

            {/* Ranking de Horas a Vencer */}
            <Card className="border-0 shadow-md lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Horas a Vencer por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={rankingHorasVencer} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis dataKey="periodo" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={70} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                              <p className="font-semibold text-xs">{data.periodo}</p>
                              <p className="text-xs">{data.horasVencer}h a vencer</p>
                              <p className="text-[10px] text-muted-foreground">{data.diasRestantes} dias restantes</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Users className="h-3 w-3" />
                                <span className="text-[10px]">{data.colaboradores} colaboradores</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="horasVencer" 
                      radius={[0, 4, 4, 0]}
                      cursor="pointer"
                      onClick={(data) => setFilters(prev => ({ ...prev, periodo: prev.periodo === data.id ? undefined : data.id }))}
                    >
                      {rankingHorasVencer.map((entry) => (
                        <Cell 
                          key={entry.id} 
                          fill={entry.diasRestantes < 100 ? COLORS.destructive : entry.diasRestantes < 150 ? COLORS.warning : COLORS.success}
                          opacity={filters.periodo && filters.periodo !== entry.id ? 0.4 : 1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Períodos */}
          <Card className="border-0 shadow-md">
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
                      <TableHead className="text-xs w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPeriodos.map((row) => (
                      <TableRow 
                        key={row.id} 
                        className={`cursor-pointer hover:bg-muted/50 ${filters.periodo === row.id ? 'bg-primary/20' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, periodo: prev.periodo === row.id ? undefined : row.id }))}
                      >
                        <TableCell className="text-xs font-medium py-2">{row.periodo}</TableCell>
                        <TableCell className="text-xs text-right py-2">{row.disponiveis}</TableCell>
                        <TableCell className="text-xs text-right py-2 text-success">{row.compensadas}</TableCell>
                        <TableCell className="text-xs text-right py-2 text-warning">{row.pendentes}</TableCell>
                        <TableCell className="text-xs py-2">{row.vencimento}</TableCell>
                        <TableCell className="py-2">
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={(e) => { e.stopPropagation(); setDetailModal({ type: 'colaboradoresImpactados', data: row }); }}>
                            <Users className="h-3 w-3 mr-1" /> {row.colaboradoresImpactados}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SEÇÃO 6 – Compliance Operacional */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-destructive rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Compliance Operacional
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar Chart por Tipo */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Violações por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={violacoesPorTipoOperacional}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tipo" stroke="hsl(var(--muted-foreground))" fontSize={8} angle={-15} textAnchor="end" height={50} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "11px" }} />
                    <Bar 
                      dataKey="quantidade" 
                      fill={COLORS.destructive} 
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={(data) => setFilters(prev => ({ ...prev, tipoViolacao: prev.tipoViolacao === data.tipo ? undefined : data.tipo }))}
                    >
                      {violacoesPorTipoOperacional.map((entry) => (
                        <Cell 
                          key={entry.tipo} 
                          fill={filters.tipoViolacao === entry.tipo ? COLORS.primary : COLORS.destructive}
                          opacity={filters.tipoViolacao && filters.tipoViolacao !== entry.tipo ? 0.4 : 1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ranking de Violações */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Top 10 - Violações</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={filteredRankingViolacoes.slice(0, 10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis dataKey="colaborador" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} width={90} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                              <p className="font-semibold text-xs">{data.colaborador}</p>
                              <p className="text-xs">{data.violacoes} violações</p>
                              <p className="text-[10px] text-warning">{data.reincidencias} reincidências</p>
                              <p className="text-[10px] text-muted-foreground">Regras: {data.regras.join(', ')}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="violacoes" 
                      fill={COLORS.destructive} 
                      radius={[0, 4, 4, 0]}
                    >
                      {filteredRankingViolacoes.slice(0, 10).map((entry) => (
                        <Cell 
                          key={entry.id} 
                          fill={COLORS.destructive}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Violações */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Violações por Colaborador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[180px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">Tipo</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs">Regra Violada</TableHead>
                      <TableHead className="text-xs">Área</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredViolacoes.map((row) => (
                      <TableRow 
                        key={row.id} 
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="text-xs font-medium py-2">{row.colaborador}</TableCell>
                        <TableCell className="text-xs py-2">{row.tipo}</TableCell>
                        <TableCell className="text-xs py-2">{row.data}</TableCell>
                        <TableCell className="text-xs py-2 text-muted-foreground">{row.regra}</TableCell>
                        <TableCell className="text-xs py-2">{row.area}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {detailModal?.type === 'colaborador' && `Detalhes - ${detailModal.data.colaborador}`}
              {detailModal?.type === 'colaboradoresImpactados' && `Colaboradores Impactados - ${detailModal.data.periodo}`}
              {detailModal?.type === 'exportar' && 'Exportar Dados'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {detailModal?.type === 'colaborador' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Gestor</p>
                    <p className="text-sm font-medium">{detailModal.data.gestor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Área</p>
                    <p className="text-sm font-medium">{detailModal.data.area}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data</p>
                    <p className="text-sm font-medium">{detailModal.data.data}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    {getStatusBadge(detailModal.data.status)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Histórico de Horas Extras (últimas 5 semanas)</p>
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={detailModal.data.historico.map((v: number, i: number) => ({ semana: `S${i+1}`, valor: v }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="semana" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Line type="monotone" dataKey="valor" stroke={COLORS.chart1} strokeWidth={2} dot />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="text-xs">Ver histórico mensal</Button>
                  <Button variant="outline" size="sm" className="text-xs">Exportar dados</Button>
                </div>
              </div>
            )}
            {detailModal?.type === 'colaboradoresImpactados' && (
              <div className="space-y-3">
                <p className="text-sm">{detailModal.data.colaboradoresImpactados} colaboradores com horas a vencer neste período.</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Horas Disponíveis</p>
                    <p className="font-medium">{detailModal.data.disponiveis}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vencimento</p>
                    <p className="font-medium">{detailModal.data.vencimento}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs w-full">Ver lista completa de colaboradores</Button>
              </div>
            )}
            {detailModal?.type === 'exportar' && (
              <div className="space-y-3">
                <p className="text-sm">{detailModal.data.length} registros para exportar.</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">Exportar CSV</Button>
                  <Button variant="outline" size="sm" className="text-xs">Exportar Excel</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
