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
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-04-01", total_ajustes: 761, faixa_ate_1_dia: 395, faixa_1_3_dias: 133, faixa_3_7_dias: 118, faixa_7_15_dias: 100, faixa_mais_15_dias: 15 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-04-01", total_ajustes: 394, faixa_ate_1_dia: 58, faixa_1_3_dias: 76, faixa_3_7_dias: 129, faixa_7_15_dias: 118, faixa_mais_15_dias: 13 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-04-01", total_ajustes: 60, faixa_ate_1_dia: 24, faixa_1_3_dias: 13, faixa_3_7_dias: 21, faixa_7_15_dias: 1, faixa_mais_15_dias: 1 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-05-01", total_ajustes: 1008, faixa_ate_1_dia: 512, faixa_1_3_dias: 158, faixa_3_7_dias: 132, faixa_7_15_dias: 83, faixa_mais_15_dias: 123 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-05-01", total_ajustes: 473, faixa_ate_1_dia: 58, faixa_1_3_dias: 56, faixa_3_7_dias: 86, faixa_7_15_dias: 125, faixa_mais_15_dias: 148 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-05-01", total_ajustes: 84, faixa_ate_1_dia: 27, faixa_1_3_dias: 25, faixa_3_7_dias: 15, faixa_7_15_dias: 11, faixa_mais_15_dias: 6 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-06-01", total_ajustes: 1111, faixa_ate_1_dia: 355, faixa_1_3_dias: 217, faixa_3_7_dias: 215, faixa_7_15_dias: 135, faixa_mais_15_dias: 189 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-06-01", total_ajustes: 512, faixa_ate_1_dia: 21, faixa_1_3_dias: 54, faixa_3_7_dias: 85, faixa_7_15_dias: 126, faixa_mais_15_dias: 226 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-06-01", total_ajustes: 42, faixa_ate_1_dia: 6, faixa_1_3_dias: 10, faixa_3_7_dias: 16, faixa_7_15_dias: 5, faixa_mais_15_dias: 5 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-07-01", total_ajustes: 1333, faixa_ate_1_dia: 527, faixa_1_3_dias: 272, faixa_3_7_dias: 165, faixa_7_15_dias: 148, faixa_mais_15_dias: 221 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-07-01", total_ajustes: 444, faixa_ate_1_dia: 65, faixa_1_3_dias: 87, faixa_3_7_dias: 102, faixa_7_15_dias: 94, faixa_mais_15_dias: 96 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-07-01", total_ajustes: 52, faixa_ate_1_dia: 19, faixa_1_3_dias: 14, faixa_3_7_dias: 3, faixa_7_15_dias: 3, faixa_mais_15_dias: 13 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-08-01", total_ajustes: 1075, faixa_ate_1_dia: 575, faixa_1_3_dias: 276, faixa_3_7_dias: 124, faixa_7_15_dias: 69, faixa_mais_15_dias: 31 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-08-01", total_ajustes: 568, faixa_ate_1_dia: 60, faixa_1_3_dias: 81, faixa_3_7_dias: 121, faixa_7_15_dias: 131, faixa_mais_15_dias: 175 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-08-01", total_ajustes: 71, faixa_ate_1_dia: 27, faixa_1_3_dias: 23, faixa_3_7_dias: 14, faixa_7_15_dias: 2, faixa_mais_15_dias: 5 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-09-01", total_ajustes: 2216, faixa_ate_1_dia: 869, faixa_1_3_dias: 862, faixa_3_7_dias: 320, faixa_7_15_dias: 153, faixa_mais_15_dias: 12 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-09-01", total_ajustes: 251, faixa_ate_1_dia: 56, faixa_1_3_dias: 84, faixa_3_7_dias: 72, faixa_7_15_dias: 35, faixa_mais_15_dias: 4 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-09-01", total_ajustes: 40, faixa_ate_1_dia: 10, faixa_1_3_dias: 8, faixa_3_7_dias: 13, faixa_7_15_dias: 8, faixa_mais_15_dias: 1 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-10-01", total_ajustes: 14676, faixa_ate_1_dia: 2385, faixa_1_3_dias: 1998, faixa_3_7_dias: 3415, faixa_7_15_dias: 6175, faixa_mais_15_dias: 703 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-10-01", total_ajustes: 427, faixa_ate_1_dia: 42, faixa_1_3_dias: 84, faixa_3_7_dias: 123, faixa_7_15_dias: 111, faixa_mais_15_dias: 67 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-10-01", total_ajustes: 62, faixa_ate_1_dia: 10, faixa_1_3_dias: 9, faixa_3_7_dias: 21, faixa_7_15_dias: 18, faixa_mais_15_dias: 4 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-11-01", total_ajustes: 12346, faixa_ate_1_dia: 2211, faixa_1_3_dias: 1865, faixa_3_7_dias: 1612, faixa_7_15_dias: 2162, faixa_mais_15_dias: 4496 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-11-01", total_ajustes: 648, faixa_ate_1_dia: 33, faixa_1_3_dias: 57, faixa_3_7_dias: 121, faixa_7_15_dias: 179, faixa_mais_15_dias: 258 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-11-01", total_ajustes: 78, faixa_ate_1_dia: 16, faixa_1_3_dias: 12, faixa_3_7_dias: 13, faixa_7_15_dias: 24, faixa_mais_15_dias: 13 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-12-01", total_ajustes: 7941, faixa_ate_1_dia: 2875, faixa_1_3_dias: 2279, faixa_3_7_dias: 1802, faixa_7_15_dias: 593, faixa_mais_15_dias: 392 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-12-01", total_ajustes: 794, faixa_ate_1_dia: 156, faixa_1_3_dias: 213, faixa_3_7_dias: 189, faixa_7_15_dias: 176, faixa_mais_15_dias: 60 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-12-01", total_ajustes: 81, faixa_ate_1_dia: 22, faixa_1_3_dias: 17, faixa_3_7_dias: 14, faixa_7_15_dias: 25, faixa_mais_15_dias: 3 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-01-01", total_ajustes: 5031, faixa_ate_1_dia: 1046, faixa_1_3_dias: 1523, faixa_3_7_dias: 1735, faixa_7_15_dias: 502, faixa_mais_15_dias: 225 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-01-01", total_ajustes: 668, faixa_ate_1_dia: 120, faixa_1_3_dias: 221, faixa_3_7_dias: 295, faixa_7_15_dias: 30, faixa_mais_15_dias: 2 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-01-01", total_ajustes: 40, faixa_ate_1_dia: 4, faixa_1_3_dias: 10, faixa_3_7_dias: 21, faixa_7_15_dias: 2, faixa_mais_15_dias: 3 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-02-01", total_ajustes: 5526, faixa_ate_1_dia: 1597, faixa_1_3_dias: 1867, faixa_3_7_dias: 908, faixa_7_15_dias: 643, faixa_mais_15_dias: 511 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-02-01", total_ajustes: 661, faixa_ate_1_dia: 92, faixa_1_3_dias: 171, faixa_3_7_dias: 262, faixa_7_15_dias: 91, faixa_mais_15_dias: 45 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-02-01", total_ajustes: 59, faixa_ate_1_dia: 10, faixa_1_3_dias: 19, faixa_3_7_dias: 20, faixa_7_15_dias: 9, faixa_mais_15_dias: 1 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-03-01", total_ajustes: 3031, faixa_ate_1_dia: 685, faixa_1_3_dias: 629, faixa_3_7_dias: 730, faixa_7_15_dias: 685, faixa_mais_15_dias: 302 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-03-01", total_ajustes: 561, faixa_ate_1_dia: 41, faixa_1_3_dias: 68, faixa_3_7_dias: 115, faixa_7_15_dias: 181, faixa_mais_15_dias: 156 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-03-01", total_ajustes: 69, faixa_ate_1_dia: 20, faixa_1_3_dias: 13, faixa_3_7_dias: 25, faixa_7_15_dias: 8, faixa_mais_15_dias: 3 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-04-01", total_ajustes: 169, faixa_ate_1_dia: 15, faixa_1_3_dias: 22, faixa_3_7_dias: 23, faixa_7_15_dias: 65, faixa_mais_15_dias: 44 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-04-01", total_ajustes: 4, faixa_ate_1_dia: 0, faixa_1_3_dias: 0, faixa_3_7_dias: 1, faixa_7_15_dias: 3, faixa_mais_15_dias: 0 },
];

