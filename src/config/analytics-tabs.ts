/**
 * Analytics Tab Registry — Single Source of Truth
 * 
 * Adding a new analytics tab = adding 1 entry here.
 * Menu, routing, and lazy loading derive from this registry.
 * 
 * Categories map to the sidebar menu sections:
 * - 'operacional': tabs inside /analytics/operacional
 * - 'gestao': tabs inside /analytics (top-level menu items)
 * - 'locked': tabs that show the LockedTabOverlay
 */

import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, ClipboardList, DollarSign, Target,
  Gavel, Brain, Settings,
} from "lucide-react";

export interface AnalyticsTabConfig {
  /** Unique identifier, used in URL paths */
  id: string;
  /** Display label in sidebar and tab bar */
  label: string;
  /** Optional description for tooltips */
  description?: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Order in the menu */
  order: number;
  /** Grouping category */
  category: "gestao" | "operacional" | "locked";
  /** Whether the tab is enabled (visible) */
  enabled: boolean;
  /** Route path (relative to /analytics) */
  route: string;
  /** Lazy component (only for enabled, non-locked tabs) */
  component?: LazyExoticComponent<ComponentType<any>>;
}

// ── Operacional sub-tabs (rendered inside AnalyticsOperacional) ──
export interface OperacionalSubTab {
  id: string;
  label: string;
  order: number;
}

export const OPERACIONAL_SUB_TABS: OperacionalSubTab[] = [
  { id: "qualidade", label: "Qualidade do Ponto", order: 1 },
  { id: "absenteismo", label: "Absenteísmo", order: 2 },
  { id: "turnover", label: "Turnover", order: 3 },
  { id: "movimentacoes", label: "Movimentações", order: 4 },
  { id: "coberturas", label: "Coberturas", order: 5 },
];

// ── Top-level Analytics menu items ──
export const ANALYTICS_TABS: AnalyticsTabConfig[] = [
  {
    id: "resumo-executivo",
    label: "Resumo Executivo",
    icon: LayoutDashboard,
    order: 1,
    category: "gestao",
    enabled: true,
    route: "/analytics",
    component: lazy(() => import("@/pages/analytics/AnalyticsResumoExecutivo")),
  },
  {
    id: "operacional",
    label: "Operacional",
    icon: ClipboardList,
    order: 2,
    category: "gestao",
    enabled: true,
    route: "/analytics/operacional",
    component: lazy(() => import("@/pages/analytics/AnalyticsOperacional")),
  },
  {
    id: "financeiro",
    label: "Financeiro",
    icon: DollarSign,
    order: 3,
    category: "locked",
    enabled: true,
    route: "/analytics/financeiro",
  },
  {
    id: "estrategico",
    label: "Estratégico",
    icon: Target,
    order: 4,
    category: "locked",
    enabled: true,
    route: "/analytics/estrategico",
  },
  {
    id: "compliance",
    label: "Compliance Avançado",
    icon: Gavel,
    order: 5,
    category: "locked",
    enabled: true,
    route: "/analytics/compliance",
  },
  {
    id: "inteligencia",
    label: "Inteligência",
    icon: Brain,
    order: 6,
    category: "locked",
    enabled: true,
    route: "/analytics/inteligencia",
  },
  {
    id: "configuracao",
    label: "Configuração",
    icon: Settings,
    order: 99,
    category: "gestao",
    enabled: true,
    route: "/analytics/configuracao",
    component: lazy(() => import("@/pages/analytics/AnalyticsConfiguracao")),
  },
];

/** Get only enabled tabs, sorted by order */
export function getEnabledTabs() {
  return ANALYTICS_TABS
    .filter(t => t.enabled)
    .sort((a, b) => a.order - b.order);
}

/** Get tabs for the sidebar menu */
export function getSidebarMenuTabs() {
  return getEnabledTabs();
}

/** Check if a tab is locked */
export function isTabLocked(tabId: string): boolean {
  const tab = ANALYTICS_TABS.find(t => t.id === tabId);
  return tab?.category === "locked";
}
