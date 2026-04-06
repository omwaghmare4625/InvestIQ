import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, TrendingUp, TrendingDown, Clock, Info, Share2, Loader2 } from 'lucide-react';
import { Card, Button } from '@/components/ui/Common';
import { StockChart } from '@/components/ui/StockChart';
import { TradeDialog } from '@/components/ui/TradeDialog';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency, convertValue } from '@/lib/utils';
import { marketsApi } from '@/services/api';

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
  const { user, watchlist, toggleWatchlist } = useStore();
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
    return () => { cancelled = true; };
  }, [symbol]);

  // Regenerate chart data when timeframe or symbol changes
  const chartData = useMemo(() => generateChartData(timeframe), [symbol, timeframe]);

  const currentPrice = livePrice || chartData[chartData.length - 1].close;
  const prevPrice = chartData[chartData.length - 2].close;
  const change = liveChange !== null ? liveChange : (currentPrice - prevPrice);
  const percentChange = livePercent !== null ? livePercent : ((change / prevPrice) * 100);

  const stats = [
    { label: 'Open', value: formatCurrency(convertValue(chartData[chartData.length - 1].open, baseCurrency, user?.currency || 'INR'), user?.currency) },
    { label: 'High', value: formatCurrency(convertValue(chartData[chartData.length - 1].high, baseCurrency, user?.currency || 'INR'), user?.currency) },
    { label: 'Low', value: formatCurrency(convertValue(chartData[chartData.length - 1].low, baseCurrency, user?.currency || 'INR'), user?.currency) },
    { label: 'Prev Close', value: formatCurrency(convertValue(prevPrice, baseCurrency, user?.currency || 'INR'), user?.currency) },
    { label: 'Volume', value: '2.4M' },
    { label: 'Avg Price', value: formatCurrency(convertValue((chartData[chartData.length - 1].open + chartData[chartData.length - 1].close) / 2, baseCurrency, user?.currency || 'INR'), user?.currency) },
    { label: '52W High', value: formatCurrency(convertValue(Math.max(...chartData.map(d => d.high)), baseCurrency, user?.currency || 'INR'), user?.currency) },
    { label: '52W Low', value: formatCurrency(convertValue(Math.min(...chartData.map(d => d.low)), baseCurrency, user?.currency || 'INR'), user?.currency) },
  ];

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" className="p-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{symbol}</h1>
              <span className="text-xs font-bold text-text-muted bg-surface-elevated px-2 py-0.5 rounded uppercase">
                {baseCurrency === 'USD' ? 'NASDAQ' : 'NSE'}
              </span>
            </div>
            <p className="text-sm text-text-muted">{stockName || symbol}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="p-2">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className={cn("p-2", isWatched && "text-warning fill-warning")}
            onClick={() => toggleWatchlist(symbol || '')}
          >
            <Star className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsTradeOpen(true)}>Trade</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-baseline gap-2">
                  {loadingPrice ? (
                    <div className="flex items-center gap-2 text-text-muted">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-lg">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-4xl font-bold font-numbers">{formatCurrency(convertValue(currentPrice, baseCurrency, user?.currency || 'INR'), user?.currency)}</h2>
                      <div className={cn(
                        "flex items-center gap-1 font-bold",
                        change >= 0 ? "text-success" : "text-danger"
                      )}>
                        {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{change >= 0 ? '+' : ''}{convertValue(change, baseCurrency, user?.currency || 'INR').toFixed(2)} ({percentChange.toFixed(2)}%)</span>
                      </div>
                    </>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  As of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex p-1 bg-background rounded-lg border border-border self-end">
                  {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-bold transition-all",
                        timeframe === tf ? "bg-primary text-white" : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
                <div className="flex p-1 bg-background rounded-lg border border-border self-end">
                  <button
                    onClick={() => setChartMode('candle')}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-bold flex items-center gap-2 transition-all",
                      chartMode === 'candle' ? "bg-surface-elevated text-text-primary" : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    📊 Candle
                  </button>
                  <button
                    onClick={() => setChartMode('line')}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-bold flex items-center gap-2 transition-all",
                      chartMode === 'line' ? "bg-surface-elevated text-text-primary" : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    📈 Line
                  </button>
                </div>
              </div>
            </div>

            <StockChart data={chartData} mode={chartMode} />
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="p-3 bg-surface border border-border/50 rounded-xl">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                <p className="text-sm font-bold font-numbers mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Market Depth</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-success">
                  <span>Bid</span>
                  <span>Qty</span>
                </div>
                {[
                  { price: '2,856.40', qty: '450' },
                  { price: '2,856.35', qty: '1,200' },
                  { price: '2,856.30', qty: '850' },
                ].map((bid, i) => (
                  <div key={i} className="flex justify-between text-xs font-numbers">
                    <span>{bid.price}</span>
                    <span className="text-text-muted">{bid.qty}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-border/50" />
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-danger">
                  <span>Ask</span>
                  <span>Qty</span>
                </div>
                {[
                  { price: '2,856.50', qty: '320' },
                  { price: '2,856.55', qty: '940' },
                  { price: '2,856.60', qty: '1,100' },
                ].map((ask, i) => (
                  <div key={i} className="flex justify-between text-xs font-numbers">
                    <span>{ask.price}</span>
                    <span className="text-text-muted">{ask.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Analyst View
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Buy Rating</span>
                <span className="text-sm font-bold text-success">82%</span>
              </div>
              <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
                <div className="h-full bg-success w-[82%]" />
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Most analysts remain bullish on {symbol} due to strong performance. Target price: {formatCurrency(convertValue(currentPrice * 1.1, baseCurrency, user?.currency || 'INR'), user?.currency)}.
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
    </div>
  );
}
