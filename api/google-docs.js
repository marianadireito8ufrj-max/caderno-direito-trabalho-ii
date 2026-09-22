const DOC_ID = "1j2yeBHTP5qVTYS6JaBX8RYfOD8Rvn8H4ZhwKfqmNpq4";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const exportUrl = `https://docs.google.com/document/d/${DOC_ID}/export?format=html`;
    const response = await fetch(exportUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        "User-Agent": "Caderno-Digital-Direito-Trabalho-II/1.0",
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "Não foi possível ler o Google Docs neste momento.",
        status: response.status,
      });
    }

    const html = await response.text();

    if (!html || !/AULA\s+0?1/i.test(html)) {
      return res.status(502).json({
        error: "O conteúdo retornado pelo Google Docs não corresponde ao caderno esperado.",
      });
    }

    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json({
      html,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Falha ao consultar o Google Docs.",
      detail: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
