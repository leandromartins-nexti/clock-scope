/* ── Executive Dashboard Data ── */

export type CostLevel = 1 | 2 | 3;

export interface AreaData {
  nome: string;
  scoreGeral: number;
  scoreAbsenteismo: number;
  scoreEficiencia: number;
  scoreCobertura: number;
  scoreRisco: number;
  scoreCusto: number;
  horasOperacionais: number;
  horasAusencia: number;
  horasCobertura: number;
  horasDescobertas: number;
  horasExtras: number;
  coberturasPlanejadas: number;
  coberturasEmergenciais: number;
  tempoMedioCobertura: number; // minutos
  taxaAbsenteismo: number;
  taxaCobertura: number;
  taxaDescoberta: number;
  custoPorHora: number;
  custoTotal: number;
  custoAusencia: number;
  custoCobertura: number;
  custoIneficiencia: number;
  economiaAbsenteismo: number;
  economiaCobertura: number;
  economiaTotal: number;
  costLevel: CostLevel;
  tiposAusencia: { falta: number; atestado: number; ferias: number; outros: number };
  ausenciaPrevista: number;
  ausenciaNaoPrevista: number;
}

export interface TrendPoint {
  mes: string;
  scoreGeral: number;
  horasAusencia: number;
  horasCobertura: number;
  horasDescobertas: number;
  custoTotal: number;
  eficiencia: number;
  absenteismo: number;
  risco: number;
  cobPlanejada: number;
  cobEmergencial: number;
}

