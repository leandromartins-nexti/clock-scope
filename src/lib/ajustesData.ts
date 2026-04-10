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

/** Data grouped by Área */
export const ajustesAreaData: AjusteRecord[] = [
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2025-04-01", volume_marcacoes: 2484, tempo_medio_dias: 5.6, headcount: 49 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2025-04-01", volume_marcacoes: 530, tempo_medio_dias: 9.0, headcount: 9 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2025-04-01", volume_marcacoes: 131, tempo_medio_dias: 0.1, headcount: 4 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2025-05-01", volume_marcacoes: 2744, tempo_medio_dias: 8.2, headcount: 48 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2025-05-01", volume_marcacoes: 432, tempo_medio_dias: 5.6, headcount: 8 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2025-05-01", volume_marcacoes: 121, tempo_medio_dias: 0.1, headcount: 5 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2025-06-01", volume_marcacoes: 2499, tempo_medio_dias: 9.2, headcount: 48 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2025-06-01", volume_marcacoes: 317, tempo_medio_dias: 6.5, headcount: 6 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2025-06-01", volume_marcacoes: 108, tempo_medio_dias: 5.5, headcount: 4 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2025-07-01", volume_marcacoes: 2688, tempo_medio_dias: 6.0, headcount: 47 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2025-07-01", volume_marcacoes: 467, tempo_medio_dias: 2.4, headcount: 7 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2025-07-01", volume_marcacoes: 161, tempo_medio_dias: 4.5, headcount: 4 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2025-08-01", volume_marcacoes: 2766, tempo_medio_dias: 7.1, headcount: 49 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2025-08-01", volume_marcacoes: 504, tempo_medio_dias: 2.8, headcount: 8 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2025-08-01", volume_marcacoes: 168, tempo_medio_dias: 1.5, headcount: 4 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2025-09-01", volume_marcacoes: 2511, tempo_medio_dias: 3.9, headcount: 48 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2025-09-01", volume_marcacoes: 478, tempo_medio_dias: 6.0, headcount: 8 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2025-09-01", volume_marcacoes: 300, tempo_medio_dias: 0.6, headcount: 10 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2025-10-01", volume_marcacoes: 2550, tempo_medio_dias: 6.6, headcount: 54 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2025-10-01", volume_marcacoes: 1216, tempo_medio_dias: 6.1, headcount: 15 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2025-10-01", volume_marcacoes: 394, tempo_medio_dias: 4.8, headcount: 9 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2025-11-01", volume_marcacoes: 3118, tempo_medio_dias: 13.5, headcount: 56 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2025-11-01", volume_marcacoes: 787, tempo_medio_dias: 13.9, headcount: 14 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2025-11-01", volume_marcacoes: 593, tempo_medio_dias: 14.2, headcount: 10 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2025-12-01", volume_marcacoes: 2914, tempo_medio_dias: 7.0, headcount: 47 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2025-12-01", volume_marcacoes: 1026, tempo_medio_dias: 5.6, headcount: 11 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2025-12-01", volume_marcacoes: 518, tempo_medio_dias: 9.6, headcount: 8 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2026-01-01", volume_marcacoes: 2693, tempo_medio_dias: 5.4, headcount: 51 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2026-01-01", volume_marcacoes: 859, tempo_medio_dias: 1.9, headcount: 15 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2026-01-01", volume_marcacoes: 551, tempo_medio_dias: 19.0, headcount: 9 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2026-02-01", volume_marcacoes: 2746, tempo_medio_dias: 5.6, headcount: 54 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2026-02-01", volume_marcacoes: 737, tempo_medio_dias: 2.9, headcount: 13 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2026-02-01", volume_marcacoes: 439, tempo_medio_dias: 4.3, headcount: 9 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2026-03-01", volume_marcacoes: 3265, tempo_medio_dias: 7.5, headcount: 53 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2026-03-01", volume_marcacoes: 851, tempo_medio_dias: 5.7, headcount: 12 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2026-03-01", volume_marcacoes: 501, tempo_medio_dias: 3.7, headcount: 10 },
  { business_unit_id: 11043, business_unit_name: "SAO PAULO", reference_month: "2026-04-01", volume_marcacoes: 44, tempo_medio_dias: 5.3, headcount: 18 },
  { business_unit_id: 11045, business_unit_name: "SOROCABA", reference_month: "2026-04-01", volume_marcacoes: 16, tempo_medio_dias: 7.9, headcount: 3 },
  { business_unit_id: 11046, business_unit_name: "PIRACICABA", reference_month: "2026-04-01", volume_marcacoes: 10, tempo_medio_dias: 5.8, headcount: 3 },
];

