// analytics-mock-data.ts
// Dados mockados para o módulo Nexti Analytics V1
// Todos os componentes do Analytics devem importar dados deste arquivo.
// Nenhum valor deve ser hardcoded nos componentes.

// ============================================================
// TIPOS
// ============================================================

export interface KpiCard {
  label: string;
  valor: string | number;
  detalhe?: string;
  cor?: "success" | "warning" | "destructive" | "default";
  tendencia?: "melhorando" | "estavel" | "piorando";
}

export interface RegionalRow {
  nome: string;
  [key: string]: string | number | undefined;
}

export interface InsightItem {
  icone: string;
  texto: string;
  tipo: "positivo" | "atencao" | "negativo" | "informativo" | "confianca";
}

export interface EvolucaoMensal {
  competencia: string;
  [key: string]: string | number;
}

// ============================================================
// COMPETÊNCIAS (12 meses)
// ============================================================

export const competencias = [
  "abr/25", "mai/25", "jun/25", "jul/25", "ago/25", "set/25",
  "out/25", "nov/25", "dez/25", "jan/26", "fev/26", "mar/26"
];

// ============================================================
// RESUMO EXECUTIVO
// ============================================================

export const resumo = {
  economiaGerada: "R$ 6.4M",
  economiaGeradaNumero: 6400000,
  scoreOperacional: 71,
  scoreFaixa: "Atenção" as const,
  periodo: "abr/2025 – mar/2026",
  cliente: "Orsegups",
  colaboradores: 8000,

  nivelConfianca: 88,

  principalAlavanca: {
    nome: "Horas Extras",
    valor: "R$ 1.4M",
    participacao: "22.1%",
  },

  melhorOperacao: {
    nome: "Regional SP",
    score: 88,
    tendencia: "alta" as const,
  },

  maiorRisco: {
    nome: "Regional BA",
    score: 64,
    indicador: "Absenteísmo 6.8%",
  },

  economiaMedia: 533333,

  insights: [
    { icone: "⚡", texto: "A operação gerou R$ 6.4M no período, puxada principalmente por Horas Extras.", tipo: "positivo" as const },
    { icone: "✅", texto: "A Regional SP apresentou a melhor combinação entre disciplina operacional e estabilidade no período.", tipo: "positivo" as const },
    { icone: "🔴", texto: "A Regional BA concentra o maior risco atual, pressionada por absenteísmo e movimentações acima da média.", tipo: "negativo" as const },
    { icone: "✅", texto: "A qualidade do ponto evoluiu ao longo do período, indicando menor necessidade de intervenção corretiva.", tipo: "positivo" as const },
    { icone: "🔒", texto: "O nível de confiança da economia gerada permanece em 88%, sustentado por drivers com base robusta.", tipo: "confianca" as const },
    { icone: "⚠️", texto: "O crescimento da economia gerada está associado à melhora operacional observada nas competências finais da série.", tipo: "atencao" as const },
    { icone: "⚠️", texto: "A combinação entre absenteísmo e movimentações indica necessidade de atuação da liderança em determinadas regionais.", tipo: "atencao" as const },
  ] as InsightItem[],
};

// ============================================================
// EVOLUÇÃO MENSAL (gráficos do Resumo Executivo)
// ============================================================

export const evolucaoVetores: EvolucaoMensal[] = [
  { competencia: "abr/25", qualidadePonto: 83.2, absenteismo: 5.4, pressaoOperacional: 68 },
  { competencia: "mai/25", qualidadePonto: 84.1, absenteismo: 5.1, pressaoOperacional: 65 },
  { competencia: "jun/25", qualidadePonto: 84.5, absenteismo: 5.6, pressaoOperacional: 67 },
  { competencia: "jul/25", qualidadePonto: 85.0, absenteismo: 5.3, pressaoOperacional: 64 },
  { competencia: "ago/25", qualidadePonto: 85.3, absenteismo: 5.0, pressaoOperacional: 62 },
  { competencia: "set/25", qualidadePonto: 85.8, absenteismo: 4.8, pressaoOperacional: 60 },
  { competencia: "out/25", qualidadePonto: 86.2, absenteismo: 4.9, pressaoOperacional: 58 },
  { competencia: "nov/25", qualidadePonto: 86.5, absenteismo: 4.7, pressaoOperacional: 56 },
  { competencia: "dez/25", qualidadePonto: 86.1, absenteismo: 5.2, pressaoOperacional: 61 },
  { competencia: "jan/26", qualidadePonto: 87.0, absenteismo: 4.5, pressaoOperacional: 54 },
  { competencia: "fev/26", qualidadePonto: 87.8, absenteismo: 4.3, pressaoOperacional: 52 },
  { competencia: "mar/26", qualidadePonto: 87.3, absenteismo: 4.8, pressaoOperacional: 55 },
];

export const evolucaoEconomia: EvolucaoMensal[] = [
  { competencia: "abr/25", valor: 280000 },
  { competencia: "mai/25", valor: 320000 },
  { competencia: "jun/25", valor: 380000 },
  { competencia: "jul/25", valor: 420000 },
  { competencia: "ago/25", valor: 450000 },
  { competencia: "set/25", valor: 510000 },
  { competencia: "out/25", valor: 560000 },
  { competencia: "nov/25", valor: 620000 },
  { competencia: "dez/25", valor: 580000 },
  { competencia: "jan/26", valor: 680000 },
  { competencia: "fev/26", valor: 750000 },
  { competencia: "mar/26", valor: 850000 },
];

// ============================================================
// DISCIPLINA OPERACIONAL
// ============================================================

