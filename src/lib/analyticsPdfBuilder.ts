import { jsPDF } from "jspdf";
import {
  aggregateAjustes,
  aggregateComposicaoFaixas,
  aggregateQualidadeEvolucao,
  aggregateQualidadeEvolucaoDetalhado,
  aggregateQualidadeVolume,
  getQualidadeKpiSummary,
  getSidebarItems,
  formatMesLabel,
  ajustesMeses,
} from "@/lib/ajustesData";

type GroupBy = "empresa" | "unidade" | "area";

const ORANGE = [255, 87, 34] as const;
const HEADER_H = 18;
const MARGIN = 14;

const groupByLabel: Record<GroupBy, string> = {
  empresa: "Empresa",
  unidade: "Unidade de Negócio",
  area: "Área",
};

// ─── Helpers ───────────────────────────────────────────────

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("pt-BR");
}

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

  // Header row
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

  // Data rows
  doc.setFont("helvetica", "normal");
  rows.forEach((row, ri) => {
    // Page break check
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

  // Border
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.rect(MARGIN, y - rowH * (rows.length + 1), tableW, rowH * (rows.length + 1));

  return y + 4;
}

function truncateText(doc: jsPDF, text: string, maxWidth: number): string {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && doc.getTextWidth(truncated + "…") > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + "…";
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

  // Page break check
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

// ─── Main Builder ──────────────────────────────────────────

export async function buildAnalyticsPdf(
  tab: string,
  groupBy: GroupBy = "unidade",
  scoreConfig?: any
): Promise<{ url: string; fileName: string }> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
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

  // We'll build all pages, then go back and add footers
  const pages: number[] = [];

  // ════════════════════════════════════════════════════
  // PAGE 1: Header + KPIs + Ranking
  // ════════════════════════════════════════════════════
  drawHeader(doc, dateStr);
  pages.push(1);

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
    // Get real KPI data
    const kpiData = getQualidadeKpiSummary(null, groupBy, scoreConfig);
    
    y = drawSubTitle(doc, "Indicadores Principais", y);
    y = drawKpiCards(doc, [
      { label: "Score Composto", value: String(kpiData.score) },
      { label: "Qualidade", value: `${kpiData.qualidadePct}%` },
      { label: "Tempo Médio", value: `${kpiData.tempoMedioDias} dias` },
      { label: "Até 1 Dia", value: `${kpiData.ate1DiaPct}%` },
      { label: "+15 Dias", value: `${kpiData.mais15DiaPct}%` },
    ], y);

    // Second row KPIs
    y = drawKpiCards(doc, [
      { label: "Registradas", value: kpiData.registradas },
      { label: "Justificadas", value: kpiData.justificadas },
      { label: "Melhor Operação", value: `${kpiData.melhorOperacao.nome} (${kpiData.melhorOperacao.score})` },
      { label: "Maior Risco", value: `${kpiData.maiorRisco.nome} (${kpiData.maiorRisco.score})` },
    ], y);

    // ── Ranking por operação ──
    y = drawSectionTitle(doc, `Ranking por ${groupByLabel[groupBy]}`, y);
    const sidebarItems = getSidebarItems(groupBy, scoreConfig);
    const rankHeaders = [groupByLabel[groupBy], "Score"];
    const rankRows = sidebarItems.map(item => [item.nome, String(item.score)]);
    y = drawTable(doc, rankHeaders, rankRows, y);

    // ════════════════════════════════════════════════════
    // PAGE 2: Evolução + Composição Faixas
    // ════════════════════════════════════════════════════
    doc.addPage();
    drawHeader(doc, dateStr);
    pages.push(2);
    y = 28;

    y = drawSectionTitle(doc, "Evolução da Qualidade (Mensal)", y);
    const evolDetalhado = aggregateQualidadeEvolucaoDetalhado(null, groupBy);
    const evolHeaders = ["Competência", "Registradas", "Justificadas", "Total", "Qualidade %"];
    const evolRows = evolDetalhado.map(d => {
      const total = d.registradas + d.justificadas;
      const qual = total > 0 ? ((d.registradas / total) * 100).toFixed(1) : "0.0";
      return [d.mes, fmtNum(d.registradas), fmtNum(d.justificadas), fmtNum(total), `${qual}%`];
    });
    y = drawTable(doc, evolHeaders, evolRows, y);

    y += 4;
    y = drawSectionTitle(doc, "Composição do Tempo de Tratativa (Mensal)", y);
    const faixas = aggregateComposicaoFaixas(null, groupBy);
    const faixaHeaders = ["Competência", "Até 1d", "1-3d", "3-7d", "7-15d", "+15d", "Total"];
    const faixaRows = faixas.map(d => [
      d.mes,
      fmtNum(d.ate1d),
      fmtNum(d.de1a3d),
      fmtNum(d.de3a7d),
      fmtNum(d.de7a15d),
      fmtNum(d.mais15d),
      fmtNum(d.total),
    ]);
    y = drawTable(doc, faixaHeaders, faixaRows, y);

    // ════════════════════════════════════════════════════
    // PAGE 3: Scatter data tables + per-entity breakdown
    // ════════════════════════════════════════════════════
    doc.addPage();
    drawHeader(doc, dateStr);
    pages.push(3);
    y = 28;

    y = drawSectionTitle(doc, `Qualidade vs Volume por ${groupByLabel[groupBy]}`, y);
    const scatterQual = aggregateQualidadeVolume(null, groupBy);
    const sqHeaders = [groupByLabel[groupBy], "Volume Marcações", "Qualidade %", "Headcount"];
    const sqRows = scatterQual
      .sort((a, b) => b.qualidade - a.qualidade)
      .map(d => [d.regional, fmtNum(d.volume), `${d.qualidade}%`, String(d.headcount)]);
    y = drawTable(doc, sqHeaders, sqRows, y);

    y += 4;
    y = drawSectionTitle(doc, `Tempo de Tratativa vs Volume por ${groupByLabel[groupBy]}`, y);
    const scatterTrat = aggregateAjustes(null, groupBy);
    const stHeaders = [groupByLabel[groupBy], "Volume Marcações", "Tempo Médio (dias)", "Headcount"];
    const stRows = scatterTrat
      .sort((a, b) => a.dias - b.dias)
      .map(d => [d.regional, fmtNum(d.volume), `${d.dias}`, String(d.headcount)]);
    y = drawTable(doc, stHeaders, stRows, y);

    // ── Per-entity detail tables ──
    y += 4;
    y = drawSectionTitle(doc, `Detalhe Mensal por ${groupByLabel[groupBy]}`, y);
    const entities = getSidebarItems(groupBy, scoreConfig);
    for (const entity of entities) {
      if (y > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        drawHeader(doc, dateStr);
        pages.push(pages.length + 1);
        y = 28;
      }
      y = drawSubTitle(doc, `${entity.nome} — Score: ${entity.score}`, y);
      const entEvo = aggregateQualidadeEvolucaoDetalhado(entity.nome, groupBy);
      const entHeaders = ["Mês", "Registradas", "Justificadas", "Qualidade %"];
      const entRows = entEvo.map(d => {
        const total = d.registradas + d.justificadas;
        const qual = total > 0 ? ((d.registradas / total) * 100).toFixed(1) : "0.0";
        return [d.mes, fmtNum(d.registradas), fmtNum(d.justificadas), `${qual}%`];
      });
      y = drawTable(doc, entHeaders, entRows, y);
      y += 2;
    }

    // ════════════════════════════════════════════════════
    // LAST PAGE: Analysis
    // ════════════════════════════════════════════════════
    if (y > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      drawHeader(doc, dateStr);
      pages.push(pages.length + 1);
      y = 28;
    }
    y = drawSectionTitle(doc, "Análise Resumida", y);

    const bestEntity = entities[0];
    const worstEntity = entities[entities.length - 1];
    const summary = [
      `${bestEntity?.nome} lidera com score ${bestEntity?.score}, demonstrando maturidade operacional.`,
      `${worstEntity?.nome} apresenta score ${worstEntity?.score} — ${worstEntity && worstEntity.score < 70 ? "ação corretiva necessária" : "ponto de atenção"}.`,
      `Qualidade geral: ${kpiData.qualidadePct}% das marcações registradas corretamente.`,
      `Tempo médio de tratativa: ${kpiData.tempoMedioDias} dias. ${kpiData.ate1DiaPct}% resolvidas em até 1 dia.`,
      `${kpiData.mais15DiaPct}% dos ajustes levam mais de 15 dias — oportunidade de melhoria significativa.`,
      `Total de ${kpiData.registradas} marcações registradas e ${kpiData.justificadas} justificadas no período.`,
    ];
    y = drawSummaryBox(doc, summary, y);

  } else {
    // For other tabs, use simplified structure with available data
    y = drawSubTitle(doc, "Indicadores Principais", y);
    y = drawKpiCards(doc, getGenericKpis(tab), y);

    y = drawSectionTitle(doc, "Dados Consolidados", y);
    const tableData = getGenericTable(tab);
    y = drawTable(doc, tableData.headers, tableData.rows, y);

    y += 4;
    y = drawSectionTitle(doc, "Análise Resumida", y);
    y = drawSummaryBox(doc, getGenericSummary(tab), y);
  }

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, p, totalPages);
    // Re-draw header on pages that don't have it
    if (p > 1) {
      // header is already drawn during page creation
    }
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
        headers: ["Operação", "Taxa %", "Horas Ausência", "Cobertura %", "Turnover Anual %"],
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
        headers: ["Operação", "Indicador 1", "Indicador 2", "Status"],
        rows: [
          ["PORTARIA E LIMPEZA", "92%", "1.200", "Normal"],
          ["SEGURANCA PATRIMONIAL", "88%", "980", "Normal"],
          ["TERCEIRIZACAO", "68%", "420", "Risco"],
        ],
      };
  }
}

