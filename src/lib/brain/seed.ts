// ============================================================
// HYPERBRAIN — Fase 2: Archivo Semilla Masivo de Topics
// 22 Topics con Initial Knowledge Items
// Archivo: src/lib/seeds/hyperbrain-topics.seed.ts
// ============================================================

export type LifeArea =
  | "SCIENTIFIC"
  | "TECH"
  | "CULTURAL"
  | "PERSONAL"
  | "PHILOSOPHICAL"
  | "ECONOMIC";

export type KnowledgeType =
  | "brain-note"
  | "research"
  | "meeting-note"
  | "idea"
  | "routine-note"
  | "action-item";

export type KnowledgeStatus = "draft" | "completed" | "published" | "archived";

export type LearningType = "FACT" | "INSIGHT" | "SKILL" | "REFLECTION" | "QUOTE";
export type LearningSource =
  | "BOOK"
  | "ARTICLE"
  | "EXPERIENCE"
  | "VIDEO"
  | "CONVERSATION";

// ─────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────

export interface SeedLearning {
  content: string;
  type: LearningType;
  source: LearningSource;
}

export interface SeedKnowledgeNote {
  title: string;
  content: string;
  type: KnowledgeType;
  status: KnowledgeStatus;
  tags: string[];
}

export interface SeedTopic {
  name: string;
  slug: string;
  icon: string;
  color: string;
  lifeArea: LifeArea;
  description: string;
  tags: string[];
  initialNotes: SeedKnowledgeNote[];
  initialLearnings: SeedLearning[];
}

// ─────────────────────────────────────────────
// 22 TOPICS SEMILLA
// ─────────────────────────────────────────────