export const composicaoUnidadeData: ComposicaoFaixaRecord[] = [
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-04-01", total_ajustes: 717, faixa_ate_1_dia: 381, faixa_1_3_dias: 128, faixa_3_7_dias: 110, faixa_7_15_dias: 94, faixa_mais_15_dias: 4 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-04-01", total_ajustes: 420, faixa_ate_1_dia: 67, faixa_1_3_dias: 85, faixa_3_7_dias: 137, faixa_7_15_dias: 117, faixa_mais_15_dias: 14 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-04-01", total_ajustes: 78, faixa_ate_1_dia: 29, faixa_1_3_dias: 9, faixa_3_7_dias: 21, faixa_7_15_dias: 8, faixa_mais_15_dias: 11 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-05-01", total_ajustes: 988, faixa_ate_1_dia: 507, faixa_1_3_dias: 157, faixa_3_7_dias: 103, faixa_7_15_dias: 100, faixa_mais_15_dias: 121 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-05-01", total_ajustes: 424, faixa_ate_1_dia: 61, faixa_1_3_dias: 55, faixa_3_7_dias: 70, faixa_7_15_dias: 105, faixa_mais_15_dias: 133 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-05-01", total_ajustes: 153, faixa_ate_1_dia: 29, faixa_1_3_dias: 27, faixa_3_7_dias: 60, faixa_7_15_dias: 14, faixa_mais_15_dias: 23 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-06-01", total_ajustes: 1062, faixa_ate_1_dia: 335, faixa_1_3_dias: 194, faixa_3_7_dias: 188, faixa_7_15_dias: 149, faixa_mais_15_dias: 196 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-06-01", total_ajustes: 453, faixa_ate_1_dia: 19, faixa_1_3_dias: 44, faixa_3_7_dias: 75, faixa_7_15_dias: 104, faixa_mais_15_dias: 211 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-06-01", total_ajustes: 150, faixa_ate_1_dia: 28, faixa_1_3_dias: 43, faixa_3_7_dias: 53, faixa_7_15_dias: 13, faixa_mais_15_dias: 13 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-07-01", total_ajustes: 1191, faixa_ate_1_dia: 482, faixa_1_3_dias: 236, faixa_3_7_dias: 112, faixa_7_15_dias: 151, faixa_mais_15_dias: 210 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-07-01", total_ajustes: 408, faixa_ate_1_dia: 61, faixa_1_3_dias: 74, faixa_3_7_dias: 98, faixa_7_15_dias: 83, faixa_mais_15_dias: 92 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-07-01", total_ajustes: 230, faixa_ate_1_dia: 68, faixa_1_3_dias: 63, faixa_3_7_dias: 60, faixa_7_15_dias: 11, faixa_mais_15_dias: 28 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-08-01", total_ajustes: 866, faixa_ate_1_dia: 477, faixa_1_3_dias: 222, faixa_3_7_dias: 94, faixa_7_15_dias: 49, faixa_mais_15_dias: 24 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-08-01", total_ajustes: 586, faixa_ate_1_dia: 68, faixa_1_3_dias: 87, faixa_3_7_dias: 123, faixa_7_15_dias: 131, faixa_mais_15_dias: 177 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-08-01", total_ajustes: 262, faixa_ate_1_dia: 117, faixa_1_3_dias: 71, faixa_3_7_dias: 42, faixa_7_15_dias: 22, faixa_mais_15_dias: 10 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-09-01", total_ajustes: 1860, faixa_ate_1_dia: 763, faixa_1_3_dias: 785, faixa_3_7_dias: 221, faixa_7_15_dias: 82, faixa_mais_15_dias: 9 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-09-01", total_ajustes: 346, faixa_ate_1_dia: 106, faixa_1_3_dias: 74, faixa_3_7_dias: 98, faixa_7_15_dias: 64, faixa_mais_15_dias: 4 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-09-01", total_ajustes: 301, faixa_ate_1_dia: 66, faixa_1_3_dias: 95, faixa_3_7_dias: 86, faixa_7_15_dias: 50, faixa_mais_15_dias: 4 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-10-01", total_ajustes: 14430, faixa_ate_1_dia: 2355, faixa_1_3_dias: 1925, faixa_3_7_dias: 3327, faixa_7_15_dias: 6121, faixa_mais_15_dias: 702 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-10-01", total_ajustes: 447, faixa_ate_1_dia: 44, faixa_1_3_dias: 88, faixa_3_7_dias: 136, faixa_7_15_dias: 112, faixa_mais_15_dias: 67 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-10-01", total_ajustes: 288, faixa_ate_1_dia: 38, faixa_1_3_dias: 78, faixa_3_7_dias: 96, faixa_7_15_dias: 71, faixa_mais_15_dias: 5 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-11-01", total_ajustes: 11807, faixa_ate_1_dia: 2140, faixa_1_3_dias: 1776, faixa_3_7_dias: 1456, faixa_7_15_dias: 1983, faixa_mais_15_dias: 4452 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-11-01", total_ajustes: 757, faixa_ate_1_dia: 76, faixa_1_3_dias: 88, faixa_3_7_dias: 175, faixa_7_15_dias: 243, faixa_mais_15_dias: 175 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-11-01", total_ajustes: 508, faixa_ate_1_dia: 44, faixa_1_3_dias: 70, faixa_3_7_dias: 115, faixa_7_15_dias: 139, faixa_mais_15_dias: 140 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-12-01", total_ajustes: 7383, faixa_ate_1_dia: 2783, faixa_1_3_dias: 2159, faixa_3_7_dias: 1635, faixa_7_15_dias: 478, faixa_mais_15_dias: 328 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-12-01", total_ajustes: 1124, faixa_ate_1_dia: 209, faixa_1_3_dias: 296, faixa_3_7_dias: 302, faixa_7_15_dias: 249, faixa_mais_15_dias: 68 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-12-01", total_ajustes: 309, faixa_ate_1_dia: 61, faixa_1_3_dias: 54, faixa_3_7_dias: 68, faixa_7_15_dias: 67, faixa_mais_15_dias: 59 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-01-01", total_ajustes: 4701, faixa_ate_1_dia: 1010, faixa_1_3_dias: 1466, faixa_3_7_dias: 1632, faixa_7_15_dias: 438, faixa_mais_15_dias: 155 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-01-01", total_ajustes: 886, faixa_ate_1_dia: 143, faixa_1_3_dias: 271, faixa_3_7_dias: 383, faixa_7_15_dias: 76, faixa_mais_15_dias: 13 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-01-01", total_ajustes: 152, faixa_ate_1_dia: 17, faixa_1_3_dias: 17, faixa_3_7_dias: 36, faixa_7_15_dias: 20, faixa_mais_15_dias: 62 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-02-01", total_ajustes: 5371, faixa_ate_1_dia: 1565, faixa_1_3_dias: 1859, faixa_3_7_dias: 831, faixa_7_15_dias: 609, faixa_mais_15_dias: 507 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-02-01", total_ajustes: 692, faixa_ate_1_dia: 103, faixa_1_3_dias: 160, faixa_3_7_dias: 270, faixa_7_15_dias: 110, faixa_mais_15_dias: 49 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-02-01", total_ajustes: 183, faixa_ate_1_dia: 31, faixa_1_3_dias: 38, faixa_3_7_dias: 89, faixa_7_15_dias: 24, faixa_mais_15_dias: 1 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-03-01", total_ajustes: 2766, faixa_ate_1_dia: 647, faixa_1_3_dias: 570, faixa_3_7_dias: 634, faixa_7_15_dias: 647, faixa_mais_15_dias: 268 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-03-01", total_ajustes: 623, faixa_ate_1_dia: 43, faixa_1_3_dias: 70, faixa_3_7_dias: 138, faixa_7_15_dias: 185, faixa_mais_15_dias: 187 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-03-01", total_ajustes: 272, faixa_ate_1_dia: 56, faixa_1_3_dias: 70, faixa_3_7_dias: 98, faixa_7_15_dias: 42, faixa_mais_15_dias: 6 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-04-01", total_ajustes: 155, faixa_ate_1_dia: 15, faixa_1_3_dias: 18, faixa_3_7_dias: 17, faixa_7_15_dias: 61, faixa_mais_15_dias: 44 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-04-01", total_ajustes: 18, faixa_ate_1_dia: 0, faixa_1_3_dias: 4, faixa_3_7_dias: 7, faixa_7_15_dias: 7, faixa_mais_15_dias: 0 },
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
