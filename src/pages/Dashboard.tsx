import React from 'react';
import { useNavigate } from 'react-router';
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Sparkles, TrendingUp, TrendingDown, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Card, MetricCard, Button } from '@/components/ui/Common';
import { useStore } from '@/store/useStore';
import { formatCurrency, cn, convertValue, getCurrencySymbol } from '@/lib/utils';
import { marketsApi } from '@/services/api';

const portfolioData: Record<string, { date: string; value: number }[]> = {
  '1D': [
    { date: '09:00', value: 123400 },
    { date: '10:00', value: 123800 },
    { date: '11:00', value: 123200 },
    { date: '12:00', value: 124100 },
    { date: '13:00', value: 124500 },
    { date: '14:00', value: 124200 },
    { date: '15:00', value: 124532 },
  ],
  '1W': [
    { date: 'Mar 25', value: 118000 },
    { date: 'Mar 26', value: 119500 },
    { date: 'Mar 27', value: 121000 },
    { date: 'Mar 28', value: 120200 },
    { date: 'Mar 29', value: 122800 },
    { date: 'Mar 30', value: 123400 },
    { date: 'Mar 31', value: 124532 },
  ],
  '1M': [
    { date: 'Week 1', value: 110000 },
    { date: 'Week 2', value: 115000 },
    { date: 'Week 3', value: 112000 },
    { date: 'Week 4', value: 124532 },
  ],
  '1Y': [
    { date: 'Jan', value: 80000 },
    { date: 'Feb', value: 85000 },
    { date: 'Mar', value: 92000 },
    { date: 'Apr', value: 98000 },
    { date: 'May', value: 105000 },
    { date: 'Jun', value: 102000 },
    { date: 'Jul', value: 108000 },
    { date: 'Aug', value: 112000 },
    { date: 'Sep', value: 115000 },
    { date: 'Oct', value: 118000 },
    { date: 'Nov', value: 121000 },
    { date: 'Dec', value: 124532 },
  ],
  'ALL': [
    { date: '2022', value: 45000 },
    { date: '2023', value: 68000 },
    { date: '2024', value: 95000 },
    { date: '2025', value: 112000 },
    { date: '2026', value: 124532 },
  ],
};

// Hardcoded fallback data (same symbols as markets.ts backend metadata)
const fallbackIndices = [
  { name: 'NIFTY 50', symbol: 'NIFTY50', value: 22453.20, change: 182.40, percent: 0.82, positive: true, baseCurrency: 'INR' as const },
  { name: 'SENSEX', symbol: 'SENSEX', value: 74210.50, change: 345.10, percent: 0.47, positive: true, baseCurrency: 'INR' as const },
  { name: 'USD/INR', symbol: 'USDINR', value: 83.12, change: -0.08, percent: -0.10, positive: false, baseCurrency: 'INR' as const },
  { name: 'GOLD', symbol: 'GOLD', value: 6245, change: 12.50, percent: 0.20, positive: true, baseCurrency: 'INR' as const },
];

