import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Clock, TrendingDown, AlertCircle, CheckCircle2, ChevronRight, Home } from "lucide-react";
import { useState, useMemo } from "react";
import { useFilters } from "@/contexts/FilterContext";
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
} from "recharts";
import {
  idleHoursByRole,
  coverageReasons,
  absenceReasons,
  coverageEvolution,
  reservaTecnicaEvolution,
  coverageReasonsByMonth,
  absenceReasonsByMonth,
  coverageEvolutionByCompany,
  coverageEvolutionByArea,
  coverageEvolutionByClient,
  coverageEvolutionByPosition,
  coverageEvolutionByEmployee,
} from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Operational = () => {
  const { filters, addFilter } = useFilters();
  
  const totalIdleHours = idleHoursByRole.reduce((sum, item) => sum + item.hours, 0);
  const coveragePercentage = 88.5;
  
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownFilter, setDrillDownFilter] = useState<{
    type: 'role' | 'company' | 'unit';
    value: string;
  } | null>(null);

  // Filter data based on active filters
  const filteredIdleHours = useMemo(() => {
    if (filters.length === 0) return idleHoursByRole;
    
    return idleHoursByRole.filter((item) => {
      return filters.every((filter) => {
        if (filter.category === 'role') return item.role === filter.value;
        if (filter.category === 'company') return item.company === filter.value;
        if (filter.category === 'unit') return item.unit === filter.value;
        return true;
      });
    });
  }, [filters]);

  // Coverage drill-down state
  type DrillDownLevel = 'root' | 'company' | 'area' | 'client' | 'position' | 'employee';
  const [coverageDrillLevel, setCoverageDrillLevel] = useState<DrillDownLevel>('root');
  const [coverageDrillPath, setCoverageDrillPath] = useState<Array<{ level: DrillDownLevel; label: string }>>([
    { level: 'root', label: 'Geral' }
  ]);

  const getCoverageData = () => {
    switch (coverageDrillLevel) {
      case 'company': return coverageEvolutionByCompany;
      case 'area': return coverageEvolutionByArea;
      case 'client': return coverageEvolutionByClient;
      case 'position': return coverageEvolutionByPosition;
      case 'employee': return coverageEvolutionByEmployee;
      default: return coverageEvolution;
    }
  };

  const handleCoverageDrillDown = () => {
    const levelOrder: DrillDownLevel[] = ['root', 'company', 'area', 'client', 'position', 'employee'];
    const currentIndex = levelOrder.indexOf(coverageDrillLevel);
    
    if (currentIndex < levelOrder.length - 1) {
      const nextLevel = levelOrder[currentIndex + 1];
      setCoverageDrillLevel(nextLevel);
      
      const levelLabels: Record<DrillDownLevel, string> = {
        root: 'Geral',
        company: 'Nexti',
        area: 'Administrativa',
        client: 'Cliente A',
        position: 'Porteiro',
        employee: 'João Silva'
      };
      
      setCoverageDrillPath([...coverageDrillPath, { level: nextLevel, label: levelLabels[nextLevel] }]);
    }
  };

  const handleCoverageBreadcrumb = (level: DrillDownLevel) => {
    setCoverageDrillLevel(level);
    const pathIndex = coverageDrillPath.findIndex(item => item.level === level);
    setCoverageDrillPath(coverageDrillPath.slice(0, pathIndex + 1));
  };

  const handleDrillDown = (type: 'role' | 'company' | 'unit', value: string) => {
    setDrillDownFilter({ type, value });
    setDrillDownOpen(true);
  };

  const filteredData = drillDownFilter
    ? idleHoursByRole.filter((item) => {
        if (drillDownFilter.type === 'role') return item.role === drillDownFilter.value;
        if (drillDownFilter.type === 'company') return item.company === drillDownFilter.value;
        if (drillDownFilter.type === 'unit') return item.unit === drillDownFilter.value;
        return true;
      })
    : [];

  const totalFilteredHours = filteredData.reduce((sum, item) => sum + item.hours, 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Unidade de Negócio" 
        breadcrumbs={["Registro de ponto", "Cliente"]}
      />

      <main className="container mx-auto p-6 space-y-6">
        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Solicitações de Cobertura"
            value="2.890"
            icon={AlertCircle}
          />
          <KPICard
            title="Cobertura de Ausências"
            value={`${coveragePercentage}%`}
            icon={CheckCircle2}
            trend={{ value: 5.2, isPositive: true }}
          />
          <KPICard
            title="Ociosidade Total (Horas)"
            value={totalIdleHours.toLocaleString()}
            icon={Clock}
          />
          <KPICard
            title="Redução de Ociosidade"
            value="18%"
            icon={TrendingDown}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Reserva Técnica Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Reserva Técnica Operacional</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Análise de Ociosidade por Cargo">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={filteredIdleHours}
                    onClick={(data) => {
                      if (data && data.activePayload && data.activePayload[0]) {
                        const item = data.activePayload[0].payload;
                        addFilter({
                          category: 'role',
                          value: item.role,
                          label: `Cargo: ${item.role}`,
                        });
                      }
                    }}
                  >
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="role" angle={-45} textAnchor="end" height={100} />
                     <YAxis />
                     <Tooltip />
                     <Bar dataKey="hours" fill="hsl(var(--chart-1))" cursor="pointer" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Evolução da Reserva Técnica">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={reservaTecnicaEvolution}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="month" />
                     <YAxis />
                     <Tooltip />
                     <Legend />
                     <Line 
                       type="monotone" 
                       dataKey="hours" 
                       stroke="hsl(var(--chart-2))" 
                       strokeWidth={2}
                       name="Horas de Ociosidade"
                     />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

           <ChartCard title="Detalhamento por Unidade">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Cargo</TableHead>
                     <TableHead>Empresa</TableHead>
                     <TableHead>Unidade</TableHead>
                     <TableHead className="text-right">Horas</TableHead>
                   </TableRow>
                 </TableHeader>
               <TableBody>
                 {filteredIdleHours.map((item, index) => (
                   <TableRow 
                     key={index}
                     className="cursor-pointer hover:bg-accent"
                   >
                     <TableCell 
                       className="font-medium"
                       onClick={() => {
                         addFilter({
                           category: 'role',
                           value: item.role,
                           label: `Cargo: ${item.role}`,
                         });
                       }}
                     >
                       {item.role}
                     </TableCell>
                     <TableCell 
                       onClick={() => {
                         addFilter({
                           category: 'company',
                           value: item.company,
                           label: `Empresa: ${item.company}`,
                         });
                       }}
                     >
                       {item.company}
                     </TableCell>
                     <TableCell 
                       onClick={() => {
                         addFilter({
                           category: 'unit',
                           value: item.unit,
                           label: `Unidade: ${item.unit}`,
                         });
                       }}
                     >
                       {item.unit}
                     </TableCell>
                     <TableCell className="text-right">{item.hours}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </ChartCard>
        </div>

        {/* Coverage and Absence Reasons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Recurso por Motivo de Cobertura</h2>

            <ChartCard title="Evolução Mensal por Motivo">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart 
                     data={coverageReasonsByMonth}
                     onClick={(data) => {
                       if (data && data.activeLabel) {
                         addFilter({
                           category: 'mês',
                           value: data.activeLabel,
                           label: `Mês: ${data.activeLabel}`,
                         });
                         
                         if (data.activePayload && data.activePayload.length > 0) {
                           const clickedReason = data.activePayload[0].dataKey;
                           addFilter({
                             category: 'coverage_reason',
                             value: clickedReason as string,
                             label: `Motivo: ${clickedReason}`,
                           });
                         }
                       }
                     }}
                   >
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="month" />
                     <YAxis />
                     <Tooltip />
                     <Legend 
                       onClick={(e) => {
                         if (e.dataKey) {
                           addFilter({
                             category: 'coverage_reason',
                             value: e.dataKey as string,
                             label: `Motivo: ${e.dataKey}`,
                           });
                         }
                       }}
                       wrapperStyle={{ cursor: 'pointer' }}
                     />
                     <Bar dataKey="Férias" stackId="a" fill="hsl(var(--chart-1))" cursor="pointer" />
                     <Bar dataKey="Falta" stackId="a" fill="hsl(var(--chart-2))" cursor="pointer" />
                     <Bar dataKey="Afastamento" stackId="a" fill="hsl(var(--chart-3))" cursor="pointer" />
                     <Bar dataKey="Licença Médica" stackId="a" fill="hsl(var(--chart-4))" cursor="pointer" />
                     <Bar dataKey="Outros" stackId="a" fill="hsl(var(--chart-5))" cursor="pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Top 5 Motivos de Cobertura">
              <div className="space-y-3">
                 {coverageReasons.map((reason, index) => (
                   <div 
                     key={index} 
                     className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                     onClick={() => {
                       addFilter({
                         category: 'coverage_reason',
                         value: reason.name,
                         label: `Motivo: ${reason.name}`,
                       });
                     }}
                   >
                     <div className="flex items-center gap-3">
                       <div 
                         className="w-3 h-3 rounded-full" 
                         style={{ backgroundColor: reason.color }}
                       />
                       <span className="text-sm font-medium">{reason.name}</span>
                     </div>
                     <span className="text-sm font-semibold">{reason.value}%</span>
                   </div>
                 ))}
              </div>
            </ChartCard>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Recurso por Motivo de Ausência</h2>

            <ChartCard title="Evolução Mensal por Motivo">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={absenceReasonsByMonth}
                    onClick={(data) => {
                      if (data && data.activeLabel) {
                        // Add month filter
                        addFilter({
                          category: 'mês',
                          value: data.activeLabel,
                          label: `Mês: ${data.activeLabel}`,
                        });
                        
                        // Add absence reason filter if a specific bar segment was clicked
                        if (data.activePayload && data.activePayload.length > 0) {
                          const clickedReason = data.activePayload[0].dataKey;
                          addFilter({
                            category: 'absence_reason',
                            value: clickedReason as string,
                            label: `Motivo: ${clickedReason}`,
                          });
                        }
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.4} />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend 
                      onClick={(e) => {
                        if (e.dataKey) {
                          addFilter({
                            category: 'absence_reason',
                            value: e.dataKey as string,
                            label: `Motivo: ${e.dataKey}`,
                          });
                        }
                      }}
                      wrapperStyle={{ cursor: 'pointer', paddingTop: '20px' }}
                    />
                    <Bar dataKey="Atestado Médico" stackId="a" fill="#F15A24" cursor="pointer" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Falta" stackId="a" fill="#FDB813" cursor="pointer" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Férias" stackId="a" fill="#4E4E4E" cursor="pointer" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Afastamento INSS" stackId="a" fill="#00C48C" cursor="pointer" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Licença" stackId="a" fill="#FFD166" cursor="pointer" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Outros" stackId="a" fill="#E63946" cursor="pointer" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Ranking de Motivos">
              <div className="space-y-3">
                 {absenceReasons.map((reason, index) => (
                   <div 
                     key={index} 
                     className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                     onClick={() => {
                       addFilter({
                         category: 'absence_reason',
                         value: reason.name,
                         label: `Motivo: ${reason.name}`,
                       });
                     }}
                   >
                     <div className="flex items-center gap-3">
                       <div 
                         className="w-3 h-3 rounded-full" 
                         style={{ backgroundColor: reason.color }}
                       />
                       <span className="text-sm font-medium">{reason.name}</span>
                     </div>
                     <span className="text-sm font-semibold">{reason.value}%</span>
                   </div>
                 ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Coverage Status */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Coberturas por Motivo (Status)</h2>
          
          <ChartCard 
            title="Evolução de Coberturas vs Ausências"
            action={
              <div className="flex items-center gap-2">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-sm">
                  {coverageDrillPath.map((item, index) => (
                    <div key={item.level} className="flex items-center gap-1">
                      {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      <button
                        onClick={() => handleCoverageBreadcrumb(item.level)}
                        className={`px-2 py-1 rounded hover:bg-muted transition-colors ${
                          item.level === coverageDrillLevel ? 'bg-muted font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        {item.level === 'root' ? <Home className="h-4 w-4" /> : item.label}
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Drill down button */}
                {coverageDrillLevel !== 'employee' && (
                   <Button 
                     size="sm"
                     onClick={handleCoverageDrillDown}
                     variant="default"
                   >
                     Drill Down
                     <ChevronRight className="ml-1 h-4 w-4" />
                   </Button>
                 )}
              </div>
            }
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={getCoverageData()}
                  onClick={(data) => {
                    if (data && data.activeLabel) {
                      // Add month filter
                      addFilter({
                        category: 'mês',
                        value: data.activeLabel,
                        label: `Mês: ${data.activeLabel}`,
                      });
                      
                      // Add metric filter if a specific point was clicked
                      if (data.activePayload && data.activePayload.length > 0) {
                        const clickedMetric = data.activePayload[0].dataKey;
                        const metricLabel = clickedMetric === 'absences' 
                          ? 'Ausências Lançadas' 
                          : 'Coberturas Enviadas';
                        addFilter({
                          category: 'métrica',
                          value: clickedMetric as string,
                          label: metricLabel,
                        });
                      }
                    }
                  }}
                 >
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="month" />
                   <YAxis />
                   <Tooltip />
                   <Legend 
                     onClick={(e) => {
                       if (e.dataKey) {
                         addFilter({
                           category: 'metric',
                           value: e.dataKey as string,
                           label: `Métrica: ${e.dataKey}`,
                         });
                       }
                     }}
                     wrapperStyle={{ cursor: 'pointer' }}
                   />
                   <Line 
                     type="monotone" 
                     dataKey="absences" 
                     stroke="hsl(var(--chart-3))" 
                     strokeWidth={2}
                     name="Ausências Lançadas"
                     cursor="pointer"
                   />
                   <Line 
                     type="monotone" 
                     dataKey="coveragesSent" 
                     stroke="hsl(var(--chart-1))" 
                     strokeWidth={2}
                     name="Coberturas Enviadas"
                     cursor="pointer"
                   />
                </LineChart>
              </ResponsiveContainer>
            </div>

             {/* Level indicator */}
             <div className="mt-4 p-4 rounded-lg border bg-muted/50">
               <p className="text-sm">
                 <span className="font-semibold">Nível atual:</span>{' '}
                 <span>
                   {coverageDrillLevel === 'root' && 'Visão Geral'}
                   {coverageDrillLevel === 'company' && 'Empresa'}
                   {coverageDrillLevel === 'area' && 'Área'}
                   {coverageDrillLevel === 'client' && 'Cliente'}
                   {coverageDrillLevel === 'position' && 'Posto'}
                   {coverageDrillLevel === 'employee' && 'Colaborador'}
                 </span>
               </p>
             </div>
          </ChartCard>
        </div>
      </main>

      {/* Drill-down Dialog */}
      <Dialog open={drillDownOpen} onOpenChange={setDrillDownOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhamento: {drillDownFilter?.type === 'role' ? 'Cargo' : drillDownFilter?.type === 'company' ? 'Empresa' : 'Unidade'} - {drillDownFilter?.value}
            </DialogTitle>
            <DialogDescription>
              Visualização detalhada dos dados filtrados por {drillDownFilter?.type === 'role' ? 'cargo' : drillDownFilter?.type === 'company' ? 'empresa' : 'unidade'}
            </DialogDescription>
          </DialogHeader>

           <div className="space-y-6 mt-4">
             {/* Summary Card */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-5 rounded-lg bg-card border shadow-sm">
                 <p className="text-sm font-medium mb-2 text-muted-foreground">Total de Registros</p>
                 <p className="text-3xl font-bold">{filteredData.length}</p>
               </div>
               <div className="p-5 rounded-lg bg-card border shadow-sm">
                 <p className="text-sm font-medium mb-2 text-muted-foreground">Total de Horas</p>
                 <p className="text-3xl font-bold">{totalFilteredHours.toLocaleString()}</p>
               </div>
               <div className="p-5 rounded-lg bg-card border shadow-sm">
                 <p className="text-sm font-medium mb-2 text-muted-foreground">Média de Horas</p>
                 <p className="text-3xl font-bold">
                   {filteredData.length > 0 ? Math.round(totalFilteredHours / filteredData.length) : 0}
                 </p>
               </div>
             </div>

             {/* Detailed Table */}
             <div className="border rounded-lg overflow-hidden">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Cargo</TableHead>
                     <TableHead>Empresa</TableHead>
                     <TableHead>Unidade</TableHead>
                     <TableHead className="text-right">Horas</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredData.map((item, index) => (
                     <TableRow 
                       key={index}
                       className="hover:bg-accent"
                     >
                       <TableCell className="font-medium">{item.role}</TableCell>
                       <TableCell>{item.company}</TableCell>
                       <TableCell>{item.unit}</TableCell>
                       <TableCell className="text-right">{item.hours}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>

             {/* Chart visualization */}
             <div className="border rounded-lg p-4">
               <h4 className="text-sm font-semibold mb-4">Distribuição de Horas</h4>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={filteredData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis 
                       dataKey={drillDownFilter?.type === 'role' ? 'company' : drillDownFilter?.type === 'company' ? 'unit' : 'role'} 
                       angle={-45} 
                       textAnchor="end" 
                       height={100}
                     />
                     <YAxis />
                     <Tooltip />
                     <Bar dataKey="hours" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>

             <div className="flex justify-end">
               <Button 
                 onClick={() => setDrillDownOpen(false)}
                 variant="default"
               >
                 Fechar
               </Button>
             </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Operational;
