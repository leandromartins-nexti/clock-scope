/* ── ROI Realizado – Data Layer ── */

export type ConfidenceLevel = "comprovado" | "hibrido" | "referencial";
export type CostMaturity = 1 | 2 | 3;
export type DriverStatus = "ativo" | "inativo";

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
  tendencia: number; // % change vs prior period
  fatorReducao: number; // %
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
}

export interface ROITrendPoint {
  mes: string;
  roiTotal: number;
  economiaBruta: number;
  economiaLiquida: number;
  economiaAcumulada: number;
  pctComprovado: number;
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

/* ── Mock Data ── */

export const premissas: PremissasROI = {
  colaboradores: 10000,
  salarioMedio: 2000,
  encargos: 2.0,
  beneficios: 600,
  multiplicadorHE: 1.5,
  adicionalNoturno: 0.2,
  custoHoraAdmin: 38,
  custoMedioDisputa: 1,
  custoUnitarioDoc: 5.8,
  turnover: 0.02,
  genteReceita: 0.12,
  custoUnitarioNexti: 7.48,
};

export const ownership: ROIOwnership = {
  custoContrato: 74800,
  custosAdicionais: 0,
  custosReduzidos: 0,
  ownershipTotal: 74800,
};

export const drivers: ROIDriver[] = [
  {
    id: "d1", nome: "Redução de Papel", categoria: "monetario", moduloNexti: "Documentos Digitais",
    unidadeMedida: "documentos", status: "ativo",
    baseline: 12000, atual: 1500, delta: -10500, custoUnitario: 5.8, ganhoBruto: 60900,
    confianca: "comprovado", fonteBaseline: "Histórico cliente", fonteAtual: "Dados reais",
    tendencia: -8.2, fatorReducao: 25,
  },
  {
    id: "d2", nome: "Redução de Horas Extras", categoria: "monetario", moduloNexti: "Gestão de Jornada",
    unidadeMedida: "horas", status: "ativo",
    baseline: 45000, atual: 21600, delta: -23400, custoUnitario: 20.45, ganhoBruto: 478530,
    confianca: "comprovado", fonteBaseline: "Folha 12 meses", fonteAtual: "Dados reais",
    tendencia: -12.5, fatorReducao: 15,
  },
  {
    id: "d3", nome: "Redução de Adicional Noturno", categoria: "monetario", moduloNexti: "Gestão de Jornada",
    unidadeMedida: "horas", status: "ativo",
    baseline: 105000, atual: 89250, delta: -15750, custoUnitario: 3.5, ganhoBruto: 55125,
    confianca: "hibrido", fonteBaseline: "Folha 6 meses", fonteAtual: "Dados reais",
    tendencia: -5.3, fatorReducao: 25,
  },
  {
    id: "d4", nome: "Redução de Custo Operacional", categoria: "monetario", moduloNexti: "Automação Operacional",
    unidadeMedida: "R$", status: "ativo",
    baseline: 240000, atual: 48000, delta: -192000, custoUnitario: 1, ganhoBruto: 192000,
    confianca: "comprovado", fonteBaseline: "Financeiro cliente", fonteAtual: "Dados reais",
    tendencia: -15.0, fatorReducao: 100,
  },
  {
    id: "d5", nome: "Aumento em Descontos de Atrasos e Faltas", categoria: "monetario", moduloNexti: "Controle de Ponto",
    unidadeMedida: "R$", status: "ativo",
    baseline: 11000, atual: 23000, delta: 12000, custoUnitario: 9.1, ganhoBruto: 109200,
    confianca: "hibrido", fonteBaseline: "Estimativa", fonteAtual: "Dados reais",
    tendencia: 8.4, fatorReducao: 15,
  },
  {
    id: "d6", nome: "Redução Tempo para Fechamento", categoria: "monetario", moduloNexti: "Fechamento Digital",
    unidadeMedida: "horas", status: "ativo",
    baseline: 720, atual: 12, delta: -708, custoUnitario: 38, ganhoBruto: 26904,
    confianca: "comprovado", fonteBaseline: "Processo cliente", fonteAtual: "Dados reais",
    tendencia: -22.0, fatorReducao: 50,
  },
  {
    id: "d7", nome: "Redução de Disputas Trabalhistas", categoria: "monetario", moduloNexti: "Compliance Trabalhista",
    unidadeMedida: "processos", status: "ativo",
    baseline: 4148145, atual: 122904, delta: -4025241, custoUnitario: 1, ganhoBruto: 4025241,
    confianca: "referencial", fonteBaseline: "Base Case Nexti", fonteAtual: "Estimativa",
    tendencia: -3.1, fatorReducao: 15,
  },
  {
    id: "d8", nome: "Pagamento de Benefícios", categoria: "monetario", moduloNexti: "Gestão de Benefícios",
    unidadeMedida: "R$", status: "ativo",
    baseline: 6000000, atual: 5760000, delta: -240000, custoUnitario: 1, ganhoBruto: 240000,
    confianca: "hibrido", fonteBaseline: "Financeiro cliente", fonteAtual: "Estimativa parcial",
    tendencia: -2.1, fatorReducao: 100,
  },
  {
    id: "d9", nome: "Otimização de Quadro de Lotação", categoria: "monetario", moduloNexti: "Dimensionamento",
    unidadeMedida: "colaboradores", status: "ativo",
    baseline: 10000, atual: 9750, delta: -250, custoUnitario: 6000, ganhoBruto: 1500000,
    confianca: "referencial", fonteBaseline: "Base Case Nexti", fonteAtual: "Estimativa",
    tendencia: -1.5, fatorReducao: 100,
  },
  {
    id: "d10", nome: "Horas Produtivas Não Faturadas", categoria: "monetario", moduloNexti: "Produtividade",
    unidadeMedida: "horas", status: "ativo",
    baseline: 0, atual: 230114, delta: 230114, custoUnitario: 1, ganhoBruto: 230114,
    confianca: "referencial", fonteBaseline: "Base Case Nexti", fonteAtual: "Estimativa",
    tendencia: 5.2, fatorReducao: 100,
  },
  {
    id: "d11", nome: "Redução do Tempo de Atendimento", categoria: "intangivel", moduloNexti: "RH Digital",
    unidadeMedida: "minutos", status: "ativo",
    baseline: 45, atual: 12, delta: -33, custoUnitario: 0, ganhoBruto: 0,
    confianca: "comprovado", fonteBaseline: "Pesquisa interna", fonteAtual: "Dados reais",
    tendencia: -15.0, fatorReducao: 0,
  },
  {
    id: "d12", nome: "Melhoria de SLA Interno", categoria: "intangivel", moduloNexti: "Operações",
    unidadeMedida: "%", status: "ativo",
    baseline: 72, atual: 94, delta: 22, custoUnitario: 0, ganhoBruto: 0,
    confianca: "hibrido", fonteBaseline: "Histórico cliente", fonteAtual: "Dados reais",
    tendencia: 3.5, fatorReducao: 0,
  },
];

export const operacoes: ROIOperacao[] = [
  { nome: "Regional Sul", tipo: "regional", economiaBruta: 2800000, ownershipAtribuido: 22000, economiaLiquida: 2778000, roiTotal: 127.3, driversPrincipais: ["Disputas Trabalhistas", "Horas Extras"], pctComprovado: 72, tendencia: 8.5, scoreCaptura: 85 },
  { nome: "Regional Sudeste", tipo: "regional", economiaBruta: 2100000, ownershipAtribuido: 28000, economiaLiquida: 2072000, roiTotal: 75.0, driversPrincipais: ["Quadro Lotação", "Benefícios"], pctComprovado: 58, tendencia: 5.2, scoreCaptura: 72 },
  { nome: "Regional Nordeste", tipo: "regional", economiaBruta: 1200000, ownershipAtribuido: 14000, economiaLiquida: 1186000, roiTotal: 85.7, driversPrincipais: ["Custo Operacional", "Papel"], pctComprovado: 81, tendencia: 12.3, scoreCaptura: 88 },
  { nome: "Regional Centro-Oeste", tipo: "regional", economiaBruta: 650000, ownershipAtribuido: 10800, economiaLiquida: 639200, roiTotal: 60.2, driversPrincipais: ["Horas Extras", "Fechamento"], pctComprovado: 45, tendencia: -2.1, scoreCaptura: 55 },
  { nome: "Contrato A – Logística", tipo: "contrato", economiaBruta: 1400000, ownershipAtribuido: 12000, economiaLiquida: 1388000, roiTotal: 116.7, driversPrincipais: ["Disputas", "Quadro"], pctComprovado: 65, tendencia: 7.8, scoreCaptura: 78 },
  { nome: "Contrato B – Segurança", tipo: "contrato", economiaBruta: 980000, ownershipAtribuido: 9500, economiaLiquida: 970500, roiTotal: 103.2, driversPrincipais: ["Horas Extras", "Adicional Noturno"], pctComprovado: 88, tendencia: 4.1, scoreCaptura: 91 },
  { nome: "Contrato C – Facilities", tipo: "contrato", economiaBruta: 420000, ownershipAtribuido: 8300, economiaLiquida: 411700, roiTotal: 50.6, driversPrincipais: ["Papel", "Benefícios"], pctComprovado: 42, tendencia: -5.3, scoreCaptura: 48 },
  { nome: "Unidade São Paulo", tipo: "unidade", economiaBruta: 3200000, ownershipAtribuido: 32000, economiaLiquida: 3168000, roiTotal: 100.0, driversPrincipais: ["Disputas", "Horas Extras"], pctComprovado: 62, tendencia: 6.9, scoreCaptura: 76 },
];

export const mesesROI = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const trendROI: ROITrendPoint[] = mesesROI.map((mes, i) => {
  const economiaBruta = 450000 + i * 52000 + Math.round(Math.sin(i * 0.7) * 40000);
  const economiaLiquida = economiaBruta - (ownership.ownershipTotal / 12);
  return {
    mes,
    roiTotal: +(economiaBruta / (ownership.ownershipTotal / 12) * 100 / 100).toFixed(1),
    economiaBruta,
    economiaLiquida: Math.round(economiaLiquida),
    economiaAcumulada: Math.round((i + 1) * economiaBruta * 0.85),
    pctComprovado: 48 + Math.round(i * 1.8 + Math.sin(i) * 3),
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
  if (total === 0) return { comprovado: 0, hibrido: 0, referencial: 0 };
  const byLevel = (level: ConfidenceLevel) =>
    monetarios.filter(d => d.confianca === level).reduce((s, d) => s + d.ganhoBruto, 0);
  return {
    comprovado: +((byLevel("comprovado") / total) * 100).toFixed(1),
    hibrido: +((byLevel("hibrido") / total) * 100).toFixed(1),
    referencial: +((byLevel("referencial") / total) * 100).toFixed(1),
  };
}

export function confidenceBadge(level: ConfidenceLevel) {
  switch (level) {
    case "comprovado": return { label: "Comprovado", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" };
    case "hibrido": return { label: "Híbrido", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-500" };
    case "referencial": return { label: "Referencial", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-400" };
  }
}

export function capturaScoreClass(score: number) {
  if (score >= 80) return { label: "Captura Forte", color: "text-green-600", bg: "bg-green-50" };
  if (score >= 60) return { label: "Captura Moderada", color: "text-yellow-600", bg: "bg-yellow-50" };
  return { label: "Captura Fraca", color: "text-red-600", bg: "bg-red-50" };
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
  const worstDriver = [...monetarios].sort((a, b) => a.tendencia - b.tendencia)[0];
  const negativos = monetarios.filter(d => d.ganhoBruto < 0);

  return [
    { severity: "info" as const, text: `A Nexti gerou ${formatCurrency(eco)} de economia bruta no período, com payback de ${payback.toFixed(1)} meses.` },
    { severity: "info" as const, text: `${conf.comprovado.toFixed(0)}% do valor total está comprovado com dados reais do cliente.` },
    { severity: "critical" as const, text: `O driver com maior contribuição foi ${topDriver.nome} com ${formatCurrency(topDriver.ganhoBruto)}.` },
    { severity: "warning" as const, text: `${conf.referencial.toFixed(0)}% do valor ainda é referencial — oportunidade de comprovação.` },
    { severity: "info" as const, text: `Economia líquida após custo Nexti: ${formatCurrency(liq)}.` },
    ...(negativos.length > 0 ? [{ severity: "critical" as const, text: `${negativos.length} driver(s) apresentam ganho negativo — atenção necessária.` }] : []),
  ];
}
