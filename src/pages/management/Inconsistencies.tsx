import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { AlertTriangle, Clock, FileText } from "lucide-react";
import { useState } from "react";
import {
  inconsistenciesOverview,
  inconsistenciasTendencia,
  topInconsistenciasColaborador,
  topInconsistenciasPosto,
  topAtestadosColaborador,
  topAtestadosPosto,
  topAusenciasColaborador,
  topAusenciasPosto,
  colaboradoresPorPostoInconsistencias,
  colaboradoresPorPostoAtestados,
  colaboradoresPorPostoAusencias,
} from "@/lib/managementData";
import { InconsistenciaPostoDetailModal } from "@/components/management/InconsistenciaPostoDetailModal";
import { AusenciaPostoDetailModal } from "@/components/management/AusenciaPostoDetailModal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ManagementInconsistencies = () => {
  // Filtros separados para cada card
  const [inconsistencyTypeColaborador, setInconsistencyTypeColaborador] = useState("geral");
  const [inconsistencyTypePosto, setInconsistencyTypePosto] = useState("geral");
  const [absenceTypeColaborador, setAbsenceTypeColaborador] = useState<"atestados" | "ausencias">("atestados");
  const [absenceTypePosto, setAbsenceTypePosto] = useState<"atestados" | "ausencias">("atestados");
  
  // Estados para modais de drill-down
  const [selectedInconsistenciaPosto, setSelectedInconsistenciaPosto] = useState<string | null>(null);
  const [selectedAusenciaPosto, setSelectedAusenciaPosto] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-auto bg-background">
      <DashboardHeader 
        title="Gestão de Inconsistências" 
        breadcrumbs={["Management Analytics", "Inconsistências"]}
      />

      <main className="p-8 space-y-6">
        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Total de Inconsistências"
            value={inconsistenciesOverview.totalInconsistencias.toLocaleString()}
            icon={AlertTriangle}
          />
          <KPICard
            title="Requisições Pendentes (Facial)"
            value={inconsistenciesOverview.requisiçõesPendentesFacial.toLocaleString()}
            icon={Clock}
          />
          <KPICard
            title="Solicitação de Ajuste"
            value={inconsistenciesOverview.solicitaçãoAjuste.toLocaleString()}
            icon={FileText}
          />
        </div>

        {/* Tendência de Inconsistências */}
        <ChartCard title="Tendência de Inconsistências (Últimos 30 dias)">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inconsistenciasTendencia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="terminalNaoAutorizado" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="Terminal Não Autorizado" 
                />
                <Line 
                  type="monotone" 
                  dataKey="naoRegistrado" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Não Registrado" 
                />
                <Line 
                  type="monotone" 
                  dataKey="perimetro" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  name="Perímetro" 
                />
                <Line 
                  type="monotone" 
                  dataKey="outros" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  name="Outros" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Top 50 Inconsistências - Cards Separados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Colaborador */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top 50 Inconsistências (Colaborador)</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Tipo de Inconsistência:</label>
              <Select value={inconsistencyTypeColaborador} onValueChange={setInconsistencyTypeColaborador}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="terminal">Terminal Não Autorizado</SelectItem>
                  <SelectItem value="nao-registrado">Não Registrado</SelectItem>
                  <SelectItem value="perimetro">Perímetro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ChartCard title="Top 10 Colaboradores">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Posto</TableHead>
                    <TableHead className="text-right">Inconsistências</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topInconsistenciasColaborador.slice(0, 10).map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-bold">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item.colaborador}</TableCell>
                      <TableCell>{item.posto}</TableCell>
                      <TableCell className="text-right font-semibold">{item.inconsistencias}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ChartCard>
          </div>

          {/* Card Posto */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top 50 Inconsistências (Posto)</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Tipo de Inconsistência:</label>
              <Select value={inconsistencyTypePosto} onValueChange={setInconsistencyTypePosto}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="terminal">Terminal Não Autorizado</SelectItem>
                  <SelectItem value="nao-registrado">Não Registrado</SelectItem>
                  <SelectItem value="perimetro">Perímetro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ChartCard title="Top 10 Postos">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Posto</TableHead>
                    <TableHead className="text-right">Inconsistências</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topInconsistenciasPosto.slice(0, 10).map((item, idx) => (
                    <TableRow 
                      key={idx}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setSelectedInconsistenciaPosto(item.colaborador)}
                    >
                      <TableCell className="font-bold">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item.colaborador}</TableCell>
                      <TableCell className="text-right font-semibold">{item.inconsistencias}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ChartCard>
          </div>
        </div>

        {/* Top 50 Ausências e Atestados - Cards Separados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Colaborador */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top 50 Ausências e Atestados (Colaborador)</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Tipo:</label>
              <Select value={absenceTypeColaborador} onValueChange={(value) => setAbsenceTypeColaborador(value as "atestados" | "ausencias")}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atestados">Atestados</SelectItem>
                  <SelectItem value="ausencias">Ausências</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ChartCard title={absenceTypeColaborador === "atestados" ? "Top 5 Atestados" : "Top 5 Ausências"}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Posto</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(absenceTypeColaborador === "atestados" ? topAtestadosColaborador : topAusenciasColaborador).map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-bold">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item.colaborador}</TableCell>
                      <TableCell>{item.posto}</TableCell>
                      <TableCell className="text-right font-semibold">{item.inconsistencias}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ChartCard>
          </div>

          {/* Card Posto */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top 50 Ausências e Atestados (Posto)</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Tipo:</label>
              <Select value={absenceTypePosto} onValueChange={(value) => setAbsenceTypePosto(value as "atestados" | "ausencias")}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atestados">Atestados</SelectItem>
                  <SelectItem value="ausencias">Ausências</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ChartCard title={absenceTypePosto === "atestados" ? "Top 5 Atestados" : "Top 5 Ausências"}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Posto</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(absenceTypePosto === "atestados" ? topAtestadosPosto : topAusenciasPosto).map((item, idx) => (
                    <TableRow 
                      key={idx}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setSelectedAusenciaPosto(item.colaborador)}
                    >
                      <TableCell className="font-bold">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item.colaborador}</TableCell>
                      <TableCell className="text-right font-semibold">{item.inconsistencias}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ChartCard>
          </div>
        </div>
      </main>

      {/* Modais de Drill-Down */}
      {selectedInconsistenciaPosto && (
        <InconsistenciaPostoDetailModal
          isOpen={!!selectedInconsistenciaPosto}
          onClose={() => setSelectedInconsistenciaPosto(null)}
          posto={selectedInconsistenciaPosto}
          colaboradores={colaboradoresPorPostoInconsistencias[selectedInconsistenciaPosto] || []}
        />
      )}

      {selectedAusenciaPosto && (
        <AusenciaPostoDetailModal
          isOpen={!!selectedAusenciaPosto}
          onClose={() => setSelectedAusenciaPosto(null)}
          posto={selectedAusenciaPosto}
          tipo={absenceTypePosto}
          colaboradores={
            absenceTypePosto === "atestados"
              ? colaboradoresPorPostoAtestados[selectedAusenciaPosto] || []
              : colaboradoresPorPostoAusencias[selectedAusenciaPosto] || []
          }
        />
      )}
    </div>
  );
};

export default ManagementInconsistencies;
