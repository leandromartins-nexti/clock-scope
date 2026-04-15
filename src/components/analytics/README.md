# Analytics Components — Guia de Componentização

## Estrutura de Pastas

```
src/components/analytics/
├── index.ts                    ← barrel export principal
├── types.ts                    ← tipos compartilhados (BigNumberData, Score, etc.)
├── tab/
│   ├── AnalyticsTab.tsx        ← wrapper de layout (conteúdo + sidebar)
│   └── index.ts
├── kpi/
│   ├── KPIRow.tsx              ← linha de 6 BigNumbers
│   └── index.ts                ← re-exporta KPIRow, ScoreBoard, KPIBoard
├── filter/
│   ├── OperationFilter.tsx     ← alias para GroupBySidebar
│   └── index.ts
├── map/
│   └── index.ts                ← re-exporta ScoreGauge (futuro: OperationMap)
├── chart/
│   └── index.ts                ← re-exporta ChartModeToggle, ChartDataModal
├── insights/
│   └── index.ts                ← re-exporta InsightsSection, InsightDetailModal
├── GroupBySidebar.tsx           ← componente original do filtro lateral
├── KPIBoard.tsx                ← ScoreBoard + KPIBoard originais
├── ScoreGauge.tsx              ← gauge semicircular
├── QualidadeInsightsSection.tsx ← implementação dos insights
├── InsightDetailModal.tsx      ← modal de detalhe de insight
├── ChartModeToggle.tsx         ← toggle de modo (linha/barra/área + %/valor)
├── ChartDataModal.tsx          ← modal "Ver dados" por gráfico
├── CompositeChartDataModal.tsx ← modal multi-fonte
├── IndicatorTable.tsx          ← tabela com busca e ordenação
├── InfoTip.tsx                 ← tooltip de informação
└── NoDataPlaceholder.tsx       ← estado vazio
```

## Como Criar uma Nova Aba Analytics

### Passo 1 — Definir os 6 BigNumbers

```tsx
const bigNumbers: BigNumberData[] = [
  { label: "Score da Aba", value: "85", tooltip: "...", classification: { label: "Bom", level: "bom" } },
  { label: "KPI 2", value: "92%", tooltip: "..." },
  { label: "KPI 3", value: "4.2", unit: "dias", tooltip: "..." },
  { label: "KPI 4", value: "320", tooltip: "..." },
  { label: "Melhor Operação", value: "Empresa X", tooltip: "..." },
  { label: "Maior Risco", value: "Empresa Y", tooltip: "..." },
];
```

### Passo 2 — Compor a aba

```tsx
import { AnalyticsTab, KPIRow, InsightsSection, OperationFilter } from "@/components/analytics";

export function MinhaNovaTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");

  return (
    <AnalyticsTab
      sidebar={
        <OperationFilter
          items={sidebarItems}
          selectedRegional={selectedRegional}
          onRegionalClick={handleClick}
          groupBy={groupBy}
          onGroupByChange={handleGroupChange}
        />
      }
    >
      <KPIRow items={bigNumbers} />
      
      {/* Mapa de Operações — sempre o primeiro gráfico */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        {/* ScatterChart: Headcount × Score */}
      </div>

      {/* Gráficos contextuais */}
      <div className="grid grid-cols-2 gap-3">
        {/* ChartCard 1 */}
        {/* ChartCard 2 */}
      </div>

      {/* Insights — sempre o último componente */}
      <InsightsSection />
    </AnalyticsTab>
  );
}
```

### Passo 3 — Criar dados de insights

Criar `src/data/customers/{id}/insights-{tab}.json` seguindo o schema de `QualidadeInsight`:

```json
[
  {
    "id": "R1",
    "category": "risk",
    "severity": "critical",
    "title": "...",
    "narrative": "...",
    "evidence": { "before": { "label": "...", "value": "..." }, "after": { "label": "...", "value": "..." } },
    "action": "...",
    "modal": {
      "diagnosis": "...",
      "evidence": [{ "label": "...", "value": "...", "context": "..." }],
      "action_plan": ["..."],
      "related_cards": ["..."]
    }
  }
]
```

### Passo 4 — Registrar no menu

Adicionar entrada em `AnalyticsOperacional.tsx` (array `tabs`) e `renderTab()`.

## Regras Imutáveis

1. **KPIRow** sempre tem **exatamente 6 items** (placeholders se necessário)
2. **OperationMap** é sempre o **primeiro gráfico** abaixo do KPIRow
3. **Filtro lateral** é sempre sticky à direita via `AnalyticsTab sidebar={...}`
4. **InsightsSection** é sempre o **último componente** da aba
5. Gráficos contextuais ficam **entre OperationMap e InsightsSection**
6. Usar tokens de design existentes — nunca inventar cores/espaçamentos

## Tipos Compartilhados

Importar de `@/components/analytics/types`:

- `BigNumberData` — dados de um card KPI
- `Score` — valor + classificação
- `ScoreLevel` — "excelente" | "bom" | "atencao" | "ruim" | "critico"
- `OperationFilterState` — estado do filtro lateral
- `TabContentProps` — props compartilhadas por Content components
- `Entity` — entidade genérica com id, nome, headcount e score

## Convenções

- Componentes apresentacionais (KPIRow, AnalyticsTab) não conhecem domínio
- Componentes de domínio (InsightsSection) podem buscar dados via hooks
- Data layer separado em `src/hooks/analytics/`
- Filtros locais de gráfico são efêmeros (não persistem em localStorage)
- Filtro lateral (GroupBySidebar) é a fonte da verdade para todos os gráficos
