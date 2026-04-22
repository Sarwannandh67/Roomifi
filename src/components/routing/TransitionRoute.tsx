import React, { useEffect, useState } from 'react';
import { Route, useLocation, useNavigate } from 'react-router-dom';
import { useTransition } from '@/context/TransitionContext';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface TransitionRouteProps {
  path: string;
  element: React.ReactNode;
}

export const TransitionRoute: React.FC<TransitionRouteProps> = ({ path, element }) => {
  const { isLoading, startTransition } = useTransition();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [nextElement, setNextElement] = useState(element);

  useEffect(() => {
    // If the location changes and it matches this route's path pattern
    if (location.pathname !== currentPath && matchPath(location.pathname, path)) {
      startTransition(() => {
        setCurrentPath(location.pathname);
        setNextElement(element);
      });
    }
  }, [location.pathname, currentPath, path, element, startTransition]);

  return (
    <>
      {isLoading && <LoadingScreen message="Loading page..." />}
      <Route path={path} element={nextElement} />
    </>
  );
};

// Helper function to match path patterns (simplified version)
function matchPath(pathname: string, pattern: string): boolean {
  // Convert route pattern to regex
  const regexPattern = pattern
    .replace(/\/\*/g, '(/.*)?') // Handle wildcard routes
    .replace(/:[\w-]+/g, '[^/]+'); // Handle parameter routes like :id
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(pathname);
}

export default TransitionRoute;
