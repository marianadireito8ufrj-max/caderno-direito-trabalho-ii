import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { aulas, fonteGoogleDocs, type Bloco } from "./data";

type Secao = { titulo: string; itens: Bloco[] };

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
  const [loginAberto, setLoginAberto] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [avisoLogin, setAvisoLogin] = useState("");

  const aula = aulas.find((item) => item.numero === aulaSelecionada && item.publicada) ?? publicadas[0];
  const secoes = useMemo(() => agruparSecoes(aula.blocos), [aula]);
  const indicePublicada = publicadas.findIndex((item) => item.numero === aula.numero);
  const anterior = indicePublicada > 0 ? publicadas[indicePublicada - 1] : null;
  const proxima = indicePublicada < publicadas.length - 1 ? publicadas[indicePublicada + 1] : null;

  if (loginAberto) {
    return (
      <main className="login-page">
        <section className="login-brand">
          <div className="login-brand-top">
            <strong>Faculdade Nacional de Direito</strong>
            <span>FND · UFRJ · 8º período · 2026.2</span>
          </div>

          <div className="login-brand-main">
            <p>Caderno digital · Caderno 08</p>
            <h1>
              Direito do <span>Trabalho II</span>
            </h1>
            <p className="login-brand-copy">
              Caderno digital da disciplina, com conteúdo organizado a partir do caderno-base.
            </p>
          </div>

          <div className="login-brand-footer">
            <span>
              <ShieldCheck size={16} /> Ambiente acadêmico
            </span>
            <span>FND · UFRJ</span>
          </div>
        </section>

        <section className="login-access">
          <div className="login-geometry" aria-hidden="true" />
          <section className="login-card">
            <p className="login-eyebrow">Direito do Trabalho II</p>
            <h2>Acesse o caderno</h2>
            <p className="login-copy">
              Entre com sua conta para acessar e sincronizar o conteúdo da disciplina.
            </p>
            <div className="login-rule" />

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setAvisoLogin("A autenticação real será conectada em uma etapa futura.");
              }}
            >
              <label>
                E-mail
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seuemail@ufrj.br"
                  />
                </div>
              </label>

              <label>
                Senha
                <div className="input-with-icon password-field">
                  <KeyRound size={18} />
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    required
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setMostrarSenha((valor) => !valor)}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="login-row">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={(event) => setLembrar(event.target.checked)}
                  />
                  Continuar conectado
                </label>
                <button className="text-link" type="button">
                  Esqueci minha senha
                </button>
              </div>

              {avisoLogin && <p className="login-note">{avisoLogin}</p>}

              <button className="login-primary" type="submit">
                <KeyRound size={18} /> Entrar no caderno
              </button>
            </form>

            <div className="login-divider">
              <span>ou</span>
            </div>

            <button
              className="guest-button"
              type="button"
              onClick={() => {
                setLoginAberto(false);
                setAvisoLogin("");
              }}
            >
              <BookOpen size={18} /> Entrar sem login · somente leitura
            </button>

            <p className="guest-note">
              Acesso sem login disponível apenas para leitura. Edição e integrações poderão ser
              adicionadas futuramente.
            </p>

            <div className="login-bottom-links">
              <button type="button">Esqueci meu e-mail</button>
              <span>·</span>
              <button type="button">Cadastre-se</button>
            </div>

            <p className="privacy-note">
              Nesta versão, o formulário é apenas visual e não envia dados de autenticação.
            </p>
          </section>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-top">
          <button className="account-link" onClick={() => setLoginAberto(true)}>
            <ArrowLeft size={19} /> <span>Entrar na conta</span>
          </button>

          <div className="institution">
            <strong>Faculdade Nacional de Direito</strong>
            <span>FND · UFRJ · 8º período · 2026.2</span>
          </div>
        </div>

        <div className="hero-main">
          <div className="hero-copy">
            <p className="eyebrow light">Caderno digital · Caderno 08</p>
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
            <span>Direito do Trabalho II · Caderno 08</span>
            <span>Transcrito, organizado e diagramado por Mariana Monteiro</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
