import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  ArrowUpRight, ArrowDownRight, Sparkles, TrendingUp, Clock,
  ChevronRight, Activity, ShieldCheck, Globe, Zap,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency, cn, convertValue } from '@/lib/utils';
import { marketsApi } from '@/services/api';

const portfolioData = [
  { date: '09:00', value: 123400 },
  { date: '10:00', value: 123800 },
  { date: '11:00', value: 123200 },
  { date: '12:00', value: 124100 },
  { date: '13:00', value: 124500 },
  { date: '14:00', value: 124200 },
  { date: '15:00', value: 124532 },
];

const fallbackMovers = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2856, change: 5.2, percent: 5.2, positive: true, baseCurrency: 'INR' as const },
  { symbol: 'TCS',      name: 'Tata Consultancy',  price: 4125, change: 3.1, percent: 3.1, positive: true, baseCurrency: 'INR' as const },
  { symbol: 'HDFCBANK', name: 'HDFC Bank',          price: 1442, change: -2.1, percent: -2.1, positive: false, baseCurrency: 'INR' as const },
  { symbol: 'INFY',     name: 'Infosys',             price: 1502, change: 1.8, percent: 1.8, positive: true, baseCurrency: 'INR' as const },
];

interface MarketItem {
  symbol: string; name: string; price: number; change: number; percent: number; baseCurrency: 'INR'|'USD';
}

const bento = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const card  = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

