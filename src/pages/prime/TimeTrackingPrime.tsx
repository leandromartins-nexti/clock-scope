import { useState, useMemo } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { AlertTriangle, CheckCircle2, Clock, FileText, FileCheck, ClipboardList, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClienteDetailModal } from "@/components/prime/ClienteDetailModal";
import { PostoDetailModal } from "@/components/prime/PostoDetailModal";
import { QualidadeColaboradorDetailModal } from "@/components/prime/QualidadeColaboradorDetailModal";
import { InconsistenciaClienteDetailModal } from "@/components/prime/InconsistenciaClienteDetailModal";
import { InconsistenciaPostoDetailModal } from "@/components/prime/InconsistenciaPostoDetailModal";
import { InconsistenciaColaboradorDetailModal } from "@/components/prime/InconsistenciaColaboradorDetailModal";
import { SolicitacaoClienteDetailModal } from "@/components/prime/SolicitacaoClienteDetailModal";
import { SolicitacaoPostoDetailModal } from "@/components/prime/SolicitacaoPostoDetailModal";
import { SolicitacaoColaboradorDetailModal } from "@/components/prime/SolicitacaoColaboradorDetailModal";
import { PrimeFilterProvider, usePrimeFilters } from "@/contexts/PrimeFilterContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  inconsistenciasPorEmpresa,
  qualidadeMarcacoesDetalhadas,
  inconsistenciasDetalhadas,
  solicitacoesDetalhadas,
  evolucaoInconsistencias,
  evolucaoQualidadeMarcacoes,
  tiposInconsistencias,
  motivosAjuste,
  inconsistenciasPorCliente,
  inconsistenciasPorPosto,
  evolucaoSolicitacoes,
  tiposSolicitacoes,
  motivosAjusteSolicitacoes,
  evolucaoTratativas,
  tratativasPorOperador,
} from "@/lib/primeData";

