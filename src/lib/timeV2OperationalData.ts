// Time V2 Operational Dashboard Data - Daily Tracking Focus

export const heroKPIsOperational = {
  totalHorasExtras: 2170,
  totalSaldoBanco: 1245,
  horasExtrasPendentes: 234,
  horasExtrasAprovadas: 1847,
  horasExtrasReprovadas: 89,
  faltasRegistradas: 67,
  atrasosRegistrados: 145,
  violacoesAtivas: 42,
};

export const horasExtrasPorStatus = [
  { periodo: 'Seg', pendente: 45, aprovada: 320, reprovada: 12 },
  { periodo: 'Ter', pendente: 38, aprovada: 285, reprovada: 15 },
  { periodo: 'Qua', pendente: 52, aprovada: 310, reprovada: 18 },
  { periodo: 'Qui', pendente: 41, aprovada: 295, reprovada: 14 },
  { periodo: 'Sex', pendente: 58, aprovada: 340, reprovada: 20 },
  { periodo: 'Sáb', pendente: 0, aprovada: 180, reprovada: 6 },
  { periodo: 'Dom', pendente: 0, aprovada: 117, reprovada: 4 },
];

export const horasExtrasPorColaborador = [
  { id: '1', colaborador: 'Carlos Silva', data: '03/01/2026', quantidade: '2h30min', quantidadeNum: 2.5, status: 'Pendente', gestor: 'Ana Oliveira', area: 'Operações', historico: [2.0, 3.5, 2.5, 4.0, 2.5] },
  { id: '2', colaborador: 'Maria Santos', data: '03/01/2026', quantidade: '1h45min', quantidadeNum: 1.75, status: 'Aprovada', gestor: 'Pedro Costa', area: 'Administrativo', historico: [1.5, 2.0, 1.75, 1.5, 1.75] },
  { id: '3', colaborador: 'João Pereira', data: '02/01/2026', quantidade: '3h00min', quantidadeNum: 3.0, status: 'Reprovada', gestor: 'Ana Oliveira', area: 'Operações', historico: [2.5, 3.0, 4.0, 3.5, 3.0] },
  { id: '4', colaborador: 'Fernanda Lima', data: '02/01/2026', quantidade: '2h15min', quantidadeNum: 2.25, status: 'Aprovada', gestor: 'Roberto Alves', area: 'Logística', historico: [2.0, 2.5, 2.25, 2.0, 2.25] },
  { id: '5', colaborador: 'Ricardo Souza', data: '02/01/2026', quantidade: '4h00min', quantidadeNum: 4.0, status: 'Pendente', gestor: 'Maria Fernandes', area: 'Operações', historico: [3.5, 4.5, 4.0, 5.0, 4.0] },
  { id: '6', colaborador: 'Juliana Costa', data: '01/01/2026', quantidade: '1h30min', quantidadeNum: 1.5, status: 'Aprovada', gestor: 'Pedro Costa', area: 'Comercial', historico: [1.0, 1.5, 1.25, 1.5, 1.5] },
  { id: '7', colaborador: 'André Martins', data: '01/01/2026', quantidade: '2h00min', quantidadeNum: 2.0, status: 'Pendente', gestor: 'Ana Oliveira', area: 'Operações', historico: [1.5, 2.5, 2.0, 2.0, 2.0] },
  { id: '8', colaborador: 'Patrícia Rocha', data: '31/12/2025', quantidade: '3h30min', quantidadeNum: 3.5, status: 'Aprovada', gestor: 'Roberto Alves', area: 'Logística', historico: [3.0, 3.5, 4.0, 3.0, 3.5] },
];

