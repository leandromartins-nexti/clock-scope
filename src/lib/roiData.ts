/* ── ROI Realizado – Data Layer ── */

export type ConfidenceLevel = "comprovado" | "hibrido" | "referencial" | "potencial";
export type CostMaturity = 1 | 2 | 3;
export type DriverStatus = "ativo" | "inativo";
export type OportunidadeCategoria = "quick_win" | "dependente_dados" | "dependente_operacional" | "dependente_modulo";

export interface ROIDriver {
  id: string;
  nome: string;
  categoria: "monetario" | "intangivel";
  moduloNexti: string;
  unidadeMedida: string;
  status: DriverStatus;
  baseline: number;
  atual: number;
  delta: number;
  custoUnitario: number;
  ganhoBruto: number;
  confianca: ConfidenceLevel;
  fonteBaseline: string;
  fonteAtual: string;
  janelaBaseline: string;
  hierarquiaBaseline: "historico_real" | "media_janela" | "benchmark_interno" | "base_case";
  tendencia: number;
  fatorReducao: number;
  formulaResumo: string;
  observacaoMetodologica: string;
}

export interface ROIOwnership {
  custoContrato: number;
  custosAdicionais: number;
  custosReduzidos: number;
  ownershipTotal: number;
}

export interface ROIOperacao {
  nome: string;
  tipo: "regional" | "contrato" | "unidade";
  economiaBruta: number;
  ownershipAtribuido: number;
  economiaLiquida: number;
  roiTotal: number;
  driversPrincipais: string[];
  pctComprovado: number;
  tendencia: number;
  scoreCaptura: number;
  colaboradores: number;
}

export interface ROITrendPoint {
  mes: string;
  roiTotal: number;
  economiaBruta: number;
  economiaLiquida: number;
  economiaAcumulada: number;
  pctComprovado: number;
  valorComprovado: number;
  valorReferencial: number;
}

export interface PremissasROI {
  colaboradores: number;
  salarioMedio: number;
  encargos: number;
  beneficios: number;
  multiplicadorHE: number;
  adicionalNoturno: number;
  custoHoraAdmin: number;
  custoMedioDisputa: number;
  custoUnitarioDoc: number;
  turnover: number;
  genteReceita: number;
  custoUnitarioNexti: number;
}

/* ── Mock Data – Base: 8.000 colaboradores (Orsegups) ── */
/* Período: abr/2025 a mar/2026 — cenário conservador e realista */

export const premissas: PremissasROI = {
  colaboradores: 8000,
  salarioMedio: 2200,
  encargos: 2.0,
  beneficios: 650,
  multiplicadorHE: 1.5,
  adicionalNoturno: 0.2,
  custoHoraAdmin: 42,
  custoMedioDisputa: 18000,
  custoUnitarioDoc: 5.8,
  turnover: 0.025,
  genteReceita: 0.12,
  custoUnitarioNexti: 10.0,
};

export const ownership: ROIOwnership = {
  custoContrato: 130000,
  custosAdicionais: 0,
  custosReduzidos: 0,
  ownershipTotal: 1560000,
};

/*
 * Distribuição de ganhos anual (~R$6,5M bruto):
 * HE: ~22% (R$1.430k) | Custo Op: ~16% (R$1.040k) | Quadro: ~19% (R$1.235k)
 * Disputas: ~15% (R$975k) | Horas Prod: ~8% (R$520k) | Adicional Not: ~6% (R$390k)
 * Descontos: ~5% (R$310k) | Fechamento: ~4% (R$275k) | Papel: ~3% (R$210k)
 * Pagamento Benefícios: EXCLUÍDO (dados não disponíveis)
 */

