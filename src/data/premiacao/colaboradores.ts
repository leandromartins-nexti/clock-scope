/**
 * Mock dataset — Premiação de Colaboradores
 *
 * Score Composto = média ponderada de 5 pilares (0-100):
 *  - Qualidade do Ponto         (peso 25)
 *  - Absenteísmo (inverso)      (peso 25)
 *  - Tratativa (rapidez)        (peso 20)
 *  - Pontualidade               (peso 15)
 *  - Permanência (tempo casa)   (peso 15)
 *
 * Critério de elegibilidade: nenhum (ranking puro por score).
 */

export const PILAR_PESOS = {
  ponto: 25,
  absenteismo: 25,
  tratativa: 20,
  pontualidade: 15,
  permanencia: 15,
} as const;

export interface ColaboradorPremiacao {
  id: string;
  nome: string;
  matricula: string;
  empresa: string;
  unidade: string;
  area: string;
  cargo: string;
  tempoCasaMeses: number;
  // Pilares (0-100, todos no sentido "maior é melhor")
  scorePonto: number;
  scoreAbsenteismo: number;
  scoreTratativa: number;
  scorePontualidade: number;
  scorePermanencia: number;
  // Métricas brutas (para tooltips)
  taxaAbsenteismo: number; // %
  marcacoesCorretas: number; // %
  tempoTratativaDias: number;
  atrasosUltMes: number;
}

const NOMES = [
  "Ana Carolina Silva", "Bruno Henrique Souza", "Camila Rocha Lima", "Diego Fernandes Alves",
  "Eduarda Martins Costa", "Felipe Augusto Ramos", "Gabriela Pereira Nunes", "Henrique Borges Castro",
  "Isabela Cristina Moreira", "João Vitor Cardoso", "Kaique Oliveira Dias", "Larissa Mendes Faria",
  "Marcelo Antunes Ribeiro", "Natália Vieira Gomes", "Otávio Rezende Pinto", "Patrícia Lopes Teixeira",
  "Quésia Barbosa Freitas", "Rafael Monteiro Barros", "Sabrina Carvalho Reis", "Thiago Almeida Cunha",
  "Ursula Nogueira Pacheco", "Vinícius Tavares Coelho", "Wagner Siqueira Machado", "Xênia Duarte Antunes",
  "Yago Bittencourt Prado", "Zaira Camargo Magalhães", "Adriano Bernardes Pires", "Beatriz Galvão Sales",
  "Caio Brandão Tavora", "Daniela Esteves Lyra", "Elias Fontana Mascarenhas", "Fernanda Guedes Vasques",
  "Gustavo Hilário Macedo", "Helena Iglesias Bastos", "Igor Junqueira Camões", "Juliana Klein Rezende",
  "Kléber Lacerda Vidal", "Letícia Maranhão Sales", "Murilo Negrão Telles", "Nathália Ortega Vargas",
  "Otaviano Paes Rosa", "Priscila Quaresma Sá", "Ricardo Sales Tomé", "Simone Tunes Uchoa",
  "Tales Ulisses Vilar", "Vânia Weber Xavier", "Wesley Yago Zenker", "Ximena Almeida Branco",
  "Yara Caldas Domingues", "Zeca Estrela Faro",
];

const EMPRESAS = ["VIG EYES SUL", "VIG EYES NORDESTE", "VIG EYES CENTRO"];
const UNIDADES = ["UN-Curitiba", "UN-Recife", "UN-Brasília", "UN-Salvador", "UN-Porto Alegre"];
const AREAS = ["Patrimonial", "Eventos", "Escolta", "Portaria", "Monitoramento"];
const CARGOS = ["Vigilante", "Vigilante Líder", "Supervisor", "Inspetor", "Operador CFTV"];

function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

export function computeScoreComposto(c: ColaboradorPremiacao): number {
  const total =
    (c.scorePonto * PILAR_PESOS.ponto +
      c.scoreAbsenteismo * PILAR_PESOS.absenteismo +
      c.scoreTratativa * PILAR_PESOS.tratativa +
      c.scorePontualidade * PILAR_PESOS.pontualidade +
      c.scorePermanencia * PILAR_PESOS.permanencia) /
    (PILAR_PESOS.ponto +
      PILAR_PESOS.absenteismo +
      PILAR_PESOS.tratativa +
      PILAR_PESOS.pontualidade +
      PILAR_PESOS.permanencia);
  return Math.round(total * 10) / 10;
}

