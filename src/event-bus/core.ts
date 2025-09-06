import type { EventBusEvents } from './events';

export type EventHandler<T> = (payload: T) => void;


export class EventBus<Events extends Record<string, unknown>> {
  private listeners: { [K in keyof Events]?: Set<EventHandler<Events[K]>> } = {};

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
    (this.listeners[event] ||= new Set()).add(handler);
    return () => this.off(event, handler);
  }

  once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
    const wrap: EventHandler<Events[K]> = (payload) => {
      this.off(event, wrap);
      handler(payload);
    };
    return this.on(event, wrap);
  }

  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
    this.listeners[event]?.delete(handler);
    if (this.listeners[event] && this.listeners[event]!.size === 0) delete this.listeners[event];
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    const handlers = this.listeners[event];
    if (!handlers || handlers.size === 0) return;
    [...handlers].forEach(h => h(payload));
  }

  listenerCount<K extends keyof Events>(event: K): number {
    return this.listeners[event]?.size || 0;
  }
}

const GLOBAL_SYMBOL = Symbol.for('__accessly_event_bus__');
type GlobalWithBus = { [GLOBAL_SYMBOL]?: EventBus<EventBusEvents> } & typeof globalThis;

export function getGlobalEventBus(): EventBus<EventBusEvents> {
  const g = globalThis as GlobalWithBus;
  if (!g[GLOBAL_SYMBOL]) g[GLOBAL_SYMBOL] = new EventBus<EventBusEvents>();
  return g[GLOBAL_SYMBOL]!;
}