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

// ── Composição do Tempo de Tratativa ──
export interface ComposicaoFaixaRecord {
  company_id: number;
  company_name: string;
  reference_month: string;
  total_ajustes: number;
  faixa_ate_1_dia: number;
  faixa_1_3_dias: number;
  faixa_3_7_dias: number;
  faixa_7_15_dias: number;
  faixa_mais_15_dias: number;
}

export const composicaoEmpresaData: ComposicaoFaixaRecord[] = [
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-04-01", total_ajustes: 909, faixa_ate_1_dia: 407, faixa_1_3_dias: 140, faixa_3_7_dias: 119, faixa_7_15_dias: 109, faixa_mais_15_dias: 134 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-04-01", total_ajustes: 579, faixa_ate_1_dia: 61, faixa_1_3_dias: 76, faixa_3_7_dias: 129, faixa_7_15_dias: 151, faixa_mais_15_dias: 162 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-04-01", total_ajustes: 76, faixa_ate_1_dia: 24, faixa_1_3_dias: 13, faixa_3_7_dias: 21, faixa_7_15_dias: 4, faixa_mais_15_dias: 14 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-05-01", total_ajustes: 1098, faixa_ate_1_dia: 506, faixa_1_3_dias: 170, faixa_3_7_dias: 144, faixa_7_15_dias: 91, faixa_mais_15_dias: 187 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-05-01", total_ajustes: 515, faixa_ate_1_dia: 55, faixa_1_3_dias: 60, faixa_3_7_dias: 89, faixa_7_15_dias: 101, faixa_mais_15_dias: 210 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-05-01", total_ajustes: 81, faixa_ate_1_dia: 27, faixa_1_3_dias: 25, faixa_3_7_dias: 16, faixa_7_15_dias: 9, faixa_mais_15_dias: 4 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-06-01", total_ajustes: 1148, faixa_ate_1_dia: 356, faixa_1_3_dias: 204, faixa_3_7_dias: 216, faixa_7_15_dias: 145, faixa_mais_15_dias: 227 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-06-01", total_ajustes: 461, faixa_ate_1_dia: 22, faixa_1_3_dias: 52, faixa_3_7_dias: 85, faixa_7_15_dias: 193, faixa_mais_15_dias: 109 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-06-01", total_ajustes: 42, faixa_ate_1_dia: 6, faixa_1_3_dias: 11, faixa_3_7_dias: 15, faixa_7_15_dias: 4, faixa_mais_15_dias: 6 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-07-01", total_ajustes: 1183, faixa_ate_1_dia: 542, faixa_1_3_dias: 275, faixa_3_7_dias: 179, faixa_7_15_dias: 157, faixa_mais_15_dias: 30 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-07-01", total_ajustes: 439, faixa_ate_1_dia: 70, faixa_1_3_dias: 87, faixa_3_7_dias: 99, faixa_7_15_dias: 25, faixa_mais_15_dias: 158 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-07-01", total_ajustes: 47, faixa_ate_1_dia: 21, faixa_1_3_dias: 13, faixa_3_7_dias: 3, faixa_7_15_dias: 4, faixa_mais_15_dias: 6 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-08-01", total_ajustes: 1107, faixa_ate_1_dia: 586, faixa_1_3_dias: 299, faixa_3_7_dias: 148, faixa_7_15_dias: 60, faixa_mais_15_dias: 14 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-08-01", total_ajustes: 431, faixa_ate_1_dia: 57, faixa_1_3_dias: 83, faixa_3_7_dias: 121, faixa_7_15_dias: 148, faixa_mais_15_dias: 22 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-08-01", total_ajustes: 68, faixa_ate_1_dia: 25, faixa_1_3_dias: 24, faixa_3_7_dias: 16, faixa_7_15_dias: 2, faixa_mais_15_dias: 1 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-09-01", total_ajustes: 9202, faixa_ate_1_dia: 1285, faixa_1_3_dias: 1434, faixa_3_7_dias: 1837, faixa_7_15_dias: 3893, faixa_mais_15_dias: 753 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-09-01", total_ajustes: 343, faixa_ate_1_dia: 53, faixa_1_3_dias: 80, faixa_3_7_dias: 76, faixa_7_15_dias: 67, faixa_mais_15_dias: 67 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-09-01", total_ajustes: 42, faixa_ate_1_dia: 11, faixa_1_3_dias: 7, faixa_3_7_dias: 12, faixa_7_15_dias: 8, faixa_mais_15_dias: 4 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-10-01", total_ajustes: 12861, faixa_ate_1_dia: 2091, faixa_1_3_dias: 1461, faixa_3_7_dias: 1958, faixa_7_15_dias: 3173, faixa_mais_15_dias: 4178 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-10-01", total_ajustes: 511, faixa_ate_1_dia: 42, faixa_1_3_dias: 84, faixa_3_7_dias: 119, faixa_7_15_dias: 55, faixa_mais_15_dias: 211 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-10-01", total_ajustes: 70, faixa_ate_1_dia: 12, faixa_1_3_dias: 9, faixa_3_7_dias: 20, faixa_7_15_dias: 17, faixa_mais_15_dias: 12 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-11-01", total_ajustes: 7998, faixa_ate_1_dia: 2199, faixa_1_3_dias: 1898, faixa_3_7_dias: 1765, faixa_7_15_dias: 1498, faixa_mais_15_dias: 638 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-11-01", total_ajustes: 567, faixa_ate_1_dia: 51, faixa_1_3_dias: 95, faixa_3_7_dias: 137, faixa_7_15_dias: 179, faixa_mais_15_dias: 105 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-11-01", total_ajustes: 83, faixa_ate_1_dia: 20, faixa_1_3_dias: 20, faixa_3_7_dias: 15, faixa_7_15_dias: 24, faixa_mais_15_dias: 4 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-12-01", total_ajustes: 8331, faixa_ate_1_dia: 2804, faixa_1_3_dias: 2218, faixa_3_7_dias: 2282, faixa_7_15_dias: 703, faixa_mais_15_dias: 324 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-12-01", total_ajustes: 742, faixa_ate_1_dia: 139, faixa_1_3_dias: 175, faixa_3_7_dias: 243, faixa_7_15_dias: 181, faixa_mais_15_dias: 4 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-12-01", total_ajustes: 71, faixa_ate_1_dia: 16, faixa_1_3_dias: 9, faixa_3_7_dias: 17, faixa_7_15_dias: 26, faixa_mais_15_dias: 3 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-01-01", total_ajustes: 4656, faixa_ate_1_dia: 1013, faixa_1_3_dias: 1547, faixa_3_7_dias: 1150, faixa_7_15_dias: 523, faixa_mais_15_dias: 423 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-01-01", total_ajustes: 788, faixa_ate_1_dia: 122, faixa_1_3_dias: 249, faixa_3_7_dias: 300, faixa_7_15_dias: 71, faixa_mais_15_dias: 46 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-01-01", total_ajustes: 43, faixa_ate_1_dia: 4, faixa_1_3_dias: 13, faixa_3_7_dias: 21, faixa_7_15_dias: 4, faixa_mais_15_dias: 1 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-02-01", total_ajustes: 5092, faixa_ate_1_dia: 1592, faixa_1_3_dias: 1830, faixa_3_7_dias: 828, faixa_7_15_dias: 533, faixa_mais_15_dias: 309 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-02-01", total_ajustes: 644, faixa_ate_1_dia: 91, faixa_1_3_dias: 143, faixa_3_7_dias: 187, faixa_7_15_dias: 72, faixa_mais_15_dias: 151 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-02-01", total_ajustes: 52, faixa_ate_1_dia: 9, faixa_1_3_dias: 16, faixa_3_7_dias: 15, faixa_7_15_dias: 9, faixa_mais_15_dias: 3 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-03-01", total_ajustes: 2639, faixa_ate_1_dia: 666, faixa_1_3_dias: 625, faixa_3_7_dias: 673, faixa_7_15_dias: 628, faixa_mais_15_dias: 47 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-03-01", total_ajustes: 381, faixa_ate_1_dia: 39, faixa_1_3_dias: 68, faixa_3_7_dias: 115, faixa_7_15_dias: 154, faixa_mais_15_dias: 5 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-03-01", total_ajustes: 67, faixa_ate_1_dia: 20, faixa_1_3_dias: 13, faixa_3_7_dias: 26, faixa_7_15_dias: 8, faixa_mais_15_dias: 0 },
];

