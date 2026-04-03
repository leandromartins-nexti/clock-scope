import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Eraser } from "lucide-react";
import { FilterPanel } from "@/components/layout/FilterPanel";
import V3ResumoExecutivoTab from "./analytics-v3/V3ResumoExecutivoTab";
import V3AlavancasEconomiaTab from "./analytics-v3/V3AlavancasEconomiaTab";
import V3OperacoesEstruturasTab from "./analytics-v3/V3OperacoesEstruturasTab";
import V3DisciplinaOperacionalTab from "./analytics-v3/V3DisciplinaOperacionalTab";
import V3CoberturasRiscoTab from "./analytics-v3/V3CoberturasRiscoTab";
import V3EvolucaoTab from "./analytics-v3/V3EvolucaoTab";
import V3PlanoAcaoTab from "./analytics-v3/V3PlanoAcaoTab";
import V3MetodologiaTab from "./analytics-v3/V3MetodologiaTab";
import V3RetornoInvestimentoTab from "./analytics-v3/V3RetornoInvestimentoTab";

const tabs = [
  { id: "resumo", label: "Resumo Executivo" },
  { id: "alavancas", label: "Alavancas de Economia" },
  { id: "operacoes", label: "Operações e Estruturas" },
  { id: "disciplina", label: "Disciplina Operacional" },
  { id: "coberturas", label: "Coberturas e Continuidade" },
  { id: "evolucao", label: "Evolução da Operação" },
  { id: "plano", label: "Plano de Ação" },
  { id: "metodologia", label: "Metodologia e Governança" },
  { id: "retorno", label: "Retorno do Investimento" },
];

export default function AnalyticsV3() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("resumo");
  const [filterOpen, setFilterOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "resumo": return <V3ResumoExecutivoTab />;
      case "alavancas": return <V3AlavancasEconomiaTab />;
      case "operacoes": return <V3OperacoesEstruturasTab />;
      case "disciplina": return <V3DisciplinaOperacionalTab />;
      case "coberturas": return <V3CoberturasRiscoTab />;
      case "evolucao": return <V3EvolucaoTab />;
      case "plano": return <V3PlanoAcaoTab />;
      case "metodologia": return <V3MetodologiaTab />;
      case "retorno": return <V3RetornoInvestimentoTab />;
      default: return <V3ResumoExecutivoTab />;
    }
  };

  return (
    <div className="bg-muted/30 min-h-screen flex flex-col">
      <header className="border-b border-border px-6 py-3 bg-muted/50">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-primary font-medium cursor-pointer hover:underline" onClick={() => navigate("/nexti-analytics")}>Home</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-primary font-semibold">Analytics V3</span>
        </div>
      </header>

      <div className="border-b border-border bg-card px-6">
        <div className="flex items-center justify-between">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setFilterOpen(true)} className="border border-border text-muted-foreground px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-muted">
              <Filter className="w-4 h-4" /> Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card px-6 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-primary" />
            <span className="font-semibold text-muted-foreground">Filtros Aplicados:</span>
          </div>
          <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium">Período: abr/2025 - mar/2026</span>
          <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium">Cliente: Orsegups</span>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <Eraser className="w-4 h-4" /> Limpar Filtros
        </button>
      </div>

      <div className="px-6 py-4">
        {renderTab()}
      </div>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
