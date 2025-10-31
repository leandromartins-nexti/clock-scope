import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  eventosPostosDescobertosDetalhado,
  evolucaoPostosDescobertos,
  eventosFaltaEfetivoDetalhado,
  evolucaoFaltaEfetivo,
  eventosExcedentesDetalhado,
  evolucaoExcedentes,
} from "@/lib/primeData";
import { EventosPostosDescobertosClienteDetailModal } from "@/components/prime/EventosPostosDescobertosClienteDetailModal";
import { EventosPostosDescobertosPostoDetailModal } from "@/components/prime/EventosPostosDescobertosPostoDetailModal";
import { EventosFaltaEfetivoClienteDetailModal } from "@/components/prime/EventosFaltaEfetivoClienteDetailModal";
import { EventosFaltaEfetivoPostoDetailModal } from "@/components/prime/EventosFaltaEfetivoPostoDetailModal";
import { EventosExcedentesClienteDetailModal } from "@/components/prime/EventosExcedentesClienteDetailModal";
import { EventosExcedentesPostoDetailModal } from "@/components/prime/EventosExcedentesPostoDetailModal";
import { DashboardFilters } from "@/components/layout/DashboardFilters";

const OperationalPrime = () => {
  const totalUncoveredPositions = 39;
  const totalUnderstaffingEvents = 28;
  const totalOverstaffingEvents = 15;

  // State for modals - Postos Descobertos
  const [selectedEmpresaPostosDescobertos, setSelectedEmpresaPostosDescobertos] = useState<string | null>(null);
  const [selectedClientePostosDescobertos, setSelectedClientePostosDescobertos] = useState<string | null>(null);

  // State for modals - Falta Efetivo
  const [selectedEmpresaFaltaEfetivo, setSelectedEmpresaFaltaEfetivo] = useState<string | null>(null);
  const [selectedClienteFaltaEfetivo, setSelectedClienteFaltaEfetivo] = useState<string | null>(null);

  // State for modals - Excedentes
  const [selectedEmpresaExcedentes, setSelectedEmpresaExcedentes] = useState<string | null>(null);
  const [selectedClienteExcedentes, setSelectedClienteExcedentes] = useState<string | null>(null);

  // Prepare data for tables
  const eventosPostosDescobertosTable = Object.entries(eventosPostosDescobertosDetalhado).map(([empresa, data]: [string, any]) => ({
    empresa,
    cnpj: data.cnpj,
    numeroEventos: data.numeroEventos,
  }));

  const eventosFaltaEfetivoTable = Object.entries(eventosFaltaEfetivoDetalhado).map(([empresa, data]: [string, any]) => ({
    empresa,
    cnpj: data.cnpj,
    numeroEventos: data.numeroEventos,
  }));

  const eventosExcedentesTable = Object.entries(eventosExcedentesDetalhado).map(([empresa, data]: [string, any]) => ({
    empresa,
    cnpj: data.cnpj,
    numeroEventos: data.numeroEventos,
  }));

  // Get clientes for selected empresa - Postos Descobertos
  const clientesPostosDescobertos = selectedEmpresaPostosDescobertos
    ? Object.entries((eventosPostosDescobertosDetalhado as any)[selectedEmpresaPostosDescobertos].clientes).map(([cliente, data]: [string, any]) => ({
        cliente,
        cnpj: data.cnpj,
        numeroEventos: data.numeroEventos,
      }))
    : [];

  // Get postos for selected cliente - Postos Descobertos
  const postosPostosDescobertos = selectedEmpresaPostosDescobertos && selectedClientePostosDescobertos
    ? (eventosPostosDescobertosDetalhado as any)[selectedEmpresaPostosDescobertos].clientes[selectedClientePostosDescobertos].postos
    : [];

  // Get clientes for selected empresa - Falta Efetivo
  const clientesFaltaEfetivo = selectedEmpresaFaltaEfetivo
    ? Object.entries((eventosFaltaEfetivoDetalhado as any)[selectedEmpresaFaltaEfetivo].clientes).map(([cliente, data]: [string, any]) => ({
        cliente,
        cnpj: data.cnpj,
        numeroEventos: data.numeroEventos,
      }))
    : [];

  // Get postos for selected cliente - Falta Efetivo
  const postosFaltaEfetivo = selectedEmpresaFaltaEfetivo && selectedClienteFaltaEfetivo
    ? (eventosFaltaEfetivoDetalhado as any)[selectedEmpresaFaltaEfetivo].clientes[selectedClienteFaltaEfetivo].postos
    : [];

  // Get clientes for selected empresa - Excedentes
  const clientesExcedentes = selectedEmpresaExcedentes
    ? Object.entries((eventosExcedentesDetalhado as any)[selectedEmpresaExcedentes].clientes).map(([cliente, data]: [string, any]) => ({
        cliente,
        cnpj: data.cnpj,
        numeroEventos: data.numeroEventos,
      }))
    : [];

  // Get postos for selected cliente - Excedentes
  const postosExcedentes = selectedEmpresaExcedentes && selectedClienteExcedentes
    ? (eventosExcedentesDetalhado as any)[selectedEmpresaExcedentes].clientes[selectedClienteExcedentes].postos
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <DashboardFilters />
        
      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title="Eventos de Postos Descobertos"
          value={totalUncoveredPositions}
          icon={AlertCircle}
        />
        <KPICard
          title="Eventos de Falta de Efetivo"
          value={totalUnderstaffingEvents}
          icon={TrendingDown}
        />
        <KPICard
          title="Eventos de Excedentes"
          value={totalOverstaffingEvents}
          icon={TrendingUp}
        />
      </div>

      {/* Eventos de Postos Descobertos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Eventos de Postos Descobertos por Empresa">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-right">Número de Eventos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventosPostosDescobertosTable.map((item) => (
                <TableRow 
                  key={item.empresa}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setSelectedEmpresaPostosDescobertos(item.empresa)}
                >
                  <TableCell className="font-medium">{item.empresa}</TableCell>
                  <TableCell>{item.cnpj}</TableCell>
                  <TableCell className="text-right">{item.numeroEventos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>

        <ChartCard title="Evolução dos Postos Descobertos">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoPostosDescobertos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="eventos" stroke="hsl(var(--chart-1))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Eventos de Falta de Efetivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Eventos de Falta de Efetivo por Empresa">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-right">Número de Eventos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventosFaltaEfetivoTable.map((item) => (
                <TableRow 
                  key={item.empresa}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setSelectedEmpresaFaltaEfetivo(item.empresa)}
                >
                  <TableCell className="font-medium">{item.empresa}</TableCell>
                  <TableCell>{item.cnpj}</TableCell>
                  <TableCell className="text-right">{item.numeroEventos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>

        <ChartCard title="Evolução das Faltas de Efetivo">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoFaltaEfetivo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="eventos" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Eventos de Excedentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Eventos de Excedentes por Empresa">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-right">Número de Eventos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventosExcedentesTable.map((item) => (
                <TableRow 
                  key={item.empresa}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setSelectedEmpresaExcedentes(item.empresa)}
                >
                  <TableCell className="font-medium">{item.empresa}</TableCell>
                  <TableCell>{item.cnpj}</TableCell>
                  <TableCell className="text-right">{item.numeroEventos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>

        <ChartCard title="Evolução dos Excedentes">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoExcedentes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="eventos" stroke="hsl(var(--chart-3))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Modals - Postos Descobertos */}
      <EventosPostosDescobertosClienteDetailModal
        isOpen={selectedEmpresaPostosDescobertos !== null && selectedClientePostosDescobertos === null}
        onClose={() => setSelectedEmpresaPostosDescobertos(null)}
        empresa={selectedEmpresaPostosDescobertos || ""}
        clientes={clientesPostosDescobertos}
        onClienteClick={(cliente) => setSelectedClientePostosDescobertos(cliente)}
      />

      <EventosPostosDescobertosPostoDetailModal
        isOpen={selectedClientePostosDescobertos !== null}
        onClose={() => setSelectedClientePostosDescobertos(null)}
        cliente={selectedClientePostosDescobertos || ""}
        postos={postosPostosDescobertos}
      />

      {/* Modals - Falta Efetivo */}
      <EventosFaltaEfetivoClienteDetailModal
        isOpen={selectedEmpresaFaltaEfetivo !== null && selectedClienteFaltaEfetivo === null}
        onClose={() => setSelectedEmpresaFaltaEfetivo(null)}
        empresa={selectedEmpresaFaltaEfetivo || ""}
        clientes={clientesFaltaEfetivo}
        onClienteClick={(cliente) => setSelectedClienteFaltaEfetivo(cliente)}
      />

      <EventosFaltaEfetivoPostoDetailModal
        isOpen={selectedClienteFaltaEfetivo !== null}
        onClose={() => setSelectedClienteFaltaEfetivo(null)}
        cliente={selectedClienteFaltaEfetivo || ""}
        postos={postosFaltaEfetivo}
      />

      {/* Modals - Excedentes */}
      <EventosExcedentesClienteDetailModal
        isOpen={selectedEmpresaExcedentes !== null && selectedClienteExcedentes === null}
        onClose={() => setSelectedEmpresaExcedentes(null)}
        empresa={selectedEmpresaExcedentes || ""}
        clientes={clientesExcedentes}
        onClienteClick={(cliente) => setSelectedClienteExcedentes(cliente)}
      />

      <EventosExcedentesPostoDetailModal
        isOpen={selectedClienteExcedentes !== null}
        onClose={() => setSelectedClienteExcedentes(null)}
        cliente={selectedClienteExcedentes || ""}
        postos={postosExcedentes}
      />
      </div>
    </div>
  );
};

export default OperationalPrime;
