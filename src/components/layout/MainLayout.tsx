import React from "react";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-full">
      {!isMobile && <Sidebar />}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 pb-20 md:pb-8">
          <div className="container py-6 px-4">{children}</div>
        </main>
        {isMobile && <MobileNav />}
      </div>
    </div>
  );
};

export default MainLayout;

