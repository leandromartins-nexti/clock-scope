import { ChartCard } from "@/components/dashboard/ChartCard";
import { KPICard } from "@/components/dashboard/KPICard";
import { Users, UserMinus, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  turnoverByPeriod,
  terminationByGender,
  terminationByAge,
  terminationByTenure,
  terminationByRole,
  terminationReasons,
  evolucaoAdmissoes,
  evolucaoDesligamentos,
  evolucaoTurnover,
  turnoverPorEmpresaDetalhado,
} from "@/lib/primeData";
import { TurnoverClienteDetailModal } from "@/components/prime/TurnoverClienteDetailModal";
import { TurnoverPostoDetailModal } from "@/components/prime/TurnoverPostoDetailModal";

const EngagementPrime = () => {
  const totalAdmissoes = 303;
  const totalDesligamentos = 215;
  const turnoverRate = 3.6;

  // State for modals - Turnover
  const [selectedEmpresaTurnover, setSelectedEmpresaTurnover] = useState<string | null>(null);
  const [selectedClienteTurnover, setSelectedClienteTurnover] = useState<string | null>(null);

  // Prepare data for turnover table
  const turnoverTable = Object.entries(turnoverPorEmpresaDetalhado).map(([empresa, data]: [string, any]) => ({
    empresa,
    cnpj: data.cnpj,
    admissoes: data.admissoes,
    desligamentos: data.desligamentos,
    turnover: data.turnover,
  }));

  // Get clientes for selected empresa - Turnover
  const clientesTurnover = selectedEmpresaTurnover
    ? Object.entries((turnoverPorEmpresaDetalhado as any)[selectedEmpresaTurnover].clientes).map(([cliente, data]: [string, any]) => ({
        cliente,
        cnpj: data.cnpj,
        admissoes: data.admissoes,
        desligamentos: data.desligamentos,
        turnover: data.turnover,
      }))
    : [];

  // Get postos for selected cliente - Turnover
  const postosTurnover = selectedEmpresaTurnover && selectedClienteTurnover
    ? (turnoverPorEmpresaDetalhado as any)[selectedEmpresaTurnover].clientes[selectedClienteTurnover].postos
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Admissões"
            value={totalAdmissoes}
            icon={Users}
          />
          <KPICard
            title="Desligamentos"
            value={totalDesligamentos}
            icon={UserMinus}
          />
          <KPICard
            title="Turnover (%)"
            value={`${turnoverRate}%`}
            icon={TrendingUp}
          />
        </div>

        {/* Evolution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard title="Evolução de Admissões">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={evolucaoAdmissoes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="admissoes" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Evolução de Desligamentos">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={evolucaoDesligamentos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="desligamentos" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Evolução de Turnover">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={evolucaoTurnover}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="turnover" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Turnover by Company Table */}
        <ChartCard title="Turnover por Empresa">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-right">Admissões</TableHead>
                <TableHead className="text-right">Desligamentos</TableHead>
                <TableHead className="text-right">Turnover (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turnoverTable.map((item) => (
                <TableRow 
                  key={item.empresa}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setSelectedEmpresaTurnover(item.empresa)}
                >
                  <TableCell className="font-medium">{item.empresa}</TableCell>
                  <TableCell>{item.cnpj}</TableCell>
                  <TableCell className="text-right">{item.admissoes}</TableCell>
                  <TableCell className="text-right">{item.desligamentos}</TableCell>
                  <TableCell className="text-right">{item.turnover}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>

        {/* Turnover Chart */}
      <ChartCard title="Taxa de Rotatividade por Período">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={turnoverByPeriod}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="percentage" name="Porcentagem (%)" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

        {/* Termination Profile - Multiple Pie Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Desligamentos por Gênero">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={terminationByGender}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {terminationByGender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Desligamentos por Faixa Etária">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={terminationByAge}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {terminationByAge.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Desligamentos por Tempo de Empresa">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={terminationByTenure}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {terminationByTenure.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Desligamentos por Função">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={terminationByRole}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {terminationByRole.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        </div>

        {/* Termination Reasons Bar Chart */}
        <ChartCard title="Principais Motivos de Desligamento">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={terminationReasons} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="reason" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
        </ChartCard>

      {/* Modals - Turnover */}
      <TurnoverClienteDetailModal
        isOpen={selectedEmpresaTurnover !== null && selectedClienteTurnover === null}
        onClose={() => setSelectedEmpresaTurnover(null)}
        empresa={selectedEmpresaTurnover || ""}
        clientes={clientesTurnover}
        onClienteClick={(cliente) => setSelectedClienteTurnover(cliente)}
      />

      <TurnoverPostoDetailModal
        isOpen={selectedClienteTurnover !== null}
        onClose={() => setSelectedClienteTurnover(null)}
        cliente={selectedClienteTurnover || ""}
        postos={postosTurnover}
      />
      </div>
    </div>
  );
};

export default EngagementPrime;
