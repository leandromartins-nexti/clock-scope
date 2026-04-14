import type { ChartDataSource } from "@/components/analytics/ChartDataModal";
import sobrecargaEmpresa from "@/data/qualidade-ponto/sobrecarga-por-empresa.json";
import sobrecargaUnidade from "@/data/qualidade-ponto/sobrecarga-por-un-negocio.json";
import sobrecargaArea from "@/data/qualidade-ponto/sobrecarga-por-area.json";

const SQL_EMPRESA = `WITH he_types AS (
  SELECT id 
  FROM time_tracking_type
  WHERE (name LIKE '%OVERTIME%' OR name LIKE 'COMPTIME_CREDIT%')
    AND name NOT LIKE '%BALANCE%'
),
he_operador_mes AS (
  SELECT 
    tt.person_id AS operador_person_id,
    DATE_FORMAT(tt.reference_date, '%Y-%m') AS competencia,
    SUM(tt.minutes) / 60.0 AS horas_extras
  FROM time_tracking tt
  INNER JOIN he_types ht ON ht.id = tt.time_tracking_type_id
  WHERE tt.customer_id = 642
    AND tt.reference_date >= '2025-04-01'
    AND tt.reference_date < '2026-04-01'
  GROUP BY tt.person_id, DATE_FORMAT(tt.reference_date, '%Y-%m')
),
ajustes_base AS (
  SELECT 
    ajuste.id AS ajuste_id,
    DATE_FORMAT(ajuste.reference_date, '%Y-%m') AS competencia,
    ua.id AS user_account_id,
    ua.person_id AS operador_person_id,
    ajuste.person_id AS colaborador_person_id
  FROM clocking ajuste
  JOIN clocking original ON ajuste.clocking_origin_id = original.id
  INNER JOIN user_account ua ON ua.id = ajuste.user_adjustment_id
  WHERE ajuste.customer_id = 642
    AND ajuste.removed = 0
    AND ajuste.clocking_type_id = 3
    AND ajuste.clocking_origin_id IS NOT NULL
    AND ajuste.adjustment_date IS NOT NULL
    AND ajuste.reference_date >= '2025-04-01'
    AND ajuste.reference_date < '2026-04-01'
),
ajustes_operador_total_mes AS (
  SELECT 
    operador_person_id,
    competencia,
    COUNT(*) AS total_ajustes_op
  FROM ajustes_base
  GROUP BY operador_person_id, competencia
)
SELECT 
  642 AS customer_id,
  ab.competencia,
  p.company_id,
  comp.company_name,
  COUNT(DISTINCT ab.ajuste_id) AS qtd_ajustes,
  COUNT(DISTINCT ab.user_account_id) AS operadores_ativos,
  ROUND(
    COUNT(DISTINCT ab.ajuste_id) * 1.0 / NULLIF(COUNT(DISTINCT ab.user_account_id), 0), 
    0
  ) AS ajustes_por_operador,
  ROUND(
    SUM(
      COALESCE(hom.horas_extras, 0) / NULLIF(aotm.total_ajustes_op, 0)
    ), 
    1
  ) AS horas_extras_rateadas
FROM ajustes_base ab
INNER JOIN person p ON p.id = ab.colaborador_person_id
LEFT JOIN company comp ON comp.id = p.company_id
LEFT JOIN he_operador_mes hom 
  ON hom.operador_person_id = ab.operador_person_id 
  AND hom.competencia = ab.competencia
LEFT JOIN ajustes_operador_total_mes aotm 
  ON aotm.operador_person_id = ab.operador_person_id 
  AND aotm.competencia = ab.competencia
GROUP BY ab.competencia, p.company_id, comp.company_name
ORDER BY p.company_id, ab.competencia;`;

const SQL_UNIDADE = `WITH he_types AS (
  SELECT id 
  FROM time_tracking_type
  WHERE (name LIKE '%OVERTIME%' OR name LIKE 'COMPTIME_CREDIT%')
    AND name NOT LIKE '%BALANCE%'
),
he_operador_mes AS (
  SELECT 
    tt.person_id AS operador_person_id,
    DATE_FORMAT(tt.reference_date, '%Y-%m') AS competencia,
    SUM(tt.minutes) / 60.0 AS horas_extras
  FROM time_tracking tt
  INNER JOIN he_types ht ON ht.id = tt.time_tracking_type_id
  WHERE tt.customer_id = 642
    AND tt.reference_date >= '2025-04-01'
    AND tt.reference_date < '2026-04-01'
  GROUP BY tt.person_id, DATE_FORMAT(tt.reference_date, '%Y-%m')
),
ajustes_base AS (
  SELECT 
    ajuste.id AS ajuste_id,
    DATE_FORMAT(ajuste.reference_date, '%Y-%m') AS competencia,
    ua.id AS user_account_id,
    ua.person_id AS operador_person_id,
    ajuste.workplace_id
  FROM clocking ajuste
  JOIN clocking original ON ajuste.clocking_origin_id = original.id
  INNER JOIN user_account ua ON ua.id = ajuste.user_adjustment_id
  WHERE ajuste.customer_id = 642
    AND ajuste.removed = 0
    AND ajuste.clocking_type_id = 3
    AND ajuste.clocking_origin_id IS NOT NULL
    AND ajuste.adjustment_date IS NOT NULL
    AND ajuste.reference_date >= '2025-04-01'
    AND ajuste.reference_date < '2026-04-01'
),
ajustes_operador_total_mes AS (
  SELECT 
    operador_person_id,
    competencia,
    COUNT(*) AS total_ajustes_op
  FROM ajustes_base
  GROUP BY operador_person_id, competencia
)
SELECT 
  642 AS customer_id,
  ab.competencia,
  w.business_unit_id,
  bu.name AS business_unit_name,
  COUNT(DISTINCT ab.ajuste_id) AS qtd_ajustes,
  COUNT(DISTINCT ab.user_account_id) AS operadores_ativos,
  ROUND(
    COUNT(DISTINCT ab.ajuste_id) * 1.0 / NULLIF(COUNT(DISTINCT ab.user_account_id), 0), 
    0
  ) AS ajustes_por_operador,
  ROUND(
    SUM(
      COALESCE(hom.horas_extras, 0) / NULLIF(aotm.total_ajustes_op, 0)
    ), 
    1
  ) AS horas_extras_rateadas
FROM ajustes_base ab
INNER JOIN workplace w ON w.id = ab.workplace_id
LEFT JOIN business_unit bu ON bu.id = w.business_unit_id
LEFT JOIN he_operador_mes hom 
  ON hom.operador_person_id = ab.operador_person_id 
  AND hom.competencia = ab.competencia
LEFT JOIN ajustes_operador_total_mes aotm 
  ON aotm.operador_person_id = ab.operador_person_id 
  AND aotm.competencia = ab.competencia
WHERE w.business_unit_id IS NOT NULL
GROUP BY ab.competencia, w.business_unit_id, bu.name
ORDER BY w.business_unit_id, ab.competencia;`;

