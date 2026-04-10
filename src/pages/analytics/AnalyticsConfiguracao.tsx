import { useState } from "react";
import { Database, ChevronRight, ChevronDown, Table2, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

// Import all data sources
import {
  ajustesEmpresaData, ajustesUnidadeData, ajustesAreaData,
  composicaoEmpresaData, composicaoUnidadeData, composicaoAreaData,
  qualidadeEmpresaData,
} from "@/lib/ajustesData";
import {
  resumo, evolucaoVetores, evolucaoEconomia,
  disciplina, coberturas, bancoHoras, compliance, operacoes,
  resumoComparativo, radarIndicadores, rankingOperacoes,
  dadosPorRegional, sparklineData, insightsResumo,
} from "@/lib/analytics-mock-data";

// ── Registry: Menu > Aba > Gráfico ──

interface DataSource {
  id: string;
  chartName: string;
  dataKey: string;
  recordCount: number;
  columns: string[];
  getData: () => any[];
}

interface TabEntry {
  tabName: string;
  sources: DataSource[];
}

interface MenuEntry {
  menuName: string;
  tabs: TabEntry[];
}

function toArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
}

function getColumns(data: any[]): string[] {
  if (data.length === 0) return [];
  const first = data[0];
  if (typeof first !== "object" || first === null) return ["value"];
  return Object.keys(first);
}

function buildSource(id: string, chartName: string, dataKey: string, rawData: any): DataSource {
  const arr = toArray(rawData);
  return {
    id,
    chartName,
    dataKey,
    recordCount: arr.length,
    columns: getColumns(arr),
    getData: () => arr,
  };
}