export const disciplina = {
  // --- Qualidade do Ponto ---
  qualidade: {
    percentual: 87.3,
    registradas: "892.0K",
    registradasNum: 892000,
    justificadas: "130.2K",
    justificadasNum: 130200,
    tendencia: "Melhorando" as const,

    evolucao: [
      { competencia: "abr/25", valor: 83.2 }, { competencia: "mai/25", valor: 84.1 },
      { competencia: "jun/25", valor: 84.5 }, { competencia: "jul/25", valor: 85.0 },
      { competencia: "ago/25", valor: 85.3 }, { competencia: "set/25", valor: 85.8 },
      { competencia: "out/25", valor: 86.2 }, { competencia: "nov/25", valor: 86.5 },
      { competencia: "dez/25", valor: 86.1 }, { competencia: "jan/26", valor: 87.0 },
      { competencia: "fev/26", valor: 87.8 }, { competencia: "mar/26", valor: 87.3 },
    ],
    mediaAnual: 85.7,

    distribuicao: [
      { name: "Registradas", value: 87, cor: "hsl(var(--success))" },
      { name: "Justificadas", value: 13, cor: "hsl(var(--warning))" },
    ],

    regionais: [
      { nome: "Regional SP", qualidade: 89.2, registradas: "268.0K", justificadas: "32.4K", atrasos: 10.1, tendencia: "melhorando" },
      { nome: "Regional RJ", qualidade: 86.8, registradas: "189.0K", justificadas: "28.8K", atrasos: 12.3, tendencia: "estavel" },
      { nome: "Regional MG", qualidade: 88.1, registradas: "152.0K", justificadas: "20.6K", atrasos: 11.5, tendencia: "melhorando" },
      { nome: "Regional PR", qualidade: 87.5, registradas: "138.0K", justificadas: "19.4K", atrasos: 13.2, tendencia: "melhorando" },
      { nome: "Regional BA", qualidade: 82.4, registradas: "145.0K", justificadas: "29.0K", atrasos: 16.8, tendencia: "piorando" },
    ] as RegionalRow[],

    insightsEspecificos: [
      { icone: "🔴", texto: "A Regional BA apresenta a menor Qualidade do Ponto (82.4%) combinada com maior taxa de atrasos (16.8%), indicando problema de disciplina operacional.", tipo: "negativo" as const },
      { icone: "✅", texto: "A Qualidade do Ponto melhorou de 83.2% para 87.3% no período, com 4 das 5 regionais em tendência positiva.", tipo: "positivo" as const },
    ] as InsightItem[],
  },

  // --- Pontualidade ---
  pontualidade: {
    percentual: 12.4,
    minutosMedia: 18,
    tendencia: "Melhorando" as const,
  },

  // --- Absenteísmo ---
  absenteismo: {
    taxaGlobal: 4.8,
    horasTotais: "84.2K",
    faltasNaoJustificadas: 38,
    cobertas: 72,
    regionalCritica: "Regional BA",

    evolucaoTipo: [
      { competencia: "abr/25", atestados: 2100, faltas: 1200 },
      { competencia: "mai/25", atestados: 2000, faltas: 1100 },
      { competencia: "jun/25", atestados: 2300, faltas: 1300 },
      { competencia: "jul/25", atestados: 2150, faltas: 1150 },
      { competencia: "ago/25", atestados: 2050, faltas: 1050 },
      { competencia: "set/25", atestados: 1950, faltas: 1000 },
      { competencia: "out/25", atestados: 2100, faltas: 1100 },
      { competencia: "nov/25", atestados: 2200, faltas: 1050 },
      { competencia: "dez/25", atestados: 2400, faltas: 1250 },
      { competencia: "jan/26", atestados: 2050, faltas: 980 },
      { competencia: "fev/26", atestados: 1900, faltas: 920 },
      { competencia: "mar/26", atestados: 2000, faltas: 1000 },
    ],

    evolucaoTaxa: [
      { competencia: "abr/25", valor: 5.4 }, { competencia: "mai/25", valor: 5.1 },
      { competencia: "jun/25", valor: 5.6 }, { competencia: "jul/25", valor: 5.3 },
      { competencia: "ago/25", valor: 5.0 }, { competencia: "set/25", valor: 4.8 },
      { competencia: "out/25", valor: 4.9 }, { competencia: "nov/25", valor: 4.7 },
      { competencia: "dez/25", valor: 5.2 }, { competencia: "jan/26", valor: 4.5 },
      { competencia: "fev/26", valor: 4.3 }, { competencia: "mar/26", valor: 4.8 },
    ],
    mediaAnualTaxa: 4.97,

    regionais: [
      { nome: "Regional SP", taxa: 4.2, horas: "25.8K", horasPor100: 921, turnover: 7.1, tendencia: "melhorando" },
      { nome: "Regional RJ", taxa: 5.1, horas: "21.3K", horasPor100: 1120, turnover: 8.5, tendencia: "estavel" },
      { nome: "Regional MG", taxa: 4.6, horas: "14.1K", horasPor100: 1010, turnover: 7.8, tendencia: "melhorando" },
      { nome: "Regional PR", taxa: 4.3, horas: "10.4K", horasPor100: 944, turnover: 6.9, tendencia: "melhorando" },
      { nome: "Regional BA", taxa: 6.8, horas: "12.6K", horasPor100: 1574, turnover: 11.3, tendencia: "piorando" },
    ] as RegionalRow[],

    insightsEspecificos: [
      { icone: "🔴", texto: "A Regional BA lidera em absenteísmo (6.8%) e turnover (11.3%), indicando problema estrutural de retenção, não apenas pontual.", tipo: "negativo" as const },
      { icone: "📊", texto: "72% das ausências geraram cobertura. Os 28% restantes representam risco de glosa ou posto descoberto.", tipo: "informativo" as const },
    ] as InsightItem[],
  },

  // --- Turnover ---
  turnover: {
    taxa: 8.2,
    desligamentos: 654,
    tendencia: "Estável" as const,
  },

  // --- Movimentações ---
  movimentacoes: {
    trocasEscala: "14.8K",
    trocasPosto: "8.2K",
    totalMovimentacoes: "23.0K",
    tendencia: "Melhorando" as const,

    evolucao: [
      { competencia: "abr/25", trocasEscala: 1450, trocasPosto: 850 },
      { competencia: "mai/25", trocasEscala: 1380, trocasPosto: 820 },
      { competencia: "jun/25", trocasEscala: 1420, trocasPosto: 790 },
      { competencia: "jul/25", trocasEscala: 1350, trocasPosto: 750 },
      { competencia: "ago/25", trocasEscala: 1280, trocasPosto: 720 },
      { competencia: "set/25", trocasEscala: 1220, trocasPosto: 680 },
      { competencia: "out/25", trocasEscala: 1180, trocasPosto: 650 },
      { competencia: "nov/25", trocasEscala: 1150, trocasPosto: 630 },
      { competencia: "dez/25", trocasEscala: 1300, trocasPosto: 700 },
      { competencia: "jan/26", trocasEscala: 1100, trocasPosto: 620 },
      { competencia: "fev/26", trocasEscala: 1050, trocasPosto: 590 },
      { competencia: "mar/26", trocasEscala: 1020, trocasPosto: 580 },
    ],
    mediaAnual: 1908,

    tempoFechamento: { media: 7.2, tendencia: "Piorando" as const },

    regionais: [
      { nome: "Regional SP", trocasEscala: "4.8K", trocasPosto: "2.6K", total: "7.4K", por100: 264, tempoFechamento: 6.1, tendencia: "melhorando" },
      { nome: "Regional RJ", trocasEscala: "3.4K", trocasPosto: "1.9K", total: "5.3K", por100: 279, tempoFechamento: 7.5, tendencia: "estavel" },
      { nome: "Regional MG", trocasEscala: "2.6K", trocasPosto: "1.4K", total: "4.0K", por100: 286, tempoFechamento: 7.0, tendencia: "melhorando" },
      { nome: "Regional PR", trocasEscala: "2.2K", trocasPosto: "1.2K", total: "3.4K", por100: 309, tempoFechamento: 8.2, tendencia: "piorando" },
      { nome: "Regional BA", trocasEscala: "1.8K", trocasPosto: "1.1K", total: "2.9K", por100: 363, tempoFechamento: 9.1, tendencia: "piorando" },
    ] as RegionalRow[],

    insightsEspecificos: [
      { icone: "✅", texto: "As movimentações reduziram 20% no período (de 2.3K para 1.6K/mês), indicando maior estabilidade de escala.", tipo: "positivo" as const },
      { icone: "⚠️", texto: "A Regional BA tem 363 movimentações/100 colab. (37% acima da Regional SP), indicando instabilidade operacional.", tipo: "atencao" as const },
    ] as InsightItem[],
  },

  // --- Insights cruzados (compartilhados entre as 3 sub-abas) ---
  insightsCruzados: [
    { icone: "✅", texto: "As movimentações reduziram ao longo do período, mas a Qualidade do Ponto melhorou, sugerindo maior efetividade da liderança.", tipo: "positivo" as const },
    { icone: "🔴", texto: "A Regional BA apresenta a menor Qualidade do Ponto (82.4%) combinada com maior taxa de absenteísmo (6.8%), indicando piora da disciplina operacional.", tipo: "negativo" as const },
    { icone: "✅", texto: "A Regional SP lidera em qualidade e estabilidade, com menor pressão sobre trocas de escala proporcionalmente.", tipo: "positivo" as const },
    { icone: "⚠️", texto: "O absenteísmo permaneceu estável no período, porém trocas de posto cresceram na Regional PR, sugerindo desequilíbrio de planejamento.", tipo: "atencao" as const },
  ] as InsightItem[],
};

