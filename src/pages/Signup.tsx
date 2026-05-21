import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Github, User, Check, ChevronLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const c = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } };
const it = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } };

export default function Signup() {
  const navigate = useNavigate();
  const signup = useStore((s) => s.signup);
  const [step, setStep]         = React.useState(1);
  const [name, setName]         = React.useState('');
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [currency, setCurrency] = React.useState<'INR'|'USD'>('INR');
  const [loading, setLoading]   = React.useState(false);
  const [focused, setFocused]   = React.useState<string|null>(null);

  const strength = React.useMemo(() => {
    if (!password.length) return 0;
    let s = 0;
    if (password.length >= 6)  s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 4);
  }, [password]);

  const strengthLabel  = ['','Weak','Fair','Good','Strong'][strength];
  const strengthColors = ['','bg-red-500','bg-amber-500','bg-blue-500','bg-tertiary'];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { toast.error('Fill in all fields'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(email, name, password, currency);
      toast.success('Account created! Welcome to InvestIQ.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* ── Left branding panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden border-r border-border z-10 bg-surface-lowest">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <img 
              src="/logo.png" 
              alt="InvestIQ Logo" 
              className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <span className="font-sans font-bold text-xl text-text-primary tracking-tight">
              Invest<span className="text-primary">IQ</span>
            </span>
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Get started</p>
              <h1 className="text-5xl font-sans font-bold text-text-primary leading-tight tracking-tight">
                Empowering <br />
                The Next Generation.
              </h1>
            </div>
            <p className="text-base font-normal text-text-dim leading-relaxed max-w-sm">
              Access AI-driven portfolio management, real-time market analytics, and institutional-grade insights — all in one place.
            </p>

            {/* Step progress */}
            <div className="flex items-center gap-4 pt-4">
              {[1,2].map((s, i) => (
                <React.Fragment key={s}>
                  <div className={cn(
                    'w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500',
                    step >= s
                      ? 'bg-primary/10 border-primary/40 text-primary shadow-sm'
                      : 'bg-surface border-border text-text-dim/20'
                  )}>
                    {step > s ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-xs font-bold">{String(s).padStart(2,'0')}</span>}
                  </div>
                  {i === 0 && (
                    <div className={cn('flex-1 h-px transition-all duration-500', step >= 2 ? 'bg-primary/30' : 'bg-border')} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex gap-[3.5rem]">
              <span className={cn('text-[10px] font-bold tracking-widest uppercase', step === 1 ? 'text-primary' : 'text-text-dim/30')}>Profile</span>
              <span className={cn('text-[10px] font-bold tracking-widest uppercase', step === 2 ? 'text-primary' : 'text-text-dim/30')}>Security</span>
            </div>
          </div>

          <div className="text-[10px] text-text-dim/40 flex justify-between font-bold uppercase tracking-widest">
            <span>© 2026 INVESTIQ</span>
            <span>v4.2.0</span>
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative z-10 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="InvestIQ" 
                className="w-10 h-10 object-contain" 
              />
              <span className="font-bold text-xl text-text-primary tracking-tight">Invest<span className="text-primary">IQ</span></span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Create Account</h2>
                  <p className="text-sm font-normal text-text-dim">
                    Already a member?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
                  </p>
                </div>

                <motion.div initial="hidden" animate="visible" variants={c} className="space-y-5">
                  {/* Name */}
                  <motion.div variants={it} className="space-y-1.5">
                    <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors', focused === 'name' ? 'text-primary' : 'text-text-dim/40')} />
                      <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                        className="w-full bg-surface border border-border focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-dim/30 focus:outline-none transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={it} className="space-y-1.5">
                    <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors', focused === 'email' ? 'text-primary' : 'text-text-dim/40')} />
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                        className="w-full bg-surface border border-border focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-dim/30 focus:outline-none transition-all"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={it} className="pt-2">
                    <button
                      onClick={handleNext}
                      className="w-full py-3.5 rounded-lg bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </motion.div>

                {/* OAuth */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-background px-4 text-[10px] font-bold text-text-dim/40 uppercase tracking-widest">or</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{label:'GitHub'},{label:'Google'}].map(({label}) => (
                    <button key={label} onClick={() => toast.info(`${label} signup coming soon`)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-high transition-all text-xs font-bold text-text-muted">
                      {label === 'GitHub' ? <Github className="w-4 h-4" /> : <span className="text-sm">G</span>}
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
                <div className="mb-8">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs font-bold text-primary/70 hover:text-primary transition-colors mb-5 uppercase tracking-wider">
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Secure Account</h2>
                  <p className="text-sm font-normal text-text-dim">Configure your security and base currency.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <motion.div initial="hidden" animate="visible" variants={c} className="space-y-5">
                    {/* Password */}
                    <motion.div variants={it} className="space-y-1.5">
                      <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Security Password</label>
                      <div className="relative">
                        <Lock className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors', focused === 'password' ? 'text-primary' : 'text-text-dim/40')} />
                        <input
                          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                          className="w-full bg-surface border border-border focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-dim/30 focus:outline-none transition-all"
                        />
                      </div>
                      {password.length > 0 && (
                        <div className="space-y-2 pt-1.5">
                          <div className="flex gap-1">
                            {[1,2,3,4].map((l) => (
                              <div key={l} className={cn('h-1 flex-1 rounded-full transition-all duration-300', strength >= l ? strengthColors[strength] : 'bg-surface-high')} />
                            ))}
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-dim">Status: <span className={cn('font-bold', strengthColors[strength].replace('bg-','text-'))}>{strengthLabel}</span></p>
                        </div>
                      )}
                    </motion.div>

                    {/* Currency */}
                    <motion.div variants={it} className="space-y-1.5">
                      <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Accounting Currency</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['INR','USD'] as const).map((cur) => (
                          <button
                            key={cur} type="button" onClick={() => setCurrency(cur)}
                            className={cn(
                              'py-3 rounded-lg border text-sm font-bold transition-all',
                              currency === cur
                                ? 'bg-primary/10 border-primary/50 text-primary shadow-sm'
                                : 'bg-surface border-border text-text-dim hover:text-text-primary hover:border-text-dim/30'
                            )}
                          >
                            {cur === 'INR' ? '₹ INR' : '$ USD'}
                          </button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div variants={it} className="pt-2">
                      <button
                        type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-lg bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading
                          ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          : <><ArrowRight className="w-4 h-4" /> Create Account</>
                        }
                      </button>
                    </motion.div>

                    <motion.div variants={it}>
                      <p className="text-[10px] text-center text-text-dim/40 font-medium leading-relaxed">
                        By proceeding, you agree to our{' '}
                        <Link to="#" className="text-primary font-bold hover:underline">Terms</Link>
                        {' '}&{' '}
                        <Link to="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                      </p>
                    </motion.div>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