const dataRegistry: MenuEntry[] = [
  {
    menuName: "Resumo Executivo",
    tabs: [
      {
        tabName: "Visão Geral",
        sources: [
          buildSource("re-resumo", "KPIs do Resumo", "resumo", [resumo]),
          buildSource("re-comparativo", "Comparativo Score", "resumoComparativo", [resumoComparativo]),
          buildSource("re-radar", "Radar de Indicadores", "radarIndicadores", radarIndicadores),
          buildSource("re-ranking", "Ranking de Operações", "rankingOperacoes", rankingOperacoes),
          buildSource("re-sparkline-qp", "Sparkline — Qualidade do Ponto", "sparklineData.qualidadePonto.evolucao", sparklineData.qualidadePonto.evolucao),
          buildSource("re-sparkline-abs", "Sparkline — Absenteísmo", "sparklineData.absenteismo.evolucao", sparklineData.absenteismo.evolucao),
          buildSource("re-sparkline-he", "Sparkline — Volume HE", "sparklineData.volumeHE.evolucao", sparklineData.volumeHE.evolucao),
          buildSource("re-sparkline-mov", "Sparkline — Movimentações", "sparklineData.movimentacoes.evolucao", sparklineData.movimentacoes.evolucao),
          buildSource("re-sparkline-cob", "Sparkline — Cobertura Efetiva", "sparklineData.coberturaEfetiva.evolucao", sparklineData.coberturaEfetiva.evolucao),
          buildSource("re-insights", "Insights", "insightsResumo", insightsResumo),
          buildSource("re-dados-regional", "Dados por Regional", "dadosPorRegional", Object.entries(dadosPorRegional).map(([k, v]) => ({ regional: k, ...v }))),
        ],
      },
      {
        tabName: "Evolução",
        sources: [
          buildSource("re-evolucao-vetores", "Evolução dos Vetores", "evolucaoVetores", evolucaoVetores),
          buildSource("re-evolucao-economia", "Evolução da Economia", "evolucaoEconomia", evolucaoEconomia),
        ],
      },
    ],
  },
  {
    menuName: "Operacional",
    tabs: [
      {
        tabName: "Qualidade do Ponto",
        sources: [
          buildSource("op-qp-ajustes-empresa", "Ajustes por Empresa", "ajustesEmpresaData", ajustesEmpresaData),
          buildSource("op-qp-ajustes-unidade", "Ajustes por Un. Negócio", "ajustesUnidadeData", ajustesUnidadeData),
          buildSource("op-qp-ajustes-area", "Ajustes por Área", "ajustesAreaData", ajustesAreaData),
          buildSource("op-qp-composicao-empresa", "Composição Tempo Tratativa — Empresa", "composicaoEmpresaData", composicaoEmpresaData),
          buildSource("op-qp-composicao-unidade", "Composição Tempo Tratativa — Un. Negócio", "composicaoUnidadeData", composicaoUnidadeData),
          buildSource("op-qp-composicao-area", "Composição Tempo Tratativa — Área", "composicaoAreaData", composicaoAreaData),
          buildSource("op-qp-kpis", "KPIs Qualidade", "disciplina.qualidade", [disciplina.qualidade]),
          buildSource("op-qp-evolucao", "Evolução Qualidade", "disciplina.qualidade.evolucao", disciplina.qualidade.evolucao),
          buildSource("op-qp-distribuicao", "Distribuição Marcações", "disciplina.qualidade.distribuicao", disciplina.qualidade.distribuicao),
          buildSource("op-qp-regionais", "Regionais Qualidade", "disciplina.qualidade.regionais", disciplina.qualidade.regionais),
        ],
      },
      {
        tabName: "Absenteísmo",
        sources: [
          buildSource("op-abs-kpis", "KPIs Absenteísmo", "disciplina.absenteismo", [{ taxaGlobal: disciplina.absenteismo.taxaGlobal, horasTotais: disciplina.absenteismo.horasTotais, faltasNaoJustificadas: disciplina.absenteismo.faltasNaoJustificadas, cobertas: disciplina.absenteismo.cobertas }]),
          buildSource("op-abs-evolucao-tipo", "Evolução por Tipo", "disciplina.absenteismo.evolucaoTipo", disciplina.absenteismo.evolucaoTipo),
          buildSource("op-abs-evolucao-taxa", "Evolução Taxa", "disciplina.absenteismo.evolucaoTaxa", disciplina.absenteismo.evolucaoTaxa),
          buildSource("op-abs-regionais", "Regionais Absenteísmo", "disciplina.absenteismo.regionais", disciplina.absenteismo.regionais),
        ],
      },
      {
        tabName: "Movimentações",
        sources: [
          buildSource("op-mov-kpis", "KPIs Movimentações", "disciplina.movimentacoes", [{ trocasEscala: disciplina.movimentacoes.trocasEscala, trocasPosto: disciplina.movimentacoes.trocasPosto, totalMovimentacoes: disciplina.movimentacoes.totalMovimentacoes }]),
          buildSource("op-mov-evolucao", "Evolução Movimentações", "disciplina.movimentacoes.evolucao", disciplina.movimentacoes.evolucao),
          buildSource("op-mov-regionais", "Regionais Movimentações", "disciplina.movimentacoes.regionais", disciplina.movimentacoes.regionais),
        ],
      },
      {
        tabName: "Coberturas",
        sources: [
          buildSource("op-cob-kpis", "KPIs Coberturas", "coberturas.kpis", [coberturas.kpis]),
          buildSource("op-cob-distribuicao", "Distribuição Tipo Evento", "coberturas.distribuicaoTipoEvento", coberturas.distribuicaoTipoEvento),
          buildSource("op-cob-evolucao", "Evolução Coberturas", "coberturas.evolucao", coberturas.evolucao),
          buildSource("op-cob-regionais", "Regionais Coberturas", "coberturas.regionais", coberturas.regionais),
        ],
      },
      {
        tabName: "Violações Trabalhistas",
        sources: [
          buildSource("op-viol-kpis", "KPIs Violações", "compliance", [{ totalViolacoes: compliance.totalViolacoes, violacoesPor100: compliance.violacoesPor100, tipoMaisFrequente: compliance.tipoMaisFrequente }]),
          buildSource("op-viol-evolucao", "Evolução Violações", "compliance.evolucao", compliance.evolucao),
          buildSource("op-viol-regionais", "Regionais Violações", "compliance.regionais", compliance.regionais),
          buildSource("op-viol-detalhe", "Detalhe por Tipo", "compliance.detalhePorTipo", compliance.detalhePorTipo),
        ],
      },
      {
        tabName: "Banco de Horas",
        sources: [
          buildSource("op-bh-kpis", "KPIs Banco de Horas", "bancoHoras", [{ saldoTotal: bancoHoras.saldoTotal, saldoMedioPorColab: bancoHoras.saldoMedioPorColab, colaboradoresCriticos: bancoHoras.colaboradoresCriticos }]),
          buildSource("op-bh-evolucao", "Evolução Banco de Horas", "bancoHoras.evolucao", bancoHoras.evolucao),
          buildSource("op-bh-regionais", "Regionais Banco de Horas", "bancoHoras.regionais", bancoHoras.regionais),
        ],
      },
      {
        tabName: "Operações e Estruturas",
        sources: [
          buildSource("op-oe-regionais", "Regionais — Operações e Estruturas", "operacoes.regionais", operacoes.regionais),
        ],
      },
    ],
  },
];

