import { jsPDF } from "jspdf";
import {
  aggregateAjustes,
  aggregateComposicaoFaixas,
  aggregateQualidadeEvolucao,
  aggregateQualidadeEvolucaoDetalhado,
  aggregateQualidadeVolume,
  getQualidadeKpiSummary,
  getSidebarItems,
} from "@/lib/ajustesData";

type GroupBy = "empresa" | "unidade" | "area";

const ORANGE = [255, 87, 34] as const;
const HEADER_H = 18;
const MARGIN = 14;
const CHART_COLORS = {
  primary: [255, 87, 34] as const,    // orange
  secondary: [66, 133, 244] as const, // blue
  green: [52, 168, 83] as const,
  yellow: [251, 188, 4] as const,
  red: [234, 67, 53] as const,
  purple: [142, 68, 173] as const,
  teal: [0, 150, 136] as const,
  grey: [180, 180, 180] as const,
};

const groupByLabel: Record<GroupBy, string> = {
  empresa: "Empresa",
  unidade: "Unidade de Negócio",
  area: "Área",
};

// ─── Text Helpers ──────────────────────────────────────────

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("pt-BR");
}

function truncateText(doc: jsPDF, text: string, maxWidth: number): string {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && doc.getTextWidth(truncated + "…") > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + "…";
}

// ─── Drawing Helpers ───────────────────────────────────────

function drawHeader(doc: jsPDF, dateStr: string) {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, pageW, HEADER_H, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Nexti Analytics", MARGIN, 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(dateStr, pageW - MARGIN, 12, { align: "right" });
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text("Gerado automaticamente pelo Nexti Analytics AI", MARGIN, pageH - 8);
  doc.text(`Página ${pageNum} de ${totalPages}`, pageW - MARGIN, pageH - 8, { align: "right" });
}

function drawSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 33, 33);
  doc.text(title, MARGIN, y);
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.5);
  const pageW = doc.internal.pageSize.getWidth();
  doc.line(MARGIN, y + 2, pageW - MARGIN, y + 2);
  return y + 8;
}

function drawSubTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text(title, MARGIN, y);
  return y + 6;
}

function drawTable(doc: jsPDF, headers: string[], rows: string[][], y: number, options?: { colWidths?: number[] }): number {
  const pageW = doc.internal.pageSize.getWidth();
  const tableW = pageW - MARGIN * 2;
  const colWidths = options?.colWidths || headers.map(() => tableW / headers.length);
  const rowH = 7;

  doc.setFillColor(...ORANGE);
  doc.rect(MARGIN, y, tableW, rowH, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  let xOff = MARGIN;
  headers.forEach((h, i) => {
    doc.text(h, xOff + 2, y + 5);
    xOff += colWidths[i];
  });
  y += rowH;

  doc.setFont("helvetica", "normal");
  rows.forEach((row, ri) => {
    if (y + rowH > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 30;
    }
    if (ri % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(MARGIN, y, tableW, rowH, "F");
    }
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(7);
    xOff = MARGIN;
    row.forEach((cell, ci) => {
      doc.text(String(cell ?? ""), xOff + 2, y + 5);
      xOff += colWidths[ci];
    });
    y += rowH;
  });

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.rect(MARGIN, y - rowH * (rows.length + 1), tableW, rowH * (rows.length + 1));
  return y + 4;
}

function drawKpiCards(doc: jsPDF, kpis: { label: string; value: string }[], y: number): number {
  const pageW = doc.internal.pageSize.getWidth();
  const count = kpis.length;
  const gap = 4;
  const cardW = (pageW - MARGIN * 2 - gap * (count - 1)) / count;

  kpis.forEach((kpi, i) => {
    const x = MARGIN + i * (cardW + gap);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(x, y, cardW, 22, 2, 2, "F");
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(x, y, cardW, 22, 2, 2, "S");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(kpi.label, x + 4, y + 7);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 33, 33);
    const maxValW = cardW - 8;
    const displayVal = truncateText(doc, kpi.value, maxValW);
    doc.text(displayVal, x + 4, y + 17);
  });
  return y + 28;
}

