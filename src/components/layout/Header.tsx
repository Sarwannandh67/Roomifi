import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/premium/PremiumButton";

export const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">RoomiFi AI</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <PremiumButton 
            variant="ghost" 
            size={isMobile ? "sm" : "default"}
          />
          <Link to="/notifications">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
