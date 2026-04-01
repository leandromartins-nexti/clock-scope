/* ── ROI Realizado – Data Layer ── */

export type ConfidenceLevel = "comprovado" | "hibrido" | "referencial" | "potencial";
export type CostMaturity = 1 | 2 | 3;
export type DriverStatus = "ativo" | "inativo";
export type OportunidadeCategoria = "quick_win" | "dependente_dados" | "dependente_operacional" | "dependente_modulo";

export interface DriverDataAvailability {
  temModulo: boolean;
  temEventosReais: boolean;
  temValorFinanceiroReal: boolean;
  temBaselineReal: boolean;
  temFolha: boolean;
}

export interface DriverUpgradePath {
  de: ConfidenceLevel;
  para: ConfidenceLevel;
  acao: string;
  detalhe: string;
  prazo: string;
  esforco: "baixo" | "medio" | "alto";
}

export interface DriverModalData {
  colaboradoresImpactados: number;
  totalEventosBaseline: number;
  totalEventosAtual: number;
  valorMonetarioBaseline: number;
  valorMonetarioAtual: number;
  deltaCapturado: number;
  mediaPorColaborador: number;
  nivelRastreabilidade: "alto" | "medio" | "baixo";
  parametrosMedios?: string[];
  custoMedioAplicado?: string;
  fatorAjusteAplicado?: string;
  benchmarkUsado?: string;
  baseCaseUsado?: string;
  volumeEstimado?: string;
  comoElevar?: string[];
  rankingUnidades?: { nome: string; valor: number }[];
}

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
  janelaAtual: string;
  hierarquiaBaseline: "historico_real" | "media_janela" | "benchmark_interno" | "base_case";
  tendencia: number;
  fatorReducao: number;
  formulaResumo: string;
  observacaoMetodologica: string;
  dataAvailability: DriverDataAvailability;
  upgradePaths: DriverUpgradePath[];
  modalData: DriverModalData;
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
  dispositivos: number;
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
  custoUnitarioDispositivo: number;
  custoMedioVT: number;
  custoMedioVR: number;
  percentualElegivel: number;
  diasUteis: number;
  ticketMedioBeneficio: number;
}

export interface BaselineConfig {
  driverId: string;
  hierarquia: ROIDriver["hierarquiaBaseline"];
  fontePreferencial: string;
  janelaBaseline: string;
  janelaComparacao: string;
  fatorReducao: number;
  custoUnitarioPadrao: number;
  benchmarkAlternativo: string;
  observacoes: string;
}

/* ── Auto-classification logic ── */
export function autoClassifyDriver(data: DriverDataAvailability): ConfidenceLevel {
  if (data.temModulo && data.temEventosReais && data.temValorFinanceiroReal && data.temBaselineReal) {
    return "comprovado";
  }
  if (data.temModulo && data.temEventosReais && !data.temValorFinanceiroReal) {
    return "hibrido";
  }
  if (!data.temModulo || (!data.temEventosReais && !data.temBaselineReal)) {
    return "referencial";
  }
  return "hibrido";
}

/* ── Mock Data – Base: 8.000 colaboradores (Orsegups) ── */
/* Período: abr/2025 a mar/2026 — cenário conservador e realista */

export const premissas: PremissasROI = {
  colaboradores: 8000,
  dispositivos: 1000,
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
  custoUnitarioDispositivo: 50.0,
  custoMedioVT: 220,
  custoMedioVR: 350,
  percentualElegivel: 0.85,
  diasUteis: 22,
  ticketMedioBeneficio: 18,
};

export const ownership: ROIOwnership = {
  custoContrato: 130000,
  custosAdicionais: 0,
  custosReduzidos: 0,
  ownershipTotal: 1560000,
};