// ============================================================
// COBERTURAS, CONTINUIDADE E COMPLIANCE
// ============================================================

export const coberturas = {
  scoreEficiencia: 74,
  scoreFaixa: "Atenção" as const,
  scoreDiferenca: 3,

  kpis: {
    ausenciasCobertas: 72,
    coberturasComHE: 24,
    diasPostoDescoberto: 286,
    tempoMedioReposicao: 3.2,
  },

  distribuicaoTipoEvento: [
    { name: "Hora Regular", value: 52, cor: "#22c55e" },
    { name: "Hora Extra", value: 24, cor: "#ef4444" },
    { name: "Falta", value: 14, cor: "#f97316" },
    { name: "Atrasos", value: 10, cor: "#eab308" },
  ],

  evolucao: [
    { competencia: "abr/25", regular: 310, he: 150, falta: 80, atrasos: 60 },
    { competencia: "mai/25", regular: 320, he: 140, falta: 75, atrasos: 55 },
    { competencia: "jun/25", regular: 315, he: 155, falta: 82, atrasos: 58 },
    { competencia: "jul/25", regular: 335, he: 135, falta: 70, atrasos: 50 },
    { competencia: "ago/25", regular: 350, he: 125, falta: 65, atrasos: 48 },
    { competencia: "set/25", regular: 360, he: 120, falta: 60, atrasos: 45 },
    { competencia: "out/25", regular: 370, he: 115, falta: 55, atrasos: 42 },
    { competencia: "nov/25", regular: 365, he: 110, falta: 52, atrasos: 40 },
    { competencia: "dez/25", regular: 340, he: 140, falta: 72, atrasos: 55 },
    { competencia: "jan/26", regular: 380, he: 105, falta: 48, atrasos: 38 },
    { competencia: "fev/26", regular: 390, he: 100, falta: 45, atrasos: 35 },
    { competencia: "mar/26", regular: 385, he: 105, falta: 48, atrasos: 38 },
  ],

  regionais: [
    { nome: "Regional SP", coberturas: 2840, score: 82, regular: 58, regularH: "4.2K", he: 20, heH: "1.4K", falta: 12, faltaH: "890", atrasos: 10, atrasosH: "720", tendencia: "melhorando" },
    { nome: "Regional RJ", coberturas: 2120, score: 71, regular: 52, regularH: "2.8K", he: 26, heH: "1.4K", falta: 14, faltaH: "750", atrasos: 8, atrasosH: "430", tendencia: "estavel" },
    { nome: "Regional MG", coberturas: 1560, score: 76, regular: 54, regularH: "2.1K", he: 22, heH: "870", falta: 13, faltaH: "510", atrasos: 11, atrasosH: "430", tendencia: "melhorando" },
    { nome: "Regional PR", coberturas: 1180, score: 65, regular: 48, regularH: "1.4K", he: 28, heH: "840", falta: 15, faltaH: "450", atrasos: 9, atrasosH: "270", tendencia: "piorando" },
    { nome: "Regional BA", coberturas: 980, score: 58, regular: 42, regularH: "1.0K", he: 32, heH: "800", falta: 16, faltaH: "400", atrasos: 10, atrasosH: "250", tendencia: "piorando" },
  ] as any[],

  insights: [
    { icone: "✅", texto: "52% das coberturas geraram apenas hora regular, indicando boa eficiência operacional na reposição.", tipo: "positivo" as const },
    { icone: "🔴", texto: "Regional BA tem o maior percentual de coberturas com hora extra (32%), quase o dobro da Regional SP (20%).", tipo: "negativo" as const },
    { icone: "⚠️", texto: "Faltas e atrasos representam 24% dos eventos de cobertura. Reduzir absenteísmo impacta diretamente a qualidade das coberturas.", tipo: "atencao" as const },
  ] as InsightItem[],
};

// ============================================================
// BANCO DE HORAS
// ============================================================

export const bancoHoras = {
  saldoTotal: "45.2K",
  saldoMedioPorColab: 5.6,
  colaboradoresCriticos: 342,
  tendencia: "Crescendo" as const,

  evolucao: [
    { competencia: "abr/25", creditos: 4200, debitos: 3800, saldo: 400 },
    { competencia: "mai/25", creditos: 4500, debitos: 3700, saldo: 1200 },
    { competencia: "jun/25", creditos: 4800, debitos: 3600, saldo: 2400 },
    { competencia: "jul/25", creditos: 4600, debitos: 3500, saldo: 3500 },
    { competencia: "ago/25", creditos: 4400, debitos: 3400, saldo: 4500 },
    { competencia: "set/25", creditos: 4300, debitos: 3300, saldo: 5500 },
    { competencia: "out/25", creditos: 4500, debitos: 3200, saldo: 6800 },
    { competencia: "nov/25", creditos: 4700, debitos: 3100, saldo: 8400 },
    { competencia: "dez/25", creditos: 5000, debitos: 3500, saldo: 9900 },
    { competencia: "jan/26", creditos: 4400, debitos: 3000, saldo: 11300 },
    { competencia: "fev/26", creditos: 4200, debitos: 2900, saldo: 12600 },
    { competencia: "mar/26", creditos: 4100, debitos: 2800, saldo: 13900 },
  ],

  regionais: [
    { nome: "Regional SP", saldo: "16.2K", creditos: "18.5K", debitos: "14.3K", colabCriticos: 120, tendencia: "melhorando" },
    { nome: "Regional RJ", saldo: "11.4K", creditos: "14.2K", debitos: "10.8K", colabCriticos: 85, tendencia: "estavel" },
    { nome: "Regional MG", saldo: "8.1K", creditos: "10.1K", debitos: "8.0K", colabCriticos: 55, tendencia: "melhorando" },
    { nome: "Regional PR", saldo: "5.3K", creditos: "6.8K", debitos: "5.5K", colabCriticos: 42, tendencia: "piorando" },
    { nome: "Regional BA", saldo: "4.2K", creditos: "5.9K", debitos: "4.7K", colabCriticos: 40, tendencia: "piorando" },
  ] as RegionalRow[],
};