// Ranking de Horas Extras - Top 10
export const rankingHorasExtras = [
  { id: '5', colaborador: 'Ricardo Souza', horasExtras: 48, percentual: 15.2, historico: [42, 45, 48, 52, 48] },
  { id: '3', colaborador: 'João Pereira', horasExtras: 42, percentual: 13.3, historico: [38, 40, 42, 44, 42] },
  { id: '8', colaborador: 'Patrícia Rocha', horasExtras: 38, percentual: 12.0, historico: [35, 36, 38, 40, 38] },
  { id: '1', colaborador: 'Carlos Silva', horasExtras: 35, percentual: 11.1, historico: [30, 32, 35, 38, 35] },
  { id: '9', colaborador: 'Marcos Oliveira', horasExtras: 32, percentual: 10.1, historico: [28, 30, 32, 34, 32] },
  { id: '10', colaborador: 'Luciana Ferreira', horasExtras: 28, percentual: 8.9, historico: [24, 26, 28, 30, 28] },
  { id: '4', colaborador: 'Fernanda Lima', horasExtras: 25, percentual: 7.9, historico: [22, 24, 25, 26, 25] },
  { id: '11', colaborador: 'Thiago Barbosa', horasExtras: 22, percentual: 7.0, historico: [18, 20, 22, 24, 22] },
  { id: '7', colaborador: 'André Martins', horasExtras: 18, percentual: 5.7, historico: [15, 16, 18, 20, 18] },
  { id: '2', colaborador: 'Maria Santos', horasExtras: 15, percentual: 4.7, historico: [12, 14, 15, 16, 15] },
];

// ============================================
// DADOS OPERACIONAIS - HORAS EXTRAS (VOLUME TOTAL)
// ============================================

// Total de Horas Extras (sem distinção de status)
export const totalHorasExtras = {
  horasAtuais: 2170,
  horasPeriodoAnterior: 1985,
  variacao: 9.3, // percentual de variação
  mediaPerido: 310, // média diária do período
  distribuicaoPorDia: [
    { dia: 'Seg', horas: 377, acumulado: 377 },
    { dia: 'Ter', horas: 338, acumulado: 715 },
    { dia: 'Qua', horas: 380, acumulado: 1095 },
    { dia: 'Qui', horas: 350, acumulado: 1445 },
    { dia: 'Sex', horas: 418, acumulado: 1863 },
    { dia: 'Sáb', horas: 186, acumulado: 2049 },
    { dia: 'Dom', horas: 121, acumulado: 2170 },
  ],
};

// Ranking de Colaboradores com mais Horas Extras (sem distinção de status)
export const rankingColaboradoresHE = [
  { id: '5', colaborador: 'Ricardo Souza', horasExtras: 52, area: 'Operações', gestor: 'Maria Fernandes', distribuicao: [8, 10, 12, 10, 8, 4, 0] },
  { id: '3', colaborador: 'João Pereira', horasExtras: 45, area: 'Operações', gestor: 'Ana Oliveira', distribuicao: [7, 8, 9, 8, 7, 4, 2] },
  { id: '8', colaborador: 'Patrícia Rocha', horasExtras: 41, area: 'Logística', gestor: 'Roberto Alves', distribuicao: [6, 7, 8, 7, 8, 3, 2] },
  { id: '1', colaborador: 'Carlos Silva', horasExtras: 38, area: 'Operações', gestor: 'Ana Oliveira', distribuicao: [5, 6, 8, 7, 6, 4, 2] },
  { id: '9', colaborador: 'Marcos Oliveira', horasExtras: 35, area: 'Operações', gestor: 'Maria Fernandes', distribuicao: [5, 6, 7, 6, 6, 3, 2] },
  { id: '10', colaborador: 'Luciana Ferreira', horasExtras: 32, area: 'Administrativo', gestor: 'Pedro Costa', distribuicao: [4, 5, 6, 6, 5, 4, 2] },
  { id: '4', colaborador: 'Fernanda Lima', horasExtras: 28, area: 'Logística', gestor: 'Roberto Alves', distribuicao: [4, 5, 5, 5, 4, 3, 2] },
  { id: '11', colaborador: 'Thiago Barbosa', horasExtras: 25, area: 'TI', gestor: 'Thiago Santos', distribuicao: [3, 4, 5, 5, 4, 3, 1] },
  { id: '7', colaborador: 'André Martins', horasExtras: 22, area: 'Operações', gestor: 'Ana Oliveira', distribuicao: [3, 4, 4, 4, 4, 2, 1] },
  { id: '2', colaborador: 'Maria Santos', horasExtras: 18, area: 'Administrativo', gestor: 'Pedro Costa', distribuicao: [2, 3, 3, 4, 3, 2, 1] },
];

// ============================================
// DADOS OPERACIONAIS - APROVAÇÃO DE HORAS EXTRAS
// ============================================

// Solicitações de HE por Status (Período Atual)
export const solicitacoesHEPorStatus = {
  pendentes: 234,
  aprovadas: 1847,
  reprovadas: 89,
  totalHoras: 2170,
};

