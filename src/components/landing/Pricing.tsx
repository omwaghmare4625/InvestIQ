import { motion } from 'motion/react';
import { Check, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Basic Access',
    price: '₹0',
    description: 'Essential tools for getting started.',
    features: [
      'Real-time Market Updates',
      'Basic Portfolio Tracking',
      'Daily Market Briefing',
      'Standard Public Markets',
    ],
    highlighted: false,
    cta: 'Start for Free',
  },
  {
    name: 'Professional',
    price: '₹49',
    period: '/mo',
    description: 'Advanced intelligence for sophisticated tracking.',
    features: [
      'Full Market Deep-Dive',
      'Predictive ML Modeling',
      'Advanced Risk Simulations',
      'Full API Access',
      'Priority Asset Updates',
    ],
    highlighted: true,
    cta: 'Get Started with Pro',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Bespoke solutions for high-net-worth teams.',
    features: [
      'Custom Data Pipelines',
      'Dedicated Account Support',
      'Consolidated Reporting',
      'White-label Integration',
    ],
    highlighted: false,
    cta: 'Contact Sales',
  },
];

export function Pricing() {
  return (
    <section id="membership" className="relative py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Membership Plans</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-text-primary mb-6"
          >
            Institutional Power, <br />
            <span className="text-text-dim">Accessible Pricing.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-text-dim font-normal max-w-2xl mx-auto"
          >
            Choose the level of intelligence that fits your strategy.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                'relative rounded-2xl p-8 bg-surface border transition-all duration-300 flex flex-col',
                tier.highlighted
                  ? 'border-primary/50 shadow-2xl scale-[1.02] z-20'
                  : 'border-border z-10'
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-2 shadow-lg">
                  <Zap className="w-3 h-3 fill-white" /> Recommended
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest mb-4">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-sans font-bold text-text-primary">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-text-dim text-sm font-bold">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="text-[14px] text-text-dim font-normal leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <Link to="/signup" className="mb-8 w-full">
                <button
                  className={cn(
                    'w-full py-4 rounded-xl text-sm font-bold transition-all',
                    tier.highlighted
                      ? 'btn-premium'
                      : 'bg-surface-high border border-border text-text-primary hover:bg-surface-bright'
                  )}
                >
                  {tier.cta}
                </button>
              </Link>

              <div className="space-y-4 flex-1">
                <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2">Features Included:</div>
                {tier.features.map((feature, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 text-[14px] text-text-muted font-normal"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
