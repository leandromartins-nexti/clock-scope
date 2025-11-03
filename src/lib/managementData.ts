// ============================================
// MANAGEMENT ANALYTICS - Mock Data
// ============================================

// ============================================
// PÁGINA 1: VISÃO GERAL OPERACIONAL
// ============================================

export interface OperationalOverview {
  qtdVagas: number;
  qtdColaboradoresEfetivos: number;
  qtdPresentes: number;
  qtdPossiveisFaltantes: number;
  qtdAusentes: number;
  qtdFerias: number;
  coberturasDia: number;
}

export const operationalOverview: OperationalOverview = {
  qtdVagas: 1250,
  qtdColaboradoresEfetivos: 1180,
  qtdPresentes: 1042,
  qtdPossiveisFaltantes: 23,
  qtdAusentes: 87,
  qtdFerias: 51,
  coberturasDia: 15,
};

export interface ColaboradoresPorSituacao {
  situacao: string;
  quantidade: number;
  color: string;
}

export const colaboradoresPorSituacao: ColaboradoresPorSituacao[] = [
  { situacao: "Presentes", quantidade: 1042, color: "hsl(var(--chart-1))" },
  { situacao: "Ausentes", quantidade: 87, color: "hsl(var(--chart-2))" },
  { situacao: "Férias", quantidade: 51, color: "hsl(var(--chart-3))" },
  { situacao: "Possíveis Faltantes", quantidade: 23, color: "hsl(var(--chart-4))" },
];

// ============================================
// PÁGINA 2: INCONSISTÊNCIAS
// ============================================

export interface InconsistenciesOverview {
  totalInconsistencias: number;
  requisiçõesPendentesFacial: number;
  solicitaçãoAjuste: number;
}

export const inconsistenciesOverview: InconsistenciesOverview = {
  totalInconsistencias: 2847,
  requisiçõesPendentesFacial: 432,
  solicitaçãoAjuste: 1256,
};

export interface InconsistenciasTendencia {
  dia: string;
  terminalNaoAutorizado: number;
  naoRegistrado: number;
  perimetro: number;
  outros: number;
}

export const inconsistenciasTendencia: InconsistenciasTendencia[] = [
  { dia: "01", terminalNaoAutorizado: 35, naoRegistrado: 42, perimetro: 18, outros: 12 },
  { dia: "02", terminalNaoAutorizado: 28, naoRegistrado: 38, perimetro: 22, outros: 15 },
  { dia: "03", terminalNaoAutorizado: 41, naoRegistrado: 45, perimetro: 16, outros: 10 },
  { dia: "04", terminalNaoAutorizado: 32, naoRegistrado: 39, perimetro: 24, outros: 18 },
  { dia: "05", terminalNaoAutorizado: 38, naoRegistrado: 51, perimetro: 19, outros: 14 },
  { dia: "06", terminalNaoAutorizado: 29, naoRegistrado: 36, perimetro: 21, outros: 11 },
  { dia: "07", terminalNaoAutorizado: 44, naoRegistrado: 48, perimetro: 17, outros: 16 },
  { dia: "08", terminalNaoAutorizado: 31, naoRegistrado: 42, perimetro: 25, outros: 13 },
  { dia: "09", terminalNaoAutorizado: 36, naoRegistrado: 44, perimetro: 20, outros: 15 },
  { dia: "10", terminalNaoAutorizado: 40, naoRegistrado: 47, perimetro: 18, outros: 12 },
  { dia: "11", terminalNaoAutorizado: 27, naoRegistrado: 35, perimetro: 23, outros: 17 },
  { dia: "12", terminalNaoAutorizado: 43, naoRegistrado: 49, perimetro: 16, outros: 14 },
  { dia: "13", terminalNaoAutorizado: 34, naoRegistrado: 41, perimetro: 22, outros: 11 },
  { dia: "14", terminalNaoAutorizado: 39, naoRegistrado: 46, perimetro: 19, outros: 16 },
  { dia: "15", terminalNaoAutorizado: 30, naoRegistrado: 37, perimetro: 24, outros: 13 },
];

