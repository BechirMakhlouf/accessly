import { EventBus, getGlobalEventBus, type EventHandler } from './bus';
import type { EventBusEvents, EventPayload } from './events';
export const eventBus = getGlobalEventBus();
export function emitEvent<K extends keyof EventBusEvents>(event: K, payload: EventBusEvents[K]) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[event-bus:emit]', event, payload);
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
export { useEventBus, useEmitEvent, useEventBusValue } from './hooks/use-event-bus';
export { EventBus, getGlobalEventBus };
export type { EventBusEvents, EventPayload, EventHandler };
export const __EVENT_BUS__ = process.env.NODE_ENV !== 'production' ? eventBus : undefined;