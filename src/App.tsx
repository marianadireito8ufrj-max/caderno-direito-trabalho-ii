import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { aulas, fonteGoogleDocs, type Bloco } from "./data";
import { sincronizarGoogleDocs } from "./googleDocsSync";

type Secao = { titulo: string; itens: Bloco[] };

const pastasDrive = [
  {
    nome: "PALESTRA CIRT - DESAFIOS CONTEMPORÂNEOS PARA O DIREITO DO TRABALHO - MESA 1 - 18h30",
    descricao: "Materiais relacionados à palestra e às atividades acadêmicas do CIRT.",
    url: "https://drive.google.com/drive/folders/1GU56EeakYhLWCUqFMs8MfN7xgE0ojONC",
  },
  {
    nome: "Ementa/programa do curso",
    descricao: "Ementa, programa e documentos gerais da disciplina.",
    url: "https://drive.google.com/drive/folders/1AtOUFhqEqHPjtYJD7z4w6YWXEewiiHpB",
  },
  {
    nome: "Anotações/Caderno 📝",
    descricao: "Caderno-base, anotações e documentos de apoio da disciplina.",
    url: "https://drive.google.com/drive/folders/1nDVIpgpZwPN89pSxnPbCVC97x08duXAc",
  },
  {
    nome: "Transcrições ⏳",
    descricao: "Transcrições das aulas, gravações e conteúdos relacionados.",
    url: "https://drive.google.com/drive/folders/1N6O0fXY-v2eiXG6572dudMzpmYaN2a1f",
  },
  {
    nome: "Caderno Digital 📝",
    descricao: "Pasta destinada aos materiais relacionados ao Caderno Digital.",
    url: "https://drive.google.com/drive/folders/1T-Nz6SFBorEr7RZ2DKdukUesPLRzBIaf",
  },
  {
    nome: "Doutrinas e material complementar_",
    descricao: "Doutrinas, artigos, textos e materiais acadêmicos complementares.",
    url: "https://drive.google.com/drive/folders/19tXUB9jC0Fs6h9LKnuU-RZr3dkZGbFzp",
  },
  {
    nome: "Gravações 🎤",
    descricao: "Gravações de aulas e outros registros em áudio.",
    url: "https://drive.google.com/drive/folders/1WZpu4dcK8Ovn1fwVHkO5nS0vcxQyDSBC",
  },
  {
    nome: "Provas antigas e listas de exercícios 🧾",
    descricao: "Provas anteriores, exercícios e materiais para revisão.",
    url: "https://drive.google.com/drive/folders/1Vk7uy3XQbdIDaQF8PJvRFtcjn2NbavHC",
  },
];

function agruparSecoes(blocos: Bloco[]): Secao[] {
  const secoes: Secao[] = [];
  let atual: Secao | null = null;

  for (const bloco of blocos) {
    if (bloco.tipo === "secao") {
      atual = { titulo: bloco.texto, itens: [] };
      secoes.push(atual);
      continue;
    }

    if (!atual) {
      atual = { titulo: "Notas da aula", itens: [] };
      secoes.push(atual);
    }

    atual.itens.push(bloco);
  }

  return secoes;
}

function ConteudoBloco({ item }: { item: Bloco }) {
  if (item.tipo === "subsecao") {
    return <h4>{item.texto}</h4>;
  }

  if (item.tipo === "lista") {
    return (
      <ul className="lesson-list">
        {item.itens.map((texto, indice) => (
          <li key={`${texto}-${indice}`}>{texto}</li>
        ))}
      </ul>
    );
  }

  if (item.tipo === "nota") {
    return (
      <details className="source-note">
        <summary>{item.titulo ?? "Nota do caderno-base"}</summary>
        <p>{item.texto}</p>
      </details>
    );
  }

  if (item.tipo === "exercicio") {
    return (
      <section className="exercise-card">
        <strong>{item.titulo}</strong>
        <p>{item.enunciado}</p>
        {item.itens.length > 0 && (
          <ol>
            {item.itens.map((texto, indice) => (
              <li key={`${texto}-${indice}`}>{texto}</li>
            ))}
          </ol>
        )}
      </section>
    );
  }

  return <p>{item.texto}</p>;
}

