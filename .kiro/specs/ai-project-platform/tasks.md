# Plan de Implementación: AI Project Platform

## Visión General

Implementación incremental de la plataforma full-stack con Next.js (App Router), Prisma, PostgreSQL + pgvector, sistema multi-agente con LangGraph, y frontend con React/Tailwind/shadcn. Cada tarea construye sobre la anterior, culminando en la integración completa del sistema.

## Tareas

- [x] 1. Configurar estructura del proyecto y dependencias base
  - Inicializar proyecto Next.js con App Router y TypeScript
  - Configurar Tailwind CSS y shadcn/ui
  - Instalar dependencias: prisma, @prisma/client, zustand, @dnd-kit/core, @dnd-kit/sortable, tiptap, d3, framer-motion, fast-check, vitest, langraph, zod
  - Configurar Vitest con soporte para fast-check
  - Crear estructura de directorios según diseño (src/lib/services, src/lib/agents, src/lib/events, src/lib/embeddings, src/lib/auth, src/components, src/hooks, src/types, tests/unit, tests/property)
  - _Requisitos: 16.1, 18.2_

- [x] 2. Definir schema de base de datos y migraciones
  - [x] 2.1 Crear schema Prisma completo con todos los modelos
    - Modelos: User, Task, TaskDependency, Project, Thread, Message, Meeting, MeetingSummaryRecord, Note, NoteLink, NoteEntityLink, AgentLog
    - Enums: TaskStatus, Priority, MeetingStatus
    - Habilitar extensión pgvector y campos vector(1536)
    - Definir relaciones, índices y constraints según diseño
    - _Requisitos: 1.1, 2.1, 4.1, 6.2, 8.1, 14.3, 17.1_

  - [x] 2.2 Crear migración SQL para índices vectoriales
    - Índices ivfflat en tasks.embedding, notes.embedding, meeting_summaries.embedding
    - _Requisitos: 14.3_

  - [x] 2.3 Configurar Prisma Client y módulo de conexión
    - Crear singleton de PrismaClient en src/lib/db/prisma.ts
    - Configurar variables de entorno (DATABASE_URL)
    - _Requisitos: 18.1_

- [x] 3. Implementar tipos compartidos y errores de dominio
  - [x] 3.1 Definir tipos TypeScript del sistema
    - Tipos: TaskStatus, Priority, CreateTaskInput, UpdateTaskInput, CreateProjectInput, PostMessageInput, Mention, CreateMeetingInput, MeetingSummary, ActionItem, WikilinkReference, NoteAST, WikilinkNode, KnowledgeGraph, GraphNode, GraphEdge, AgentRequest, AgentResponse, AgentType, AgentAction, DomainEvent, SearchOptions, SearchResult
    - Crear en src/types/
    - _Requisitos: 1.4, 1.5_

  - [x] 3.2 Implementar clases de error de dominio
    - Clases: DomainError, ValidationError, NotFoundError, AuthorizationError, ConflictError, AgentError, ExternalServiceError
    - Crear en src/lib/errors.ts
    - _Requisitos: 1.7, 6.4, 13.4_

- [x] 4. Implementar Event Bus interno
  - [x] 4.1 Crear sistema de eventos pub/sub tipado
    - Interface EventBus con publish() y subscribe()
    - Tipos de eventos: task.created, task.updated, task.deleted, project.created, meeting.completed, note.created, note.updated, agent.request, agent.response
    - Implementación in-memory con soporte para handlers async
    - Crear en src/lib/events/event-bus.ts
    - _Requisitos: 13.2, 7.4_

