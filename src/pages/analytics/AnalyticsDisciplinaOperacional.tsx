import { useState, useMemo, useEffect } from "react";
import { Info, TrendingUp, TrendingDown, Minus, Eraser, AlertTriangle, ArrowUpRight, ArrowDownRight, X, ExternalLink, Search, ArrowUpDown } from "lucide-react";
import IndicatorTable, { type TableColumn, getScoreColor, getScoreBg, getLineColor, TrendIcon } from "@/components/analytics/IndicatorTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

// ── Shared helpers (same as Coberturas) ──
function ScoreGauge({ score, max = 100, label, faixa }: { score: number; max?: number; label?: string; faixa?: string }) {
  const radius = 36;
  const stroke = 7;
  const cx = 50;
  const cy = 44;
  const circumference = Math.PI * radius;
  const pct = Math.min(score / max, 1);
  const progress = pct * circumference;
  const color = max === 100
    ? (score >= 85 ? "hsl(var(--success))" : score >= 70 ? "#FF5722" : "hsl(var(--destructive))")
    : "#FF5722";
  return (
    <svg width="100" height="58" viewBox="0 0 100 58">
      <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round" />
      <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${progress} ${circumference}`} />
      {label && <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>{label}</text>}
      {faixa && <text x={cx} y={cy + 8} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>{faixa}</text>}
    </svg>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <UITooltip>
      <TooltipTrigger asChild><Info size={14} className="text-muted-foreground cursor-help" /></TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-xs">{text}</TooltipContent>
    </UITooltip>
  );
}


function abreviar(nome: string): string {
  const words = nome.replace(/[-–]/g, " ").split(/\s+/).filter(w => w.length > 1);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return nome.slice(0, 2).toUpperCase();
}

// ══════════════════════════════════════════════════════════════
// Mock data
// ══════════════════════════════════════════════════════════════

// ── Grouping types ──
type GroupBy = "unidade" | "empresa" | "area";
const groupByOptions: { id: GroupBy; label: string; short: string }[] = [
  { id: "empresa", label: "Empresa", short: "Empresa" },
  { id: "unidade", label: "Un. Negócio", short: "Un. Negócio" },
  { id: "area", label: "Área", short: "Área" },
];

// ── Empresa mock data ──
const empresaData = [
  { nome: "G5 SOCIEDADE DE CREDITO DIRETO S.A", qualidade: 91.2, score: 91 },
  { nome: "AGREGA SERVIÇOS", qualidade: 89.5, score: 90 },
  { nome: "4B2G SISTEMAS", qualidade: 88.8, score: 89 },
  { nome: "BRK", qualidade: 87.6, score: 88 },
  { nome: "CONDOMINIO MORADA DO BOSQUE", qualidade: 86.9, score: 87 },
  { nome: "RHO - TESTE", qualidade: 86.2, score: 86 },
  { nome: "Edifício Vogue", qualidade: 85.5, score: 86 },
  { nome: "ORSEGUPS COMERCIO", qualidade: 84.8, score: 85 },
  { nome: "Victória da Paz", qualidade: 84.1, score: 84 },
  { nome: "Rio Oregon", qualidade: 83.4, score: 83 },
  { nome: "VERZANI & SANDRINI", qualidade: 72.3, score: 72 },
  { nome: "JCC SEGURANÇA", qualidade: 68.5, score: 69 },
  { nome: "SERVIS SEGURANÇA", qualidade: 61.2, score: 61 },
  { nome: "GLOBAL SEGURANÇA", qualidade: 55.8, score: 56 },
  { nome: "NEXTI DEMONSTRAÇÃO", qualidade: 48.3, score: 48 },
].map(e => ({ ...e, tendencia: e.qualidade >= 88 ? "melhorando" : e.qualidade >= 85 ? "estavel" : "piorando" }));

// ── Área mock data ──
const areaData = [
  { nome: "ROTA - POA - DM52", qualidade: 91.5, score: 92 },
  { nome: "MRH VEICULOS LTDA", qualidade: 90.8, score: 91 },
  { nome: "A 365 - Renoá", qualidade: 90.1, score: 90 },
  { nome: "ROTA - SOO - SEDE", qualidade: 89.4, score: 89 },
  { nome: "Area Cliente Frimesa", qualidade: 88.7, score: 89 },
  { nome: "ROTA - RSL - NM51", qualidade: 88.0, score: 88 },
  { nome: "CCC - Sanepar", qualidade: 87.3, score: 87 },
  { nome: "PROGRAMADA", qualidade: 86.6, score: 87 },
  { nome: "GERENCIAL", qualidade: 86.0, score: 86 },
  { nome: "G5 BANK", qualidade: 85.3, score: 85 },
  { nome: "TESTE-TI", qualidade: 84.6, score: 85 },
  { nome: "Gestão de Mão de Obra - RHO", qualidade: 84.0, score: 84 },
  { nome: "ROTA - BNU - COORDENAÇÃO", qualidade: 83.3, score: 83 },
  { nome: "ROTA - CTA - COORDENAÇÃO", qualidade: 82.6, score: 83 },
  { nome: "ROTA - IAI - COORDENAÇÃO", qualidade: 82.0, score: 82 },
  { nome: "ROTA - SOO - Coor. Asseio Continente", qualidade: 81.3, score: 81 },
  { nome: "ROTA - SOO - Coor. Segurança Continente/ Ilha", qualidade: 80.6, score: 81 },
  { nome: "ROTA - SOO - Coor. Asseio Ilha", qualidade: 80.0, score: 80 },
  { nome: "ROTA - LGS - NM31", qualidade: 79.3, score: 79 },
  { nome: "ROTA - JGS - NM48", qualidade: 78.6, score: 79 },
  { nome: "ROTA - IAI - NM27", qualidade: 78.0, score: 78 },
  { nome: "ROTA - BQE - NM06", qualidade: 77.3, score: 77 },
  { nome: "CONTROLADORIA - KELLY", qualidade: 76.6, score: 77 },
  { nome: "ADM FINANCEIRO - TIME TAISE SOARES", qualidade: 76.0, score: 76 },
  { nome: "ALARME 365", qualidade: 75.3, score: 75 },
  // Novas áreas do anexo
  { nome: "ROTA - BQE - DM05", qualidade: 74.5, score: 75 },
  { nome: "ROTA - CTA - DM14", qualidade: 73.8, score: 74 },
  { nome: "ROTA - SOO - DF33", qualidade: 72.1, score: 72 },
  { nome: "ROTA - SOO - DF34", qualidade: 71.4, score: 71 },
  { nome: "ROTA - CAS - DM50", qualidade: 70.7, score: 71 },
  { nome: "ROTA - SOO - DF35", qualidade: 69.0, score: 69 },
  { nome: "ROTA - SOO - DF36", qualidade: 68.3, score: 68 },
  { nome: "ROTA - SOO - DF37", qualidade: 66.5, score: 67 },
  { nome: "ROTA - SOO - DF38", qualidade: 65.8, score: 66 },
  { nome: "ROTA - SOO - DF39", qualidade: 64.1, score: 64 },
  { nome: "ROTA - SOO - DF40", qualidade: 62.4, score: 62 },
  { nome: "ROTA - SOO - DS41", qualidade: 60.7, score: 61 },
  { nome: "ROTA - SOO - DS42", qualidade: 58.0, score: 58 },
  { nome: "RAFAEL NEVES - GERENTE RELACIONAMENTO - CTA", qualidade: 55.3, score: 55 },
  { nome: "JUSARA - GERENTE RE RELACIONAMENTO - CCO", qualidade: 52.6, score: 53 },
  { nome: "CLECI - GERENTE DE REALACIONAMENTO - CSC", qualidade: 49.9, score: 50 },
  { nome: "ARY CESARIO - GERENTE DE RELACIONAMENTO - SOO", qualidade: 47.2, score: 47 },
  { nome: "ANDRE SILVA - GERENTE DE RELACIONAMENTO - IAI", qualidade: 44.5, score: 45 },
  { nome: "MARIA INES - GERENTE DE RELACIONAMENTO - SOO - ILHA", qualidade: 41.8, score: 42 },
  { nome: "ILMAR DERETTI - GERENTE DE RELACIONAMENTO - BNU", qualidade: 56.1, score: 56 },
  { nome: "LEI Nº 14.151 – Home Office Gestantes", qualidade: 63.4, score: 63 },
  { nome: "Superintendência de Relacionamento", qualidade: 59.7, score: 60 },
  { nome: "SUPERINTENDÊNCIA COMERCIAL", qualidade: 51.0, score: 51 },
  { nome: "ROTA - SOO - DS43", qualidade: 46.3, score: 46 },
].map(e => ({ ...e, tendencia: e.qualidade >= 88 ? "melhorando" : e.qualidade >= 85 ? "estavel" : "piorando" }));

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

// ── Qualidade do Ponto ──
const qualidadeEvolucao = [
  { mes: "abr/25", value: 83.2 }, { mes: "mai/25", value: 84.1 }, { mes: "jun/25", value: 84.5 },
  { mes: "jul/25", value: 85.0 }, { mes: "ago/25", value: 85.3 }, { mes: "set/25", value: 85.8 },
  { mes: "out/25", value: 86.2 }, { mes: "nov/25", value: 86.5 }, { mes: "dez/25", value: 86.1 },
  { mes: "jan/26", value: 87.0 }, { mes: "fev/26", value: 87.8 }, { mes: "mar/26", value: 87.3 },
];
const qualidadeMedia = 85.7;

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

const evolucaoTratativa = [
  { mes: "abr/25", dias: 8.5 }, { mes: "mai/25", dias: 7.8 }, { mes: "jun/25", dias: 8.2 },
  { mes: "jul/25", dias: 7.1 }, { mes: "ago/25", dias: 6.5 }, { mes: "set/25", dias: 6.2 },
  { mes: "out/25", dias: 5.8 }, { mes: "nov/25", dias: 5.5 }, { mes: "dez/25", dias: 7.2 },
  { mes: "jan/26", dias: 5.1 }, { mes: "fev/26", dias: 4.8 }, { mes: "mar/26", dias: 4.5 },
];
const tratativaMedia = evolucaoTratativa.reduce((s, d) => s + d.dias, 0) / evolucaoTratativa.length;

// ── Absenteísmo ──
const absenteismoEvolucao = [
  { mes: "abr/25", value: 5.4 }, { mes: "mai/25", value: 5.1 }, { mes: "jun/25", value: 5.6 },
  { mes: "jul/25", value: 5.3 }, { mes: "ago/25", value: 5.0 }, { mes: "set/25", value: 4.8 },
  { mes: "out/25", value: 4.9 }, { mes: "nov/25", value: 4.7 }, { mes: "dez/25", value: 5.2 },
  { mes: "jan/26", value: 4.5 }, { mes: "fev/26", value: 4.3 }, { mes: "mar/26", value: 4.8 },
];
const absenteismoMedia = 4.97;
const absenteismoBarras = [
  { mes: "abr/25", atestados: 2100, faltas: 1200 }, { mes: "mai/25", atestados: 2000, faltas: 1100 },
  { mes: "jun/25", atestados: 2300, faltas: 1300 }, { mes: "jul/25", atestados: 2150, faltas: 1150 },
  { mes: "ago/25", atestados: 2050, faltas: 1050 }, { mes: "set/25", atestados: 1950, faltas: 1000 },
  { mes: "out/25", atestados: 2100, faltas: 1100 }, { mes: "nov/25", atestados: 2200, faltas: 1050 },
  { mes: "dez/25", atestados: 2400, faltas: 1250 }, { mes: "jan/26", atestados: 2050, faltas: 980 },
  { mes: "fev/26", atestados: 1900, faltas: 920 }, { mes: "mar/26", atestados: 2000, faltas: 1000 },
];
const absenteismoMediaBarras = absenteismoBarras.reduce((s, d) => s + d.atestados + d.faltas, 0) / absenteismoBarras.length;

// Derive 30 absenteísmo regionais from scatter data (seeded from qualidade)
const absenteismoRegionais = scatterQualidade.map(sq => {
  // Inverse correlation: higher quality → lower absenteeism
  const taxa = +(2 + (92 - sq.qualidade) * 0.55).toFixed(1);
  const turnover = +(4 + (92 - sq.qualidade) * 0.8).toFixed(1);
  const tendencia = sq.qualidade >= 88 ? "melhorando" : sq.qualidade >= 85 ? "estavel" : "piorando";
  return { nome: sq.regional, taxa, turnover, tendencia };
});

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
    const volume = `${Math.round(5 + frac * 40)}K`;
    const headcount = Math.round(20 + frac * 200);
    const tratativa = +(2 + frac * 8).toFixed(1);
    const tendencia = qualidade >= 88 ? "melhorando" : qualidade >= 80 ? "estavel" : "piorando";
    return { nome: `${p} - ${regional.slice(0, 3).toUpperCase()}${i + 1}`, qualidade, volume, headcount, tratativa, tendencia };
  });
}

function generateColaboradores(regional: string) {
  const nomes = ["Ana Silva", "Carlos Santos", "Maria Oliveira", "João Pereira", "Fernanda Costa", "Ricardo Souza", "Juliana Lima", "Pedro Almeida", "Camila Rocha", "Lucas Ferreira", "Patrícia Martins", "Bruno Araújo", "Tatiana Mendes", "Rafael Gonçalves", "Luciana Ribeiro", "Marcelo Dias", "Vanessa Cardoso", "Eduardo Nunes", "Débora Farias", "Gustavo Pinto"];
  return nomes.map((n, i) => {
    const seed = regional.length * 11 + i * 17;
    const r = Math.sin(seed) * 10000; const frac = r - Math.floor(r);
    const qualidade = +(70 + frac * 25).toFixed(1);
    const marcacoes = Math.round(100 + frac * 500);
    const inconsistencias = Math.round(frac * 15);
    const tratativa = +(1 + frac * 10).toFixed(1);
    const tendencia = qualidade >= 88 ? "melhorando" : qualidade >= 80 ? "estavel" : "piorando";
    return { nome: n, qualidade, marcacoes, inconsistencias, tratativa, tendencia };
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
    <div className="px-6 py-4 space-y-3">
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

// ── Shared sidebar with groupBy selector ──
// Now also exposes paged items for charts
type ContentProps = { selectedRegional: string | null; onRegionalClick: (n: string) => void; onItemDetail?: (n: string) => void; groupBy: GroupBy; onGroupByChange: (g: GroupBy) => void };

function GroupBySidebar({ items, selectedRegional, onRegionalClick, onItemDetail, groupBy, onGroupByChange, onPagedItemsChange }: {
  items: { nome: string; score: number }[];
  selectedRegional: string | null;
  onRegionalClick: (n: string) => void;
  onItemDetail?: (n: string) => void;
  groupBy: GroupBy;
  onGroupByChange: (g: GroupBy) => void;
  onPagedItemsChange?: (names: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "nome">("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;

  // Debounce search with 500ms delay
  const searchTimerRef = useState<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimerRef[0]) clearTimeout(searchTimerRef[0]);
    searchTimerRef[0] = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500);
  };

  const handleGroupChange = (g: GroupBy) => {
    onGroupByChange(g);
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const toggleSort = (col: "score" | "nome") => {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...items];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(i => i.nome.toLowerCase().includes(q));
    }
    const dir = sortDir === "desc" ? -1 : 1;
    if (sortBy === "nome") {
      result.sort((a, b) => dir * a.nome.localeCompare(b.nome));
    } else {
      result.sort((a, b) => dir * (a.score - b.score));
    }
    return result;
  }, [items, debouncedSearch, sortBy, sortDir]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);
  const showPagination = filteredAndSorted.length > PAGE_SIZE;
  const pagedItems = useMemo(() => filteredAndSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filteredAndSorted, page]);

  useEffect(() => {
    onPagedItemsChange?.(pagedItems.map(i => i.nome));
  }, [pagedItems, onPagedItemsChange]);

  return (
    <div className="w-[220px] shrink-0">
      <div className="bg-card border border-border/50 rounded-xl p-3 sticky top-4 max-h-[calc(100vh-120px)] flex flex-col">
        {/* Group by selector */}
        <div className="flex gap-1 mb-1">
          {groupByOptions.map(o => (
            <button
              key={o.id}
              onClick={() => handleGroupChange(o.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${groupBy === o.id ? "bg-[#FF5722] text-white border-[#FF5722]" : "text-muted-foreground border-border hover:border-[#FF5722]/40"}`}
            >
              {o.short}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative mb-1">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full pl-6 pr-2 py-1 text-[11px] rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#FF5722]/40"
          />
        </div>
        {/* Pagination - only if > 30 items */}
        {showPagination && (
          <div className="flex gap-1 mb-1 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-5 h-5 rounded text-[10px] font-medium transition-colors ${page === p ? "bg-[#FF5722] text-white" : "text-muted-foreground border border-border hover:border-[#FF5722]/40"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
        {/* Column headers with sort - aligned with list items */}
        <div className="flex items-center gap-2 px-0.5 mb-1">
          <button onClick={() => toggleSort("nome")} className="flex-1 flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground text-left">
            Nome <ArrowUpDown size={9} className={sortBy === "nome" ? "text-[#FF5722]" : ""} />
          </button>
          <button onClick={() => toggleSort("score")} className="shrink-0 flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground">
            Score <ArrowUpDown size={9} className={sortBy === "score" ? "text-[#FF5722]" : ""} />
          </button>
        </div>
        <div className="space-y-0.5 overflow-y-auto flex-1">
          {pagedItems.length === 0 && <p className="text-[10px] text-muted-foreground text-center py-2">Nenhum resultado</p>}
          {pagedItems.map((op) => {
            const isSelected = selectedRegional === op.nome;
            const isDimmed = selectedRegional && !isSelected;
            const scoreColor = op.score >= 85 ? "text-green-600" : op.score >= 75 ? "text-orange-500" : "text-red-600";
            return (
              <div
                key={op.nome}
                onClick={() => onItemDetail?.(op.nome)}
                onContextMenu={(e) => { e.preventDefault(); onRegionalClick(op.nome); }}
                className={`flex items-center gap-2 px-0.5 py-1 rounded-md cursor-pointer transition-all text-xs ${isSelected ? "bg-orange-50 border border-[#FF5722]/30" : "hover:bg-muted/40 border border-transparent"} ${isDimmed ? "opacity-35" : ""}`}
                title="Clique para detalhes · Botão direito para filtrar"
              >
                <span className="flex-1 font-medium truncate text-foreground">{op.nome}</span>
                <span className={`font-bold tabular-nums shrink-0 ${scoreColor}`}>{op.score}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Sub-aba 1: Qualidade do Ponto
// ══════════════════════════════════════════════════════════════
function QualidadeContent({ selectedRegional, onRegionalClick, onItemDetail, groupBy, onGroupByChange }: ContentProps) {
  const [visibleNames, setVisibleNames] = useState<string[]>([]);

  const activeData = useMemo(() => {
    if (!selectedRegional) return {
      score: 87, diff: "+4 pp", registradas: "892.0K", justificadas: "130.2K",
      melhorOperacao: { nome: "Regional SP", score: 89 },
      maiorRisco: { nome: "Regional BA", score: 82, indicador: "Baixa qualidade" },
    };
    const r = qualidadeRegionais.find(x => x.nome === selectedRegional);
    if (!r) return {
      score: 87, diff: "+4 pp", registradas: "892.0K", justificadas: "130.2K",
      melhorOperacao: { nome: "Regional SP", score: 89 },
      maiorRisco: { nome: "Regional BA", score: 82, indicador: "Baixa qualidade" },
    };
    return {
      score: Math.round(r.qualidade), diff: `${Math.round(r.qualidade - 87)} pp`,
      registradas: `${(r.registradas * 12.4).toFixed(0)}K`, justificadas: `${(r.justificadas * 3.26).toFixed(0)}K`,
      melhorOperacao: { nome: selectedRegional, score: Math.round(r.qualidade) },
      maiorRisco: { nome: selectedRegional, score: Math.round(r.qualidade), indicador: `${r.atrasos}% atrasos` },
    };
  }, [selectedRegional]);

  const [selectedMes, setSelectedMes] = useState<string | null>(null);
  
  const scoreColor = activeData.score >= 85 ? "text-green-600" : activeData.score >= 75 ? "text-orange-500" : "text-red-600";
  const scoreFaixa = activeData.score >= 85 ? "Bom" : activeData.score >= 75 ? "Atenção" : "Crítico";

  const sidebarItems = useMemo(() => {
    if (groupBy === "empresa") return [...empresaData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(e.qualidade) }));
    if (groupBy === "area") return [...areaData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(e.qualidade) }));
    return [...qualidadeRegionais].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(e.qualidade) }));
  }, [groupBy]);

  // Scatter data filtered to visible page items
  const allScatter = useMemo(() => {
    if (groupBy === "empresa") return empresaScatter;
    if (groupBy === "area") return areaScatter;
    return scatterQualidade;
  }, [groupBy]);

  const allScatterTratativa = useMemo(() => {
    if (groupBy === "empresa") return empresaScatter;
    if (groupBy === "area") return areaScatter;
    return scatterTratativa;
  }, [groupBy]);

  const visibleSet = useMemo(() => new Set(visibleNames), [visibleNames]);
  const chartScatterQual = useMemo(() => allScatter.filter(s => visibleSet.size === 0 || visibleSet.has(s.regional)), [allScatter, visibleSet]);
  const chartScatterTrat = useMemo(() => allScatterTratativa.filter(s => visibleSet.size === 0 || visibleSet.has(s.regional)), [allScatterTratativa, visibleSet]);

  // Dynamic averages computed from visible scatter data
  const avgQualVolume = useMemo(() => chartScatterQual.length ? Math.round(chartScatterQual.reduce((s, d) => s + d.volume, 0) / chartScatterQual.length) : 170000, [chartScatterQual]);
  const avgQualQualidade = useMemo(() => chartScatterQual.length ? +(chartScatterQual.reduce((s, d) => s + d.qualidade, 0) / chartScatterQual.length).toFixed(1) : 85, [chartScatterQual]);
  const avgTratVolume = useMemo(() => chartScatterTrat.length ? Math.round(chartScatterTrat.reduce((s, d) => s + d.volume, 0) / chartScatterTrat.length) : 170000, [chartScatterTrat]);
  const avgTratDias = useMemo(() => chartScatterTrat.length ? +(chartScatterTrat.reduce((s, d) => s + d.dias, 0) / chartScatterTrat.length).toFixed(1) : 4.5, [chartScatterTrat]);

  // Dynamic axes: let Recharts decide tick count, just provide nice min/max
  const buildAxis = (values: number[], options?: { clampZero?: boolean }) => {
    const clampZero = options?.clampZero ?? false;
    if (!values.length) return { min: 0, max: 100 };
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const min = clampZero ? Math.max(0, Math.floor(rawMin)) : Math.floor(rawMin);
    const max = Math.ceil(rawMax);
    return { min, max };
  };

  const qualDomain = useMemo(() => {
    if (!chartScatterQual.length) return { xMin: 0, xMax: 300000, yMin: 70, yMax: 100 };
    const x = buildAxis(chartScatterQual.map(d => d.volume), { clampZero: true });
    const y = buildAxis(chartScatterQual.map(d => d.qualidade));
    return { xMin: x.min, xMax: x.max, yMin: y.min, yMax: y.max };
  }, [chartScatterQual]);

  const tratDomain = useMemo(() => {
    if (!chartScatterTrat.length) return { xMin: 0, xMax: 300000, yMin: 1, yMax: 7 };
    const x = buildAxis(chartScatterTrat.map(d => d.volume), { clampZero: true });
    const y = buildAxis(chartScatterTrat.map(d => d.dias));
    return { xMin: x.min, xMax: x.max, yMin: y.min, yMax: y.max };
  }, [chartScatterTrat]);

  return (
    <div className="flex gap-3">
      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Linha 1: Score + 4 KPI Cards */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 mb-1">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Qualidade do Ponto</p>
              <InfoTip text="Percentual de marcações registradas corretamente vs total de marcações que exigiram intervenção (justificativas manuais)." />
            </div>
            <ScoreGauge score={activeData.score} label={`${activeData.score}`} faixa={scoreFaixa} />
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Melhor Operação</p>
              <InfoTip text="Operação com maior score de qualidade no período" />
            </div>
            <p className="text-xl font-bold mt-0.5 truncate text-green-600">{activeData.melhorOperacao.nome}</p>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">Score {activeData.melhorOperacao.score} · Alta</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Maior Risco</p>
              <InfoTip text="Operação com menor qualidade e maior concentração de risco" />
            </div>
            <p className="text-xl font-bold mt-0.5 text-red-600 truncate">{activeData.maiorRisco.nome}</p>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">Score {activeData.maiorRisco.score} · {activeData.maiorRisco.indicador}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Registradas</p>
              <InfoTip text="Total de marcações registradas pelo colaborador sem necessidade de ajuste." />
            </div>
            <p className="text-xl font-bold text-green-600 mt-0.5">{activeData.registradas}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Justificadas</p>
              <InfoTip text="Total de marcações que foram justificadas manualmente pelo operador ou gestor." />
            </div>
            <p className="text-xl font-bold text-orange-500 mt-0.5">{activeData.justificadas}</p>
          </div>
        </div>

        {/* Row 1: Evolução Qualidade + Tempo Médio Tratativa */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <h4 className="text-sm font-semibold mb-0.5">Evolução da Qualidade</h4>
            <p className="text-[10px] text-muted-foreground mb-2">Por competência · clique para filtrar</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={qualidadeEvolucao} onClick={(e: any) => {
                if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
              }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={(props: any) => {
                  const { x, y, payload } = props;
                  const isActive = selectedMes === payload.value;
                  return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                }} />
                <YAxis domain={[75, 95]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <RechartsTooltip formatter={(v: number) => [`${v}%`, "Qualidade"]} />
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
            </ResponsiveContainer>
          </div>

          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="text-sm font-semibold">Evolução do Tempo de Tratativa</h4>
              <InfoTip text="Média de dias entre o registro da marcação e o ajuste." />
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Média mensal em dias · clique para filtrar</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={evolucaoTratativa} onClick={(e: any) => {
                if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
              }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={(props: any) => {
                  const { x, y, payload } = props;
                  const isActive = selectedMes === payload.value;
                  return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                }} />
                <YAxis domain={[0, 12]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}d`} />
                <RechartsTooltip formatter={(v: number) => [`${v} dias`, "Tempo Médio"]} />
                <ReferenceLine y={tratativaMedia} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <Line type="monotone" dataKey="dias" stroke={selectedMes ? "#FF572244" : "#FF5722"} strokeWidth={2} dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isSelected = selectedMes === payload.mes;
                  const isActive = !selectedMes || isSelected;
                  return (
                    <g key={payload.mes} className="cursor-pointer">
                      {isSelected && <circle cx={cx} cy={cy} r={10} fill="#FF5722" fillOpacity={0.15} stroke="#FF5722" strokeWidth={1} strokeDasharray="3 2" />}
                      <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? "#FF5722" : isActive ? "#FF5722" : "#FF572255"} stroke="#fff" strokeWidth={2} />
                    </g>
                  );
                }} activeDot={{ r: 6, stroke: "#FF5722", strokeWidth: 2, fill: "#fff" }} name="Dias" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Scatter charts */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-card border rounded-xl p-4 ${selectedRegional ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="text-sm font-semibold">Qualidade vs Volume</h4>
              <InfoTip text="Operações no quadrante inferior direito (alto volume, baixa qualidade) devem ser priorizadas." />
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Por operação · tamanho = headcount</p>
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
                  const r = Math.sqrt(payload.headcount) / 4;
                  const fill = payload.qualidade >= 85 ? "#22c55e" : payload.qualidade >= 75 ? "#f97316" : "#ef4444";
                  const isSelected = !selectedRegional || selectedRegional === payload.regional;
                  return (
                    <g onClick={() => onRegionalClick(payload.regional)} className="cursor-pointer">
                      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={isSelected ? 0.7 : 0.15} stroke={fill} strokeWidth={isSelected ? 1.5 : 0.5} />
                      <text x={cx} y={cy - r - 3} textAnchor="middle" fontSize={7} fontWeight={600} fill={isSelected ? "#374151" : "#9ca3af"}>{abreviar(payload.regional)}</text>
                    </g>
                  );
                }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className={`bg-card border rounded-xl p-4 ${selectedRegional ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="text-sm font-semibold">Tempo de Tratativa vs Volume</h4>
              <InfoTip text="Operações com alto volume e alto tempo de tratativa precisam de atenção prioritária." />
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Por operação · tamanho = headcount</p>
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
                  const r = Math.sqrt(payload.headcount) / 4;
                  const fill = payload.dias <= 5 ? "#22c55e" : payload.dias <= 7 ? "#f97316" : "#ef4444";
                  const isSelected = !selectedRegional || selectedRegional === payload.regional;
                  return (
                    <g onClick={() => onRegionalClick(payload.regional)} className="cursor-pointer">
                      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={isSelected ? 0.7 : 0.15} stroke={fill} strokeWidth={isSelected ? 1.5 : 0.5} />
                      <text x={cx} y={cy - r - 3} textAnchor="middle" fontSize={7} fontWeight={600} fill={isSelected ? "#374151" : "#9ca3af"}>{abreviar(payload.regional)}</text>
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
  const activeData = useMemo(() => {
    if (!selectedRegional) return { taxa: 4.8, diff: "-0.6 pp", faltasNJ: "38%", turnover: "8.2%" };
    const r = absenteismoRegionais.find(x => x.nome === selectedRegional);
    if (!r) return { taxa: 4.8, diff: "-0.6 pp", faltasNJ: "38%", turnover: "8.2%" };
    return { taxa: r.taxa, diff: `${(r.taxa - 4.8).toFixed(1)} pp`, faltasNJ: `${Math.round(30 + r.taxa * 3)}%`, turnover: `${r.turnover}%` };
  }, [selectedRegional]);

  const scoreColor = activeData.taxa <= 4 ? "text-green-600" : activeData.taxa <= 6 ? "text-orange-500" : "text-red-600";
  const scoreFaixa = activeData.taxa <= 4 ? "Bom" : activeData.taxa <= 6 ? "Atenção" : "Crítico";
  const maxTaxa = Math.max(...absenteismoRegionais.map(r => r.taxa));

  // Sort by lowest taxa = best for absenteísmo
  const getAbsScore = (taxa: number) => Math.round(Math.max(0, 100 - taxa * 10));
  const sidebarItems = useMemo(() => {
    if (groupBy === "empresa") return [...empresaData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(100 - (100 - e.qualidade) * 1.2) }));
    if (groupBy === "area") return [...areaData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(100 - (100 - e.qualidade) * 1.2) }));
    return [...absenteismoRegionais].sort((a, b) => a.taxa - b.taxa).map(e => ({ nome: e.nome, score: getAbsScore(e.taxa) }));
  }, [groupBy]);

  return (
    <div className="flex gap-3">
      <div className="flex-1 min-w-0 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 mb-1">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Absenteísmo</p>
              <InfoTip text="Taxa de ausências sobre o efetivo total no período. Inclui atestados, faltas justificadas e não justificadas." />
            </div>
            <ScoreGauge score={Math.max(0, 100 - activeData.taxa * 10)} />
            <p className={`text-3xl font-bold leading-none -mt-1 ${scoreColor}`}>{activeData.taxa}%</p>
            <p className={`text-xs font-semibold ${scoreColor} mt-0.5`}>{scoreFaixa}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Faltas Não Justificadas</p>
              <InfoTip text="Percentual das ausências que não tiveram justificativa registrada." />
            </div>
            <p className="text-2xl font-bold text-red-600 mt-0.5">{activeData.faltasNJ}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Turnover</p>
              <InfoTip text="Taxa de rotatividade: desligamentos no período sobre o efetivo médio." />
            </div>
            <p className="text-2xl font-bold text-orange-500 mt-0.5">{activeData.turnover}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-2">Atestados e Faltas por Competência</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={absenteismoBarras}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={absenteismoMediaBarras} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: `Média`, position: "right", fontSize: 10, fill: "#9ca3af" }} />
                <Bar dataKey="atestados" stackId="a" fill="hsl(var(--chart-2))" name="Atestados" radius={[0, 0, 0, 0]} />
                <Bar dataKey="faltas" stackId="a" fill="hsl(var(--destructive))" name="Faltas NJ" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-2">Evolução da Taxa de Absenteísmo</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={absenteismoEvolucao}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis domain={[3, 7]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <RechartsTooltip formatter={(v: number) => [`${v}%`, "Absenteísmo"]} />
                <ReferenceLine y={absenteismoMedia} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: `Média ${absenteismoMedia}%`, position: "right", fontSize: 10, fill: "#9ca3af" }} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Taxa" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <GroupBySidebar items={sidebarItems} selectedRegional={selectedRegional} onRegionalClick={onRegionalClick} onItemDetail={onItemDetail} groupBy={groupBy} onGroupByChange={onGroupByChange} />
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
    return [...movimentacoesRegionais].sort((a, b) => a.total - b.total).map(e => ({ nome: e.nome, score: getMovScore(e.total) }));
  }, [groupBy, maxTotal]);

  return (
    <div className="flex gap-3">
      <div className="flex-1 min-w-0 space-y-3">
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
  return (
    <div className="px-6 py-4">
      <QualidadeContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} onItemDetail={setDetailRegional} groupBy={groupBy} onGroupByChange={setGroupBy} />
      <RegionalDetailModal regional={detailRegional} open={!!detailRegional} onClose={() => setDetailRegional(null)} />
    </div>
  );
}

export function AbsenteismoTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [detailRegional, setDetailRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");
  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  return (
    <div className="px-6 py-4">
      <AbsenteismoContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} onItemDetail={setDetailRegional} groupBy={groupBy} onGroupByChange={setGroupBy} />
      <RegionalDetailModal regional={detailRegional} open={!!detailRegional} onClose={() => setDetailRegional(null)} />
    </div>
  );
}

export function MovimentacoesTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [detailRegional, setDetailRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");
  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  return (
    <div className="px-6 py-4">
      <MovimentacoesContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} onItemDetail={setDetailRegional} groupBy={groupBy} onGroupByChange={setGroupBy} />
      <RegionalDetailModal regional={detailRegional} open={!!detailRegional} onClose={() => setDetailRegional(null)} />
    </div>
  );
}
