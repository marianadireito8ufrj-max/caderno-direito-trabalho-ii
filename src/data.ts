export type Bloco =
  | { tipo: "secao"; texto: string }
  | { tipo: "subsecao"; texto: string }
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "nota"; titulo?: string; texto: string }
  | { tipo: "exercicio"; titulo: string; enunciado: string; itens: string[] };

export type Aula = {
  numero: number;
  titulo: string;
  meta: string;
  publicada: boolean;
  blocos: Bloco[];
};

// Será preenchido apenas quando a URL da fonte estiver verificada.
export const fonteGoogleDocs = "";

export const aulas: Aula[] = [
  {
    numero: 1,
    titulo: "Introdução e apresentação da ementa",
    meta: "Prof.º Ivan Simões • professorivangarcia@gmail.com • Data: 13 / 08 / 2026",
    publicada: true,
    blocos: [
      { tipo: "secao", texto: "1. Metodologia" },
      { tipo: "subsecao", texto: "1.1 Metodologia" },
      { tipo: "subsecao", texto: "1.2 Avaliação" },
      {
        tipo: "paragrafo",
        texto: "As avaliações buscam dois tipos de habilidades: a de argumentar, de fundamentar, criativa em um certo sentido pois não se tem uma resposta concreta na doutrina e nem na jurisprudência, sem resposta fácil no direito. O professor avalia a capacidade argumentativa de criar fundamentação bem como a capacidade de análise que é diferente da capacidade de síntese, por isso, o aluno deve decompor de forma sistemática os temas todos os elementos fáticos daquele caso. Ambas essas capacidades são de certa forma deixadas de lado no curso do direito e por isso o professor leva em consideração essa forma de avaliação.",
      },
      { tipo: "subsecao", texto: "1.3 Bibliografia" },
      {
        tipo: "paragrafo",
        texto: "mantemos a indicação do curso de “Direito do Trabalho” do Maurício Godinho Delgado",
      },
      { tipo: "subsecao", texto: "1.4 Programa" },
      {
        tipo: "paragrafo",
        texto: "geralmente os dois primeiros pontos para a P1 e os dois outros pontos para a P2",
      },
      {
        tipo: "lista",
        itens: ["Jornada", "Remuneração", "Interrupção/Suspensão/Alteração", "Extinção"],
      },
      { tipo: "secao", texto: "2. Início da matéria" },
      { tipo: "subsecao", texto: "2.1 Jornada de Trabalho (Tempo de Trabalho)" },
      {
        tipo: "paragrafo",
        texto: "A regulação do tempo de trabalho se justifica em virtude de três fundamentos, que vão regular a jornada no sentido de impor um limite de trabalho em determinado período de tempo.",
      },
      {
        tipo: "paragrafo",
        texto: "O primeiro fundamento é o biológico, a preservação,o respeito à saúde física e psicológica do trabalhador.",
      },
      {
        tipo: "paragrafo",
        texto: "Se o trabalho é um elemento humanizador ele também desumaniza, ele também aliena e causa um estranhamento, porque na sociedade capitalista quando você vende sua força de trabalho é por um tipo de sobrevivência. Quem não precisa trabalhar e coloca os outros para trabalhar não são alienados. O que se produz enquanto vendedor da força de trabalho não é do trabalhador.",
      },
      {
        tipo: "paragrafo",
        texto: "A TV Manchete fez um documentário chamado “Xingu, a Terra Mágica” que gravou as várias tribos na reserva do Xingu.",
      },
      {
        tipo: "nota",
        titulo: "Nota 1 · Xingu, a Terra Mágica",
        texto: "O aclamado documentário \\"Xingu, a Terra Mágica\\" foi uma série de dez a onze programas dirigida pelo jornalista e documentarista Washington Novaes, exibida originalmente pela extinta Rede Manchete em 1985. A obra marcou a televisão brasileira ao revelar o cotidiano, os mitos, os rituais e a organização social de povos indígenas do Parque Indígena do Xingu.",
      },
      {
        tipo: "paragrafo",
        texto: "Para o capitalismo a jornada será a base da reprodução do valor, o tempo de trabalho é o grande elemento fixo que existe em qualquer processo de trabalho e a grande referência da extração de valor do trabalho. O que o trabalhador produz tem um valor, mesmo que ele não faça o produto inteiro. Esse trabalho coletivo e social vai ter como critério de extração do valor, o tempo. O tempo é o mais importante da exploração do trabalho. As maiores brigas no direito do trabalho estão no dimensionamento do tempo. Na revolução industrial (1850) na europa que se industrializa não tinha jornada para a jornada, fora o limite físico/geológico (24h) o limite é dado pela exaustão do trabalhador.",
      },
      {
        tipo: "paragrafo",
        texto: "A saúde é um direito fundamental que tem como matriz a vida, logo não há sentido em vida sem saúde, afinal é um componente indissociável.",
      },
      {
        tipo: "nota",
        texto: "O caderno-base transcreve, neste ponto, dispositivos da Constituição Federal de 1988 relativos ao direito à saúde e ao SUS (arts. 196 a 200).",
      },
      {
        tipo: "paragrafo",
        texto: "Qual o efeito prático desse movimento de constitucionalização do direito do trabalho?",
      },
      {
        tipo: "paragrafo",
        texto: "O direito tutelar coletivo do trabalho une a proteção coletiva das regras sindicais e a salvaguarda de interesses gerais da categoria profissional. Ele abrange normas de segurança, saúde ocupacional, meio ambiente de trabalho e a defesa de direitos difusos, coletivos e individuais homogêneos por meio de negociações e atuação coletiva.",
      },
      { tipo: "paragrafo", texto: "Dano coletivo. Ex: Pílula Microvlar" },
      { tipo: "paragrafo", texto: "Dano difuso (relação fática)" },
      {
        tipo: "paragrafo",
        texto: "O segundo fundamento é o social, eu limito a duração do trabalho para o humano ter algum tipo de sociabilidade fora do trabalho, dimensão existencial humana. Sua singularidade é formada a partir da interação com os outros. O que define os limites do que eu sou são os relacionamentos com os outros.",
      },
      { tipo: "paragrafo", texto: "Trabalho da multidão que é voluntario" },
      {
        tipo: "nota",
        titulo: "Nota 3 · Trabalho da multidão",
        texto: "O \\"trabalho da multidão\\" (ou o trabalho do comum) é um conceito da filosofia política e sociologia (associado a autores como Toni Negri e Michael Hardt) que define a produção social realizada de forma coletiva e difusa pela sociedade, além das corporações ou empregos tradicionais",
      },
    ],
  },
  {
    numero: 2,
    titulo: "Jornada de Trabalho (continuação)",
    meta: "Prof.º Ivan Simões • Data: 18 / 08 / 2026",
    publicada: true,
    blocos: [
      { tipo: "secao", texto: "1. Jornada de trabalho" },
      { tipo: "subsecao", texto: "1.1 Fundamentos da limitação da duração do trabalho" },
      { tipo: "subsecao", texto: "1.1.1 Fundamentos teóricos" },
      { tipo: "lista", itens: ["Biológicos", "Sociais", "Econômicos"] },
      { tipo: "subsecao", texto: "1.1.2 Fundamentos legais" },
      {
        tipo: "lista",
        itens: [
          "Convenção nº 01 da OIT (1919) - veio para limitar a jornada de trabalho em 08 horas por dia",
          "Constituição Federal, art. 7º, XIII e XVI",
          "CLT, art. 58 e ss.",
          "Filme “Carne e Osso” - fazer a resenha no dia da prova - 1pt extra na prova - pode ser digitado - 1",
          "Seminário Internacional do CIRT (25/08 - 3ª Feira - 18h30 às 20h10 - Segunda Mesa - professora da UBA depois a mesa do ministro do TST) - resenha a ser entregue no dia da prova - 1 pt extra na prova",
        ],
      },
    ],
  },
  {
    numero: 3,
    titulo: "Jornada de Trabalho (finalização)",
    meta: "Prof.º Ivan Simões • Data: 27 / 08 / 2026",
    publicada: true,
    blocos: [
      { tipo: "secao", texto: "1. Os que não são abrangidos" },
      { tipo: "subsecao", texto: "1.1 Art. 62, CLT" },
      { tipo: "paragrafo", texto: "[Anotações da aula]" },
      { tipo: "subsecao", texto: "1.1.1 [Subdivisão]" },
      { tipo: "paragrafo", texto: "[Anotações complementares]" },
    ],
  },
  {
    numero: 4,
    titulo: "Prorrogação da Jornada",
    meta: "Prof.º Ivan Simões • Data: 03 / 09 / 2026",
    publicada: true,
    blocos: [
      { tipo: "secao", texto: "1. Horas Extraordinárias - Art. 7º, XVI, CF" },
      { tipo: "subsecao", texto: "1.1 Ajuste bilateral - Art. 59" },
      { tipo: "subsecao", texto: "1.2 Necessidade Imperiosa - Art. 61" },
      { tipo: "paragrafo", texto: "[Anotações da aula]" },
      { tipo: "secao", texto: "2. Compensação - Art. 7º, XIII, CF" },
      { tipo: "subsecao", texto: "2.1 Ajuste bilateral - Art. 59" },
      { tipo: "subsecao", texto: "2.2 Banco de Horas - Art. 59 §§ 2º - Lei 9601/98 e MP 2164-41/01 | 5º e 6º" },
      { tipo: "paragrafo", texto: "[Anotações da aula]" },
    ],
  },
  {
    numero: 5,
    titulo: "Em preparação",
    meta: "",
    publicada: false,
    blocos: [],
  },
  {
    numero: 6,
    titulo: "Férias (finalização)",
    meta: "Prof.º Ivan Simões • Data: 15 / 09 / 2026",
    publicada: true,
    blocos: [
      { tipo: "secao", texto: "Referências iniciais" },
      { tipo: "lista", itens: ["Art. 7º", "Art. 130 e ss., CLT"] },
      { tipo: "secao", texto: "1. Período aquisitivo" },
      { tipo: "subsecao", texto: "1.1 Aquisição do direito" },
      { tipo: "lista", itens: ["Interrupção do contrato", "Remuneração"] },
      { tipo: "subsecao", texto: "1.2 Causas obstativas da aquisição do direito" },
      { tipo: "lista", itens: ["Parciais - 130", "Totais - 133"] },
      { tipo: "secao", texto: "2. Período concessivo" },
      { tipo: "lista", itens: ["Prazo", "Sanção", "Procedimentos concessivos"] },
      {
        tipo: "exercicio",
        titulo: "Exercício · Férias de Severino",
        enunciado: "Severino foi admitido no dia 05/05/2020 e demitido no dia 15/09/2026 e nunca recebeu nada e nem gozou nada a título de férias, quais são e quantos são os direitos de férias que ele vai pedir.",
        itens: [
          "A partir de 05/05/2021 começa a contar o período aquisitivo, a empresa teria até o dia 05/04/2022 para conceder (1º férias); - dobra",
          "05/05/2023 (2ª férias) - dobra",
          "05/05/2024 (3ª férias) - dobra",
          "05/05/2025 (4ª férias) - dobra",
          "05/05/2026 (5ª férias) - dobra",
        ],
      },
    ],
  },
  ...Array.from({ length: 10 }, (_, index) => ({
    numero: index + 7,
    titulo: "Em preparação",
    meta: "",
    publicada: false,
    blocos: [] as Bloco[],
  })),
];
