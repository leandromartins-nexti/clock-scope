import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/dashboard/KPICard";
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
  PieChart,
  Pie,
  ComposedChart,
} from "recharts";
import { Clock, CheckCircle2, XCircle, AlertTriangle, UserX, Timer, Calendar, X, TrendingUp, Users, Download, ExternalLink, Eye, Scale, ArrowRight, FileText, BarChart3 } from "lucide-react";
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
  solicitacoesHEPorStatus,
  rankingGestoresPendentes,
  aprovacaoVsReprovacao,
  totalHorasExtras,
  rankingColaboradoresHE,
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

// Detail Modal Types
type DetailModalType = 
  | { type: 'distribuicaoDia'; data: { dia: string; horas: number; acumulado: number } }
  | { type: 'colaboradorHE'; data: typeof rankingColaboradoresHE[0] }
  | { type: 'statusHE'; data: { status: string; periodo: string; quantidade: number } }
  | { type: 'gestorPendentes'; data: typeof rankingGestoresPendentes[0] }
  | { type: 'decisao'; data: { tipo: string; value: number; percentual: number } }
  | { type: 'ocorrenciaTipo'; data: typeof ocorrenciasPorTipo[0] }
  | { type: 'ocorrenciaColaborador'; data: typeof rankingOcorrencias[0] }
  | { type: 'creditoDebito'; data: typeof creditosDebitosData[0] }
  | { type: 'saldoColaborador'; data: typeof rankingSaldoPositivo[0] & { tipo: 'positivo' | 'negativo' } }
  | { type: 'horasVencer'; data: typeof rankingHorasVencer[0] }
  | { type: 'violacaoTipo'; data: typeof violacoesPorTipoOperacional[0] }
  | { type: 'violacaoColaborador'; data: typeof rankingViolacoes[0] }
  | { type: 'rankingColaboradoresHE'; data: typeof rankingColaboradoresHE }
  | { type: 'colaboradoresImpactados'; data: typeof periodosBancoHoras[0] }
  | { type: 'exportar'; data: any[] }
  | null;

