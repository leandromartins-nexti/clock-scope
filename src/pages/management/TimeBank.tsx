import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useState } from "react";
import {
  bancoHorasOverview,
  topSaldoPositivoColaborador,
  topSaldoNegativoColaborador,
  topSaldoPositivoPosto,
  topSaldoNegativoPosto,
  colaboradoresPorPostoBancoHoras,
} from "@/lib/managementData";
import { BancoHorasPostoDetailModal } from "@/components/management/BancoHorasPostoDetailModal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const ManagementTimeBank = () => {
  const [selectedPosto, setSelectedPosto] = useState<string | null>(null);
  const [selectedPostoFullName, setSelectedPostoFullName] = useState<string | null>(null);

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
      nomeCompleto: item.nome,
      saldo: item.saldo,
    })),
    ...topSaldoNegativoPosto.slice(0, 5).map(item => ({
      nome: item.nome.split(' - ')[0],
      nomeCompleto: item.nome,
      saldo: item.saldo,
    })),
  ].sort((a, b) => b.saldo - a.saldo);

  const handleBarClick = (data: any) => {
    if (data && data.nomeCompleto) {
      setSelectedPostoFullName(data.nomeCompleto);
      setSelectedPosto(data.nome);
    }
  };

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
            title="Saldo Positivo (Total de Horas)"
            value={`${bancoHorasOverview.saldoPositivoTotal.toLocaleString()}h`}
            icon={TrendingUp}
          />
          <KPICard
            title="Saldo Negativo (Total de Horas)"
            value={`${Math.abs(bancoHorasOverview.saldoNegativoTotal).toLocaleString()}h`}
            icon={TrendingDown}
          />
          <KPICard
            title="Total de Horas Extras"
            value={`${bancoHorasOverview.horasExtrasTotal.toLocaleString()}h`}
            icon={Clock}
          />
        </div>

        {/* Top 50 Saldos de Banco de Horas - Cards Separados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Colaborador */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top 50 Saldos de Banco de Horas (Colaborador)</h3>
            <ChartCard title="Top 10 Saldos - Positivo e Negativo">
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
          </div>

          {/* Card Posto */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top 50 Saldos de Banco de Horas (Posto)</h3>
            <ChartCard title="Top 10 Saldos - Positivo e Negativo">
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={postoData} 
                    layout="vertical"
                    margin={{ left: 150 }}
                    onClick={handleBarClick}
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
                      cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="saldo" 
                      name="Saldo (horas)"
                      radius={[0, 4, 4, 0]}
                      cursor="pointer"
                      onClick={handleBarClick}
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
          </div>
        </div>
      </main>

      {/* Modal de Drill-Down */}
      {selectedPostoFullName && (
        <BancoHorasPostoDetailModal
          isOpen={!!selectedPostoFullName}
          onClose={() => {
            setSelectedPostoFullName(null);
            setSelectedPosto(null);
          }}
          posto={selectedPosto || selectedPostoFullName}
          colaboradores={colaboradoresPorPostoBancoHoras[selectedPostoFullName] || []}
        />
      )}
    </div>
  );
};

export default ManagementTimeBank;
