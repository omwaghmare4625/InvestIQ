import React from 'react';
import { Search, Filter, Star, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, Button } from '@/components/ui/Common';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency, formatCompactCurrency, formatCompactNumber, convertValue } from '@/lib/utils';
import { marketsApi } from '@/services/api';

// Hardcoded fallback data (same as before)
const fallbackMarketData = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2856.45, change: 145.20, percent: 5.2, volume: 2400000, marketCap: 19200000000000, category: 'Indian Stocks', baseCurrency: 'INR' as const },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4125.10, change: 123.45, percent: 3.1, volume: 1100000, marketCap: 15100000000000, category: 'Indian Stocks', baseCurrency: 'INR' as const },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1442.30, change: -32.15, percent: -2.1, volume: 8500000, marketCap: 10900000000000, category: 'Indian Stocks', baseCurrency: 'INR' as const },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1502.15, change: 28.40, percent: 1.8, volume: 4200000, marketCap: 6200000000000, category: 'Indian Stocks', baseCurrency: 'INR' as const },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1085.60, change: 12.30, percent: 1.1, volume: 5600000, marketCap: 7600000000000, category: 'Indian Stocks', baseCurrency: 'INR' as const },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 182.63, change: 1.45, percent: 0.8, volume: 52400000, marketCap: 2800000000000, category: 'US Stocks', baseCurrency: 'USD' as const },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.50, change: 4.20, percent: 1.0, volume: 22100000, marketCap: 3100000000000, category: 'US Stocks', baseCurrency: 'USD' as const },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 175.22, change: -12.45, percent: -6.6, volume: 108500000, marketCap: 550000000000, category: 'US Stocks', baseCurrency: 'USD' as const },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 152.15, change: 2.40, percent: 1.6, volume: 24200000, marketCap: 1900000000000, category: 'US Stocks', baseCurrency: 'USD' as const },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 895.60, change: 12.30, percent: 1.4, volume: 45600000, marketCap: 2200000000000, category: 'US Stocks', baseCurrency: 'USD' as const },
  { symbol: 'NIFTYBEES', name: 'Nippon India Nifty ETF', price: 245.20, change: 2.10, percent: 0.9, volume: 1800000, marketCap: 5900000000, category: 'ETFs', baseCurrency: 'INR' as const },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', price: 512.40, change: 3.20, percent: 0.6, volume: 65100000, marketCap: 500000000000, category: 'ETFs', baseCurrency: 'USD' as const },
];

const categories = ['All', 'Indian Stocks', 'US Stocks', 'ETFs', 'Mutual Funds', 'Crypto', 'Indices'];

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

export default function Markets() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [activeCategory, setActiveCategory] = React.useState('All');
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
          const updatedData = fallbackMarketData.map(stock => {
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
            if (!updatedData.find(s => s.symbol === apiStock.symbol)) {
              const meta = stockMetadata[apiStock.symbol] || { category: apiStock.category || 'Other', baseCurrency: apiStock.baseCurrency || 'USD' };
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
    return () => { cancelled = true; };
  }, []);

  const filteredData = marketData.filter((item) => {
    const matchesSearch = item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
        <p className="text-text-muted mt-1">Real-time data and insights across global markets.</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all",
              activeCategory === cat 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-surface border border-border/50 text-text-muted hover:text-text-primary hover:border-border"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border/30 bg-surface/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by symbol or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="primary" size="sm">
              + Watchlist
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-text-muted">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Fetching live prices...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 text-text-muted uppercase text-[10px] font-bold tracking-widest">
                  <th className="py-4 px-6">Symbol</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Change</th>
                  <th className="py-4 px-6">% Change</th>
                  <th className="py-4 px-6 hidden md:table-cell">Market Cap</th>
                  <th className="py-4 px-6 hidden lg:table-cell">Volume</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-text-muted">
                      No results found for "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr 
                      key={item.symbol} 
                      onClick={() => navigate(`/stock/${item.symbol}`)}
                      className="hover:bg-surface-elevated/30 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-surface-elevated rounded flex items-center justify-center text-[10px] font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {item.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{item.symbol}</p>
                            <p className="text-xs text-text-muted">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-numbers font-medium">
                        {formatCurrency(convertValue(item.price, item.baseCurrency, user?.currency || 'INR'), user?.currency)}
                      </td>
                      <td className={cn(
                        "py-4 px-6 font-numbers font-bold",
                        item.change >= 0 ? "text-success" : "text-danger"
                      )}>
                        {item.change >= 0 ? '+' : ''}{convertValue(item.change, item.baseCurrency, user?.currency || 'INR').toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold",
                          item.percent >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                        )}>
                          {item.percent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(item.percent).toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-4 px-6 text-text-muted text-sm hidden md:table-cell font-numbers">
                        {item.marketCap ? formatCompactCurrency(convertValue(item.marketCap, item.baseCurrency, user?.currency || 'INR'), user?.currency) : '—'}
                      </td>
                      <td className="py-4 px-6 text-text-muted text-sm hidden lg:table-cell font-numbers">
                        {item.volume ? formatCompactNumber(item.volume) : '—'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          className="p-2 hover:bg-surface-elevated rounded-full text-text-muted hover:text-warning transition-colors"
                          onClick={(e) => { e.stopPropagation(); }}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border/30 flex items-center justify-between">
          <p className="text-xs text-text-muted">Showing {filteredData.length} of {marketData.length} stocks</p>
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="sm" className="p-2">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <button className="w-8 h-8 rounded-lg text-xs font-bold bg-primary text-white">1</button>
            <Button variant="secondary" size="sm" className="p-2">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