// ============================================================
// COMPLIANCE
// ============================================================

export const compliance = {
  totalViolacoes: 847,
  violacoesPor100: 10.6,
  tipoMaisFrequente: "Interjornada",
  regionalCritica: "Regional RJ",

  evolucao: [
    { competencia: "abr/25", interjornada: 42, setimoDia: 18, intervalo: 12, outros: 8 },
    { competencia: "mai/25", interjornada: 38, setimoDia: 15, intervalo: 10, outros: 7 },
    { competencia: "jun/25", interjornada: 45, setimoDia: 20, intervalo: 14, outros: 9 },
    { competencia: "jul/25", interjornada: 40, setimoDia: 17, intervalo: 11, outros: 6 },
    { competencia: "ago/25", interjornada: 36, setimoDia: 14, intervalo: 10, outros: 5 },
    { competencia: "set/25", interjornada: 34, setimoDia: 13, intervalo: 9, outros: 5 },
    { competencia: "out/25", interjornada: 32, setimoDia: 12, intervalo: 8, outros: 4 },
    { competencia: "nov/25", interjornada: 30, setimoDia: 11, intervalo: 8, outros: 4 },
    { competencia: "dez/25", interjornada: 38, setimoDia: 16, intervalo: 11, outros: 7 },
    { competencia: "jan/26", interjornada: 28, setimoDia: 10, intervalo: 7, outros: 3 },
    { competencia: "fev/26", interjornada: 26, setimoDia: 9, intervalo: 6, outros: 3 },
    { competencia: "mar/26", interjornada: 29, setimoDia: 11, intervalo: 7, outros: 4 },
  ],

  regionais: [
    { nome: "Regional SP", interjornada: 85, setimoDia: 32, intervalo: 22, total: 152, tendencia: "melhorando" },
    { nome: "Regional RJ", interjornada: 120, setimoDia: 48, intervalo: 35, total: 220, tendencia: "estavel" },
    { nome: "Regional MG", interjornada: 72, setimoDia: 28, intervalo: 18, total: 128, tendencia: "melhorando" },
    { nome: "Regional PR", interjornada: 68, setimoDia: 25, intervalo: 15, total: 118, tendencia: "melhorando" },
    { nome: "Regional BA", interjornada: 93, setimoDia: 38, intervalo: 24, total: 168, tendencia: "piorando" },
  ] as RegionalRow[],

  detalhePorTipo: [
    { tipo: "Interjornada", descricao: "Descanso < 11h entre turnos", total: 418, percentual: 49.3, tendencia: "melhorando", risco: "Alto" },
    { tipo: "7º Dia Consecutivo", descricao: "Trabalho no 7º dia seguido", total: 166, percentual: 19.6, tendencia: "melhorando", risco: "Alto" },
    { tipo: "Intervalo Obrigatório", descricao: "Não cumpriu pausa mínima", total: 115, percentual: 13.6, tendencia: "estavel", risco: "Médio" },
    { tipo: "Limite de HE", descricao: "Excedeu limite de hora extra", total: 82, percentual: 9.7, tendencia: "melhorando", risco: "Alto" },
    { tipo: "3º Domingo Consecutivo", descricao: "Trabalho em 3 domingos seguidos", total: 45, percentual: 5.3, tendencia: "estavel", risco: "Médio" },
    { tipo: "Jornada Mínima", descricao: "Não atingiu jornada mínima", total: 21, percentual: 2.5, tendencia: "piorando", risco: "Baixo" },
  ],

  insights: [
    { icone: "⚠️", texto: "418 violações de interjornada representam o maior risco jurídico da operação, concentrando 49% do total de ocorrências no período.", tipo: "atencao" as const },
    { icone: "✅", texto: "O total de violações reduziu 28% no período (de 80/mês para 51/mês), indicando melhora na gestão de jornada.", tipo: "positivo" as const },
    { icone: "🔴", texto: "A Regional RJ concentra 26% de todas as violações (220 ocorrências), liderando em interjornada (120) e 7º dia consecutivo (48).", tipo: "negativo" as const },
  ] as InsightItem[],
};

// ============================================================
// OPERAÇÕES E ESTRUTURAS
// ============================================================

export const operacoes = {
  regionais: [
    {
      nome: "Regional SP", economiaGerada: "R$ 2.1M", nivelConfianca: "78%",
      score: 88, tendencia: "melhorando", colaboradores: 2800,
      heHoras: "9.2K", noturnoHoras: "4.1K", compliance: 152,
      principalAlavanca: "Horas Extras", principalRisco: "Movimentações",
      // Por colaborador
      economiaPorColab: "R$ 750", hePorColab: "3.3h", noturnoPorColab: "1.5h",
      // Por 100 colab
      economiaPor100: "R$ 75K", hePor100: "329h", noturnoPor100: "146h",
    },
    {
      nome: "Regional RJ", economiaGerada: "R$ 1.6M", nivelConfianca: "72%",
      score: 82, tendencia: "melhorando", colaboradores: 1900,
      heHoras: "7.1K", noturnoHoras: "3.5K", compliance: 220,
      principalAlavanca: "Horas Extras", principalRisco: "Absenteísmo",
      economiaPorColab: "R$ 842", hePorColab: "3.7h", noturnoPorColab: "1.8h",
      economiaPor100: "R$ 84.2K", hePor100: "374h", noturnoPor100: "184h",
    },
    {
      nome: "Regional MG", economiaGerada: "R$ 1.2M", nivelConfianca: "69%",
      score: 75, tendencia: "estavel", colaboradores: 1400,
      heHoras: "5.4K", noturnoHoras: "2.8K", compliance: 128,
      principalAlavanca: "Adicional Noturno", principalRisco: "Coberturas",
      economiaPorColab: "R$ 857", hePorColab: "3.9h", noturnoPorColab: "2.0h",
      economiaPor100: "R$ 85.7K", hePor100: "386h", noturnoPor100: "200h",
    },
    {
      nome: "Regional PR", economiaGerada: "R$ 890K", nivelConfianca: "74%",
      score: 79, tendencia: "melhorando", colaboradores: 1100,
      heHoras: "4.2K", noturnoHoras: "2.1K", compliance: 118,
      principalAlavanca: "Horas Extras", principalRisco: "Movimentações",
      economiaPorColab: "R$ 809", hePorColab: "3.8h", noturnoPorColab: "1.9h",
      economiaPor100: "R$ 80.9K", hePor100: "382h", noturnoPor100: "191h",
    },
    {
      nome: "Regional BA", economiaGerada: "R$ 562K", nivelConfianca: "58%",
      score: 64, tendencia: "piorando", colaboradores: 800,
      heHoras: "3.8K", noturnoHoras: "2.3K", compliance: 168,
      principalAlavanca: "Atrasos e Faltas", principalRisco: "Absenteísmo",
      economiaPorColab: "R$ 703", hePorColab: "4.8h", noturnoPorColab: "2.9h",
      economiaPor100: "R$ 70.3K", hePor100: "475h", noturnoPor100: "288h",
    },
  ],
};

