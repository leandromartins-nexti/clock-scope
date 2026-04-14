import { useState, useMemo, useEffect, useCallback } from "react";
import { Info, TrendingUp, TrendingDown, Minus as MinusIcon, Eraser, AlertTriangle, ArrowUpRight, ArrowDownRight, X, ExternalLink, Search, ArrowUpDown, LineChartIcon, BarChart3, AreaChartIcon, Percent, Hash, Database, Lock, ArrowUp, ArrowDown } from "lucide-react";
import ChartDataModal from "@/components/analytics/ChartDataModal";
import ChartModeToggle from "@/components/analytics/ChartModeToggle";
import type { DataMode, ChartMode } from "@/components/analytics/ChartModeToggle";
import IndicatorTable, { type TableColumn, getScoreColor, getScoreBg, getLineColor, TrendIcon } from "@/components/analytics/IndicatorTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine,
  ScatterChart, Scatter, ZAxis, Cell, LabelList,
} from "recharts";
import esforcoEmpresa from "@/data/qualidade-ponto/esforco-tratativa-por-empresa.json";
import esforcoUnNegocio from "@/data/qualidade-ponto/esforco-tratativa-por-un-negocio.json";
import esforcoArea from "@/data/qualidade-ponto/esforco-tratativa-por-area.json";
import hcEmpresaJson from "@/data/qualidade-ponto/headcount-por-empresa.json";
import hcUnNegocioJson from "@/data/qualidade-ponto/headcount-por-un-negocio.json";
import hcAreaJson from "@/data/qualidade-ponto/headcount-por-area.json";
import { aggregateAjustes, ajustesMeses, formatMesLabel, ajustesUnidades, ajustesAreas, ajustesEmpresas, aggregateComposicaoFaixas, aggregateQualidadeEvolucao, aggregateQualidadeEvolucaoDetalhado, aggregateQualidadeVolume, getQualidadeKpiSummary, getSidebarItems } from "@/lib/ajustesData";
import { useScoreConfig, getScoreClassification } from "@/contexts/ScoreConfigContext";
import { useAbsenteismoScoreConfig, computeAbsCompositeScore, getAbsScoreClassification } from "@/contexts/AbsenteismoScoreConfigContext";

import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import QualidadeInsightsSection from "@/components/analytics/QualidadeInsightsSection";

import qpDecomposicaoScore from "@/data/qualidade-ponto/decomposicao-score.json";
import qpKpisPeriodoAnterior from "@/data/qualidade-ponto/kpis-periodo-anterior.json";
import { evolucaoQualidadeHeadcountSource, evolucaoQualidadeHeadcountColumns } from "@/data/chart-sources/evolucao-qualidade-headcount";
function abreviar(nome: string): string {
  const words = nome.replace(/[-–]/g, " ").split(/\s+/).filter(w => w.length > 1);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return nome.slice(0, 2).toUpperCase();
}

// ══════════════════════════════════════════════════════════════
// Mock data
// ══════════════════════════════════════════════════════════════

// ── Re-export GroupBy from shared component ──
import GroupBySidebar, { type GroupBy, groupByOptions } from "@/components/analytics/GroupBySidebar";

// ── Sidebar data from real JSON ──
const empresaData = getSidebarItems("empresa").map(e => ({
  ...e,
  qualidade: e.score,
  tendencia: e.score >= 88 ? "melhorando" as const : e.score >= 75 ? "estavel" as const : "piorando" as const,
}));

const areaData = getSidebarItems("area").map(e => ({
  ...e,
  qualidade: e.score,
  tendencia: e.score >= 88 ? "melhorando" as const : e.score >= 85 ? "estavel" as const : "piorando" as const,
}));

const unidadeData = getSidebarItems("unidade").map(e => ({
  ...e,
  qualidade: e.score,
  tendencia: e.score >= 88 ? "melhorando" as const : e.score >= 85 ? "estavel" as const : "piorando" as const,
}));