export const meses = ["Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

export const trendData: TrendPoint[] = meses.map((mes, i) => ({
  mes,
  scoreGeral: 62 + Math.round(Math.sin(i * 0.5) * 8 + i * 1.2),
  horasAusencia: 4200 - i * 80 + Math.round(Math.sin(i) * 300),
  horasCobertura: 3100 - i * 50 + Math.round(Math.cos(i) * 200),
  horasDescobertas: 1100 - i * 40 + Math.round(Math.sin(i * 0.7) * 150),
  custoTotal: 185000 - i * 3000 + Math.round(Math.sin(i) * 12000),
  eficiencia: 58 + i * 1.5 + Math.round(Math.sin(i * 0.8) * 5),
  absenteismo: 8.2 - i * 0.15 + Math.round(Math.sin(i) * 0.8 * 10) / 10,
  risco: 42 - i * 1.2 + Math.round(Math.cos(i) * 6),
  cobPlanejada: 55 + i * 1.8 + Math.round(Math.sin(i * 0.6) * 4),
  cobEmergencial: 45 - i * 1.8 - Math.round(Math.sin(i * 0.6) * 4),
}));

export const areas: AreaData[] = [
  {
    nome: "Logística Centro",
    scoreGeral: 45, scoreAbsenteismo: 38, scoreEficiencia: 42, scoreCobertura: 50, scoreRisco: 35, scoreCusto: 40,
    horasOperacionais: 12400, horasAusencia: 1860, horasCobertura: 1200, horasDescobertas: 660, horasExtras: 320,
    coberturasPlanejadas: 480, coberturasEmergenciais: 720, tempoMedioCobertura: 95,
    taxaAbsenteismo: 15.0, taxaCobertura: 64.5, taxaDescoberta: 35.5,
    custoPorHora: 42, custoTotal: 78120, custoAusencia: 31200, custoCobertura: 33600, custoIneficiencia: 13320,
    economiaAbsenteismo: 18600, economiaCobertura: 15120, economiaTotal: 33720,
    costLevel: 3,
    tiposAusencia: { falta: 420, atestado: 780, ferias: 480, outros: 180 },
    ausenciaPrevista: 480, ausenciaNaoPrevista: 1380,
  },
  {
    nome: "Segurança Patrimonial SP",
    scoreGeral: 52, scoreAbsenteismo: 48, scoreEficiencia: 55, scoreCobertura: 58, scoreRisco: 44, scoreCusto: 50,
    horasOperacionais: 18600, horasAusencia: 2232, horasCobertura: 1674, horasDescobertas: 558, horasExtras: 410,
    coberturasPlanejadas: 900, coberturasEmergenciais: 774, tempoMedioCobertura: 72,
    taxaAbsenteismo: 12.0, taxaCobertura: 75.0, taxaDescoberta: 25.0,
    custoPorHora: 38, custoTotal: 84816, custoAusencia: 33900, custoCobertura: 37620, custoIneficiencia: 13296,
    economiaAbsenteismo: 16920, economiaCobertura: 14688, economiaTotal: 31608,
    costLevel: 2,
    tiposAusencia: { falta: 380, atestado: 920, ferias: 620, outros: 312 },
    ausenciaPrevista: 620, ausenciaNaoPrevista: 1612,
  },
  {
    nome: "Facilities RJ",
    scoreGeral: 71, scoreAbsenteismo: 68, scoreEficiencia: 74, scoreCobertura: 72, scoreRisco: 65, scoreCusto: 70,
    horasOperacionais: 9800, horasAusencia: 784, horasCobertura: 627, horasDescobertas: 157, horasExtras: 120,
    coberturasPlanejadas: 480, coberturasEmergenciais: 147, tempoMedioCobertura: 45,
    taxaAbsenteismo: 8.0, taxaCobertura: 80.0, taxaDescoberta: 20.0,
    custoPorHora: 35, custoTotal: 27440, custoAusencia: 10920, custoCobertura: 10920, custoIneficiencia: 5600,
    economiaAbsenteismo: 5460, economiaCobertura: 2570, economiaTotal: 8030,
    costLevel: 3,
    tiposAusencia: { falta: 120, atestado: 340, ferias: 240, outros: 84 },
    ausenciaPrevista: 240, ausenciaNaoPrevista: 544,
  },
  {
    nome: "Limpeza Industrial MG",
    scoreGeral: 83, scoreAbsenteismo: 82, scoreEficiencia: 85, scoreCobertura: 80, scoreRisco: 78, scoreCusto: 84,
    horasOperacionais: 7200, horasAusencia: 360, horasCobertura: 306, horasDescobertas: 54, horasExtras: 40,
    coberturasPlanejadas: 270, coberturasEmergenciais: 36, tempoMedioCobertura: 30,
    taxaAbsenteismo: 5.0, taxaCobertura: 85.0, taxaDescoberta: 15.0,
    custoPorHora: 30, custoTotal: 10800, custoAusencia: 4320, custoCobertura: 4590, custoIneficiencia: 1890,
    economiaAbsenteismo: 2160, economiaCobertura: 540, economiaTotal: 2700,
    costLevel: 2,
    tiposAusencia: { falta: 48, atestado: 168, ferias: 108, outros: 36 },
    ausenciaPrevista: 108, ausenciaNaoPrevista: 252,
  },
  {
    nome: "Portaria Corporativa",
    scoreGeral: 58, scoreAbsenteismo: 55, scoreEficiencia: 60, scoreCobertura: 62, scoreRisco: 52, scoreCusto: 56,
    horasOperacionais: 14200, horasAusencia: 1562, horasCobertura: 1093, horasDescobertas: 469, horasExtras: 280,
    coberturasPlanejadas: 620, coberturasEmergenciais: 473, tempoMedioCobertura: 65,
    taxaAbsenteismo: 11.0, taxaCobertura: 70.0, taxaDescoberta: 30.0,
    custoPorHora: 36, custoTotal: 56232, custoAusencia: 22440, custoCobertura: 22440, custoIneficiencia: 11352,
    economiaAbsenteismo: 11220, economiaCobertura: 8505, economiaTotal: 19725,
    costLevel: 1,
    tiposAusencia: { falta: 312, atestado: 624, ferias: 390, outros: 236 },
    ausenciaPrevista: 390, ausenciaNaoPrevista: 1172,
  },
  {
    nome: "Recepção Premium",
    scoreGeral: 76, scoreAbsenteismo: 74, scoreEficiencia: 78, scoreCobertura: 75, scoreRisco: 70, scoreCusto: 77,
    horasOperacionais: 6400, horasAusencia: 448, horasCobertura: 381, horasDescobertas: 67, horasExtras: 55,
    coberturasPlanejadas: 320, coberturasEmergenciais: 61, tempoMedioCobertura: 38,
    taxaAbsenteismo: 7.0, taxaCobertura: 85.1, taxaDescoberta: 14.9,
    custoPorHora: 45, custoTotal: 20160, custoAusencia: 8100, custoCobertura: 8595, custoIneficiencia: 3465,
    economiaAbsenteismo: 4050, economiaCobertura: 1372, economiaTotal: 5422,
    costLevel: 3,
    tiposAusencia: { falta: 56, atestado: 202, ferias: 134, outros: 56 },
    ausenciaPrevista: 134, ausenciaNaoPrevista: 314,
  },
  {
    nome: "Vigilância Eventos",
    scoreGeral: 39, scoreAbsenteismo: 32, scoreEficiencia: 36, scoreCobertura: 44, scoreRisco: 30, scoreCusto: 35,
    horasOperacionais: 8600, horasAusencia: 1720, horasCobertura: 946, horasDescobertas: 774, horasExtras: 480,
    coberturasPlanejadas: 280, coberturasEmergenciais: 666, tempoMedioCobertura: 120,
    taxaAbsenteismo: 20.0, taxaCobertura: 55.0, taxaDescoberta: 45.0,
    custoPorHora: 40, custoTotal: 68800, custoAusencia: 27520, custoCobertura: 24080, custoIneficiencia: 17200,
    economiaAbsenteismo: 27520, economiaCobertura: 13280, economiaTotal: 40800,
    costLevel: 1,
    tiposAusencia: { falta: 560, atestado: 640, ferias: 280, outros: 240 },
    ausenciaPrevista: 280, ausenciaNaoPrevista: 1440,
  },
  {
    nome: "Manutenção Predial",
    scoreGeral: 66, scoreAbsenteismo: 62, scoreEficiencia: 68, scoreCobertura: 66, scoreRisco: 60, scoreCusto: 65,
    horasOperacionais: 5400, horasAusencia: 486, horasCobertura: 389, horasDescobertas: 97, horasExtras: 75,
    coberturasPlanejadas: 310, coberturasEmergenciais: 79, tempoMedioCobertura: 50,
    taxaAbsenteismo: 9.0, taxaCobertura: 80.0, taxaDescoberta: 20.0,
    custoPorHora: 32, custoTotal: 17280, custoAusencia: 6220, custoCobertura: 6220, custoIneficiencia: 4840,
    economiaAbsenteismo: 3888, economiaCobertura: 1555, economiaTotal: 5443,
    costLevel: 2,
    tiposAusencia: { falta: 97, atestado: 194, ferias: 146, outros: 49 },
    ausenciaPrevista: 146, ausenciaNaoPrevista: 340,
  },
];

/* ── Helpers ── */

export function scoreClass(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "Saudável", color: "text-green-600", bg: "bg-green-50" };
  if (score >= 60) return { label: "Atenção", color: "text-yellow-600", bg: "bg-yellow-50" };
  return { label: "Crítico", color: "text-red-600", bg: "bg-red-50" };
}

