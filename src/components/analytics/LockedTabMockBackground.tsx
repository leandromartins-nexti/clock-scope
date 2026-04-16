import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from "recharts";

// Shared orange palette so all tabs feel consistent
const ORANGE = "#FF5722";
const ORANGE_SOFT = "#FFAB91";
const ORANGE_DEEP = "#E64A19";
const ORANGE_LIGHT = "#FFCCBC";
const PALETTE = [ORANGE, ORANGE_SOFT, ORANGE_DEEP, ORANGE_LIGHT];

interface KPI { label: string; valor: string; }
interface MockConfig {
  kpis: KPI[];
  chartType: "bar" | "line" | "area" | "pie";
  chartTitle: string;
  chartData: any[];
  chartKeys?: string[];
  tableTitle: string;
  tableHeaders: [string, string, string];
  tableRows: Array<[string, string, string]>;
}

const MOCKS: Record<string, MockConfig> = {
  // ── Compliance ──
  sancoes: {
    kpis: [
      { label: "Advertências", valor: "1.498" },
      { label: "Suspensões", valor: "85,2%" },
      { label: "Demissões J.C.", valor: "1.240" },
      { label: "Custo Evitado", valor: "R$ 692K" },
    ],
    chartType: "bar",
    chartTitle: "Sanções por Tipo",
    chartData: [
      { name: "Advertência", valor: 820 },
      { name: "Suspensão", valor: 410 },
      { name: "J. Causa", valor: 180 },
      { name: "Acordo", valor: 88 },
      { name: "Reversão", valor: 32 },
    ],
    tableTitle: "Top Sanções por Regional",
    tableHeaders: ["Regional", "Tipo", "Total"],
    tableRows: [
      ["Regional SP", "Advertência", "320"],
      ["Regional RJ", "Suspensão", "210"],
      ["Regional BA", "J. Causa", "98"],
      ["Regional MG", "Advertência", "147"],
    ],
  },
  "alertas-preventivos": {
    kpis: [
      { label: "Alertas Ativos", valor: "342" },
      { label: "Resolvidos 30d", valor: "78,4%" },
      { label: "Risco Alto", valor: "47" },
      { label: "Economia Prev.", valor: "R$ 1.2M" },
    ],
    chartType: "line",
    chartTitle: "Evolução de Alertas Preventivos",
    chartData: [
      { name: "abr", valor: 120, resolvidos: 90 },
      { name: "mai", valor: 145, resolvidos: 110 },
      { name: "jun", valor: 180, resolvidos: 140 },
      { name: "jul", valor: 220, resolvidos: 175 },
      { name: "ago", valor: 260, resolvidos: 210 },
      { name: "set", valor: 310, resolvidos: 250 },
      { name: "out", valor: 342, resolvidos: 268 },
    ],
    chartKeys: ["valor", "resolvidos"],
    tableTitle: "Alertas por Categoria",
    tableHeaders: ["Categoria", "Ativos", "Risco"],
    tableRows: [
      ["Jornada Excessiva", "112", "Alto"],
      ["Banco de Horas", "87", "Médio"],
      ["Faltas Reincidentes", "64", "Alto"],
      ["Atrasos Sequenciais", "79", "Baixo"],
    ],
  },
  regulatorio: {
    kpis: [
      { label: "Conformidade", valor: "94,1%" },
      { label: "Auditorias", valor: "26" },
      { label: "Não-Conf.", valor: "12" },
      { label: "Multas Evit.", valor: "R$ 480K" },
    ],
    chartType: "area",
    chartTitle: "Índice de Conformidade Regulatória",
    chartData: [
      { name: "abr", valor: 88 },
      { name: "mai", valor: 89 },
      { name: "jun", valor: 90 },
      { name: "jul", valor: 91 },
      { name: "ago", valor: 92 },
      { name: "set", valor: 93 },
      { name: "out", valor: 94 },
    ],
    tableTitle: "Pendências Regulatórias",
    tableHeaders: ["Norma", "Pendências", "Prazo"],
    tableRows: [
      ["NR-17 Ergonomia", "4", "30d"],
      ["eSocial S-2230", "3", "15d"],
      ["NR-7 PCMSO", "2", "60d"],
      ["LGPD Colab.", "3", "45d"],
    ],
  },
  // ── Engajamento ──
  pesquisas: {
    kpis: [
      { label: "eNPS", valor: "+42" },
      { label: "Participação", valor: "81,7%" },
      { label: "Pesquisas", valor: "8" },
      { label: "Promotores", valor: "61%" },
    ],
    chartType: "pie",
    chartTitle: "Distribuição eNPS",
    chartData: [
      { name: "Promotores", value: 61 },
      { name: "Neutros", value: 27 },
      { name: "Detratores", value: 12 },
    ],
    tableTitle: "Pesquisas Recentes",
    tableHeaders: ["Pesquisa", "Resp.", "Score"],
    tableRows: [
      ["Clima Q3", "1.840", "8.4"],
      ["Liderança", "1.520", "7.9"],
      ["Benefícios", "1.610", "8.1"],
      ["Comunicação", "1.430", "7.6"],
    ],
  },
  reconhecimento: {
    kpis: [
      { label: "Reconhec.", valor: "3.420" },
      { label: "Colab. Engaj.", valor: "67,3%" },
      { label: "Programas", valor: "12" },
      { label: "Investimento", valor: "R$ 380K" },
    ],
    chartType: "bar",
    chartTitle: "Reconhecimentos por Tipo",
    chartData: [
      { name: "Destaque Mês", valor: 1240 },
      { name: "Bônus Perf.", valor: 820 },
      { name: "Pares", valor: 680 },
      { name: "Aniversário", valor: 420 },
      { name: "Tempo Casa", valor: 260 },
    ],
    tableTitle: "Top Reconhecimentos por Área",
    tableHeaders: ["Área", "Total", "Var."],
    tableRows: [
      ["Operações", "1.120", "+18%"],
      ["Comercial", "740", "+12%"],
      ["RH", "420", "+8%"],
      ["TI", "380", "+15%"],
    ],
  },
  comunicacao: {
    kpis: [
      { label: "Avisos Enviados", valor: "12.4K" },
      { label: "Taxa Leitura", valor: "76,8%" },
      { label: "Canais Ativos", valor: "9" },
      { label: "Eng. Posts", valor: "+24%" },
    ],
    chartType: "area",
    chartTitle: "Engajamento em Comunicações",
    chartData: [
      { name: "abr", valor: 58 },
      { name: "mai", valor: 62 },
      { name: "jun", valor: 65 },
      { name: "jul", valor: 68 },
      { name: "ago", valor: 71 },
      { name: "set", valor: 74 },
      { name: "out", valor: 76 },
    ],
    tableTitle: "Top Canais de Comunicação",
    tableHeaders: ["Canal", "Alcance", "Leitura"],
    tableRows: [
      ["App Nexti", "8.420", "82%"],
      ["E-mail Interno", "6.120", "71%"],
      ["Mural Digital", "4.860", "68%"],
      ["WhatsApp Of.", "3.940", "79%"],
    ],
  },
};

