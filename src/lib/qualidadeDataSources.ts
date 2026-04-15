/**
 * TODO: REMOVER EM PRODUÇÃO — Data sources interface for multi-customer support.
 * Maps customerData from useQualidadePontoData to the formats expected by
 * ajustesData.ts and scoreComputations.ts functions.
 */

import type { QualidadePontoDatasets } from "@/hooks/useQualidadePontoData";

// ── Interface for injectable data sources ──
export interface QualidadeDataSources {
  // For scoreComputations: headcount (quality), tratativa-tempo (composicao/treatment), sobrecarga (backoffice)
  hc: { empresa: any[]; unidade: any[]; area: any[] };
  composicao: { empresa: any[]; unidade: any[]; area: any[] };
  esforco: { empresa: any[]; unidade: any[]; area: any[] };
  // For ajustesData: qualidade (derived from hc), ajustes (derived from hc+tratTempo), volume (derived from hc)
  qualidade: { empresa: any[]; unidade: any[]; area: any[] };
  ajustes: { empresa: any[]; unidade: any[]; area: any[] };
  volume: { empresa: any[]; unidade: any[]; area: any[] };
}

/**
 * Build QualidadeDataSources from the customerData hook output.
 * Maps field names from JSON format to the formats expected by computation functions.
 */
export function buildDataSources(cd: QualidadePontoDatasets): QualidadeDataSources {
  const safe = (arr: any) => Array.isArray(arr) ? arr : [];

  // hc data: used directly by scoreComputations (reference_month, registered_count, clocking_count, etc.)
  const hc = {
    empresa: safe(cd.hcEmpresa),
    unidade: safe(cd.hcUnidade),
    area: safe(cd.hcArea),
  };

  // composicao data: tratTempo JSONs have faixa fields + total_ajustes
  // scoreComputations expects: { company_name, reference_month, faixa_ate_1_dia, ... }
  // tratTempo uses company_name/business_unit_name/area_name - we normalize to company_name
  const mapComposicao = (arr: any[], nameField: string) =>
    safe(arr).map((r: any) => ({
      company_name: r[nameField] ?? "",
      reference_month: r.reference_month,
      total_ajustes: r.total_ajustes ?? 0,
      faixa_ate_1_dia: r.faixa_ate_1_dia ?? 0,
      faixa_1_3_dias: r.faixa_1_3_dias ?? 0,
      faixa_3_7_dias: r.faixa_3_7_dias ?? 0,
      faixa_7_15_dias: r.faixa_7_15_dias ?? 0,
      faixa_mais_15_dias: r.faixa_mais_15_dias ?? 0,
    }));

  const composicao = {
    empresa: mapComposicao(cd.tratTempoEmpresa, "company_name"),
    unidade: mapComposicao(cd.tratTempoUnidade, "business_unit_name"),
    area: mapComposicao(cd.tratTempoArea, "area_name"),
  };

  // esforco data: sobrecarga JSONs (competencia, qtd_ajustes, operadores_ativos, horas_extras_rateadas)
  const esforco = {
    empresa: safe(cd.sobrecargaEmpresa),
    unidade: safe(cd.sobrecargaUnidade),
    area: safe(cd.sobrecargaArea),
  };

  // qualidade data: derived from hc JSONs
  // ajustesData expects: { company_name, reference_month, total_marcacoes, registradas, justificadas, qualidade_percentual, headcount? }
  const mapQualidade = (arr: any[], nameField: string, idField: string) =>
    safe(arr).map((r: any) => ({
      company_id: r[idField] ?? 0,
      company_name: r[nameField] ?? "",
      // Also provide original field names for functions that use them
      business_unit_id: r.business_unit_id,
      business_unit_name: r.business_unit_name ?? r[nameField] ?? "",
      area_id: r.area_id,
      area_name: r.area_name ?? r[nameField] ?? "",
      reference_month: r.reference_month,
      total_marcacoes: r.clocking_count ?? 0,
      registradas: r.registered_count ?? 0,
      justificadas: r.justified_count ?? 0,
      qualidade_percentual: r.quality_percentage ?? 0,
      headcount: r.headcount ?? 0,
      active_headcount: r.active_headcount ?? 0,
    }));

  const qualidade = {
    empresa: mapQualidade(cd.hcEmpresa, "company_name", "company_id"),
    unidade: mapQualidade(cd.hcUnidade, "business_unit_name", "business_unit_id"),
    area: mapQualidade(cd.hcArea, "area_name", "area_id"),
  };

  // ajustes data: derived from hc (volume_marcacoes = clocking_count) + tratTempo (tempo_medio_dias = tempo_medio_horas/24)
  // ajustesData expects: { business_unit_name, reference_month, volume_marcacoes, tempo_medio_dias, headcount }
  const mapAjustes = (hcArr: any[], tratArr: any[], nameField: string) => {
    // Build tempo lookup: key = nameField + reference_month → tempo_medio_horas
    const tempoMap = new Map<string, number>();
    for (const r of safe(tratArr)) {
      const key = `${r[nameField]}|${r.reference_month}`;
      tempoMap.set(key, r.tempo_medio_horas ?? 0);
    }
    return safe(hcArr).map((r: any) => {
      const key = `${r[nameField]}|${r.reference_month}`;
      const tempoHoras = tempoMap.get(key) ?? 0;
      return {
        business_unit_id: r[nameField === "company_name" ? "company_id" : nameField === "business_unit_name" ? "business_unit_id" : "area_id"] ?? 0,
        business_unit_name: r[nameField] ?? "",
        reference_month: r.reference_month,
        volume_marcacoes: r.clocking_count ?? 0,
        tempo_medio_dias: +(tempoHoras / 24).toFixed(1),
        headcount: r.headcount ?? 0,
      };
    });
  };

  const ajustes = {
    empresa: mapAjustes(cd.hcEmpresa, cd.tratTempoEmpresa, "company_name"),
    unidade: mapAjustes(cd.hcUnidade, cd.tratTempoUnidade, "business_unit_name"),
    area: mapAjustes(cd.hcArea, cd.tratTempoArea, "area_name"),
  };

  // volume data: derived from hc (clocking_count, quality_percentage, headcount)
  const mapVolume = (arr: any[], nameField: string, idField: string) =>
    safe(arr).map((r: any) => ({
      company_id: r[idField] ?? 0,
      company_name: r[nameField] ?? "",
      reference_month: r.reference_month,
      clocking_count: r.clocking_count ?? 0,
      quality_percentage: r.quality_percentage ?? 0,
      headcount: r.headcount ?? 0,
    }));

  const volume = {
    empresa: mapVolume(cd.hcEmpresa, "company_name", "company_id"),
    unidade: mapVolume(cd.hcUnidade, "business_unit_name", "business_unit_id"),
    area: mapVolume(cd.hcArea, "area_name", "area_id"),
  };

  return { hc, composicao, esforco, qualidade, ajustes, volume };
}
