'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type { EventBusEvents } from '@/lib/event-bus';
import { eventBus } from '@/lib/event-bus';

export function useEventBus<K extends keyof EventBusEvents>(
  event: K,
  handler: (payload: EventBusEvents[K]) => void
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const wrapped = (payload: EventBusEvents[K]) => handlerRef.current(payload);
    eventBus.on(event, wrapped);
    return () => eventBus.off(event, wrapped);
  }, [event]);
}

export function useEmitEvent<K extends keyof EventBusEvents>(event: K) {
  return useCallback(
    (payload: EventBusEvents[K]) => {
      eventBus.emit(event, payload);
    },
    [event]
  );
}

export function useEventBusValue<K extends keyof EventBusEvents>(event: K) {
  const [value, setValue] = useState<EventBusEvents[K] | null>(null);
  useEventBus(event, payload => setValue(payload));
  return value;
}
