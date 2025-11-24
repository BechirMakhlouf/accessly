"use client";

import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Notification {
  id: number;
  title: string;
  description: string;
  user?: {
    name: string;
    avatar?: string;
  };
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Alex Johnson started following you",
    description: "You have a new follower",
    user: { name: "Alex Johnson", avatar: "/placeholder.svg" },
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    title: "Sarah commented on your post",
    description: "Great work! Keep going 💪",
    user: { name: "Sarah Doe" },
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    title: "System update completed",
    description: "Your account has been upgraded successfully.",
    time: "2 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [search, setSearch] = useState("");

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase())
  );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteAll = () => setNotifications([]);

  return (
    <div className="w-full min-h-screen bg-background px-12 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="h-7 w-7 text-blue-500" />
          <h1 className="text-3xl font-semibold">Notifications</h1>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search notifications..."
            className="w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="mr-1 h-4 w-4" /> Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={deleteAll}>
            <Trash2 className="mr-1 h-4 w-4" /> Clear all
          </Button>
        </div>
      </div>

      {/* Notification list full width */}
      <div className="border-t border-border divide-y divide-border rounded-md overflow-hidden shadow-sm">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-center justify-between w-full px-6 py-5 hover:bg-muted/100 transition ${
                n.read ? "opacity-80" : "bg-muted/10"
              }`}
            >
              {/* Left part (avatar + text) */}
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  {n.user?.avatar ? (
                    <AvatarImage src={n.user.avatar} alt={n.user.name} />
                  ) : (
                    <AvatarFallback>
                      {n.user?.name
                        ? n.user.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                        : "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p
                    className={`text-base font-medium ${
                      n.read ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {n.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {n.description}
                  </p>
                </div>
              </div>

              {/* Right part (time) */}
              <div className="text-sm text-muted-foreground">{n.time}</div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
}
