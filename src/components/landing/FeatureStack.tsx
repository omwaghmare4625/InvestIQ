import { motion } from 'motion/react';
import { Shield, Brain, Globe, ArrowRight } from 'lucide-react';

const pillars = [
  {
    number: '01',
    icon: Shield,
    title: 'Sovereign Security',
    subtitle: 'Institutional Grade',
    description:
      'Your assets are protected by advanced encryption and secure storage systems — the same infrastructure used by leading financial institutions.',
    badge: 'AES-256 · SOC2 · PRIVATE',
    iconColor: 'text-primary',
  },
  {
    number: '02',
    icon: Brain,
    title: 'Precision AI Engine',
    subtitle: 'Advanced Intelligence',
    description:
      'Our proprietary engine monitors over 142 global markets in real-time, identifying high-alpha opportunities and optimizing risk across your entire portfolio.',
    badge: '142+ MARKETS · REAL-TIME',
    iconColor: 'text-indigo-400',
  },
  {
    number: '03',
    icon: Globe,
    title: 'Frictionless Access',
    subtitle: 'Global Operations',
    description:
      'Execute trades and rebalance holdings across 38 countries instantly. Our network ensures institutional liquidity with zero delays or hidden fees.',
    badge: '38 COUNTRIES · INSTANT',
    iconColor: 'text-emerald-400',
  },
];

export function FeatureStack() {
  return (
    <div id="platform" className="bg-surface-lowest">
      {/* Three Pillars Section */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="max-w-2xl mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="text-[10px] font-bold tracking-wider text-primary uppercase">
                Core Capabilities
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sans text-[clamp(2rem,4vw,3rem)] leading-tight text-text-primary font-bold tracking-tight"
            >
              Professional Wealth Management, <br />
              <span className="text-text-dim">Reimagined for Accuracy.</span>
            </motion.h2>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden shadow-sm">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group bg-surface p-10 lg:p-12 flex flex-col gap-8 transition-colors duration-300 hover:bg-surface-high"
                >
                  {/* Number */}
                  <div className="text-[11px] font-mono font-bold tracking-[0.2em] text-primary">
                    {pillar.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-surface-low border border-border flex items-center justify-center shadow-sm group-hover:border-primary/50 transition-colors">
                    <Icon className={`w-5 h-5 ${pillar.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.1em] text-text-dim uppercase mb-2">
                        {pillar.subtitle}
                      </div>
                      <h3 className="font-sans text-xl text-text-primary font-bold leading-tight">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-[15px] font-normal text-text-dim leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="text-[10px] font-mono font-bold tracking-widest text-text-dim/40 border-t border-border pt-6 uppercase">
                    {pillar.badge}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Precision metric section */}
      <section id="methodology" className="relative py-24 lg:py-32 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left: big number */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                  Advisory Precision
                </span>
              </div>
              <div className="font-sans text-[clamp(5rem,10vw,8rem)] leading-none font-bold text-text-primary mb-6 tracking-tighter">
                99.9%
              </div>
              <p className="font-sans text-2xl text-text-primary font-bold mb-4 tracking-tight">
                Institutional Accuracy Standards
              </p>
              <p className="text-base font-normal text-text-dim leading-relaxed max-w-md mb-10">
                Tested across 15 years of market data. Our advanced AI combines machine learning, financial simulations, and real-time sentiment analysis to provide verifiable strategies.
              </p>
              <button className="group flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-all">
                Performance Methodology
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Right: live metrics grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Markets Monitored', value: '142+' },
                { label: 'Data Points / Sec', value: '3.2M' },
                { label: 'Avg Alpha Generation', value: '+18.4%' },
                { label: 'Max Drawdown (YTD)', value: '−3.1%' },
                { label: 'Sharpe Ratio', value: '2.47' },
                { label: 'Execution Latency', value: '<12ms' },
              ].map((m) => (
                <div key={m.label} className="bg-surface p-8 border border-border rounded-xl shadow-sm hover:border-primary/30 transition-all">
                  <div className="text-[10px] font-bold tracking-wider text-text-dim uppercase mb-3">
                    {m.label}
                  </div>
                  <div className="font-sans text-2xl font-bold text-text-primary tracking-tight">
                    {m.value}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
