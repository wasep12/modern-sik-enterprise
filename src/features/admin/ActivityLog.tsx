import React, { useState, useEffect } from 'react';
import { useSikStore } from '../../store/useSikStore';
import { 
  Activity, 
  Monitor, 
  Smartphone, 
  Globe, 
  Clock, 
  ShieldAlert,
  Search,
  ChevronRight,
  ChevronLeft,
  Filter,
  BarChart3,
  Layers,
  Terminal,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/utils';

const ITEMS_PER_PAGE = 8;

const AuditLogSkeleton = () => (
    <div className="space-y-6">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-4 p-5 rounded-[24px] border dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 shadow-sm">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-3 w-24" />
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16 rounded-lg" />
                        <Skeleton className="h-5 w-16 rounded-lg" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const ActivityLog: React.FC = () => {
  const { activityLogs } = useSikStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredLogs = [...activityLogs]
    .filter(log => 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const pagedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8 pb-32 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Riwayat Aktivitas</h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">Monitor aktivitas penggunaan akun dan riwayat perubahan sistem.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
           <Button variant="outline" className="flex-1 sm:flex-none rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest px-4 h-11 bg-white dark:bg-slate-900 text-slate-700 dark:text-white shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reset Logs
           </Button>
           <Button className="flex-1 sm:flex-none rounded-xl bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest px-4 h-11 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer">
              <Filter className="h-4 w-4 mr-2" />
              Download
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN FEED */}
        <div className="lg:col-span-8 space-y-4">
           <div className="bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
              {/* Search bar */}
              <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari log (user, aksi, atau IP)..."
                    className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Log list */}
              <div className="px-4 sm:px-8 py-8">
                 <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                    <AnimatePresence mode="wait">
                       {isLoading ? (
                          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                             <AuditLogSkeleton />
                          </motion.div>
                       ) : pagedLogs.length > 0 ? (
                          <motion.div key={`page-${currentPage}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                             {pagedLogs.map((log, idx) => (
                                <motion.div 
                                  key={log.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                                >
                                   {/* Dot */}
                                   <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 shadow-lg group-hover:scale-110 transition-transform antialiased z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                      <Activity className="h-4 w-4 text-primary" />
                                   </div>
                                   
                                   {/* Card */}
                                   <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] p-4 sm:p-5 rounded-[24px] bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                                      <div className="flex items-center justify-between gap-2 mb-2">
                                         <div className="font-black text-[10px] sm:text-xs text-slate-900 dark:text-white uppercase tracking-tighter truncate">{log.action}</div>
                                         <time className="text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{format(new Date(log.timestamp), 'HH:mm:ss')}</time>
                                      </div>
                                      <div className="flex items-center gap-2 mb-4">
                                         <div className="h-5 w-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-500 border dark:border-slate-700">{log.userName.charAt(0)}</div>
                                         <span className="text-[10px] font-black text-slate-500 dark:text-white/70">{log.userName}</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                                         <Badge icon={log.metadata.device === "Mobile" ? Smartphone : Monitor} text={log.metadata.device} />
                                         <Badge icon={Globe} text={log.metadata.browser} />
                                         <Badge text={log.metadata.os} />
                                         <Badge text={log.metadata.ip || "127.0.0.1"} isIp />
                                      </div>
                                   </div>
                                </motion.div>
                             ))}
                          </motion.div>
                       ) : (
                          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                             <EmptyState 
                                icon={ShieldAlert}
                                title="No logs found"
                                description="Try adjusting your search criteria."
                                className="bg-transparent"
                             />
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              </div>

              {/* Pagination bar */}
              {!isLoading && filteredLogs.length > ITEMS_PER_PAGE && (
                <div className="px-4 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} OF {filteredLogs.length} LOGS
                  </p>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 border-none cursor-pointer"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="px-3 text-[10px] font-black text-slate-900 dark:text-white">{currentPage} / {totalPages}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 border-none cursor-pointer"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* SIDEBAR STATS */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                 <Clock className="h-4 w-4 text-primary" />
                 Global Summary
              </h4>
              <div className="space-y-7">
                 <StatItem icon={Layers} label="Total Actions" value={filteredLogs.length} color="blue" />
                 <StatItem icon={Terminal} label="Auth Events" value={filteredLogs.filter(l => l.action.toLowerCase().includes('login') || l.action.toLowerCase().includes('auth')).length} color="amber" />
                 <StatItem icon={Cpu} label="System Updates" value={filteredLogs.filter(l => l.action.toLowerCase().includes('update') || l.action.toLowerCase().includes('edit')).length} color="emerald" />
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase text-slate-400">Retention</span>
                    <span className="text-[10px] font-black uppercase text-emerald-500">90 Days</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[35%] bg-primary rounded-full" />
                 </div>
              </div>
           </div>

           <div className="bg-linear-to-br from-slate-900 to-slate-950 dark:from-primary dark:to-indigo-600 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <h4 className="font-black text-sm uppercase tracking-tighter mb-2">Laporan Otomatis</h4>
                <p className="text-white/60 text-xs font-medium leading-relaxed mb-6">Sistem mencatat setiap akses untuk menjamin keamanan aset Perusahaan.</p>
                <Button className="w-full rounded-2xl bg-white text-slate-950 font-black text-[10px] uppercase tracking-widest h-12 shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                   Unduh Laporan SIK
                   <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ icon: Icon, text, isIp }: { icon?: any; text: string; isIp?: boolean }) => (
  <div className={cn(
    "flex items-center gap-1 px-2 py-0.5 rounded-lg border shadow-xs transition-colors",
    isIp ? "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
  )}>
    {Icon && <Icon className="h-2.5 w-2.5 text-slate-400" />}
    <span className={cn(
      "text-[8px] sm:text-[9px] font-black uppercase tracking-tighter",
      isIp ? "text-primary dark:text-primary-foreground/70" : "text-slate-500 dark:text-slate-400"
    )}>
      {text}
    </span>
  </div>
);

const StatItem = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: 'blue' | 'amber' | 'emerald' }) => {
  const colors = {
     blue: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
     amber: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
     emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
  };
  return (
    <div className="flex items-center justify-between group">
       <div className="flex items-center gap-3">
          <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12", colors[color])}>
             <Icon className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
       </div>
       <div className="text-sm font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
};
