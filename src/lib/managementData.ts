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
  coberturaDiaPercentual: number;
}

export const operationalOverview: OperationalOverview = {
  qtdVagas: 1250,
  qtdColaboradoresEfetivos: 1180,
  qtdPresentes: 1042,
  qtdPossiveisFaltantes: 23,
  qtdAusentes: 87,
  qtdFerias: 51,
  coberturasDia: 15,
  coberturaDiaPercentual: 95.13,
};

export interface CoberturaPorHora {
  hora: string;
  colaboradores: number;
  coberturaPercentual: number;
  possivelmenteFaltantes: string[];
}

export const coberturaPorHora: CoberturaPorHora[] = [
  { hora: "00h00", colaboradores: 12, coberturaPercentual: 85.71, possivelmenteFaltantes: ["João Silva", "Maria Santos"] },
  { hora: "01h00", colaboradores: 12, coberturaPercentual: 85.71, possivelmenteFaltantes: ["Pedro Costa"] },
  { hora: "02h00", colaboradores: 11, coberturaPercentual: 78.57, possivelmenteFaltantes: ["Ana Oliveira", "Carlos Souza"] },
  { hora: "03h00", colaboradores: 11, coberturaPercentual: 78.57, possivelmenteFaltantes: ["Fernanda Lima"] },
  { hora: "04h00", colaboradores: 15, coberturaPercentual: 107.14, possivelmenteFaltantes: [] },
  { hora: "05h00", colaboradores: 18, coberturaPercentual: 128.57, possivelmenteFaltantes: [] },
  { hora: "06h00", colaboradores: 45, coberturaPercentual: 321.43, possivelmenteFaltantes: [] },
  { hora: "07h00", colaboradores: 52, coberturaPercentual: 371.43, possivelmenteFaltantes: [] },
  { hora: "08h00", colaboradores: 48, coberturaPercentual: 342.86, possivelmenteFaltantes: [] },
  { hora: "09h00", colaboradores: 51, coberturaPercentual: 364.29, possivelmenteFaltantes: [] },
  { hora: "10h00", colaboradores: 50, coberturaPercentual: 357.14, possivelmenteFaltantes: [] },
  { hora: "11h00", colaboradores: 49, coberturaPercentual: 350.00, possivelmenteFaltantes: [] },
  { hora: "12h00", colaboradores: 47, coberturaPercentual: 335.71, possivelmenteFaltantes: [] },
  { hora: "13h00", colaboradores: 52, coberturaPercentual: 371.43, possivelmenteFaltantes: [] },
  { hora: "14h00", colaboradores: 53, coberturaPercentual: 203.85, possivelmenteFaltantes: [] },
  { hora: "15h00", colaboradores: 51, coberturaPercentual: 196.15, possivelmenteFaltantes: [] },
  { hora: "16h00", colaboradores: 50, coberturaPercentual: 192.31, possivelmenteFaltantes: [] },
  { hora: "17h00", colaboradores: 48, coberturaPercentual: 184.62, possivelmenteFaltantes: ["Lucas Ferreira"] },
  { hora: "18h00", colaboradores: 35, coberturaPercentual: 134.62, possivelmenteFaltantes: ["Juliana Alves", "Roberto Dias"] },
  { hora: "19h00", colaboradores: 28, coberturaPercentual: 107.69, possivelmenteFaltantes: ["Patrícia Rocha"] },
  { hora: "20h00", colaboradores: 22, coberturaPercentual: 84.62, possivelmenteFaltantes: ["Ricardo Mendes", "Camila Castro"] },
  { hora: "21h00", colaboradores: 18, coberturaPercentual: 69.23, possivelmenteFaltantes: ["Bruno Cardoso", "Larissa Moura", "Diego Ribeiro"] },
  { hora: "22h00", colaboradores: 15, coberturaPercentual: 57.69, possivelmenteFaltantes: ["Amanda Correia", "Gabriel Martins"] },
  { hora: "23h00", colaboradores: 13, coberturaPercentual: 50.00, possivelmenteFaltantes: ["Tatiana Lopes", "Felipe Barros", "Renata Pires"] },
];

export interface CoberturaDiaria {
  dia: number;
  coberturaPercentual: number;
}