/** Data grouped by Empresa */
export const ajustesEmpresaData: AjusteRecord[] = [
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-04-01", volume_marcacoes: 7921, tempo_medio_dias: 3.0, headcount: 207 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-04-01", volume_marcacoes: 919, tempo_medio_dias: 5.8, headcount: 20 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-04-01", volume_marcacoes: 723, tempo_medio_dias: 2.9, headcount: 12 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-05-01", volume_marcacoes: 8185, tempo_medio_dias: 4.6, headcount: 209 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-05-01", volume_marcacoes: 1155, tempo_medio_dias: 10.7, headcount: 19 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-05-01", volume_marcacoes: 727, tempo_medio_dias: 4.5, headcount: 12 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-06-01", volume_marcacoes: 8077, tempo_medio_dias: 6.7, headcount: 210 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-06-01", volume_marcacoes: 1123, tempo_medio_dias: 14.1, headcount: 17 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-06-01", volume_marcacoes: 632, tempo_medio_dias: 6.5, headcount: 11 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-07-01", volume_marcacoes: 8576, tempo_medio_dias: 6.0, headcount: 215 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-07-01", volume_marcacoes: 1060, tempo_medio_dias: 8.2, headcount: 17 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-07-01", volume_marcacoes: 595, tempo_medio_dias: 16.7, headcount: 11 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-08-01", volume_marcacoes: 8527, tempo_medio_dias: 2.4, headcount: 209 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-08-01", volume_marcacoes: 1170, tempo_medio_dias: 11.1, headcount: 17 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-08-01", volume_marcacoes: 787, tempo_medio_dias: 4.1, headcount: 13 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-09-01", volume_marcacoes: 12812, tempo_medio_dias: 2.4, headcount: 363 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-09-01", volume_marcacoes: 848, tempo_medio_dias: 3.7, headcount: 16 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-09-01", volume_marcacoes: 594, tempo_medio_dias: 4.7, headcount: 11 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-10-01", volume_marcacoes: 31311, tempo_medio_dias: 7.0, headcount: 415 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-10-01", volume_marcacoes: 920, tempo_medio_dias: 7.5, headcount: 16 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-10-01", volume_marcacoes: 627, tempo_medio_dias: 6.6, headcount: 12 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-11-01", volume_marcacoes: 28649, tempo_medio_dias: 12.5, headcount: 398 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-11-01", volume_marcacoes: 1110, tempo_medio_dias: 15.2, headcount: 20 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-11-01", volume_marcacoes: 611, tempo_medio_dias: 8.0, headcount: 11 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-12-01", volume_marcacoes: 25708, tempo_medio_dias: 3.8, headcount: 386 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-12-01", volume_marcacoes: 1483, tempo_medio_dias: 5.7, headcount: 21 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-12-01", volume_marcacoes: 689, tempo_medio_dias: 5.1, headcount: 11 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-01-01", volume_marcacoes: 23465, tempo_medio_dias: 4.2, headcount: 390 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-01-01", volume_marcacoes: 1243, tempo_medio_dias: 3.3, headcount: 21 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-01-01", volume_marcacoes: 683, tempo_medio_dias: 5.8, headcount: 11 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-02-01", volume_marcacoes: 22979, tempo_medio_dias: 5.3, headcount: 409 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-02-01", volume_marcacoes: 1272, tempo_medio_dias: 5.1, headcount: 21 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-02-01", volume_marcacoes: 623, tempo_medio_dias: 4.3, headcount: 11 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-03-01", volume_marcacoes: 26253, tempo_medio_dias: 6.0, headcount: 406 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-03-01", volume_marcacoes: 1397, tempo_medio_dias: 10.1, headcount: 19 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-03-01", volume_marcacoes: 703, tempo_medio_dias: 4.2, headcount: 12 },
  { business_unit_id: 9380, business_unit_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-04-01", volume_marcacoes: 270, tempo_medio_dias: 9.9, headcount: 87 },
  { business_unit_id: 9379, business_unit_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-04-01", volume_marcacoes: 13, tempo_medio_dias: null as any, headcount: 5 },
  { business_unit_id: 9381, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-04-01", volume_marcacoes: 8, tempo_medio_dias: 7.2, headcount: 4 },
];

/** Backward compat alias */
export const ajustesRawData = ajustesUnidadeData;

/** Unique entities per grouping */
export const ajustesUnidades = (() => {
  const map = new Map<number, string>();
  for (const r of ajustesUnidadeData) map.set(r.business_unit_id, r.business_unit_name);
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
})();

export const ajustesAreas = (() => {
  const map = new Map<number, string>();
  for (const r of ajustesAreaData) map.set(r.business_unit_id, r.business_unit_name);
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
})();

export const ajustesEmpresas = (() => {
  const map = new Map<number, string>();
  for (const r of ajustesEmpresaData) map.set(r.business_unit_id, r.business_unit_name);
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
})();

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
  const source = groupBy === "area" ? ajustesAreaData : groupBy === "empresa" ? ajustesEmpresaData : ajustesUnidadeData;
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