- [x] 5. Implementar módulo de autenticación y seguridad
  - [x] 5.1 Implementar autenticación OAuth2 con JWT
    - Middleware de autenticación en src/lib/auth/middleware.ts
    - Funciones: verifyToken, refreshToken, getCurrentUser
    - Configuración OAuth2 con provider de Google
    - _Requisitos: 15.1, 15.5_

  - [x] 5.2 Implementar middleware de autorización y aislamiento de datos
    - Validar ownership de recursos antes de cada operación
    - Retornar AuthorizationError si el usuario intenta acceder a datos ajenos
    - _Requisitos: 15.2_

  - [x] 5.3 Implementar sanitización de entradas (XSS, CSRF, prompt injection)
    - Middleware de sanitización para todas las rutas API
    - Sanitización específica para entradas enviadas a LLMs
    - Protección CSRF con tokens
    - _Requisitos: 15.3, 15.4_

  - [ ]* 5.4 Escribir property test: Aislamiento de acceso entre usuarios
    - **Propiedad 25: Aislamiento de acceso entre usuarios**
    - **Valida: Requisitos 15.2**

  - [ ]* 5.5 Escribir property test: Sanitización contra XSS
    - **Propiedad 26: Sanitización de entradas contra XSS**
    - **Valida: Requisitos 15.3**

  - [ ]* 5.6 Escribir property test: Sanitización contra prompt injection
    - **Propiedad 27: Sanitización contra prompt injection**
    - **Valida: Requisitos 15.4**

- [x] 6. Checkpoint — Verificar base del proyecto
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 7. Implementar TaskService (servicios de dominio de tareas)
  - [x] 7.1 Implementar CRUD de tareas
    - Métodos: create, update, delete, getById, listByProject, listByUser
    - Crear con estado "pending" y prioridad "medium" por defecto
    - Emitir eventos task.created, task.updated, task.deleted
    - Validar campos enum (status, priority) con Zod
    - Crear en src/lib/services/task.service.ts
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 7.2 Implementar gestión de dependencias con detección de ciclos
    - Métodos: addDependency, removeDependency, validateNoCycles
    - Algoritmo DFS para detección de ciclos en el DAG
    - Lanzar ConflictError si se detecta ciclo
    - _Requisitos: 1.6, 1.7_

  - [x] 7.3 Implementar método updateStatus con validación
    - Validar que el nuevo estado sea uno de los valores permitidos
    - _Requisitos: 1.4, 3.4_

  - [ ]* 7.4 Escribir property test: Valores por defecto en creación
    - **Propiedad 1: Valores por defecto en creación de tareas**
    - **Valida: Requisitos 1.1**

  - [ ]* 7.5 Escribir property test: Actualización parcial preserva campos
    - **Propiedad 2: Actualización parcial preserva campos no modificados**
    - **Valida: Requisitos 1.2**

  - [ ]* 7.6 Escribir property test: Eliminación limpia dependencias
    - **Propiedad 3: Eliminación de tarea limpia dependencias**
    - **Valida: Requisitos 1.3**

  - [ ]* 7.7 Escribir property test: Validación de campos enum
    - **Propiedad 4: Validación de campos enum**
    - **Valida: Requisitos 1.4, 1.5**

  - [ ]* 7.8 Escribir property test: Detección de ciclos en dependencias
    - **Propiedad 5: Detección de ciclos en dependencias**
    - **Valida: Requisitos 1.6**

  - [ ]* 7.9 Escribir property test: Ordenamiento en vista lista
    - **Propiedad 8: Ordenamiento de tareas en vista lista**
    - **Valida: Requisitos 3.1**

  - [ ]* 7.10 Escribir property test: Drag & drop actualiza estado
    - **Propiedad 9: Drag & drop actualiza estado**
    - **Valida: Requisitos 3.4**

- [x] 8. Implementar ProjectService (servicios de dominio de proyectos)
  - [x] 8.1 Implementar CRUD de proyectos
    - Métodos: create, update, delete, getById, listByUser, addTask, removeTask, getProgress
    - delete acepta opción { deleteTasks: boolean }
    - Emitir evento project.created
    - Crear en src/lib/services/project.service.ts
    - _Requisitos: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 8.2 Escribir property test: Proyecto contiene todas sus tareas
    - **Propiedad 6: Proyecto contiene todas sus tareas asociadas**
    - **Valida: Requisitos 2.2, 2.3**

  - [ ]* 8.3 Escribir property test: Eliminación respeta modo seleccionado
    - **Propiedad 7: Eliminación de proyecto respeta modo seleccionado**
    - **Valida: Requisitos 2.4**