const DEFAULT_MOCK = MOCKS.sancoes;

interface Props { tabId: string; }

export default function LockedTabMockBackground({ tabId }: Props) {
  const m = MOCKS[tabId] || DEFAULT_MOCK;

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {m.kpis.map((kpi, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl p-6">
            <p className="text-[0.85rem] font-medium text-muted-foreground">{kpi.label}</p>
            <p className="text-[1.8rem] font-semibold leading-none mt-2">{kpi.valor}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <p className="text-sm font-semibold mb-3 text-foreground">{m.chartTitle}</p>
        <ResponsiveContainer width="100%" height={240}>
          {m.chartType === "bar" ? (
            <BarChart data={m.chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Bar dataKey="valor" fill={ORANGE} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : m.chartType === "line" ? (
            <LineChart data={m.chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Line type="monotone" dataKey="valor" stroke={ORANGE} strokeWidth={2.5} dot={{ r: 3 }} />
              {m.chartKeys?.includes("resolvidos") && (
                <Line type="monotone" dataKey="resolvidos" stroke={ORANGE_SOFT} strokeWidth={2} dot={{ r: 3 }} />
              )}
            </LineChart>
          ) : m.chartType === "area" ? (
            <AreaChart data={m.chartData}>
              <defs>
                <linearGradient id={`grad-${tabId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ORANGE} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={ORANGE} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Area type="monotone" dataKey="valor" stroke={ORANGE} fill={`url(#grad-${tabId})`} strokeWidth={2} />
            </AreaChart>
          ) : (
            <PieChart>
              <Pie data={m.chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {m.chartData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">{m.tableTitle}</p>
        </div>
        <table className="w-full">
          <thead className="bg-[hsl(var(--surface))]">
            <tr>
              {m.tableHeaders.map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground p-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.tableRows.map((row, i) => (
              <tr key={i} className="border-t border-border">
                {row.map((cell, j) => (
                  <td key={j} className="text-sm p-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
