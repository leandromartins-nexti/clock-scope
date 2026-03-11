import { Settings, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import devicesHero from "@/assets/devices-hero.png";

const NextiAnalytics = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 overflow-auto bg-white min-h-screen flex flex-col">

      {/* Breadcrumb */}
      <header className="border-b border-gray-200 px-8 py-3 bg-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline">Home</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Strategy Analytics</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Operacional Analytics</span>
        </div>
      </header>

      <main className="flex flex-col items-center px-8 pt-12 pb-8 flex-1">
        {/* Hero Image */}
        <div className="mb-10">
          <img
            src={devicesHero}
            alt="Analytics Dashboard Preview"
            className="w-[480px] h-auto"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-6 mb-10">
          <button
            onClick={() => navigate("/prime")}
            className="flex items-center bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-lg text-base transition-colors min-w-[240px] h-14 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-center h-full px-4 bg-[rgba(0,0,0,0.1)]">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex-1 text-center pr-4">Strategy</span>
          </button>
          <button className="flex items-center bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-lg text-base transition-colors min-w-[240px] h-14 shadow-sm overflow-hidden">
            <div className="flex items-center justify-center h-full px-4 bg-[rgba(0,0,0,0.1)]">
              <Settings className="w-5 h-5" />
            </div>
            <span className="flex-1 text-center pr-4">Operacional</span>
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="text-[#FF5722] italic">Analytics</span>{" "}
          <span className="text-gray-800">Dashboard</span>
        </h2>

        {/* Spacer to push arrows down */}
        <div className="flex-1" />

        {/* Decorative arrows */}
        <div className="self-start ml-4 mb-8 flex gap-0.5">
          <span className="text-[#FF5722]" style={{ fontSize: "26px" }}>▶</span>
          <span className="text-[#FF5722]" style={{ fontSize: "26px" }}>▶</span>
          <span className="text-[#FF5722]" style={{ fontSize: "26px" }}>▶</span>
        </div>
      </main>
    </div>
  );
};

export default NextiAnalytics;
