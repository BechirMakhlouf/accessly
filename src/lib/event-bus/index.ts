import { env } from "../env";
import { getGlobalEventBus } from "./core";
import { EventBusEvents } from "./events";
export type { EventBusEvents, EventPayload } from "./events";

export const eventBus = getGlobalEventBus();

// Server-safe helpers (no React dependency)
export function emitEvent<K extends keyof EventBusEvents>(
  event: K,
  payload: EventBusEvents[K],
) {
  if (env.NODE_ENV === "development") {
    console.log("Emitting event:", event, payload);
  }
  eventBus.emit(event, payload);
}

export function subscribeEvent<K extends keyof EventBusEvents>(
  event: K,
  handler: (payload: EventBusEvents[K]) => void,
) {
  return eventBus.on(event, handler);
}

export function subscribeEventOnce<K extends keyof EventBusEvents>(
  event: K,
  handler: (payload: EventBusEvents[K]) => void,
) {
  return eventBus.once(event, handler);
}

export function getListenerCount<K extends keyof EventBusEvents>(event: K) {
  return eventBus.listenerCount(event);
}

export const __EVENT_BUS__ = env.NODE_ENV !== "production"
  ? eventBus
  : undefined;