export const drivers: ROIDriver[] = [
  {
    id: "d1", nome: "Redução de Papel", categoria: "monetario", moduloNexti: "Documentos Digitais",
    unidadeMedida: "documentos", status: "ativo",
    baseline: 8400, atual: 4780, delta: -3620, custoUnitario: 5.8, ganhoBruto: 210000,
    confianca: "comprovado", fonteBaseline: "Histórico real do cliente (12 meses pré-ativação)", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Abr/2024 – Mar/2025", hierarquiaBaseline: "historico_real",
    tendencia: -6.5, fatorReducao: 25,
    formulaResumo: "ganho = (baseline - atual) × custo unitário por documento",
    observacaoMetodologica: "Volume de documentos físicos eliminados após digitalização. Custo unitário inclui impressão, armazenamento e manuseio.",
  },
  {
    id: "d2", nome: "Redução de Horas Extras", categoria: "monetario", moduloNexti: "Gestão de Jornada",
    unidadeMedida: "horas", status: "ativo",
    baseline: 96000, atual: 31200, delta: -64800, custoUnitario: 22.0, ganhoBruto: 1430000,
    confianca: "comprovado", fonteBaseline: "Folha de pagamento (12 meses)", fonteAtual: "Dados reais de jornada",
    janelaBaseline: "Abr/2024 – Mar/2025", hierarquiaBaseline: "historico_real",
    tendencia: -8.2, fatorReducao: 15,
    formulaResumo: "ganho = (horas extras baseline - horas extras atuais) × custo médio hora extra",
    observacaoMetodologica: "Custo hora extra = salário médio / 220 × multiplicador HE × encargos. Dados comprovados por folha de pagamento.",
  },
  {
    id: "d3", nome: "Redução de Adicional Noturno", categoria: "monetario", moduloNexti: "Gestão de Jornada",
    unidadeMedida: "horas", status: "ativo",
    baseline: 156000, atual: 112300, delta: -43700, custoUnitario: 8.93, ganhoBruto: 390000,
    confianca: "hibrido", fonteBaseline: "Folha de pagamento (6 meses) + estimativa", fonteAtual: "Dados reais de jornada",
    janelaBaseline: "Out/2024 – Mar/2025", hierarquiaBaseline: "media_janela",
    tendencia: -4.1, fatorReducao: 25,
    formulaResumo: "ganho = (horas noturnas baseline - horas noturnas atuais) × adicional noturno por hora",
    observacaoMetodologica: "Baseline parcial de 6 meses extrapolado. Classificação híbrida por limitação da janela de referência.",
  },
  {
    id: "d4", nome: "Redução de Custo Operacional", categoria: "monetario", moduloNexti: "Automação Operacional",
    unidadeMedida: "R$", status: "ativo",
    baseline: 2480000, atual: 1440000, delta: -1040000, custoUnitario: 1, ganhoBruto: 1040000,
    confianca: "comprovado", fonteBaseline: "Financeiro do cliente", fonteAtual: "Dados reais do financeiro",
    janelaBaseline: "Abr/2024 – Mar/2025", hierarquiaBaseline: "historico_real",
    tendencia: -5.8, fatorReducao: 100,
    formulaResumo: "ganho = custo operacional baseline - custo operacional atual",
    observacaoMetodologica: "Inclui custos de processos manuais eliminados com automação. Dados validados pelo financeiro do cliente.",
  },
  {
    id: "d5", nome: "Aumento em Descontos de Atrasos e Faltas", categoria: "monetario", moduloNexti: "Controle de Ponto",
    unidadeMedida: "R$", status: "ativo",
    baseline: 180000, atual: 490000, delta: 310000, custoUnitario: 1, ganhoBruto: 310000,
    confianca: "hibrido", fonteBaseline: "Estimativa baseada em amostra de folha", fonteAtual: "Dados reais de desconto",
    janelaBaseline: "Estimativa com amostra", hierarquiaBaseline: "benchmark_interno",
    tendencia: 6.2, fatorReducao: 15,
    formulaResumo: "ganho = descontos atuais - descontos baseline",
    observacaoMetodologica: "Baseline estimado por amostra de folha. Delta positivo indica aumento de descontos aplicados corretamente.",
  },
  {
    id: "d6", nome: "Redução Tempo para Fechamento", categoria: "monetario", moduloNexti: "Fechamento Digital",
    unidadeMedida: "horas", status: "ativo",
    baseline: 480, atual: 125, delta: -355, custoUnitario: 42, ganhoBruto: 275000,
    confianca: "comprovado", fonteBaseline: "Levantamento de processo do cliente", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Mapeamento pré-implantação", hierarquiaBaseline: "historico_real",
    tendencia: -12.0, fatorReducao: 50,
    formulaResumo: "ganho = (horas fechamento baseline - horas fechamento atuais) × custo hora admin",
    observacaoMetodologica: "Tempo anual de fechamento de folha. Custo hora admin informado pelo cliente.",
  },
  {
    id: "d7", nome: "Redução de Disputas Trabalhistas", categoria: "monetario", moduloNexti: "Compliance Trabalhista",
    unidadeMedida: "R$", status: "ativo",
    baseline: 2800000, atual: 1825000, delta: -975000, custoUnitario: 1, ganhoBruto: 975000,
    confianca: "referencial", fonteBaseline: "Base Case Nexti (benchmark setor)", fonteAtual: "Estimativa baseada em benchmark",
    janelaBaseline: "Base Case padrão", hierarquiaBaseline: "base_case",
    tendencia: -2.8, fatorReducao: 15,
    formulaResumo: "ganho = valor estimado de redução de passivo trabalhista",
    observacaoMetodologica: "Valor referencial baseado em benchmarks do setor de segurança patrimonial. Não possui validação direta com dados reais do cliente.",
  },
  {
    id: "d8", nome: "Pagamento de Benefícios", categoria: "monetario", moduloNexti: "Gestão de Benefícios",
    unidadeMedida: "R$", status: "inativo",
    baseline: 0, atual: 0, delta: 0, custoUnitario: 1, ganhoBruto: 0,
    confianca: "potencial", fonteBaseline: "Dados não disponíveis", fonteAtual: "Não mensurado",
    janelaBaseline: "N/A", hierarquiaBaseline: "base_case",
    tendencia: 0, fatorReducao: 0,
    formulaResumo: "Não mensurado — cliente não possui integração de dados de benefícios",
    observacaoMetodologica: "Oportunidade futura condicionada à integração de dados de benefícios. Fora do cálculo de ROI realizado.",
  },
  {
    id: "d9", nome: "Otimização de Quadro de Lotação", categoria: "monetario", moduloNexti: "Dimensionamento",
    unidadeMedida: "colaboradores", status: "ativo",
    baseline: 8000, atual: 7810, delta: -190, custoUnitario: 6500, ganhoBruto: 1235000,
    confianca: "referencial", fonteBaseline: "Base Case Nexti", fonteAtual: "Estimativa por benchmark",
    janelaBaseline: "Base Case padrão", hierarquiaBaseline: "base_case",
    tendencia: -1.2, fatorReducao: 100,
    formulaResumo: "ganho = colaboradores reduzidos × custo médio por colaborador (salário + encargos + benefícios)",
    observacaoMetodologica: "Valor referencial. Depende de validação com dados reais de dimensionamento do cliente.",
  },
  {
    id: "d10", nome: "Horas Produtivas Não Faturadas", categoria: "monetario", moduloNexti: "Produtividade",
    unidadeMedida: "horas", status: "ativo",
    baseline: 0, atual: 41600, delta: 41600, custoUnitario: 12.5, ganhoBruto: 520000,
    confianca: "referencial", fonteBaseline: "Base Case Nexti", fonteAtual: "Estimativa por benchmark",
    janelaBaseline: "Base Case padrão", hierarquiaBaseline: "base_case",
    tendencia: 3.5, fatorReducao: 100,
    formulaResumo: "ganho = horas produtivas identificadas × valor unitário da hora",
    observacaoMetodologica: "Valor referencial baseado em estimativa de horas produtivas não capturadas antes da solução.",
  },
  /* ── Intangíveis ── */
  {
    id: "d11", nome: "Redução do Tempo de Atendimento", categoria: "intangivel", moduloNexti: "RH Digital",
    unidadeMedida: "minutos", status: "ativo",
    baseline: 45, atual: 14, delta: -31, custoUnitario: 0, ganhoBruto: 0,
    confianca: "comprovado", fonteBaseline: "Pesquisa interna do cliente", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Pesquisa pré-implantação", hierarquiaBaseline: "historico_real",
    tendencia: -12.0, fatorReducao: 0,
    formulaResumo: "Tempo médio de atendimento antes vs depois (não monetizado)",
    observacaoMetodologica: "Ganho intangível. Contribui para satisfação do colaborador e eficiência de RH.",
  },
  {
    id: "d12", nome: "Melhoria de SLA Interno", categoria: "intangivel", moduloNexti: "Operações",
    unidadeMedida: "%", status: "ativo",
    baseline: 72, atual: 91, delta: 19, custoUnitario: 0, ganhoBruto: 0,
    confianca: "hibrido", fonteBaseline: "Histórico do cliente", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Abr/2024 – Set/2024", hierarquiaBaseline: "media_janela",
    tendencia: 2.8, fatorReducao: 0,
    formulaResumo: "SLA interno antes vs depois (%)",
    observacaoMetodologica: "Ganho intangível. Melhoria de conformidade e governança operacional.",
  },
  {
    id: "d13", nome: "Ganho de Governança", categoria: "intangivel", moduloNexti: "Compliance",
    unidadeMedida: "nível", status: "ativo",
    baseline: 2, atual: 4, delta: 2, custoUnitario: 0, ganhoBruto: 0,
    confianca: "hibrido", fonteBaseline: "Avaliação interna", fonteAtual: "Avaliação pós-implantação",
    janelaBaseline: "Avaliação pré-implantação", hierarquiaBaseline: "benchmark_interno",
    tendencia: 8, fatorReducao: 0,
    formulaResumo: "Nível de maturidade de governança antes vs depois (escala 1-5)",
    observacaoMetodologica: "Avaliação qualitativa de maturidade de governança trabalhista.",
  },
  {
    id: "d14", nome: "Redução de Risco Reputacional", categoria: "intangivel", moduloNexti: "Compliance Trabalhista",
    unidadeMedida: "índice", status: "ativo",
    baseline: 7.5, atual: 3.8, delta: -3.7, custoUnitario: 0, ganhoBruto: 0,
    confianca: "referencial", fonteBaseline: "Base Case Nexti", fonteAtual: "Estimativa",
    janelaBaseline: "Base Case padrão", hierarquiaBaseline: "base_case",
    tendencia: -5.0, fatorReducao: 0,
    formulaResumo: "Índice de risco reputacional antes vs depois (escala 0-10)",
    observacaoMetodologica: "Ganho intangível baseado em redução de exposição trabalhista e passivos.",
  },
];