export const HYPERBRAIN_TOPICS_SEED: SeedTopic[] = [

  // ══════════════════════════════════════════
  // 1. SALUD & BIENESTAR
  // ══════════════════════════════════════════
  {
    name: "Salud & Bienestar",
    slug: "salud-bienestar",
    icon: "🧬",
    color: "#22c55e",
    lifeArea: "SCIENTIFIC",
    description: "Nutrición, ejercicio, sueño, salud mental y longevidad. El sistema operativo del cuerpo.",
    tags: ["nutrición", "ejercicio", "sueño", "longevidad", "salud-mental"],
    initialNotes: [
      {
        title: "Pilares del bienestar físico",
        content: `## Los 4 pilares del bienestar físico\n\n- **Nutrición:** proteína 1.6–2.2 g/kg peso corporal, priorizar alimentos reales\n- **Ejercicio:** entrenamiento de fuerza 3x/semana + zona 2 cardiovascular\n- **Sueño:** 7–9 horas, consistencia de horario clave\n- **Gestión del estrés:** meditación, respiración, tiempo en naturaleza\n\n[[Rutinas de ejercicio]] [[Skincare]]`,
        type: "brain-note",
        status: "published",
        tags: ["bienestar", "fundamentos"],
      },
      {
        title: "Protocolo de skincare diario",
        content: `## Mañana\n1. Limpiador suave\n2. Vitamina C (antioxidante)\n3. Hidratante\n4. SPF 50+\n\n## Noche\n1. Limpiador\n2. Retinol (3x/semana)\n3. Hidratante\n\n> Consistencia > productos caros.`,
        type: "routine-note",
        status: "published",
        tags: ["skincare", "rutina"],
      },
      {
        title: "Rutina de Fuerza — Guía Completa (Versión 1.0)",
        content: `## Marco científico\n\nBasada en ACSM 2025, NSCA Position Stand y meta-análisis 2018–2026.\n\n### Principios rectores\n- **Sobrecarga progresiva**: el músculo se adapta; para seguir adaptándose, el estímulo debe crecer gradualmente\n- **Frecuencia**: 2–3 sesiones/semana por grupo muscular con 48–72h de recuperación\n- **Volumen**: 10–20 series semanales por grupo muscular\n- **Intensidad**: principiante 60–70% 1RM; intermedio 70–85%; avanzado 80–100%\n- **Nutrición**: proteína 1.6–2.2 g/kg/día; sueño 7–9h\n\n## Reglas de oro\n\n1. **Técnica antes que peso** — si la técnica falla, bajas el peso\n2. **Progresión mínima garantizada** — si completaste todo con buena técnica, sube 2.5–5 kg\n3. **El descanso es entrenamiento** — sin 48–72h y sin dormir 7–9h, no crece\n4. **Consistencia > intensidad** — 3x/semana durante 6 meses supera cualquier programa perfecto incompleto\n5. **Registra todo** — peso, series, reps y sensación post-entrenamiento\n\n## Respiración correcta\n\n- **Excéntrica (bajada):** Inhala profundo (diafragma)\n- **Antes de concéntrica:** Maniobra de Valsalva suave (estabiliza columna)\n- **Concéntrica (subida):** Exhala controlado al superar punto difícil\n- Simplificado: “Inhala abajo, exhala arriba”\n\n## Calentamiento (10–15 min siempre)\n\n| Fase | Actividad | Tiempo |\n|------|-----------|--------|\n| Cardio suave | Caminata rápida / bici | 5 min |\n| Movilidad articular | Círculos de cadera, hombros, muñecas | 3 min |\n| Activación | Puentes de cadera, band pulls | 2 min |\n| Series activación | 1–2 series al 40–50% | 2–3 min |\n\n## VERSIÓN 1 (Meses 0–3) — Full Body A/B\n\n**Workout A (Lun/Mié/Vie alternado)**\n- Sentadilla 3x8-10 (60-65% 1RM) — 2 min descanso\n- Press banca 3x8-10 (60-65% 1RM) — 2 min descanso\n- Remo inclinado 3x8-10 (60-65% 1RM) — 2 min descanso\n- Plancha frontal 3x30s — 1 min descanso\n\n**Workout B**\n- Peso muerto 3x6-8 (60-65% 1RM) — 3 min descanso\n- Press militar 3x8-10 (60-65% 1RM) — 2 min descanso\n- Jalón al pecho / dominadas 3x8-10 — 2 min descanso\n- Zancadas 3x10 c/pierna — 1.5 min descanso\n\n**Progresión V1:** completas todo con buena técnica → +2.5kg siguiente sesión (pierna/espalda: +5kg). 3 fallos seguidos → -10% y reconstruir.\n\n## VERSIÓN 2 (Meses 3–8) — Upper/Lower 4x/semana\n\nIntensidad sube a 70–80% 1RM, split Upper/Lower, doble progresión, deload cada 4–6 semanas.\n\n## VERSIÓN 3 (Meses 8–18+) — Push/Pull/Legs\n\nPeriodización ondulante diaria (DUP), 15–20 series/semana/grupo, técnicas de intensidad moderadas.\n\n## Nutrición\n\n| Variable | Recomendación |\n|----------|---------------|\n| Proteína | 1.6–2.2 g/kg/día en 3–4 comidas |\n| Pre-sueño | 20–40g caseína 30min antes de dormir |\n| Carbohidratos | 3–6 g/kg/día |\n| Superávit | 200–500 kcal/día en volumen |\n| Hidratación | 35–40 ml/kg/día |\n| Sueño | 7–9h obligatorias |\n\n## Indicadores de progreso\n\n- Peso corporal (semanal, misma hora)\n- Medidas: brazo, pecho, cintura, muslo (mensual)\n- Cargas por ejercicio (cada sesión)\n- Calidad de sueño (1–10 + horas)\n- RPE post-sesión (1–10)\n- Cumplimiento: sesiones planeadas vs realizadas\n\n## Deload (cada 4–6 semanas)\n\nVolumen al 50%, peso al 60–70%. Se mantienen los días. Post-deload = mejores PRs.`,
        type: "brain-note",
        status: "published",
        tags: ["fuerza", "gym", "programa", "progresión", "nutrición"],
      },
    ],
    initialLearnings: [
      { content: "La proteína recomendada para hipertrofia es 1.6–2.2 g/kg de peso corporal al día.", type: "FACT", source: "BOOK" },
      { content: "El sueño de onda lenta (fase 3) es crítico para la consolidación de la memoria procedimental.", type: "FACT", source: "BOOK" },
      { content: "El entrenamiento de zona 2 (conversacional) mejora la eficiencia mitocondrial más que el HIIT diario.", type: "INSIGHT", source: "ARTICLE" },
      { content: "La inflamación crónica de bajo grado es el denominador común de la mayoría de enfermedades modernas.", type: "INSIGHT", source: "BOOK" },
      { content: "El context switching cuesta ~23 min de recuperación. Inhala abajo, exhala arriba: patrón correcto de respiración en fuerza.", type: "FACT", source: "ARTICLE" },
      { content: "Las ganancias de fuerza en principiantes (meses 0-3) son principalmente neurales, no hipertrofia muscular.", type: "FACT", source: "BOOK" },
      { content: "Progresión lineal: si completas todas las series/reps con buena técnica, sube 2.5kg la próxima sesión.", type: "SKILL", source: "EXPERIENCE" },
      { content: "20–40g de caseína antes de dormir mejora síntesis proteica nocturna y fuerza en 10–12 semanas.", type: "FACT", source: "ARTICLE" },
      { content: "Semanas post-deload frecuentemente son las de mayores PRs. La deload consolida adaptaciones del SNC.", type: "INSIGHT", source: "ARTICLE" },
      { content: "RIR 1–3 (reps en reserva) es más efectivo para principiantes que entrenar al fallo absoluto.", type: "INSIGHT", source: "ARTICLE" },
    ],
  },

  // ══════════════════════════════════════════
  // 2. PRODUCTIVIDAD & SISTEMAS PERSONALES
  // ══════════════════════════════════════════
  {
    name: "Productividad & Sistemas",
    slug: "productividad-sistemas",
    icon: "⚙️",
    color: "#f59e0b",
    lifeArea: "PERSONAL",
    description: "GTD, PKM, deep work, gestión del tiempo y construcción de sistemas personales de alto rendimiento.",
    tags: ["gtd", "deep-work", "pkm", "hábitos", "sistemas"],
    initialNotes: [
      {
        title: "Sistema personal de captura y procesamiento",
        content: `## Flujo de captura\n\n1. **Captura** → inbox único (app de notas)\n2. **Clarificación** → ¿es accionable?\n3. **Organización** → proyecto / referencia / eliminar\n4. **Revisión** → semanal (1h) + mensual (2h)\n5. **Ejecución** → bloques de deep work 90min\n\n[[Deep Work]] [[Second Brain]]`,
        type: "brain-note",
        status: "published",
        tags: ["gtd", "captura", "sistema"],
      },
    ],
    initialLearnings: [
      { content: "El contexto switching cuesta ~23 minutos de recuperación de foco completo.", type: "FACT", source: "ARTICLE" },
      { content: "Los rituales de inicio y cierre del día definen la calidad de toda la jornada laboral.", type: "INSIGHT", source: "BOOK" },
      { content: "Lo que no está en el sistema no existe. Si no está escrito y organizado, tu cerebro gasta energía recordándolo.", type: "QUOTE", source: "BOOK" },
      { content: "Las 2 horas de mayor energía del día (para la mayoría, las primeras de la mañana) deben protegerse para trabajo cognitivo profundo.", type: "INSIGHT", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 3. INTELIGENCIA ARTIFICIAL
  // ══════════════════════════════════════════
  {
    name: "Inteligencia Artificial",
    slug: "inteligencia-artificial",
    icon: "🤖",
    color: "#6366f1",
    lifeArea: "TECH",
    description: "LLMs, agentes de IA, prompt engineering, RAG, fine-tuning y el futuro de la inteligencia artificial.",
    tags: ["llm", "agentes", "prompt-engineering", "rag", "fine-tuning"],
    initialNotes: [
      {
        title: "Arquitectura de agentes de voz con Retell AI",
        content: `## Componentes de un agente de voz\n\n- **LLM Engine:** Claude Sonnet / GPT-4o como cerebro\n- **TTS/STT:** síntesis y reconocimiento de voz en tiempo real\n- **Flow Manager:** lógica de conversación y estados\n- **Tool Calls:** integraciones con APIs externas\n- **Context Window:** memoria de la sesión\n\n## Patrones de diseño\n\n1. Keep it stateless — el estado va en el backend\n2. Latencia < 800ms para respuesta natural\n3. Fallback graceful cuando el LLM falla\n\n[[Retell AI]] [[MCP Integration]]`,
        type: "brain-note",
        status: "published",
        tags: ["voz", "agentes", "retell"],
      },
      {
        title: "Técnicas de Prompt Engineering",
        content: `## Chain of Thought (CoT)\nPedir al modelo que piense paso a paso antes de responder.\n\n## Few-shot prompting\nDar 2–5 ejemplos del formato esperado antes de la tarea real.\n\n## System prompt estructurado\n\`\`\`\nRol → Contexto → Restricciones → Formato de salida\n\`\`\`\n\n## ReAct Pattern\nRazón + Acción + Observación en ciclos para agentes.`,
        type: "brain-note",
        status: "published",
        tags: ["prompts", "técnicas"],
      },
    ],
    initialLearnings: [
      { content: "Los modelos de razonamiento (o1, R1) usan chain-of-thought interno, lo que los hace mejores en matemáticas y código pero más lentos.", type: "FACT", source: "ARTICLE" },
      { content: "RAG (Retrieval Augmented Generation) reduce alucinaciones al anclar las respuestas en documentos reales recuperados por similitud vectorial.", type: "FACT", source: "ARTICLE" },
      { content: "Un buen system prompt vale más que un modelo más caro. El 80% de la calidad de un agente viene del diseño del prompt.", type: "INSIGHT", source: "EXPERIENCE" },
      { content: "Los agentes multi-herramienta fallan más en la orquestación que en las herramientas individuales.", type: "INSIGHT", source: "EXPERIENCE" },
    ],
  },

  // ══════════════════════════════════════════
  // 4. DESARROLLO DE SOFTWARE
  // ══════════════════════════════════════════
  {
    name: "Desarrollo de Software",
    slug: "desarrollo-software",
    icon: "💻",
    color: "#0ea5e9",
    lifeArea: "TECH",
    description: "Arquitectura, patrones de diseño, clean code, DevOps, bases de datos y mejores prácticas de ingeniería.",
    tags: ["arquitectura", "clean-code", "devops", "bases-de-datos", "typescript"],
    initialNotes: [
      {
        title: "Principios de arquitectura limpia",
        content: `## SOLID en la práctica\n\n- **S** — Una clase/módulo, una razón para cambiar\n- **O** — Abierto para extensión, cerrado para modificación\n- **L** — Las subclases deben poder reemplazar a las bases\n- **I** — Interfaces específicas > una interfaz general\n- **D** — Depender de abstracciones, no de implementaciones\n\n## Capas de arquitectura\n\n\`Presentación → Aplicación → Dominio → Infraestructura\`\n\nLas dependencias SIEMPRE van hacia adentro (hacia el dominio).`,
        type: "brain-note",
        status: "published",
        tags: ["solid", "arquitectura", "clean-code"],
      },
    ],
    initialLearnings: [
      { content: "El código se lee 10 veces más de lo que se escribe. Optimiza para legibilidad.", type: "QUOTE", source: "BOOK" },
      { content: "Los tests de integración dan más confianza que los unitarios solos. Testea comportamiento, no implementación.", type: "INSIGHT", source: "EXPERIENCE" },
      { content: "PostgreSQL con índices bien diseñados puede manejar millones de registros sin necesitar NoSQL.", type: "FACT", source: "EXPERIENCE" },
      { content: "TypeScript strict mode elimina ~70% de bugs en runtime antes de que lleguen a producción.", type: "FACT", source: "EXPERIENCE" },
    ],
  },

  // ══════════════════════════════════════════
  // 5. NEUROCIENCIA & APRENDIZAJE
  // ══════════════════════════════════════════
  {
    name: "Neurociencia & Aprendizaje",
    slug: "neurociencia-aprendizaje",
    icon: "🧠",
    color: "#ec4899",
    lifeArea: "SCIENTIFIC",
    description: "Cómo funciona el cerebro, plasticidad neuronal, técnicas de aprendizaje acelerado y memoria.",
    tags: ["plasticidad", "memoria", "aprendizaje", "cognición", "neuroplasticidad"],
    initialNotes: [
      {
        title: "Técnicas de aprendizaje basadas en evidencia",
        content: `## Las 3 técnicas más efectivas (meta-análisis)\n\n1. **Práctica de recuperación (Retrieval Practice)**\nTestear lo que aprendiste > releer. Flashcards, quizzes.\n\n2. **Práctica espaciada (Spaced Repetition)**\nRevisar en intervalos crecientes: 1d → 3d → 7d → 21d → 60d\n\n3. **Interleaving**\nMezclar temas similares en lugar de bloquear uno por uno.\n\n## Lo que NO funciona\n- Subrayar y releer (bajo impacto)\n- Estudiar en un solo bloque largo (sin spacing)`,
        type: "brain-note",
        status: "published",
        tags: ["técnicas", "memoria", "evidencia"],
      },
    ],
    initialLearnings: [
      { content: "La práctica de recuperación (retrieval practice) es la técnica de aprendizaje con mayor evidencia científica respaldando su efectividad.", type: "FACT", source: "BOOK" },
      { content: "El sueño consolida el aprendizaje: el hipocampo transfiere memorias a la corteza durante el sueño profundo.", type: "FACT", source: "BOOK" },
      { content: "El estado de 'dificultad deseable' (slightly difficult) es donde ocurre el aprendizaje real. Si es muy fácil, no hay plasticidad.", type: "INSIGHT", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 6. FILOSOFÍA & PENSAMIENTO CRÍTICO
  // ══════════════════════════════════════════
  {
    name: "Filosofía & Pensamiento",
    slug: "filosofia-pensamiento",
    icon: "🏛️",
    color: "#8b5cf6",
    lifeArea: "PHILOSOPHICAL",
    description: "Estoicismo, epistemología, ética, lógica y marcos mentales para vivir mejor.",
    tags: ["estoicismo", "ética", "lógica", "epistemología", "marcos-mentales"],
    initialNotes: [
      {
        title: "Principios estoicos aplicados",
        content: `## Dicotomía del control (Epicteto)\n\nHay dos categorías:\n- **En tu control:** opiniones, deseos, acciones\n- **Fuera de tu control:** reputación, cuerpo, propiedades\n\nLa ecuanimidad viene de invertir energía SÓLO en lo primero.\n\n## Memento Mori\nRecordar la muerte no para entristecerse, sino para valorar el presente.\n\n## Amor Fati\nNo sólo aceptar lo que sucede, sino amarlo como necesario.`,
        type: "brain-note",
        status: "published",
        tags: ["estoicismo", "control", "ecuanimidad"],
      },
    ],
    initialLearnings: [
      { content: "Los sesgos cognitivos no son fallas del cerebro — son atajos evolutivos que en el mundo moderno se vuelven trampas.", type: "INSIGHT", source: "BOOK" },
      { content: "La pregunta filosófica más práctica: '¿Esto estará en mi control en 5 años?' Si no, suéltalo ahora.", type: "REFLECTION", source: "BOOK" },
      { content: "El pensamiento de primer principio (Descartes, Musk) consiste en descomponer hasta llegar a verdades fundamentales y reconstruir desde ahí.", type: "FACT", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 7. FINANZAS PERSONALES
  // ══════════════════════════════════════════
  {
    name: "Finanzas Personales",
    slug: "finanzas-personales",
    icon: "💰",
    color: "#f59e0b",
    lifeArea: "ECONOMIC",
    description: "Presupuesto, inversión, independencia financiera, ahorro e impuestos.",
    tags: ["inversión", "presupuesto", "ahorro", "independencia-financiera"],
    initialNotes: [
      {
        title: "Reglas fundamentales de finanzas personales",
        content: `## Regla 1: Págate primero\nAhorra antes de gastar. Automatiza el ahorro el día de cobro.\n\n## Regla 50/30/20\n- 50% necesidades\n- 30% deseos\n- 20% ahorro/inversión\n\n## Interés compuesto\nCon 7% anual, el dinero se duplica cada ~10 años (Regla del 72).\n\n## Activos vs Pasivos (Kiyosaki)\n- **Activo:** pone dinero en tu bolsillo\n- **Pasivo:** saca dinero de tu bolsillo\n\nEl objetivo: acumular activos.`,
        type: "brain-note",
        status: "published",
        tags: ["reglas", "fundamentos", "ahorro"],
      },
    ],
    initialLearnings: [
      { content: "El interés compuesto al 7% anual duplica el capital cada 10.2 años (Regla del 72).", type: "FACT", source: "BOOK" },
      { content: "La inflación es el impuesto invisible. El dinero parado pierde valor real cada año.", type: "INSIGHT", source: "BOOK" },
      { content: "La riqueza real no es ingresos altos — es el diferencial entre lo que ganas y lo que gastas, compuesto en el tiempo.", type: "REFLECTION", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 8. MÚSICA & PIANO
  // ══════════════════════════════════════════
  {
    name: "Música & Piano",
    slug: "musica-piano",
    icon: "🎹",
    color: "#f472b6",
    lifeArea: "CULTURAL",
    description: "Teoría musical, práctica deliberada al piano, composición e historia de la música.",
    tags: ["piano", "teoría-musical", "práctica-deliberada", "composición"],
    initialNotes: [
      {
        title: "Plan de práctica deliberada al piano",
        content: `## Estructura de sesión (45-60 min)\n\n1. **Calentamiento (5 min):** escalas cromáticas, arpegios básicos\n2. **Técnica focal (15 min):** trabajar UN elemento técnico con metrónomo\n3. **Pieza actual (25 min):** por secciones, manos separadas primero\n4. **Cierre musical (5-10 min):** tocar algo placentero, sin presión\n\n## Principio clave\nLento perfecto > rápido imperfecto.\nEl músculo aprende el ERROR si practicas rápido con fallos.`,
        type: "routine-note",
        status: "published",
        tags: ["práctica", "piano", "técnica"],
      },
    ],
    initialLearnings: [
      { content: "La práctica deliberada requiere salir de la zona de confort: si puedes tocarlo bien, no es práctica deliberada.", type: "INSIGHT", source: "BOOK" },
      { content: "Las escalas mayores y menores en todas las tonalidades son el vocabulario base del piano clásico y jazz.", type: "FACT", source: "EXPERIENCE" },
      { content: "Tocar con metrónomo al 60% del tempo deseado y subir 5 BPM sólo cuando es perfecto al 100% del tempo anterior.", type: "SKILL", source: "EXPERIENCE" },
    ],
  },

  // ══════════════════════════════════════════
  // 9. JARDINERÍA & PLANTAS
  // ══════════════════════════════════════════
  {
    name: "Jardinería & Plantas",
    slug: "jardineria-plantas",
    icon: "🌿",
    color: "#4ade80",
    lifeArea: "PERSONAL",
    description: "Cultivo de plantas, sustratos, riego, compostaje y diseño de espacios verdes.",
    tags: ["plantas", "sustratos", "riego", "compostaje", "huerto"],
    initialNotes: [
      {
        title: "Principios básicos de cuidado de plantas",
        content: `## Los 4 factores críticos\n\n1. **Luz:** cada planta tiene requerimientos específicos. Medir con luxómetro.\n2. **Agua:** la mayoría muere por exceso. Regar cuando el sustrato esté seco 3–5cm abajo.\n3. **Sustrato:** drenaje adecuado > nutrientes. Arena perlita para suculentas, turba para tropicales.\n4. **Temperatura y humedad:** evitar corrientes de aire directo y cambios bruscos.\n\n## Señales de problemas\n- Hojas amarillas → exceso de agua o falta de nitrógeno\n- Puntas marrones → bajo humedad o exceso de fertilizante\n- Manchas oscuras → hongos (exceso de humedad)`,
        type: "brain-note",
        status: "published",
        tags: ["cuidado", "fundamentos", "plantas"],
      },
    ],
    initialLearnings: [
      { content: "Las plantas de interior mejoran la calidad del aire al absorber COV (compuestos orgánicos volátiles) como formaldehído y benceno.", type: "FACT", source: "ARTICLE" },
      { content: "El contacto con tierra y plantas reduce el cortisol y activa el sistema nervioso parasimpático (modo descanso).", type: "FACT", source: "ARTICLE" },
      { content: "Las suculentas y cactus mueren más por exceso de agua que por falta. El error más común de principiantes.", type: "INSIGHT", source: "EXPERIENCE" },
    ],
  },

  // ══════════════════════════════════════════
  // 10. DISEÑO & UX
  // ══════════════════════════════════════════
  {
    name: "Diseño & UX",
    slug: "diseno-ux",
    icon: "🎨",
    color: "#fb923c",
    lifeArea: "TECH",
    description: "Diseño de interfaces, experiencia de usuario, sistemas de diseño, tipografía y color.",
    tags: ["ux", "ui", "sistemas-diseño", "tipografía", "accesibilidad"],
    initialNotes: [
      {
        title: "Principios de diseño visual que nunca fallan",
        content: `## Jerarquía visual\nEl ojo va a: contraste → tamaño → color → posición.\nUna sola cosa debe dominar cada viewport.\n\n## Espaciado\nEspacio en blanco no es espacio vacío — es respiración.\nSistema de 4px: todo margen/padding debe ser múltiplo de 4.\n\n## Color\n- 60% color dominante (neutro)\n- 30% color secundario\n- 10% acento\n\n## Tipografía\n- Máximo 2 fuentes por proyecto\n- Contraste de peso > contraste de fuente\n- Body text: 16px mínimo`,
        type: "brain-note",
        status: "published",
        tags: ["principios", "visual", "jerarquía"],
      },
    ],
    initialLearnings: [
      { content: "Las leyes de Gestalt (proximidad, similitud, continuidad) son el fundamento de cómo el cerebro percibe interfaces.", type: "FACT", source: "BOOK" },
      { content: "WCAG AA requiere contraste 4.5:1 para texto normal. Verificar siempre antes de publicar.", type: "FACT", source: "ARTICLE" },
      { content: "El diseño más difícil es el simple. Quitar es más difícil y valioso que agregar.", type: "REFLECTION", source: "EXPERIENCE" },
    ],
  },

  // ══════════════════════════════════════════
  // 11. ARQUITECTURA DE SOFTWARE
  // ══════════════════════════════════════════
  {
    name: "Arquitectura de Software",
    slug: "arquitectura-software",
    icon: "🏗️",
    color: "#64748b",
    lifeArea: "TECH",
    description: "Patrones arquitectónicos, microservicios, event-driven, CQRS, DDD y sistemas distribuidos.",
    tags: ["microservicios", "event-driven", "cqrs", "ddd", "sistemas-distribuidos"],
    initialNotes: [
      {
        title: "Cuándo usar microservicios vs monolito",
        content: `## Monolito primero (Martin Fowler)\nComenzar con monolito bien estructurado, extraer servicios sólo cuando hay:\n- Necesidad de escalar una parte específica independientemente\n- Equipos diferentes trabajando en dominios separados\n- Requisitos de deployment independiente\n\n## El costo oculto de microservicios\n- Latencia de red entre servicios\n- Transacciones distribuidas son extremadamente complejas\n- Observabilidad requiere infraestructura extra (tracing, logging centralizado)\n\n**Regla:** si tienes menos de 15 personas en ingeniería, probablemente no necesitas microservicios.`,
        type: "brain-note",
        status: "published",
        tags: ["microservicios", "monolito", "decisión"],
      },
    ],
    initialLearnings: [
      { content: "Un monolito modular bien estructurado es más mantenible que microservicios mal diseñados.", type: "INSIGHT", source: "ARTICLE" },
      { content: "El teorema CAP: en un sistema distribuido sólo puedes garantizar 2 de 3: Consistencia, Disponibilidad, Tolerancia a particiones.", type: "FACT", source: "BOOK" },
      { content: "Event sourcing mantiene el estado como secuencia de eventos, lo que hace cualquier estado pasado reproducible.", type: "FACT", source: "ARTICLE" },
    ],
  },

  // ══════════════════════════════════════════
  // 12. PSICOLOGÍA & COMPORTAMIENTO
  // ══════════════════════════════════════════
  {
    name: "Psicología & Comportamiento",
    slug: "psicologia-comportamiento",
    icon: "🧩",
    color: "#a78bfa",
    lifeArea: "SCIENTIFIC",
    description: "Psicología cognitiva, sesgos, motivación, hábitos y comportamiento humano.",
    tags: ["sesgos", "motivación", "hábitos", "comportamiento", "psicología-positiva"],
    initialNotes: [
      {
        title: "Modelo de hábitos: el Loop de 4 pasos",
        content: `## El Loop de Hábito (James Clear / Charles Duhigg)\n\n1. **Señal (Cue):** el disparador que inicia el comportamiento\n2. **Antojo (Craving):** la motivación o deseo\n3. **Rutina (Response):** el comportamiento en sí\n4. **Recompensa (Reward):** el beneficio que refuerza el loop\n\n## Para crear un hábito\n- Hacer la señal obvia\n- Hacer el antojo atractivo\n- Hacer la rutina fácil\n- Hacer la recompensa satisfactoria\n\n## Para romper un hábito\nInvertir cada paso.`,
        type: "brain-note",
        status: "published",
        tags: ["hábitos", "loop", "comportamiento"],
      },
    ],
    initialLearnings: [
      { content: "El sesgo de confirmación nos hace buscar información que confirma lo que ya creemos, ignorando la que lo contradice.", type: "FACT", source: "BOOK" },
      { content: "La identidad impulsa los hábitos más que los resultados: 'Soy alguien que hace ejercicio' > 'Quiero perder peso'.", type: "INSIGHT", source: "BOOK" },
      { content: "La dopamina no es el neurotransmisor del placer — es el de la anticipación. Se libera antes de la recompensa, no durante.", type: "FACT", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 13. ESCRITURA & COMUNICACIÓN
  // ══════════════════════════════════════════
  {
    name: "Escritura & Comunicación",
    slug: "escritura-comunicacion",
    icon: "✍️",
    color: "#0d9488",
    lifeArea: "CULTURAL",
    description: "Escritura clara, comunicación efectiva, storytelling y expresión del pensamiento.",
    tags: ["escritura", "storytelling", "claridad", "comunicación"],
    initialNotes: [
      {
        title: "Principios de escritura clara",
        content: `## Reglas de oro\n\n1. **Una idea por párrafo.** Si un párrafo tiene dos ideas, dividirlo.\n2. **Voz activa > voz pasiva.** "El equipo entregó el proyecto" > "El proyecto fue entregado".\n3. **Palabras cortas > palabras largas.** Usar vs utilizar. Ahora vs en este momento.\n4. **Matar los adverbios.** "Dijo enfáticamente" → "Afirmó".\n5. **La estructura importa:** tesis → argumento → evidencia → cierre.\n\n## Para email y documentación técnica\n- TL;DR arriba\n- Una sola acción requerida por mensaje\n- Anticipar preguntas en el cuerpo`,
        type: "brain-note",
        status: "published",
        tags: ["escritura", "claridad", "principios"],
      },
    ],
    initialLearnings: [
      { content: "Escribir claramente es pensar claramente. Si no puedes explicarlo con palabras simples, no lo entiendes suficientemente bien.", type: "QUOTE", source: "BOOK" },
      { content: "El storytelling activa más regiones del cerebro que los datos puros: corteza sensorial, motora y de emociones.", type: "FACT", source: "ARTICLE" },
    ],
  },

  // ══════════════════════════════════════════
  // 14. HOGAR & AUTOMATIZACIÓN
  // ══════════════════════════════════════════
  {
    name: "Hogar & Automatización",
    slug: "hogar-automatizacion",
    icon: "🏠",
    color: "#0891b2",
    lifeArea: "PERSONAL",
    description: "Smart home, domótica, organización del espacio, DIY y automatización del hogar.",
    tags: ["smart-home", "domótica", "organización", "diy"],
    initialNotes: [
      {
        title: "Stack de automatización del hogar",
        content: `## Protocolos principales\n- **Zigbee/Z-Wave:** bajo consumo, malla robusta, no depende de internet\n- **WiFi (Tuya/Tasmota):** más barato, requiere internet\n- **Matter:** estándar nuevo, compatibilidad entre ecosistemas\n\n## Centro de control\n- **Home Assistant** en Raspberry Pi: máxima privacidad y control local\n- Integra con Google Home / Alexa como fallback de voz\n\n## Automatizaciones prioritarias\n1. Iluminación por presencia y horario\n2. Control de temperatura\n3. Seguridad (cámaras, sensores de puerta)`,
        type: "brain-note",
        status: "published",
        tags: ["smart-home", "home-assistant", "automatización"],
      },
    ],
    initialLearnings: [
      { content: "Home Assistant local procesa todo sin depender de la nube — clave para privacidad y disponibilidad.", type: "INSIGHT", source: "EXPERIENCE" },
      { content: "El protocolo Zigbee crea una red de malla donde cada dispositivo es un nodo retransmisor, aumentando el alcance.", type: "FACT", source: "ARTICLE" },
    ],
  },

  // ══════════════════════════════════════════
  // 15. CIENCIA & MÉTODO CIENTÍFICO
  // ══════════════════════════════════════════
  {
    name: "Ciencia & Método Científico",
    slug: "ciencia-metodo",
    icon: "🔬",
    color: "#06b6d4",
    lifeArea: "SCIENTIFIC",
    description: "Física, química, biología, epistemología científica y pensamiento basado en evidencia.",
    tags: ["física", "biología", "química", "evidencia", "epistemología"],
    initialNotes: [
      {
        title: "Cómo evaluar evidencia científica",
        content: `## Jerarquía de evidencia (de mayor a menor)\n\n1. Meta-análisis y revisiones sistemáticas\n2. Ensayos controlados aleatorizados (RCT)\n3. Estudios de cohorte\n4. Estudios caso-control\n5. Series de casos / opinión de experto\n\n## Red flags en artículos científicos\n- "Correlación" presentada como "causalidad"\n- Tamaño de muestra muy pequeño (N < 30)\n- Sin grupo control\n- Conflicto de interés del financiador\n- No replicado por equipos independientes`,
        type: "brain-note",
        status: "published",
        tags: ["evidencia", "método", "epistemología"],
      },
    ],
    initialLearnings: [
      { content: "Correlación no implica causalidad. El número de piratas en el mundo correlaciona negativamente con el calentamiento global.", type: "FACT", source: "ARTICLE" },
      { content: "La falsabilidad (Popper) es el criterio que separa ciencia de pseudociencia: una teoría científica debe poder ser demostrada falsa.", type: "FACT", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 16. LIDERAZGO & MANAGEMENT
  // ══════════════════════════════════════════
  {
    name: "Liderazgo & Management",
    slug: "liderazgo-management",
    icon: "🧭",
    color: "#dc2626",
    lifeArea: "PERSONAL",
    description: "Liderazgo técnico, gestión de equipos, toma de decisiones y cultura organizacional.",
    tags: ["liderazgo", "management", "equipos", "cultura", "decisiones"],
    initialNotes: [
      {
        title: "Manager vs Leader: las diferencias clave",
        content: `## Manager\n- Optimiza procesos existentes\n- Enfocado en resultados a corto plazo\n- Controla y asigna recursos\n- Pregunta "¿cómo?" y "¿cuándo?"\n\n## Leader\n- Crea la visión y el contexto\n- Enfocado en el crecimiento de personas\n- Inspira y habilita autonomía\n- Pregunta "¿por qué?" y "¿qué importa?"\n\n## El mejor escenario\nUna persona que sabe cuándo ser cada uno según el contexto.`,
        type: "brain-note",
        status: "published",
        tags: ["liderazgo", "management", "diferencia"],
      },
    ],
    initialLearnings: [
      { content: "Los mejores managers hacen preguntas más que dar respuestas. Su trabajo es multiplicar la capacidad del equipo.", type: "INSIGHT", source: "BOOK" },
      { content: "Psychological safety (seguridad psicológica) es el factor #1 predictor de desempeño en equipos (Proyecto Aristóteles, Google).", type: "FACT", source: "ARTICLE" },
    ],
  },

  // ══════════════════════════════════════════
  // 17. HISTORIA & CIVILIZACIONES
  // ══════════════════════════════════════════
  {
    name: "Historia & Civilizaciones",
    slug: "historia-civilizaciones",
    icon: "🏺",
    color: "#b45309",
    lifeArea: "CULTURAL",
    description: "Historia universal, civilizaciones antiguas, patrones históricos y lecciones del pasado.",
    tags: ["historia", "civilizaciones", "patrones", "cultura"],
    initialNotes: [
      {
        title: "Patrones recurrentes en la historia",
        content: `## Ciclos históricos (Ray Dalio)\n\n1. Surgimiento de nueva potencia / orden\n2. Período de paz y prosperidad\n3. Deuda excesiva y desigualdad\n4. Conflicto interno y externo\n5. Colapso o transición del orden\n\n## Lecciones clave\n- Las civilizaciones no caen por un ataque externo — se debilitan desde adentro primero\n- La tecnología cambia los medios, pero los impulsos humanos (poder, miedo, ambición) permanecen\n- Los imperios duran ~200–300 años en promedio`,
        type: "brain-note",
        status: "published",
        tags: ["patrones", "ciclos", "historia"],
      },
    ],
    initialLearnings: [
      { content: "El Imperio Romano duró ~500 años. Uno de los más longevos. Su caída fue un proceso de siglos, no un evento.", type: "FACT", source: "BOOK" },
      { content: "Quien no conoce la historia está condenado a repetirla — pero quien sí la conoce, está condenado a verla repetirse (Edmund Burke adaptado).", type: "QUOTE", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 18. FOTOGRAFÍA & ARTE VISUAL
  // ══════════════════════════════════════════
  {
    name: "Fotografía & Arte Visual",
    slug: "fotografia-arte-visual",
    icon: "📷",
    color: "#7c3aed",
    lifeArea: "CULTURAL",
    description: "Composición fotográfica, luz, edición, estética visual y apreciación del arte.",
    tags: ["fotografía", "composición", "luz", "edición", "estética"],
    initialNotes: [
      {
        title: "Fundamentos de composición fotográfica",
        content: `## Regla de los tercios\nDividir el frame en 9 partes iguales. Colocar elementos de interés en las intersecciones.\n\n## Líneas guía\nUsarlas para llevar la vista hacia el sujeto principal: caminos, ríos, edificios.\n\n## Profundidad de campo\n- Apertura grande (f/1.8) → fondo desenfocado, sujeto aislado\n- Apertura pequeña (f/11) → todo en foco, paisajes\n\n## La luz lo es todo\n- Hora dorada: 1h después del amanecer, 1h antes del atardecer\n- Luz lateral revela textura\n- Luz frontal aplana la imagen`,
        type: "brain-note",
        status: "published",
        tags: ["composición", "fundamentos", "luz"],
      },
    ],
    initialLearnings: [
      { content: "La fotografía no captura luz — captura tiempo. Una foto es un fragmento congelado de un momento irrepetible.", type: "REFLECTION", source: "BOOK" },
      { content: "Los mejores fotógrafos no esperan la foto perfecta — se posicionan donde las fotos interesantes ocurren naturalmente.", type: "INSIGHT", source: "EXPERIENCE" },
    ],
  },

  // ══════════════════════════════════════════
  // 19. NUTRICIÓN & ALIMENTACIÓN
  // ══════════════════════════════════════════
  {
    name: "Nutrición & Alimentación",
    slug: "nutricion-alimentacion",
    icon: "🥗",
    color: "#65a30d",
    lifeArea: "SCIENTIFIC",
    description: "Macronutrientes, micronutrientes, dietas basadas en evidencia y relación con la salud.",
    tags: ["nutrición", "macros", "dieta", "micronutrientes", "metabolismo"],
    initialNotes: [
      {
        title: "Principios nutricionales basados en evidencia",
        content: `## Lo que el consenso científico sostiene\n\n1. **Proteína:** el macronutriente más saciante y con mayor termogénesis\n2. **Fibra:** 25–38g/día reduce riesgo cardiovascular y mejora microbioma\n3. **Ultra-procesados:** asociados con inflamación, obesidad y enfermedad metabólica\n4. **Hidratación:** 35 ml por kg de peso corporal como referencia\n\n## Lo que la evidencia NO sostiene\n- Que el desayuno sea obligatoriamente "la comida más importante"\n- Que las grasas saturadas sean automáticamente malas\n- Que los carbohidratos causen obesidad (el exceso calórico lo hace)`,
        type: "brain-note",
        status: "published",
        tags: ["evidencia", "nutrición", "principios"],
      },
    ],
    initialLearnings: [
      { content: "Los ultra-procesados están diseñados para ser hiper-palatables: combinación óptima de sal, azúcar y grasa que supera los mecanismos naturales de saciedad.", type: "FACT", source: "BOOK" },
      { content: "El microbioma intestinal afecta el estado de ánimo, el sistema inmune y el metabolismo. Es el 'segundo cerebro'.", type: "FACT", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 20. TECNOLOGÍA & SOCIEDAD
  // ══════════════════════════════════════════
  {
    name: "Tecnología & Sociedad",
    slug: "tecnologia-sociedad",
    icon: "🌐",
    color: "#0284c7",
    lifeArea: "PHILOSOPHICAL",
    description: "Impacto social de la tecnología, privacidad digital, ética en IA y futuro tecnológico.",
    tags: ["privacidad", "ética-ia", "futuro", "sociedad", "transformación-digital"],
    initialNotes: [
      {
        title: "Riesgos y oportunidades de la IA en la sociedad",
        content: `## Oportunidades claras\n- Diagnóstico médico más preciso\n- Personalización de educación\n- Automatización de tareas repetitivas\n- Investigación científica acelerada\n\n## Riesgos reales\n- Desinformación y deepfakes a escala masiva\n- Concentración de poder en pocas empresas\n- Desplazamiento laboral sin redes de seguridad\n- Pérdida de agencia y autonomía cognitiva\n\n## La pregunta central\n¿Quién controla los modelos controla la narrativa y el conocimiento?`,
        type: "brain-note",
        status: "published",
        tags: ["ia", "sociedad", "riesgos"],
      },
    ],
    initialLearnings: [
      { content: "El modelo de negocio de atención (attention economy) alinea los incentivos de las redes sociales con mantener al usuario enganchado, no informado.", type: "INSIGHT", source: "BOOK" },
      { content: "La privacidad digital no es sobre secretos — es sobre el control de la narrativa de tu propia vida.", type: "REFLECTION", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 21. EMPRENDIMIENTO & NEGOCIOS
  // ══════════════════════════════════════════
  {
    name: "Emprendimiento & Negocios",
    slug: "emprendimiento-negocios",
    icon: "🚀",
    color: "#f97316",
    lifeArea: "ECONOMIC",
    description: "Startups, modelos de negocio, product-market fit, growth y construcción de productos.",
    tags: ["startups", "producto", "growth", "modelos-negocio", "lean"],
    initialNotes: [
      {
        title: "Lean Startup: el proceso mínimo de validación",
        content: `## Build-Measure-Learn Loop\n\n1. **Build:** crear el MVP mínimo posible para probar la hipótesis\n2. **Measure:** medir una métrica que confirme o niegue la hipótesis\n3. **Learn:** pivotar o perseverar según los datos\n\n## Hipótesis de riesgo\nAntes de construir, identificar la hipótesis más arriesgada del negocio y diseñar el experimento más barato para falsarla.\n\n## Métricas que importan (Pirate Metrics - AARRR)\n- Acquisition → Activation → Retention → Referral → Revenue`,
        type: "brain-note",
        status: "published",
        tags: ["lean", "mvp", "validación"],
      },
    ],
    initialLearnings: [
      { content: "Product-Market Fit: cuando los usuarios te dicen que estarían 'muy decepcionados' si el producto dejara de existir (benchmark: >40%).", type: "FACT", source: "ARTICLE" },
      { content: "Los startups no mueren por competencia — mueren por no encontrar un problema que valga la pena resolver.", type: "INSIGHT", source: "BOOK" },
    ],
  },

  // ══════════════════════════════════════════
  // 22. MEDITACIÓN & MINDFULNESS
  // ══════════════════════════════════════════
  {
    name: "Meditación & Mindfulness",
    slug: "meditacion-mindfulness",
    icon: "🧘",
    color: "#84cc16",
    lifeArea: "PERSONAL",
    description: "Prácticas contemplativas, atención plena, gestión emocional y reducción del estrés.",
    tags: ["meditación", "mindfulness", "atención", "estrés", "contemplación"],
    initialNotes: [
      {
        title: "Protocolo de meditación para principiantes",
        content: `## Práctica mínima viable (10 min/día)\n\n1. **Postura:** sentado, espalda recta pero no rígida\n2. **Ancla:** llevar atención a la respiración (sensación en narinas o abdomen)\n3. **Cuando la mente divague:** notar el pensamiento sin juzgarlo, volver al ancla\n4. **La práctica ES notar y volver** — no mantener la mente vacía\n\n## Progresión sugerida\n- Semana 1–2: 5 minutos al despertar\n- Semana 3–4: 10 minutos\n- Mes 2+: 20 minutos o sesiones cortas a lo largo del día\n\n## Apps recomendadas\nInsight Timer (gratis), Waking Up (Sam Harris), Headspace`,
        type: "routine-note",
        status: "published",
        tags: ["meditación", "protocolo", "principiantes"],
      },
    ],
    initialLearnings: [
      { content: "8 semanas de meditación diaria (MBSR) producen cambios medibles en el grosor del córtex prefrontal (asociado a regulación emocional).", type: "FACT", source: "ARTICLE" },
      { content: "La meditación no elimina los pensamientos — entrena la capacidad de observarlos sin ser arrastrado por ellos.", type: "INSIGHT", source: "BOOK" },
      { content: "La mente divaga en el 47% del tiempo en estado de vigilia según Harvard. La meditación reduce ese porcentaje.", type: "FACT", source: "ARTICLE" },
    ],
  },
];

// ─────────────────────────────────────────────
// FUNCIÓN SEMILLA PRINCIPAL
// ─────────────────────────────────────────────

/**
 * Ejecutar con: npx ts-node src/lib/seeds/hyperbrain-topics.seed.ts
 * O integrar en: prisma/seed.ts
 */
export async function seedHyperBrainTopics(prisma: any) {
  console.log("🧠 Iniciando seed de HyperBrain Topics...");

  let topicsCreated = 0;
  let notesCreated = 0;
  let learningsCreated = 0;

  for (const topicData of HYPERBRAIN_TOPICS_SEED) {
    const topic = await prisma.topic.upsert({
      where: { slug: topicData.slug },
      update: {},
      create: {
        name: topicData.name,
        slug: topicData.slug,
        icon: topicData.icon,
        color: topicData.color,
        lifeArea: topicData.lifeArea,
        description: topicData.description,
        tags: topicData.tags,
      },
    });

    topicsCreated++;

    for (const note of topicData.initialNotes) {
      await prisma.knowledgeNote.create({
        data: {
          title: note.title,
          content: note.content,
          type: note.type,
          status: note.status,
          tags: note.tags,
          topicId: topic.id,
        },
      });
      notesCreated++;
    }

    for (const learning of topicData.initialLearnings) {
      await prisma.learning.create({
        data: {
          content: learning.content,
          type: learning.type,
          source: learning.source,
          topicId: topic.id,
        },
      });
      learningsCreated++;
    }

    console.log(`  ✅ ${topic.icon} ${topic.name} — ${topicData.initialNotes.length} notas, ${topicData.initialLearnings.length} learnings`);
  }

  console.log("\n🎉 Seed completado:");
  console.log(`   📂 ${topicsCreated} topics creados`);
  console.log(`   📝 ${notesCreated} notas iniciales`);
  console.log(`   💡 ${learningsCreated} learnings iniciales`);
}

// ─────────────────────────────────────────────
// STATS RÁPIDOS
// ─────────────────────────────────────────────

export const SEED_STATS = {
  totalTopics: HYPERBRAIN_TOPICS_SEED.length,
  byLifeArea: HYPERBRAIN_TOPICS_SEED.reduce((acc, t) => {
    acc[t.lifeArea] = (acc[t.lifeArea] || 0) + 1;
    return acc;
  }, {} as Record<LifeArea, number>),
  totalNotes: HYPERBRAIN_TOPICS_SEED.reduce((acc, t) => acc + t.initialNotes.length, 0),
  totalLearnings: HYPERBRAIN_TOPICS_SEED.reduce((acc, t) => acc + t.initialLearnings.length, 0),
};
