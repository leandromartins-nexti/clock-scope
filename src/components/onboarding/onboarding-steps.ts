import {
  Sparkles, LayoutList, PanelLeftClose, Gauge, TrendingUp, Building2,
  MousePointerClick, Mouse, ToggleLeft, BarChart3, Lock, MessageSquare,
  CheckCircle2,
} from "lucide-react";

export interface OnboardingStep {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  /** CSS selector for the element to spotlight. null = centered modal (no spotlight). */
  target: string | null;
  /** Preferred tooltip position relative to target */
  tooltipPosition: "top" | "bottom" | "left" | "right";
  /** If true, show as centered modal instead of spotlight */
  isModal?: boolean;
  /** Custom label for next button on last step */
  nextLabel?: string;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    icon: Sparkles,
    title: "Este é o Analytics",
    description:
      "Uma visão operacional completa da sua operação. Aqui você analisa qualidade do ponto, absenteísmo, coberturas, violações e muito mais.",
    target: null,
    tooltipPosition: "bottom",
    isModal: true,
  },
  {
    id: "sidebar-menu",
    icon: LayoutList,
    title: "Navegue entre as visões",
    description:
      "O Analytics tem 5 páginas principais. Comece pelo Resumo Executivo para uma visão geral e aprofunde no Operacional para análises detalhadas por tema.",
    target: "[data-onboarding='analytics-menu']",
    tooltipPosition: "right",
  },
  {
    id: "collapse-sidebar",
    icon: PanelLeftClose,
    title: "Mais espaço para os gráficos",
    description:
      "Clique aqui para reduzir o menu lateral e ganhar mais área de visualização. Útil quando você está analisando dados complexos.",
    target: "[data-onboarding='sidebar-toggle']",
    tooltipPosition: "right",
  },
  {
    id: "score-operacional",
    icon: Gauge,
    title: "O Score Operacional resume tudo",
    description:
      "Número de 0 a 100 que combina indicadores principais. Clique no ícone de informação para ver como é calculado e ajustar os pesos em Configuração.",
    target: "[data-onboarding='score-operacional']",
    tooltipPosition: "bottom",
  },
  {
    id: "sparkline-table",
    icon: TrendingUp,
    title: "Indicadores com evolução visível",
    description:
      "Cada linha mostra o score, valor atual, variação e uma mini curva com os 12 meses. Passe o mouse sobre a curva para ver os valores mês a mês.",
    target: "[data-onboarding='sparkline-table']",
    tooltipPosition: "bottom",
  },
  {
    id: "tipo-operacao",
    icon: Building2,
    title: "Mude a perspectiva",
    description:
      "Troque entre Empresa, Unidade de Negócio e Área para ver os mesmos dados sob diferentes dimensões. Busque por nome e clique em qualquer item para filtrar toda a página.",
    target: "[data-onboarding='tipo-operacao']",
    tooltipPosition: "left",
  },
  {
    id: "click-filter",
    icon: MousePointerClick,
    title: "Clique para filtrar",
    description:
      "Clique com o botão esquerdo em qualquer ponto, barra ou área de um gráfico para filtrar a página inteira por aquele recorte. Por exemplo, clique num mês para ver apenas aquele período.",
    target: "[data-onboarding='chart-evolucao']",
    tooltipPosition: "right",
  },
  {
    id: "right-click",
    icon: Mouse,
    title: "Botão direito abre detalhes",
    description:
      "Clique com o botão direito em qualquer elemento do gráfico para abrir um modal com análise detalhada, drill-down por operação e ações disponíveis.",
    target: "[data-onboarding='chart-evolucao']",
    tooltipPosition: "right",
  },
  {
    id: "toggle-percent",
    icon: ToggleLeft,
    title: "Mude a visualização",
    description:
      "Alterne entre percentual (%) e valores absolutos (#) conforme a pergunta que você quer responder. Perfeito para comparar composição vs volume.",
    target: "[data-onboarding='chart-toggle']",
    tooltipPosition: "bottom",
  },
  {
    id: "chart-type",
    icon: BarChart3,
    title: "Escolha o melhor formato",
    description:
      "O mesmo dado pode ser visto como linha (para tendências), barra (para comparações) ou área (para composição acumulada). Experimente para encontrar o melhor para cada análise.",
    target: "[data-onboarding='chart-mode']",
    tooltipPosition: "bottom",
  },
  {
    id: "locked-items",
    icon: Lock,
    title: "Em breve: visão financeira e muito mais",
    description:
      "Estas abas serão liberadas em versões futuras. Com elas você verá retorno em R$, plano de ação automatizado, alertas de compliance e insights com IA.",
    target: "[data-onboarding='locked-items']",
    tooltipPosition: "right",
  },
  {
    id: "feedback",
    icon: MessageSquare,
    title: "Sua opinião importa",
    description:
      "Encontrou algo estranho? Tem uma sugestão? Clique aqui a qualquer momento para enviar feedback direto para o time de produto.",
    target: "[data-onboarding='feedback-button']",
    tooltipPosition: "left",
    nextLabel: "Finalizar tour",
  },
];
