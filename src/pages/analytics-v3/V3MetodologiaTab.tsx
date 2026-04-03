import { useNavigate } from "react-router-dom";
import { driversV3, confiancaBadgeV3, formatCurrencyV3, ownershipV3, configV3 } from "@/lib/analyticsV3Data";
import { Settings, CheckCircle2, XCircle } from "lucide-react";

export default function V3MetodologiaTab() {
  const navigate = useNavigate();
  const monetarios = driversV3.filter(d => d.categoria === "monetario");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Metodologia e Governança</h2>
        <button onClick={() => navigate("/roi-config-v3")} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
          <Settings className="w-4 h-4" /> Configurações de ROI
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Parâmetros da Empresa</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Info label="Empresa" value={configV3.empresa.nome} />
          <Info label="Colaboradores" value={configV3.empresa.colaboradores.toLocaleString()} />
          <Info label="Salário Médio" value={formatCurrencyV3(configV3.empresa.salarioMedio)} />
          <Info label="Encargos" value={`${configV3.empresa.encargos}%`} />
          <Info label="Ownership Mensal" value={formatCurrencyV3(ownershipV3.custoMensal)} />
          <Info label="Ownership Anual" value={formatCurrencyV3(ownershipV3.custoAnual)} />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Regras de Confiança</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            { tipo: "comprovado" as const, desc: "Evento operacional real + valor monetário real do cliente" },
            { tipo: "hibrido" as const, desc: "Evento operacional real + monetização por custo médio configurado" },
            { tipo: "referencial" as const, desc: "Benchmark, base case ou parâmetro configurado como referência" },
          ]).map(r => {
            const badge = confiancaBadgeV3(r.tipo);
            return (
              <div key={r.tipo} className="p-4 rounded-lg border" style={{ borderColor: badge.color + "40", backgroundColor: badge.bg }}>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: badge.color, backgroundColor: badge.bg, border: `1px solid ${badge.color}` }}>{badge.label}</span>
                <p className="text-sm text-muted-foreground mt-2">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Drivers e Disponibilidade de Dados</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs">Driver</th>
              <th className="text-left px-3 py-3 font-semibold text-muted-foreground text-xs">Módulo</th>
              <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs">Confiança</th>
              <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs">Evento Real</th>
              <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs">Valor Real</th>
              <th className="text-left px-3 py-3 font-semibold text-muted-foreground text-xs">Fonte Baseline</th>
            </tr>
          </thead>
          <tbody>
            {monetarios.map(d => {
              const badge = confiancaBadgeV3(d.confianca);
              return (
                <tr key={d.id} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium text-foreground">{d.nome}</td>
                  <td className="px-3 py-3 text-muted-foreground">{d.modulo}</td>
                  <td className="px-3 py-3 text-center"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: badge.bg, color: badge.color }}>{badge.label}</span></td>
                  <td className="px-3 py-3 text-center">{d.confianca !== "referencial" ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}</td>
                  <td className="px-3 py-3 text-center">{d.confianca === "comprovado" ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{d.fonteBaseline}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (<div><p className="text-xs text-muted-foreground">{label}</p><p className="font-semibold text-foreground">{value}</p></div>);
}