export const composicaoUnidadeData: ComposicaoFaixaRecord[] = [
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-04-01", total_ajustes: 883, faixa_ate_1_dia: 393, faixa_1_3_dias: 135, faixa_3_7_dias: 111, faixa_7_15_dias: 119, faixa_mais_15_dias: 125 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-04-01", total_ajustes: 575, faixa_ate_1_dia: 70, faixa_1_3_dias: 85, faixa_3_7_dias: 137, faixa_7_15_dias: 135, faixa_mais_15_dias: 148 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-04-01", total_ajustes: 106, faixa_ate_1_dia: 29, faixa_1_3_dias: 9, faixa_3_7_dias: 21, faixa_7_15_dias: 10, faixa_mais_15_dias: 37 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-05-01", total_ajustes: 1065, faixa_ate_1_dia: 501, faixa_1_3_dias: 161, faixa_3_7_dias: 111, faixa_7_15_dias: 101, faixa_mais_15_dias: 191 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-05-01", total_ajustes: 473, faixa_ate_1_dia: 58, faixa_1_3_dias: 59, faixa_3_7_dias: 74, faixa_7_15_dias: 87, faixa_mais_15_dias: 195 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-05-01", total_ajustes: 156, faixa_ate_1_dia: 29, faixa_1_3_dias: 35, faixa_3_7_dias: 64, faixa_7_15_dias: 13, faixa_mais_15_dias: 15 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-06-01", total_ajustes: 1088, faixa_ate_1_dia: 336, faixa_1_3_dias: 188, faixa_3_7_dias: 188, faixa_7_15_dias: 161, faixa_mais_15_dias: 215 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-06-01", total_ajustes: 406, faixa_ate_1_dia: 19, faixa_1_3_dias: 42, faixa_3_7_dias: 71, faixa_7_15_dias: 169, faixa_mais_15_dias: 105 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-06-01", total_ajustes: 157, faixa_ate_1_dia: 29, faixa_1_3_dias: 37, faixa_3_7_dias: 57, faixa_7_15_dias: 12, faixa_mais_15_dias: 22 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-07-01", total_ajustes: 1038, faixa_ate_1_dia: 495, faixa_1_3_dias: 240, faixa_3_7_dias: 130, faixa_7_15_dias: 149, faixa_mais_15_dias: 24 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-07-01", total_ajustes: 425, faixa_ate_1_dia: 68, faixa_1_3_dias: 74, faixa_3_7_dias: 98, faixa_7_15_dias: 25, faixa_mais_15_dias: 160 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-07-01", total_ajustes: 206, faixa_ate_1_dia: 70, faixa_1_3_dias: 61, faixa_3_7_dias: 53, faixa_7_15_dias: 12, faixa_mais_15_dias: 10 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-08-01", total_ajustes: 881, faixa_ate_1_dia: 485, faixa_1_3_dias: 241, faixa_3_7_dias: 106, faixa_7_15_dias: 39, faixa_mais_15_dias: 10 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-08-01", total_ajustes: 446, faixa_ate_1_dia: 64, faixa_1_3_dias: 89, faixa_3_7_dias: 123, faixa_7_15_dias: 148, faixa_mais_15_dias: 22 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-08-01", total_ajustes: 279, faixa_ate_1_dia: 119, faixa_1_3_dias: 76, faixa_3_7_dias: 56, faixa_7_15_dias: 23, faixa_mais_15_dias: 5 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-09-01", total_ajustes: 8815, faixa_ate_1_dia: 1177, faixa_1_3_dias: 1349, faixa_3_7_dias: 1737, faixa_7_15_dias: 3801, faixa_mais_15_dias: 751 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-09-01", total_ajustes: 393, faixa_ate_1_dia: 63, faixa_1_3_dias: 91, faixa_3_7_dias: 90, faixa_7_15_dias: 82, faixa_mais_15_dias: 67 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-09-01", total_ajustes: 379, faixa_ate_1_dia: 109, faixa_1_3_dias: 81, faixa_3_7_dias: 98, faixa_7_15_dias: 85, faixa_mais_15_dias: 6 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-10-01", total_ajustes: 12615, faixa_ate_1_dia: 2068, faixa_1_3_dias: 1400, faixa_3_7_dias: 1884, faixa_7_15_dias: 3127, faixa_mais_15_dias: 4136 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-10-01", total_ajustes: 470, faixa_ate_1_dia: 45, faixa_1_3_dias: 88, faixa_3_7_dias: 132, faixa_7_15_dias: 56, faixa_mais_15_dias: 149 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-10-01", total_ajustes: 357, faixa_ate_1_dia: 32, faixa_1_3_dias: 66, faixa_3_7_dias: 81, faixa_7_15_dias: 62, faixa_mais_15_dias: 116 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-11-01", total_ajustes: 7386, faixa_ate_1_dia: 2117, faixa_1_3_dias: 1801, faixa_3_7_dias: 1580, faixa_7_15_dias: 1315, faixa_mais_15_dias: 573 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-11-01", total_ajustes: 776, faixa_ate_1_dia: 101, faixa_1_3_dias: 137, faixa_3_7_dias: 200, faixa_7_15_dias: 246, faixa_mais_15_dias: 92 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-11-01", total_ajustes: 486, faixa_ate_1_dia: 52, faixa_1_3_dias: 75, faixa_3_7_dias: 137, faixa_7_15_dias: 140, faixa_mais_15_dias: 82 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-12-01", total_ajustes: 7810, faixa_ate_1_dia: 2722, faixa_1_3_dias: 2106, faixa_3_7_dias: 2126, faixa_7_15_dias: 601, faixa_mais_15_dias: 255 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-12-01", total_ajustes: 1060, faixa_ate_1_dia: 184, faixa_1_3_dias: 247, faixa_3_7_dias: 363, faixa_7_15_dias: 251, faixa_mais_15_dias: 15 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-12-01", total_ajustes: 274, faixa_ate_1_dia: 53, faixa_1_3_dias: 49, faixa_3_7_dias: 53, faixa_7_15_dias: 58, faixa_mais_15_dias: 61 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-01-01", total_ajustes: 4400, faixa_ate_1_dia: 977, faixa_1_3_dias: 1495, faixa_3_7_dias: 1054, faixa_7_15_dias: 456, faixa_mais_15_dias: 418 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-01-01", total_ajustes: 978, faixa_ate_1_dia: 145, faixa_1_3_dias: 293, faixa_3_7_dias: 374, faixa_7_15_dias: 116, faixa_mais_15_dias: 50 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-01-01", total_ajustes: 109, faixa_ate_1_dia: 17, faixa_1_3_dias: 21, faixa_3_7_dias: 43, faixa_7_15_dias: 26, faixa_mais_15_dias: 2 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-02-01", total_ajustes: 4919, faixa_ate_1_dia: 1562, faixa_1_3_dias: 1817, faixa_3_7_dias: 755, faixa_7_15_dias: 510, faixa_mais_15_dias: 275 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-02-01", total_ajustes: 686, faixa_ate_1_dia: 101, faixa_1_3_dias: 138, faixa_3_7_dias: 193, faixa_7_15_dias: 72, faixa_mais_15_dias: 182 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-02-01", total_ajustes: 183, faixa_ate_1_dia: 29, faixa_1_3_dias: 34, faixa_3_7_dias: 82, faixa_7_15_dias: 32, faixa_mais_15_dias: 6 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-03-01", total_ajustes: 2397, faixa_ate_1_dia: 627, faixa_1_3_dias: 562, faixa_3_7_dias: 578, faixa_7_15_dias: 583, faixa_mais_15_dias: 47 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-03-01", total_ajustes: 433, faixa_ate_1_dia: 42, faixa_1_3_dias: 70, faixa_3_7_dias: 138, faixa_7_15_dias: 178, faixa_mais_15_dias: 5 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-03-01", total_ajustes: 257, faixa_ate_1_dia: 56, faixa_1_3_dias: 74, faixa_3_7_dias: 98, faixa_7_15_dias: 29, faixa_mais_15_dias: 0 },
];