function buildColaborador(i: number): ColaboradorPremiacao {
  const r1 = seeded(i + 1);
  const r2 = seeded(i + 137);
  const r3 = seeded(i + 421);
  const r4 = seeded(i + 733);
  const r5 = seeded(i + 991);
  const r6 = seeded(i + 1543);
  const r7 = seeded(i + 2017);

  // Garante distribuição realista — alguns excelentes, maioria boa, poucos críticos
  const bias = i < 8 ? 25 : i < 25 ? 12 : i < 60 ? 0 : -15;

  const scorePonto = clamp(70 + bias + (r1 - 0.5) * 30);
  const scoreAbsenteismo = clamp(72 + bias + (r2 - 0.5) * 28);
  const scoreTratativa = clamp(68 + bias + (r3 - 0.5) * 32);
  const scorePontualidade = clamp(75 + bias + (r4 - 0.5) * 25);
  const scorePermanencia = clamp(60 + bias + (r5 - 0.5) * 40);

  const taxaAbsenteismo = +(((100 - scoreAbsenteismo) * 0.18) + r6 * 0.5).toFixed(2);
  const marcacoesCorretas = +(scorePonto + r7 * 2).toFixed(1);
  const tempoTratativaDias = +((100 - scoreTratativa) * 0.08 + 0.5).toFixed(1);
  const atrasosUltMes = Math.round((100 - scorePontualidade) * 0.15);
  const tempoCasaMeses = Math.round(scorePermanencia * 1.2 + r5 * 24);

  const nome = NOMES[i % NOMES.length];
  return {
    id: `col-${String(i + 1).padStart(3, "0")}`,
    nome,
    matricula: `M${String(48000 + i).padStart(5, "0")}`,
    empresa: EMPRESAS[i % EMPRESAS.length],
    unidade: UNIDADES[i % UNIDADES.length],
    area: AREAS[i % AREAS.length],
    cargo: CARGOS[i % CARGOS.length],
    tempoCasaMeses,
    scorePonto: Math.round(scorePonto * 10) / 10,
    scoreAbsenteismo: Math.round(scoreAbsenteismo * 10) / 10,
    scoreTratativa: Math.round(scoreTratativa * 10) / 10,
    scorePontualidade: Math.round(scorePontualidade * 10) / 10,
    scorePermanencia: Math.round(scorePermanencia * 10) / 10,
    taxaAbsenteismo: Math.max(0, taxaAbsenteismo),
    marcacoesCorretas: Math.min(100, marcacoesCorretas),
    tempoTratativaDias,
    atrasosUltMes,
  };
}

export const colaboradoresPremiacao: ColaboradorPremiacao[] = Array.from({ length: 120 }, (_, i) =>
  buildColaborador(i),
);

export type PilarKey = "geral" | "ponto" | "absenteismo" | "tratativa" | "pontualidade" | "permanencia";

export const PILAR_LABELS: Record<PilarKey, string> = {
  geral: "Score Geral",
  ponto: "Qualidade do Ponto",
  absenteismo: "Assiduidade",
  tratativa: "Tratativa Rápida",
  pontualidade: "Pontualidade",
  permanencia: "Permanência",
};

export function getColaboradorScore(c: ColaboradorPremiacao, pilar: PilarKey): number {
  switch (pilar) {
    case "ponto": return c.scorePonto;
    case "absenteismo": return c.scoreAbsenteismo;
    case "tratativa": return c.scoreTratativa;
    case "pontualidade": return c.scorePontualidade;
    case "permanencia": return c.scorePermanencia;
    case "geral":
    default: return computeScoreComposto(c);
  }
}

export function rankColaboradores(pilar: PilarKey): (ColaboradorPremiacao & { scoreFinal: number; rank: number })[] {
  return colaboradoresPremiacao
    .map(c => ({ ...c, scoreFinal: getColaboradorScore(c, pilar) }))
    .sort((a, b) => b.scoreFinal - a.scoreFinal)
    .map((c, i) => ({ ...c, rank: i + 1 }));
}
