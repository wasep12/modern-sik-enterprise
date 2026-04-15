import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useSikStore } from '../../store/useSikStore';
import { format } from 'date-fns';
import { 
  Clock, 
  CheckCircle2, 
  MapPin, 
  FileText,
  Eye,
  Download,
  X,
  ShieldCheck,
  Calendar,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  History,
  MessageCircle,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatID } from '../../lib/utils';
import type { SikRequest } from '../../types/sik';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../../components/ui/button';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Skeleton } from '../../components/ui/skeleton';
import { toast } from 'sonner';
import { EmptyState } from '../../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

// HELPER: Specialized Skeletons for Best Practice
const StatusCardSkeleton = () => (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 sm:p-8 rounded-[40px] shadow-luxury ring-1 ring-white/20 dark:ring-white/5 flex items-center justify-between">
        <div className="space-y-3 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-16" />
        </div>
        <Skeleton className="h-14 w-14 rounded-2xl" />
    </div>
);

const TableRowSkeleton = () => (
    <div className="px-6 sm:px-8 py-6 border-b dark:border-slate-800 last:border-0">
        <div className="hidden sm:flex items-center gap-6 w-full">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="flex-1 h-6" />
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-40 h-8 rounded-full" />
            <Skeleton className="w-28 h-10 rounded-xl" />
        </div>
        <div className="flex sm:hidden flex-col gap-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-10 w-full rounded-xl" />
        </div>
    </div>
);

