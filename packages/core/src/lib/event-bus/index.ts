import { eventBus } from "./core";
import { EventBusEvents } from "./events";
export type { EventPayload, EventBusEvents } from "./events";

export { eventBus };

export function emitEvent<K extends keyof EventBusEvents>(
  event: K,
  payload: EventBusEvents[K],
) {
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