export const composicaoAreaData: ComposicaoFaixaRecord[] = [
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-04-01", total_ajustes: 721, faixa_ate_1_dia: 109, faixa_1_3_dias: 93, faixa_3_7_dias: 160, faixa_7_15_dias: 185, faixa_mais_15_dias: 174 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-04-01", total_ajustes: 41, faixa_ate_1_dia: 9, faixa_1_3_dias: 1, faixa_3_7_dias: 13, faixa_7_15_dias: 8, faixa_mais_15_dias: 10 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-04-01", total_ajustes: 2, faixa_ate_1_dia: 2, faixa_1_3_dias: 0, faixa_3_7_dias: 0, faixa_7_15_dias: 0, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-05-01", total_ajustes: 726, faixa_ate_1_dia: 122, faixa_1_3_dias: 142, faixa_3_7_dias: 171, faixa_7_15_dias: 109, faixa_mais_15_dias: 182 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-05-01", total_ajustes: 5, faixa_ate_1_dia: 1, faixa_1_3_dias: 0, faixa_3_7_dias: 1, faixa_7_15_dias: 1, faixa_mais_15_dias: 2 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-05-01", total_ajustes: 5, faixa_ate_1_dia: 2, faixa_1_3_dias: 0, faixa_3_7_dias: 0, faixa_7_15_dias: 0, faixa_mais_15_dias: 3 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-06-01", total_ajustes: 751, faixa_ate_1_dia: 91, faixa_1_3_dias: 154, faixa_3_7_dias: 211, faixa_7_15_dias: 172, faixa_mais_15_dias: 123 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-06-01", total_ajustes: 24, faixa_ate_1_dia: 3, faixa_1_3_dias: 7, faixa_3_7_dias: 12, faixa_7_15_dias: 1, faixa_mais_15_dias: 1 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-06-01", total_ajustes: 15, faixa_ate_1_dia: 10, faixa_1_3_dias: 2, faixa_3_7_dias: 0, faixa_7_15_dias: 2, faixa_mais_15_dias: 1 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-07-01", total_ajustes: 783, faixa_ate_1_dia: 205, faixa_1_3_dias: 204, faixa_3_7_dias: 179, faixa_7_15_dias: 82, faixa_mais_15_dias: 113 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-07-01", total_ajustes: 89, faixa_ate_1_dia: 30, faixa_1_3_dias: 26, faixa_3_7_dias: 31, faixa_7_15_dias: 2, faixa_mais_15_dias: 0 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-07-01", total_ajustes: 17, faixa_ate_1_dia: 10, faixa_1_3_dias: 2, faixa_3_7_dias: 4, faixa_7_15_dias: 1, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-08-01", total_ajustes: 608, faixa_ate_1_dia: 176, faixa_1_3_dias: 157, faixa_3_7_dias: 139, faixa_7_15_dias: 114, faixa_mais_15_dias: 22 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-08-01", total_ajustes: 40, faixa_ate_1_dia: 17, faixa_1_3_dias: 7, faixa_3_7_dias: 4, faixa_7_15_dias: 7, faixa_mais_15_dias: 5 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-08-01", total_ajustes: 9, faixa_ate_1_dia: 4, faixa_1_3_dias: 5, faixa_3_7_dias: 0, faixa_7_15_dias: 0, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-09-01", total_ajustes: 621, faixa_ate_1_dia: 152, faixa_1_3_dias: 139, faixa_3_7_dias: 149, faixa_7_15_dias: 122, faixa_mais_15_dias: 59 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-09-01", total_ajustes: 293, faixa_ate_1_dia: 49, faixa_1_3_dias: 37, faixa_3_7_dias: 59, faixa_7_15_dias: 135, faixa_mais_15_dias: 13 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-09-01", total_ajustes: 79, faixa_ate_1_dia: 14, faixa_1_3_dias: 21, faixa_3_7_dias: 27, faixa_7_15_dias: 16, faixa_mais_15_dias: 1 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-10-01", total_ajustes: 856, faixa_ate_1_dia: 88, faixa_1_3_dias: 118, faixa_3_7_dias: 192, faixa_7_15_dias: 88, faixa_mais_15_dias: 370 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-10-01", total_ajustes: 575, faixa_ate_1_dia: 110, faixa_1_3_dias: 53, faixa_3_7_dias: 116, faixa_7_15_dias: 117, faixa_mais_15_dias: 179 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-10-01", total_ajustes: 85, faixa_ate_1_dia: 5, faixa_1_3_dias: 3, faixa_3_7_dias: 4, faixa_7_15_dias: 8, faixa_mais_15_dias: 65 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-11-01", total_ajustes: 1070, faixa_ate_1_dia: 116, faixa_1_3_dias: 149, faixa_3_7_dias: 275, faixa_7_15_dias: 347, faixa_mais_15_dias: 183 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-11-01", total_ajustes: 365, faixa_ate_1_dia: 89, faixa_1_3_dias: 59, faixa_3_7_dias: 37, faixa_7_15_dias: 88, faixa_mais_15_dias: 92 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-11-01", total_ajustes: 168, faixa_ate_1_dia: 21, faixa_1_3_dias: 20, faixa_3_7_dias: 44, faixa_7_15_dias: 37, faixa_mais_15_dias: 46 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-12-01", total_ajustes: 795, faixa_ate_1_dia: 134, faixa_1_3_dias: 165, faixa_3_7_dias: 235, faixa_7_15_dias: 183, faixa_mais_15_dias: 78 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-12-01", total_ajustes: 307, faixa_ate_1_dia: 126, faixa_1_3_dias: 85, faixa_3_7_dias: 61, faixa_7_15_dias: 29, faixa_mais_15_dias: 6 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-12-01", total_ajustes: 125, faixa_ate_1_dia: 16, faixa_1_3_dias: 20, faixa_3_7_dias: 12, faixa_7_15_dias: 20, faixa_mais_15_dias: 57 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2026-01-01", total_ajustes: 681, faixa_ate_1_dia: 98, faixa_1_3_dias: 186, faixa_3_7_dias: 275, faixa_7_15_dias: 99, faixa_mais_15_dias: 23 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2026-01-01", total_ajustes: 131, faixa_ate_1_dia: 49, faixa_1_3_dias: 58, faixa_3_7_dias: 17, faixa_7_15_dias: 5, faixa_mais_15_dias: 2 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2026-01-01", total_ajustes: 18, faixa_ate_1_dia: 0, faixa_1_3_dias: 3, faixa_3_7_dias: 9, faixa_7_15_dias: 5, faixa_mais_15_dias: 1 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2026-02-01", total_ajustes: 825, faixa_ate_1_dia: 104, faixa_1_3_dias: 166, faixa_3_7_dias: 256, faixa_7_15_dias: 157, faixa_mais_15_dias: 142 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2026-02-01", total_ajustes: 103, faixa_ate_1_dia: 35, faixa_1_3_dias: 48, faixa_3_7_dias: 14, faixa_7_15_dias: 6, faixa_mais_15_dias: 0 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2026-02-01", total_ajustes: 65, faixa_ate_1_dia: 12, faixa_1_3_dias: 10, faixa_3_7_dias: 34, faixa_7_15_dias: 9, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2026-03-01", total_ajustes: 709, faixa_ate_1_dia: 105, faixa_1_3_dias: 168, faixa_3_7_dias: 265, faixa_7_15_dias: 168, faixa_mais_15_dias: 3 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2026-03-01", total_ajustes: 77, faixa_ate_1_dia: 13, faixa_1_3_dias: 21, faixa_3_7_dias: 40, faixa_7_15_dias: 3, faixa_mais_15_dias: 0 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2026-03-01", total_ajustes: 31, faixa_ate_1_dia: 4, faixa_1_3_dias: 6, faixa_3_7_dias: 4, faixa_7_15_dias: 17, faixa_mais_15_dias: 0 },
];