- [x] 9. Implementar ConversationService (hilos y mensajes)
  - [x] 9.1 Implementar servicio de hilos de conversación
    - Métodos: createThread, getThread, postMessage, getMessages, parseMentions
    - Crear hilo automáticamente al crear tarea/proyecto (vía evento)
    - Parser de menciones que detecta @task, @project, @note, @user
    - Almacenamiento cronológico de mensajes con paginación
    - Crear en src/lib/services/conversation.service.ts
    - _Requisitos: 4.1, 4.2, 4.3, 4.5, 5.1_

  - [ ]* 9.2 Escribir property test: Creación de entidad genera hilo
    - **Propiedad 10: Creación de entidad genera hilo de conversación**
    - **Valida: Requisitos 4.1, 5.1**

  - [ ]* 9.3 Escribir property test: Mensajes en orden cronológico
    - **Propiedad 11: Mensajes se almacenan en orden cronológico**
    - **Valida: Requisitos 4.2, 4.5**

  - [ ]* 9.4 Escribir property test: Parsing de menciones
    - **Propiedad 12: Parsing de menciones en mensajes**
    - **Valida: Requisitos 4.3**

  - [ ]* 9.5 Escribir property test: Notificaciones por menciones
    - **Propiedad 30: Notificaciones por menciones de usuario**
    - **Valida: Requisitos 5.3**

- [x] 10. Implementar MeetingService (integración con Google)
  - [x] 10.1 Implementar servicio de reuniones
    - Métodos: create, getById, listByUser, listUpcoming, createGoogleEvent, storeSummary
    - Integración con Google Calendar API vía Composio MCP
    - Manejo de errores con retry y backoff exponencial
    - Crear en src/lib/services/meeting.service.ts
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 10.2 Escribir property test: Reuniones asociadas a entidades
    - **Propiedad 13: Reuniones asociadas a entidades**
    - **Valida: Requisitos 6.2**

  - [ ]* 10.3 Escribir property test: Listado de reuniones futuras ordenado
    - **Propiedad 14: Listado de reuniones futuras ordenado cronológicamente**
    - **Valida: Requisitos 6.3**

- [x] 11. Checkpoint — Verificar servicios de dominio
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 12. Implementar NoteService y parser de Markdown con Wikilinks
  - [x] 12.1 Implementar parser de Markdown con Wikilinks
    - Interface MarkdownParser: parse, format, extractWikilinks
    - Detectar sintaxis [[concepto]] y extraer posiciones
    - Generar NoteAST con lista de WikilinkNodes
    - Formatear NoteAST de vuelta a Markdown válido
    - Crear en src/lib/services/markdown-parser.ts
    - _Requisitos: 8.6, 8.7, 8.8_

  - [x] 12.2 Implementar NoteService completo
    - Métodos: create, update, delete, getById, listByUser, parseWikilinks, updateLinks, getBacklinks, getGraph, associateWith
    - Al crear/editar nota: parsear wikilinks y crear/actualizar NoteLink records
    - Wikilinks a notas inexistentes crean enlace con targetNoteId=null
    - Calcular grafo de conocimiento (nodos + aristas)
    - Crear en src/lib/services/note.service.ts
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.4, 10.1_

  - [ ]* 12.3 Escribir property test: Round-trip de parsing Markdown
    - **Propiedad 15: Round-trip de parsing de Markdown con Wikilinks**
    - **Valida: Requisitos 8.6, 8.7, 8.8**

  - [ ]* 12.4 Escribir property test: Wikilinks generan enlaces bidireccionales
    - **Propiedad 16: Wikilinks generan enlaces bidireccionales**
    - **Valida: Requisitos 8.2, 8.3, 8.4, 9.4**

  - [ ]* 12.5 Escribir property test: Wikilinks a notas inexistentes
    - **Propiedad 17: Wikilinks a notas inexistentes crean enlaces pendientes**
    - **Valida: Requisitos 8.5**

  - [ ]* 12.6 Escribir property test: Grafo refleja estructura de enlaces
    - **Propiedad 18: Grafo de conocimiento refleja estructura de enlaces**
    - **Valida: Requisitos 9.1**

  - [ ]* 12.7 Escribir property test: Asociaciones bidireccionales
    - **Propiedad 19: Asociaciones bidireccionales nota-entidad**
    - **Valida: Requisitos 10.1, 10.2, 10.3**

