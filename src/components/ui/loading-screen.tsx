import React from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* App logo */}
        <motion.div 
          className="w-20 h-20 bg-brand-purple rounded-xl flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-2xl font-bold text-white">R</span>
        </motion.div>
        
        {/* Loading spinner */}
        <motion.div 
          className="h-12 w-12 rounded-full border-4 border-muted border-t-brand-purple"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Loading message */}
        <motion.p 
          className="text-lg text-foreground font-medium mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