export const coberturaDiariaMensal: CoberturaDiaria[] = [
  { dia: 1, coberturaPercentual: 92.5 },
  { dia: 2, coberturaPercentual: 95.8 },
  { dia: 3, coberturaPercentual: 88.3 },
  { dia: 4, coberturaPercentual: 91.2 },
  { dia: 5, coberturaPercentual: 96.7 },
  { dia: 6, coberturaPercentual: 94.1 },
  { dia: 7, coberturaPercentual: 89.5 },
  { dia: 8, coberturaPercentual: 97.2 },
  { dia: 9, coberturaPercentual: 93.8 },
  { dia: 10, coberturaPercentual: 90.4 },
  { dia: 11, coberturaPercentual: 85.6 },
  { dia: 12, coberturaPercentual: 91.9 },
  { dia: 13, coberturaPercentual: 96.3 },
  { dia: 14, coberturaPercentual: 94.7 },
  { dia: 15, coberturaPercentual: 87.2 },
  { dia: 16, coberturaPercentual: 92.8 },
  { dia: 17, coberturaPercentual: 95.4 },
  { dia: 18, coberturaPercentual: 89.1 },
  { dia: 19, coberturaPercentual: 93.5 },
  { dia: 20, coberturaPercentual: 96.9 },
  { dia: 21, coberturaPercentual: 91.6 },
  { dia: 22, coberturaPercentual: 88.7 },
  { dia: 23, coberturaPercentual: 94.2 },
  { dia: 24, coberturaPercentual: 97.5 },
  { dia: 25, coberturaPercentual: 90.8 },
  { dia: 26, coberturaPercentual: 93.1 },
  { dia: 27, coberturaPercentual: 95.6 },
  { dia: 28, coberturaPercentual: 89.9 },
];

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

// Cobertura vs Necessidade - Semanal
export interface CoberturaVsNecessidadeDia {
  dia: number;
  cobertura: number;
  necessidade: number;
}

export const coberturaVsNecessidadeSemanal: CoberturaVsNecessidadeDia[] = [
  { dia: 1, cobertura: 245, necessidade: 260 },
  { dia: 2, cobertura: 268, necessidade: 260 },
  { dia: 3, cobertura: 255, necessidade: 260 },
  { dia: 4, cobertura: 272, necessidade: 260 },
  { dia: 5, cobertura: 260, necessidade: 260 },
  { dia: 6, cobertura: 238, necessidade: 260 },
  { dia: 7, cobertura: 195, necessidade: 210 },
];

// Cobertura vs Necessidade - Heatmap (Hora x Dia)
export interface CoberturaHeatmapData {
  hora: string;
  dias: {
    dia: number;
    cobertura: number;
    necessidade: number;
  }[];
}

