import { Outlet } from "react-router-dom";
import { FilterProvider } from "@/contexts/FilterContext";
import { PrimeFilterProvider } from "@/contexts/PrimeFilterContext";

const DashboardLayout = () => {
  return (
    <FilterProvider>
      <PrimeFilterProvider>
        <div className="min-h-screen w-full bg-background">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </PrimeFilterProvider>
    </FilterProvider>
  );
};

export default DashboardLayout;