// Ranking de Gestores com HE Pendentes
export const rankingGestoresPendentes = [
  { gestor: 'Ana Oliveira', horasPendentes: 68, qtdSolicitacoes: 22, area: 'Operações', diasMedio: 2.1 },
  { gestor: 'Maria Fernandes', horasPendentes: 52, qtdSolicitacoes: 18, area: 'Operações', diasMedio: 1.8 },
  { gestor: 'Pedro Costa', horasPendentes: 45, qtdSolicitacoes: 15, area: 'Administrativo', diasMedio: 3.2 },
  { gestor: 'Roberto Alves', horasPendentes: 32, qtdSolicitacoes: 12, area: 'Logística', diasMedio: 2.5 },
  { gestor: 'Thiago Santos', horasPendentes: 22, qtdSolicitacoes: 8, area: 'TI', diasMedio: 4.0 },
  { gestor: 'Carla Mendes', horasPendentes: 15, qtdSolicitacoes: 6, area: 'Comercial', diasMedio: 1.5 },
];

// Donut Chart - Aprovadas vs Reprovadas no Período
export const aprovacaoVsReprovacao = [
  { name: 'Aprovadas', value: 1847, percentual: 95.4 },
  { name: 'Reprovadas', value: 89, percentual: 4.6 },
];

export const ocorrenciasPorTipo = [
  { tipo: 'Faltas', quantidade: 67 },
  { tipo: 'Atrasos', quantidade: 145 },
  { tipo: 'Saídas Antecipadas', quantidade: 38 },
  { tipo: 'Ausências Não Justificadas', quantidade: 23 },
];

export const ocorrenciasPorColaborador = [
  { id: '1', colaborador: 'Lucas Ferreira', tipo: 'Atraso', data: '03/01/2026', justificada: 'Sim', gestor: 'Ana Oliveira', horasImpactadas: 0.5 },
  { id: '2', colaborador: 'Amanda Ribeiro', tipo: 'Falta', data: '02/01/2026', justificada: 'Não', gestor: 'Pedro Costa', horasImpactadas: 8 },
  { id: '3', colaborador: 'Bruno Mendes', tipo: 'Atraso', data: '02/01/2026', justificada: 'Sim', gestor: 'Maria Fernandes', horasImpactadas: 1 },
  { id: '4', colaborador: 'Carla Dias', tipo: 'Saída Antecipada', data: '02/01/2026', justificada: 'Sim', gestor: 'Roberto Alves', horasImpactadas: 2 },
  { id: '5', colaborador: 'Diego Nunes', tipo: 'Falta', data: '01/01/2026', justificada: 'Não', gestor: 'Ana Oliveira', horasImpactadas: 8 },
  { id: '6', colaborador: 'Elena Castro', tipo: 'Atraso', data: '01/01/2026', justificada: 'Não', gestor: 'Pedro Costa', horasImpactadas: 0.75 },
  { id: '7', colaborador: 'Felipe Araújo', tipo: 'Ausência Não Justificada', data: '31/12/2025', justificada: 'Não', gestor: 'Maria Fernandes', horasImpactadas: 8 },
];

// Ranking de Ocorrências - Top 10
export const rankingOcorrencias = [
  { id: '2', colaborador: 'Amanda Ribeiro', ocorrencias: 12, horasImpactadas: 48, tipo: 'Falta' },
  { id: '5', colaborador: 'Diego Nunes', ocorrencias: 10, horasImpactadas: 42, tipo: 'Falta' },
  { id: '1', colaborador: 'Lucas Ferreira', ocorrencias: 9, horasImpactadas: 8, tipo: 'Atraso' },
  { id: '6', colaborador: 'Elena Castro', ocorrencias: 8, horasImpactadas: 6, tipo: 'Atraso' },
  { id: '3', colaborador: 'Bruno Mendes', ocorrencias: 7, horasImpactadas: 5.5, tipo: 'Atraso' },
  { id: '7', colaborador: 'Felipe Araújo', ocorrencias: 6, horasImpactadas: 24, tipo: 'Ausência' },
  { id: '4', colaborador: 'Carla Dias', ocorrencias: 5, horasImpactadas: 10, tipo: 'Saída Antecipada' },
  { id: '12', colaborador: 'Gustavo Ramos', ocorrencias: 4, horasImpactadas: 16, tipo: 'Falta' },
  { id: '13', colaborador: 'Helena Souza', ocorrencias: 3, horasImpactadas: 2.5, tipo: 'Atraso' },
  { id: '14', colaborador: 'Igor Lima', ocorrencias: 2, horasImpactadas: 4, tipo: 'Saída Antecipada' },
];

