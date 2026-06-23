import { eventBus } from "@/lib/events/event-bus";
import { embeddingService } from "./embedding.service";

/**
 * Subscribe to domain events and generate embeddings for new/updated content.
 * Strategy per entity type:
 * - Tasks: name + description (max 500 tokens)
 * - Notes: title + content (max 4000 tokens)
 * - Meeting summaries: handled separately via meeting.completed event
 */
export function registerEmbeddingSubscribers(): void {
  // Tasks
  eventBus.subscribe("task.created", async (event) => {
    const text = event.payload.name;
    const embedding = await embeddingService.generate(text);
    await embeddingService.index("task", event.payload.id, embedding);
  });

  eventBus.subscribe("task.updated", async (event) => {
    // Only re-index if name or description changed
    if (event.payload.changes.name || event.payload.changes.description) {
      const text = `${event.payload.changes.name || ""} ${event.payload.changes.description || ""}`.trim();
      if (text) {
        const embedding = await embeddingService.generate(text);
        await embeddingService.index("task", event.payload.id, embedding);
      }
    }
  });

  // Notes
  eventBus.subscribe("note.created", async (event) => {
    const text = `${event.payload.title} ${event.payload.content}`;
    const embedding = await embeddingService.generate(text);
    await embeddingService.index("note", event.payload.id, embedding);
  });

  eventBus.subscribe("note.updated", async (event) => {
    const text = event.payload.content;
    const embedding = await embeddingService.generate(text);
    await embeddingService.index("note", event.payload.id, embedding);
  });

  // Meeting summaries are indexed when storeSummary is called
  // The MeetingService emits meeting.completed which we can use
  // but the summary content isn't in the event payload.
  // This will be handled in the integration wiring (task 28).
}