export interface InconsistenciaRanking {
  colaborador: string;
  posto?: string;
  inconsistencias: number;
  tipo: "colaborador" | "posto";
}

export const topInconsistenciasColaborador: InconsistenciaRanking[] = [
  { colaborador: "João Silva Santos", posto: "Portaria Norte", inconsistencias: 87, tipo: "colaborador" },
  { colaborador: "Maria Oliveira Costa", posto: "Recepção Principal", inconsistencias: 72, tipo: "colaborador" },
  { colaborador: "Pedro Henrique Lima", posto: "Vigilância Noturna", inconsistencias: 68, tipo: "colaborador" },
  { colaborador: "Ana Paula Ferreira", posto: "Controle de Acesso", inconsistencias: 61, tipo: "colaborador" },
  { colaborador: "Carlos Eduardo Souza", posto: "Portaria Sul", inconsistencias: 58, tipo: "colaborador" },
  { colaborador: "Juliana Martins Rocha", posto: "Segurança Industrial", inconsistencias: 54, tipo: "colaborador" },
  { colaborador: "Roberto Alves Costa", posto: "Terminal Principal", inconsistencias: 51, tipo: "colaborador" },
  { colaborador: "Fernanda Lima Santos", posto: "Gate Control", inconsistencias: 47, tipo: "colaborador" },
  { colaborador: "Ricardo Souza Oliveira", posto: "Vigilância Patrimonial", inconsistencias: 43, tipo: "colaborador" },
  { colaborador: "Patrícia Rocha Silva", posto: "Acesso Principal", inconsistencias: 39, tipo: "colaborador" },
];

export const topInconsistenciasPosto: InconsistenciaRanking[] = [
  { colaborador: "Portaria Norte - Shopping ABC", inconsistencias: 245, tipo: "posto" },
  { colaborador: "Vigilância Noturna - Banco Nacional", inconsistencias: 198, tipo: "posto" },
  { colaborador: "Recepção Principal - Hospital", inconsistencias: 187, tipo: "posto" },
  { colaborador: "Controle de Acesso - Tech Park", inconsistencias: 165, tipo: "posto" },
  { colaborador: "Terminal Principal - Aeroporto", inconsistencias: 153, tipo: "posto" },
  { colaborador: "Segurança Industrial - Indústria XYZ", inconsistencias: 142, tipo: "posto" },
  { colaborador: "Gate Control - Porto Salvador", inconsistencias: 128, tipo: "posto" },
  { colaborador: "Portaria Sul - Shopping XYZ", inconsistencias: 115, tipo: "posto" },
  { colaborador: "Vigilância Patrimonial - Universidade", inconsistencias: 104, tipo: "posto" },
  { colaborador: "Acesso Principal - Órgão Público", inconsistencias: 92, tipo: "posto" },
];

export const topAtestadosColaborador: InconsistenciaRanking[] = [
  { colaborador: "Lucas Ferreira Silva", posto: "Portaria Principal", inconsistencias: 12, tipo: "colaborador" },
  { colaborador: "Amanda Silva Costa", posto: "Recepção", inconsistencias: 11, tipo: "colaborador" },
  { colaborador: "Bruno Costa Oliveira", posto: "Vigilância", inconsistencias: 10, tipo: "colaborador" },
  { colaborador: "Carla Mendes Santos", posto: "Controle", inconsistencias: 9, tipo: "colaborador" },
  { colaborador: "Diego Santos Lima", posto: "Terminal", inconsistencias: 8, tipo: "colaborador" },
];

export const topAtestadosPosto: InconsistenciaRanking[] = [
  { colaborador: "Portaria Principal - Shopping ABC", inconsistencias: 45, tipo: "posto" },
  { colaborador: "Recepção - Hospital São Lucas", inconsistencias: 38, tipo: "posto" },
  { colaborador: "Vigilância - Banco Nacional", inconsistencias: 32, tipo: "posto" },
  { colaborador: "Controle - Tech Park", inconsistencias: 28, tipo: "posto" },
  { colaborador: "Terminal - Aeroporto Sul", inconsistencias: 24, tipo: "posto" },
];