export const saldoBancoHorasPorColaborador = [
  { id: '1', colaborador: 'Carlos Silva', saldoAtual: '+24h', saldoNum: 24, limite: '40h', situacao: 'normal' as const, historico: [18, 20, 22, 24, 24] },
  { id: '2', colaborador: 'Maria Santos', saldoAtual: '+38h', saldoNum: 38, limite: '40h', situacao: 'alerta' as const, historico: [32, 34, 36, 38, 38] },
  { id: '3', colaborador: 'João Pereira', saldoAtual: '-12h', saldoNum: -12, limite: '40h', situacao: 'alerta' as const, historico: [-8, -10, -11, -12, -12] },
  { id: '4', colaborador: 'Fernanda Lima', saldoAtual: '+8h', saldoNum: 8, limite: '40h', situacao: 'normal' as const, historico: [4, 6, 7, 8, 8] },
  { id: '5', colaborador: 'Ricardo Souza', saldoAtual: '+42h', saldoNum: 42, limite: '40h', situacao: 'alerta' as const, historico: [36, 38, 40, 42, 42] },
  { id: '6', colaborador: 'Juliana Costa', saldoAtual: '+15h', saldoNum: 15, limite: '40h', situacao: 'normal' as const, historico: [10, 12, 14, 15, 15] },
  { id: '7', colaborador: 'André Martins', saldoAtual: '-5h', saldoNum: -5, limite: '40h', situacao: 'normal' as const, historico: [-2, -3, -4, -5, -5] },
  { id: '8', colaborador: 'Patrícia Rocha', saldoAtual: '+28h', saldoNum: 28, limite: '40h', situacao: 'normal' as const, historico: [22, 24, 26, 28, 28] },
];

// Ranking de Banco de Horas
export const rankingSaldoPositivo = [
  { id: '5', colaborador: 'Ricardo Souza', saldo: 42, acumulado: 65, compensado: 23 },
  { id: '2', colaborador: 'Maria Santos', saldo: 38, acumulado: 58, compensado: 20 },
  { id: '8', colaborador: 'Patrícia Rocha', saldo: 28, acumulado: 45, compensado: 17 },
  { id: '1', colaborador: 'Carlos Silva', saldo: 24, acumulado: 40, compensado: 16 },
  { id: '15', colaborador: 'Roberto Nunes', saldo: 22, acumulado: 38, compensado: 16 },
  { id: '6', colaborador: 'Juliana Costa', saldo: 15, acumulado: 28, compensado: 13 },
  { id: '16', colaborador: 'Sandra Alves', saldo: 12, acumulado: 24, compensado: 12 },
  { id: '4', colaborador: 'Fernanda Lima', saldo: 8, acumulado: 18, compensado: 10 },
  { id: '17', colaborador: 'Paulo Mendes', saldo: 6, acumulado: 14, compensado: 8 },
  { id: '18', colaborador: 'Camila Dias', saldo: 4, acumulado: 10, compensado: 6 },
];

export const rankingSaldoNegativo = [
  { id: '3', colaborador: 'João Pereira', saldo: -12, acumulado: 8, compensado: 20 },
  { id: '19', colaborador: 'Renato Costa', saldo: -10, acumulado: 5, compensado: 15 },
  { id: '20', colaborador: 'Bianca Lima', saldo: -8, acumulado: 4, compensado: 12 },
  { id: '7', colaborador: 'André Martins', saldo: -5, acumulado: 3, compensado: 8 },
  { id: '21', colaborador: 'Fábio Rocha', saldo: -4, acumulado: 2, compensado: 6 },
];

export const creditosDebitosData = [
  { periodo: 'Sem 1', creditos: 580, debitos: 320 },
  { periodo: 'Sem 2', creditos: 620, debitos: 410 },
  { periodo: 'Sem 3', creditos: 540, debitos: 380 },
  { periodo: 'Sem 4', creditos: 690, debitos: 450 },
];

export const horasDisponiveis = 4280;

