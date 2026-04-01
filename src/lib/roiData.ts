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

/* ── Mock Data – Base: 8.000 colaboradores (Case 2 / Orsegups) ── */

export const premissas: PremissasROI = {
  colaboradores: 8000,
  salarioMedio: 2200,
  encargos: 2.0,
  beneficios: 650,
  multiplicadorHE: 1.5,
  adicionalNoturno: 0.2,
  custoHoraAdmin: 42,
  custoMedioDisputa: 1,
  custoUnitarioDoc: 5.8,
  turnover: 0.025,
  genteReceita: 0.12,
  custoUnitarioNexti: 7.48,
};

export const ownership: ROIOwnership = {
  custoContrato: 59840,
  custosAdicionais: 0,
  custosReduzidos: 0,
  ownershipTotal: 59840,
};

export const drivers: ROIDriver[] = [
  {
    id: "d1", nome: "Redução de Papel", categoria: "monetario", moduloNexti: "Documentos Digitais",
    unidadeMedida: "documentos", status: "ativo",
    baseline: 9600, atual: 1200, delta: -8400, custoUnitario: 5.8, ganhoBruto: 48720,
    confianca: "comprovado", fonteBaseline: "Histórico real do cliente (12 meses pré-ativação)", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Jan/2023 – Dez/2023", hierarquiaBaseline: "historico_real",
    tendencia: -8.2, fatorReducao: 25,
    formulaResumo: "ganho = (baseline - atual) × custo unitário por documento",
    observacaoMetodologica: "Volume de documentos físicos eliminados após digitalização. Custo unitário inclui impressão, armazenamento e manuseio.",
  },
  {
    id: "d2", nome: "Redução de Horas Extras", categoria: "monetario", moduloNexti: "Gestão de Jornada",
    unidadeMedida: "horas", status: "ativo",
    baseline: 36000, atual: 17280, delta: -18720, custoUnitario: 22.0, ganhoBruto: 411840,
    confianca: "comprovado", fonteBaseline: "Folha de pagamento (12 meses)", fonteAtual: "Dados reais de jornada",
    janelaBaseline: "Jan/2023 – Dez/2023", hierarquiaBaseline: "historico_real",
    tendencia: -12.5, fatorReducao: 15,
    formulaResumo: "ganho = (horas extras baseline - horas extras atuais) × custo médio hora extra",
    observacaoMetodologica: "Custo hora extra = salário médio / 220 × multiplicador HE × encargos.",
  },
  {
    id: "d3", nome: "Redução de Adicional Noturno", categoria: "monetario", moduloNexti: "Gestão de Jornada",
    unidadeMedida: "horas", status: "ativo",
    baseline: 84000, atual: 71400, delta: -12600, custoUnitario: 3.5, ganhoBruto: 44100,
    confianca: "hibrido", fonteBaseline: "Folha de pagamento (6 meses) + estimativa", fonteAtual: "Dados reais de jornada",
    janelaBaseline: "Jul/2023 – Dez/2023", hierarquiaBaseline: "media_janela",
    tendencia: -5.3, fatorReducao: 25,
    formulaResumo: "ganho = (horas noturnas baseline - horas noturnas atuais) × adicional noturno por hora",
    observacaoMetodologica: "Baseline parcial de 6 meses extrapolado. Classificação híbrida por limitação da janela de referência.",
  },
  {
    id: "d4", nome: "Redução de Custo Operacional", categoria: "monetario", moduloNexti: "Automação Operacional",
    unidadeMedida: "R$", status: "ativo",
    baseline: 192000, atual: 38400, delta: -153600, custoUnitario: 1, ganhoBruto: 153600,
    confianca: "comprovado", fonteBaseline: "Financeiro do cliente", fonteAtual: "Dados reais do financeiro",
    janelaBaseline: "Jan/2023 – Dez/2023", hierarquiaBaseline: "historico_real",
    tendencia: -15.0, fatorReducao: 100,
    formulaResumo: "ganho = custo operacional baseline - custo operacional atual",
    observacaoMetodologica: "Inclui custos de processos manuais eliminados com automação.",
  },
  {
    id: "d5", nome: "Aumento em Descontos de Atrasos e Faltas", categoria: "monetario", moduloNexti: "Controle de Ponto",
    unidadeMedida: "R$", status: "ativo",
    baseline: 8800, atual: 18400, delta: 9600, custoUnitario: 9.1, ganhoBruto: 87360,
    confianca: "hibrido", fonteBaseline: "Estimativa baseada em amostra", fonteAtual: "Dados reais de desconto",
    janelaBaseline: "Estimativa", hierarquiaBaseline: "benchmark_interno",
    tendencia: 8.4, fatorReducao: 15,
    formulaResumo: "ganho = (descontos atuais - descontos baseline) × fator de custo unitário",
    observacaoMetodologica: "Baseline estimado por amostra de folha. Delta positivo indica aumento de descontos aplicados corretamente.",
  },
  {
    id: "d6", nome: "Redução Tempo para Fechamento", categoria: "monetario", moduloNexti: "Fechamento Digital",
    unidadeMedida: "horas", status: "ativo",
    baseline: 576, atual: 10, delta: -566, custoUnitario: 42, ganhoBruto: 23772,
    confianca: "comprovado", fonteBaseline: "Levantamento de processo do cliente", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Mapeamento pré-implantação", hierarquiaBaseline: "historico_real",
    tendencia: -22.0, fatorReducao: 50,
    formulaResumo: "ganho = (horas fechamento baseline - horas fechamento atuais) × custo hora admin",
    observacaoMetodologica: "Tempo de fechamento de folha mensal. Custo hora admin informado pelo cliente.",
  },
  {
    id: "d7", nome: "Redução de Disputas Trabalhistas", categoria: "monetario", moduloNexti: "Compliance Trabalhista",
    unidadeMedida: "R$", status: "ativo",
    baseline: 3318516, atual: 98323, delta: -3220193, custoUnitario: 1, ganhoBruto: 3220193,
    confianca: "referencial", fonteBaseline: "Base Case Nexti (benchmark setor)", fonteAtual: "Estimativa baseada em benchmark",
    janelaBaseline: "Base Case padrão", hierarquiaBaseline: "base_case",
    tendencia: -3.1, fatorReducao: 15,
    formulaResumo: "ganho = valor estimado de redução de passivo trabalhista × fator de redução",
    observacaoMetodologica: "Valor referencial baseado em benchmarks do setor. Não possui validação direta com dados reais do cliente.",
  },
  {
    id: "d8", nome: "Pagamento de Benefícios", categoria: "monetario", moduloNexti: "Gestão de Benefícios",
    unidadeMedida: "R$", status: "ativo",
    baseline: 4800000, atual: 4608000, delta: -192000, custoUnitario: 1, ganhoBruto: 192000,
    confianca: "hibrido", fonteBaseline: "Financeiro do cliente", fonteAtual: "Estimativa parcial com dados reais",
    janelaBaseline: "Jan/2023 – Dez/2023", hierarquiaBaseline: "historico_real",
    tendencia: -2.1, fatorReducao: 100,
    formulaResumo: "ganho = economia com revisão de benefícios pagos indevidamente",
    observacaoMetodologica: "Baseline real, mas valor atual combina dados reais com estimativa de impacto parcial.",
  },
  {
    id: "d9", nome: "Otimização de Quadro de Lotação", categoria: "monetario", moduloNexti: "Dimensionamento",
    unidadeMedida: "colaboradores", status: "ativo",
    baseline: 8000, atual: 7800, delta: -200, custoUnitario: 6500, ganhoBruto: 1300000,
    confianca: "referencial", fonteBaseline: "Base Case Nexti", fonteAtual: "Estimativa por benchmark",
    janelaBaseline: "Base Case padrão", hierarquiaBaseline: "base_case",
    tendencia: -1.5, fatorReducao: 100,
    formulaResumo: "ganho = colaboradores reduzidos × custo médio por colaborador (salário + encargos + benefícios)",
    observacaoMetodologica: "Valor referencial. Depende de validação com dados reais de dimensionamento do cliente.",
  },
  {
    id: "d10", nome: "Horas Produtivas Não Faturadas", categoria: "monetario", moduloNexti: "Produtividade",
    unidadeMedida: "horas", status: "ativo",
    baseline: 0, atual: 184091, delta: 184091, custoUnitario: 1, ganhoBruto: 184091,
    confianca: "referencial", fonteBaseline: "Base Case Nexti", fonteAtual: "Estimativa por benchmark",
    janelaBaseline: "Base Case padrão", hierarquiaBaseline: "base_case",
    tendencia: 5.2, fatorReducao: 100,
    formulaResumo: "ganho = horas produtivas identificadas × valor unitário da hora",
    observacaoMetodologica: "Valor referencial baseado em estimativa de horas produtivas não capturadas antes da solução.",
  },
  {
    id: "d11", nome: "Redução do Tempo de Atendimento", categoria: "intangivel", moduloNexti: "RH Digital",
    unidadeMedida: "minutos", status: "ativo",
    baseline: 45, atual: 12, delta: -33, custoUnitario: 0, ganhoBruto: 0,
    confianca: "comprovado", fonteBaseline: "Pesquisa interna do cliente", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Pesquisa pré-implantação", hierarquiaBaseline: "historico_real",
    tendencia: -15.0, fatorReducao: 0,
    formulaResumo: "Tempo médio de atendimento antes vs depois (não monetizado)",
    observacaoMetodologica: "Ganho intangível. Contribui para satisfação do colaborador e eficiência de RH.",
  },
  {
    id: "d12", nome: "Melhoria de SLA Interno", categoria: "intangivel", moduloNexti: "Operações",
    unidadeMedida: "%", status: "ativo",
    baseline: 72, atual: 94, delta: 22, custoUnitario: 0, ganhoBruto: 0,
    confianca: "hibrido", fonteBaseline: "Histórico do cliente", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Jan/2023 – Jun/2023", hierarquiaBaseline: "media_janela",
    tendencia: 3.5, fatorReducao: 0,
    formulaResumo: "SLA interno antes vs depois (%)",
    observacaoMetodologica: "Ganho intangível. Melhoria de conformidade e governança operacional.",
  },
  {
    id: "d13", nome: "Ganho de Governança", categoria: "intangivel", moduloNexti: "Compliance",
    unidadeMedida: "nível", status: "ativo",
    baseline: 2, atual: 4, delta: 2, custoUnitario: 0, ganhoBruto: 0,
    confianca: "hibrido", fonteBaseline: "Avaliação interna", fonteAtual: "Avaliação pós-implantação",
    janelaBaseline: "Avaliação pré-implantação", hierarquiaBaseline: "benchmark_interno",
    tendencia: 10, fatorReducao: 0,
    formulaResumo: "Nível de maturidade de governança antes vs depois (escala 1-5)",
    observacaoMetodologica: "Avaliação qualitativa de maturidade de governança trabalhista.",
  },
  {
    id: "d14", nome: "Redução de Risco Reputacional", categoria: "intangivel", moduloNexti: "Compliance Trabalhista",
    unidadeMedida: "índice", status: "ativo",
    baseline: 7.5, atual: 3.2, delta: -4.3, custoUnitario: 0, ganhoBruto: 0,
    confianca: "referencial", fonteBaseline: "Base Case Nexti", fonteAtual: "Estimativa",
    janelaBaseline: "Base Case padrão", hierarquiaBaseline: "base_case",
    tendencia: -8.0, fatorReducao: 0,
    formulaResumo: "Índice de risco reputacional antes vs depois (escala 0-10)",
    observacaoMetodologica: "Ganho intangível baseado em redução de exposição trabalhista e passivos.",
  },
];