export const coberturaHeatmapSemanal: CoberturaHeatmapData[] = [
  {
    hora: "06h",
    dias: [
      { dia: 1, cobertura: 45, necessidade: 50 },
      { dia: 2, cobertura: 52, necessidade: 50 },
      { dia: 3, cobertura: 48, necessidade: 50 },
      { dia: 4, cobertura: 50, necessidade: 50 },
      { dia: 5, cobertura: 47, necessidade: 50 },
      { dia: 6, cobertura: 43, necessidade: 50 },
      { dia: 7, cobertura: 38, necessidade: 40 },
    ],
  },
  {
    hora: "08h",
    dias: [
      { dia: 1, cobertura: 48, necessidade: 52 },
      { dia: 2, cobertura: 55, necessidade: 52 },
      { dia: 3, cobertura: 52, necessidade: 52 },
      { dia: 4, cobertura: 54, necessidade: 52 },
      { dia: 5, cobertura: 52, necessidade: 52 },
      { dia: 6, cobertura: 47, necessidade: 52 },
      { dia: 7, cobertura: 39, necessidade: 42 },
    ],
  },
  {
    hora: "10h",
    dias: [
      { dia: 1, cobertura: 50, necessidade: 54 },
      { dia: 2, cobertura: 58, necessidade: 54 },
      { dia: 3, cobertura: 54, necessidade: 54 },
      { dia: 4, cobertura: 56, necessidade: 54 },
      { dia: 5, cobertura: 54, necessidade: 54 },
      { dia: 6, cobertura: 49, necessidade: 54 },
      { dia: 7, cobertura: 41, necessidade: 44 },
    ],
  },
  {
    hora: "12h",
    dias: [
      { dia: 1, cobertura: 47, necessidade: 50 },
      { dia: 2, cobertura: 52, necessidade: 50 },
      { dia: 3, cobertura: 50, necessidade: 50 },
      { dia: 4, cobertura: 53, necessidade: 50 },
      { dia: 5, cobertura: 50, necessidade: 50 },
      { dia: 6, cobertura: 45, necessidade: 50 },
      { dia: 7, cobertura: 37, necessidade: 40 },
    ],
  },
  {
    hora: "14h",
    dias: [
      { dia: 1, cobertura: 53, necessidade: 56 },
      { dia: 2, cobertura: 60, necessidade: 56 },
      { dia: 3, cobertura: 55, necessidade: 56 },
      { dia: 4, cobertura: 58, necessidade: 56 },
      { dia: 5, cobertura: 56, necessidade: 56 },
      { dia: 6, cobertura: 51, necessidade: 56 },
      { dia: 7, cobertura: 43, necessidade: 46 },
    ],
  },
  {
    hora: "16h",
    dias: [
      { dia: 1, cobertura: 50, necessidade: 52 },
      { dia: 2, cobertura: 55, necessidade: 52 },
      { dia: 3, cobertura: 52, necessidade: 52 },
      { dia: 4, cobertura: 54, necessidade: 52 },
      { dia: 5, cobertura: 52, necessidade: 52 },
      { dia: 6, cobertura: 47, necessidade: 52 },
      { dia: 7, cobertura: 40, necessidade: 42 },
    ],
  },
  {
    hora: "18h",
    dias: [
      { dia: 1, cobertura: 35, necessidade: 38 },
      { dia: 2, cobertura: 40, necessidade: 38 },
      { dia: 3, cobertura: 38, necessidade: 38 },
      { dia: 4, cobertura: 39, necessidade: 38 },
      { dia: 5, cobertura: 38, necessidade: 38 },
      { dia: 6, cobertura: 34, necessidade: 38 },
      { dia: 7, cobertura: 28, necessidade: 30 },
    ],
  },
  {
    hora: "20h",
    dias: [
      { dia: 1, cobertura: 22, necessidade: 26 },
      { dia: 2, cobertura: 28, necessidade: 26 },
      { dia: 3, cobertura: 25, necessidade: 26 },
      { dia: 4, cobertura: 27, necessidade: 26 },
      { dia: 5, cobertura: 26, necessidade: 26 },
      { dia: 6, cobertura: 23, necessidade: 26 },
      { dia: 7, cobertura: 18, necessidade: 20 },
    ],
  },
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

// Detalhamento de Colaboradores por Posto - Inconsistências
export const colaboradoresPorPostoInconsistencias: Record<string, Array<{ nome: string; inconsistencias: number }>> = {
  "Portaria Norte - Shopping ABC": [
    { nome: "João Silva Santos", inconsistencias: 87 },
    { nome: "Carlos Eduardo Souza", inconsistencias: 58 },
    { nome: "Roberto Alves Costa", inconsistencias: 51 },
    { nome: "Lucas Ferreira Silva", inconsistencias: 49 },
  ],
  "Vigilância Noturna - Banco Nacional": [
    { nome: "Pedro Henrique Lima", inconsistencias: 68 },
    { nome: "Ricardo Souza Oliveira", inconsistencias: 43 },
    { nome: "Bruno Costa Oliveira", inconsistencias: 42 },
    { nome: "Diego Santos Lima", inconsistencias: 45 },
  ],
  "Recepção Principal - Hospital": [
    { nome: "Maria Oliveira Costa", inconsistencias: 72 },
    { nome: "Fernanda Lima Santos", inconsistencias: 47 },
    { nome: "Amanda Silva Costa", inconsistencias: 38 },
    { nome: "Carla Mendes Santos", inconsistencias: 30 },
  ],
  "Controle de Acesso - Tech Park": [
    { nome: "Ana Paula Ferreira", inconsistencias: 61 },
    { nome: "Patrícia Rocha Silva", inconsistencias: 39 },
    { nome: "Gabriela Souza Costa", inconsistencias: 35 },
    { nome: "Henrique Alves Lima", inconsistencias: 30 },
  ],
  "Terminal Principal - Aeroporto": [
    { nome: "Roberto Alves Costa", inconsistencias: 51 },
    { nome: "Fábio Lima Santos", inconsistencias: 44 },
    { nome: "Eliana Rocha Silva", inconsistencias: 38 },
    { nome: "Iris Martins Rocha", inconsistencias: 20 },
  ],
  "Segurança Industrial - Indústria XYZ": [
    { nome: "Juliana Martins Rocha", inconsistencias: 54 },
    { nome: "Carlos Eduardo Souza", inconsistencias: 48 },
    { nome: "Pedro Henrique Lima", inconsistencias: 40 },
  ],
  "Gate Control - Porto Salvador": [
    { nome: "Fernanda Lima Santos", inconsistencias: 47 },
    { nome: "Ricardo Souza Oliveira", inconsistencias: 43 },
    { nome: "Lucas Ferreira Silva", inconsistencias: 38 },
  ],
  "Portaria Sul - Shopping XYZ": [
    { nome: "Carlos Eduardo Souza", inconsistencias: 58 },
    { nome: "João Silva Santos", inconsistencias: 35 },
    { nome: "Diego Santos Lima", inconsistencias: 22 },
  ],
  "Vigilância Patrimonial - Universidade": [
    { nome: "Ricardo Souza Oliveira", inconsistencias: 43 },
    { nome: "Bruno Costa Oliveira", inconsistencias: 34 },
    { nome: "Fábio Lima Santos", inconsistencias: 27 },
  ],
  "Acesso Principal - Órgão Público": [
    { nome: "Patrícia Rocha Silva", inconsistencias: 39 },
    { nome: "Henrique Alves Lima", inconsistencias: 31 },
    { nome: "Gabriela Souza Costa", inconsistencias: 22 },
  ],
};

// Detalhamento de Colaboradores por Posto - Atestados
export const colaboradoresPorPostoAtestados: Record<string, Array<{ nome: string; quantidade: number }>> = {
  "Portaria Principal - Shopping ABC": [
    { nome: "Lucas Ferreira Silva", quantidade: 12 },
    { nome: "Bruno Costa Oliveira", quantidade: 10 },
    { nome: "Diego Santos Lima", quantidade: 8 },
    { nome: "Carla Mendes Santos", quantidade: 9 },
    { nome: "Amanda Silva Costa", quantidade: 6 },
  ],
  "Recepção - Hospital São Lucas": [
    { nome: "Amanda Silva Costa", quantidade: 11 },
    { nome: "Carla Mendes Santos", quantidade: 9 },
    { nome: "Eliana Rocha Silva", quantidade: 7 },
    { nome: "Gabriela Souza Costa", quantidade: 6 },
    { nome: "Iris Martins Rocha", quantidade: 5 },
  ],
  "Vigilância - Banco Nacional": [
    { nome: "Bruno Costa Oliveira", quantidade: 10 },
    { nome: "Diego Santos Lima", quantidade: 8 },
    { nome: "Fábio Lima Santos", quantidade: 7 },
    { nome: "Henrique Alves Lima", quantidade: 7 },
  ],
  "Controle - Tech Park": [
    { nome: "Carla Mendes Santos", quantidade: 9 },
    { nome: "Lucas Ferreira Silva", quantidade: 8 },
    { nome: "Amanda Silva Costa", quantidade: 6 },
    { nome: "Gabriela Souza Costa", quantidade: 5 },
  ],
  "Terminal - Aeroporto Sul": [
    { nome: "Diego Santos Lima", quantidade: 8 },
    { nome: "Eliana Rocha Silva", quantidade: 7 },
    { nome: "Fábio Lima Santos", quantidade: 5 },
    { nome: "Iris Martins Rocha", quantidade: 4 },
  ],
};

// Detalhamento de Colaboradores por Posto - Ausências
export const colaboradoresPorPostoAusencias: Record<string, Array<{ nome: string; quantidade: number }>> = {
  "Terminal 2 - Aeroporto Sul": [
    { nome: "Eliana Rocha Silva", quantidade: 15 },
    { nome: "Fábio Lima Santos", quantidade: 14 },
    { nome: "Diego Santos Lima", quantidade: 12 },
    { nome: "Iris Martins Rocha", quantidade: 11 },
    { nome: "Lucas Ferreira Silva", quantidade: 15 },
  ],
  "Gate Control - Porto Salvador": [
    { nome: "Fábio Lima Santos", quantidade: 14 },
    { nome: "Henrique Alves Lima", quantidade: 12 },
    { nome: "Bruno Costa Oliveira", quantidade: 11 },
    { nome: "Carlos Eduardo Souza", quantidade: 10 },
    { nome: "Ricardo Souza Oliveira", quantidade: 11 },
  ],
  "Loja Centro - Rede Varejo": [
    { nome: "Gabriela Souza Costa", quantidade: 13 },
    { nome: "Amanda Silva Costa", quantidade: 11 },
    { nome: "Carla Mendes Santos", quantidade: 10 },
    { nome: "Eliana Rocha Silva", quantidade: 9 },
    { nome: "Iris Martins Rocha", quantidade: 8 },
  ],
  "Acesso Principal - Tech Park": [
    { nome: "Henrique Alves Lima", quantidade: 12 },
    { nome: "Gabriela Souza Costa", quantidade: 11 },
    { nome: "Fábio Lima Santos", quantidade: 10 },
    { nome: "Lucas Ferreira Silva", quantidade: 12 },
  ],
  "Prédio Anexo - Órgão Público": [
    { nome: "Iris Martins Rocha", quantidade: 11 },
    { nome: "Eliana Rocha Silva", quantidade: 10 },
    { nome: "Henrique Alves Lima", quantidade: 9 },
    { nome: "Gabriela Souza Costa", quantidade: 9 },
  ],
};

// ============================================
// PÁGINA 3: BANCO DE HORAS
// ============================================

export interface BancoHorasOverview {
  saldoPositivoTotal: number;
  saldoNegativoTotal: number;
  horasExtrasTotal: number;
}

export const bancoHorasOverview: BancoHorasOverview = {
  saldoPositivoTotal: 12500,
  saldoNegativoTotal: -3400,
  horasExtrasTotal: 8500,
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