const fallbackTopMovers = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2856, change: 5.2, positive: true, baseCurrency: 'INR' as const },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4125, change: 3.1, positive: true, baseCurrency: 'INR' as const },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1442, change: -2.1, positive: false, baseCurrency: 'INR' as const },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1502, change: 1.8, positive: true, baseCurrency: 'INR' as const },
];

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent: number;
  baseCurrency: 'INR' | 'USD';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, watchlist, balance, portfolio } = useStore();
  const [selectedPeriod, setSelectedPeriod] = React.useState('1W');
  const [marketStocks, setMarketStocks] = React.useState<MarketItem[]>([]);
  const [loadingMarkets, setLoadingMarkets] = React.useState(true);

  const totalPortfolioValue = portfolio.reduce((acc, item) => acc + (item.qty * convertValue(item.currentPrice, item.baseCurrency, user?.currency || 'INR')), 0);
  const todayChange = 1234.56;
  const todayChangePercent = 1.2;

  // Fetch live market data
  React.useEffect(() => {
    let cancelled = false;
    async function fetchMarkets() {
      try {
        const data = await marketsApi.getAll();
        if (!cancelled && data && data.length > 0) {
          setMarketStocks(data);
        }
      } catch (err) {
        console.warn('Dashboard: failed to fetch live market data, using fallback');
      } finally {
        if (!cancelled) setLoadingMarkets(false);
      }
    }
    fetchMarkets();
    return () => { cancelled = true; };
  }, []);

  if (!user) return null;

  // Build top movers from API data or use fallback
  const topMovers = marketStocks.length > 0
    ? marketStocks
        .sort((a, b) => Math.abs(b.percent) - Math.abs(a.percent))
        .slice(0, 4)
        .map(s => ({
          symbol: s.symbol,
          name: s.name,
          price: formatCurrency(convertValue(s.price, s.baseCurrency, user.currency), user.currency),
          change: `${s.percent >= 0 ? '+' : ''}${s.percent.toFixed(1)}%`,
          positive: s.percent >= 0,
        }))
    : fallbackTopMovers.map(s => ({
        symbol: s.symbol,
        name: s.name,
        price: formatCurrency(convertValue(s.price, s.baseCurrency, user.currency), user.currency),
        change: `${s.positive ? '+' : ''}${s.change}%`,
        positive: s.positive,
      }));

  // Index display
  const dynamicIndices = fallbackIndices.map(idx => ({
    name: idx.name,
    symbol: idx.symbol,
    value: idx.name === 'USD/INR'
      ? idx.value.toString()
      : formatCurrency(convertValue(idx.value, idx.baseCurrency, user.currency), user.currency).replace(getCurrencySymbol(user.currency), '').trim(),
    change: `${idx.positive ? '+' : ''}${idx.change}`,
    percent: `${idx.positive ? '+' : ''}${idx.percent}%`,
    positive: idx.positive,
  }));

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good morning, {user.name}</h1>
          <p className="text-text-muted mt-1">Here's what's happening with your money today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium bg-surface px-4 py-2 rounded-lg border border-border/50">
          <Clock className="w-4 h-4 text-primary" />
          <span>{dateStr}</span>
        </div>
      </header>

      {/* Portfolio Summary & AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b border-border/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted uppercase tracking-wider">Total Portfolio Value</p>
              <h2 className="text-4xl font-bold mt-1 font-numbers">{formatCurrency(totalPortfolioValue, user.currency)}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-0.5 text-success font-semibold">
                  <ArrowUpRight className="w-4 h-4" />
                  +{formatCurrency(todayChange, user.currency)} ({todayChangePercent}%)
                </span>
                <span className="text-text-muted text-sm">today</span>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              {['1D', '1W', '1M', '1Y', 'ALL'].map((p) => (
                <button 
                  key={p} 
                  onClick={() => setSelectedPeriod(p)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                    selectedPeriod === p ? "bg-primary text-white" : "hover:bg-surface-elevated text-text-muted"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData[selectedPeriod]}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A3657" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={['dataMin - 5000', 'dataMax + 5000']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131B2E', border: '1px solid #2A3657', borderRadius: '8px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                  formatter={(value: number) => [formatCurrency(value, user.currency), 'Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-accent/5 border-accent/20 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-accent">AI Insight</h3>
          </div>
          <p className="text-text-primary leading-relaxed">
            "Based on your current portfolio allocation, you are slightly overweight in the Tech sector (42%). Consider diversifying into defensive stocks or ETFs to hedge against potential volatility in the coming quarter."
          </p>
          <div className="mt-auto pt-6">
            <Button variant="secondary" className="w-full justify-between group" onClick={() => navigate('/advisor')}>
              Ask AI Advisor
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dynamicIndices.map((idx) => (
          <Card 
            key={idx.name} 
            className="p-4 hover:bg-surface-elevated cursor-pointer"
            onClick={() => navigate('/markets')}
          >
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{idx.name}</p>
            <p className="text-lg font-bold mt-1 font-numbers">{idx.value}</p>
            <p className={cn(
              "text-xs font-bold mt-1",
              idx.positive ? "text-success" : "text-danger"
            )}>
              {idx.change} ({idx.percent})
            </p>
          </Card>
        ))}
      </div>

      {/* Top Movers & Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0">
          <div className="p-6 border-b border-border/30 flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Top Movers
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/markets')}>View All</Button>
          </div>
          <div className="divide-y divide-border/30">
            {loadingMarkets ? (
              <div className="p-8 flex items-center justify-center text-text-muted">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading market data...
              </div>
            ) : (
              topMovers.map((mover) => (
                <div 
                  key={mover.symbol} 
                  className="p-4 flex items-center justify-between hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/stock/${mover.symbol}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center font-bold text-xs">
                      {mover.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{mover.symbol}</p>
                      <p className="text-xs text-text-muted">{mover.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm font-numbers">{mover.price}</p>
                    <p className={cn(
                      "text-xs font-bold",
                      mover.positive ? "text-success" : "text-danger"
                    )}>
                      {mover.change}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-0">
          <div className="p-6 border-b border-border/30 flex items-center justify-between">
            <h3 className="font-bold text-lg">Watchlist</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/markets')}>Edit</Button>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center h-[280px]">
             <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-text-muted" />
            </div>
            <h4 className="font-bold mb-2">Track your favorites</h4>
            <p className="text-sm text-text-muted max-w-[240px] mb-6">
              Add stocks to your watchlist to keep a close eye on their performance.
            </p>
            <Button variant="secondary" size="sm" onClick={() => navigate('/markets')}>Browse Markets</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
