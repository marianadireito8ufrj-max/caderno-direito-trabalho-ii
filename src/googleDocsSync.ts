import type { Aula, Bloco } from "./data";

type SyncPayload = {
  html: string;
  fetchedAt: string;
};

export type ResultadoSincronizacao = {
  aulas: Aula[];
  fetchedAt: string;
};

const PLACEHOLDER =
  /\[(?:Título da aula|Tópico principal|Subtópico|Anotações da aula|Subdivisão|Anotações complementares)\]|_{4,}/i;

function limparTexto(texto: string) {
  return texto.replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").trim();
}

function temDataPreenchida(meta: string) {
  return /Data:\s*\d{1,2}\s*\/\s*\d{1,2}\s*\/\s*\d{4}/i.test(meta);
}

function tipoDoElemento(elemento: Element) {
  return elemento.tagName.toLowerCase();
}

function extrairBlocos(elementos: Element[]): Bloco[] {
  const blocos: Bloco[] = [];
  let listaAtual: string[] = [];
  let exercicioAtual: Extract<Bloco, { tipo: "exercicio" }> | null = null;

  const fecharLista = () => {
    if (listaAtual.length) {
      blocos.push({ tipo: "lista", itens: listaAtual });
      listaAtual = [];
    }
  };

  const fecharExercicio = () => {
    if (exercicioAtual) {
      blocos.push(exercicioAtual);
      exercicioAtual = null;
    }
  };

  for (const elemento of elementos) {
    const texto = limparTexto(elemento.textContent ?? "");
    if (!texto || PLACEHOLDER.test(texto)) continue;

    const tipo = tipoDoElemento(elemento);

    if (tipo !== "li") fecharLista();

    if (tipo === "h2") {
      fecharExercicio();
      blocos.push({ tipo: "secao", texto });
      continue;
    }

    if (tipo === "h3") {
      fecharExercicio();
      blocos.push({ tipo: "subsecao", texto });
      continue;
    }

    if (tipo === "li") {
      fecharExercicio();
      listaAtual.push(texto);
      continue;
    }

    if (/^Exercício\s*:/i.test(texto)) {
      fecharExercicio();
      exercicioAtual = {
        tipo: "exercicio",
        titulo: "Exercício",
        enunciado: texto.replace(/^Exercício\s*:\s*/i, ""),
        itens: [],
      };
      continue;
    }

    if (
      exercicioAtual &&
      (/^A partir de\b/i.test(texto) || /^\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4}/.test(texto))
    ) {
      exercicioAtual.itens.push(texto);
      continue;
    }

    fecharExercicio();

    if (/^Nota(?:\s+\d+)?\s*[:·-]/i.test(texto)) {
      const [titulo, ...resto] = texto.split(/[:·-]/);
      blocos.push({
        tipo: "nota",
        titulo: limparTexto(titulo),
        texto: limparTexto(resto.join(" ")),
      });
      continue;
    }

    blocos.push({ tipo: "paragrafo", texto });
  }

  fecharLista();
  fecharExercicio();

  return blocos;
}

export function interpretarGoogleDocs(html: string, fallback: Aula[]): Aula[] {
  const documento = new DOMParser().parseFromString(html, "text/html");
  const elementos = Array.from(documento.body.querySelectorAll("h1,h2,h3,p,li")).filter(
    (elemento) => !(elemento.tagName.toLowerCase() === "p" && elemento.closest("li")),
  );

  const marcadores = elementos
    .map((elemento, indice) => {
      const texto = limparTexto(elemento.textContent ?? "");
      const match = texto.match(/^AULA\s+(\d{1,2})$/i);
      return match ? { indice, numero: Number(match[1]) } : null;
    })
    .filter((item): item is { indice: number; numero: number } => Boolean(item));

  if (!marcadores.length) {
    throw new Error("Nenhuma aula foi identificada no Google Docs.");
  }

  const encontradas = new Map<number, Aula>();

  marcadores.forEach((marcador, posicao) => {
    const proximoIndice = marcadores[posicao + 1]?.indice ?? elementos.length;
    const trecho = elementos.slice(marcador.indice + 1, proximoIndice);

    const indiceTitulo = trecho.findIndex(
      (elemento) =>
        tipoDoElemento(elemento) === "h1" && limparTexto(elemento.textContent ?? "").length > 0,
    );

    const titulo =
      indiceTitulo >= 0 ? limparTexto(trecho[indiceTitulo].textContent ?? "") : "Em preparação";

    const indiceMeta = trecho.findIndex((elemento, indice) => {
      if (indiceTitulo >= 0 && indice <= indiceTitulo) return false;
      const texto = limparTexto(elemento.textContent ?? "");
      return /Prof\.?º?\s+Ivan\s+Simões/i.test(texto) && /Data:/i.test(texto);
    });

    const meta = indiceMeta >= 0 ? limparTexto(trecho[indiceMeta].textContent ?? "") : "";

    const inicioConteudo = Math.max(indiceTitulo, indiceMeta) + 1;
    const elementosConteudo = trecho.slice(Math.max(0, inicioConteudo));
    const textoCompleto = [titulo, meta, ...elementosConteudo.map((el) => el.textContent ?? "")]
      .map(limparTexto)
      .join("\n");

    const publicada =
      titulo !== "Em preparação" &&
      !PLACEHOLDER.test(textoCompleto) &&
      temDataPreenchida(meta) &&
      elementosConteudo.some((elemento) => limparTexto(elemento.textContent ?? "").length > 0);

    encontradas.set(marcador.numero, {
      numero: marcador.numero,
      titulo,
      meta,
      publicada,
      blocos: publicada ? extrairBlocos(elementosConteudo) : [],
    });
  });

  const maiorNumero = Math.max(
    16,
    ...fallback.map((aula) => aula.numero),
    ...Array.from(encontradas.keys()),
  );

  return Array.from({ length: maiorNumero }, (_, indice) => {
    const numero = indice + 1;
    const encontrada = encontradas.get(numero);
    if (encontrada) return encontrada;

    const anterior = fallback.find((aula) => aula.numero === numero);
    return (
      anterior ?? {
        numero,
        titulo: "Em preparação",
        meta: "",
        publicada: false,
        blocos: [],
      }
    );
  });
}

export async function sincronizarGoogleDocs(fallback: Aula[]): Promise<ResultadoSincronizacao> {
  const response = await fetch("/api/google-docs", {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Não foi possível atualizar pelo Google Docs.");
  }

  const payload = (await response.json()) as SyncPayload;

  return {
    aulas: interpretarGoogleDocs(payload.html, fallback),
    fetchedAt: payload.fetchedAt,
  };
}