export const intangiveis = drivers.filter(d => d.categoria === "intangivel");

/*
 * Operações — ROI entre 1.2x e 6x, score entre 48 e 88
 * Ownership por colaborador/mês = R$16,25 → anual = R$195,00
 */
export const operacoes: ROIOperacao[] = [
  {
    nome: "Regional Sul", tipo: "regional",
    economiaBruta: 1820000, ownershipAtribuido: 429000, economiaLiquida: 1391000, roiTotal: 4.2,
    driversPrincipais: ["Horas Extras", "Custo Operacional"], pctComprovado: 58, tendencia: 5.2, scoreCaptura: 78, colaboradores: 2200,
  },
  {
    nome: "Regional Sudeste", tipo: "regional",
    economiaBruta: 2210000, ownershipAtribuido: 546000, economiaLiquida: 1664000, roiTotal: 4.0,
    driversPrincipais: ["Quadro Lotação", "Horas Extras"], pctComprovado: 48, tendencia: 3.8, scoreCaptura: 68, colaboradores: 2800,
  },
  {
    nome: "Regional Nordeste", tipo: "regional",
    economiaBruta: 1350000, ownershipAtribuido: 292500, economiaLiquida: 1057500, roiTotal: 4.6,
    driversPrincipais: ["Custo Operacional", "Papel"], pctComprovado: 65, tendencia: 7.1, scoreCaptura: 82, colaboradores: 1500,
  },
  {
    nome: "Regional Centro-Oeste", tipo: "regional",
    economiaBruta: 820000, ownershipAtribuido: 292500, economiaLiquida: 527500, roiTotal: 2.8,
    driversPrincipais: ["Horas Extras", "Fechamento"], pctComprovado: 38, tendencia: -1.5, scoreCaptura: 52, colaboradores: 1500,
  },
  {
    nome: "Contrato A – Logística", tipo: "contrato",
    economiaBruta: 1480000, ownershipAtribuido: 234000, economiaLiquida: 1246000, roiTotal: 6.3,
    driversPrincipais: ["Horas Extras", "Quadro Lotação"], pctComprovado: 55, tendencia: 4.5, scoreCaptura: 74, colaboradores: 1200,
  },
  {
    nome: "Contrato B – Segurança", tipo: "contrato",
    economiaBruta: 980000, ownershipAtribuido: 185250, economiaLiquida: 794750, roiTotal: 5.3,
    driversPrincipais: ["Horas Extras", "Adicional Noturno"], pctComprovado: 72, tendencia: 3.2, scoreCaptura: 85, colaboradores: 950,
  },
  {
    nome: "Contrato C – Facilities", tipo: "contrato",
    economiaBruta: 520000, ownershipAtribuido: 165750, economiaLiquida: 354250, roiTotal: 3.1,
    driversPrincipais: ["Papel", "Custo Operacional"], pctComprovado: 35, tendencia: -3.2, scoreCaptura: 48, colaboradores: 850,
  },
  {
    nome: "Unidade São Paulo", tipo: "unidade",
    economiaBruta: 2680000, ownershipAtribuido: 624000, economiaLiquida: 2056000, roiTotal: 4.3,
    driversPrincipais: ["Horas Extras", "Custo Operacional"], pctComprovado: 52, tendencia: 4.8, scoreCaptura: 72, colaboradores: 3200,
  },
];

