import { useState } from "react";
import { Settings, Save, RotateCcw, BookOpen, Shield, Calculator, BarChart3, Eye } from "lucide-react";
import { premissas, drivers, ownership, confidenceBadge, formatCurrency, getDriversIntangiveis } from "@/lib/roiData";

export default function MetodologiaTab() {
  const [localPremissas, setLocalPremissas] = useState({ ...premissas });
  const [localOwnership, setLocalOwnership] = useState({ ...ownership });
  const [activeSection, setActiveSection] = useState<string>("governanca");
  const intangiveis = getDriversIntangiveis();

  const handlePremissaChange = (key: string, value: string) => {
    setLocalPremissas(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleReset = () => {
    setLocalPremissas({ ...premissas });
    setLocalOwnership({ ...ownership });
  };

  const premissaFields = [
    { key: "colaboradores", label: "Colaboradores", suffix: "" },
    { key: "salarioMedio", label: "Salário Médio", suffix: "R$" },
    { key: "encargos", label: "Encargos", suffix: "x" },
    { key: "beneficios", label: "Benefícios", suffix: "R$" },
    { key: "multiplicadorHE", label: "Multiplicador HE", suffix: "x" },
    { key: "adicionalNoturno", label: "Adicional Noturno", suffix: "%" },
    { key: "custoHoraAdmin", label: "Custo Hora Admin", suffix: "R$" },
    { key: "custoMedioDisputa", label: "Custo Médio Disputa", suffix: "R$" },
    { key: "custoUnitarioDoc", label: "Custo Unitário Doc.", suffix: "R$" },
    { key: "turnover", label: "Turnover", suffix: "%" },
    { key: "genteReceita", label: "Gente % Receita", suffix: "%" },
    { key: "custoUnitarioNexti", label: "Custo Unitário Nexti", suffix: "R$/col" },
  ];

  const sections = [
    { id: "governanca", label: "Governança do Valor", icon: Shield },
    { id: "configuracao", label: "Configurações", icon: Settings },
    { id: "drivers", label: "Drivers", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">Metodologia e Governança do ROI</h2>
            <p className="text-xs text-gray-500">Premissas, classificações e transparência dos cálculos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-50">
            <RotateCcw className="w-3.5 h-3.5" /> Resetar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FF5722] text-white text-xs font-medium hover:bg-[#E64A19]">
            <Save className="w-3.5 h-3.5" /> Salvar
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2">
        {sections.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${activeSection === s.id ? "bg-[#FF5722] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
              <Icon className="w-3.5 h-3.5" /> {s.label}
            </button>
          );
        })}
      </div>

      {activeSection === "governanca" && (
        <div className="space-y-4">
          {/* O que entra no ROI */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-800">O que entra no ROI monetário</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="space-y-2">
                <p>✅ <strong>Ganhos financeiros mensuráveis</strong> — reduções de custo, economia com processos, eliminação de desperdícios e ganhos de eficiência com valor monetário direto ou estimável.</p>
                <p>✅ <strong>Drivers com baseline definido</strong> — cada driver possui uma referência (histórico real, benchmark ou Base Case) comparada ao resultado atual.</p>
                <p>✅ <strong>Custo unitário atribuído</strong> — todo ganho é convertido em valor financeiro utilizando custo unitário informado pelo cliente ou estimado por premissa ajustável.</p>
              </div>
              <div className="space-y-2">
                <p>❌ <strong>Ganhos intangíveis</strong> — melhoria de SLA, governança, conformidade e satisfação são exibidos separadamente e não compõem o ROI monetário total.</p>
                <p>❌ <strong>Projeções futuras</strong> — o ROI reflete valor já capturado no período, não projeções ou estimativas de ganhos futuros.</p>
                <p>❌ <strong>Valores sem baseline</strong> — drivers sem referência de comparação não geram cálculo de ganho.</p>
              </div>
            </div>
          </div>

          {/* Confiança */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[#FF5722]" />
              <h3 className="text-sm font-semibold text-gray-800">Como a confiança é classificada</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { level: "Comprovado", color: "border-green-300 bg-green-50", dot: "bg-green-500", desc: "Cálculo baseado em dado real do cliente, com baseline confiável e dado atual confiável. Custo unitário real ou derivado de folha." },
                { level: "Híbrido", color: "border-yellow-300 bg-yellow-50", dot: "bg-yellow-500", desc: "Cálculo parcialmente baseado em dado real, combinado com fator estimado, proxy ou premissa ajustável. Volume real + custo estimado." },
                { level: "Referencial", color: "border-gray-300 bg-gray-50", dot: "bg-gray-400", desc: "Cálculo baseado em Base Case, benchmark interno ou premissa genérica, ainda sem validação total no cliente." },
                { level: "Potencial", color: "border-blue-300 bg-blue-50", dot: "bg-blue-400", desc: "Valor que ainda não foi capturado no período, mas que pode ser alcançado com melhoria operacional ou importação de dados." },
              ].map((c, i) => (
                <div key={i} className={`rounded-lg border-2 ${c.color} p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-3 h-3 rounded-full ${c.dot}`} />
                    <span className="text-sm font-semibold text-gray-800">{c.level}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Baseline */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-800">Como o baseline é escolhido</h3>
            </div>
            <div className="space-y-3 text-xs text-gray-600">
              <p>O sistema utiliza uma hierarquia de prioridade para definir o baseline de cada driver:</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { num: "1", title: "Histórico real", desc: "Dados reais do cliente antes da ativação do módulo (prioridade máxima)" },
                  { num: "2", title: "Média em janela", desc: "Média do cliente em janela anterior válida, quando histórico completo não está disponível" },
                  { num: "3", title: "Benchmark interno", desc: "Benchmark por perfil semelhante de operação no ecossistema Nexti" },
                  { num: "4", title: "Base Case Nexti", desc: "Premissa padrão baseada em cases anteriores (menor nível de confiança)" },
                ].map((b, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-[#FF5722] text-white text-xs font-bold flex items-center justify-center">{b.num}</span>
                      <span className="text-xs font-semibold text-gray-700">{b.title}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ownership e intangíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Ownership Nexti</h3>
              <p className="text-xs text-gray-600 leading-relaxed">O ownership representa o custo total do investimento na solução Nexti, composto por: custo do contrato, custos adicionais (se houver) e custos reduzidos (cancelamentos). A economia líquida é calculada subtraindo o ownership da economia bruta.</p>
              <div className="mt-3 p-3 bg-gray-50 rounded text-xs">
                <p className="font-mono text-[#FF5722]">economia_líquida = economia_bruta - ownership_total</p>
                <p className="font-mono text-[#FF5722] mt-1">ROI = economia_bruta / ownership_total</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Ganhos Intangíveis</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">Ganhos intangíveis não entram no ROI monetário por padrão, mas aparecem como camada complementar de valor, demonstrando benefícios qualitativos da solução.</p>
              <div className="space-y-2">
                {intangiveis.map(d => (
                  <div key={d.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-600">{d.nome}</span>
                    <span className="text-xs font-medium text-gray-700">{d.baseline} → {d.atual} {d.unidadeMedida}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "configuracao" && (
        <div className="space-y-6">
          {/* Dados da Empresa */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-sm">📊</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Dados da Empresa</h3>
                <p className="text-[10px] text-gray-500">Parâmetros base para cálculo (referência: 8.000 colaboradores)</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {premissaFields.map(f => (
                <div key={f.key}>
                  <label className="text-[10px] text-gray-500 font-medium uppercase block mb-1">{f.label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={(localPremissas as any)[f.key]}
                      onChange={(e) => handlePremissaChange(f.key, e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-medium text-gray-700 text-right focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20"
                    />
                    {f.suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{f.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrato Nexti */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-sm">📋</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Contrato Nexti (Ownership)</h3>
                <p className="text-[10px] text-gray-500">Custos do investimento na solução</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "custoContrato", label: "Custo Contrato", sub: "Valor mensal contratado" },
                { key: "custosAdicionais", label: "Custos Adicionais", sub: "Serviços extras" },
                { key: "custosReduzidos", label: "Custos Reduzidos", sub: "Cancelamentos/descontos" },
                { key: "ownershipTotal", label: "Ownership Total", sub: "Custo total do investimento" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] text-gray-500 font-medium uppercase block mb-1">{f.label}</label>
                  <input
                    type="number"
                    value={(localOwnership as any)[f.key]}
                    onChange={(e) => setLocalOwnership(prev => ({ ...prev, [f.key]: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-medium text-gray-700 text-right focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === "drivers" && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-sm">⚙️</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Configuração de Drivers</h3>
              <p className="text-[10px] text-gray-500">Fonte, baseline, metodologia e confiança por driver</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  {["Driver", "Módulo", "Categoria", "Status", "Fonte Baseline", "Hierarquia", "Janela", "Fonte Atual", "Confiança", "Fator %"].map(h => (
                    <th key={h} className="text-left py-2 px-2 text-gray-500 font-medium uppercase text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drivers.map(d => {
                  const badge = confidenceBadge(d.confianca);
                  return (
                    <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 font-medium text-gray-700">{d.nome}</td>
                      <td className="py-2 px-2 text-gray-500">{d.moduloNexti}</td>
                      <td className="py-2 px-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${d.categoria === "monetario" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"}`}>
                          {d.categoria === "monetario" ? "Monetário" : "Intangível"}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${d.status === "ativo" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-gray-500 max-w-[120px] truncate" title={d.fonteBaseline}>{d.fonteBaseline}</td>
                      <td className="py-2 px-2 text-gray-500 text-[10px]">{d.hierarquiaBaseline.replace(/_/g, " ")}</td>
                      <td className="py-2 px-2 text-gray-500 text-[10px]">{d.janelaBaseline}</td>
                      <td className="py-2 px-2 text-gray-500 max-w-[100px] truncate" title={d.fonteAtual}>{d.fonteAtual}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.color} border ${badge.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} /> {badge.label}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <input type="number" defaultValue={d.fatorReducao} className="w-16 border border-gray-200 rounded px-2 py-1 text-xs text-right focus:outline-none focus:border-[#FF5722]" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
