import React from 'react';
import { motion } from 'framer-motion';
import type { LucideProps } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12",
        className
      )}
    >
      <div className="relative mb-8">
        {/* Background decorative glow */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 transform-gpu" />
        
        {/* Icon Container */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-[32px] sm:rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-luxury flex items-center justify-center"
        >
          <Icon className="h-10 w-10 sm:h-14 sm:w-14 text-primary" />
          
          {/* Subtle floating circles */}
          <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20" />
          <div className="absolute -bottom-4 -left-4 h-8 w-8 rounded-full bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10" />
        </motion.div>
      </div>

      <div className="max-w-md space-y-3 relative z-10">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
          {title}
        </h3>
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {action && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <Button 
            onClick={action.onClick}
            className="rounded-2xl h-14 px-8 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 border-none"
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
