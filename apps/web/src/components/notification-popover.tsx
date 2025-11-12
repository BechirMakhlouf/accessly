"use client";

import { useEffect, useState } from "react";
import { Bell, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserNotifications } from "@/modules/notifications/hooks/use-user-notifications";

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());

  const { notifications, isLoading, error, refetch } = useUserNotifications();

  const inbox = notifications.filter((n) => !archivedIds.has(n.id));
  const archived = notifications.filter((n) => archivedIds.has(n.id));

  const archiveNotification = (id: string) => {
    setArchivedIds((prev) => new Set(prev).add(id));
  };

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen, refetch]);

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <Bell className="h-6 w-6 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 border" align="end">
        <Tabs defaultValue="inbox" className="w-full">
          <div className="flex items-center justify-between border-b">
            <TabsList className="grid grid-cols-2 mt-2">
              <TabsTrigger value="inbox" className="text-sm">Inbox</TabsTrigger>
              <TabsTrigger value="archive" className="text-sm">Archive</TabsTrigger>
            </TabsList>
            <div className="pr-2">
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                Refresh
              </Button>
            </div>
          </div>

          <TabsContent value="inbox" className="mt-0">
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <EmptyState message="Loading notifications..." />
              ) : error ? (
                <EmptyState message="Failed to load notifications." />
              ) : inbox.length > 0 ? (
                <div className="divide-y">
                  {inbox.map((n) => (
                    <div key={n.id} className="flex items-center justify-between p-3">
                      <div>
                        <p className="text-sm font-medium">{n.message}</p>
                        <p className="text-xs text-gray-500">{n.sent_at}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => archiveNotification(n.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="You're all caught up!" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="archive" className="mt-0">
            <div className="max-h-96 overflow-y-auto">
              {archived.length > 0 ? (
                <div className="divide-y">
                  {archived.map((n) => (
                    <div key={n.id} className="flex items-center justify-between p-3">
                      <div>
                        <p className="text-sm font-medium">{n.message}</p>
                        <p className="text-xs text-gray-500">{n.sent_at}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No archived notifications yet." />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
