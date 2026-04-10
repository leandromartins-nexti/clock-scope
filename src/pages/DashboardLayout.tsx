import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FilterProvider } from "@/contexts/FilterContext";
import { PrimeFilterProvider } from "@/contexts/PrimeFilterContext";
import { FeedbackButton } from "@/components/analytics/FeedbackButton";

const DashboardLayout = () => {
  return (
    <FilterProvider>
      <PrimeFilterProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-12 flex items-center border-b border-border bg-white px-4">
              </header>
              <main className="flex-1 flex flex-col">
                <Outlet />
              </main>
            </div>
          </div>
          <FeedbackButton />
        </SidebarProvider>
      </PrimeFilterProvider>
    </FilterProvider>
  );
};

export default DashboardLayout;