// ============================================================
// RESUMO EXECUTIVO — DADOS COMPLEMENTARES
// ============================================================

export const resumoComparativo = {
  scoreAnterior: 62,
  scoreDiferenca: 9,
};

export const radarIndicadores = [
  { indicador: "Qualid. Ponto", atual: 87, anterior: 83 },
  { indicador: "Absenteísmo", atual: 76, anterior: 68 },
  { indicador: "Volume HE", atual: 72, anterior: 60 },
  { indicador: "Movimentações", atual: 68, anterior: 55 },
  { indicador: "Cobertura", atual: 72, anterior: 70 },
];

export const rankingOperacoes = [
  { nome: "Regional SP", score: 88, tendencia: "melhorando" as const },
  { nome: "Regional RJ", score: 82, tendencia: "melhorando" as const },
  { nome: "Regional PR", score: 79, tendencia: "melhorando" as const },
  { nome: "Regional MG", score: 75, tendencia: "estavel" as const },
  { nome: "Regional BA", score: 64, tendencia: "piorando" as const },
];

// Per-regional KPI overrides for cross-filtering
export const dadosPorRegional: Record<string, {
  scoreOperacional: number;
  scoreFaixa: string;
  scoreDiferenca: number;
  melhorIndicador: string;
  melhorIndicadorDetalhe: string;
  piorIndicador: string;
  piorIndicadorDetalhe: string;
  sparklineMultipliers: Record<string, { valorMultiplier: number; scoreOverride: number; variacaoOverride: string; corVariacaoOverride: string }>;
}> = {
  "Regional SP": {
    scoreOperacional: 88, scoreFaixa: "Saudável", scoreDiferenca: 5,
    melhorIndicador: "Qualidade Ponto", melhorIndicadorDetalhe: "+5.2 pp (84.0% → 89.2%)",
    piorIndicador: "Volume HE", piorIndicadorDetalhe: "+8.3% no período",
    sparklineMultipliers: {
      "Qualidade do Ponto": { valorMultiplier: 1.02, scoreOverride: 92, variacaoOverride: "+5.2 pp", corVariacaoOverride: "text-green-600" },
      "Absenteísmo": { valorMultiplier: 0.75, scoreOverride: 88, variacaoOverride: "-1.1 pp", corVariacaoOverride: "text-green-600" },
      "Volume HE": { valorMultiplier: 0.85, scoreOverride: 72, variacaoOverride: "-15.2%", corVariacaoOverride: "text-green-600" },
      "Movimentações": { valorMultiplier: 0.80, scoreOverride: 82, variacaoOverride: "-22.5%", corVariacaoOverride: "text-green-600" },
      "Cobertura Efetiva": { valorMultiplier: 1.08, scoreOverride: 85, variacaoOverride: "+5 pp", corVariacaoOverride: "text-green-600" },
    },
  },
  "Regional RJ": {
    scoreOperacional: 82, scoreFaixa: "Saudável", scoreDiferenca: 8,
    melhorIndicador: "Absenteísmo", melhorIndicadorDetalhe: "-1.5 pp (5.8% → 4.3%)",
    piorIndicador: "Cobertura Efetiva", piorIndicadorDetalhe: "-3 pp no período",
    sparklineMultipliers: {
      "Qualidade do Ponto": { valorMultiplier: 0.98, scoreOverride: 85, variacaoOverride: "+3.8 pp", corVariacaoOverride: "text-green-600" },
      "Absenteísmo": { valorMultiplier: 0.90, scoreOverride: 82, variacaoOverride: "-1.5 pp", corVariacaoOverride: "text-green-600" },
      "Volume HE": { valorMultiplier: 1.10, scoreOverride: 58, variacaoOverride: "-18.0%", corVariacaoOverride: "text-green-600" },
      "Movimentações": { valorMultiplier: 0.95, scoreOverride: 68, variacaoOverride: "-12.1%", corVariacaoOverride: "text-green-600" },
      "Cobertura Efetiva": { valorMultiplier: 0.95, scoreOverride: 68, variacaoOverride: "-3 pp", corVariacaoOverride: "text-red-500" },
    },
  },
  "Regional PR": {
    scoreOperacional: 79, scoreFaixa: "Atenção", scoreDiferenca: 12,
    melhorIndicador: "Volume HE", melhorIndicadorDetalhe: "-28.4% no período",
    piorIndicador: "Movimentações", piorIndicadorDetalhe: "+5.2% no período",
    sparklineMultipliers: {
      "Qualidade do Ponto": { valorMultiplier: 0.96, scoreOverride: 82, variacaoOverride: "+3.0 pp", corVariacaoOverride: "text-green-600" },
      "Absenteísmo": { valorMultiplier: 1.05, scoreOverride: 72, variacaoOverride: "-0.2 pp", corVariacaoOverride: "text-green-600" },
      "Volume HE": { valorMultiplier: 0.72, scoreOverride: 78, variacaoOverride: "-28.4%", corVariacaoOverride: "text-green-600" },
      "Movimentações": { valorMultiplier: 1.15, scoreOverride: 52, variacaoOverride: "+5.2%", corVariacaoOverride: "text-red-500" },
      "Cobertura Efetiva": { valorMultiplier: 1.02, scoreOverride: 74, variacaoOverride: "+3 pp", corVariacaoOverride: "text-green-600" },
    },
  },
  "Regional MG": {
    scoreOperacional: 75, scoreFaixa: "Atenção", scoreDiferenca: 6,
    melhorIndicador: "Cobertura Efetiva", melhorIndicadorDetalhe: "+4 pp (68% → 72%)",
    piorIndicador: "Absenteísmo", piorIndicadorDetalhe: "+0.8 pp no período",
    sparklineMultipliers: {
      "Qualidade do Ponto": { valorMultiplier: 0.95, scoreOverride: 80, variacaoOverride: "+2.8 pp", corVariacaoOverride: "text-green-600" },
      "Absenteísmo": { valorMultiplier: 1.20, scoreOverride: 62, variacaoOverride: "+0.8 pp", corVariacaoOverride: "text-red-500" },
      "Volume HE": { valorMultiplier: 1.05, scoreOverride: 58, variacaoOverride: "-19.5%", corVariacaoOverride: "text-green-600" },
      "Movimentações": { valorMultiplier: 1.10, scoreOverride: 55, variacaoOverride: "-10.0%", corVariacaoOverride: "text-green-600" },
      "Cobertura Efetiva": { valorMultiplier: 1.03, scoreOverride: 74, variacaoOverride: "+4 pp", corVariacaoOverride: "text-green-600" },
    },
  },
  "Regional BA": {
    scoreOperacional: 64, scoreFaixa: "Crítico", scoreDiferenca: 3,
    melhorIndicador: "Volume HE", melhorIndicadorDetalhe: "-12.0% no período",
    piorIndicador: "Absenteísmo", piorIndicadorDetalhe: "+1.8 pp no período",
    sparklineMultipliers: {
      "Qualidade do Ponto": { valorMultiplier: 0.90, scoreOverride: 72, variacaoOverride: "+1.5 pp", corVariacaoOverride: "text-green-600" },
      "Absenteísmo": { valorMultiplier: 1.40, scoreOverride: 48, variacaoOverride: "+1.8 pp", corVariacaoOverride: "text-red-500" },
      "Volume HE": { valorMultiplier: 1.25, scoreOverride: 45, variacaoOverride: "-12.0%", corVariacaoOverride: "text-green-600" },
      "Movimentações": { valorMultiplier: 1.30, scoreOverride: 42, variacaoOverride: "-5.1%", corVariacaoOverride: "text-green-600" },
      "Cobertura Efetiva": { valorMultiplier: 0.88, scoreOverride: 55, variacaoOverride: "-2 pp", corVariacaoOverride: "text-red-500" },
    },
  },
};

