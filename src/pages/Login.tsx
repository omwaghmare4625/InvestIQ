import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Github, BarChart3, Shield, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const featureBullets = [
  { icon: BarChart3,  text: 'Real-time analytics across 142+ markets' },
  { icon: Shield,     text: 'Bank-grade encryption & custody' },
  { icon: TrendingUp, text: 'AI-powered portfolio optimisation' },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const item = {
  hidden:   { opacity: 0, y: 10 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function Login() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading]   = React.useState(false);
  const [focused, setFocused]   = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Check your credentials.');
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
              alt="InvestIQ" 
              className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <span className="font-sans font-bold text-xl text-text-primary tracking-tight">
              Invest<span className="text-primary">IQ</span>
            </span>
          </Link>

          <motion.div initial="hidden" animate="visible" variants={container} className="space-y-8">
            <div className="space-y-4">
              <motion.p variants={item} className="text-[10px] font-bold text-primary tracking-widest uppercase">
                Welcome back
              </motion.p>
              <motion.h1 variants={item} className="text-5xl font-sans font-bold text-text-primary leading-tight tracking-tight">
                Institutional <br />
                Market Intelligence.
              </motion.h1>
            </div>

            <motion.p variants={item} className="text-base font-normal text-text-dim leading-relaxed max-w-sm">
              Your AI-powered financial advisor and real-time market tracking engine is ready.
            </motion.p>

            <motion.div variants={item} className="space-y-4">
              {featureBullets.map((f) => (
                <div key={f.text} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 shadow-sm">
                    <f.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-text-muted">{f.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="text-[10px] text-text-dim/40 flex justify-between font-bold uppercase tracking-widest">
            <span>© 2026 INVESTIQ</span>
            <span>v4.2.0</span>
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative z-10 bg-background">
        <motion.div initial="hidden" animate="visible" variants={container} className="w-full max-w-sm">
          {/* Mobile logo */}
          <motion.div variants={item} className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="InvestIQ" 
                className="w-10 h-10 object-contain" 
              />
              <span className="font-bold text-xl text-text-primary tracking-tight">Invest<span className="text-primary">IQ</span></span>
            </Link>
          </motion.div>

          <motion.div variants={item} className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Member Login</h2>
            <p className="text-sm font-normal text-text-dim">
              New to InvestIQ?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset disabled={loading} className={cn('space-y-5 transition-opacity', loading && 'opacity-40 pointer-events-none')}>
              {/* Email */}
              <motion.div variants={item} className="space-y-1.5">
                <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200', focused === 'email' ? 'text-primary' : 'text-text-dim/40')} />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="you@example.com"
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    className="w-full bg-surface border border-border focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-dim/30 focus:outline-none transition-all"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={item} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Password</label>
                  <Link to="#" className="text-[11px] font-bold text-text-dim/50 hover:text-primary transition-colors">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200', focused === 'password' ? 'text-primary' : 'text-text-dim/40')} />
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                    className="w-full bg-surface border border-border focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-dim/30 focus:outline-none transition-all"
                  />
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div variants={item} className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </motion.div>
            </fieldset>
          </form>

          {/* Divider */}
          <motion.div variants={item} className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-[10px] font-bold text-text-dim/40 uppercase tracking-widest">or continue with</span>
            </div>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            {[
              { icon: Github, label: 'GitHub' },
              { icon: () => (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              ), label: 'Google' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => toast.info(`${label} login coming soon`)}
                className="flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-high transition-all text-xs font-bold text-text-muted"
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
