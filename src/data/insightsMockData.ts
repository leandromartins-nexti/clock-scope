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
  actionFilter: Record<string, string> | null;
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
];
