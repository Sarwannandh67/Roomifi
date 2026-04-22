import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Receipt, ClipboardCheck, MessageCircle, Settings, MessageSquare } from "lucide-react";

export const MobileNav = () => {
  const location = useLocation();
  
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
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full grid-cols-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center ${
              location.pathname === item.path
                ? "text-brand-purple"
                : "text-muted-foreground"
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs mt-0.5">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
