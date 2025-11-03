import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Users, UserCheck, UserX, AlertTriangle, Umbrella, Calendar, Shield } from "lucide-react";
import { operationalOverview, colaboradoresPorSituacao } from "@/lib/managementData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const ManagementOverview = () => {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <DashboardHeader 
        title="Visão Geral Operacional" 
        breadcrumbs={["Management Analytics", "Visão Geral"]}
      />

      <main className="p-8 space-y-6">
        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Qtde Vagas"
            value={operationalOverview.qtdVagas.toLocaleString()}
            icon={Calendar}
          />
          <KPICard
            title="Qtde Colaboradores Efetivos"
            value={operationalOverview.qtdColaboradoresEfetivos.toLocaleString()}
            icon={Users}
          />
          <KPICard
            title="Qtde Presentes"
            value={operationalOverview.qtdPresentes.toLocaleString()}
            icon={UserCheck}
          />
          <KPICard
            title="Qtde Possíveis Faltantes"
            value={operationalOverview.qtdPossiveisFaltantes.toLocaleString()}
            icon={AlertTriangle}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="Qtde Ausentes"
            value={operationalOverview.qtdAusentes.toLocaleString()}
            icon={UserX}
          />
          <KPICard
            title="Qtde Férias"
            value={operationalOverview.qtdFerias.toLocaleString()}
            icon={Umbrella}
          />
          <KPICard
            title="Coberturas do Dia"
            value={operationalOverview.coberturasDia.toLocaleString()}
            icon={Shield}
          />
        </div>

        {/* Colaboradores por Situação - Donut Chart */}
        <ChartCard title="Colaboradores por Situação">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={colaboradoresPorSituacao}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={150}
                  paddingAngle={2}
                  dataKey="quantidade"
                  label={({ situacao, quantidade }) => `${situacao}: ${quantidade}`}
                >
                  {colaboradoresPorSituacao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </main>
    </div>
  );
};

export default ManagementOverview;
