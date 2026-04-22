import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Receipt, ClipboardCheck, MessageCircle, Settings, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Sidebar = () => {
  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
    },
    {
      name: "Expenses",
      icon: Receipt,
      path: "/expenses",
    },
    {
      name: "Chores",
      icon: ClipboardCheck,
      path: "/chores",
    },
    {
      name: "Reminders",
      icon: MessageCircle,
      path: "/reminders",
    },
    {
      name: "Chat",
      icon: MessageSquare,
      path: "/chat",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-border">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-brand-purple">RoomiFi</h2>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-brand-purple text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