function getGenericSummary(tab: string): string[] {
  switch (tab) {
    case "absenteismo":
      return [
        "Taxa de absenteísmo geral em 4,2% — TERCEIRIZACAO lidera com 6,8%.",
        "Atestados médicos representam a principal causa (42%), seguidos por faltas (28%).",
        "Cobertura geral em 91,3% — 2.400h permanecem sem cobertura no período.",
        "Turnover anual consolidado de 22,8% — TERCEIRIZACAO apresenta 38,4%.",
      ];
    case "movimentacoes":
      return [
        "Saldo positivo de +67 no período, concentrado em PORTARIA E LIMPEZA (+68).",
        "TERCEIRIZACAO é a única operação com saldo negativo (-8).",
        "Turnover geral em 3,8%, com TERCEIRIZACAO em 6,2% (maior do grupo).",
        "156 admissões no período — PORTARIA E LIMPEZA concentrou 70% das entradas.",
      ];
    case "coberturas":
      return [
        "Taxa de cobertura geral em 91,3% — meta de 95% não atingida.",
        "TERCEIRIZACAO com menor taxa de cobertura: 66,5%.",
        "2.400 horas descobertas no período — impacto financeiro a ser calculado.",
        "SEGURANCA PATRIMONIAL mantém melhor performance com 95% de cobertura.",
      ];
    case "bancoHoras":
      return [
        "Saldo total do banco de horas: 4.320h positivas.",
        "1.650h a vencer nos próximos 60 dias — necessidade de planejamento.",
        "Crédito mensal de 1.280h contra débito de 890h — crescimento líquido.",
        "PORTARIA E LIMPEZA concentra 72% do saldo total.",
      ];
    default:
      return [
        "Indicadores dentro dos parâmetros esperados para o período.",
        "Recomenda-se atenção às operações com status 'Risco'.",
        "Análise detalhada disponível nas sub-abas do módulo operacional.",
      ];
  }
}
