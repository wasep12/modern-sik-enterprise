import React, { useState } from 'react';
import { useSikStore } from '../../store/useSikStore';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Shield, 
  Mail,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  KeyRound,
  Fingerprint,
  User as UserIcon,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import type { UserRole, User } from '../../types/sik';
import { Skeleton } from '../../components/ui/skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { toast } from 'sonner';
import { PASSWORD_RULES, generateSecurePassword } from '../../lib/password-utils';
import { Modal } from '../../components/ui/Modal';

// HELPER: Specialized Skeletons for User Table
const UserTableSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-8 space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
        ))}
    </div>
);

const roles: UserRole[] = ['USER', 'DEPUTY', 'OP_HEAD', 'GM_DIRECTOR', 'SECURITY', 'ADMIN'];

const RoleBadge = ({ role }: { role: UserRole }) => {
  const configs: Record<UserRole, { label: string; class: string }> = {
    ADMIN: { label: 'Admin', class: 'bg-primary/10 text-primary border-primary/20' },
    USER: { label: 'Staff', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700' },
    DEPUTY: { label: 'L1: Deputy', class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
    OP_HEAD: { label: 'L2: Op Head', class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
    GM_DIRECTOR: { label: 'L3: GM', class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
    SECURITY: { label: 'Security', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' },
  };
  const config = configs[role];
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", config.class)}>
      {config.label}
    </span>
  );
};

export const UserManagement: React.FC = () => {
  const { users, updateUser, deleteUser, currentUser, logActivity } = useSikStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // EDIT MODAL STATE
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempRole, setTempRole] = useState<UserRole>('USER');

  // PASSWORD RESET STATE
  const [resetPassword, setResetPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetActive, setIsResetActive] = useState(false);

  // DELETE MODAL STATE
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // SIMULATE LOADING
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Filter and then Paginate
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setTempName(user.name);
    setTempEmail(user.email);
    setTempRole(user.role);
    setResetPassword('');
    setIsResetActive(false);
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleUpdateMember = () => {
    if (editingUser) {
      const updateData: Partial<User> = { 
        name: tempName, 
        email: tempEmail, 
        role: tempRole,
        avatar: tempName.charAt(0).toUpperCase()
      };
      
      updateUser(editingUser.id, updateData);
      
      if (isResetActive && resetPassword) {
        logActivity(`Password Reset for: ${editingUser.name} (ISO Compliant)`);
        toast.success(`Data personil & password ${tempName} berhasil diperbarui.`);
      } else {
        logActivity(`Update Member: ${editingUser.name}`);
        toast.success(`Data personil ${tempName} berhasil diperbarui.`);
      }
      
      closeEditModal();
    }
  };

  const handleGenerateReset = () => {
    const pw = generateSecurePassword(16);
    setResetPassword(pw);
    setShowPassword(true);
    toast.info('Password aman berhasil digenerate.');
  };

  const handleDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      logActivity(`Delete User: ${userToDelete.name}`);
      toast.success(`Akun ${userToDelete.name} telah dihapus dari sistem.`);
      setUserToDelete(null);
    }
  };

  // Password Validation
  const passedRules = PASSWORD_RULES.filter(r => r.test(resetPassword));
  const isPasswordValid = passedRules.length === PASSWORD_RULES.length;

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Kelola Personil</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Gunakan Role-Based Access Control (RBAC) untuk otorisasi sistem.</p>
        </div>
        <Button className="rounded-2xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 cursor-pointer">
          <UserPlus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau email..."
              className="w-full pl-12 pr-4 h-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
             <Shield className="h-4 w-4 text-primary" />
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Policies: 6 Roles</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
               <div className="p-4"><UserTableSkeleton /></div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5">Personil</th>
                    <th className="px-8 py-5">Wewenang / Role</th>
                    <th className="px-8 py-5">Akses Terakhir</th>
                    <th className="px-8 py-5 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence mode="popLayout">
                    {pagedUsers.length > 0 ? (
                      pagedUsers.map((user) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={user.id} 
                          className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-linear-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-lg border-2 border-white dark:border-slate-800 group-hover:scale-110 transition-transform shadow-sm">
                                {user.avatar || user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 dark:text-white leading-none mb-1">{user.name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <RoleBadge role={user.role} />
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Baru Saja</p>
                             <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">Jakarta, ID</p>
                          </td>
                          <td className="px-8 py-6 text-right space-x-2">
                            <button 
                              onClick={() => openEditModal(user)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all cursor-pointer"
                            >
                               <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setUserToDelete(user)}
                              disabled={user.id === currentUser?.id}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-all disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                            >
                               <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <td colSpan={4} className="py-20">
                          <EmptyState 
                            icon={Users}
                            title="User Tidak Ditemukan"
                            description="Kami tidak menemukan personil yang sesuai dengan kriteria pencarian Anda. Pastikan nama atau email sudah benar."
                            className="bg-transparent"
                          />
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Footer */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredUsers.length)} dari {filteredUsers.length} personil
            </p>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 border-none cursor-pointer"
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
                        "h-8 w-8 rounded-xl text-xs font-black transition-all active:scale-90 cursor-pointer",
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
                className="h-8 w-8 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 border-none cursor-pointer"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Edit Member Modal (Portal Based) ───────────────────── */}
      <Modal 
        isOpen={!!editingUser} 
        onClose={closeEditModal}
        className="max-w-lg rounded-[40px]"
      >
        {editingUser && (
          <div className="flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Fingerprint className="h-5 w-5" />
                 </div>
                 <div>
                   <h3 className="font-black text-lg tracking-tighter dark:text-white leading-none uppercase mb-1">Manajemen Member</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update Profil & Otoritas</p>
                 </div>
              </div>
              <button 
                onClick={closeEditModal} 
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-7 overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 {/* Name */}
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Lengkap</label>
                   <div className="relative">
                     <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     <input 
                       type="text"
                       value={tempName}
                       onChange={(e) => setTempName(e.target.value)}
                       className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
                     />
                   </div>
                 </div>
                 {/* Email */}
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Alamat Email</label>
                   <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     <input 
                       type="email"
                       value={tempEmail}
                       onChange={(e) => setTempEmail(e.target.value)}
                       className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
                     />
                   </div>
                 </div>
              </div>

              {/* ADVANCED PASSWORD RESET */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <KeyRound className="h-4 w-4 text-primary" />
                       <span className="text-[11px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Reset Kata Sandi</span>
                    </div>
                    <button 
                      onClick={() => setIsResetActive(!isResetActive)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                        isResetActive ? "bg-red-500 text-white border-red-500" : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      )}
                    >
                      {isResetActive ? 'Batalkan' : 'Aktifkan'}
                    </button>
                 </div>

                 {isResetActive && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }} 
                     animate={{ opacity: 1, height: 'auto' }} 
                     className="space-y-4 pt-2"
                   >
                      <div className="flex gap-2">
                         <div className="relative flex-1">
                            <input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Ketik Sandi Baru..."
                              value={resetPassword}
                              onChange={(e) => setResetPassword(e.target.value)}
                              className="w-full h-12 px-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all dark:text-white"
                            />
                             <button 
                               onClick={() => setShowPassword(!showPassword)}
                               className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary cursor-pointer h-10 w-10 flex items-center justify-center transition-all"
                             >
                               {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                             </button>
                         </div>
                         <Button 
                           onClick={handleGenerateReset}
                           className="h-12 w-12 rounded-2xl bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 px-0 shrink-0 cursor-pointer"
                         >
                            <Sparkles className="h-5 w-5 text-white" />
                         </Button>
                      </div>

                      {/* ISO Strength Indicator */}
                      {resetPassword && (
                        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                           <div className="flex items-center justify-between mb-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Kebijakan ISO 27001</p>
                              <span className={cn("text-[9px] font-black uppercase", isPasswordValid ? "text-emerald-500" : "text-amber-500")}>
                                 {passedRules.length}/{PASSWORD_RULES.length}
                              </span>
                           </div>
                           <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                animate={{ width: `${(passedRules.length / PASSWORD_RULES.length) * 100}%` }}
                                className={cn("h-full", isPasswordValid ? "bg-emerald-500" : "bg-amber-500")}
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                              {PASSWORD_RULES.map(r => {
                                 const ok = r.test(resetPassword);
                                 return (
                                   <div key={r.id} className="flex items-center gap-2">
                                      <div className={cn("h-4 w-4 rounded-lg flex items-center justify-center shrink-0", ok ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-300")}>
                                         {ok ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                                      </div>
                                      <span className={cn("text-[10px] font-bold", ok ? "text-emerald-600" : "text-slate-400")}>{r.label}</span>
                                   </div>
                                 )
                              })}
                           </div>
                        </div>
                      )}
                   </motion.div>
                 )}
              </div>

              {/* Role Selection */}
              <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Level Otoritas Sistem</label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {roles.map((r) => (
                     <label 
                       key={r} 
                       className={cn(
                         "flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all active:scale-95",
                         tempRole === r 
                           ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm" 
                           : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800"
                       )}
                     >
                       <div className={cn(
                         "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                         tempRole === r ? "border-primary bg-primary" : "border-slate-300 dark:border-slate-600"
                       )}>
                          {tempRole === r && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                       </div>
                       <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className={cn("text-[11px] font-black truncate pr-1 leading-none uppercase tracking-tighter", tempRole === r ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                             {r === 'USER' ? 'Staf' : r === 'SECURITY' ? 'Security' : r}
                          </span>
                          <RoleBadge role={r} />
                       </div>
                     </label>
                   ))}
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end gap-3 shrink-0">
               <Button 
                 variant="ghost" 
                 onClick={closeEditModal} 
                 className="rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
               >
                 Batal
               </Button>
               <Button 
                 disabled={isResetActive && !isPasswordValid}
                 onClick={handleUpdateMember}
                 className="rounded-2xl h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
               >
                 <RefreshCw className="h-4 w-4 mr-2" />
                 Update Member
               </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirmation Modal (Portal Based) ──────────── */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        className="max-w-sm rounded-[40px] p-10 text-center"
      >
        {userToDelete && (
          <>
            <div className="h-20 w-20 rounded-[28px] bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Hapus Akun?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
              Tindakan ini permanen. Personil <span className="font-bold text-slate-900 dark:text-white">{userToDelete.name}</span> akan kehilangan akses ke seluruh sistem SIK DIGITAL.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleDelete}
                className="w-full rounded-2xl h-14 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-transform cursor-pointer"
              >
                Ya, Hapus Akun
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setUserToDelete(null)}
                className="w-full rounded-2xl h-14 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 active:scale-95 transition-transform cursor-pointer"
              >
                Batal
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};
