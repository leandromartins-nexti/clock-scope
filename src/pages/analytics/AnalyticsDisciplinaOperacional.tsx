import { useState, useMemo, useEffect, useCallback } from "react";
import { Info, TrendingUp, TrendingDown, Minus, Eraser, AlertTriangle, ArrowUpRight, ArrowDownRight, X, ExternalLink, Search, ArrowUpDown, LineChartIcon, BarChart3, AreaChartIcon, Percent, Hash, Database } from "lucide-react";
import ChartDataModal from "@/components/analytics/ChartDataModal";
import ChartModeToggle from "@/components/analytics/ChartModeToggle";
import type { DataMode, ChartMode } from "@/components/analytics/ChartModeToggle";
import IndicatorTable, { type TableColumn, getScoreColor, getScoreBg, getLineColor, TrendIcon } from "@/components/analytics/IndicatorTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine,
  ScatterChart, Scatter, ZAxis, Cell,
} from "recharts";
import { aggregateAjustes, ajustesMeses, formatMesLabel, ajustesUnidades, ajustesAreas, ajustesEmpresas, aggregateComposicaoFaixas, aggregateQualidadeEvolucao, aggregateQualidadeEvolucaoDetalhado, aggregateQualidadeVolume, getQualidadeKpiSummary, getSidebarItems } from "@/lib/ajustesData";
import { useScoreConfig, getScoreClassification } from "@/contexts/ScoreConfigContext";
import { useAbsenteismoScoreConfig, computeAbsCompositeScore, getAbsScoreClassification } from "@/contexts/AbsenteismoScoreConfigContext";

