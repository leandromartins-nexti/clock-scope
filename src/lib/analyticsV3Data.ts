// Analytics V3 - Data Layer
// Cenário base: Orsegups, 8.000 colaboradores, abr/2025 a mar/2026

export type ConfiancaTipo = "comprovado" | "hibrido" | "referencial";
export type TendenciaTipo = "up" | "down" | "stable";

export interface V3Driver {
  id: string;
  nome: string;
  modulo: string;
  categoria: "monetario" | "intangivel";
  competenciaAnterior: number;
  atual: number;
  deltaOperacional: number;
  valorMonetizado: number;
  tipoValor: "custo_evitado" | "perda_evitada";
  confianca: ConfiancaTipo;
  tendencia: TendenciaTipo;
  participacao: number; // % do valor capturado
  unidade: string;
  ativo: boolean;
  // Detalhes para modal
  formulaResumo: string;
  fonteBaseline: string;
  fonteAtual: string;
  janelaComparacao: string;
  observacoes: string;
  // Série temporal
  evolucaoMensal: { mes: string; baseline: number; atual: number; delta: number; valor: number }[];
  // Drill-down por operação
  porOperacao: { nome: string; tipo: string; valor: number; delta: number; colaboradores: number }[];
  // Upgrade paths
  upgradePaths?: { de: ConfiancaTipo; para: ConfiancaTipo; acao: string; impacto: string }[];
}

export interface V3Operacao {
  nome: string;
  tipo: "regional" | "unidade" | "contrato" | "area" | "posto";
  valorCapturado: number;
  custoEvitado: number;
  perdaEvitada: number;
  pctComprovado: number;
  scoreOperacao: number;
  tendencia: TendenciaTipo;
  colaboradores: number;
  driversPrincipais: string[];
}

export interface AbsenteismoData {
  taxaGlobal: number;
  horasTotaisAusencia: number;
  pctNaoPlanejadas: number;
  pctCobertas: number;
  regionalCritica: string;
  tendencia: TendenciaTipo;
  distribuicaoTipo: { tipo: string; horas: number; pct: number; color: string }[];
  porEstrutura: { nome: string; tipo: string; taxa: number; horas: number; horasPor100: number; tendencia: TendenciaTipo }[];
  evolucaoMensal: { mes: string; taxa: number; horas: number; planejadas: number; naoPlanejadas: number }[];
}

export interface CoberturaRiscoData {
  taxaCoberturaEfetiva: number;
  pctReservaTecnica: number;
  pctHoraExtra: number;
  tempoMedioReposicao: number; // horas
  horasPostoDescoberto: number;
  riscoPotencialGlosa: number;
  custoTotalCobertura: number;
  scoreEficiencia: number;
  tiposCobertura: { tipo: string; quantidade: number; pct: number; custo: number; impactoScore: "positivo" | "neutro" | "negativo"; color: string }[];
  evolucaoMensal: { mes: string; planejada: number; emergencial: number; reservaTecnica: number; horaExtra: number; descoberto: number; score: number }[];
  porEstrutura: { nome: string; tipo: string; score: number; custoCobertura: number; horasDescoberto: number; tendencia: TendenciaTipo }[];
}

export interface PerformanceTimeData {
  totalAcoes: number;
  usuariosAtivos: number;
  mediaAcoesPorUsuario: number;
  acoesPor100Colaboradores: number;
  scoreEficiencia: number;
  tiposAcao: { tipo: string; quantidade: number; pct: number; color: string }[];
  porEstrutura: { nome: string; tipo: string; acoes: number; usuarios: number; mediaPorUsuario: number; acoesPor100: number; score: number }[];
  topUsuarios: { nome: string; cargo: string; acoes: number; tipos: string[]; estrutura: string }[];
  evolucaoMensal: { mes: string; acoes: number; usuarios: number; media: number }[];
}

// ====== MESES DO PERÍODO ======
export const mesesPeriodo = [
  "abr/25", "mai/25", "jun/25", "jul/25", "ago/25", "set/25",
  "out/25", "nov/25", "dez/25", "jan/26", "fev/26", "mar/26"
];