export const insightsResumo = [
  { tipo: "positivo" as const, texto: "A qualidade do ponto evoluiu de 83.2% para 87.3% no período, com 4 das 5 operações em tendência positiva." },
  { tipo: "negativo" as const, texto: "A Regional BA concentra o maior risco operacional: absenteísmo de 6.8% (40% acima da média) e 363 movimentações por 100 colaboradores." },
  { tipo: "atencao" as const, texto: "O volume de horas extras reduziu 22%, porém atrasos e faltas cresceram 52%. A melhora pode ser pontual, não estrutural." },
  { tipo: "informativo" as const, texto: "O score operacional evoluiu de 62 para 71 em 12 meses (+14.5%). Regional SP (88) e Regional PR (79) puxam a evolução." },
];

// Sparkline evolution data for 5 indicators
export const sparklineData = {
  qualidadePonto: {
    label: "Qualidade do Ponto",
    valor: "87.3%",
    variacao: "+4.1 pp",
    corVariacao: "text-green-600",
    corLinha: "#22c55e",
    score: 87,
    peso: 0.25,
    evolucao: [
      { competencia: "abr/25", valor: 83.2 }, { competencia: "mai/25", valor: 83.0 },
      { competencia: "jun/25", valor: 83.8 }, { competencia: "jul/25", valor: 84.5 },
      { competencia: "ago/25", valor: 84.2 }, { competencia: "set/25", valor: 85.0 },
      { competencia: "out/25", valor: 85.8 }, { competencia: "nov/25", valor: 85.5 },
      { competencia: "dez/25", valor: 86.3 }, { competencia: "jan/26", valor: 86.9 },
      { competencia: "fev/26", valor: 86.7 }, { competencia: "mar/26", valor: 87.3 },
    ],
  },
  absenteismo: {
    label: "Absenteísmo",
    valor: "4.8%",
    variacao: "-0.6 pp",
    corVariacao: "text-green-600",
    corLinha: "#22c55e",
    score: 74,
    peso: 0.25,
    evolucao: [
      { competencia: "abr/25", valor: 5.4 }, { competencia: "mai/25", valor: 5.8 },
      { competencia: "jun/25", valor: 6.1 }, { competencia: "jul/25", valor: 5.5 },
      { competencia: "ago/25", valor: 5.9 }, { competencia: "set/25", valor: 5.2 },
      { competencia: "out/25", valor: 5.6 }, { competencia: "nov/25", valor: 5.0 },
      { competencia: "dez/25", valor: 5.3 }, { competencia: "jan/26", valor: 4.6 },
      { competencia: "fev/26", valor: 5.1 }, { competencia: "mar/26", valor: 4.8 },
    ],
  },
  volumeHE: {
    label: "Volume HE",
    valor: "33.1K h",
    variacao: "-22.1%",
    corVariacao: "text-green-600",
    corLinha: "#3b82f6",
    score: 60,
    peso: 0.20,
    evolucao: [
      { competencia: "abr/25", valor: 42.5 }, { competencia: "mai/25", valor: 41.8 },
      { competencia: "jun/25", valor: 40.0 }, { competencia: "jul/25", valor: 38.2 },
      { competencia: "ago/25", valor: 37.5 }, { competencia: "set/25", valor: 36.0 },
      { competencia: "out/25", valor: 35.1 }, { competencia: "nov/25", valor: 34.0 },
      { competencia: "dez/25", valor: 44.8 }, { competencia: "jan/26", valor: 35.5 },
      { competencia: "fev/26", valor: 34.0 }, { competencia: "mar/26", valor: 33.1 },
    ],
  },
  movimentacoes: {
    label: "Movimentações",
    valor: "23.0K",
    variacao: "-18.3%",
    corVariacao: "text-green-600",
    corLinha: "#a855f7",
    score: 55,
    peso: 0.15,
    evolucao: [
      { competencia: "abr/25", valor: 28.1 }, { competencia: "mai/25", valor: 26.0 },
      { competencia: "jun/25", valor: 27.8 }, { competencia: "jul/25", valor: 25.5 },
      { competencia: "ago/25", valor: 26.8 }, { competencia: "set/25", valor: 24.5 },
      { competencia: "out/25", valor: 25.2 }, { competencia: "nov/25", valor: 23.8 },
      { competencia: "dez/25", valor: 24.5 }, { competencia: "jan/26", valor: 23.0 },
      { competencia: "fev/26", valor: 23.5 }, { competencia: "mar/26", valor: 23.0 },
    ],
  },
  coberturaEfetiva: {
    label: "Cobertura Efetiva",
    valor: "72%",
    variacao: "+2 pp",
    corVariacao: "text-green-600",
    corLinha: "#f97316",
    score: 70,
    peso: 0.15,
    evolucao: [
      { competencia: "abr/25", valor: 70 }, { competencia: "mai/25", valor: 69 },
      { competencia: "jun/25", valor: 70 }, { competencia: "jul/25", valor: 68 },
      { competencia: "ago/25", valor: 70 }, { competencia: "set/25", valor: 71 },
      { competencia: "out/25", valor: 70 }, { competencia: "nov/25", valor: 71 },
      { competencia: "dez/25", valor: 69 }, { competencia: "jan/26", valor: 71 },
      { competencia: "fev/26", valor: 72 }, { competencia: "mar/26", valor: 72 },
    ],
  },
};

// ============================================================
// DADOS GENÉRICOS PARA ABAS COM BLUR (V2+)
// ============================================================