export const drivers: ROIDriver[] = [
  {
    id: "d1", nome: "Redução de Papel", categoria: "monetario", moduloNexti: "Documentos Digitais",
    unidadeMedida: "documentos", status: "ativo",
    baseline: 8400, atual: 4780, delta: -3620, custoUnitario: 5.8, ganhoBruto: 210000,
    confianca: "comprovado", fonteBaseline: "Contagem real de documentos pré-digitalização", fonteAtual: "Dados reais do módulo Documentos Digitais",
    janelaBaseline: "Abr/2024 – Mar/2025", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "historico_real",
    tendencia: -6.5, fatorReducao: 25,
    formulaResumo: "economia = (documentos_baseline - documentos_atuais) × custo_unitário_documento",
    observacaoMetodologica: "Volume de documentos físicos eliminados após digitalização. Custo unitário inclui impressão, armazenamento e manuseio. Dados comprovados por contagem real.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: true, temBaselineReal: true, temFolha: false },
    upgradePaths: [],
    modalData: {
      colaboradoresImpactados: 8000,
      totalEventosBaseline: 8400, totalEventosAtual: 4780,
      valorMonetarioBaseline: 48720, valorMonetarioAtual: 27724,
      deltaCapturado: 210000, mediaPorColaborador: 26.25,
      nivelRastreabilidade: "alto",
      rankingUnidades: [
        { nome: "Regional Sul", valor: 62000 },
        { nome: "Regional Sudeste", valor: 78000 },
        { nome: "Regional Nordeste", valor: 45000 },
        { nome: "Regional Centro-Oeste", valor: 25000 },
      ],
    },
  },
  {
    id: "d2", nome: "Redução de Horas Extras", categoria: "monetario", moduloNexti: "Gestão de Jornada (NextTime)",
    unidadeMedida: "horas", status: "ativo",
    baseline: 96000, atual: 31200, delta: -64800, custoUnitario: 22.0, ganhoBruto: 1430000,
    confianca: "comprovado", fonteBaseline: "Eventos reais do NextTime + valores reais da folha de pagamento", fonteAtual: "Dados reais de jornada + folha",
    janelaBaseline: "Abr/2024 – Mar/2025", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "historico_real",
    tendencia: -8.2, fatorReducao: 15,
    formulaResumo: "economia = soma(valor_real_HE_baseline) - soma(valor_real_HE_período_atual)",
    observacaoMetodologica: "Cálculo monetário usa valor real de HE por colaborador importado da folha. Eventos de hora extra capturados pelo NextTime com rastreabilidade total.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: true, temBaselineReal: true, temFolha: true },
    upgradePaths: [],
    modalData: {
      colaboradoresImpactados: 5200,
      totalEventosBaseline: 96000, totalEventosAtual: 31200,
      valorMonetarioBaseline: 2112000, valorMonetarioAtual: 686400,
      deltaCapturado: 1430000, mediaPorColaborador: 275.0,
      nivelRastreabilidade: "alto",
      rankingUnidades: [
        { nome: "Regional Sul", valor: 420000 },
        { nome: "Regional Sudeste", valor: 510000 },
        { nome: "Regional Nordeste", valor: 320000 },
        { nome: "Regional Centro-Oeste", valor: 180000 },
      ],
    },
  },
  {
    id: "d3", nome: "Redução de Adicional Noturno", categoria: "monetario", moduloNexti: "Gestão de Jornada (NextTime)",
    unidadeMedida: "horas", status: "ativo",
    baseline: 156000, atual: 112300, delta: -43700, custoUnitario: 8.93, ganhoBruto: 390000,
    confianca: "comprovado", fonteBaseline: "Eventos reais do NextTime + valores reais de adicional noturno", fonteAtual: "Dados reais de jornada + folha",
    janelaBaseline: "Abr/2024 – Mar/2025", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "historico_real",
    tendencia: -4.1, fatorReducao: 25,
    formulaResumo: "economia = (horas_noturnas_baseline × valor_adicional) - (horas_noturnas_atuais × valor_adicional)",
    observacaoMetodologica: "Eventos reais de adicional noturno com valores monetários reais da folha. Comprovado por dados completos do NextTime + folha de pagamento.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: true, temBaselineReal: true, temFolha: true },
    upgradePaths: [],
    modalData: {
      colaboradoresImpactados: 3400,
      totalEventosBaseline: 156000, totalEventosAtual: 112300,
      valorMonetarioBaseline: 1393080, valorMonetarioAtual: 1002839,
      deltaCapturado: 390000, mediaPorColaborador: 114.71,
      nivelRastreabilidade: "alto",
      rankingUnidades: [
        { nome: "Regional Sul", valor: 110000 },
        { nome: "Regional Sudeste", valor: 145000 },
        { nome: "Regional Nordeste", valor: 85000 },
        { nome: "Regional Centro-Oeste", valor: 50000 },
      ],
    },
  },
  {
    id: "d4", nome: "Redução de Custo Operacional", categoria: "monetario", moduloNexti: "Automação Operacional",
    unidadeMedida: "R$", status: "ativo",
    baseline: 2480000, atual: 1440000, delta: -1040000, custoUnitario: 1, ganhoBruto: 1040000,
    confianca: "comprovado", fonteBaseline: "Base operacional do cliente com medição real de esforço/custo", fonteAtual: "Dados reais do financeiro",
    janelaBaseline: "Abr/2024 – Mar/2025", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "historico_real",
    tendencia: -5.8, fatorReducao: 100,
    formulaResumo: "economia = custo_operacional_baseline - custo_operacional_atual",
    observacaoMetodologica: "Inclui custos de processos manuais eliminados com automação. Dados validados pelo financeiro do cliente com rastreabilidade completa.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: true, temBaselineReal: true, temFolha: false },
    upgradePaths: [],
    modalData: {
      colaboradoresImpactados: 8000,
      totalEventosBaseline: 2480000, totalEventosAtual: 1440000,
      valorMonetarioBaseline: 2480000, valorMonetarioAtual: 1440000,
      deltaCapturado: 1040000, mediaPorColaborador: 130.0,
      nivelRastreabilidade: "alto",
      rankingUnidades: [
        { nome: "Regional Sul", valor: 290000 },
        { nome: "Regional Sudeste", valor: 380000 },
        { nome: "Regional Nordeste", valor: 230000 },
        { nome: "Regional Centro-Oeste", valor: 140000 },
      ],
    },
  },
  {
    id: "d5", nome: "Aumento em Descontos de Atrasos e Faltas", categoria: "monetario", moduloNexti: "Controle de Ponto (NextTime)",
    unidadeMedida: "R$", status: "ativo",
    baseline: 180000, atual: 490000, delta: 310000, custoUnitario: 1, ganhoBruto: 310000,
    confianca: "comprovado", fonteBaseline: "Valores reais de desconto importados da folha", fonteAtual: "Dados reais de desconto do NextTime + folha",
    janelaBaseline: "Abr/2024 – Mar/2025", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "historico_real",
    tendencia: 6.2, fatorReducao: 15,
    formulaResumo: "economia = descontos_atuais - descontos_baseline",
    observacaoMetodologica: "Eventos reais de atraso/falta do NextTime com valor monetário real de desconto importado da folha. Delta positivo indica aumento de descontos aplicados corretamente.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: true, temBaselineReal: true, temFolha: true },
    upgradePaths: [],
    modalData: {
      colaboradoresImpactados: 6200,
      totalEventosBaseline: 180000, totalEventosAtual: 490000,
      valorMonetarioBaseline: 180000, valorMonetarioAtual: 490000,
      deltaCapturado: 310000, mediaPorColaborador: 50.0,
      nivelRastreabilidade: "alto",
      rankingUnidades: [
        { nome: "Regional Sul", valor: 85000 },
        { nome: "Regional Sudeste", valor: 110000 },
        { nome: "Regional Nordeste", valor: 72000 },
        { nome: "Regional Centro-Oeste", valor: 43000 },
      ],
    },
  },
  {
    id: "d6", nome: "Redução Tempo para Fechamento", categoria: "monetario", moduloNexti: "Fechamento Digital",
    unidadeMedida: "horas", status: "ativo",
    baseline: 480, atual: 125, delta: -355, custoUnitario: 42, ganhoBruto: 275000,
    confianca: "comprovado", fonteBaseline: "Datas reais de fechamento do período de apuração + datas da folha", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Abr/2024 – Mar/2025", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "historico_real",
    tendencia: -12.0, fatorReducao: 50,
    formulaResumo: "economia = (horas_fechamento_baseline - horas_fechamento_atuais) × custo_hora_admin",
    observacaoMetodologica: "Medição real da redução do tempo entre fechamento operacional e fechamento da folha. Custo hora admin informado pelo cliente.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: true, temBaselineReal: true, temFolha: true },
    upgradePaths: [],
    modalData: {
      colaboradoresImpactados: 45,
      totalEventosBaseline: 480, totalEventosAtual: 125,
      valorMonetarioBaseline: 20160, valorMonetarioAtual: 5250,
      deltaCapturado: 275000, mediaPorColaborador: 6111.11,
      nivelRastreabilidade: "alto",
      rankingUnidades: [
        { nome: "DP Central", valor: 140000 },
        { nome: "DP Filiais", valor: 85000 },
        { nome: "Contabilidade", valor: 50000 },
      ],
    },
  },
  {
    id: "d7", nome: "Redução de Disputas Trabalhistas", categoria: "monetario", moduloNexti: "Compliance Trabalhista",
    unidadeMedida: "R$", status: "ativo",
    baseline: 2800000, atual: 1825000, delta: -975000, custoUnitario: 1, ganhoBruto: 975000,
    confianca: "hibrido", fonteBaseline: "Contagem parcial de processos do cliente", fonteAtual: "Status parcial de processos + custo médio configurado",
    janelaBaseline: "Últimos 24 meses", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "benchmark_interno",
    tendencia: -2.8, fatorReducao: 15,
    formulaResumo: "economia = (quantidade_processos_reduzidos) × custo_médio_por_processo",
    observacaoMetodologica: "Cliente possui contagem de processos mas sem valor financeiro completo. Monetização por custo médio configurado por processo (R$18.000). Classificado como Híbrido.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: false, temBaselineReal: false, temFolha: false },
    upgradePaths: [
      { de: "hibrido", para: "comprovado", acao: "Importar base real de processos trabalhistas", detalhe: "Enviar linha do tempo e valor por processo para comparação antes/depois da adoção", prazo: "2-3 meses", esforco: "medio" },
    ],
    modalData: {
      colaboradoresImpactados: 8000,
      totalEventosBaseline: 156, totalEventosAtual: 102,
      valorMonetarioBaseline: 2800000, valorMonetarioAtual: 1825000,
      deltaCapturado: 975000, mediaPorColaborador: 121.88,
      nivelRastreabilidade: "medio",
      parametrosMedios: ["Custo médio por processo: R$18.000", "Redução estimada: 35%"],
      custoMedioAplicado: "R$ 18.000 por processo",
      fatorAjusteAplicado: "Benchmark setor segurança patrimonial",
      rankingUnidades: [
        { nome: "Regional Sul", valor: 280000 },
        { nome: "Regional Sudeste", valor: 350000 },
        { nome: "Regional Nordeste", valor: 210000 },
        { nome: "Regional Centro-Oeste", valor: 135000 },
      ],
    },
  },
  {
    id: "d8", nome: "Pagamento de Benefícios", categoria: "monetario", moduloNexti: "Gestão de Benefícios",
    unidadeMedida: "R$", status: "inativo",
    baseline: 0, atual: 0, delta: 0, custoUnitario: 1, ganhoBruto: 0,
    confianca: "referencial", fonteBaseline: "Não disponível — módulo não ativado", fonteAtual: "Não mensurado",
    janelaBaseline: "N/A", janelaAtual: "N/A",
    hierarquiaBaseline: "base_case",
    tendencia: 0, fatorReducao: 0,
    formulaResumo: "Não mensurado — cliente não utiliza módulo de Benefícios",
    observacaoMetodologica: "Driver referencial. Cliente Orsegups não utiliza o módulo de Benefícios. Valor potencial estimado por premissas configuradas no Centro de Configuração.",
    dataAvailability: { temModulo: false, temEventosReais: false, temValorFinanceiroReal: false, temBaselineReal: false, temFolha: false },
    upgradePaths: [
      { de: "referencial", para: "hibrido", acao: "Ativar módulo de Benefícios", detalhe: "Integrar dados parciais de benefícios para monetização por parâmetros médios", prazo: "3-6 meses", esforco: "alto" },
      { de: "hibrido", para: "comprovado", acao: "Integrar base completa de benefícios", detalhe: "Importar dados reais de VT, VR, VA com custo real por colaborador", prazo: "6-12 meses", esforco: "alto" },
    ],
    modalData: {
      colaboradoresImpactados: 0,
      totalEventosBaseline: 0, totalEventosAtual: 0,
      valorMonetarioBaseline: 0, valorMonetarioAtual: 0,
      deltaCapturado: 0, mediaPorColaborador: 0,
      nivelRastreabilidade: "baixo",
      benchmarkUsado: "Custo médio VT: R$220/col, VR: R$350/col",
      baseCaseUsado: "Base Case Nexti — economia estimada de 8-12% sobre custo total de benefícios",
      volumeEstimado: "Estimativa: R$ 380.000 - R$ 580.000/ano se módulo ativado",
      comoElevar: [
        "Ativar módulo de Gestão de Benefícios",
        "Integrar base de VT, VR e VA",
        "Importar dados reais de custo por colaborador",
        "Oportunidade de cross-sell",
      ],
    },
  },
  {
    id: "d9", nome: "Otimização de Quadro de Lotação", categoria: "monetario", moduloNexti: "Dimensionamento",
    unidadeMedida: "colaboradores", status: "ativo",
    baseline: 8000, atual: 7810, delta: -190, custoUnitario: 6500, ganhoBruto: 1235000,
    confianca: "hibrido", fonteBaseline: "Dado operacional parcial de dimensionamento", fonteAtual: "Estimativa com custo baseado em média configurada",
    janelaBaseline: "Abr/2024 – Mar/2025", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "benchmark_interno",
    tendencia: -1.2, fatorReducao: 100,
    formulaResumo: "economia = colaboradores_reduzidos × custo_médio_por_colaborador (salário + encargos + benefícios)",
    observacaoMetodologica: "Dado operacional parcial de estrutura antes e depois. Custo baseado em média configurada (R$6.500). Classificado como Híbrido.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: false, temBaselineReal: false, temFolha: false },
    upgradePaths: [
      { de: "hibrido", para: "comprovado", acao: "Validar com dados reais de dimensionamento", detalhe: "Importar dados reais de estrutura antes e depois com custo real por colaborador", prazo: "2-4 meses", esforco: "medio" },
    ],
    modalData: {
      colaboradoresImpactados: 190,
      totalEventosBaseline: 8000, totalEventosAtual: 7810,
      valorMonetarioBaseline: 52000000, valorMonetarioAtual: 50765000,
      deltaCapturado: 1235000, mediaPorColaborador: 6500,
      nivelRastreabilidade: "medio",
      parametrosMedios: ["Custo médio por colaborador: R$6.500/mês (salário + encargos + benefícios)"],
      custoMedioAplicado: "R$ 6.500 por colaborador",
      fatorAjusteAplicado: "Benchmark interno por porte e segmento",
      rankingUnidades: [
        { nome: "Regional Sul", valor: 350000 },
        { nome: "Regional Sudeste", valor: 450000 },
        { nome: "Regional Nordeste", valor: 280000 },
        { nome: "Regional Centro-Oeste", valor: 155000 },
      ],
    },
  },
  {
    id: "d10", nome: "Horas Produtivas Não Faturadas", categoria: "monetario", moduloNexti: "Produtividade / Operações",
    unidadeMedida: "horas", status: "ativo",
    baseline: 0, atual: 41600, delta: 41600, custoUnitario: 12.5, ganhoBruto: 520000,
    confianca: "comprovado", fonteBaseline: "Identificação via operação: coberturas e horas em postos não faturados", fonteAtual: "Dados reais da operação",
    janelaBaseline: "Sem baseline (identificação nova)", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "historico_real",
    tendencia: 3.5, fatorReducao: 100,
    formulaResumo: "economia = horas_produtivas_identificadas × custo_real_da_hora",
    observacaoMetodologica: "Horas em postos não faturados identificadas pela operação. Custo real ou confiável dessas horas tratado como custo perdido eliminado.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: true, temBaselineReal: true, temFolha: false },
    upgradePaths: [],
    modalData: {
      colaboradoresImpactados: 1800,
      totalEventosBaseline: 0, totalEventosAtual: 41600,
      valorMonetarioBaseline: 0, valorMonetarioAtual: 520000,
      deltaCapturado: 520000, mediaPorColaborador: 288.89,
      nivelRastreabilidade: "alto",
      rankingUnidades: [
        { nome: "Regional Sul", valor: 150000 },
        { nome: "Regional Sudeste", valor: 195000 },
        { nome: "Regional Nordeste", valor: 110000 },
        { nome: "Regional Centro-Oeste", valor: 65000 },
      ],
    },
  },
  /* ── Intangíveis ── */
  {
    id: "d11", nome: "Redução do Tempo de Atendimento", categoria: "intangivel", moduloNexti: "RH Digital",
    unidadeMedida: "minutos", status: "ativo",
    baseline: 45, atual: 14, delta: -31, custoUnitario: 0, ganhoBruto: 0,
    confianca: "comprovado", fonteBaseline: "Pesquisa interna do cliente", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Pesquisa pré-implantação", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "historico_real", tendencia: -12.0, fatorReducao: 0,
    formulaResumo: "Tempo médio de atendimento antes vs depois (não monetizado)",
    observacaoMetodologica: "Ganho intangível. Contribui para satisfação do colaborador e eficiência de RH.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: false, temBaselineReal: true, temFolha: false },
    upgradePaths: [],
    modalData: { colaboradoresImpactados: 8000, totalEventosBaseline: 45, totalEventosAtual: 14, valorMonetarioBaseline: 0, valorMonetarioAtual: 0, deltaCapturado: 0, mediaPorColaborador: 0, nivelRastreabilidade: "alto" },
  },
  {
    id: "d12", nome: "Melhoria de SLA Interno", categoria: "intangivel", moduloNexti: "Operações",
    unidadeMedida: "%", status: "ativo",
    baseline: 72, atual: 91, delta: 19, custoUnitario: 0, ganhoBruto: 0,
    confianca: "comprovado", fonteBaseline: "Histórico do cliente", fonteAtual: "Dados reais do módulo",
    janelaBaseline: "Abr/2024 – Mar/2025", janelaAtual: "Abr/2025 – Mar/2026",
    hierarquiaBaseline: "historico_real", tendencia: 2.8, fatorReducao: 0,
    formulaResumo: "SLA interno antes vs depois (%)",
    observacaoMetodologica: "Ganho intangível. Melhoria de conformidade e governança operacional.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: false, temBaselineReal: true, temFolha: false },
    upgradePaths: [],
    modalData: { colaboradoresImpactados: 8000, totalEventosBaseline: 72, totalEventosAtual: 91, valorMonetarioBaseline: 0, valorMonetarioAtual: 0, deltaCapturado: 0, mediaPorColaborador: 0, nivelRastreabilidade: "alto" },
  },
  {
    id: "d13", nome: "Ganho de Governança", categoria: "intangivel", moduloNexti: "Compliance",
    unidadeMedida: "nível", status: "ativo",
    baseline: 2, atual: 4, delta: 2, custoUnitario: 0, ganhoBruto: 0,
    confianca: "comprovado", fonteBaseline: "Avaliação interna pré-implantação", fonteAtual: "Avaliação pós-implantação",
    janelaBaseline: "Avaliação pré-implantação", janelaAtual: "Mar/2026",
    hierarquiaBaseline: "historico_real", tendencia: 8, fatorReducao: 0,
    formulaResumo: "Nível de maturidade de governança antes vs depois (escala 1-5)",
    observacaoMetodologica: "Avaliação qualitativa de maturidade de governança trabalhista.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: false, temBaselineReal: true, temFolha: false },
    upgradePaths: [],
    modalData: { colaboradoresImpactados: 8000, totalEventosBaseline: 2, totalEventosAtual: 4, valorMonetarioBaseline: 0, valorMonetarioAtual: 0, deltaCapturado: 0, mediaPorColaborador: 0, nivelRastreabilidade: "alto" },
  },
  {
    id: "d14", nome: "Redução de Risco Reputacional", categoria: "intangivel", moduloNexti: "Compliance Trabalhista",
    unidadeMedida: "índice", status: "ativo",
    baseline: 7.5, atual: 3.8, delta: -3.7, custoUnitario: 0, ganhoBruto: 0,
    confianca: "hibrido", fonteBaseline: "Avaliação interna + benchmark", fonteAtual: "Estimativa pós-implantação",
    janelaBaseline: "Avaliação pré-implantação", janelaAtual: "Mar/2026",
    hierarquiaBaseline: "benchmark_interno", tendencia: -5.0, fatorReducao: 0,
    formulaResumo: "Índice de risco reputacional antes vs depois (escala 0-10)",
    observacaoMetodologica: "Ganho intangível baseado em redução de exposição trabalhista e passivos.",
    dataAvailability: { temModulo: true, temEventosReais: true, temValorFinanceiroReal: false, temBaselineReal: false, temFolha: false },
    upgradePaths: [
      { de: "hibrido", para: "comprovado", acao: "Importar base real de processos", detalhe: "Integrar histórico completo de processos trabalhistas para validação", prazo: "3-6 meses", esforco: "medio" },
    ],
    modalData: { colaboradoresImpactados: 8000, totalEventosBaseline: 7.5, totalEventosAtual: 3.8, valorMonetarioBaseline: 0, valorMonetarioAtual: 0, deltaCapturado: 0, mediaPorColaborador: 0, nivelRastreabilidade: "medio" },
  },
];