export const topAusenciasColaborador: InconsistenciaRanking[] = [
  { colaborador: "Eliana Rocha Silva", posto: "Terminal 2", inconsistencias: 15, tipo: "colaborador" },
  { colaborador: "Fábio Lima Santos", posto: "Gate Control", inconsistencias: 14, tipo: "colaborador" },
  { colaborador: "Gabriela Souza Costa", posto: "Loja Centro", inconsistencias: 13, tipo: "colaborador" },
  { colaborador: "Henrique Alves Lima", posto: "Acesso Principal", inconsistencias: 12, tipo: "colaborador" },
  { colaborador: "Iris Martins Rocha", posto: "Prédio Anexo", inconsistencias: 11, tipo: "colaborador" },
];

export const topAusenciasPosto: InconsistenciaRanking[] = [
  { colaborador: "Terminal 2 - Aeroporto Sul", inconsistencias: 67, tipo: "posto" },
  { colaborador: "Gate Control - Porto Salvador", inconsistencias: 58, tipo: "posto" },
  { colaborador: "Loja Centro - Rede Varejo", inconsistencias: 51, tipo: "posto" },
  { colaborador: "Acesso Principal - Tech Park", inconsistencias: 45, tipo: "posto" },
  { colaborador: "Prédio Anexo - Órgão Público", inconsistencias: 39, tipo: "posto" },
];

// ============================================
// PÁGINA 3: BANCO DE HORAS
// ============================================

export interface BancoHorasOverview {
  saldoPositivoTotal: number;
  saldoNegativoTotal: number;
  horasExtrasTotal: number;
}

export const bancoHorasOverview: BancoHorasOverview = {
  saldoPositivoTotal: 125480,
  saldoNegativoTotal: -42350,
  horasExtrasTotal: 23400,
};

export interface SaldoBancoHoras {
  nome: string;
  posto?: string;
  saldo: number;
  tipo: "colaborador" | "posto";
}

export const topSaldoPositivoColaborador: SaldoBancoHoras[] = [
  { nome: "João Silva Santos", posto: "Portaria Norte", saldo: 128, tipo: "colaborador" },
  { nome: "Maria Oliveira Costa", posto: "Recepção", saldo: 115, tipo: "colaborador" },
  { nome: "Pedro Henrique Lima", posto: "Vigilância", saldo: 104, tipo: "colaborador" },
  { nome: "Ana Paula Ferreira", posto: "Controle", saldo: 98, tipo: "colaborador" },
  { nome: "Carlos Eduardo Souza", posto: "Terminal", saldo: 92, tipo: "colaborador" },
];

export const topSaldoNegativoColaborador: SaldoBancoHoras[] = [
  { nome: "Lucas Ferreira Silva", posto: "Gate Control", saldo: -85, tipo: "colaborador" },
  { nome: "Amanda Silva Costa", posto: "Acesso", saldo: -72, tipo: "colaborador" },
  { nome: "Bruno Costa Oliveira", posto: "Vigilância Noturna", saldo: -68, tipo: "colaborador" },
  { nome: "Carla Mendes Santos", posto: "Portaria Sul", saldo: -61, tipo: "colaborador" },
  { nome: "Diego Santos Lima", posto: "Recepção 2", saldo: -55, tipo: "colaborador" },
];

export const topSaldoPositivoPosto: SaldoBancoHoras[] = [
  { nome: "Portaria Norte - Shopping ABC", saldo: 1245, tipo: "posto" },
  { nome: "Recepção Principal - Hospital", saldo: 1128, tipo: "posto" },
  { nome: "Vigilância Noturna - Banco", saldo: 1087, tipo: "posto" },
  { nome: "Controle de Acesso - Tech Park", saldo: 978, tipo: "posto" },
  { nome: "Terminal Principal - Aeroporto", saldo: 912, tipo: "posto" },
];

