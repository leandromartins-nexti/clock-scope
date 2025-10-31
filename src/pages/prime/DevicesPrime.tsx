import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Smartphone } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
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
  collectorTypes, 
  dispositivosDistribuicaoDetalhada, 
  colaboradoresSemCadastroDetalhado 
} from "@/lib/primeData";
import { DispositivoClienteDetailModal } from "@/components/prime/DispositivoClienteDetailModal";
import { DispositivoPostoDetailModal } from "@/components/prime/DispositivoPostoDetailModal";
import { CadastroClienteDetailModal } from "@/components/prime/CadastroClienteDetailModal";
import { CadastroPostoDetailModal } from "@/components/prime/CadastroPostoDetailModal";
import { CadastroColaboradorDetailModal } from "@/components/prime/CadastroColaboradorDetailModal";
import { useState } from "react";

const DevicesPrime = () => {
  const totalColaboradores = 1250;
  const colaboradoresMobile = 875;
  const colaboradoresSmart = 320;
  const colaboradoresTBI = 45;
  const colaboradoresWeb = 10;
  const colaboradoresSemFacial = 115;

  // State for device distribution modals
  const [dispositivoClienteModal, setDispositivoClienteModal] = useState<{
    isOpen: boolean;
    empresa: string;
    clientes: any[];
  }>({ isOpen: false, empresa: "", clientes: [] });

  const [dispositivoPostoModal, setDispositivoPostoModal] = useState<{
    isOpen: boolean;
    cliente: string;
    postos: any[];
  }>({ isOpen: false, cliente: "", postos: [] });

  // State for cadastro modals
  const [cadastroClienteModal, setCadastroClienteModal] = useState<{
    isOpen: boolean;
    empresa: string;
    clientes: any[];
  }>({ isOpen: false, empresa: "", clientes: [] });

  const [cadastroPostoModal, setCadastroPostoModal] = useState<{
    isOpen: boolean;
    cliente: string;
    postos: any[];
  }>({ isOpen: false, cliente: "", postos: [] });

  const [cadastroColaboradorModal, setCadastroColaboradorModal] = useState<{
    isOpen: boolean;
    posto: string;
    colaboradores: any[];
  }>({ isOpen: false, posto: "", colaboradores: [] });

  // Handlers for device distribution drill-down
  const handleDispositivoEmpresaClick = (empresa: string) => {
    const empresaData = dispositivosDistribuicaoDetalhada.find(
      (item) => item.empresa === empresa
    );
    if (empresaData) {
      setDispositivoClienteModal({
        isOpen: true,
        empresa,
        clientes: empresaData.clientes,
      });
    }
  };

  const handleDispositivoClienteClick = (cliente: string) => {
    const clienteData = dispositivoClienteModal.clientes.find(
      (item) => item.cliente === cliente
    );
    if (clienteData) {
      setDispositivoPostoModal({
        isOpen: true,
        cliente,
        postos: clienteData.postos,
      });
    }
  };

  // Handlers for cadastro drill-down
  const handleCadastroEmpresaClick = (empresa: string) => {
    const empresaData = colaboradoresSemCadastroDetalhado.find(
      (item) => item.empresa === empresa
    );
    if (empresaData) {
      setCadastroClienteModal({
        isOpen: true,
        empresa,
        clientes: empresaData.clientes,
      });
    }
  };

  const handleCadastroClienteClick = (cliente: string) => {
    const clienteData = cadastroClienteModal.clientes.find(
      (item) => item.cliente === cliente
    );
    if (clienteData) {
      setCadastroPostoModal({
        isOpen: true,
        cliente,
        postos: clienteData.postos,
      });
    }
  };

  const handleCadastroPostoClick = (posto: string) => {
    const postoData = cadastroPostoModal.postos.find(
      (item) => item.posto === posto
    );
    if (postoData) {
      setCadastroColaboradorModal({
        isOpen: true,
        posto,
        colaboradores: postoData.colaboradores,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Colaboradores Registrando Ponto"
          value={totalColaboradores}
          icon={Smartphone}
        />
        <KPICard
          title="Colaboradores Registrando Ponto no Mobile"
          value={colaboradoresMobile}
          icon={Smartphone}
        />
        <KPICard
          title="Colaboradores Registrando Ponto no Smart"
          value={colaboradoresSmart}
          icon={Smartphone}
        />
        <KPICard
          title="Colaboradores Registrando Ponto no TBI"
          value={colaboradoresTBI}
          icon={Smartphone}
        />
        <KPICard
          title="Colaboradores Registrando Ponto na Web"
          value={colaboradoresWeb}
          icon={Smartphone}
        />
        <KPICard
          title="Colaboradores sem Facial"
          value={colaboradoresSemFacial}
          icon={Smartphone}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Tipo de Coletor - Distribuição de Registros">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={collectorTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {collectorTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribuição de Dispositivos por Empresa">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Aplicativo</TableHead>
                <TableHead className="text-right">TBI</TableHead>
                <TableHead className="text-right">Smart</TableHead>
                <TableHead className="text-right">WEB</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dispositivosDistribuicaoDetalhada.map((item) => (
                <TableRow 
                  key={item.empresa}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleDispositivoEmpresaClick(item.empresa)}
                >
                  <TableCell className="font-medium">{item.empresa}</TableCell>
                  <TableCell className="text-right">{item.aplicativo}</TableCell>
                  <TableCell className="text-right">{item.tbi}</TableCell>
                  <TableCell className="text-right">{item.smart}</TableCell>
                  <TableCell className="text-right">{item.web}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>
      </div>

      {/* Table */}
      <ChartCard title="Colaboradores sem Biometria/Senha/Facial Cadastrada">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead className="text-right">% Colaboradores Sem Biometria/Senha</TableHead>
              <TableHead className="text-right">Colaboradores Sem Facial</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaboradoresSemCadastroDetalhado.map((item) => (
              <TableRow 
                key={item.empresa}
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleCadastroEmpresaClick(item.empresa)}
              >
                <TableCell className="font-medium">{item.empresa}</TableCell>
                <TableCell className="text-right">{item.percentualSemBiometriaSenha}%</TableCell>
                <TableCell className="text-right">{item.colaboradoresSemFacial}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>

      {/* Device Distribution Modals */}
      <DispositivoClienteDetailModal
        isOpen={dispositivoClienteModal.isOpen}
        onClose={() => setDispositivoClienteModal({ isOpen: false, empresa: "", clientes: [] })}
        empresa={dispositivoClienteModal.empresa}
        clientes={dispositivoClienteModal.clientes}
        onClienteClick={handleDispositivoClienteClick}
      />

      <DispositivoPostoDetailModal
        isOpen={dispositivoPostoModal.isOpen}
        onClose={() => setDispositivoPostoModal({ isOpen: false, cliente: "", postos: [] })}
        cliente={dispositivoPostoModal.cliente}
        postos={dispositivoPostoModal.postos}
      />

      {/* Cadastro Modals */}
      <CadastroClienteDetailModal
        isOpen={cadastroClienteModal.isOpen}
        onClose={() => setCadastroClienteModal({ isOpen: false, empresa: "", clientes: [] })}
        empresa={cadastroClienteModal.empresa}
        clientes={cadastroClienteModal.clientes}
        onClienteClick={handleCadastroClienteClick}
      />

      <CadastroPostoDetailModal
        isOpen={cadastroPostoModal.isOpen}
        onClose={() => setCadastroPostoModal({ isOpen: false, cliente: "", postos: [] })}
        cliente={cadastroPostoModal.cliente}
        postos={cadastroPostoModal.postos}
        onPostoClick={handleCadastroPostoClick}
      />

      <CadastroColaboradorDetailModal
        isOpen={cadastroColaboradorModal.isOpen}
        onClose={() => setCadastroColaboradorModal({ isOpen: false, posto: "", colaboradores: [] })}
        posto={cadastroColaboradorModal.posto}
        colaboradores={cadastroColaboradorModal.colaboradores}
      />
      </div>
    </div>
  );
};

export default DevicesPrime;