// ── Generate scatter-compatible data from any entity list ──
function toScatterData(items: { nome: string; qualidade: number; score: number }[]) {
  function seededRand(s: number) {
    const x = Math.sin(s * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  }
  return items.map((item, i) => {
    const r1 = seededRand(i * 7 + item.qualidade * 13);
    const r2 = seededRand(i * 11 + item.qualidade * 17);
    const r3 = seededRand(i * 19 + item.qualidade * 23);
    const volume = Math.round(30000 + r1 * 250000);
    const headcount = Math.round(300 + r2 * 2700);
    // Items with lower quality → higher treatment time (more orange/red)
    const baselineDias = item.qualidade < 60 ? 6.5 : item.qualidade < 75 ? 4.5 : item.qualidade < 85 ? 3.0 : 2.0;
    const spread = item.qualidade < 70 ? 3.5 : 2.5;
    const dias = +(baselineDias + r3 * spread).toFixed(1);
    return {
      regional: item.nome,
      volume,
      qualidade: item.qualidade,
      headcount,
      dias,
    };
  });
}
const empresaScatter = toScatterData(empresaData);
const areaScatter = toScatterData(areaData);

// ── Scatter data (source of truth for all 30 regionals) ──
const scatterQualidade = [
  { regional: "Novo Hamburgo", volume: 268000, qualidade: 89.2, headcount: 2800 },
  { regional: "Ribeirão Preto", volume: 189000, qualidade: 86.8, headcount: 1900 },
  { regional: "Administração - Sede 2", volume: 152000, qualidade: 88.1, headcount: 1400 },
  { regional: "RHO", volume: 138000, qualidade: 87.5, headcount: 1100 },
  { regional: "Xangri-La", volume: 145000, qualidade: 82.4, headcount: 800 },
  { regional: "São José do Rio Preto", volume: 220000, qualidade: 90.1, headcount: 2200 },
  { regional: "Palmas", volume: 95000, qualidade: 84.5, headcount: 650 },
  { regional: "Goiânia", volume: 175000, qualidade: 87.9, headcount: 1600 },
  { regional: "Campinas", volume: 210000, qualidade: 88.5, headcount: 2100 },
  { regional: "Novo Hamburgo 2", volume: 112000, qualidade: 85.3, headcount: 900 },
  { regional: "Tramandaí", volume: 88000, qualidade: 83.8, headcount: 580 },
  { regional: "Sem Região", volume: 65000, qualidade: 81.2, headcount: 420 },
  { regional: "Tubarão", volume: 78000, qualidade: 84.1, headcount: 520 },
  { regional: "Curitiba Sul", volume: 185000, qualidade: 88.3, headcount: 1750 },
  { regional: "Cascavel", volume: 130000, qualidade: 86.5, headcount: 1050 },
  { regional: "Curitiba Norte", volume: 195000, qualidade: 89.0, headcount: 1850 },
  { regional: "Jaraguá do Sul", volume: 105000, qualidade: 85.8, headcount: 780 },
  { regional: "Rio do Sul", volume: 72000, qualidade: 83.2, headcount: 480 },
  { regional: "Chapecó", volume: 118000, qualidade: 86.9, headcount: 920 },
  { regional: "Capital ACL", volume: 245000, qualidade: 89.8, headcount: 2500 },
  { regional: "Gaspar", volume: 82000, qualidade: 84.7, headcount: 560 },
  { regional: "Criciúma", volume: 98000, qualidade: 85.1, headcount: 710 },
  { regional: "Lages", volume: 68000, qualidade: 82.8, headcount: 450 },
  { regional: "Joinville", volume: 205000, qualidade: 88.7, headcount: 2050 },
  { regional: "Blumenau", volume: 178000, qualidade: 87.6, headcount: 1650 },
  { regional: "Brusque", volume: 92000, qualidade: 85.5, headcount: 630 },
  { regional: "Itajaí", volume: 155000, qualidade: 87.2, headcount: 1350 },
  { regional: "Capital SEG", volume: 235000, qualidade: 89.5, headcount: 2400 },
  { regional: "Administração - Sede", volume: 142000, qualidade: 86.2, headcount: 1200 },
  { regional: "Unidade de Negócios", volume: 110000, qualidade: 84.0, headcount: 850 },
];

const scatterTratativa = [
  { regional: "Novo Hamburgo", volume: 268000, dias: 4.2, headcount: 2800 },
  { regional: "Ribeirão Preto", volume: 189000, dias: 6.8, headcount: 1900 },
  { regional: "Administração - Sede 2", volume: 152000, dias: 5.5, headcount: 1400 },
  { regional: "RHO", volume: 138000, dias: 7.1, headcount: 1100 },
  { regional: "Xangri-La", volume: 145000, dias: 8.3, headcount: 800 },
  { regional: "São José do Rio Preto", volume: 220000, dias: 3.8, headcount: 2200 },
  { regional: "Palmas", volume: 95000, dias: 7.8, headcount: 650 },
  { regional: "Goiânia", volume: 175000, dias: 5.9, headcount: 1600 },
  { regional: "Campinas", volume: 210000, dias: 4.5, headcount: 2100 },
  { regional: "Novo Hamburgo 2", volume: 112000, dias: 6.5, headcount: 900 },
  { regional: "Tramandaí", volume: 88000, dias: 7.5, headcount: 580 },
  { regional: "Sem Região", volume: 65000, dias: 9.1, headcount: 420 },
  { regional: "Tubarão", volume: 78000, dias: 7.2, headcount: 520 },
  { regional: "Curitiba Sul", volume: 185000, dias: 5.1, headcount: 1750 },
  { regional: "Cascavel", volume: 130000, dias: 6.2, headcount: 1050 },
  { regional: "Curitiba Norte", volume: 195000, dias: 4.8, headcount: 1850 },
  { regional: "Jaraguá do Sul", volume: 105000, dias: 6.8, headcount: 780 },
  { regional: "Rio do Sul", volume: 72000, dias: 8.0, headcount: 480 },
  { regional: "Chapecó", volume: 118000, dias: 6.0, headcount: 920 },
  { regional: "Capital ACL", volume: 245000, dias: 3.5, headcount: 2500 },
  { regional: "Gaspar", volume: 82000, dias: 7.3, headcount: 560 },
  { regional: "Criciúma", volume: 98000, dias: 6.9, headcount: 710 },
  { regional: "Lages", volume: 68000, dias: 8.5, headcount: 450 },
  { regional: "Joinville", volume: 205000, dias: 4.3, headcount: 2050 },
  { regional: "Blumenau", volume: 178000, dias: 5.6, headcount: 1650 },
  { regional: "Brusque", volume: 92000, dias: 6.7, headcount: 630 },
  { regional: "Itajaí", volume: 155000, dias: 5.8, headcount: 1350 },
  { regional: "Capital SEG", volume: 235000, dias: 3.9, headcount: 2400 },
  { regional: "Administração - Sede", volume: 142000, dias: 6.3, headcount: 1200 },
  { regional: "Unidade de Negócios", volume: 110000, dias: 7.0, headcount: 850 },
];

// qualidadeEvolucao is now computed dynamically inside QualidadeContent via aggregateQualidadeEvolucao

// Derive all 30 regionais from scatter data
const qualidadeRegionais = scatterQualidade.map(sq => {
  const st = scatterTratativa.find(t => t.regional === sq.regional);
  const qualidade = sq.qualidade;
  const tendencia = qualidade >= 88 ? "melhorando" : qualidade >= 85 ? "estavel" : "piorando";
  const registradas = Math.round(qualidade);
  const justificadas = 100 - registradas;
  const atrasos = +(100 - qualidade).toFixed(1);
  return { nome: sq.regional, qualidade, atrasos, registradas, justificadas, tendencia, volume: sq.volume, headcount: sq.headcount, tratativa: st?.dias ?? 6 };
});

// evolucaoTratativaFaixas is now computed dynamically inside QualidadeContent via aggregateComposicaoFaixas

// ── Absenteísmo (dados reais Vig Eyes) ──
const absenteismoEvolucao = [
  { mes: "abr/25", value: 13.0, ausencias: 5587 },
  { mes: "mai/25", value: 15.21, ausencias: 6678 },
  { mes: "jun/25", value: 13.99, ausencias: 5955 },
  { mes: "jul/25", value: 14.51, ausencias: 6406 },
  { mes: "ago/25", value: 13.46, ausencias: 5889 },
  { mes: "set/25", value: 10.4, ausencias: 6875 },
  { mes: "out/25", value: 16.43, ausencias: 12986 },
  { mes: "nov/25", value: 16.46, ausencias: 12125 },
  { mes: "dez/25", value: 17.98, ausencias: 13818 },
  { mes: "jan/26", value: 14.49, ausencias: 10984 },
  { mes: "fev/26", value: 19.2, ausencias: 13948 },
  { mes: "mar/26", value: 13.67, ausencias: 10857 },
];
const absenteismoMedia = 14.9;

// Evolução por empresa (dados reais)
const absenteismoEvolucaoPorEmpresa: Record<string, { mes: string; value: number; ausencias: number }[]> = {
  "SEGURANCA PATRIMONIAL": [
    { mes: "abr/25", value: 7.13, ausencias: 144 }, { mes: "mai/25", value: 10.0, ausencias: 207 },
    { mes: "jun/25", value: 20.81, ausencias: 423 }, { mes: "jul/25", value: 29.98, ausencias: 636 },
    { mes: "ago/25", value: 9.65, ausencias: 208 }, { mes: "set/25", value: 20.89, ausencias: 420 },
    { mes: "out/25", value: 13.89, ausencias: 272 }, { mes: "nov/25", value: 13.36, ausencias: 242 },
    { mes: "dez/25", value: 4.9, ausencias: 93 }, { mes: "jan/26", value: 3.36, ausencias: 64 },
    { mes: "fev/26", value: 8.68, ausencias: 150 }, { mes: "mar/26", value: 9.53, ausencias: 183 },
  ],
  "PORTARIA E LIMPEZA": [
    { mes: "abr/25", value: 13.21, ausencias: 4988 }, { mes: "mai/25", value: 15.8, ausencias: 6096 },
    { mes: "jun/25", value: 13.64, ausencias: 5094 }, { mes: "jul/25", value: 13.33, ausencias: 5183 },
    { mes: "ago/25", value: 14.15, ausencias: 5488 }, { mes: "set/25", value: 9.85, ausencias: 6041 },
    { mes: "out/25", value: 16.76, ausencias: 12475 }, { mes: "nov/25", value: 17.03, ausencias: 11738 },
    { mes: "dez/25", value: 18.92, ausencias: 13461 }, { mes: "jan/26", value: 14.8, ausencias: 10373 },
    { mes: "fev/26", value: 19.57, ausencias: 13217 }, { mes: "mar/26", value: 12.86, ausencias: 9538 },
  ],
  "TERCEIRIZACAO": [
    { mes: "abr/25", value: 14.22, ausencias: 455 }, { mes: "mai/25", value: 11.47, ausencias: 375 },
    { mes: "jun/25", value: 13.83, ausencias: 439 }, { mes: "jul/25", value: 18.64, ausencias: 587 },
    { mes: "ago/25", value: 6.87, ausencias: 194 }, { mes: "set/25", value: 14.98, ausencias: 414 },
    { mes: "out/25", value: 9.1, ausencias: 240 }, { mes: "nov/25", value: 4.97, ausencias: 145 },
    { mes: "dez/25", value: 6.95, ausencias: 264 }, { mes: "jan/26", value: 14.26, ausencias: 547 },
    { mes: "fev/26", value: 17.25, ausencias: 581 }, { mes: "mar/26", value: 34.13, ausencias: 1136 },
  ],
};

// Evolução por unidade de negócio (dados reais)
const absenteismoEvolucaoPorUnidade: Record<string, { mes: string; value: number; ausencias: number }[]> = {
  "PORTARIA E LIMPEZA": [
    { mes: "abr/25", value: 13.41, ausencias: 4824 }, { mes: "mai/25", value: 15.36, ausencias: 5697 },
    { mes: "jun/25", value: 13.35, ausencias: 4824 }, { mes: "jul/25", value: 13.6, ausencias: 5109 },
    { mes: "ago/25", value: 13.85, ausencias: 5122 }, { mes: "set/25", value: 10.27, ausencias: 6106 },
    { mes: "out/25", value: 16.8, ausencias: 12108 }, { mes: "nov/25", value: 16.54, ausencias: 10907 },
    { mes: "dez/25", value: 18.96, ausencias: 12932 }, { mes: "jan/26", value: 15.1, ausencias: 10213 },
    { mes: "fev/26", value: 19.79, ausencias: 12981 }, { mes: "mar/26", value: 12.67, ausencias: 9099 },
  ],
  "SEGURANCA PATRIMONIAL": [
    { mes: "abr/25", value: 4.6, ausencias: 150 }, { mes: "mai/25", value: 14.46, ausencias: 458 },
    { mes: "jun/25", value: 15.64, ausencias: 452 }, { mes: "jul/25", value: 23.44, ausencias: 725 },
    { mes: "ago/25", value: 11.19, ausencias: 396 }, { mes: "set/25", value: 11.11, ausencias: 372 },
    { mes: "out/25", value: 16.71, ausencias: 569 }, { mes: "nov/25", value: 20.82, ausencias: 725 },
    { mes: "dez/25", value: 10.86, ausencias: 393 }, { mes: "jan/26", value: 5.42, ausencias: 187 },
    { mes: "fev/26", value: 16.39, ausencias: 543 }, { mes: "mar/26", value: 17.41, ausencias: 653 },
  ],
  "TERCEIRIZACAO": [
    { mes: "abr/25", value: 16.44, ausencias: 613 }, { mes: "mai/25", value: 14.25, ausencias: 523 },
    { mes: "jun/25", value: 19.41, ausencias: 679 }, { mes: "jul/25", value: 16.58, ausencias: 573 },
    { mes: "ago/25", value: 11.54, ausencias: 371 }, { mes: "set/25", value: 12.03, ausencias: 397 },
    { mes: "out/25", value: 8.66, ausencias: 305 }, { mes: "nov/25", value: 11.72, ausencias: 493 },
    { mes: "dez/25", value: 8.65, ausencias: 422 }, { mes: "jan/26", value: 12.41, ausencias: 584 },
    { mes: "fev/26", value: 11.31, ausencias: 424 }, { mes: "mar/26", value: 28.68, ausencias: 1106 },
  ],
};

// Evolução por área (dados reais)
const absenteismoEvolucaoPorArea: Record<string, { mes: string; value: number; ausencias: number }[]> = {
  "PIRACICABA": [
    { mes: "abr/25", value: 3.11, ausencias: 46 }, { mes: "mai/25", value: 14.43, ausencias: 197 }, { mes: "jun/25", value: 24.73, ausencias: 286 }, { mes: "jul/25", value: 22.1, ausencias: 294 }, { mes: "ago/25", value: 13.2, ausencias: 203 }, { mes: "set/25", value: 15.4, ausencias: 220 }, { mes: "out/25", value: 17.74, ausencias: 256 }, { mes: "nov/25", value: 26.12, ausencias: 390 }, { mes: "dez/25", value: 13.5, ausencias: 196 }, { mes: "jan/26", value: 6.76, ausencias: 97 }, { mes: "fev/26", value: 22.27, ausencias: 310 }, { mes: "mar/26", value: 22.63, ausencias: 359 },
  ],
  "SAO PAULO": [
    { mes: "abr/25", value: 10.67, ausencias: 908 }, { mes: "mai/25", value: 13.76, ausencias: 1221 }, { mes: "jun/25", value: 20.03, ausencias: 1709 }, { mes: "jul/25", value: 15.9, ausencias: 1335 }, { mes: "ago/25", value: 14.95, ausencias: 1265 }, { mes: "set/25", value: 14.32, ausencias: 1159 }, { mes: "out/25", value: 11.84, ausencias: 981 }, { mes: "nov/25", value: 16.83, ausencias: 1409 }, { mes: "dez/25", value: 7.8, ausencias: 664 }, { mes: "jan/26", value: 11.3, ausencias: 983 }, { mes: "fev/26", value: 15.17, ausencias: 1300 }, { mes: "mar/26", value: 19.24, ausencias: 1780 },
  ],
  "SOROCABA": [
    { mes: "abr/25", value: 22.13, ausencias: 154 }, { mes: "mai/25", value: 20.26, ausencias: 139 }, { mes: "jun/25", value: 34.35, ausencias: 225 }, { mes: "jul/25", value: 1.51, ausencias: 11 }, { mes: "ago/25", value: 0.07, ausencias: 0 }, { mes: "set/25", value: 9.3, ausencias: 179 }, { mes: "out/25", value: 18.09, ausencias: 484 }, { mes: "nov/25", value: 27.2, ausencias: 542 }, { mes: "dez/25", value: 31.99, ausencias: 653 }, { mes: "jan/26", value: 8.94, ausencias: 194 }, { mes: "fev/26", value: 12.21, ausencias: 242 }, { mes: "mar/26", value: 4.51, ausencias: 102 },
  ],
};

// Real area scatter data from JSON
const realAreaAbsScatter = [
  { regional: "PIRACICABA", absenteismo: 16.83, turnover: 7.6, he: 421, headcount: 9 },
  { regional: "SAO PAULO", absenteismo: 14.32, turnover: 6.4, he: 358, headcount: 52 },
  { regional: "SOROCABA", absenteismo: 15.88, turnover: 7.1, he: 397, headcount: 10 },
];

type TurnoverEvoRow = { mes: string; turnover_exit: number; turnover_entry: number; terminations: number; hires: number; avg_headcount: number };

const turnoverEvolucaoPorEmpresa: Record<string, TurnoverEvoRow[]> = {
  "PORTARIA E LIMPEZA": [
    { mes: "abr/25", turnover_exit: 1.35, turnover_entry: 0.0, terminations: 3, hires: 0, avg_headcount: 223 },
    { mes: "mai/25", turnover_exit: 5.48, turnover_entry: 3.65, terminations: 12, hires: 8, avg_headcount: 219 },
    { mes: "jun/25", turnover_exit: 3.2, turnover_entry: 5.02, terminations: 7, hires: 11, avg_headcount: 219 },
    { mes: "jul/25", turnover_exit: 3.15, turnover_entry: 5.39, terminations: 7, hires: 12, avg_headcount: 223 },
    { mes: "ago/25", turnover_exit: 7.24, turnover_entry: 2.71, terminations: 16, hires: 6, avg_headcount: 221 },
    { mes: "set/25", turnover_exit: 5.08, turnover_entry: 67.62, terminations: 16, hires: 213, avg_headcount: 315 },
    { mes: "out/25", turnover_exit: 3.14, turnover_entry: 3.86, terminations: 13, hires: 16, avg_headcount: 415 },
    { mes: "nov/25", turnover_exit: 2.88, turnover_entry: 3.12, terminations: 12, hires: 13, avg_headcount: 417 },
    { mes: "dez/25", turnover_exit: 5.31, turnover_entry: 4.1, terminations: 22, hires: 17, avg_headcount: 415 },
    { mes: "jan/26", turnover_exit: 1.89, turnover_entry: 7.32, terminations: 8, hires: 31, avg_headcount: 424 },
    { mes: "fev/26", turnover_exit: 2.71, turnover_entry: 4.97, terminations: 12, hires: 22, avg_headcount: 443 },
    { mes: "mar/26", turnover_exit: 1.33, turnover_entry: 2.43, terminations: 6, hires: 11, avg_headcount: 453 },
  ],
  "SEGURANCA PATRIMONIAL": [
    { mes: "abr/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 13 },
    { mes: "mai/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 13 },
    { mes: "jun/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 13 },
    { mes: "jul/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 13 },
    { mes: "ago/25", turnover_exit: 7.69, turnover_entry: 7.69, terminations: 1, hires: 1, avg_headcount: 13 },
    { mes: "set/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 13 },
    { mes: "out/25", turnover_exit: 8.0, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 13 },
    { mes: "nov/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 12 },
    { mes: "dez/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 12 },
    { mes: "jan/26", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 12 },
    { mes: "fev/26", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 12 },
    { mes: "mar/26", turnover_exit: 8.33, turnover_entry: 8.33, terminations: 1, hires: 1, avg_headcount: 12 },
  ],
  "TERCEIRIZACAO": [
    { mes: "abr/25", turnover_exit: 28.57, turnover_entry: 11.43, terminations: 5, hires: 2, avg_headcount: 18 },
    { mes: "mai/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 17 },
    { mes: "jun/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 17 },
    { mes: "jul/25", turnover_exit: 6.06, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 17 },
    { mes: "ago/25", turnover_exit: 6.25, turnover_entry: 6.25, terminations: 1, hires: 1, avg_headcount: 16 },
    { mes: "set/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 16 },
    { mes: "out/25", turnover_exit: 6.67, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 15 },
    { mes: "nov/25", turnover_exit: 0.0, turnover_entry: 28.57, terminations: 0, hires: 5, avg_headcount: 18 },
    { mes: "dez/25", turnover_exit: 0.0, turnover_entry: 9.3, terminations: 0, hires: 2, avg_headcount: 22 },
    { mes: "jan/26", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 22 },
    { mes: "fev/26", turnover_exit: 9.52, turnover_entry: 0.0, terminations: 2, hires: 0, avg_headcount: 21 },
    { mes: "mar/26", turnover_exit: 5.13, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 20 },
  ],
};

const turnoverEvolucaoPorUnidade: Record<string, TurnoverEvoRow[]> = {
  "PORTARIA E LIMPEZA": [
    { mes: "abr/25", turnover_exit: 1.44, turnover_entry: 0.0, terminations: 3, hires: 0, avg_headcount: 208 },
    { mes: "mai/25", turnover_exit: 5.35, turnover_entry: 3.41, terminations: 11, hires: 7, avg_headcount: 206 },
    { mes: "jun/25", turnover_exit: 1.95, turnover_entry: 3.9, terminations: 4, hires: 8, avg_headcount: 205 },
    { mes: "jul/25", turnover_exit: 2.39, turnover_entry: 4.78, terminations: 5, hires: 10, avg_headcount: 209 },
    { mes: "ago/25", turnover_exit: 6.81, turnover_entry: 2.38, terminations: 14, hires: 5, avg_headcount: 206 },
    { mes: "set/25", turnover_exit: 4.67, turnover_entry: 65.54, terminations: 14, hires: 197, avg_headcount: 300 },
    { mes: "out/25", turnover_exit: 3.54, turnover_entry: 3.79, terminations: 14, hires: 15, avg_headcount: 395 },
    { mes: "nov/25", turnover_exit: 2.52, turnover_entry: 2.77, terminations: 10, hires: 11, avg_headcount: 397 },
    { mes: "dez/25", turnover_exit: 5.56, turnover_entry: 4.04, terminations: 22, hires: 16, avg_headcount: 396 },
    { mes: "jan/26", turnover_exit: 1.98, turnover_entry: 7.18, terminations: 8, hires: 29, avg_headcount: 404 },
    { mes: "fev/26", turnover_exit: 3.33, turnover_entry: 4.76, terminations: 14, hires: 20, avg_headcount: 420 },
    { mes: "mar/26", turnover_exit: 0.46, turnover_entry: 2.32, terminations: 2, hires: 10, avg_headcount: 431 },
  ],
  "SEGURANCA PATRIMONIAL": [
    { mes: "abr/25", turnover_exit: 4.08, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 24 },
    { mes: "mai/25", turnover_exit: 4.26, turnover_entry: 4.26, terminations: 1, hires: 1, avg_headcount: 23 },
    { mes: "jun/25", turnover_exit: 12.77, turnover_entry: 8.51, terminations: 3, hires: 2, avg_headcount: 24 },
    { mes: "jul/25", turnover_exit: 8.33, turnover_entry: 4.17, terminations: 2, hires: 1, avg_headcount: 24 },
    { mes: "ago/25", turnover_exit: 11.54, turnover_entry: 7.69, terminations: 3, hires: 2, avg_headcount: 26 },
    { mes: "set/25", turnover_exit: 7.69, turnover_entry: 3.85, terminations: 2, hires: 1, avg_headcount: 26 },
    { mes: "out/25", turnover_exit: 0.0, turnover_entry: 3.85, terminations: 0, hires: 1, avg_headcount: 26 },
    { mes: "nov/25", turnover_exit: 7.69, turnover_entry: 3.85, terminations: 2, hires: 1, avg_headcount: 26 },
    { mes: "dez/25", turnover_exit: 0.0, turnover_entry: 4.0, terminations: 0, hires: 1, avg_headcount: 25 },
    { mes: "jan/26", turnover_exit: 0.0, turnover_entry: 3.85, terminations: 0, hires: 1, avg_headcount: 26 },
    { mes: "fev/26", turnover_exit: 0.0, turnover_entry: 3.85, terminations: 0, hires: 1, avg_headcount: 26 },
    { mes: "mar/26", turnover_exit: 7.55, turnover_entry: 3.77, terminations: 2, hires: 1, avg_headcount: 26 },
  ],
  "TERCEIRIZACAO": [
    { mes: "abr/25", turnover_exit: 19.51, turnover_entry: 9.76, terminations: 4, hires: 2, avg_headcount: 21 },
    { mes: "mai/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 19 },
    { mes: "jun/25", turnover_exit: 0.0, turnover_entry: 5.26, terminations: 0, hires: 1, avg_headcount: 19 },
    { mes: "jul/25", turnover_exit: 5.26, turnover_entry: 5.26, terminations: 1, hires: 1, avg_headcount: 19 },
    { mes: "ago/25", turnover_exit: 5.41, turnover_entry: 5.41, terminations: 1, hires: 1, avg_headcount: 18 },
    { mes: "set/25", turnover_exit: 0.0, turnover_entry: 5.56, terminations: 0, hires: 1, avg_headcount: 18 },
    { mes: "out/25", turnover_exit: 5.13, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 19 },
    { mes: "nov/25", turnover_exit: 0.0, turnover_entry: 26.32, terminations: 0, hires: 5, avg_headcount: 19 },
    { mes: "dez/25", turnover_exit: 0.0, turnover_entry: 8.7, terminations: 0, hires: 2, avg_headcount: 23 },
    { mes: "jan/26", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 23 },
    { mes: "fev/26", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 23 },
    { mes: "mar/26", turnover_exit: 16.0, turnover_entry: 0.0, terminations: 4, hires: 0, avg_headcount: 25 },
  ],
};

const turnoverEvolucaoPorArea: Record<string, TurnoverEvoRow[]> = {
  "PIRACICABA": [
    { mes: "abr/25", turnover_exit: 10.53, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 10 },
    { mes: "mai/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 9 },
    { mes: "jun/25", turnover_exit: 22.22, turnover_entry: 22.22, terminations: 2, hires: 2, avg_headcount: 9 },
    { mes: "jul/25", turnover_exit: 0.0, turnover_entry: 10.53, terminations: 0, hires: 1, avg_headcount: 10 },
    { mes: "ago/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 10 },
    { mes: "set/25", turnover_exit: 10.53, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 10 },
    { mes: "out/25", turnover_exit: 0.0, turnover_entry: 10.53, terminations: 0, hires: 1, avg_headcount: 10 },
    { mes: "nov/25", turnover_exit: 10.53, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 10 },
    { mes: "dez/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 9 },
    { mes: "jan/26", turnover_exit: 0.0, turnover_entry: 10.53, terminations: 0, hires: 1, avg_headcount: 10 },
    { mes: "fev/26", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 10 },
    { mes: "mar/26", turnover_exit: 10.0, turnover_entry: 10.0, terminations: 1, hires: 1, avg_headcount: 10 },
  ],
  "SAO PAULO": [
    { mes: "abr/25", turnover_exit: 6.25, turnover_entry: 4.17, terminations: 3, hires: 2, avg_headcount: 48 },
    { mes: "mai/25", turnover_exit: 2.11, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 48 },
    { mes: "jun/25", turnover_exit: 6.32, turnover_entry: 8.42, terminations: 3, hires: 4, avg_headcount: 48 },
    { mes: "jul/25", turnover_exit: 8.6, turnover_entry: 6.45, terminations: 4, hires: 3, avg_headcount: 47 },
    { mes: "ago/25", turnover_exit: 10.53, turnover_entry: 12.63, terminations: 5, hires: 6, avg_headcount: 48 },
    { mes: "set/25", turnover_exit: 4.17, turnover_entry: 4.17, terminations: 2, hires: 2, avg_headcount: 48 },
    { mes: "out/25", turnover_exit: 8.25, turnover_entry: 12.37, terminations: 4, hires: 6, avg_headcount: 49 },
    { mes: "nov/25", turnover_exit: 3.88, turnover_entry: 9.71, terminations: 2, hires: 5, avg_headcount: 52 },
    { mes: "dez/25", turnover_exit: 1.83, turnover_entry: 5.5, terminations: 1, hires: 3, avg_headcount: 55 },
    { mes: "jan/26", turnover_exit: 1.79, turnover_entry: 5.36, terminations: 1, hires: 3, avg_headcount: 56 },
    { mes: "fev/26", turnover_exit: 5.31, turnover_entry: 3.54, terminations: 3, hires: 2, avg_headcount: 57 },
    { mes: "mar/26", turnover_exit: 7.34, turnover_entry: 1.83, terminations: 4, hires: 1, avg_headcount: 55 },
  ],
  "SOROCABA": [
    { mes: "abr/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 3 },
    { mes: "mai/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 3 },
    { mes: "jun/25", turnover_exit: 0.0, turnover_entry: 50.0, terminations: 0, hires: 2, avg_headcount: 4 },
    { mes: "jul/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 5 },
    { mes: "ago/25", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 5 },
    { mes: "set/25", turnover_exit: 0.0, turnover_entry: 88.89, terminations: 0, hires: 8, avg_headcount: 9 },
    { mes: "out/25", turnover_exit: 8.0, turnover_entry: 0.0, terminations: 1, hires: 0, avg_headcount: 13 },
    { mes: "nov/25", turnover_exit: 7.69, turnover_entry: 23.08, terminations: 1, hires: 3, avg_headcount: 13 },
    { mes: "dez/25", turnover_exit: 21.43, turnover_entry: 21.43, terminations: 3, hires: 3, avg_headcount: 14 },
    { mes: "jan/26", turnover_exit: 6.67, turnover_entry: 20.0, terminations: 1, hires: 3, avg_headcount: 15 },
    { mes: "fev/26", turnover_exit: 5.88, turnover_entry: 11.76, terminations: 1, hires: 2, avg_headcount: 17 },
    { mes: "mar/26", turnover_exit: 0.0, turnover_entry: 0.0, terminations: 0, hires: 0, avg_headcount: 18 },
  ],
};

// Aggregate turnover across all groups (weighted by headcount)
function aggregateTurnoverEvo(map: Record<string, TurnoverEvoRow[]>): TurnoverEvoRow[] {
  const byMes: Record<string, { terminations: number; hires: number; totalHC: number }> = {};
  for (const rows of Object.values(map)) {
    for (const r of rows) {
      if (!byMes[r.mes]) byMes[r.mes] = { terminations: 0, hires: 0, totalHC: 0 };
      byMes[r.mes].terminations += r.terminations;
      byMes[r.mes].hires += r.hires;
      byMes[r.mes].totalHC += r.avg_headcount;
    }
  }
  const meses = ["abr/25","mai/25","jun/25","jul/25","ago/25","set/25","out/25","nov/25","dez/25","jan/26","fev/26","mar/26"];
  return meses.map(mes => {
    const d = byMes[mes] || { terminations: 0, hires: 0, totalHC: 1 };
    return {
      mes,
      turnover_exit: +(d.terminations / d.totalHC * 100).toFixed(2),
      turnover_entry: +(d.hires / d.totalHC * 100).toFixed(2),
      terminations: d.terminations,
      hires: d.hires,
      avg_headcount: d.totalHC,
    };
  });
}

const turnoverEvolucao = aggregateTurnoverEvo(turnoverEvolucaoPorEmpresa);
const turnoverMedia = turnoverEvolucao.reduce((s, d) => s + d.turnover_exit, 0) / turnoverEvolucao.length;

// Abs vs Turnover monthly data per empresa (from real JSON)
const absVsTurnoverPorEmpresa: Record<string, { mes: string; absenteismo: number; turnover: number; headcount: number; desligamentos: number }[]> = {
  "PORTARIA E LIMPEZA": [
    { mes: "abr/25", absenteismo: 13.21, turnover: 1.38, headcount: 218, desligamentos: 3 },
    { mes: "mai/25", absenteismo: 15.80, turnover: 5.38, headcount: 223, desligamentos: 12 },
    { mes: "jun/25", absenteismo: 13.64, turnover: 3.15, headcount: 222, desligamentos: 7 },
    { mes: "jul/25", absenteismo: 13.33, turnover: 3.11, headcount: 225, desligamentos: 7 },
    { mes: "ago/25", absenteismo: 14.15, turnover: 7.11, headcount: 225, desligamentos: 16 },
    { mes: "set/25", absenteismo: 9.85, turnover: 3.83, headcount: 418, desligamentos: 16 },
    { mes: "out/25", absenteismo: 16.76, turnover: 3.10, headcount: 420, desligamentos: 13 },
    { mes: "nov/25", absenteismo: 17.03, turnover: 2.96, headcount: 405, desligamentos: 12 },
    { mes: "dez/25", absenteismo: 18.92, turnover: 5.41, headcount: 407, desligamentos: 22 },
    { mes: "jan/26", absenteismo: 14.80, turnover: 1.96, headcount: 408, desligamentos: 8 },
    { mes: "fev/26", absenteismo: 19.57, turnover: 2.88, headcount: 417, desligamentos: 12 },
    { mes: "mar/26", absenteismo: 12.86, turnover: 1.44, headcount: 417, desligamentos: 6 },
  ],
  "TERCEIRIZACAO": [
    { mes: "abr/25", absenteismo: 14.22, turnover: 25.00, headcount: 20, desligamentos: 5 },
    { mes: "mai/25", absenteismo: 11.47, turnover: 0.00, headcount: 17, desligamentos: 0 },
    { mes: "jun/25", absenteismo: 13.83, turnover: 0.00, headcount: 17, desligamentos: 0 },
    { mes: "jul/25", absenteismo: 18.64, turnover: 5.88, headcount: 17, desligamentos: 1 },
    { mes: "ago/25", absenteismo: 6.87, turnover: 5.88, headcount: 17, desligamentos: 1 },
    { mes: "set/25", absenteismo: 14.98, turnover: 0.00, headcount: 16, desligamentos: 0 },
    { mes: "out/25", absenteismo: 9.10, turnover: 6.67, headcount: 15, desligamentos: 1 },
    { mes: "nov/25", absenteismo: 4.97, turnover: 0.00, headcount: 20, desligamentos: 0 },
    { mes: "dez/25", absenteismo: 6.95, turnover: 0.00, headcount: 22, desligamentos: 0 },
    { mes: "jan/26", absenteismo: 14.26, turnover: 0.00, headcount: 22, desligamentos: 0 },
    { mes: "fev/26", absenteismo: 17.25, turnover: 9.09, headcount: 22, desligamentos: 2 },
    { mes: "mar/26", absenteismo: 34.13, turnover: 4.76, headcount: 21, desligamentos: 1 },
  ],
  "SEGURANCA PATRIMONIAL": [
    { mes: "abr/25", absenteismo: 7.13, turnover: 0.00, headcount: 12, desligamentos: 0 },
    { mes: "mai/25", absenteismo: 10.00, turnover: 0.00, headcount: 12, desligamentos: 0 },
    { mes: "jun/25", absenteismo: 20.81, turnover: 0.00, headcount: 12, desligamentos: 0 },
    { mes: "jul/25", absenteismo: 29.98, turnover: 0.00, headcount: 12, desligamentos: 0 },
    { mes: "ago/25", absenteismo: 9.65, turnover: 7.69, headcount: 13, desligamentos: 1 },
    { mes: "set/25", absenteismo: 20.89, turnover: 0.00, headcount: 12, desligamentos: 0 },
    { mes: "out/25", absenteismo: 13.89, turnover: 8.33, headcount: 12, desligamentos: 1 },
    { mes: "nov/25", absenteismo: 13.36, turnover: 0.00, headcount: 11, desligamentos: 0 },
    { mes: "dez/25", absenteismo: 4.90, turnover: 0.00, headcount: 11, desligamentos: 0 },
    { mes: "jan/26", absenteismo: 3.36, turnover: 0.00, headcount: 11, desligamentos: 0 },
    { mes: "fev/26", absenteismo: 8.68, turnover: 0.00, headcount: 11, desligamentos: 0 },
    { mes: "mar/26", absenteismo: 9.53, turnover: 8.33, headcount: 12, desligamentos: 1 },
  ],
};

// Abs vs Turnover monthly data per unidade (derived from abs + turnover evolution data)
function buildAbsVsTurnoverFromMaps(
  absMap: Record<string, { mes: string; value: number }[]>,
  turnMap: Record<string, TurnoverEvoRow[]>,
  scatterData: { regional: string; headcount: number }[]
): Record<string, { mes: string; absenteismo: number; turnover: number; headcount: number; desligamentos: number }[]> {
  const result: Record<string, { mes: string; absenteismo: number; turnover: number; headcount: number; desligamentos: number }[]> = {};
  const hcMap = Object.fromEntries(scatterData.map(s => [s.regional, s.headcount]));
  for (const [name, absData] of Object.entries(absMap)) {
    const turnData = turnMap[name] || [];
    const turnByMes = Object.fromEntries(turnData.map(t => [t.mes, t]));
    result[name] = absData.map(a => ({
      mes: a.mes,
      absenteismo: a.value,
      turnover: turnByMes[a.mes]?.turnover_exit ?? 0,
      headcount: hcMap[name] ?? 0,
      desligamentos: turnByMes[a.mes]?.terminations ?? 0,
    }));
  }
  return result;
}


const realEmpresaAbsScatter = [
  { regional: "SEGURANCA PATRIMONIAL", absenteismo: 12.87, turnover: 8.5, he: 320, headcount: 13 },
  { regional: "PORTARIA E LIMPEZA", absenteismo: 15.27, turnover: 9.1, he: 480, headcount: 420 },
  { regional: "TERCEIRIZACAO", absenteismo: 14.05, turnover: 7.2, he: 350, headcount: 22 },
];

// Real unidade scatter data from JSON
const realUnidadeAbsScatter = [
  { regional: "PORTARIA E LIMPEZA", absenteismo: 15.27, turnover: 8.4, he: 479, headcount: 408 },
  { regional: "SEGURANCA PATRIMONIAL", absenteismo: 13.95, turnover: 7.7, he: 459, headcount: 27 },
  { regional: "TERCEIRIZACAO", absenteismo: 14.17, turnover: 7.8, he: 463, headcount: 30 },
];

// Generate absenteísmo scatter data from any entity list (seeded, deterministic)
function toAbsScatterData(items: { nome: string; qualidade: number; score: number }[]) {
  function seededRand(s: number) { const x = Math.sin(s * 9301 + 49297) * 49297; return x - Math.floor(x); }
  return items.map((item, i) => {
    const r1 = seededRand(i * 7 + item.qualidade * 13 + 100);
    const r2 = seededRand(i * 11 + item.qualidade * 17 + 200);
    const r3 = seededRand(i * 19 + item.qualidade * 23 + 300);
    const headcount = Math.round(300 + r1 * 2700);
    const absenteismo = +(8 + (95 - item.qualidade) * 0.25 + r2 * 3).toFixed(1);
    const turnover = +(4.5 + (95 - item.qualidade) * 0.15 + r3 * 2.5).toFixed(1);
    const he = Math.round(250 + (95 - item.qualidade) * 8 + r1 * 120);
    return { regional: item.nome, absenteismo, turnover, he, headcount };
  });
}

const unidadeAbsScatter = realUnidadeAbsScatter;
const empresaAbsScatter = realEmpresaAbsScatter;
const areaAbsScatter = realAreaAbsScatter;

const absVsTurnoverPorUnidade = buildAbsVsTurnoverFromMaps(absenteismoEvolucaoPorUnidade, turnoverEvolucaoPorUnidade, realUnidadeAbsScatter);
const absVsTurnoverPorArea = buildAbsVsTurnoverFromMaps(absenteismoEvolucaoPorArea, turnoverEvolucaoPorArea, realAreaAbsScatter);


// ── Movimentações ──
const movimentacoesEvolucao = [
  { mes: "abr/25", value: 6.8 }, { mes: "mai/25", value: 7.0 }, { mes: "jun/25", value: 6.5 },
  { mes: "jul/25", value: 7.2 }, { mes: "ago/25", value: 7.5 }, { mes: "set/25", value: 7.1 },
  { mes: "out/25", value: 7.8 }, { mes: "nov/25", value: 7.0 }, { mes: "dez/25", value: 8.2 },
  { mes: "jan/26", value: 7.4 }, { mes: "fev/26", value: 6.9 }, { mes: "mar/26", value: 7.2 },
];
const movimentacoesMedia = 7.2;
const movimentacoesBarras = [
  { mes: "abr/25", escala: 1450, posto: 850 }, { mes: "mai/25", escala: 1380, posto: 820 },
  { mes: "jun/25", escala: 1420, posto: 790 }, { mes: "jul/25", escala: 1350, posto: 750 },
  { mes: "ago/25", escala: 1280, posto: 720 }, { mes: "set/25", escala: 1220, posto: 680 },
  { mes: "out/25", escala: 1180, posto: 650 }, { mes: "nov/25", escala: 1150, posto: 630 },
  { mes: "dez/25", escala: 1300, posto: 700 }, { mes: "jan/26", escala: 1100, posto: 620 },
  { mes: "fev/26", escala: 1050, posto: 590 }, { mes: "mar/26", escala: 1020, posto: 580 },
];
const movimentacoesMediaBarras = movimentacoesBarras.reduce((s, d) => s + d.escala + d.posto, 0) / movimentacoesBarras.length;

// Derive 30 movimentações regionais from scatter data
const movimentacoesRegionais = scatterQualidade.map(sq => {
  const st = scatterTratativa.find(t => t.regional === sq.regional);
  const total = Math.round(sq.headcount * (1 + (st?.dias ?? 6) / 10));
  const escala = Math.round(total * 0.62);
  const posto = total - escala;
  const tempoFechamento = +(3 + (st?.dias ?? 6) * 0.8).toFixed(1);
  const tendencia = sq.qualidade >= 88 ? "melhorando" : sq.qualidade >= 85 ? "estavel" : "piorando";
  return { nome: sq.regional, total, escala, posto, tempoFechamento, tendencia };
});

const subTabs = [
  { id: "qualidade", label: "Qualidade do Ponto" },
  { id: "absenteismo", label: "Absenteísmo" },
  { id: "movimentacoes", label: "Movimentações" },
];

// ── Drill-down data por regional ──
const regionalDrillDown: Record<string, { clientes: { nome: string; qualidade: number; volume: string; headcount: number; tratativa: number; tendencia: string }[] }> = {
  "Regional SP": { clientes: [
    { nome: "Cliente Alfa", qualidade: 91.2, volume: "82K", headcount: 650, tratativa: 3.8, tendencia: "melhorando" },
    { nome: "Cliente Beta", qualidade: 89.5, volume: "64K", headcount: 520, tratativa: 4.1, tendencia: "melhorando" },
    { nome: "Cliente Gamma", qualidade: 88.1, volume: "48K", headcount: 410, tratativa: 4.5, tendencia: "estavel" },
    { nome: "Cliente Delta", qualidade: 87.3, volume: "42K", headcount: 380, tratativa: 5.2, tendencia: "estavel" },
    { nome: "Cliente Epsilon", qualidade: 90.4, volume: "32K", headcount: 340, tratativa: 3.5, tendencia: "melhorando" },
  ]},
  "Regional RJ": { clientes: [
    { nome: "Cliente Zeta", qualidade: 88.2, volume: "56K", headcount: 480, tratativa: 6.2, tendencia: "piorando" },
    { nome: "Cliente Eta", qualidade: 85.1, volume: "48K", headcount: 420, tratativa: 7.1, tendencia: "piorando" },
    { nome: "Cliente Theta", qualidade: 87.5, volume: "42K", headcount: 350, tratativa: 6.8, tendencia: "estavel" },
    { nome: "Cliente Iota", qualidade: 86.0, volume: "43K", headcount: 340, tratativa: 7.5, tendencia: "piorando" },
  ]},
  "Regional MG": { clientes: [
    { nome: "Cliente Kappa", qualidade: 89.5, volume: "45K", headcount: 380, tratativa: 5.0, tendencia: "melhorando" },
    { nome: "Cliente Lambda", qualidade: 87.8, volume: "52K", headcount: 420, tratativa: 5.8, tendencia: "estavel" },
    { nome: "Cliente Mu", qualidade: 86.9, volume: "55K", headcount: 360, tratativa: 5.5, tendencia: "melhorando" },
  ]},
  "Regional PR": { clientes: [
    { nome: "Cliente Nu", qualidade: 88.1, volume: "42K", headcount: 310, tratativa: 6.5, tendencia: "estavel" },
    { nome: "Cliente Xi", qualidade: 87.0, volume: "48K", headcount: 380, tratativa: 7.0, tendencia: "estavel" },
    { nome: "Cliente Omicron", qualidade: 86.2, volume: "48K", headcount: 290, tratativa: 7.8, tendencia: "piorando" },
  ]},
  "Regional BA": { clientes: [
    { nome: "Cliente Pi", qualidade: 83.5, volume: "52K", headcount: 280, tratativa: 8.0, tendencia: "piorando" },
    { nome: "Cliente Rho", qualidade: 81.2, volume: "48K", headcount: 260, tratativa: 8.8, tendencia: "piorando" },
    { nome: "Cliente Sigma", qualidade: 82.0, volume: "45K", headcount: 260, tratativa: 7.9, tendencia: "estavel" },
  ]},
};

// ── Mock data generators ──
function generateClientes(regional: string) {
  const nomes = [
    "Grupo Marista", "Unimed Curitiba", "Sanepar", "Copel", "Renault do Brasil",
    "Volvo do Brasil", "O Boticário", "Electrolux", "HSBC", "Condor Super Center",
    "Positivo Tecnologia", "Nutrimental", "Herbarium", "Cargill", "BRF Foods",
    "Votorantim", "Klabin", "Pernambucanas", "Riachuelo", "Magazine Luiza",
    "Casas Bahia", "Lojas Americanas", "Mercado Livre", "Ambev", "JBS",
  ];
  return nomes.map((n, i) => {
    const seed = regional.length * 7 + i * 13 + n.length;
    const r = Math.sin(seed) * 10000; const frac = r - Math.floor(r);
    const qualidade = +(72 + frac * 22).toFixed(1);
    const score = Math.round(qualidade);
    const volume = `${Math.round(8 + frac * 55)}K`;
    const headcount = Math.round(30 + frac * 350);
    const tratativa = +(1.5 + frac * 9).toFixed(1);
    const varNum = +(-5 + frac * 10).toFixed(1);
    const variacao = `${varNum > 0 ? "+" : ""}${varNum} pp`;
    const corVariacao = varNum >= 0 ? "text-green-600" : "text-red-500";
    const tendencia = qualidade >= 88 ? "melhorando" : qualidade >= 80 ? "estavel" : "piorando";
    return { nome: n, qualidade, score, volume, headcount, tratativa, variacao, corVariacao, tendencia };
  });
}

function generatePostos(regional: string) {
  const prefixes = ["Posto Central", "Posto Norte", "Posto Sul", "Posto Leste", "Posto Oeste", "Posto Industrial", "Posto Comercial", "Posto Admin", "Posto Matriz", "Posto Filial", "Posto Logística", "Posto Portaria", "Posto Recepção", "Posto Monitoramento", "Posto Ronda"];
  return prefixes.map((p, i) => {
    const seed = regional.length * 7 + i * 13;
    const r = Math.sin(seed) * 10000; const frac = r - Math.floor(r);
    const qualidade = +(75 + frac * 20).toFixed(1);
    const score = Math.round(qualidade);
    const volume = `${Math.round(5 + frac * 40)}K`;
    const headcount = Math.round(20 + frac * 200);
    const varNum = +(-4 + frac * 8).toFixed(1);
    const variacao = `${varNum > 0 ? "+" : ""}${varNum} pp`;
    const corVariacao = varNum >= 0 ? "text-green-600" : "text-red-500";
    return { nome: `${p} - ${regional.slice(0, 3).toUpperCase()}${i + 1}`, qualidade, score, volume, headcount, variacao, corVariacao };
  });
}

function generateColaboradores(regional: string) {
  const nomes = ["Ana Silva", "Carlos Santos", "Maria Oliveira", "João Pereira", "Fernanda Costa", "Ricardo Souza", "Juliana Lima", "Pedro Almeida", "Camila Rocha", "Lucas Ferreira", "Patrícia Martins", "Bruno Araújo", "Tatiana Mendes", "Rafael Gonçalves", "Luciana Ribeiro", "Marcelo Dias", "Vanessa Cardoso", "Eduardo Nunes", "Débora Farias", "Gustavo Pinto"];
  return nomes.map((n, i) => {
    const seed = regional.length * 11 + i * 17;
    const r = Math.sin(seed) * 10000; const frac = r - Math.floor(r);
    const qualidade = +(70 + frac * 25).toFixed(1);
    const score = Math.round(qualidade);
    const marcacoes = Math.round(100 + frac * 500);
    const inconsistencias = Math.round(frac * 15);
    const varNum = +(-3 + frac * 9).toFixed(1);
    const variacao = `${varNum > 0 ? "+" : ""}${varNum} pp`;
    const corVariacao = varNum >= 0 ? "text-green-600" : "text-red-500";
    return { nome: n, qualidade, score, marcacoes, inconsistencias, variacao, corVariacao };
  });
}

function generateOperadores(regional: string) {
  const nomes = ["Op. Márcia Lopes", "Op. Thiago Reis", "Op. Sandra Vieira", "Op. Felipe Barros", "Op. Cristina Moura", "Op. André Teixeira", "Op. Renata Castro", "Op. Diego Freitas", "Op. Priscila Ramos", "Op. Rodrigo Campos", "Op. Aline Duarte", "Op. Fábio Correia", "Op. Isabela Cunha", "Op. Leandro Melo", "Op. Natália Borges"];
  return nomes.map((n, i) => {
    const seed = regional.length * 23 + i * 31;
    const r = Math.sin(seed) * 10000; const frac = r - Math.floor(r);
    const ajustesRealizados = Math.round(50 + frac * 400);
    const tempoMedioAjuste = +(0.5 + frac * 12).toFixed(1);
    const pendentes = Math.round(frac * 25);
    const taxaAcerto = +(80 + frac * 18).toFixed(1);
    const tendencia = taxaAcerto >= 92 ? "melhorando" : taxaAcerto >= 85 ? "estavel" : "piorando";
    return { nome: n, ajustesRealizados, tempoMedioAjuste, pendentes, taxaAcerto, tendencia };
  });
}

function RegionalDetailModal({ regional, open, onClose }: { regional: string | null; open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"clientes" | "postos" | "colaboradores" | "operadores">("clientes");

  if (!regional) return null;
  const qualData = qualidadeRegionais.find(r => r.nome === regional);
  const scatterQ = scatterQualidade.find(r => r.regional === regional);
  const scatterT = scatterTratativa.find(r => r.regional === regional);
  if (!qualData || !scatterQ || !scatterT) return null;

  const scoreColor = qualData.qualidade >= 85 ? "text-green-600" : qualData.qualidade >= 75 ? "text-orange-500" : "text-red-600";
  const scoreBg = qualData.qualidade >= 85 ? "bg-green-50 border-green-200" : qualData.qualidade >= 75 ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200";

  const clientes = generateClientes(regional);
  const postos = generatePostos(regional);
  const colaboradores = generateColaboradores(regional);
  const operadores = generateOperadores(regional);

  const scoreFormat = (v: number) => <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getScoreColor(v)} ${getScoreBg(v)}`}>{v}</span>;
  const qualidadeFormat = (v: number) => <span className="text-sm font-semibold text-foreground">{v}%</span>;
  const variacaoFormat = (v: string, row: any) => {
    const isPositive = row.corVariacao?.includes("green");
    return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${row.corVariacao} ${isPositive ? "bg-green-50" : "bg-red-50"}`}>{v}</span>;
  };

  const clienteCols = [
    { key: "nome", label: "Cliente", align: "left" as const, format: (v: string) => <span className="text-sm font-medium text-foreground">{v}</span> },
    { key: "score", label: "Score", align: "center" as const, width: "55px", format: scoreFormat },
    { key: "qualidade", label: "Atual", align: "right" as const, width: "70px", format: qualidadeFormat },
    { key: "variacao", label: "Variação", align: "center" as const, width: "75px", format: variacaoFormat },
    { key: "volume", label: "Volume", align: "right" as const, width: "65px", format: (v: string) => <span className="text-muted-foreground">{v}</span> },
    { key: "headcount", label: "HC", align: "right" as const, width: "50px", format: (v: number) => <span className="text-muted-foreground">{v}</span> },
  ];

  const postoCols = [
    { key: "nome", label: "Posto", align: "left" as const, format: (v: string) => <span className="text-sm font-medium text-foreground">{v}</span> },
    { key: "score", label: "Score", align: "center" as const, width: "55px", format: scoreFormat },
    { key: "qualidade", label: "Atual", align: "right" as const, width: "70px", format: qualidadeFormat },
    { key: "variacao", label: "Variação", align: "center" as const, width: "75px", format: variacaoFormat },
    { key: "volume", label: "Volume", align: "right" as const, width: "65px", format: (v: string) => <span className="text-muted-foreground">{v}</span> },
    { key: "headcount", label: "HC", align: "right" as const, width: "50px", format: (v: number) => <span className="text-muted-foreground">{v}</span> },
  ];

  const colabCols = [
    { key: "nome", label: "Colaborador", align: "left" as const, format: (v: string) => <span className="text-sm font-medium text-foreground">{v}</span> },
    { key: "score", label: "Score", align: "center" as const, width: "55px", format: scoreFormat },
    { key: "qualidade", label: "Atual", align: "right" as const, width: "70px", format: qualidadeFormat },
    { key: "variacao", label: "Variação", align: "center" as const, width: "75px", format: variacaoFormat },
    { key: "marcacoes", label: "Marcações", align: "right" as const, width: "80px", format: (v: number) => <span className="text-muted-foreground">{v}</span> },
    { key: "inconsistencias", label: "Inconsis.", align: "right" as const, width: "65px", format: (v: number) => <span className={`font-semibold ${v > 10 ? "text-red-600" : v > 5 ? "text-orange-500" : "text-muted-foreground"}`}>{v}</span> },
  ];

  const operadorCols = [
    { key: "nome", label: "Operador", align: "left" as const, format: (v: string) => <span className="text-sm font-medium text-foreground">{v}</span> },
    { key: "taxaAcerto", label: "Score", align: "center" as const, width: "55px", format: scoreFormat },
    { key: "ajustesRealizados", label: "Ajustes", align: "right" as const, width: "65px", format: (v: number) => <span className="text-muted-foreground">{v}</span> },
    { key: "tempoMedioAjuste", label: "Tempo Méd.", align: "right" as const, width: "85px", format: (v: number) => <span className={`font-semibold ${v > 8 ? "text-red-600" : v > 4 ? "text-orange-500" : "text-green-600"}`}>{v}min</span> },
    { key: "pendentes", label: "Pend.", align: "right" as const, width: "55px", format: (v: number) => <span className={`font-semibold ${v > 15 ? "text-red-600" : v > 8 ? "text-orange-500" : "text-muted-foreground"}`}>{v}</span> },
  ];

  const tabs = [
    { id: "clientes" as const, label: "Clientes" },
    { id: "postos" as const, label: "Postos" },
    { id: "colaboradores" as const, label: "Colaboradores" },
    { id: "operadores" as const, label: "Operadores" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[70vw] h-[70vh] max-w-none flex flex-col" style={{ maxHeight: "70vh" }}>
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg font-bold">{regional}</DialogTitle>
        </DialogHeader>

        {/* 4 Big Numbers */}
        <div className="grid grid-cols-4 gap-3 shrink-0">
          <div className={`rounded-lg border p-3 ${scoreBg}`}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Qualidade</p>
            <p className={`text-2xl font-bold ${scoreColor}`}>{qualData.qualidade}%</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Volume</p>
            <p className="text-2xl font-bold text-foreground">{(scatterQ.volume / 1000).toFixed(0)}K</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Headcount</p>
            <p className="text-2xl font-bold text-foreground">{scatterQ.headcount.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Tempo Tratativa</p>
            <p className="text-2xl font-bold text-foreground">{scatterT.dias}d</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-[#FF5722] text-[#FF5722]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {activeTab === "clientes" && <IndicatorTable data={clientes} columns={clienteCols} searchPlaceholder="Buscar cliente..." />}
          {activeTab === "postos" && <IndicatorTable data={postos} columns={postoCols} searchPlaceholder="Buscar posto..." />}
          {activeTab === "colaboradores" && <IndicatorTable data={colaboradores} columns={colabCols} searchPlaceholder="Buscar colaborador..." />}
          {activeTab === "operadores" && <IndicatorTable data={operadores} columns={operadorCols} searchPlaceholder="Buscar operador..." />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ══════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════
export default function AnalyticsDisciplinaOperacional({ embedded }: { embedded?: boolean }) {
  const [activeSubTab, setActiveSubTab] = useState("qualidade");
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");

  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };

  const content = (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 min-w-0 pl-6 py-4 space-y-3 overflow-y-auto">
        {/* Sub-tab toggle */}
        <div className="flex gap-2">
          {subTabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveSubTab(t.id); setSelectedRegional(null); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeSubTab === t.id
                  ? "bg-[#FF5722] text-white border-[#FF5722]"
                  : "bg-white text-muted-foreground border-border hover:border-[#FF5722]/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeSubTab === "qualidade" && <QualidadeContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} groupBy={groupBy} onGroupByChange={handleGroupByChange} />}
        {activeSubTab === "absenteismo" && <AbsenteismoContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} groupBy={groupBy} onGroupByChange={handleGroupByChange} />}
        {activeSubTab === "movimentacoes" && <MovimentacoesContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} groupBy={groupBy} onGroupByChange={handleGroupByChange} />}
      </div>
    </div>
  );

  if (embedded) return content;
  return content;
}

// ══════════════════════════════════════════════════════════════
// Ranking bar grid (reusable dashed lines + footer)
// ══════════════════════════════════════════════════════════════
function RankingDashedGrid() {
  return (
    <>
      {[20, 40, 60, 80].map(p => (
        <svg key={p} className="absolute top-0 z-20 pointer-events-none" width="2" height="16" style={{ left: `${p}%` }}>
          <line x1="1" y1="0" x2="1" y2="16" stroke="rgba(0,0,0,0.35)" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      ))}
    </>
  );
}

function RankingFooter() {
  return (
    <div className="flex items-center gap-4 mt-1 -mx-2 px-2">
      <span className="min-w-[120px]" />
      <div className="flex-1 relative h-4">
        {[0, 20, 40, 60, 80, 100].map(p => (
          <span key={p} className="absolute text-[10px] text-muted-foreground -translate-x-1/2" style={{ left: `${p}%` }}>{p}%</span>
        ))}
      </div>
      <span className="min-w-[80px]" />
      <span className="w-[14px]" />
    </div>
  );
}



type ContentProps = { selectedRegional: string | null; onRegionalClick: (n: string) => void; onItemDetail?: (n: string) => void; groupBy: GroupBy; onGroupByChange: (g: GroupBy) => void };

// ══════════════════════════════════════════════════════════════
// Sub-aba 1: Qualidade do Ponto
// ══════════════════════════════════════════════════════════════
function QualidadeContent({ selectedRegional, onRegionalClick, onItemDetail, groupBy, onGroupByChange }: ContentProps) {
  const { config: scoreConfig } = useScoreConfig();
  const [visibleNames, setVisibleNames] = useState<string[]>([]);

  const [selectedMes, setSelectedMes] = useState<string | null>(null);
  const [chartDataModal, setChartDataModal] = useState<string | null>(null);

  // Headcount por mês – filtrado por entidade selecionada
  const MONTH_LABEL_MAP: Record<string, string> = {
    "2025-04-01": "abr/25", "2025-05-01": "mai/25", "2025-06-01": "jun/25",
    "2025-07-01": "jul/25", "2025-08-01": "ago/25", "2025-09-01": "set/25",
    "2025-10-01": "out/25", "2025-11-01": "nov/25", "2025-12-01": "dez/25",
    "2026-01-01": "jan/26", "2026-02-01": "fev/26", "2026-03-01": "mar/26",
  };
  const normHcName = (n: string) => n.replace(/^VIG\s*EYES\s*/i, "").trim().toUpperCase();
  const headcountMaps = useMemo<{ active: Record<string, number>; ponto: Record<string, number> }>(() => {
    const hcSources: Record<string, any[]> = {
      empresa: hcEmpresaJson,
      unidade: hcUnNegocioJson,
      area: hcAreaJson,
    };
    const raw = hcSources[groupBy] ?? hcEmpresaJson;
    const nameField = groupBy === "empresa" ? "company_name" : groupBy === "unidade" ? "business_unit_name" : "area_name";
    const idField = groupBy === "empresa" ? "company_id" : groupBy === "unidade" ? "business_unit_id" : "area_id";

    let filtered = raw;
    if (selectedRegional) {
      const selNorm = normHcName(selectedRegional);
      filtered = raw.filter((r: any) =>
        String(r[idField]) === selectedRegional || normHcName(r[nameField] ?? "") === selNorm
      );
    }

    const active: Record<string, number> = {};
    const ponto: Record<string, number> = {};
    filtered.forEach((r: any) => {
      const label = MONTH_LABEL_MAP[r.reference_month] || r.reference_month;
      active[label] = (active[label] || 0) + (r.active_headcount ?? 0);
      ponto[label] = (ponto[label] || 0) + (r.headcount ?? 0);
    });
    return { active, ponto };
  }, [groupBy, selectedRegional]);

  const mesLabelToReferenceMonth = useMemo(() => new Map(ajustesMeses.map((month) => [formatMesLabel(month), month])), []);
  const selectedReferenceMonth = useMemo(
    () => (selectedMes ? mesLabelToReferenceMonth.get(selectedMes) ?? null : null),
    [mesLabelToReferenceMonth, selectedMes]
  );

  const activeData = useMemo(() => {
    return getQualidadeKpiSummary(selectedRegional, groupBy as any, scoreConfig, selectedReferenceMonth);
  }, [selectedRegional, groupBy, scoreConfig, selectedReferenceMonth]);

  const qualidadeEvolucaoReal = useMemo(
    () => aggregateQualidadeEvolucao(selectedRegional, groupBy as any),
    [selectedRegional, groupBy]
  );
  const qualidadeMedia = useMemo(
    () => qualidadeEvolucaoReal.length ? +(qualidadeEvolucaoReal.reduce((s, d) => s + d.value, 0) / qualidadeEvolucaoReal.length).toFixed(1) : 85,
    [qualidadeEvolucaoReal]
  );
  const qualidadeDetalhado = useMemo(
    () => aggregateQualidadeEvolucaoDetalhado(selectedRegional, groupBy as any),
    [selectedRegional, groupBy]
  );
  const qualidadeComHeadcount = useMemo(
    () => qualidadeDetalhado.map(d => ({
      ...d,
      activeHeadcount: headcountMaps.active[d.mes] ?? 0,
      hcPonto: headcountMaps.ponto[d.mes] ?? 0,
    })),
    [qualidadeDetalhado, headcountMaps]
  );
  const maxHeadcount = useMemo(() => Math.max(...qualidadeComHeadcount.map(d => d.activeHeadcount), 1), [qualidadeComHeadcount]);
  const maxBarTotal = useMemo(() => Math.max(...qualidadeComHeadcount.map(d => d.registradas + d.justificadas), 1), [qualidadeComHeadcount]);
  // Scale right axis so headcount area top = 10% above tallest bar
  // tallest bar fraction on left axis ≈ 1.0, so headcount must map to ~1.1 of chart
  // headcount / rightMax = maxBarTotal * 1.1 / leftMax ≈ 1.1
  // → rightMax = headcount / 1.1 (so the area extends to 110% of bar height)
  const rightDomainMax = useMemo(() => {
    // Left axis auto-scales, maxBarTotal ≈ top of chart
    // We want headcount area to reach 10% above that
    // Since both axes share chart height: hc_fraction = hc / rightMax, bar_fraction = barTotal / leftMax
    // For the month with max bars: bar_fraction ≈ 1.0
    // We want min(hc_fraction) among all months to still be > 1.1 * max(bar_fraction)
    // But headcount varies per month. Just ensure the area envelope sits above bars.
    // Simple: rightMax = minHeadcount / 1.1 would push all above, but let's use maxHeadcount
    // to keep nice ticks, and scale so area top = 10% above tallest bar visually
    const minHC = Math.min(...qualidadeComHeadcount.map(d => d.activeHeadcount));
    const maxBarMonth = qualidadeComHeadcount.reduce((best, d) => 
      (d.registradas + d.justificadas) > (best.registradas + best.justificadas) ? d : best
    );
    const hcAtMaxBar = maxBarMonth.activeHeadcount;
    // rightMax so that hcAtMaxBar / rightMax ≈ 1.1 (i.e. 110% of chart = above top)
    // But can't go above chart. Instead: the left axis will auto-extend.
    // Let's just set rightMax = maxHeadcount * factor where the area is a background band.
    // Simplest correct approach: make both axes share proportional scaling.
    // rightMax such that: (maxHeadcount / rightMax) = ((maxBarTotal * 1.1) / leftDomainMax)
    // leftDomainMax ≈ maxBarTotal (auto), so ratio = 1.1
    // → rightMax = maxHeadcount / 1.1
    return Math.ceil(maxHeadcount / 1.1);
  }, [maxHeadcount, qualidadeComHeadcount]);

  const tratativaFaixasFiltrada = useMemo(
    () => {
      const nameFilter = selectedRegional || null;
      return aggregateComposicaoFaixas(nameFilter, groupBy as any);
    },
    [groupBy, selectedRegional]
  );
  const tratativaMediaTotal = useMemo(() => tratativaFaixasFiltrada.length ? tratativaFaixasFiltrada.reduce((s, d) => s + d.total, 0) / tratativaFaixasFiltrada.length : 0, [tratativaFaixasFiltrada]);



  
  const scoreClassif = getScoreClassification(activeData.score, scoreConfig);
  const scoreColor = scoreClassif.text;
  const scoreFaixa = scoreClassif.label;

  const sidebarItems = useMemo(() => {
    // Compute composite score per entity using config
    const entities = groupBy === "empresa" ? empresaData : groupBy === "area" ? areaData : unidadeData;
    return entities.map(e => {
      const summary = getQualidadeKpiSummary(e.nome, groupBy as any, scoreConfig);
      return { nome: e.nome, score: summary.score };
    }).sort((a, b) => b.score - a.score);
  }, [groupBy, scoreConfig]);

  const allScatter = useMemo(() => {
    if (groupBy === "empresa") return aggregateQualidadeVolume(selectedReferenceMonth, "empresa");
    if (groupBy === "unidade") return aggregateQualidadeVolume(selectedReferenceMonth, "unidade");
    if (groupBy === "area") return aggregateQualidadeVolume(selectedReferenceMonth, "area");
    return scatterQualidade;
  }, [groupBy, selectedReferenceMonth]);

  const allScatterTratativa = useMemo(() => aggregateAjustes(selectedReferenceMonth, groupBy), [selectedReferenceMonth, groupBy]);

  const visibleSet = useMemo(() => new Set(visibleNames), [visibleNames]);
  const chartScatterQual = useMemo(() => allScatter.filter(s => visibleSet.size === 0 || visibleSet.has(s.regional)), [allScatter, visibleSet]);
  const chartScatterTrat = useMemo(() => {
    if (visibleSet.size > 0) return allScatterTratativa.filter(s => visibleSet.has(s.regional));
    return allScatterTratativa;
  }, [allScatterTratativa, visibleSet]);

  const avgQualVolume = useMemo(() => chartScatterQual.length ? Math.round(chartScatterQual.reduce((s, d) => s + d.volume, 0) / chartScatterQual.length) : 170000, [chartScatterQual]);
  const avgQualQualidade = useMemo(() => chartScatterQual.length ? +(chartScatterQual.reduce((s, d) => s + d.qualidade, 0) / chartScatterQual.length).toFixed(1) : 85, [chartScatterQual]);
  const avgTratVolume = useMemo(() => chartScatterTrat.length ? Math.round(chartScatterTrat.reduce((s, d) => s + d.volume, 0) / chartScatterTrat.length) : 170000, [chartScatterTrat]);
  const avgTratDias = useMemo(() => chartScatterTrat.length ? +(chartScatterTrat.reduce((s, d) => s + d.dias, 0) / chartScatterTrat.length).toFixed(1) : 4.5, [chartScatterTrat]);

  const buildAxis = (values: number[], options?: { clampZero?: boolean }) => {
    const clampZero = options?.clampZero ?? false;
    if (!values.length) return { min: 0, max: 100 };
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const min = clampZero ? Math.max(0, Math.floor(rawMin)) : Math.floor(rawMin);
    const max = Math.ceil(rawMax);
    return { min, max };
  };

  const padDomain = (min: number, max: number, clampZero = false) => {
    const range = max - min || 1;
    const paddedMin = clampZero ? Math.max(0, Math.floor(min - range * 0.1)) : Math.floor(min - range * 0.1);
    const paddedMax = Math.ceil(max + range * 0.1);
    return { min: paddedMin, max: paddedMax };
  };

  const qualDomain = useMemo(() => {
    if (!chartScatterQual.length) return { xMin: 0, xMax: 300000, yMin: 70, yMax: 100 };
    const xs = chartScatterQual.map(d => d.volume);
    const ys = chartScatterQual.map(d => d.qualidade);
    const x = padDomain(Math.min(...xs), Math.max(...xs), true);
    const y = padDomain(Math.min(...ys), Math.max(...ys));
    return { xMin: x.min, xMax: x.max, yMin: y.min, yMax: y.max };
  }, [chartScatterQual]);

  const tratDomain = useMemo(() => {
    if (!chartScatterTrat.length) return { xMin: 0, xMax: 300000, yMin: 1, yMax: 7 };
    const xs = chartScatterTrat.map(d => d.volume);
    const ys = chartScatterTrat.map(d => d.dias);
    const x = padDomain(Math.min(...xs), Math.max(...xs), true);
    const y = padDomain(Math.min(...ys), Math.max(...ys));
    return { xMin: x.min, xMax: x.max, yMin: y.min, yMax: y.max };
  }, [chartScatterTrat]);

  const qualClassif = getScoreClassification(Math.round(activeData.qualidadePct), scoreConfig);
  const tempoColor = activeData.tempoMedioDias < 3 ? "text-green-600" : activeData.tempoMedioDias <= 7 ? "text-orange-500" : "text-red-600";
  const ate1dColor = activeData.ate1DiaPct >= 50 ? "text-green-600" : activeData.ate1DiaPct >= 30 ? "text-orange-500" : "text-red-600";
  const mais15dColor = activeData.mais15DiaPct <= 10 ? "text-green-600" : activeData.mais15DiaPct <= 25 ? "text-orange-500" : "text-red-600";
  const melhorClassif = getScoreClassification(activeData.melhorOperacao.score, scoreConfig);
  const riscoClassif = getScoreClassification(activeData.maiorRisco.score, scoreConfig);

  return (
    <div className="flex">
      {/* Left: KPI cards + charts */}
      <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4">
        {/* Linha 1: 6 KPI Cards */}
        <div className="grid grid-cols-6 gap-3">
          {/* 1. Score with decomposition popover */}
          <ScoreBoard title="Qualidade do Ponto" tooltip="Score composto considerando qualidade das marcações e tempo de tratativa dos ajustes. Clique para ver a decomposição.">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex flex-col items-center gap-0 cursor-pointer" title="Ver decomposição do score">
                  <ScoreGauge score={activeData.score} label={`${activeData.score}`} faixa={scoreFaixa} color={scoreClassif.color} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" side="bottom" align="start">
                <div className="p-3 border-b border-border/50">
                  <p className="text-sm font-semibold">Como o Score {activeData.score} foi calculado</p>
                </div>
                <div className="p-3 space-y-3">
                  {qpDecomposicaoScore.componentes.map((comp) => {
                    const COMP_COLORS: Record<string, string> = { success: "#22c55e", warning: "#eab308", critical: "#ef4444" };
                    const barColor = COMP_COLORS[comp.cor_semantica] || "#6b7280";
                    const barWidth = Math.max(comp.contribuicao / qpDecomposicaoScore.score_composto * 100, 4);
                    return (
                      <div key={comp.metrica} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{comp.metrica}</span>
                          <span className="text-[10px] text-muted-foreground">peso {comp.peso}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span>{comp.valor_atual}{comp.unidade}  →  Nota {comp.nota}</span>
                          <span className="font-semibold">{comp.contribuicao} pts</span>
                        </div>
                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, backgroundColor: barColor }} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t border-border/50 pt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold">Score composto</span>
                    <span className="text-sm font-bold" style={{ color: scoreClassif.color }}>
                      {activeData.score} ({scoreFaixa})
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {(() => {
              const kpi = (qpKpisPeriodoAnterior.kpis as any).score_aba;
              if (!kpi) return null;
              const delta = kpi.delta;
              const absDelta = Math.abs(delta);
              const improved = delta > 0;
              const DeltaIcon = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : MinusIcon;
              const dColor = absDelta < 1 ? "text-muted-foreground" : improved ? "text-green-600" : "text-red-600";
              return (
                <UITooltip>
                  <TooltipTrigger asChild>
                    <span className={`text-[9px] flex items-center gap-0.5 cursor-help -mt-0.5 ${dColor}`}>
                      <DeltaIcon className="w-3 h-3" /> {absDelta.toFixed(1)}pp vs {kpi.anterior} (ant.)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>Atual: {kpi.atual} · Anterior: {kpi.anterior}</p>
                  </TooltipContent>
                </UITooltip>
              );
            })()}
          </ScoreBoard>

          {/* 2. Qualidade % */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Qualidade</p>
              <InfoTip text="Percentual de marcações registradas corretamente, sem necessidade de ajuste." />
            </div>
            <p className="text-xl font-bold mt-0.5 truncate" style={{ color: qualClassif.color }}>{activeData.qualidadePct}%</p>
            {(() => {
              const kpi = (qpKpisPeriodoAnterior.kpis as any).qualidade_pct;
              if (!kpi) return null;
              const delta = kpi.delta;
              const absDelta = Math.abs(delta);
              const improved = delta > 0;
              const DeltaIcon = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : MinusIcon;
              const dColor = absDelta < 0.5 ? "text-muted-foreground" : improved ? "text-green-600" : "text-red-600";
              return (
                <UITooltip>
                  <TooltipTrigger asChild>
                    <span className={`text-[10px] flex items-center gap-0.5 cursor-help mt-1 ${dColor}`}>
                      <DeltaIcon className="w-3 h-3" /> {absDelta.toFixed(1)}pp vs {kpi.anterior}% (ant.)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>Atual: {kpi.atual}% · Anterior: {kpi.anterior}%</p>
                  </TooltipContent>
                </UITooltip>
              );
            })()}
          </div>

          {/* 3. Tempo Médio */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Tempo Médio</p>
              <InfoTip text="Tempo médio em dias entre a marcação original e o ajuste pelo operador." />
            </div>
            <p className={`text-xl font-bold mt-0.5 truncate ${tempoColor}`}>{activeData.tempoMedioDias} dias</p>
            {(() => {
              const kpi = (qpKpisPeriodoAnterior.kpis as any).tempo_medio_dias;
              if (!kpi) return null;
              const delta = kpi.delta;
              const absDelta = Math.abs(delta);
              // For tempo: down = better
              const improved = delta < 0;
              const DeltaIcon = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : MinusIcon;
              const dColor = absDelta < 0.3 ? "text-muted-foreground" : improved ? "text-green-600" : "text-red-600";
              return (
                <UITooltip>
                  <TooltipTrigger asChild>
                    <span className={`text-[10px] flex items-center gap-0.5 cursor-help mt-1 ${dColor}`}>
                      <DeltaIcon className="w-3 h-3" /> {absDelta.toFixed(1)} dias vs {kpi.anterior} (ant.)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>Atual: {kpi.atual} dias · Anterior: {kpi.anterior} dias</p>
                  </TooltipContent>
                </UITooltip>
              );
            })()}
          </div>

          {/* 4. Melhor Operação */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Melhor Operação</p>
              <InfoTip text="Operação com maior score de qualidade no período" />
            </div>
            <p className="text-xl font-bold mt-0.5 truncate" style={{ color: melhorClassif.color }}>{activeData.melhorOperacao.nome}</p>
            <p className="text-[11px] mt-1 truncate" style={{ color: melhorClassif.color }}>Score {activeData.melhorOperacao.score} · {melhorClassif.label}</p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {(qpKpisPeriodoAnterior.kpis as any).melhor_operacao?.mudou
                ? (qpKpisPeriodoAnterior.kpis as any).melhor_operacao.mudanca_label
                : "Mesma posição do período anterior"}
            </span>
          </div>

          {/* 5. Maior Risco */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Maior Risco</p>
              <InfoTip text="Operação com menor qualidade e maior concentração de risco" />
            </div>
            <p className="text-xl font-bold mt-0.5 truncate" style={{ color: riscoClassif.color }}>{activeData.maiorRisco.nome}</p>
            <p className="text-[11px] mt-1 truncate" style={{ color: riscoClassif.color }}>Score {activeData.maiorRisco.score} · {riscoClassif.label}</p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {(qpKpisPeriodoAnterior.kpis as any).maior_risco?.mudou
                ? (qpKpisPeriodoAnterior.kpis as any).maior_risco.mudanca_label
                : "Mesma posição do período anterior"}
            </span>
          </div>

          {/* 6. Custo da Operação de Ponto — locked */}
          <UITooltip>
            <TooltipTrigger asChild>
              <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col relative opacity-60 cursor-default select-none">
                <Lock className="w-3.5 h-3.5 absolute top-2.5 right-2.5 text-muted-foreground" />
                <div className="flex items-center gap-1 mb-2">
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Custo da Operação</p>
                </div>
                <p className="text-lg font-bold mt-0.5 text-muted-foreground">Em breve</p>
                <p className="text-[10px] text-muted-foreground mt-1">Disponível após integração da folha</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[260px] text-xs">
              Cálculo do custo financeiro da operação de ponto (horas gastas em ajustes, retrabalho e auditoria). Requer integração da folha de pagamento. Previsto para a próxima versão.
            </TooltipContent>
          </UITooltip>
        </div>

        {/* Row 1: Evolução Qualidade + Tempo Médio Tratativa */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div>
                <h4 className="text-sm font-semibold">Evolução da Qualidade e Headcount</h4>
                <p className="text-[10px] text-muted-foreground mb-2">Registradas vs Justificadas (barras) · Headcount Ativo (área) · clique para filtrar</p>
              </div>
              <button onClick={() => setChartDataModal("evoQualidade")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={qualidadeComHeadcount} onClick={(e: any) => {
                if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
              }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={(props: any) => {
                  const { x, y, payload } = props;
                  const isActive = selectedMes === payload.value;
                  return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : `${v}`} label={{ value: "Volume de marcação", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" }, offset: 0 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, rightDomainMax]} ticks={[0, 100, 200, 300, 400, 500].filter(v => v <= rightDomainMax)} label={{ value: "Headcount", angle: 90, position: "insideRight", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" }, offset: 0 }} />
                <RechartsTooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  const reg = d?.registradas ?? 0;
                  const jus = d?.justificadas ?? 0;
                  const total = reg + jus;
                  const activeHC = d?.activeHeadcount ?? 0;
                  const hcPonto = d?.hcPonto ?? 0;
                  const engagement = activeHC > 0 ? (hcPonto / activeHC) * 100 : 0;
                  const lowEngagement = engagement > 0 && engagement < 90;
                  return (
                    <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="text-muted-foreground">Marcações: <span className="font-semibold text-foreground">{total.toLocaleString("pt-BR")}</span></p>
                      {[{ name: "Registradas", value: reg, color: "#22c55e" }, { name: "Justificadas", value: jus, color: "#ef4444" }].map(f => (
                        <div key={f.name} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5" style={{ backgroundColor: f.color }} />
                          <span className="text-muted-foreground">{f.name}:</span>
                          <span className="font-medium text-foreground">{`${((f.value / total) * 100).toFixed(0)}% (${f.value.toLocaleString("pt-BR")})`}</span>
                        </div>
                      ))}
                      <div className="border-t border-border/40 pt-1 mt-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5" style={{ backgroundColor: "#D3D1C7" }} />
                          <span className="text-muted-foreground">Headcount ativo:</span>
                          <span className="font-medium text-foreground">{activeHC} pessoas</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-transparent" />
                          <span className="text-muted-foreground">Bateram ponto:</span>
                          <span className={`font-medium ${lowEngagement ? "text-amber-600" : "text-foreground"}`}>
                            {hcPonto} ({engagement.toFixed(0)}%)
                            {lowEngagement && <span className="ml-1" title="Engagement abaixo de 90%">⚠️</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }} />
                {selectedMes && <ReferenceLine yAxisId="left" x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                <Area yAxisId="right" type="monotone" dataKey="activeHeadcount" fill="#D3D1C7" fillOpacity={0.4} stroke="#D3D1C7" strokeWidth={0} name="Headcount" />
                <Bar yAxisId="left" dataKey="registradas" stackId="qual" stroke="#22c55e" strokeWidth={1} radius={[0, 0, 0, 0]} name="Registradas">
                  {qualidadeComHeadcount.map((entry, idx) => (
                    <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.65)"} />
                  ))}
                  <LabelList dataKey="registradas" position="center" fontSize={9} fill="#fff" fontWeight={600} formatter={(v: number) => {
                    return `${v.toLocaleString("pt-BR")}`;
                  }} content={({ x, y, width, height, index }: any) => {
                    const d = qualidadeComHeadcount[index];
                    if (!d) return null;
                    const total = d.registradas + d.justificadas;
                    const pct = total > 0 ? ((d.registradas / total) * 100).toFixed(0) : "0";
                    return (
                      <text x={(x ?? 0) + (width ?? 0) / 2} y={(y ?? 0) + (height ?? 0) / 2 + 3} textAnchor="middle" fontSize={9} fill="#fff" fontWeight={600}>
                        {pct}%
                      </text>
                    );
                  }} />
                </Bar>
                <Bar yAxisId="left" dataKey="justificadas" stackId="qual" stroke="rgba(239,68,68,0.5)" strokeWidth={1} radius={[4, 4, 0, 0]} name="Justificadas">
                  {qualidadeComHeadcount.map((entry, idx) => (
                    <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.65)"} />
                  ))}
                  <LabelList content={({ x, y, width, height, index }: any) => {
                    const d = qualidadeComHeadcount[index];
                    if (!d) return null;
                    const total = d.registradas + d.justificadas;
                    const pct = total > 0 ? ((d.justificadas / total) * 100).toFixed(0) : "0";
                    return (
                      <text x={(x ?? 0) + (width ?? 0) / 2} y={(y ?? 0) + (height ?? 0) / 2 + 3} textAnchor="middle" fontSize={9} fill="#fff" fontWeight={600}>
                        {pct}%
                      </text>
                    );
                  }} />
                </Bar>
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} payload={[
                  { value: "Registradas", type: "square", color: "#22c55e" },
                  { value: "Justificadas", type: "square", color: "#ef4444" },
                  { value: "Headcount Ativo", type: "square", color: "#D3D1C7" },
                ]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {(() => {
            const FAIXAS = [
              { key: "ate1d", name: "Até 1 dia", color: "#22c55e", rgba: "34,197,94" },
              { key: "de1a3d", name: "1–3 dias", color: "#84cc16", rgba: "132,204,22" },
              { key: "de3a7d", name: "3–7 dias", color: "#eab308", rgba: "234,179,8" },
              { key: "de7a15d", name: "7–15 dias", color: "#f97316", rgba: "249,115,22" },
              { key: "mais15d", name: "+15 dias", color: "#ef4444", rgba: "239,68,68" },
            ];
            // Compute weighted avg tempo (days) per month from faixa midpoints
            const FAIXA_MIDPOINTS: Record<string, number> = { ate1d: 0.5, de1a3d: 2, de3a7d: 5, de7a15d: 11, mais15d: 20 };
            const tratData = tratativaFaixasFiltrada.map(d => {
              const tempoDias = d.total > 0
                ? +(Object.keys(FAIXA_MIDPOINTS).reduce((sum, k) => sum + (d[k as keyof typeof d] as number) * FAIXA_MIDPOINTS[k], 0) / d.total).toFixed(1)
                : 0;
              return {
                mes: d.mes,
                ate1d: (d.ate1d / d.total) * 100,
                de1a3d: (d.de1a3d / d.total) * 100,
                de3a7d: (d.de3a7d / d.total) * 100,
                de7a15d: (d.de7a15d / d.total) * 100,
                mais15d: (d.mais15d / d.total) * 100,
                tempoDias,
                _raw: d,
              };
            });
            const maxTempo = Math.max(...tratData.map(d => d.tempoDias), 1);
            const tratClick = (e: any) => {
              if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
            };
            const tratXTick = (props: any) => {
              const { x, y, payload } = props;
              const isActive = selectedMes === payload.value;
              return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
            };
            const tratTooltip = ({ active, payload, label }: any) => {
              if (!active || !payload?.length) return null;
              const d = payload[0]?.payload;
              const raw = d?._raw;
              if (!raw) return null;
              return (
                <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{raw.total.toLocaleString("pt-BR")}</span></p>
                  {FAIXAS.map(f => {
                    const abs = raw[f.key as keyof typeof raw] as number;
                    const pct = ((abs / raw.total) * 100).toFixed(0);
                    return (
                      <div key={f.key} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5" style={{ backgroundColor: f.color }} />
                        <span className="text-muted-foreground">{f.name}:</span>
                        <span className="font-medium text-foreground">{pct}% ({abs.toLocaleString("pt-BR")})</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-1.5 pt-0.5 border-t border-border/40">
                    <span className="w-2.5 h-0 border-t-2 border-dashed" style={{ borderColor: "#3b82f6" }} />
                    <span className="text-muted-foreground">Tempo médio:</span>
                    <span className="font-medium text-foreground">{d.tempoDias} dias</span>
                  </div>
                </div>
              );
            };
            return (
            <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
              <div className="flex items-center justify-between mb-0.5">
                <div>
                  <h4 className="text-sm font-semibold">Evolução do Tempo de Tratativa</h4>
                  <p className="text-[10px] text-muted-foreground mb-2">Evolução mensal da distribuição por faixa · linha azul = tempo médio (dias)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={tratData} onClick={tratClick}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={tratXTick} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={v => `${Math.round(v)}%`} domain={[0, 100]} label={{ value: "Distribuição por faixa (%)", angle: -90, position: "insideLeft", style: { fontSize: 9, fill: "hsl(var(--muted-foreground))" }, offset: 5 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, Math.ceil(maxTempo * 1.3)]} label={{ value: "Tempo médio (dias)", angle: 90, position: "insideRight", style: { fontSize: 9, fill: "hsl(var(--muted-foreground))" }, offset: 5 }} />
                  <RechartsTooltip content={tratTooltip} />
                  {selectedMes && <ReferenceLine yAxisId="left" x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                  {FAIXAS.map(f => (
                    <Area yAxisId="left" key={f.key} type="monotone" dataKey={f.key} stackId="1" stroke={f.color} fill={`rgba(${f.rgba},${selectedMes ? 0.2 : 0.35})`} fillOpacity={1} name={f.name} />
                  ))}
                  <Line yAxisId="right" type="monotone" dataKey="tempoDias" name="Tempo médio" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: "#3b82f6" }} />
                  <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} payload={[
                    ...FAIXAS.map(f => ({ value: f.name, type: "square" as const, color: f.color })),
                    { value: "Tempo médio (dias)", type: "line" as const, color: "#3b82f6" },
                  ]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            );
          })()}
        </div>

        {/* Row 2: Scatter charts */}
        <div className="grid grid-cols-2 gap-3">
          <div data-onboarding="scatter-qualidade" className={`bg-card border rounded-xl p-4 ${selectedRegional ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="text-sm font-semibold">Qualidade vs Volume</h4>
              <InfoTip text="Operações no quadrante inferior direito (alto volume, baixa qualidade) devem ser priorizadas." />
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Por operação · tamanho = headcount{selectedMes ? ` · ${selectedMes}` : " · consolidado"}</p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="volume" name="Volume" domain={[qualDomain.xMin, qualDomain.xMax]} tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} label={{ value: "Volume de marcações", position: "insideBottom", offset: -5, fontSize: 10 }} />
                <YAxis type="number" dataKey="qualidade" name="Qualidade" domain={[qualDomain.yMin, qualDomain.yMax]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} label={{ value: "Qualidade (%)", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <ZAxis type="number" dataKey="headcount" range={[200, 800]} />
                <ReferenceLine y={avgQualQualidade} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <ReferenceLine x={avgQualVolume} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <RechartsTooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border rounded-lg p-2 shadow-md text-xs">
                      <p className="font-semibold">{d.regional}</p>
                      <p>Volume: {(d.volume / 1000).toFixed(0)}K marcações</p>
                      <p>Qualidade: {d.qualidade}%</p>
                      <p>Headcount: {d.headcount}</p>
                    </div>
                  );
                }} />
                <Scatter data={chartScatterQual} shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  const r = Math.max(8, Math.sqrt(payload.headcount) * 0.8);
                  const fill = payload.qualidade >= 85 ? "#22c55e" : payload.qualidade >= 75 ? "#f97316" : "#ef4444";
                  const isSelected = !selectedRegional || selectedRegional === payload.regional;
                  return (
                    <g onClick={() => onRegionalClick(payload.regional)} onContextMenu={(e: any) => { e.preventDefault(); e.stopPropagation(); onItemDetail?.(payload.regional); }} className="cursor-pointer">
                      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={isSelected ? 0.7 : 0.15} stroke={fill} strokeWidth={isSelected ? 1.5 : 0.5} />
                      <text x={cx} y={cy - r - 3} textAnchor="middle" fontSize={8} fontWeight={600} fill={isSelected ? "#374151" : "#9ca3af"}>{payload.regional.replace("", "").split(/\s+/)[0]?.slice(0, 3).toUpperCase() || abreviar(payload.regional)}</text>
                    </g>
                  );
                }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {(() => {
            const esforcoSources: Record<string, any[]> = {
              empresa: esforcoEmpresa,
              unidade: esforcoUnNegocio,
              area: esforcoArea,
            };
            const rawEsforco = esforcoSources[groupBy] ?? esforcoEmpresa;

            // Check area insufficiency
            const areaInsufficient = groupBy === "area" && (rawEsforco.length < 6 || new Set(rawEsforco.map((r: any) => r.area_name)).size < 3);

            // Aggregate by competencia (optionally filtered by sidebar selection)
            // Normalize: strip "VIG EYES " prefix for comparison
            const normName = (n: string) => n.replace(/^VIG\s*EYES\s*/i, "").trim().toUpperCase();
            const filtered = selectedRegional
              ? rawEsforco.filter((r: any) => {
                  const selNorm = normName(selectedRegional);
                  if (groupBy === "empresa") return String(r.company_id) === selectedRegional || normName(r.company_name ?? "") === selNorm;
                  if (groupBy === "unidade") return String(r.business_unit_id) === selectedRegional || normName(r.business_unit_name ?? "") === selNorm;
                  return String(r.area_id) === selectedRegional || normName(r.area_name ?? "") === selNorm;
                })
              : rawEsforco;

            const MONTH_LABELS: Record<string, string> = {
              "2025-04": "abr/25", "2025-05": "mai/25", "2025-06": "jun/25",
              "2025-07": "jul/25", "2025-08": "ago/25", "2025-09": "set/25",
              "2025-10": "out/25", "2025-11": "nov/25", "2025-12": "dez/25",
              "2026-01": "jan/26", "2026-02": "fev/26", "2026-03": "mar/26",
            };

            // Aggregate by month (now including horas_extras)
            const byMonth = new Map<string, { ajustes: number; operadores: number; he: number }>();
            filtered.forEach((r: any) => {
              const m = r.competencia;
              if (!byMonth.has(m)) byMonth.set(m, { ajustes: 0, operadores: 0, he: 0 });
              const entry = byMonth.get(m)!;
              entry.ajustes += r.qtd_ajustes;
              entry.operadores += r.operadores_ativos;
              entry.he += (r.horas_extras_rateadas ?? 0);
            });

            const allEntries = Array.from(byMonth.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([m, d]) => ({
                mes: MONTH_LABELS[m] || m,
                ajustes: d.ajustes,
                operadores: d.operadores,
                produtividade: d.operadores > 0 ? Math.round(d.ajustes / d.operadores) : 0,
                he: Math.round(d.he * 10) / 10,
              }));

            // Percentile-based thresholds from own data
            const prodValues = allEntries.map(d => d.produtividade).sort((a, b) => a - b);
            const p50Idx = Math.floor(prodValues.length * 0.5);
            const p90Idx = Math.floor(prodValues.length * 0.9);
            const P50 = prodValues[p50Idx] || 100;
            const P90 = prodValues[p90Idx] || 500;
            const thresholdYellow = Math.round(P50 * 1.5);

            const sobrecargaData = allEntries.map(d => {
              const categoria = d.produtividade > P90 ? "Pico crítico" : d.produtividade > thresholdYellow ? "Acima do baseline" : "Saudável";
              const barColor = d.produtividade > P90 ? "#ef4444" : d.produtividade > thresholdYellow ? "#f59e0b" : "#22c55e";
              return { ...d, categoria, barColor };
            });

            // Contextual indicators
            const picoHEEntry = sobrecargaData.reduce((max, d) => d.he > max.he ? d : max, sobrecargaData[0]);
            const heP50 = (() => {
              const heVals = sobrecargaData.map(d => d.he).sort((a, b) => a - b);
              return heVals[Math.floor(heVals.length * 0.5)] || 0;
            })();
            const mesesCriticos = sobrecargaData.filter(d => d.produtividade > P90);
            const heCriticoAcumulada = mesesCriticos.reduce((sum, d) => sum + d.he, 0);
            const picoEntry = sobrecargaData.reduce((max, d) => d.produtividade > max.produtividade ? d : max, sobrecargaData[0]);

            if (areaInsufficient) {
              return (
                <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center" style={{ minHeight: 340 }}>
                  <p className="text-sm font-semibold text-muted-foreground">Dados de área não disponíveis para esta operação no período.</p>
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-xs text-center">A dimensão Área depende do cadastro completo de area_workplace. Consulte o time de configuração para habilitar esse recorte.</p>
                </div>
              );
            }

            return (
              <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold">Sobrecarga do Back-office</h4>
                      <InfoTip text="Mostra quantos ajustes cada operador do back-office processou em média por mês e quantas horas extras o time teve. A cor da barra indica se a carga está dentro do normal histórico ou em zona crítica. A linha tracejada mostra horas extras acumuladas, para entender como o time absorveu os picos." />
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-1">Carga por operador e horas extras do time por mês</p>
                  </div>
                </div>
                {/* Contextual indicators */}
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2 flex-wrap">
                  <span>Baseline (P50): {P50} ajustes/pessoa</span>
                  <span className="mx-0.5">·</span>
                  <span>{Math.round(heP50)}h HE/mês</span>
                  <span className="mx-0.5">·</span>
                  <span>Pico: {picoHEEntry?.mes} ({Math.round(picoHEEntry?.he)}h HE)</span>
                  <span className="mx-0.5">·</span>
                  <span>HE acumulada no período crítico: {Math.round(heCriticoAcumulada)}h</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={sobrecargaData} margin={{ top: 24, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} label={{ value: "HE (h)", angle: 90, position: "insideRight", fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                    <ReferenceLine yAxisId="left" y={P50} stroke="#22c55e" strokeDasharray="8 4" strokeWidth={1.5} label={{ value: `Baseline P50`, position: "left", fontSize: 9, fill: "#22c55e" }} />
                    <RechartsTooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      if (!d) return null;
                      const isCriticalOrWarning = d.categoria !== "Saudável";
                      return (
                        <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                          <p className="font-semibold text-foreground">{label}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5" style={{ backgroundColor: d.barColor }} />
                            <span className="text-muted-foreground">Ajustes por operador:</span>
                            <span className="font-medium text-foreground">
                              {d.produtividade.toLocaleString("pt-BR")}
                              {isCriticalOrWarning && " ⚠"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5" style={{ backgroundColor: "#3b82f6" }} />
                            <span className="text-muted-foreground">Operadores ativos:</span>
                            <span className="font-medium text-foreground">{d.operadores}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5" style={{ backgroundColor: "#3b82f6" }} />
                            <span className="text-muted-foreground">Horas extras do time:</span>
                            <span className="font-medium text-foreground">{d.he.toLocaleString("pt-BR")}h</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5" style={{ backgroundColor: "hsl(var(--muted-foreground))" }} />
                            <span className="text-muted-foreground">Volume total:</span>
                            <span className="font-medium text-foreground">{d.ajustes.toLocaleString("pt-BR")} ajustes</span>
                          </div>
                          <div className="flex items-center gap-1.5 pt-0.5 border-t border-border/50">
                            <span className="w-2.5 h-2.5" style={{ backgroundColor: d.barColor }} />
                            <span className="text-muted-foreground">Classificação:</span>
                            <span className="font-medium" style={{ color: d.barColor }}>{d.categoria}</span>
                          </div>
                        </div>
                      );
                    }} />
                    <Bar yAxisId="left" dataKey="produtividade" radius={[4, 4, 0, 0]} name="Carga por operador">
                      {sobrecargaData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.barColor} fillOpacity={0.75} />
                      ))}
                      <LabelList content={({ x, y, width: w, index }: any) => {
                        const d = sobrecargaData[index];
                        if (!d) return null;
                        const isCritical = d.categoria === "Pico crítico";
                        const isPeak = d === picoEntry && isCritical;
                        return (
                          <g>
                            <text x={(x ?? 0) + (w ?? 0) / 2} y={(y ?? 0) - (isPeak ? 14 : 4)} textAnchor="middle" fontSize={9} fill="hsl(var(--muted-foreground))" fontWeight={500}>
                              {d.operadores}
                            </text>
                            {isPeak && (
                              <text x={(x ?? 0) + (w ?? 0) / 2} y={(y ?? 0) - 3} textAnchor="middle" fontSize={8} fill="#ef4444" fontWeight={700}>
                                ({d.produtividade.toLocaleString("pt-BR")})
                              </text>
                            )}
                          </g>
                        );
                      }} />
                    </Bar>
                    <Line yAxisId="right" type="monotone" dataKey="he" name="Horas extras" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: "#3b82f6" }} />
                  </ComposedChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: "#22c55e", opacity: 0.75 }} /> Saudável (≤P50×1.5)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: "#f59e0b", opacity: 0.75 }} /> Acima do baseline</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: "#ef4444", opacity: 0.75 }} /> Pico crítico (&gt;P90)</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-0 inline-block border-t-2 border-dashed" style={{ borderColor: "#3b82f6", width: 12 }} /> HE do time</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Insights da Qualidade do Ponto */}
        <QualidadeInsightsSection />
      </div>

      <GroupBySidebar items={sidebarItems} selectedRegional={selectedRegional} onRegionalClick={onRegionalClick} onItemDetail={onItemDetail} groupBy={groupBy} onGroupByChange={onGroupByChange} onPagedItemsChange={setVisibleNames} />

      <ChartDataModal
        open={chartDataModal === "evoQualidade"}
        onClose={() => setChartDataModal(null)}
        title="Evolução da Qualidade e Headcount"
        columns={evolucaoQualidadeHeadcountColumns}
        source={evolucaoQualidadeHeadcountSource}
        activeGroupBy={groupBy as "empresa" | "unidade" | "area"}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Sub-aba 2: Absenteísmo
// ══════════════════════════════════════════════════════════════
function AbsenteismoContent({ selectedRegional, onRegionalClick, onItemDetail, groupBy, onGroupByChange }: ContentProps) {
  const [visibleNames, setVisibleNames] = useState<string[]>([]);
  const [selectedMes, setSelectedMes] = useState<string | null>(null);
  const [absChartMode, setAbsChartMode] = useState<ChartMode>("line");
  const [absDataMode, setAbsDataMode] = useState<DataMode>("percent");
  const [chartDataModal, setChartDataModal] = useState<string | null>(null);
  const { config: absConfig } = useAbsenteismoScoreConfig();

  const idToLabelByGroup = useMemo(() => ({
    empresa: {
      "9379": "TERCEIRIZACAO",
      "9380": "PORTARIA E LIMPEZA",
      "9381": "SEGURANCA PATRIMONIAL",
    },
    unidade: {
      "17517": "TERCEIRIZACAO",
      "17518": "PORTARIA E LIMPEZA",
      "17519": "SEGURANCA PATRIMONIAL",
    },
    area: {
      "11043": "SAO PAULO",
      "11045": "SOROCABA",
      "11046": "PIRACICABA",
    },
  }), []);

  const labelToIdByGroup = useMemo(() => ({
    empresa: Object.fromEntries(Object.entries(idToLabelByGroup.empresa).map(([id, label]) => [label, id])),
    unidade: Object.fromEntries(Object.entries(idToLabelByGroup.unidade).map(([id, label]) => [label, id])),
    area: Object.fromEntries(Object.entries(idToLabelByGroup.area).map(([id, label]) => [label, id])),
  }), [idToLabelByGroup]);

  const selectedLabel = useMemo(() => {
    if (!selectedRegional) return null;
    return idToLabelByGroup[groupBy][selectedRegional as keyof typeof idToLabelByGroup[typeof groupBy]] ?? selectedRegional;
  }, [selectedRegional, groupBy, idToLabelByGroup]);

  // Scatter data per groupBy
  const allScatterData = useMemo(() => {
    const source = groupBy === "empresa" ? empresaAbsScatter : groupBy === "area" ? areaAbsScatter : unidadeAbsScatter;
    const labelToId = labelToIdByGroup[groupBy];
    return source.map((item) => ({
      ...item,
      entityId: labelToId[item.regional as keyof typeof labelToId] ?? item.regional,
    }));
  }, [groupBy, labelToIdByGroup]);

  // Filter scatter by visible sidebar ids
  const chartScatter = useMemo(() => {
    if (visibleNames.length === 0) return allScatterData;
    return allScatterData.filter(d => visibleNames.includes((d as any).entityId ?? d.regional));
  }, [allScatterData, visibleNames]);

  // Evolution data filtered by selectedRegional AND groupBy (use correct map per groupBy)
  const filteredAbsEvolucao = useMemo(() => {
    if (!selectedRegional) return absenteismoEvolucao;
    const mapByGroupBy = groupBy === "empresa" ? absenteismoEvolucaoPorEmpresa
      : groupBy === "unidade" ? absenteismoEvolucaoPorUnidade
      : absenteismoEvolucaoPorArea;
    const perGroup = selectedLabel ? mapByGroupBy[selectedLabel] : undefined;
    if (perGroup) return perGroup;
    const item = allScatterData.find(d => ((d as any).entityId ?? d.regional) === selectedRegional);
    if (!item) return absenteismoEvolucao;
    const ratio = item.absenteismo / absenteismoMedia;
    return absenteismoEvolucao.map(d => ({ ...d, value: +(d.value * ratio).toFixed(1), ausencias: Math.round(d.ausencias * ratio) }));
  }, [selectedRegional, selectedLabel, allScatterData, groupBy]);

  const filteredTurnoverEvolucao = useMemo((): TurnoverEvoRow[] => {
    if (!selectedRegional) return turnoverEvolucao;
    const mapByGroupBy = groupBy === "empresa" ? turnoverEvolucaoPorEmpresa
      : groupBy === "unidade" ? turnoverEvolucaoPorUnidade
      : turnoverEvolucaoPorArea;
    const perGroup = selectedLabel ? mapByGroupBy[selectedLabel] : undefined;
    if (perGroup) return perGroup;
    const item = allScatterData.find(d => ((d as any).entityId ?? d.regional) === selectedRegional);
    if (!item) return turnoverEvolucao;
    const ratio = item.turnover / turnoverMedia;
    return turnoverEvolucao.map(d => ({
      ...d,
      turnover_exit: +(d.turnover_exit * ratio).toFixed(2),
      turnover_entry: +(d.turnover_entry * ratio).toFixed(2),
      terminations: Math.round(d.terminations * ratio),
      hires: Math.round(d.hires * ratio),
    }));
  }, [selectedRegional, selectedLabel, allScatterData, groupBy]);

  const absEvolucaoValor = useMemo(() => filteredAbsEvolucao.map(d => ({
    ...d, ausencias: (d as any).ausencias ?? Math.round(d.value * 80),
  })), [filteredAbsEvolucao]);

  const turnEvolucaoValor = useMemo(() => filteredTurnoverEvolucao, [filteredTurnoverEvolucao]);

  const getItemCompositeScore = useCallback((absTaxa: number, turnoverMensal: number) => {
    const turnoverAnual = turnoverMensal * 12;
    return computeAbsCompositeScore(absTaxa, turnoverAnual, absConfig);
  }, [absConfig]);

  const activeData = useMemo(() => {
    if (!selectedRegional) {
      const sorted = [...allScatterData].sort((a, b) => {
        const sa = getItemCompositeScore(a.absenteismo, a.turnover).score;
        const sb = getItemCompositeScore(b.absenteismo, b.turnover).score;
        return sb - sa;
      });
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      const avgTaxa = absenteismoMedia;
      const turnoverAnual = +(turnoverMedia * 12).toFixed(1);
      const composite = computeAbsCompositeScore(avgTaxa, turnoverAnual, absConfig);
      const classif = getAbsScoreClassification(composite.score, absConfig);
      const bestScore = best ? getItemCompositeScore(best.absenteismo, best.turnover).score : 0;
      const worstScore = worst ? getItemCompositeScore(worst.absenteismo, worst.turnover).score : 0;
      return {
        score: Math.round(composite.score), taxa: avgTaxa, faixa: classif.label, scoreColor: classif.color,
        melhorOperacao: { nome: best?.regional ?? "—", score: Math.round(bestScore) },
        maiorRisco: { nome: worst?.regional ?? "—", score: Math.round(worstScore), indicador: `${worst?.absenteismo ?? 0}% taxa` },
        turnover: `${turnoverAnual}%`,
      };
    }
    const r = allScatterData.find(x => ((x as any).entityId ?? x.regional) === selectedRegional);
    if (!r) {
      const composite = computeAbsCompositeScore(absenteismoMedia, turnoverMedia * 12, absConfig);
      const classif = getAbsScoreClassification(composite.score, absConfig);
      return {
        score: Math.round(composite.score), taxa: absenteismoMedia, faixa: classif.label, scoreColor: classif.color,
        melhorOperacao: { nome: "—", score: 0 },
        maiorRisco: { nome: "—", score: 0, indicador: "—" },
        turnover: `${(turnoverMedia * 12).toFixed(1)}%`,
      };
    }
    const turnoverAnual = +(r.turnover * 12).toFixed(1);
    const composite = computeAbsCompositeScore(r.absenteismo, turnoverAnual, absConfig);
    const classif = getAbsScoreClassification(composite.score, absConfig);
    return {
      score: Math.round(composite.score), taxa: r.absenteismo,
      faixa: classif.label, scoreColor: classif.color,
      melhorOperacao: { nome: selectedLabel ?? r.regional, score: Math.round(composite.score) },
      maiorRisco: { nome: selectedLabel ?? r.regional, score: Math.round(composite.score), indicador: `${r.absenteismo}% taxa` },
      turnover: `${turnoverAnual}%`,
    };
  }, [selectedRegional, selectedLabel, allScatterData, absConfig, getItemCompositeScore]);

  const sidebarItems = useMemo(() => {
    const getItems = () => {
      if (groupBy === "empresa") return empresaAbsScatter;
      if (groupBy === "area") return areaAbsScatter;
      return unidadeAbsScatter;
    };
    const labelToId = labelToIdByGroup[groupBy];
    return [...getItems()]
      .map(e => {
        const cs = getItemCompositeScore(e.absenteismo, e.turnover);
        return { nome: e.regional, value: labelToId[e.regional as keyof typeof labelToId] ?? e.regional, score: Math.round(cs.score) };
      })
      .sort((a, b) => b.score - a.score);
  }, [groupBy, labelToIdByGroup, absConfig, getItemCompositeScore]);

  // Scatter color helpers using composite score
  const getAbsTurnoverColor = (abs: number, turn: number) => {
    const cs = getItemCompositeScore(abs, turn).score;
    if (cs >= 70) return "#22c55e";
    if (cs >= 55) return "#f97316";
    return "#ef4444";
  };
  const getAbsHEColor = (abs: number, he: number) => {
    if (abs < 5 && he < 380) return "#22c55e";
    if (abs >= 5 && he >= 380) return "#ef4444";
    return "#f97316";
  };

  // Dynamic scatter domains
  const absTurnoverDomain = useMemo(() => {
    const xVals = chartScatter.map(d => d.absenteismo);
    const yVals = chartScatter.map(d => d.turnover);
    return {
      xMin: Math.floor(Math.min(...xVals) - 0.5),
      xMax: Math.ceil(Math.max(...xVals) + 0.5),
      yMin: Math.floor(Math.min(...yVals) - 1),
      yMax: Math.ceil(Math.max(...yVals) + 1),
    };
  }, [chartScatter]);

  const absHEDomain = useMemo(() => {
    const xVals = chartScatter.map(d => d.absenteismo);
    const yVals = chartScatter.map(d => d.he);
    return {
      xMin: Math.floor(Math.min(...xVals) - 0.5),
      xMax: Math.ceil(Math.max(...xVals) + 0.5),
      yMin: Math.floor(Math.min(...yVals) / 10) * 10 - 20,
      yMax: Math.ceil(Math.max(...yVals) / 10) * 10 + 20,
    };
  }, [chartScatter]);

  const avgAbs = chartScatter.reduce((s, d) => s + d.absenteismo, 0) / (chartScatter.length || 1);
  const avgTurnover = chartScatter.reduce((s, d) => s + d.turnover, 0) / (chartScatter.length || 1);
  const avgHE = chartScatter.reduce((s, d) => s + d.he, 0) / (chartScatter.length || 1);

  // Shared chart helpers
  const showAbsValor = absDataMode === "valor";

  const absMediaRef = filteredAbsEvolucao.reduce((s, d) => s + d.value, 0) / filteredAbsEvolucao.length;
  const turnMediaExitRef = filteredTurnoverEvolucao.reduce((s, d) => s + d.turnover_exit, 0) / filteredTurnoverEvolucao.length;
  const turnMediaEntryRef = filteredTurnoverEvolucao.reduce((s, d) => s + d.turnover_entry, 0) / filteredTurnoverEvolucao.length;

  const handleChartClick = (e: any) => {
    if (e?.activeLabel) setSelectedMes((prev: string | null) => prev === e.activeLabel ? null : e.activeLabel);
  };
  const xTick = (props: any) => {
    const { x, y, payload } = props;
    const isActive = selectedMes === payload.value;
    return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
  };

  // Render evolution chart (abs or turnover)
  const renderEvoChart = (
    data: any[],
    dataKey: string,
    percentKey: string,
    color: string,
    chartMode: ChartMode,
    dataMode: DataMode,
    mediaRef: number,
    label: string,
  ) => {
    const isValor = dataMode === "valor";
    const yFmt = (v: number) => isValor ? (v >= 1000 ? `${(v/1000).toFixed(0)}K` : `${v}`) : `${v}%`;
    const activeKey = isValor ? dataKey : percentKey;

    if (chartMode === "bar") {
      return (
        <BarChart data={data} onClick={handleChartClick}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="mes" tick={xTick} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={yFmt} />
          <RechartsTooltip content={({ active, payload, label: lbl }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                <p className="font-semibold text-foreground">{lbl}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5" style={{ backgroundColor: color }} />
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="font-medium text-foreground">{d.value}%{isValor ? ` (${d[dataKey].toLocaleString("pt-BR")})` : ""}</span>
                </div>
              </div>
            );
          }} />
          {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
          {!isValor && <ReferenceLine y={mediaRef} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />}
          <Bar dataKey={activeKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? `${color}40` : `${color}A6`} />
            ))}
          </Bar>
        </BarChart>
      );
    }

    if (chartMode === "area") {
      return (
        <AreaChart data={data} onClick={handleChartClick}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="mes" tick={xTick} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={yFmt} domain={isValor ? undefined : ["auto", "auto"]} />
          <RechartsTooltip content={({ active, payload, label: lbl }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                <p className="font-semibold text-foreground">{lbl}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5" style={{ backgroundColor: color }} />
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="font-medium text-foreground">{d.value}%{isValor ? ` (${d[dataKey].toLocaleString("pt-BR")})` : ""}</span>
                </div>
              </div>
            );
          }} />
          {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
          {!isValor && <ReferenceLine y={mediaRef} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />}
          <Area type="monotone" dataKey={activeKey} stroke={color} fill={`${color}${selectedMes ? "33" : "59"}`} fillOpacity={1} />
        </AreaChart>
      );
    }

    // line (default)
    return (
      <LineChart data={data} onClick={handleChartClick}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="mes" tick={xTick} />
        <YAxis domain={isValor ? undefined : ["auto", "auto"]} tick={{ fontSize: 10 }} tickFormatter={yFmt} />
        <RechartsTooltip content={({ active, payload, label: lbl }) => {
          if (!active || !payload?.length) return null;
          const d = payload[0].payload;
          return (
            <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
              <p className="font-semibold text-foreground">{lbl}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground">{label}:</span>
                <span className="font-medium text-foreground">{d.value}%{isValor ? ` (${d[dataKey].toLocaleString("pt-BR")})` : ""}</span>
              </div>
            </div>
          );
        }} />
        {!isValor && <ReferenceLine y={mediaRef} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />}
        <Line type="monotone" dataKey={activeKey} stroke={color} strokeWidth={2} dot={(props: any) => {
          const { cx, cy, payload } = props;
          const isSelected = selectedMes === payload.mes;
          const isActive = !selectedMes || isSelected;
          return (
            <g key={payload.mes} className="cursor-pointer">
              {isSelected && <circle cx={cx} cy={cy} r={10} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1} strokeDasharray="3 2" />}
              <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? color : isActive ? color : `${color}55`} stroke="#fff" strokeWidth={2} />
            </g>
          );
        }} activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: "#fff" }} name={label} />
      </LineChart>
    );
  };
  const groupColumn = groupBy === "empresa" ? "company_name" : groupBy === "unidade" ? "business_unit_name" : "area_name";
  const groupLabel = groupBy === "empresa" ? "Empresa" : groupBy === "unidade" ? "Un. Negócio" : "Área";
  const filterClause = selectedLabel ? `\n  AND ${groupColumn} = '${selectedLabel}'` : "";

  const sqlAbsEvolucao = `SELECT\n  ${groupColumn} AS operacao,\n  DATE_FORMAT(competencia, '%b/%y') AS mes,\n  ROUND(taxa_absenteismo, 2) AS taxa_pct,\n  total_ausencias AS ausencias\nFROM vw_absenteismo_mensal\nWHERE competencia BETWEEN '2025-04-01' AND '2026-03-31'${filterClause}\nORDER BY operacao, competencia;`;
  const sqlTurnEvolucao = `SELECT\n  ${groupColumn} AS operacao,\n  DATE_FORMAT(reference_month, '%b/%y') AS mes,\n  turnover_exit_percentage AS demissoes_pct,\n  turnover_entry_percentage AS admissoes_pct,\n  terminations AS desligamentos,\n  hires AS admissoes,\n  avg_headcount AS headcount_medio\nFROM vw_turnover_mensal\nWHERE reference_month BETWEEN '2025-04-01' AND '2026-03-31'${filterClause}\nORDER BY operacao, reference_month;`;
  const sqlAbsVsTurnover = `WITH absenteismo AS (
    SELECT
        tt.customer_id,
        co.id AS company_id,
        co.${groupColumn} AS operacao,
        DATE_FORMAT(tt.reference_date, '%Y-%m-01') AS reference_month,
        ROUND(
            SUM(CASE WHEN tt.time_tracking_type_id IN (18,19,20,21,22,23,24,25,26,51,55,79,80,81,93,127,309) THEN tt.minutes ELSE 0 END)
            / NULLIF(
                SUM(CASE WHEN tt.time_tracking_type_id IN (1,2,8,12,13,71,72,94,95,217,218,262,18,19,20,21,22,23,24,25,26,51,55,79,80,81,93,127,309) THEN tt.minutes ELSE 0 END), 0
            ) * 100, 2
        ) AS absenteeism_percentage,
        COUNT(DISTINCT tt.person_id) AS headcount
    FROM time_tracking tt
    JOIN person p ON tt.person_id = p.id
    JOIN company co ON p.company_id = co.id
    WHERE tt.customer_id = 642
      AND tt.reference_date >= '2025-04-01'
      AND tt.reference_date < '2026-04-01'${filterClause}
    GROUP BY tt.customer_id, co.id, operacao, reference_month
),
demissoes AS (
    SELECT p.id AS person_id, p.company_id,
        COALESCE(p.demission_date,
            (SELECT MAX(a.start_date) FROM absence a
             JOIN absence_situation asit ON a.absence_situation_id = asit.id
             WHERE a.person_id = p.id AND asit.absence_type_id = 3)
        ) AS demission_date_final
    FROM person p
    WHERE p.customer_id = 642 AND p.person_situation_id = 3
),
turnover AS (
    SELECT d.company_id,
        DATE_FORMAT(d.demission_date_final, '%Y-%m-01') AS reference_month,
        COUNT(DISTINCT d.person_id) AS terminations
    FROM demissoes d
    WHERE d.demission_date_final >= '2025-04-01'
      AND d.demission_date_final < '2026-04-01'
    GROUP BY d.company_id, reference_month
)
SELECT
    a.operacao,
    a.reference_month,
    a.absenteeism_percentage,
    a.headcount,
    COALESCE(t.terminations, 0) AS terminations,
    ROUND(COALESCE(t.terminations, 0) / NULLIF(a.headcount, 0) * 100, 2) AS turnover_percentage
FROM absenteismo a
LEFT JOIN turnover t ON a.company_id = t.company_id AND a.reference_month = t.reference_month
ORDER BY a.reference_month, a.headcount DESC;`;
  const sqlMovimentacao = `SELECT\n  ${groupColumn} AS operacao,\n  TO_CHAR(reference_month, 'Mon/YY') AS mes,\n  SUM(CASE WHEN tipo = 'admissao' THEN 1 ELSE 0 END) AS admissoes,\n  SUM(CASE WHEN tipo = 'demissao' THEN 1 ELSE 0 END) AS demissoes,\n  SUM(CASE WHEN tipo = 'admissao' THEN 1 ELSE 0 END) - SUM(CASE WHEN tipo = 'demissao' THEN 1 ELSE 0 END) AS saldo\nFROM vw_movimentacoes\nWHERE reference_month BETWEEN '2025-04-01' AND '2026-03-31'\n${selectedLabel ? `  AND ${groupColumn} = '${selectedLabel}'` : ""}\nGROUP BY operacao, reference_month\nORDER BY reference_month;`;

  // Build comprehensive table data for modals (all entities flattened)
  const absModalData = useMemo(() => {
    const absMap = groupBy === "empresa" ? absenteismoEvolucaoPorEmpresa : groupBy === "unidade" ? absenteismoEvolucaoPorUnidade : absenteismoEvolucaoPorArea;
    const rows: { operacao: string; mes: string; value: number; ausencias: number }[] = [];
    for (const [name, data] of Object.entries(absMap)) {
      if (selectedLabel && name !== selectedLabel) continue;
      for (const d of data) {
        rows.push({ operacao: name, mes: d.mes, value: d.value, ausencias: d.ausencias });
      }
    }
    return rows;
  }, [groupBy, selectedLabel]);

  const turnModalData = useMemo(() => {
    const turnMap = groupBy === "empresa" ? turnoverEvolucaoPorEmpresa : groupBy === "unidade" ? turnoverEvolucaoPorUnidade : turnoverEvolucaoPorArea;
    const rows: { operacao: string; mes: string; turnover_exit: number; turnover_entry: number; terminations: number; hires: number; avg_headcount: number; saldo: number }[] = [];
    for (const [name, data] of Object.entries(turnMap)) {
      if (selectedLabel && name !== selectedLabel) continue;
      for (const d of data) {
        rows.push({ operacao: name, mes: d.mes, turnover_exit: d.turnover_exit, turnover_entry: d.turnover_entry, terminations: d.terminations, hires: d.hires, avg_headcount: d.avg_headcount, saldo: d.hires - d.terminations });
      }
    }
    return rows;
  }, [groupBy, selectedLabel]);

  const absVsTurnoverModalData = useMemo(() => {
    const map = groupBy === "empresa" ? absVsTurnoverPorEmpresa : groupBy === "unidade" ? absVsTurnoverPorUnidade : absVsTurnoverPorArea;
    const rows: { operacao: string; mes: string; absenteismo: number; turnover: number; headcount: number; desligamentos: number }[] = [];
    for (const [name, data] of Object.entries(map)) {
      if (selectedLabel && name !== selectedLabel) continue;
      for (const d of data) {
        rows.push({ operacao: name, mes: d.mes, absenteismo: d.absenteismo, turnover: d.turnover, headcount: d.headcount, desligamentos: d.desligamentos });
      }
    }
    return rows;
  }, [groupBy, selectedLabel]);

  // Movimentação Mensal data (derived from turnover evolution data)
  const movimentacaoData = useMemo(() => {
    const turnMap = groupBy === "empresa" ? turnoverEvolucaoPorEmpresa : groupBy === "unidade" ? turnoverEvolucaoPorUnidade : turnoverEvolucaoPorArea;
    const meses = ["abr/25","mai/25","jun/25","jul/25","ago/25","set/25","out/25","nov/25","dez/25","jan/26","fev/26","mar/26"];
    return meses.map((mes) => {
      let totalHires = 0;
      let totalTerminations = 0;
      for (const [name, data] of Object.entries(turnMap)) {
        if (selectedLabel && name !== selectedLabel) continue;
        const row = data.find((d) => d.mes === mes);
        if (row) {
          totalHires += row.hires;
          totalTerminations += row.terminations;
        }
      }
      return { mes, admissoes: totalHires, demissoes: -totalTerminations };
    });
  }, [groupBy, selectedLabel]);

  const movimentacaoYMax = useMemo(() => {
    const maxValue = Math.max(
      ...movimentacaoData.map((d) => d.admissoes),
      ...movimentacaoData.map((d) => Math.abs(d.demissoes))
    );

    return Math.max(2, Math.ceil(maxValue / 2) * 2);
  }, [movimentacaoData]);

  const movimentacaoTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let i = -movimentacaoYMax; i <= movimentacaoYMax; i += 2) {
      ticks.push(i);
    }
    return ticks;
  }, [movimentacaoYMax]);

  const movimentacaoSaldoMedio = useMemo(() => {
    const saldos = movimentacaoData.map((d) => d.admissoes + d.demissoes);
    return saldos.reduce((a, b) => a + b, 0) / (saldos.length || 1);
  }, [movimentacaoData]);

  const movimentacaoModalData = useMemo(() => {
    const turnMap = groupBy === "empresa" ? turnoverEvolucaoPorEmpresa : groupBy === "unidade" ? turnoverEvolucaoPorUnidade : turnoverEvolucaoPorArea;
    const rows: { operacao: string; mes: string; hires: number; terminations: number; saldo: number; total: number }[] = [];
    for (const [name, data] of Object.entries(turnMap)) {
      if (selectedLabel && name !== selectedLabel) continue;
      for (const d of data) {
        rows.push({ operacao: name, mes: d.mes, hires: d.hires, terminations: d.terminations, saldo: d.hires - d.terminations, total: d.hires + d.terminations });
      }
    }
    return rows;
  }, [groupBy, selectedLabel]);

  return (
    <div className="flex">
      <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4">
        {/* Linha 1: Score + 4 KPI Cards */}
        <div className="grid grid-cols-5 gap-3">
          <ScoreBoard title="Score da Aba" tooltip="Score composto que combina Absenteísmo e Turnover. Configure pesos e limites em Configuração.">
            <ScoreGauge score={activeData.score} label={`${activeData.score}`} faixa={activeData.faixa} color={activeData.scoreColor} />
          </ScoreBoard>
          <KPIBoard title="Absenteísmo (%)" tooltip="Taxa de ausências sobre o efetivo total no período." value={`${activeData.taxa}%`} valueColor={activeData.taxa <= 4 ? "text-green-600" : activeData.taxa <= 6 ? "text-orange-500" : "text-red-600"} />
          <KPIBoard title="Turnover Anual (%)" tooltip="Taxa anualizada para comparação com benchmarks de mercado. O setor de vigilância e facilities tem média de 40% a 80% ao ano." value={activeData.turnover} valueColor="text-orange-500" />
          <KPIBoard title="Melhor Operação" tooltip="Operação com maior score composto no período" value={activeData.melhorOperacao.nome} valueColor="text-green-600" subtitle={`Score ${activeData.melhorOperacao.score}`} />
          <KPIBoard title="Maior Risco" tooltip="Operação com menor score composto e maior concentração de risco" value={activeData.maiorRisco.nome} valueColor="text-red-600" subtitle={`Score ${activeData.maiorRisco.score} · ${activeData.maiorRisco.indicador}`} />
        </div>

        {/* Row 2: Evolution chart + Scatter */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div>
                <h4 className="text-sm font-semibold">Evolução do Absenteísmo</h4>
                <p className="text-[10px] text-muted-foreground mb-2">Por competência · clique para filtrar</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setChartDataModal("absEvolucao")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
                <ChartModeToggle dataMode={absDataMode} onDataModeChange={setAbsDataMode} chartMode={absChartMode} onChartModeChange={setAbsChartMode} />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              {renderEvoChart(absEvolucaoValor, "ausencias", "value", "#ef4444", absChartMode, absDataMode, absMediaRef, "Absenteísmo")}
            </ResponsiveContainer>
          </div>

          <div className={`bg-card border rounded-xl p-4 ${selectedRegional ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold">Absenteísmo vs Turnover</h4>
                <InfoTip text="Operações no quadrante superior direito indicam problema estrutural: alta rotatividade combinada com alto absenteísmo." />
              </div>
              <button onClick={() => setChartDataModal("absVsTurnover")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Por operação · tamanho = headcount</p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="absenteismo" name="Absenteísmo" domain={[absTurnoverDomain.xMin, absTurnoverDomain.xMax]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} label={{ value: "Absenteísmo (%)", position: "insideBottom", offset: -5, fontSize: 10 }} />
                <YAxis type="number" dataKey="turnover" name="Turnover" domain={[absTurnoverDomain.yMin, absTurnoverDomain.yMax]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} label={{ value: "Turnover (%)", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <ZAxis type="number" dataKey="headcount" range={[200, 800]} />
                <ReferenceLine y={avgTurnover} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <ReferenceLine x={avgAbs} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <RechartsTooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border rounded-lg p-2 shadow-md text-xs">
                      <p className="font-semibold">{d.regional}</p>
                      <p>Absenteísmo: {d.absenteismo}%</p>
                      <p>Turnover: {d.turnover}%</p>
                      <p>Headcount: {d.headcount}</p>
                    </div>
                  );
                }} />
                <Scatter data={chartScatter} shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  const r = Math.max(8, Math.sqrt(payload.headcount) * 0.8);
                  const fill = getAbsTurnoverColor(payload.absenteismo, payload.turnover);
                  const isSelected = !selectedRegional || selectedRegional === (payload.entityId ?? payload.regional);
                  return (
                    <g onClick={() => onRegionalClick(payload.entityId ?? payload.regional)} onContextMenu={(e: any) => { e.preventDefault(); e.stopPropagation(); onItemDetail?.(payload.entityId ?? payload.regional); }} className="cursor-pointer">
                      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={isSelected ? 0.7 : 0.15} stroke={fill} strokeWidth={isSelected ? 1.5 : 0.5} />
                      <text x={cx} y={cy - r - 3} textAnchor="middle" fontSize={8} fontWeight={600} fill={isSelected ? "#374151" : "#9ca3af"}>{abreviar(payload.regional)}</text>
                    </g>
                  );
                }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <GroupBySidebar items={sidebarItems} selectedRegional={selectedRegional} onRegionalClick={onRegionalClick} onItemDetail={onItemDetail} groupBy={groupBy} onGroupByChange={onGroupByChange} onPagedItemsChange={setVisibleNames} />

      <ChartDataModal open={chartDataModal === "absEvolucao"} onClose={() => setChartDataModal(null)} title={`Evolução do Absenteísmo — ${groupLabel}`} data={absModalData} columns={[{ key: "operacao", label: groupLabel }, { key: "mes", label: "Competência" }, { key: "value", label: "Taxa (%)" }, { key: "ausencias", label: "Ausências" }]} sqlQuery={sqlAbsEvolucao} />
      <ChartDataModal open={chartDataModal === "absVsTurnover"} onClose={() => setChartDataModal(null)} title={`Absenteísmo vs Turnover — ${groupLabel}`} data={absVsTurnoverModalData} columns={[{ key: "operacao", label: groupLabel }, { key: "mes", label: "Competência" }, { key: "absenteismo", label: "Absenteísmo (%)" }, { key: "turnover", label: "Turnover (%)" }, { key: "headcount", label: "Headcount" }, { key: "desligamentos", label: "Desligamentos" }]} sqlQuery={sqlAbsVsTurnover} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Sub-aba 3: Movimentações
// ══════════════════════════════════════════════════════════════
function MovimentacoesContent({ selectedRegional, onRegionalClick, onItemDetail, groupBy, onGroupByChange }: ContentProps) {
  const { config: scoreConfig } = useScoreConfig();
  const activeData = useMemo(() => {
    if (!selectedRegional) return { total: "23.0K", diff: "-18.3%", escala: "14.8K", posto: "8.2K" };
    const r = movimentacoesRegionais.find(x => x.nome === selectedRegional);
    if (!r) return { total: "23.0K", diff: "-18.3%", escala: "14.8K", posto: "8.2K" };
    return { total: `${(r.total / 1000).toFixed(1)}K`, diff: `${((r.total - 23000) / 23000 * 100).toFixed(1)}%`, escala: `${(r.escala / 1000).toFixed(1)}K`, posto: `${(r.posto / 1000).toFixed(1)}K` };
  }, [selectedRegional]);

  const totalNum = parseFloat(activeData.total) * 1000;
  const movGaugeScore = Math.max(0, 100 - (totalNum / 30000) * 100);
  const movClassif = getScoreClassification(Math.round(movGaugeScore), scoreConfig);
  const scoreColor = movClassif.text;
  const scoreFaixa = movClassif.label;
  const maxTotal = Math.max(...movimentacoesRegionais.map(r => r.total));

  const getMovScore = (total: number) => Math.round(Math.max(0, 100 - (total / maxTotal) * 100));
  const sidebarItems = useMemo(() => {
    if (groupBy === "empresa") return [...empresaData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(e.qualidade) }));
    if (groupBy === "area") return [...areaData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(e.qualidade) }));
    return [...unidadeData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(e.qualidade) }));
  }, [groupBy, maxTotal]);

  return (
    <div className="flex">
      <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 mb-1">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Movimentações</p>
              <InfoTip text="Total de trocas de escala e trocas de posto no período. Volume alto indica instabilidade operacional." />
            </div>
            <ScoreGauge score={Math.round(movGaugeScore)} color={movClassif.color} />
            <p className={`text-3xl font-bold leading-none -mt-1 ${scoreColor}`}>{activeData.total}</p>
            <p className={`text-xs font-semibold ${scoreColor} mt-0.5`}>{scoreFaixa}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Trocas de Escala</p>
              <InfoTip text="Colaboradores que tiveram sua escala alterada no período." />
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-0.5">{activeData.escala}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Trocas de Posto</p>
              <InfoTip text="Colaboradores que foram transferidos de posto no período." />
            </div>
            <p className="text-2xl font-bold text-sky-500 mt-0.5">{activeData.posto}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-2">Trocas por Competência</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={movimentacoesBarras}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={movimentacoesMediaBarras} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: "Média", position: "right", fontSize: 10, fill: "#9ca3af" }} />
                <Bar dataKey="escala" stackId="a" fill="hsl(var(--chart-2))" name="Trocas de Escala" />
                <Bar dataKey="posto" stackId="a" fill="hsl(var(--chart-3))" name="Trocas de Posto" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <h4 className="text-sm font-semibold">Evolução do Tempo de Fechamento</h4>
              <InfoTip text="Tempo médio entre o fim da competência e o fechamento do ponto pelo DP/RH." />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={movimentacoesEvolucao}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis domain={[5, 10]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}d`} />
                <RechartsTooltip formatter={(v: number) => [`${v} dias`, "Tempo"]} />
                <ReferenceLine y={movimentacoesMedia} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: `Média ${movimentacoesMedia}d`, position: "right", fontSize: 10, fill: "#9ca3af" }} />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Dias" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <GroupBySidebar items={sidebarItems} selectedRegional={selectedRegional} onRegionalClick={onRegionalClick} onItemDetail={onItemDetail} groupBy={groupBy} onGroupByChange={onGroupByChange} />
    </div>
  );
}

// ── Exported standalone tab wrappers ──
export function QualidadeTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [detailRegional, setDetailRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");
  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };
  return (
    <>
      <QualidadeContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} onItemDetail={setDetailRegional} groupBy={groupBy} onGroupByChange={handleGroupByChange} />
      <RegionalDetailModal regional={detailRegional} open={!!detailRegional} onClose={() => setDetailRegional(null)} />
    </>
  );
}

export function AbsenteismoTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [detailRegional, setDetailRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");
  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };
  return (
    <>
      <AbsenteismoContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} onItemDetail={setDetailRegional} groupBy={groupBy} onGroupByChange={handleGroupByChange} />
      <RegionalDetailModal regional={detailRegional} open={!!detailRegional} onClose={() => setDetailRegional(null)} />
    </>
  );
}

export function MovimentacoesTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [detailRegional, setDetailRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");
  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };
  return (
    <>
      <MovimentacoesContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} onItemDetail={setDetailRegional} groupBy={groupBy} onGroupByChange={handleGroupByChange} />
      <RegionalDetailModal regional={detailRegional} open={!!detailRegional} onClose={() => setDetailRegional(null)} />
    </>
  );
}
