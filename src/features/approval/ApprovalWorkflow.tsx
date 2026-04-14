import React, { useState, useEffect } from 'react';
import { useSikStore } from '../../store/useSikStore';
import { 
  CheckCircle, 
  User as UserIcon, 
  MapPin, 
  FileSearch,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { formatID, cn } from '../../lib/utils';
import { StatusBadge } from '../dashboard/MySik';
import { toast } from 'sonner';
import { Skeleton } from '../../components/ui/skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

// HELPER: Specialized Skeletons for Approval
const ApprovalCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
        </div>
        <Skeleton className="h-24 w-full rounded-2xl mb-8" />
        <div className="flex gap-4">
            <Skeleton className="h-14 flex-1 rounded-2xl" />
            <Skeleton className="h-14 flex-1 rounded-2xl" />
        </div>
    </div>
);

export const ApprovalWorkflow: React.FC = () => {
  const { requests, currentUser, approveRequest, rejectRequest } = useSikStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const getRequestsForMe = () => {
    if (currentUser?.role === 'ADMIN') return requests.filter(r => r.status.startsWith('PENDING'));
    if (currentUser?.role === 'DEPUTY') return requests.filter(r => r.status === 'PENDING_L1');
    if (currentUser?.role === 'OP_HEAD') return requests.filter(r => r.status === 'PENDING_L2');
    if (currentUser?.role === 'GM_DIRECTOR') return requests.filter(r => r.status === 'PENDING_L3');
    return [];
  };

  const pendingRequests = getRequestsForMe();

  const handleApprove = (id: string) => {
    approveRequest(id);
    toast.success('Persetujuan Berhasil', {
      description: `SIK ${formatID(id)} telah diteruskan ke tahap selanjutnya.`,
    });
  };

  const handleReject = (id: string) => {
    rejectRequest(id, 'Ditolak oleh atasan');
    toast.error('Pengajuan Ditolak', {
      description: `SIK ${formatID(id)} telah ditandai sebagai ditolak.`,
    });
  };

  return (
    <div className="space-y-8 pb-10 transform-gpu">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h2 className="text-3xl font-black tracking-tighter dark:text-white">Antrian Persetujuan</h2>
          <p className="text-sm text-slate-500 font-medium">Lakukan tinjauan pada <span className="text-primary font-bold">{pendingRequests.length} antrian</span> aktif.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
             [1, 2, 3, 4].map(i => <ApprovalCardSkeleton key={i} />)
          ) : pendingRequests.length > 0 ? (
            pendingRequests.map((req) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                key={req.id} 
                className="bg-white dark:bg-slate-900 rounded-[32px] border shadow-xl overflow-hidden group hover:border-primary/40 transition-all border-slate-200 dark:border-slate-800 transform-gpu"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border group-hover:border-primary/20 transition-colors">
                        <UserIcon className="h-7 w-7 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg dark:text-white tracking-tight">{req.userName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Pemohon Internal</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary tracking-tighter leading-none mb-2">{formatID(req.id)}</p>
                      <StatusBadge status={req.status} />
                    </div>
                  </div>
  
                  <div className="space-y-4 p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <FileSearch className="h-4 w-4 mt-0.5 text-primary" />
                      <p className="leading-relaxed flex-1">"{req.jobDescription}"</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p>{req.location}</p>
                    </div>
                  </div>
  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-2xl h-14 border-red-100 text-red-600 hover:bg-red-50 dark:border-red-900/20 dark:hover:bg-red-900/10 font-bold transition-all active:scale-95 border-none bg-red-50/50"
                      onClick={() => handleReject(req.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Tolak
                    </Button>
                    <Button 
                      className="flex-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 shadow-lg shadow-emerald-500/20 dark:shadow-none group active:scale-95 transition-all border-none"
                      onClick={() => handleApprove(req.id)}
                    >
                      Setujui Akun
                      <CheckCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Button>
                  </div>
                </div>
  
                <div className="px-8 py-3 bg-slate-50 dark:bg-slate-800/50 border-t flex items-center gap-4">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Progress Approval:</p>
                   <div className="flex gap-1.5 items-center flex-1">
                      {[1, 2, 3].map(step => (
                         <div 
                          key={step} 
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-1000",
                            req.currentStep >= step ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                          )} 
                         />
                      ))}
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState 
                icon={Sparkles}
                title="Semua Tugas Selesai"
                description="Bagus! Tidak ada pengajuan tertunda yang perlu Anda periksa saat ini. Dashboard Anda bersih."
                className="col-span-full py-32 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[40px] border border-slate-200/50 dark:border-slate-800/50 shadow-luxury"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
