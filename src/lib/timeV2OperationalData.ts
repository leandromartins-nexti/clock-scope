// Time V2 Operational Dashboard Data - Daily Tracking Focus

export const heroKPIsOperational = {
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
  { id: '1', colaborador: 'Carlos Silva', data: '03/01/2026', quantidade: '2h30min', status: 'Pendente', gestor: 'Ana Oliveira' },
  { id: '2', colaborador: 'Maria Santos', data: '03/01/2026', quantidade: '1h45min', status: 'Aprovada', gestor: 'Pedro Costa' },
  { id: '3', colaborador: 'João Pereira', data: '02/01/2026', quantidade: '3h00min', status: 'Reprovada', gestor: 'Ana Oliveira' },
  { id: '4', colaborador: 'Fernanda Lima', data: '02/01/2026', quantidade: '2h15min', status: 'Aprovada', gestor: 'Roberto Alves' },
  { id: '5', colaborador: 'Ricardo Souza', data: '02/01/2026', quantidade: '4h00min', status: 'Pendente', gestor: 'Maria Fernandes' },
  { id: '6', colaborador: 'Juliana Costa', data: '01/01/2026', quantidade: '1h30min', status: 'Aprovada', gestor: 'Pedro Costa' },
  { id: '7', colaborador: 'André Martins', data: '01/01/2026', quantidade: '2h00min', status: 'Pendente', gestor: 'Ana Oliveira' },
  { id: '8', colaborador: 'Patrícia Rocha', data: '31/12/2025', quantidade: '3h30min', status: 'Aprovada', gestor: 'Roberto Alves' },
];

export const ocorrenciasPorTipo = [
  { tipo: 'Faltas', quantidade: 67 },
  { tipo: 'Atrasos', quantidade: 145 },
  { tipo: 'Saídas Antecipadas', quantidade: 38 },
  { tipo: 'Ausências Não Justificadas', quantidade: 23 },
];

export const ocorrenciasPorColaborador = [
  { id: '1', colaborador: 'Lucas Ferreira', tipo: 'Atraso', data: '03/01/2026', justificada: 'Sim', gestor: 'Ana Oliveira' },
  { id: '2', colaborador: 'Amanda Ribeiro', tipo: 'Falta', data: '02/01/2026', justificada: 'Não', gestor: 'Pedro Costa' },
  { id: '3', colaborador: 'Bruno Mendes', tipo: 'Atraso', data: '02/01/2026', justificada: 'Sim', gestor: 'Maria Fernandes' },
  { id: '4', colaborador: 'Carla Dias', tipo: 'Saída Antecipada', data: '02/01/2026', justificada: 'Sim', gestor: 'Roberto Alves' },
  { id: '5', colaborador: 'Diego Nunes', tipo: 'Falta', data: '01/01/2026', justificada: 'Não', gestor: 'Ana Oliveira' },
  { id: '6', colaborador: 'Elena Castro', tipo: 'Atraso', data: '01/01/2026', justificada: 'Não', gestor: 'Pedro Costa' },
  { id: '7', colaborador: 'Felipe Araújo', tipo: 'Ausência Não Justificada', data: '31/12/2025', justificada: 'Não', gestor: 'Maria Fernandes' },
];

export const saldoBancoHorasPorColaborador = [
  { id: '1', colaborador: 'Carlos Silva', saldoAtual: '+24h', limite: '40h', situacao: 'normal' as const },
  { id: '2', colaborador: 'Maria Santos', saldoAtual: '+38h', limite: '40h', situacao: 'alerta' as const },
  { id: '3', colaborador: 'João Pereira', saldoAtual: '-12h', limite: '40h', situacao: 'alerta' as const },
  { id: '4', colaborador: 'Fernanda Lima', saldoAtual: '+8h', limite: '40h', situacao: 'normal' as const },
  { id: '5', colaborador: 'Ricardo Souza', saldoAtual: '+42h', limite: '40h', situacao: 'alerta' as const },
  { id: '6', colaborador: 'Juliana Costa', saldoAtual: '+15h', limite: '40h', situacao: 'normal' as const },
  { id: '7', colaborador: 'André Martins', saldoAtual: '-5h', limite: '40h', situacao: 'normal' as const },
  { id: '8', colaborador: 'Patrícia Rocha', saldoAtual: '+28h', limite: '40h', situacao: 'normal' as const },
];

export const creditosDebitosData = [
  { periodo: 'Sem 1', creditos: 580, debitos: 320 },
  { periodo: 'Sem 2', creditos: 620, debitos: 410 },
  { periodo: 'Sem 3', creditos: 540, debitos: 380 },
  { periodo: 'Sem 4', creditos: 690, debitos: 450 },
];

export const horasDisponiveis = 4280;

export const periodosBancoHoras = [
  { id: '1', periodo: 'Jan/2026', disponiveis: '1.240h', compensadas: '580h', pendentes: '660h', vencimento: '30/06/2026' },
  { id: '2', periodo: 'Dez/2025', disponiveis: '1.180h', compensadas: '720h', pendentes: '460h', vencimento: '31/05/2026' },
  { id: '3', periodo: 'Nov/2025', disponiveis: '980h', compensadas: '640h', pendentes: '340h', vencimento: '30/04/2026' },
  { id: '4', periodo: 'Out/2025', disponiveis: '880h', compensadas: '510h', pendentes: '370h', vencimento: '31/03/2026' },
];

export const violacoesPorTipoOperacional = [
  { tipo: 'Jornada Excedida', quantidade: 15 },
  { tipo: 'Intervalo Intrajornada', quantidade: 12 },
  { tipo: 'Descanso Semanal', quantidade: 8 },
  { tipo: 'DSR', quantidade: 7 },
];

export const violacoesPorColaborador = [
  { id: '1', colaborador: 'Carlos Silva', tipo: 'Jornada Excedida', data: '03/01/2026', regra: 'Máximo 10h diárias', area: 'Operações' },
  { id: '2', colaborador: 'Maria Santos', tipo: 'Intervalo Intrajornada', data: '02/01/2026', regra: 'Mínimo 1h intervalo', area: 'Administrativo' },
  { id: '3', colaborador: 'João Pereira', tipo: 'Jornada Excedida', data: '02/01/2026', regra: 'Máximo 10h diárias', area: 'Operações' },
  { id: '4', colaborador: 'Fernanda Lima', tipo: 'Descanso Semanal', data: '01/01/2026', regra: 'Mínimo 24h consecutivas', area: 'Logística' },
  { id: '5', colaborador: 'Ricardo Souza', tipo: 'DSR', data: '01/01/2026', regra: 'Folga semanal obrigatória', area: 'Operações' },
  { id: '6', colaborador: 'Juliana Costa', tipo: 'Intervalo Intrajornada', data: '31/12/2025', regra: 'Mínimo 1h intervalo', area: 'Comercial' },
];
