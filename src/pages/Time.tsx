import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { TimeDashboardProvider, useTimeDashboard } from "@/contexts/TimeDashboardContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, ScatterChart, Scatter } from "recharts";
import { X, Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, XCircle, Users } from "lucide-react";
import { bigNumbers, jornadaMensal, jornadaPorEmpresa, horasExtrasPorPosto, colaboradorHorasExtras, bancoHorasMensal, eventosCompliance, compliancePorCliente, complianceMensal, aprovacaoHorasExtras, motivosReprovacao, gestoresAprovacao, aprovacaoMensal, atrasosFaltasPorCliente, colaboradorAtrasosFaltas } from "@/lib/timeData";
import { useMemo } from "react";
const COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
  muted: "hsl(var(--muted))",
  accent: "hsl(var(--accent))"
};
function TimeDashboardContent() {
  const {
    activeFilters,
    addFilter,
    removeFilter,
    clearFilters,
    isFilterActive
  } = useTimeDashboard();

  // Filtered data based on active filters
  const filteredJornadaPorEmpresa = useMemo(() => {
    let filtered = [...jornadaPorEmpresa];
    activeFilters.forEach(filter => {
      if (filter.type === "empresa") {
        filtered = filtered.filter(d => d.empresa === filter.value);
      } else if (filter.type === "cliente") {
        filtered = filtered.filter(d => d.cliente === filter.value);
      }
    });
    return filtered;
  }, [activeFilters]);
  const filteredHorasExtrasPorPosto = useMemo(() => {
    let filtered = [...horasExtrasPorPosto];
    activeFilters.forEach(filter => {
      if (filter.type === "empresa") {
        filtered = filtered.filter(d => d.empresa === filter.value);
      } else if (filter.type === "cliente") {
        filtered = filtered.filter(d => d.cliente === filter.value);
      } else if (filter.type === "posto") {
        filtered = filtered.filter(d => d.posto === filter.value);
      }
    });
    return filtered;
  }, [activeFilters]);
  const filteredColaboradorHorasExtras = useMemo(() => {
    let filtered = [...colaboradorHorasExtras];
    activeFilters.forEach(filter => {
      if (filter.type === "empresa") {
        filtered = filtered.filter(d => d.empresa === filter.value);
      } else if (filter.type === "cliente") {
        filtered = filtered.filter(d => d.cliente === filter.value);
      } else if (filter.type === "posto") {
        filtered = filtered.filter(d => d.posto === filter.value);
      } else if (filter.type === "colaborador") {
        filtered = filtered.filter(d => d.id === filter.value);
      }
    });
    return filtered;
  }, [activeFilters]);
  const filteredCompliancePorCliente = useMemo(() => {
    let filtered = [...compliancePorCliente];
    activeFilters.forEach(filter => {
      if (filter.type === "empresa") {
        filtered = filtered.filter(d => d.empresa === filter.value);
      } else if (filter.type === "cliente") {
        filtered = filtered.filter(d => d.cliente === filter.value);
      }
    });
    return filtered;
  }, [activeFilters]);
  const filteredAtrasosFaltasPorCliente = useMemo(() => {
    let filtered = [...atrasosFaltasPorCliente];
    activeFilters.forEach(filter => {
      if (filter.type === "empresa") {
        filtered = filtered.filter(d => d.empresa === filter.value);
      } else if (filter.type === "cliente") {
        filtered = filtered.filter(d => d.cliente === filter.value);
      }
    });
    return filtered;
  }, [activeFilters]);
  const filteredColaboradorAtrasosFaltas = useMemo(() => {
    let filtered = [...colaboradorAtrasosFaltas];
    activeFilters.forEach(filter => {
      if (filter.type === "empresa") {
        filtered = filtered.filter(d => d.empresa === filter.value);
      } else if (filter.type === "cliente") {
        filtered = filtered.filter(d => d.cliente === filter.value);
      } else if (filter.type === "posto") {
        filtered = filtered.filter(d => d.posto === filter.value);
      } else if (filter.type === "colaborador") {
        filtered = filtered.filter(d => d.id === filter.value);
      }
    });
    return filtered;
  }, [activeFilters]);
  const handleEmpresaClick = (empresa: string) => {
    if (isFilterActive("empresa", empresa)) {
      removeFilter("empresa", empresa);
    } else {
      addFilter({
        type: "empresa",
        value: empresa,
        label: `Empresa: ${empresa}`
      });
    }
  };
  const handleClienteClick = (cliente: string) => {
    if (isFilterActive("cliente", cliente)) {
      removeFilter("cliente", cliente);
    } else {
      addFilter({
        type: "cliente",
        value: cliente,
        label: `Cliente: ${cliente}`
      });
    }
  };
  const handlePostoClick = (posto: string) => {
    if (isFilterActive("posto", posto)) {
      removeFilter("posto", posto);
    } else {
      addFilter({
        type: "posto",
        value: posto,
        label: `Posto: ${posto}`
      });
    }
  };
  const handleColaboradorClick = (id: string, colaborador: string) => {
    if (isFilterActive("colaborador", id)) {
      removeFilter("colaborador", id);
    } else {
      addFilter({
        type: "colaborador",
        value: id,
        label: `Colaborador: ${colaborador}`
      });
    }
  };
  const aprovacaoData = [{
    name: "Aprovadas",
    value: aprovacaoHorasExtras.aprovadas,
    fill: COLORS.success
  }, {
    name: "Reprovadas",
    value: aprovacaoHorasExtras.reprovadas,
    fill: COLORS.destructive
  }];
  return <div className="min-h-screen bg-background">
      
      
      <div className="container mx-auto p-6 space-y-6">
        
         {/* Active Filters Display */}
         {activeFilters.length > 0 && <Card>
             <CardContent className="p-4">
               <div className="flex items-center gap-2 flex-wrap">
                 <span className="text-sm font-semibold">Filtros ativos:</span>
                 {activeFilters.map((filter, idx) => <Badge key={idx} variant="secondary" className="gap-2">
                     {filter.label}
                     <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter.type, filter.value)} />
                   </Badge>)}
                 <Button variant="ghost" size="sm" onClick={clearFilters}>
                   Limpar todos
                 </Button>
               </div>
             </CardContent>
           </Card>}

         {/* BIG NUMBERS - 4x2 Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Horas Previstas" value={bigNumbers.horasPrevistas.toLocaleString("pt-BR") + "h"} icon={Clock} />
          <KPICard title="Horas Realizadas" value={bigNumbers.horasRealizadas.toLocaleString("pt-BR") + "h"} icon={TrendingUp} />
          <KPICard title="Diferença Previsto vs Realizado" value={`+${bigNumbers.diferencaPrevistoRealizado.toLocaleString("pt-BR")}h`} trend={{
          value: bigNumbers.diferencaPrevistoRealizado / bigNumbers.horasPrevistas * 100,
          isPositive: false
        }} icon={TrendingUp} />
          <KPICard title="Horas Extras Totais" value={bigNumbers.horasExtrasTotais.toLocaleString("pt-BR") + "h"} icon={AlertTriangle} />
          <KPICard title="Saldo Banco de Horas (Média)" value={`${bigNumbers.saldoBancoHoras.toFixed(1)}h`} icon={Clock} />
          <KPICard title="Compliance Trabalhista" value={`${bigNumbers.complianceTrabalhista.toFixed(1)}%`} trend={{
          value: bigNumbers.complianceTrabalhista,
          isPositive: bigNumbers.complianceTrabalhista >= 85
        }} icon={CheckCircle2} />
          <KPICard title="HE Aprovadas" value={`${bigNumbers.horasExtrasAprovadas.toFixed(1)}%`} icon={CheckCircle2} />
          <KPICard title="HE Reprovadas" value={`${bigNumbers.horasExtrasReprovadas.toFixed(1)}%`} icon={XCircle} />
        </div>

         {/* SEÇÃO 1: JORNADA PREVISTA X REALIZADA */}
         <div className="space-y-6">
           <h2 className="text-xl font-semibold mb-4">1. Jornada Prevista x Realizada</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Evolução Mensal */}
            <ChartCard title="Evolução Mensal - Previsto vs Realizado">
               <ResponsiveContainer width="100%" height={300}>
                 <AreaChart data={jornadaMensal}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="mes" />
                   <YAxis />
                   <Tooltip />
                   <Legend />
                   <Area type="monotone" dataKey="previstas" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} name="Previstas" />
                   <Area type="monotone" dataKey="realizadas" stackId="2" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.6} name="Realizadas" />
                 </AreaChart>
               </ResponsiveContainer>
            </ChartCard>

            {/* Taxa de Aderência */}
            <ChartCard title="Taxa de Aderência Mensal (%)">
               <ResponsiveContainer width="100%" height={300}>
                 <LineChart data={jornadaMensal}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="mes" />
                   <YAxis domain={[95, 125]} />
                   <Tooltip />
                   <Legend />
                   <Line type="monotone" dataKey="aderencia" stroke={COLORS.secondary} strokeWidth={2} name="Aderência (%)" />
                 </LineChart>
               </ResponsiveContainer>
            </ChartCard>
          </div>

           {/* Tabela Detalhada por Empresa/Cliente */}
           <ChartCard title="Detalhamento por Empresa e Cliente">
             <div className="max-h-[400px] overflow-auto rounded-lg">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Empresa</TableHead>
                     <TableHead>Cliente</TableHead>
                     <TableHead className="text-right">Previstas (h)</TableHead>
                     <TableHead className="text-right">Realizadas (h)</TableHead>
                     <TableHead className="text-right">Desvio (h)</TableHead>
                     <TableHead className="text-right">Aderência (%)</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredJornadaPorEmpresa.map((row, idx) => <TableRow key={idx} onClick={() => handleClienteClick(row.cliente)} className={`cursor-pointer hover:bg-accent ${isFilterActive("cliente", row.cliente) ? "bg-accent" : ""}`}>
                       <TableCell className="font-medium">{row.empresa}</TableCell>
                       <TableCell>{row.cliente}</TableCell>
                       <TableCell className="text-right">{row.previstas.toLocaleString("pt-BR")}</TableCell>
                       <TableCell className="text-right">{row.realizadas.toLocaleString("pt-BR")}</TableCell>
                       <TableCell className={`text-right font-medium ${row.desvio > 0 ? "text-warning" : "text-success"}`}>
                         {row.desvio > 0 ? "+" : ""}{row.desvio.toLocaleString("pt-BR")}
                       </TableCell>
                       <TableCell className="text-right">
                         <Badge variant={row.aderencia > 110 ? "destructive" : row.aderencia < 95 ? "destructive" : "default"}>
                           {row.aderencia.toFixed(1)}%
                         </Badge>
                       </TableCell>
                     </TableRow>)}
                 </TableBody>
               </Table>
             </div>
           </ChartCard>
        </div>

         {/* SEÇÃO 2: HORAS EXTRAS E BANCO DE HORAS */}
         <div className="space-y-6">
           <h2 className="text-xl font-semibold mb-4">2. Horas Extras e Banco de Horas</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top 10 Postos - Horas Extras */}
            <ChartCard title="Top 10 Postos - Horas Extras" action={<span className="text-xs text-muted-foreground">Clique para filtrar</span>}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredHorasExtrasPorPosto.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="posto" stroke="hsl(var(--muted-foreground))" fontSize={10} width={200} />
                  <Tooltip contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))"
                }} />
                  <Bar dataKey="horasExtras" fill={COLORS.warning} radius={[0, 4, 4, 0]} name="Horas Extras" onClick={data => handlePostoClick(data.posto)} cursor="pointer">
                    {filteredHorasExtrasPorPosto.slice(0, 10).map((entry, index) => <Cell key={`cell-${index}`} fill={isFilterActive("posto", entry.posto) ? COLORS.accent : COLORS.warning} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Histórico Banco de Horas */}
            <ChartCard title="Evolução do Banco de Horas">
               <ResponsiveContainer width="100%" height={400}>
                 <AreaChart data={bancoHorasMensal}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="mes" />
                   <YAxis />
                   <Tooltip />
                   <Legend />
                   <Area type="monotone" dataKey="credito" stackId="1" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.6} name="Crédito" />
                   <Area type="monotone" dataKey="debito" stackId="2" stroke={COLORS.destructive} fill={COLORS.destructive} fillOpacity={0.6} name="Débito" />
                 </AreaChart>
               </ResponsiveContainer>
            </ChartCard>
          </div>

           {/* Top 10 Colaboradores - Horas Extras */}
           <ChartCard title="Top 10 Colaboradores - Horas Extras e Saldo BH">
             <div className="max-h-[400px] overflow-auto rounded-lg">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Colaborador</TableHead>
                     <TableHead>Posto</TableHead>
                     <TableHead>Cliente</TableHead>
                     <TableHead className="text-right">HE (h)</TableHead>
                     <TableHead className="text-right">Saldo BH (h)</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredColaboradorHorasExtras.map((row, idx) => <TableRow key={row.id} onClick={() => handleColaboradorClick(row.id, row.colaborador)} className={`cursor-pointer hover:bg-accent ${isFilterActive("colaborador", row.id) ? "bg-accent" : ""}`}>
                      <TableCell className="font-medium">{row.colaborador}</TableCell>
                      <TableCell>{row.posto}</TableCell>
                      <TableCell>{row.cliente}</TableCell>
                      <TableCell className="text-right">{row.horasExtras}h</TableCell>
                      <TableCell className={`text-right font-medium ${row.saldoBH >= 0 ? "text-success" : "text-destructive"}`}>
                        {row.saldoBH >= 0 ? "+" : ""}{row.saldoBH}h
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </div>

         {/* SEÇÃO 3: COMPLIANCE TRABALHISTA */}
         <div className="space-y-6">
           <h2 className="text-xl font-semibold mb-4">3. Compliance Trabalhista</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Eventos por Tipo */}
            <ChartCard title="Ocorrências por Tipo de Evento">
               <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={eventosCompliance}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="tipo" fontSize={10} angle={-20} textAnchor="end" height={100} />
                   <YAxis />
                   <Tooltip />
                   <Bar dataKey="ocorrencias" fill={COLORS.destructive} radius={[4, 4, 0, 0]} name="Ocorrências" />
                 </BarChart>
               </ResponsiveContainer>
            </ChartCard>

            {/* Evolução Mensal Compliance */}
            <ChartCard title="Evolução Mensal - Compliance (%)">
               <ResponsiveContainer width="100%" height={300}>
                 <LineChart data={complianceMensal}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="mes" />
                   <YAxis domain={[80, 92]} />
                   <Tooltip />
                   <Legend />
                   <Line type="monotone" dataKey="percentualCompliance" stroke={COLORS.success} strokeWidth={2} name="Compliance (%)" />
                 </LineChart>
               </ResponsiveContainer>
            </ChartCard>
          </div>

           {/* Compliance por Cliente */}
           <ChartCard title="Compliance por Cliente">
             <div className="max-h-[400px] overflow-auto rounded-lg">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Cliente</TableHead>
                     <TableHead>Empresa</TableHead>
                     <TableHead className="text-right">Ocorrências</TableHead>
                     <TableHead className="text-right">Colab. c/ Ocorrência</TableHead>
                     <TableHead className="text-right">Total Colab.</TableHead>
                     <TableHead className="text-right">Compliance (%)</TableHead>
                   </TableRow>
                 </TableHeader>
                <TableBody>
                  {filteredCompliancePorCliente.map((row, idx) => <TableRow key={idx} onClick={() => handleClienteClick(row.cliente)} className={`cursor-pointer transition-all duration-200 ${isFilterActive("cliente", row.cliente) ? "bg-primary/10 border-l-4 border-l-primary" : idx % 2 === 0 ? "bg-background hover:bg-[#FFF5EF]" : "bg-muted/30 hover:bg-[#FFF5EF]"}`}>
                      <TableCell className="font-medium">{row.cliente}</TableCell>
                      <TableCell>{row.empresa}</TableCell>
                      <TableCell className="text-right">{row.totalOcorrencias}</TableCell>
                      <TableCell className="text-right">{row.colaboradoresComOcorrencia}</TableCell>
                      <TableCell className="text-right">{row.totalColaboradores}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.percentualCompliance >= 85 ? "default" : "destructive"}>
                          {row.percentualCompliance.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </div>

        {/* SEÇÃO 4: APROVAÇÃO DE HORAS EXTRAS */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-primary rounded-full"></div>
            <h2 className="text-xl font-semibold text-foreground">4. Aprovação de Horas Extras</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* KPIs de Aprovação */}
            <KPICard title="Total Solicitadas" value={aprovacaoHorasExtras.totalSolicitadas.toString()} icon={Users} />
            <KPICard title="Aprovadas" value={aprovacaoHorasExtras.aprovadas.toString()} icon={CheckCircle2} />
            <KPICard title="Reprovadas" value={aprovacaoHorasExtras.reprovadas.toString()} icon={XCircle} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Donut Chart - Aprovadas vs Reprovadas */}
            <ChartCard title="Distribuição - Aprovadas vs Reprovadas">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={aprovacaoData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={entry => `${entry.name}: ${entry.value}`}>
                    {aprovacaoData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Motivos de Reprovação */}
            <ChartCard title="Motivos de Reprovação">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={motivosReprovacao} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="motivo" stroke="hsl(var(--muted-foreground))" fontSize={11} width={150} />
                  <Tooltip contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))"
                }} />
                  <Bar dataKey="quantidade" fill={COLORS.destructive} radius={[0, 4, 4, 0]} name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Evolução Mensal */}
          <ChartCard title="Evolução Mensal - Solicitações e Aprovações">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aprovacaoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))"
              }} />
                <Legend />
                <Bar dataKey="solicitadas" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Solicitadas" />
                <Bar dataKey="aprovadas" fill={COLORS.success} radius={[4, 4, 0, 0]} name="Aprovadas" />
                <Bar dataKey="reprovadas" fill={COLORS.destructive} radius={[4, 4, 0, 0]} name="Reprovadas" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Ranking de Gestores */}
          <ChartCard title="Ranking de Gestores - Taxa de Reprovação">
            <div className="max-h-[400px] overflow-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground font-semibold">Gestor</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Empresa</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Solicitadas</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Aprovadas</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Reprovadas</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Taxa Reprovação (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gestoresAprovacao.map((row, idx) => <TableRow key={idx} className={idx % 2 === 0 ? "bg-background hover:bg-[#FFF5EF]" : "bg-muted/30 hover:bg-[#FFF5EF]"}>
                      <TableCell className="font-medium">{row.gestor}</TableCell>
                      <TableCell>{row.empresa}</TableCell>
                      <TableCell className="text-right">{row.solicitadas}</TableCell>
                      <TableCell className="text-right">{row.aprovadas}</TableCell>
                      <TableCell className="text-right">{row.reprovadas}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.taxaReprovacao > 25 ? "destructive" : row.taxaReprovacao > 20 ? "secondary" : "default"}>
                          {row.taxaReprovacao.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </div>

        {/* SEÇÃO 5: ATRASOS E FALTAS */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-primary rounded-full"></div>
            <h2 className="text-xl font-semibold text-foreground">5. Atrasos e Faltas</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Atrasos e Faltas por Cliente */}
            <ChartCard title="Atrasos e Faltas por Cliente" action={<span className="text-xs text-muted-foreground">Clique para filtrar</span>}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredAtrasosFaltasPorCliente}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="cliente" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-20} textAnchor="end" height={120} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))"
                }} />
                  <Legend />
                  <Bar dataKey="atrasos" stackId="a" fill={COLORS.warning} radius={[0, 0, 0, 0]} name="Atrasos" onClick={data => handleClienteClick(data.cliente)} cursor="pointer">
                    {filteredAtrasosFaltasPorCliente.map((entry, index) => <Cell key={`cell-atrasos-${index}`} fill={isFilterActive("cliente", entry.cliente) ? COLORS.accent : COLORS.warning} />)}
                  </Bar>
                  <Bar dataKey="faltas" stackId="a" fill={COLORS.destructive} radius={[4, 4, 0, 0]} name="Faltas" onClick={data => handleClienteClick(data.cliente)} cursor="pointer">
                    {filteredAtrasosFaltasPorCliente.map((entry, index) => <Cell key={`cell-faltas-${index}`} fill={isFilterActive("cliente", entry.cliente) ? COLORS.accent : COLORS.destructive} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Correlação Atrasos x Horas Extras */}
            <ChartCard title="Correlação: Atrasos x Horas Extras">
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="atrasos" name="Atrasos" stroke="hsl(var(--muted-foreground))" fontSize={12} label={{
                  value: "Atrasos",
                  position: "bottom"
                }} />
                  <YAxis dataKey="horasExtras" name="Horas Extras" stroke="hsl(var(--muted-foreground))" fontSize={12} label={{
                  value: "Horas Extras",
                  angle: -90,
                  position: "left"
                }} />
                  <Tooltip contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))"
                }} cursor={{
                  strokeDasharray: '3 3'
                }} />
                  <Scatter name="Colaboradores" data={filteredColaboradorAtrasosFaltas} fill={COLORS.secondary} />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Top 10 Colaboradores */}
          <ChartCard title="Top 10 Colaboradores - Atrasos e Faltas" action={<span className="text-xs text-muted-foreground">Clique para filtrar</span>}>
            <div className="max-h-[400px] overflow-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground font-semibold">Colaborador</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Posto</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Cliente</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Atrasos</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Faltas</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">HE (h)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredColaboradorAtrasosFaltas.map((row, idx) => <TableRow key={row.id} onClick={() => handleColaboradorClick(row.id, row.colaborador)} className={`cursor-pointer transition-all duration-200 ${isFilterActive("colaborador", row.id) ? "bg-primary/10 border-l-4 border-l-primary" : idx % 2 === 0 ? "bg-background hover:bg-[#FFF5EF]" : "bg-muted/30 hover:bg-[#FFF5EF]"}`}>
                      <TableCell className="font-medium">{row.colaborador}</TableCell>
                      <TableCell>{row.posto}</TableCell>
                      <TableCell>{row.cliente}</TableCell>
                      <TableCell className="text-right text-warning font-medium">{row.atrasos}</TableCell>
                      <TableCell className="text-right text-destructive font-medium">{row.faltas}</TableCell>
                      <TableCell className="text-right">{row.horasExtras}h</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </div>

      </div>
    </div>;
}
const Time = () => {
  return <TimeDashboardProvider>
      <TimeDashboardContent />
    </TimeDashboardProvider>;
};
export default Time;