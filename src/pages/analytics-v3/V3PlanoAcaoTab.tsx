import { oportunidadesV3, getPotencialAdicional, formatCurrencyV3, driversV3, confiancaBadgeV3 } from "@/lib/analyticsV3Data";
import { Zap, Clock, TrendingUp, ArrowRight, Target, Users } from "lucide-react";

export default function V3PlanoAcaoTab() {
  const potencial = getPotencialAdicional();
  const imediatas = oportunidadesV3.filter(o => o.tipo === "acao_imediata");
  const estruturais = oportunidadesV3.filter(o => o.tipo === "acao_estrutural");
  const driversComUpgrade = driversV3.filter(d => d.upgradePaths && d.upgradePaths.length > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Plano de Ação</h2>
      <p className="text-sm text-muted-foreground -mt-4">Transforme a leitura do Analytics em ação executiva</p>

      {/* Potencial */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground">
        <p className="text-sm opacity-80">Potencial Adicional Identificado</p>
        <p className="text-3xl font-bold mt-1">{formatCurrencyV3(potencial)}</p>
        <p className="text-sm opacity-70 mt-2">{oportunidadesV3.length} ações mapeadas · {imediatas.length} ações imediatas · {estruturais.length} ações estruturais</p>
      </div>

      {/* Ações imediatas */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-foreground">Ações Imediatas</h3>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{imediatas.length}</span>
        </div>
        <div className="space-y-3">
          {imediatas.map((o, i) => <AcaoCard key={i} op={o} />)}
        </div>
      </div>

      {/* Ações estruturais */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-foreground">Ações Estruturais</h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{estruturais.length}</span>
        </div>
        <div className="space-y-3">
          {estruturais.map((o, i) => <AcaoCard key={i} op={o} />)}
        </div>
      </div>

      {/* Elevação de confiança */}
      {driversComUpgrade.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Caminhos de Elevação de Confiança</h3>
          <div className="space-y-3">
            {driversComUpgrade.map(d => d.upgradePaths!.map((up, i) => {
              const badgeDe = confiancaBadgeV3(up.de);
              const badgePara = confiancaBadgeV3(up.para);
              return (
                <div key={`${d.id}-${i}`} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{d.nome}</p>
                    <p className="text-xs text-muted-foreground mt-1">{up.acao}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: badgeDe.bg, color: badgeDe.color }}>{badgeDe.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: badgePara.bg, color: badgePara.color }}>{badgePara.label}</span>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      )}

      {/* Recomendações por regional */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Recomendações por Regional</h3>
        </div>
        <div className="space-y-3">
          {[
            { regional: "Regional BA", risco: "alto", recomendacao: "Reforçar atuação da liderança em faltas não justificadas e revisar pressão de cobertura. Taxa de absenteísmo 6.8% é a mais elevada." },
            { regional: "Regional PR", risco: "moderado", recomendacao: "Estabilizar movimentações operacionais. Volume de trocas de escala e posto por 100 colaboradores é o mais elevado." },
            { regional: "Regional RJ", risco: "moderado", recomendacao: "Reduzir dependência de hora extra e melhorar planejamento de coberturas." },
            { regional: "Regional MG", risco: "baixo", recomendacao: "Manter trajetória atual. Focar em elevar qualidade do ponto e coberturas via reserva técnica." },
            { regional: "Regional SP", risco: "baixo", recomendacao: "Benchmark interno. Melhor combinação de disciplina operacional, economia gerada e score operacional." },
          ].map((r, i) => (
            <div key={i} className={`p-4 rounded-lg border ${r.risco === "alto" ? "border-red-200 bg-red-50" : r.risco === "moderado" ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">{r.regional}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.risco === "alto" ? "bg-red-100 text-red-700" : r.risco === "moderado" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>Risco {r.risco}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.recomendacao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AcaoCard({ op }: { op: typeof oportunidadesV3[0] }) {
  const esforcoColor = op.esforco === "baixo" ? "text-green-600 bg-green-50" : op.esforco === "medio" ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-foreground">{op.acao}</p>
        {op.impactoEstimado > 0 && <span className="text-sm font-bold text-green-600">{formatCurrencyV3(op.impactoEstimado)}</span>}
      </div>
      <p className="text-xs text-muted-foreground mb-3">{op.detalhe}</p>
      <div className="flex items-center gap-3 text-xs flex-wrap">
        <span className="text-muted-foreground">Driver: {op.driver}</span>
        <span className={`px-2 py-0.5 rounded-full ${esforcoColor}`}>Esforço: {op.esforco}</span>
        <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{op.prazoEstimado}</span>
        {op.responsavel && <span className="text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{op.responsavel}</span>}
      </div>
    </div>
  );
}
