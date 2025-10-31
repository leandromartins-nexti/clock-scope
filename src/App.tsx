import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import Prime from "./pages/Prime";
import Haas from "./pages/Haas";
import HaasSmart from "./pages/HaasSmart";
import HaasTerminal from "./pages/HaasTerminal";
import DirectPage from "./pages/rh-digital/DirectPage";
import AvisosPage from "./pages/rh-digital/AvisosPage";
import ChecklistPage from "./pages/rh-digital/ChecklistPage";
import Plus from "./pages/Plus";
import Time from "./pages/Time";
import Control from "./pages/Control";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Prime />} />
            <Route path="/prime" element={<Prime />} />
            <Route path="/haas" element={<Haas />} />
            <Route path="/haas/smart" element={<HaasSmart />} />
            <Route path="/haas/terminal" element={<HaasTerminal />} />
            <Route path="/rh-digital/direct" element={<DirectPage />} />
            <Route path="/rh-digital/avisos" element={<AvisosPage />} />
            <Route path="/rh-digital/checklist" element={<ChecklistPage />} />
            <Route path="/plus" element={<Plus />} />
            <Route path="/time" element={<Time />} />
            <Route path="/control" element={<Control />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
