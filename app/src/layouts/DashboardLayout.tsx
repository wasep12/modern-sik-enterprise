import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  CheckSquare, 
  ShieldCheck, 
  Bell, 
  Menu, 
  Check,
  Info,
  AlertTriangle,
  LogOut,
  ChevronDown,
  Users,
  Activity,
  User as UserIcon,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSikStore } from '../store/useSikStore';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/ThemeToggle';
import { LogoutDialog } from '../components/LogoutDialog';

const triggerHaptic = () => {
  if ('vibrate' in navigator) navigator.vibrate(10);
};

interface NavItem {
  title: string;
  icon: any;
  path: string;
  roles: string[];
}

const Sidebar: React.FC<{
  navItems: NavItem[];
  currentPath: string;
  userName?: string;
  onLogout: () => void;
  onLinkClick: () => void;
}> = ({ navItems, currentPath, userName, onLogout, onLinkClick }) => {
  return (
    <div className="flex flex-col h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-hairline border-slate-200/50 dark:border-slate-800/50 transition-all font-refined font-medium shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
      <div className="flex h-20 items-center px-8 shrink-0">
        <div className="h-9 w-9 rounded-2xl bg-primary flex items-center justify-center mr-3 shadow-lg shadow-primary/20 ring-1 ring-primary/30">
           <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-black text-slate-900 dark:text-white tracking-widest uppercase">
          SIK <span className="text-primary italic">DIGITAL</span>
        </span>
      </div>
      
      <div className="px-6 pb-6">
         <div className="group relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full pl-9 pr-4 h-11 bg-slate-100/50 dark:bg-slate-800/30 border border-transparent focus:border-primary/20 rounded-2xl text-[11px] font-bold outline-none transition-all dark:text-white"
            />
         </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        <p className="px-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 opacity-50">Operational</p>
        <LayoutGroup>
          {navItems.map((item, index) => {
            const isActive = currentPath === item.path;
            return (
              <div key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => { triggerHaptic(); onLinkClick(); }}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-[22px] text-[13px] font-black transition-all duration-300 relative group",
                    isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[22px] transform-gpu" 
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn("h-5 w-5 transition-transform duration-300 relative z-10", isActive ? "text-primary scale-110" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:scale-110")} />
                  <span className="flex-1 tracking-tight relative z-10 uppercase">{item.title}</span>
                </Link>
              </div>
            );
          })}
        </LayoutGroup>
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-6 rounded-[36px] recessed-luxury transition-all group">
          <div className="flex items-center gap-3.5 mb-5">
             <div className="h-11 w-11 rounded-2xl bg-white dark:bg-slate-800 border border-hairline border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg shadow-black/5 ring-1 ring-white/10">
                <UserIcon className="h-5 w-5 text-slate-400" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase leading-none truncate tracking-tight">{userName}</p>
                <div className="flex items-center gap-1.5 mt-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Authorized</p>
                </div>
             </div>
          </div>
          <Button 
              variant="ghost" 
              onClick={() => { triggerHaptic(); onLogout(); }}
              className="w-full justify-start rounded-[20px] bg-red-50/80 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-black h-11 px-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center gap-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.7)] border border-red-200 dark:border-red-900/50 cursor-pointer active:scale-95 hover:bg-red-500 dark:hover:bg-red-400 hover:text-white dark:hover:text-white hover:shadow-none"
          >
             <LogOut className="h-3.5 w-3.5" />
             <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, notifications, markNotificationsRead, logout } = useSikStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // NAVIGATION GUARD & TITLE SYNC: Update browser title and manage navigation state
  React.useEffect(() => {
    setIsNavigating(true);
    const activeItem = navItems.find(item => item.path === location.pathname);
    if (activeItem) {
      document.title = `${activeItem.title} | SIK DIGITAL`;
    } else {
      document.title = `SIK DIGITAL`;
    }
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const navItems: NavItem[] = [
    { title: 'Overview', icon: LayoutDashboard, path: '/', roles: ['USER', 'ADMIN', 'DEPUTY', 'OP_HEAD', 'GM_DIRECTOR', 'SECURITY'] },
    { title: 'Work Permit', icon: PlusCircle, path: '/request', roles: ['USER', 'ADMIN'] },
    { title: 'Reviewer', icon: CheckSquare, path: '/approval', roles: ['DEPUTY', 'OP_HEAD', 'GM_DIRECTOR', 'ADMIN'] },
    { title: 'Checkpoint', icon: ShieldCheck, path: '/security', roles: ['SECURITY', 'ADMIN'] },
    { title: 'User Index', icon: Users, path: '/admin/users', roles: ['ADMIN'] },
    { title: 'Audit Trail', icon: Activity, path: '/admin/logs', roles: ['ADMIN'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(currentUser?.role || '')
  );

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    triggerHaptic();
    logout();
    navigate('/login');
  };

  return (
    <div className={cn(
      "min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-1000 text-slate-900 dark:text-slate-50 font-refined selection:bg-primary/10",
      isNavigating && "is-navigating"
    )}>
      
      {/* LUXURY: Floating Sidebar (Desktop) */}
      <aside className="fixed left-6 top-6 bottom-6 hidden w-64 lg:block z-40 overflow-hidden rounded-[40px] shadow-luxury ring-1 ring-white/20 dark:ring-white/5">
        <Sidebar 
          navItems={filteredNavItems} 
          currentPath={location.pathname}
          userName={currentUser?.name}
          onLogout={handleLogout}
          onLinkClick={() => {}}
        />
      </aside>

      {/* Main Framework */}
      <main className="lg:pl-76 min-h-screen flex flex-col pb-24 lg:pb-6 pr-0 lg:pr-6">
        
        {/* LUXURY: Floating Navbar Pill (Desktop) */}
        <header className="sticky top-0 lg:top-6 z-30 flex h-16 items-center justify-between px-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl lg:rounded-[28px] shadow-luxury ring-1 ring-white/20 dark:ring-white/5 lg:mx-0">
          <div className="flex items-center gap-4 lg:hidden">
             <div className="h-7 w-7 rounded-xl bg-primary flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-white" />
             </div>
             <h2 className="text-sm font-black uppercase tracking-wider dark:text-white">SIK <span className="text-primary italic">DIGITAL</span></h2>
          </div>
          
          <div className="hidden lg:block">
            <div className="flex items-center gap-3">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               <p className="text-[10px] font-black dark:text-slate-300 uppercase tracking-[0.3em]">
                 {navItems.find(n => n.path === location.pathname)?.title || 'Directory'}
               </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle />
            
            <div className="relative">
              <Button 
                variant="ghost"
                size="icon"
                className={cn(
                  "relative h-9 w-9 grid place-items-center rounded-xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 border border-hairline border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer active:scale-90", 
                  showNotifications && "bg-primary/10 border-primary/20 text-primary opacity-100"
                )}
                onClick={() => {
                   setShowNotifications(!showNotifications);
                   if (!showNotifications) markNotificationsRead();
                 }}
              >
                <div className="relative h-[18px] w-[18px] grid place-items-center">
                  <Bell className={cn("h-full w-full transition-colors", showNotifications ? "text-primary" : "text-slate-500 dark:text-slate-400")} />
                  {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-primary rounded-full ring-2 ring-white dark:ring-slate-900" />}
                </div>
              </Button>
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-hairline border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-5 border-b border-hairline dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <span className="font-black text-[10px] uppercase tracking-widest dark:text-white">Central Activity</span>
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      </div>
                      <div className="max-h-[350px] overflow-y-auto scrollbar-hide py-2">
                        {notifications.map((n) => (
                           <div key={n.id} className="px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <p className="text-[11px] font-black dark:text-white leading-tight mb-1">{n.title}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{n.description}</p>
                           </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            
            <div className="relative">
              <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 pl-1 cursor-pointer group">
                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-primary border border-hairline border-slate-200 dark:border-slate-700 transition-transform group-hover:scale-110 shadow-sm">
                  {currentUser?.avatar || currentUser?.name.charAt(0)}
                </div>
                <ChevronDown className={cn("h-3 w-3 text-slate-400 transition-transform", showProfileMenu && "rotate-180")} />
              </div>
              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} className="absolute right-0 mt-3 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-hairline border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-1">
                        <Button variant="ghost" className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors justify-start border-none h-auto">
                           <UserIcon className="h-3.5 w-3.5" /> Profile
                        </Button>
                        <Button variant="ghost" onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors justify-start border-none h-auto">
                           <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </Button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <section className="p-6 lg:p-10 lg:pt-14 flex-1 relative min-h-[calc(100vh-140px)]">
          <AnimatePresence mode="wait">
             <motion.div 
               key={location.pathname} 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               transition={{ duration: 0.2, ease: "linear" }}
               className="w-full transform-gpu will-change-opacity"
             >
                {children}
             </motion.div>
          </AnimatePresence>
        </section>

        {/* Global Floating Nav (Mobile) */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[380px] z-40">
           <LayoutGroup>
              <nav className="bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-2 flex items-center justify-between relative overflow-hidden">
                {filteredNavItems.slice(0, 4).map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      onClick={triggerHaptic}
                      className={cn(
                        "relative flex items-center justify-center h-12 transition-all duration-500 rounded-2xl",
                        isActive ? "flex-[1.8] bg-primary text-white px-5 shadow-lg shadow-primary/20" : "flex-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      )}
                    >
                       <AnimatePresence>
                          {isActive && (
                            <motion.div 
                              layoutId="nav-pill-mobile"
                              className="absolute inset-0 bg-primary rounded-2xl"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                       </AnimatePresence>
                       <div className="flex items-center gap-2.5 relative z-10 transition-transform active:scale-90 duration-200">
                          <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                          {isActive && (
                            <motion.span 
                               initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                               className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                            >
                               {item.title.split(' ')[0]}
                            </motion.span>
                          )}
                       </div>
                    </Link>
                  );
                })}
                <Button 
                  variant="ghost"
                  onClick={() => { triggerHaptic(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
                  className="flex-1 flex items-center justify-center h-12 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 relative border-none active:scale-90 transition-all font-bold"
                >
                   <MoreHorizontal className="h-5 w-5" />
                </Button>
              </nav>
           </LayoutGroup>
        </div>

        {/* Mobile Full Menu Drawer */}
        <AnimatePresence>
           {isMobileMenuOpen && (
             <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50" onClick={() => setIsMobileMenuOpen(false)} />
               <motion.div 
                 initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                 transition={{ type: "spring", damping: 25, stiffness: 300 }}
                 className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 rounded-t-[48px] z-50 p-10"
               >
                  <div className="w-10 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8" />
                  <div className="grid grid-cols-2 gap-4">
                     {filteredNavItems.map(item => (
                       <Link 
                         key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                         className={cn(
                           "flex flex-col items-center gap-3 p-6 rounded-[32px] border border-hairline shadow-sm transition-all active:scale-95",
                           location.pathname === item.path ? "bg-primary/5 border-primary/20 text-primary" : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500"
                         )}
                       >
                          <item.icon className="h-5 w-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.title}</span>
                       </Link>
                     ))}
                     <Button 
                        variant="destructive"
                        onClick={handleLogout} 
                        className="col-span-2 py-8 rounded-[32px] bg-red-50 dark:bg-red-950/20 text-red-500 font-black text-xs uppercase tracking-widest border-none h-auto transition-all active:scale-95"
                      >
                         Sign Out
                      </Button>
                  </div>
               </motion.div>
             </>
           )}
        </AnimatePresence>
      </main>

      {/* LUXURY: Logout Verification Dialog */}
      <LogoutDialog 
        isOpen={isLogoutDialogOpen} 
        onClose={() => setIsLogoutDialogOpen(false)} 
        onConfirm={confirmLogout} 
      />
    </div>
  );
};
