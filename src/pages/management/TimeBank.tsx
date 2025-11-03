import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import {
  bancoHorasOverview,
  topSaldoPositivoColaborador,
  topSaldoNegativoColaborador,
  topSaldoPositivoPosto,
  topSaldoNegativoPosto,
} from "@/lib/managementData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManagementTimeBank = () => {
  // Prepare data for diverging bar chart
  const colaboradorData = [
    ...topSaldoPositivoColaborador.map(item => ({
      nome: item.nome.split(' ')[0] + ' ' + item.nome.split(' ')[item.nome.split(' ').length - 1],
      saldo: item.saldo,
    })),
    ...topSaldoNegativoColaborador.map(item => ({
      nome: item.nome.split(' ')[0] + ' ' + item.nome.split(' ')[item.nome.split(' ').length - 1],
      saldo: item.saldo,
    })),
  ].sort((a, b) => b.saldo - a.saldo);

  const postoData = [
    ...topSaldoPositivoPosto.slice(0, 5).map(item => ({
      nome: item.nome.split(' - ')[0],
      saldo: item.saldo,
    })),
    ...topSaldoNegativoPosto.slice(0, 5).map(item => ({
      nome: item.nome.split(' - ')[0],
      saldo: item.saldo,
    })),
  ].sort((a, b) => b.saldo - a.saldo);

  return (
    <div className="flex-1 overflow-auto bg-background">
      <DashboardHeader 
        title="Análise de Banco de Horas" 
        breadcrumbs={["Management Analytics", "Banco de Horas"]}
      />

      <main className="p-8 space-y-6">
        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Saldo Positivo Banco de Horas (Total R$)"
            value={`R$ ${bancoHorasOverview.saldoPositivoTotal.toLocaleString()}`}
            icon={TrendingUp}
          />
          <KPICard
            title="Saldo Negativo Banco de Horas (Total R$)"
            value={`R$ ${Math.abs(bancoHorasOverview.saldoNegativoTotal).toLocaleString()}`}
            icon={TrendingDown}
          />
          <KPICard
            title="Qtde Horas Extras (Total)"
            value={bancoHorasOverview.horasExtrasTotal.toLocaleString()}
            icon={Clock}
          />
        </div>

        {/* Top 50 Saldos */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Top 50 Saldos</h3>
          
          <Tabs defaultValue="colaborador" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="colaborador">Por Colaborador</TabsTrigger>
              <TabsTrigger value="posto">Por Posto</TabsTrigger>
            </TabsList>

            <TabsContent value="colaborador">
              <ChartCard title="Top 10 Saldos (Colaborador) - Positivo e Negativo">
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={colaboradorData} 
                      layout="vertical"
                      margin={{ left: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="nome" 
                        width={150}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}h`, 'Saldo']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="saldo" 
                        name="Saldo (horas)"
                        radius={[0, 4, 4, 0]}
                      >
                        {colaboradorData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.saldo >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </TabsContent>

            <TabsContent value="posto">
              <ChartCard title="Top 10 Saldos (Posto) - Positivo e Negativo">
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={postoData} 
                      layout="vertical"
                      margin={{ left: 150 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="nome" 
                        width={200}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}h`, 'Saldo']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="saldo" 
                        name="Saldo (horas)"
                        radius={[0, 4, 4, 0]}
                      >
                        {postoData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.saldo >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ManagementTimeBank;
