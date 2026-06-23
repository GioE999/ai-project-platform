# Documento de Requisitos — AI Project Platform

## Introducción

Plataforma web con agentes de IA para gestionar tareas y proyectos con estados, hilos de conversación, integración con Google Meet y un área tipo second brain. Está diseñada para profesionales técnicos que gestionan proyectos, reuniones y aprendizaje continuo, accesible vía navegador con diseño responsive.

## Glosario

- **Plataforma**: La aplicación web AI Project Platform en su totalidad.
- **Sistema_Tareas**: Módulo responsable de la gestión de tareas y proyectos.
- **Sistema_Conversación**: Módulo que gestiona los hilos de conversación por tarea y proyecto.
- **Sistema_Reuniones**: Módulo de integración con Google Meet y Google Calendar.
- **Sistema_SecondBrain**: Módulo de notas en Markdown con enlaces bidireccionales y grafo de conocimiento.
- **Sistema_Agentes**: Arquitectura multi-agente que coordina los agentes de IA.
- **RootAgent**: Agente orquestador que enruta solicitudes entre subagentes.
- **TaskManagerAgent**: Agente que gestiona tareas y proyectos.
- **ProjectPlannerAgent**: Agente que genera planes a partir de objetivos.
- **ConversationAgent**: Agente que maneja los hilos de conversación.
- **MeetingAgent**: Agente que gestiona la integración con Google Meet y Calendar.
- **SecondBrainAgent**: Agente que gestiona las notas estilo second brain.
- **EvaluatorAgent**: Agente que evalúa calidad de planes, respuestas y resúmenes.
- **Tarea**: Unidad de trabajo con estado, prioridad y dependencias opcionales.
- **Proyecto**: Agrupación de tareas con un objetivo común.
- **Hilo_Conversación**: Secuencia ordenada de mensajes asociada a una tarea o proyecto.
- **Nota**: Documento en formato Markdown almacenado en el sistema Second Brain.
- **Wikilink**: Enlace bidireccional entre notas usando la sintaxis `[[concepto]]`.
- **Grafo_Conocimiento**: Representación visual de nodos (notas) y aristas (enlaces entre notas).
- **Action_Item**: Acción concreta extraída de una reunión, asignable como tarea.
- **RAG**: Retrieval-Augmented Generation, técnica que combina búsqueda semántica con generación de texto.
- **Usuario**: Persona autenticada que interactúa con la Plataforma.

## Requisitos

### Requisito 1: Creación y Edición de Tareas

**User Story:** Como Usuario, quiero crear, editar y eliminar tareas con estados, prioridades y dependencias, para organizar mi trabajo de forma estructurada.

#### Criterios de Aceptación

1. WHEN el Usuario solicita crear una tarea con nombre y descripción, THE Sistema_Tareas SHALL crear la Tarea con estado inicial "pending" y prioridad "medium" por defecto.
2. WHEN el Usuario edita una Tarea existente, THE Sistema_Tareas SHALL actualizar los campos modificados y registrar la fecha de última modificación.
3. WHEN el Usuario elimina una Tarea, THE Sistema_Tareas SHALL remover la Tarea y desasociar las dependencias relacionadas.
4. WHEN el Usuario asigna un estado a una Tarea, THE Sistema_Tareas SHALL validar que el estado sea uno de: pending, in_progress, completed, blocked, review.
5. WHEN el Usuario asigna una prioridad a una Tarea, THE Sistema_Tareas SHALL validar que la prioridad sea una de: low, medium, high.
6. WHEN el Usuario define una dependencia entre dos Tareas, THE Sistema_Tareas SHALL registrar la relación y validar que no se formen ciclos de dependencia.
7. IF el Usuario intenta crear una dependencia circular, THEN THE Sistema_Tareas SHALL rechazar la operación y mostrar un mensaje de error descriptivo.

### Requisito 2: Gestión de Proyectos

**User Story:** Como Usuario, quiero agrupar tareas en proyectos, para tener una visión organizada de mis iniciativas.

#### Criterios de Aceptación

