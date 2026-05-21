import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Info,
  Share2,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { Card, Button } from '@/components/ui/Common';
import { StockChart } from '@/components/ui/StockChart';
import { TradeDialog } from '@/components/ui/TradeDialog';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency, convertValue } from '@/lib/utils';
import { marketsApi } from '@/services/api';
import { motion } from 'motion/react';
import { toast } from 'sonner';

// Generate chart data for a given timeframe
const generateChartData = (timeframe: string) => {
  const now = Math.floor(Date.now() / 1000);
  let count: number;
  let intervalSeconds: number;
  let basePrice = 2800;

  switch (timeframe) {
    case '1D':
      count = 78; // 5-min bars across a trading day (6.5 hours)
      intervalSeconds = 300;
      break;
    case '1W':
      count = 7;
      intervalSeconds = 86400;
      break;
    case '1M':
      count = 30;
      intervalSeconds = 86400;
      break;
    case '3M':
      count = 90;
      intervalSeconds = 86400;
      break;
    case '1Y':
      count = 252;
      intervalSeconds = 86400;
      break;
    case 'ALL':
      count = 500;
      intervalSeconds = 86400 * 2;
      break;
    default:
      count = 30;
      intervalSeconds = 86400;
  }

  const data = [];
  let price = basePrice;

  for (let i = 0; i < count; i++) {
    const volatility = timeframe === '1D' ? 10 : 50;
    const open = price + (Math.random() - 0.5) * volatility;
    const close = open + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * (volatility * 0.4);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.4);
    data.push({
      time: (now - (count - i) * intervalSeconds) as any,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000),
    });
    price = close;
  }
  return data;
};

