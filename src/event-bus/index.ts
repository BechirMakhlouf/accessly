
import { getGlobalEventBus } from './bus';
import type { EventBusEvents } from './events';

export type { EventBusEvents } from './events';

export const eventBus = getGlobalEventBus();

// Server-safe helpers (no React dependency)
export function emitEvent<K extends keyof EventBusEvents>(event: K, payload: EventBusEvents[K]) {
    console.log("Emitting event:", event, payload);
  eventBus.emit(event, payload);
}

export function subscribeEvent<K extends keyof EventBusEvents>(
  event: K,
  handler: (payload: EventBusEvents[K]) => void
) {
  return eventBus.on(event, handler);
}

export function subscribeEventOnce<K extends keyof EventBusEvents>(
  event: K,
  handler: (payload: EventBusEvents[K]) => void
) {
  return eventBus.once(event, handler);
}

export function getListenerCount<K extends keyof EventBusEvents>(event: K) {
  return eventBus.listenerCount(event);
}

export const __EVENT_BUS__ = process.env.NODE_ENV !== 'production' ? eventBus : undefined;