- [x] 13. Implementar EmbeddingService y búsqueda semántica
  - [x] 13.1 Implementar servicio de embeddings
    - Métodos: generate, generateBatch, index, search
    - Integración con proveedor de embeddings (OpenAI/Claude)
    - Almacenar vectores en pgvector
    - Búsqueda por similitud coseno con filtros por tipo y umbral
    - Crear en src/lib/embeddings/embedding.service.ts
    - _Requisitos: 14.1, 14.2, 14.3, 14.4_

  - [x] 13.2 Integrar generación de embeddings con eventos del sistema
    - Suscribir a eventos note.created, note.updated, task.created, task.updated, meeting.completed
    - Generar y almacenar embedding automáticamente
    - _Requisitos: 14.2_

  - [ ]* 13.3 Escribir property test: Búsqueda retorna resultados por relevancia
    - **Propiedad 23: Búsqueda semántica retorna resultados por relevancia**
    - **Valida: Requisitos 14.1**

  - [ ]* 13.4 Escribir property test: Creación/actualización genera embedding
    - **Propiedad 24: Creación/actualización genera embedding**
    - **Valida: Requisitos 14.2**

- [x] 14. Implementar sistema de agentes con LangGraph (servicio Python FastAPI)
  - [x] 14.1 Configurar servicio Python FastAPI para agentes
    - Crear proyecto Python en agents/ con FastAPI, LangGraph, pydantic
    - Definir endpoints HTTP: POST /agents/chat, GET /agents/chat/{id}/stream
    - Definir Pydantic schemas equivalentes a AgentRequest/AgentResponse
    - Crear Dockerfile para el servicio
    - Crear en agents/main.py, agents/schemas/
    - _Requisitos: 13.1_

  - [x] 14.2 Implementar cliente HTTP de agentes en Node.js
    - Crear cliente que conecta Next.js API Routes con el servicio Python
    - Soporte para streaming SSE
    - Manejo de errores y timeouts
    - Crear en src/lib/agents/agent-client.ts
    - _Requisitos: 13.1, 18.3_

  - [x] 14.3 Implementar RootAgent con clasificación de intención y enrutamiento
    - Clasificar intención del usuario usando LLM
    - Enrutar a subagente correcto (task_manager, project_planner, conversation, meeting, second_brain)
    - Coordinar operaciones compuestas (múltiples agentes en secuencia)
    - Crear en agents/agents/root_agent.py
    - _Requisitos: 13.1, 13.2_

  - [x] 14.4 Implementar EvaluatorAgent
    - Evaluar calidad de respuestas de agentes (score 0-1)
    - Si calidad insuficiente, señalar para reintento
    - Crear en agents/agents/evaluator_agent.py
    - _Requisitos: 12.5, 13.5_

  - [x] 14.5 Implementar TaskManagerAgent
    - Gestionar tareas vía lenguaje natural (crear, actualizar, eliminar, listar)
    - Llamar a la API REST de Next.js para operaciones de datos
    - Crear en agents/agents/task_manager_agent.py
    - _Requisitos: 1.1, 7.2_

  - [x] 14.6 Implementar ProjectPlannerAgent
    - Generar planes de proyecto a partir de objetivos
    - Proponer tareas con prioridades, dependencias y tiempos estimados
    - Analizar progreso y proponer ajustes
    - Crear en agents/agents/project_planner_agent.py
    - _Requisitos: 12.1, 12.2, 12.3, 12.4_

  - [x] 14.7 Implementar ConversationAgent
    - Responder en hilos con clarificaciones, resúmenes, propuestas
    - Publicar resúmenes de reuniones en hilos de proyecto
    - Crear en agents/agents/conversation_agent.py
    - _Requisitos: 4.4, 5.2_

  - [x] 14.8 Implementar MeetingAgent
    - Generar resumen post-reunión: overview, decisiones, action items
    - Coordinar con TaskManagerAgent para crear tareas de action items
    - Coordinar con SecondBrainAgent para crear nota de resumen
    - Crear en agents/agents/meeting_agent.py
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 14.9 Implementar SecondBrainAgent
    - Resumir notas extensas, buscar semánticamente, sugerir conexiones
    - Usar EmbeddingService para RAG
    - Crear en agents/agents/second_brain_agent.py
    - _Requisitos: 11.1, 11.2, 11.3, 11.4, 9.5_

  - [x] 14.10 Implementar cola de prioridades para agentes
    - Interface AgentQueue: enqueue, process, getStatus
    - Prioridades: high (tiempo real), normal (post-reunión), low (embeddings)
    - Procesar en orden de prioridad
    - Crear en agents/agents/queue.py
    - _Requisitos: 18.4_

  - [x] 14.11 Implementar lógica de retry y manejo de fallos
    - RootAgent reintenta 1 vez en caso de fallo
    - Si falla de nuevo, retornar AgentError descriptivo
    - Registrar en AgentLog con status="error"
    - _Requisitos: 13.4_

  - [ ]* 14.12 Escribir property test: Enrutamiento del RootAgent
    - **Propiedad 20: Enrutamiento del RootAgent**
    - **Valida: Requisitos 13.1**

  - [ ]* 14.13 Escribir property test: Observabilidad de operaciones
    - **Propiedad 21: Observabilidad de operaciones de agentes**
    - **Valida: Requisitos 13.3, 17.1, 17.2**

  - [ ]* 14.14 Escribir property test: Retry y fallo graceful
    - **Propiedad 22: Retry y fallo graceful de agentes**
    - **Valida: Requisitos 13.4**

  - [ ]* 14.13 Escribir property test: Cola de prioridades
    - **Propiedad 29: Cola de prioridades procesa en orden correcto**
    - **Valida: Requisitos 18.4**

