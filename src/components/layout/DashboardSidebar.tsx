import { Home, Clock, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
export function DashboardSidebar() {
  const {
    state
  } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  
  return <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        {!isCollapsed && <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nexti Analytics
          </h1>}
        {isCollapsed && <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            N
          </div>}
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        {!isCollapsed && <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nexti Analytics
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/prime" className={({
                      isActive
                    }) => cn(isActive && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                      <span>Prime</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/haas" className={({
                      isActive
                    }) => cn(isActive && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                      <span>HaaS</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/rh-digital" className={({
                      isActive
                    }) => cn(location.pathname.startsWith("/rh-digital") && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                      <span>RH Digital</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/plus" className={({
                      isActive
                    }) => cn(isActive && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                      <span>Plus</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/time" className={({
                      isActive
                    }) => cn(isActive && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                      <span>Time</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/control" className={({
                      isActive
                    }) => cn(isActive && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                      <span>Control</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>}
      </SidebarContent>

    </Sidebar>;
}