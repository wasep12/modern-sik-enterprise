import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Laptop } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-10 w-10" />;

  const themes = [
    { name: 'light', label: 'Terang', icon: Sun },
    { name: 'dark', label: 'Gelap', icon: Moon },
    { name: 'system', label: 'Sistem', icon: Laptop },
  ]

  const handleThemeChange = (newTheme: string) => {
    // Fallback for browsers that don't support View Transitions
    if (!document.startViewTransition) {
      setTheme(newTheme);
      setOpen(false);
      return;
    }

    // Capture the button coordinates to ensure consistent ripple origin
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    // Set the CSS variables for the ripple start position
    document.documentElement.style.setProperty('--ripple-x', `${x}px`);
    document.documentElement.style.setProperty('--ripple-y', `${y}px`);
    
    // Performance: Add transition suppressor class
    document.documentElement.classList.add('view-transitioning');

    // Start the transition
    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
      setOpen(false);
    });

    // Cleanup when done
    transition.finished.finally(() => {
      document.documentElement.classList.remove('view-transitioning');
    });
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        onClick={() => setOpen(!open)}
        className="w-9 h-9 grid place-items-center rounded-xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 border border-hairline border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer active:scale-90"
      >
        <div className="relative h-[18px] w-[18px]">
           <Sun className={cn(
             "absolute h-full w-full transition-all duration-500", 
             resolvedTheme === 'dark' ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
           )} />
           <Moon className={cn(
             "absolute h-full w-full transition-all duration-500", 
             resolvedTheme === 'dark' ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
           )} />
        </div>
        <span className="sr-only">Toggle theme</span>
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2 space-y-1">
                {themes.map((t) => (
                  <button
                    key={t.name}
                    onClick={(e) => handleThemeChange(t.name, e)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                      theme === t.name
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                    {theme === t.name && (
                      <motion.div 
                        layoutId="active-theme-dot"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" 
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
