// TODO: REMOVER EM PRODUÇÃO — hook de carregamento dinâmico de dados por cliente
import { useState, useEffect, useMemo } from "react";
import { useCustomer } from "@/contexts/CustomerContext";

// Default static data (customer 642)
import defaultHcEmpresa from "@/data/qualidade-ponto/headcount-por-empresa.json";
import defaultHcUnidade from "@/data/qualidade-ponto/headcount-por-un-negocio.json";
import defaultHcArea from "@/data/qualidade-ponto/headcount-por-area.json";
import defaultTratEmpresa from "@/data/qualidade-ponto/tratativa-tempo-por-empresa.json";
import defaultTratUnidade from "@/data/qualidade-ponto/tratativa-tempo-por-un-negocio.json";
import defaultTratArea from "@/data/qualidade-ponto/tratativa-tempo-por-area.json";
import defaultSobrecargaEmpresa from "@/data/qualidade-ponto/sobrecarga-por-empresa.json";
import defaultSobrecargaUnidade from "@/data/qualidade-ponto/sobrecarga-por-un-negocio.json";
import defaultSobrecargaArea from "@/data/qualidade-ponto/sobrecarga-por-area.json";
import defaultDecomposicao from "@/data/qualidade-ponto/decomposicao-score.json";
import defaultKpisPeriodo from "@/data/qualidade-ponto/kpis-periodo-anterior.json";

import { loadChartDataFromStorage, loadCustomerFromStorage } from "@/components/analytics/CustomerZipImporter";

export interface QualidadePontoDatasets {
  hcEmpresa: any[];
  hcUnidade: any[];
  hcArea: any[];
  tratTempoEmpresa: any[];
  tratTempoUnidade: any[];
  tratTempoArea: any[];
  sobrecargaEmpresa: any[];
  sobrecargaUnidade: any[];
  sobrecargaArea: any[];
  decomposicaoScore: any;
  kpisPeriodoAnterior: any;
}

const BUILTIN_DEFAULT_DATASETS: QualidadePontoDatasets = {
  hcEmpresa: defaultHcEmpresa as any[],
  hcUnidade: defaultHcUnidade as any[],
  hcArea: defaultHcArea as any[],
  tratTempoEmpresa: defaultTratEmpresa as any[],
  tratTempoUnidade: defaultTratUnidade as any[],
  tratTempoArea: defaultTratArea as any[],
  sobrecargaEmpresa: defaultSobrecargaEmpresa as any[],
  sobrecargaUnidade: defaultSobrecargaUnidade as any[],
  sobrecargaArea: defaultSobrecargaArea as any[],
  decomposicaoScore: defaultDecomposicao,
  kpisPeriodoAnterior: defaultKpisPeriodo,
};

const EMPTY_DATASETS: QualidadePontoDatasets = {
  hcEmpresa: [],
  hcUnidade: [],
  hcArea: [],
  tratTempoEmpresa: [],
  tratTempoUnidade: [],
  tratTempoArea: [],
  sobrecargaEmpresa: [],
  sobrecargaUnidade: [],
  sobrecargaArea: [],
  decomposicaoScore: {},
  kpisPeriodoAnterior: {},
};

function getBaseDatasets(customerId: number): QualidadePontoDatasets {
  return customerId === 642 ? BUILTIN_DEFAULT_DATASETS : EMPTY_DATASETS;
}

/**
 * Mapping from ZIP chart slugs to the datasets they provide.
 * Each chart slug maps to: { filePrefix, description }
 * The ZIP stores data as: tabSlug → chartSlug → dimension (empresa/unidade/area)
 */
const CHART_TO_DATASET_MAP: Record<string, { datasetPrefix: string }> = {
  "evolucao-qualidade-headcount": { datasetPrefix: "hc" },
  "evolucao-tempo-tratativa": { datasetPrefix: "tratTempo" },
  "sobrecarga-backoffice": { datasetPrefix: "sobrecarga" },
};

const DIMENSION_MAP: Record<string, string> = {
  empresa: "Empresa",
  unidade: "Unidade",
  area: "Area",
};

