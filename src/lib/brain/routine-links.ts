/**
 * Bidirectional mapping between routines and Brain topics.
 * This allows the TopicWorkspace to show linked routines
 * and the Routines page to link back to Brain.
 */

interface LinkedRoutine {
  id: string;
  name: string;
  category: string;
  emoji: string;
  steps: number;
  totalMin: number;
  adherence: number;
  topicSlugs: string[];
}

// Static routine data matching the routines page initialRoutines
const ROUTINE_TOPIC_MAP: LinkedRoutine[] = [
  {
    id: "r1",
    name: "Rutina de Mañana",
    category: "MORNING",
    emoji: "🌅",
    steps: 6,
    totalMin: 42,
    adherence: 75,
    topicSlugs: ["productividad-sistemas", "salud-bienestar"],
  },
  {
    id: "r2",
    name: "Fuerza V1: Full Body A",
    category: "WORKOUT",
    emoji: "💪",
    steps: 9,
    totalMin: 57,
    adherence: 80,
    topicSlugs: ["salud-bienestar"],
  },
  {
    id: "r2b",
    name: "Fuerza V1: Full Body B",
    category: "WORKOUT",
    emoji: "🏋️",
    steps: 9,
    totalMin: 62,
    adherence: 100,
    topicSlugs: ["salud-bienestar"],
  },
  {
    id: "r2c",
    name: "Fuerza V2: Upper",
    category: "WORKOUT",
    emoji: "💪",
    steps: 8,
    totalMin: 80,
    adherence: 0,
    topicSlugs: ["salud-bienestar"],
  },
  {
    id: "r2d",
    name: "Fuerza V2: Lower",
    category: "WORKOUT",
    emoji: "🦵",
    steps: 8,
    totalMin: 72,
    adherence: 0,
    topicSlugs: ["salud-bienestar"],
  },
  {
    id: "r2e",
    name: "Fuerza V3: Push",
    category: "WORKOUT",
    emoji: "🙌",
    steps: 8,
    totalMin: 86,
    adherence: 0,
    topicSlugs: ["salud-bienestar"],
  },
  {
    id: "r2f",
    name: "Fuerza V3: Pull",
    category: "WORKOUT",
    emoji: "🧗",
    steps: 8,
    totalMin: 89,
    adherence: 0,
    topicSlugs: ["salud-bienestar"],
  },
  {
    id: "r2g",
    name: "Fuerza V3: Legs",
    category: "WORKOUT",
    emoji: "🦵",
    steps: 9,
    totalMin: 94,
    adherence: 0,
    topicSlugs: ["salud-bienestar"],
  },
  {
    id: "r3",
    name: "Skincare Noche",
    category: "SKINCARE",
    emoji: "✨",
    steps: 5,
    totalMin: 7,
    adherence: 100,
    topicSlugs: ["salud-bienestar"],
  },
  {
    id: "r4",
    name: "Deep Work Session",
    category: "CUSTOM",
    emoji: "⚡",
    steps: 6,
    totalMin: 65,
    adherence: 90,
    topicSlugs: ["productividad-sistemas", "desarrollo-software"],
  },
];

export function getRoutinesForTopic(topicSlug: string) {
  return ROUTINE_TOPIC_MAP.filter(r => r.topicSlugs.includes(topicSlug));
}

export function getTopicSlugsForRoutine(routineId: string): string[] {
  const routine = ROUTINE_TOPIC_MAP.find(r => r.id === routineId);
  return routine?.topicSlugs || [];
}
