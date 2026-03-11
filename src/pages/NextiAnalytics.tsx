import { Settings, Users } from "lucide-react";
import { ChevronRight } from "lucide-react";
import devicesMockup from "@/assets/devices-mockup.png";

const NextiAnalytics = () => {
  return (
    <div className="flex-1 overflow-auto bg-white min-h-screen">
      {/* Breadcrumb */}
      <header className="border-b border-gray-200 px-8 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline">Home</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Strategy Analytics</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Operacional Analytics</span>
        </div>
      </header>

      <main className="flex flex-col items-center px-8 pt-10 pb-16">
        {/* Hero Image */}
        <div className="mb-10">
          <img
            src={devicesMockup}
            alt="Analytics Dashboard Preview"
            className="w-[500px] h-auto"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-6 mb-10">
          <button className="flex items-center gap-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-lg px-12 py-4 text-base transition-colors min-w-[230px] justify-center shadow-sm">
            <Users className="w-5 h-5" />
            Strategy
          </button>
          <button className="flex items-center gap-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-lg px-12 py-4 text-base transition-colors min-w-[230px] justify-center shadow-sm">
            <Settings className="w-5 h-5" />
            Operacional
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="text-[#FF5722] italic">Analytics</span>{" "}
          <span className="text-gray-800">Dashboard</span>
        </h2>

        {/* Decorative arrows */}
        <div className="self-start mt-20 ml-4 flex gap-0.5">
          <span className="text-[#FF5722] text-xl">▶</span>
          <span className="text-[#FF5722] text-xl">▶</span>
          <span className="text-[#FF5722] text-xl">▶</span>
        </div>
      </main>
    </div>
  );
};

export default NextiAnalytics;
