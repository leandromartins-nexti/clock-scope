import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { Users, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { absenteismoPorEmpresa, ausenciasPorEmpresa, principaisCIDs, motivosAusencia, evolucaoHorasAusencia, coberturasPorEmpresa, evolucaoCoberturasAusencias, tipoCobertura, motivoCobertura, recursoCobertura } from "@/lib/primeData";
import { usePrimeFilters } from "@/contexts/PrimeFilterContext";
import { useState } from "react";
import { AusenciaClienteDetailModal } from "@/components/prime/AusenciaClienteDetailModal";
import { AusenciaPostoDetailModal } from "@/components/prime/AusenciaPostoDetailModal";
import { AusenciaColaboradorDetailModal } from "@/components/prime/AusenciaColaboradorDetailModal";
import { DashboardFilters } from "@/components/layout/DashboardFilters";

export default function AusenciasCoberturasPrime() {
  const {
    selectedEmpresa,
    selectedCliente,
    selectedPosto,
    selectedColaborador
  } = usePrimeFilters();
  const [absenteismoModalOpen, setAbsenteismoModalOpen] = useState(false);
  const [absenteismoSelectedEmpresa, setAbsenteismoSelectedEmpresa] = useState<string>("");
  const [absenteismoSelectedCliente, setAbsenteismoSelectedCliente] = useState<string>("");
  const [absenteismoSelectedPosto, setAbsenteismoSelectedPosto] = useState<string>("");
  const [absenteismoClientes, setAbsenteismoClientes] = useState<any[]>([]);
  const [absenteismoPostos, setAbsenteismoPostos] = useState<any[]>([]);
  const [absenteismoColaboradores, setAbsenteismoColaboradores] = useState<any[]>([]);
  const [absenteismoPostoModalOpen, setAbsenteismoPostoModalOpen] = useState(false);
  const [absenteismoColaboradorModalOpen, setAbsenteismoColaboradorModalOpen] = useState(false);
  const [ausenciasModalOpen, setAusenciasModalOpen] = useState(false);
  const [ausenciasSelectedEmpresa, setAusenciasSelectedEmpresa] = useState<string>("");
  const [ausenciasSelectedCliente, setAusenciasSelectedCliente] = useState<string>("");
  const [ausenciasSelectedPosto, setAusenciasSelectedPosto] = useState<string>("");
  const [ausenciasClientes, setAusenciasClientes] = useState<any[]>([]);
  const [ausenciasPostos, setAusenciasPostos] = useState<any[]>([]);
  const [ausenciasColaboradores, setAusenciasColaboradores] = useState<any[]>([]);
  const [ausenciasPostoModalOpen, setAusenciasPostoModalOpen] = useState(false);
  const [ausenciasColaboradorModalOpen, setAusenciasColaboradorModalOpen] = useState(false);

  // Filter data based on selected filters
  const filteredAbsenteismo = selectedEmpresa ? absenteismoPorEmpresa.filter(item => item.empresa === selectedEmpresa) : absenteismoPorEmpresa;
  const filteredCoberturas = selectedEmpresa ? coberturasPorEmpresa.filter(item => item.empresa === selectedEmpresa) : coberturasPorEmpresa;
  const filteredAusencias = selectedEmpresa ? ausenciasPorEmpresa.filter(item => item.empresa === selectedEmpresa) : ausenciasPorEmpresa;

  // Calculate KPI values
  const totalHorasAusentes = filteredAbsenteismo.reduce((acc, item) => acc + item.horasAusentes, 0);
  const mediaAbsenteismo = filteredAbsenteismo.length > 0 ? (filteredAbsenteismo.reduce((acc, item) => acc + item.percentualAbsenteismo, 0) / filteredAbsenteismo.length).toFixed(1) : "0.0";
  const totalCoberturas = filteredCoberturas.length > 0 ? 2450 : 0;
  const mediaCobertura = filteredCoberturas.length > 0 ? (filteredCoberturas.reduce((acc, item) => acc + item.percentualCobertura, 0) / filteredCoberturas.length).toFixed(1) : "0.0";
  const handleAbsenteismoEmpresaClick = (empresa: string) => {
    const empresaData = absenteismoPorEmpresa.find(e => e.empresa === empresa);
    if (empresaData?.clientes) {
      setAbsenteismoSelectedEmpresa(empresa);
      setAbsenteismoClientes(empresaData.clientes);
      setAbsenteismoModalOpen(true);
    }
  };
  const handleAbsenteismoClienteClick = (cliente: string) => {
    const clienteData = absenteismoClientes.find(c => c.cliente === cliente);
    if (clienteData?.postos) {
      setAbsenteismoSelectedCliente(cliente);
      setAbsenteismoPostos(clienteData.postos);
      setAbsenteismoModalOpen(false);
      setAbsenteismoPostoModalOpen(true);
    }
  };
  const handleAbsenteismoPostoClick = (posto: string) => {
    const postoData = absenteismoPostos.find(p => p.posto === posto);
    if (postoData?.colaboradores) {
      setAbsenteismoSelectedPosto(posto);
      setAbsenteismoColaboradores(postoData.colaboradores);
      setAbsenteismoPostoModalOpen(false);
      setAbsenteismoColaboradorModalOpen(true);
    }
  };
  const handleAusenciasEmpresaClick = (empresa: string) => {
    const empresaData = ausenciasPorEmpresa.find(e => e.empresa === empresa);
    if (empresaData?.clientes) {
      setAusenciasSelectedEmpresa(empresa);
      setAusenciasClientes(empresaData.clientes);
      setAusenciasModalOpen(true);
    }
  };
  const handleAusenciasClienteClick = (cliente: string) => {
    const clienteData = ausenciasClientes.find(c => c.cliente === cliente);
    if (clienteData?.postos) {
      setAusenciasSelectedCliente(cliente);
      setAusenciasPostos(clienteData.postos);
      setAusenciasModalOpen(false);
      setAusenciasPostoModalOpen(true);
    }
  };
  const handleAusenciasPostoClick = (posto: string) => {
    const postoData = ausenciasPostos.find(p => p.posto === posto);
    if (postoData?.colaboradores) {
      setAusenciasSelectedPosto(posto);
      setAusenciasColaboradores(postoData.colaboradores);
      setAusenciasPostoModalOpen(false);
      setAusenciasColaboradorModalOpen(true);
    }
  };
  return <div className="space-y-6 p-6">
      <DashboardFilters />
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Absenteísmo" value={`${mediaAbsenteismo}%`} icon={Users} />
        <KPICard title="Total de Horas Ausentes" value={totalHorasAusentes.toLocaleString()} icon={Clock} />
        <KPICard title="Coberturas Realizadas" value={totalCoberturas.toLocaleString()} icon={CheckCircle} />
        <KPICard title="Porcentagem de Cobertura de Ausências" value={`${mediaCobertura}%`} icon={TrendingUp} trend={{
          value: 8,
          isPositive: true
        }} />
      </div>

      {/* Absenteísmo e Ausência Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Absenteísmo e Ausência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Absenteísmo por Empresa */}
          <Card>
            <CardHeader>
              <CardTitle>Absenteísmo por Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">% Absenteísmo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbsenteismo.map(item => <TableRow key={item.empresa} className="cursor-pointer hover:bg-accent" onClick={() => handleAbsenteismoEmpresaClick(item.empresa)}>
                      <TableCell className="font-medium">{item.empresa}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-destructive font-semibold">{item.percentualAbsenteismo}%</span>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Ausências por Empresa */}
          <Card>
            <CardHeader>
              <CardTitle>Ausências por Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Total de Horas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAusencias.map(item => <TableRow key={item.empresa} className="cursor-pointer hover:bg-accent" onClick={() => handleAusenciasEmpresaClick(item.empresa)}>
                      <TableCell className="font-medium">{item.empresa}</TableCell>
                      <TableCell className="text-right">{item.totalHoras}h</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>


        {/* Evolução da Quantidade de Horas de Ausência - Full Width */}
        <ChartCard title="Evolução da Quantidade de Horas de Ausência">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoHorasAusencia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="horas" stroke="hsl(var(--destructive))" name="Horas Ausentes" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Motivos de Ausência */}
          <ChartCard title="Motivos de Ausência">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={motivosAusencia} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  value
                }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {motivosAusencia.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Principais CIDs dos Atestados */}
          <ChartCard title="Principais CIDs dos Atestados">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={principaisCIDs} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  value
                }) => `${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {principaisCIDs.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{
                  fontSize: '12px'
                }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        </CardContent>
      </Card>

      {/* Cobertura Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Cobertura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Evolução Coberturas vs. Ausências - Full Width */}
          <ChartCard title="Evolução Coberturas vs. Ausências">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoCoberturasAusencias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="horasAusentes" stroke="hsl(var(--destructive))" name="Horas Ausentes" strokeWidth={2} />
              <Line type="monotone" dataKey="horasCobertas" stroke="hsl(var(--chart-1))" name="Horas Cobertas" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Coberturas por Empresa */}
          <Card>
            <CardHeader>
              <CardTitle>Coberturas por Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">% de Cobertura de Ausência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoberturas.map(item => <TableRow key={item.empresa}>
                      <TableCell className="font-medium">{item.empresa}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-success font-semibold">{item.percentualCobertura}%</span>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Tipo de Cobertura */}
          <ChartCard title="Tipo de Cobertura">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={tipoCobertura} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  value
                }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {tipoCobertura.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Motivo de Cobertura */}
          <ChartCard title="Motivo de Cobertura">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={motivoCobertura} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  value
                }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {motivoCobertura.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Recurso de Cobertura */}
          <ChartCard title="Recurso de Cobertura">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={recursoCobertura} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  value
                }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {recursoCobertura.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AusenciaClienteDetailModal isOpen={absenteismoModalOpen} onClose={() => setAbsenteismoModalOpen(false)} empresa={absenteismoSelectedEmpresa} clientes={absenteismoClientes} onClienteClick={handleAbsenteismoClienteClick} tipo="absenteismo" />
      <AusenciaPostoDetailModal isOpen={absenteismoPostoModalOpen} onClose={() => setAbsenteismoPostoModalOpen(false)} cliente={absenteismoSelectedCliente} postos={absenteismoPostos} tipo="absenteismo" onPostoClick={handleAbsenteismoPostoClick} />
      <AusenciaColaboradorDetailModal isOpen={absenteismoColaboradorModalOpen} onClose={() => setAbsenteismoColaboradorModalOpen(false)} posto={absenteismoSelectedPosto} colaboradores={absenteismoColaboradores} tipo="absenteismo" />
      <AusenciaClienteDetailModal isOpen={ausenciasModalOpen} onClose={() => setAusenciasModalOpen(false)} empresa={ausenciasSelectedEmpresa} clientes={ausenciasClientes} onClienteClick={handleAusenciasClienteClick} tipo="ausencias" />
      <AusenciaPostoDetailModal isOpen={ausenciasPostoModalOpen} onClose={() => setAusenciasPostoModalOpen(false)} cliente={ausenciasSelectedCliente} postos={ausenciasPostos} tipo="ausencias" onPostoClick={handleAusenciasPostoClick} />
      <AusenciaColaboradorDetailModal isOpen={ausenciasColaboradorModalOpen} onClose={() => setAusenciasColaboradorModalOpen(false)} posto={ausenciasSelectedPosto} colaboradores={ausenciasColaboradores} tipo="ausencias" />
    </div>;
}