export default function TimeV2Operational() {
  const [periodoFilter, setPeriodoFilter] = useState("ultimos7dias");
  const [unidadeFilter, setUnidadeFilter] = useState("todas");
  const [areaFilter, setAreaFilter] = useState("todas");
  
  // KPI filter state (simplified)
  const [filters, setFilters] = useState<FilterType>({});
  
  // Modal state
  const [detailModal, setDetailModal] = useState<DetailModalType>(null);
  
  // Toggle states
  const [ocorrenciasMetrica, setOcorrenciasMetrica] = useState<'quantidade' | 'horas'>('quantidade');
  const [saldoTipo, setSaldoTipo] = useState<'positivo' | 'negativo'>('positivo');

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Check if any filters are active
  const hasActiveFilters = Object.keys(filters).length > 0;

  // Filtered data based on KPI filters only
  const filteredHorasExtras = useMemo(() => {
    let data = [...horasExtrasPorColaborador];
    if (filters.kpiType === 'horasExtrasPendentes') {
      data = data.filter(d => d.status === 'Pendente');
    } else if (filters.kpiType === 'horasExtrasAprovadas') {
      data = data.filter(d => d.status === 'Aprovada');
    } else if (filters.kpiType === 'horasExtrasReprovadas') {
      data = data.filter(d => d.status === 'Reprovada');
    }
    return data;
  }, [filters]);

  const filteredOcorrencias = useMemo(() => {
    let data = [...ocorrenciasPorColaborador];
    if (filters.kpiType === 'faltasRegistradas') {
      data = data.filter(d => d.tipo === 'Falta');
    } else if (filters.kpiType === 'atrasosRegistrados') {
      data = data.filter(d => d.tipo === 'Atraso');
    }
    return data;
  }, [filters]);

  const filteredBancoHoras = useMemo(() => {
    return [...saldoBancoHorasPorColaborador];
  }, []);

  const filteredViolacoes = useMemo(() => {
    return [...violacoesPorColaborador];
  }, []);

  // KPI Card click handler
  const handleKPIClick = (kpiType: string) => {
    if (filters.kpiType === kpiType) {
      setFilters({});
    } else {
      setFilters({ kpiType });
    }
  };

  // Clear specific filter
  const clearFilter = useCallback((key: keyof FilterType) => {
    setFilters(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

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
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs">
          Limpar todos
        </Button>
      </div>
    );
  };

  // Render Detail Modal Content
  const renderModalContent = () => {
    if (!detailModal) return null;

    switch (detailModal.type) {
      case 'distribuicaoDia':
        const diaData = detailModal.data;
        const mediaHoras = totalHorasExtras.mediaPerido;
        const diferenca = diaData.horas - mediaHoras;
        const colaboradoresDia = rankingColaboradoresHE.filter(c => c.distribuicao[['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].indexOf(diaData.dia)] > 0);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Horas no Dia</p>
                <p className="text-2xl font-bold text-primary">{diaData.horas}h</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Acumulado</p>
                <p className="text-2xl font-bold">{diaData.acumulado.toLocaleString('pt-BR')}h</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">vs Média</p>
                <p className={`text-2xl font-bold ${diferenca >= 0 ? 'text-warning' : 'text-success'}`}>
                  {diferenca >= 0 ? '+' : ''}{diferenca}h
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Colaboradores com HE neste dia ({colaboradoresDia.length})</p>
              <div className="max-h-[200px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">Área</TableHead>
                      <TableHead className="text-xs text-right">Horas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colaboradoresDia.slice(0, 10).map((col) => (
                      <TableRow key={col.id}>
                        <TableCell className="text-xs font-medium">{col.colaborador}</TableCell>
                        <TableCell className="text-xs">{col.area}</TableCell>
                        <TableCell className="text-xs text-right font-semibold">
                          {col.distribuicao[['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].indexOf(diaData.dia)]}h
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <p className="text-xs text-muted-foreground">
                {diferenca > 50 ? 'Atenção: Volume de HE significativamente acima da média. Avaliar necessidade de reforço de escala.' : 
                 diferenca < -50 ? 'Dia com baixo volume de HE, dentro do esperado.' :
                 'Volume de HE dentro da média esperada para o período.'}
              </p>
            </div>
          </div>
        );

      case 'colaboradorHE':
        const colabData = detailModal.data;
        const percentualTotal = ((colabData.horasExtras / totalHorasExtras.horasAtuais) * 100).toFixed(1);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total de HE</p>
                <p className="text-2xl font-bold text-primary">{colabData.horasExtras}h</p>
                <p className="text-[10px] text-muted-foreground">{percentualTotal}% do total</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Gestor Responsável</p>
                <p className="text-lg font-semibold">{colabData.gestor}</p>
                <p className="text-[10px] text-muted-foreground">{colabData.area}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Distribuição Semanal</p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={colabData.distribuicao.map((h, i) => ({ dia: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i], horas: h }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="dia" fontSize={10} />
                    <YAxis fontSize={10} unit="h" />
                    <Bar dataKey="horas" fill={COLORS.chart1} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              {colabData.horasExtras > 40 ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <p className="text-xs text-warning">Colaborador com alto volume de HE. Recomendar análise de carga de trabalho.</p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <p className="text-xs text-success">Volume de HE dentro do padrão esperado.</p>
                </>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="text-xs">
                <FileText className="h-3 w-3 mr-1" /> Ver histórico completo
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" /> Exportar dados
              </Button>
            </div>
          </div>
        );

      case 'statusHE':
        const statusData = detailModal.data;
        const colaboradoresStatus = horasExtrasPorColaborador.filter(c => c.status.toLowerCase() === statusData.status.toLowerCase());
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Quantidade</p>
                <p className="text-2xl font-bold">{statusData.quantidade}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Período</p>
                <p className="text-lg font-semibold">{statusData.periodo}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Solicitações {statusData.status}s ({colaboradoresStatus.length})</p>
              <div className="max-h-[200px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs">Gestor</TableHead>
                      <TableHead className="text-xs text-right">Horas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colaboradoresStatus.map((col) => (
                      <TableRow key={col.id}>
                        <TableCell className="text-xs font-medium">{col.colaborador}</TableCell>
                        <TableCell className="text-xs">{col.data}</TableCell>
                        <TableCell className="text-xs">{col.gestor}</TableCell>
                        <TableCell className="text-xs text-right">{col.quantidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      case 'gestorPendentes':
        const gestorData = detailModal.data;
        const colaboradoresGestor = horasExtrasPorColaborador.filter(c => c.gestor === gestorData.gestor && c.status === 'Pendente');
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-warning/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Horas Pendentes</p>
                <p className="text-2xl font-bold text-warning">{gestorData.horasPendentes}h</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Solicitações</p>
                <p className="text-2xl font-bold">{gestorData.qtdSolicitacoes}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">{gestorData.diasMedio}d</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Solicitações Pendentes de {gestorData.gestor}</p>
              <div className="max-h-[200px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs text-right">Horas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colaboradoresGestor.map((col) => (
                      <TableRow key={col.id}>
                        <TableCell className="text-xs font-medium">{col.colaborador}</TableCell>
                        <TableCell className="text-xs">{col.data}</TableCell>
                        <TableCell className="text-xs text-right">{col.quantidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <p className="text-xs text-muted-foreground">
                {gestorData.diasMedio > 3 ? 
                  'Atenção: Tempo médio de aprovação acima do SLA. Recomendar acompanhamento.' : 
                  'Tempo de aprovação dentro do esperado.'}
              </p>
            </div>
          </div>
        );

      case 'decisao':
        const decisaoData = detailModal.data;
        const isAprovada = decisaoData.tipo === 'Aprovadas';
        const colaboradoresDecisao = horasExtrasPorColaborador.filter(c => 
          isAprovada ? c.status === 'Aprovada' : c.status === 'Reprovada'
        );
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className={`${isAprovada ? 'bg-success/10' : 'bg-destructive/10'} rounded-lg p-3`}>
                <p className="text-xs text-muted-foreground">Total {decisaoData.tipo}</p>
                <p className={`text-2xl font-bold ${isAprovada ? 'text-success' : 'text-destructive'}`}>
                  {decisaoData.value.toLocaleString('pt-BR')}h
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Percentual</p>
                <p className="text-2xl font-bold">{decisaoData.percentual.toFixed(1)}%</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Últimas solicitações {decisaoData.tipo.toLowerCase()} ({colaboradoresDecisao.length})</p>
              <div className="max-h-[200px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs">Gestor</TableHead>
                      <TableHead className="text-xs text-right">Horas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colaboradoresDecisao.slice(0, 10).map((col) => (
                      <TableRow key={col.id}>
                        <TableCell className="text-xs font-medium">{col.colaborador}</TableCell>
                        <TableCell className="text-xs">{col.data}</TableCell>
                        <TableCell className="text-xs">{col.gestor}</TableCell>
                        <TableCell className="text-xs text-right">{col.quantidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      case 'ocorrenciaTipo':
        const tipoOcorrencia = detailModal.data;
        const colaboradoresTipo = ocorrenciasPorColaborador.filter(c => c.tipo === tipoOcorrencia.tipo);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-warning/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total de Ocorrências</p>
                <p className="text-2xl font-bold text-warning">{tipoOcorrencia.quantidade}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Colaboradores Impactados</p>
                <p className="text-2xl font-bold">{colaboradoresTipo.length}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Ocorrências de {tipoOcorrencia.tipo}</p>
              <div className="max-h-[200px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs">Justificada</TableHead>
                      <TableHead className="text-xs">Gestor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colaboradoresTipo.map((col) => (
                      <TableRow key={col.id}>
                        <TableCell className="text-xs font-medium">{col.colaborador}</TableCell>
                        <TableCell className="text-xs">{col.data}</TableCell>
                        <TableCell>{getJustificadaBadge(col.justificada)}</TableCell>
                        <TableCell className="text-xs">{col.gestor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      case 'ocorrenciaColaborador':
        const colabOcorrencia = detailModal.data;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-warning/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Ocorrências</p>
                <p className="text-2xl font-bold text-warning">{colabOcorrencia.ocorrencias}</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Horas Impactadas</p>
                <p className="text-2xl font-bold text-destructive">{colabOcorrencia.horasImpactadas}h</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Tipo Principal</p>
                <p className="text-lg font-semibold">{colabOcorrencia.tipo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <p className="text-xs text-muted-foreground">
                {colabOcorrencia.ocorrencias >= 10 ? 
                  'Colaborador com alto número de ocorrências. Recomendar acompanhamento com gestor.' :
                  colabOcorrencia.ocorrencias >= 5 ?
                  'Colaborador requer atenção. Avaliar padrão de ocorrências.' :
                  'Número de ocorrências dentro do esperado.'}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="text-xs">
                <FileText className="h-3 w-3 mr-1" /> Ver histórico completo
              </Button>
            </div>
          </div>
        );

      case 'creditoDebito':
        const creditoDebitoData = detailModal.data;
        const saldo = creditoDebitoData.creditos - creditoDebitoData.debitos;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-success/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Créditos</p>
                <p className="text-2xl font-bold text-success">{creditoDebitoData.creditos}h</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Débitos</p>
                <p className="text-2xl font-bold text-destructive">{creditoDebitoData.debitos}h</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {saldo >= 0 ? '+' : ''}{saldo}h
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Análise do Período: {creditoDebitoData.periodo}</p>
              <p className="text-xs text-muted-foreground">
                {saldo >= 100 ? 
                  'Período com saldo positivo significativo. Recomenda-se planejar compensações para evitar acúmulo excessivo.' :
                  saldo >= 0 ?
                  'Saldo equilibrado no período. Fluxo de horas dentro do esperado.' :
                  'Período com mais débitos que créditos. Avaliar carga de trabalho da equipe.'}
              </p>
            </div>
          </div>
        );

      case 'saldoColaborador':
        const saldoColab = detailModal.data;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className={`${saldoColab.tipo === 'positivo' ? 'bg-success/10' : 'bg-destructive/10'} rounded-lg p-3`}>
                <p className="text-xs text-muted-foreground">Saldo Atual</p>
                <p className={`text-2xl font-bold ${saldoColab.tipo === 'positivo' ? 'text-success' : 'text-destructive'}`}>
                  {saldoColab.saldo}h
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Acumulado</p>
                <p className="text-2xl font-bold">{saldoColab.acumulado}h</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Compensado</p>
                <p className="text-2xl font-bold">{saldoColab.compensado}h</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              {saldoColab.tipo === 'positivo' && saldoColab.saldo > 35 ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <p className="text-xs text-warning">Saldo próximo do limite. Recomenda-se programar compensação.</p>
                </>
              ) : saldoColab.tipo === 'negativo' ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <p className="text-xs text-destructive">Colaborador com saldo negativo. Verificar necessidade de ajuste.</p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <p className="text-xs text-success">Saldo dentro do limite permitido.</p>
                </>
              )}
            </div>
          </div>
        );

      case 'horasVencer':
        const horasVencerData = detailModal.data;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className={`${horasVencerData.diasRestantes < 100 ? 'bg-destructive/10' : horasVencerData.diasRestantes < 150 ? 'bg-warning/10' : 'bg-success/10'} rounded-lg p-3`}>
                <p className="text-xs text-muted-foreground">Horas a Vencer</p>
                <p className={`text-2xl font-bold ${horasVencerData.diasRestantes < 100 ? 'text-destructive' : horasVencerData.diasRestantes < 150 ? 'text-warning' : 'text-success'}`}>
                  {horasVencerData.horasVencer}h
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Dias Restantes</p>
                <p className="text-2xl font-bold">{horasVencerData.diasRestantes}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Colaboradores</p>
                <p className="text-2xl font-bold">{horasVencerData.colaboradores}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <AlertTriangle className={`h-4 w-4 ${horasVencerData.diasRestantes < 100 ? 'text-destructive' : 'text-warning'}`} />
              <p className="text-xs text-muted-foreground">
                {horasVencerData.diasRestantes < 100 ? 
                  'Urgente: Horas próximas do vencimento. Iniciar plano de compensação imediato.' :
                  horasVencerData.diasRestantes < 150 ?
                  'Atenção: Período de vencimento se aproximando. Planejar compensações.' :
                  'Prazo confortável para planejamento de compensações.'}
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs w-full">
              <Users className="h-3 w-3 mr-1" /> Ver colaboradores impactados
            </Button>
          </div>
        );

      case 'violacaoTipo':
        const violacaoTipoData = detailModal.data;
        const colaboradoresViolacao = violacoesPorColaborador.filter(v => v.tipo === violacaoTipoData.tipo);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-destructive/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total de Violações</p>
                <p className="text-2xl font-bold text-destructive">{violacaoTipoData.quantidade}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Colaboradores</p>
                <p className="text-2xl font-bold">{colaboradoresViolacao.length}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Violações de {violacaoTipoData.tipo}</p>
              <div className="max-h-[200px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs">Regra</TableHead>
                      <TableHead className="text-xs text-right">Reincidências</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colaboradoresViolacao.map((col) => (
                      <TableRow key={col.id}>
                        <TableCell className="text-xs font-medium">{col.colaborador}</TableCell>
                        <TableCell className="text-xs">{col.data}</TableCell>
                        <TableCell className="text-xs">{col.regra}</TableCell>
                        <TableCell className="text-xs text-right text-warning">{col.reincidencias}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-xs text-destructive">
                Violação de compliance. Ação corretiva necessária para evitar passivos trabalhistas.
              </p>
            </div>
          </div>
        );

      case 'violacaoColaborador':
        const violacaoColab = detailModal.data;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-destructive/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Violações</p>
                <p className="text-2xl font-bold text-destructive">{violacaoColab.violacoes}</p>
              </div>
              <div className="bg-warning/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Reincidências</p>
                <p className="text-2xl font-bold text-warning">{violacaoColab.reincidencias}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Regras Violadas</p>
                <p className="text-lg font-semibold">{violacaoColab.regras.length}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Regras Violadas</p>
              <div className="flex flex-wrap gap-2">
                {violacaoColab.regras.map((regra, idx) => (
                  <Badge key={idx} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                    {regra}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-xs text-destructive">
                {violacaoColab.reincidencias >= 4 ?
                  'Colaborador reincidente. Necessária intervenção do RH e gestão.' :
                  violacaoColab.reincidencias >= 2 ?
                  'Padrão de reincidência identificado. Agendar feedback com colaborador.' :
                  'Monitorar comportamento para evitar recorrência.'}
              </p>
            </div>
          </div>
        );

      case 'rankingColaboradoresHE':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Top 10 colaboradores com maior volume de horas extras no período.
            </p>
            <div className="max-h-[350px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">#</TableHead>
                    <TableHead className="text-xs">Colaborador</TableHead>
                    <TableHead className="text-xs">Área</TableHead>
                    <TableHead className="text-xs">Gestor</TableHead>
                    <TableHead className="text-xs text-right">Total HE</TableHead>
                    <TableHead className="text-xs w-[80px]">Distrib. Semanal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailModal.data.map((row, idx) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="text-xs font-medium py-2">{idx + 1}</TableCell>
                      <TableCell className="text-xs font-medium py-2">{row.colaborador}</TableCell>
                      <TableCell className="text-xs py-2">{row.area}</TableCell>
                      <TableCell className="text-xs py-2">{row.gestor}</TableCell>
                      <TableCell className="text-xs py-2 text-right font-semibold">{row.horasExtras}h</TableCell>
                      <TableCell className="py-2">
                        <MiniSparkline data={row.distribuicao} color={COLORS.chart1} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" /> Exportar dados
              </Button>
            </div>
          </div>
        );

      case 'colaboradoresImpactados':
        return (
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
        );

      case 'exportar':
        return (
          <div className="space-y-3">
            <p className="text-sm">{detailModal.data.length} registros para exportar.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">Exportar CSV</Button>
              <Button variant="outline" size="sm" className="text-xs">Exportar Excel</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Get modal title based on type
  const getModalTitle = () => {
    if (!detailModal) return '';
    
    switch (detailModal.type) {
      case 'distribuicaoDia':
        return `Detalhes de Horas Extras - ${detailModal.data.dia}`;
      case 'colaboradorHE':
        return `Detalhes do Colaborador - ${detailModal.data.colaborador}`;
      case 'statusHE':
        return `Solicitações ${detailModal.data.status}s - ${detailModal.data.periodo}`;
      case 'gestorPendentes':
        return `Pendências - ${detailModal.data.gestor}`;
      case 'decisao':
        return `${detailModal.data.tipo} no Período`;
      case 'ocorrenciaTipo':
        return `Ocorrências - ${detailModal.data.tipo}`;
      case 'ocorrenciaColaborador':
        return `Detalhes - ${detailModal.data.colaborador}`;
      case 'creditoDebito':
        return `Créditos vs Débitos - ${detailModal.data.periodo}`;
      case 'saldoColaborador':
        return `Saldo de Banco de Horas - ${detailModal.data.colaborador}`;
      case 'horasVencer':
        return `Horas a Vencer - ${detailModal.data.periodo}`;
      case 'violacaoTipo':
        return `Violações - ${detailModal.data.tipo}`;
      case 'violacaoColaborador':
        return `Violações - ${detailModal.data.colaborador}`;
      case 'rankingColaboradoresHE':
        return 'Ranking de Colaboradores com Mais HE';
      case 'colaboradoresImpactados':
        return `Colaboradores Impactados - ${detailModal.data.periodo}`;
      case 'exportar':
        return 'Exportar Dados';
      default:
        return 'Detalhes';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Visão Operacional
            </h1>
            <p className="text-muted-foreground text-sm">
              Apuração de ponto, banco de horas e compliance
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

        {/* HERO SECTION - Visão Geral */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-primary rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Visão Geral
            </h2>
          </div>

          {/* Primeira linha - 4 KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              title="Total de Horas Extras"
              value={`${heroKPIsOperational.totalHorasExtras.toLocaleString('pt-BR')}h`}
              icon={Clock}
            />
            <KPICard
              title="Saldo Banco de Horas"
              value={`${heroKPIsOperational.totalSaldoBanco.toLocaleString('pt-BR')}h`}
              icon={Scale}
            />
            <KPICard
              title="HE Pendentes"
              value={heroKPIsOperational.horasExtrasPendentes.toLocaleString('pt-BR')}
              icon={Clock}
            />
            <KPICard
              title="HE Aprovadas"
              value={heroKPIsOperational.horasExtrasAprovadas.toLocaleString('pt-BR')}
              icon={CheckCircle2}
            />
          </div>

          {/* Segunda linha - 4 KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              title="HE Reprovadas"
              value={heroKPIsOperational.horasExtrasReprovadas.toLocaleString('pt-BR')}
              icon={XCircle}
            />
            <KPICard
              title="Faltas"
              value={heroKPIsOperational.faltasRegistradas.toLocaleString('pt-BR')}
              icon={UserX}
            />
            <KPICard
              title="Atrasos"
              value={heroKPIsOperational.atrasosRegistrados.toLocaleString('pt-BR')}
              icon={Timer}
            />
            <KPICard
              title="Violações Ativas"
              value={heroKPIsOperational.violacoesAtivas.toLocaleString('pt-BR')}
              icon={AlertTriangle}
            />
          </div>
        </section>

        {/* SEÇÃO 2 – Horas Extras */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-secondary rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Horas Extras
            </h2>
          </div>

          {/* TOPO DA SEÇÃO - Visão Rápida */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Widget 1 - Distribuição de Horas Extras (Combo Chart) */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">Distribuição de Horas Extras</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                      {totalHorasExtras.horasAtuais.toLocaleString('pt-BR')}h total
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] ${totalHorasExtras.variacao >= 0 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-success/10 text-success border-success/20'}`}
                    >
                      {totalHorasExtras.variacao >= 0 ? '↑' : '↓'} {Math.abs(totalHorasExtras.variacao).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={totalHorasExtras.distribuicaoPorDia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <RechartsTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const horasData = payload.find(p => p.dataKey === 'horas');
                          const acumuladoData = payload.find(p => p.dataKey === 'acumulado');
                          const horas = horasData?.value as number || 0;
                          const acumulado = acumuladoData?.value as number || 0;
                          return (
                            <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold text-sm mb-2">{label}</p>
                              <div className="space-y-1">
                                <p className="text-xs text-primary font-medium">{horas}h no dia</p>
                                <p className="text-xs text-muted-foreground">Acumulado: {acumulado.toLocaleString('pt-BR')}h</p>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar 
                      yAxisId="left" 
                      dataKey="horas" 
                      fill={COLORS.chart1} 
                      name="Horas/Dia"
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'distribuicaoDia', data: { dia: data.dia, horas: data.horas, acumulado: data.acumulado } });
                        }
                      }}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="acumulado" 
                      stroke={COLORS.chart2} 
                      strokeWidth={2} 
                      dot={{ fill: COLORS.chart2, r: 3 }} 
                      name="Acumulado"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Widget 2 - Ranking de Colaboradores com mais HE */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-semibold">Top 10 Colaboradores com Mais HE</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => setDetailModal({ type: 'rankingColaboradoresHE', data: rankingColaboradoresHE })}
                  >
                    <Eye className="h-3 w-3" /> Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={rankingColaboradoresHE.slice(0, 10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} unit="h" />
                    <YAxis dataKey="colaborador" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} width={100} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                              <p className="font-semibold text-xs">{data.colaborador}</p>
                              <p className="text-xs text-primary">{data.horasExtras}h no período</p>
                              <p className="text-[10px] text-muted-foreground">Área: {data.area}</p>
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
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
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'colaboradorHE', data });
                        }
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Subseção - Aprovações */}
          <div className="flex items-center gap-2 pt-2">
            <div className="h-0.5 w-4 bg-muted-foreground/30 rounded-full" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Aprovações</span>
          </div>

          {/* Widget 1 - Solicitações de HE por Status (Stacked Bar) */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Solicitações de HE por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={horasExtrasPorStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="periodo" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <RechartsTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                            <p className="font-semibold text-xs mb-1">{label}</p>
                            {payload.map((entry, idx) => (
                              <p key={idx} className="text-xs" style={{ color: entry.color }}>
                                {entry.name}: {entry.value}
                              </p>
                            ))}
                            <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar 
                    dataKey="pendente" 
                    stackId="a" 
                    fill={COLORS.warning} 
                    name="Pendentes" 
                    cursor="pointer"
                    onClick={(data) => {
                      if (data) {
                        setDetailModal({ type: 'statusHE', data: { status: 'Pendente', periodo: data.periodo, quantidade: data.pendente } });
                      }
                    }}
                  />
                  <Bar 
                    dataKey="aprovada" 
                    stackId="a" 
                    fill={COLORS.success} 
                    name="Aprovadas"
                    cursor="pointer"
                    onClick={(data) => {
                      if (data) {
                        setDetailModal({ type: 'statusHE', data: { status: 'Aprovada', periodo: data.periodo, quantidade: data.aprovada } });
                      }
                    }}
                  />
                  <Bar 
                    dataKey="reprovada" 
                    stackId="a" 
                    fill={COLORS.destructive} 
                    name="Reprovadas" 
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                    onClick={(data) => {
                      if (data) {
                        setDetailModal({ type: 'statusHE', data: { status: 'Reprovada', periodo: data.periodo, quantidade: data.reprovada } });
                      }
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Widget 2 - Ranking de Gestores com HE Pendentes */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Gestores com HE Pendentes</CardTitle>
                  <Badge variant="outline" className="text-[10px]">Prioridade</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={rankingGestoresPendentes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis dataKey="gestor" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} width={100} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                              <p className="font-semibold text-xs">{data.gestor}</p>
                              <p className="text-xs text-warning">{data.horasPendentes}h pendentes</p>
                              <p className="text-xs text-muted-foreground">{data.qtdSolicitacoes} solicitações</p>
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="horasPendentes" 
                      fill={COLORS.warning} 
                      radius={[0, 4, 4, 0]} 
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'gestorPendentes', data });
                        }
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Widget 3 - Donut Chart Aprovadas vs Reprovadas */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Decisões no Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={aprovacaoVsReprovacao}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        cursor="pointer"
                        onClick={(data) => {
                          if (data) {
                            setDetailModal({ type: 'decisao', data: { tipo: data.name, value: data.value, percentual: data.percentual } });
                          }
                        }}
                      >
                        <Cell fill={COLORS.success} />
                        <Cell fill={COLORS.destructive} />
                      </Pie>
                      <RechartsTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                                <p className="font-semibold text-xs">{data.name}</p>
                                <p className="text-xs">{data.value.toLocaleString('pt-BR')}h ({data.percentual}%)</p>
                                <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-xs">Aprovadas: {solicitacoesHEPorStatus.aprovadas.toLocaleString('pt-BR')}h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="text-xs">Reprovadas: {solicitacoesHEPorStatus.reprovadas}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Horas Extras */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Lista de Horas Extras</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs gap-1"
                    onClick={() => setDetailModal({ type: 'exportar', data: filteredHorasExtras })}
                  >
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
                      <TableHead className="text-xs">Quantidade</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Gestor</TableHead>
                      <TableHead className="text-xs w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHorasExtras.map((row) => (
                      <TableRow 
                        key={row.id} 
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="text-xs font-medium py-2">{row.colaborador}</TableCell>
                        <TableCell className="text-xs py-2">{row.data}</TableCell>
                        <TableCell className="text-xs py-2">{row.quantidade}</TableCell>
                        <TableCell className="py-2">{getStatusBadge(row.status)}</TableCell>
                        <TableCell className="text-xs py-2">{row.gestor}</TableCell>
                        <TableCell className="py-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-[10px] px-2 gap-1"
                            onClick={() => {
                              const colabData = rankingColaboradoresHE.find(c => c.colaborador === row.colaborador);
                              if (colabData) {
                                setDetailModal({ type: 'colaboradorHE', data: colabData });
                              }
                            }}
                          >
                            <Eye className="h-3 w-3" /> Ver detalhes
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

        {/* SEÇÃO 3 – Ocorrências */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-warning rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ocorrências
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar Chart de Ocorrências por Tipo */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Ocorrências por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={ocorrenciasPorTipo}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tipo" stroke="hsl(var(--muted-foreground))" fontSize={9} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                              <p className="font-semibold text-xs">{data.tipo}</p>
                              <p className="text-xs">{data.quantidade} ocorrências</p>
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="quantidade" 
                      fill={COLORS.warning} 
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'ocorrenciaTipo', data });
                        }
                      }}
                    />
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
                  <BarChart data={rankingOcorrencias.slice(0, 10)} layout="vertical">
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
                              <p className="text-xs">{data.ocorrencias} ocorrências</p>
                              <p className="text-xs text-muted-foreground">{data.horasImpactadas}h impactadas</p>
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey={ocorrenciasMetrica === 'quantidade' ? 'ocorrencias' : 'horasImpactadas'} 
                      fill={COLORS.warning} 
                      radius={[0, 4, 4, 0]}
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'ocorrenciaColaborador', data });
                        }
                      }}
                    />
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
                      <TableHead className="text-xs">Justificada</TableHead>
                      <TableHead className="text-xs">Gestor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOcorrencias.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/50">
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
                    <RechartsTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = creditosDebitosData.find(d => d.periodo === label);
                          return (
                            <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                              <p className="font-semibold text-xs mb-1">{label}</p>
                              <p className="text-xs text-success">Créditos: {data?.creditos}h</p>
                              <p className="text-xs text-destructive">Débitos: {data?.debitos}h</p>
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar 
                      dataKey="creditos" 
                      fill={COLORS.success} 
                      name="Créditos" 
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'creditoDebito', data });
                        }
                      }}
                    />
                    <Bar 
                      dataKey="debitos" 
                      fill={COLORS.destructive} 
                      name="Débitos" 
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'creditoDebito', data });
                        }
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ranking de Saldo */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Ranking de Saldo</CardTitle>
                  <Tabs value={saldoTipo} onValueChange={(v) => setSaldoTipo(v as 'positivo' | 'negativo')} className="h-7">
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
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
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
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'saldoColaborador', data: { ...data, tipo: saldoTipo } });
                        }
                      }}
                    />
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
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
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
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'horasVencer', data });
                        }
                      }}
                    >
                      {rankingHorasVencer.map((entry) => (
                        <Cell 
                          key={entry.id} 
                          fill={entry.diasRestantes < 100 ? COLORS.destructive : entry.diasRestantes < 150 ? COLORS.warning : COLORS.success}
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
                    {periodosBancoHoras.map((row) => (
                      <TableRow 
                        key={row.id} 
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="text-xs font-medium py-2">{row.periodo}</TableCell>
                        <TableCell className="text-xs text-right py-2">{row.disponiveis}</TableCell>
                        <TableCell className="text-xs text-right py-2 text-success">{row.compensadas}</TableCell>
                        <TableCell className="text-xs text-right py-2 text-warning">{row.pendentes}</TableCell>
                        <TableCell className="text-xs py-2">{row.vencimento}</TableCell>
                        <TableCell className="py-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-[10px] px-2" 
                            onClick={() => setDetailModal({ type: 'colaboradoresImpactados', data: row })}
                          >
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
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-md p-2 shadow-lg">
                              <p className="font-semibold text-xs">{data.tipo}</p>
                              <p className="text-xs text-destructive">{data.quantidade} violações</p>
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="quantidade" 
                      fill={COLORS.destructive} 
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'violacaoTipo', data });
                        }
                      }}
                    />
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
                  <BarChart data={rankingViolacoes.slice(0, 10)} layout="vertical">
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
                              <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Clique para ver detalhes</p>
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
                      cursor="pointer"
                      onClick={(data) => {
                        if (data) {
                          setDetailModal({ type: 'violacaoColaborador', data });
                        }
                      }}
                    />
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {getModalTitle()}
            </DialogTitle>
          </DialogHeader>
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
