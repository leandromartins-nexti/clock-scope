import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Settings, Users } from "lucide-react";
import analyticsHero from "@/assets/analytics-hero.png";

const NextiAnalytics = () => {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <DashboardHeader
        title="Operacional Analytics"
        breadcrumbs={["Home", "Strategy Analytics", "Operacional Analytics"]}
      />

      <main className="flex flex-col items-center px-8 py-12">
        {/* Hero Image */}
        <div className="mb-12">
          <img
            src={analyticsHero}
            alt="Analytics Dashboard Preview"
            className="max-w-lg w-full h-auto"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-6 mb-10">
          <button className="flex items-center gap-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-lg px-10 py-4 text-lg transition-colors min-w-[220px] justify-center">
            <Users className="w-5 h-5" />
            Strategy
          </button>
          <button className="flex items-center gap-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-lg px-10 py-4 text-lg transition-colors min-w-[220px] justify-center">
            <Settings className="w-5 h-5" />
            Operacional
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold">
          <span className="text-[#FF5722]">Analytics</span>{" "}
          <span className="text-foreground">Dashboard</span>
        </h2>

        {/* Decorative arrows */}
        <div className="self-start mt-16 flex gap-1">
          <span className="text-[#FF5722] text-2xl">▶</span>
          <span className="text-[#FF5722] text-2xl">▶</span>
          <span className="text-[#FF5722] text-2xl">▶</span>
        </div>
      </main>
    </div>
  );
};

export default NextiAnalytics;
