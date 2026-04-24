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
  LayoutDashboard, ClipboardList, ShieldCheck, HeartHandshake, Settings,
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
import { Clock, CalendarX, UserMinus, Users, ShieldCheck as ShieldCheckIcon, Lightbulb, Plane } from "lucide-react";

export interface OperacionalSubTab {
  id: string;
  label: string;
  order: number;
  icon: LucideIcon;
}

export const OPERACIONAL_SUB_TABS: OperacionalSubTab[] = [
  { id: "qualidade", label: "Ponto", order: 1, icon: Clock },
  { id: "absenteismo", label: "Absenteísmo", order: 2, icon: CalendarX },
  { id: "turnover", label: "Turnover", order: 3, icon: UserMinus },
  { id: "movimentacoes", label: "Movimentações", order: 4, icon: Users },
  { id: "coberturas", label: "Coberturas", order: 5, icon: ShieldCheckIcon },
  { id: "ferias", label: "Férias", order: 6, icon: Plane },
  { id: "insights", label: "Insights", order: 7, icon: Lightbulb },
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
    id: "compliance",
    label: "Compliance",
    icon: ShieldCheck,
    order: 3,
    category: "locked",
    enabled: true,
    route: "/analytics/compliance",
  },
  {
    id: "engajamento",
    label: "Engajamento",
    icon: HeartHandshake,
    order: 4,
    category: "locked",
    enabled: true,
    route: "/analytics/engajamento",
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
