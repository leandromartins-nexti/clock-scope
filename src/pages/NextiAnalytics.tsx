import { Settings, Users, ChevronRight, TrendingUp, ChevronDown, Star, Clock, Shield, PlusCircle, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import devicesHero from "@/assets/devices-hero.png";

const productSubmenus = [
  { label: "Prime", route: "prime", icon: Star },
  { label: "Time", route: "time", icon: Clock },
  { label: "Control", route: "control", icon: Shield },
  { label: "Plus", route: "plus", icon: PlusCircle },
  { label: "RH Digital", route: "rh-digital", icon: Megaphone },
];

const strategyRoutes: Record<string, string> = {
  prime: "/strategy-prime",
};

const operacionalRoutes: Record<string, string> = {
  prime: "/operacional-prime",
};

function NavButton({
  icon: Icon,
  label,
  routes,
}: {
  icon: React.ElementType;
  label: string;
  routes: Record<string, string>;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className="flex items-center bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-lg text-base transition-colors min-w-[240px] h-14 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-center h-full px-4 bg-[rgba(0,0,0,0.1)]">
          <Icon className="w-5 h-5" />
        </div>
        <span className="flex-1 text-center">{label}</span>
        <ChevronDown className={`w-4 h-4 mr-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {productSubmenus.map((item) => {
            const route = routes[item.route];
            const enabled = !!route;
            return (
              <button
                key={item.route}
                onClick={() => {
                  if (enabled) {
                    navigate(route);
                    setOpen(false);
                  }
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${
                  enabled
                    ? "text-foreground hover:bg-[#FF5722]/5 hover:text-[#FF5722] cursor-pointer"
                    : "text-muted-foreground/50 cursor-not-allowed"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
                {!enabled && (
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground/40 font-semibold">Em breve</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const NextiAnalytics = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 overflow-auto bg-white min-h-screen flex flex-col">

      {/* Breadcrumb */}
      <header className="border-b border-gray-200 px-8 py-3 bg-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#FF5722] font-medium cursor-pointer hover:underline">Home</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Nexti Analytics</span>
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

        {/* Executive Button - centered above */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => navigate("/executive")}
            className="flex items-center bg-[#3d4449] hover:bg-[#2d3439] text-white font-semibold rounded-lg text-base transition-colors min-w-[240px] h-14 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-center h-full px-4 bg-[rgba(0,0,0,0.15)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="flex-1 text-center pr-4">Executive</span>
          </button>
        </div>

        {/* Strategy & Operacional Buttons with hover submenus */}
        <div className="flex gap-6 mb-10">
          <NavButton icon={Users} label="Strategy" routes={strategyRoutes} />
          <NavButton icon={Settings} label="Operacional" routes={operacionalRoutes} />
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
