import type { ChartDataSource } from "@/components/analytics/ChartDataModal";
import hcEmpresa from "@/data/qualidade-ponto/headcount-por-empresa.json";
import hcUnNegocio from "@/data/qualidade-ponto/headcount-por-un-negocio.json";
import hcArea from "@/data/qualidade-ponto/headcount-por-area.json";

const SQL_EMPRESA = `WITH active_hc AS (
  SELECT 
    DATE_FORMAT(LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH)), '%Y-%m-01') AS reference_month,
    LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH)) AS ultimo_dia,
    p.company_id,
    COUNT(DISTINCT p.id) AS active_headcount
  FROM (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
    UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 
    UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
  ) meses
  INNER JOIN person p 
    ON p.customer_id = 642
    AND p.admission_date <= LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH))
    AND (p.demission_date IS NULL OR p.demission_date > LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH)))
  GROUP BY reference_month, ultimo_dia, p.company_id
)
SELECT
    c.customer_id,
    co.id AS company_id,
    co.company_name,
    DATE_FORMAT(c.reference_date, '%Y-%m-01') AS reference_month,
    SUM(CASE WHEN c.clocking_type_id IN (1, 3) THEN 1 ELSE 0 END) AS clocking_count,
    SUM(CASE WHEN c.clocking_type_id = 1 AND c.clocking_origin_id IS NULL THEN 1 ELSE 0 END) AS registered_count,
    SUM(CASE WHEN c.clocking_type_id = 3 AND c.clocking_origin_id IS NOT NULL THEN 1 ELSE 0 END) AS justified_count,
    ROUND(
        SUM(CASE WHEN c.clocking_type_id = 1 AND c.clocking_origin_id IS NULL THEN 1 ELSE 0 END)
        / NULLIF(SUM(CASE WHEN c.clocking_type_id IN (1, 3) THEN 1 ELSE 0 END), 0) * 100,
        2
    ) AS quality_percentage,
    COUNT(DISTINCT c.person_id) AS headcount,
    COALESCE(ahc.active_headcount, 0) AS active_headcount
FROM clocking c
JOIN person p ON c.person_id = p.id
JOIN company co ON p.company_id = co.id
LEFT JOIN active_hc ahc 
  ON ahc.reference_month = DATE_FORMAT(c.reference_date, '%Y-%m-01')
  AND ahc.company_id = co.id
WHERE c.removed = 0
  AND c.customer_id = 642
  AND c.reference_date >= '2025-04-01'
  AND c.reference_date < '2026-04-01'
GROUP BY c.customer_id, co.id, co.company_name, DATE_FORMAT(c.reference_date, '%Y-%m-01'), ahc.active_headcount
ORDER BY reference_month;`;

const SQL_UNIDADE = `WITH active_hc AS (
  SELECT 
    DATE_FORMAT(LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH)), '%Y-%m-01') AS reference_month,
    w.business_unit_id,
    COUNT(DISTINCT wt.person_id) AS active_headcount
  FROM (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
    UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 
    UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
  ) meses
  INNER JOIN workplace_transfer wt 
    ON COALESCE(wt.removed, 0) = 0
    AND wt.transfer_date <= LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH))
    AND (wt.finish_date IS NULL OR wt.finish_date > LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH)))
  INNER JOIN person p 
    ON p.id = wt.person_id
    AND p.customer_id = 642
    AND p.admission_date <= LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH))
    AND (p.demission_date IS NULL OR p.demission_date > LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH)))
  INNER JOIN workplace w ON w.id = wt.workplace_id
  WHERE w.business_unit_id IS NOT NULL
  GROUP BY reference_month, w.business_unit_id
)
SELECT
    c.customer_id,
    bu.id AS business_unit_id,
    bu.name AS business_unit_name,
    DATE_FORMAT(c.reference_date, '%Y-%m-01') AS reference_month,
    SUM(CASE WHEN c.clocking_type_id IN (1, 3) THEN 1 ELSE 0 END) AS clocking_count,
    SUM(CASE WHEN c.clocking_type_id = 1 AND c.clocking_origin_id IS NULL THEN 1 ELSE 0 END) AS registered_count,
    SUM(CASE WHEN c.clocking_type_id = 3 AND c.clocking_origin_id IS NOT NULL THEN 1 ELSE 0 END) AS justified_count,
    ROUND(
        SUM(CASE WHEN c.clocking_type_id = 1 AND c.clocking_origin_id IS NULL THEN 1 ELSE 0 END)
        / NULLIF(SUM(CASE WHEN c.clocking_type_id IN (1, 3) THEN 1 ELSE 0 END), 0) * 100,
        2
    ) AS quality_percentage,
    COUNT(DISTINCT c.person_id) AS headcount,
    COALESCE(ahc.active_headcount, 0) AS active_headcount
FROM clocking c
JOIN workplace w ON c.workplace_id = w.id
JOIN business_unit bu ON w.business_unit_id = bu.id
LEFT JOIN active_hc ahc 
  ON ahc.reference_month = DATE_FORMAT(c.reference_date, '%Y-%m-01')
  AND ahc.business_unit_id = bu.id
WHERE c.removed = 0
  AND c.customer_id = 642
  AND c.reference_date >= '2025-04-01'
  AND c.reference_date < '2026-04-01'
GROUP BY c.customer_id, bu.id, bu.name, DATE_FORMAT(c.reference_date, '%Y-%m-01'), ahc.active_headcount
ORDER BY reference_month;`;