function drawSummaryBox(doc: jsPDF, lines: string[], y: number): number {
  const pageW = doc.internal.pageSize.getWidth();
  const boxH = lines.length * 6 + 10;
  if (y + boxH > doc.internal.pageSize.getHeight() - 20) {
    doc.addPage();
    y = 30;
  }
  doc.setFillColor(255, 248, 240);
  doc.roundedRect(MARGIN, y, pageW - MARGIN * 2, boxH, 2, 2, "F");
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, MARGIN, y + boxH);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  lines.forEach((line, i) => {
    doc.text(`• ${line}`, MARGIN + 6, y + 7 + i * 6);
  });
  return y + boxH + 6;
}

// ─── Chart Drawing Functions ───────────────────────────────

function drawLineChart(
  doc: jsPDF,
  data: { label: string; series: { name: string; value: number; color: readonly [number, number, number] }[] }[],
  y: number,
  chartH: number = 65,
  title?: string
): number {
  const pageW = doc.internal.pageSize.getWidth();
  const chartX = MARGIN + 12;
  const chartW = pageW - MARGIN * 2 - 16;
  const chartY = y;

  // Background
  doc.setFillColor(252, 252, 252);
  doc.roundedRect(MARGIN, chartY - 4, pageW - MARGIN * 2, chartH + 20, 2, 2, "F");
  doc.setDrawColor(235, 235, 235);
  doc.roundedRect(MARGIN, chartY - 4, pageW - MARGIN * 2, chartH + 20, 2, 2, "S");

  // Find min/max across all series
  let allVals: number[] = [];
  data.forEach(d => d.series.forEach(s => allVals.push(s.value)));
  const maxVal = Math.max(...allVals) * 1.1;
  const minVal = Math.min(0, Math.min(...allVals) * 0.9);
  const range = maxVal - minVal || 1;

  // Grid lines (4 horizontal)
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.15);
  for (let i = 0; i <= 4; i++) {
    const gy = chartY + chartH - (i / 4) * chartH;
    doc.line(chartX, gy, chartX + chartW, gy);
    const val = minVal + (i / 4) * range;
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(fmtNum(Math.round(val)), chartX - 2, gy + 1, { align: "right" });
  }

  // X-axis labels
  const step = chartW / (data.length - 1 || 1);
  data.forEach((d, i) => {
    const x = chartX + i * step;
    doc.setFontSize(5.5);
    doc.setTextColor(130, 130, 130);
    doc.text(d.label, x, chartY + chartH + 5, { align: "center" });
  });

  // Draw each series
  const seriesNames = data[0]?.series.map(s => s.name) || [];
  seriesNames.forEach((name, si) => {
    const color = data[0]?.series[si]?.color || CHART_COLORS.primary;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8);

    const points: [number, number][] = data.map((d, i) => {
      const val = d.series[si]?.value || 0;
      const x = chartX + i * step;
      const yPos = chartY + chartH - ((val - minVal) / range) * chartH;
      return [x, yPos];
    });

    // Line
    for (let i = 1; i < points.length; i++) {
      doc.line(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1]);
    }

    // Dots
    doc.setFillColor(...color);
    points.forEach(([px, py]) => {
      doc.circle(px, py, 1, "F");
    });
  });

  // Legend
  const legendY = chartY + chartH + 10;
  let legendX = chartX;
  seriesNames.forEach((name, si) => {
    const color = data[0]?.series[si]?.color || CHART_COLORS.primary;
    doc.setFillColor(...color);
    doc.rect(legendX, legendY - 2, 3, 3, "F");
    doc.setFontSize(6);
    doc.setTextColor(80, 80, 80);
    doc.text(name, legendX + 5, legendY + 0.5);
    legendX += doc.getTextWidth(name) + 12;
  });

  return chartY + chartH + 20;
}

