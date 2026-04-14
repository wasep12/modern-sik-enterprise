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
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '../../lib/utils';

// 1. Strictly Typed: Inferred type from Zod schema
const sikFormSchema = z.object({
  jobDescription: z.string().min(10, "Deskripsi minimal 10 karakter"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Waktu mulai tidak valid"),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Waktu selesai tidak valid"),
}).refine((data) => {
  // 2. Cross-Field Validation: Waktu Selesai tidak boleh sebelum Waktu Mulai
  return Date.parse(data.endTime) > Date.parse(data.startTime);
}, {
  message: "Waktu selesai harus setelah waktu mulai",
  path: ["endTime"], // Link error to the endTime field
});

type SikFormValues = z.infer<typeof sikFormSchema>;

export const RequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { submitRequest } = useSikStore();
  
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
    // 4. Loading State & Double-Submit Protection (auto-handled by isSubmitting)
    await new Promise(res => setTimeout(res, 2000)); // Simulate API
    
    submitRequest({
      jobDescription: data.jobDescription,
      location: data.location,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
    });
    
    toast.success('Pengajuan Berhasil!', {
      description: 'SIK Anda telah diverifikasi oleh skema Zod dan masuk antrian.',
    });
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 mt-4">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')} 
          className="rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-b dark:border-slate-800">
          <div className="flex items-center gap-4">
             <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <FileCheck className="h-7 w-7" />
             </div>
             <div>
                <h2 className="text-3xl font-black tracking-tighter dark:text-white leading-none">Pengajuan SIK Ketat</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Sistem validasi skema Zod aktif.</p>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Row 1 */}
            <div className="space-y-3">
              <label className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1",
                errors.jobDescription ? "text-red-500" : "text-slate-400"
              )}>
                <FileText className="h-4 w-4" />
                Deskripsi Pekerjaan
              </label>
              <textarea
                {...register('jobDescription')}
                className={cn(
                  "w-full min-h-[140px] bg-slate-50 dark:bg-slate-800/50 border rounded-2xl p-4 text-sm font-semibold outline-none transition-all resize-none dark:border-slate-800",
                  errors.jobDescription ? "border-red-500 ring-4 ring-red-500/10" : "focus:ring-4 focus:ring-primary/10"
                )}
                placeholder="Detail pekerjaan..."
              />
              {/* 3. Real-time Feedback: Pesan error di bawah input */}
              {errors.jobDescription && <p className="text-[10px] font-bold text-red-500 px-1">{errors.jobDescription.message}</p>}
            </div>

            <div className="space-y-3">
              <label className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1",
                errors.location ? "text-red-500" : "text-slate-400"
              )}>
                <MapPin className="h-4 w-4" />
                Lokasi Akses
              </label>
              <input
                {...register('location')}
                className={cn(
                  "w-full h-14 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl px-5 text-sm font-semibold outline-none transition-all dark:border-slate-800",
                  errors.location ? "border-red-500 ring-4 ring-red-500/10" : "focus:ring-4 focus:ring-primary/10"
                )}
                placeholder="Lokasi..."
              />
              {errors.location && <p className="text-[10px] font-bold text-red-500 px-1">{errors.location.message}</p>}
              
              <div className="pt-2">
                 <div className="p-4 rounded-xl border border-dotted border-slate-200 dark:border-slate-800 text-center">
                    <Upload className="h-4 w-4 mx-auto text-slate-300 mb-1" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dokumen Pendukung</p>
                 </div>
              </div>
            </div>

            {/* Row 2: Time Validation */}
            <div className="space-y-3">
              <label className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1",
                errors.startTime ? "text-red-500" : "text-slate-400"
              )}>
                <Clock className="h-4 w-4" />
                Waktu Mulai
              </label>
              <input
                type="datetime-local"
                {...register('startTime')}
                className={cn(
                  "w-full h-14 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl px-5 text-sm font-semibold outline-none transition-all dark:border-slate-800",
                  errors.startTime ? "border-red-500 ring-4 ring-red-500/10" : "focus:ring-4 focus:ring-primary/10"
                )}
              />
              {errors.startTime && <p className="text-[10px] font-bold text-red-500 px-1">{errors.startTime.message}</p>}
            </div>

            <div className="space-y-3">
              <label className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1",
                errors.endTime ? "text-red-500" : "text-slate-400"
              )}>
                <Clock className="h-4 w-4" />
                Waktu Selesai
              </label>
              <input
                type="datetime-local"
                {...register('endTime')}
                className={cn(
                  "w-full h-14 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl px-5 text-sm font-semibold outline-none transition-all dark:border-slate-800",
                  errors.endTime ? "border-red-500 ring-4 ring-red-500/10" : "focus:ring-4 focus:ring-primary/10"
                )}
              />
              {errors.endTime && <p className="text-[10px] font-bold text-red-500 px-1">{errors.endTime.message}</p>}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
            <p className="text-[11px] leading-relaxed font-bold text-slate-500">
              Validasi lintas-field memastikan personil tidak dapat memilih waktu selesai yang lebih awal daripada waktu mulai.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
                type="submit" 
                className="px-8 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 flex-1 relative overflow-hidden group active:scale-95 transition-all"
                disabled={isSubmitting}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {/* 4. Loading State: Spinner pada tombol submit */}
                {isSubmitting ? (
                   <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Memproses Validasi...
                   </span>
                ) : (
                   <>
                      Kirim Pengajuan
                      <Send className="h-5 w-5" />
                   </>
                )}
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
