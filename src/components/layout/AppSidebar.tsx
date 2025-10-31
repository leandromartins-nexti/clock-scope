import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Clock,
  MapPin,
  Megaphone,
  CheckSquare,
  ArrowLeftRight,
  Car,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["nexti-analytics"]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const mainNavItems = [
    { label: "Dashboard", icon: BarChart3, path: "/" },
  ];

  const analyticsSections = [
    { 
      id: "prime",
      label: "Prime", 
      items: [
        { label: "Registro de Ponto", path: "/prime/time-tracking" },
        { label: "Operacional", path: "/prime/operational" },
        { label: "Ausências e Coberturas", path: "/prime/ausencias-coberturas" },
        { label: "Dispositivos", path: "/prime/devices" },
        { label: "Engajamento", path: "/prime/engagement" },
      ]
    },
    { 
      id: "haas",
      label: "HaaS", 
      items: [
        { label: "Geral", path: "/haas/general" },
        { label: "Smart", path: "/haas/smart" },
        { label: "Terminal", path: "/haas/terminal" },
      ]
    },
    { 
      id: "rh-digital",
      label: "RH Digital", 
      items: [
        { label: "Checklist", path: "/rh-digital/checklist" },
        { label: "Avisos", path: "/rh-digital/avisos" },
        { label: "Direct", path: "/rh-digital/direct" },
      ]
    },
    { 
      id: "plus",
      label: "Plus", 
      items: [
        { label: "Dashboard Plus", path: "/plus" },
      ]
    },
    { 
      id: "time",
      label: "Time", 
      items: [
        { label: "Dashboard Time", path: "/time" },
        { label: "Time Tracking", path: "/time-tracking" },
      ]
    },
    { 
      id: "control",
      label: "Control", 
      items: [
        { label: "Dashboard Control", path: "/control" },
        { label: "Operacional", path: "/operational" },
      ]
    },
  ];

  const secondaryNavItems = [
    { label: "Mesa de Operações", icon: Clock, path: "/operations" },
    { label: "Mapa de Postos", icon: MapPin, path: "/map" },
  ];

  const otherExpandableSections = [
    {
      id: "nexti-control",
      label: "Nexti Control",
      icon: Car,
      items: [],
    },
    {
      id: "nexti-control-2",
      label: "Nexti Control 2.0",
      icon: Car,
      badge: "Beta",
      items: [],
    },
    {
      id: "livro",
      label: "Livro de Ocorrência",
      icon: BookOpen,
      items: [],
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#3d4f5c] text-white transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="bg-[#ff5722] h-[100px] flex items-center justify-center relative">
        {!isCollapsed && (
          <div className="text-4xl font-bold italic text-white">nexti</div>
        )}
        {isCollapsed && (
          <div className="text-2xl font-bold text-white">N</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8 text-white hover:bg-white/10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Main Navigation */}
        <nav className="space-y-1 px-2">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative",
                  "hover:bg-white/5",
                  isActive && "bg-[#2a3840]",
                  isCollapsed && "justify-center"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5722]" />
                  )}
                  {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Nexti Analytics with submenu */}
          <div>
            <button
              onClick={() => !isCollapsed && toggleSection("nexti-analytics")}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-white/5 w-full",
                isCollapsed && "justify-center"
              )}
            >
              <BarChart3 className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">
                    Nexti Analytics
                  </span>
                  {expandedSections.includes("nexti-analytics") ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </>
              )}
            </button>

            {!isCollapsed && expandedSections.includes("nexti-analytics") && (
              <div className="ml-4 mt-1 space-y-1">
                {analyticsSections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-white/5 w-full text-white/70 hover:text-white"
                    >
                      <span className="text-sm font-medium flex-1 text-left">
                        {section.label}
                      </span>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {expandedSections.includes(section.id) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {section.items.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                              cn(
                                "block px-3 py-2 text-sm rounded-lg transition-colors relative",
                                "hover:bg-white/5 text-white/70 hover:text-white",
                                isActive && "bg-[#2a3840] text-white"
                              )
                            }
                          >
                            {({ isActive }) => (
                              <>
                                {isActive && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5722]" />
                                )}
                                {item.label}
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Divider */}
        <div className="my-4 mx-4 border-t border-white/10" />

        {/* Secondary Navigation */}
        <nav className="space-y-1 px-2">
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                  "hover:bg-white/5",
                  isActive && "bg-[#2a3840]",
                  isCollapsed && "justify-center"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-4 mx-4 border-t border-white/10" />

        {/* Other Expandable Sections */}
        <nav className="space-y-1 px-2">
          {!isCollapsed && (
            <>
              <button
                onClick={() => toggleSection("checklist")}
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-white/5 w-full"
              >
                <CheckSquare className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1 text-left">
                  Checklist
                </span>
              </button>

              <button
                onClick={() => toggleSection("movimentacoes")}
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-white/5 w-full"
              >
                <ArrowLeftRight className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1 text-left">
                  Movimentações em Lote
                </span>
              </button>
            </>
          )}

          {otherExpandableSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => !isCollapsed && toggleSection(section.id)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-white/5 w-full"
              >
                <section.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1 text-left">
                      {section.label}
                    </span>
                    {section.badge && (
                      <Badge className="bg-[#ff5722] hover:bg-[#ff5722] text-xs">
                        {section.badge}
                      </Badge>
                    )}
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </>
                )}
              </button>

              {!isCollapsed &&
                expandedSections.includes(section.id) &&
                section.items.length > 0 && (
                  <div className="ml-8 mt-1 space-y-1">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            "block px-3 py-2 text-sm rounded-lg transition-colors relative",
                            "hover:bg-white/5",
                            isActive && "bg-[#2a3840] text-white"
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5722]" />
                            )}
                            {item.label}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};
