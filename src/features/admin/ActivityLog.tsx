import React, { useState } from 'react';
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
  Filter,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/utils';

// HELPER: Specialized Skeletons for Audit Logs
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

  // SIMULATE LOADING: BEST PRACTICE SNAPPY FEEL
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);
  
  const filteredLogs = activityLogs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Audit Trail</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Pencatatan real-time seluruh aktivitas otentikasi dan transaksi sistem.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border dark:border-slate-800 text-xs font-black uppercase tracking-widest px-4 h-11 bg-white dark:bg-slate-900 shadow-sm active:scale-95 transition-all">
              <BarChart3 className="h-4 w-4 mr-2" />
              Laporan PDF
           </Button>
           <Button className="rounded-xl bg-slate-950 dark:bg-white dark:text-slate-950 text-xs font-black uppercase tracking-widest px-4 h-11 hover:scale-105 active:scale-95 transition-all">
              <Filter className="h-4 w-4 mr-2" />
              Filter
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           <div className="bg-white dark:bg-slate-900 rounded-[32px] border dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="p-6 border-b dark:border-slate-800">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search logs by user or action..."
                    className="w-full pl-12 pr-4 h-14 bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-8">
                 <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                    <AnimatePresence mode="wait">
                       {isLoading ? (
                          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                             <AuditLogSkeleton />
                          </motion.div>
                       ) : filteredLogs.length > 0 ? (
                          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                             {filteredLogs.map((log, idx) => (
                                <motion.div 
                                  key={log.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                                >
                                   {/* Indicator dot */}
                                   <div className="flex items-center justify-center w-10 h-10 rounded-full border dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl group-hover:scale-110 transition-transform antialiased z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                      <Activity className="h-4 w-4 text-primary" />
                                   </div>

                                   {/* Content card */}
                                   <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="flex items-center justify-between space-x-2 mb-2">
                                         <div className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-tighter">{log.action}</div>
                                         <time className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(log.timestamp), 'HH:mm:ss')}</time>
                                      </div>
                                      <div className="flex items-center gap-2 mb-3">
                                         <div className="h-5 w-5 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-black border dark:border-slate-700">{log.userName.charAt(0)}</div>
                                         <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">{log.userName}</span>
                                      </div>
                                      <div className="flex flex-wrap gap-2 pt-3 border-t dark:border-slate-800">
                                         <Badge icon={log.metadata.device === "Mobile" ? Smartphone : Monitor} text={log.metadata.device} />
                                         <Badge icon={Globe} text={log.metadata.browser} />
                                         <Badge text={log.metadata.os} />
                                         <Badge text={log.metadata.ip || "Unknown IP"} />
                                      </div>
                                   </div>
                                </motion.div>
                             ))}
                          </motion.div>
                       ) : (
                          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                             <EmptyState 
                                icon={ShieldAlert}
                                title="Log Tidak Ditemukan"
                                description="Tidak ada catatan audit yang sesuai dengan filter Anda saat ini. Silakan coba kata kunci lain."
                                className="bg-transparent"
                             />
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[32px] border dark:border-slate-800 p-8 shadow-xl">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <Clock className="h-4 w-4" />
                 Summary Hari Ini
              </h4>
              <div className="space-y-6">
                 <StatItem label="Total Auth" value={filteredLogs.filter(l => l.action.includes('Login')).length} color="blue" />
                 <StatItem label="SIK Created" value={filteredLogs.filter(l => l.action.includes('Submit')).length} color="amber" />
                 <StatItem label="Approval Action" value={filteredLogs.filter(l => l.action.includes('Approve')).length} color="emerald" />
              </div>
           </div>

           <div className="bg-linear-to-br from-primary to-blue-600 rounded-[32px] p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <h4 className="font-black text-sm uppercase tracking-tighter mb-2">Automated Report</h4>
              <p className="text-white/70 text-xs font-medium leading-relaxed mb-6">Sistem mencatat setiap pergeseran status SIK untuk kepatuhan ISO 27001.</p>
              <Button className="w-full rounded-2xl bg-white text-primary font-black text-[10px] uppercase tracking-widest h-12 shadow-xl shadow-primary/20">
                 Kirim Ke Email Compliance
                 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ icon: Icon, text }: { icon?: any; text: string }) => (
  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm shrink-0">
    {Icon && <Icon className="h-3 w-3 text-slate-400" />}
    <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-tighter whitespace-nowrap">{text}</span>
  </div>
);

const StatItem = ({ label, value, color }: { label: string; value: number; color: 'blue' | 'amber' | 'emerald' }) => {
  const colors = {
     blue: "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
     amber: "bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
     emerald: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div className="flex items-center justify-between group cursor-default">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{label}</span>
       <div className={cn("px-3 py-1 rounded-xl text-xs font-black shadow-sm transition-transform group-hover:scale-110", colors[color])}>
          {value}
       </div>
    </div>
  );
};
