import { Outlet, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { FilterProvider } from "@/contexts/FilterContext";
import { PrimeFilterProvider } from "@/contexts/PrimeFilterContext";
import { FloatingActionMenu } from "@/components/layout/FloatingActionMenu";
import OnboardingTour from "@/components/onboarding/OnboardingTour";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomer } from "@/contexts/CustomerContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CLIENT_OPTIONS = [
  { value: "orsegups", label: "Orsegups", customerId: 2 },
  { value: "atitudeservicos", label: "Atitude Serviços", customerId: 391 },
  { value: "vigeyes", label: "VigEyes", customerId: 642 },
];

const MobileMenuButton = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={toggleSidebar} aria-label="Abrir menu">
      <Menu className="h-5 w-5" />
    </Button>
  );
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { canSwitchClient, customerId, setCustomerId } = useCustomer();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // For nexti users, find which client is active by customerId
  const activeClientValue = CLIENT_OPTIONS.find(c => c.customerId === customerId)?.value ?? "";

  return (
    <FilterProvider>
      <PrimeFilterProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-12 flex items-center justify-between border-b border-border bg-card px-4">
                <div className="flex items-center gap-3">
                  <MobileMenuButton />
                  {canSwitchClient && (
                    <Select
                      value={activeClientValue}
                      onValueChange={(v) => {
                        const opt = CLIENT_OPTIONS.find(c => c.value === v);
                        if (opt) setCustomerId(opt.customerId);
                      }}
                    >
                      <SelectTrigger className="h-8 w-44 text-xs">
                        <SelectValue placeholder="Selecionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLIENT_OPTIONS.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {user?.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-xs gap-1.5">
                    <LogOut className="h-3.5 w-3.5" />
                    Sair
                  </Button>
                </div>
              </header>
              <main className="flex-1 flex flex-col">
                <Outlet />
              </main>
            </div>
          </div>
          <FloatingActionMenu />
          <OnboardingTour />
        </SidebarProvider>
      </PrimeFilterProvider>
    </FilterProvider>
  );
};

export default DashboardLayout;
