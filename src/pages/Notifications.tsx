import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MessageCircle, Receipt, ClipboardCheck } from "lucide-react";

export const NotificationsPage = () => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "expense",
      message: "New expense added: Groceries - ₹2,500",
      time: "2 hours ago",
      icon: Receipt,
    },
    {
      id: 2,
      type: "chore",
      message: "Chore assigned: Clean kitchen",
      time: "5 hours ago",
      icon: ClipboardCheck,
    },
    {
      id: 3,
      type: "reminder",
      message: "Reminder: Pay rent by end of week",
      time: "1 day ago",
      icon: MessageCircle,
    },
  ];

  return (
    <div>
      <h1>Notifications</h1>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-purple/10 rounded-lg">
                    <notification.icon className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}; 