export const blurMockData = {
  kpiCards: [
    { label: "Indicador A", valor: "R$ 1.4M" },
    { label: "Indicador B", valor: "85.2%" },
    { label: "Indicador C", valor: "1.240" },
    { label: "Indicador D", valor: "R$ 892K" },
  ],
  barChartData: [
    { name: "Jan", valor: 4000 }, { name: "Fev", valor: 3000 },
    { name: "Mar", valor: 5000 }, { name: "Abr", valor: 4500 },
    { name: "Mai", valor: 6000 }, { name: "Jun", valor: 5500 },
  ],
  tableData: [
    { operacao: "Operação Alpha", valor: "R$ 450K", score: 82 },
    { operacao: "Operação Beta", valor: "R$ 380K", score: 75 },
    { operacao: "Operação Gamma", valor: "R$ 290K", score: 68 },
    { operacao: "Operação Delta", valor: "R$ 210K", score: 71 },
  ],
};

// ============================================================
// TOUR GUIADO
// ============================================================

export const tourSteps = [
  { target: "filtros", title: "Filtros", description: "Selecione o período e o cliente para ajustar a visão. Todas as abas respeitam os mesmos filtros." },
  { target: "score", title: "Score Operacional", description: "Índice de 0 a 100 que sintetiza a saúde da sua operação. Combina qualidade do ponto, absenteísmo, horas extras, movimentações e coberturas." },
  { target: "economia", title: "Economia Gerada", description: "Valor consolidado que a operação capturou no período. Quando configurados os parâmetros de custo, reflete a economia estimada." },
  { target: "kpis", title: "Visão rápida", description: "Em um olhar: confiança dos dados, principal driver, melhor e pior regional." },
  { target: "grafico-evolucao", title: "Tendência", description: "Acompanhe como os indicadores evoluem mês a mês. A linha tracejada é a média do período como referência." },
  { target: "insights", title: "Insights automáticos", description: "O sistema interpreta os dados e destaca os pontos mais relevantes. Não é apenas dado, é leitura executiva." },
  { target: "abas", title: "Navegação", description: "Explore cada dimensão da operação. As abas com 🔒 são funcionalidades que serão liberadas em breve." },
  { target: "botao-guia", title: "Sempre disponível", description: "Acesse este tour novamente a qualquer momento clicando aqui. Bom uso do Analytics!" },
];

// ============================================================
// CONFIGURAÇÃO DAS ABAS BLOQUEADAS
// ============================================================

export const lockedTabs = [
  // Financeiro
  { id: "alavancas", grupo: "Financeiro", nome: "Alavancas de Economia", descricao: "Visualize o impacto financeiro de cada driver da sua operação em reais" },
  { id: "roi", grupo: "Financeiro", nome: "Retorno do Investimento", descricao: "Veja quanto foi investido, quanto foi gerado e qual o ROI da operação" },
  { id: "previsto-realizado", grupo: "Financeiro", nome: "Previsto vs Realizado", descricao: "Compare receita contratual com custo real e descubra quais contratos dão lucro" },
  { id: "rentabilidade", grupo: "Financeiro", nome: "Rentabilidade", descricao: "Ranking completo de contratos por margem operacional" },
  // Estratégico
  { id: "evolucao", grupo: "Estratégico", nome: "Evolução da Operação", descricao: "Acompanhe a maturidade operacional e financeira ao longo do tempo" },
  { id: "plano-acao", grupo: "Estratégico", nome: "Plano de Ação", descricao: "Transforme a leitura analítica em ações concretas com responsáveis e prazos" },
  { id: "simulador", grupo: "Estratégico", nome: "Simulador de Cenários", descricao: "Simule mudanças operacionais e veja o impacto financeiro em tempo real" },
  // Compliance Avançado
  { id: "sancoes", grupo: "Compliance Avançado", nome: "Sanções Disciplinares", descricao: "Acompanhe advertências, suspensões e políticas disciplinares" },
  { id: "alertas-preventivos", grupo: "Compliance Avançado", nome: "Alertas Preventivos", descricao: "Receba alertas antes que violações trabalhistas aconteçam" },
  { id: "regulatorio", grupo: "Compliance Avançado", nome: "Dossiê Trabalhista", descricao: "Acesse um dossiê detalhado da vida trabalhista de cada colaborador: histórico de jornadas, ocorrências, advertências e conformidade legal" },
  // Inteligência
  { id: "previsoes", grupo: "Inteligência", nome: "Previsões", descricao: "Antecipe absenteísmo, turnover e demanda de cobertura com inteligência preditiva" },
  { id: "benchmark", grupo: "Inteligência", nome: "Benchmark Setorial", descricao: "Compare sua operação com o mercado por setor e região" },
  { id: "chatbot", grupo: "Inteligência", nome: "Chatbot Analítico", descricao: "Converse com seus dados em linguagem natural" },
  // Configuração
  { id: "metodologia", grupo: "Configuração", nome: "Metodologia e Governança", descricao: "Transparência total sobre parâmetros, premissas e regras de cálculo" },
  // Engajamento
  { id: "pesquisas", grupo: "Engajamento", nome: "Checklist", descricao: "Acompanhe o cumprimento de checklists operacionais e a aderência das equipes aos protocolos" },
  { id: "reconhecimento", grupo: "Engajamento", nome: "Direct", descricao: "Monitore a comunicação direta entre líderes e colaboradores em tempo real" },
  { id: "comunicacao", grupo: "Engajamento", nome: "Avisos", descricao: "Gerencie avisos, convocações e a taxa de leitura das comunicações enviadas" },
];

// ============================================================
// AbA FÉRIAS — vacationData
// ============================================================

function buildHeatmapCells() {
  const regionais = ["Capital BA", "Interior PR", "Capital SP", "Grande RJ", "Interior MG"];
  const weeks = Array.from({ length: 26 }, (_, i) => {
    const semNum = 18 + i;
    return { label: `Sem ${semNum}` };
  });

  // Distribuição mockada baseada em padrão sazonal (pico em julho).
  function pctFor(regIdx: number, wIdx: number): number {
    const semNum = 18 + wIdx;
    let base = 8;
    if (semNum >= 18 && semNum <= 22) base = 10 + Math.floor(Math.random() * 10);
    else if (semNum >= 23 && semNum <= 26) base = (regIdx === 0 || regIdx === 1) ? 22 + Math.floor(Math.random() * 8) : 12 + Math.floor(Math.random() * 8);
    else if (semNum >= 27 && semNum <= 31) {
      if (regIdx === 0) base = 32 + Math.floor(Math.random() * 18); // BA pico
      else if (regIdx === 1) base = 28 + Math.floor(Math.random() * 12); // PR
      else base = 18 + Math.floor(Math.random() * 8);
    } else if (semNum >= 32 && semNum <= 35) base = 12 + Math.floor(Math.random() * 8);
    else base = 6 + Math.floor(Math.random() * 8);
    return Math.min(base, 50);
  }

  return regionais.map((regional, ri) => ({
    regional,
    weeks: weeks.map((_, wi) => {
      const pct = pctFor(ri, wi);
      const status: "ok" | "limit" | "gap" = pct >= 35 ? "gap" : pct >= 25 ? "limit" : "ok";
      return { pct, status };
    }),
  }));
}

