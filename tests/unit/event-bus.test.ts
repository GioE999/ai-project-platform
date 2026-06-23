import { describe, it, expect, beforeEach, vi } from "vitest";
import { EventBus } from "@/lib/events/event-bus";
import type { DomainEvent } from "@/types/events";

describe("EventBus", () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it("should call subscribed handler when event is published", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    bus.subscribe("task.created", handler);

    const event: DomainEvent = {
      type: "task.created",
      payload: { id: "1", userId: "u1", name: "Test Task" },
    };
    await bus.publish(event);

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(event);
  });

  it("should not call handler for different event types", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    bus.subscribe("task.created", handler);

    await bus.publish({ type: "task.deleted", payload: { id: "1" } });

    expect(handler).not.toHaveBeenCalled();
  });

  it("should call multiple handlers for same event type", async () => {
    const handler1 = vi.fn().mockResolvedValue(undefined);
    const handler2 = vi.fn().mockResolvedValue(undefined);

    bus.subscribe("task.created", handler1);
    bus.subscribe("task.created", handler2);

    const event: DomainEvent = {
      type: "task.created",
      payload: { id: "1", userId: "u1", name: "Test" },
    };
    await bus.publish(event);

    expect(handler1).toHaveBeenCalledOnce();
    expect(handler2).toHaveBeenCalledOnce();
  });

  it("should unsubscribe handler when calling returned function", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    const unsubscribe = bus.subscribe("task.created", handler);

    unsubscribe();

    await bus.publish({
      type: "task.created",
      payload: { id: "1", userId: "u1", name: "Test" },
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("should not throw when publishing event with no subscribers", async () => {
    await expect(
      bus.publish({ type: "task.deleted", payload: { id: "1" } })
    ).resolves.toBeUndefined();
  });

  it("should catch handler errors without blocking other handlers", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const failingHandler = vi.fn().mockRejectedValue(new Error("handler failed"));
    const succeedingHandler = vi.fn().mockResolvedValue(undefined);

    bus.subscribe("task.created", failingHandler);
    bus.subscribe("task.created", succeedingHandler);

    const event: DomainEvent = {
      type: "task.created",
      payload: { id: "1", userId: "u1", name: "Test" },
    };
    await bus.publish(event);

    expect(failingHandler).toHaveBeenCalledOnce();
    expect(succeedingHandler).toHaveBeenCalledOnce();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("task.created"),
      expect.any(Error)
    );

    errorSpy.mockRestore();
  });

  it("should never throw from publish even when handlers fail", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const failingHandler = vi.fn().mockRejectedValue(new Error("boom"));
    bus.subscribe("task.deleted", failingHandler);

    await expect(
      bus.publish({ type: "task.deleted", payload: { id: "1" } })
    ).resolves.toBeUndefined();

    vi.restoreAllMocks();
  });

  it("should remove all subscriptions on clear()", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    bus.subscribe("task.created", handler);
    bus.subscribe("task.deleted", handler);

    bus.clear();

    await bus.publish({
      type: "task.created",
      payload: { id: "1", userId: "u1", name: "Test" },
    });
    await bus.publish({ type: "task.deleted", payload: { id: "1" } });

    expect(handler).not.toHaveBeenCalled();
  });

  it("should run handlers in parallel", async () => {
    const order: number[] = [];

    const slowHandler = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      order.push(1);
    });
    const fastHandler = vi.fn(async () => {
      order.push(2);
    });

    bus.subscribe("task.created", slowHandler);
    bus.subscribe("task.created", fastHandler);

    await bus.publish({
      type: "task.created",
      payload: { id: "1", userId: "u1", name: "Test" },
    });

    // Fast handler completes before slow handler since they run in parallel
    expect(order).toEqual([2, 1]);
  });
});