1. WHEN el Usuario crea un Proyecto con nombre y descripción, THE Sistema_Tareas SHALL crear el Proyecto y asociarlo al Usuario.
2. WHEN el Usuario asocia una Tarea a un Proyecto, THE Sistema_Tareas SHALL registrar la relación entre la Tarea y el Proyecto.
3. WHEN el Usuario solicita ver un Proyecto, THE Sistema_Tareas SHALL mostrar el Proyecto con todas sus Tareas asociadas, sus estados y prioridades.
4. WHEN el Usuario elimina un Proyecto, THE Sistema_Tareas SHALL solicitar confirmación y permitir elegir entre eliminar las Tareas asociadas o desasociarlas.

### Requisito 3: Vistas de Tareas (Lista, Kanban, Calendario)

**User Story:** Como Usuario, quiero visualizar mis tareas en diferentes formatos, para elegir la vista que mejor se adapte a mi flujo de trabajo.

#### Criterios de Aceptación

1. THE Sistema_Tareas SHALL ofrecer una vista de lista con las Tareas ordenables por prioridad, estado o fecha de creación.
2. THE Sistema_Tareas SHALL ofrecer una vista Kanban con columnas correspondientes a cada estado de tarea (pending, in_progress, completed, blocked, review).
3. THE Sistema_Tareas SHALL ofrecer una vista de calendario que muestre las Tareas según sus fechas límite.
4. WHEN el Usuario arrastra una Tarea entre columnas en la vista Kanban, THE Sistema_Tareas SHALL actualizar el estado de la Tarea al estado correspondiente a la columna destino.
5. WHEN el Usuario cambia de vista, THE Sistema_Tareas SHALL renderizar la nueva vista en menos de 300ms percibidos.

### Requisito 4: Hilos de Conversación por Tarea

**User Story:** Como Usuario, quiero tener un hilo de conversación asociado a cada tarea, para centralizar discusiones y decisiones relevantes.

#### Criterios de Aceptación

1. WHEN el Usuario crea una Tarea, THE Sistema_Conversación SHALL crear automáticamente un Hilo_Conversación asociado a esa Tarea.
2. WHEN el Usuario publica un mensaje en un Hilo_Conversación, THE Sistema_Conversación SHALL almacenar el mensaje con autor, fecha y contenido, y mostrarlo en orden cronológico.
3. WHEN el Usuario menciona otra Tarea, Proyecto o Nota usando la sintaxis de mención, THE Sistema_Conversación SHALL crear un enlace navegable al recurso mencionado.
4. WHEN el Usuario solicita intervención del agente IA en un Hilo_Conversación, THE ConversationAgent SHALL responder con clarificaciones, resúmenes o propuestas de siguientes pasos según el contexto del hilo.
5. THE Sistema_Conversación SHALL persistir el historial completo de mensajes de cada Hilo_Conversación.

### Requisito 5: Hilos de Conversación por Proyecto

**User Story:** Como Usuario, quiero un hilo de conversación general por proyecto, para discutir temas transversales que afectan a múltiples tareas.

#### Criterios de Aceptación

1. WHEN el Usuario crea un Proyecto, THE Sistema_Conversación SHALL crear automáticamente un Hilo_Conversación general asociado a ese Proyecto.
2. WHEN el ConversationAgent genera un resumen de reunión o estado de proyecto, THE Sistema_Conversación SHALL publicar el resumen en el Hilo_Conversación del Proyecto correspondiente.
3. WHEN el Usuario menciona a otro Usuario en un Hilo_Conversación de Proyecto, THE Sistema_Conversación SHALL notificar al Usuario mencionado.

### Requisito 6: Integración con Google Meet — Creación de Reuniones

**User Story:** Como Usuario, quiero crear reuniones de Google Meet desde la plataforma ligadas a tareas o proyectos, para coordinar trabajo sin salir de la herramienta.

#### Criterios de Aceptación

1. WHEN el Usuario solicita crear una reunión asociada a una Tarea o Proyecto, THE Sistema_Reuniones SHALL crear un evento en Google Calendar con enlace de Google Meet.
2. WHEN el Sistema_Reuniones crea una reunión, THE Sistema_Reuniones SHALL almacenar la referencia del evento y asociarla a la Tarea o Proyecto correspondiente.
3. WHEN el Usuario consulta próximas reuniones, THE Sistema_Reuniones SHALL mostrar las reuniones relacionadas a sus Proyectos y Tareas ordenadas cronológicamente.
4. IF la creación del evento en Google Calendar falla, THEN THE Sistema_Reuniones SHALL notificar al Usuario con un mensaje de error descriptivo y registrar el fallo en el log.

