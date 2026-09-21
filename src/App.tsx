import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  ShieldCheck,
} from "lucide-react";
import { aulas, fonteGoogleDocs, type Bloco } from "./data";

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
        <ol>
          {item.itens.map((texto, indice) => (
            <li key={`${texto}-${indice}`}>{texto}</li>
          ))}
        </ol>
      </section>
    );
  }

  return <p>{item.texto}</p>;
}

export default function App() {
  const publicadas = aulas.filter((item) => item.publicada);
  const [aulaSelecionada, setAulaSelecionada] = useState(publicadas[0]?.numero ?? 1);

  const aula = aulas.find((item) => item.numero === aulaSelecionada && item.publicada) ?? publicadas[0];
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
        <div>
          <span className="badge">
            <BookOpen size={13} /> Caderno-base
          </span>
          <span>Conteúdo conferido no Google Docs</span>
        </div>

        {fonteGoogleDocs ? (
          <a className="secondary" href={fonteGoogleDocs} target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Abrir fonte
          </a>
        ) : (
          <button className="secondary disabled-source" type="button" disabled>
            <ExternalLink size={16} /> Abrir fonte
          </button>
        )}
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
              {aulas.map((item) => (
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
