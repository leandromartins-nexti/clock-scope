
## Plan: Add Solicitações tab content

Based on the screenshot, the Solicitações tab has 4 chart cards in a 2x2 grid, plus the existing side panel:

**Top row:**
1. **Solicitações de Justificativa de Ponto** — Grouped bar chart with 3 series (Em Aberto: 7.261, Ajustadas: 811.112, Canceladas: 181.627) using orange/yellow/pink colors
2. **% Solicitações de Justificativa de Ponto por Tipo** — Horizontal bar chart with codes (752, 7348, 7349, 4911, 218, 7609, 4909, 3512, 3521) and percentages (29.1%, 24.3%, 7.6%, 4.5%, 2.0%, 1.8%, 1.7%, 1.6%, 1.4%)

**Bottom row:**
3. **% Solicitações de Justificativa de Pontos Tratadas por Período** — Line chart, flat at 99.3% across Jan-Dez
4. **% Tempo Médio Tratativa de Solicitações por Período** — Line chart showing ~3.357,5 values across Jan-Dez

### Technical approach
- Add mock data constants for each chart
- Create a `SolicitacoesContent` component following the same pattern as `VisaoGeralContent` and `InconsistenciasContent`
- Use recharts `BarChart` for charts 1-2, `LineChart` for charts 3-4
- Replace the `PlaceholderContent` for Solicitações with the new component
- File changed: `src/pages/StrategyPrime.tsx`