export const operacoes: ROIOperacao[] = [
  { nome: "Regional Sul", tipo: "regional", economiaBruta: 2240000, ownershipAtribuido: 17600, economiaLiquida: 2222400, roiTotal: 127.3, driversPrincipais: ["Disputas Trabalhistas", "Horas Extras"], pctComprovado: 72, tendencia: 8.5, scoreCaptura: 85, colaboradores: 2200 },
  { nome: "Regional Sudeste", tipo: "regional", economiaBruta: 1680000, ownershipAtribuido: 22400, economiaLiquida: 1657600, roiTotal: 75.0, driversPrincipais: ["Quadro Lotação", "Benefícios"], pctComprovado: 58, tendencia: 5.2, scoreCaptura: 72, colaboradores: 2800 },
  { nome: "Regional Nordeste", tipo: "regional", economiaBruta: 960000, ownershipAtribuido: 11200, economiaLiquida: 948800, roiTotal: 85.7, driversPrincipais: ["Custo Operacional", "Papel"], pctComprovado: 81, tendencia: 12.3, scoreCaptura: 88, colaboradores: 1500 },
  { nome: "Regional Centro-Oeste", tipo: "regional", economiaBruta: 520000, ownershipAtribuido: 8640, economiaLiquida: 511360, roiTotal: 60.2, driversPrincipais: ["Horas Extras", "Fechamento"], pctComprovado: 45, tendencia: -2.1, scoreCaptura: 55, colaboradores: 1500 },
  { nome: "Contrato A – Logística", tipo: "contrato", economiaBruta: 1120000, ownershipAtribuido: 9600, economiaLiquida: 1110400, roiTotal: 116.7, driversPrincipais: ["Disputas", "Quadro"], pctComprovado: 65, tendencia: 7.8, scoreCaptura: 78, colaboradores: 1200 },
  { nome: "Contrato B – Segurança", tipo: "contrato", economiaBruta: 784000, ownershipAtribuido: 7600, economiaLiquida: 776400, roiTotal: 103.2, driversPrincipais: ["Horas Extras", "Adicional Noturno"], pctComprovado: 88, tendencia: 4.1, scoreCaptura: 91, colaboradores: 950 },
  { nome: "Contrato C – Facilities", tipo: "contrato", economiaBruta: 336000, ownershipAtribuido: 6640, economiaLiquida: 329360, roiTotal: 50.6, driversPrincipais: ["Papel", "Benefícios"], pctComprovado: 42, tendencia: -5.3, scoreCaptura: 48, colaboradores: 850 },
  { nome: "Unidade São Paulo", tipo: "unidade", economiaBruta: 2560000, ownershipAtribuido: 25600, economiaLiquida: 2534400, roiTotal: 100.0, driversPrincipais: ["Disputas", "Horas Extras"], pctComprovado: 62, tendencia: 6.9, scoreCaptura: 76, colaboradores: 3200 },
];

