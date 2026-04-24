/**
 * timeGranularity.ts
 * ------------------------------------------------------------------
 * Helpers para expandir séries mensais em séries diárias quando o
 * usuário alterna o PeriodGranularityToggle de "Anual" para "Mensal".
 *
 * Estratégia: para cada ponto mensal, gera N pontos diários (28-31)
 * distribuindo o valor da métrica ao longo dos dias com pequena
 * variação determinística (seno) para preservar a média mensal e
 * dar uma textura realista ao gráfico.
 *
 * Os labels seguem o padrão "dd/MM" (ex.: "05/abr"). O campo de label
 * é configurável via parâmetro `labelKey` (default: "mes").
 */

const MES_PT: Record<string, { num: number; days: number; abbr: string }> = {
  "abr/25": { num: 4, days: 30, abbr: "abr" },
  "mai/25": { num: 5, days: 31, abbr: "mai" },
  "jun/25": { num: 6, days: 30, abbr: "jun" },
  "jul/25": { num: 7, days: 31, abbr: "jul" },
  "ago/25": { num: 8, days: 31, abbr: "ago" },
  "set/25": { num: 9, days: 30, abbr: "set" },
  "out/25": { num: 10, days: 31, abbr: "out" },
  "nov/25": { num: 11, days: 30, abbr: "nov" },
  "dez/25": { num: 12, days: 31, abbr: "dez" },
  "jan/26": { num: 1, days: 31, abbr: "jan" },
  "fev/26": { num: 2, days: 28, abbr: "fev" },
  "mar/26": { num: 3, days: 31, abbr: "mar" },
};

/** Pseudo-random determinístico [-1, 1] a partir de um seed. */
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/**
 * Expande uma série mensal em diária. Cada ponto mensal vira ~30 pontos
 * (um por dia). Campos numéricos são distribuídos uniformemente entre
 * os dias com leve variação (~±8%) para preservar o total/média.
 *
 * @param series  Série mensal original
 * @param labelKey Nome do campo que contém o label "mmm/aa" (default "mes")
 * @param numericFields Campos numéricos que devem ser variados por dia.
 *                      Se omitido, todos os campos numéricos são variados.
 * @param averageFields Campos numéricos que representam médias/percentuais
 *                      (não devem ser divididos pelo nº de dias).
 */
export function expandMonthlyToDaily<T extends Record<string, any>>(
  series: T[],
  options: {
    labelKey?: string;
    sumFields?: string[];
    averageFields?: string[];
    /** Quando true, expande apenas o último mês da série em dias (ignora os demais). */
    onlyLastMonth?: boolean;
    /** Se informado, expande apenas este mês (ex.: "set/25"). Tem prioridade sobre onlyLastMonth. */
    onlyMonthLabel?: string;
  } = {},
): T[] {
  const { labelKey = "mes", sumFields, averageFields = [], onlyLastMonth = false, onlyMonthLabel } = options;
  if (!Array.isArray(series) || series.length === 0) return [];

  // Em modo "apenas mês X" ou "apenas último mês", limitamos a série de entrada.
  const workingSeries = onlyMonthLabel
    ? series.filter((r: any) => String(r?.[labelKey] ?? "") === onlyMonthLabel)
    : onlyLastMonth
    ? (() => {
        for (let i = series.length - 1; i >= 0; i--) {
          const lbl = String((series[i] as any)?.[labelKey] ?? "");
          if (MES_PT[lbl]) return [series[i]];
        }
        return series.slice(-1);
      })()
    : series;


  const out: T[] = [];
  workingSeries.forEach((row, monthIdx) => {
    const label = String(row[labelKey] ?? "");
    const meta = MES_PT[label];
    if (!meta) {
      out.push(row);
      return;
    }


    // Build a "clean" base row without non-serializable fields (objects/arrays
    // like `pin` annotations). Spreading those into every daily row would break
    // downstream code that expects them to appear on a single anchor month.
    const cleanRow: Record<string, any> = {};
    Object.keys(row).forEach((k) => {
      const v = (row as any)[k];
      if (v === null || v === undefined) return;
      const t = typeof v;
      if (t === "number" || t === "string" || t === "boolean") {
        cleanRow[k] = v;
      }
    });

    // Detect numeric fields if sumFields not provided
    const detectedSumFields =
      sumFields ??
      Object.keys(cleanRow).filter(
        (k) =>
          k !== labelKey &&
          typeof cleanRow[k] === "number" &&
          !averageFields.includes(k),
      );

    for (let day = 1; day <= meta.days; day++) {
      const dayLabel = `${String(day).padStart(2, "0")}/${meta.abbr}`;
      const newRow: any = { ...cleanRow, [labelKey]: dayLabel };

      // Distribute "sum-style" fields evenly across days with small jitter
      detectedSumFields.forEach((field, fIdx) => {
        const monthlyTotal = Number(cleanRow[field]) || 0;
        const base = monthlyTotal / meta.days;
        const j = jitter(monthIdx * 100 + day * 7 + fIdx * 13) * 0.08; // ±8%
        newRow[field] = +(base * (1 + j)).toFixed(2);
      });

      // Keep average/percentage fields close to the monthly value with small jitter
      averageFields.forEach((field, fIdx) => {
        const monthlyAvg = Number(cleanRow[field]) || 0;
        const j = jitter(monthIdx * 50 + day * 3 + fIdx * 11) * 0.04; // ±4%
        newRow[field] = +(monthlyAvg * (1 + j)).toFixed(2);
      });

      out.push(newRow as T);
    }
  });
  return out;
}
