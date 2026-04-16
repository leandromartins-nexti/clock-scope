import {
  BarChart3, Lock, Users,
  Clock, Map, Megaphone, CheckSquare, ArrowLeftRight, Car, ChevronDown,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import nextiLogo from "@/assets/nexti-logo.png";
import nextiLogoSmall from "@/assets/nexti-logo-small.png";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  Collapsible, CollapsibleContent, CollapsibleTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { SidebarToggleButton } from "./SidebarToggleButton";

// ─── Analytics submenu items derived from registry ────────────────────
import { getSidebarMenuTabs } from "@/config/analytics-tabs";

const analyticsSubmenus = getSidebarMenuTabs().map(tab => ({
  label: tab.label,
  icon: tab.icon,
  route: tab.route,
  locked: tab.category === "locked",
}));

// ─── Legacy menu items (non-Analytics) ──────────────────────────

function LegacyMenuItems({ isCollapsed }: { isCollapsed: boolean }) {
  const [rhDigitalOpen, setRhDigitalOpen] = useState(false);
  const [nextiControlOpen, setNextiControlOpen] = useState(false);

  const collapsibleSection = (
    label: string,
    Icon: React.ElementType,
    open: boolean,
    setOpen: (v: boolean) => void,
    badge?: string,
    children?: React.ReactNode
  ) => {
    if (isCollapsed) {
      return (
        <SidebarGroup className="px-3 py-0.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 justify-center">
                <Icon className="w-5 h-5" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      );
    }

    return (
      <Collapsible open={open} onOpenChange={setOpen} className="px-3">
        <CollapsibleTrigger className="w-full">
          <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 w-full justify-between">
            <div className="flex items-center">
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-normal text-[15px]">{label}</span>
              {badge && <span className="ml-2 px-2 py-0.5 bg-[#FF5722] text-white text-xs rounded font-medium">{badge}</span>}
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu className="mt-1">{children}</SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <>
      <SidebarGroup className="px-3 py-0.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={cn("text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3", isCollapsed && "justify-center")}>
              <Clock className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span className="font-normal text-[15px]">Mesa de Operações</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="px-3 py-0.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={cn("text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3", isCollapsed && "justify-center")}>
              <Map className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span className="font-normal text-[15px]">Mapa de Postos</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {collapsibleSection("RH Digital", Megaphone, rhDigitalOpen, setRhDigitalOpen, undefined,
        <>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-[#A1A3A4] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors pl-11 h-10 font-normal text-[15px]">
              <CheckSquare className="w-4 h-4 mr-2 text-[#A1A3A4]" />
              <span>Checklist</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-[#A1A3A4] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors pl-11 h-10 font-normal text-[15px]">
              <ArrowLeftRight className="w-4 h-4 mr-2 text-[#A1A3A4]" />
              <span>Movimentações em Lote</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </>
      )}

      {collapsibleSection("Nexti Control", Car, nextiControlOpen, setNextiControlOpen)}
    </>
  );
}

// ─── Main Sidebar ───────────────────────────────────────────────

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  const [analyticsOpen, setAnalyticsOpen] = useState(
    location.pathname.startsWith("/analytics")
  );

  const isAnalyticsActive = (route: string) => {
    if (route === "/analytics") return location.pathname === "/analytics";
    return location.pathname.startsWith(route);
  };

  return (
    <Sidebar
      className={cn(isCollapsed ? "w-16" : "w-64", "bg-[#3d4449] border-r border-[rgba(255,255,255,0.05)]")}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[#FF5722] flex flex-row items-center justify-between">
        {!isCollapsed && (
          <div className="text-white">
            <img src={nextiLogo} alt="Nexti" className="h-10" />
          </div>
        )}
        {isCollapsed && (
          <div className="text-white flex items-center justify-center w-full">
            <img src={nextiLogoSmall} alt="N" className="h-12 w-auto object-contain" />
          </div>
        )}
        <SidebarToggleButton data-onboarding="sidebar-toggle" className="text-white hover:bg-[rgba(255,255,255,0.1)] h-8 w-8 p-0 ml-auto" />
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto bg-[#3d4449] [&>*+*]:mt-0">
        {/* ── Analytics Section ── */}
        {isCollapsed ? (
          <SidebarGroup className="px-3 py-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 justify-center">
                  <NavLink to="/analytics">
                    <BarChart3 className="w-5 h-5" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <Collapsible open={analyticsOpen} onOpenChange={setAnalyticsOpen} className="px-3 py-1" data-onboarding="analytics-menu">
            <CollapsibleTrigger className="w-full">
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 w-full justify-between">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  <span className="font-semibold text-[15px]">Analytics</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", analyticsOpen && "rotate-180")} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu className="mt-0.5">
                {analyticsSubmenus.map((item) => (
                  <SidebarMenuItem key={item.label} {...(item.locked ? { "data-onboarding": "locked-items" } : {})}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "text-[#A1A3A4] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors pl-11 h-9 font-normal text-[14px]",
                        isAnalyticsActive(item.route) && "text-white bg-[rgba(255,255,255,0.08)]"
                      )}
                    >
                      <NavLink to={item.route}>
                        <item.icon className="w-4 h-4 mr-2 text-[#A1A3A4]" />
                        <span className="flex-1">{item.label}</span>
                        {item.locked && <Lock className="w-3 h-3 ml-auto text-[#A1A3A4]" />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* ── Divider ── */}
        <div className="mx-3 my-2 border-t border-[rgba(255,255,255,0.1)]" />

        {/* ── Legacy items ── */}
        <LegacyMenuItems isCollapsed={isCollapsed} />
      </SidebarContent>
    </Sidebar>
  );
}
