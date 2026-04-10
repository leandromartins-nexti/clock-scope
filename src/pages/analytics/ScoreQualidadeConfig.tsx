import { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import {
  ScoreConfig, DEFAULT_CONFIG, useScoreConfig,
  computeQualityPercentage, computeTreatmentScore, getScoreClassification,
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

export default function ScoreQualidadeConfig() {
  const { config, setConfig, saveConfig, resetToDefault } = useScoreConfig();
  const [local, setLocal] = useState<ScoreConfig>(config);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setLocal(config); }, [config]);

  const update = (partial: Partial<ScoreConfig>) => {
    setLocal(prev => ({ ...prev, ...partial }));
    setDirty(true);
  };

  const handleSave = async () => {
    setConfig(local);
    await saveConfig();
    setDirty(false);
    toast.success("Configuração salva com sucesso");
  };

  const handleReset = () => {
    setLocal(DEFAULT_CONFIG);
    setConfig(DEFAULT_CONFIG);
    setDirty(true);
  };

  // Live preview data
  const qualPct = useMemo(() => computeQualityPercentage(null, "empresa"), []);
  const treatData = useMemo(() => computeTreatmentScore(null, "empresa", local), [local]);
  const compositeScore = useMemo(() => {
    return +((qualPct * local.weight_quality / 100) + (treatData.score * local.weight_treatment / 100)).toFixed(1);
  }, [qualPct, treatData, local]);
  const classification = useMemo(() => getScoreClassification(compositeScore, local), [compositeScore, local]);
  const qualContrib = +(qualPct * local.weight_quality / 100).toFixed(1);
  const treatContrib = +(treatData.score * local.weight_treatment / 100).toFixed(1);

  const faixas = [
    { label: "< 1 dia", pct: treatData.pctUnder1d, grade: local.grade_under_1d },
    { label: "1-3 dias", pct: treatData.pct1_3d, grade: local.grade_1_3d },
    { label: "3-7 dias", pct: treatData.pct3_7d, grade: local.grade_3_7d },
    { label: "7-15 dias", pct: treatData.pct7_15d, grade: local.grade_7_15d },
    { label: "> 15 dias", pct: treatData.pctOver15d, grade: local.grade_over_15d },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: Configuration */}
      <div className="space-y-6">
        {/* Block 1: Weights */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Peso dos Componentes</h3>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground">Peso — Qualidade das Marcações</span>
                  <Tooltip>
                    <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="max-w-[200px] text-xs">Percentual de marcações registradas corretamente. Mede a disciplina operacional.</TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-xs font-bold text-foreground">{local.weight_quality}%</span>
              </div>
              <Slider
                value={[local.weight_quality]}
                onValueChange={([v]) => update({ weight_quality: v, weight_treatment: 100 - v })}
                max={100} step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground">Peso — Velocidade de Tratativa</span>
                  <Tooltip>
                    <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="max-w-[200px] text-xs">Rapidez com que os ajustes de ponto são tratados pelo back-office.</TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-xs font-bold text-foreground">{local.weight_treatment}%</span>
              </div>
              <Slider
                value={[local.weight_treatment]}
                onValueChange={([v]) => update({ weight_treatment: v, weight_quality: 100 - v })}
                max={100} step={5}
                className="w-full"
              />
            </div>

            <p className="text-[10px] text-muted-foreground">Os dois pesos devem somar 100%</p>
          </div>
        </div>

        {/* Block 2: Grades */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Notas por Faixa de Tempo</h3>
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
                  type="number"
                  min={0} max={100}
                  value={local[key]}
                  onChange={(e) => update({ [key]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                  className="w-16 h-8 text-xs text-center"
                />
                <div className="flex-1">
                  <GradeBar value={local[key]} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block 3: Thresholds */}
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
          <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={!dirty}>
            <Save className="w-3.5 h-3.5" /> Salvar configuração
          </Button>
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="sticky top-4 self-start">
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-foreground">Preview do Score</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Calculado com os dados reais do período selecionado</p>
          </div>

          {/* Gauge */}
          <div className="flex flex-col items-center gap-1">
            <ScoreGauge score={Math.round(compositeScore)} label={`${Math.round(compositeScore)}`} faixa={classification.label} />
            <span className={`text-xs font-bold ${classification.text}`}>{classification.label}</span>
          </div>

          {/* Component breakdown */}
          <div className="space-y-3 border-t border-border/30 pt-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Qualidade das Marcações</span>
                <span className="text-xs text-muted-foreground">{qualPct}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${qualPct}%` }} />
                </div>
                <span className="text-xs font-semibold text-foreground w-16 text-right">× {local.weight_quality}% = {qualContrib}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Velocidade de Tratativa</span>
                <span className="text-xs text-muted-foreground">{treatData.score}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${treatData.score}%` }} />
                </div>
                <span className="text-xs font-semibold text-foreground w-16 text-right">× {local.weight_treatment}% = {treatContrib}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/30 pt-2">
              <span className="text-sm font-bold text-foreground">Score final</span>
              <span className="text-sm font-bold" style={{ color: classification.color }}>{compositeScore}</span>
            </div>
          </div>

          {/* Treatment breakdown */}
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
                {faixas.map((f) => (
                  <tr key={f.label} className="border-b border-border/20">
                    <td className="py-1.5 text-foreground">{f.label}</td>
                    <td className="py-1.5 text-right text-muted-foreground">{f.pct.toFixed(1)}%</td>
                    <td className="py-1.5 text-right text-muted-foreground">× {f.grade}</td>
                    <td className="py-1.5 text-right font-medium text-foreground">{(f.pct * f.grade / 100).toFixed(1)}</td>
                  </tr>
                ))}
                <tr className="border-t border-border/50">
                  <td className="py-1.5 font-bold text-foreground" colSpan={3}>Total</td>
                  <td className="py-1.5 text-right font-bold text-foreground">{treatData.score}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