- [x] 15. Checkpoint — Verificar servicios y agentes
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 16. Implementar observabilidad y monitoreo
  - [x] 16.1 Implementar logging estructurado de agentes
    - Registrar cada decisión con: timestamp, agente, acción, resultado, tokens, latencia, costo
    - Guardar en modelo AgentLog vía Prisma
    - Crear en src/lib/agents/logger.ts
    - _Requisitos: 17.1, 17.2_

  - [x] 16.2 Implementar métricas Prometheus y alertas
    - Exponer endpoint /api/metrics en formato Prometheus
    - Registrar alerta cuando latencia de agente > 10s
    - Métricas: latencia, tokens consumidos, costo por operación
    - _Requisitos: 17.3, 17.4_

  - [ ]* 16.3 Escribir property test: Alertas por latencia excesiva
    - **Propiedad 28: Alertas por latencia excesiva de agentes**
    - **Valida: Requisitos 17.4**

- [x] 17. Implementar API Routes (todas las rutas REST)
  - [x] 17.1 Implementar rutas de autenticación
    - POST /api/auth/login, POST /api/auth/refresh, POST /api/auth/logout, GET /api/auth/me
    - _Requisitos: 15.1, 15.5_

  - [x] 17.2 Implementar rutas de tareas
    - POST /api/tasks, GET /api/tasks, GET /api/tasks/:id, PATCH /api/tasks/:id, DELETE /api/tasks/:id
    - POST /api/tasks/:id/dependencies, DELETE /api/tasks/:id/dependencies/:depId, PATCH /api/tasks/:id/status
    - Middleware de autenticación y validación con Zod
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 17.3 Implementar rutas de proyectos
    - POST /api/projects, GET /api/projects, GET /api/projects/:id, PATCH /api/projects/:id, DELETE /api/projects/:id
    - POST /api/projects/:id/tasks
    - _Requisitos: 2.1, 2.2, 2.3, 2.4_

  - [x] 17.4 Implementar rutas de conversaciones
    - GET /api/threads/:id, POST /api/threads/:id/messages, GET /api/threads/:id/messages
    - _Requisitos: 4.2, 4.3, 4.5, 5.2_

  - [x] 17.5 Implementar rutas de reuniones
    - POST /api/meetings, GET /api/meetings, GET /api/meetings/:id, POST /api/meetings/:id/process, GET /api/meetings/upcoming
    - _Requisitos: 6.1, 6.2, 6.3, 7.1_

  - [x] 17.6 Implementar rutas de notas (Second Brain)
    - POST /api/notes, GET /api/notes, GET /api/notes/:id, PATCH /api/notes/:id, DELETE /api/notes/:id
    - GET /api/notes/graph, POST /api/notes/:id/associate
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 9.1, 10.1_

  - [x] 17.7 Implementar ruta de búsqueda semántica
    - POST /api/search con query, filtros por tipo y umbral
    - _Requisitos: 14.1, 14.4_

  - [x] 17.8 Implementar rutas de agentes
    - POST /api/agents/chat, GET /api/agents/chat/:id/stream (SSE), GET /api/agents/logs
    - Streaming de respuestas parciales con Server-Sent Events
    - _Requisitos: 13.1, 18.3_

  - [x] 17.9 Implementar middleware global de errores
    - Mapeo de DomainError a HTTP status codes
    - Respuestas JSON consistentes con code y message
    - Crear en src/app/api/_middleware.ts
    - _Requisitos: 1.7, 6.4, 13.4, 15.2_

