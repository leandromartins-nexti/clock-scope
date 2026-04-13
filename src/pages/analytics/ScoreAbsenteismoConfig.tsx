import { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import {
  AbsenteismoScoreConfig, DEFAULT_ABS_CONFIG, PROFILES,
  useAbsenteismoScoreConfig,
  computeAbsenteeismScore, computeTurnoverScore, computeAbsCompositeScore,
  getAbsScoreClassification,
} from "@/contexts/AbsenteismoScoreConfigContext";
import { toast } from "sonner";

// Real data for preview
const PREVIEW_ABS_TAXA = 14.9;  // absenteísmo médio %
const PREVIEW_TURNOVER_MENSAL = 3.6; // turnover mensal médio %
const PREVIEW_TURNOVER_ANUAL = +(PREVIEW_TURNOVER_MENSAL * 12).toFixed(1); // ~43.2%

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

export default function ScoreAbsenteismoConfig() {
  const { config, setConfig, saveConfig, resetToDefault } = useAbsenteismoScoreConfig();
  const [local, setLocal] = useState<AbsenteismoScoreConfig>(config);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setLocal(config); }, [config]);

  const update = (partial: Partial<AbsenteismoScoreConfig>) => {
    setLocal(prev => {
      const next = { ...prev, ...partial };
      // Auto-detect profile change → customizado
      const vigMatch = Object.entries(PROFILES.vigilancia).every(([k, v]) => (next as any)[k] === v);
      const indMatch = Object.entries(PROFILES.industria).every(([k, v]) => (next as any)[k] === v);
      if (vigMatch) next.profile_type = "vigilancia";
      else if (indMatch) next.profile_type = "industria";
      else next.profile_type = "customizado";
      return next;
    });
    setDirty(true);
  };

  const handleProfileChange = (profile: string) => {
    if (profile === "customizado") {
      setLocal(prev => ({ ...prev, profile_type: "customizado" }));
    } else {
      const vals = PROFILES[profile] || PROFILES.vigilancia;
      setLocal({ profile_type: profile as any, ...vals });
    }
    setDirty(true);
  };

  const handleSave = async () => {
    setConfig(local);
    await saveConfig();
    setDirty(false);
    toast.success("Configuração de Absenteísmo salva com sucesso");
  };

  const handleReset = () => {
    const profile = local.profile_type === "industria" ? "industria" : "vigilancia";
    const vals = PROFILES[profile];
    setLocal({ profile_type: profile as any, ...vals });
    setDirty(true);
  };

  // Live preview
  const absScore = useMemo(() => computeAbsenteeismScore(PREVIEW_ABS_TAXA, local), [local]);
  const turnScore = useMemo(() => computeTurnoverScore(PREVIEW_TURNOVER_ANUAL, local), [local]);
  const composite = useMemo(() => computeAbsCompositeScore(PREVIEW_ABS_TAXA, PREVIEW_TURNOVER_ANUAL, local), [local]);
  const classification = useMemo(() => getAbsScoreClassification(composite.score, local), [composite, local]);
  const absContrib = +(absScore * local.weight_absenteeism / 100).toFixed(1);
  const turnContrib = +(turnScore * local.weight_turnover / 100).toFixed(1);

  return (
    <div className="grid grid-cols-[1.5fr_1fr] gap-6">
      {/* Left: Configuration */}
      <div className="space-y-5">
        {/* Block 0: Profile selector */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Perfil pré-configurado</h3>
          <Select value={local.profile_type} onValueChange={handleProfileChange}>
            <SelectTrigger className="w-full h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vigilancia">Vigilância e Facilities</SelectItem>
              <SelectItem value="industria">Indústria e Comércio</SelectItem>
              <SelectItem value="customizado">Customizado</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">
            Os perfis preenchem todos os campos abaixo automaticamente. Escolha 'Customizado' para ajustar manualmente.
          </p>
        </div>

        {/* Block 1: Weights */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Peso dos Componentes</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground">Peso — Absenteísmo</span>
                  <Tooltip>
                    <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="max-w-[220px] text-xs">Impacto diário na operação. No setor terceirizado, falta = posto descoberto = multa contratual.</TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-xs font-bold text-foreground">{local.weight_absenteeism}%</span>
              </div>
              <Slider
                value={[local.weight_absenteeism]}
                onValueChange={([v]) => update({ weight_absenteeism: v, weight_turnover: 100 - v })}
                max={100} step={5}
                className="w-full"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground">Peso — Turnover</span>
                  <Tooltip>
                    <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="max-w-[220px] text-xs">Impacto estrutural. Custo médio de admissão no setor: R$ 2.000 a R$ 5.000 por colaborador.</TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-xs font-bold text-foreground">{local.weight_turnover}%</span>
              </div>
              <Slider
                value={[local.weight_turnover]}
                onValueChange={([v]) => update({ weight_turnover: v, weight_absenteeism: 100 - v })}
                max={100} step={5}
                className="w-full"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">Os dois pesos devem somar 100%</p>
          </div>
        </div>

        {/* Block 2: Absenteeism limits */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Limites do Absenteísmo</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Defina a régua. Valores entre os limites recebem nota proporcional.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Excelente até</label>
              <div className="flex items-center gap-1">
                <Input
                  type="number" min={0} max={100} step={0.5}
                  value={local.absenteeism_excellent_threshold}
                  onChange={(e) => update({ absenteeism_excellent_threshold: parseFloat(e.target.value) || 0 })}
                  className="w-20 h-8 text-xs text-center"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Crítico acima de</label>
              <div className="flex items-center gap-1">
                <Input
                  type="number" min={0} max={100} step={0.5}
                  value={local.absenteeism_critical_threshold}
                  onChange={(e) => update({ absenteeism_critical_threshold: parseFloat(e.target.value) || 0 })}
                  className="w-20 h-8 text-xs text-center"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          {/* Visual ruler */}
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: `${(local.absenteeism_excellent_threshold / local.absenteeism_critical_threshold) * 100}%` }} />
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 flex-1" />
            <div className="h-full bg-red-500 w-[10%]" />
          </div>
        </div>

        {/* Block 3: Turnover limits */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Limites do Turnover Anual</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Turnover anualizado para comparar com benchmarks de mercado.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Excelente até</label>
              <div className="flex items-center gap-1">
                <Input
                  type="number" min={0} max={300} step={1}
                  value={local.turnover_excellent_threshold}
                  onChange={(e) => update({ turnover_excellent_threshold: parseFloat(e.target.value) || 0 })}
                  className="w-20 h-8 text-xs text-center"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Crítico acima de</label>
              <div className="flex items-center gap-1">
                <Input
                  type="number" min={0} max={300} step={1}
                  value={local.turnover_critical_threshold}
                  onChange={(e) => update({ turnover_critical_threshold: parseFloat(e.target.value) || 0 })}
                  className="w-20 h-8 text-xs text-center"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">Vigilância e facilities tem média de 40% a 80% ao ano. Indústria geral fica entre 12% e 25%.</p>
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: `${(local.turnover_excellent_threshold / local.turnover_critical_threshold) * 100}%` }} />
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 flex-1" />
            <div className="h-full bg-red-500 w-[10%]" />
          </div>
        </div>

        {/* Block 4: Classification thresholds */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Faixas de Classificação do Score</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Defina os limites para cada classificação</p>
          </div>
          <div className="space-y-2.5">
            <ThresholdRow label="Excelente" color="#16a34a" value={local.score_excellent} onChange={(v) => update({ score_excellent: v })} />
            <ThresholdRow label="Bom" color="#22c55e" value={local.score_good} onChange={(v) => update({ score_good: v })} />
            <ThresholdRow label="Atenção" color="#f97316" value={local.score_warning} onChange={(v) => update({ score_warning: v })} />
            <ThresholdRow label="Ruim" color="#f87171" value={local.score_poor} onChange={(v) => update({ score_poor: v })} />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#ef4444" }} />
              <span className="text-xs font-medium text-foreground w-20">Crítico</span>
              <span className="text-[10px] text-muted-foreground">Score &lt; {local.score_poor} (automático)</span>
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
            <ScoreGauge score={Math.round(composite.score)} label={`${Math.round(composite.score)}`} faixa={classification.label} />
            <span className={`text-xs font-bold ${classification.text}`}>{classification.label}</span>
          </div>

          {/* Component breakdown */}
          <div className="space-y-3 border-t border-border/30 pt-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Absenteísmo</span>
                <span className="text-xs text-muted-foreground">{PREVIEW_ABS_TAXA}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${absScore}%` }} />
                </div>
                <span className="text-xs font-semibold text-foreground w-20 text-right">× {local.weight_absenteeism}% = {absContrib}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Turnover (anual)</span>
                <span className="text-xs text-muted-foreground">{PREVIEW_TURNOVER_ANUAL}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${turnScore}%` }} />
                </div>
                <span className="text-xs font-semibold text-foreground w-20 text-right">× {local.weight_turnover}% = {turnContrib}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/30 pt-2">
              <span className="text-sm font-bold text-foreground">Score final</span>
              <span className="text-sm font-bold" style={{ color: classification.color }}>{composite.score}</span>
            </div>
          </div>

          {/* Detail table */}
          <div className="border-t border-border/30 pt-4">
            <h4 className="text-xs font-semibold text-foreground mb-2">Detalhamento do Cálculo</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-1 text-muted-foreground font-medium">Indicador</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Valor</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Ideal</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Crítico</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/20">
                  <td className="py-1.5 text-foreground">Absenteísmo</td>
                  <td className="py-1.5 text-right text-muted-foreground">{PREVIEW_ABS_TAXA}%</td>
                  <td className="py-1.5 text-right text-muted-foreground">{local.absenteeism_excellent_threshold}%</td>
                  <td className="py-1.5 text-right text-muted-foreground">{local.absenteeism_critical_threshold}%</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{absScore}</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-1.5 text-foreground">Turnover anual</td>
                  <td className="py-1.5 text-right text-muted-foreground">{PREVIEW_TURNOVER_ANUAL}%</td>
                  <td className="py-1.5 text-right text-muted-foreground">{local.turnover_excellent_threshold}%</td>
                  <td className="py-1.5 text-right text-muted-foreground">{local.turnover_critical_threshold}%</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{turnScore}</td>
                </tr>
                <tr className="border-t border-border/50">
                  <td className="py-1.5 font-bold text-foreground" colSpan={4}>Total</td>
                  <td className="py-1.5 text-right font-bold" style={{ color: classification.color }}>{composite.score}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