export function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function formatNumber(v: number) {
  return v.toLocaleString("pt-BR");
}

export function pctChange(curr: number, prev: number) {
  if (prev === 0) return 0;
  return ((curr - prev) / prev) * 100;
}

export function costLevelLabel(level: CostLevel) {
  if (level === 1) return "Operacional";
  if (level === 2) return "Estimado";
  return "Real";
}

/* Totals */
export function getTotals() {
  const t = areas.reduce(
    (acc, a) => ({
      horasOperacionais: acc.horasOperacionais + a.horasOperacionais,
      horasAusencia: acc.horasAusencia + a.horasAusencia,
      horasCobertura: acc.horasCobertura + a.horasCobertura,
      horasDescobertas: acc.horasDescobertas + a.horasDescobertas,
      horasExtras: acc.horasExtras + a.horasExtras,
      custoTotal: acc.custoTotal + a.custoTotal,
      custoAusencia: acc.custoAusencia + a.custoAusencia,
      custoCobertura: acc.custoCobertura + a.custoCobertura,
      custoIneficiencia: acc.custoIneficiencia + a.custoIneficiencia,
      economiaTotal: acc.economiaTotal + a.economiaTotal,
      economiaAbsenteismo: acc.economiaAbsenteismo + a.economiaAbsenteismo,
      economiaCobertura: acc.economiaCobertura + a.economiaCobertura,
      cobPlanejadas: acc.cobPlanejadas + a.coberturasPlanejadas,
      cobEmergenciais: acc.cobEmergenciais + a.coberturasEmergenciais,
    }),
    {
      horasOperacionais: 0, horasAusencia: 0, horasCobertura: 0, horasDescobertas: 0, horasExtras: 0,
      custoTotal: 0, custoAusencia: 0, custoCobertura: 0, custoIneficiencia: 0,
      economiaTotal: 0, economiaAbsenteismo: 0, economiaCobertura: 0,
      cobPlanejadas: 0, cobEmergenciais: 0,
    }
  );

  const scoreGeral = Math.round(areas.reduce((s, a) => s + a.scoreGeral, 0) / areas.length);
  const taxaAbsenteismo = +(t.horasAusencia / t.horasOperacionais * 100).toFixed(1);
  const taxaCobertura = +(t.horasCobertura / t.horasAusencia * 100).toFixed(1);
  const taxaDescoberta = +(t.horasDescobertas / t.horasAusencia * 100).toFixed(1);
  const scoreEficiencia = Math.round(areas.reduce((s, a) => s + a.scoreEficiencia, 0) / areas.length);
  const scoreRisco = Math.round(areas.reduce((s, a) => s + a.scoreRisco, 0) / areas.length);
  const pctCobPlanejada = +((t.cobPlanejadas / (t.cobPlanejadas + t.cobEmergenciais)) * 100).toFixed(1);
  const pctCobEmergencial = +((t.cobEmergenciais / (t.cobPlanejadas + t.cobEmergenciais)) * 100).toFixed(1);
  const tempoMedioCobertura = Math.round(areas.reduce((s, a) => s + a.tempoMedioCobertura, 0) / areas.length);
  const pctHoraExtra = +((t.horasExtras / t.horasCobertura) * 100).toFixed(1);
  const custoMedioArea = Math.round(t.custoTotal / areas.length);

  return {
    ...t,
    scoreGeral,
    taxaAbsenteismo,
    taxaCobertura,
    taxaDescoberta,
    scoreEficiencia,
    scoreRisco,
    pctCobPlanejada,
    pctCobEmergencial,
    tempoMedioCobertura,
    pctHoraExtra,
    custoMedioArea,
  };
}