export const topSaldoNegativoPosto: SaldoBancoHoras[] = [
  { nome: "Gate Control - Porto Salvador", saldo: -892, tipo: "posto" },
  { nome: "Acesso Principal - Órgão Público", saldo: -745, tipo: "posto" },
  { nome: "Vigilância Patrimonial - Universidade", saldo: -698, tipo: "posto" },
  { nome: "Portaria Sul - Shopping XYZ", saldo: -612, tipo: "posto" },
  { nome: "Recepção 2 - Hospital", saldo: -558, tipo: "posto" },
];

// ============================================
// PÁGINA 4: COMPLIANCE (TACs)
// ============================================

export interface ComplianceOverview {
  totalViolacoesTAC: number;
  colaboradoresEmRisco: number;
}

export const complianceOverview: ComplianceOverview = {
  totalViolacoesTAC: 933,
  colaboradoresEmRisco: 287,
};

export interface ViolacaoTAC {
  colaborador: string;
  posto?: string;
  violacoes: number;
  tipo: "colaborador" | "posto";
  tipoViolacao: string;
}

export const topViolacoes7DiasColaborador: ViolacaoTAC[] = [
  { colaborador: "João Silva Santos", posto: "Portaria Norte", violacoes: 8, tipo: "colaborador", tipoViolacao: "7 Dias Consecutivos" },
  { colaborador: "Maria Oliveira Costa", posto: "Recepção", violacoes: 7, tipo: "colaborador", tipoViolacao: "7 Dias Consecutivos" },
  { colaborador: "Pedro Henrique Lima", posto: "Vigilância", violacoes: 6, tipo: "colaborador", tipoViolacao: "7 Dias Consecutivos" },
  { colaborador: "Ana Paula Ferreira", posto: "Controle", violacoes: 5, tipo: "colaborador", tipoViolacao: "7 Dias Consecutivos" },
  { colaborador: "Carlos Eduardo Souza", posto: "Terminal", violacoes: 5, tipo: "colaborador", tipoViolacao: "7 Dias Consecutivos" },
];

export const topViolacoes7DiasPosto: ViolacaoTAC[] = [
  { colaborador: "Portaria Norte - Shopping ABC", violacoes: 23, tipo: "posto", tipoViolacao: "7 Dias Consecutivos" },
  { colaborador: "Recepção Principal - Hospital", violacoes: 19, tipo: "posto", tipoViolacao: "7 Dias Consecutivos" },
  { colaborador: "Vigilância Noturna - Banco", violacoes: 17, tipo: "posto", tipoViolacao: "7 Dias Consecutivos" },
  { colaborador: "Controle de Acesso - Tech Park", violacoes: 15, tipo: "posto", tipoViolacao: "7 Dias Consecutivos" },
  { colaborador: "Terminal Principal - Aeroporto", violacoes: 13, tipo: "posto", tipoViolacao: "7 Dias Consecutivos" },
];

export const topViolacoesExcessoJornadaColaborador: ViolacaoTAC[] = [
  { colaborador: "Lucas Ferreira Silva", posto: "Gate Control", violacoes: 12, tipo: "colaborador", tipoViolacao: "Excesso de Jornada" },
  { colaborador: "Amanda Silva Costa", posto: "Acesso", violacoes: 11, tipo: "colaborador", tipoViolacao: "Excesso de Jornada" },
  { colaborador: "Bruno Costa Oliveira", posto: "Vigilância Noturna", violacoes: 10, tipo: "colaborador", tipoViolacao: "Excesso de Jornada" },
  { colaborador: "Carla Mendes Santos", posto: "Portaria Sul", violacoes: 9, tipo: "colaborador", tipoViolacao: "Excesso de Jornada" },
  { colaborador: "Diego Santos Lima", posto: "Recepção 2", violacoes: 8, tipo: "colaborador", tipoViolacao: "Excesso de Jornada" },
];

