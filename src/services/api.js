import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});
const STORAGE_KEY = "eletrooncologia.local-db.v1";

const createEmptyDb = () => ({
  empresa: {},
  produtos: [],
  aplicacoes: [],
  clientes: [],
  parcerias: [],
});

const clone = (value) => JSON.parse(JSON.stringify(value));

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

function readLocalDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyDb();

    const parsed = JSON.parse(raw);
    return {
      ...createEmptyDb(),
      ...parsed,
      empresa:
        parsed?.empresa && typeof parsed.empresa === "object"
          ? parsed.empresa
          : {},
      produtos: Array.isArray(parsed?.produtos) ? parsed.produtos : [],
      aplicacoes: Array.isArray(parsed?.aplicacoes) ? parsed.aplicacoes : [],
      clientes: Array.isArray(parsed?.clientes) ? parsed.clientes : [],
      parcerias: Array.isArray(parsed?.parcerias) ? parsed.parcerias : [],
    };
  } catch (_) {
    return createEmptyDb();
  }
}

function writeLocalDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function getCollection(name) {
  const db = readLocalDb();
  return Array.isArray(db[name]) ? db[name] : [];
}
function saveCollection(name, items) {
  const db = readLocalDb();
  db[name] = Array.isArray(items) ? items : [];
  writeLocalDb(db);
}

function upsertLocalItem(name, data, id = data?.id) {
  const collection = getCollection(name);
  const resolvedId = id ?? createId();

  if (id) {
    const mergedItem = {
      ...collection.find((item) => String(item.id) === String(resolvedId)),
      ...data,
      id: resolvedId,
    };

    const nextCollection = collection.map((item) =>
      String(item.id) === String(resolvedId)
        ? { ...item, ...data, id: item.id ?? resolvedId }
        : item,
    );

    if (
      !nextCollection.some((item) => String(item.id) === String(resolvedId))
    ) {
      nextCollection.push(mergedItem);
    }

    saveCollection(name, nextCollection);
    return clone(mergedItem);
  }

  const newItem = { ...data, id: resolvedId };
  saveCollection(name, [...collection, newItem]);
  return clone(newItem);
}

function removeLocalItem(name, id) {
  const collection = getCollection(name);
  saveCollection(
    name,
    collection.filter((item) => String(item.id) !== String(id)),
  );
}

async function requestWithFallback(requestFn, fallbackFn) {
  try {
    return await requestFn();
  } catch (error) {
    return fallbackFn(error);
  }
}

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

export const getEmpresa = () =>
  requestWithFallback(
    () => api.get("/empresa"),
    () => ({ data: clone(readLocalDb().empresa || {}) }),
  );

export const updateEmpresa = (data) =>
  requestWithFallback(
    () => api.put("/empresa", data),
    () => ({ data: clone(data || {}) }),
  ).then((response) => {
    const payload =
      response?.data && typeof response.data === "object"
        ? response.data
        : data;
    const db = readLocalDb();
    db.empresa = payload && typeof payload === "object" ? payload : {};
    writeLocalDb(db);
    return { ...response, data: clone(db.empresa) };
  });

const getCollectionApi = (name) =>
  requestWithFallback(
    () => api.get(`/${name}`),
    () => ({ data: clone(getCollection(name)) }),
  );

const createCollectionApi = (name, data) =>
  requestWithFallback(
    () => api.post(`/${name}`, data),
    () => ({ data: clone(upsertLocalItem(name, data)) }),
  ).then((response) => {
    const payload = response?.data || data;
    const nextItem = upsertLocalItem(name, payload, payload?.id);
    return { ...response, data: clone(nextItem) };
  });

const updateCollectionApi = (name, id, data) =>
  requestWithFallback(
    () => api.put(`/${name}/${id}`, data),
    () => ({ data: clone(upsertLocalItem(name, { ...data, id }, id)) }),
  ).then((response) => {
    const payload = response?.data || { ...data, id };
    const nextItem = upsertLocalItem(name, payload, payload?.id ?? id);
    return { ...response, data: clone(nextItem) };
  });

const deleteCollectionApi = (name, id) =>
  requestWithFallback(
    () => api.delete(`/${name}/${id}`),
    () => {
      removeLocalItem(name, id);
      return { data: null };
    },
  ).then((response) => {
    removeLocalItem(name, id);
    return response;
  });

export const getProdutos = () => getCollectionApi("produtos");
export const createProduto = (data) => createCollectionApi("produtos", data);
export const updateProduto = (id, data) =>
  updateCollectionApi("produtos", id, data);
export const deleteProduto = (id) => deleteCollectionApi("produtos", id);

export const getAplicacoes = () => getCollectionApi("aplicacoes");
export const createAplicacao = (data) =>
  createCollectionApi("aplicacoes", data);
export const updateAplicacao = (id, data) =>
  updateCollectionApi("aplicacoes", id, data);
export const deleteAplicacao = (id) => deleteCollectionApi("aplicacoes", id);

export const getClientes = () => getCollectionApi("clientes");
export const createCliente = (data) => createCollectionApi("clientes", data);
export const updateCliente = (id, data) =>
  updateCollectionApi("clientes", id, data);
export const deleteCliente = (id) => deleteCollectionApi("clientes", id);

export const getParcerias = () => getCollectionApi("parcerias");
export const createParceria = (data) => createCollectionApi("parcerias", data);
export const updateParceria = (id, data) =>
  updateCollectionApi("parcerias", id, data);
export const deleteParceria = (id) => deleteCollectionApi("parcerias", id);

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

  try {
    const res = await api.post("/chat/help", {
      message: cleanMessage,
      history: formatHistory(history),
    });
    const answerFromApi = pickAnswer(res?.data);
    if (answerFromApi) return answerFromApi;
  } catch (_) {}

  try {
    const publicAnswer = await askPublicSearch(cleanMessage);
    if (publicAnswer) return publicAnswer;
  } catch (_) {}

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
    } catch (_) {}
  }

  return `Entendo que voce perguntou sobre "${cleanMessage}". Embora nao tenha encontrado uma resposta especifica, recomendo:\n\n• Verificar a documentacao do sistema\n• Contatar o suporte tecnico\n• Tentar reformular sua pergunta\n\nOu tente novamente em alguns instantes para consultar fontes online.`;
}

export default api;
