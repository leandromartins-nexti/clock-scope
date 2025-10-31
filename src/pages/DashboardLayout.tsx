import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FilterProvider } from "@/contexts/FilterContext";
import { PrimeFilterProvider } from "@/contexts/PrimeFilterContext";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";

const DashboardLayout = () => {
  return (
    <FilterProvider>
      <PrimeFilterProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-12 flex items-center border-b border-border bg-card px-4">
                <SidebarTrigger />
              </header>
              <DashboardFilters />
              <main className="flex-1">
                <Outlet />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </PrimeFilterProvider>
    </FilterProvider>
  );
};

export default DashboardLayout;