/* Previous period (simulated) */
export const prevPeriod = {
  scoreGeral: 57,
  horasOperacionais: 85000,
  horasAusencia: 10200,
  horasCobertura: 7100,
  horasDescobertas: 3100,
  custoTotal: 390000,
  economiaTotal: 155000,
  economiaAbsenteismo: 92000,
  economiaCobertura: 63000,
  scoreEficiencia: 58,
  pctCobPlanejada: 52,
  pctCobEmergencial: 48,
  tempoMedioCobertura: 72,
  pctHoraExtra: 38,
  taxaAbsenteismo: 12.8,
  taxaCobertura: 69.6,
  taxaDescoberta: 30.4,
  scoreRisco: 48,
  custoAusencia: 160000,
  custoCobertura: 155000,
  custoIneficiencia: 75000,
  custoMedioArea: 48750,
};

/* Insights */
export function generateInsights() {
  const sorted = [...areas].sort((a, b) => a.scoreGeral - b.scoreGeral);
  const worst = sorted[0];
  const best = sorted[sorted.length - 1];
  const totals = getTotals();
  const criticalAreas = areas.filter(a => a.scoreGeral < 60);

  return [
    { severity: "critical" as const, text: `${worst.nome} é a área com pior score geral (${worst.scoreGeral}/100) e concentra ${((worst.custoTotal / totals.custoTotal) * 100).toFixed(0)}% do custo total.` },
    { severity: "warning" as const, text: `${criticalAreas.length} áreas operam em nível crítico (score < 60), representando risco operacional elevado.` },
    { severity: "info" as const, text: `${best.nome} é a área mais eficiente com score ${best.scoreGeral}/100 e pode servir como benchmark.` },
    { severity: "warning" as const, text: `O absenteísmo geral de ${totals.taxaAbsenteismo}% gera ${formatNumber(totals.horasDescobertas)}h descobertas mensais.` },
    { severity: "critical" as const, text: `${totals.pctCobEmergencial.toFixed(0)}% das coberturas são emergenciais, aumentando custos e riscos.` },
    { severity: "info" as const, text: `O potencial de economia total estimado é de ${formatCurrency(totals.economiaTotal)}.` },
  ];
}