const SQL_AREA = `WITH active_hc AS (
  SELECT 
    DATE_FORMAT(LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH)), '%Y-%m-01') AS reference_month,
    aw.area_id,
    COUNT(DISTINCT wt.person_id) AS active_headcount
  FROM (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
    UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 
    UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
  ) meses
  INNER JOIN workplace_transfer wt 
    ON COALESCE(wt.removed, 0) = 0
    AND wt.transfer_date <= LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH))
    AND (wt.finish_date IS NULL OR wt.finish_date > LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH)))
  INNER JOIN person p 
    ON p.id = wt.person_id
    AND p.customer_id = 642
    AND p.admission_date <= LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH))
    AND (p.demission_date IS NULL OR p.demission_date > LAST_DAY(DATE_ADD('2025-04-01', INTERVAL n MONTH)))
  INNER JOIN area_workplace aw ON aw.workplace_id = wt.workplace_id
  GROUP BY reference_month, aw.area_id
)
SELECT
    c.customer_id,
    ar.id AS area_id,
    ar.name AS area_name,
    DATE_FORMAT(c.reference_date, '%Y-%m-01') AS reference_month,
    SUM(CASE WHEN c.clocking_type_id IN (1, 3) THEN 1 ELSE 0 END) AS clocking_count,
    SUM(CASE WHEN c.clocking_type_id = 1 AND c.clocking_origin_id IS NULL THEN 1 ELSE 0 END) AS registered_count,
    SUM(CASE WHEN c.clocking_type_id = 3 AND c.clocking_origin_id IS NOT NULL THEN 1 ELSE 0 END) AS justified_count,
    ROUND(
        SUM(CASE WHEN c.clocking_type_id = 1 AND c.clocking_origin_id IS NULL THEN 1 ELSE 0 END)
        / NULLIF(SUM(CASE WHEN c.clocking_type_id IN (1, 3) THEN 1 ELSE 0 END), 0) * 100,
        2
    ) AS quality_percentage,
    COUNT(DISTINCT c.person_id) AS headcount,
    COALESCE(ahc.active_headcount, 0) AS active_headcount
FROM clocking c
JOIN workplace w ON c.workplace_id = w.id
JOIN area_workplace aw ON w.id = aw.workplace_id
JOIN area ar ON aw.area_id = ar.id
LEFT JOIN active_hc ahc 
  ON ahc.reference_month = DATE_FORMAT(c.reference_date, '%Y-%m-01')
  AND ahc.area_id = ar.id
WHERE c.removed = 0
  AND c.customer_id = 642
  AND c.reference_date >= '2025-04-01'
  AND c.reference_date < '2026-04-01'
GROUP BY c.customer_id, ar.id, ar.name, DATE_FORMAT(c.reference_date, '%Y-%m-01'), ahc.active_headcount
ORDER BY reference_month;`;

export const evolucaoQualidadeHeadcountSource: ChartDataSource = {
  empresa: { data: hcEmpresa as Record<string, any>[], sql: SQL_EMPRESA },
  unidade: { data: hcUnNegocio as Record<string, any>[], sql: SQL_UNIDADE },
  area: { data: hcArea as Record<string, any>[], sql: SQL_AREA },
};

export const evolucaoQualidadeHeadcountColumns = [
  { key: "reference_month", label: "Competência" },
  { key: "clocking_count", label: "Total Marcações" },
  { key: "registered_count", label: "Registradas" },
  { key: "justified_count", label: "Justificadas" },
  { key: "quality_percentage", label: "Qualidade (%)", format: (v: number) => `${v}%` },
  { key: "headcount", label: "Headcount (Ponto)" },
  { key: "active_headcount", label: "Headcount Ativo" },
];
