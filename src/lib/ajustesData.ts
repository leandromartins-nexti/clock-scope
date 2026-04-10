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
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-04-01", total_ajustes: 654, faixa_ate_1_dia: 247, faixa_1_3_dias: 104, faixa_3_7_dias: 99, faixa_7_15_dias: 88, faixa_mais_15_dias: 116 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-04-01", total_ajustes: 523, faixa_ate_1_dia: 53, faixa_1_3_dias: 71, faixa_3_7_dias: 119, faixa_7_15_dias: 126, faixa_mais_15_dias: 154 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-04-01", total_ajustes: 65, faixa_ate_1_dia: 23, faixa_1_3_dias: 13, faixa_3_7_dias: 16, faixa_7_15_dias: 3, faixa_mais_15_dias: 10 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-05-01", total_ajustes: 729, faixa_ate_1_dia: 314, faixa_1_3_dias: 110, faixa_3_7_dias: 75, faixa_7_15_dias: 69, faixa_mais_15_dias: 161 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-05-01", total_ajustes: 494, faixa_ate_1_dia: 49, faixa_1_3_dias: 53, faixa_3_7_dias: 82, faixa_7_15_dias: 100, faixa_mais_15_dias: 210 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-05-01", total_ajustes: 71, faixa_ate_1_dia: 24, faixa_1_3_dias: 23, faixa_3_7_dias: 15, faixa_7_15_dias: 8, faixa_mais_15_dias: 1 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-06-01", total_ajustes: 822, faixa_ate_1_dia: 231, faixa_1_3_dias: 131, faixa_3_7_dias: 153, faixa_7_15_dias: 125, faixa_mais_15_dias: 182 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-06-01", total_ajustes: 421, faixa_ate_1_dia: 17, faixa_1_3_dias: 46, faixa_3_7_dias: 71, faixa_7_15_dias: 182, faixa_mais_15_dias: 105 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-06-01", total_ajustes: 27, faixa_ate_1_dia: 4, faixa_1_3_dias: 11, faixa_3_7_dias: 6, faixa_7_15_dias: 1, faixa_mais_15_dias: 5 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-07-01", total_ajustes: 751, faixa_ate_1_dia: 326, faixa_1_3_dias: 180, faixa_3_7_dias: 94, faixa_7_15_dias: 128, faixa_mais_15_dias: 23 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-07-01", total_ajustes: 388, faixa_ate_1_dia: 54, faixa_1_3_dias: 59, faixa_3_7_dias: 92, faixa_7_15_dias: 25, faixa_mais_15_dias: 158 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-07-01", total_ajustes: 46, faixa_ate_1_dia: 20, faixa_1_3_dias: 13, faixa_3_7_dias: 3, faixa_7_15_dias: 4, faixa_mais_15_dias: 6 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-08-01", total_ajustes: 628, faixa_ate_1_dia: 345, faixa_1_3_dias: 163, faixa_3_7_dias: 75, faixa_7_15_dias: 36, faixa_mais_15_dias: 9 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-08-01", total_ajustes: 381, faixa_ate_1_dia: 45, faixa_1_3_dias: 78, faixa_3_7_dias: 110, faixa_7_15_dias: 131, faixa_mais_15_dias: 17 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-08-01", total_ajustes: 50, faixa_ate_1_dia: 15, faixa_1_3_dias: 22, faixa_3_7_dias: 11, faixa_7_15_dias: 2, faixa_mais_15_dias: 0 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-09-01", total_ajustes: 7553, faixa_ate_1_dia: 944, faixa_1_3_dias: 1069, faixa_3_7_dias: 1316, faixa_7_15_dias: 3575, faixa_mais_15_dias: 649 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-09-01", total_ajustes: 316, faixa_ate_1_dia: 41, faixa_1_3_dias: 71, faixa_3_7_dias: 70, faixa_7_15_dias: 67, faixa_mais_15_dias: 67 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-09-01", total_ajustes: 20, faixa_ate_1_dia: 5, faixa_1_3_dias: 3, faixa_3_7_dias: 5, faixa_7_15_dias: 5, faixa_mais_15_dias: 2 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-10-01", total_ajustes: 6281, faixa_ate_1_dia: 978, faixa_1_3_dias: 740, faixa_3_7_dias: 1199, faixa_7_15_dias: 1758, faixa_mais_15_dias: 1606 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-10-01", total_ajustes: 404, faixa_ate_1_dia: 38, faixa_1_3_dias: 79, faixa_3_7_dias: 113, faixa_7_15_dias: 54, faixa_mais_15_dias: 120 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-10-01", total_ajustes: 68, faixa_ate_1_dia: 11, faixa_1_3_dias: 9, faixa_3_7_dias: 20, faixa_7_15_dias: 17, faixa_mais_15_dias: 11 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-11-01", total_ajustes: 4043, faixa_ate_1_dia: 1074, faixa_1_3_dias: 987, faixa_3_7_dias: 824, faixa_7_15_dias: 882, faixa_mais_15_dias: 276 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-11-01", total_ajustes: 483, faixa_ate_1_dia: 43, faixa_1_3_dias: 77, faixa_3_7_dias: 124, faixa_7_15_dias: 163, faixa_mais_15_dias: 76 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-11-01", total_ajustes: 52, faixa_ate_1_dia: 10, faixa_1_3_dias: 11, faixa_3_7_dias: 4, faixa_7_15_dias: 23, faixa_mais_15_dias: 4 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2025-12-01", total_ajustes: 2383, faixa_ate_1_dia: 916, faixa_1_3_dias: 532, faixa_3_7_dias: 496, faixa_7_15_dias: 294, faixa_mais_15_dias: 145 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2025-12-01", total_ajustes: 652, faixa_ate_1_dia: 127, faixa_1_3_dias: 154, faixa_3_7_dias: 211, faixa_7_15_dias: 157, faixa_mais_15_dias: 3 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2025-12-01", total_ajustes: 51, faixa_ate_1_dia: 9, faixa_1_3_dias: 5, faixa_3_7_dias: 13, faixa_7_15_dias: 21, faixa_mais_15_dias: 3 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-01-01", total_ajustes: 1793, faixa_ate_1_dia: 391, faixa_1_3_dias: 480, faixa_3_7_dias: 556, faixa_7_15_dias: 252, faixa_mais_15_dias: 114 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-01-01", total_ajustes: 651, faixa_ate_1_dia: 105, faixa_1_3_dias: 206, faixa_3_7_dias: 250, faixa_7_15_dias: 47, faixa_mais_15_dias: 43 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-01-01", total_ajustes: 36, faixa_ate_1_dia: 3, faixa_1_3_dias: 12, faixa_3_7_dias: 17, faixa_7_15_dias: 3, faixa_mais_15_dias: 1 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-02-01", total_ajustes: 1938, faixa_ate_1_dia: 578, faixa_1_3_dias: 522, faixa_3_7_dias: 438, faixa_7_15_dias: 234, faixa_mais_15_dias: 166 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-02-01", total_ajustes: 457, faixa_ate_1_dia: 68, faixa_1_3_dias: 118, faixa_3_7_dias: 149, faixa_7_15_dias: 32, faixa_mais_15_dias: 90 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-02-01", total_ajustes: 51, faixa_ate_1_dia: 8, faixa_1_3_dias: 16, faixa_3_7_dias: 15, faixa_7_15_dias: 9, faixa_mais_15_dias: 3 },
  { company_id: 9380, company_name: "VIG EYES PORTARIA E LIMPEZA LTDA", reference_month: "2026-03-01", total_ajustes: 1462, faixa_ate_1_dia: 397, faixa_1_3_dias: 337, faixa_3_7_dias: 330, faixa_7_15_dias: 356, faixa_mais_15_dias: 42 },
  { company_id: 9379, company_name: "VIG EYES TERCEIRIZACAO DE SERVICOS LTDA", reference_month: "2026-03-01", total_ajustes: 240, faixa_ate_1_dia: 22, faixa_1_3_dias: 38, faixa_3_7_dias: 62, faixa_7_15_dias: 116, faixa_mais_15_dias: 2 },
  { company_id: 9381, company_name: "VIG EYES SEGURANCA PATRIMONIAL LTDA", reference_month: "2026-03-01", total_ajustes: 56, faixa_ate_1_dia: 13, faixa_1_3_dias: 13, faixa_3_7_dias: 22, faixa_7_15_dias: 8, faixa_mais_15_dias: 0 },
];

