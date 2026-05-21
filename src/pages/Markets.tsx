import React from 'react';
import { Search, Filter, Star, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, Button, Skeleton, Input } from '@/components/ui/Common';
import { useStore } from '@/store/useStore';
import {
  cn,
  formatCurrency,
  formatCompactCurrency,
  formatCompactNumber,
  convertValue,
} from '@/lib/utils';
import { marketsApi } from '@/services/api';
import { motion } from 'motion/react';
import { toast } from 'sonner';

// Hardcoded fallback data (same as before)
const fallbackMarketData = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 2856.45,
    change: 145.2,
    percent: 5.2,
    volume: 2400000,
    marketCap: 19200000000000,
    category: 'Indian Stocks',
    baseCurrency: 'INR' as const,
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 4125.1,
    change: 123.45,
    percent: 3.1,
    volume: 1100000,
    marketCap: 15100000000000,
    category: 'Indian Stocks',
    baseCurrency: 'INR' as const,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    price: 1442.3,
    change: -32.15,
    percent: -2.1,
    volume: 8500000,
    marketCap: 10900000000000,
    category: 'Indian Stocks',
    baseCurrency: 'INR' as const,
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    price: 1502.15,
    change: 28.4,
    percent: 1.8,
    volume: 4200000,
    marketCap: 6200000000000,
    category: 'Indian Stocks',
    baseCurrency: 'INR' as const,
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    price: 1085.6,
    change: 12.3,
    percent: 1.1,
    volume: 5600000,
    marketCap: 7600000000000,
    category: 'Indian Stocks',
    baseCurrency: 'INR' as const,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.63,
    change: 1.45,
    percent: 0.8,
    volume: 52400000,
    marketCap: 2800000000000,
    category: 'US Stocks',
    baseCurrency: 'USD' as const,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 415.5,
    change: 4.2,
    percent: 1.0,
    volume: 22100000,
    marketCap: 3100000000000,
    category: 'US Stocks',
    baseCurrency: 'USD' as const,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 175.22,
    change: -12.45,
    percent: -6.6,
    volume: 108500000,
    marketCap: 550000000000,
    category: 'US Stocks',
    baseCurrency: 'USD' as const,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 152.15,
    change: 2.4,
    percent: 1.6,
    volume: 24200000,
    marketCap: 1900000000000,
    category: 'US Stocks',
    baseCurrency: 'USD' as const,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 895.6,
    change: 12.3,
    percent: 1.4,
    volume: 45600000,
    marketCap: 2200000000000,
    category: 'US Stocks',
    baseCurrency: 'USD' as const,
  },
  {
    symbol: 'NIFTYBEES',
    name: 'Nippon India Nifty ETF',
    price: 245.2,
    change: 2.1,
    percent: 0.9,
    volume: 1800000,
    marketCap: 5900000000,
    category: 'ETFs',
    baseCurrency: 'INR' as const,
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    price: 512.4,
    change: 3.2,
    percent: 0.6,
    volume: 65100000,
    marketCap: 500000000000,
    category: 'ETFs',
    baseCurrency: 'USD' as const,
  },
];

// Metadata mapping for categorization (same as backend)
const stockMetadata: Record<string, { category: string; baseCurrency: 'INR' | 'USD' }> = {
  RELIANCE: { category: 'Indian Stocks', baseCurrency: 'INR' },
  TCS: { category: 'Indian Stocks', baseCurrency: 'INR' },
  HDFCBANK: { category: 'Indian Stocks', baseCurrency: 'INR' },
  INFY: { category: 'Indian Stocks', baseCurrency: 'INR' },
  ICICIBANK: { category: 'Indian Stocks', baseCurrency: 'INR' },
  AAPL: { category: 'US Stocks', baseCurrency: 'USD' },
  MSFT: { category: 'US Stocks', baseCurrency: 'USD' },
  TSLA: { category: 'US Stocks', baseCurrency: 'USD' },
  GOOGL: { category: 'US Stocks', baseCurrency: 'USD' },
  NVDA: { category: 'US Stocks', baseCurrency: 'USD' },
  NIFTYBEES: { category: 'ETFs', baseCurrency: 'INR' },
  SPY: { category: 'ETFs', baseCurrency: 'USD' },
};

const categories = [
  'All Assets',
  'Indian Stocks',
  'US Stocks',
  'ETFs',
  'Crypto',
  'Indices',
];