function loadFromImported(customerId: number): Partial<QualidadePontoDatasets> | null {
  const customer = loadCustomerFromStorage(customerId);
  if (!customer) {
    console.log(`[useQualidadePontoData] No imported data for customer ${customerId}`);
    return null;
  }
  console.log(`[useQualidadePontoData] Loading imported data for ${customer.label} (${customerId})`,
    customer.menus.map(m => m.tabs.map(t => `${t.tabSlug}: ${t.charts.map(c => `${c.chartSlug}(${Object.keys(c.dimensions).join(',')})`).join(', ')}`)));

  const result: Partial<QualidadePontoDatasets> = {};

  for (const menu of customer.menus) {
    for (const tab of menu.tabs) {
      if (tab.tabSlug !== "qualidade-ponto") continue;
      for (const chart of tab.charts) {
        const mapping = CHART_TO_DATASET_MAP[chart.chartSlug];
        if (!mapping) continue;

        const { datasetPrefix } = mapping;
        if (chart.dimensions.empresa) {
          (result as any)[`${datasetPrefix}Empresa`] = chart.dimensions.empresa;
        }
        if (chart.dimensions.unidade) {
          (result as any)[`${datasetPrefix}Unidade`] = chart.dimensions.unidade;
        }
        if (chart.dimensions.area) {
          (result as any)[`${datasetPrefix}Area`] = chart.dimensions.area;
        }
      }
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Merge `pin` annotations from `pinSource` into `target` rows.
 * Match by name + reference_month (or `competencia` fallback).
 * Used to overlay editorial pins (defined in customer JSON files) onto
 * datasets that came from a ZIP import in localStorage (which lacks pins).
 */
function mergePinsInto(target: any[], pinSource: any[] | undefined): any[] {
  if (!Array.isArray(target) || !Array.isArray(pinSource) || pinSource.length === 0) return target;
  const NAME_FIELDS = ["company_name", "business_unit_name", "area_name"];
  const DATE_FIELDS = ["reference_month", "competencia"];
  const pinIndex = new Map<string, any>();
  for (const r of pinSource) {
    if (!r?.pin) continue;
    const name = NAME_FIELDS.map(f => r[f]).find(v => v != null);
    const date = DATE_FIELDS.map(f => r[f]).find(v => v != null);
    if (name == null || date == null) continue;
    pinIndex.set(`${name}__${date}`, r.pin);
  }
  if (pinIndex.size === 0) return target;
  return target.map(r => {
    if (r?.pin) return r;
    const name = NAME_FIELDS.map(f => r[f]).find(v => v != null);
    const date = DATE_FIELDS.map(f => r[f]).find(v => v != null);
    if (name == null || date == null) return r;
    const pin = pinIndex.get(`${name}__${date}`);
    return pin ? { ...r, pin } : r;
  });
}

export function useQualidadePontoData(): { data: QualidadePontoDatasets; loading: boolean } {
  const { customerId, loadCustomerData, customerDataVersion } = useCustomer();
  const [data, setData] = useState<QualidadePontoDatasets>(() => getBaseDatasets(customerId));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const baseData = getBaseDatasets(customerId);
      setLoading(true);
      if (!cancelled) setData(baseData);

      // Always load customer-specific files first (these contain editorial `pin` annotations)
      const fileKeys = [
        { key: "hcEmpresa", file: "headcount-por", dim: "empresa" },
        { key: "hcUnidade", file: "headcount-por", dim: "un-negocio" },
        { key: "hcArea", file: "headcount-por", dim: "area" },
        { key: "tratTempoEmpresa", file: "tratativa-tempo-por", dim: "empresa" },
        { key: "tratTempoUnidade", file: "tratativa-tempo-por", dim: "un-negocio" },
        { key: "tratTempoArea", file: "tratativa-tempo-por", dim: "area" },
        { key: "sobrecargaEmpresa", file: "sobrecarga-por", dim: "empresa" },
        { key: "sobrecargaUnidade", file: "sobrecarga-por", dim: "un-negocio" },
        { key: "sobrecargaArea", file: "sobrecarga-por", dim: "area" },
        { key: "decomposicaoScore", file: "decomposicao", dim: "score" },
        { key: "kpisPeriodoAnterior", file: "kpis-periodo", dim: "anterior" },
      ];

      const customerFileResults = await Promise.all(
        fileKeys.map(async ({ key, file, dim }) => {
          const result = await loadCustomerData("qualidade-ponto", file, dim);
          return { key, result };
        })
      );

      if (cancelled) return;

      const customerFileData: Partial<QualidadePontoDatasets> = {};
      for (const { key, result } of customerFileResults) {
        if (result) (customerFileData as any)[key] = result;
      }

      // Try imported (ZIP) data from localStorage; if present, OVERRIDE arrays
      // but MERGE editorial `pin` annotations from customer files.
      const imported = loadFromImported(customerId);

      const finalData: QualidadePontoDatasets = { ...baseData, ...customerFileData };
      if (imported) {
        for (const k of Object.keys(imported) as (keyof QualidadePontoDatasets)[]) {
          const importedArr = (imported as any)[k];
          if (!Array.isArray(importedArr)) {
            (finalData as any)[k] = importedArr;
            continue;
          }
          // Pin source priority: customer file > built-in default
          const pinSource = (customerFileData as any)[k] ?? (baseData as any)[k];
          (finalData as any)[k] = mergePinsInto(importedArr, pinSource);
        }
      }

      if (!cancelled) {
        setData(finalData);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [customerId, customerDataVersion, loadCustomerData]);

  return { data, loading };
}
