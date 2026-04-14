import React, { useState } from 'react';
import { useSikStore } from '../../store/useSikStore';
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Shield, 
  Mail,
  Search,
  Check,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import type { UserRole, User } from '../../types/sik';
import { Skeleton } from '../../components/ui/skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

// HELPER: Specialized Skeletons for User Table
const UserTableSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border dark:border-slate-800 shadow-2xl overflow-hidden p-8 space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between py-4 border-b dark:border-slate-800 last:border-0">
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

export const UserManagement: React.FC = () => {
  const { users, setRole, deleteUser, currentUser } = useSikStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // SIMULATE LOADING: BEST PRACTICE SNAPPY FEEL
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles: UserRole[] = ['USER', 'DEPUTY', 'OP_HEAD', 'GM_DIRECTOR', 'SECURITY', 'ADMIN'];

  const RoleBadge = ({ role }: { role: UserRole }) => {
    const configs: Record<UserRole, { label: string; class: string }> = {
      ADMIN: { label: 'Admin', class: 'bg-primary/10 text-primary border-primary/20' },
      USER: { label: 'Staff', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
      DEPUTY: { label: 'L1: Deputy', class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' },
      OP_HEAD: { label: 'L2: Op Head', class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' },
      GM_DIRECTOR: { label: 'L3: GM', class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' },
      SECURITY: { label: 'Security', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' },
    };
    const config = configs[role];
    return (
      <span className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", config.class)}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Kelola Personil</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Gunakan Role-Based Access Control (RBAC) untuk otorisasi sistem.</p>
        </div>
        <Button className="rounded-2xl h-12 px-6 bg-slate-950 dark:bg-white dark:text-slate-950 font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
          <UserPlus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 border-b dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau email..."
              className="w-full pl-12 pr-4 h-12 bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-800">
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
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b dark:border-slate-800">
                    <th className="px-8 py-5">Personil</th>
                    <th className="px-8 py-5">Wewenang / Role</th>
                    <th className="px-8 py-5">Akses Terakhir</th>
                    <th className="px-8 py-5 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
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
                              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-lg border-2 border-white dark:border-slate-800 group-hover:scale-110 transition-transform shadow-sm">
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
                            {editingId === user.id ? (
                              <div className="flex items-center gap-2">
                                 <select 
                                   className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-1.5 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                                   value={user.role}
                                   onChange={(e) => {
                                     setRole(user.id, e.target.value as UserRole);
                                     setEditingId(null);
                                   }}
                                 >
                                   {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                 </select>
                                 <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400">
                                   <X className="h-4 w-4" />
                                 </button>
                              </div>
                            ) : (
                              <RoleBadge role={user.role} />
                            )}
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Baru Saja</p>
                             <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">Jakarta, ID</p>
                          </td>
                          <td className="px-8 py-6 text-right space-x-2">
                            <button 
                              onClick={() => setEditingId(user.id)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all"
                            >
                               <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteUser(user.id)}
                              disabled={user.id === currentUser?.id}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-all disabled:opacity-30 disabled:hover:text-slate-400"
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
      </div>
    </div>
  );
};