/** Aggregate composição faixas by month, optionally filtering by entity name.
 *  groupBy selects the dataset; selectedName filters within it. */
export function aggregateComposicaoFaixas(selectedName: string | null, groupBy: "empresa" | "unidade" | "area" = "empresa"): { mes: string; ate1d: number; de1a3d: number; de3a7d: number; de7a15d: number; mais15d: number; total: number }[] {
  const source = groupBy === "unidade" ? composicaoUnidadeData : groupBy === "area" ? composicaoAreaData : composicaoEmpresaData;
  const filtered = selectedName
    ? source.filter(r => r.company_name === selectedName)
    : source;

  const byMonth = new Map<string, { ate1d: number; de1a3d: number; de3a7d: number; de7a15d: number; mais15d: number; total: number }>();

  for (const r of filtered) {
    const existing = byMonth.get(r.reference_month);
    if (existing) {
      existing.ate1d += r.faixa_ate_1_dia;
      existing.de1a3d += r.faixa_1_3_dias;
      existing.de3a7d += r.faixa_3_7_dias;
      existing.de7a15d += r.faixa_7_15_dias;
      existing.mais15d += r.faixa_mais_15_dias;
      existing.total += r.total_ajustes;
    } else {
      byMonth.set(r.reference_month, {
        ate1d: r.faixa_ate_1_dia,
        de1a3d: r.faixa_1_3_dias,
        de3a7d: r.faixa_3_7_dias,
        de7a15d: r.faixa_7_15_dias,
        mais15d: r.faixa_mais_15_dias,
        total: r.total_ajustes,
      });
    }
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, d]) => ({
      mes: formatMesLabel(month),
      ...d,
    }));
}

