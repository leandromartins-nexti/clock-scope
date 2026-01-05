// Time V2 Dashboard Data - Executive Decision Making

export interface KPIData {
  value: number | string;
  previousValue?: number;
  variation?: number;
  risk?: 'baixo' | 'medio' | 'alto';
  trend?: 'up' | 'down' | 'stable';
}

export const heroKPIs = {
  horasExtrasTotais: {
    value: 12847,
    previousValue: 11234,
    variation: 14.4,
  },
  saldoBancoHoras: {
    value: 45230,
    risk: 'medio' as const,
  },
  violacoesTrabalhistas: {
    value: 8.7,
    previousValue: 9.2,
    variation: -5.4,
    trend: 'down' as const,
  },
  horasProximasVencimento: {
    value: 3420,
    risk: 'alto' as const,
  },
};

export const pressaoJornadaData = [
  { periodo: 'Jan', horasExtras: 9850, percentualColaboradores: 32 },
  { periodo: 'Fev', horasExtras: 10200, percentualColaboradores: 35 },
  { periodo: 'Mar', horasExtras: 11400, percentualColaboradores: 38 },
  { periodo: 'Abr', horasExtras: 10800, percentualColaboradores: 36 },
  { periodo: 'Mai', horasExtras: 11900, percentualColaboradores: 41 },
  { periodo: 'Jun', horasExtras: 12847, percentualColaboradores: 44 },
];

export const qualidadeJornadaData = [
  { unidade: 'Matriz', faltas: 45, atrasos: 120, ausenciasNaoJustificadas: 23 },
  { unidade: 'Filial SP', faltas: 67, atrasos: 180, ausenciasNaoJustificadas: 41 },
  { unidade: 'Filial RJ', faltas: 38, atrasos: 95, ausenciasNaoJustificadas: 18 },
  { unidade: 'Filial MG', faltas: 52, atrasos: 145, ausenciasNaoJustificadas: 29 },
  { unidade: 'Filial PR', faltas: 29, atrasos: 78, ausenciasNaoJustificadas: 12 },
];

export const bancoHorasDistribuicao = [
  { name: 'Positivo', value: 68, fill: 'hsl(var(--success))' },
  { name: 'Negativo', value: 32, fill: 'hsl(var(--destructive))' },
];

export const bancoHorasEvolucao = [
  { mes: 'Jan', saldo: 38500 },
  { mes: 'Fev', saldo: 40200 },
  { mes: 'Mar', saldo: 42100 },
  { mes: 'Abr', saldo: 41800 },
  { mes: 'Mai', saldo: 43500 },
  { mes: 'Jun', saldo: 45230 },
];

export const horasAVencerData = [
  { faixa: '0-30 dias', horas: 3420, fill: 'hsl(var(--destructive))' },
  { faixa: '31-60 dias', horas: 2180, fill: 'hsl(var(--warning))' },
  { faixa: '61+ dias', horas: 1540, fill: 'hsl(var(--success))' },
];

export const violacoesTipoData = [
  { tipo: 'Jornada', ocorrencias: 187 },
  { tipo: 'Descanso', ocorrencias: 134 },
  { tipo: 'DSR', ocorrencias: 89 },
  { tipo: 'Intrajornada', ocorrencias: 156 },
];

export const heatmapViolacoesData = [
  { unidade: 'Matriz', jornada: 45, descanso: 32, dsr: 18, intrajornada: 38 },
  { unidade: 'Filial SP', jornada: 52, descanso: 41, dsr: 28, intrajornada: 44 },
  { unidade: 'Filial RJ', jornada: 35, descanso: 24, dsr: 15, intrajornada: 29 },
  { unidade: 'Filial MG', jornada: 28, descanso: 19, dsr: 14, intrajornada: 25 },
  { unidade: 'Filial PR', jornada: 27, descanso: 18, dsr: 14, intrajornada: 20 },
];
