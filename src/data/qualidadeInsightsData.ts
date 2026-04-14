export interface QualidadeInsight {
  id: string;
  category: "risk" | "achievement" | "opportunity" | "event";
  severity: "critical" | "high" | "medium" | "info" | "success";
  title: string;
  narrative: string;
  evidence: { before: { label: string; value: string }; after: { label: string; value: string } } | null;
  action: string;
  actionFilter?: Record<string, string | number>;
  crossRef?: { targetId: string; label: string };
}

export const qualidadeInsights: QualidadeInsight[] = [
  // ── Riscos ──
  {
    id: "qi_r1",
    category: "risk",
    severity: "critical",
    title: "Empresa TERCEIRIZACAO DE SERVICOS LTDA opera abaixo do limite mínimo",
    narrative: "A empresa TERCEIRIZACAO DE SERVICOS LTDA tem score 48 (Ruim) e qualidade de 50%, abaixo do limite mínimo de 70. Diferente de outras operações que tiveram picos em set/25 e se recuperaram, essa empresa tem baseline ruim contínuo, o que indica disfunção estrutural e não problema pontual. Requer intervenção direta da liderança operacional local.",
    evidence: { before: { label: "Score atual", value: "48" }, after: { label: "Score mínimo aceitável", value: "70" } },
    action: "Revisar processos operacionais da empresa e supervisão local",
    actionFilter: { empresa: "TERCEIRIZACAO DE SERVICOS LTDA" },
    crossRef: { targetId: "qi_o4", label: "Ver ação recomendada em Oportunidades" },
  },
  {
    id: "qi_r2",
    category: "risk",
    severity: "critical",
    title: "Supervisor Geral concentra 25% de toda a tratativa de ponto",
    narrative: "Uma única pessoa com cargo de Supervisor Geral processou 14.073 dos 56.892 ajustes do período. Saída, ausência ou sobrecarga dessa pessoa impactaria a operação inteira. Pelo cargo ser gerencial, não gera HE registrada, o que esconde o custo real do esforço absorvido.",
    evidence: { before: { label: "Supervisor Geral", value: "14.073 ajustes" }, after: { label: "Total do período", value: "56.892" } },
    action: "Redistribuir carga entre os 5 Inspetores ativos ou contratar analista de apoio",
  },
  {
    id: "qi_r3",
    category: "risk",
    severity: "critical",
    title: "3 Inspetores acumularam 1.001 horas extras em 12 meses",
    narrative: "Nelson Castro (434h), Jonas Leandro (323h) e Vinicius Garrido (244h) concentram 72% das horas extras do back-office. Nelson fez em média 48h/mês, quase uma semana de trabalho extra por mês. Risco elevado de burnout e possível exposição a questionamento jurídico por excesso de jornada.",
    evidence: { before: { label: "Nelson Castro", value: "48h HE/mês médio" }, after: { label: "Baseline saudável", value: "10h/mês" } },
    action: "Implementar rodízio de tratativas e considerar contratação de 1 analista",
  },
  {
    id: "qi_r4",
    category: "risk",
    severity: "high",
    title: "Baseline de ajustes dobrou permanentemente em set/25",
    narrative: "Antes de set/25, a operação consolidada processava ~1.700 ajustes/mês. Desde a estabilização (fev-mar/26), o baseline novo é ~3.100/mês, quase 2x o anterior. O time de back-office continua com 8 pessoas, mesmo tamanho de antes. Se não houver expansão de time, a sobrecarga crônica vira estrutural.",
    evidence: { before: { label: "Baseline pré-set/25", value: "1.700 ajustes/mês" }, after: { label: "Baseline pós-set/25", value: "3.100 ajustes/mês" } },
    action: "Avaliar expansão de headcount do back-office",
  },
  // ── Conquistas ──
  {
    id: "qi_c1",
    category: "achievement",
    severity: "success",
    title: "Qualidade absorveu 4x o volume sem colapso",
    narrative: "Mesmo com o volume de ajustes explodindo 4x em set/25 (1.670 → 7.889), a qualidade do ponto caiu apenas 10pp no pior momento e já voltou ao patamar anterior de 76.5%. Poucas operações da mesma escala conseguiriam absorver esse impacto mantendo padrão.",
    evidence: { before: { label: "Volume set/25", value: "7.889 ajustes" }, after: { label: "Volume baseline", value: "1.670 ajustes" } },
    action: "Reconhecer esforço do time e documentar o processo de absorção como case interno",
  },
  {
    id: "qi_c2",
    category: "achievement",
    severity: "success",
    title: "Tempo médio de tratativa caiu 1.7 dias vs período anterior",
    narrative: "O tempo médio para resolver um ajuste caiu de 7.8 dias para 6.1 dias (-22%), mesmo com a carga operacional dobrando. Isso indica amadurecimento do processo e ganho real de eficiência, não só absorção passiva da demanda.",
    evidence: { before: { label: "Tempo médio anterior", value: "7.8 dias" }, after: { label: "Tempo médio atual", value: "6.1 dias" } },
    action: "Aplicar o aprendizado em outras operações",
  },
  {
    id: "qi_c3",
    category: "achievement",
    severity: "success",
    title: "Empresa SEGURANCA PATRIMONIAL LTDA opera com score 79 (Bom)",
    narrative: "A empresa SEGURANCA PATRIMONIAL LTDA mantém qualidade acima de 82% com equipe enxuta, tempo de tratativa de 4 dias e baixa variação sazonal. É o melhor exemplo interno de operação estável e pode servir de modelo para as demais empresas do grupo.",
    evidence: { before: { label: "Score", value: "79 (Bom)" }, after: { label: "Score médio do grupo", value: "65" } },
    action: "Mapear práticas da SEGURANCA PATRIMONIAL LTDA e replicar em outras unidades",
    actionFilter: { empresa: "SEGURANCA PATRIMONIAL LTDA" },
  },
  // ── Oportunidades ──
  {
    id: "qi_o1",
    category: "opportunity",
    severity: "high",
    title: "Delegar 50% da carga do Supervisor reduziria concentração em 60%",
    narrative: "Passar metade da carga atual do Supervisor Geral (7.000 dos 14.073 ajustes) para os 5 Inspetores elevaria a média individual em apenas 28%, ainda dentro de faixa saudável. A concentração de risco cairia de 25% para 13%. Ação de baixo custo com alto impacto em resiliência.",
    evidence: { before: { label: "Concentração atual", value: "25%" }, after: { label: "Pós-redistribuição", value: "13%" } },
    action: "Reunir liderança operacional para revisar delegação",
  },
  {
    id: "qi_o2",
    category: "opportunity",
    severity: "medium",
    title: "Aplicar SLA da SEGURANCA PATRIMONIAL na PORTARIA libera ~1.200 ajustes/mês mais rápido",
    narrative: "A empresa SEGURANCA PATRIMONIAL LTDA opera com tempo de tratativa de 4 dias, enquanto a empresa PORTARIA E LIMPEZA LTDA opera em 6 dias. Aplicar o mesmo processo operacional na PORTARIA permitiria resolver aproximadamente 1.200 ajustes/mês mais rápido, melhorando velocidade percebida pelos colaboradores.",
    evidence: { before: { label: "Tempo SEGURANCA", value: "4 dias" }, after: { label: "Tempo PORTARIA", value: "6 dias" } },
    action: "Mapear processo da SEGURANCA PATRIMONIAL LTDA e replicar na PORTARIA E LIMPEZA LTDA",
  },
  {
    id: "qi_o3",
    category: "opportunity",
    severity: "high",
    title: "Analista júnior de back-office tem ROI de 4 meses",
    narrative: "Com o baseline atual de ~120h de HE/mês distribuídos entre 3 inspetores, contratar 1 analista júnior com custo estimado de R$ 4.500/mês eliminaria R$ 3.600/mês de HE (120h × R$ 30/h). Considerando ramp-up, o investimento se paga em aproximadamente 4 meses, depois vira economia recorrente.",
    evidence: { before: { label: "HE evitada/mês", value: "~120h (R$ 3.600)" }, after: { label: "Custo analista júnior", value: "R$ 4.500" } },
    action: "Submeter proposta de contratação com business case de ROI",
  },
  {
    id: "qi_o4",
    category: "opportunity",
    severity: "high",
    title: "Problema da TERCEIRIZACAO DE SERVICOS LTDA é gerencial, não de carga",
    narrative: "Diferente das outras operações, a empresa TERCEIRIZACAO DE SERVICOS LTDA tem volume baixo mas qualidade crônica ruim. Não é um pico sazonal a ser resolvido com mais recurso, é um problema contínuo que exige intervenção de supervisão local, revisão de processo e possível capacitação da equipe operacional.",
    evidence: { before: { label: "Qualidade crônica", value: "50%" }, after: { label: "Qualidade esperada", value: "70%" } },
    action: "Iniciar auditoria operacional da empresa TERCEIRIZACAO DE SERVICOS LTDA",
    actionFilter: { empresa: "TERCEIRIZACAO DE SERVICOS LTDA" },
    crossRef: { targetId: "qi_r1", label: "Contexto do risco em Riscos" },
  },
  // ── Eventos e Tendências ──
  {
    id: "qi_e1",
    category: "event",
    severity: "info",
    title: "Contrato novo na unidade de negócio PORTARIA E LIMPEZA dobrou a operação",
    narrative: "Em setembro de 2025, a unidade de negócio PORTARIA E LIMPEZA absorveu entrada de novo contrato com +193 colaboradores, gerando pico de 7.553 ajustes em 1 mês (baseline anterior ~630). Foi o maior evento operacional do período. Time absorveu o impacto com 878h acumuladas de horas extras e ajuste de processo.",
    evidence: { before: { label: "Baseline ago/25", value: "628 ajustes" }, after: { label: "Pico set/25", value: "7.553 ajustes" } },
    action: "Documentar processo de onboarding de contrato grande pra próximas ocorrências",
  },
  {
    id: "qi_e2",
    category: "event",
    severity: "info",
    title: "Backlog foi absorvido em 4 meses com queda mensal estável",
    narrative: "Após o pico de set/25, o volume de ajustes caiu em ritmo consistente: -14% em out, -35% em nov, -33% em dez, -40% em jan. A operação estabilizou no novo baseline em fev/26. Indicador saudável de capacidade de recuperação da equipe de back-office.",
    evidence: { before: { label: "Pico set/25", value: "7.553 ajustes" }, after: { label: "Estabilização fev/26", value: "1.938 ajustes" } },
    action: "Usar curva como benchmark para próximos picos operacionais",
  },
];

export const categoryConfig = {
  risk: {
    label: "Riscos",
    icon: "AlertTriangle" as const,
    borderColor: "#ef4444",
    bgColor: "#fef2f2",
    textColor: "#991b1b",
    badgeBg: "#fee2e2",
  },
  achievement: {
    label: "Conquistas",
    icon: "Trophy" as const,
    borderColor: "#22c55e",
    bgColor: "#f0fdf4",
    textColor: "#166534",
    badgeBg: "#dcfce7",
  },
  opportunity: {
    label: "Oportunidades",
    icon: "Lightbulb" as const,
    borderColor: "#f59e0b",
    bgColor: "#fffbeb",
    textColor: "#92400e",
    badgeBg: "#fef3c7",
  },
  event: {
    label: "Eventos e Tendências",
    icon: "Activity" as const,
    borderColor: "#6b7280",
    bgColor: "#f9fafb",
    textColor: "#374151",
    badgeBg: "#f3f4f6",
  },
} as const;
