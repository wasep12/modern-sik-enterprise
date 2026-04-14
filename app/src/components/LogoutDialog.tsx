import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md" 
            onClick={onClose} 
          />
          
          {/* Dialog Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[40px] shadow-luxury ring-1 ring-white/20 dark:ring-white/5 overflow-hidden p-8 text-center"
          >
            <div className="h-16 w-16 rounded-3xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
               <AlertTriangle className="h-8 w-8" />
            </div>
            
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Konfirmasi Keluar</h2>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Apakah Anda yakin ingin mengakhiri sesi kerja saat ini? Pekerjaan yang belum disimpan mungkin akan hilang.
            </p>
            
            <div className="flex flex-col gap-3">
               <Button 
                 onClick={onConfirm}
                 className="bg-red-500 hover:bg-red-600 text-white rounded-[20px] h-12 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-red-500/20 border-none"
               >
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar Sekarang
               </Button>
               <Button 
                 variant="secondary"
                 onClick={onClose}
                 className="bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-[20px] h-12 font-black uppercase tracking-widest text-[11px] border-none"
               >
                  Batal
               </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
