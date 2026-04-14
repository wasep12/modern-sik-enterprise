import React, { useState, useMemo, useEffect } from 'react';
import { useSikStore } from '../../store/useSikStore';
import { 
  Search, 
  MapPin, 
  LogIn, 
  LogOut,
  QrCode,
  ShieldAlert,
  Scan,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { formatID, cn } from '../../lib/utils';
import { StatusBadge } from '../dashboard/MySik';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { Skeleton } from '../../components/ui/skeleton';
import { QRScanner } from '../../components/QRScanner';
import { toast } from 'sonner';

// HELPER: Specialized Skeletons for Security
const SecurityPanelSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[48px] border dark:border-slate-800 shadow-2xl p-6 sm:p-12 flex flex-col items-center text-center">
        <Skeleton className="h-24 w-24 rounded-[28px] mb-6" />
        <Skeleton className="h-8 w-48 mb-3" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 mb-6">
            <Skeleton className="h-16 flex-1 rounded-2xl" />
            <Skeleton className="h-16 w-28 rounded-2xl" />
        </div>
        <Skeleton className="h-16 w-64 rounded-2xl" />
    </div>
);

export const CheckPoint: React.FC = () => {
  const { requests, checkIn, checkOut } = useSikStore();
  const [searchId, setSearchId] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // SIMULATE LOADING
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Sync selected request from store using activeId
  const selectedReq = useMemo(() => {
    if (!activeId) return null;
    return requests.find(r => r.id === activeId || formatID(r.id) === activeId) || null;
  }, [requests, activeId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = requests.find(r => r.id === searchId || formatID(r.id) === searchId);
    if (found) {
      setActiveId(found.id);
      toast.success('SIK Ditemukan', { description: `Data personil ${found.userName} berhasil dimuat.` });
    } else {
      setActiveId(null);
      toast.error('SIK Tidak Ditemukan', { description: 'Periksa kembali ID SIK yang Anda masukkan.' });
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false);
    setActiveId(decodedText);
    toast.success('Scan Berhasil', { description: 'ID SIK terverifikasi melalui kamera.' });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-20 mt-4 transform-gpu">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="skeleton"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <SecurityPanelSkeleton />
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Control Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[48px] border dark:border-slate-800 shadow-2xl p-6 sm:p-12 flex flex-col items-center text-center relative overflow-hidden transform-gpu">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary via-blue-400 to-primary" />
              
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[28px] bg-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/40 relative">
                 <div className="absolute inset-0 bg-white/20 rounded-[28px] animate-ping opacity-10" />
                 <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-white relative z-10" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter dark:text-white leading-none">Security Center</h2>
              <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-xs mt-3">
                Verifikasi izin akses personil melalui pemindaian QR Code SIK Digital.
              </p>

              <form onSubmit={handleSearch} className="mt-8 sm:mt-10 flex flex-col sm:flex-row w-full max-w-md gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Input ID SIK..."
                    className="w-full pl-12 pr-4 h-14 sm:h-16 bg-slate-50 dark:bg-slate-800 border rounded-2xl shadow-inner outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold dark:text-white dark:border-slate-800"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-14 sm:h-16 rounded-2xl px-8 font-black text-sm uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 border-none shrink-0"
                >
                  Check
                </Button>
              </form>

              <div className="flex items-center gap-4 w-full max-w-md mt-6">
                 <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
                 <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] Middle">Or</p>
                 <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
              </div>
              
              <Button 
                variant="outline" 
                className="mt-6 rounded-2xl px-8 sm:px-10 h-14 sm:h-16 border-2 border-primary/20 bg-white dark:bg-slate-900 hover:bg-primary/5 text-primary font-black shadow-lg shadow-primary/5 transition-all active:scale-95 overflow-hidden"
                onClick={() => setIsScannerOpen(true)}
              >
                <div className="flex items-center justify-center gap-3">
                    <Scan className="h-5 w-5" />
                    Aktifkan QR Scanner
                </div>
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {selectedReq && (
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  key={selectedReq.id}
                  className="bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[40px] border dark:border-slate-800 shadow-2xl overflow-hidden relative transform-gpu"
                >
                  <div className={cn(
                    "py-3 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-white",
                    ['APPROVED', 'CHECKED_IN'].includes(selectedReq.status) ? "bg-emerald-500" : "bg-red-500"
                  )}>
                    {['APPROVED', 'CHECKED_IN'].includes(selectedReq.status) ? 'Otorisasi Aktif' : 'Akses Dilarang'}
                  </div>
                  
                  <div className="p-6 sm:p-10">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                      {/* QR Section */}
                      <div className="flex flex-col items-center gap-4 shrink-0 mx-auto lg:mx-0">
                         <div className="h-36 w-36 sm:h-44 sm:w-44 bg-slate-50 dark:bg-white p-6 rounded-[28px] sm:rounded-[32px] border dark:border-slate-800 shadow-inner relative group">
                            <QRCodeSVG value={selectedReq.id} size={selectedReq.id.length > 10 ? 120 : 132} level="H" className="mx-auto" />
                         </div>
                         <div className="text-center">
                            <p className="text-xl sm:text-2xl font-black tracking-tighter dark:text-white">{formatID(selectedReq.id)}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest leading-none">Voucher ID Valid</p>
                         </div>
                      </div>

                      {/* Data Section */}
                      <div className="flex-1 space-y-6 sm:space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div>
                              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">{selectedReq.userName}</h3>
                              <StatusBadge status={selectedReq.status} />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <MapPin className="h-3 w-3" /> Area Target
                            </div>
                            <p className="font-bold text-sm dark:text-white p-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-xl">{selectedReq.location}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <Clock className="h-3 w-3" /> Durasi Izin
                            </div>
                            <p className="font-bold text-[10px] sm:text-xs dark:text-white p-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-xl">
                              {format(new Date(selectedReq.startTime), 'HH:mm')} <ArrowRight className="inline h-3 w-3 mx-1" /> {format(new Date(selectedReq.endTime), 'HH:mm')}
                            </p>
                          </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        <div className="flex flex-col sm:flex-row gap-3">
                          {selectedReq.status === 'APPROVED' && (
                            <Button 
                              className="flex-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white h-14 sm:h-16 font-black text-base shadow-xl shadow-emerald-500/20 dark:shadow-none transition-all border-none"
                              onClick={() => checkIn(selectedReq.id)}
                            >
                              <LogIn className="mr-2 h-5 w-5" />
                              Check-In Masuk
                            </Button>
                          )}
                          {selectedReq.status === 'CHECKED_IN' && (
                            <Button 
                              className="flex-1 rounded-2xl bg-slate-950 dark:bg-white dark:text-slate-950 hover:bg-black h-14 sm:h-16 font-black text-base shadow-xl dark:shadow-none transition-all border-none"
                              onClick={() => checkOut(selectedReq.id)}
                            >
                              <LogOut className="mr-2 h-5 w-5" />
                              Check-Out Keluar
                            </Button>
                          )}
                          {['REJECTED', 'CHECKED_OUT'].includes(selectedReq.status) && (
                            <div className="flex-1 p-4 rounded-2xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-4 text-slate-500">
                              <ShieldAlert className="h-8 w-8 opacity-50" />
                              <div className="space-y-0.5">
                                <p className="text-sm font-black uppercase tracking-tight">Status Akhir</p>
                                <p className="text-[10px] font-bold opacity-70">Akses tidak tersedia untuk draf/izin yang sudah tutup.</p>
                              </div>
                            </div>
                          )}
                          <Button 
                              variant="ghost" 
                              className="rounded-2xl h-14 sm:h-16 px-6 font-bold text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                              onClick={() => setActiveId(null)}
                          >
                             Tutup
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScannerOpen && (
           <QRScanner 
              onScanSuccess={handleScanSuccess} 
              onClose={() => setIsScannerOpen(false)} 
              onScanError={(err) => console.log(err)}
           />
        )}
      </AnimatePresence>
    </div>
  );
};