// ====== FORMAT HELPERS ======
export function formatCurrencyV3(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`;
  return `R$ ${value.toFixed(0)}`;
}

export function formatNumberV3(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

export function confiancaBadgeV3(tipo: ConfiancaTipo): { label: string; color: string; bg: string } {
  switch (tipo) {
    case "comprovado": return { label: "Comprovado", color: "#16a34a", bg: "#f0fdf4" };
    case "hibrido": return { label: "Híbrido", color: "#ca8a04", bg: "#fefce8" };
    case "referencial": return { label: "Referencial", color: "#9333ea", bg: "#faf5ff" };
  }
}

// ====== DRIVERS ======
function gerarEvolucaoDriverComTotal(baselineInicial: number, tendencia: "melhora" | "piora" | "estavel", variacao: number, totalDesejado: number): V3Driver["evolucaoMensal"] {
  // Generate raw weights with growth curve
  const rawWeights = mesesPeriodo.map((_, i) => {
    if (tendencia === "melhora") return 0.4 + (i * 0.6 / 11);
    if (tendencia === "piora") return 1.0 - (i * 0.5 / 11);
    return 1.0;
  });
  const sumWeights = rawWeights.reduce((s, w) => s + w, 0);
  
  return mesesPeriodo.map((mes, i) => {
    const fator = tendencia === "melhora" ? 1 - (i * variacao / 12) : tendencia === "piora" ? 1 + (i * variacao / 12) : 1;
    const atual = Math.round(baselineInicial * fator);
    const baseline = baselineInicial;
    const valor = Math.round((rawWeights[i] / sumWeights) * totalDesejado);
    return { mes, baseline, atual, delta: atual - baseline, valor };
  });
}

function gerarOperacoes(driverNome: string): V3Driver["porOperacao"] {
  const ops = ["Regional SP", "Regional RJ", "Regional MG", "Regional PR", "Regional BA"];
  return ops.map((nome, i) => ({
    nome,
    tipo: "regional",
    valor: Math.round(80000 + Math.random() * 200000),
    delta: Math.round(-5 - Math.random() * 20),
    colaboradores: Math.round(800 + Math.random() * 2000),
  }));
}

export const driversV3: V3Driver[] = [
  {
    id: "he",
    nome: "Horas Extras",
    modulo: "NextTime",
    categoria: "monetario",
    competenciaAnterior: 42500,
    atual: 33100,
    deltaOperacional: -22.1,
    valorMonetizado: 1412000,
    tipoValor: "custo_evitado",
    confianca: "comprovado",
    tendencia: "up",
    participacao: 22.1,
    unidade: "horas",
    ativo: true,
    formulaResumo: "ganho_real = valor_HE_competência_anterior - valor_HE_competência_atual",
    fonteBaseline: "Histórico real do cliente no NextTime (abr/24 - mar/25)",
    fonteAtual: "Dados reais do NextTime (abr/25 - mar/26)",
    janelaComparacao: "Competência vs competência anterior",
    observacoes: "Valores monetários importados da folha de pagamento. Confiança comprovada.",
    evolucaoMensal: gerarEvolucaoDriverComTotal(42500, "melhora", 0.22, 1412000),
    porOperacao: [
      { nome: "Regional SP", tipo: "regional", valor: 480000, delta: -24, colaboradores: 2800 },
      { nome: "Regional RJ", tipo: "regional", valor: 340000, delta: -20, colaboradores: 1900 },
      { nome: "Regional MG", tipo: "regional", valor: 260000, delta: -18, colaboradores: 1400 },
      { nome: "Regional PR", tipo: "regional", valor: 195000, delta: -25, colaboradores: 1100 },
      { nome: "Regional BA", tipo: "regional", valor: 137000, delta: -15, colaboradores: 800 },
    ],
    upgradePaths: [],
  },
  {
    id: "an",
    nome: "Adicional Noturno",
    modulo: "NextTime",
    categoria: "monetario",
    competenciaAnterior: 18200,
    atual: 14800,
    deltaOperacional: -18.7,
    valorMonetizado: 892000,
    tipoValor: "custo_evitado",
    confianca: "comprovado",
    tendencia: "up",
    participacao: 13.9,
    unidade: "horas",
    ativo: true,
    formulaResumo: "ganho_real = valor_AN_competência_anterior - valor_AN_competência_atual",
    fonteBaseline: "Histórico real do cliente no NextTime",
    fonteAtual: "Dados reais do NextTime",
    janelaComparacao: "Competência vs competência anterior",
    observacoes: "Valores reais importados da folha.",
    evolucaoMensal: gerarEvolucaoDriverComTotal(18200, "melhora", 0.19, 892000),
    porOperacao: gerarOperacoes("Adicional Noturno"),
    upgradePaths: [],
  },
  {
    id: "desc",
    nome: "Atrasos e Faltas",
    modulo: "NextTime",
    categoria: "monetario",
    competenciaAnterior: 12400,
    atual: 18900,
    deltaOperacional: 52.4,
    valorMonetizado: 780000,
    tipoValor: "perda_evitada",
    confianca: "comprovado",
    tendencia: "up",
    participacao: 12.2,
    unidade: "eventos",
    ativo: true,
    formulaResumo: "ganho_real = valor_desconto_atual - valor_desconto_anterior",
    fonteBaseline: "Histórico real do cliente",
    fonteAtual: "Dados reais do NextTime",
    janelaComparacao: "Competência vs competência anterior",
    observacoes: "Captura correta de desconto. Redução de perda por evento não tratado.",
    evolucaoMensal: gerarEvolucaoDriverComTotal(12400, "melhora", 0.52, 780000),
    porOperacao: gerarOperacoes("Descontos"),
    upgradePaths: [],
  },
  {
    id: "rhd",
    nome: "Digitalização Operacional",
    modulo: "RH Digital",
    categoria: "monetario",
    competenciaAnterior: 0,
    atual: 4200,
    deltaOperacional: 100,
    valorMonetizado: 630000,
    tipoValor: "custo_evitado",
    confianca: "hibrido",
    tendencia: "up",
    participacao: 9.8,
    unidade: "convocações",
    ativo: true,
    formulaResumo: "ganho = convocações_concluídas × custo_presencial_equivalente",
    fonteBaseline: "Processo presencial equivalente (custo configurado)",
    fonteAtual: "Convocações concluídas com assinatura no RH Digital",
    janelaComparacao: "Volume mensal de convocações assinadas",
    observacoes: "Custo presencial equivalente configurado mas não validado pelo cliente. Híbrido.",
    evolucaoMensal: gerarEvolucaoDriverComTotal(0, "melhora", 1.0, 630000),
    porOperacao: gerarOperacoes("RH Digital"),
    upgradePaths: [
      { de: "hibrido", para: "comprovado", acao: "Validar custos presenciais com o cliente", impacto: "+R$ 0 (melhora confiança)" }
    ],
  },
  {
    id: "fech",
    nome: "Tempo de Fechamento do Ponto",
    modulo: "NextTime",
    categoria: "monetario",
    competenciaAnterior: 12,
    atual: 5,
    deltaOperacional: -58.3,
    valorMonetizado: 504000,
    tipoValor: "custo_evitado",
    confianca: "hibrido",
    tendencia: "up",
    participacao: 7.9,
    unidade: "dias",
    ativo: true,
    formulaResumo: "ganho = dias_reduzidos × custo_administrativo_hora × horas_dia × equipe_fechamento",
    fonteBaseline: "Histórico de fechamento no NextTime",
    fonteAtual: "Data de fechamento atual no NextTime",
    janelaComparacao: "Média móvel de 3 competências",
    observacoes: "Dias reais, custo médio administrativo configurado. Híbrido.",
    evolucaoMensal: gerarEvolucaoDriverComTotal(12, "melhora", 0.58, 504000),
    porOperacao: gerarOperacoes("Fechamento"),
    upgradePaths: [
      { de: "hibrido", para: "comprovado", acao: "Importar custo real da equipe de fechamento", impacto: "Melhora confiança" }
    ],
  },
  {
    id: "disp",
    nome: "Passivo Trabalhista",
    modulo: "NextCompliance",
    categoria: "monetario",
    competenciaAnterior: 28,
    atual: 16,
    deltaOperacional: -42.9,
    valorMonetizado: 960000,
    tipoValor: "perda_evitada",
    confianca: "hibrido",
    tendencia: "up",
    participacao: 15.0,
    unidade: "processos",
    ativo: true,
    formulaResumo: "ganho = processos_evitados × custo_médio_processo",
    fonteBaseline: "Contagem de processos parcial + compliance",
    fonteAtual: "Eventos de compliance e processos informados",
    janelaComparacao: "Acumulado 12 meses",
    observacoes: "Eventos reais de compliance, custo médio por processo configurado. Híbrido.",
    evolucaoMensal: gerarEvolucaoDriverComTotal(28, "melhora", 0.43, 960000),
    porOperacao: gerarOperacoes("Disputas"),
    upgradePaths: [
      { de: "hibrido", para: "comprovado", acao: "Importar base real de processos trabalhistas", impacto: "+R$ 320K em valor comprovado" }
    ],
  },
  {
    id: "quad",
    nome: "Dimensionamento Operacional",
    modulo: "NextOperacional",
    categoria: "monetario",
    competenciaAnterior: 340,
    atual: 280,
    deltaOperacional: -17.6,
    valorMonetizado: 720000,
    tipoValor: "custo_evitado",
    confianca: "comprovado",
    tendencia: "up",
    participacao: 11.2,
    unidade: "postos",
    ativo: true,
    formulaResumo: "ganho = redução_movimentação × custo_real_estrutura",
    fonteBaseline: "Histórico de movimentação/lotação real",
    fonteAtual: "Dados reais de movimentação no NextOperacional",
    janelaComparacao: "Competência vs competência anterior",
    observacoes: "Volume real e custo real. Comprovado.",
    evolucaoMensal: gerarEvolucaoDriverComTotal(340, "melhora", 0.18, 720000),
    porOperacao: gerarOperacoes("Quadro"),
    upgradePaths: [],
  },
  {
    id: "hpnf",
    nome: "Horas Não Faturadas",
    modulo: "NextOperacional",
    categoria: "monetario",
    competenciaAnterior: 8600,
    atual: 5200,
    deltaOperacional: -39.5,
    valorMonetizado: 408000,
    tipoValor: "perda_evitada",
    confianca: "comprovado",
    tendencia: "up",
    participacao: 6.4,
    unidade: "horas",
    ativo: true,
    formulaResumo: "ganho = horas_recuperadas × custo_real_hora",
    fonteBaseline: "Histórico real do cliente",
    fonteAtual: "Dados reais de coberturas no NextOperacional",
    janelaComparacao: "Competência vs competência anterior",
    observacoes: "Horas reais, custo real. Comprovado.",
    evolucaoMensal: gerarEvolucaoDriverComTotal(8600, "melhora", 0.40, 408000),
    porOperacao: gerarOperacoes("HPNF"),
    upgradePaths: [],
  },
  {
    id: "benef",
    nome: "Benefícios",
    modulo: "NextBenefícios",
    categoria: "monetario",
    competenciaAnterior: 0,
    atual: 0,
    deltaOperacional: 0,
    valorMonetizado: 96000,
    tipoValor: "custo_evitado",
    confianca: "referencial",
    tendencia: "stable",
    participacao: 1.5,
    unidade: "R$",
    ativo: true,
    formulaResumo: "ganho = benchmark × colaboradores_elegíveis × percentual_economia_estimado",
    fonteBaseline: "Benchmark de mercado",
    fonteAtual: "Módulo não utilizado — valor referencial",
    janelaComparacao: "Estimativa anual",
    observacoes: "Cliente não utiliza módulo de Benefícios. Valor referencial apenas.",
    evolucaoMensal: mesesPeriodo.map((mes) => ({
      mes, baseline: 0, atual: 0, delta: 0, valor: Math.round(96000 / 12)
    })),
    porOperacao: gerarOperacoes("Benefícios"),
    upgradePaths: [
      { de: "referencial", para: "hibrido", acao: "Ativar módulo de Benefícios", impacto: "+R$ 180K potencial adicional" }
    ],
  },
];

// ====== KPIs DERIVADOS ======
export function getV3KPIs() {
  const monetarios = driversV3.filter(d => d.categoria === "monetario" && d.ativo);
  const valorCapturado = monetarios.reduce((s, d) => s + d.valorMonetizado, 0);
  const custoEvitado = monetarios.filter(d => d.tipoValor === "custo_evitado").reduce((s, d) => s + d.valorMonetizado, 0);
  const perdaEvitada = monetarios.filter(d => d.tipoValor === "perda_evitada").reduce((s, d) => s + d.valorMonetizado, 0);
  const comprovado = monetarios.filter(d => d.confianca === "comprovado").reduce((s, d) => s + d.valorMonetizado, 0);
  const hibrido = monetarios.filter(d => d.confianca === "hibrido").reduce((s, d) => s + d.valorMonetizado, 0);
  const referencial = monetarios.filter(d => d.confianca === "referencial").reduce((s, d) => s + d.valorMonetizado, 0);
  const pctComprovado = Math.round((comprovado / valorCapturado) * 100);

  return {
    valorCapturado,
    custoEvitado,
    perdaEvitada,
    comprovado,
    hibrido,
    referencial,
    pctComprovado,
    driversAtivos: monetarios.length,
    melhorOperacao: "Regional SP",
    maiorRisco: "Regional BA",
  };
}

// ====== OPERAÇÕES ======
export const operacoesV3: V3Operacao[] = [
  { nome: "Regional SP", tipo: "regional", valorCapturado: 2150000, custoEvitado: 1350000, perdaEvitada: 800000, pctComprovado: 78, scoreOperacao: 88, tendencia: "up", colaboradores: 2800, driversPrincipais: ["Horas Extras", "Quadro de Lotação"] },
  { nome: "Regional RJ", tipo: "regional", valorCapturado: 1620000, custoEvitado: 980000, perdaEvitada: 640000, pctComprovado: 72, scoreOperacao: 82, tendencia: "up", colaboradores: 1900, driversPrincipais: ["Horas Extras", "Disputas"] },
  { nome: "Regional MG", tipo: "regional", valorCapturado: 1180000, custoEvitado: 720000, perdaEvitada: 460000, pctComprovado: 69, scoreOperacao: 75, tendencia: "stable", colaboradores: 1400, driversPrincipais: ["Adicional Noturno", "HPNF"] },
  { nome: "Regional PR", tipo: "regional", valorCapturado: 890000, custoEvitado: 560000, perdaEvitada: 330000, pctComprovado: 74, scoreOperacao: 79, tendencia: "up", colaboradores: 1100, driversPrincipais: ["Horas Extras", "Fechamento"] },
  { nome: "Regional BA", tipo: "regional", valorCapturado: 562000, custoEvitado: 310000, perdaEvitada: 252000, pctComprovado: 58, scoreOperacao: 64, tendencia: "down", colaboradores: 800, driversPrincipais: ["Descontos", "RH Digital"] },
];

// ====== ABSENTEÍSMO ======
export const absenteismoV3: AbsenteismoData = {
  taxaGlobal: 4.8,
  horasTotaisAusencia: 84200,
  pctNaoPlanejadas: 38,
  pctCobertas: 72,
  regionalCritica: "Regional BA",
  tendencia: "up",
  distribuicaoTipo: [
    { tipo: "Férias", horas: 33680, pct: 40, color: "#3b82f6" },
    { tipo: "Atestados", horas: 21050, pct: 25, color: "#ef4444" },
    { tipo: "Faltas", horas: 12630, pct: 15, color: "#f97316" },
    { tipo: "Afastamentos", horas: 10104, pct: 12, color: "#8b5cf6" },
    { tipo: "Outros", horas: 6736, pct: 8, color: "#6b7280" },
  ],
  porEstrutura: [
    { nome: "Regional SP", tipo: "regional", taxa: 4.2, horas: 25800, horasPor100: 921, tendencia: "up" },
    { nome: "Regional RJ", tipo: "regional", taxa: 5.1, horas: 21280, horasPor100: 1120, tendencia: "stable" },
    { nome: "Regional MG", tipo: "regional", taxa: 4.6, horas: 14140, horasPor100: 1010, tendencia: "up" },
    { nome: "Regional PR", tipo: "regional", taxa: 4.3, horas: 10384, horasPor100: 944, tendencia: "up" },
    { nome: "Regional BA", tipo: "regional", taxa: 6.8, horas: 12596, horasPor100: 1574, tendencia: "down" },
  ],
  evolucaoMensal: mesesPeriodo.map((mes, i) => ({
    mes,
    taxa: 5.2 - i * 0.04,
    horas: 7200 - i * 50,
    planejadas: 4200 - i * 30,
    naoPlanejadas: 3000 - i * 20,
  })),
};

// ====== COBERTURAS E RISCO ======
export const coberturaRiscoV3: CoberturaRiscoData = {
  taxaCoberturaEfetiva: 72,
  pctReservaTecnica: 28,
  pctHoraExtra: 22,
  tempoMedioReposicao: 3.2,
  horasPostoDescoberto: 4850,
  riscoPotencialGlosa: 580000,
  custoTotalCobertura: 1240000,
  scoreEficiencia: 74,
  tiposCobertura: [
    { tipo: "Cobertura Planejada", quantidade: 3200, pct: 32, custo: 280000, impactoScore: "positivo", color: "#16a34a" },
    { tipo: "Reserva Técnica", quantidade: 2800, pct: 28, custo: 220000, impactoScore: "positivo", color: "#22c55e" },
    { tipo: "Cobertura Emergencial", quantidade: 1600, pct: 16, custo: 320000, impactoScore: "negativo", color: "#f97316" },
    { tipo: "Hora Extra", quantidade: 1200, pct: 12, custo: 280000, impactoScore: "negativo", color: "#ef4444" },
    { tipo: "Hora Regular Fora do Posto", quantidade: 600, pct: 6, custo: 80000, impactoScore: "neutro", color: "#eab308" },
    { tipo: "Extensão de Jornada", quantidade: 400, pct: 4, custo: 45000, impactoScore: "negativo", color: "#dc2626" },
    { tipo: "Ausência Descoberta", quantidade: 200, pct: 2, custo: 15000, impactoScore: "negativo", color: "#991b1b" },
  ],
  evolucaoMensal: mesesPeriodo.map((mes, i) => ({
    mes,
    planejada: 260 + i * 5,
    emergencial: 150 - i * 3,
    reservaTecnica: 230 + i * 3,
    horaExtra: 110 - i * 2,
    descoberto: 450 - i * 20,
    score: 68 + i * 0.5,
  })),
  porEstrutura: [
    { nome: "Regional SP", tipo: "regional", score: 82, custoCobertura: 420000, horasDescoberto: 850, tendencia: "up" },
    { nome: "Regional RJ", tipo: "regional", score: 76, custoCobertura: 310000, horasDescoberto: 1100, tendencia: "stable" },
    { nome: "Regional MG", tipo: "regional", score: 72, custoCobertura: 240000, horasDescoberto: 920, tendencia: "up" },
    { nome: "Regional PR", tipo: "regional", score: 78, custoCobertura: 170000, horasDescoberto: 680, tendencia: "up" },
    { nome: "Regional BA", tipo: "regional", score: 58, custoCobertura: 100000, horasDescoberto: 1300, tendencia: "down" },
  ],
};

// ====== PERFORMANCE DO TIME ======
export const performanceTimeV3: PerformanceTimeData = {
  totalAcoes: 48200,
  usuariosAtivos: 142,
  mediaAcoesPorUsuario: 339,
  acoesPor100Colaboradores: 602,
  scoreEficiencia: 78,
  tiposAcao: [
    { tipo: "Ajustes de Ponto", quantidade: 18300, pct: 38, color: "#3b82f6" },
    { tipo: "Trocas de Escala", quantidade: 9640, pct: 20, color: "#8b5cf6" },
    { tipo: "Coberturas", quantidade: 8676, pct: 18, color: "#16a34a" },
    { tipo: "Ausências", quantidade: 6748, pct: 14, color: "#f97316" },
    { tipo: "Outros Lançamentos", quantidade: 4820, pct: 10, color: "#6b7280" },
  ],
  porEstrutura: [
    { nome: "Regional SP", tipo: "regional", acoes: 16870, usuarios: 48, mediaPorUsuario: 351, acoesPor100: 602, score: 84 },
    { nome: "Regional RJ", tipo: "regional", acoes: 11568, usuarios: 34, mediaPorUsuario: 340, acoesPor100: 609, score: 78 },
    { nome: "Regional MG", tipo: "regional", acoes: 8676, usuarios: 24, mediaPorUsuario: 362, acoesPor100: 620, score: 76 },
    { nome: "Regional PR", tipo: "regional", acoes: 6748, usuarios: 22, mediaPorUsuario: 307, acoesPor100: 613, score: 74 },
    { nome: "Regional BA", tipo: "regional", acoes: 4338, usuarios: 14, mediaPorUsuario: 310, acoesPor100: 542, score: 65 },
  ],
  topUsuarios: [
    { nome: "Maria Silva", cargo: "Coord. RH", acoes: 890, tipos: ["Ajustes", "Coberturas"], estrutura: "Regional SP" },
    { nome: "João Santos", cargo: "Supervisor", acoes: 780, tipos: ["Trocas", "Ausências"], estrutura: "Regional SP" },
    { nome: "Ana Oliveira", cargo: "Coord. RH", acoes: 720, tipos: ["Ajustes", "Coberturas"], estrutura: "Regional RJ" },
    { nome: "Carlos Souza", cargo: "Supervisor", acoes: 680, tipos: ["Trocas", "Ajustes"], estrutura: "Regional MG" },
    { nome: "Patricia Lima", cargo: "Analista RH", acoes: 650, tipos: ["Ajustes", "Ausências"], estrutura: "Regional RJ" },
    { nome: "Roberto Costa", cargo: "Coord. Operações", acoes: 620, tipos: ["Coberturas", "Trocas"], estrutura: "Regional PR" },
    { nome: "Fernanda Alves", cargo: "Supervisor", acoes: 590, tipos: ["Ajustes", "Coberturas"], estrutura: "Regional SP" },
    { nome: "Lucas Pereira", cargo: "Analista RH", acoes: 540, tipos: ["Trocas", "Ausências"], estrutura: "Regional MG" },
    { nome: "Juliana Mendes", cargo: "Coord. RH", acoes: 510, tipos: ["Ajustes", "Coberturas"], estrutura: "Regional BA" },
    { nome: "Ricardo Gomes", cargo: "Supervisor", acoes: 480, tipos: ["Trocas", "Ajustes"], estrutura: "Regional PR" },
  ],
  evolucaoMensal: mesesPeriodo.map((mes, i) => ({
    mes,
    acoes: 3600 + i * 150,
    usuarios: 130 + i,
    media: 27 + i * 0.8,
  })),
};

// ====== OWNERSHIP ======
export const ownershipV3 = {
  custoMensal: 130000,
  custoAnual: 1560000,
};

// ====== EVOLUÇÃO MENSAL CONSOLIDADA ======
export function getEvolucaoConsolidada() {
  // Realistic monthly values with seasonal variation
  const valoresMensais = [
    380000, 420000, 465000, 510000, 485000, 540000,
    620000, 580000, 650000, 710000, 690000, 780000
  ];
  let acumulado = 0;

  return mesesPeriodo.map((mes, i) => {
    const valorCapturado = valoresMensais[i];
    acumulado += valorCapturado;
    const custoEvitado = Math.round(valorCapturado * (0.55 + Math.sin(i * 0.5) * 0.08));
    const perdaEvitada = valorCapturado - custoEvitado;
    const comprovado = Math.round(valorCapturado * (0.45 + i * 0.025));
    const hibrido = Math.round(valorCapturado * (0.38 - i * 0.01));
    const referencial = valorCapturado - comprovado - hibrido;
    const pctComprovado = Math.round((comprovado / valorCapturado) * 100);
    const meta = Math.round(420000 + i * 35000);

    return {
      mes,
      valorCapturado,
      acumulado,
      custoEvitado,
      perdaEvitada,
      comprovado,
      hibrido,
      referencial,
      pctComprovado,
      meta,
    };
  });
}

// ====== INSIGHTS AUTOMÁTICOS ======
export function generateV3Insights(): string[] {
  const kpis = getV3KPIs();
  const insights: string[] = [];
  
  insights.push(`A operação capturou ${formatCurrencyV3(kpis.valorCapturado)} no período, com ${kpis.pctComprovado}% comprovado por dados reais.`);
  insights.push(`Custo evitado de ${formatCurrencyV3(kpis.custoEvitado)} concentrado em redução de horas extras e otimização de quadro.`);
  insights.push(`Perda evitada de ${formatCurrencyV3(kpis.perdaEvitada)} com destaque para redução de disputas trabalhistas e recuperação de descontos.`);
  
  const piorRegional = coberturaRiscoV3.porEstrutura.find(e => e.tendencia === "down");
  if (piorRegional) {
    insights.push(`A ${piorRegional.nome} apresenta tendência de piora no score de cobertura (${piorRegional.score} pontos) e merece atenção.`);
  }
  
  insights.push(`O % de valor comprovado evoluiu de 45% para ${kpis.pctComprovado}% ao longo do período, indicando maturidade crescente dos dados.`);
  insights.push(`A taxa de absenteísmo global está em ${absenteismoV3.taxaGlobal}%, com ${absenteismoV3.pctNaoPlanejadas}% de ausências não planejadas.`);
  
  return insights;
}

// ====== OPORTUNIDADES ======
export interface V3Oportunidade {
  driver: string;
  tipo: "quick_win" | "estrutural";
  acao: string;
  impactoEstimado: number;
  esforco: "baixo" | "medio" | "alto";
  prazoEstimado: string;
  detalhe: string;
}

export const oportunidadesV3: V3Oportunidade[] = [
  { driver: "Disputas Trabalhistas", tipo: "estrutural", acao: "Importar base real de processos", impactoEstimado: 320000, esforco: "medio", prazoEstimado: "30-60 dias", detalhe: "Migrar de híbrido para comprovado importando dados de processos reais" },
  { driver: "RH Digital", tipo: "quick_win", acao: "Validar custos presenciais com o cliente", impactoEstimado: 0, esforco: "baixo", prazoEstimado: "7-14 dias", detalhe: "Validação eleva confiança de híbrido para comprovado sem alterar valor" },
  { driver: "Benefícios", tipo: "estrutural", acao: "Ativar módulo de Benefícios", impactoEstimado: 180000, esforco: "alto", prazoEstimado: "60-90 dias", detalhe: "Ativação do módulo permite captura real vs referencial atual" },
  { driver: "Fechamento", tipo: "quick_win", acao: "Importar custo real da equipe de fechamento", impactoEstimado: 0, esforco: "baixo", prazoEstimado: "7 dias", detalhe: "Melhoria de confiança sem alteração de valor" },
  { driver: "Coberturas", tipo: "estrutural", acao: "Reduzir coberturas emergenciais em 15%", impactoEstimado: 120000, esforco: "medio", prazoEstimado: "60-90 dias", detalhe: "Migração para coberturas planejadas e reserva técnica" },
  { driver: "Absenteísmo BA", tipo: "quick_win", acao: "Plano de ação Regional BA (taxa 6.8%)", impactoEstimado: 95000, esforco: "medio", prazoEstimado: "30-60 dias", detalhe: "Reduzir absenteísmo da regional com maior taxa para a média (4.8%)" },
];

export function getPotencialAdicional(): number {
  return oportunidadesV3.reduce((s, o) => s + o.impactoEstimado, 0);
}

// ====== PESOS DE CONFIANÇA ======
export interface PesosConfianca {
  comprovado: number;
  hibrido: number;
  referencial: number;
  sobrescritaPorDriver?: Record<string, Partial<Record<ConfiancaTipo, number>>>;
}

export const pesosConfiancaV3: PesosConfianca = {
  comprovado: 1.0,
  hibrido: 0.70,
  referencial: 0.35,
  sobrescritaPorDriver: {
    he: { hibrido: 0.85 },
    disp: { hibrido: 0.60 },
    benef: { referencial: 0.25 },
  },
};

export function getPesoDriver(driverId: string, confianca: ConfiancaTipo): number {
  const sobrescrita = pesosConfiancaV3.sobrescritaPorDriver?.[driverId]?.[confianca];
  if (sobrescrita !== undefined) return sobrescrita;
  return pesosConfiancaV3[confianca];
}

// ====== NÍVEL DE CONFIANÇA ======
export function getNivelConfianca(): number {
  const monetarios = driversV3.filter(d => d.categoria === "monetario" && d.ativo);
  const somaValorPonderado = monetarios.reduce((s, d) => s + d.valorMonetizado * getPesoDriver(d.id, d.confianca), 0);
  const somaValor = monetarios.reduce((s, d) => s + d.valorMonetizado, 0);
  if (somaValor === 0) return 0;
  return Math.round((somaValorPonderado / somaValor) * 100);
}

// ====== SCORE OPERACIONAL ======
export function getScoreOperacional(): number {
  // Composição: absenteísmo (25%), cobertura (25%), postos descobertos (20%), reserva técnica (10%), dependência HE (10%), performance (10%)
  const absScore = Math.max(0, 100 - (absenteismoV3.taxaGlobal - 3) * 15); // 3% ideal
  const cobScore = coberturaRiscoV3.scoreEficiencia;
  const descScore = Math.max(0, 100 - (coberturaRiscoV3.horasPostoDescoberto / 100));
  const rtScore = Math.min(100, coberturaRiscoV3.pctReservaTecnica * 3);
  const heDepScore = Math.max(0, 100 - coberturaRiscoV3.pctHoraExtra * 3);
  const perfScore = performanceTimeV3.scoreEficiencia;

  return Math.round(
    absScore * 0.25 + cobScore * 0.25 + descScore * 0.20 + rtScore * 0.10 + heDepScore * 0.10 + perfScore * 0.10
  );
}

export function getScoreFaixa(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Excelência Operacional", color: "#16a34a" };
  if (score >= 75) return { label: "Saudável", color: "#22c55e" };
  if (score >= 60) return { label: "Atenção", color: "#eab308" };
  return { label: "Crítico", color: "#ef4444" };
}

// ====== CONFIG DE ROI ======
export const configV3 = {
  empresa: {
    nome: "Orsegups",
    colaboradores: 8000,
    dispositivos: 7200,
    custoColaborador: 4200,
    custoDispositivo: 18,
    ownershipMensal: 130000,
    ownershipAnual: 1560000,
    salarioMedio: 2100,
    encargos: 68,
    custoAdminHora: 45,
    custoMedioProcesso: 80000,
  },
  rhDigital: {
    custoDeslocamento: 35,
    tempoSupervisorMin: 40,
    custoHoraSupervisor: 55,
    custoImpressao: 5,
    custoColeta: 15,
    custoDigitalizacao: 8,
  },
  beneficios: {
    custoMedioVT: 220,
    custoMedioVR: 550,
    custoMedioVA: 0,
    pctElegivel: 85,
    diasUteis: 22,
    ticketMedio: 25,
  },
  custoMedioEventos: {
    custoMedioHE: 32,
    custoMedioAN: 18,
    custoMedioDescontoPorEvento: 45,
    custoMedioAdminHora: 45,
    custoMedioProcesso: 80000,
  },
};