- [x] 18. Checkpoint — Verificar API completa
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 19. Implementar componentes de frontend — Layout y navegación
  - [x] 19.1 Crear layout principal con sidebar, header y área de contenido
    - Sidebar con navegación: Tareas, Proyectos, Reuniones, Brain, Búsqueda
    - Header con barra de búsqueda y usuario actual
    - Layout responsive (móvil y escritorio)
    - Usar shadcn/ui para componentes base
    - Crear en src/app/(dashboard)/layout.tsx
    - _Requisitos: 16.1, 16.2_

  - [x] 19.2 Implementar store global con Zustand
    - Estado: sidebarOpen, activeView, tasks, projects, notes
    - Actions para CRUD delegadas a llamadas API
    - Crear en src/hooks/stores.ts
    - _Requisitos: 16.5_

- [x] 20. Implementar vistas de tareas (Lista, Kanban, Calendario)
  - [x] 20.1 Implementar vista de lista de tareas
    - Ordenable por prioridad, estado, fecha de creación
    - Filtros por estado y prioridad
    - Crear en src/components/tasks/TaskListView.tsx
    - _Requisitos: 3.1_

  - [x] 20.2 Implementar vista Kanban con drag & drop
    - Columnas: pending, in_progress, review, blocked, completed
    - Drag & drop con @dnd-kit
    - Al soltar, llamar PATCH /api/tasks/:id/status
    - Crear en src/components/tasks/KanbanBoard.tsx
    - _Requisitos: 3.2, 3.4_

  - [x] 20.3 Implementar vista de calendario
    - Mostrar tareas según fecha límite (dueDate)
    - Vista mensual con indicadores por día
    - Crear en src/components/tasks/TaskCalendarView.tsx
    - _Requisitos: 3.3_

  - [x] 20.4 Implementar selector de vista con transición animada
    - Cambio entre lista, kanban y calendario
    - Transición < 300ms con Framer Motion
    - _Requisitos: 3.5, 16.3, 16.5_

- [x] 21. Implementar vistas de proyectos
  - [x] 21.1 Crear vista de lista de proyectos
    - Listar proyectos del usuario con progreso (% completado)
    - Crear en src/components/projects/ProjectListView.tsx
    - _Requisitos: 2.1, 2.3_

  - [x] 21.2 Crear vista de detalle de proyecto
    - Mostrar tareas asociadas con estados y prioridades
    - Hilo de conversación del proyecto
    - Reuniones relacionadas y notas asociadas
    - Crear en src/components/projects/ProjectDetailView.tsx
    - _Requisitos: 2.3, 5.1, 10.2_

- [x] 22. Implementar componentes de conversación
  - [x] 22.1 Crear panel de conversación reutilizable
    - Lista de mensajes en orden cronológico
    - Input para publicar mensajes
    - Renderizar menciones como enlaces navegables
    - Diferenciación visual entre mensajes de usuario y agente
    - Crear en src/components/conversations/ConversationPanel.tsx
    - _Requisitos: 4.2, 4.3, 4.4_

  - [x] 22.2 Crear interfaz de chat con agentes
    - Input con capacidad de enviar solicitudes al sistema de agentes
    - Streaming de respuestas parciales (SSE)
    - Indicador de progreso durante respuesta
    - Crear en src/components/conversations/AgentChatInterface.tsx
    - _Requisitos: 13.1, 18.3_

