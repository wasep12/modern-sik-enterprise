import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundAurora: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Light Mode Blobs (Pastels) */}
      <div className="absolute inset-0 dark:hidden">
        <Blob 
            color="bg-blue-200/50" 
            size="w-[800px] h-[800px]" 
            initial={{ x: '-20%', y: '-10%' }}
            animate={{ 
                x: ['-20%', '10%', '-10%', '-20%'],
                y: ['-10%', '20%', '10%', '-10%'],
                scale: [1, 1.1, 0.9, 1]
            }} 
        />
        <Blob 
            color="bg-purple-200/50" 
            size="w-[700px] h-[700px]" 
            initial={{ x: '50%', y: '10%' }}
            animate={{ 
                x: ['50%', '30%', '60%', '50%'],
                y: ['10%', '40%', '20%', '10%'],
                scale: [1, 1.2, 0.8, 1]
            }} 
        />
        <Blob 
            color="bg-emerald-100/40" 
            size="w-[600px] h-[600px]" 
            initial={{ x: '10%', y: '50%' }}
            animate={{ 
                x: ['10%', '-10%', '20%', '10%'],
                y: ['50%', '30%', '60%', '50%'],
                scale: [1, 0.9, 1.1, 1]
            }} 
        />
      </div>

      {/* Dark Mode Blobs (Deep Cosmic) */}
      <div className="absolute inset-0 hidden dark:block">
        <Blob 
            color="bg-indigo-900/40" 
            size="w-[900px] h-[900px]" 
            initial={{ x: '-30%', y: '-20%' }}
            animate={{ 
                x: ['-30%', '0%', '-20%', '-30%'],
                y: ['-20%', '10%', '-10%', '-20%'],
                scale: [1, 1.1, 1, 1]
            }} 
        />
        <Blob 
            color="bg-blue-900/40" 
            size="w-[800px] h-[800px]" 
            initial={{ x: '40%', y: '0%' }}
            animate={{ 
                x: ['40%', '60%', '30%', '40%'],
                y: ['0%', '30%', '10%', '0%'],
                scale: [1, 1.2, 0.9, 1]
            }} 
        />
        <Blob 
            color="bg-purple-900/30" 
            size="w-[700px] h-[700px]" 
            initial={{ x: '0%', y: '40%' }}
            animate={{ 
                x: ['0%', '-20%', '10%', '0%'],
                y: ['40%', '60%', '30%', '40%'],
                scale: [1, 1.1, 0.8, 1]
            }} 
        />
      </div>

      {/* Grid Overlay for texture */}
      <div className="absolute inset-0 bg-grid-slate-100/30 dark:bg-grid-slate-900/20" />
    </div>
  );
};

const Blob = ({ 
    color, 
    size, 
    initial, 
    animate 
}: { 
    color: string; 
    size: string; 
    initial: any; 
    animate: any; 
}) => (
  <motion.div
    initial={initial}
    animate={animate}
    transition={{
      duration: 25,
      repeat: Infinity,
      ease: "linear"
    }}
    className={`absolute rounded-full blur-[120px] ${color} ${size} mix-blend-multiply dark:mix-blend-screen overflow-hidden`}
    style={{ willChange: 'transform' }}
  />
);
