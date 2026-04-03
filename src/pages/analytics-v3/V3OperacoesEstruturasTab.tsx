import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { operacoesV3, formatCurrencyV3, V3Operacao, confiancaBadgeV3 } from "@/lib/analyticsV3Data";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type ViewMode = "absoluto" | "por_colaborador" | "por_100";

export default function V3OperacoesEstruturasTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("absoluto");

  const getValue = (op: V3Operacao, field: "valorCapturado" | "economiaGerada") => {
    const v = op[field];
    if (viewMode === "por_colaborador") return Math.round(v / op.colaboradores);
    if (viewMode === "por_100") return Math.round((v / op.colaboradores) * 100);
    return v;
  };

  const sorted = [...operacoesV3].sort((a, b) => getValue(b, "economiaGerada") - getValue(a, "economiaGerada"));

  const chartData = sorted.map(op => ({
    nome: op.nome,
    valor: getValue(op, "economiaGerada"),
    fill: op.scoreOperacao >= 80 ? "#22c55e" : op.scoreOperacao >= 70 ? "#eab308" : "#ef4444",
  }));

  const scoreClass = (s: number) => s >= 85 ? "text-green-600 bg-green-50" : s >= 70 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Operações e Estruturas</h2>
        <div className="flex gap-2">
          {(["absoluto", "por_colaborador", "por_100"] as ViewMode[]).map(m => (
            <button key={m} onClick={() => setViewMode(m)} className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${viewMode === m ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:bg-muted"}`}>
              {m === "absoluto" ? "Absoluto" : m === "por_colaborador" ? "Por Colaborador" : "Por 100 Colab."}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tickFormatter={v => formatCurrencyV3(v)} fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="nome" fontSize={11} width={95} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip formatter={(v: number) => formatCurrencyV3(v)} />
            <Bar dataKey="valor" radius={[0, 4, 4, 0]} name="Economia Gerada" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs">Operação</th>
              <th className="text-right px-3 py-3 font-semibold text-muted-foreground text-xs">Economia Gerada</th>
              <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs">Nível Confiança</th>
              <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs">Score</th>
              <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs">Tend.</th>
              <th className="text-right px-3 py-3 font-semibold text-muted-foreground text-xs">Colab.</th>
              <th className="text-left px-3 py-3 font-semibold text-muted-foreground text-xs">Principal Alavanca</th>
              <th className="text-left px-3 py-3 font-semibold text-muted-foreground text-xs">Principal Risco</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(op => (
              <tr key={op.nome} className="border-b border-border/50 hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">{op.nome}</td>
                <td className="px-3 py-3 text-right font-semibold text-foreground">{formatCurrencyV3(getValue(op, "economiaGerada"))}</td>
                <td className="px-3 py-3 text-center text-xs">{op.nivelConfianca}%</td>
                <td className="px-3 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${scoreClass(op.scoreOperacao)}`}>{op.scoreOperacao}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  {op.tendencia === "up" ? <TrendingUp className="w-4 h-4 text-green-500 mx-auto" /> : op.tendencia === "down" ? <TrendingDown className="w-4 h-4 text-red-500 mx-auto" /> : <Minus className="w-4 h-4 text-muted-foreground mx-auto" />}
                </td>
                <td className="px-3 py-3 text-right text-muted-foreground">{op.colaboradores.toLocaleString()}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{op.principalAlavanca}</td>
                <td className="px-3 py-3 text-xs text-red-600">{op.principalRisco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