function horarioSincronizacao(valor: string | null) {
  if (!valor) return "";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function App() {
  const [aulasAtuais, setAulasAtuais] = useState(aulas);
  const publicadas = aulasAtuais.filter((item) => item.publicada);
  const [aulaSelecionada, setAulaSelecionada] = useState(
    aulas.find((item) => item.publicada)?.numero ?? 1,
  );
  const [sincronizando, setSincronizando] = useState(false);
  const [ultimaSincronizacao, setUltimaSincronizacao] = useState<string | null>(null);
  const [erroSincronizacao, setErroSincronizacao] = useState("");

  const atualizarPeloGoogleDocs = useCallback(async (silenciosa = false) => {
    if (!silenciosa) setSincronizando(true);

    try {
      const resultado = await sincronizarGoogleDocs(aulas);
      setAulasAtuais(resultado.aulas);
      setUltimaSincronizacao(resultado.fetchedAt);
      setErroSincronizacao("");
    } catch (erro) {
      setErroSincronizacao(
        erro instanceof Error
          ? erro.message
          : "Não foi possível atualizar pelo Google Docs neste momento.",
      );
    } finally {
      if (!silenciosa) setSincronizando(false);
    }
  }, []);

  useEffect(() => {
    void atualizarPeloGoogleDocs(true);

    const intervalo = window.setInterval(() => {
      void atualizarPeloGoogleDocs(true);
    }, 60_000);

    return () => window.clearInterval(intervalo);
  }, [atualizarPeloGoogleDocs]);

  const aula =
    aulasAtuais.find((item) => item.numero === aulaSelecionada && item.publicada) ??
    publicadas[0] ??
    aulas.find((item) => item.publicada)!;
  const secoes = useMemo(() => agruparSecoes(aula.blocos), [aula]);
  const indicePublicada = publicadas.findIndex((item) => item.numero === aula.numero);
  const anterior = indicePublicada > 0 ? publicadas[indicePublicada - 1] : null;
  const proxima = indicePublicada < publicadas.length - 1 ? publicadas[indicePublicada + 1] : null;

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-top">
          <div className="public-access" aria-label="Acesso público somente leitura">
            <ShieldCheck size={18} />
            <span>Acesso público · somente leitura</span>
          </div>

          <div className="institution">
            <strong>Faculdade Nacional de Direito</strong>
            <span>FND · UFRJ · 8º período · 2026.2</span>
          </div>
        </div>

        <div className="hero-main">
          <div className="hero-copy">
            <p className="eyebrow light">Caderno digital</p>
            <h1>
              Direito do <span>Trabalho II</span>
            </h1>
            <p>Conteúdo organizado a partir do caderno-base da disciplina.</p>
          </div>

          <div className="hero-side">
            <div className="meta-box">
              <div>
                <span>Professor</span>
                <strong>Prof.º Ivan Simões</strong>
              </div>
              <div>
                <span>Semestre</span>
                <strong>2026.2</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="source-bar">
        <div className="source-info">
          <span className="badge">
            <BookOpen size={13} /> Caderno-base
          </span>
          <span>Conteúdo sincronizado com o Google Docs</span>
          <span className={erroSincronizacao ? "sync-status sync-error" : "sync-status"} aria-live="polite">
            {erroSincronizacao ? (
              <>Cópia segura ativa · sincronização temporariamente indisponível</>
            ) : ultimaSincronizacao ? (
              <>
                <CheckCircle2 size={13} /> Atualizado às {horarioSincronizacao(ultimaSincronizacao)}
              </>
            ) : (
              <>Sincronização automática ativa</>
            )}
          </span>
        </div>

        <div className="source-actions">
          <button
            className="sync-button"
            type="button"
            disabled={sincronizando}
            onClick={() => void atualizarPeloGoogleDocs(false)}
            title={erroSincronizacao || "Buscar agora a versão mais recente do Google Docs"}
          >
            <RefreshCw className={sincronizando ? "spin" : ""} size={16} />
            {sincronizando ? "Atualizando..." : "Atualizar pelo Google Docs"}
          </button>

          <a className="secondary" href={fonteGoogleDocs} target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Abrir fonte
          </a>
        </div>
      </section>

      <section className="drive-library" aria-labelledby="drive-library-title">
        <div className="drive-library-head">
          <div>
            <p className="eyebrow">Biblioteca da disciplina</p>
            <h2 id="drive-library-title">Materiais no Google Drive</h2>
            <p>Acesso direto às pastas permanentes da disciplina.</p>
          </div>
          <span className="drive-readonly">
            <ShieldCheck size={14} /> Somente leitura
          </span>
        </div>

        <div className="drive-grid">
          {pastasDrive.map((pasta) => (
            <a
              className="drive-card"
              href={pasta.url}
              target="_blank"
              rel="noreferrer"
              key={pasta.url}
            >
              <div className="drive-card-top">
                <span>
                  <FolderOpen size={18} /> Google Drive
                </span>
                <ExternalLink size={16} aria-hidden="true" />
              </div>
              <strong>{pasta.nome}</strong>
              <p>{pasta.descricao}</p>
            </a>
          ))}
        </div>

        <p className="drive-security-note">
          Esta integração apenas abre as pastas existentes. O caderno não cria, move, renomeia,
          substitui ou exclui arquivos e pastas do Google Drive.
        </p>
      </section>

      <main className="content-grid">
        <aside>
          <div className="toc">
            <div className="toc-title">
              <span>Sumário</span>
              <strong>Aulas</strong>
            </div>
            <nav>
              {aulasAtuais.map((item) => (
                <button
                  key={item.numero}
                  disabled={!item.publicada}
                  className={aula.numero === item.numero ? "active" : ""}
                  onClick={() => setAulaSelecionada(item.numero)}
                >
                  <small>Aula {String(item.numero).padStart(2, "0")}</small>
                  <span>{item.publicada ? item.titulo : "Em preparação"}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <section className="lesson-column">
          <div className="lesson-head">
            <div>
              <p className="eyebrow">
                Aula {String(aula.numero).padStart(2, "0")} · Direito do Trabalho II
              </p>
              <h2>{aula.titulo}</h2>
              <p>{aula.meta}</p>
            </div>
            <BookOpen size={42} />
          </div>

          <div className="sections">
            {secoes.map((secao, indice) => (
              <article key={`${aula.numero}-${secao.titulo}`}>
                <span className="number">{String(indice + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{secao.titulo}</h3>
                  <div className="section-body">
                    {secao.itens.map((item, itemIndice) => (
                      <ConteudoBloco key={`${item.tipo}-${itemIndice}`} item={item} />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="lesson-navigation">
            <button
              disabled={!anterior}
              onClick={() => anterior && setAulaSelecionada(anterior.numero)}
            >
              <ChevronLeft size={17} />
              <span>
                <small>Aula anterior</small>
                {anterior?.titulo ?? "—"}
              </span>
            </button>

            <button
              disabled={!proxima}
              onClick={() => proxima && setAulaSelecionada(proxima.numero)}
            >
              <span>
                <small>Próxima aula</small>
                {proxima?.titulo ?? "—"}
              </span>
              <ChevronRight size={17} />
            </button>
          </div>

          <footer>
            <span>Desenvolvido e Organizado por Mariana Monteiro</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