export const vacationData = {
  kpis: {
    score: {
      value: 68,
      classification: "Atenção",
      variation: { value: 4, unit: "pts", direction: "up" },
      tooltip: "Índice sintético que combina aderência ao prazo concessivo, distribuição ao longo do ano, cobertura programada e ausência de conflitos de calendário. Quanto maior, mais saudável a programação.",
    },
    aProgramar: {
      value: "47",
      classification: "Atenção",
      variation: { value: 12, unit: "abs", direction: "up" },
      tooltip: "Colaboradores com período aquisitivo vencendo nos próximos 30 dias e ainda sem férias programadas.",
    },
    semCobertura: {
      value: "23",
      classification: "Atenção",
      variation: { value: 5, unit: "abs", direction: "down" },
      tooltip: "Férias já programadas no sistema mas sem ferista, remanejo ou substituto definido.",
    },
    riscoDobra: {
      value: "12",
      classification: "Crítico",
      variation: { value: 3, unit: "abs", direction: "up" },
      tooltip: "Colaboradores a menos de 60 dias do fim do período concessivo. Risco de pagamento em dobra.",
    },
    melhorOperacao: {
      operationName: "VIG EYES SEGUR…",
      score: 84,
      classification: "Bom",
      tooltip: "Operação com melhor score de programação de férias no período.",
    },
    maiorRisco: {
      operationName: "VIG EYES TERC…",
      score: 52,
      classification: "Ruim",
      tooltip: "Operação com pior score de programação de férias.",
    },
  },
  sidebar: {
    items: [
      { id: "1", name: "São José do Rio Preto", score: 89, classification: "Bom" },
      { id: "2", name: "Capital ACL", score: 85, classification: "Bom" },
      { id: "3", name: "Capital SEG", score: 82, classification: "Bom" },
      { id: "4", name: "Interior SP", score: 78, classification: "Bom" },
      { id: "5", name: "Capital POR", score: 73, classification: "Bom" },
      { id: "6", name: "Grande RJ", score: 68, classification: "Atenção" },
      { id: "7", name: "Interior MG", score: 64, classification: "Atenção" },
      { id: "8", name: "Capital BA", score: 58, classification: "Atenção" },
      { id: "9", name: "Interior BA", score: 52, classification: "Ruim" },
      { id: "10", name: "Norte Fluminense", score: 48, classification: "Ruim" },
    ],
  },
  charts: {
    mapa: {
      subtitle: "Headcount × Score de Férias · uma bolha por unidade de negócio",
      data: [
        { name: "Segurança Empresarial", shortName: "SEG", headcount: 42, score: 80 },
        { name: "Terceirização", shortName: "TER", headcount: 48, score: 56 },
        { name: "Portaria", shortName: "POR", headcount: 398, score: 73 },
        { name: "Limpeza e Conservação", shortName: "LIM", headcount: 287, score: 68 },
        { name: "Facilities", shortName: "FAC", headcount: 156, score: 75 },
      ],
    },
    calendario: {
      subtitle: "Densidade de férias por semana · próximos 6 meses · clique numa célula",
      tooltip: "Cada célula mostra o percentual do efetivo em férias na semana, com marcador de status da reserva técnica. Verde (0-20%), amarelo (20-30%), laranja (30-40%), vermelho (>40%).",
      groupByOptions: ["Regional", "Contrato", "Posto", "Service Type"] as const,
      weeks: Array.from({ length: 26 }, (_, i) => ({ label: `Sem ${18 + i}` })),
      cells: buildHeatmapCells(),
    },
    distribuicao: {
      subtitle: "Próximos 12 meses · programação vs capacidade da reserva",
      tooltip: "Empilha firmes, provisórias, a programar e não planejadas. Linha tracejada mostra a capacidade mensal da reserva técnica.",
      data: [
        { mes: "abr/26", firmes: 42, provisorias: 18, aProgramar: 12, naoPlanejadas: 5, capacidade: 70 },
        { mes: "mai/26", firmes: 58, provisorias: 22, aProgramar: 18, naoPlanejadas: 8, capacidade: 80 },
        { mes: "jun/26", firmes: 71, provisorias: 25, aProgramar: 24, naoPlanejadas: 11, capacidade: 85 },
        { mes: "jul/26", firmes: 94, provisorias: 30, aProgramar: 28, naoPlanejadas: 15, capacidade: 85 },
        { mes: "ago/26", firmes: 68, provisorias: 28, aProgramar: 20, naoPlanejadas: 9, capacidade: 85 },
        { mes: "set/26", firmes: 45, provisorias: 20, aProgramar: 15, naoPlanejadas: 6, capacidade: 80 },
        { mes: "out/26", firmes: 38, provisorias: 18, aProgramar: 12, naoPlanejadas: 4, capacidade: 80 },
        { mes: "nov/26", firmes: 42, provisorias: 20, aProgramar: 14, naoPlanejadas: 5, capacidade: 80 },
        { mes: "dez/26", firmes: 88, provisorias: 32, aProgramar: 22, naoPlanejadas: 12, capacidade: 85 },
        { mes: "jan/27", firmes: 95, provisorias: 35, aProgramar: 25, naoPlanejadas: 14, capacidade: 85 },
        { mes: "fev/27", firmes: 55, provisorias: 22, aProgramar: 16, naoPlanejadas: 7, capacidade: 80 },
        { mes: "mar/27", firmes: 48, provisorias: 20, aProgramar: 14, naoPlanejadas: 6, capacidade: 80 },
      ],
    },
    aderencia: {
      subtitle: "Unidades de negócio · bolha = headcount",
      tooltip: "Eixo X: volume de férias no período. Eixo Y: % programadas com 30+ dias de antecedência.",
      data: [
        { name: "São José do Rio Preto", x: 22, y: 82, headcount: 156 },
        { name: "Capital ACL", x: 45, y: 78, headcount: 287 },
        { name: "Capital SEG", x: 18, y: 85, headcount: 98 },
        { name: "Interior SP", x: 28, y: 72, headcount: 142 },
        { name: "Capital POR", x: 62, y: 68, headcount: 398 },
        { name: "Grande RJ", x: 51, y: 58, headcount: 234 },
        { name: "Interior MG", x: 34, y: 55, headcount: 178 },
        { name: "Capital BA", x: 42, y: 48, headcount: 198 },
        { name: "Interior BA", x: 28, y: 42, headcount: 134 },
        { name: "Norte Fluminense", x: 19, y: 38, headcount: 89 },
      ],
    },
  },
  insights: [
    { tone: "negative" as const, text: "Julho concentra 94 férias firmes vs capacidade de reserva de 85 — gap de 9 colaboradores. Antecipar parte para maio ou junho reduz HE projetada e risco de posto descoberto." },
    { tone: "warning" as const, text: "Capital BA tem 38% do efetivo em férias no pico de julho. Concentração crítica — redistribuir com unidades vizinhas ou acionar ferista volante." },
    { tone: "positive" as const, text: "A programação com antecedência subiu de 52% para 64% em 6 meses. A operação está reagindo melhor ao ciclo de férias. Meta: chegar a 75% até o fim do ano." },
  ],
};