/* ── Série temporal abr/2025 – mar/2026 ── */

export const mesesROI = ["Abr/25", "Mai/25", "Jun/25", "Jul/25", "Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25", "Jan/26", "Fev/26", "Mar/26"];

/* Economia mensal com crescimento suave */
const economiaMensal = [370000, 400000, 450000, 490000, 530000, 550000, 570000, 590000, 620000, 640000, 660000, 700000];
/* % comprovado evoluindo gradualmente */
const pctComprovadoMensal = [18, 20, 24, 27, 30, 34, 37, 40, 45, 48, 50, 52];
const ownershipMensal = 130000;

export const trendROI: ROITrendPoint[] = mesesROI.map((mes, i) => {
  const bruta = economiaMensal[i];
  const liquida = bruta - ownershipMensal;
  const acumulada = economiaMensal.slice(0, i + 1).reduce((s, v) => s + v, 0);
  const pctComp = pctComprovadoMensal[i];
  return {
    mes,
    roiTotal: +(bruta / ownershipMensal).toFixed(1),
    economiaBruta: bruta,
    economiaLiquida: liquida,
    economiaAcumulada: acumulada,
    pctComprovado: pctComp,
    valorComprovado: Math.round(bruta * pctComp / 100),
    valorReferencial: Math.round(bruta * (100 - pctComp) / 100),
  };
});