export const intangiveis = drivers.filter(d => d.categoria === "intangivel");

export const operacoes: ROIOperacao[] = [
  {
    nome: "Regional Sul", tipo: "regional",
    economiaBruta: 1820000, ownershipAtribuido: 429000, economiaLiquida: 1391000, roiTotal: 4.2,
    driversPrincipais: ["Horas Extras", "Custo Operacional"], pctComprovado: 72, tendencia: 5.2, scoreCaptura: 82, colaboradores: 2200,
  },
  {
    nome: "Regional Sudeste", tipo: "regional",
    economiaBruta: 2210000, ownershipAtribuido: 546000, economiaLiquida: 1664000, roiTotal: 4.0,
    driversPrincipais: ["Quadro Lotação", "Horas Extras"], pctComprovado: 65, tendencia: 3.8, scoreCaptura: 74, colaboradores: 2800,
  },
  {
    nome: "Regional Nordeste", tipo: "regional",
    economiaBruta: 1350000, ownershipAtribuido: 292500, economiaLiquida: 1057500, roiTotal: 4.6,
    driversPrincipais: ["Custo Operacional", "Papel"], pctComprovado: 78, tendencia: 7.1, scoreCaptura: 85, colaboradores: 1500,
  },
  {
    nome: "Regional Centro-Oeste", tipo: "regional",
    economiaBruta: 820000, ownershipAtribuido: 292500, economiaLiquida: 527500, roiTotal: 2.8,
    driversPrincipais: ["Horas Extras", "Fechamento"], pctComprovado: 55, tendencia: -1.5, scoreCaptura: 62, colaboradores: 1500,
  },
  {
    nome: "Contrato A – Logística", tipo: "contrato",
    economiaBruta: 1480000, ownershipAtribuido: 234000, economiaLiquida: 1246000, roiTotal: 6.3,
    driversPrincipais: ["Horas Extras", "Quadro Lotação"], pctComprovado: 70, tendencia: 4.5, scoreCaptura: 78, colaboradores: 1200,
  },
  {
    nome: "Contrato B – Segurança", tipo: "contrato",
    economiaBruta: 980000, ownershipAtribuido: 185250, economiaLiquida: 794750, roiTotal: 5.3,
    driversPrincipais: ["Horas Extras", "Adicional Noturno"], pctComprovado: 82, tendencia: 3.2, scoreCaptura: 88, colaboradores: 950,
  },
  {
    nome: "Contrato C – Facilities", tipo: "contrato",
    economiaBruta: 520000, ownershipAtribuido: 165750, economiaLiquida: 354250, roiTotal: 3.1,
    driversPrincipais: ["Papel", "Custo Operacional"], pctComprovado: 58, tendencia: -3.2, scoreCaptura: 55, colaboradores: 850,
  },
  {
    nome: "Unidade São Paulo", tipo: "unidade",
    economiaBruta: 2680000, ownershipAtribuido: 624000, economiaLiquida: 2056000, roiTotal: 4.3,
    driversPrincipais: ["Horas Extras", "Custo Operacional"], pctComprovado: 68, tendencia: 4.8, scoreCaptura: 76, colaboradores: 3200,
  },
];