const TimeTrackingPrimeContent = () => {
  const {
    selectedEmpresa,
    selectedCliente,
    selectedPosto,
    selectedColaborador,
    selectedTipoInconsistencia,
    setSelectedEmpresa,
    setSelectedCliente,
    setSelectedPosto,
    setSelectedColaborador,
    setSelectedTipoInconsistencia,
    clearFilters,
  } = usePrimeFilters();

  // Qualidade das Marcações modals state
  const [clienteModalOpen, setClienteModalOpen] = useState(false);
  const [postoModalOpen, setPostoModalOpen] = useState(false);
  const [qualidadeColaboradorModalOpen, setQualidadeColaboradorModalOpen] = useState(false);
  const [currentEmpresa, setCurrentEmpresa] = useState("");
  const [currentCliente, setCurrentCliente] = useState("");
  const [currentPosto, setCurrentPosto] = useState("");
  const [qualidadeClientes, setQualidadeClientes] = useState<any[]>([]);
  const [qualidadePostos, setQualidadePostos] = useState<any[]>([]);
  const [qualidadeColaboradores, setQualidadeColaboradores] = useState<any[]>([]);

  // Inconsistências modals state
  const [inconsistenciaClienteModalOpen, setInconsistenciaClienteModalOpen] = useState(false);
  const [inconsistenciaPostoModalOpen, setInconsistenciaPostoModalOpen] = useState(false);
  const [inconsistenciaColaboradorModalOpen, setInconsistenciaColaboradorModalOpen] = useState(false);
  const [inconsistenciaSelectedEmpresa, setInconsistenciaSelectedEmpresa] = useState("");
  const [inconsistenciaSelectedCliente, setInconsistenciaSelectedCliente] = useState("");
  const [inconsistenciaSelectedPosto, setInconsistenciaSelectedPosto] = useState("");
  const [inconsistenciaClientes, setInconsistenciaClientes] = useState<any[]>([]);
  const [inconsistenciaPostos, setInconsistenciaPostos] = useState<any[]>([]);
  const [inconsistenciaColaboradores, setInconsistenciaColaboradores] = useState<any[]>([]);

  // Solicitações modals state
  const [solicitacaoClienteModalOpen, setSolicitacaoClienteModalOpen] = useState(false);
  const [solicitacaoPostoModalOpen, setSolicitacaoPostoModalOpen] = useState(false);
  const [solicitacaoColaboradorModalOpen, setSolicitacaoColaboradorModalOpen] = useState(false);
  const [solicitacaoSelectedEmpresa, setSolicitacaoSelectedEmpresa] = useState("");
  const [solicitacaoSelectedCliente, setSolicitacaoSelectedCliente] = useState("");
  const [solicitacaoSelectedPosto, setSolicitacaoSelectedPosto] = useState("");
  const [solicitacaoClientes, setSolicitacaoClientes] = useState<any[]>([]);
  const [solicitacaoPostos, setSolicitacaoPostos] = useState<any[]>([]);
  const [solicitacaoColaboradores, setSolicitacaoColaboradores] = useState<any[]>([]);

  // Tratativas state
  const [selectedOperador, setSelectedOperador] = useState<string | null>(null);

  // Base data
  const baseData = {
    totalInconsistencias: 300,
    qualidadeMarcacao: 88.7,
    qualidadeTrend: 3.2,
    tempoMedioTratativa: "2.5h",
    solicitacoesJustificativa: 156,
    solicitacoesJustificativaTratadas: 142,
    quantidadePontosRegistrados: 8450,
  };

  // Apply filters to data
  const filteredData = useMemo(() => {
    let data = { ...baseData };
    
    if (selectedEmpresa || selectedCliente || selectedPosto || selectedColaborador || selectedTipoInconsistencia) {
      // Simulate filtering - reduce values when filters are active
      const filterCount = [selectedEmpresa, selectedCliente, selectedPosto, selectedColaborador, selectedTipoInconsistencia].filter(Boolean).length;
      const reduction = filterCount * 0.3;
      
      data.totalInconsistencias = Math.round(baseData.totalInconsistencias * (1 - reduction));
      data.solicitacoesJustificativa = Math.round(baseData.solicitacoesJustificativa * (1 - reduction));
      data.solicitacoesJustificativaTratadas = Math.round(baseData.solicitacoesJustificativaTratadas * (1 - reduction));
      data.quantidadePontosRegistrados = Math.round(baseData.quantidadePontosRegistrados * (1 - reduction));
      data.qualidadeMarcacao = Math.min(95, baseData.qualidadeMarcacao + (filterCount * 1.5));
    }
    
    return data;
  }, [selectedEmpresa, selectedCliente, selectedPosto, selectedColaborador, selectedTipoInconsistencia]);

  // Qualidade das Marcações handlers
  const handleEmpresaClick = (empresa: string) => {
    const empresaData = qualidadeMarcacoesDetalhadas.find(e => e.empresa === empresa);
    if (empresaData?.clientes) {
      setCurrentEmpresa(empresa);
      setQualidadeClientes(empresaData.clientes);
      setClienteModalOpen(true);
    }
  };

  const handleClienteClick = (cliente: string) => {
    const clienteData = qualidadeClientes.find(c => c.cliente === cliente);
    if (clienteData?.postos) {
      setCurrentCliente(cliente);
      setQualidadePostos(clienteData.postos);
      setClienteModalOpen(false);
      setPostoModalOpen(true);
    }
  };

  const handlePostoClick = (posto: string) => {
    const postoData = qualidadePostos.find(p => p.posto === posto);
    if (postoData?.colaboradores) {
      setCurrentPosto(posto);
      setQualidadeColaboradores(postoData.colaboradores);
      setPostoModalOpen(false);
      setQualidadeColaboradorModalOpen(true);
    }
  };

  // Inconsistências handlers
  const handleInconsistenciaEmpresaClick = (empresa: string) => {
    const empresaData = inconsistenciasDetalhadas.find(e => e.empresa === empresa);
    if (empresaData?.clientes) {
      setInconsistenciaSelectedEmpresa(empresa);
      setInconsistenciaClientes(empresaData.clientes);
      setInconsistenciaClienteModalOpen(true);
    }
  };

  const handleInconsistenciaClienteClick = (cliente: string) => {
    const clienteData = inconsistenciaClientes.find(c => c.cliente === cliente);
    if (clienteData?.postos) {
      setInconsistenciaSelectedCliente(cliente);
      setInconsistenciaPostos(clienteData.postos);
      setInconsistenciaClienteModalOpen(false);
      setInconsistenciaPostoModalOpen(true);
    }
  };

  const handleInconsistenciaPostoClick = (posto: string) => {
    const postoData = inconsistenciaPostos.find(p => p.posto === posto);
    if (postoData?.colaboradores) {
      setInconsistenciaSelectedPosto(posto);
      setInconsistenciaColaboradores(postoData.colaboradores);
      setInconsistenciaPostoModalOpen(false);
      setInconsistenciaColaboradorModalOpen(true);
    }
  };

  // Solicitações handlers
  const handleSolicitacaoEmpresaClick = (empresa: string) => {
    const empresaData = solicitacoesDetalhadas.find(e => e.empresa === empresa);
    if (empresaData?.clientes) {
      setSolicitacaoSelectedEmpresa(empresa);
      setSolicitacaoClientes(empresaData.clientes);
      setSolicitacaoClienteModalOpen(true);
    }
  };

  const handleSolicitacaoClienteClick = (cliente: string) => {
    const clienteData = solicitacaoClientes.find(c => c.cliente === cliente);
    if (clienteData?.postos) {
      setSolicitacaoSelectedCliente(cliente);
      setSolicitacaoPostos(clienteData.postos);
      setSolicitacaoClienteModalOpen(false);
      setSolicitacaoPostoModalOpen(true);
    }
  };

  const handleSolicitacaoPostoClick = (posto: string) => {
    const postoData = solicitacaoPostos.find(p => p.posto === posto);
    if (postoData?.colaboradores) {
      setSolicitacaoSelectedPosto(posto);
      setSolicitacaoColaboradores(postoData.colaboradores);
      setSolicitacaoPostoModalOpen(false);
      setSolicitacaoColaboradorModalOpen(true);
    }
  };

  const activeFiltersCount = [selectedEmpresa, selectedCliente, selectedPosto, selectedColaborador, selectedTipoInconsistencia].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Filtros ativos:</span>
            {selectedEmpresa && (
              <Badge variant="secondary" className="gap-1">
                Empresa: {selectedEmpresa}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedEmpresa(null)}
                />
              </Badge>
            )}
            {selectedCliente && (
              <Badge variant="secondary" className="gap-1">
                Cliente: {selectedCliente}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCliente(null)}
                />
              </Badge>
            )}
            {selectedPosto && (
              <Badge variant="secondary" className="gap-1">
                Posto: {selectedPosto}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedPosto(null)}
                />
              </Badge>
            )}
            {selectedColaborador && (
              <Badge variant="secondary" className="gap-1">
                Colaborador: {selectedColaborador}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedColaborador(null)}
                />
              </Badge>
            )}
            {selectedTipoInconsistencia && (
              <Badge variant="secondary" className="gap-1">
                Tipo: {selectedTipoInconsistencia}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedTipoInconsistencia(null)}
                />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar todos
            </Button>
          </div>
        )}

        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Qualidade da Marcação"
            value={`${filteredData.qualidadeMarcacao.toFixed(1)}%`}
            icon={CheckCircle2}
            trend={{ value: baseData.qualidadeTrend, isPositive: true }}
          />
          <KPICard
            title="Quantidade de Pontos Registrados"
            value={filteredData.quantidadePontosRegistrados}
            icon={ClipboardList}
          />
          <KPICard
            title="Total de Inconsistências"
            value={filteredData.totalInconsistencias}
            icon={AlertTriangle}
          />
          <KPICard
            title="Tempo Médio Tratativa de Inconsistências"
            value={filteredData.tempoMedioTratativa}
            icon={Clock}
          />
          <KPICard
            title="Quantidade de Solicitações de Justificativa de Ponto"
            value={filteredData.solicitacoesJustificativa}
            icon={FileText}
          />
          <KPICard
            title="Quantidade de Solicitações de Justificativa de Ponto Tratadas"
            value={filteredData.solicitacoesJustificativaTratadas}
            icon={FileCheck}
          />
        </div>

        {/* Qualidade e Inconsistência */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Qualidade e Inconsistência</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabela - Qualidade das Marcações por Empresa */}
            <ChartCard title="Qualidade das Marcações por Empresa">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Total de Inconsistências</TableHead>
                    <TableHead className="text-right">Qualidade da Marcação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualidadeMarcacoesDetalhadas.map((item) => (
                    <TableRow
                      key={item.empresa}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        handleEmpresaClick(item.empresa);
                        setSelectedEmpresa(item.empresa);
                      }}
                    >
                      <TableCell className="font-medium">{item.empresa}</TableCell>
                      <TableCell className="text-right">{item.totalInconsistencias}</TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        {item.qualidadeMarcacao}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ChartCard>

            {/* Chart - Evolução da Qualidade das Marcações */}
            <ChartCard title="Evolução da Qualidade das Marcações">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoQualidadeMarcacoes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis domain={[80, 95]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="qualidade" 
                    name="Qualidade (%)" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--success))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Evolução das Inconsistências e Tabela lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Tabela - Inconsistências por Empresa */}
            <ChartCard title="Inconsistências por Empresa">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Total de Inconsistências</TableHead>
                    <TableHead className="text-right">Total Tratadas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inconsistenciasDetalhadas.map((item) => (
                    <TableRow
                      key={item.empresa}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleInconsistenciaEmpresaClick(item.empresa)}
                    >
                      <TableCell className="font-medium">{item.empresa}</TableCell>
                      <TableCell className="text-right">{item.totalInconsistencias}</TableCell>
                      <TableCell className="text-right">{item.totalTratadas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ChartCard>

            {/* Evolução das Inconsistências */}
            <ChartCard title="Evolução das Inconsistências">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoInconsistencias}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="inconsistencias" 
                    name="Inconsistências" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--destructive))", r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tratadas" 
                    name="Inconsistências Tratadas" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--success))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Detalhamento e Motivos inconsitências */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Detalhamento e Motivos inconsitências</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Tipos de Inconsistências */}
            <ChartCard title="Tipos de Inconsistências">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={tiposInconsistencias}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    onClick={(data) => setSelectedTipoInconsistencia(data.name)}
                    className="cursor-pointer"
                  >
                    {tiposInconsistencias.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        opacity={selectedTipoInconsistencia && selectedTipoInconsistencia !== entry.name ? 0.3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Pie Chart - Motivos de Ajuste inconsitências */}
            <ChartCard title="Motivos de Ajuste inconsitências">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={motivosAjuste}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {motivosAjuste.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>


        {/* Solicitação de justificativa de ponto */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Solicitação de justificativa de ponto</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabela - Solicitações de Justificativa de Ponto por Empresa */}
            <ChartCard title="Solicitações de Justificativa de Ponto por Empresa">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Total de Solicitações</TableHead>
                    <TableHead className="text-right">Total Tratadas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitacoesDetalhadas.map((item) => (
                    <TableRow
                      key={item.empresa}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSolicitacaoEmpresaClick(item.empresa)}
                    >
                      <TableCell className="font-medium">{item.empresa}</TableCell>
                      <TableCell className="text-right">{item.totalSolicitacoes}</TableCell>
                      <TableCell className="text-right">{item.totalTratadas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ChartCard>

            {/* Chart - Evolução das Solicitações */}
            <ChartCard title="Evolução das Solicitações de Justificativa de Ponto">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoSolicitacoes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="solicitacoes" 
                    name="Solicitações" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tratadas" 
                    name="Solicitações Tratadas" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--success))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Detalhamento e Motivos de Solicitação de ajuste de ponto */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Detalhamento e Motivos de Solicitação de ajuste de ponto</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Tipos de Solicitações */}
            <ChartCard title="Tipos de Solicitações">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={tiposSolicitacoes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {tiposSolicitacoes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Pie Chart - Motivos de Ajuste de Solicitações */}
            <ChartCard title="Motivos de Ajuste de Solicitações">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={motivosAjusteSolicitacoes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {motivosAjusteSolicitacoes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Tratativa das inconsistências */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tratativa das inconsistências</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras - Tratativas por Operador */}
            <ChartCard title="Quantidade de Tratativas de Ponto por Operador">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tratativasPorOperador}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="operador" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" className="cursor-pointer">
                    {tratativasPorOperador.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill="hsl(var(--primary))"
                        opacity={!selectedOperador || selectedOperador === entry.operador ? 1 : 0.3}
                        onClick={() => setSelectedOperador(entry.operador)}
                        className="cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Chart - Evolução do Tempo de Tratativa */}
            <ChartCard title="Evolução do Tempo de Tratativa das Inconsistências">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoTratativas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value}h`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="tempoMedio" 
                    name="Tempo Médio (h)" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>


        {/* Qualidade das Marcações Modals */}
        <ClienteDetailModal
          isOpen={clienteModalOpen}
          onClose={() => setClienteModalOpen(false)}
          empresa={currentEmpresa}
          clientes={qualidadeClientes}
          onClienteClick={handleClienteClick}
        />
        <PostoDetailModal
          isOpen={postoModalOpen}
          onClose={() => setPostoModalOpen(false)}
          cliente={currentCliente}
          postos={qualidadePostos}
          onPostoClick={handlePostoClick}
        />
        <QualidadeColaboradorDetailModal
          isOpen={qualidadeColaboradorModalOpen}
          onClose={() => setQualidadeColaboradorModalOpen(false)}
          posto={currentPosto}
          colaboradores={qualidadeColaboradores}
        />

        {/* Inconsistências Modals */}
        <InconsistenciaClienteDetailModal
          isOpen={inconsistenciaClienteModalOpen}
          onClose={() => setInconsistenciaClienteModalOpen(false)}
          empresa={inconsistenciaSelectedEmpresa}
          clientes={inconsistenciaClientes}
          onClienteClick={handleInconsistenciaClienteClick}
        />
        <InconsistenciaPostoDetailModal
          isOpen={inconsistenciaPostoModalOpen}
          onClose={() => setInconsistenciaPostoModalOpen(false)}
          cliente={inconsistenciaSelectedCliente}
          postos={inconsistenciaPostos}
          onPostoClick={handleInconsistenciaPostoClick}
        />
        <InconsistenciaColaboradorDetailModal
          isOpen={inconsistenciaColaboradorModalOpen}
          onClose={() => setInconsistenciaColaboradorModalOpen(false)}
          posto={inconsistenciaSelectedPosto}
          colaboradores={inconsistenciaColaboradores}
        />

        {/* Solicitações Modals */}
        <SolicitacaoClienteDetailModal
          isOpen={solicitacaoClienteModalOpen}
          onClose={() => setSolicitacaoClienteModalOpen(false)}
          empresa={solicitacaoSelectedEmpresa}
          clientes={solicitacaoClientes}
          onClienteClick={handleSolicitacaoClienteClick}
        />
        <SolicitacaoPostoDetailModal
          isOpen={solicitacaoPostoModalOpen}
          onClose={() => setSolicitacaoPostoModalOpen(false)}
          cliente={solicitacaoSelectedCliente}
          postos={solicitacaoPostos}
          onPostoClick={handleSolicitacaoPostoClick}
        />
        <SolicitacaoColaboradorDetailModal
          isOpen={solicitacaoColaboradorModalOpen}
          onClose={() => setSolicitacaoColaboradorModalOpen(false)}
          posto={solicitacaoSelectedPosto}
          colaboradores={solicitacaoColaboradores}
        />
      </div>
    </div>
  );
};

const TimeTrackingPrime = () => {
  return (
    <PrimeFilterProvider>
      <TimeTrackingPrimeContent />
    </PrimeFilterProvider>
  );
};

export default TimeTrackingPrime;
