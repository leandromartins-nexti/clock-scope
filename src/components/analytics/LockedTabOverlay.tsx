import { Lock } from "lucide-react";
import { ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { blurMockData } from "@/lib/analytics-mock-data";

interface LockedTabOverlayProps {
  nome: string;
  descricao: string;
  backgroundContent?: ReactNode;
}

export default function LockedTabOverlay({ nome, descricao, backgroundContent }: LockedTabOverlayProps) {
  return (
    <div className="relative min-h-[500px] sm:min-h-[600px] overflow-hidden">
      {/* Blurred background content */}
      <div className="filter blur-[3px] opacity-60 pointer-events-none select-none overflow-hidden">
        {backgroundContent ? (
          backgroundContent
        ) : (
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {blurMockData.kpiCards.map((kpi, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl p-4 sm:p-6">
                  <p className="text-xs sm:text-[0.85rem] font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="text-xl sm:text-[1.8rem] font-semibold leading-none mt-2">{kpi.valor}</p>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-3 sm:p-6">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={blurMockData.barChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Bar dataKey="valor" fill="#FF5722" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Overlay card */}
      <div className="absolute inset-0 flex items-start sm:items-center justify-center z-10 p-3 pt-12 sm:pt-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl p-4 sm:p-10 text-center w-full max-w-[90%] sm:max-w-md mx-auto">
          <Lock className="mx-auto mb-2 sm:mb-4 text-muted-foreground w-7 h-7 sm:w-10 sm:h-10" />
          <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">Em breve: {nome}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-6 leading-snug">{descricao}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-6">Previsão de lançamento: Q3 2026</p>
          <button
            onClick={() => console.log({ tab: nome, timestamp: Date.now() })}
            className="bg-[#FF5722] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium hover:opacity-90 transition text-xs sm:text-sm w-full sm:w-auto"
          >
            Quero saber quando liberar
          </button>
        </div>
      </div>
    </div>
  );
}
