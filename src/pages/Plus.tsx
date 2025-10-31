import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PlusDashboardProvider } from "@/contexts/PlusDashboardContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DollarSign, Users, TrendingUp, Percent, Gift } from "lucide-react";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
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
  custoTotalBeneficios,
  custoPerCapita,
  variacaoMensal,
  taxaMediaUtilizacao,
  totalGratificacoes,
  evolucaoCustos,
  custoPorEmpresa,
  evolucaoPerCapita,
  utilizacaoVRVA,
  rankingMenorUtilizacao,
  rankingMaiorUtilizacao,
  utilizacaoVT,
  evolucaoGratificacoes,
  rankingGratificacoesCargo,
  custoDetalhadoPorEmpresa,
} from "@/lib/plusData";
import { CustoClienteDetailModal } from "@/components/plus/CustoClienteDetailModal";
import { CustoPostoDetailModal } from "@/components/plus/CustoPostoDetailModal";

const COLORS = {
  chart1: "hsl(var(--chart-1))",
  chart2: "hsl(var(--chart-2))",
  chart3: "hsl(var(--chart-3))",
  chart4: "hsl(var(--chart-4))",
  chart5: "hsl(var(--chart-5))",
};

function PlusDashboardContent() {
  // State for drilldown modals - Custo
  const [selectedEmpresaCusto, setSelectedEmpresaCusto] = useState<string | null>(null);
  const [selectedClienteCusto, setSelectedClienteCusto] = useState<string | null>(null);

  // Prepare data for custo table
  const custoTable = Object.entries(custoDetalhadoPorEmpresa).map(
    ([empresa, data]: [string, any]) => ({
      empresa,
      cnpj: data.cnpj,
      custo: data.custo,
      perCapita: data.perCapita,
      variacao: data.variacao,
    })
  );

  // Get clientes for selected empresa - Custo
  const clientesCusto = selectedEmpresaCusto
    ? Object.entries(
        (custoDetalhadoPorEmpresa as any)[selectedEmpresaCusto].clientes
      ).map(([cliente, data]: [string, any]) => ({
        cliente,
        cnpj: data.cnpj,
        custo: data.custo,
        perCapita: data.perCapita,
        variacao: data.variacao,
      }))
    : [];

  // Get postos for selected cliente - Custo
  const postosCusto =
    selectedEmpresaCusto && selectedClienteCusto
      ? (custoDetalhadoPorEmpresa as any)[selectedEmpresaCusto].clientes[
          selectedClienteCusto
        ].postos
      : [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Gestão e Custo de Benefícios: Nexti Plus" />

      <div className="container mx-auto p-6 space-y-6">
        {/* Big Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Custo Total de Benefícios"
            value={`R$ ${custoTotalBeneficios.toLocaleString("pt-BR")}`}
            icon={DollarSign}
          />

          <KPICard
            title="Custo Per Capita"
            value={`R$ ${custoPerCapita.toLocaleString("pt-BR")}`}
            icon={Users}
          />

          <KPICard
            title="Variação Mensal"
            value={`${variacaoMensal}%`}
            icon={TrendingUp}
            trend={{
              value: variacaoMensal,
              isPositive: false,
            }}
          />

          <KPICard
            title="Taxa Média de Utilização"
            value={`${taxaMediaUtilizacao}%`}
            icon={Percent}
          />
        </div>

        {/* 1. CUSTOS TOTAIS */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Custos Totais</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolução mensal do custo total */}
            <ChartCard title="Evolução Mensal do Custo Total">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoCustos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="custo"
                    stroke={COLORS.chart1}
                    strokeWidth={2}
                    name="Custo (R$)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Custo total por empresa */}
            <ChartCard title="Custo Total por Empresa">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={custoPorEmpresa}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="empresa" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="custo" fill={COLORS.chart2} name="Custo (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Tabela detalhada com drilldown */}
          <ChartCard title="Custo por Empresa (Clique para detalhes)">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead className="text-right">Custo (R$)</TableHead>
                  <TableHead className="text-right">Per Capita (R$)</TableHead>
                  <TableHead className="text-right">Variação (%)</TableHead>
                  <TableHead className="text-right">% do Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {custoTable.map((item) => (
                  <TableRow
                    key={item.empresa}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setSelectedEmpresaCusto(item.empresa)}
                  >
                    <TableCell className="font-medium">{item.empresa}</TableCell>
                    <TableCell>{item.cnpj}</TableCell>
                    <TableCell className="text-right">
                      {item.custo.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.perCapita.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          item.variacao > 0 ? "text-destructive" : "text-success"
                        }
                      >
                        {item.variacao > 0 ? "+" : ""}
                        {item.variacao}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {custoPorEmpresa
                        .find((e) => e.empresa === item.empresa)
                        ?.percentualTotal.toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartCard>
        </div>

        {/* 2. CUSTO PER CAPITA */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Custo Per Capita</h2>

          <ChartCard title="Evolução Histórica do Custo Per Capita">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaoPerCapita}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="perCapita"
                  stroke={COLORS.chart3}
                  strokeWidth={2}
                  name="Per Capita (R$)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* 3. UTILIZAÇÃO VR/VA */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Utilização VR/VA</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Taxa de utilização por empresa/fornecedor */}
            <ChartCard title="Taxa de Utilização VR/VA por Empresa">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={utilizacaoVRVA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="empresa" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="percentual" fill={COLORS.chart4} name="Utilização (%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Tabela detalhada */}
            <ChartCard title="Detalhamento VR/VA por Fornecedor">
              <div className="max-h-[300px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead className="text-right">Utilizado</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utilizacaoVRVA.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.empresa}</TableCell>
                        <TableCell>{item.fornecedor}</TableCell>
                        <TableCell className="text-right">
                          R$ {item.utilizado.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">{item.percentual}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ChartCard>
          </div>

          {/* Rankings de colaboradores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Top 10 - Menor Utilização">
              <div className="max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead className="text-right">Utilização %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankingMenorUtilizacao.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell>{item.cargo}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-destructive">{item.percentual}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ChartCard>

            <ChartCard title="Top 10 - Maior Utilização">
              <div className="max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead className="text-right">Utilização %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankingMaiorUtilizacao.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell>{item.cargo}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-success">{item.percentual}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* 4. UTILIZAÇÃO VT */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Utilização VT</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Taxa de utilização VT */}
            <ChartCard title="Taxa de Utilização VT por Empresa">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={utilizacaoVT}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="empresa" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="percentual" fill={COLORS.chart5} name="Utilização (%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Tabela detalhada VT */}
            <ChartCard title="Detalhamento VT por Fornecedor">
              <div className="max-h-[300px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead className="text-right">Utilizado</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utilizacaoVT.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.empresa}</TableCell>
                        <TableCell>{item.fornecedor}</TableCell>
                        <TableCell className="text-right">
                          R$ {item.utilizado.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">{item.percentual}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* 5. GRATIFICAÇÕES */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Gratificações</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolução de gratificações */}
            <ChartCard title="Evolução Mensal de Gratificações">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoGratificacoes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={COLORS.chart1}
                    strokeWidth={2}
                    name="Total (R$)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Top cargos com maior volume */}
            <ChartCard title="Top Cargos com Maior Volume de Gratificações">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rankingGratificacoesCargo} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="cargo"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    width={150}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="total" fill={COLORS.chart2} name="Total (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Tabela detalhada de gratificações */}
          <ChartCard title="Detalhamento de Gratificações por Cargo">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-right">Total (R$)</TableHead>
                  <TableHead className="text-right">Colaboradores</TableHead>
                  <TableHead className="text-right">% Performance</TableHead>
                  <TableHead className="text-right">Média por Colaborador</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankingGratificacoesCargo.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.cargo}</TableCell>
                    <TableCell className="text-right">
                      R$ {item.total.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">{item.colaboradores}</TableCell>
                    <TableCell className="text-right">
                      {item.percentualPerformance}%
                    </TableCell>
                    <TableCell className="text-right">
                      R${" "}
                      {Math.round(item.total / item.colaboradores).toLocaleString(
                        "pt-BR"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartCard>
        </div>

        {/* Modals - Custo */}
        <CustoClienteDetailModal
          isOpen={selectedEmpresaCusto !== null && selectedClienteCusto === null}
          onClose={() => setSelectedEmpresaCusto(null)}
          empresa={selectedEmpresaCusto || ""}
          clientes={clientesCusto}
          onClienteClick={(cliente) => setSelectedClienteCusto(cliente)}
        />

        <CustoPostoDetailModal
          isOpen={selectedClienteCusto !== null}
          onClose={() => setSelectedClienteCusto(null)}
          cliente={selectedClienteCusto || ""}
          postos={postosCusto}
        />
      </div>
    </div>
  );
}

const Plus = () => {
  return (
    <PlusDashboardProvider>
      <PlusDashboardContent />
    </PlusDashboardProvider>
  );
};

export default Plus;
