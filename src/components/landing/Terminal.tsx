import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  Line,
} from 'recharts';
import { Activity, Globe, Zap, ArrowRight, Shield, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data scale
const data = Array.from({ length: 24 }).map((_, i) => {
  const open = Math.floor(Math.random() * 100) + 24800;
  const close = open + (Math.random() * 60 - 30);
  const color = close > open ? 'var(--tertiary)' : 'var(--danger)';
  return {
    name: `${i}:00`,
    avg: Number(((open + close) / 2).toFixed(2)),
    color: color,
  };
});

export function Terminal() {
  return (
    <section id="markets" className="py-24 relative overflow-hidden bg-surface-lowest">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-surface rounded-xl overflow-hidden shadow-2xl border border-border mx-auto max-w-6xl relative"
        >
          {/* Terminal Header */}
          <div className="border-b border-border p-5 flex flex-col sm:flex-row items-center justify-between bg-surface-high/50 relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2.5 text-[11px] font-bold text-text-dim uppercase tracking-wider">
                <Globe className="w-4 h-4 text-primary" />
                <span>Global Market Tracker</span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-tertiary text-[10px] font-bold tracking-wider bg-tertiary/10 px-3 py-1.5 rounded-full border border-tertiary/20">
                <Activity className="w-3 h-3" />
                <span>REAL-TIME STREAMING</span>
              </div>
              <div className="text-text-primary flex items-center gap-3">
                <span className="text-xl font-bold tracking-tight">24,852.15</span>
                <span className="text-tertiary text-xs font-bold bg-tertiary/10 px-2 py-0.5 rounded">
                  +1.24%
                </span>
              </div>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px] lg:h-[650px] relative z-10">
            {/* Sidebar */}
            <div className="hidden lg:block border-r border-border p-8 space-y-10 bg-surface-low/50">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-widest px-2">
                  Market Vectors
                </h4>
                <div className="space-y-1">
                  {['Risk Analysis', 'Liquidity Depth', 'Alpha Indicators', 'Strategy Builder'].map(
                    (item) => (
                      <button
                        key={item}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-high transition-all text-xs font-bold text-text-muted flex items-center justify-between group"
                      >
                        <span>{item}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-widest px-2">
                  ML Prediction
                </h4>
                <div className="p-5 rounded-xl bg-surface-high border border-border shadow-sm">
                  <div className="flex items-center gap-3 text-primary mb-3">
                    <Zap className="w-4 h-4 fill-primary" />
                    <span className="text-xs font-bold tracking-tight">Bullish Reversal</span>
                  </div>
                  <p className="text-[13px] text-text-dim leading-relaxed font-normal">
                    AI confidence score indicates a 94.2% probability of upward momentum.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Chart Area */}
            <div className="lg:col-span-3 p-8 sm:p-12 flex flex-col bg-surface-low min-w-0">
              <div className="h-[250px] sm:h-[400px] lg:flex-1 min-h-0 min-w-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      domain={['dataMin - 10', 'dataMax + 10']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 600 }}
                      orientation="right"
                      dx={10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface-high)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: 'var(--shadow-modal)',
                      }}
                      itemStyle={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{
                        color: 'var(--text-dim)',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    />
                    <Bar dataKey="avg" barSize={32} radius={[2, 2, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          fillOpacity={0.1}
                          stroke={entry.color}
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                    <Line
                      type="monotone"
                      dataKey="avg"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--surface)', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom Metrics */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-10 pt-12 border-t border-border">
                {[
                  { label: 'Volatility Index', value: '14.2', change: '-2.4%', inc: false },
                  { label: 'Liquidity Pool', value: '₹84.2B', change: '+12.5%', inc: true },
                  { label: 'Accuracy Rating', value: '99.9%', change: '+0.1%', inc: true },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-2 group">
                    <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-sans font-bold flex items-center justify-between text-text-primary">
                      {stat.value}
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded',
                          stat.inc ? 'text-tertiary bg-tertiary/10' : 'text-danger bg-danger/10'
                        )}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
