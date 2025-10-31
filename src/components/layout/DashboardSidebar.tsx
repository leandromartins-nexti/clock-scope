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
  
  return <Sidebar className={cn(isCollapsed ? "w-16" : "w-64", "bg-[#343a40] border-r border-[rgba(255,255,255,0.1)]")} collapsible="icon">
      <SidebarHeader className="p-6 border-b border-[rgba(255,255,255,0.1)] bg-[#FF5722]">
        {!isCollapsed && <div className="text-white">
            <svg viewBox="0 0 120 40" className="w-32 h-10" fill="white">
              <text x="10" y="30" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fontStyle="italic">nexti</text>
            </svg>
          </div>}
        {isCollapsed && <div className="text-white font-bold text-2xl italic">
            n
          </div>}
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto bg-[#343a40]">
        {!isCollapsed && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Dashboard
              </SidebarGroupLabel>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Nexti Analytics
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/prime" className={({
                        isActive
                      }) => cn(
                        "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors pl-7",
                        isActive && "text-white bg-[rgba(255,255,255,0.1)] border-l-4 border-[#003399]"
                      )}>
                        <span>Prime</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/haas" className={({
                        isActive
                      }) => cn(
                        "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors pl-7",
                        isActive && "text-white bg-[rgba(255,255,255,0.1)] border-l-4 border-[#003399]"
                      )}>
                        <span>HaaS</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/rh-digital" className={({
                        isActive
                      }) => cn(
                        "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors pl-7",
                        location.pathname.startsWith("/rh-digital") && "text-white bg-[rgba(255,255,255,0.1)] border-l-4 border-[#003399]"
                      )}>
                        <span>RH Digital</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/plus" className={({
                        isActive
                      }) => cn(
                        "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors pl-7",
                        isActive && "text-white bg-[rgba(255,255,255,0.1)] border-l-4 border-[#003399]"
                      )}>
                        <span>Plus</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/time" className={({
                        isActive
                      }) => cn(
                        "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors pl-7",
                        isActive && "text-white bg-[rgba(255,255,255,0.1)] border-l-4 border-[#003399]"
                      )}>
                        <span>Time</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/control" className={({
                        isActive
                      }) => cn(
                        "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors pl-7",
                        isActive && "text-white bg-[rgba(255,255,255,0.1)] border-l-4 border-[#003399]"
                      )}>
                        <span>Control</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

    </Sidebar>;
}