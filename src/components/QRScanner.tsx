import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, X, CameraOff, RefreshCw, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
  onClose: () => void;
}

function getQrBox(vw: number, vh: number) {
  const size = Math.round(Math.min(vw, vh) * 0.68);
  return { width: size, height: size };
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanError, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: getQrBox },
          (decodedText) => scanner.stop().then(() => onScanSuccess(decodedText)),
          onScanError
        );
        setIsInitializing(false);
      } catch {
        setError("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
        setIsInitializing(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 overflow-hidden bg-black"
    >
      {/* ── CSS: Force html5-qrcode internals + scan keyframe ─── */}
      <style>{`
        #qr-reader,
        #qr-reader > div,
        #qr-reader > div > div {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          background: transparent !important;
        }
        #qr-reader video {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }
        #qr-reader__dashboard,
        #qr-reader__status_span,
        #qr-reader__header_message,
        #qr-reader > img,
        #qr-reader canvas { display: none !important; }

        @keyframes qr-scan {
          0%   { top: 0%; }
          50%  { top: calc(100% - 2px); }
          100% { top: 0%; }
        }
        .qr-scan-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 2px;
          background: #3b82f6;
          box-shadow: 0 0 16px 6px rgba(59, 130, 246, 0.65);
          animation: qr-scan 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Camera layer */}
      <div id="qr-reader" className="absolute inset-0" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 50%, transparent 0%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* ── Page-level scan frame ──────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 22 }}
          style={{ width: 'min(68vmin, 300px)', height: 'min(68vmin, 300px)' }}
          className="relative"
        >
          {/* Corner brackets */}
          {[
            'top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-[28px]',
            'top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-[28px]',
            'bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-[28px]',
            'bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-[28px]',
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute border-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] ${cls}`}
              style={{ width: 'min(12vmin, 48px)', height: 'min(12vmin, 48px)' }}
            />
          ))}

          {/* Inner guide */}
          <div className="absolute inset-5 rounded-2xl border border-white/10" />

          {/* Always-on CSS scan line (no state dependency) */}
          {!error && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="qr-scan-line" />
            </div>
          )}

          {/* Initializing spinner */}
          <AnimatePresence>
            {isInitializing && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <RefreshCw className="h-7 w-7 text-primary animate-spin drop-shadow-lg" />
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                  Inisialisasi...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08, type: 'spring', stiffness: 300, damping: 28 }}
        className="absolute top-0 inset-x-0 z-30 bg-linear-to-b from-black/80 to-transparent"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 20px)' }}
      >
        <div className="flex items-center justify-between px-5 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/90 backdrop-blur-md flex items-center justify-center shadow-lg shadow-primary/40 shrink-0">
              <Scan className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tighter text-white leading-none">QR Scanner</p>
              <p className="text-[10px] font-bold text-white/45 uppercase tracking-widest mt-0.5">
                Sistem Verifikasi SIK
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/15 transition-all active:scale-90 pointer-events-auto"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </motion.header>

      {/* ── Bottom bar ──────────────────────────────────────────── */}
      <motion.footer
        initial={{ y: 56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12, type: 'spring', stiffness: 300, damping: 28 }}
        className="absolute bottom-0 inset-x-0 z-30 bg-linear-to-t from-black/80 to-transparent"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 32px)' }}
      >
        <div className="flex flex-col items-center gap-2 pt-6 px-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
              System Secure Scan
            </p>
          </div>
          <p className="text-[11px] font-medium text-white/35 max-w-[240px] text-center leading-relaxed">
            Arahkan kamera ke QR Code SIK Digital. Verifikasi otomatis.
          </p>
        </div>
      </motion.footer>

      {/* ── Error overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-slate-950/95 backdrop-blur-2xl px-8 text-center"
          >
            <div className="h-20 w-20 rounded-[28px] bg-red-950/60 border border-red-900/40 flex items-center justify-center">
              <CameraOff className="h-10 w-10 text-red-400" />
            </div>
            <div className="space-y-2">
              <p className="text-base font-black text-white">Akses Kamera Gagal</p>
              <p className="text-sm font-medium text-red-300/75 leading-relaxed max-w-[260px]">{error}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[260px]">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 rounded-2xl bg-red-500 hover:bg-red-600 text-white border-none h-12 font-black text-xs uppercase tracking-widest"
              >
                Coba Lagi
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 rounded-2xl border-white/10 text-white hover:bg-white/10 h-12 font-black text-xs uppercase tracking-widest"
              >
                Tutup
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
