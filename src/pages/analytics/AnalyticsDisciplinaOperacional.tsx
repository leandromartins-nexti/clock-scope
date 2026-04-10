import { useState, useMemo, useEffect, useCallback } from "react";
import { Info, TrendingUp, TrendingDown, Minus, Eraser, AlertTriangle, ArrowUpRight, ArrowDownRight, X, ExternalLink, Search, ArrowUpDown, LineChartIcon, BarChart3, AreaChartIcon, Percent, Hash } from "lucide-react";
import IndicatorTable, { type TableColumn, getScoreColor, getScoreBg, getLineColor, TrendIcon } from "@/components/analytics/IndicatorTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine,
  ScatterChart, Scatter, ZAxis,
} from "recharts";
import { aggregateAjustes, ajustesMeses, formatMesLabel, ajustesUnidades, ajustesAreas, ajustesEmpresas, aggregateComposicaoFaixas, aggregateQualidadeEvolucao, aggregateQualidadeEvolucaoDetalhado } from "@/lib/ajustesData";

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

// ── Empresa data from real JSON entities ──
const empresaData = ajustesEmpresas.map((e, i) => {
  const quals = [89.0, 82.1, 77.3];
  const q = quals[i % quals.length];
  return { nome: e.name, qualidade: q, score: Math.round(q), tendencia: q >= 88 ? "melhorando" : q >= 85 ? "estavel" : "piorando" };
});

// ── Área data from real JSON entities ──
const areaData = ajustesAreas.map((a, i) => {
  const quals = [88.5, 82.3, 79.1];
  const q = quals[i % quals.length];
  return { nome: a.name, qualidade: q, score: Math.round(q), tendencia: q >= 88 ? "melhorando" : q >= 85 ? "estavel" : "piorando" };
});

// ── Unidade de Negócio data from real JSON entities ──
const unidadeData = ajustesUnidades.map((u, i) => {
  const quals = [90.2, 84.7, 76.5];
  const q = quals[i % quals.length];
  return { nome: u.name, qualidade: q, score: Math.round(q), tendencia: q >= 88 ? "melhorando" : q >= 85 ? "estavel" : "piorando" };
});

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

// ── Absenteísmo ──
const absenteismoEvolucao = [
  { mes: "abr/25", value: 5.4 }, { mes: "mai/25", value: 5.1 }, { mes: "jun/25", value: 5.6 },
  { mes: "jul/25", value: 5.3 }, { mes: "ago/25", value: 5.0 }, { mes: "set/25", value: 4.8 },
  { mes: "out/25", value: 4.9 }, { mes: "nov/25", value: 4.7 }, { mes: "dez/25", value: 5.2 },
  { mes: "jan/26", value: 4.5 }, { mes: "fev/26", value: 4.3 }, { mes: "mar/26", value: 4.8 },
];
const absenteismoMedia = 4.97;

const turnoverEvolucao = [
  { mes: "abr/25", value: 9.1 }, { mes: "mai/25", value: 8.8 }, { mes: "jun/25", value: 9.4 },
  { mes: "jul/25", value: 8.5 }, { mes: "ago/25", value: 8.2 }, { mes: "set/25", value: 7.9 },
  { mes: "out/25", value: 8.0 }, { mes: "nov/25", value: 7.6 }, { mes: "dez/25", value: 9.0 },
  { mes: "jan/26", value: 7.4 }, { mes: "fev/26", value: 7.8 }, { mes: "mar/26", value: 8.2 },
];
const turnoverMedia = 8.2;

// Generate absenteísmo scatter data from any entity list (seeded, deterministic)
function toAbsScatterData(items: { nome: string; qualidade: number; score: number }[]) {
  function seededRand(s: number) { const x = Math.sin(s * 9301 + 49297) * 49297; return x - Math.floor(x); }
  return items.map((item, i) => {
    const r1 = seededRand(i * 7 + item.qualidade * 13 + 100);
    const r2 = seededRand(i * 11 + item.qualidade * 17 + 200);
    const r3 = seededRand(i * 19 + item.qualidade * 23 + 300);
    const headcount = Math.round(300 + r1 * 2700);
    // Lower quality → higher absenteeism
    const absenteismo = +(2.5 + (95 - item.qualidade) * 0.12 + r2 * 1.5).toFixed(1);
    const turnover = +(4.5 + (95 - item.qualidade) * 0.15 + r3 * 2.5).toFixed(1);
    const he = Math.round(250 + (95 - item.qualidade) * 8 + r1 * 120);
    return { regional: item.nome, absenteismo, turnover, he, headcount };
  });
}

