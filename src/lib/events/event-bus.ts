import type { DomainEvent, EventType, EventHandler } from "@/types/events";

/**
 * Extract the specific event type from DomainEvent union based on the event type string.
 */
type ExtractEvent<T extends EventType> = Extract<DomainEvent, { type: T }>;

/**
 * In-memory typed event bus implementing a pub/sub pattern.
 * Handlers run in parallel via Promise.allSettled (fire-and-forget).
 * Errors from individual handlers are logged but never block other handlers.
 */
export class EventBus {
  private handlers: Map<EventType, Set<EventHandler>>;

  constructor() {
    this.handlers = new Map();
  }

  /**
   * Publish an event to all subscribers of that event type.
   * Runs all handlers in parallel. Catches and logs errors from
   * individual handlers without blocking others.
   */
  async publish(event: DomainEvent): Promise<void> {
    const subscribers = this.handlers.get(event.type);
    if (!subscribers || subscribers.size === 0) {
      return;
    }

    const results = await Promise.allSettled(
      Array.from(subscribers).map((handler) => handler(event))
    );

    for (const result of results) {
      if (result.status === "rejected") {
        console.error(
          `[EventBus] Handler error for event "${event.type}":`,
          result.reason
        );
      }
    }
  }

  /**
   * Subscribe a handler to an event type.
   * Returns an unsubscribe function to remove the handler.
   */
  subscribe<T extends EventType>(
    eventType: T,
    handler: (event: ExtractEvent<T>) => Promise<void>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const subscribers = this.handlers.get(eventType)!;
    subscribers.add(handler as EventHandler);

    return () => {
      subscribers.delete(handler as EventHandler);
      if (subscribers.size === 0) {
        this.handlers.delete(eventType);
      }
    };
  }

  /**
   * Remove all subscriptions. Useful for testing.
   */
  clear(): void {
    this.handlers.clear();
  }
}

/** Singleton instance for use across the application */
export const eventBus = new EventBus();
