import React, { createContext, useContext, useState, useCallback } from 'react';

interface TransitionContextType {
  isLoading: boolean;
  startTransition: (callback?: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startTransition = useCallback((callback?: () => void) => {
    setIsLoading(true);
    
    // Set a 2-second delay
    setTimeout(() => {
      setIsLoading(false);
      if (callback) callback();
    }, 2000);
  }, []);

  return (
    <TransitionContext.Provider value={{ isLoading, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};