### Requisito 7: Procesamiento Post-Reunión con IA

**User Story:** Como Usuario, quiero que la plataforma genere automáticamente un resumen, decisiones y action items después de una reunión, para no perder información valiosa.

#### Criterios de Aceptación

1. WHEN una reunión finaliza, THE MeetingAgent SHALL generar un resumen estructurado con: resumen general, lista de decisiones tomadas y lista de Action_Items con responsables y fechas.
2. WHEN el MeetingAgent identifica Action_Items, THE TaskManagerAgent SHALL crear Tareas asociadas al Proyecto o Tarea de la reunión con los responsables y fechas extraídos.
3. WHEN el MeetingAgent genera el resumen, THE SecondBrainAgent SHALL crear una Nota en formato Markdown con el contenido del resumen y actualizarlo en el Grafo_Conocimiento.
4. WHEN el MeetingAgent completa el procesamiento post-reunión, THE ConversationAgent SHALL publicar el resumen en el Hilo_Conversación del Proyecto asociado.
5. IF el MeetingAgent no puede procesar la reunión por falta de datos, THEN THE MeetingAgent SHALL notificar al Usuario indicando qué información falta.

### Requisito 8: Notas en Formato Markdown (Second Brain)

**User Story:** Como Usuario, quiero crear y gestionar notas en formato Markdown con enlaces bidireccionales, para construir mi base de conocimiento personal.

#### Criterios de Aceptación

1. WHEN el Usuario crea una Nota, THE Sistema_SecondBrain SHALL almacenar el contenido en formato Markdown y registrar la fecha de creación.
2. WHEN el Usuario incluye un Wikilink `[[concepto]]` en una Nota, THE Sistema_SecondBrain SHALL crear un enlace bidireccional entre la Nota actual y la Nota referenciada.
3. WHEN el Usuario consulta una Nota, THE Sistema_SecondBrain SHALL mostrar los backlinks (notas que enlazan a la Nota actual).
4. WHEN el Usuario edita una Nota, THE Sistema_SecondBrain SHALL actualizar el contenido y recalcular los enlaces bidireccionales.
5. IF el Usuario crea un Wikilink a una Nota inexistente, THEN THE Sistema_SecondBrain SHALL crear un enlace pendiente y ofrecer la opción de crear la Nota referenciada.
6. THE Sistema_SecondBrain SHALL parsear el contenido Markdown de cada Nota para extraer Wikilinks.
7. THE Sistema_SecondBrain SHALL formatear las Notas desde su representación interna a Markdown válido para renderizado.
8. FOR ALL Notas válidas, parsear y luego formatear y luego parsear SHALL producir un objeto equivalente al original (propiedad round-trip).

### Requisito 9: Grafo de Conocimiento

**User Story:** Como Usuario, quiero visualizar un grafo de conocimiento con mis notas y sus relaciones, para descubrir conexiones entre conceptos.

#### Criterios de Aceptación

1. THE Sistema_SecondBrain SHALL representar cada Nota como un nodo y cada Wikilink como una arista en el Grafo_Conocimiento.
2. WHEN el Usuario abre la vista de Grafo_Conocimiento, THE Sistema_SecondBrain SHALL renderizar el grafo con nodos y aristas interactivos.
3. WHEN el Usuario selecciona un nodo en el Grafo_Conocimiento, THE Sistema_SecondBrain SHALL mostrar una vista previa de la Nota correspondiente.
4. WHEN el Usuario crea o elimina un Wikilink, THE Sistema_SecondBrain SHALL actualizar el Grafo_Conocimiento reflejando el cambio.
5. WHEN el Usuario solicita sugerencias de conexiones, THE SecondBrainAgent SHALL analizar el contenido de las Notas y proponer Wikilinks entre Notas relacionadas semánticamente.