// Unidade scatter (from real unidadeData)
const unidadeAbsScatter = unidadeData.map(u => {
  const taxa = +(2 + (92 - u.qualidade) * 0.55).toFixed(1);
  const turnover = +(4 + (92 - u.qualidade) * 0.8).toFixed(1);
  const he = Math.round(250 + (92 - u.qualidade) * 12);
  return { regional: u.nome, absenteismo: taxa, turnover, he, headcount: 200 };
});
const empresaAbsScatter = toAbsScatterData(empresaData);
const areaAbsScatter = toAbsScatterData(areaData);




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



type ContentProps = { selectedRegional: string | null; onRegionalClick: (n: string) => void; onItemDetail?: (n: string) => void; groupBy: GroupBy; onGroupByChange: (g: GroupBy) => void };

// ══════════════════════════════════════════════════════════════
// Sub-aba 1: Qualidade do Ponto
// ══════════════════════════════════════════════════════════════
function QualidadeContent({ selectedRegional, onRegionalClick, onItemDetail, groupBy, onGroupByChange }: ContentProps) {
  const [visibleNames, setVisibleNames] = useState<string[]>([]);
  const [chartMode, setChartMode] = useState<"line" | "bar" | "area">("line");
  const [dataMode, setDataMode] = useState<"percent" | "valor">("percent");

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

  const mesLabelToReferenceMonth = useMemo(() => new Map(ajustesMeses.map((month) => [formatMesLabel(month), month])), []);
  const selectedReferenceMonth = useMemo(
    () => (selectedMes ? mesLabelToReferenceMonth.get(selectedMes) ?? null : null),
    [mesLabelToReferenceMonth, selectedMes]
  );
  
  const scoreColor = activeData.score >= 85 ? "text-green-600" : activeData.score >= 75 ? "text-orange-500" : "text-red-600";
  const scoreFaixa = activeData.score >= 85 ? "Bom" : activeData.score >= 75 ? "Atenção" : "Crítico";

  const sidebarItems = useMemo(() => {
    if (groupBy === "empresa") return [...empresaData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(e.qualidade) }));
    if (groupBy === "area") return [...areaData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(e.qualidade) }));
    return [...unidadeData].sort((a, b) => b.qualidade - a.qualidade).map(e => ({ nome: e.nome, score: Math.round(e.qualidade) }));
  }, [groupBy]);

  const allScatter = useMemo(() => {
    if (groupBy === "empresa") return empresaScatter;
    if (groupBy === "area") return areaScatter;
    return scatterQualidade;
  }, [groupBy]);

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
          <ScoreBoard title="Qualidade do Ponto" tooltip="Percentual de marcações registradas corretamente vs total de marcações que exigiram intervenção (justificativas manuais).">
            <ScoreGauge score={activeData.score} label={`${activeData.score}`} faixa={scoreFaixa} />
          </ScoreBoard>
          <KPIBoard title="Melhor Operação" tooltip="Operação com maior score de qualidade no período" value={activeData.melhorOperacao.nome} valueColor="text-green-600" subtitle={`Score ${activeData.melhorOperacao.score} · Alta`} />
          <KPIBoard title="Maior Risco" tooltip="Operação com menor qualidade e maior concentração de risco" value={activeData.maiorRisco.nome} valueColor="text-red-600" subtitle={`Score ${activeData.maiorRisco.score} · ${activeData.maiorRisco.indicador}`} />
          <KPIBoard title="Registradas" tooltip="Total de marcações registradas pelo colaborador sem necessidade de ajuste." value={activeData.registradas} valueColor="text-green-600" />
          <KPIBoard title="Justificadas" tooltip="Total de marcações que foram justificadas manualmente pelo operador ou gestor." value={activeData.justificadas} valueColor="text-orange-500" />
        </div>

        {/* Row 1: Evolução Qualidade + Tempo Médio Tratativa */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div>
                <h4 className="text-sm font-semibold">Evolução da Qualidade</h4>
                <p className="text-[10px] text-muted-foreground mb-2">Por competência · clique para filtrar</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5">
                  {([
                    { mode: "percent" as const, icon: Percent, tip: "Percentual" },
                    { mode: "valor" as const, icon: Hash, tip: "Valor absoluto" },
                  ]).map(({ mode, icon: Icon, tip }) => (
                    <button key={mode} onClick={() => setDataMode(mode)}
                      className={`p-1.5 rounded-md transition-colors ${dataMode === mode ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      title={tip}><Icon size={14} /></button>
                  ))}
                </div>
                <div className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5">
                  {([
                    { mode: "line" as const, icon: LineChartIcon, tip: "Linha" },
                    { mode: "bar" as const, icon: BarChart3, tip: "Barras" },
                    { mode: "area" as const, icon: AreaChartIcon, tip: "Área" },
                  ]).map(({ mode, icon: Icon, tip }) => (
                    <button key={mode} onClick={() => setChartMode(mode)}
                      className={`p-1.5 rounded-md transition-colors ${chartMode === mode ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      title={tip}><Icon size={14} /></button>
                  ))}
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
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
                      <RechartsTooltip formatter={(v: number, name: string) => [
                        showDetalhado ? v.toLocaleString("pt-BR") : `${v}%`,
                        name === "registradas" ? "Registradas" : "Justificadas"
                      ]} />
                      <Legend formatter={(value: string) => value === "registradas" ? "Registradas" : "Justificadas"} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="registradas" stackId="qual" fill="#4CAF50" fillOpacity={0.85} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="justificadas" stackId="qual" fill="#FF5722" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
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
                      <defs>
                        <linearGradient id="qualAreaGradReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="#4CAF50" stopOpacity={0.15} />
                        </linearGradient>
                        <linearGradient id="qualAreaGradJust" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF5722" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="#FF5722" stopOpacity={0.15} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="mes" tick={(props: any) => {
                        const { x, y, payload } = props;
                        const isActive = selectedMes === payload.value;
                        return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                      }} />
                      <YAxis tick={{ fontSize: 10 }} domain={showDetalhado ? undefined : [0, 100]}
                        tickFormatter={v => showDetalhado ? (v >= 1000 ? `${(v/1000).toFixed(0)}K` : `${v}`) : `${v}%`} />
                      <RechartsTooltip formatter={(v: number, name: string) => [
                        showDetalhado ? v.toLocaleString("pt-BR") : `${v}%`,
                        name === "registradas" ? "Registradas" : "Justificadas"
                      ]} />
                      <Legend formatter={(value: string) => value === "registradas" ? "Registradas" : "Justificadas"} wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="registradas" stackId="qual" stroke="none" fill="url(#qualAreaGradReg)" name="registradas" />
                      <Area type="monotone" dataKey="justificadas" stackId="qual" stroke="none" fill="url(#qualAreaGradJust)" name="justificadas" />
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
                    <RechartsTooltip formatter={(v: number, name: string) => [v.toLocaleString("pt-BR"), name === "registradas" ? "Registradas" : "Justificadas"]} />
                    <Legend formatter={(value: string) => value === "registradas" ? "Registradas" : "Justificadas"} wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="registradas" stroke="#4CAF50" strokeWidth={2} dot={{ r: 3, fill: "#4CAF50", stroke: "#fff", strokeWidth: 2 }} name="registradas" />
                    <Line type="monotone" dataKey="justificadas" stroke="#FF5722" strokeWidth={2} dot={{ r: 3, fill: "#FF5722", stroke: "#fff", strokeWidth: 2 }} name="justificadas" />
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
                )
              )}
            </ResponsiveContainer>
          </div>

          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="text-sm font-semibold">Composição do Tempo de Tratativa</h4>
              <InfoTip text="Evolução mensal da distribuição percentual por faixa de tempo. Quanto mais verde na base, melhor. Crescimento do vermelho indica piora." />
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Evolução mensal da distribuição por faixa</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={tratativaFaixasFiltrada.map(d => ({
                mes: d.mes,
                ate1d: (d.ate1d / d.total) * 100,
                de1a3d: (d.de1a3d / d.total) * 100,
                de3a7d: (d.de3a7d / d.total) * 100,
                de7a15d: (d.de7a15d / d.total) * 100,
                mais15d: (d.mais15d / d.total) * 100,
                _raw: d,
              }))} onClick={(e: any) => {
                if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
              }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="mes" tick={(props: any) => {
                  const { x, y, payload } = props;
                  const isActive = selectedMes === payload.value;
                  return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${Math.round(v)}%`} domain={[0, 100]} />
                <RechartsTooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const raw = payload[0]?.payload?._raw;
                  if (!raw) return null;
                  const faixas = [
                    { name: "Até 1 dia", key: "ate1d", color: "#22c55e" },
                    { name: "1–3 dias", key: "de1a3d", color: "#84cc16" },
                    { name: "3–7 dias", key: "de3a7d", color: "#eab308" },
                    { name: "7–15 dias", key: "de7a15d", color: "#f97316" },
                    { name: "+15 dias", key: "mais15d", color: "#ef4444" },
                  ];
                  return (
                    <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{raw.total.toLocaleString("pt-BR")}</span></p>
                      {faixas.map(f => {
                        const abs = raw[f.key as keyof typeof raw] as number;
                        const pct = ((abs / raw.total) * 100).toFixed(0);
                        return (
                          <div key={f.key} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: f.color }} />
                            <span className="text-muted-foreground">{f.name}:</span>
                            <span className="font-medium text-foreground">{pct}% ({abs.toLocaleString("pt-BR")})</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }} />
                {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                <Area type="monotone" dataKey="ate1d" stackId="1" stroke="#22c55e" fill={`rgba(34,197,94,${selectedMes ? 0.3 : 0.55})`} fillOpacity={1} name="Até 1 dia" />
                <Area type="monotone" dataKey="de1a3d" stackId="1" stroke="#84cc16" fill={`rgba(132,204,22,${selectedMes ? 0.3 : 0.55})`} fillOpacity={1} name="1–3 dias" />
                <Area type="monotone" dataKey="de3a7d" stackId="1" stroke="#eab308" fill={`rgba(234,179,8,${selectedMes ? 0.3 : 0.55})`} fillOpacity={1} name="3–7 dias" />
                <Area type="monotone" dataKey="de7a15d" stackId="1" stroke="#f97316" fill={`rgba(249,115,22,${selectedMes ? 0.3 : 0.55})`} fillOpacity={1} name="7–15 dias" />
                <Area type="monotone" dataKey="mais15d" stackId="1" stroke="#ef4444" fill={`rgba(239,68,68,${selectedMes ? 0.3 : 0.55})`} fillOpacity={1} name="+15 dias" />
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              </AreaChart>
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
                    <g onClick={() => onRegionalClick(payload.regional)} onContextMenu={(e: any) => { e.preventDefault(); e.stopPropagation(); onItemDetail?.(payload.regional); }} className="cursor-pointer">
                      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={isSelected ? 0.7 : 0.15} stroke={fill} strokeWidth={isSelected ? 1.5 : 0.5} />
                      <text x={cx} y={cy - r - 3} textAnchor="middle" fontSize={7} fontWeight={600} fill={isSelected ? "#374151" : "#9ca3af"}>{abreviar(payload.regional)}</text>
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
                      <text x={cx} y={cy - r - 3} textAnchor="middle" fontSize={8} fontWeight={600} fill="#374151">{payload.regional.replace("VIG EYES ", "").split(/\s+/)[0]?.slice(0, 4) || abreviar(payload.regional)}</text>
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

  // Scatter data per groupBy
  const allScatterData = useMemo(() => {
    if (groupBy === "empresa") return empresaAbsScatter;
    if (groupBy === "area") return areaAbsScatter;
    return unidadeAbsScatter;
  }, [groupBy]);

  // Filter scatter by visible sidebar names
  const chartScatter = useMemo(() => {
    if (visibleNames.length === 0) return allScatterData;
    return allScatterData.filter(d => visibleNames.includes(d.regional));
  }, [allScatterData, visibleNames]);

  // Evolution data filtered by selectedRegional (simulate variation)
  const filteredAbsEvolucao = useMemo(() => {
    if (!selectedRegional) return absenteismoEvolucao;
    const item = allScatterData.find(d => d.regional === selectedRegional);
    if (!item) return absenteismoEvolucao;
    const ratio = item.absenteismo / absenteismoMedia;
    return absenteismoEvolucao.map(d => ({ ...d, value: +(d.value * ratio).toFixed(1) }));
  }, [selectedRegional, allScatterData]);

  const filteredTurnoverEvolucao = useMemo(() => {
    if (!selectedRegional) return turnoverEvolucao;
    const item = allScatterData.find(d => d.regional === selectedRegional);
    if (!item) return turnoverEvolucao;
    const ratio = item.turnover / turnoverMedia;
    return turnoverEvolucao.map(d => ({ ...d, value: +(d.value * ratio).toFixed(1) }));
  }, [selectedRegional, allScatterData]);

  const activeData = useMemo(() => {
    if (!selectedRegional) {
      const sorted = [...allScatterData].sort((a, b) => a.absenteismo - b.absenteismo);
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      return {
        score: 52, taxa: 4.8, faixa: "Atenção" as string,
        melhorOperacao: { nome: best?.regional ?? "—", score: Math.round(Math.max(0, 100 - (best?.absenteismo ?? 5) * 10)) },
        maiorRisco: { nome: worst?.regional ?? "—", score: Math.round(Math.max(0, 100 - (worst?.absenteismo ?? 5) * 10)), indicador: "Baixa qualidade" },
        faltasNJ: "38%", turnover: "8.2%",
      };
    }
    const r = allScatterData.find(x => x.regional === selectedRegional);
    if (!r) return {
      score: 52, taxa: 4.8, faixa: "Atenção" as string,
      melhorOperacao: { nome: "—", score: 0 },
      maiorRisco: { nome: "—", score: 0, indicador: "—" },
      faltasNJ: "38%", turnover: "8.2%",
    };
    const score = Math.round(Math.max(0, 100 - r.absenteismo * 10));
    return {
      score, taxa: r.absenteismo,
      faixa: (r.absenteismo <= 4 ? "Bom" : r.absenteismo <= 6 ? "Atenção" : "Crítico") as string,
      melhorOperacao: { nome: selectedRegional, score },
      maiorRisco: { nome: selectedRegional, score, indicador: `${r.absenteismo}% taxa` },
      faltasNJ: `${Math.round(30 + r.absenteismo * 3)}%`,
      turnover: `${r.turnover}%`,
    };
  }, [selectedRegional, allScatterData]);

  const getAbsScore = (abs: number) => Math.round(Math.max(0, 100 - abs * 10));
  const sidebarItems = useMemo(() => {
    if (groupBy === "empresa") return [...empresaAbsScatter].sort((a, b) => a.absenteismo - b.absenteismo).map(e => ({ nome: e.regional, score: getAbsScore(e.absenteismo) }));
    if (groupBy === "area") return [...areaAbsScatter].sort((a, b) => a.absenteismo - b.absenteismo).map(e => ({ nome: e.regional, score: getAbsScore(e.absenteismo) }));
    return [...unidadeAbsScatter].sort((a, b) => a.absenteismo - b.absenteismo).map(e => ({ nome: e.regional, score: getAbsScore(e.absenteismo) }));
  }, [groupBy]);

  // Scatter color helpers
  const getAbsTurnoverColor = (abs: number, turn: number) => {
    if (abs < 5 && turn < 8) return "#22c55e";
    if (abs >= 5 && turn >= 8) return "#ef4444";
    return "#f97316";
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

  return (
    <div className="flex gap-3">
      <div className="flex-1 min-w-0 space-y-3">
        {/* Linha 1: Score + 4 KPI Cards */}
        <div className="grid grid-cols-5 gap-3">
          <ScoreBoard title="Absenteísmo" tooltip="Taxa de ausências sobre o efetivo total no período. Inclui atestados, faltas justificadas e não justificadas.">
            <ScoreGauge score={activeData.score} label={`${activeData.taxa}%`} faixa={activeData.faixa} />
          </ScoreBoard>
          <KPIBoard title="Melhor Operação" tooltip="Operação com menor taxa de absenteísmo no período" value={activeData.melhorOperacao.nome} valueColor="text-green-600" subtitle={`Score ${activeData.melhorOperacao.score} · Alta`} />
          <KPIBoard title="Maior Risco" tooltip="Operação com maior taxa de absenteísmo e maior concentração de risco" value={activeData.maiorRisco.nome} valueColor="text-red-600" subtitle={`Score ${activeData.maiorRisco.score} · ${activeData.maiorRisco.indicador}`} />
          <KPIBoard title="Faltas Não Justificadas" tooltip="Percentual das ausências que não tiveram justificativa registrada." value={activeData.faltasNJ} valueColor="text-red-600" />
          <KPIBoard title="Turnover" tooltip="Taxa de rotatividade: desligamentos no período sobre o efetivo médio." value={activeData.turnover} valueColor="text-orange-500" />
        </div>

        {/* Row 2: 2 Line charts */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <h4 className="text-sm font-semibold mb-0.5">Evolução do Absenteísmo</h4>
            <p className="text-[10px] text-muted-foreground mb-2">Taxa mensal (%) · clique para filtrar</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={filteredAbsEvolucao} onClick={(e: any) => {
                if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
              }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={(props: any) => {
                  const { x, y, payload } = props;
                  const isActive = selectedMes === payload.value;
                  return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                }} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <RechartsTooltip formatter={(v: number) => [`${v}%`, "Absenteísmo"]} />
                <ReferenceLine y={filteredAbsEvolucao.reduce((s, d) => s + d.value, 0) / filteredAbsEvolucao.length} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={2} dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isSelected = selectedMes === payload.mes;
                  const isActive = !selectedMes || isSelected;
                  return (
                    <g key={payload.mes} className="cursor-pointer">
                      {isSelected && <circle cx={cx} cy={cy} r={10} fill="hsl(var(--destructive))" fillOpacity={0.15} stroke="hsl(var(--destructive))" strokeWidth={1} strokeDasharray="3 2" />}
                      <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? "hsl(var(--destructive))" : isActive ? "hsl(var(--destructive))" : "hsl(var(--destructive) / 0.3)"} stroke="#fff" strokeWidth={2} />
                    </g>
                  );
                }} activeDot={{ r: 6, stroke: "hsl(var(--destructive))", strokeWidth: 2, fill: "#fff" }} name="Taxa" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="text-sm font-semibold">Evolução do Turnover</h4>
              <InfoTip text="Taxa de rotatividade mensal: desligamentos sobre o efetivo médio." />
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Taxa mensal (%) · clique para filtrar</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={filteredTurnoverEvolucao} onClick={(e: any) => {
                if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
              }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={(props: any) => {
                  const { x, y, payload } = props;
                  const isActive = selectedMes === payload.value;
                  return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                }} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <RechartsTooltip formatter={(v: number) => [`${v}%`, "Turnover"]} />
                <ReferenceLine y={filteredTurnoverEvolucao.reduce((s, d) => s + d.value, 0) / filteredTurnoverEvolucao.length} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isSelected = selectedMes === payload.mes;
                  const isActive = !selectedMes || isSelected;
                  return (
                    <g key={payload.mes} className="cursor-pointer">
                      {isSelected && <circle cx={cx} cy={cy} r={10} fill="#f97316" fillOpacity={0.15} stroke="#f97316" strokeWidth={1} strokeDasharray="3 2" />}
                      <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? "#f97316" : isActive ? "#f97316" : "#f9731655"} stroke="#fff" strokeWidth={2} />
                    </g>
                  );
                }} activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2, fill: "#fff" }} name="Turnover" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: 2 Scatter charts */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-card border rounded-xl p-4 ${selectedRegional ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="text-sm font-semibold">Absenteísmo vs Turnover</h4>
              <InfoTip text="Operações no quadrante superior direito indicam problema estrutural: alta rotatividade combinada com alto absenteísmo." />
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
                  const r = Math.sqrt(payload.headcount) / 4;
                  const fill = getAbsTurnoverColor(payload.absenteismo, payload.turnover);
                  const isSelected = !selectedRegional || selectedRegional === payload.regional;
                  return (
                    <g onClick={() => onRegionalClick(payload.regional)} onContextMenu={(e: any) => { e.preventDefault(); e.stopPropagation(); onItemDetail?.(payload.regional); }} className="cursor-pointer">
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
              <h4 className="text-sm font-semibold">Absenteísmo vs Hora Extra</h4>
              <InfoTip text="Operações no quadrante superior direito podem estar em ciclo vicioso: colaboradores faltam, quem fica faz hora extra, se cansa e falta mais." />
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
                  const r = Math.sqrt(payload.headcount) / 4;
                  const fill = getAbsHEColor(payload.absenteismo, payload.he);
                  const isSelected = !selectedRegional || selectedRegional === payload.regional;
                  return (
                    <g onClick={() => onRegionalClick(payload.regional)} onContextMenu={(e: any) => { e.preventDefault(); e.stopPropagation(); onItemDetail?.(payload.regional); }} className="cursor-pointer">
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