const GreetingHeader: React.FC<{ user: any; requests: SikRequest[] }> = ({ user, requests }) => {
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Selamat Pagi');
    else if (hour < 15) setGreeting('Selamat Siang');
    else if (hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  }, []);

  const getRoleInfo = () => {
    const pendingCount = requests.filter(r => r.status.startsWith('PENDING')).length;
    const activeCount = requests.filter(r => r.status === 'CHECKED_IN').length;

    switch (user?.role) {
      case 'ADMIN':
        return {
          icon: Activity,
          text: `Sistem operasional. Ada ${pendingCount} pengajuan yang menunggu tinjauan manajerial Anda hari ini.`,
          color: 'text-primary'
        };
      case 'SECURITY':
        return {
          icon: ShieldCheck,
          text: `Siaga keamanan aktif. ${activeCount} personil saat ini berada di dalam area pengerjaan.`,
          color: 'text-emerald-500'
        };
      case 'DEPUTY':
      case 'OP_HEAD':
        return {
          icon: Zap,
          text: `Anda memiliki ${pendingCount} antrian persetujuan yang memerlukan validasi segera.`,
          color: 'text-amber-500'
        };
      default:
        return {
          icon: Sparkles,
          text: "Pastikan SIK Anda selalu aktif dan gunakan APD lengkap saat berada di area pengerjaan.",
          color: 'text-primary'
        };
    }
  };

  const info = getRoleInfo();

  return (
    <div className="relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] p-5 sm:p-10 ring-1 ring-white/20 dark:ring-white/5 border border-slate-200/50 dark:border-slate-800/50 mb-6 sm:mb-10 group">
       <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <info.icon className="h-48 w-48 hidden sm:block" />
       </div>
       <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="text-left">
             <h2 className="text-xl sm:text-4xl font-black tracking-tighter dark:text-white leading-tight">
                {greeting}, <span className="text-primary">{user?.name.split(' ')[0]}</span>
             </h2>
             <div className="flex items-start gap-2.5 mt-3 sm:mt-4">
                <div className={cn("p-1.5 rounded-lg bg-current/10 shrink-0", info.color)}>
                   <info.icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-[11px] sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-snug max-w-2xl">
                   {info.text}
                </p>
             </div>
          </div>
          <div className="flex gap-3 shrink-0 mt-2 sm:mt-0">
             {user?.role === 'USER' && (
               <div className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 rounded-xl border dark:border-slate-700 shadow-sm flex flex-row sm:flex-col items-center gap-3 sm:gap-0">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest sm:mb-1">Status SIK</p>
                 <div className="flex items-center gap-1.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] sm:text-xs font-black dark:text-white uppercase">Valid</p>
                 </div>
               </div>
             )}
             {user?.role === 'SECURITY' && (
               <div className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 rounded-xl border dark:border-slate-700 shadow-sm flex flex-row sm:flex-col items-center gap-3 sm:gap-0">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest sm:mb-1">Checkpoint</p>
                 <div className="flex items-center gap-1.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] sm:text-xs font-black dark:text-white uppercase">Aktif</p>
                 </div>
               </div>
             )}
             {(user?.role === 'ADMIN' || user?.role === 'DEPUTY' || user?.role === 'OP_HEAD' || user?.role === 'GM_DIRECTOR') && (
               <div className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 rounded-xl border dark:border-slate-700 shadow-sm flex flex-row sm:flex-col items-center gap-3 sm:gap-0">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest sm:mb-1">Sistem</p>
                 <div className="flex items-center gap-1.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                   <p className="text-[10px] sm:text-xs font-black dark:text-white uppercase">Online</p>
                 </div>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

export const MySik: React.FC = () => {
  const { requests, currentUser } = useSikStore();
  const [selectedReq, setSelectedReq] = useState<SikRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const parentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // SIMULATE LOADING: BEST PRACTICE SNAPPY FEEL
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200); // Accelerated snappy handoff
    return () => clearTimeout(timer);
  }, [currentPage]);
  
  const myRequests = useMemo(() => 
    requests.filter(r => r.userId === currentUser?.id || currentUser?.role === 'ADMIN'),
    [requests, currentUser]
  );

  const totalPages = Math.ceil(myRequests.length / itemsPerPage);
  const pagedRequests = myRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const rowVirtualizer = useVirtualizer({
    count: pagedRequests.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
    overscan: 5,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleShareWA = (id: string) => {
    toast.success(`WhatsApp Terkirim!`, {
      description: `Sertifikat SIK ${formatID(id)} telah dikirimkan ke nomor WhatsApp pemohon.`,
    });
  };

  const handleDownload = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Menyiapkan PDF sertifikat...',
      success: 'Sertifikat berhasil diunduh.',
      error: 'Gagal mengunduh sertifikat.',
    });
  };

  return (
    <div className="pb-10 relative transform-gpu">
      {isLoading ? (
        <div className="mb-8">
           <Skeleton className="h-48 w-full rounded-[40px]" />
        </div>
      ) : (
        <GreetingHeader user={currentUser} requests={requests} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {isLoading ? (
           <>
              <StatusCardSkeleton />
              <StatusCardSkeleton />
              <StatusCardSkeleton />
           </>
        ) : (
          <>
            <StatusCard 
              title="Total Pengajuan" 
              count={myRequests.length} 
              icon={FileText} 
              color="blue" 
            />
            <StatusCard 
              title="Menunggu Persetujuan" 
              count={myRequests.filter(r => r.status.startsWith('PENDING')).length} 
              icon={Clock} 
              color="amber" 
            />
            <StatusCard 
              title="Izin Aktif / Selesai" 
              count={myRequests.filter(r => ['APPROVED', 'CHECKED_IN', 'CHECKED_OUT'].includes(r.status)).length} 
              icon={CheckCircle2} 
              color="emerald" 
            />
          </>
        )}
      </div>

      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[40px] shadow-luxury ring-1 ring-white/20 dark:ring-white/5 overflow-hidden transform-gpu">
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="font-black text-xl tracking-tighter dark:text-white leading-none uppercase">Riwayat Pengajuan SIK</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Data pengajuan izin kerja Anda</p>
        </div>

        {/* TABLE HEADERS (Desktop Only) */}
        {!isLoading && pagedRequests.length > 0 && (
          <div className="hidden sm:flex items-center gap-4 px-8 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-b dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             <div className="w-24">Voucher ID</div>
             <div className="flex-1">Pekerjaan & Personil</div>
             <div className="w-48 hidden md:block">Lokasi Area</div>
             <div className="w-40 hidden lg:block text-center">Status</div>
             <div className="w-28 text-right">Opsi</div>
          </div>
        )}
        
        <div 
            ref={parentRef}
            className="max-h-[600px] overflow-auto scrollbar-hide"
        >
          {isLoading ? (
             <div className="divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in duration-300">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
             </div>
          ) : pagedRequests.length > 0 ? (
            <div
                ref={parentRef}
                className="max-h-[600px] overflow-auto scrollbar-hide pt-2"
            >
                <div
                    style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                    }}
                >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const req = pagedRequests[virtualRow.index];
                    return (
                    <div
                        key={req.id}
                        style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                        }}
                        className="px-6 sm:px-8 border-b dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors flex items-center group"
                    >
                        {/* DESKTOP ROW */}
                        <div className="hidden sm:flex items-center gap-4 w-full">
                            <div className="w-24 font-black text-primary tracking-tighter text-lg">{formatID(req.id)}</div>
                            <div className="flex-1 min-w-0 pr-4">
                                <p className="font-black text-slate-800 dark:text-white leading-tight mb-1 truncate">{req.jobDescription}</p>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <UserIcon className="h-3 w-3" />
                                    <span className="truncate">{req.userName}</span>
                                </div>
                            </div>
                            <div className="w-48 hidden md:block">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold text-[11px] uppercase tracking-tighter">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    {req.location}
                                </div>
                            </div>
                            <div className="w-40 hidden lg:flex justify-center">
                                <StatusBadge status={req.status} />
                            </div>
                            <div className="w-28 text-right shrink-0">
                                <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-xl hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-widest px-4 border dark:border-slate-800"
                                onClick={() => setSelectedReq(req)}
                                >
                                <Eye className="h-3.5 w-3.5 mr-2" />
                                Detail
                                </Button>
                            </div>
                        </div>

                        {/* MOBILE CARD-LAYOUT */}
                        <div className="flex sm:hidden flex-col gap-3 w-full py-2">
                           <div className="flex justify-between items-center">
                              <span className="font-black text-primary tracking-tighter text-sm italic">{formatID(req.id)}</span>
                              <StatusBadge status={req.status} />
                           </div>
                           <p className="font-black text-slate-900 dark:text-white text-xs leading-snug line-clamp-2">{req.jobDescription}</p>
                           <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                 <MapPin className="h-3 w-3 text-primary" />
                                 {req.location}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800 font-black text-[9px] uppercase tracking-widest"
                                onClick={() => setSelectedReq(req)}
                              >
                                View
                              </Button>
                           </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
          ) : (
            <div className="py-20 flex items-center justify-center">
              {currentUser?.role === 'USER' ? (
                <EmptyState 
                  icon={FileText}
                  title="Riwayat Masih Kosong"
                  description="Anda belum memiliki pengajuan SIK. Buat pengajuan pertama Anda untuk mendapatkan akses area kerja."
                  action={{
                    label: "Buat Pengajuan SIK",
                    onClick: () => navigate('/request')
                  }}
                  className="max-w-md"
                />
              ) : currentUser?.role === 'SECURITY' ? (
                <EmptyState 
                  icon={History}
                  title="Belum Ada Aktivitas"
                  description="Belum ada riwayat check-in / check-out tercatat. Gunakan Security Checkpoint untuk memverifikasi personil."
                  className="max-w-md"
                />
              ) : (
                <EmptyState 
                  icon={History}
                  title="Tidak Ada Pengajuan"
                  description="Belum ada data pengajuan yang perlu ditampilkan. Pengajuan dari seluruh personil akan muncul di Antrian Persetujuan."
                  className="max-w-md"
                />
              )}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && myRequests.length > 0 && (
          <div className="px-5 sm:px-8 py-4 sm:py-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, myRequests.length)} dari {myRequests.length} pengajuan
            </p>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 border-none"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | '…')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '…' ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-400 font-black">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p as number)}
                      className={cn(
                        "h-8 w-8 rounded-xl text-xs font-black transition-all active:scale-90",
                        currentPage === p
                          ? "bg-primary text-white shadow-md shadow-primary/30"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                      )}
                    >
                      {p}
                    </button>
                  )
                )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 border-none"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* SIK Detail Modal */}
      <AnimatePresence>
        {selectedReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" 
              onClick={() => setSelectedReq(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="absolute top-4 right-4 z-20">
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-slate-900/10 dark:bg-slate-800/50 backdrop-blur-md dark:text-white" 
                    onClick={() => setSelectedReq(null)}
                >
                   <X className="h-5 w-5" />
                 </Button>
              </div>

              {/* Left Column: SIK Certificate */}
              <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 flex flex-col border-b md:border-b-0 md:border-r dark:border-slate-800 overflow-y-auto">
                <div className="bg-primary p-8 sm:p-10 text-white relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck className="h-32 w-32" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-primary-foreground/70">Modern Enterprise SIK</p>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-4">SURAT IZIN KERJA</h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold ring-1 ring-white/30">
                    ID: {formatID(selectedReq.id)}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex gap-6 items-start">
                        <div className="h-28 w-28 sm:h-32 sm:w-32 bg-white dark:bg-slate-200 p-3 rounded-2xl border flex items-center justify-center shrink-0">
                            <QRCodeSVG value={selectedReq.id} size={100} level="H" />
                        </div>
                        <div className="space-y-4 flex-1 min-w-0">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</p>
                                <StatusBadge status={selectedReq.status} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Pelaksana</p>
                                <p className="text-xs font-bold dark:text-white truncate">{selectedReq.userName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Mulai</p>
                            <p className="text-[11px] font-bold dark:text-white truncate">{format(new Date(selectedReq.startTime), 'HH:mm - dd/MM/yy')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Selesai</p>
                            <p className="text-[11px] font-bold dark:text-white truncate">{format(new Date(selectedReq.endTime), 'HH:mm - dd/MM/yy')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs font-medium italic text-slate-500 border dark:border-slate-800">
                    "{selectedReq.jobDescription}"
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                    <Button 
                        size="sm" 
                        className="rounded-xl h-11 font-bold bg-emerald-500 hover:bg-emerald-600 border-none transition-all active:scale-95"
                        onClick={() => handleShareWA(selectedReq.id)}
                    >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Kirim ke WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl h-11 font-bold active:scale-95 dark:text-white dark:border-slate-800"
                      onClick={handleDownload}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Unduh PDF
                    </Button>
                    </div>
                </div>
              </div>

              {/* Right Column: Audit Trail */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 flex flex-col min-h-0 overflow-y-auto">
                 <div className="flex items-center gap-2 mb-6">
                    <History className="h-5 w-5 text-primary" />
                    <h4 className="font-bold text-sm uppercase tracking-wider dark:text-white">Audit Trail / Riwayat</h4>
                  </div>

                  <div className="space-y-6">
                    {selectedReq.logs?.map((log, i) => (
                       <div key={i} className="flex gap-4 relative">
                          {i !== (selectedReq.logs?.length || 0) - 1 && (
                             <div className="absolute left-[9px] top-6 w-[2px] h-full bg-slate-200 dark:bg-slate-800" />
                          )}
                          <div className={cn(
                             "h-[20px] w-[20px] rounded-full border-4 border-white dark:border-slate-900 z-10 shrink-0 mt-1",
                             i === selectedReq.logs!.length - 1 ? "bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-300 dark:bg-slate-700"
                          )} />
                          <div className="space-y-1 pb-4 flex-1">
                             <div className="flex items-center justify-between gap-4">
                                <p className="text-xs font-black dark:text-white uppercase tracking-tight">{log.status.replace('_', ' ')}</p>
                                <p className="text-[10px] font-medium text-slate-400 shrink-0">{format(new Date(log.timestamp), 'HH:mm - dd/MM')}</p>
                             </div>
                             <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{log.message}</p>
                             <div className="flex items-center gap-1.5 mt-1 text-[10px] text-primary font-bold">
                                <UserIcon className="h-3 w-3" />
                                <span className="underline decoration-primary/30 underline-offset-2">{log.actor}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  color: 'blue' | 'amber' | 'emerald';
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count, icon: Icon, color }) => {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/5 text-blue-600 border-blue-100 dark:border-blue-900/30",
    amber: "from-amber-500/20 to-amber-600/5 text-amber-600 border-amber-100 dark:border-amber-900/30",
    emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-600 border-emerald-100 dark:border-emerald-900/30",
  };

  return (
    <div 
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 sm:p-8 rounded-[40px] shadow-luxury ring-1 ring-white/20 dark:ring-white/5 flex items-center justify-between transition-all duration-300 cursor-default transform-gpu hover:-translate-y-1.5"
    >
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">{title}</p>
        <p className="text-3xl sm:text-4xl font-black tracking-tighter dark:text-white">{count}</p>
      </div>
      <div className={cn("p-4 sm:p-5 rounded-2xl bg-linear-to-br border shrink-0", colors[color])}>
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
    </div>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const configs: Record<string, { label: string; class: string; pulse: boolean }> = {
    PENDING_L1: { label: "Antrian L1", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", pulse: true },
    PENDING_L2: { label: "Antrian L2", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", pulse: true },
    PENDING_L3: { label: "Antrian L3", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", pulse: true },
    APPROVED: { label: "Disetujui", class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", pulse: false },
    REJECTED: { label: "Ditolak", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", pulse: false },
    CHECKED_IN: { label: "Bekerja", class: "bg-primary/10 text-primary dark:bg-primary/20", pulse: true },
    CHECKED_OUT: { label: "Selesai", class: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400", pulse: false },
  };

  const config = configs[status] || { label: status, class: "bg-slate-100 text-slate-700", pulse: false };

  return (
    <span className={cn("inline-flex h-6 items-center px-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-transparent shadow-sm whitespace-nowrap", config.class)}>
       {config.pulse && <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 animate-pulse" />}
       {config.label}
    </span>
  );
};
