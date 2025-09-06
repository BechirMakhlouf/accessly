
export type EventBusEvents = {
  notification: { message: string };
  'user-logged-in': { userId: string };
  'data-updated': { dataId: string; newData: unknown };
};

export type EventPayload<K extends keyof EventBusEvents> = EventBusEvents[K];