export default function Markets() {
  const navigate = useNavigate();
  const { user, watchlist, toggleWatchlist } = useStore();
  const [activeCategory, setActiveCategory] = React.useState('All Assets');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [marketData, setMarketData] = React.useState(fallbackMarketData);
  const [loading, setLoading] = React.useState(true);

  // Fetch live market prices on mount
  React.useEffect(() => {
    let cancelled = false;
    async function fetchMarkets() {
      try {
        const data = await marketsApi.getAll();
        if (!cancelled && data && data.length > 0) {
          // Merge API data with fallback data to preserve metadata
          const updatedData = fallbackMarketData.map((stock) => {
            const liveData = data.find((d: any) => d.symbol === stock.symbol);
            if (liveData) {
              return {
                ...stock,
                price: liveData.price || stock.price,
                change: liveData.change ?? stock.change,
                percent: liveData.percent ?? stock.percent,
              };
            }
            return stock;
          });

          // Also add any stocks from the API not in the fallback
          data.forEach((apiStock: any) => {
            if (!updatedData.find((s) => s.symbol === apiStock.symbol)) {
              const meta = stockMetadata[apiStock.symbol] || {
                category: apiStock.category || 'Other',
                baseCurrency: apiStock.baseCurrency || 'USD',
              };
              updatedData.push({
                symbol: apiStock.symbol,
                name: apiStock.name || apiStock.symbol,
                price: apiStock.price || 0,
                change: apiStock.change || 0,
                percent: apiStock.percent || 0,
                volume: 0,
                marketCap: 0,
                category: meta.category,
                baseCurrency: meta.baseCurrency,
              });
            }
          });

          setMarketData(updatedData);
        }
      } catch (err) {
        console.warn('Markets: failed to fetch live data, using fallback');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchMarkets();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredData = marketData.filter((item) => {
    const matchesSearch =
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Assets' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      className="space-y-6 pb-20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sans font-bold tracking-tight text-text-primary mb-1">
            Global Markets
          </h1>
          <p className="text-text-dim text-xs font-bold uppercase tracking-wider">Real-time Trading Data</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg shadow-sm">
            <div className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="text-[10px] font-bold tracking-wider text-text-dim uppercase">Live Feed Active</span>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all',
              activeCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface border border-border text-text-dim hover:text-text-primary hover:bg-surface-high'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden shadow-md">
        <div className="p-6 border-b border-border bg-surface-high/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim/50" />
            <input
              type="text"
              placeholder="Search symbol or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-dim/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => toast.info('Filters available in Pro version')}>
              <Filter className="w-3.5 h-3.5 mr-2" />
              Advanced Filters
            </Button>
            <Button size="sm">
              + Watchlist
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/6" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-text-dim text-[10px] font-bold uppercase tracking-widest bg-surface-high/50">
                  <th className="py-4 px-6">Asset</th>
                  <th className="py-4 px-6 text-right">Price</th>
                  <th className="py-4 px-6 text-right">Change</th>
                  <th className="py-4 px-6 text-right">% Change</th>
                  <th className="py-4 px-6 text-right hidden md:table-cell">Market Cap</th>
                  <th className="py-4 px-6 text-right hidden lg:table-cell">Volume</th>
                  <th className="py-4 px-6 text-center">Watchlist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-sm text-text-dim font-medium"
                    >
                      No assets found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.symbol}
                      onClick={() => navigate(`/stock/${item.symbol}`)}
                      className="hover:bg-surface-high/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-surface-high border border-border rounded-lg flex items-center justify-center text-[11px] font-bold text-primary group-hover:border-primary/50 transition-colors">
                            {item.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-text-primary leading-tight">
                              {item.symbol}
                            </p>
                            <p className="text-[11px] text-text-dim font-medium">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right text-text-primary font-bold text-sm tabular-nums">
                        {formatCurrency(
                          convertValue(item.price, item.baseCurrency, user?.currency || 'INR'),
                          user?.currency
                        )}
                      </td>
                      <td
                        className={cn(
                          'py-4 px-6 text-right font-bold text-sm tabular-nums',
                          item.change >= 0 ? 'text-tertiary' : 'text-danger'
                        )}
                      >
                        {item.change >= 0 ? '+' : ''}
                        {convertValue(
                          item.change,
                          item.baseCurrency,
                          user?.currency || 'INR'
                        ).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold',
                            item.percent >= 0
                              ? 'bg-tertiary/10 text-tertiary'
                              : 'bg-danger/10 text-danger'
                          )}
                        >
                          {item.percent >= 0 ? '▲' : '▼'}
                          {Math.abs(item.percent).toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right text-text-dim text-[13px] font-bold hidden md:table-cell">
                        {item.marketCap
                          ? formatCompactCurrency(
                              convertValue(
                                item.marketCap,
                                item.baseCurrency,
                                user?.currency || 'INR'
                              ),
                              user?.currency
                            )
                          : '—'}
                      </td>
                      <td className="py-4 px-6 text-right text-text-dim/60 text-[12px] font-medium hidden lg:table-cell font-mono">
                        {item.volume ? formatCompactNumber(item.volume) : '—'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          className="p-2.5 bg-surface-high border border-border rounded-lg text-text-dim hover:text-primary hover:border-primary/40 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(item.symbol);
                            toast.success(
                              watchlist.includes(item.symbol)
                                ? `${item.symbol} removed from watchlist`
                                : `${item.symbol} added to watchlist`
                            );
                          }}
                        >
                          <Star
                            className={cn(
                              'w-3.5 h-3.5',
                              watchlist.includes(item.symbol) &&
                                'fill-primary text-primary'
                            )}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border bg-surface-high/20 flex items-center justify-between">
          <p className="text-[10px] font-bold text-text-dim/50 uppercase tracking-widest">
            Showing {filteredData.length} of {marketData.length} assets
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