// ── Evolução da Qualidade por Empresa ──
export interface QualidadeEmpresaRecord {
  company_id: number;
  company_name: string;
  reference_month: string;
  total_marcacoes: number;
  registradas: number;
  justificadas: number;
  qualidade_percentual: number;
}

export const qualidadeEmpresaData: QualidadeEmpresaRecord[] = [
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-04-01", total_marcacoes: 753, registradas: 662, justificadas: 65, qualidade_percentual: 89.22 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-04-01", total_marcacoes: 1148, registradas: 413, justificadas: 523, qualidade_percentual: 40.18 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-04-01", total_marcacoes: 8194, registradas: 6931, justificadas: 654, qualidade_percentual: 87.83 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-05-01", total_marcacoes: 1177, registradas: 519, justificadas: 494, qualidade_percentual: 47.44 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-05-01", total_marcacoes: 8274, registradas: 6789, justificadas: 729, qualidade_percentual: 86.57 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-05-01", total_marcacoes: 729, registradas: 614, justificadas: 71, qualidade_percentual: 85.52 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-06-01", total_marcacoes: 631, registradas: 556, justificadas: 27, qualidade_percentual: 90.26 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-06-01", total_marcacoes: 8088, registradas: 6632, justificadas: 822, qualidade_percentual: 85.78 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-06-01", total_marcacoes: 1072, registradas: 561, justificadas: 421, qualidade_percentual: 54.57 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-07-01", total_marcacoes: 594, registradas: 517, justificadas: 46, qualidade_percentual: 87.63 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-07-01", total_marcacoes: 1038, registradas: 574, justificadas: 388, qualidade_percentual: 58.45 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-07-01", total_marcacoes: 8427, registradas: 6896, justificadas: 751, qualidade_percentual: 86.74 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-08-01", total_marcacoes: 771, registradas: 651, justificadas: 50, qualidade_percentual: 86.57 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-08-01", total_marcacoes: 1047, registradas: 586, justificadas: 381, qualidade_percentual: 59.07 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-08-01", total_marcacoes: 8625, registradas: 6974, justificadas: 628, qualidade_percentual: 87.20 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-09-01", total_marcacoes: 595, registradas: 545, justificadas: 20, qualidade_percentual: 95.28 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-09-01", total_marcacoes: 930, registradas: 550, justificadas: 316, qualidade_percentual: 61.45 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-09-01", total_marcacoes: 20891, registradas: 7475, justificadas: 7553, qualidade_percentual: 39.15 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-10-01", total_marcacoes: 645, registradas: 556, justificadas: 68, qualidade_percentual: 86.60 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-10-01", total_marcacoes: 28778, registradas: 14217, justificadas: 6281, qualidade_percentual: 64.91 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-10-01", total_marcacoes: 1014, registradas: 443, justificadas: 404, qualidade_percentual: 48.90 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-11-01", total_marcacoes: 24143, registradas: 14886, justificadas: 4043, qualidade_percentual: 74.43 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-11-01", total_marcacoes: 1098, registradas: 413, justificadas: 483, qualidade_percentual: 40.73 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-11-01", total_marcacoes: 620, registradas: 502, justificadas: 52, qualidade_percentual: 85.96 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-12-01", total_marcacoes: 26171, registradas: 16331, justificadas: 2383, qualidade_percentual: 82.68 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-12-01", total_marcacoes: 1388, registradas: 475, justificadas: 652, qualidade_percentual: 36.59 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-12-01", total_marcacoes: 677, registradas: 572, justificadas: 51, qualidade_percentual: 87.06 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-01-01", total_marcacoes: 23169, registradas: 17027, justificadas: 1793, qualidade_percentual: 86.14 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-01-01", total_marcacoes: 1369, registradas: 483, justificadas: 651, qualidade_percentual: 39.20 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-01-01", total_marcacoes: 689, registradas: 615, justificadas: 36, qualidade_percentual: 90.18 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-02-01", total_marcacoes: 22178, registradas: 16117, justificadas: 1938, qualidade_percentual: 86.66 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-02-01", total_marcacoes: 1257, registradas: 504, justificadas: 457, qualidade_percentual: 48.74 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-02-01", total_marcacoes: 602, registradas: 540, justificadas: 51, qualidade_percentual: 90.00 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-03-01", total_marcacoes: 25795, registradas: 21053, justificadas: 1462, qualidade_percentual: 91.90 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-03-01", total_marcacoes: 1175, registradas: 530, justificadas: 240, qualidade_percentual: 65.11 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-03-01", total_marcacoes: 696, registradas: 571, justificadas: 56, qualidade_percentual: 83.48 },
];

