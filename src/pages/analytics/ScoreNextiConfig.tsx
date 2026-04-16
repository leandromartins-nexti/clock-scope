import { useState, useEffect } from "react";
import { useNextiScoreConfig, DEFAULT_NEXTI_CONFIG } from "@/contexts/NextiScoreConfigContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Gauge, RotateCcw, Save, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ScoreNextiConfig() {
  const { config, setConfig, reset } = useNextiScoreConfig();
  const [draft, setDraft] = useState(config);

  useEffect(() => setDraft(config), [config]);

  const total = draft.peso_ponto + draft.peso_absenteismo;
  const balanced = total === 100;

  const updatePeso = (key: "peso_ponto" | "peso_absenteismo", value: number) => {
    const other = key === "peso_ponto" ? "peso_absenteismo" : "peso_ponto";
    const v = Math.max(0, Math.min(100, value));
    setDraft({ ...draft, [key]: v, [other]: 100 - v });
  };

  const handleSave = () => {
    if (!balanced) {
      toast({ title: "Pesos inválidos", description: "A soma dos pesos deve ser 100%.", variant: "destructive" });
      return;
    }
    setConfig(draft);
    toast({ title: "Configuração salva", description: "O Score Nexti foi atualizado." });
  };

  const handleReset = () => {
    reset();
    setDraft(DEFAULT_NEXTI_CONFIG);
    toast({ title: "Configuração restaurada", description: "Pesos padrão (50/50) aplicados." });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Pesos */}
      <div className="border border-border/60 rounded-xl p-5 bg-card">
        <div className="flex items-center gap-2 mb-1">
          <Gauge className="w-4 h-4 text-[#FF5722]" />
          <h3 className="text-sm font-semibold">Equilíbrio de Indicadores</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Defina o peso de cada indicador na composição do Score Nexti. A soma deve totalizar 100%.
        </p>

        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Ponto</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.peso_ponto}
                  onChange={(e) => updatePeso("peso_ponto", parseInt(e.target.value) || 0)}
                  className="w-16 h-7 text-sm text-right"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[draft.peso_ponto]}
              onValueChange={([v]) => updatePeso("peso_ponto", v)}
              max={100}
              step={5}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Absenteísmo</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.peso_absenteismo}
                  onChange={(e) => updatePeso("peso_absenteismo", parseInt(e.target.value) || 0)}
                  className="w-16 h-7 text-sm text-right"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[draft.peso_absenteismo]}
              onValueChange={([v]) => updatePeso("peso_absenteismo", v)}
              max={100}
              step={5}
            />
          </div>
        </div>

        <div className={`mt-5 flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
          balanced ? "bg-green-50 text-green-700 border border-green-200" : "bg-destructive/10 text-destructive border border-destructive/30"
        }`}>
          <span className="font-medium flex items-center gap-1.5">
            {!balanced && <AlertCircle className="w-3.5 h-3.5" />}
            Total dos pesos
          </span>
          <span className="font-bold">{total}%</span>
        </div>
      </div>

      {/* Faixas de classificação */}
      <div className="border border-border/60 rounded-xl p-5 bg-card">
        <h3 className="text-sm font-semibold mb-1">Faixas de Classificação</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Limites do score final (0-100) para cada classificação.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "score_excellent", label: "Excelente ≥", color: "text-green-600" },
            { key: "score_good", label: "Bom ≥", color: "text-lime-600" },
            { key: "score_warning", label: "Atenção ≥", color: "text-orange-600" },
            { key: "score_poor", label: "Ruim ≥", color: "text-red-500" },
          ].map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label className={`text-xs font-medium ${field.color}`}>{field.label}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={(draft as any)[field.key]}
                onChange={(e) => setDraft({ ...draft, [field.key]: parseInt(e.target.value) || 0 })}
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button onClick={handleSave} className="gap-1.5" disabled={!balanced}>
          <Save className="w-4 h-4" /> Salvar
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-1.5">
          <RotateCcw className="w-4 h-4" /> Restaurar padrão
        </Button>
      </div>
    </div>
  );
}
