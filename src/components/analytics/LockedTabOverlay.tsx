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
    <div className="relative min-h-[600px]">
      {/* Blurred background content */}
      <div className="filter blur-[3px] opacity-60 pointer-events-none select-none">
        {backgroundContent ? (
          backgroundContent
        ) : (
          <div className="p-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              {blurMockData.kpiCards.map((kpi, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl p-6">
                  <p className="text-[0.85rem] font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="text-[1.8rem] font-semibold leading-none mt-2">{kpi.valor}</p>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-6">
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
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-card border border-border rounded-xl shadow-2xl p-10 text-center max-w-md">
          <Lock className="mx-auto mb-4 text-muted-foreground" size={40} />
          <h3 className="text-xl font-semibold mb-2">Em breve: {nome}</h3>
          <p className="text-muted-foreground mb-6">{descricao}</p>
          <p className="text-xs text-muted-foreground mb-6">Previsão de lançamento: Q3 2026</p>
          <button
            onClick={() => console.log({ tab: nome, timestamp: Date.now() })}
            className="bg-[#FF5722] text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
          >
            Quero saber quando liberar
          </button>
        </div>
      </div>
    </div>
  );
}