- [x] 23. Implementar componentes del Second Brain
  - [x] 23.1 Implementar editor de notas con TipTap
    - Extensiones: StarterKit, Markdown
    - Extensión custom WikilinkExtension para detectar [[...]] y renderizar como enlace
    - Autocompletado de títulos de notas existentes al escribir [[
    - Al guardar: extraer wikilinks y llamar PATCH /api/notes/:id
    - Crear en src/components/brain/NoteEditor.tsx
    - _Requisitos: 8.1, 8.2, 8.6_

  - [x] 23.2 Implementar visualización del grafo de conocimiento con D3.js
    - Force-directed graph
    - Nodos coloreados por tipo (nota, tarea, proyecto, reunión)
    - Aristas: sólidas para wikilinks, punteadas para asociaciones
    - Interacciones: zoom, pan, click para preview, doble-click para navegar
    - Crear en src/components/brain/KnowledgeGraph.tsx
    - _Requisitos: 9.1, 9.2, 9.3, 9.4_

  - [x] 23.3 Implementar vista de lista de notas con backlinks
    - Listar notas del usuario con búsqueda
    - Mostrar backlinks al seleccionar una nota
    - Crear en src/components/brain/NoteListView.tsx
    - _Requisitos: 8.3_

- [x] 24. Implementar componentes de reuniones
  - [x] 24.1 Crear componente de card de reunión
    - Mostrar título, hora, estado, enlace de Meet, proyecto asociado
    - Botón para procesar post-reunión
    - Crear en src/components/meetings/MeetingCard.tsx
    - _Requisitos: 6.1, 6.3_

  - [x] 24.2 Crear vista de reuniones con listado y calendario
    - Próximas reuniones ordenadas cronológicamente
    - Formulario para crear nueva reunión asociada a tarea/proyecto
    - Vista de resumen post-reunión (decisiones, action items)
    - Crear en src/components/meetings/MeetingsView.tsx
    - _Requisitos: 6.1, 6.3, 7.1_

- [x] 25. Implementar animaciones y accesibilidad
  - [x] 25.1 Aplicar animaciones con Framer Motion
    - Transiciones de navegación entre secciones (150-250ms con easing)
    - Animaciones de entrada/salida en listas y cards
    - Animación de drag & drop en Kanban
    - _Requisitos: 16.3, 16.5_

  - [x] 25.2 Implementar accesibilidad WCAG 2.1 AA
    - Roles ARIA en todos los componentes interactivos
    - Navegación por teclado completa
    - Contraste de colores y tamaños de fuente accesibles
    - Labels descriptivos en formularios
    - _Requisitos: 16.4_

- [x] 26. Implementar páginas de App Router
  - [x] 26.1 Crear páginas de autenticación
    - src/app/(auth)/login/page.tsx — Página de login OAuth2
    - _Requisitos: 15.1_

  - [x] 26.2 Crear páginas del dashboard
    - src/app/(dashboard)/tasks/page.tsx — Vistas de tareas
    - src/app/(dashboard)/projects/page.tsx — Lista de proyectos
    - src/app/(dashboard)/projects/[id]/page.tsx — Detalle de proyecto
    - src/app/(dashboard)/meetings/page.tsx — Reuniones
    - src/app/(dashboard)/brain/page.tsx — Second Brain (editor + grafo)
    - src/app/(dashboard)/search/page.tsx — Búsqueda semántica
    - _Requisitos: 3.1, 3.2, 3.3, 9.2, 14.1_

- [x] 27. Checkpoint — Verificar frontend completo
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 28. Integración final y wiring completo
  - [x] 28.1 Conectar Event Bus con todos los servicios
    - task.created → crear hilo + generar embedding
    - project.created → crear hilo
    - note.created/updated → actualizar enlaces + generar embedding
    - meeting.completed → disparar procesamiento post-reunión
    - agent.request → encolar en AgentQueue
    - _Requisitos: 4.1, 5.1, 7.1, 14.2_

  - [x] 28.2 Conectar frontend con API completa
    - Hooks custom para cada entidad (useTasks, useProjects, useNotes, useMeetings, useAgent)
    - Manejo de estados de carga y error
    - Optimistic updates en Kanban drag & drop
    - _Requisitos: 3.4, 16.5, 18.1_

  - [x] 28.3 Configurar Docker y docker-compose para desarrollo
    - Dockerfile para la aplicación Next.js
    - Dockerfile para el servicio Python de agentes (agents/)
    - docker-compose con PostgreSQL + pgvector, Next.js app y servicio de agentes Python
    - Variables de entorno para todas las integraciones
    - _Requisitos: 18.2_

- [x] 29. Checkpoint final — Verificar integración completa
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los property tests validan propiedades universales de correctitud usando fast-check
- Los unit tests validan ejemplos específicos y edge cases
- El lenguaje de implementación es TypeScript en todo el stack