export interface QualidadeUnidadeRecord {
  business_unit_id: number;
  business_unit_name: string;
  reference_month: string;
  total_marcacoes: number;
  registradas: number;
  justificadas: number;
  qualidade_percentual: number;
}

export const qualidadeUnidadeData: QualidadeUnidadeRecord[] = [
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-04-01", total_marcacoes: 3520, registradas: 1894, justificadas: 1208, qualidade_percentual: 61.06 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-04-01", total_marcacoes: 14934, registradas: 12540, justificadas: 1202, qualidade_percentual: 91.25 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-04-01", total_marcacoes: 4441, registradas: 3658, justificadas: 321, qualidade_percentual: 91.93 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-05-01", total_marcacoes: 7665, registradas: 6308, justificadas: 810, qualidade_percentual: 88.62 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-06-01", total_marcacoes: 1117, registradas: 679, justificadas: 391, qualidade_percentual: 63.46 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-06-01", total_marcacoes: 8016, registradas: 6525, justificadas: 782, qualidade_percentual: 89.30 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-07-01", total_marcacoes: 1275, registradas: 669, justificadas: 529, qualidade_percentual: 55.84 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-07-01", total_marcacoes: 7872, registradas: 6575, justificadas: 549, qualidade_percentual: 92.29 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-07-01", total_marcacoes: 1337, registradas: 967, justificadas: 129, qualidade_percentual: 88.23 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-08-01", total_marcacoes: 1072, registradas: 699, justificadas: 262, qualidade_percentual: 72.74 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-08-01", total_marcacoes: 42314, registradas: 20581, justificadas: 11455, qualidade_percentual: 64.24 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-08-01", total_marcacoes: 1329, registradas: 935, justificadas: 153, qualidade_percentual: 85.94 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-09-01", total_marcacoes: 1192, registradas: 670, justificadas: 420, qualidade_percentual: 61.47 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-09-01", total_marcacoes: 52101, registradas: 30337, justificadas: 7634, qualidade_percentual: 79.90 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-09-01", total_marcacoes: 2627, registradas: 1661, justificadas: 324, qualidade_percentual: 83.68 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-10-01", total_marcacoes: 1397, registradas: 541, justificadas: 680, qualidade_percentual: 44.31 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-11-01", total_marcacoes: 1987, registradas: 671, justificadas: 967, qualidade_percentual: 40.96 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-11-01", total_marcacoes: 22457, registradas: 16419, justificadas: 1389, qualidade_percentual: 92.20 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-11-01", total_marcacoes: 1343, registradas: 881, justificadas: 195, qualidade_percentual: 81.88 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-12-01", total_marcacoes: 1603, registradas: 661, justificadas: 785, qualidade_percentual: 45.71 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-12-01", total_marcacoes: 22323, registradas: 15714, justificadas: 1913, qualidade_percentual: 89.15 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-12-01", total_marcacoes: 1331, registradas: 1020, justificadas: 89, qualidade_percentual: 91.97 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-01-01", total_marcacoes: 1395, registradas: 616, justificadas: 567, qualidade_percentual: 52.07 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-01-01", total_marcacoes: 25252, registradas: 20486, justificadas: 1477, qualidade_percentual: 93.28 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-01-01", total_marcacoes: 1156, registradas: 857, justificadas: 112, qualidade_percentual: 88.44 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-02-01", total_marcacoes: 1717, registradas: 714, justificadas: 445, qualidade_percentual: 61.60 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-02-01", total_marcacoes: 1384, registradas: 946, justificadas: 147, qualidade_percentual: 86.55 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-03-01", total_marcacoes: 15, registradas: 9, justificadas: 0, qualidade_percentual: 100.00 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-03-01", total_marcacoes: 239, registradas: 42, justificadas: 95, qualidade_percentual: 30.66 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-03-01", total_marcacoes: 37, registradas: 5, justificadas: 10, qualidade_percentual: 33.33 },
];

export interface QualidadeAreaRecord {
  area_id: number;
  area_name: string;
  reference_month: string;
  total_marcacoes: number;
  registradas: number;
  justificadas: number;
  qualidade_percentual: number;
}