// ── Viewer Modal ──
function DataViewerModal({ source, open, onClose }: { source: DataSource | null; open: boolean; onClose: () => void }) {
  if (!source) return null;
  const data = source.getData();
  const cols = source.columns;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base">{source.chartName}</DialogTitle>
          <p className="text-xs text-muted-foreground">{source.dataKey} — {source.recordCount} registros</p>
        </DialogHeader>
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {cols.map(col => (
                  <TableHead key={col} className="text-xs whitespace-nowrap">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 200).map((row, i) => (
                <TableRow key={i}>
                  {cols.map(col => {
                    let val = row[col];
                    if (val && typeof val === "object") val = JSON.stringify(val);
                    return (
                      <TableCell key={col} className="text-xs py-1.5 whitespace-nowrap">
                        {val === null || val === undefined ? <span className="text-muted-foreground/50">null</span> : String(val)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.length > 200 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              Exibindo 200 de {data.length} registros
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Collapsible Section ──
function MenuSection({ menu }: { menu: MenuEntry }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        <span className="font-semibold text-sm text-foreground">{menu.menuName}</span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          {menu.tabs.reduce((acc, t) => acc + t.sources.length, 0)} datasets
        </span>
      </button>
      {open && (
        <div className="border-t border-border/40">
          {menu.tabs.map(tab => (
            <TabSection key={tab.tabName} tab={tab} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabSection({ tab }: { tab: TabEntry }) {
  const [open, setOpen] = useState(false);
  const [viewSource, setViewSource] = useState<DataSource | null>(null);

  return (
    <>
      <div className="border-b border-border/20 last:border-b-0">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 w-full px-6 py-2.5 text-left hover:bg-muted/20 transition-colors"
        >
          {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
          <span className="text-sm font-medium text-foreground/90">{tab.tabName}</span>
          <span className="ml-auto text-[10px] text-muted-foreground">{tab.sources.length} datasets</span>
        </button>
        {open && (
          <div className="px-6 pb-3 space-y-1">
            {tab.sources.map(src => (
              <div
                key={src.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <Table2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{src.chartName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{src.dataKey} — {src.recordCount} registros — {src.columns.length} colunas</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setViewSource(src)}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> Ver dados
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <DataViewerModal source={viewSource} open={!!viewSource} onClose={() => setViewSource(null)} />
    </>
  );
}

// ── Main Page ──
export default function AnalyticsConfiguracao() {
  return (
    <div className="bg-[hsl(var(--surface))] min-h-screen flex flex-col">
      <div className="px-6 py-6 flex-1">
        <Tabs defaultValue="base-dados">
          <TabsList className="mb-4">
            <TabsTrigger value="base-dados" className="gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Base de Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="base-dados">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Base de Dados</h2>
                <p className="text-xs text-muted-foreground">
                  Todos os datasets dos gráficos organizados por Menu → Aba → Gráfico · Cliente: <span className="font-semibold text-foreground">Vig Eyes</span>
                </p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                {dataRegistry.reduce((acc, m) => acc + m.tabs.reduce((a, t) => a + t.sources.length, 0), 0)} datasets totais
              </div>
            </div>

            <div className="space-y-3">
              {dataRegistry.map(menu => (
                <MenuSection key={menu.menuName} menu={menu} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
