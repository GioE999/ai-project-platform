import { eventBus } from "./event-bus";
import { conversationService } from "@/lib/services/conversation.service";
import { registerEmbeddingSubscribers } from "@/lib/embeddings/embedding-subscriber";

/**
 * Register all event subscribers for the application.
 * Call this once during app initialization.
 */
export function registerAllSubscribers(): void {
  // Create conversation thread when task is created
  eventBus.subscribe("task.created", async (event) => {
    await conversationService.createThread("task", event.payload.id);
  });

  // Create conversation thread when project is created
  eventBus.subscribe("project.created", async (event) => {
    await conversationService.createThread("project", event.payload.id);
  });

  // Register embedding generation subscribers
  registerEmbeddingSubscribers();
}
