import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useSikStore } from '../../store/useSikStore';
import { Button } from '../../components/ui/button';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle2,
  Users,
  ChevronRight,
  Shield,
  User as UserIcon,
  HardHat,
  Building2,
  Fingerprint,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { BackgroundAurora } from '../../components/BackgroundAurora';

export const Login: React.FC = () => {
  const { login } = useSikStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // TITLE SYNC
  React.useEffect(() => {
    document.title = "Akses Masuk | SIK DIGITAL";
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Gagal Login', { description: 'Email dan password wajib diisi.' });
      return;
    }
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      setIsSuccess(true);
      toast.success('Akses Diterima');
    } else {
      toast.error('Gagal Autentikasi');
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setIsLoading(true);
    const success = await login(userEmail, 'admin123');
    setIsLoading(false);
    if (success) {
      setIsSuccess(true);
      toast.success('Sesi Demo Aktif');
    }
  };

  const demoProfiles = [
    { name: 'Admin', role: 'ADMIN', email: 'wasep@sik.com', icon: Shield, color: 'text-blue-500' },
    { name: 'Deputy', role: 'DEPUTY', email: 'jane@sik.com', icon: Building2, color: 'text-amber-500' },
    { name: 'Security', role: 'SECURITY', email: 'bob@sik.com', icon: HardHat, color: 'text-emerald-500' },
    { name: 'User', role: 'USER', email: 'alice@sik.com', icon: UserIcon, color: 'text-purple-500' },
  ];

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-1000">
      <BackgroundAurora />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] z-10"
      >
        {/* Brand */}
        <div className="text-center mb-8">
           <motion.div 
             initial={{ y: -20 }}
             animate={{ y: 0 }}
             className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/40"
           >
              <ShieldCheck className="h-8 w-8 text-white" />
           </motion.div>
           <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mb-1">
              SIK <span className="text-primary italic">DIGITAL</span>
           </h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Sistem Informasi Kerja Digital</p>
        </div>

        {/* Login Card */}
        <div 
          onMouseMove={handleMouseMove}
          className="group relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-[50px] border border-white/30 dark:border-slate-800/50 rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.06)] overflow-hidden p-8 sm:p-10"
        >
           {/* Spotlight */}
           <motion.div
             className="pointer-events-none absolute -inset-px rounded-[40px] transition duration-300 opacity-0 group-hover:opacity-100"
             style={{
               background: useTransform(
                 [mouseX, mouseY],
                 ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.1), transparent 80%)`
               ),
             }}
           />

           <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="relative group">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" "
                  className="peer w-full h-14 bg-white/20 dark:bg-slate-900/30 border-2 border-slate-100/50 dark:border-slate-800/50 rounded-2xl px-5 text-sm font-bold outline-none transition-all focus:border-primary/50 dark:text-white placeholder-shown:pt-0"
                />
                <label className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none transition-all peer-focus:top-3 peer-focus:text-[9px] peer-focus:text-primary peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:uppercase">
                  Email Address
                </label>
              </div>

              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" "
                  className="peer w-full h-14 bg-white/20 dark:bg-slate-900/30 border-2 border-slate-100/50 dark:border-slate-800/50 rounded-2xl px-5 text-sm font-bold outline-none transition-all focus:border-primary/50 dark:text-white placeholder-shown:pt-0"
                />
                <label className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none transition-all peer-focus:top-3 peer-focus:text-[9px] peer-focus:text-primary peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:uppercase">
                  Password
                </label>
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors h-12 w-12 border-none active:scale-90"
                >
                  {showPassword ? <EyeOff className="h-7 w-7" /> : <Eye className="h-7 w-7" />}
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50"
                disabled={isLoading || isSuccess}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSuccess ? <CheckCircle2 className="h-4 w-4" /> : "Masuk ke Dashboard"}
              </Button>
           </form>

           <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800 text-center relative z-10">
               <Button 
                 variant="ghost"
                 onClick={() => setShowDemo(!showDemo)}
                 className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto h-auto py-2 border-none"
               >
                  <Users className="h-3 w-3" />
                  Pilih Akun Contoh
                  <ChevronRight className={cn("h-3 w-3 transition-transform", showDemo && "rotate-90")} />
               </Button>
           </div>
        </div>

        {/* Quick Demo Selector */}
        <AnimatePresence>
          {showDemo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 grid grid-cols-4 gap-2"
            >
               {demoProfiles.map((p) => (
                 <button 
                   key={p.email}
                   onClick={() => handleQuickLogin(p.email)}
                   className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl glass-card border-white/20 hover:border-primary/30 transition-all bg-white/10 dark:bg-slate-900/20 shadow-sm hover:shadow-lg active:scale-90"
                 >
                    <div className={cn("h-8 w-8 rounded-xl bg-white/50 dark:bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white", p.color)}>
                       <p.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-tighter">{p.name}</span>
                 </button>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <div className="mt-8 text-center opacity-30 select-none">
           <Fingerprint className="h-8 w-8 text-slate-400 mx-auto" />
           <p className="text-[8px] font-black uppercase tracking-[0.4em] mt-2 text-slate-500">Infrastruktur Aman & Terpercaya</p>
        </div>
      </motion.div>
    </div>
  );
};
