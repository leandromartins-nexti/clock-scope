import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { AlertTriangle, Users } from "lucide-react";
import { useState } from "react";
import {
  complianceOverview,
  topViolacoes7DiasColaborador,
  topViolacoes7DiasPosto,
  topViolacoesExcessoJornadaColaborador,
  topViolacoesExcessoJornadaPosto,
  topViolacoesInterjornadaColaborador,
  topViolacoesInterjornadaPosto,
  topViolacoesIntrajornadaColaborador,
  topViolacoesIntrajornadaPosto,
  topViolacoesTrabalhoDSRColaborador,
  topViolacoesTrabalhoDSRPosto,
  topViolacoesIntervaloDSRColaborador,
  topViolacoesIntervaloDSRPosto,
} from "@/lib/managementData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ManagementCompliance = () => {
  // Filtros separados para cada card
  const [violationTypeColaborador, setViolationTypeColaborador] = useState("7-dias");
  const [violationTypePosto, setViolationTypePosto] = useState("7-dias");

  const getViolationData = (tipo: string, by: "colaborador" | "posto") => {
    const dataMap: Record<string, any[]> = {
      "7-dias": by === "colaborador" ? topViolacoes7DiasColaborador : topViolacoes7DiasPosto,
      "excesso": by === "colaborador" ? topViolacoesExcessoJornadaColaborador : topViolacoesExcessoJornadaPosto,
      "interjornada": by === "colaborador" ? topViolacoesInterjornadaColaborador : topViolacoesInterjornadaPosto,
      "intrajornada": by === "colaborador" ? topViolacoesIntrajornadaColaborador : topViolacoesIntrajornadaPosto,
      "trabalho-dsr": by === "colaborador" ? topViolacoesTrabalhoDSRColaborador : topViolacoesTrabalhoDSRPosto,
      "intervalo-dsr": by === "colaborador" ? topViolacoesIntervaloDSRColaborador : topViolacoesIntervaloDSRPosto,
    };
    return dataMap[tipo] || [];
  };

  return (
    <div className="flex-1 overflow-auto bg-background">
      <DashboardHeader 
        title="Monitoramento de Compliance (TACs)" 
        breadcrumbs={["Management Analytics", "Compliance (TACs)"]}
      />

      <main className="p-8 space-y-6">
        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KPICard
            title="Total de Violações (Últimos 30 dias)"
            value={complianceOverview.totalViolacoesTAC.toLocaleString()}
            icon={AlertTriangle}
          />
          <KPICard
            title="Colaboradores em Risco de Violação"
            value={complianceOverview.colaboradoresEmRisco.toLocaleString()}
            icon={Users}
          />
        </div>

        {/* Top 50 Violações de TAC - Cards Separados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Colaborador */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top 50 Violações de TAC (Colaborador)</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Tipo de Violação:</label>
              <Select value={violationTypeColaborador} onValueChange={setViolationTypeColaborador}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7-dias">7 Dias Consecutivos</SelectItem>
                  <SelectItem value="excesso">Excesso de Jornada</SelectItem>
                  <SelectItem value="interjornada">Interjornada</SelectItem>
                  <SelectItem value="intrajornada">Intrajornada</SelectItem>
                  <SelectItem value="trabalho-dsr">Trabalho no DSR</SelectItem>
                  <SelectItem value="intervalo-dsr">Intervalo DSR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ChartCard title="Top 5 Violações por Colaborador">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Posto</TableHead>
                    <TableHead className="text-right">Violações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getViolationData(violationTypeColaborador, "colaborador").map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-bold">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item.colaborador}</TableCell>
                      <TableCell>{item.posto}</TableCell>
                      <TableCell className="text-right font-semibold text-destructive">
                        {item.violacoes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ChartCard>
          </div>

          {/* Card Posto */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top 50 Violações de TAC (Posto)</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Tipo de Violação:</label>
              <Select value={violationTypePosto} onValueChange={setViolationTypePosto}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7-dias">7 Dias Consecutivos</SelectItem>
                  <SelectItem value="excesso">Excesso de Jornada</SelectItem>
                  <SelectItem value="interjornada">Interjornada</SelectItem>
                  <SelectItem value="intrajornada">Intrajornada</SelectItem>
                  <SelectItem value="trabalho-dsr">Trabalho no DSR</SelectItem>
                  <SelectItem value="intervalo-dsr">Intervalo DSR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ChartCard title="Top 5 Violações por Posto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Posto</TableHead>
                    <TableHead className="text-right">Violações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getViolationData(violationTypePosto, "posto").map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-bold">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item.colaborador}</TableCell>
                      <TableCell className="text-right font-semibold text-destructive">
                        {item.violacoes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagementCompliance;
