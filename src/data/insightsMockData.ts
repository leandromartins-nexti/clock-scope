export interface InsightEvidence {
  before: { label: string; value: string };
  after: { label: string; value: string };
}

export interface Insight {
  id: string;
  category: "critical" | "event" | "achievement" | "opportunity" | "trend";
  severity: "critical" | "warning" | "info" | "success";
  tabOrigin: string;
  timestamp: string;
  title: string;
  narrative: string;
  evidence: InsightEvidence | null;
  actionFilter: Record<string, string | number> | null;
}

export const mockInsights: Insight[] = [
  {
    id: "ins_001",
    category: "critical",
    severity: "critical",
    tabOrigin: "Qualidade do Ponto",
    timestamp: "há 2h",
    title: "TER opera abaixo da linha de corte",
    narrative:
      "Terceirização está com qualidade de 50% e score 50, abaixo do limite mínimo de 70. Volume baixo (12K marcações) mas concentrado em poucos colaboradores, indicando falha sistêmica e não pontual.",
    evidence: null,
    actionFilter: { unidadeNegocio: "TER" },
  },
  {
    id: "ins_002",
    category: "event",
    severity: "info",
    tabOrigin: "Movimentações · set/25",
    timestamp: "há 1d",
    title: "Operação POR dobrou em 30 dias",
    narrative:
      "Headcount foi de 225 para 418 colaboradores (+193) em set/25, provável entrada de contrato novo. Volume de marcações triplicou no mesmo período.",
    evidence: {
      before: { label: "Antes", value: "225" },
      after: { label: "Depois", value: "418 (+85%)" },
    },
    actionFilter: {
      unidadeNegocio: "POR",
      periodStart: "2025-09-01",
      periodEnd: "2025-09-30",
    },
  },
  {
    id: "ins_003",
    category: "achievement",
    severity: "success",
    tabOrigin: "Qualidade do Ponto",
    timestamp: "há 2d",
    title: "Qualidade aguentou a duplicação da operação",
    narrative:
      "Mesmo com 3x o volume de marcações, a qualidade caiu apenas 3 pontos no pico e recuperou em 60 dias. Back-office absorveu o crescimento sem degradar o serviço.",
    evidence: null,
    actionFilter: null,
  },
  {
    id: "ins_004",
    category: "achievement",
    severity: "success",
    tabOrigin: "Qualidade do Ponto",
    timestamp: "há 2d",
    title: "Justificadas em queda há 6 meses",
    narrative:
      "De 8.000 ajustes/mês no pico de set/25 para 1.318 em mar/26, redução de 84% mantendo o volume operacional alto. Indicador de maturidade da operação.",
    evidence: null,
    actionFilter: null,
  },
  {
    id: "ins_005",
    category: "opportunity",
    severity: "warning",
    tabOrigin: "Qualidade do Ponto",
    timestamp: "há 3d",
    title: "Tempo de tratativa pode cair mais 2 dias",
    narrative:
      "Atual em 6 dias, melhor operação do grupo (SEG) opera em 4 dias. Aplicando o mesmo SLA na POR liberaria ~1.200 ajustes mais rápido por mês.",
    evidence: null,
    actionFilter: { unidadeNegocio: "POR" },
  },
  // ── Turnover · Ranking de Clientes ──
  {
    id: "ins_006",
    category: "critical",
    severity: "critical",
    tabOrigin: "Turnover · Ranking de Clientes",
    timestamp: "há 1h",
    title: "92% da operação depende de 1 único contrato",
    narrative: "A Prefeitura de Sorocaba concentra 412 dos 449 colaboradores ativos da Vig Eyes. A perda desse contrato representaria impacto operacional e financeiro imediato. Recomenda-se acelerar diversificação do portfólio de clientes.",
    evidence: {
      before: { label: "Prefeitura SP", value: "412 colab." },
      after: { label: "Demais clientes", value: "37 colab." },
    },
    actionFilter: { client_id: 549577 },
  },
  {
    id: "ins_007",
    category: "achievement",
    severity: "success",
    tabOrigin: "Turnover · Ranking de Clientes",
    timestamp: "há 1h",
    title: "Prefeitura de Sorocaba opera 75% abaixo do benchmark",
    narrative: "Com 19.7% de turnover anual e tempo médio de casa de 274 dias, o contrato Prefeitura de Sorocaba performa muito acima da mediana do setor de vigilância e facilities (80% a 120% ao ano). Representa case de retenção que pode ser replicado em outros contratos.",
    evidence: null,
    actionFilter: { client_id: 549577 },
  },
  {
    id: "ins_008",
    category: "critical",
    severity: "warning",
    tabOrigin: "Turnover · Ranking de Clientes",
    timestamp: "há 3h",
    title: "Super Laminação com 50% de turnover",
    narrative: "O contrato Super Laminação teve 14 saídas contra 9 colaboradores ativos no período, indicando rotatividade excepcional. Tempo médio de casa de 206 dias. Vale investigar se é questão de condição local, distância, periculosidade ou supervisão.",
    evidence: {
      before: { label: "Ativos", value: "9" },
      after: { label: "Saídas no período", value: "14 (+55%)" },
    },
    actionFilter: { client_id: 549578 },
  },
  {
    id: "ins_009",
    category: "event",
    severity: "info",
    tabOrigin: "Turnover · Ranking de Clientes",
    timestamp: "há 1d",
    title: "3 contratos encerrados no período",
    narrative: "Edifício Alana II, Construtora Tenda e outro contrato tiveram saídas registradas mas zero colaboradores ativos ao final do período. Indica encerramento ou migração de contratos. Considerar revisar o pipeline comercial para entender se foram perdas ou evolução natural de portfólio.",
    evidence: null,
    actionFilter: null,
  },
  {
    id: "ins_010",
    category: "trend",
    severity: "info",
    tabOrigin: "Turnover · Ranking de Clientes",
    timestamp: "há 1d",
    title: "Quadro corporativo da Vig Eyes é o mais estável",
    narrative: "O cliente interno Vig Eyes (colaboradores administrativos e sede) tem tempo médio de casa entre 247 e 1.230 dias nas 3 empresas do grupo, muito acima da média operacional. Confirma que a retenção corporativa funciona bem, o desafio está na operação de campo.",
    evidence: null,
    actionFilter: { client_id: 549859 },
  },
  {
    id: "ins_011",
    category: "critical",
    severity: "critical",
    tabOrigin: "Operação de Ponto · Estrutura da Tratativa",
    timestamp: "há 1h",
    title: "Supervisor Geral concentra 25% da tratativa de ponto",
    narrative:
      "Uma única pessoa com cargo de Supervisor Geral processou 14.073 dos 56.892 ajustes do período. Saída, ausência ou sobrecarga dessa pessoa impactaria a operação inteira. Recomenda-se redistribuir parte da carga entre os 5 Inspetores ativos.",
    evidence: {
      before: { label: "Supervisor Geral (1 pessoa)", value: "14.073 ajustes" },
      after: { label: "Total do período", value: "56.892 ajustes" },
    },
    actionFilter: null,
  },
  {
    id: "ins_012",
    category: "event",
    severity: "warning",
    tabOrigin: "Operação de Ponto · Estrutura da Tratativa",
    timestamp: "há 1h",
    title: "Cargos gerenciais tratam 13.7% do ponto",
    narrative:
      "Diretor Operacional e Gerente Financeiro somaram 7.658 ajustes no período. Isso indica ausência de time administrativo dedicado ao back-office de ponto ou processo de aprovação excessivamente centralizado em níveis estratégicos. Em ambos os casos há oportunidade de estruturação organizacional.",
    evidence: null,
    actionFilter: null,
  },
  {
    id: "ins_013",
    category: "opportunity",
    severity: "warning",
    tabOrigin: "Operação de Ponto · Estrutura da Tratativa",
    timestamp: "há 1h",
    title: "Redistribuir carga reduziria risco em 60%",
    narrative:
      "Delegar metade da carga do Supervisor Geral (7.000 ajustes) para os 5 Inspetores elevaria a média individual de cada Inspetor em 28%, ainda dentro de faixa saudável, e reduziria a concentração crítica de 25% para menos de 13%. Ação de baixo custo com alto impacto em resiliência operacional.",
    evidence: null,
    actionFilter: null,
  },
];
