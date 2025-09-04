"use client";

import { useState } from "react";
import {
  Archive,
  Bell,
  Heart,
  MessageCircle,
  Settings,
  User,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  title: string;
  user?: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  isRead: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    title: "Sarah liked your post about React components",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    timestamp: "2 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    type: "comment",
    title: "Mike commented on your project",
    user: { name: "Mike Chen", avatar: "/placeholder.svg?height=32&width=32" },
    timestamp: "1 hour ago",
    isRead: false,
  },
  {
    id: "3",
    type: "follow",
    title: "Alex started following you",
    user: { name: "Alex Rivera" },
    timestamp: "3 hours ago",
    isRead: false,
  },
];

const archivedNotifications: Notification[] = [
  {
    id: "4",
    type: "mention",
    title: "You were mentioned in a discussion",
    user: { name: "Emma Davis", avatar: "/placeholder.svg?height=32&width=32" },
    timestamp: "1 day ago",
    isRead: true,
  },
  {
    id: "5",
    type: "like",
    title: "John liked your comment",
    user: { name: "John Smith" },
    timestamp: "2 days ago",
    isRead: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case "follow":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "mention":
      return <User className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [archived, setArchived] = useState(archivedNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const archiveNotification = (notificationId: string) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setArchived((prev) => [...prev, { ...notification, isRead: true }]);
    }
  };

  const NotificationItem = ({
    notification,
    showArchive = false,
  }: {
    notification: Notification;
    showArchive?: boolean;
  }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg group">
      <div className="flex-shrink-0">
        {notification.user?.avatar
          ? (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={notification.user.avatar || "/placeholder.svg"}
                alt={notification.user.name}
              />
              <AvatarFallback>
                {notification.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )
          : (
            <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
              {getNotificationIcon(notification.type)}
            </div>
          )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-5">
          {notification.title}
        </p>
        <p className="text-xs text-foreground mt-1">{notification.timestamp}</p>
      </div>

      {showArchive && (
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => archiveNotification(notification.id)}
        >
          <Archive className="h-4 w-4" />
        </Button>
      )}

      {!notification.isRead && (
        <div className="flex-shrink-0">
          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
        </div>
      )}
    </div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <Bell className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 border" align="end">
        <Tabs defaultValue="inbox" className="w-full">
          <div className="flex items-center justify-between border-b">
            <TabsList className="grid  grid-cols-2 mt-2">
              <TabsTrigger value="inbox" className="text-sm">
                Inbox
                {unreadCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="archive" className="text-sm">
                Archive
              </TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="inbox" className="mt-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0
                ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        showArchive={true}
                      />
                    ))}
                  </div>
                )
                : (
                  <EmptyState message="You're all caught up! No new notifications." />
                )}
            </div>
          </TabsContent>

          <TabsContent value="archive" className="mt-0">
            <div className="max-h-96 overflow-y-auto">
              {archived.length > 0
                ? (
                  <div className="divide-y">
                    {archived.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        showArchive={false}
                      />
                    ))}
                  </div>
                )
                : <EmptyState message="No archived notifications yet." />}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