export const periodosBancoHoras = [
  { id: '1', periodo: 'Jan/2026', disponiveis: '1.240h', disponiveisNum: 1240, compensadas: '580h', pendentes: '660h', vencimento: '30/06/2026', colaboradoresImpactados: 45 },
  { id: '2', periodo: 'Dez/2025', disponiveis: '1.180h', disponiveisNum: 1180, compensadas: '720h', pendentes: '460h', vencimento: '31/05/2026', colaboradoresImpactados: 38 },
  { id: '3', periodo: 'Nov/2025', disponiveis: '980h', disponiveisNum: 980, compensadas: '640h', pendentes: '340h', vencimento: '30/04/2026', colaboradoresImpactados: 32 },
  { id: '4', periodo: 'Out/2025', disponiveis: '880h', disponiveisNum: 880, compensadas: '510h', pendentes: '370h', vencimento: '31/03/2026', colaboradoresImpactados: 28 },
];

// Ranking de Horas a Vencer
export const rankingHorasVencer = [
  { id: '1', periodo: 'Jan/2026', horasVencer: 660, diasRestantes: 178, colaboradores: 45 },
  { id: '2', periodo: 'Dez/2025', horasVencer: 460, diasRestantes: 148, colaboradores: 38 },
  { id: '3', periodo: 'Nov/2025', horasVencer: 340, diasRestantes: 117, colaboradores: 32 },
  { id: '4', periodo: 'Out/2025', horasVencer: 370, diasRestantes: 86, colaboradores: 28 },
];

export const violacoesPorTipoOperacional = [
  { tipo: 'Jornada Excedida', quantidade: 15 },
  { tipo: 'Intervalo Intrajornada', quantidade: 12 },
  { tipo: 'Descanso Semanal', quantidade: 8 },
  { tipo: 'DSR', quantidade: 7 },
];

export const violacoesPorColaborador = [
  { id: '1', colaborador: 'Carlos Silva', tipo: 'Jornada Excedida', data: '03/01/2026', regra: 'Máximo 10h diárias', area: 'Operações', reincidencias: 3 },
  { id: '2', colaborador: 'Maria Santos', tipo: 'Intervalo Intrajornada', data: '02/01/2026', regra: 'Mínimo 1h intervalo', area: 'Administrativo', reincidencias: 1 },
  { id: '3', colaborador: 'João Pereira', tipo: 'Jornada Excedida', data: '02/01/2026', regra: 'Máximo 10h diárias', area: 'Operações', reincidencias: 5 },
  { id: '4', colaborador: 'Fernanda Lima', tipo: 'Descanso Semanal', data: '01/01/2026', regra: 'Mínimo 24h consecutivas', area: 'Logística', reincidencias: 2 },
  { id: '5', colaborador: 'Ricardo Souza', tipo: 'DSR', data: '01/01/2026', regra: 'Folga semanal obrigatória', area: 'Operações', reincidencias: 4 },
  { id: '6', colaborador: 'Juliana Costa', tipo: 'Intervalo Intrajornada', data: '31/12/2025', regra: 'Mínimo 1h intervalo', area: 'Comercial', reincidencias: 1 },
];

// Ranking de Violações
export const rankingViolacoes = [
  { id: '3', colaborador: 'João Pereira', violacoes: 8, reincidencias: 5, regras: ['Jornada Excedida', 'DSR'] },
  { id: '5', colaborador: 'Ricardo Souza', violacoes: 6, reincidencias: 4, regras: ['DSR', 'Jornada Excedida'] },
  { id: '1', colaborador: 'Carlos Silva', violacoes: 5, reincidencias: 3, regras: ['Jornada Excedida', 'Intervalo'] },
  { id: '4', colaborador: 'Fernanda Lima', violacoes: 4, reincidencias: 2, regras: ['Descanso Semanal'] },
  { id: '22', colaborador: 'Marcos Oliveira', violacoes: 3, reincidencias: 2, regras: ['Intervalo Intrajornada'] },
  { id: '2', colaborador: 'Maria Santos', violacoes: 2, reincidencias: 1, regras: ['Intervalo Intrajornada'] },
  { id: '6', colaborador: 'Juliana Costa', violacoes: 2, reincidencias: 1, regras: ['Intervalo Intrajornada'] },
  { id: '23', colaborador: 'Thiago Barbosa', violacoes: 1, reincidencias: 0, regras: ['DSR'] },
  { id: '24', colaborador: 'Luciana Ferreira', violacoes: 1, reincidencias: 0, regras: ['Descanso Semanal'] },
  { id: '25', colaborador: 'Paulo Mendes', violacoes: 1, reincidencias: 0, regras: ['Jornada Excedida'] },
];
