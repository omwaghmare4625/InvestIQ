import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, BarChart3, Wallet, Target,
  MessageSquare, BookOpen, Bell, Settings,
  LogOut, Search, Menu, X, Command,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { useThemeStore } from '@/store/useTheme';
import { motion, AnimatePresence } from 'motion/react';
import { ConfirmDialog } from '@/components/ui/Common';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', accent: 'primary' },
  { label: 'Markets', icon: BarChart3, href: '/markets', accent: 'primary' },
  { label: 'Portfolio', icon: Wallet, href: '/portfolio', accent: 'accent' },
  { label: 'Goals', icon: Target, href: '/goals', accent: 'tertiary' },
  { label: 'AI Advisor', icon: MessageSquare, href: '/advisor', accent: 'accent' },
  { label: 'Learn', icon: BookOpen, href: '/learn', accent: 'primary' },
  { label: 'Alerts', icon: Bell, href: '/alerts', accent: 'primary' },
];

export const AppShell = () => {
  const { user, logout } = useStore();
  const { compactMode } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Restore theme
  React.useEffect(() => {
    const t = localStorage.getItem('investiq-theme');
    if (t === 'dark') document.documentElement.classList.add('dark');
    else if (t === 'light') document.documentElement.classList.remove('dark');
  }, []);

  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/'); };

  const sidebarWidth = sidebarCollapsed ? 'w-[72px]' : 'w-[240px]';

  return (
    <div className={cn("flex h-screen bg-background overflow-hidden relative", compactMode && "compact-mode")}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden md:flex flex-col z-30 shrink-0 transition-all duration-300',
          sidebarWidth
        )}
      >
        {/* Professional sidebar panel */}
        <div className="m-3 flex-1 flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Logo area */}
          <div className={cn(
            'flex items-center border-b border-border transition-all duration-300',
            sidebarCollapsed ? 'p-4 justify-center' : 'px-6 py-5 gap-3'
          )}>
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="InvestIQ"
                className={cn(
                  "object-contain relative z-10 transition-transform duration-300",
                  sidebarCollapsed ? "w-10 h-10" : "w-8 h-8"
                )}
              />
            </div>
            {!sidebarCollapsed && (
              <span className="font-sans font-bold text-lg tracking-tight text-text-primary">
                Invest<span className="text-primary">IQ</span>
              </span>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                    sidebarCollapsed ? 'px-0 py-3 justify-center' : 'px-4 py-2.5',
                    isActive
                      ? 'text-primary bg-primary/10 border border-primary/20'
                      : 'text-text-dim hover:text-text-primary hover:bg-surface-elevated border border-transparent'
                  )}
                >
                  <item.icon className={cn(
                    'shrink-0 transition-all duration-200 z-10',
                    sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4',
                    isActive ? 'text-primary' : 'group-hover:scale-110'
                  )} />
                  {!sidebarCollapsed && (
                    <span className="z-10">{item.label}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom user area */}
          <div className="p-3 border-t border-border space-y-1">
            <NavLink
              to="/settings"
              title={sidebarCollapsed ? 'Settings' : undefined}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group border border-transparent',
                sidebarCollapsed ? 'px-0 py-3 justify-center' : 'px-4 py-2.5',
                isActive
                  ? 'text-primary bg-primary/10 border-primary/20'
                  : 'text-text-dim hover:text-text-primary hover:bg-surface-elevated'
              )}
            >
              <Settings className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
              {!sidebarCollapsed && <span>Settings</span>}
            </NavLink>

            <div className={cn(
              'flex items-center gap-3 px-3 py-3',
              sidebarCollapsed && 'justify-center'
            )}>
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-border p-0.5"
                />
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-tertiary border-2 border-background" />
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-text-primary leading-tight">{user.name}</p>
                    <p className="text-[10px] text-text-dim font-medium uppercase tracking-wider">Premium Member</p>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="p-1.5 hover:bg-danger/10 hover:text-danger rounded-lg transition-all text-text-dim"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-2 hover:bg-surface-elevated rounded-lg text-text-dim hover:text-text-primary transition-all active:scale-95"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 hover:bg-surface-elevated rounded-lg text-text-dim"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            {/* Search bar */}
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim/50" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search assets, markets…"
                readOnly
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                className="w-full bg-surface-low border border-border rounded-lg pl-10 pr-12 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer transition-all placeholder:text-text-dim/40 hover:border-primary/30"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-surface border border-border text-[9px] font-medium text-text-dim">
                <Command className="w-2.5 h-2.5" />K
              </div>

              {/* Search dropdown */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-surface border border-border rounded-xl shadow-lg z-50"
                  >
                    <p className="text-[10px] font-medium text-text-dim px-2 py-1 mb-1">Quick Jump</p>
                    {[
                      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                      { icon: Wallet, label: 'Portfolio', path: '/portfolio' },
                      { icon: BarChart3, label: 'Markets', path: '/markets' },
                      { icon: MessageSquare, label: 'AI Advisor', path: '/advisor' },
                    ].map(({ icon: Icon, label, path }) => (
                      <button
                        key={path}
                        onMouseDown={() => { navigate(path); setSearchFocused(false); }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3 text-text-muted"
                      >
                        <Icon className="w-4 h-4 opacity-60" />
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Header right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/alerts')}
              className="relative p-2 hover:bg-surface-elevated rounded-xl text-text-dim hover:text-text-primary transition-all group"
            >
              <Bell className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-background animate-pulse" />
            </button>

            <div className="h-8 w-px bg-border" />

            <div className="flex items-center gap-2.5 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-text-primary leading-tight">{user.name}</p>
                <p className="text-[10px] text-text-dim mt-0.5">Premium Member</p>
              </div>
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-border" />
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-tertiary border-2 border-background" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-[1400px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ── Mobile bottom nav ────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex items-center justify-around px-2 z-20 shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all relative"
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    'w-5 h-5 transition-all',
                    isActive ? 'text-primary' : 'text-text-muted'
                  )} />
                  <span className={cn('text-[9px] font-medium', isActive ? 'text-primary' : 'text-text-dim')}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNav"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Mobile menu overlay ──────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-72 bg-surface z-40 md:hidden flex flex-col border-r border-border shadow-xl"
            >
              <div className="p-5 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="InvestIQ"
                    className="w-10 h-10 object-contain relative z-10"
                  />
                  <span className="font-bold text-lg text-text-primary tracking-tight">Invest<span className="text-primary">IQ</span></span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-surface-elevated rounded-lg">
                  <X className="w-4 h-4 text-text-dim" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-text-muted hover:bg-surface-elevated hover:text-text-primary border border-transparent'
                    )}
                  >
                    <item.icon className="w-4.5 h-4.5 shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-border space-y-1">
                <NavLink
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-elevated'
                  )}
                >
                  <Settings className="w-4.5 h-4.5" />
                  Settings
                </NavLink>
                <button
                  onClick={() => { setMobileOpen(false); setShowLogoutConfirm(true); }}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-all"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Are you sure you want to log out of your session? You will need to re-authenticate to access your account."
        confirmText="Log Out"
        variant="danger"
      />
    </div>
  );
};
