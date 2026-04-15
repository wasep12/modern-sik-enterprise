import React, { useState, useRef } from 'react';
import { useSikStore } from '../../store/useSikStore';
import {
  Camera,
  Save,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  RefreshCw,
  Copy,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

import { PASSWORD_RULES, generateSecurePassword } from '../../lib/password-utils';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUser, logActivity } = useSikStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // TITLE SYNC
  React.useEffect(() => {
    document.title = 'Profil Saya | SIK DIGITAL';
  }, []);

  const passedRules = PASSWORD_RULES.filter(r => r.test(newPassword));
  const allPassed = newPassword.length > 0 && passedRules.length === PASSWORD_RULES.length;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }
    if (currentUser) {
      const avatar = name.charAt(0).toUpperCase();
      updateUser(currentUser.id, { name: name.trim(), avatar });
      // Sync localStorage
      const updated = { ...currentUser, name: name.trim(), avatar };
      localStorage.setItem('user', JSON.stringify(updated));
      useSikStore.setState({ currentUser: updated });
      logActivity(`Profile Updated: ${currentUser.name} → ${name.trim()}`);
      toast.success('Profil berhasil diperbarui');
    }
  };

  const handleChangePassword = () => {
    if (currentPassword !== 'admin123') {
      toast.error('Password lama salah');
      return;
    }
    if (!allPassed) {
      toast.error('Password baru belum memenuhi semua kebijakan ISO');
      return;
    }
    if (!passwordsMatch) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }
    logActivity('Password Changed (ISO 27001 Compliant)');
    toast.success('Password berhasil diperbarui');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleGeneratePassword = () => {
    const pw = generateSecurePassword(16);
    setNewPassword(pw);
    setConfirmPassword(pw);
    setShowNewPw(true);
    setShowConfirmPw(true);
    toast.success('Password aman dibuat secara otomatis');
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    toast.success('Password disalin ke clipboard');
  };

  const getRoleBadge = (role: string) => {
    const map: Record<string, { label: string; color: string }> = {
      ADMIN: { label: 'Administrator', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' },
      DEPUTY: { label: 'GSD Deputy', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
      OP_HEAD: { label: 'Operational Head', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' },
      GM_DIRECTOR: { label: 'GM / Director', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' },
      SECURITY: { label: 'Security Guard', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
      USER: { label: 'Staff / Pemohon', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    };
    const info = map[role] || map.USER;
    return (
      <span className={cn('px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest', info.color)}>
        {info.label}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto pb-32 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Profil Saya</h2>
        <p className="text-slate-500 font-medium text-sm mt-1">Kelola informasi personal dan keamanan akun Anda.</p>
      </div>

      {/* ── Profile Card ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
      >
        <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="h-28 w-28 rounded-[32px] bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-xl">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-primary">{currentUser?.avatar || currentUser?.name?.charAt(0)}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-transform"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="space-y-1">
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{currentUser?.name}</p>
              <p className="text-sm text-slate-400 font-medium">{currentUser?.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              {getRoleBadge(currentUser?.role || 'USER')}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Editable name */}
        <div className="px-8 sm:px-10 pb-8 space-y-5 border-t border-slate-100 dark:border-slate-800 pt-8">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="w-full h-14 bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 text-sm font-bold text-slate-400 cursor-not-allowed dark:text-slate-500"
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            className="rounded-2xl h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Perubahan
          </Button>
        </div>
      </motion.div>

      {/* ── Password Card ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
      >
        <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-black dark:text-white tracking-tighter uppercase">Ubah Password</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ISO 27001 Compliance</p>
            </div>
          </div>
          <Shield className="h-5 w-5 text-primary opacity-30" />
        </div>

        <div className="p-8 sm:p-10 space-y-6">
          {/* Current password */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 pr-14 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
                placeholder="Masukkan password lama"
              />
              <button onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New password + generate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password Baru</label>
              <div className="flex items-center gap-2">
                {newPassword && (
                  <button onClick={handleCopyPassword} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95">
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                )}
                <button onClick={handleGeneratePassword} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary/20 transition-colors active:scale-95">
                  <Sparkles className="h-3 w-3" /> Generate
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 pr-14 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white font-mono"
                placeholder="Masukkan password baru"
              />
              <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* ISO Password strength indicator */}
          {newPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kebijakan Password ISO 27001</p>
                <span className={cn("text-[10px] font-black uppercase tracking-widest", allPassed ? "text-emerald-500" : "text-amber-500")}>
                  {passedRules.length}/{PASSWORD_RULES.length}
                </span>
              </div>
              {/* Strength bar */}
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(passedRules.length / PASSWORD_RULES.length) * 100}%` }}
                  className={cn("h-full rounded-full transition-colors", allPassed ? "bg-emerald-500" : passedRules.length >= 4 ? "bg-amber-500" : "bg-red-500")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(newPassword);
                  return (
                    <div key={rule.id} className="flex items-center gap-2">
                      <div className={cn("h-5 w-5 rounded-lg flex items-center justify-center shrink-0 transition-colors", passed ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600" : "bg-red-100 dark:bg-red-950/40 text-red-500")}>
                        {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </div>
                      <span className={cn("text-[11px] font-bold", passed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400")}>{rule.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Confirm password */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Konfirmasi Password Baru</label>
            <div className="relative">
              <input
                type={showConfirmPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={cn(
                  "w-full h-14 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl px-5 pr-14 text-sm font-bold outline-none focus:ring-4 transition-all dark:text-white font-mono",
                  confirmPassword.length > 0 && !passwordsMatch
                    ? "border-red-300 dark:border-red-800 focus:ring-red-500/10"
                    : confirmPassword.length > 0 && passwordsMatch
                    ? "border-emerald-300 dark:border-emerald-800 focus:ring-emerald-500/10"
                    : "border-slate-200 dark:border-slate-800 focus:ring-primary/10"
                )}
                placeholder="Ulangi password baru"
              />
              <button onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-[11px] font-bold text-red-500 mt-2">Password tidak cocok</p>
            )}
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={!allPassed || !passwordsMatch || !currentPassword}
            className="rounded-2xl h-12 px-8 bg-slate-800 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-800/10 dark:shadow-none transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Perbarui Password
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