import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";


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
  const [chartMode, setChartMode] = useState<ChartMode>("line");
  const [dataMode, setDataMode] = useState<DataMode>("percent");
  const [tratChartMode, setTratChartMode] = useState<ChartMode>("area");
  const [tratDataMode, setTratDataMode] = useState<DataMode>("percent");

  const [selectedMes, setSelectedMes] = useState<string | null>(null);

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
  const showDetalhado = dataMode === "valor";

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

  const qualColor = activeData.qualidadePct >= 85 ? "text-green-600" : activeData.qualidadePct >= 70 ? "text-orange-500" : "text-red-600";
  const tempoColor = activeData.tempoMedioDias < 3 ? "text-green-600" : activeData.tempoMedioDias <= 7 ? "text-orange-500" : "text-red-600";
  const ate1dColor = activeData.ate1DiaPct >= 50 ? "text-green-600" : activeData.ate1DiaPct >= 30 ? "text-orange-500" : "text-red-600";
  const mais15dColor = activeData.mais15DiaPct <= 10 ? "text-green-600" : activeData.mais15DiaPct <= 25 ? "text-orange-500" : "text-red-600";

  return (
    <div className="flex">
      {/* Left: KPI cards + charts */}
      <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4">
        {/* Linha 1: 5 KPI Cards */}
        <div className="grid grid-cols-5 gap-3">
          <ScoreBoard title="Qualidade do Ponto" tooltip="Score composto considerando qualidade das marcações e tempo de tratativa dos ajustes.">
            <ScoreGauge score={activeData.score} label={`${activeData.score}`} faixa={scoreFaixa} />
          </ScoreBoard>
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Qualidade</p>
              <InfoTip text="Percentual de marcações registradas corretamente, sem necessidade de ajuste." />
            </div>
            <p className={`text-xl font-bold mt-0.5 truncate ${qualColor}`}>{activeData.qualidadePct}%</p>
          </div>
          <KPIBoard title="Tempo Médio" tooltip="Tempo médio em dias entre a marcação original e o ajuste pelo operador." value={`${activeData.tempoMedioDias} dias`} valueColor={tempoColor} />
          <KPIBoard title="Melhor Operação" tooltip="Operação com maior score de qualidade no período" value={activeData.melhorOperacao.nome} valueColor="text-green-600" subtitle={`Score ${activeData.melhorOperacao.score} · ${activeData.melhorOperacao.score >= 85 ? "Alta" : activeData.melhorOperacao.score >= 70 ? "Média" : "Baixa"}`} />
          <KPIBoard title="Maior Risco" tooltip="Operação com menor qualidade e maior concentração de risco" value={activeData.maiorRisco.nome} valueColor="text-red-600" subtitle={`Score ${activeData.maiorRisco.score} · ${activeData.maiorRisco.indicador}`} />
        </div>

        {/* Row 1: Evolução Qualidade + Tempo Médio Tratativa */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div>
                <h4 className="text-sm font-semibold">Evolução da Qualidade</h4>
                <p className="text-[10px] text-muted-foreground mb-2">Por competência · clique para filtrar</p>
              </div>
              <ChartModeToggle
                dataMode={dataMode} onDataModeChange={setDataMode}
                chartMode={chartMode} onChartModeChange={setChartMode}
              />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              {chartMode === "bar" ? (
                (() => {
                  const barData = showDetalhado
                    ? qualidadeDetalhado
                    : qualidadeDetalhado.map(d => {
                        const total = d.registradas + d.justificadas;
                        return {
                          mes: d.mes,
                          registradas: total > 0 ? +((d.registradas / total) * 100).toFixed(1) : 0,
                          justificadas: total > 0 ? +((d.justificadas / total) * 100).toFixed(1) : 0,
                        };
                      });
                  return (
                    <BarChart data={barData} onClick={(e: any) => {
                      if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
                    }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="mes" tick={(props: any) => {
                        const { x, y, payload } = props;
                        const isActive = selectedMes === payload.value;
                        return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                      }} />
                      <YAxis tick={{ fontSize: 10 }} domain={showDetalhado ? undefined : [0, 100]}
                        tickFormatter={v => showDetalhado ? (v >= 1000 ? `${(v/1000).toFixed(0)}K` : `${v}`) : `${v}%`} />
                      <RechartsTooltip content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const reg = payload.find((p: any) => p.dataKey === "registradas")?.value as number ?? 0;
                        const jus = payload.find((p: any) => p.dataKey === "justificadas")?.value as number ?? 0;
                        const total = showDetalhado ? reg + jus : 100;
                        return (
                          <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                            <p className="font-semibold text-foreground">{label}</p>
                            {showDetalhado && <p className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{total.toLocaleString("pt-BR")}</span></p>}
                            {[{ name: "Registradas", value: reg, color: "#22c55e" }, { name: "Justificadas", value: jus, color: "#ef4444" }].map(f => (
                              <div key={f.name} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5" style={{ backgroundColor: f.color }} />
                                <span className="text-muted-foreground">{f.name}:</span>
                                <span className="font-medium text-foreground">{showDetalhado ? `${((f.value / total) * 100).toFixed(0)}% (${f.value.toLocaleString("pt-BR")})` : `${f.value}%`}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }} />
                      <Legend iconType="square" iconSize={10} formatter={(value: string) => value === "registradas" ? "Registradas" : "Justificadas"} wrapperStyle={{ fontSize: 11 }} payload={[{ value: "Registradas", type: "square", color: "#22c55e" }, { value: "Justificadas", type: "square", color: "#ef4444" }]} />
                      <Bar dataKey="registradas" stackId="qual" stroke="#22c55e" strokeWidth={1} radius={[0, 0, 0, 0]}>
                        {barData.map((entry, idx) => (
                          <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.65)"} />
                        ))}
                      </Bar>
                      <Bar dataKey="justificadas" stackId="qual" stroke="rgba(239,68,68,0.5)" strokeWidth={1} radius={[4, 4, 0, 0]}>
                        {barData.map((entry, idx) => (
                          <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.65)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  );
                })()
              ) : chartMode === "area" ? (
                (() => {
                  const areaData = showDetalhado
                    ? qualidadeDetalhado
                    : qualidadeDetalhado.map(d => {
                        const total = d.registradas + d.justificadas;
                        return {
                          mes: d.mes,
                          registradas: total > 0 ? +((d.registradas / total) * 100).toFixed(1) : 0,
                          justificadas: total > 0 ? +((d.justificadas / total) * 100).toFixed(1) : 0,
                        };
                      });
                  return (
                    <AreaChart data={areaData} onClick={(e: any) => {
                      if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
                    }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="mes" tick={(props: any) => {
                        const { x, y, payload } = props;
                        const isActive = selectedMes === payload.value;
                        return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                      }} />
                      <YAxis tick={{ fontSize: 10 }} domain={showDetalhado ? undefined : [0, 100]}
                        tickFormatter={v => showDetalhado ? (v >= 1000 ? `${(v/1000).toFixed(0)}K` : `${v}`) : `${Math.round(v)}%`} />
                      <RechartsTooltip content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const reg = payload.find((p: any) => p.dataKey === "registradas")?.value as number ?? 0;
                        const jus = payload.find((p: any) => p.dataKey === "justificadas")?.value as number ?? 0;
                        const total = showDetalhado ? reg + jus : 100;
                        return (
                          <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                            <p className="font-semibold text-foreground">{label}</p>
                            {showDetalhado && <p className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{total.toLocaleString("pt-BR")}</span></p>}
                            {[{ name: "Registradas", value: reg, color: "#22c55e" }, { name: "Justificadas", value: jus, color: "#ef4444" }].map(f => (
                              <div key={f.name} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5" style={{ backgroundColor: f.color }} />
                                <span className="text-muted-foreground">{f.name}:</span>
                                <span className="font-medium text-foreground">{showDetalhado ? `${((f.value / total) * 100).toFixed(0)}% (${f.value.toLocaleString("pt-BR")})` : `${f.value}%`}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }} />
                      {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                      <Area type="monotone" dataKey="registradas" stackId="qual" stroke="#22c55e" fill={`rgba(34,197,94,${selectedMes ? 0.2 : 0.35})`} fillOpacity={1} name="Registradas" />
                      <Area type="monotone" dataKey="justificadas" stackId="qual" stroke="#ef4444" fill={`rgba(239,68,68,${selectedMes ? 0.2 : 0.35})`} fillOpacity={1} name="Justificadas" />
                      <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                    </AreaChart>
                  );
                })()
              ) : (
                showDetalhado ? (
                  <LineChart data={qualidadeDetalhado} onClick={(e: any) => {
                    if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
                  }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" tick={(props: any) => {
                      const { x, y, payload } = props;
                      const isActive = selectedMes === payload.value;
                      return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                    }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : `${v}`} />
                    <RechartsTooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const reg = payload.find((p: any) => p.dataKey === "registradas")?.value as number ?? 0;
                      const jus = payload.find((p: any) => p.dataKey === "justificadas")?.value as number ?? 0;
                      const total = reg + jus;
                      return (
                        <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                          <p className="font-semibold text-foreground">{label}</p>
                          <p className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{total.toLocaleString("pt-BR")}</span></p>
                          {[{ name: "Registradas", value: reg, color: "#22c55e" }, { name: "Justificadas", value: jus, color: "#ef4444" }].map(f => (
                            <div key={f.name} className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5" style={{ backgroundColor: f.color }} />
                              <span className="text-muted-foreground">{f.name}:</span>
                              <span className="font-medium text-foreground">{`${((f.value / total) * 100).toFixed(1)}% (${f.value.toLocaleString("pt-BR")})`}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }} />
                    <Legend formatter={(value: string) => value === "registradas" ? "Registradas" : "Justificadas"} wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="registradas" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }} name="registradas" />
                    <Line type="monotone" dataKey="justificadas" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }} name="justificadas" />
                  </LineChart>
                ) : (
                  <LineChart data={qualidadeEvolucaoReal} onClick={(e: any) => {
                    if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
                  }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" tick={(props: any) => {
                      const { x, y, payload } = props;
                      const isActive = selectedMes === payload.value;
                      return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                    }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                    <RechartsTooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const val = payload[0]?.value as number ?? 0;
                      const detRow = qualidadeDetalhado.find(d => d.mes === label);
                      const total = detRow ? detRow.registradas + detRow.justificadas : 0;
                      return (
                        <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                          <p className="font-semibold text-foreground">{label}</p>
                          {total > 0 && <p className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{total.toLocaleString("pt-BR")}</span></p>}
                          {[
                            { name: "Registradas", pct: val, count: detRow?.registradas ?? 0, color: "#22c55e" },
                            { name: "Justificadas", pct: +(100 - val).toFixed(2), count: detRow?.justificadas ?? 0, color: "#ef4444" },
                          ].map(f => (
                            <div key={f.name} className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5" style={{ backgroundColor: f.color }} />
                              <span className="text-muted-foreground">{f.name}:</span>
                              <span className="font-medium text-foreground">{total > 0 ? `${f.pct}% (${f.count.toLocaleString("pt-BR")})` : `${f.pct}%`}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }} />
                    <ReferenceLine y={qualidadeMedia} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                    <Line type="monotone" dataKey="value" stroke={selectedMes ? "#FF572244" : "#FF5722"} strokeWidth={2} dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      const isSelected = selectedMes === payload.mes;
                      const isActive = !selectedMes || isSelected;
                      return (
                        <g key={payload.mes} className="cursor-pointer">
                          {isSelected && <circle cx={cx} cy={cy} r={10} fill="#FF5722" fillOpacity={0.15} stroke="#FF5722" strokeWidth={1} strokeDasharray="3 2" />}
                          <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? "#FF5722" : isActive ? "#FF5722" : "#FF572255"} stroke="#fff" strokeWidth={2} />
                        </g>
                      );
                    }} activeDot={{ r: 6, stroke: "#FF5722", strokeWidth: 2, fill: "#fff" }} name="Qualidade" />
                  </LineChart>
                )
              )}
            </ResponsiveContainer>
          </div>

          {(() => {
            const showTratDetalhado = tratDataMode === "valor";
            const FAIXAS = [
              { key: "ate1d", name: "Até 1 dia", color: "#22c55e", rgba: "34,197,94" },
              { key: "de1a3d", name: "1–3 dias", color: "#84cc16", rgba: "132,204,22" },
              { key: "de3a7d", name: "3–7 dias", color: "#eab308", rgba: "234,179,8" },
              { key: "de7a15d", name: "7–15 dias", color: "#f97316", rgba: "249,115,22" },
              { key: "mais15d", name: "+15 dias", color: "#ef4444", rgba: "239,68,68" },
            ];
            const tratData = tratativaFaixasFiltrada.map(d => ({
              mes: d.mes,
              ate1d: showTratDetalhado ? d.ate1d : (d.ate1d / d.total) * 100,
              de1a3d: showTratDetalhado ? d.de1a3d : (d.de1a3d / d.total) * 100,
              de3a7d: showTratDetalhado ? d.de3a7d : (d.de3a7d / d.total) * 100,
              de7a15d: showTratDetalhado ? d.de7a15d : (d.de7a15d / d.total) * 100,
              mais15d: showTratDetalhado ? d.mais15d : (d.mais15d / d.total) * 100,
              _raw: d,
            }));
            const tratClick = (e: any) => {
              if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
            };
            const tratXTick = (props: any) => {
              const { x, y, payload } = props;
              const isActive = selectedMes === payload.value;
              return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
            };
            const tratYDomain = showTratDetalhado ? undefined : [0, 100];
            const tratYFmt = (v: number) => showTratDetalhado ? (v >= 1000 ? `${(v/1000).toFixed(0)}K` : `${v}`) : `${Math.round(v)}%`;
            const tratTooltip = ({ active, payload, label }: any) => {
              if (!active || !payload?.length) return null;
              const raw = payload[0]?.payload?._raw;
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
                </div>
              );
            };
            return (
            <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
              <div className="flex items-center justify-between mb-0.5">
                <div>
                  <h4 className="text-sm font-semibold">Composição do Tempo de Tratativa</h4>
                  <p className="text-[10px] text-muted-foreground mb-2">Evolução mensal da distribuição por faixa</p>
                </div>
                <ChartModeToggle
                  dataMode={tratDataMode} onDataModeChange={setTratDataMode}
                  chartMode={tratChartMode} onChartModeChange={setTratChartMode}
                />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                {tratChartMode === "bar" ? (
                  <BarChart data={tratData} onClick={tratClick}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" tick={tratXTick} />
                    <YAxis tick={{ fontSize: 10 }} domain={tratYDomain as any} tickFormatter={tratYFmt} />
                    <RechartsTooltip content={tratTooltip} />
                    {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                    {FAIXAS.map((f, i) => (
                      <Bar key={f.key} dataKey={f.key} stackId="trat" stroke={`rgba(${f.rgba},0.5)`} strokeWidth={1} radius={i === FAIXAS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} name={f.name}>
                        {tratData.map((entry, idx) => (
                          <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? `rgba(${f.rgba},0.25)` : `rgba(${f.rgba},0.65)`} />
                        ))}
                      </Bar>
                    ))}
                    <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} payload={FAIXAS.map(f => ({ value: f.name, type: "square" as const, color: f.color }))} />
                  </BarChart>
                ) : tratChartMode === "area" ? (
                  <AreaChart data={tratData} onClick={tratClick}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" tick={tratXTick} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={tratYFmt} domain={tratYDomain as any} />
                    <RechartsTooltip content={tratTooltip} />
                    {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                    {FAIXAS.map(f => (
                      <Area key={f.key} type="monotone" dataKey={f.key} stackId="1" stroke={f.color} fill={`rgba(${f.rgba},${selectedMes ? 0.2 : 0.35})`} fillOpacity={1} name={f.name} />
                    ))}
                    <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                  </AreaChart>
                ) : (
                  <LineChart data={tratData} onClick={tratClick}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" tick={tratXTick} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={tratYFmt} domain={tratYDomain as any} />
                    <RechartsTooltip content={tratTooltip} />
                    {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                    {FAIXAS.map(f => (
                      <Line key={f.key} type="monotone" dataKey={f.key} stroke={f.color} strokeWidth={2} dot={{ r: 3, fill: f.color }} name={f.name} />
                    ))}
                    <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                  </LineChart>
                )}
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

          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="text-sm font-semibold">Tempo de Tratativa vs Volume</h4>
              <InfoTip text="Operações com alto volume e alto tempo de tratativa precisam de atenção prioritária. Dados reais agregados por unidade de negócio." />
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Por operação · tamanho = headcount{selectedMes ? ` · ${selectedMes}` : " · consolidado"}</p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="volume" name="Volume" domain={[tratDomain.xMin, tratDomain.xMax]} tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} label={{ value: "Volume de marcações", position: "insideBottom", offset: -5, fontSize: 10 }} />
                <YAxis type="number" dataKey="dias" name="Tempo" domain={[tratDomain.yMin, tratDomain.yMax]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}d`} label={{ value: "Tempo tratativa (dias)", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <ZAxis type="number" dataKey="headcount" range={[200, 800]} />
                <ReferenceLine y={avgTratDias} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <ReferenceLine x={avgTratVolume} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <RechartsTooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border rounded-lg p-2 shadow-md text-xs">
                      <p className="font-semibold">{d.regional}</p>
                      <p>Volume: {(d.volume / 1000).toFixed(0)}K marcações</p>
                      <p>Tempo: {d.dias} dias</p>
                      <p>Headcount: {d.headcount}</p>
                    </div>
                  );
                }} />
                <Scatter data={chartScatterTrat} shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  const r = Math.max(8, Math.sqrt(payload.headcount) * 0.8);
                  const fill = payload.dias < 5 ? "#22c55e" : payload.dias <= 7 ? "#f97316" : "#ef4444";
                  const isSelected = selectedRegional === payload.regional;
                  const isDimmed = selectedRegional && !isSelected;
                  return (
                    <g opacity={isDimmed ? 0.25 : 1} style={{ cursor: "pointer" }} onClick={() => onRegionalClick(payload.regional)}>
                      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={isSelected ? 0.9 : 0.7} stroke={fill} strokeWidth={isSelected ? 2.5 : 1.5} />
                      <text x={cx} y={cy - r - 3} textAnchor="middle" fontSize={8} fontWeight={600} fill="#374151">{payload.regional.replace("", "").split(/\s+/)[0]?.slice(0, 3).toUpperCase() || abreviar(payload.regional)}</text>
                    </g>
                  );
                }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <GroupBySidebar items={sidebarItems} selectedRegional={selectedRegional} onRegionalClick={onRegionalClick} onItemDetail={onItemDetail} groupBy={groupBy} onGroupByChange={onGroupByChange} onPagedItemsChange={setVisibleNames} />
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
        score: Math.round(composite.score), taxa: avgTaxa, faixa: classif.label,
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
        score: Math.round(composite.score), taxa: absenteismoMedia, faixa: classif.label,
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
      faixa: classif.label,
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
  const sqlAbsVsHE = `SELECT\n  ${groupColumn} AS operacao,\n  ROUND(taxa_absenteismo, 2) AS absenteismo_pct,\n  ROUND(horas_extras_por_100_colab, 0) AS he_por_100_colab,\n  headcount\nFROM vw_indicadores_operacao\nWHERE competencia BETWEEN '2025-04-01' AND '2026-03-31'\nGROUP BY operacao\nORDER BY absenteismo_pct DESC;`;

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

  return (
    <div className="flex">
      <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4">
        {/* Linha 1: Score + 4 KPI Cards */}
        <div className="grid grid-cols-5 gap-3">
          <ScoreBoard title="Score da Aba" tooltip="Score composto que combina Absenteísmo e Turnover. Configure pesos e limites em Configuração.">
            <ScoreGauge score={activeData.score} label={`${activeData.score}`} faixa={activeData.faixa} />
          </ScoreBoard>
          <KPIBoard title="Absenteísmo (%)" tooltip="Taxa de ausências sobre o efetivo total no período." value={`${activeData.taxa}%`} valueColor={activeData.taxa <= 4 ? "text-green-600" : activeData.taxa <= 6 ? "text-orange-500" : "text-red-600"} />
          <KPIBoard title="Turnover Anual (%)" tooltip="Taxa anualizada para comparação com benchmarks de mercado. O setor de vigilância e facilities tem média de 40% a 80% ao ano." value={activeData.turnover} valueColor="text-orange-500" />
          <KPIBoard title="Melhor Operação" tooltip="Operação com maior score composto no período" value={activeData.melhorOperacao.nome} valueColor="text-green-600" subtitle={`Score ${activeData.melhorOperacao.score}`} />
          <KPIBoard title="Maior Risco" tooltip="Operação com menor score composto e maior concentração de risco" value={activeData.maiorRisco.nome} valueColor="text-red-600" subtitle={`Score ${activeData.maiorRisco.score} · ${activeData.maiorRisco.indicador}`} />
        </div>

        {/* Row 2: 2 Evolution charts with ChartModeToggle */}
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
              {renderEvoChart(absEvolucaoValor, "ausencias", "value", "hsl(var(--destructive))", absChartMode, absDataMode, absMediaRef, "Absenteísmo")}
            </ResponsiveContainer>
          </div>

          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold">Evolução do Turnover</h4>
                  <InfoTip text="Taxa de rotatividade mensal: demissões (vermelha) e admissões (verde) sobre o efetivo médio." />
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">Demissões e Admissões mensais · clique para filtrar</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setChartDataModal("turnEvolucao")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={turnEvolucaoValor} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={xTick} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} domain={["auto", "auto"]} />
                <RechartsTooltip content={({ active, payload, label: lbl }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as TurnoverEvoRow;
                  const saldo = d.hires - d.terminations;
                  return (
                    <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                      <p className="font-semibold text-foreground">{lbl}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ef4444" }} />
                        <span className="text-muted-foreground">Demissões:</span>
                        <span className="font-medium text-foreground">{d.turnover_exit}% ({d.terminations} pessoas)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                        <span className="text-muted-foreground">Admissões:</span>
                        <span className="font-medium text-foreground">{d.turnover_entry}% ({d.hires} pessoas)</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5 border-t border-border/50">
                        <span className="text-muted-foreground">Saldo:</span>
                        <span className={`font-semibold ${saldo > 0 ? "text-green-600" : saldo < 0 ? "text-red-600" : "text-muted-foreground"}`}>{saldo > 0 ? "+" : ""}{saldo} pessoas</span>
                      </div>
                    </div>
                  );
                }} />
                {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                <ReferenceLine y={turnMediaExitRef} stroke="#ef444466" strokeWidth={1} strokeDasharray="8 4" />
                <ReferenceLine y={turnMediaEntryRef} stroke="#22c55e66" strokeWidth={1} strokeDasharray="8 4" />
                <Line type="monotone" dataKey="turnover_exit" stroke="#ef4444" strokeWidth={2} dot={(props: any) => {
                  const { cx, cy, payload: p } = props;
                  const isSelected = selectedMes === p.mes;
                  return (
                    <g key={`exit-${p.mes}`} className="cursor-pointer">
                      {isSelected && <circle cx={cx} cy={cy} r={10} fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />}
                      <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? "#ef4444" : !selectedMes ? "#ef4444" : "#ef444455"} stroke="#fff" strokeWidth={2} />
                    </g>
                  );
                }} activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2, fill: "#fff" }} name="Demissões" />
                <Line type="monotone" dataKey="turnover_entry" stroke="#22c55e" strokeWidth={2} dot={(props: any) => {
                  const { cx, cy, payload: p } = props;
                  const isSelected = selectedMes === p.mes;
                  return (
                    <g key={`entry-${p.mes}`} className="cursor-pointer">
                      {isSelected && <circle cx={cx} cy={cy} r={10} fill="#22c55e" fillOpacity={0.15} stroke="#22c55e" strokeWidth={1} strokeDasharray="3 2" />}
                      <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? "#22c55e" : !selectedMes ? "#22c55e" : "#22c55e55"} stroke="#fff" strokeWidth={2} />
                    </g>
                  );
                }} activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2, fill: "#fff" }} name="Admissões" />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} payload={[
                  { value: "Demissões", type: "circle" as const, color: "#ef4444" },
                  { value: "Admissões", type: "circle" as const, color: "#22c55e" },
                ]} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: 2 Scatter charts */}
        <div className="grid grid-cols-2 gap-3">
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

          <div className={`bg-card border rounded-xl p-4 ${selectedRegional ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold">Absenteísmo vs Hora Extra</h4>
                <InfoTip text="Operações no quadrante superior direito podem estar em ciclo vicioso: colaboradores faltam, quem fica faz hora extra, se cansa e falta mais." />
              </div>
              <button onClick={() => setChartDataModal("absVsHE")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Por operação · tamanho = headcount</p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="absenteismo" name="Absenteísmo" domain={[absHEDomain.xMin, absHEDomain.xMax]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} label={{ value: "Absenteísmo (%)", position: "insideBottom", offset: -5, fontSize: 10 }} />
                <YAxis type="number" dataKey="he" name="HE/100 colab" domain={[absHEDomain.yMin, absHEDomain.yMax]} tick={{ fontSize: 10 }} label={{ value: "HE por 100 colab. (horas)", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <ZAxis type="number" dataKey="headcount" range={[200, 800]} />
                <ReferenceLine y={avgHE} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <ReferenceLine x={avgAbs} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <RechartsTooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border rounded-lg p-2 shadow-md text-xs">
                      <p className="font-semibold">{d.regional}</p>
                      <p>Absenteísmo: {d.absenteismo}%</p>
                      <p>HE/100 colab: {d.he}h</p>
                      <p>Headcount: {d.headcount}</p>
                    </div>
                  );
                }} />
                <Scatter data={chartScatter} shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  const r = Math.max(8, Math.sqrt(payload.headcount) * 0.8);
                  const fill = getAbsHEColor(payload.absenteismo, payload.he);
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
      <ChartDataModal open={chartDataModal === "turnEvolucao"} onClose={() => setChartDataModal(null)} title={`Evolução do Turnover — ${groupLabel}`} data={turnModalData} columns={[{ key: "operacao", label: groupLabel }, { key: "mes", label: "Competência" }, { key: "turnover_exit", label: "Demissões (%)" }, { key: "turnover_entry", label: "Admissões (%)" }, { key: "terminations", label: "Desligamentos" }, { key: "hires", label: "Admissões" }, { key: "avg_headcount", label: "HC Médio" }, { key: "saldo", label: "Saldo" }]} sqlQuery={sqlTurnEvolucao} />
      <ChartDataModal open={chartDataModal === "absVsTurnover"} onClose={() => setChartDataModal(null)} title={`Absenteísmo vs Turnover — ${groupLabel}`} data={absVsTurnoverModalData} columns={[{ key: "operacao", label: groupLabel }, { key: "mes", label: "Competência" }, { key: "absenteismo", label: "Absenteísmo (%)" }, { key: "turnover", label: "Turnover (%)" }, { key: "headcount", label: "Headcount" }, { key: "desligamentos", label: "Desligamentos" }]} sqlQuery={sqlAbsVsTurnover} />
      <ChartDataModal open={chartDataModal === "absVsHE"} onClose={() => setChartDataModal(null)} title={`Absenteísmo vs Hora Extra — ${groupLabel}`} data={chartScatter} columns={[{ key: "regional", label: groupLabel }, { key: "absenteismo", label: "Absenteísmo (%)" }, { key: "he", label: "HE/100 colab (h)" }, { key: "headcount", label: "Headcount" }]} sqlQuery={sqlAbsVsHE} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Sub-aba 3: Movimentações
// ══════════════════════════════════════════════════════════════
function MovimentacoesContent({ selectedRegional, onRegionalClick, onItemDetail, groupBy, onGroupByChange }: ContentProps) {
  const activeData = useMemo(() => {
    if (!selectedRegional) return { total: "23.0K", diff: "-18.3%", escala: "14.8K", posto: "8.2K" };
    const r = movimentacoesRegionais.find(x => x.nome === selectedRegional);
    if (!r) return { total: "23.0K", diff: "-18.3%", escala: "14.8K", posto: "8.2K" };
    return { total: `${(r.total / 1000).toFixed(1)}K`, diff: `${((r.total - 23000) / 23000 * 100).toFixed(1)}%`, escala: `${(r.escala / 1000).toFixed(1)}K`, posto: `${(r.posto / 1000).toFixed(1)}K` };
  }, [selectedRegional]);

  const totalNum = parseFloat(activeData.total) * 1000;
  const scoreColor = totalNum <= 15000 ? "text-green-600" : totalNum <= 25000 ? "text-orange-500" : "text-red-600";
  const scoreFaixa = totalNum <= 15000 ? "Bom" : totalNum <= 25000 ? "Atenção" : "Crítico";
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
            <ScoreGauge score={Math.max(0, 100 - (totalNum / 30000) * 100)} />
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