/* ── Helpers ── */

export function getDriversMonetarios() {
  return drivers.filter(d => d.categoria === "monetario" && d.status === "ativo");
}

export function getDriversIntangiveis() {
  return drivers.filter(d => d.categoria === "intangivel" && d.status === "ativo");
}

export function getEconomiaBruta() {
  return getDriversMonetarios().reduce((sum, d) => sum + d.ganhoBruto, 0);
}

export function getEconomiaLiquida() {
  return getEconomiaBruta() - ownership.ownershipTotal;
}

export function getROITotal() {
  return ownership.ownershipTotal > 0 ? getEconomiaBruta() / ownership.ownershipTotal : 0;
}

export function getPaybackMeses() {
  const economiaMensalMedia = getEconomiaBruta() / 12;
  const ownershipMensal = ownership.ownershipTotal / 12;
  return economiaMensalMedia > 0 ? ownershipMensal / (economiaMensalMedia - ownershipMensal) * 12 : Infinity;
}

export function getConfiancaBreakdown() {
  const monetarios = getDriversMonetarios();
  const total = monetarios.reduce((s, d) => s + d.ganhoBruto, 0);
  if (total === 0) return { comprovado: 0, hibrido: 0, referencial: 0, potencial: 0, "comprovadoR$": 0, "hibridoR$": 0, "referencialR$": 0 };
  const byLevel = (level: ConfidenceLevel) =>
    monetarios.filter(d => d.confianca === level).reduce((s, d) => s + d.ganhoBruto, 0);
  return {
    comprovado: +((byLevel("comprovado") / total) * 100).toFixed(1),
    hibrido: +((byLevel("hibrido") / total) * 100).toFixed(1),
    referencial: +((byLevel("referencial") / total) * 100).toFixed(1),
    potencial: 0,
    "comprovadoR$": byLevel("comprovado"),
    "hibridoR$": byLevel("hibrido"),
    "referencialR$": byLevel("referencial"),
  };
}