const SQL_AREA = `WITH he_types AS (
  SELECT id 
  FROM time_tracking_type
  WHERE (name LIKE '%OVERTIME%' OR name LIKE 'COMPTIME_CREDIT%')
    AND name NOT LIKE '%BALANCE%'
),
he_operador_mes AS (
  SELECT 
    tt.person_id AS operador_person_id,
    DATE_FORMAT(tt.reference_date, '%Y-%m') AS competencia,
    SUM(tt.minutes) / 60.0 AS horas_extras
  FROM time_tracking tt
  INNER JOIN he_types ht ON ht.id = tt.time_tracking_type_id
  WHERE tt.customer_id = 642
    AND tt.reference_date >= '2025-04-01'
    AND tt.reference_date < '2026-04-01'
  GROUP BY tt.person_id, DATE_FORMAT(tt.reference_date, '%Y-%m')
),
ajustes_base AS (
  SELECT 
    ajuste.id AS ajuste_id,
    DATE_FORMAT(ajuste.reference_date, '%Y-%m') AS competencia,
    ua.id AS user_account_id,
    ua.person_id AS operador_person_id,
    ajuste.workplace_id
  FROM clocking ajuste
  JOIN clocking original ON ajuste.clocking_origin_id = original.id
  INNER JOIN user_account ua ON ua.id = ajuste.user_adjustment_id
  WHERE ajuste.customer_id = 642
    AND ajuste.removed = 0
    AND ajuste.clocking_type_id = 3
    AND ajuste.clocking_origin_id IS NOT NULL
    AND ajuste.adjustment_date IS NOT NULL
    AND ajuste.reference_date >= '2025-04-01'
    AND ajuste.reference_date < '2026-04-01'
),
ajustes_operador_total_mes AS (
  SELECT 
    operador_person_id,
    competencia,
    COUNT(*) AS total_ajustes_op
  FROM ajustes_base
  GROUP BY operador_person_id, competencia
),
workplace_primary_area AS (
  SELECT 
    aw.workplace_id,
    MIN(aw.area_id) AS area_id
  FROM area_workplace aw
  GROUP BY aw.workplace_id
)
SELECT 
  642 AS customer_id,
  ab.competencia,
  wpa.area_id,
  ar.name AS area_name,
  COUNT(DISTINCT ab.ajuste_id) AS qtd_ajustes,
  COUNT(DISTINCT ab.user_account_id) AS operadores_ativos,
  ROUND(
    COUNT(DISTINCT ab.ajuste_id) * 1.0 / NULLIF(COUNT(DISTINCT ab.user_account_id), 0), 
    0
  ) AS ajustes_por_operador,
  ROUND(
    SUM(
      COALESCE(hom.horas_extras, 0) / NULLIF(aotm.total_ajustes_op, 0)
    ), 
    1
  ) AS horas_extras_rateadas
FROM ajustes_base ab
INNER JOIN workplace_primary_area wpa ON wpa.workplace_id = ab.workplace_id
LEFT JOIN area ar ON ar.id = wpa.area_id
LEFT JOIN he_operador_mes hom 
  ON hom.operador_person_id = ab.operador_person_id 
  AND hom.competencia = ab.competencia
LEFT JOIN ajustes_operador_total_mes aotm 
  ON aotm.operador_person_id = ab.operador_person_id 
  AND aotm.competencia = ab.competencia
WHERE wpa.area_id IS NOT NULL
GROUP BY ab.competencia, wpa.area_id, ar.name
ORDER BY wpa.area_id, ab.competencia;`;

export const sobrecargaBackofficeColumns = [
  { key: "competencia", label: "Competência" },
  { key: "qtd_ajustes", label: "Qtd Ajustes", format: (v: any) => Number(v).toLocaleString("pt-BR") },
  { key: "operadores_ativos", label: "Operadores Ativos" },
  { key: "ajustes_por_operador", label: "Ajustes/Operador", format: (v: any) => Number(v).toLocaleString("pt-BR") },
  { key: "horas_extras_rateadas", label: "HE Rateada (h)", format: (v: any) => Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 1 }) },
];

export const sobrecargaBackofficeSource: ChartDataSource = {
  empresa: {
    data: sobrecargaEmpresa as Record<string, any>[],
    sql: SQL_EMPRESA,
  },
  unidade: {
    data: sobrecargaUnidade as Record<string, any>[],
    sql: SQL_UNIDADE,
  },
  area: {
    data: sobrecargaArea as Record<string, any>[],
    sql: SQL_AREA,
  },
};
