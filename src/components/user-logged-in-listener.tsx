"use client"

import { useEffect } from 'react';
import { eventBus } from '@/event-bus';

export function UserLoggedInListener() {
  useEffect(() => {
    const handler = (payload: { userId: string }) => {
      alert(`User logged in! User ID: ${payload.userId}`);
    };
    eventBus.on('user-logged-in', handler);
    return () => {
      eventBus.off('user-logged-in', handler);
    };
  }, []);
  return null;
}
