import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Save } from "lucide-react";
import { configV3, pesosConfiancaV3, driversV3 } from "@/lib/analyticsV3Data";

const sections = [
  { id: "empresa", label: "Empresa" },
  { id: "baseline", label: "Baseline" },
  { id: "drivers", label: "Drivers" },
  { id: "pesos", label: "Pesos de Confiança" },
  { id: "rhdigital", label: "RH Digital" },
  { id: "beneficios", label: "Benefícios" },
  { id: "custos", label: "Custos Médios" },
];

export default function ROIConfigV3() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("empresa");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="border-b border-gray-200 px-6 py-3 bg-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline" onClick={() => navigate("/nexti-analytics")}>Home</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline" onClick={() => navigate("/analytics-v3")}>Analytics V3</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-gray-500 font-semibold">Configurações de ROI</span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-56 bg-white border-r border-gray-200 p-4">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${activeSection === s.id ? "bg-[#FF5722] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeSection === "empresa" && <EmpresaConfig />}
          {activeSection === "rhdigital" && <RHDigitalConfig />}
          {activeSection === "beneficios" && <BeneficiosConfig />}
          {activeSection === "custos" && <CustosConfig />}
          {activeSection === "baseline" && <BaselineConfig />}
          {activeSection === "drivers" && <DriversConfig />}
        </div>
      </div>
    </div>
  );
}

function EmpresaConfig() {
  const c = configV3.empresa;
  return (
    <ConfigSection title="Configuração Geral da Empresa">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome" value={c.nome} />
        <Field label="Qtd Colaboradores" value={String(c.colaboradores)} />
        <Field label="Qtd Dispositivos" value={String(c.dispositivos)} />
        <Field label="Custo por Colaborador" value={String(c.custoColaborador)} prefix="R$" />
        <Field label="Custo por Dispositivo" value={String(c.custoDispositivo)} prefix="R$" />
        <Field label="Ownership Mensal" value={String(c.ownershipMensal)} prefix="R$" />
        <Field label="Ownership Anual" value={String(c.ownershipAnual)} prefix="R$" />
        <Field label="Salário Médio" value={String(c.salarioMedio)} prefix="R$" />
        <Field label="Encargos (%)" value={String(c.encargos)} suffix="%" />
        <Field label="Custo Admin/Hora" value={String(c.custoAdminHora)} prefix="R$" />
        <Field label="Custo Médio Processo Trabalhista" value={String(c.custoMedioProcesso)} prefix="R$" />
      </div>
    </ConfigSection>
  );
}

function RHDigitalConfig() {
  const c = configV3.rhDigital;
  return (
    <ConfigSection title="Configuração RH Digital">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Custo de Deslocamento" value={String(c.custoDeslocamento)} prefix="R$" />
        <Field label="Tempo do Supervisor (min)" value={String(c.tempoSupervisorMin)} suffix="min" />
        <Field label="Custo/Hora Supervisor" value={String(c.custoHoraSupervisor)} prefix="R$" />
        <Field label="Custo de Impressão" value={String(c.custoImpressao)} prefix="R$" />
        <Field label="Custo de Coleta" value={String(c.custoColeta)} prefix="R$" />
        <Field label="Custo de Digitalização" value={String(c.custoDigitalizacao)} prefix="R$" />
      </div>
    </ConfigSection>
  );
}

function BeneficiosConfig() {
  const c = configV3.beneficios;
  return (
    <ConfigSection title="Configuração de Benefícios">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Custo Médio VT" value={String(c.custoMedioVT)} prefix="R$" />
        <Field label="Custo Médio VR" value={String(c.custoMedioVR)} prefix="R$" />
        <Field label="Custo Médio VA" value={String(c.custoMedioVA)} prefix="R$" />
        <Field label="% Elegível" value={String(c.pctElegivel)} suffix="%" />
        <Field label="Dias Úteis" value={String(c.diasUteis)} />
        <Field label="Ticket Médio" value={String(c.ticketMedio)} prefix="R$" />
      </div>
    </ConfigSection>
  );
}

function CustosConfig() {
  const c = configV3.custoMedioEventos;
  return (
    <ConfigSection title="Custo Médio de Eventos">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Custo Médio HE" value={String(c.custoMedioHE)} prefix="R$" />
        <Field label="Custo Médio Adicional Noturno" value={String(c.custoMedioAN)} prefix="R$" />
        <Field label="Custo Médio Desconto/Evento" value={String(c.custoMedioDescontoPorEvento)} prefix="R$" />
        <Field label="Custo Admin/Hora" value={String(c.custoMedioAdminHora)} prefix="R$" />
        <Field label="Custo Médio Processo" value={String(c.custoMedioProcesso)} prefix="R$" />
      </div>
    </ConfigSection>
  );
}

function BaselineConfig() {
  return (
    <ConfigSection title="Configuração de Baseline">
      <p className="text-sm text-gray-500 mb-4">Configuração de baseline por driver. O sistema prioriza o histórico real do cliente.</p>
      <div className="space-y-3">
        {["Horas Extras", "Adicional Noturno", "Descontos", "RH Digital", "Fechamento", "Disputas", "Quadro de Lotação", "HPNF", "Benefícios"].map(d => (
          <div key={d} className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-800 mb-2">{d}</p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Fonte Baseline" value="Histórico real" small />
              <Field label="Janela Baseline" value="12 meses" small />
              <Field label="Benchmark" value="—" small />
            </div>
          </div>
        ))}
      </div>
    </ConfigSection>
  );
}

function DriversConfig() {
  return (
    <ConfigSection title="Configuração por Driver">
      <p className="text-sm text-gray-500 mb-4">Configuração de monetização e regras por driver.</p>
      <div className="space-y-3">
        {["Horas Extras", "Adicional Noturno", "Descontos", "RH Digital", "Fechamento", "Disputas", "Quadro de Lotação", "HPNF", "Benefícios"].map(d => (
          <div key={d} className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-800 mb-2">{d}</p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Tipo Monetização" value="Real / Estimado" small />
              <Field label="Unidade" value="horas" small />
              <Field label="Custo Unitário" value="—" small />
            </div>
          </div>
        ))}
      </div>
    </ConfigSection>
  );
}

function ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button className="bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#E64A19]">
          <Save className="w-4 h-4" /> Salvar
        </button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, prefix, suffix, small }: { label: string; value: string; prefix?: string; suffix?: string; small?: boolean }) {
  return (
    <div>
      <label className={`block ${small ? "text-xs" : "text-sm"} text-gray-500 mb-1`}>{label}</label>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        {prefix && <span className="bg-gray-50 px-2 py-2 text-sm text-gray-500 border-r">{prefix}</span>}
        <input type="text" defaultValue={value} className={`flex-1 px-3 py-2 ${small ? "text-xs" : "text-sm"} outline-none`} />
        {suffix && <span className="bg-gray-50 px-2 py-2 text-sm text-gray-500 border-l">{suffix}</span>}
      </div>
    </div>
  );
}
