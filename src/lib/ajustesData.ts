// Real data: Total de Ajustes por Business Unit × Mês
export interface AjusteRecord {
  business_unit_id: number;
  business_unit_name: string;
  reference_month: string;
  volume_marcacoes: number;
  tempo_medio_dias: number;
  headcount: number;
}

/** Data grouped by Unidade de Negócio */
export const ajustesUnidadeData: AjusteRecord[] = [
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-04-01", volume_marcacoes: 7284, tempo_medio_dias: 2.7, headcount: 199 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-04-01", volume_marcacoes: 1195, tempo_medio_dias: 5.8, headcount: 20 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-04-01", volume_marcacoes: 1084, tempo_medio_dias: 5.5, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-05-01", volume_marcacoes: 7650, tempo_medio_dias: 4.7, headcount: 201 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-05-01", volume_marcacoes: 1279, tempo_medio_dias: 10.5, headcount: 22 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-05-01", volume_marcacoes: 1138, tempo_medio_dias: 6.3, headcount: 19 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-06-01", volume_marcacoes: 7665, tempo_medio_dias: 7.0, headcount: 200 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-06-01", volume_marcacoes: 1157, tempo_medio_dias: 14.6, headcount: 19 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-06-01", volume_marcacoes: 1010, tempo_medio_dias: 5.4, headcount: 19 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-07-01", volume_marcacoes: 8016, tempo_medio_dias: 6.2, headcount: 206 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-07-01", volume_marcacoes: 1117, tempo_medio_dias: 8.3, headcount: 19 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-07-01", volume_marcacoes: 1098, tempo_medio_dias: 7.2, headcount: 18 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-08-01", volume_marcacoes: 7872, tempo_medio_dias: 2.3, headcount: 197 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-08-01", volume_marcacoes: 1337, tempo_medio_dias: 3.1, headcount: 24 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-08-01", volume_marcacoes: 1275, tempo_medio_dias: 10.9, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-09-01", volume_marcacoes: 11853, tempo_medio_dias: 2.1, headcount: 352 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-09-01", volume_marcacoes: 1329, tempo_medio_dias: 4.2, headcount: 21 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-09-01", volume_marcacoes: 1072, tempo_medio_dias: 3.9, headcount: 20 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-10-01", volume_marcacoes: 30461, tempo_medio_dias: 7.0, headcount: 402 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-10-01", volume_marcacoes: 1205, tempo_medio_dias: 5.0, headcount: 22 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-10-01", volume_marcacoes: 1192, tempo_medio_dias: 7.3, headcount: 19 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-11-01", volume_marcacoes: 27551, tempo_medio_dias: 12.9, headcount: 383 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-11-01", volume_marcacoes: 1422, tempo_medio_dias: 10.9, headcount: 24 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-11-01", volume_marcacoes: 1397, tempo_medio_dias: 9.7, headcount: 28 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-12-01", volume_marcacoes: 24550, tempo_medio_dias: 3.5, headcount: 371 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-12-01", volume_marcacoes: 1987, tempo_medio_dias: 5.6, headcount: 28 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-12-01", volume_marcacoes: 1343, tempo_medio_dias: 8.2, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-01-01", volume_marcacoes: 22457, tempo_medio_dias: 3.9, headcount: 378 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-01-01", volume_marcacoes: 1603, tempo_medio_dias: 3.8, headcount: 28 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-01-01", volume_marcacoes: 1331, tempo_medio_dias: 11.8, headcount: 22 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-02-01", volume_marcacoes: 22323, tempo_medio_dias: 5.3, headcount: 398 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-02-01", volume_marcacoes: 1395, tempo_medio_dias: 5.2, headcount: 25 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-02-01", volume_marcacoes: 1156, tempo_medio_dias: 4.3, headcount: 22 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-03-01", volume_marcacoes: 25252, tempo_medio_dias: 5.9, headcount: 393 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-03-01", volume_marcacoes: 1717, tempo_medio_dias: 10.6, headcount: 27 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-03-01", volume_marcacoes: 1384, tempo_medio_dias: 4.1, headcount: 25 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-04-01", volume_marcacoes: 239, tempo_medio_dias: 10.3, headcount: 79 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-04-01", volume_marcacoes: 37, tempo_medio_dias: 5.8, headcount: 10 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-04-01", volume_marcacoes: 15, tempo_medio_dias: null as any, headcount: 7 },
];

