"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: { title: string; type: "note" | "task" | "meeting" }[];
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: "intro",
    role: "assistant",
    content: "¡Hola! Soy tu asistente del Second Brain. Puedo ayudarte a:\n\n• Buscar información en tus notas\n• Resumir conocimiento por tema\n• Encontrar conexiones entre conceptos\n• Sugerir ideas basadas en tu contexto\n\n¿En qué puedo ayudarte?",
    timestamp: new Date().toISOString(),
  },
];

// Simulated RAG responses based on common queries
function generateResponse(query: string): ChatMessage {
  const q = query.toLowerCase();

  if (q.includes("arquitectura") || q.includes("sistema")) {
    return {
      id: crypto.randomUUID(), role: "assistant", timestamp: new Date().toISOString(),
      content: "Basándome en tus notas, el sistema sigue una **arquitectura de microservicios** con los siguientes componentes:\n\n1. **API Gateway** (Next.js App Router) — autenticación, rate limiting y routing\n2. **Servicios independientes** — Auth, Task, Notification, Search\n3. **PostgreSQL + pgvector** — base de datos principal con búsqueda semántica\n4. **Redis Streams** — cola de mensajes para eventos entre servicios\n\nCada servicio tiene su propia DB y se comunica mediante eventos asíncronos. La orquestación se maneja con Kubernetes.\n\n¿Quieres que profundice en algún componente específico?",
      references: [
        { title: "Arquitectura del Sistema", type: "note" },
        { title: "Microservicios", type: "note" },
        { title: "PostgreSQL", type: "note" },
      ],
    };
  }

  if (q.includes("rutina") || q.includes("mañana") || q.includes("productiv")) {
    return {
      id: crypto.randomUUID(), role: "assistant", timestamp: new Date().toISOString(),
      content: "Según tu base de conocimiento y tus rutinas configuradas, aquí tienes un resumen de productividad:\n\n**Tu rutina de mañana actual:**\n- Despertar → agua con limón → journaling → yoga → skincare → desayuno\n- Duración total: ~42 minutos\n- Adherencia: 80% en la última semana\n\n**Sugerencias basadas en tu historial:**\n- Los días que completas la rutina completa, tu primera sesión de deep work es un 30% más productiva\n- Considera mover el yoga a después del desayuno si te cuesta mantener la adherencia\n\n¿Te gustaría que ajuste la rutina o que investigue nuevas técnicas?",
      references: [
        { title: "Deep Work Session", type: "task" },
        { title: "Retrospectiva Sprint 11", type: "meeting" },
      ],
    };
  }

  if (q.includes("sprint") || q.includes("progreso") || q.includes("proyecto")) {
    return {
      id: crypto.randomUUID(), role: "assistant", timestamp: new Date().toISOString(),
      content: "Aquí tienes un resumen del estado actual de tus proyectos:\n\n**MVP Plataforma v1.0** — 67% completado\n- 4/6 tareas completadas\n- Blocker actual: bug en formulario de registro\n- Próximo milestone: autenticación OAuth2\n\n**Integración Google Meet** — 25% completado\n- OAuth con Google configurado ✓\n- Calendar sync en progreso\n- 2 tareas pendientes\n\n**Decisiones recientes** (Sprint 11):\n- PRs limitados a 400 líneas\n- Pre-commit hooks con linting automático\n- Rotación semanal de reviewers\n\n¿Necesitas un plan para desbloquear alguna tarea?",
      references: [
        { title: "Reunión Sprint 11", type: "note" },
        { title: "Sprint Planning #12", type: "meeting" },
        { title: "Ideas de Producto", type: "note" },
      ],
    };
  }

  if (q.includes("investiga") || q.includes("busca") || q.includes("perplexity")) {
    return {
      id: crypto.randomUUID(), role: "assistant", timestamp: new Date().toISOString(),
      content: "Puedo investigar ese tema por ti usando Perplexity Pro. Esto es lo que haré:\n\n1. Enviaré tu consulta a Perplexity para obtener información actualizada\n2. Crearé una nota con el resumen de los hallazgos\n3. La clasificaré en los temas relevantes de tu Second Brain\n4. Te sugeriré tareas o rutinas basadas en los resultados\n\n⏳ *La investigación puede tomar 1-2 minutos. Te notificaré cuando esté lista.*\n\n¿Confirmo la investigación?",
      references: [],
    };
  }

  // Default response
  return {
    id: crypto.randomUUID(), role: "assistant", timestamp: new Date().toISOString(),
    content: `He buscado en tu base de conocimiento sobre "${query}" pero no encontré información directa. Puedo:\n\n1. **Investigar externamente** usando Perplexity Pro\n2. **Crear una nota** nueva sobre este tema para que empieces a documentar\n3. **Buscar conexiones** indirectas en tus notas existentes\n\n¿Qué prefieres?`,
    references: [],
  };
}

export default function BrainChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Simulate RAG processing delay
    await new Promise(r => setTimeout(r, 1200));

    const response = generateResponse(input);
    setMessages(prev => [...prev, response]);
    setIsThinking(false);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/brain" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Chat con Second Brain
            </h1>
            <p className="text-xs text-muted-foreground">Pregunta sobre tu conocimiento personal</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          RAG activo · 6 notas indexadas
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto rounded-xl border bg-card p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted rounded-bl-md"
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.references && msg.references.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {msg.references.map((ref, i) => (
                    <span key={i} className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-medium">
                      <FileText className="h-2.5 w-2.5" />{ref.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-3">
            <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div className="rounded-2xl bg-muted px-4 py-3 rounded-bl-md">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                Buscando en tu second brain...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Pregunta sobre tu conocimiento... (ej: ¿qué sé sobre arquitectura?)"
          className="flex-1 rounded-xl border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isThinking}
        />
        <button type="submit" disabled={isThinking} className="rounded-xl bg-primary px-4 py-3 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* Quick prompts */}
      <div className="mt-2 flex flex-wrap gap-2">
        {["¿Qué sé sobre arquitectura?", "Resumen de progreso de proyectos", "Sugiéreme mejoras a mi rutina", "Investiga sobre entrenamiento HIIT"].map(prompt => (
          <button key={prompt} onClick={() => setInput(prompt)} className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