/* ── Série temporal abr/2025 – mar/2026 ── */

export const mesesROI = ["Abr/25", "Mai/25", "Jun/25", "Jul/25", "Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25", "Jan/26", "Fev/26", "Mar/26"];
const economiaMensal = [310000, 350000, 400000, 450000, 510000, 540000, 560000, 580000, 610000, 640000, 670000, 720000];
const pctComprovadoMensal = [45, 48, 52, 55, 58, 62, 65, 68, 70, 72, 74, 76];
const ownershipMensal = 130000;

export const trendROI: ROITrendPoint[] = mesesROI.map((mes, i) => {
  const bruta = economiaMensal[i];
  const liquida = bruta - ownershipMensal;
  const acumulada = economiaMensal.slice(0, i + 1).reduce((s, v) => s + v, 0);
  const pctComp = pctComprovadoMensal[i];
  return {
    mes, roiTotal: +(bruta / ownershipMensal).toFixed(1),
    economiaBruta: bruta, economiaLiquida: liquida, economiaAcumulada: acumulada,
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

export function getAllDriversMonetarios() {
  return drivers.filter(d => d.categoria === "monetario");
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
  let acumEco = 0;
  const om = ownership.ownershipTotal / 12;
  for (let i = 0; i < economiaMensal.length; i++) {
    acumEco += economiaMensal[i];
    const acumOwn = (i + 1) * om;
    if (acumEco >= acumOwn) {
      const falta = acumOwn - (acumEco - economiaMensal[i]);
      const fracao = falta / economiaMensal[i];
      return +(i + fracao).toFixed(1);
    }
  }
  return 12;
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
  const driversComUpgrade = drivers.filter(d => d.upgradePaths.length > 0);

  return [
    { severity: "info" as const, text: `A operação capturou ${formatCurrency(eco)} em economia bruta no período abr/2025 – mar/2026, com redução de custos em ${monetarios.length} drivers ativos.` },
    { severity: "critical" as const, text: `Os maiores ganhos vieram de ${top3.join(", ")}, representando ${((top3.reduce((s, n) => s + (monetarios.find(d => d.nome === n)?.ganhoBruto || 0), 0) / eco) * 100).toFixed(0)}% do valor total capturado.` },
    { severity: "info" as const, text: `Do valor total, ${conf.comprovado.toFixed(0)}% (${formatCurrency(conf["comprovadoR$"])}) é sustentado por dados reais, com a maturidade de comprovação evoluindo de 45% para 76% no período.` },
    { severity: "warning" as const, text: `${driversComUpgrade.length} driver(s) podem elevar nível de comprovação com importação de dados: ${driversComUpgrade.map(d => d.nome).join(", ")}.` },
    { severity: "info" as const, text: `A economia líquida no período foi de ${formatCurrency(liq)}, resultado direto da evolução operacional e da captura de valor pela operação.` },
  ];
}
