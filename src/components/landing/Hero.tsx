import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Globe, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <span className="text-[10px] font-bold tracking-wider text-primary uppercase">
            Platform v4.2 Now Live
          </span>
        </motion.div>

        {/* Main headline */}
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] tracking-tight text-text-primary font-bold"
          >
            Intelligent Wealth <br />
            Management for Everyone.
          </motion.h1>
        </div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl font-normal text-text-dim max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Track global assets, automate your strategy, and build long-term wealth 
          with institutional-grade market intelligence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link to="/signup" className="btn-premium px-10 py-4 text-sm font-bold tracking-wide flex items-center gap-2 group shadow-lg">
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/markets" className="px-10 py-4 bg-surface border border-border rounded-lg text-sm font-bold text-text-primary hover:bg-surface-elevated transition-all shadow-sm">
            Explore Markets
          </Link>
        </motion.div>

        {/* Trusted By / Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
        >
          {[
            { icon: Globe, label: '142+ Markets' },
            { icon: Shield, label: 'Bank-Grade Security' },
            { icon: Zap, label: 'Real-time Execution' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs font-bold text-text-primary tracking-widest uppercase">
              <item.icon className="w-4 h-4 text-primary" />
              {item.label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modern Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        className="relative z-10 mt-20 mx-6 max-w-5xl w-full"
      >
        <div className="bg-surface border border-border rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="bg-surface-high/50 border-b border-border px-6 py-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
            <div className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em]">Portfolio Overview</div>
            <div className="w-12" />
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="text-xs font-bold text-text-dim uppercase tracking-wider mb-1">Portfolio Growth</div>
                  <div className="text-3xl font-bold text-text-primary">₹2,484,200.00</div>
                </div>
                <div className="text-sm font-bold text-tertiary">+12.4% this month</div>
              </div>
              <div className="h-48 flex items-end gap-2">
                {[30, 45, 35, 60, 50, 80, 70, 90, 85, 100, 95, 110].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-colors cursor-pointer" 
                       style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-xs font-bold text-text-dim uppercase tracking-wider mb-2">Asset Allocation</div>
              {[
                { label: 'Technology', val: '42%', color: 'bg-primary' },
                { label: 'Energy', val: '28%', color: 'bg-accent' },
                { label: 'Commodities', val: '18%', color: 'bg-tertiary' },
                { label: 'Cash', val: '12%', color: 'bg-text-dim' },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-text-primary">
                    <span>{item.label}</span>
                    <span>{item.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: item.val }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