/** Data grouped by Área (same structure, different grouping from backend) */
export const ajustesAreaData: AjusteRecord[] = [
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-04-01", volume_marcacoes: 7284, tempo_medio_dias: 2.7, headcount: 199 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-04-01", volume_marcacoes: 1195, tempo_medio_dias: 5.8, headcount: 20 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-04-01", volume_marcacoes: 1084, tempo_medio_dias: 5.5, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-05-01", volume_marcacoes: 7650, tempo_medio_dias: 4.7, headcount: 201 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-05-01", volume_marcacoes: 1279, tempo_medio_dias: 10.5, headcount: 22 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-05-01", volume_marcacoes: 1138, tempo_medio_dias: 6.3, headcount: 19 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-06-01", volume_marcacoes: 7665, tempo_medio_dias: 7.0, headcount: 200 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-06-01", volume_marcacoes: 1157, tempo_medio_dias: 14.6, headcount: 19 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-06-01", volume_marcacoes: 1010, tempo_medio_dias: 5.4, headcount: 19 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-07-01", volume_marcacoes: 8016, tempo_medio_dias: 6.2, headcount: 206 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-07-01", volume_marcacoes: 1117, tempo_medio_dias: 8.3, headcount: 19 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-07-01", volume_marcacoes: 1098, tempo_medio_dias: 7.2, headcount: 18 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-08-01", volume_marcacoes: 7872, tempo_medio_dias: 2.3, headcount: 197 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-08-01", volume_marcacoes: 1337, tempo_medio_dias: 3.1, headcount: 24 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-08-01", volume_marcacoes: 1275, tempo_medio_dias: 10.9, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-09-01", volume_marcacoes: 11853, tempo_medio_dias: 2.1, headcount: 352 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-09-01", volume_marcacoes: 1329, tempo_medio_dias: 4.2, headcount: 21 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-09-01", volume_marcacoes: 1072, tempo_medio_dias: 3.9, headcount: 20 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-10-01", volume_marcacoes: 30461, tempo_medio_dias: 7.0, headcount: 402 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-10-01", volume_marcacoes: 1205, tempo_medio_dias: 5.0, headcount: 22 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-10-01", volume_marcacoes: 1192, tempo_medio_dias: 7.3, headcount: 19 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-11-01", volume_marcacoes: 27551, tempo_medio_dias: 12.9, headcount: 383 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-11-01", volume_marcacoes: 1422, tempo_medio_dias: 10.9, headcount: 24 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-11-01", volume_marcacoes: 1397, tempo_medio_dias: 9.7, headcount: 28 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-12-01", volume_marcacoes: 24550, tempo_medio_dias: 3.5, headcount: 371 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-12-01", volume_marcacoes: 1987, tempo_medio_dias: 5.6, headcount: 28 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-12-01", volume_marcacoes: 1343, tempo_medio_dias: 8.2, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-01-01", volume_marcacoes: 22457, tempo_medio_dias: 3.9, headcount: 378 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-01-01", volume_marcacoes: 1603, tempo_medio_dias: 3.8, headcount: 28 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-01-01", volume_marcacoes: 1331, tempo_medio_dias: 11.8, headcount: 22 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-02-01", volume_marcacoes: 22323, tempo_medio_dias: 5.3, headcount: 398 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-02-01", volume_marcacoes: 1395, tempo_medio_dias: 5.2, headcount: 25 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-02-01", volume_marcacoes: 1156, tempo_medio_dias: 4.3, headcount: 22 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-03-01", volume_marcacoes: 25252, tempo_medio_dias: 5.9, headcount: 393 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-03-01", volume_marcacoes: 1717, tempo_medio_dias: 10.6, headcount: 27 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-03-01", volume_marcacoes: 1384, tempo_medio_dias: 4.1, headcount: 25 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-04-01", volume_marcacoes: 239, tempo_medio_dias: 10.3, headcount: 79 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-04-01", volume_marcacoes: 37, tempo_medio_dias: 5.8, headcount: 10 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-04-01", volume_marcacoes: 15, tempo_medio_dias: null as any, headcount: 7 },
];

/** Backward compat alias */
export const ajustesRawData = ajustesUnidadeData;

/** Available months sorted chronologically */
export const ajustesMeses = (() => {
  const set = new Set(ajustesRawData.map(r => r.reference_month));
  return Array.from(set).sort();
})();

/** Format "2025-07-01" → "jul/25" */
export function formatMesLabel(month: string): string {
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const d = new Date(month + "T00:00:00");
  return `${meses[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
}

export interface AjusteScatterPoint {
  regional: string;
  volume: number;
  dias: number;
  headcount: number;
}

/** Aggregate raw data into scatter points. If month is null, consolidate all months.
 *  groupBy selects which dataset to use: "unidade" (default) or "area". */
export function aggregateAjustes(selectedMonth: string | null, groupBy: "unidade" | "area" | "empresa" = "unidade"): AjusteScatterPoint[] {
  const source = groupBy === "area" ? ajustesAreaData : ajustesUnidadeData;
  const filtered = selectedMonth
    ? source.filter(r => r.reference_month === selectedMonth)
    : source;

  const byBU = new Map<number, { name: string; totalVolume: number; weightedDias: number; maxHeadcount: number }>();

  for (const r of filtered) {
    if (r.tempo_medio_dias == null) continue; // skip null tempo
    const existing = byBU.get(r.business_unit_id);
    if (existing) {
      existing.totalVolume += r.volume_marcacoes;
      existing.weightedDias += r.tempo_medio_dias * r.volume_marcacoes;
      existing.maxHeadcount = Math.max(existing.maxHeadcount, r.headcount);
    } else {
      byBU.set(r.business_unit_id, {
        name: r.business_unit_name,
        totalVolume: r.volume_marcacoes,
        weightedDias: r.tempo_medio_dias * r.volume_marcacoes,
        maxHeadcount: r.headcount,
      });
    }
  }

  return Array.from(byBU.values()).map(bu => ({
    regional: bu.name,
    volume: bu.totalVolume,
    dias: +(bu.weightedDias / bu.totalVolume).toFixed(1),
    headcount: bu.maxHeadcount,
  }));
}
