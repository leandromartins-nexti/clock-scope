import { LineChartIcon, BarChart3, AreaChartIcon, Percent, Hash } from "lucide-react";

export type DataMode = "percent" | "valor";
export type ChartMode = "line" | "bar" | "area";

interface ChartModeToggleProps {
  dataMode?: DataMode;
  onDataModeChange?: (mode: DataMode) => void;
  chartMode?: ChartMode;
  onChartModeChange?: (mode: ChartMode) => void;
  showDataToggle?: boolean;
  showChartToggle?: boolean;
}

const dataModes: { mode: DataMode; icon: typeof Percent; tip: string }[] = [
  { mode: "percent", icon: Percent, tip: "Percentual" },
  { mode: "valor", icon: Hash, tip: "Valor absoluto" },
];

const chartModes: { mode: ChartMode; icon: typeof LineChartIcon; tip: string }[] = [
  { mode: "line", icon: LineChartIcon, tip: "Linha" },
  { mode: "bar", icon: BarChart3, tip: "Barras" },
  { mode: "area", icon: AreaChartIcon, tip: "Área" },
];

export default function ChartModeToggle({
  dataMode = "percent",
  onDataModeChange,
  chartMode = "area",
  onChartModeChange,
  showDataToggle = true,
  showChartToggle = true,
}: ChartModeToggleProps) {
  return (
    <div className="flex items-center gap-1.5">
      {showDataToggle && (
        <div data-onboarding="chart-toggle" className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5">
          {dataModes.map(({ mode, icon: Icon, tip }) => (
            <button
              key={mode}
              onClick={() => onDataModeChange?.(mode)}
              className={`p-1.5 rounded-md transition-colors ${
                dataMode === mode
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={tip}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      )}
      {showChartToggle && (
        <div data-onboarding="chart-mode" className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5">
          {chartModes.map(({ mode, icon: Icon, tip }) => (
            <button
              key={mode}
              onClick={() => onChartModeChange?.(mode)}
              className={`p-1.5 rounded-md transition-colors ${
                chartMode === mode
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={tip}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
