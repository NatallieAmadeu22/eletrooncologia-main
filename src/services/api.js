import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API Error]", err.response?.status, err.response?.data);
    return Promise.reject(err);
  },
);

export const getEmpresa = () => api.get("/empresa");
export const updateEmpresa = (data) => api.put("/empresa", data);

export const getProdutos = () => api.get("/produtos");
export const createProduto = (data) => api.post("/produtos", data);
export const updateProduto = (id, data) => api.put(`/produtos/${id}`, data);
export const deleteProduto = (id) => api.delete(`/produtos/${id}`);

export const getAplicacoes = () => api.get("/aplicacoes");
export const createAplicacao = (data) => api.post("/aplicacoes", data);
export const updateAplicacao = (id, data) => api.put(`/aplicacoes/${id}`, data);
export const deleteAplicacao = (id) => api.delete(`/aplicacoes/${id}`);

export const getClientes = () => api.get("/clientes");
export const createCliente = (data) => api.post("/clientes", data);
export const updateCliente = (id, data) => api.put(`/clientes/${id}`, data);
export const deleteCliente = (id) => api.delete(`/clientes/${id}`);

export const getParcerias = () => api.get("/parcerias");
export const createParceria = (data) => api.post("/parcerias", data);
export const updateParceria = (id, data) => api.put(`/parcerias/${id}`, data);
export const deleteParceria = (id) => api.delete(`/parcerias/${id}`);

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_CHAT_MODEL = "openai/gpt-4o-mini";
const DUCK_URL = "https://api.duckduckgo.com/";

const pickAnswer = (payload) => {
  if (!payload) return "";

  if (typeof payload === "string") return payload;
  if (typeof payload?.answer === "string") return payload.answer;
  if (typeof payload?.reply === "string") return payload.reply;
  if (typeof payload?.message === "string") return payload.message;

  return "";
};

const formatHistory = (history = []) =>
  history
    .filter((msg) => msg?.role && msg?.content)
    .map((msg) => ({ role: msg.role, content: msg.content }))
    .slice(-12);

async function askPublicSearch(question) {
  const url = `${DUCK_URL}?q=${encodeURIComponent(question)}&format=json&no_html=1&no_redirect=1&skip_disambig=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) return "";

    const data = await res.json();
    const abstract = String(data?.AbstractText || "").trim();
    const answer = String(data?.Answer || "").trim();
    const definition = String(data?.Definition || "").trim();

    if (abstract) return abstract;
    if (answer) return answer;
    if (definition) return definition;

    const related = Array.isArray(data?.RelatedTopics)
      ? data.RelatedTopics.flatMap((topic) =>
          Array.isArray(topic?.Topics) ? topic.Topics : [topic],
        )
          .map((topic) => String(topic?.Text || "").trim())
          .find(Boolean)
      : "";

    return related || "";
  } catch (_) {
    return "";
  }
}

export async function askUniversalQuestion({ message, history = [] }) {
  const cleanMessage = String(message || "").trim();
  if (!cleanMessage) return "Escreva sua pergunta para eu poder ajudar.";

  // 1) Tenta endpoint interno da API, quando existir no backend.
  try {
    const res = await api.post("/chat/help", {
      message: cleanMessage,
      history: formatHistory(history),
    });
    const answerFromApi = pickAnswer(res?.data);
    if (answerFromApi) return answerFromApi;
  } catch (_) {
    // silencioso: seguimos para proxima opcao
  }

  // 2) Tenta busca publica online (sem chave necessaria).
  try {
    const publicAnswer = await askPublicSearch(cleanMessage);
    if (publicAnswer) {
      return publicAnswer;
    }
  } catch (_) {
    // se busca publica falhar, tenta IA externa
  }

  // 3) Se configurado, tenta OpenRouter com chave do usuario.
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (apiKey) {
    const model = import.meta.env.VITE_OPENROUTER_MODEL || DEFAULT_CHAT_MODEL;
    const appName =
      import.meta.env.VITE_OPENROUTER_APP_NAME || "Eletrooncologia";

    const messages = [
      {
        role: "system",
        content:
          "Voce e um assistente virtual do sistema Eletrooncologia. Responda qualquer duvida do usuario com clareza, objetividade e em portugues do Brasil. Quando a pergunta for sobre uso do sistema, forneca passos praticos.",
      },
      ...formatHistory(history),
      { role: "user", content: cleanMessage },
    ];

    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": appName,
        },
        body: JSON.stringify({ model, messages, temperature: 0.4 }),
      });

      if (res.ok) {
        const data = await res.json();
        const answer = data?.choices?.[0]?.message?.content?.trim();
        if (answer) return answer;
      }
    } catch (_) {
      // se IA externa falhar, retorna fallback generico
    }
  }

  // 4) Ultimo fallback: resposta generica inteligente.
  return `Entendo que voce perguntou sobre "${cleanMessage}". Embora nao tenha encontrado uma resposta especifica, recomendo:\n\n• Verificar a documentacao do sistema\n• Contatar o suporte tecnico\n• Tentar reformular sua pergunta\n\nOu tente novamente em alguns instantes para consultar fontes online.`;
}

export default api;
