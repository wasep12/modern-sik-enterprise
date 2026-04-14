import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, X, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanError, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We use a small timeout to ensure the DOM element #qr-reader is fully available 
    // even after Framer Motion animations have started.
    const containerId = "qr-reader";
    const timer = setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        const config = { 
          fps: 15, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };

        // Start camera with 'environment' (back) camera priority
        await scanner.start(
          { facingMode: "environment" }, 
          config, 
          (decodedText) => {
            scanner.stop().then(() => {
              onScanSuccess(decodedText);
            });
          },
          onScanError
        );
        
        setIsInitializing(false);
      } catch (err: any) {
        console.error("Camera detection failed:", err);
        setError("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
        setIsInitializing(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(e => console.error("Cleanup stop failed", e));
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border dark:border-slate-800"
      >
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/50 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <Scan className="h-5 w-5 text-white" />
               </div>
               <div>
                  <h3 className="text-lg font-black tracking-tighter dark:text-white leading-none">QR Scanner</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sistem Verifikasi SIK</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full dark:text-white">
                <X className="h-5 w-5" />
            </Button>
        </div>

        <div className="p-4 sm:p-10 text-center">
          <div className="relative aspect-square w-full max-w-[320px] mx-auto overflow-hidden rounded-[32px] bg-slate-100 dark:bg-slate-950 border-4 border-slate-100 dark:border-slate-800">
             
             {/* THE CAMERA VIEWPORT */}
             <div id="qr-reader" className="w-full h-full" />

             {/* OVERLAYS */}
             <AnimatePresence>
                {isInitializing && !error && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 z-10"
                    >
                        <RefreshCw className="h-8 w-8 text-primary animate-spin mb-3" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inisialisasi Kamera...</p>
                    </motion.div>
                )}

                {error && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 dark:bg-red-950/20 z-10 p-6"
                    >
                        <CameraOff className="h-10 w-10 text-red-500 mb-4" />
                        <p className="text-xs font-bold text-red-500 mb-4">{error}</p>
                        <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="rounded-xl border-red-500/20 text-red-500">
                           Coba Lagi
                        </Button>
                    </motion.div>
                )}
             </AnimatePresence>

             {/* RADAR SCAN LINE */}
             {!isInitializing && !error && (
                <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="w-full h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-radar" />
                    <div className="absolute inset-x-8 inset-y-8 border-2 border-primary/30 rounded-2xl border-dashed" />
                </div>
             )}
          </div>
          
          <div className="mt-8 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cara Penggunaan:</p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              Arahkan kamera ke QR Code SIK Digital pendatang. Kamera akan melakukan verifikasi data secara otomatis.
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 py-6 text-center pointer-events-none opacity-20">
           <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">System Secure Scan</p>
        </div>
      </motion.div>
    </div>
  );
};
