import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import NextiAnalytics from "./pages/NextiAnalytics";
import StrategyPrime from "./pages/StrategyPrime";
import OperacionalPrime from "./pages/OperacionalPrime";
import Executive from "./pages/Executive";
import ExecutiveV2 from "./pages/ExecutiveV2";
import AnalyticsV3 from "./pages/AnalyticsV3";
import ROIConfig from "./pages/ROIConfig";
import ROIConfigV3 from "./pages/ROIConfigV3";
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
            <Route path="/" element={<NextiAnalytics />} />
            <Route path="/nexti-analytics" element={<NextiAnalytics />} />
            <Route path="/strategy-prime" element={<StrategyPrime />} />
            <Route path="/operacional-prime" element={<OperacionalPrime />} />
            <Route path="/executive" element={<Executive />} />
            <Route path="/executive-v2" element={<ExecutiveV2 />} />
            <Route path="/roi-config" element={<ROIConfig />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
