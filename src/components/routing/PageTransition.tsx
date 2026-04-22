import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevLocationPath, setPrevLocationPath] = useState('');

  useEffect(() => {
    // Only show loading on subsequent navigations, not on initial load
    if (prevLocationPath === '') {
      setPrevLocationPath(location.pathname);
      return;
    }

    // If location changes and it's not the initial load
    if (location.pathname !== prevLocationPath) {
      setIsLoading(true);
      
      // Wait for 2 seconds before showing the new page
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPrevLocationPath(location.pathname);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [location, prevLocationPath]);

  return (
    <>
      {isLoading && <LoadingScreen message="Loading page..." />}
      <div style={{ display: isLoading ? 'none' : 'block' }}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
