import React from 'react';
import { User, Lock, Palette, Bell, Shield, Moon, Sun, Monitor, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { useThemeStore } from '@/store/useTheme';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { ConfirmDialog } from '@/components/ui/Common';

/* ─── Minimal primitives (no dependency on Common.tsx) ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-text-dim/60 tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full glass border border-border focus:border-primary/40 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-primary/15 focus:outline-none transition-all duration-300 focus:shadow-glow-sm disabled:opacity-40 disabled:cursor-not-allowed',
        props.className
      )}
    />
  );
}

function PrimaryBtn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'px-8 py-3 rounded-xl bg-primary text-background text-sm font-semibold transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
        props.className
      )}
    />
  );
}

function GhostBtn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'px-6 py-2.5 rounded-xl glass border border-border text-sm font-medium text-text-dim hover:text-text-primary hover:border-border transition-all duration-300',
        props.className
      )}
    />
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-11 h-6 rounded-full relative transition-all duration-400 shrink-0',
        on ? 'bg-primary shadow-glow-sm' : 'bg-surface-elevated'
      )}
    >
      <div className={cn(
        'absolute top-[4px] w-[16px] h-[16px] bg-white rounded-full transition-all duration-400 shadow-sm',
        on ? 'left-[calc(100%-20px)]' : 'left-1'
      )} />
    </button>
  );
}

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('glass-card p-8 space-y-7', className)}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, label, color = 'text-primary' }: { icon: React.ElementType; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 pb-5 border-b border-border">
      <Icon className={cn('w-4 h-4', color)} />
      <h3 className="text-sm font-semibold text-text-primary">{label}</h3>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────── */
const sections = [
  { id: 'profile',       icon: User,    label: 'Profile' },
  { id: 'security',      icon: Lock,    label: 'Security' },
  { id: 'appearance',    icon: Palette, label: 'Appearance' },
  { id: 'notifications', icon: Bell,    label: 'Notifications' },
  { id: 'privacy',       icon: Shield,  label: 'Privacy' },
];

export default function Settings() {
  const { user, updateUser, logout } = useStore();
  const navigate = useNavigate();
  const { theme, setTheme, compactMode, setCompactMode } = useThemeStore();
  const [active, setActive]     = React.useState('profile');
  const [name, setName]         = React.useState(user?.name ?? '');
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPw, setSavingPw]           = React.useState(false);
  const [curPw, setCurPw]   = React.useState('');
  const [newPw, setNewPw]   = React.useState('');
  const [confPw, setConfPw] = React.useState('');
  const [notifs, setNotifs] = React.useState({ email: true, push: true, sms: false });
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 600));
    updateUser({ name });
    toast.success('Profile updated');
    setSavingProfile(false);
  };

  const handleSavePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!curPw || !newPw || !confPw) { toast.error('Fill in all password fields'); return; }
    if (newPw.length < 6)            { toast.error('Password must be at least 6 characters'); return; }
    if (newPw !== confPw)            { toast.error('Passwords do not match'); return; }
    setSavingPw(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Password updated');
    setCurPw(''); setNewPw(''); setConfPw('');
    setSavingPw(false);
  };

  const applyTheme = (t: string) => {
    setTheme(t as 'dark' | 'light' | 'system');
    toast.success(`Theme set to ${t}`);
  };

  const handleLogout = () => {
    logout(); toast.success('Logged out'); navigate('/');
  };

  const panelVariants = {
    hidden:  { opacity: 0, x: 12 },
    visible: { opacity: 1, x: 0,  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
    exit:    { opacity: 0, x: -12, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto pb-20"
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2 tracking-tight">Settings</h1>
        <p className="text-sm text-text-dim">Manage your account, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Sidebar nav ─────────────────────────── */}
        <aside className="lg:col-span-1">
          <div className="glass-card p-3 space-y-1">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow-sm'
                      : 'text-text-dim hover:text-text-primary hover:bg-surface-elevated border border-transparent'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <s.icon className={cn('w-4 h-4 shrink-0', isActive && 'drop-shadow-[0_0_6px_rgba(0,242,255,0.7)]')} />
                    {s.label}
                  </span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Content panels ──────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {/* Profile */}
            {active === 'profile' && (
              <motion.div key="profile" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
                <SectionCard>
                  <SectionHeader icon={User} label="Profile" />

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <Field label="FULL NAME">
                      <TextInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        disabled={savingProfile}
                      />
                    </Field>
                    <Field label="EMAIL ADDRESS">
                      <TextInput
                        value={user?.email ?? ''}
                        disabled
                        placeholder="email@example.com"
                        className="opacity-30 cursor-not-allowed"
                      />
                      <p className="text-xs text-text-dim/40">Email cannot be changed after account creation.</p>
                    </Field>
                    <Field label="BASE CURRENCY">
                      <div className="grid grid-cols-2 gap-3">
                        {(['INR', 'USD'] as const).map((cur) => (
                          <button
                            key={cur}
                            type="button"
                            onClick={() => { updateUser({ currency: cur }); toast.success(`Currency set to ${cur}`); }}
                            className={cn(
                              'py-3 rounded-xl border text-sm font-semibold transition-all duration-300',
                              user?.currency === cur
                                ? 'bg-primary/15 border-primary/50 text-primary shadow-glow-sm'
                                : 'glass border-border text-text-dim hover:border-border hover:text-text-primary'
                            )}
                          >
                            {cur === 'INR' ? '₹ INR' : '$ USD'}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <PrimaryBtn type="submit" disabled={savingProfile}>
                      {savingProfile ? 'Saving…' : 'Save Changes'}
                    </PrimaryBtn>
                  </form>
                </SectionCard>
              </motion.div>
            )}

            {/* Security */}
            {active === 'security' && (
              <motion.div key="security" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
                <SectionCard>
                  <SectionHeader icon={Lock} label="Security" color="text-danger" />

                  <form onSubmit={handleSavePw} className="space-y-5">
                    <Field label="CURRENT PASSWORD">
                      <TextInput type="password" placeholder="••••••••" value={curPw} onChange={(e) => setCurPw(e.target.value)} disabled={savingPw} />
                    </Field>
                    <Field label="NEW PASSWORD">
                      <TextInput type="password" placeholder="••••••••" value={newPw} onChange={(e) => setNewPw(e.target.value)} disabled={savingPw} />
                    </Field>
                    <Field label="CONFIRM NEW PASSWORD">
                      <TextInput type="password" placeholder="••••••••" value={confPw} onChange={(e) => setConfPw(e.target.value)} disabled={savingPw} />
                    </Field>
                    <GhostBtn type="submit" disabled={savingPw}>
                      {savingPw ? 'Updating…' : 'Update Password'}
                    </GhostBtn>
                  </form>
                </SectionCard>
              </motion.div>
            )}

            {/* Appearance */}
            {active === 'appearance' && (
              <motion.div key="appearance" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
                <SectionCard>
                  <SectionHeader icon={Palette} label="Appearance" color="text-tertiary" />

                  <Field label="THEME">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'light', icon: Sun, label: 'Light' },
                        { id: 'dark',  icon: Moon, label: 'Dark' },
                        { id: 'system',icon: Monitor, label: 'System' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => applyTheme(t.id)}
                          className={cn(
                            'flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-300',
                            theme === t.id
                              ? 'border-primary bg-primary/10 shadow-glow-sm'
                              : 'glass border-border hover:border-border'
                          )}
                        >
                          <t.icon className={cn('w-5 h-5', theme === t.id ? 'text-primary' : 'text-text-dim/40')} />
                          <span className={cn('text-xs font-medium', theme === t.id ? 'text-primary' : 'text-text-dim')}>
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </Field>

                  <div className="pt-5 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">Compact Mode</p>
                      <p className="text-xs text-text-dim mt-0.5">Increase data density across the dashboard.</p>
                    </div>
                    <Toggle on={compactMode} onToggle={() => { setCompactMode(!compactMode); toast.success(compactMode ? 'Standard mode' : 'Compact mode enabled'); }} />
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* Notifications */}
            {active === 'notifications' && (
              <motion.div key="notifications" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
                <SectionCard>
                  <SectionHeader icon={Bell} label="Notifications" color="text-warning" />

                  <div className="space-y-4">
                    {[
                      { id: 'email', label: 'Email Alerts',   desc: 'Daily portfolio summaries and market updates.' },
                      { id: 'push',  label: 'Push Notifications', desc: 'Real-time price alerts on your devices.' },
                      { id: 'sms',   label: 'SMS Alerts',     desc: 'Critical security and account notifications.' },
                    ].map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center justify-between p-5 rounded-xl glass border border-border hover:border-border transition-all"
                      >
                        <div>
                          <p className="text-sm font-medium text-text-primary">{n.label}</p>
                          <p className="text-xs text-text-dim mt-0.5">{n.desc}</p>
                        </div>
                        <Toggle
                          on={notifs[n.id as keyof typeof notifs]}
                          onToggle={() => setNotifs((prev) => ({ ...prev, [n.id]: !prev[n.id as keyof typeof notifs] }))}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* Privacy */}
            {active === 'privacy' && (
              <motion.div key="privacy" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
                <SectionCard>
                  <SectionHeader icon={Shield} label="Privacy" color="text-tertiary" />

                  <div className="space-y-4">
                    {[
                      {
                        title: 'Analytics Sharing',
                        desc:  'Allow anonymized usage data to improve InvestIQ for all users.',
                        action: 'Manage Permissions',
                      },
                      {
                        title: 'Portfolio Visibility',
                        desc:  'Control who can see your portfolio in peer benchmarking.',
                        action: 'Manage Access',
                      },
                    ].map((item) => (
                      <div key={item.title} className="p-5 rounded-xl glass border border-border space-y-3">
                        <p className="text-sm font-medium text-text-primary">{item.title}</p>
                        <p className="text-xs text-text-dim leading-relaxed">{item.desc}</p>
                        <GhostBtn onClick={() => toast.info('Coming soon')}>{item.action}</GhostBtn>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Logout (always visible) ── */}
          <div className="glass-card p-8 border-danger/15">
            <h3 className="text-sm font-semibold text-danger mb-2">Danger Zone</h3>
            <p className="text-xs text-text-dim/60 leading-relaxed mb-6 max-w-sm">
              Logging out will end your current session. Your data remains saved securely.
            </p>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-medium hover:bg-danger hover:text-text-primary hover:border-danger transition-all duration-400"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Are you sure you want to log out of your session? You will need to re-authenticate to access your account."
        confirmText="Log Out"
        variant="danger"
      />
    </motion.div>
  );
}