export default function StockDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const watchlist = useStore((state) => state.watchlist);
  const toggleWatchlist = useStore((state) => state.toggleWatchlist);
  const [chartMode, setChartMode] = useState<'line' | 'candle'>('candle');
  const [timeframe, setTimeframe] = useState('1M');
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [liveChange, setLiveChange] = useState<number | null>(null);
  const [livePercent, setLivePercent] = useState<number | null>(null);
  const [stockName, setStockName] = useState('');
  const [loadingPrice, setLoadingPrice] = useState(true);

  const isWatched = watchlist.includes(symbol || '');
  const baseCurrency = useMemo(() => {
    const usStocks = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'NVDA', 'SPY'];
    return usStocks.includes(symbol || '') ? 'USD' : 'INR';
  }, [symbol]);

  // Fetch live quote from API
  useEffect(() => {
    let cancelled = false;
    async function fetchQuote() {
      try {
        const data = await marketsApi.getBySymbol(symbol || '');
        if (!cancelled && data) {
          if (data.price) setLivePrice(data.price);
          if (data.change !== undefined) setLiveChange(data.change);
          if (data.percent !== undefined) setLivePercent(data.percent);
          if (data.name) setStockName(data.name);
        }
      } catch (err) {
        console.warn('StockDetails: failed to fetch live quote');
      } finally {
        if (!cancelled) setLoadingPrice(false);
      }
    }
    fetchQuote();
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  const chartData = useMemo(() => generateChartData(timeframe), [symbol, timeframe]);

  const currentPrice = livePrice || chartData[chartData.length - 1].close;
  const prevPrice = chartData[chartData.length - 2].close;
  const change = liveChange !== null ? liveChange : currentPrice - prevPrice;
  const percentChange = livePercent !== null ? livePercent : (change / prevPrice) * 100;

  const stats = React.useMemo(() => {
    if (!user) return [];

    return [
      {
        label: 'Open',
        value: formatCurrency(
          convertValue(chartData[chartData.length - 1].open, baseCurrency, user.currency),
          user.currency
        ),
      },
      {
        label: 'Day High',
        value: formatCurrency(
          convertValue(chartData[chartData.length - 1].high, baseCurrency, user.currency),
          user.currency
        ),
      },
      {
        label: 'Day Low',
        value: formatCurrency(
          convertValue(chartData[chartData.length - 1].low, baseCurrency, user.currency),
          user.currency
        ),
      },
      {
        label: 'Previous Close',
        value: formatCurrency(convertValue(prevPrice, baseCurrency, user.currency), user.currency),
      },
      { label: 'Volume (24h)', value: '2.4M' },
      {
        label: 'VWAP',
        value: formatCurrency(
          convertValue(
            (chartData[chartData.length - 1].open + chartData[chartData.length - 1].close) / 2,
            baseCurrency,
            user.currency
          ),
          user.currency
        ),
      },
      {
        label: '52W High',
        value: formatCurrency(
          convertValue(Math.max(...chartData.map((d) => d.high)), baseCurrency, user.currency),
          user.currency
        ),
      },
      {
        label: '52W Low',
        value: formatCurrency(
          convertValue(Math.min(...chartData.map((d) => d.low)), baseCurrency, user.currency),
          user.currency
        ),
      },
    ];
  }, [chartData, baseCurrency, user, prevPrice]);

  return (
    <motion.div
      className="space-y-6 pb-20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-dim">
        <Link to="/markets" className="hover:text-primary transition-colors">
          Markets
        </Link>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <span className="text-primary">{symbol}</span>
      </nav>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center text-text-dim hover:text-text-primary hover:border-primary/40 transition-all group shadow-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <h1 className="text-3xl font-sans font-bold tracking-tight text-text-primary">
                {symbol}
              </h1>
              <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                {baseCurrency === 'USD' ? 'NASDAQ' : 'NSE'}
              </span>
            </div>
            <p className="text-xs font-bold text-text-dim/60 uppercase tracking-wide">
              {stockName || symbol}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-3 bg-surface border border-border rounded-lg text-text-dim hover:text-text-primary transition-all shadow-sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Asset URL copied.');
            }}
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            className={cn(
              'p-3 bg-surface border border-border rounded-lg transition-all shadow-sm',
              isWatched ? 'text-primary border-primary/30' : 'text-text-dim hover:text-text-primary'
            )}
            onClick={() => toggleWatchlist(symbol || '')}
          >
            <Star className={cn('w-4 h-4', isWatched && 'fill-primary')} />
          </button>
          <Button
            size="lg"
            className="px-8 shadow-md"
            onClick={() => setIsTradeOpen(true)}
          >
            Open Trade
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-baseline gap-3">
                  {loadingPrice ? (
                    <div className="flex items-center gap-2 text-text-dim/50">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Connecting...
                      </span>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-4xl font-sans font-bold text-text-primary tracking-tight leading-none">
                        {formatCurrency(
                          convertValue(currentPrice, baseCurrency, user?.currency || 'INR'),
                          user?.currency
                        )}
                      </h2>
                      <div
                        className={cn(
                          'flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold',
                          change >= 0
                            ? 'text-tertiary bg-tertiary/10'
                            : 'text-danger bg-danger/10'
                        )}
                      >
                        {change >= 0 ? '▲' : '▼'}
                        <span>
                          {convertValue(change, baseCurrency, user?.currency || 'INR').toFixed(2)} ({percentChange.toFixed(2)}%)
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-dim/50 uppercase tracking-widest mt-4">
                  <Clock className="w-3.5 h-3.5" />
                  Last Updated: {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex p-1 bg-surface-high/50 border border-border rounded-lg self-end">
                  {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={cn(
                        'px-3 py-1 rounded-md text-[10px] font-bold tracking-wider transition-all',
                        timeframe === tf
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-text-dim hover:text-text-primary'
                      )}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
                <div className="flex p-1 bg-surface-high/50 border border-border rounded-lg self-end">
                  <button
                    onClick={() => setChartMode('candle')}
                    className={cn(
                      'px-3 py-1 rounded-md text-[10px] font-bold tracking-wider flex items-center gap-2 transition-all',
                      chartMode === 'candle'
                        ? 'bg-surface text-text-primary shadow-sm'
                        : 'text-text-dim hover:text-text-primary'
                    )}
                  >
                    Candles
                  </button>
                  <button
                    onClick={() => setChartMode('line')}
                    className={cn(
                      'px-3 py-1 rounded-md text-[10px] font-bold tracking-wider flex items-center gap-2 transition-all',
                      chartMode === 'line'
                        ? 'bg-surface text-text-primary shadow-sm'
                        : 'text-text-dim hover:text-text-primary'
                    )}
                  >
                    Line
                  </button>
                </div>
              </div>
            </div>

            <StockChart data={chartData} mode={chartMode} />
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-5 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 transition-all group"
              >
                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1.5">
                  {stat.label}
                </p>
                <p className="text-base font-sans font-bold text-text-primary tracking-tight">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-text-dim mb-6 pb-3 border-b border-border">
              Market Depth
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-tertiary/70">
                  <span>Buy Orders</span>
                  <span>Quantity</span>
                </div>
                {[
                  { price: '2,856.40', qty: '450' },
                  { price: '2,856.35', qty: '1,200' },
                  { price: '2,856.30', qty: '850' },
                ].map((bid, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm font-bold text-text-primary/90"
                  >
                    <span className="font-mono tabular-nums">{bid.price}</span>
                    <span className="text-text-dim font-mono">{bid.qty}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-border" />
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-danger/70">
                  <span>Sell Orders</span>
                  <span>Quantity</span>
                </div>
                {[
                  { price: '2,856.50', qty: '320' },
                  { price: '2,856.55', qty: '940' },
                  { price: '2,856.60', qty: '1,100' },
                ].map((ask, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm font-bold text-text-primary/90"
                  >
                    <span className="font-mono tabular-nums">{ask.price}</span>
                    <span className="text-text-dim font-mono">{ask.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 bg-primary/5 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Advisor Analysis
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
                  Strength Score
                </span>
                <span className="text-xl font-sans font-bold text-tertiary">82/100</span>
              </div>
              <div className="h-2 w-full bg-surface-high rounded-full overflow-hidden">
                <div className="h-full bg-tertiary w-[82%]" />
              </div>
              <p className="text-[13px] text-text-muted leading-relaxed font-normal">
                Strategic indicators suggest high bullish probability. Market volume support is strong at current levels.
                Projected upside target: <span className="text-text-primary font-bold">{formatCurrency(convertValue(currentPrice * 1.1, baseCurrency, user?.currency || 'INR'), user?.currency)}</span>.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <TradeDialog
        symbol={symbol || ''}
        currentPrice={currentPrice}
        baseCurrency={baseCurrency}
        isOpen={isTradeOpen}
        onClose={() => setIsTradeOpen(false)}
      />
    </motion.div>
  );
}