export const topViolacoesExcessoJornadaPosto: ViolacaoTAC[] = [
  { colaborador: "Gate Control - Porto Salvador", violacoes: 34, tipo: "posto", tipoViolacao: "Excesso de Jornada" },
  { colaborador: "Acesso Principal - Órgão Público", violacoes: 29, tipo: "posto", tipoViolacao: "Excesso de Jornada" },
  { colaborador: "Vigilância Patrimonial - Universidade", violacoes: 25, tipo: "posto", tipoViolacao: "Excesso de Jornada" },
  { colaborador: "Portaria Sul - Shopping XYZ", violacoes: 22, tipo: "posto", tipoViolacao: "Excesso de Jornada" },
  { colaborador: "Recepção 2 - Hospital", violacoes: 19, tipo: "posto", tipoViolacao: "Excesso de Jornada" },
];

export const topViolacoesInterjornadaColaborador: ViolacaoTAC[] = [
  { colaborador: "Eliana Rocha Silva", posto: "Terminal 2", violacoes: 9, tipo: "colaborador", tipoViolacao: "Interjornada" },
  { colaborador: "Fábio Lima Santos", posto: "Gate Control", violacoes: 8, tipo: "colaborador", tipoViolacao: "Interjornada" },
  { colaborador: "Gabriela Souza Costa", posto: "Loja Centro", violacoes: 7, tipo: "colaborador", tipoViolacao: "Interjornada" },
  { colaborador: "Henrique Alves Lima", posto: "Acesso Principal", violacoes: 6, tipo: "colaborador", tipoViolacao: "Interjornada" },
  { colaborador: "Iris Martins Rocha", posto: "Prédio Anexo", violacoes: 6, tipo: "colaborador", tipoViolacao: "Interjornada" },
];

export const topViolacoesInterjornadaPosto: ViolacaoTAC[] = [
  { colaborador: "Terminal 2 - Aeroporto Sul", violacoes: 28, tipo: "posto", tipoViolacao: "Interjornada" },
  { colaborador: "Gate Control - Porto Salvador", violacoes: 24, tipo: "posto", tipoViolacao: "Interjornada" },
  { colaborador: "Loja Centro - Rede Varejo", violacoes: 21, tipo: "posto", tipoViolacao: "Interjornada" },
  { colaborador: "Acesso Principal - Tech Park", violacoes: 18, tipo: "posto", tipoViolacao: "Interjornada" },
  { colaborador: "Prédio Anexo - Órgão Público", violacoes: 16, tipo: "posto", tipoViolacao: "Interjornada" },
];

export const topViolacoesIntrajornadaColaborador: ViolacaoTAC[] = [
  { colaborador: "José Antônio Silva", posto: "Vigilância 24h", violacoes: 11, tipo: "colaborador", tipoViolacao: "Intrajornada" },
  { colaborador: "Mariana Costa Lima", posto: "Portaria Leste", violacoes: 10, tipo: "colaborador", tipoViolacao: "Intrajornada" },
  { colaborador: "Paulo Roberto Souza", posto: "Recepção Comercial", violacoes: 9, tipo: "colaborador", tipoViolacao: "Intrajornada" },
  { colaborador: "Aline Ferreira Santos", posto: "Controle Industrial", violacoes: 8, tipo: "colaborador", tipoViolacao: "Intrajornada" },
  { colaborador: "Rodrigo Alves Costa", posto: "Terminal Oeste", violacoes: 7, tipo: "colaborador", tipoViolacao: "Intrajornada" },
];

export const topViolacoesIntrajornadaPosto: ViolacaoTAC[] = [
  { colaborador: "Vigilância 24h - Shopping Plaza", violacoes: 31, tipo: "posto", tipoViolacao: "Intrajornada" },
  { colaborador: "Portaria Leste - Indústria ABC", violacoes: 27, tipo: "posto", tipoViolacao: "Intrajornada" },
  { colaborador: "Recepção Comercial - Banco Central", violacoes: 24, tipo: "posto", tipoViolacao: "Intrajornada" },
  { colaborador: "Controle Industrial - Tech Factory", violacoes: 21, tipo: "posto", tipoViolacao: "Intrajornada" },
  { colaborador: "Terminal Oeste - Aeroporto Norte", violacoes: 18, tipo: "posto", tipoViolacao: "Intrajornada" },
];