### Requisito 10: Asociación de Notas con Tareas, Proyectos y Reuniones

**User Story:** Como Usuario, quiero asociar notas con tareas, proyectos y reuniones, para tener un contexto enriquecido de cada elemento.

#### Criterios de Aceptación

1. WHEN el Usuario asocia una Nota a una Tarea, Proyecto o reunión, THE Sistema_SecondBrain SHALL registrar la asociación bidireccional.
2. WHEN el Usuario consulta una Tarea, Proyecto o reunión, THE Plataforma SHALL mostrar las Notas asociadas como referencias contextuales.
3. WHEN el Usuario consulta una Nota, THE Sistema_SecondBrain SHALL mostrar las Tareas, Proyectos y reuniones asociados.

### Requisito 11: Capacidades del SecondBrainAgent

**User Story:** Como Usuario, quiero que el agente IA resuma notas, sugiera conexiones y responda preguntas sobre mi base de conocimiento, para aprovechar la información acumulada.

#### Criterios de Aceptación

1. WHEN el Usuario solicita un resumen de una Nota extensa, THE SecondBrainAgent SHALL generar un resumen conciso preservando las ideas principales.
2. WHEN el Usuario hace una pregunta sobre su base de conocimiento, THE SecondBrainAgent SHALL realizar una búsqueda semántica (RAG) sobre las Notas indexadas y responder con información relevante citando las fuentes.
3. WHEN el SecondBrainAgent sugiere conexiones entre Notas, THE SecondBrainAgent SHALL basar las sugerencias en similitud semántica del contenido y presentarlas como Wikilinks opcionales.
4. IF el SecondBrainAgent no encuentra información relevante para una consulta, THEN THE SecondBrainAgent SHALL indicar que no se encontró información y sugerir términos de búsqueda alternativos.

### Requisito 12: Agente Planner para Proyectos

**User Story:** Como Usuario, quiero que un agente IA genere planes de proyecto paso a paso a partir de un objetivo, para acelerar la planificación.

#### Criterios de Aceptación

1. WHEN el Usuario proporciona un objetivo de proyecto, THE ProjectPlannerAgent SHALL generar un plan estructurado con Tareas, prioridades, dependencias y tiempos estimados.
2. WHEN el ProjectPlannerAgent genera un plan, THE TaskManagerAgent SHALL crear las Tareas propuestas en el Proyecto correspondiente con los atributos generados.
3. WHEN el Usuario solicita reevaluar un plan basándose en el progreso real, THE ProjectPlannerAgent SHALL analizar el estado actual de las Tareas y proponer ajustes al plan.
4. WHEN el Usuario solicita un resumen de estado de proyecto, THE ProjectPlannerAgent SHALL generar un resumen con progreso, riesgos y próximos pasos.
5. THE EvaluatorAgent SHALL evaluar la calidad de los planes generados por el ProjectPlannerAgent antes de presentarlos al Usuario.

### Requisito 13: Orquestación Multi-Agente

**User Story:** Como Usuario, quiero que los agentes cooperen de forma transparente, para obtener respuestas y acciones coordinadas sin intervención manual.

#### Criterios de Aceptación

1. WHEN el Usuario envía una solicitud, THE RootAgent SHALL determinar qué subagente o combinación de subagentes debe procesarla y enrutar la solicitud.
2. WHEN una operación requiere colaboración entre agentes (por ejemplo, reunión → notas → tareas), THE RootAgent SHALL coordinar la secuencia de acciones entre MeetingAgent, SecondBrainAgent, TaskManagerAgent y ConversationAgent.
3. THE Sistema_Agentes SHALL registrar un log estructurado de cada decisión tomada por los agentes, incluyendo el agente involucrado, la acción y el resultado.
4. IF un agente falla al procesar una solicitud, THEN THE RootAgent SHALL reintentar con el mismo agente una vez, y si falla nuevamente, notificar al Usuario con un mensaje descriptivo del error.
5. THE EvaluatorAgent SHALL evaluar la calidad de las respuestas generadas por los agentes antes de entregarlas al Usuario.

### Requisito 14: Búsqueda Semántica y Vectorial

