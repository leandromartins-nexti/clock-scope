import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Login from "./pages/Login";
import { ScoreConfigProvider } from "./contexts/ScoreConfigContext";
import { AbsenteismoScoreConfigProvider } from "./contexts/AbsenteismoScoreConfigContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Analytics V1 pages
import AnalyticsResumoExecutivo from "./pages/analytics/AnalyticsResumoExecutivo";
import AnalyticsOperacional from "./pages/analytics/AnalyticsOperacional";
import AnalyticsFinanceiro from "./pages/analytics/AnalyticsFinanceiro";
import AnalyticsEstrategico from "./pages/analytics/AnalyticsEstrategico";
import AnalyticsCompliance from "./pages/analytics/AnalyticsCompliance";
import AnalyticsInteligencia from "./pages/analytics/AnalyticsInteligencia";
import AnalyticsConfiguracao from "./pages/analytics/AnalyticsConfiguracao";
import GaugeShowcase from "./pages/analytics/GaugeShowcase";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <CustomerProvider>
      <ScoreConfigProvider>
        <AbsenteismoScoreConfigProvider>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<AnalyticsResumoExecutivo />} />
              <Route path="/nexti-analytics" element={<NextiAnalytics />} />
              <Route path="/strategy-prime" element={<StrategyPrime />} />
              <Route path="/operacional-prime" element={<OperacionalPrime />} />
              <Route path="/executive" element={<Executive />} />
              <Route path="/executive-v2" element={<ExecutiveV2 />} />
              <Route path="/analytics-v3" element={<AnalyticsV3 />} />
              <Route path="/roi-config" element={<ROIConfig />} />
              <Route path="/roi-config-v3" element={<ROIConfigV3 />} />

              {/* Analytics V1 — 2-level menu */}
              <Route path="/analytics" element={<AnalyticsResumoExecutivo />} />
              <Route path="/analytics/operacional" element={<AnalyticsOperacional />} />
              <Route path="/analytics/financeiro" element={<AnalyticsFinanceiro />} />
              <Route path="/analytics/estrategico" element={<AnalyticsEstrategico />} />
              <Route path="/analytics/compliance" element={<AnalyticsCompliance />} />
              <Route path="/analytics/inteligencia" element={<AnalyticsInteligencia />} />
              <Route path="/analytics/configuracao" element={<AnalyticsConfiguracao />} />
              <Route path="/analytics/gauge-showcase" element={<GaugeShowcase />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AbsenteismoScoreConfigProvider>
      </ScoreConfigProvider>
    </CustomerProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginGuard />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

function LoginGuard() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Login />;
}

export default App;
