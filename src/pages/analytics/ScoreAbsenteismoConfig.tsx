import { useState, useEffect, useMemo, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import {
  AbsenteismoScoreConfig, DEFAULT_ABS_CONFIG, ABS_PROFILES,
  useAbsenteismoScoreConfig,
  computeVolumeScore, computeComposicaoScore, computeMaturidadeScore,
  computeAbsCompositeScore, getAbsScoreClassification, getVolumeScoreLabel,
  type AbsenteismoProfile,
} from "@/contexts/AbsenteismoScoreConfigContext";
import { toast } from "sonner";

// Preview data (real avg from Vig Eyes mar/26)
const PREVIEW = {
  taxa: 14.9,
  composicao: { planejada: 35, saude: 47, operacional: 1, falta: 17, nao_categorizada: 0 },
  pctPlanejado: 83,
};

function ThresholdRow({ label, color, value, onChange }: { label: string; color: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs font-medium text-foreground w-20">{label}</span>
      <span className="text-[10px] text-muted-foreground w-16">Score ≥</span>
      <Input type="number" min={0} max={100} value={value}
        onChange={(e) => onChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
        className="w-20 h-8 text-xs text-center" />
    </div>
  );
}

function BandInput({ label, value, onChange, unit = "%", step = 0.5 }: { label: string; value: number; onChange: (v: number) => void; unit?: string; step?: number }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-1">
        <Input type="number" min={0} max={100} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-20 h-8 text-xs text-center" />
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

export default function ScoreAbsenteismoConfig() {
  const { config, setConfig, saveConfig, resetToDefault } = useAbsenteismoScoreConfig();
  const [local, setLocal] = useState<AbsenteismoScoreConfig>(config);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setLocal(config); }, [config]);

  const update = useCallback((partial: Partial<AbsenteismoScoreConfig>) => {
    setLocal(prev => {
      const next = { ...prev, ...partial };
      // Auto-detect profile → customizado
      const isMatch = (p: string) => {
        const profile = ABS_PROFILES[p];
        if (!profile) return false;
        return Object.entries(profile).every(([k, v]) => {
          if (k === "mapping_semantico") return true;
          return (next as any)[k] === v;
        });
      };
      if (isMatch("vigilancia_facilities")) next.profile_type = "vigilancia_facilities";
      else if (isMatch("industria")) next.profile_type = "industria";
      else if (isMatch("servicos")) next.profile_type = "servicos";
      else next.profile_type = "customizado";
      return next;
    });
    setDirty(true);
  }, []);

  const handleProfileChange = (profile: string) => {
    if (profile === "customizado") {
      setLocal(prev => ({ ...prev, profile_type: "customizado" as AbsenteismoProfile }));
    } else {
      const vals = ABS_PROFILES[profile] || ABS_PROFILES.vigilancia_facilities;
      setLocal({ profile_type: profile as AbsenteismoProfile, ...vals });
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
    resetToDefault(local.profile_type === "customizado" ? "vigilancia_facilities" : local.profile_type);
    setDirty(true);
  };

  // Live preview
  const volScore = useMemo(() => computeVolumeScore(PREVIEW.taxa, local), [local]);
  const compScore = useMemo(() => computeComposicaoScore(PREVIEW.composicao, local), [local]);
  const matScore = useMemo(() => computeMaturidadeScore(PREVIEW.pctPlanejado, local), [local]);
  const composite = useMemo(() => computeAbsCompositeScore(volScore, compScore, matScore, local), [volScore, compScore, matScore, local]);
  const classification = useMemo(() => getAbsScoreClassification(composite, local), [composite, local]);

  const volContrib = +(volScore * local.peso_volume / 100).toFixed(1);
  const compContrib = +(compScore * local.peso_composicao / 100).toFixed(1);
  const matContrib = +(matScore * local.peso_maturidade / 100).toFixed(1);

  // Ensure sub-score weights sum to 100
  const updateWeight = (key: "peso_volume" | "peso_composicao" | "peso_maturidade", val: number) => {
    const others = ["peso_volume", "peso_composicao", "peso_maturidade"].filter(k => k !== key) as (keyof AbsenteismoScoreConfig)[];
    const remaining = 100 - val;
    const sum = (local[others[0]] as number) + (local[others[1]] as number);
    if (sum === 0) {
      update({ [key]: val, [others[0]]: Math.round(remaining / 2), [others[1]]: remaining - Math.round(remaining / 2) } as any);
    } else {
      const r0 = Math.round(remaining * (local[others[0]] as number) / sum);
      update({ [key]: val, [others[0]]: r0, [others[1]]: remaining - r0 } as any);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 lg:gap-6">
      {/* Left: Configuration */}
      <div className="space-y-5">
        {/* 1. Perfil */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Perfil pré-configurado</h3>
          <Select value={local.profile_type} onValueChange={handleProfileChange}>
            <SelectTrigger className="w-full h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vigilancia_facilities">Vigilância e Facilities</SelectItem>
              <SelectItem value="industria">Indústria</SelectItem>
              <SelectItem value="servicos">Serviços (comercial)</SelectItem>
              <SelectItem value="customizado">Customizado</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">Os perfis preenchem todos os campos automaticamente. Escolha 'Customizado' para ajustar manualmente.</p>
        </div>

        {/* 2. Peso dos Sub-Scores */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Peso dos Sub-Scores</h3>
          <p className="text-[10px] text-muted-foreground">Os 3 pesos devem somar 100%. Ajuste um e os outros se reescalam.</p>
          {([
            { key: "peso_volume" as const, label: "Volume", tip: "Taxa de absenteísmo operacional. Quanto menor, melhor." },
            { key: "peso_composicao" as const, label: "Composição", tip: "Distribuição das ausências por categoria. Mais planejadas = melhor." },
            { key: "peso_maturidade" as const, label: "Maturidade", tip: "Proporção planejado vs reativo. Mais planejado = mais maduro." },
          ]).map(({ key, label, tip }) => (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground">{label}</span>
                  <Tooltip><TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="max-w-[220px] text-xs">{tip}</TooltipContent></Tooltip>
                </div>
                <span className="text-xs font-bold text-foreground">{local[key]}%</span>
              </div>
              <Slider value={[local[key]]} onValueChange={([v]) => updateWeight(key, v)} max={100} step={5} className="w-full" />
            </div>
          ))}
        </div>

        {/* 3. Faixas Volume */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Faixas do Sub-Score Volume</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Taxa de absenteísmo (%) → Score. Quanto menor a taxa, melhor o score.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <BandInput label="Excelente ≤" value={local.volume_excelente_ate} onChange={v => update({ volume_excelente_ate: v })} />
            <BandInput label="Bom ≤" value={local.volume_bom_ate} onChange={v => update({ volume_bom_ate: v })} />
            <BandInput label="Atenção ≤" value={local.volume_atencao_ate} onChange={v => update({ volume_atencao_ate: v })} />
            <BandInput label="Ruim ≤" value={local.volume_ruim_ate} onChange={v => update({ volume_ruim_ate: v })} />
          </div>
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: `${(local.volume_excelente_ate / (local.volume_ruim_ate * 1.25 || 10)) * 100}%` }} />
            <div className="h-full bg-lime-400" style={{ width: `${((local.volume_bom_ate - local.volume_excelente_ate) / (local.volume_ruim_ate * 1.25 || 10)) * 100}%` }} />
            <div className="h-full bg-yellow-400" style={{ width: `${((local.volume_atencao_ate - local.volume_bom_ate) / (local.volume_ruim_ate * 1.25 || 10)) * 100}%` }} />
            <div className="h-full bg-orange-500" style={{ width: `${((local.volume_ruim_ate - local.volume_atencao_ate) / (local.volume_ruim_ate * 1.25 || 10)) * 100}%` }} />
            <div className="h-full bg-red-500 flex-1" />
          </div>
          <p className="text-[10px] text-muted-foreground">Crítico = acima de {local.volume_ruim_ate}% (automático)</p>
        </div>

        {/* 4. Faixas Maturidade */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Faixas do Sub-Score Maturidade</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">% Planejado → Score. Quanto maior o planejado, melhor o score.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <BandInput label="Excelente ≥" value={local.maturidade_excelente_acima} onChange={v => update({ maturidade_excelente_acima: v })} step={1} />
            <BandInput label="Bom ≥" value={local.maturidade_bom_acima} onChange={v => update({ maturidade_bom_acima: v })} step={1} />
            <BandInput label="Atenção ≥" value={local.maturidade_atencao_acima} onChange={v => update({ maturidade_atencao_acima: v })} step={1} />
            <BandInput label="Ruim ≥" value={local.maturidade_ruim_acima} onChange={v => update({ maturidade_ruim_acima: v })} step={1} />
          </div>
          <p className="text-[10px] text-muted-foreground">Crítico = abaixo de {local.maturidade_ruim_acima}% (automático)</p>
        </div>

        {/* 5. Pesos por Categoria (Composição) */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Pesos por Categoria (Composição)</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Cada categoria tem um peso de 0 a 100. Sub-Score = Σ(% horas × peso) ÷ 100.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {([
              { key: "cat_peso_planejada" as const, label: "Planejada" },
              { key: "cat_peso_saude" as const, label: "Saúde" },
              { key: "cat_peso_operacional" as const, label: "Operacional" },
              { key: "cat_peso_nao_categorizada" as const, label: "Não Categ." },
              { key: "cat_peso_falta" as const, label: "Falta" },
            ]).map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <label className="text-xs font-medium text-foreground">{label}</label>
                <Input type="number" min={0} max={100} value={local[key]}
                  onChange={(e) => update({ [key]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) } as any)}
                  className="w-full h-8 text-xs text-center" />
              </div>
            ))}
          </div>
        </div>

        {/* 6. Configurações Operacionais */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Configurações Operacionais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <BandInput label="Horas previstas/mês" value={local.horas_previstas_mes} onChange={v => update({ horas_previstas_mes: v })} unit="h" step={1} />
            <BandInput label="Limite saudável (Mapa)" value={local.limite_saudavel_mapa} onChange={v => update({ limite_saudavel_mapa: v })} unit="pts" step={1} />
            <BandInput label="Limite crítico (Mapa)" value={local.limite_critico_mapa} onChange={v => update({ limite_critico_mapa: v })} unit="pts" step={1} />
          </div>
        </div>

        {/* 7. Faixas de Classificação */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Faixas de Classificação do Score</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Defina os limites para cada classificação</p>
          </div>
          <div className="space-y-2.5">
            <ThresholdRow label="Excelente" color="#22c55e" value={local.score_excellent} onChange={v => update({ score_excellent: v })} />
            <ThresholdRow label="Bom" color="#84cc16" value={local.score_good} onChange={v => update({ score_good: v })} />
            <ThresholdRow label="Atenção" color="#f97316" value={local.score_warning} onChange={v => update({ score_warning: v })} />
            <ThresholdRow label="Ruim" color="#f87171" value={local.score_poor} onChange={v => update({ score_poor: v })} />
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
      <div className="lg:sticky lg:top-4 self-start">
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-foreground">Preview do Score</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Calculado com dados reais do período selecionado</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <ScoreGauge score={composite} label={`${composite}`} faixa={classification.label} color={classification.color} />
            <span className={`text-xs font-bold ${classification.text}`}>{classification.label}</span>
          </div>

          {/* 3-component breakdown */}
          <div className="space-y-3 border-t border-border/30 pt-4">
            {([
              { label: "Volume", valor: `${PREVIEW.taxa}%`, score: volScore, peso: local.peso_volume, contrib: volContrib, color: "#ef4444" },
              { label: "Composição", valor: `${PREVIEW.composicao.planejada}% plan.`, score: compScore, peso: local.peso_composicao, contrib: compContrib, color: "#f59e0b" },
              { label: "Maturidade", valor: `${PREVIEW.pctPlanejado}% plan.`, score: matScore, peso: local.peso_maturidade, contrib: matContrib, color: "#3b82f6" },
            ]).map(({ label, valor, score, peso, contrib, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground">{valor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-24 text-right">
                    {score} × {peso}% = {contrib}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border/30 pt-2">
              <span className="text-sm font-bold text-foreground">Score final</span>
              <span className="text-sm font-bold" style={{ color: classification.color }}>{composite}</span>
            </div>
          </div>

          {/* Detail table */}
          <div className="border-t border-border/30 pt-4">
            <h4 className="text-xs font-semibold text-foreground mb-2">Detalhamento do Cálculo</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-1 text-muted-foreground font-medium">Sub-Score</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Valor</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Nota</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Peso</th>
                  <th className="text-right py-1 text-muted-foreground font-medium">Contrib.</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/20">
                  <td className="py-1.5 text-foreground">Volume</td>
                  <td className="py-1.5 text-right text-muted-foreground">{PREVIEW.taxa}%</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{volScore}</td>
                  <td className="py-1.5 text-right text-muted-foreground">{local.peso_volume}%</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{volContrib}</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-1.5 text-foreground">Composição</td>
                  <td className="py-1.5 text-right text-muted-foreground">{PREVIEW.composicao.planejada}% plan.</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{compScore}</td>
                  <td className="py-1.5 text-right text-muted-foreground">{local.peso_composicao}%</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{compContrib}</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-1.5 text-foreground">Maturidade</td>
                  <td className="py-1.5 text-right text-muted-foreground">{PREVIEW.pctPlanejado}% plan.</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{matScore}</td>
                  <td className="py-1.5 text-right text-muted-foreground">{local.peso_maturidade}%</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{matContrib}</td>
                </tr>
                <tr className="border-t border-border/50">
                  <td className="py-1.5 font-bold text-foreground" colSpan={4}>Total</td>
                  <td className="py-1.5 text-right font-bold" style={{ color: classification.color }}>{composite}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