function drawStackedBarChart(
  doc: jsPDF,
  data: { label: string; segments: { name: string; value: number; color: readonly [number, number, number] }[] }[],
  y: number,
  chartH: number = 65
): number {
  const pageW = doc.internal.pageSize.getWidth();
  const chartX = MARGIN + 12;
  const chartW = pageW - MARGIN * 2 - 16;
  const chartY = y;

  doc.setFillColor(252, 252, 252);
  doc.roundedRect(MARGIN, chartY - 4, pageW - MARGIN * 2, chartH + 20, 2, 2, "F");
  doc.setDrawColor(235, 235, 235);
  doc.roundedRect(MARGIN, chartY - 4, pageW - MARGIN * 2, chartH + 20, 2, 2, "S");

  // Compute max total
  const totals = data.map(d => d.segments.reduce((s, seg) => s + seg.value, 0));
  const maxTotal = Math.max(...totals) * 1.1 || 1;

  // Grid lines
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.15);
  for (let i = 0; i <= 4; i++) {
    const gy = chartY + chartH - (i / 4) * chartH;
    doc.line(chartX, gy, chartX + chartW, gy);
    const val = (i / 4) * maxTotal;
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(fmtNum(Math.round(val)), chartX - 2, gy + 1, { align: "right" });
  }

  const barW = Math.min(12, (chartW / data.length) * 0.65);
  const gap = chartW / data.length;

  data.forEach((d, i) => {
    const x = chartX + i * gap + (gap - barW) / 2;
    let baseY = chartY + chartH;

    d.segments.forEach((seg) => {
      const segH = (seg.value / maxTotal) * chartH;
      doc.setFillColor(...seg.color);
      doc.rect(x, baseY - segH, barW, segH, "F");
      baseY -= segH;
    });

    // Label
    doc.setFontSize(5.5);
    doc.setTextColor(130, 130, 130);
    doc.text(d.label, x + barW / 2, chartY + chartH + 5, { align: "center" });
  });

  // Legend
  const segNames = data[0]?.segments.map(s => s.name) || [];
  const legendY = chartY + chartH + 10;
  let legendX = chartX;
  segNames.forEach((name, si) => {
    const color = data[0]?.segments[si]?.color || CHART_COLORS.grey;
    doc.setFillColor(...color);
    doc.rect(legendX, legendY - 2, 3, 3, "F");
    doc.setFontSize(6);
    doc.setTextColor(80, 80, 80);
    doc.text(name, legendX + 5, legendY + 0.5);
    legendX += doc.getTextWidth(name) + 12;
  });

  return chartY + chartH + 20;
}

function drawScatterChart(
  doc: jsPDF,
  data: { label: string; x: number; y: number; size: number; color: readonly [number, number, number] }[],
  yPos: number,
  chartH: number = 65,
  xAxisLabel: string = "Volume",
  yAxisLabel: string = "Qualidade %"
): number {
  const pageW = doc.internal.pageSize.getWidth();
  const chartX = MARGIN + 14;
  const chartW = pageW - MARGIN * 2 - 18;
  const chartY = yPos;

  doc.setFillColor(252, 252, 252);
  doc.roundedRect(MARGIN, chartY - 4, pageW - MARGIN * 2, chartH + 24, 2, 2, "F");
  doc.setDrawColor(235, 235, 235);
  doc.roundedRect(MARGIN, chartY - 4, pageW - MARGIN * 2, chartH + 24, 2, 2, "S");

  const xVals = data.map(d => d.x);
  const yVals = data.map(d => d.y);
  const xMin = 0;
  const xMax = Math.max(...xVals) * 1.15 || 1;
  const yMin = Math.min(...yVals) * 0.9;
  const yMax = Math.max(...yVals) * 1.1;
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  // Grid
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.15);
  for (let i = 0; i <= 4; i++) {
    const gy = chartY + chartH - (i / 4) * chartH;
    doc.line(chartX, gy, chartX + chartW, gy);
    const val = yMin + (i / 4) * yRange;
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(`${val.toFixed(0)}%`, chartX - 2, gy + 1, { align: "right" });
  }

  // X-axis labels
  for (let i = 0; i <= 4; i++) {
    const gx = chartX + (i / 4) * chartW;
    const val = xMin + (i / 4) * xRange;
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(fmtNum(Math.round(val)), gx, chartY + chartH + 5, { align: "center" });
  }

  // Axis labels
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.text(xAxisLabel, chartX + chartW / 2, chartY + chartH + 10, { align: "center" });

  // Bubbles
  data.forEach((d) => {
    const bx = chartX + ((d.x - xMin) / xRange) * chartW;
    const by = chartY + chartH - ((d.y - yMin) / yRange) * chartH;
    const radius = Math.max(2, Math.min(5, Math.sqrt(d.size) * 0.4));
    // Use slightly lighter color for transparency effect
    const [cr, cg, cb] = d.color;
    doc.setFillColor(
      Math.min(255, cr + 60),
      Math.min(255, cg + 60),
      Math.min(255, cb + 60)
    );
    doc.circle(bx, by, radius, "F");
    // Border
    doc.setDrawColor(...d.color);
    doc.setLineWidth(0.4);
    doc.circle(bx, by, radius, "S");

    // Label
    doc.setFontSize(5);
    doc.setTextColor(60, 60, 60);
    const truncLabel = d.label.length > 12 ? d.label.substring(0, 10) + "…" : d.label;
    doc.text(truncLabel, bx, by - radius - 1.5, { align: "center" });
  });

  return chartY + chartH + 24;
}

