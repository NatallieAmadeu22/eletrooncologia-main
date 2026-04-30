import { useEffect, useMemo, useRef, useState } from "react";

const INITIAL_MESSAGE = {
  id: 1,
  from: "bot",
  text: "Oi! Eu sou o assistente virtual. Posso te ajudar com login, pagamentos, suporte e navegacao.",
};

const QUICK_QUESTIONS = [
  "Nao consigo fazer login",
  "Quais formas de pagamento?",
  "Como falar com o suporte?",
  "Como navegar no sistema?",
];

const FAQ_RESPONSES = {
  login:
    "Se voce nao consegue entrar: 1) confira e-mail e senha, 2) clique em 'esqueci minha senha', 3) limpe cache do navegador e tente novamente. Se continuar, fale com o suporte.",
  pagamentos:
    "Aceitamos cartao de credito, boleto e PIX. O prazo de compensacao pode variar: PIX e imediato, cartao em minutos e boleto em ate 2 dias uteis.",
  suporte:
    "Nosso suporte funciona de segunda a sexta, das 8h as 18h. Voce pode abrir chamado pelo chat, e-mail suporte@empresa.com ou area de atendimento.",
  navegacao:
    "Use o menu lateral para acessar os modulos. A barra superior mostra atalhos e busca. Para voltar ao inicio, clique em Dashboard no menu.",
  default:
    "Posso responder sobre login, pagamentos, suporte e navegacao. Se quiser, clique em uma resposta rapida acima.",
};

function detectIntent(text) {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (
    normalized.includes("login") ||
    normalized.includes("senha") ||
    normalized.includes("acesso") ||
    normalized.includes("entrar")
  ) {
    return "login";
  }

  if (
    normalized.includes("pagamento") ||
    normalized.includes("pagar") ||
    normalized.includes("pix") ||
    normalized.includes("boleto") ||
    normalized.includes("cartao")
  ) {
    return "pagamentos";
  }

  if (
    normalized.includes("suporte") ||
    normalized.includes("atendimento") ||
    normalized.includes("ajuda") ||
    normalized.includes("contato")
  ) {
    return "suporte";
  }

  if (
    normalized.includes("navegacao") ||
    normalized.includes("navegar") ||
    normalized.includes("menu") ||
    normalized.includes("dashboard") ||
    normalized.includes("pagina")
  ) {
    return "navegacao";
  }

  return "default";
}

function getAutomaticReply(userText) {
  const intent = detectIntent(userText);
  return FAQ_RESPONSES[intent];
}

export default function ChatHelpWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, open]);

  const sendMessage = (rawText) => {
    const text = rawText.trim();
    if (!text) return;

    const messageId = Date.now();
    const nextUserMessage = { id: messageId, from: "user", text };

    setMessages((prev) => [...prev, nextUserMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(async () => {
      try {
        const reply = getAutomaticReply(text);

        setMessages((prev) => [
          ...prev,
          { id: messageId + 1, from: "bot", text: reply },
        ]);
      } catch (_) {
        setMessages((prev) => [
          ...prev,
          {
            id: messageId + 1,
            from: "bot",
            text: "Tive um problema ao responder agora. Tente novamente em alguns instantes.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 250);
  };

  return (
    <>
      <button
        type="button"
        className="chat-help-fab"
        aria-label="Abrir chat de duvidas"
        onClick={() => setOpen((v) => !v)}
      >
        <i className={`bi ${open ? "bi-x-lg" : "bi-chat-dots-fill"}`} />
        <span>Duvidas</span>
      </button>

      {open && (
        <section className="chat-help-panel" aria-label="Chat de suporte">
          <header className="chat-help-header">
            <div>
              <h3>Chat de Ajuda</h3>
              <p>Conectado</p>
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </header>

          <div className="chat-help-quick-questions">
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                disabled={isTyping}
                onClick={() => sendMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>

          <div className="chat-help-messages" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble bot typing">Digitando...</div>
            )}
          </div>

          <form
            className="chat-help-input"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              type="text"
              value={input}
              placeholder="Escreva sua dúvida"
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="btn-primary-custom"
              disabled={!canSend || isTyping}
            >
              Enviar
            </button>
          </form>
        </section>
      )}
    </>
  );
}
