import {
  Sparkles, Gauge, TrendingUp, Building2,
  MousePointerClick, Mouse, ToggleLeft, BarChart3, MessageSquare,
  ArrowLeft,
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
  /** If true, show a visual arrow pointing left (for iframe context where sidebar is external) */
  showLeftArrow?: boolean;
  /** Route to navigate to before showing this step */
  route?: string;
  /** If true, render as GTM promo modal with lead form */
  isGTM?: boolean;
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
    id: "sidebar-hint",
    icon: ArrowLeft,
    title: "Navegue pelo menu lateral",
    description:
      "Use o menu à esquerda para alternar entre as visões: Resumo Executivo, Operacional, Coberturas e mais. Recolha o menu para ter mais espaço nos gráficos.",
    target: null,
    tooltipPosition: "right",
    isModal: false,
    showLeftArrow: true,
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
    id: "drill-qualidade",
    icon: MousePointerClick,
    title: "Clique para detalhar",
    description:
      "Clique na linha de qualquer indicador para ir direto à tela de detalhes. Por exemplo, clique em 'Qualidade do Ponto' para ver a análise completa. Você também pode acessar pelo menu lateral esquerdo em Operacional.",
    target: "[data-onboarding='row-qualidade']",
    tooltipPosition: "bottom",
  },
  {
    id: "click-filter",
    icon: MousePointerClick,
    title: "Clique para filtrar",
    description:
      "Clique com o botão esquerdo em qualquer ponto, barra ou área de um gráfico para filtrar a página inteira por aquele recorte. Por exemplo, clique numa bolinha para filtrar por aquela operação.",
    target: "[data-onboarding='scatter-qualidade']",
    tooltipPosition: "top",
    route: "/analytics/operacional",
  },
  {
    id: "right-click",
    icon: Mouse,
    title: "Botão direito abre detalhes",
    description:
      "Clique com o botão direito em qualquer elemento do gráfico para abrir um modal com análise detalhada, drill-down por operação e ações disponíveis.",
    target: "[data-onboarding='scatter-qualidade']",
    tooltipPosition: "top",
    route: "/analytics/operacional",
  },
  {
    id: "toggle-percent",
    icon: ToggleLeft,
    title: "Mude a visualização",
    description:
      "Alterne entre percentual (%) e valores absolutos (#) conforme a pergunta que você quer responder. Perfeito para comparar composição vs volume.",
    target: "[data-onboarding='chart-toggle']",
    tooltipPosition: "bottom",
    route: "/analytics/operacional",
  },
  {
    id: "chart-type",
    icon: BarChart3,
    title: "Escolha o melhor formato",
    description:
      "O mesmo dado pode ser visto como linha (para tendências), barra (para comparações) ou área (para composição acumulada). Experimente para encontrar o melhor para cada análise.",
    target: "[data-onboarding='chart-mode']",
    tooltipPosition: "bottom",
    route: "/analytics/operacional",
  },
  {
    id: "feedback",
    icon: MessageSquare,
    title: "Sua opinião importa",
    description:
      "Encontrou algo estranho? Tem uma sugestão? Clique aqui a qualquer momento para enviar feedback direto para o time de produto.",
    target: "[data-onboarding='feedback-button']",
    tooltipPosition: "left",
  },
  {
    id: "gtm-promo",
    icon: Sparkles,
    title: "Oferta exclusiva de lançamento",
    description: "",
    target: null,
    tooltipPosition: "bottom",
    isModal: true,
    isGTM: true,
    nextLabel: "Finalizar tour",
  },
];