// ─── New page helper ───────────────────────────────────────

function newPage(doc: jsPDF, dateStr: string): number {
  doc.addPage();
  drawHeader(doc, dateStr);
  return 28;
}

// ─── Main Builder ──────────────────────────────────────────

export async function buildAnalyticsPdf(
  tab: string,
  groupBy: GroupBy = "unidade",
  scoreConfig?: any
): Promise<{ url: string; fileName: string }> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const now = new Date();
  const dateStr = `${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

  const tabLabels: Record<string, string> = {
    qualidade: "Qualidade do Ponto",
    absenteismo: "Absenteísmo",
    movimentacoes: "Movimentações",
    coberturas: "Coberturas e Continuidade",
    violacoes: "Violações Trabalhistas",
    bancoHoras: "Banco de Horas",
    operacoes: "Operações e Estruturas",
  };
  const tabName = tabLabels[tab] || tab;

  // ════════════════════════════════════════════════════════
  // PAGE 1: Header + KPIs + Ranking
  // ════════════════════════════════════════════════════════
  drawHeader(doc, dateStr);
  let y = 28;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 33, 33);
  doc.text(`Relatório: ${tabName}`, MARGIN, y);
  y += 3;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`Agrupamento: ${groupByLabel[groupBy]}`, MARGIN, y + 4);
  y += 10;

  if (tab === "qualidade") {
    const kpiData = getQualidadeKpiSummary(null, groupBy, scoreConfig);

    y = drawSubTitle(doc, "Indicadores Principais", y);
    y = drawKpiCards(doc, [
      { label: "Score Composto", value: String(kpiData.score) },
      { label: "Qualidade", value: `${kpiData.qualidadePct}%` },
      { label: "Tempo Médio", value: `${kpiData.tempoMedioDias} dias` },
      { label: "Até 1 Dia", value: `${kpiData.ate1DiaPct}%` },
      { label: "+15 Dias", value: `${kpiData.mais15DiaPct}%` },
    ], y);

    y = drawKpiCards(doc, [
      { label: "Registradas", value: kpiData.registradas },
      { label: "Justificadas", value: kpiData.justificadas },
      { label: "Melhor Operação", value: `${kpiData.melhorOperacao.nome} (${kpiData.melhorOperacao.score})` },
      { label: "Maior Risco", value: `${kpiData.maiorRisco.nome} (${kpiData.maiorRisco.score})` },
    ], y);

    // Ranking
    y = drawSectionTitle(doc, `Ranking por ${groupByLabel[groupBy]}`, y);
    const sidebarItems = getSidebarItems(groupBy, scoreConfig);
    y = drawTable(doc, [groupByLabel[groupBy], "Score"], sidebarItems.map(i => [i.nome, String(i.score)]), y);

    // ════════════════════════════════════════════════════
    // PAGE 2: Evolução da Qualidade — GRÁFICO + TABELA
    // ════════════════════════════════════════════════════
    y = newPage(doc, dateStr);
    y = drawSectionTitle(doc, "Evolução da Qualidade (Mensal)", y);

    const evolData = aggregateQualidadeEvolucao(null, groupBy);
    const evolDetalhado = aggregateQualidadeEvolucaoDetalhado(null, groupBy);

    // Build line chart data
    const lineChartData = evolDetalhado.map((d, i) => {
      const total = d.registradas + d.justificadas;
      const qualPct = total > 0 ? parseFloat(((d.registradas / total) * 100).toFixed(1)) : 0;
      return {
        label: d.mes,
        series: [
          { name: "Registradas", value: d.registradas, color: CHART_COLORS.primary },
          { name: "Justificadas", value: d.justificadas, color: CHART_COLORS.secondary },
        ],
      };
    });
    y = drawLineChart(doc, lineChartData, y, 60);

    // Quality % line as separate mini chart
    y += 4;
    const qualLineData = evolDetalhado.map(d => {
      const total = d.registradas + d.justificadas;
      const qualPct = total > 0 ? parseFloat(((d.registradas / total) * 100).toFixed(1)) : 0;
      return {
        label: d.mes,
        series: [{ name: "Qualidade %", value: qualPct, color: CHART_COLORS.green }],
      };
    });
    y = drawLineChart(doc, qualLineData, y, 40);

    y += 2;
    // Table below
    const evolHeaders = ["Competência", "Registradas", "Justificadas", "Total", "Qualidade %"];
    const evolRows = evolDetalhado.map(d => {
      const total = d.registradas + d.justificadas;
      const qual = total > 0 ? ((d.registradas / total) * 100).toFixed(1) : "0.0";
      return [d.mes, fmtNum(d.registradas), fmtNum(d.justificadas), fmtNum(total), `${qual}%`];
    });
    y = drawTable(doc, evolHeaders, evolRows, y);

    // ════════════════════════════════════════════════════
    // PAGE 3: Composição Tempo Tratativa — GRÁFICO + TABELA
    // ════════════════════════════════════════════════════
    y = newPage(doc, dateStr);
    y = drawSectionTitle(doc, "Composição do Tempo de Tratativa (Mensal)", y);

    const faixas = aggregateComposicaoFaixas(null, groupBy);
    const stackedData = faixas.map(d => ({
      label: d.mes,
      segments: [
        { name: "Até 1d", value: d.ate1d, color: CHART_COLORS.green },
        { name: "1-3d", value: d.de1a3d, color: CHART_COLORS.teal },
        { name: "3-7d", value: d.de3a7d, color: CHART_COLORS.yellow },
        { name: "7-15d", value: d.de7a15d, color: CHART_COLORS.primary },
        { name: "+15d", value: d.mais15d, color: CHART_COLORS.red },
      ],
    }));
    y = drawStackedBarChart(doc, stackedData, y, 65);

    y += 2;
    const faixaHeaders = ["Competência", "Até 1d", "1-3d", "3-7d", "7-15d", "+15d", "Total"];
    const faixaRows = faixas.map(d => [
      d.mes, fmtNum(d.ate1d), fmtNum(d.de1a3d), fmtNum(d.de3a7d),
      fmtNum(d.de7a15d), fmtNum(d.mais15d), fmtNum(d.total),
    ]);
    y = drawTable(doc, faixaHeaders, faixaRows, y);

    // ════════════════════════════════════════════════════
    // PAGE 4: Qualidade vs Volume — SCATTER + TABELA
    // ════════════════════════════════════════════════════
    y = newPage(doc, dateStr);
    y = drawSectionTitle(doc, `Dispersão: Qualidade vs Volume por ${groupByLabel[groupBy]}`, y);

    const scatterQual = aggregateQualidadeVolume(null, groupBy);
    const scatterData = scatterQual.map(d => ({
      label: d.regional,
      x: d.volume,
      y: d.qualidade,
      size: d.headcount,
      color: d.qualidade >= 85 ? CHART_COLORS.green : d.qualidade >= 70 ? CHART_COLORS.yellow : CHART_COLORS.red,
    }));
    y = drawScatterChart(doc, scatterData, y, 70, "Volume de Marcações", "Qualidade %");

    y += 2;
    const sqHeaders = [groupByLabel[groupBy], "Volume", "Qualidade %", "Headcount"];
    const sqRows = scatterQual
      .sort((a, b) => b.qualidade - a.qualidade)
      .map(d => [d.regional, fmtNum(d.volume), `${d.qualidade}%`, String(d.headcount)]);
    y = drawTable(doc, sqHeaders, sqRows, y);

    // ════════════════════════════════════════════════════
    // PAGE 5: Tratativa vs Volume — SCATTER + TABELA
    // ════════════════════════════════════════════════════
    y = newPage(doc, dateStr);
    y = drawSectionTitle(doc, `Dispersão: Tempo Tratativa vs Volume por ${groupByLabel[groupBy]}`, y);

    const scatterTrat = aggregateAjustes(null, groupBy);
    const scatterTratData = scatterTrat.map(d => ({
      label: d.regional,
      x: d.volume,
      y: d.dias,
      size: d.headcount,
      color: d.dias <= 4 ? CHART_COLORS.green : d.dias <= 7 ? CHART_COLORS.yellow : CHART_COLORS.red,
    }));
    y = drawScatterChart(doc, scatterTratData, y, 70, "Volume de Marcações", "Tempo Médio (dias)");

    y += 2;
    const stHeaders = [groupByLabel[groupBy], "Volume", "Tempo Médio (dias)", "Headcount"];
    const stRows = scatterTrat
      .sort((a, b) => a.dias - b.dias)
      .map(d => [d.regional, fmtNum(d.volume), `${d.dias}`, String(d.headcount)]);
    y = drawTable(doc, stHeaders, stRows, y);

    // ════════════════════════════════════════════════════
    // PAGE 6: Detalhe por entidade + Análise
    // ════════════════════════════════════════════════════
    y = newPage(doc, dateStr);
    y = drawSectionTitle(doc, `Detalhe Mensal por ${groupByLabel[groupBy]}`, y);
    const entities = getSidebarItems(groupBy, scoreConfig);

    for (const entity of entities) {
      if (y > doc.internal.pageSize.getHeight() - 50) {
        y = newPage(doc, dateStr);
      }
      y = drawSubTitle(doc, `${entity.nome} — Score: ${entity.score}`, y);
      const entEvo = aggregateQualidadeEvolucaoDetalhado(entity.nome, groupBy);
      const entRows = entEvo.map(d => {
        const total = d.registradas + d.justificadas;
        const qual = total > 0 ? ((d.registradas / total) * 100).toFixed(1) : "0.0";
        return [d.mes, fmtNum(d.registradas), fmtNum(d.justificadas), `${qual}%`];
      });
      y = drawTable(doc, ["Mês", "Registradas", "Justificadas", "Qualidade %"], entRows, y);
      y += 2;
    }

    // Analysis
    if (y > doc.internal.pageSize.getHeight() - 60) {
      y = newPage(doc, dateStr);
    }
    y = drawSectionTitle(doc, "Análise Resumida", y);
    const best = entities[0];
    const worst = entities[entities.length - 1];
    y = drawSummaryBox(doc, [
      `${best?.nome} lidera com score ${best?.score}, demonstrando maturidade operacional.`,
      `${worst?.nome} apresenta score ${worst?.score} — ${worst && worst.score < 70 ? "ação corretiva necessária" : "ponto de atenção"}.`,
      `Qualidade geral: ${kpiData.qualidadePct}% das marcações registradas corretamente.`,
      `Tempo médio de tratativa: ${kpiData.tempoMedioDias} dias. ${kpiData.ate1DiaPct}% resolvidas em até 1 dia.`,
      `${kpiData.mais15DiaPct}% dos ajustes levam mais de 15 dias — oportunidade de melhoria significativa.`,
      `Total de ${kpiData.registradas} marcações registradas e ${kpiData.justificadas} justificadas no período.`,
    ], y);

  } else {
    // Generic fallback for other tabs
    y = drawSubTitle(doc, "Indicadores Principais", y);
    y = drawKpiCards(doc, getGenericKpis(tab), y);
    y = drawSectionTitle(doc, "Dados Consolidados", y);
    const tableData = getGenericTable(tab);
    y = drawTable(doc, tableData.headers, tableData.rows, y);
    y += 4;
    y = drawSectionTitle(doc, "Análise Resumida", y);
    y = drawSummaryBox(doc, getGenericSummary(tab), y);
  }

  // Add footers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, p, totalPages);
  }

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const fileName = `analytics-${tab}-${groupBy}-${now.toISOString().slice(0, 10)}.pdf`;
  return { url, fileName };
}

// ─── Fallback data for non-qualidade tabs ──────────────────

function getGenericKpis(tab: string): { label: string; value: string }[] {
  switch (tab) {
    case "absenteismo":
      return [
        { label: "Taxa Absenteísmo", value: "4,2%" },
        { label: "Horas Ausência", value: "12.480" },
        { label: "Cobertura", value: "91,3%" },
        { label: "Turnover Anual", value: "22,8%" },
      ];
    case "movimentacoes":
      return [
        { label: "Admissões", value: "156" },
        { label: "Demissões", value: "89" },
        { label: "Saldo", value: "+67" },
        { label: "Turnover", value: "3,8%" },
      ];
    case "coberturas":
      return [
        { label: "Taxa Cobertura", value: "91,3%" },
        { label: "Horas Descobertas", value: "2.400" },
        { label: "Coberturas Lançadas", value: "8.920" },
        { label: "Ausências", value: "12.480" },
      ];
    case "bancoHoras":
      return [
        { label: "Saldo Banco (h)", value: "4.320" },
        { label: "Crédito Mês", value: "1.280" },
        { label: "Débito Mês", value: "890" },
        { label: "A Vencer 60d", value: "1.650" },
      ];
    default:
      return [
        { label: "Indicador 1", value: "85%" },
        { label: "Indicador 2", value: "1.240" },
        { label: "Indicador 3", value: "92%" },
        { label: "Indicador 4", value: "340" },
      ];
  }
}

function getGenericTable(tab: string): { headers: string[]; rows: string[][] } {
  switch (tab) {
    case "absenteismo":
      return {
        headers: ["Operação", "Taxa %", "Horas Ausência", "Cobertura %", "Turnover %"],
        rows: [
          ["TERCEIRIZACAO", "6,8%", "3.200", "82%", "38,4%"],
          ["SEGURANCA PATRIMONIAL", "3,5%", "1.800", "95%", "18,0%"],
          ["PORTARIA E LIMPEZA", "3,2%", "7.480", "93%", "15,6%"],
        ],
      };
    case "movimentacoes":
      return {
        headers: ["Operação", "Admissões", "Demissões", "Saldo", "Turnover %"],
        rows: [
          ["PORTARIA E LIMPEZA", "110", "42", "+68", "2,1%"],
          ["SEGURANCA PATRIMONIAL", "25", "18", "+7", "3,2%"],
          ["TERCEIRIZACAO", "21", "29", "-8", "6,2%"],
        ],
      };
    case "coberturas":
      return {
        headers: ["Operação", "Ausências", "Coberturas", "Taxa %", "Horas Descobertas"],
        rows: [
          ["PORTARIA E LIMPEZA", "8.200", "7.560", "92,2%", "640"],
          ["SEGURANCA PATRIMONIAL", "1.800", "1.710", "95,0%", "90"],
          ["TERCEIRIZACAO", "2.480", "1.650", "66,5%", "830"],
        ],
      };
    case "bancoHoras":
      return {
        headers: ["Operação", "Saldo (h)", "Crédito", "Débito", "A Vencer"],
        rows: [
          ["PORTARIA E LIMPEZA", "3.120", "920", "640", "1.180"],
          ["SEGURANCA PATRIMONIAL", "620", "180", "120", "240"],
          ["TERCEIRIZACAO", "580", "180", "130", "230"],
        ],
      };
    default:
      return {
        headers: ["Item", "Valor A", "Valor B", "Variação"],
        rows: [
          ["Item 1", "1.200", "1.350", "+12,5%"],
          ["Item 2", "890", "920", "+3,4%"],
          ["Item 3", "2.100", "1.980", "-5,7%"],
        ],
      };
  }
}

function getGenericSummary(tab: string): string[] {
  switch (tab) {
    case "absenteismo":
      return [
        "Taxa de absenteísmo geral em 4,2%, dentro da meta de 5%.",
        "TERCEIRIZACAO com taxa crítica de 6,8% — atenção especial necessária.",
        "Cobertura média de 91,3%, com oportunidade de melhoria na operação TER.",
      ];
    case "movimentacoes":
      return [
        "Saldo positivo de +67 colaboradores no período.",
        "PORTARIA E LIMPEZA concentra 70% das admissões.",
        "TERCEIRIZACAO com saldo negativo — monitorar retenção.",
      ];
    case "coberturas":
      return [
        "Taxa de cobertura geral de 91,3%.",
        "2.400 horas descobertas representam oportunidade de otimização.",
        "TERCEIRIZACAO com apenas 66,5% de cobertura — risco operacional.",
      ];
    default:
      return [
        "Indicadores dentro dos parâmetros esperados.",
        "Monitoramento contínuo recomendado para operações críticas.",
      ];
  }
}