export function confidenceBadge(level: ConfidenceLevel) {
  switch (level) {
    case "comprovado": return { label: "Comprovado", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" };
    case "hibrido": return { label: "Híbrido", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-500" };
    case "referencial": return { label: "Referencial", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-400" };
    case "potencial": return { label: "Potencial", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" };
  }
}

export function capturaScoreClass(score: number) {
  if (score >= 80) return { label: "Captura Forte", color: "text-green-600", bg: "bg-green-50" };
  if (score >= 60) return { label: "Captura Moderada", color: "text-yellow-600", bg: "bg-yellow-50" };
  return { label: "Captura Fraca", color: "text-red-600", bg: "bg-red-50" };
}

export function hierarquiaBaselineLabel(h: ROIDriver["hierarquiaBaseline"]) {
  switch (h) {
    case "historico_real": return "Histórico real do cliente";
    case "media_janela": return "Média em janela anterior";
    case "benchmark_interno": return "Benchmark interno";
    case "base_case": return "Base Case Nexti";
  }
}

export function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function formatNumber(v: number) {
  return v.toLocaleString("pt-BR");
}

export function generateROIInsights() {
  const eco = getEconomiaBruta();
  const liq = getEconomiaLiquida();
  const conf = getConfiancaBreakdown();
  const monetarios = getDriversMonetarios();
  const topDriver = [...monetarios].sort((a, b) => b.ganhoBruto - a.ganhoBruto)[0];
  const top3 = [...monetarios].sort((a, b) => b.ganhoBruto - a.ganhoBruto).slice(0, 3).map(d => d.nome);

  return [
    { severity: "info" as const, text: `A Nexti gerou ${formatCurrency(liq)} de economia líquida anual no período abr/2025 – mar/2026, com ${conf.comprovado.toFixed(0)}% do valor sustentado por dados reais do cliente.` },
    { severity: "info" as const, text: `A captura de valor evoluiu ao longo dos 12 meses, com maior maturidade de comprovação no segundo semestre. O % comprovado saiu de 18% para 52%.` },
    { severity: "critical" as const, text: `Os principais drivers de valor foram ${top3.join(", ")}, que juntos representam ${((top3.reduce((s, n) => s + (monetarios.find(d => d.nome === n)?.ganhoBruto || 0), 0) / eco) * 100).toFixed(0)}% da economia bruta.` },
    { severity: "warning" as const, text: `${formatCurrency(conf["referencialR$"])} do valor total (${conf.referencial.toFixed(0)}%) ainda é referencial — oportunidade de comprovação com importação de dados reais.` },
    { severity: "info" as const, text: `O ROI anual de ${getROITotal().toFixed(1)}x é positivo e defensável frente ao ownership total de ${formatCurrency(ownership.ownershipTotal)}.` },
  ];
}