export const qualidadeAreaData: QualidadeAreaRecord[] = [
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-04-01", total_marcacoes: 536, registradas: 491, justificadas: 38, qualidade_percentual: 92.29 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-04-01", total_marcacoes: 132, registradas: 126, justificadas: 2, qualidade_percentual: 96.92 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-04-01", total_marcacoes: 2766, registradas: 1842, justificadas: 627, qualidade_percentual: 70.14 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-05-01", total_marcacoes: 2749, registradas: 1857, justificadas: 596, qualidade_percentual: 71.26 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-05-01", total_marcacoes: 428, registradas: 422, justificadas: 3, qualidade_percentual: 99.06 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-05-01", total_marcacoes: 125, registradas: 119, justificadas: 5, qualidade_percentual: 95.20 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-06-01", total_marcacoes: 2474, registradas: 1572, justificadas: 628, qualidade_percentual: 67.01 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-06-01", total_marcacoes: 346, registradas: 301, justificadas: 8, qualidade_percentual: 91.21 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-06-01", total_marcacoes: 107, registradas: 91, justificadas: 10, qualidade_percentual: 89.22 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-07-01", total_marcacoes: 453, registradas: 320, justificadas: 34, qualidade_percentual: 80.81 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-07-01", total_marcacoes: 158, registradas: 141, justificadas: 9, qualidade_percentual: 94.00 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-07-01", total_marcacoes: 2655, registradas: 1744, justificadas: 590, qualidade_percentual: 71.10 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-08-01", total_marcacoes: 2652, registradas: 1793, justificadas: 445, qualidade_percentual: 75.15 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-08-01", total_marcacoes: 501, registradas: 420, justificadas: 27, qualidade_percentual: 86.07 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-08-01", total_marcacoes: 168, registradas: 157, justificadas: 5, qualidade_percentual: 95.73 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-09-01", total_marcacoes: 2594, registradas: 1808, justificadas: 456, qualidade_percentual: 77.10 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-09-01", total_marcacoes: 492, registradas: 403, justificadas: 42, qualidade_percentual: 88.57 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-09-01", total_marcacoes: 674, registradas: 172, justificadas: 252, qualidade_percentual: 27.22 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-10-01", total_marcacoes: 1124, registradas: 420, justificadas: 305, qualidade_percentual: 50.54 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-10-01", total_marcacoes: 494, registradas: 351, justificadas: 23, qualidade_percentual: 81.25 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-10-01", total_marcacoes: 2932, registradas: 1763, justificadas: 554, qualidade_percentual: 68.02 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-11-01", total_marcacoes: 2849, registradas: 1494, justificadas: 664, qualidade_percentual: 62.75 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-11-01", total_marcacoes: 521, registradas: 320, justificadas: 54, qualidade_percentual: 79.60 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-11-01", total_marcacoes: 733, registradas: 256, justificadas: 200, qualidade_percentual: 45.07 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-12-01", total_marcacoes: 856, registradas: 394, justificadas: 51, qualidade_percentual: 70.61 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-12-01", total_marcacoes: 2856, registradas: 1759, justificadas: 573, qualidade_percentual: 68.63 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-12-01", total_marcacoes: 530, registradas: 396, justificadas: 57, qualidade_percentual: 86.09 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2026-01-01", total_marcacoes: 2733, registradas: 1850, justificadas: 529, qualidade_percentual: 73.38 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2026-01-01", total_marcacoes: 499, registradas: 458, justificadas: 9, qualidade_percentual: 93.47 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2026-01-01", total_marcacoes: 816, registradas: 613, justificadas: 38, qualidade_percentual: 86.83 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2026-02-01", total_marcacoes: 2777, registradas: 1723, justificadas: 568, qualidade_percentual: 71.20 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2026-02-01", total_marcacoes: 432, registradas: 364, justificadas: 28, qualidade_percentual: 92.39 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2026-02-01", total_marcacoes: 722, registradas: 616, justificadas: 21, qualidade_percentual: 96.25 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2026-03-01", total_marcacoes: 2985, registradas: 1902, justificadas: 422, qualidade_percentual: 77.00 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2026-03-01", total_marcacoes: 502, registradas: 389, justificadas: 23, qualidade_percentual: 86.83 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2026-03-01", total_marcacoes: 866, registradas: 827, justificadas: 4, qualidade_percentual: 99.52 },
];

/** Aggregate quality evolution by month, optionally filtering by entity name.
 *  Uses quality_percentage directly (weighted by volume) for empresa groupBy,
 *  and registradas/(registradas+justificadas) for other groupings. */
export function aggregateQualidadeEvolucao(selectedName: string | null, groupBy: "empresa" | "unidade" | "area" = "empresa"): { mes: string; value: number }[] {
  if (groupBy === "empresa") {
    const filtered = selectedName
      ? qualidadeEmpresaData.filter(r => r.company_name === selectedName)
      : qualidadeEmpresaData;

    const byMonth = new Map<string, { qualWeighted: number; volume: number }>();
    for (const r of filtered) {
      const existing = byMonth.get(r.reference_month);
      if (existing) {
        existing.qualWeighted += r.qualidade_percentual * r.total_marcacoes;
        existing.volume += r.total_marcacoes;
      } else {
        byMonth.set(r.reference_month, { qualWeighted: r.qualidade_percentual * r.total_marcacoes, volume: r.total_marcacoes });
      }
    }

    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, d]) => ({
        mes: formatMesLabel(month),
        value: d.volume > 0 ? +((d.qualWeighted / d.volume)).toFixed(2) : 0,
      }));
  }

  // For unidade/area, keep existing logic
  type QRow = { name: string; reference_month: string; registradas: number; justificadas: number };
  let rows: QRow[];

  if (groupBy === "unidade") {
    rows = qualidadeUnidadeData.map(r => ({ name: r.business_unit_name, reference_month: r.reference_month, registradas: r.registradas, justificadas: r.justificadas }));
  } else {
    rows = qualidadeAreaData.map(r => ({ name: r.area_name, reference_month: r.reference_month, registradas: r.registradas, justificadas: r.justificadas }));
  }

  const filtered = selectedName ? rows.filter(r => r.name === selectedName) : rows;
  const byMonth = new Map<string, { reg: number; just: number }>();

  for (const r of filtered) {
    const existing = byMonth.get(r.reference_month);
    if (existing) { existing.reg += r.registradas; existing.just += r.justificadas; }
    else { byMonth.set(r.reference_month, { reg: r.registradas, just: r.justificadas }); }
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, d]) => ({
      mes: formatMesLabel(month),
      value: d.reg + d.just > 0 ? +((d.reg / (d.reg + d.just)) * 100).toFixed(2) : 0,
    }));
}