**User Story:** Como Usuario, quiero realizar búsquedas semánticas sobre mis notas, tareas y resúmenes de reuniones, para encontrar información relevante independientemente de las palabras exactas usadas.

#### Criterios de Aceptación

1. WHEN el Usuario realiza una búsqueda semántica, THE Plataforma SHALL buscar en los vectores indexados de Notas, Tareas y resúmenes de reuniones y retornar los resultados más relevantes.
2. WHEN el Usuario crea o actualiza una Nota, Tarea o resumen de reunión, THE Plataforma SHALL generar y almacenar el embedding vectorial del contenido.
3. THE Plataforma SHALL indexar embeddings en pgvector o base de datos vectorial equivalente para consultas de similitud semántica.
4. WHEN el Usuario ejecuta una consulta semántica, THE Plataforma SHALL retornar resultados en menos de 500ms para conjuntos de hasta 100,000 documentos indexados.

### Requisito 15: Autenticación y Seguridad

**User Story:** Como Usuario, quiero que la plataforma proteja mis datos con autenticación segura y control de acceso, para mantener la privacidad de mi información.

#### Criterios de Aceptación

1. THE Plataforma SHALL autenticar a los Usuarios mediante OAuth2 con soporte para JWT como token de sesión.
2. WHEN un Usuario intenta acceder a un recurso de otro Usuario, THE Plataforma SHALL denegar el acceso y retornar un error de autorización.
3. THE Plataforma SHALL proteger todas las entradas de usuario contra inyección XSS y ataques CSRF.
4. THE Plataforma SHALL proteger las interacciones con agentes IA contra inyecciones de prompts mediante validación y sanitización de entradas.
5. IF un token JWT expira, THEN THE Plataforma SHALL solicitar re-autenticación al Usuario sin pérdida de datos no guardados.

### Requisito 16: Interfaz de Usuario y Experiencia (UX/UI)

**User Story:** Como Usuario, quiero una interfaz limpia, responsive y con animaciones intencionales, para tener una experiencia fluida y agradable.

#### Criterios de Aceptación

1. THE Plataforma SHALL renderizar correctamente en navegadores de escritorio y dispositivos móviles con diseño responsive.
2. THE Plataforma SHALL utilizar una jerarquía visual clara con tipografía, espaciado y colores consistentes en todos los componentes.
3. WHEN el Usuario interactúa con elementos de la interfaz, THE Plataforma SHALL mostrar animaciones de transición entre 150ms y 250ms con easing apropiado.
4. THE Plataforma SHALL cumplir con criterios de accesibilidad WCAG 2.1 nivel AA.
5. WHEN el Usuario navega entre secciones, THE Plataforma SHALL completar la transición de navegación en menos de 300ms percibidos.

### Requisito 17: Observabilidad y Monitoreo

**User Story:** Como administrador, quiero monitorear el comportamiento de la plataforma y los agentes, para detectar problemas y optimizar costos.

#### Criterios de Aceptación

1. THE Plataforma SHALL generar logs estructurados de todas las decisiones de los agentes IA con timestamp, agente, acción y resultado.
2. THE Plataforma SHALL registrar métricas de latencia de respuesta, tokens consumidos y costo estimado por operación de agente.
3. THE Plataforma SHALL exponer métricas en formato compatible con Prometheus para integración con Grafana.
4. WHEN la latencia de un agente supera los 10 segundos, THE Plataforma SHALL registrar una alerta en el sistema de monitoreo.

### Requisito 18: Rendimiento y Escalabilidad

**User Story:** Como Usuario, quiero que la plataforma responda rápidamente y soporte mi crecimiento de datos, para no experimentar degradación con el uso.

#### Criterios de Aceptación

1. THE Plataforma SHALL responder a operaciones CRUD de Tareas y Proyectos en menos de 200ms bajo condiciones normales de carga.
2. THE Plataforma SHALL soportar despliegue contenedorizado con Docker para escalado horizontal.
3. WHEN el Usuario realiza operaciones que involucran agentes IA, THE Plataforma SHALL mostrar un indicador de progreso y streaming de respuestas parciales.
4. THE Plataforma SHALL manejar llamadas concurrentes a LLMs mediante un sistema de cola con prioridades para evitar saturación.
