import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  BarChart3, 
  Wallet, 
  Target, 
  MessageSquare, 
  BookOpen, 
  Bell, 
  Settings, 
  LogOut,
  Search,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Markets', icon: BarChart3, href: '/markets' },
  { label: 'Portfolio', icon: Wallet, href: '/portfolio' },
  { label: 'Goals', icon: Target, href: '/goals' },
  { label: 'AI Advisor', icon: MessageSquare, href: '/advisor' },
  { label: 'Learn', icon: BookOpen, href: '/learn' },
  { label: 'Alerts', icon: Bell, href: '/alerts' },
];

export const AppShell = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r border-border bg-surface transition-all duration-300",
          isSidebarOpen ? "w-60" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">I</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">InvestIQ</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <NavLink 
            to="/settings"
            className={({ isActive }) => cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
            )}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Settings</span>}
          </NavLink>
          <div className="flex items-center gap-3 px-3 py-4">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-surface-elevated" />
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-text-muted truncate">Premium Plan</p>
              </div>
            )}
            {isSidebarOpen && <LogOut onClick={handleLogout} className="w-4 h-4 text-text-muted cursor-pointer hover:text-danger transition-colors" />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:block p-2 hover:bg-surface-elevated rounded-lg text-text-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-surface-elevated rounded-lg text-text-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search markets, news, or tools... [⌘K]" 
                className="w-full bg-surface-elevated border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-surface-elevated rounded-lg text-text-muted relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-surface"></span>
            </button>
            <div className="h-8 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-[10px] text-success font-bold mt-1 uppercase tracking-wider">Online</p>
              </div>
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-border" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={useLocation().pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex items-center justify-around px-2 z-20">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all",
              isActive ? "text-primary" : "text-text-muted"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-surface z-40 md:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">I</span>
                  </div>
                  <span className="font-bold text-xl tracking-tight">InvestIQ</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-surface-elevated rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-text-muted hover:bg-surface-elevated"
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