export const mesesROI = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const trendROI: ROITrendPoint[] = mesesROI.map((mes, i) => {
  const economiaBruta = 380000 + i * 45000 + Math.round(Math.sin(i * 0.7) * 35000);
  const economiaLiquida = economiaBruta - (ownership.ownershipTotal / 12);
  const pctComprovado = 48 + Math.round(i * 1.8 + Math.sin(i) * 3);
  return {
    mes,
    roiTotal: +(economiaBruta / (ownership.ownershipTotal / 12) * 100 / 100).toFixed(1),
    economiaBruta,
    economiaLiquida: Math.round(economiaLiquida),
    economiaAcumulada: Math.round((i + 1) * economiaBruta * 0.85),
    pctComprovado,
    valorComprovado: Math.round(economiaBruta * pctComprovado / 100),
    valorReferencial: Math.round(economiaBruta * (100 - pctComprovado) / 100),
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
  const economiaMensal = getEconomiaBruta() / 12;
  return economiaMensal > 0 ? ownership.ownershipTotal / economiaMensal : Infinity;
}

export function getConfiancaBreakdown() {
  const monetarios = getDriversMonetarios();
  const total = monetarios.reduce((s, d) => s + d.ganhoBruto, 0);
  if (total === 0) return { comprovado: 0, hibrido: 0, referencial: 0, potencial: 0, comprovadoR$: 0, hibridoR$: 0, referencialR$: 0 };
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
  const payback = getPaybackMeses();
  const conf = getConfiancaBreakdown();
  const monetarios = getDriversMonetarios();
  const topDriver = [...monetarios].sort((a, b) => b.ganhoBruto - a.ganhoBruto)[0];
  const negativos = monetarios.filter(d => d.ganhoBruto < 0);

  return [
    { severity: "info" as const, text: `A Nexti gerou ${formatCurrency(liq)} de economia líquida no período, com ${conf.comprovado.toFixed(0)}% do valor plenamente comprovado por dados reais do cliente.` },
    { severity: "critical" as const, text: `O principal driver financeiro foi ${topDriver.nome}, responsável por ${(topDriver.ganhoBruto / eco * 100).toFixed(0)}% da economia bruta total (${formatCurrency(topDriver.ganhoBruto)}).` },
    { severity: "warning" as const, text: `${formatCurrency(conf["referencialR$"])} do valor total (${conf.referencial.toFixed(0)}%) ainda é referencial — oportunidade de comprovação com importação de dados reais.` },
    { severity: "info" as const, text: `Payback do investimento alcançado em ${payback.toFixed(1)} meses. ROI acumulado de ${getROITotal().toFixed(1)}x.` },
    { severity: "info" as const, text: `Valor comprovado: ${formatCurrency(conf["comprovadoR$"])} | Híbrido: ${formatCurrency(conf["hibridoR$"])} | Referencial: ${formatCurrency(conf["referencialR$"])}.` },
    ...(negativos.length > 0 ? [{ severity: "critical" as const, text: `${negativos.length} driver(s) apresentam ganho negativo — atenção necessária.` }] : []),
  ];
}
