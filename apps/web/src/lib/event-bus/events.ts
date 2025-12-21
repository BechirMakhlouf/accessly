/**
 * Event name -> payload contract map. Add new events here.
 */
export type EventBusEvents = {
  notification: { message: string };
  'user-logged-in': { userId: string };
  'data-updated': { dataId: string; newData: unknown };
  organization_created: { message: string; type?: string };
  organization_created_backend: {
    message: string;
    type?: string;
    userId: string;
  };
};

export type EventPayload<K extends keyof EventBusEvents> = EventBusEvents[K];