export default function Dashboard() {
  const navigate = useNavigate();
  const user      = useStore((s) => s.user);
  const portfolio = useStore((s) => s.portfolio);
  const [marketStocks, setMarketStocks] = React.useState<MarketItem[]>([]);

  const totalValue = React.useMemo(() => {
    if (!user) return 0;
    return portfolio.reduce((acc, item) =>
      acc + item.qty * convertValue(item.currentPrice, item.baseCurrency, user.currency), 0);
  }, [portfolio, user]);

  const chartData = React.useMemo(() => {
    if (totalValue === 0) return portfolioData.map((d) => ({ ...d, value: 0 }));
    const ratio = totalValue / portfolioData[portfolioData.length - 1].value;
    return portfolioData.map((d) => ({ ...d, value: +(d.value * ratio).toFixed(0) }));
  }, [totalValue]);

  React.useEffect(() => {
    marketsApi.getAll().then((data) => { if (data?.length) setMarketStocks(data); }).catch(() => {});
  }, []);

  if (!user) return null;

  const movers = marketStocks.length
    ? [...marketStocks].sort((a,b) => Math.abs(b.percent) - Math.abs(a.percent)).slice(0,4)
    : fallbackMovers;

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <motion.div variants={bento} initial="hidden" animate="show" className="space-y-6">
      {/* Page header */}
      <motion.div variants={card} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Live Statistics</span>
          </div>
          <h1 className="text-2xl font-sans font-bold text-text-primary tracking-tight">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-xs font-bold text-text-dim shadow-sm">
          <Clock className="w-3.5 h-3.5 text-primary" />
          {dateStr.toUpperCase()}
        </div>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[minmax(160px,auto)]">

        {/* ── Main portfolio chart (8 col, 2 rows) ── */}
        <motion.div variants={card} className="md:col-span-8 md:row-span-2 bg-surface border border-border rounded-xl flex flex-col overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
          <div className="p-7 border-b border-border">
            <p className="text-[10px] font-bold text-text-dim tracking-widest mb-1 uppercase">Portfolio Valuation</p>
            <h2 className="text-3xl font-sans font-bold text-text-primary tracking-tight">
              {formatCurrency(totalValue, user.currency)}
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-tertiary/10 text-[11px] font-bold text-tertiary">
                <ArrowUpRight className="w-3 h-3" /> +1.24% TODAY
              </span>
              <span className="text-[11px] font-bold text-text-dim/60">PEAK: {formatCurrency(totalValue * 1.03, user.currency)}</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[260px] px-2 pb-2 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cgv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface-high)', border:'1px solid var(--border)', borderRadius:'8px', padding:'10px' }}
                  itemStyle={{ color:'var(--text-primary)', fontSize:'12px', fontWeight:'700' }}
                  labelStyle={{ color: 'var(--text-dim)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}
                  formatter={(v: number) => [formatCurrency(v, user.currency), 'VALUE']}
                />
                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2.5} fill="url(#cgv)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── AI Advisor insight (4 col, 2 rows) ── */}
        <motion.div variants={card} className="md:col-span-4 md:row-span-2 bg-surface border border-border rounded-xl p-7 flex flex-col justify-between shadow-sm group">
          <div>
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight mb-2">Strategy Analysis</h3>
            <p className="text-[13px] text-text-muted leading-relaxed font-normal">
              Portfolio detected with 42% exposure to high-volatility sectors. Diversification into defensive assets is recommended to improve the Sharpe Ratio.
            </p>

            {/* Allocation bars */}
            <div className="mt-8 space-y-4">
              {[
                { label: 'TECHNOLOGY',  pct: 42, color: 'bg-primary' },
                { label: 'FINANCIALS',  pct: 28, color: 'bg-indigo-400' },
                { label: 'COMMODITIES', pct: 18, color: 'bg-tertiary' },
                { label: 'LIQUIDITY',   pct: 12, color: 'bg-slate-400' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-[9px] font-bold text-text-dim mb-1.5 tracking-wider">
                    <span>{s.label}</span><span>{s.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-surface-high overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full', s.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/advisor')}
            className="w-full mt-8 py-3 px-4 bg-surface-high border border-border rounded-lg flex items-center justify-between transition-all hover:bg-surface-bright group/btn"
          >
            <span className="text-xs font-bold text-text-primary">RUN FULL ADVISORY</span>
            <ChevronRight className="w-4 h-4 text-text-dim group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* ── Top Movers (6 col) ── */}
        <motion.div variants={card} className="md:col-span-6 bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-7 py-4 border-b border-border flex items-center gap-2.5 bg-surface-high/30">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs text-text-primary tracking-tight">MARKET MOVERS</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            {movers.map((m) => {
              const pct = m.percent ?? m.change;
              return (
                <button
                  key={m.symbol}
                  onClick={() => navigate(`/stock/${m.symbol}`)}
                  className="p-4 rounded-xl border border-border bg-surface-low/50 hover:bg-surface-high transition-all text-left group/m shadow-sm"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-sm text-text-primary">{m.symbol}</span>
                    <span className={cn('text-[10px] font-bold flex items-center gap-0.5', m.positive ? 'text-tertiary' : 'text-danger')}>
                      {m.positive ? '▲' : '▼'}
                      {Math.abs(pct).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-text-dim truncate mb-2 font-medium">{m.name}</div>
                  <div className="text-sm font-bold text-text-primary">
                    {formatCurrency(convertValue(m.price, m.baseCurrency, user.currency), user.currency)}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Markets stat (3 col) ── */}
        <motion.div variants={card} className="md:col-span-3 bg-surface border border-border rounded-xl p-7 flex flex-col justify-center items-center text-center shadow-sm hover:border-primary/20 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-text-primary tracking-tighter mb-1">142+</div>
          <p className="text-[10px] font-bold text-text-dim tracking-widest uppercase">Markets Monitored</p>
        </motion.div>

        {/* ── Security stat (3 col) ── */}
        <motion.div variants={card} className="md:col-span-3 bg-surface border border-border rounded-xl p-7 flex flex-col justify-center items-center text-center shadow-sm hover:border-tertiary/20 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-tertiary" />
          </div>
          <div className="text-3xl font-bold text-text-primary tracking-tighter mb-1">99.9%</div>
          <p className="text-[10px] font-bold text-text-dim tracking-widest uppercase">System Integrity</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