export const topViolacoesTrabalhoDSRColaborador: ViolacaoTAC[] = [
  { colaborador: "Sandra Oliveira Costa", posto: "Segurança Shopping", violacoes: 7, tipo: "colaborador", tipoViolacao: "Trabalho no DSR" },
  { colaborador: "Thiago Mendes Silva", posto: "Vigilância Hospital", violacoes: 6, tipo: "colaborador", tipoViolacao: "Trabalho no DSR" },
  { colaborador: "Vanessa Lima Santos", posto: "Portaria Industrial", violacoes: 6, tipo: "colaborador", tipoViolacao: "Trabalho no DSR" },
  { colaborador: "Wagner Souza Rocha", posto: "Controle Aeroporto", violacoes: 5, tipo: "colaborador", tipoViolacao: "Trabalho no DSR" },
  { colaborador: "Yasmin Castro Lima", posto: "Recepção Tech", violacoes: 5, tipo: "colaborador", tipoViolacao: "Trabalho no DSR" },
];

export const topViolacoesTrabalhoDSRPosto: ViolacaoTAC[] = [
  { colaborador: "Segurança Shopping - Shopping Center", violacoes: 19, tipo: "posto", tipoViolacao: "Trabalho no DSR" },
  { colaborador: "Vigilância Hospital - Hospital Regional", violacoes: 17, tipo: "posto", tipoViolacao: "Trabalho no DSR" },
  { colaborador: "Portaria Industrial - Indústria Tech", violacoes: 15, tipo: "posto", tipoViolacao: "Trabalho no DSR" },
  { colaborador: "Controle Aeroporto - Aeroporto Internacional", violacoes: 13, tipo: "posto", tipoViolacao: "Trabalho no DSR" },
  { colaborador: "Recepção Tech - Tech Campus", violacoes: 11, tipo: "posto", tipoViolacao: "Trabalho no DSR" },
];

export const topViolacoesIntervaloDSRColaborador: ViolacaoTAC[] = [
  { colaborador: "Alberto Costa Silva", posto: "Portaria Central", violacoes: 8, tipo: "colaborador", tipoViolacao: "Intervalo DSR" },
  { colaborador: "Beatriz Lima Rocha", posto: "Vigilância Comercial", violacoes: 7, tipo: "colaborador", tipoViolacao: "Intervalo DSR" },
  { colaborador: "Cristiano Souza Santos", posto: "Recepção Industrial", violacoes: 6, tipo: "colaborador", tipoViolacao: "Intervalo DSR" },
  { colaborador: "Daniela Ferreira Costa", posto: "Controle Porto", violacoes: 6, tipo: "colaborador", tipoViolacao: "Intervalo DSR" },
  { colaborador: "Eduardo Alves Lima", posto: "Terminal Central", violacoes: 5, tipo: "colaborador", tipoViolacao: "Intervalo DSR" },
];

export const topViolacoesIntervaloDSRPosto: ViolacaoTAC[] = [
  { colaborador: "Portaria Central - Tech Plaza", violacoes: 22, tipo: "posto", tipoViolacao: "Intervalo DSR" },
  { colaborador: "Vigilância Comercial - Centro Empresarial", violacoes: 20, tipo: "posto", tipoViolacao: "Intervalo DSR" },
  { colaborador: "Recepção Industrial - Complexo Industrial", violacoes: 17, tipo: "posto", tipoViolacao: "Intervalo DSR" },
  { colaborador: "Controle Porto - Porto Comercial", violacoes: 15, tipo: "posto", tipoViolacao: "Intervalo DSR" },
  { colaborador: "Terminal Central - Rodoviária Central", violacoes: 13, tipo: "posto", tipoViolacao: "Intervalo DSR" },
];
