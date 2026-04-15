import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSikStore } from '../../store/useSikStore';
import { 
  Send, 
  MapPin, 
  FileText, 
  Upload, 
  AlertCircle,
  FileCheck,
  ChevronLeft,
  Clock,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const sikFormSchema = z.object({
  jobDescription: z.string().min(10, "Deskripsi minimal 10 karakter"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Waktu mulai tidak valid"),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Waktu selesai tidak valid"),
}).refine((data) => {
  return Date.parse(data.endTime) > Date.parse(data.startTime);
}, {
  message: "Waktu selesai harus setelah waktu mulai",
  path: ["endTime"],
});

type SikFormValues = z.infer<typeof sikFormSchema>;

export const RequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { submitRequest, logActivity } = useSikStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SikFormValues>({
    resolver: zodResolver(sikFormSchema),
    defaultValues: {
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    }
  });

  const onSubmit = async (data: SikFormValues) => {
    await new Promise(res => setTimeout(res, 1500)); 
    
    submitRequest({
      jobDescription: data.jobDescription,
      location: data.location,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
    });
    
    logActivity(`Submit SIK Ketat: ${data.location}`);
    
    toast.success('Pengajuan Terkirim', {
      description: 'Permintaan akses area terbatas Anda sedang ditinjau.',
    });
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 sm:pb-32 px-1 sm:px-0">
      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }} 
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 sm:mb-10 px-2 sm:px-0"
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')} 
          className="rounded-xl text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 mr-1.5" />
          Dashboard Utama
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden"
      >
        {/* Header Section */}
        <div className="relative p-6 sm:p-10 lg:p-12 border-b border-slate-100 dark:border-slate-800 bg-linear-to-br from-primary/5 via-white to-white dark:from-primary/10 dark:via-slate-900 dark:to-slate-900">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldAlert className="h-32 w-32" />
           </div>
           
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 relative z-10">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 shrink-0">
                 <FileCheck className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <div className="min-w-0">
                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter dark:text-white leading-tight">Pengajuan SIK Ketat</h2>
                 <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1 uppercase tracking-widest">Lengkapi formulir di bawah untuk izin akses area terbatas</p>
              </div>
           </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10 lg:p-12 space-y-8 sm:space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            
            {/* Left Column */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <label className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1",
                  errors.jobDescription ? "text-red-500" : "text-slate-400"
                )}>
                  <FileText className="h-4 w-4" />
                  Detail Pekerjaan
                </label>
                <textarea
                  {...register('jobDescription')}
                  rows={6}
                  className={cn(
                    "w-full bg-slate-50 dark:bg-slate-800/40 border-2 rounded-[24px] p-5 text-sm font-bold outline-none transition-all resize-none dark:text-white",
                    errors.jobDescription 
                      ? "border-red-500 ring-4 ring-red-500/10 placeholder:text-red-200" 
                      : "border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  )}
                  placeholder="Jelaskan aktivitas teknis secara rinci..."
                />
                {errors.jobDescription && <p className="text-[10px] font-bold text-red-500 px-1">{errors.jobDescription.message}</p>}
              </div>

              <div className="p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                <p className="text-[11px] leading-relaxed font-bold text-slate-500 dark:text-slate-400">
                  Pastikan deskripsi sesuai dengan <span className="text-primary dark:text-white underline underline-offset-4 decoration-primary/30">Standard Operasional Prosedur</span> yang telah disepakati oleh departemen HSE.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <label className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1",
                  errors.location ? "text-red-500" : "text-slate-400"
                )}>
                  <MapPin className="h-4 w-4" />
                  Lokasi & Area Akses
                </label>
                <input
                  {...register('location')}
                  className={cn(
                    "w-full h-14 bg-slate-50 dark:bg-slate-800/40 border-2 rounded-2xl px-6 text-sm font-bold outline-none transition-all dark:text-white",
                    errors.location 
                      ? "border-red-500 ring-4 ring-red-500/10" 
                      : "border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  )}
                  placeholder="Contoh: Server Room A1, Lt. 2"
                />
                {errors.location && <p className="text-[10px] font-bold text-red-500 px-1">{errors.location.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <label className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1",
                    errors.startTime ? "text-red-500" : "text-slate-400"
                  )}>
                    <Clock className="h-4 w-4" />
                    Mulai
                  </label>
                  <input
                    type="datetime-local"
                    {...register('startTime')}
                    className={cn(
                      "w-full h-14 bg-slate-50 dark:bg-slate-800/40 border-2 rounded-2xl px-5 text-sm font-bold outline-none transition-all dark:text-white",
                      errors.startTime ? "border-red-500 ring-4 ring-red-500/10" : "border-slate-100 dark:border-slate-800 focus:border-primary"
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <label className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1",
                    errors.endTime ? "text-red-500" : "text-slate-400"
                  )}>
                    <Clock className="h-4 w-4" />
                    Selesai
                  </label>
                  <input
                    type="datetime-local"
                    {...register('endTime')}
                    className={cn(
                      "w-full h-14 bg-slate-50 dark:bg-slate-800/40 border-2 rounded-2xl px-5 text-sm font-bold outline-none transition-all dark:text-white",
                      errors.endTime ? "border-red-500 ring-4 ring-red-500/10" : "border-slate-100 dark:border-slate-800 focus:border-primary"
                    )}
                  />
                </div>
              </div>
              
              {errors.endTime && <p className="text-[10px] font-bold text-red-500 px-1">{errors.endTime.message}</p>}

              <div className="pt-2">
                 <div className="p-8 rounded-[24px] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center group hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm mb-3">
                       <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Upload Izin Terkait (Opsional)</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase">PDF, JPG, PNG up to 10MB</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:pt-6">
            <Button 
                type="submit" 
                className="order-1 sm:order-2 px-10 h-16 sm:h-20 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 flex-1 relative overflow-hidden group active:scale-95 transition-all cursor-pointer"
                disabled={isSubmitting}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                   <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      MEMPROSES PENGAJUAN...
                   </>
                ) : (
                   <>
                      KIRIM PENGAJUAN SIK
                      <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </>
                )}
              </div>
            </Button>
            
            <Button 
                type="button"
                onClick={() => navigate('/')}
                variant="ghost" 
                className="order-2 sm:order-1 px-8 h-16 sm:h-20 rounded-3xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
               Batalkan
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
