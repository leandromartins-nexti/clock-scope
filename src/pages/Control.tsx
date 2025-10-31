import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, MapPin, XCircle, AlertTriangle, Clock, Timer, Calendar } from "lucide-react";
import { ControlFilterProvider, useControlFilter } from "@/contexts/ControlContext";
import {
  controlBigNumbers,
  visitasMensais,
  visitasPorCliente,
  naoConformidadesPorTipo,
  naoConformidadesStatus,
  naoConformidadesRanking,
  naoConformidadesMensais,
  eficienciaOperacional,
  tempoMedioMensal,
  ultimasVisitas,
  frequenciaVisitas,
} from "@/lib/controlData";

function ControlContent() {
  const { empresa, cliente, posto, colaborador, setCliente, setPosto, setColaborador, clearFilters, hasFilters } = useControlFilter();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Nexti Control V1</h1>
            <p className="text-muted-foreground mt-2">Dashboard Gerencial de Operações em Campo</p>
          </div>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex gap-2 flex-wrap">
            {empresa && <Badge variant="secondary">Empresa: {empresa}</Badge>}
            {cliente && <Badge variant="secondary">Cliente: {cliente}</Badge>}
            {posto && <Badge variant="secondary">Posto: {posto}</Badge>}
            {colaborador && <Badge variant="secondary">Colaborador: {colaborador}</Badge>}
          </div>
        )}

        {/* Big Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Visitas Realizadas"
            value={controlBigNumbers.visitasRealizadas}
            icon={MapPin}
          />
          <KPICard
            title="Visitas Não Realizadas"
            value={controlBigNumbers.visitasNaoRealizadas}
            icon={XCircle}
          />
          <KPICard
            title="Não Conformidades"
            value={controlBigNumbers.naoConformidades}
            icon={AlertTriangle}
          />
          <KPICard
            title="Tempo Médio Deslocamento"
            value={`${controlBigNumbers.tempoMedioDeslocamento} min`}
            icon={Clock}
          />
          <KPICard
            title="Tempo Médio Permanência"
            value={`${controlBigNumbers.tempoMedioPermanencia} min`}
            icon={Timer}
          />
          <KPICard
            title="Última Visita"
            value={controlBigNumbers.ultimaVisita}
            icon={Calendar}
          />
        </div>

        {/* Section 1: Execução Operacional */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">1. Execução Operacional (Planejado vs. Realizado)</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Evolução Mensal - Visitas Planejadas vs Realizadas">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitasMensais}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="planejadas"
                    name="Planejadas"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="realizadas"
                    name="Realizadas"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--success))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Taxa de Aderência (%) - Evolução">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitasMensais}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[85, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="aderencia"
                    name="Taxa de Aderência"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Detalhamento por Cliente">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Planejadas</TableHead>
                    <TableHead className="text-right">Realizadas</TableHead>
                    <TableHead className="text-right">Não Realizadas</TableHead>
                    <TableHead className="text-right">Aderência (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitasPorCliente.map((item) => (
                    <TableRow
                      key={item.cliente}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setCliente(item.cliente)}
                    >
                      <TableCell className="font-medium">{item.cliente}</TableCell>
                      <TableCell className="text-right">{item.planejadas}</TableCell>
                      <TableCell className="text-right">{item.realizadas}</TableCell>
                      <TableCell className="text-right">{item.naoRealizadas}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.aderencia >= 90 ? "default" : "destructive"}>
                          {item.aderencia.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </div>

        {/* Section 2: Não Conformidades */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">2. Não Conformidades</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard
              title="Total de Não Conformidades"
              value={controlBigNumbers.naoConformidades}
            />
            <KPICard
              title="Finalizadas"
              value={`${naoConformidadesStatus[0].quantidade} (${naoConformidadesStatus[0].percentual}%)`}
            />
            <KPICard
              title="Pendentes"
              value={`${naoConformidadesStatus[2].quantidade} (${naoConformidadesStatus[2].percentual}%)`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Distribuição por Tipo">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={naoConformidadesPorTipo} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="tipo" stroke="hsl(var(--muted-foreground))" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="quantidade" fill="hsl(var(--destructive))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Evolução Mensal - Resolvidas vs Pendentes">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={naoConformidadesMensais}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="resolvidas"
                    name="Resolvidas"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--success))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pendentes"
                    name="Pendentes"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--destructive))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Top 10 - Ranking de Não Conformidades">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ocorrências</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {naoConformidadesRanking.map((item, index) => (
                    <TableRow
                      key={item.nome}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        if (item.tipo === "colaborador") {
                          setColaborador(item.nome);
                        } else {
                          setPosto(item.nome);
                        }
                      }}
                    >
                      <TableCell className="font-bold">{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell>
                        <Badge variant={item.tipo === "posto" ? "secondary" : "outline"}>
                          {item.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="destructive">{item.ocorrencias}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </div>

        {/* Section 3: Eficiência Operacional */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">3. Eficiência Operacional (Deslocamento & Permanência)</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Dispersão: Deslocamento x Permanência">
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    dataKey="tempoDeslocamento"
                    name="Deslocamento"
                    unit=" min"
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: "Tempo de Deslocamento (min)", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="tempoPermanencia"
                    name="Permanência"
                    unit=" min"
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: "Tempo de Permanência (min)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [`${value} min`, name === "tempoDeslocamento" ? "Deslocamento" : "Permanência"]}
                  />
                  <Scatter data={eficienciaOperacional} fill="hsl(var(--chart-2))">
                    {eficienciaOperacional.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Evolução Mensal - Tempo Médio">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={tempoMedioMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => `${value} min`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="deslocamento"
                    name="Deslocamento"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-3))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="permanencia"
                    name="Permanência"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-4))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Section 4: Últimas Visitas e Frequência */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">4. Últimas Visitas e Frequência</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Frequência por Dia da Semana e Turno">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={frequenciaVisitas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="diaSemana" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="turnoManha" name="Manhã" stackId="a" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="turnoTarde" name="Tarde" stackId="a" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="turnoNoite" name="Noite" stackId="a" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Últimas 10 Visitas Realizadas">
              <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ultimasVisitas.map((visita, index) => (
                      <TableRow
                        key={index}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setColaborador(visita.colaborador);
                          setCliente(visita.cliente);
                        }}
                      >
                        <TableCell>{visita.data}</TableCell>
                        <TableCell>{visita.horario}</TableCell>
                        <TableCell className="font-medium">{visita.colaborador}</TableCell>
                        <TableCell>{visita.cliente}</TableCell>
                        <TableCell>
                          <Badge variant={visita.status === "realizada" ? "default" : "secondary"}>
                            {visita.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Control() {
  return (
    <ControlFilterProvider>
      <ControlContent />
    </ControlFilterProvider>
  );
}