export const composicaoUnidadeData: ComposicaoFaixaRecord[] = [
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-04-01", total_ajustes: 631, faixa_ate_1_dia: 245, faixa_1_3_dias: 97, faixa_3_7_dias: 84, faixa_7_15_dias: 94, faixa_mais_15_dias: 111 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-04-01", total_ajustes: 525, faixa_ate_1_dia: 60, faixa_1_3_dias: 82, faixa_3_7_dias: 129, faixa_7_15_dias: 114, faixa_mais_15_dias: 140 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-04-01", total_ajustes: 86, faixa_ate_1_dia: 18, faixa_1_3_dias: 9, faixa_3_7_dias: 21, faixa_7_15_dias: 9, faixa_mais_15_dias: 29 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-05-01", total_ajustes: 788, faixa_ate_1_dia: 323, faixa_1_3_dias: 124, faixa_3_7_dias: 84, faixa_7_15_dias: 82, faixa_mais_15_dias: 175 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-05-01", total_ajustes: 455, faixa_ate_1_dia: 51, faixa_1_3_dias: 54, faixa_3_7_dias: 68, faixa_7_15_dias: 87, faixa_mais_15_dias: 195 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-05-01", total_ajustes: 51, faixa_ate_1_dia: 13, faixa_1_3_dias: 8, faixa_3_7_dias: 20, faixa_7_15_dias: 8, faixa_mais_15_dias: 2 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-06-01", total_ajustes: 797, faixa_ate_1_dia: 219, faixa_1_3_dias: 127, faixa_3_7_dias: 139, faixa_7_15_dias: 135, faixa_mais_15_dias: 177 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-06-01", total_ajustes: 385, faixa_ate_1_dia: 14, faixa_1_3_dias: 36, faixa_3_7_dias: 61, faixa_7_15_dias: 169, faixa_mais_15_dias: 105 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-06-01", total_ajustes: 88, faixa_ate_1_dia: 19, faixa_1_3_dias: 25, faixa_3_7_dias: 30, faixa_7_15_dias: 4, faixa_mais_15_dias: 10 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-07-01", total_ajustes: 672, faixa_ate_1_dia: 297, faixa_1_3_dias: 149, faixa_3_7_dias: 83, faixa_7_15_dias: 124, faixa_mais_15_dias: 19 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-07-01", total_ajustes: 407, faixa_ate_1_dia: 62, faixa_1_3_dias: 63, faixa_3_7_dias: 97, faixa_7_15_dias: 25, faixa_mais_15_dias: 160 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-07-01", total_ajustes: 106, faixa_ate_1_dia: 41, faixa_1_3_dias: 40, faixa_3_7_dias: 9, faixa_7_15_dias: 8, faixa_mais_15_dias: 8 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-08-01", total_ajustes: 532, faixa_ate_1_dia: 298, faixa_1_3_dias: 148, faixa_3_7_dias: 57, faixa_7_15_dias: 24, faixa_mais_15_dias: 5 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-08-01", total_ajustes: 390, faixa_ate_1_dia: 49, faixa_1_3_dias: 82, faixa_3_7_dias: 111, faixa_7_15_dias: 131, faixa_mais_15_dias: 17 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-08-01", total_ajustes: 137, faixa_ate_1_dia: 58, faixa_1_3_dias: 33, faixa_3_7_dias: 28, faixa_7_15_dias: 14, faixa_mais_15_dias: 4 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-09-01", total_ajustes: 7350, faixa_ate_1_dia: 894, faixa_1_3_dias: 1030, faixa_3_7_dias: 1262, faixa_7_15_dias: 3515, faixa_mais_15_dias: 649 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-09-01", total_ajustes: 354, faixa_ate_1_dia: 48, faixa_1_3_dias: 76, faixa_3_7_dias: 81, faixa_7_15_dias: 82, faixa_mais_15_dias: 67 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-09-01", total_ajustes: 185, faixa_ate_1_dia: 48, faixa_1_3_dias: 37, faixa_3_7_dias: 48, faixa_7_15_dias: 50, faixa_mais_15_dias: 2 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-10-01", total_ajustes: 6156, faixa_ate_1_dia: 972, faixa_1_3_dias: 712, faixa_3_7_dias: 1169, faixa_7_15_dias: 1733, faixa_mais_15_dias: 1570 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-10-01", total_ajustes: 432, faixa_ate_1_dia: 38, faixa_1_3_dias: 80, faixa_3_7_dias: 121, faixa_7_15_dias: 55, faixa_mais_15_dias: 138 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-10-01", total_ajustes: 165, faixa_ate_1_dia: 17, faixa_1_3_dias: 36, faixa_3_7_dias: 42, faixa_7_15_dias: 41, faixa_mais_15_dias: 29 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-11-01", total_ajustes: 3717, faixa_ate_1_dia: 1041, faixa_1_3_dias: 941, faixa_3_7_dias: 740, faixa_7_15_dias: 787, faixa_mais_15_dias: 208 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-11-01", total_ajustes: 674, faixa_ate_1_dia: 75, faixa_1_3_dias: 112, faixa_3_7_dias: 177, faixa_7_15_dias: 222, faixa_mais_15_dias: 88 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-11-01", total_ajustes: 187, faixa_ate_1_dia: 11, faixa_1_3_dias: 22, faixa_3_7_dias: 35, faixa_7_15_dias: 59, faixa_mais_15_dias: 60 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-12-01", total_ajustes: 2003, faixa_ate_1_dia: 871, faixa_1_3_dias: 462, faixa_3_7_dias: 365, faixa_7_15_dias: 200, faixa_mais_15_dias: 105 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-12-01", total_ajustes: 924, faixa_ate_1_dia: 162, faixa_1_3_dias: 209, faixa_3_7_dias: 314, faixa_7_15_dias: 225, faixa_mais_15_dias: 14 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-12-01", total_ajustes: 159, faixa_ate_1_dia: 19, faixa_1_3_dias: 20, faixa_3_7_dias: 41, faixa_7_15_dias: 47, faixa_mais_15_dias: 32 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-01-01", total_ajustes: 1582, faixa_ate_1_dia: 365, faixa_1_3_dias: 431, faixa_3_7_dias: 484, faixa_7_15_dias: 190, faixa_mais_15_dias: 112 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-01-01", total_ajustes: 830, faixa_ate_1_dia: 123, faixa_1_3_dias: 251, faixa_3_7_dias: 317, faixa_7_15_dias: 95, faixa_mais_15_dias: 44 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-01-01", total_ajustes: 68, faixa_ate_1_dia: 11, faixa_1_3_dias: 16, faixa_3_7_dias: 22, faixa_7_15_dias: 17, faixa_mais_15_dias: 2 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-02-01", total_ajustes: 1760, faixa_ate_1_dia: 548, faixa_1_3_dias: 508, faixa_3_7_dias: 379, faixa_7_15_dias: 204, faixa_mais_15_dias: 121 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-02-01", total_ajustes: 575, faixa_ate_1_dia: 87, faixa_1_3_dias: 124, faixa_3_7_dias: 178, faixa_7_15_dias: 52, faixa_mais_15_dias: 134 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-02-01", total_ajustes: 111, faixa_ate_1_dia: 19, faixa_1_3_dias: 24, faixa_3_7_dias: 45, faixa_7_15_dias: 19, faixa_mais_15_dias: 4 },
  { company_id: 17518, company_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-03-01", total_ajustes: 1318, faixa_ate_1_dia: 366, faixa_1_3_dias: 319, faixa_3_7_dias: 288, faixa_7_15_dias: 304, faixa_mais_15_dias: 41 },
  { company_id: 17517, company_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-03-01", total_ajustes: 303, faixa_ate_1_dia: 25, faixa_1_3_dias: 37, faixa_3_7_dias: 86, faixa_7_15_dias: 152, faixa_mais_15_dias: 3 },
  { company_id: 17519, company_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-03-01", total_ajustes: 137, faixa_ate_1_dia: 41, faixa_1_3_dias: 32, faixa_3_7_dias: 40, faixa_7_15_dias: 24, faixa_mais_15_dias: 0 },
];

export const composicaoAreaData: ComposicaoFaixaRecord[] = [
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-04-01", total_ajustes: 627, faixa_ate_1_dia: 88, faixa_1_3_dias: 85, faixa_3_7_dias: 129, faixa_7_15_dias: 161, faixa_mais_15_dias: 164 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-04-01", total_ajustes: 38, faixa_ate_1_dia: 7, faixa_1_3_dias: 1, faixa_3_7_dias: 13, faixa_7_15_dias: 7, faixa_mais_15_dias: 10 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-04-01", total_ajustes: 2, faixa_ate_1_dia: 2, faixa_1_3_dias: 0, faixa_3_7_dias: 0, faixa_7_15_dias: 0, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-05-01", total_ajustes: 596, faixa_ate_1_dia: 95, faixa_1_3_dias: 99, faixa_3_7_dias: 122, faixa_7_15_dias: 104, faixa_mais_15_dias: 176 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-05-01", total_ajustes: 5, faixa_ate_1_dia: 2, faixa_1_3_dias: 0, faixa_3_7_dias: 0, faixa_7_15_dias: 0, faixa_mais_15_dias: 3 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-05-01", total_ajustes: 3, faixa_ate_1_dia: 1, faixa_1_3_dias: 0, faixa_3_7_dias: 1, faixa_7_15_dias: 1, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-06-01", total_ajustes: 628, faixa_ate_1_dia: 66, faixa_1_3_dias: 121, faixa_3_7_dias: 168, faixa_7_15_dias: 155, faixa_mais_15_dias: 118 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-06-01", total_ajustes: 10, faixa_ate_1_dia: 6, faixa_1_3_dias: 1, faixa_3_7_dias: 0, faixa_7_15_dias: 2, faixa_mais_15_dias: 1 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-06-01", total_ajustes: 8, faixa_ate_1_dia: 2, faixa_1_3_dias: 2, faixa_3_7_dias: 3, faixa_7_15_dias: 1, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-07-01", total_ajustes: 590, faixa_ate_1_dia: 145, faixa_1_3_dias: 141, faixa_3_7_dias: 116, faixa_7_15_dias: 80, faixa_mais_15_dias: 108 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-07-01", total_ajustes: 34, faixa_ate_1_dia: 17, faixa_1_3_dias: 13, faixa_3_7_dias: 2, faixa_7_15_dias: 2, faixa_mais_15_dias: 0 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-07-01", total_ajustes: 9, faixa_ate_1_dia: 4, faixa_1_3_dias: 0, faixa_3_7_dias: 4, faixa_7_15_dias: 1, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-08-01", total_ajustes: 445, faixa_ate_1_dia: 97, faixa_1_3_dias: 113, faixa_3_7_dias: 110, faixa_7_15_dias: 105, faixa_mais_15_dias: 20 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-08-01", total_ajustes: 27, faixa_ate_1_dia: 11, faixa_1_3_dias: 5, faixa_3_7_dias: 3, faixa_7_15_dias: 4, faixa_mais_15_dias: 4 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-08-01", total_ajustes: 5, faixa_ate_1_dia: 1, faixa_1_3_dias: 4, faixa_3_7_dias: 0, faixa_7_15_dias: 0, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-09-01", total_ajustes: 456, faixa_ate_1_dia: 98, faixa_1_3_dias: 90, faixa_3_7_dias: 108, faixa_7_15_dias: 103, faixa_mais_15_dias: 57 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-09-01", total_ajustes: 252, faixa_ate_1_dia: 48, faixa_1_3_dias: 13, faixa_3_7_dias: 49, faixa_7_15_dias: 132, faixa_mais_15_dias: 10 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-09-01", total_ajustes: 42, faixa_ate_1_dia: 8, faixa_1_3_dias: 9, faixa_3_7_dias: 17, faixa_7_15_dias: 8, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-10-01", total_ajustes: 554, faixa_ate_1_dia: 67, faixa_1_3_dias: 95, faixa_3_7_dias: 153, faixa_7_15_dias: 74, faixa_mais_15_dias: 165 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-10-01", total_ajustes: 305, faixa_ate_1_dia: 53, faixa_1_3_dias: 16, faixa_3_7_dias: 76, faixa_7_15_dias: 44, faixa_mais_15_dias: 116 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-10-01", total_ajustes: 23, faixa_ate_1_dia: 3, faixa_1_3_dias: 3, faixa_3_7_dias: 4, faixa_7_15_dias: 8, faixa_mais_15_dias: 5 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-11-01", total_ajustes: 664, faixa_ate_1_dia: 48, faixa_1_3_dias: 94, faixa_3_7_dias: 163, faixa_7_15_dias: 241, faixa_mais_15_dias: 118 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-11-01", total_ajustes: 200, faixa_ate_1_dia: 37, faixa_1_3_dias: 32, faixa_3_7_dias: 32, faixa_7_15_dias: 59, faixa_mais_15_dias: 40 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-11-01", total_ajustes: 54, faixa_ate_1_dia: 1, faixa_1_3_dias: 2, faixa_3_7_dias: 9, faixa_7_15_dias: 8, faixa_mais_15_dias: 34 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2025-12-01", total_ajustes: 573, faixa_ate_1_dia: 86, faixa_1_3_dias: 107, faixa_3_7_dias: 173, faixa_7_15_dias: 159, faixa_mais_15_dias: 48 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2025-12-01", total_ajustes: 57, faixa_ate_1_dia: 2, faixa_1_3_dias: 3, faixa_3_7_dias: 7, faixa_7_15_dias: 17, faixa_mais_15_dias: 28 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2025-12-01", total_ajustes: 51, faixa_ate_1_dia: 24, faixa_1_3_dias: 10, faixa_3_7_dias: 10, faixa_7_15_dias: 7, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2026-01-01", total_ajustes: 529, faixa_ate_1_dia: 77, faixa_1_3_dias: 144, faixa_3_7_dias: 217, faixa_7_15_dias: 73, faixa_mais_15_dias: 18 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2026-01-01", total_ajustes: 38, faixa_ate_1_dia: 14, faixa_1_3_dias: 14, faixa_3_7_dias: 5, faixa_7_15_dias: 4, faixa_mais_15_dias: 1 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2026-01-01", total_ajustes: 9, faixa_ate_1_dia: 0, faixa_1_3_dias: 3, faixa_3_7_dias: 3, faixa_7_15_dias: 2, faixa_mais_15_dias: 1 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2026-02-01", total_ajustes: 568, faixa_ate_1_dia: 81, faixa_1_3_dias: 136, faixa_3_7_dias: 170, faixa_7_15_dias: 94, faixa_mais_15_dias: 87 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2026-02-01", total_ajustes: 28, faixa_ate_1_dia: 5, faixa_1_3_dias: 6, faixa_3_7_dias: 12, faixa_7_15_dias: 5, faixa_mais_15_dias: 0 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2026-02-01", total_ajustes: 21, faixa_ate_1_dia: 4, faixa_1_3_dias: 5, faixa_3_7_dias: 6, faixa_7_15_dias: 6, faixa_mais_15_dias: 0 },
  { company_id: 11043, company_name: "SAO PAULO", reference_month: "2026-03-01", total_ajustes: 422, faixa_ate_1_dia: 65, faixa_1_3_dias: 87, faixa_3_7_dias: 144, faixa_7_15_dias: 125, faixa_mais_15_dias: 1 },
  { company_id: 11046, company_name: "PIRACICABA", reference_month: "2026-03-01", total_ajustes: 23, faixa_ate_1_dia: 7, faixa_1_3_dias: 7, faixa_3_7_dias: 9, faixa_7_15_dias: 0, faixa_mais_15_dias: 0 },
  { company_id: 11045, company_name: "SOROCABA", reference_month: "2026-03-01", total_ajustes: 4, faixa_ate_1_dia: 0, faixa_1_3_dias: 2, faixa_3_7_dias: 0, faixa_7_15_dias: 2, faixa_mais_15_dias: 0 },
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
  headcount: number;
}

export const qualidadeUnidadeData: QualidadeUnidadeRecord[] = [
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-04-01", total_marcacoes: 1243, registradas: 1120, justificadas: 86, qualidade_percentual: 91.65, headcount: 20 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-04-01", total_marcacoes: 1287, registradas: 601, justificadas: 525, qualidade_percentual: 49.63, headcount: 22 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-04-01", total_marcacoes: 7565, registradas: 6285, justificadas: 631, qualidade_percentual: 86.95, headcount: 199 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-05-01", total_marcacoes: 1308, registradas: 668, justificadas: 455, qualidade_percentual: 54.58, headcount: 22 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-05-01", total_marcacoes: 7732, registradas: 6303, justificadas: 788, qualidade_percentual: 85.21, headcount: 198 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-05-01", total_marcacoes: 1140, registradas: 951, justificadas: 51, qualidade_percentual: 92.06, headcount: 19 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-06-01", total_marcacoes: 1036, registradas: 816, justificadas: 88, qualidade_percentual: 84.38, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-06-01", total_marcacoes: 7660, registradas: 6303, justificadas: 797, qualidade_percentual: 85.90, headcount: 198 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-06-01", total_marcacoes: 1095, registradas: 630, justificadas: 385, qualidade_percentual: 58.88, headcount: 18 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-07-01", total_marcacoes: 1072, registradas: 784, justificadas: 106, qualidade_percentual: 80.99, headcount: 20 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-07-01", total_marcacoes: 1128, registradas: 677, justificadas: 407, qualidade_percentual: 61.27, headcount: 19 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-07-01", total_marcacoes: 7859, registradas: 6526, justificadas: 672, qualidade_percentual: 87.61, headcount: 206 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-08-01", total_marcacoes: 1350, registradas: 964, justificadas: 137, qualidade_percentual: 79.87, headcount: 25 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-08-01", total_marcacoes: 1149, registradas: 671, justificadas: 390, qualidade_percentual: 61.67, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-08-01", total_marcacoes: 7944, registradas: 6576, justificadas: 532, qualidade_percentual: 88.30, headcount: 199 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-09-01", total_marcacoes: 1354, registradas: 937, justificadas: 185, qualidade_percentual: 81.27, headcount: 21 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-09-01", total_marcacoes: 1157, registradas: 697, justificadas: 354, qualidade_percentual: 64.12, headcount: 20 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-09-01", total_marcacoes: 19905, registradas: 6936, justificadas: 7350, qualidade_percentual: 37.86, headcount: 381 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-10-01", total_marcacoes: 1323, registradas: 895, justificadas: 165, qualidade_percentual: 79.34, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-10-01", total_marcacoes: 27881, registradas: 13648, justificadas: 6156, qualidade_percentual: 64.60, headcount: 399 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-10-01", total_marcacoes: 1233, registradas: 673, justificadas: 432, qualidade_percentual: 56.37, headcount: 22 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-11-01", total_marcacoes: 22995, registradas: 14494, justificadas: 3717, qualidade_percentual: 75.53, headcount: 374 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-11-01", total_marcacoes: 1499, registradas: 541, justificadas: 674, qualidade_percentual: 38.73, headcount: 28 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-11-01", total_marcacoes: 1367, registradas: 766, justificadas: 187, qualidade_percentual: 75.84, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2025-12-01", total_marcacoes: 25093, registradas: 15831, justificadas: 2003, qualidade_percentual: 83.83, headcount: 380 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2025-12-01", total_marcacoes: 1821, registradas: 668, justificadas: 924, qualidade_percentual: 39.64, headcount: 28 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2025-12-01", total_marcacoes: 1322, registradas: 879, justificadas: 159, qualidade_percentual: 77.38, headcount: 22 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-01-01", total_marcacoes: 22226, registradas: 16442, justificadas: 1582, qualidade_percentual: 86.86, headcount: 389 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-01-01", total_marcacoes: 1736, registradas: 660, justificadas: 830, qualidade_percentual: 41.56, headcount: 28 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-01-01", total_marcacoes: 1265, registradas: 1023, justificadas: 68, qualidade_percentual: 88.04, headcount: 22 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-02-01", total_marcacoes: 21523, registradas: 15686, justificadas: 1760, qualidade_percentual: 87.33, headcount: 394 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-02-01", total_marcacoes: 1368, registradas: 620, justificadas: 575, qualidade_percentual: 49.44, headcount: 23 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-02-01", total_marcacoes: 1146, registradas: 855, justificadas: 111, qualidade_percentual: 84.15, headcount: 21 },
  { business_unit_id: 17518, business_unit_name: "VIG EYES PORTARIA E LIMPEZA", reference_month: "2026-03-01", total_marcacoes: 24790, registradas: 20497, justificadas: 1318, qualidade_percentual: 92.47, headcount: 392 },
  { business_unit_id: 17517, business_unit_name: "VIG EYES TERCEIRIZACAO", reference_month: "2026-03-01", total_marcacoes: 1509, registradas: 717, justificadas: 303, qualidade_percentual: 67.32, headcount: 27 },
  { business_unit_id: 17519, business_unit_name: "VIG EYES SEGURANCA PATRIMONIAL", reference_month: "2026-03-01", total_marcacoes: 1367, registradas: 940, justificadas: 137, qualidade_percentual: 80.07, headcount: 24 },
];

export interface QualidadeAreaRecord {
  area_id: number;
  area_name: string;
  reference_month: string;
  total_marcacoes: number;
  registradas: number;
  justificadas: number;
  qualidade_percentual: number;
  headcount: number;
}

export const qualidadeAreaData: QualidadeAreaRecord[] = [
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-04-01", total_marcacoes: 536, registradas: 491, justificadas: 38, qualidade_percentual: 92.29, headcount: 9 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-04-01", total_marcacoes: 2766, registradas: 1842, justificadas: 627, qualidade_percentual: 70.14, headcount: 50 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-04-01", total_marcacoes: 132, registradas: 126, justificadas: 2, qualidade_percentual: 96.92, headcount: 4 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-05-01", total_marcacoes: 2749, registradas: 1857, justificadas: 596, qualidade_percentual: 71.26, headcount: 48 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-05-01", total_marcacoes: 125, registradas: 119, justificadas: 5, qualidade_percentual: 95.20, headcount: 5 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-05-01", total_marcacoes: 428, registradas: 422, justificadas: 3, qualidade_percentual: 99.06, headcount: 8 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-06-01", total_marcacoes: 346, registradas: 301, justificadas: 8, qualidade_percentual: 91.21, headcount: 8 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-06-01", total_marcacoes: 107, registradas: 91, justificadas: 10, qualidade_percentual: 89.22, headcount: 3 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-06-01", total_marcacoes: 2474, registradas: 1572, justificadas: 628, qualidade_percentual: 67.01, headcount: 47 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-07-01", total_marcacoes: 453, registradas: 320, justificadas: 34, qualidade_percentual: 80.81, headcount: 9 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-07-01", total_marcacoes: 2655, registradas: 1744, justificadas: 590, qualidade_percentual: 71.10, headcount: 49 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-07-01", total_marcacoes: 158, registradas: 141, justificadas: 9, qualidade_percentual: 94.00, headcount: 4 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-08-01", total_marcacoes: 501, registradas: 420, justificadas: 27, qualidade_percentual: 86.07, headcount: 8 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-08-01", total_marcacoes: 2652, registradas: 1793, justificadas: 445, qualidade_percentual: 75.15, headcount: 50 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-08-01", total_marcacoes: 168, registradas: 157, justificadas: 5, qualidade_percentual: 95.73, headcount: 4 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-09-01", total_marcacoes: 492, registradas: 403, justificadas: 42, qualidade_percentual: 88.57, headcount: 8 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-09-01", total_marcacoes: 2594, registradas: 1808, justificadas: 456, qualidade_percentual: 77.10, headcount: 47 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-09-01", total_marcacoes: 674, registradas: 172, justificadas: 252, qualidade_percentual: 27.22, headcount: 12 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-10-01", total_marcacoes: 494, registradas: 351, justificadas: 23, qualidade_percentual: 81.25, headcount: 8 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-10-01", total_marcacoes: 1124, registradas: 420, justificadas: 305, qualidade_percentual: 50.54, headcount: 17 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-10-01", total_marcacoes: 2932, registradas: 1763, justificadas: 554, qualidade_percentual: 68.02, headcount: 54 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-11-01", total_marcacoes: 733, registradas: 256, justificadas: 200, qualidade_percentual: 45.07, headcount: 15 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-11-01", total_marcacoes: 2849, registradas: 1494, justificadas: 664, qualidade_percentual: 62.75, headcount: 51 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-11-01", total_marcacoes: 521, registradas: 320, justificadas: 54, qualidade_percentual: 79.60, headcount: 8 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2025-12-01", total_marcacoes: 856, registradas: 394, justificadas: 51, qualidade_percentual: 70.61, headcount: 13 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2025-12-01", total_marcacoes: 2856, registradas: 1759, justificadas: 573, qualidade_percentual: 68.63, headcount: 49 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2025-12-01", total_marcacoes: 530, registradas: 396, justificadas: 57, qualidade_percentual: 86.09, headcount: 8 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2026-01-01", total_marcacoes: 816, registradas: 613, justificadas: 38, qualidade_percentual: 86.83, headcount: 14 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2026-01-01", total_marcacoes: 2733, registradas: 1850, justificadas: 529, qualidade_percentual: 73.38, headcount: 54 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2026-01-01", total_marcacoes: 499, registradas: 458, justificadas: 9, qualidade_percentual: 93.47, headcount: 9 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2026-02-01", total_marcacoes: 722, registradas: 616, justificadas: 21, qualidade_percentual: 96.25, headcount: 13 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2026-02-01", total_marcacoes: 2777, registradas: 1723, justificadas: 568, qualidade_percentual: 71.20, headcount: 53 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2026-02-01", total_marcacoes: 432, registradas: 364, justificadas: 28, qualidade_percentual: 92.39, headcount: 8 },
  { area_id: 11045, area_name: "SOROCABA", reference_month: "2026-03-01", total_marcacoes: 866, registradas: 827, justificadas: 4, qualidade_percentual: 99.52, headcount: 12 },
  { area_id: 11043, area_name: "SAO PAULO", reference_month: "2026-03-01", total_marcacoes: 2985, registradas: 1902, justificadas: 422, qualidade_percentual: 77.00, headcount: 53 },
  { area_id: 11046, area_name: "PIRACICABA", reference_month: "2026-03-01", total_marcacoes: 502, registradas: 389, justificadas: 23, qualidade_percentual: 86.83, headcount: 9 },
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

  if (groupBy === "unidade") {
    const filtered = selectedName
      ? qualidadeUnidadeData.filter(r => r.business_unit_name === selectedName)
      : qualidadeUnidadeData;

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

  // For area, use weighted average like empresa/unidade
  const filtered = selectedName
    ? qualidadeAreaData.filter(r => r.area_name === selectedName)
    : qualidadeAreaData;

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
 * Groups by entity name, sums volume (clocking_count / total_marcacoes),
 * computes weighted average quality, and takes max headcount.
 */
export function aggregateQualidadeVolume(
  selectedMonth: string | null = null,
  groupBy: "empresa" | "unidade" | "area" = "empresa"
): QualidadeVolumeScatterPoint[] {
  if (groupBy === "unidade") {
    const filtered = selectedMonth
      ? qualidadeUnidadeData.filter(r => r.reference_month === selectedMonth)
      : qualidadeUnidadeData;

    const map = new Map<string, { volume: number; qualWeighted: number; headcount: number }>();
    for (const r of filtered) {
      const existing = map.get(r.business_unit_name);
      if (existing) {
        existing.qualWeighted += r.qualidade_percentual * r.total_marcacoes;
        existing.volume += r.total_marcacoes;
        existing.headcount = Math.max(existing.headcount, r.headcount);
      } else {
        map.set(r.business_unit_name, {
          volume: r.total_marcacoes,
          qualWeighted: r.qualidade_percentual * r.total_marcacoes,
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

  if (groupBy === "area") {
    const filtered = selectedMonth
      ? qualidadeAreaData.filter(r => r.reference_month === selectedMonth)
      : qualidadeAreaData;

    const map = new Map<string, { volume: number; qualWeighted: number; headcount: number }>();
    for (const r of filtered) {
      const existing = map.get(r.area_name);
      if (existing) {
        existing.qualWeighted += r.qualidade_percentual * r.total_marcacoes;
        existing.volume += r.total_marcacoes;
        existing.headcount = Math.max(existing.headcount, r.headcount);
      } else {
        map.set(r.area_name, {
          volume: r.total_marcacoes,
          qualWeighted: r.qualidade_percentual * r.total_marcacoes,
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

  // Default: empresa
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
