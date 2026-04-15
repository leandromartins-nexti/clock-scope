import { useState, useEffect, useMemo, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, Info, TrendingUp, TrendingDown, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import {
  ScoreConfig, DEFAULT_CONFIG, useScoreConfig,
  computeFullBreakdown, computePrevTriScore, getScoreClassification,
} from "@/contexts/ScoreConfigContext";
import { toast } from "sonner";

function GradeBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = value >= 75 ? "bg-green-500" : value >= 50 ? "bg-yellow-500" : value >= 20 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function ThresholdRow({ label, color, value, onChange }: { label: string; color: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs font-medium text-foreground w-20">{label}</span>
      <span className="text-[10px] text-muted-foreground w-16">Score ≥</span>
      <Input
        type="number"
        min={0} max={100}
        value={value}
        onChange={(e) => onChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
        className="w-20 h-8 text-xs text-center"
      />
    </div>
  );
}

const WEIGHT_TOOLTIPS: Record<string, string> = {
  weight_quality: "% de marcações registradas corretamente sobre o total",
  weight_treatment: "Agilidade do time em resolver ajustes pendentes",
  weight_backoffice: "Custo operacional composto por volume de ajustes por operador e horas extras",
};

const WEIGHT_LABELS: Record<string, string> = {
  weight_quality: "Qualidade das Marcações",
  weight_treatment: "Velocidade de Tratativa",
  weight_backoffice: "Saúde do Back-office",
};

const WEIGHT_KEYS = ["weight_quality", "weight_treatment", "weight_backoffice"] as const;

/** Generate dynamic labels for BO adjustment thresholds */
function boThresholdLabels(thresholds: number[]): string[] {
  const labels: string[] = [];
  labels.push(`Até ${thresholds[0]}`);
  for (let i = 1; i < thresholds.length; i++) {
    labels.push(`${thresholds[i - 1]} a ${thresholds[i]}`);
  }
  labels.push(`Mais de ${thresholds[thresholds.length - 1]}`);
  return labels;
}

export default function ScoreQualidadeConfig() {
  const { config, setConfig, saveConfig, resetToDefault } = useScoreConfig();
  const [local, setLocal] = useState<ScoreConfig>(config);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setLocal(config); }, [config]);

  const update = useCallback((partial: Partial<ScoreConfig>) => {
    setLocal(prev => ({ ...prev, ...partial }));
    setDirty(true);
  }, []);

  const handleSave = async () => {
    setConfig(local);
    await saveConfig();
    setDirty(false);
    toast.success("Configuração salva com sucesso");
  };

  const handleReset = () => {
    setLocal(DEFAULT_CONFIG);
    resetToDefault();
    setDirty(false);
    toast.success("Configuração restaurada para o padrão Nexti");
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(local, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "score-qualidade-config.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON da configuração baixado");
  };

  const weightSum = local.weight_quality + local.weight_treatment + local.weight_backoffice;
  const boWeightSum = local.bo_weight_adjustments + local.bo_weight_overtime;

  // Live preview
  const breakdown = useMemo(() => computeFullBreakdown(null, "empresa", local), [local]);
  const classification = useMemo(() => getScoreClassification(breakdown.compositeScore, local), [breakdown.compositeScore, local]);

  // Real previous trimester score for trend
  const prevTriScore = useMemo(() => computePrevTriScore(null, "empresa", local), [local]);
  const delta = Math.round(breakdown.compositeScore) - Math.round(prevTriScore);

  const treatFaixas = [
    { label: "< 1 dia", pct: breakdown.treatData.pctUnder1d, grade: local.grade_under_1d },
    { label: "1-3 dias", pct: breakdown.treatData.pct1_3d, grade: local.grade_1_3d },
    { label: "3-7 dias", pct: breakdown.treatData.pct3_7d, grade: local.grade_3_7d },
    { label: "7-15 dias", pct: breakdown.treatData.pct7_15d, grade: local.grade_7_15d },
    { label: "> 15 dias", pct: breakdown.treatData.pctOver15d, grade: local.grade_over_15d },
  ];

  const componentColors = ["#22c55e", "#3b82f6", "#8b5cf6"];

  const boLabels = boThresholdLabels(local.bo_adjustment_thresholds);
  const heExamples = useMemo(() => {
    const m = local.he_multiplier;
    return [
      { he: 0, nota: 100 },
      { he: Math.round(50 / m), nota: 50 },
      { he: Math.round(100 / m), nota: 0 },
    ];
  }, [local.he_multiplier]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: Configuration */}
      <div className="space-y-6">
        {/* Block 1: Weights (3 components) */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Configure os pesos dos 3 componentes</h3>

          <div className="space-y-3">
            {WEIGHT_KEYS.map((key) => (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-foreground">Peso — {WEIGHT_LABELS[key]}</span>
                    <Tooltip>
                      <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                      <TooltipContent className="max-w-[200px] text-xs">{WEIGHT_TOOLTIPS[key]}</TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-xs font-bold text-foreground">{local[key]}%</span>
                </div>
                <Slider
                  value={[local[key]]}
                  onValueChange={([v]) => update({ [key]: v })}
                  max={100} step={5}
                  className="w-full"
                />
              </div>
            ))}

            <p className={`text-[10px] ${weightSum === 100 ? "text-muted-foreground" : "text-red-500 font-semibold"}`}>
              Os três pesos devem somar 100% · Atual: {weightSum}%
            </p>
          </div>
        </div>

        {/* Block 2: Treatment grades */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Notas por Faixa de Tempo (Velocidade de Tratativa)</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Cada ajuste recebe uma nota conforme o tempo entre a marcação original e o ajuste</p>
          </div>

          <div className="space-y-3">
            {([
              { label: "Até 1 dia", key: "grade_under_1d" as const },
              { label: "1 a 3 dias", key: "grade_1_3d" as const },
              { label: "3 a 7 dias", key: "grade_3_7d" as const },
              { label: "7 a 15 dias", key: "grade_7_15d" as const },
              { label: "Mais de 15 dias", key: "grade_over_15d" as const },
            ]).map(({ label, key }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs text-foreground w-28 shrink-0">{label}</span>
                <Input
                  type="number" min={0} max={100}
                  value={local[key]}
                  onChange={(e) => update({ [key]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                  className="w-16 h-8 text-xs text-center"
                />
                <div className="flex-1"><GradeBar value={local[key]} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Block 3: Back-office Health */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-foreground">Saúde do Back-office</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Componente composto por 2 subcomponentes. Calculado sobre a média móvel dos últimos 3 meses</p>
          </div>

          {/* BO Composition weights */}
          <div className="bg-muted/30 border border-border/30 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground">Composição da Saúde do Back-office</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Peso — Ajustes/Operador</span>
                <span className="text-xs font-bold text-foreground">{local.bo_weight_adjustments}%</span>
              </div>
              <Slider
                value={[local.bo_weight_adjustments]}
                onValueChange={([v]) => update({ bo_weight_adjustments: v, bo_weight_overtime: 100 - v })}
                max={100} step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Peso — HE/Operador</span>
                <span className="text-xs font-bold text-foreground">{local.bo_weight_overtime}%</span>
              </div>
              <Slider
                value={[local.bo_weight_overtime]}
                onValueChange={([v]) => update({ bo_weight_overtime: v, bo_weight_adjustments: 100 - v })}
                max={100} step={5}
                className="w-full"
              />
              <p className={`text-[10px] ${boWeightSum === 100 ? "text-muted-foreground" : "text-red-500 font-semibold"}`}>
                Atual: {boWeightSum}% {boWeightSum !== 100 && "(deve somar 100%)"}
              </p>
            </div>
            <div className="bg-muted/40 rounded-lg px-3 py-2 text-[11px] font-mono text-foreground/80 border border-border/30">
              Nota = (Nota Ajustes × {local.bo_weight_adjustments}%) + (Nota HE × {local.bo_weight_overtime}%)
            </div>
          </div>

          {/* Sub A: Ajustes per operator — editable thresholds + grades */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Subcomponente A — Ajustes por Operador</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">Ajuste tanto os limites quanto as notas de cada faixa.</p>
            </div>
            <div className="space-y-2">
              {local.bo_adjustment_grades.map((grade, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-foreground w-32 shrink-0">{boLabels[idx]}</span>
                  {/* Editable threshold (except first and last which are derived) */}
                  {idx < local.bo_adjustment_thresholds.length && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">Lim:</span>
                      <Input
                        type="number" min={0} max={99999}
                        value={local.bo_adjustment_thresholds[idx]}
                        onChange={(e) => {
                          const newThresholds = [...local.bo_adjustment_thresholds];
                          newThresholds[idx] = Math.max(0, parseInt(e.target.value) || 0);
                          update({ bo_adjustment_thresholds: newThresholds });
                        }}
                        className="w-16 h-7 text-xs text-center"
                      />
                    </div>
                  )}
                  {idx >= local.bo_adjustment_thresholds.length && <div className="w-[76px]" />}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">Nota:</span>
                    <Input
                      type="number" min={0} max={100}
                      value={grade}
                      onChange={(e) => {
                        const newGrades = [...local.bo_adjustment_grades];
                        newGrades[idx] = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                        update({ bo_adjustment_grades: newGrades });
                      }}
                      className="w-16 h-7 text-xs text-center"
                    />
                  </div>
                  <div className="flex-1"><GradeBar value={grade} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub B: HE per operator — editable multiplier */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground">Subcomponente B — Horas Extras por Operador</h4>
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground">Multiplicador HE</span>
              <Input
                type="number" min={1} max={5} step={0.1}
                value={local.he_multiplier}
                onChange={(e) => update({ he_multiplier: Math.min(5, Math.max(1, parseFloat(e.target.value) || 2.5)) })}
                className="w-20 h-8 text-xs text-center"
              />
            </div>
            <div className="bg-muted/40 rounded-lg px-3 py-2 text-[11px] font-mono text-foreground/80 border border-border/30">
              nota = MAX(0, 100 − (HE × {local.he_multiplier}))
            </div>
            <div className="text-[10px] text-muted-foreground space-y-0.5 pl-1">
              {heExamples.map((ex) => (
                <p key={ex.he}>• {ex.he}h/mês: {ex.nota} pontos</p>
              ))}
            </div>
          </div>
        </div>

        {/* Block 4: Thresholds */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Faixas de Classificação do Score</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Defina os limites para cada classificação</p>
          </div>

          <div className="space-y-2.5">
            <ThresholdRow label="Excelente" color="#22c55e" value={local.threshold_excellent} onChange={(v) => update({ threshold_excellent: v })} />
            <ThresholdRow label="Bom" color="#84cc16" value={local.threshold_good} onChange={(v) => update({ threshold_good: v })} />
            <ThresholdRow label="Atenção" color="#f97316" value={local.threshold_warning} onChange={(v) => update({ threshold_warning: v })} />
            <ThresholdRow label="Ruim" color="#f87171" value={local.threshold_poor} onChange={(v) => update({ threshold_poor: v })} />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#ef4444" }} />
              <span className="text-xs font-medium text-foreground w-20">Crítico</span>
              <span className="text-[10px] text-muted-foreground">Score &lt; {local.threshold_poor} (automático)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar padrão
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={!dirty || weightSum !== 100}>
            <Save className="w-3.5 h-3.5" /> Salvar configuração
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownloadJson}>
            <Download className="w-3.5 h-3.5" /> Baixar JSON
          </Button>
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="sticky top-4 self-start">
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-foreground">Preview do Score</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Calculado com dados reais · Média móvel dos últimos 3 meses</p>
          </div>

          {/* Trend indicator */}
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-muted-foreground">Score trimestre atual: <span className="font-bold text-foreground">{Math.round(breakdown.compositeScore)}</span></span>
            <span className="text-muted-foreground">·</span>
            {delta > 0 ? (
              <span className="text-green-600 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +{delta}pp vs anterior
              </span>
            ) : delta < 0 ? (
              <span className="text-red-500 font-semibold flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> {delta}pp vs anterior
              </span>
            ) : (
              <span className="text-muted-foreground">= vs anterior</span>
            )}
          </div>

          {/* Gauge */}
          <div className="flex flex-col items-center gap-1">
            <ScoreGauge score={Math.round(breakdown.compositeScore)} label={`${Math.round(breakdown.compositeScore)}`} faixa={classification.label} color={classification.color} />
            <span className={`text-xs font-bold ${classification.text}`}>{classification.label}</span>
          </div>

          {/* 3 Component breakdown */}
          <div className="space-y-3 border-t border-border/30 pt-4">
            <ComponentRow 
              name="Qualidade das Marcações" 
              score={breakdown.qualPct} 
              weight={local.weight_quality} 
              contrib={breakdown.qualContrib} 
              color={componentColors[0]}
              context={`${breakdown.qualPct}% dos registros`}
            />
            <ComponentRow 
              name="Velocidade de Tratativa" 
              score={breakdown.treatScore} 
              weight={local.weight_treatment} 
              contrib={breakdown.treatContrib} 
              color={componentColors[1]}
              context="Baseado na distribuição abaixo"
            />
            <ComponentRow 
              name="Saúde do Back-office" 
              score={breakdown.boScore} 
              weight={local.weight_backoffice} 
              contrib={breakdown.boContrib} 
              color={componentColors[2]}
              context={`Ajustes: ${breakdown.boData.notaAjustes} pts (${local.bo_weight_adjustments}%) · HE: ${breakdown.boData.notaHE} pts (${local.bo_weight_overtime}%)`}
            />

            <div className="flex items-center justify-between border-t border-border/30 pt-2">
              <span className="text-sm font-bold text-foreground">Score final</span>
              <span className="text-sm font-bold" style={{ color: classification.color }}>{breakdown.compositeScore}</span>
            </div>
          </div>

          {/* Treatment breakdown table */}
          <div className="border-t border-border/30 pt-4">
            <h4 className="text-xs font-semibold text-foreground mb-2">Distribuição da Tratativa</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-1 text-muted-foreground font-medium">Faixa</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">% real</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Nota</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Contrib.</th>
                </tr>
              </thead>
              <tbody>
                {treatFaixas.map((f) => (
                  <tr key={f.label} className="border-b border-border/20">
                    <td className="py-1.5 text-foreground">{f.label}</td>
                    <td className="py-1.5 text-right text-muted-foreground">{f.pct.toFixed(1)}%</td>
                    <td className="py-1.5 text-right text-muted-foreground">× {f.grade}</td>
                    <td className="py-1.5 text-right font-medium text-foreground">{(f.pct * f.grade / 100).toFixed(1)}</td>
                  </tr>
                ))}
                <tr className="border-t border-border/50">
                  <td className="py-1.5 font-bold text-foreground" colSpan={3}>Total</td>
                  <td className="py-1.5 text-right font-bold text-foreground">{breakdown.treatScore}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* JSON config block */}
          <div className="border-t border-border/30 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-foreground">Configuração atual (JSON)</h4>
              <button onClick={handleDownloadJson} className="text-[10px] text-[#FF5722] hover:underline flex items-center gap-1">
                <Download className="w-3 h-3" /> Baixar
              </button>
            </div>
            <pre className="bg-muted/40 border border-border/30 rounded-lg p-3 text-[10px] font-mono text-foreground/80 max-h-48 overflow-auto">
              {JSON.stringify(local, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentRow({ name, score, weight, contrib, color, context }: { 
  name: string; score: number; weight: number; contrib: number; color: string; context: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground">{name}</span>
        <span className="text-[10px] text-muted-foreground">{context}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, score)}%`, backgroundColor: color }} />
        </div>
        <span className="text-xs font-semibold text-foreground w-20 text-right">{score} × {weight}% = {contrib}</span>
      </div>
    </div>
  );
}