/** Same aggregation but returns raw registradas + justificadas counts per month */
export function aggregateQualidadeEvolucaoDetalhado(selectedName: string | null, groupBy: "empresa" | "unidade" | "area" = "empresa"): { mes: string; registradas: number; justificadas: number }[] {
  type QRow = { name: string; reference_month: string; registradas: number; justificadas: number };
  let rows: QRow[];

  if (groupBy === "unidade") {
    rows = qualidadeUnidadeData.map(r => ({ name: r.business_unit_name, reference_month: r.reference_month, registradas: r.registradas, justificadas: r.justificadas }));
  } else if (groupBy === "area") {
    rows = qualidadeAreaData.map(r => ({ name: r.area_name, reference_month: r.reference_month, registradas: r.registradas, justificadas: r.justificadas }));
  } else {
    rows = qualidadeEmpresaData.map(r => ({ name: r.company_name, reference_month: r.reference_month, registradas: r.registradas, justificadas: r.justificadas }));
  }

  const filtered = selectedName ? rows.filter(r => r.name === selectedName) : rows;
  const byMonth = new Map<string, { reg: number; just: number }>();

  for (const r of filtered) {
    const existing = byMonth.get(r.reference_month);
    if (existing) { existing.reg += r.registradas; existing.just += r.justificadas; }
    else { byMonth.set(r.reference_month, { reg: r.registradas, just: r.justificadas }); }
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, d]) => ({ mes: formatMesLabel(month), registradas: d.reg, justificadas: d.just }));
}

// ══════════════════════════════════════════════════════════════
// Qualidade vs Volume – scatter data (from real clocking JSON)
// ══════════════════════════════════════════════════════════════

export interface QualidadeVolumeRecord {
  company_id: number;
  company_name: string;
  reference_month: string;
  clocking_count: number;
  quality_percentage: number;
  headcount: number;
}

export const qualidadeVolumeEmpresaData: QualidadeVolumeRecord[] = [
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-04-01", clocking_count: 8194, quality_percentage: 87.83, headcount: 207 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-04-01", clocking_count: 1148, quality_percentage: 40.18, headcount: 21 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-04-01", clocking_count: 753, quality_percentage: 89.22, headcount: 12 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-05-01", clocking_count: 8274, quality_percentage: 86.57, headcount: 206 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-05-01", clocking_count: 1177, quality_percentage: 47.44, headcount: 19 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-05-01", clocking_count: 729, quality_percentage: 85.52, headcount: 12 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-06-01", clocking_count: 8088, quality_percentage: 85.78, headcount: 210 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-06-01", clocking_count: 1072, quality_percentage: 54.57, headcount: 16 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-06-01", clocking_count: 631, quality_percentage: 90.26, headcount: 11 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-07-01", clocking_count: 8427, quality_percentage: 86.74, headcount: 216 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-07-01", clocking_count: 1038, quality_percentage: 58.45, headcount: 17 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-07-01", clocking_count: 594, quality_percentage: 87.63, headcount: 12 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-08-01", clocking_count: 8625, quality_percentage: 87.20, headcount: 211 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-08-01", clocking_count: 1047, quality_percentage: 59.07, headcount: 17 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-08-01", clocking_count: 771, quality_percentage: 86.57, headcount: 13 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-09-01", clocking_count: 20891, quality_percentage: 39.15, headcount: 392 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-09-01", clocking_count: 930, quality_percentage: 61.45, headcount: 16 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-09-01", clocking_count: 595, quality_percentage: 95.28, headcount: 10 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-10-01", clocking_count: 28778, quality_percentage: 64.91, headcount: 412 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-10-01", clocking_count: 1014, quality_percentage: 48.90, headcount: 16 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-10-01", clocking_count: 645, quality_percentage: 86.60, headcount: 12 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-11-01", clocking_count: 24143, quality_percentage: 74.43, headcount: 387 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-11-01", clocking_count: 1098, quality_percentage: 40.73, headcount: 21 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-11-01", clocking_count: 620, quality_percentage: 85.96, headcount: 10 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-12-01", clocking_count: 26171, quality_percentage: 82.68, headcount: 395 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-12-01", clocking_count: 1388, quality_percentage: 36.59, headcount: 22 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-12-01", clocking_count: 677, quality_percentage: 87.06, headcount: 11 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-01-01", clocking_count: 23169, quality_percentage: 86.14, headcount: 398 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-01-01", clocking_count: 1369, quality_percentage: 39.20, headcount: 21 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-01-01", clocking_count: 689, quality_percentage: 90.18, headcount: 11 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-02-01", clocking_count: 22178, quality_percentage: 86.66, headcount: 404 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-02-01", clocking_count: 1257, quality_percentage: 48.74, headcount: 21 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-02-01", clocking_count: 602, quality_percentage: 90.00, headcount: 11 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-03-01", clocking_count: 25795, quality_percentage: 91.90, headcount: 404 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-03-01", clocking_count: 1175, quality_percentage: 65.11, headcount: 19 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-03-01", clocking_count: 696, quality_percentage: 83.48, headcount: 12 },
];

export interface QualidadeVolumeScatterPoint {
  regional: string;
  volume: number;
  qualidade: number;
  headcount: number;
}

/**
 * Aggregate qualidade vs volume scatter data.
 * quality_percentage = % de marcações registradas (qualidade boa).
 * Groups by company_name, sums clocking_count (volume),
 * computes weighted average quality_percentage, and takes max headcount.
 */
export function aggregateQualidadeVolume(
  selectedMonth: string | null = null
): QualidadeVolumeScatterPoint[] {
  const filtered = selectedMonth
    ? qualidadeVolumeEmpresaData.filter(r => r.reference_month === selectedMonth)
    : qualidadeVolumeEmpresaData;

  const map = new Map<string, { volume: number; qualWeighted: number; headcount: number }>();

  for (const r of filtered) {
    const existing = map.get(r.company_name);
    if (existing) {
      existing.qualWeighted += r.quality_percentage * r.clocking_count;
      existing.volume += r.clocking_count;
      existing.headcount = Math.max(existing.headcount, r.headcount);
    } else {
      map.set(r.company_name, {
        volume: r.clocking_count,
        qualWeighted: r.quality_percentage * r.clocking_count,
        headcount: r.headcount,
      });
    }
  }

  return Array.from(map.entries()).map(([name, d]) => ({
    regional: name,
    volume: d.volume,
    qualidade: +(d.qualWeighted / d.volume).toFixed(2),
    headcount: d.headcount,
  }));
}
