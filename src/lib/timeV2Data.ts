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

// ============================================
// DADOS ESTRATÉGICOS - APROVAÇÃO DE HORAS EXTRAS
// ============================================

// Taxa Global de Aprovação
export const taxaGlobalAprovacao = {
  taxaAprovacao: 85.4,
  taxaReprovacao: 14.6,
  periodoAnterior: 82.1,
  variacao: 3.3,
  totalSolicitacoes: 2170,
  mediaEmpresa: 83.0,
};

// Aprovação vs Reprovação por Gestor
export const aprovacaoReprovacaoPorGestor = [
  { gestor: 'Ana Oliveira', area: 'Operações', aprovadas: 520, reprovadas: 45, total: 565, taxaAprovacao: 92.0, mediaHE: 3.2, colaboradores: 28 },
  { gestor: 'Pedro Costa', area: 'Administrativo', aprovadas: 380, reprovadas: 85, total: 465, taxaAprovacao: 81.7, mediaHE: 2.8, colaboradores: 22 },
  { gestor: 'Maria Fernandes', area: 'Operações', aprovadas: 420, reprovadas: 38, total: 458, taxaAprovacao: 91.7, mediaHE: 3.5, colaboradores: 25 },
  { gestor: 'Roberto Alves', area: 'Logística', aprovadas: 290, reprovadas: 52, total: 342, taxaAprovacao: 84.8, mediaHE: 2.5, colaboradores: 18 },
  { gestor: 'Carla Mendes', area: 'Comercial', aprovadas: 180, reprovadas: 28, total: 208, taxaAprovacao: 86.5, mediaHE: 2.2, colaboradores: 15 },
  { gestor: 'Thiago Santos', area: 'TI', aprovadas: 145, reprovadas: 65, total: 210, taxaAprovacao: 69.0, mediaHE: 2.0, colaboradores: 12 },
  { gestor: 'Luciana Ferreira', area: 'RH', aprovadas: 95, reprovadas: 12, total: 107, taxaAprovacao: 88.8, mediaHE: 1.8, colaboradores: 8 },
  { gestor: 'Fernando Lima', area: 'Financeiro', aprovadas: 88, reprovadas: 22, total: 110, taxaAprovacao: 80.0, mediaHE: 1.5, colaboradores: 10 },
];

// Ranking de Gestores por Aprovação (Volume Absoluto)
export const rankingGestoresAprovacao = [
  { gestor: 'Ana Oliveira', horasAprovadas: 520, taxaAprovacao: 92.0, area: 'Operações', totalSolicitacoes: 565, mediaPorSolicitacao: 3.2, comparativoEmpresa: 9.0 },
  { gestor: 'Maria Fernandes', horasAprovadas: 420, taxaAprovacao: 91.7, area: 'Operações', totalSolicitacoes: 458, mediaPorSolicitacao: 3.5, comparativoEmpresa: 8.7 },
  { gestor: 'Pedro Costa', horasAprovadas: 380, taxaAprovacao: 81.7, area: 'Administrativo', totalSolicitacoes: 465, mediaPorSolicitacao: 2.8, comparativoEmpresa: -1.3 },
  { gestor: 'Roberto Alves', horasAprovadas: 290, taxaAprovacao: 84.8, area: 'Logística', totalSolicitacoes: 342, mediaPorSolicitacao: 2.5, comparativoEmpresa: 1.8 },
  { gestor: 'Carla Mendes', horasAprovadas: 180, taxaAprovacao: 86.5, area: 'Comercial', totalSolicitacoes: 208, mediaPorSolicitacao: 2.2, comparativoEmpresa: 3.5 },
  { gestor: 'Thiago Santos', horasAprovadas: 145, taxaAprovacao: 69.0, area: 'TI', totalSolicitacoes: 210, mediaPorSolicitacao: 2.0, comparativoEmpresa: -14.0 },
  { gestor: 'Luciana Ferreira', horasAprovadas: 95, taxaAprovacao: 88.8, area: 'RH', totalSolicitacoes: 107, mediaPorSolicitacao: 1.8, comparativoEmpresa: 5.8 },
  { gestor: 'Fernando Lima', horasAprovadas: 88, taxaAprovacao: 80.0, area: 'Financeiro', totalSolicitacoes: 110, mediaPorSolicitacao: 1.5, comparativoEmpresa: -3.0 },
];

// Ranking de Gestores por Reprovação (Volume Absoluto)
export const rankingGestoresReprovacao = [
  { gestor: 'Pedro Costa', horasReprovadas: 85, taxaReprovacao: 18.3, area: 'Administrativo', totalSolicitacoes: 465, motivoPrincipal: 'Justificativa insuficiente' },
  { gestor: 'Thiago Santos', horasReprovadas: 65, taxaReprovacao: 31.0, area: 'TI', totalSolicitacoes: 210, motivoPrincipal: 'Fora do planejamento' },
  { gestor: 'Roberto Alves', horasReprovadas: 52, taxaReprovacao: 15.2, area: 'Logística', totalSolicitacoes: 342, motivoPrincipal: 'Excesso acumulado' },
  { gestor: 'Ana Oliveira', horasReprovadas: 45, taxaReprovacao: 8.0, area: 'Operações', totalSolicitacoes: 565, motivoPrincipal: 'Duplicidade' },
  { gestor: 'Maria Fernandes', horasReprovadas: 38, taxaReprovacao: 8.3, area: 'Operações', totalSolicitacoes: 458, motivoPrincipal: 'Erro de registro' },
  { gestor: 'Carla Mendes', horasReprovadas: 28, taxaReprovacao: 13.5, area: 'Comercial', totalSolicitacoes: 208, motivoPrincipal: 'Sem autorização prévia' },
  { gestor: 'Fernando Lima', horasReprovadas: 22, taxaReprovacao: 20.0, area: 'Financeiro', totalSolicitacoes: 110, motivoPrincipal: 'Orçamento excedido' },
  { gestor: 'Luciana Ferreira', horasReprovadas: 12, taxaReprovacao: 11.2, area: 'RH', totalSolicitacoes: 107, motivoPrincipal: 'Política interna' },
];
