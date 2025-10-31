import { BarChart3, Car, Clock, Map, Megaphone, CheckSquare, ArrowLeftRight, BookOpen, ChevronDown, Star, Smartphone, Users, PlusCircle, Timer, Shield } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import nextiLogo from "@/assets/nexti-logo.png";
import nextiLogoSmall from "@/assets/nexti-logo-small.png";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  useSidebar 
} from "@/components/ui/sidebar";
import { SidebarToggleButton } from "./SidebarToggleButton";

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [rhDigitalOpen, setRhDigitalOpen] = useState(false);
  const [nextiControlOpen, setNextiControlOpen] = useState(false);
  const [nextiControl2Open, setNextiControl2Open] = useState(false);
  const [livroOpen, setLivroOpen] = useState(false);
  
  return (
    <Sidebar 
      className={cn(
        isCollapsed ? "w-16" : "w-64", 
        "bg-[#3d4449] border-r border-[rgba(255,255,255,0.05)]"
      )} 
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
            <img src={nextiLogoSmall} alt="N" className="h-8 w-auto object-contain" />
          </div>
        )}
        <SidebarToggleButton className="text-white hover:bg-[rgba(255,255,255,0.1)] h-8 w-8 p-0 ml-auto" />
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto bg-[#3d4449]">
        {/* Dashboard */}
        <SidebarGroup className="px-3 py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3">
                <BarChart3 className="w-5 h-5 mr-3" />
                {!isCollapsed && <span className="font-normal text-[15px]">Dashboard</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Nexti Analytics */}
        {!isCollapsed ? (
          <Collapsible open={analyticsOpen} onOpenChange={setAnalyticsOpen} className="px-3">
            <CollapsibleTrigger className="w-full">
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 w-full justify-between">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  <span className="font-normal text-[15px]">Nexti Analytics</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", analyticsOpen && "rotate-180")} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu className="mt-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/prime" 
                      className={({ isActive }) => cn(
                        "text-[#929DA7] hover:text-white transition-colors pl-11 h-10 font-normal text-[15px]",
                        isActive && "text-white"
                      )}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      <span>Prime</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/haas" 
                      className={({ isActive }) => cn(
                        "text-[#929DA7] hover:text-white transition-colors pl-11 h-10 font-normal text-[15px]",
                        isActive && "text-white"
                      )}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      <span>HaaS</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/rh-digital" 
                      className={() => cn(
                        "text-[#929DA7] hover:text-white transition-colors pl-11 h-10 font-normal text-[15px]",
                        location.pathname.startsWith("/rh-digital") && "text-white"
                      )}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      <span>RH Digital</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/plus" 
                      className={({ isActive }) => cn(
                        "text-gray-400 hover:text-white transition-colors pl-11 h-10 font-normal text-[15px]",
                        isActive && "text-white"
                      )}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      <span>Plus</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/time" 
                      className={({ isActive }) => cn(
                        "text-[#929DA7] hover:text-white transition-colors pl-11 h-10 font-normal text-[15px]",
                        isActive && "text-white"
                      )}
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      <span>Time</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/control" 
                      className={({ isActive }) => cn(
                        "text-[#929DA7] hover:text-white transition-colors pl-11 h-10 font-normal text-[15px]",
                        isActive && "text-white"
                      )}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Control</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarGroup className="px-3 py-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 justify-center">
                  <BarChart3 className="w-5 h-5" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Mesa de Operações */}
        <SidebarGroup className="px-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3">
                <Clock className="w-5 h-5 mr-3" />
                {!isCollapsed && <span className="font-normal text-[15px]">Mesa de Operações</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Mapa de Postos */}
        <SidebarGroup className="px-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3">
                <Map className="w-5 h-5 mr-3" />
                {!isCollapsed && <span className="font-normal text-[15px]">Mapa de Postos</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* RH Digital Section */}
        {!isCollapsed ? (
          <Collapsible open={rhDigitalOpen} onOpenChange={setRhDigitalOpen} className="px-3">
            <CollapsibleTrigger className="w-full">
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 w-full justify-between">
                <div className="flex items-center">
                  <Megaphone className="w-5 h-5 mr-3" />
                  <span className="font-normal text-[15px]">RH Digital</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", rhDigitalOpen && "rotate-180")} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu className="mt-1">
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-[#929DA7] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors pl-11 h-10 font-normal text-[15px]">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    <span>Checklist</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-[#929DA7] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors pl-11 h-10 font-normal text-[15px]">
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    <span>Movimentações em Lote</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarGroup className="px-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 justify-center">
                  <Megaphone className="w-5 h-5" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Nexti Control */}
        {!isCollapsed ? (
          <Collapsible open={nextiControlOpen} onOpenChange={setNextiControlOpen} className="px-3">
            <CollapsibleTrigger className="w-full">
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 w-full justify-between">
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-3" />
                  <span className="font-normal text-[15px]">Nexti Control</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", nextiControlOpen && "rotate-180")} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu className="mt-1">
                {/* Placeholder for future items */}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarGroup className="px-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 justify-center">
                  <Car className="w-5 h-5" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Nexti Control 2.0 */}
        {!isCollapsed ? (
          <Collapsible open={nextiControl2Open} onOpenChange={setNextiControl2Open} className="px-3">
            <CollapsibleTrigger className="w-full">
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 w-full justify-between">
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-3" />
                  <span className="font-normal text-[15px]">Nexti Control 2.0</span>
                  <span className="ml-2 px-2 py-0.5 bg-[#FF5722] text-white text-xs rounded font-medium">Beta</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", nextiControl2Open && "rotate-180")} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu className="mt-1">
                {/* Placeholder for future items */}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarGroup className="px-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 justify-center">
                  <Car className="w-5 h-5" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Livro de Ocorrência */}
        {!isCollapsed ? (
          <Collapsible open={livroOpen} onOpenChange={setLivroOpen} className="px-3">
            <CollapsibleTrigger className="w-full">
              <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 w-full justify-between">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3" />
                  <span className="font-normal text-[15px]">Livro de Ocorrência</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", livroOpen && "rotate-180")} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu className="mt-1">
                {/* Placeholder for future items */}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarGroup className="px-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-white hover:bg-[rgba(255,255,255,0.05)] h-10 px-3 justify-center">
                  <BookOpen className="w-5 h-5" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}