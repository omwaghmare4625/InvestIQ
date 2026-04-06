import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { alphaVantageClient } from '../services/alphavantage.ts';
import { cacheService } from '../services/cacheService.ts';
import { getPortfolio, getWatchlist } from '../store.ts';

const router = Router();

// ─── Stock Metadata (for reference/display) ───────────────────────────
const stockMetadata: Record<string, { name: string; category: string; baseCurrency: 'INR' | 'USD' }> = {
  RELIANCE: { name: 'Reliance Industries', category: 'Indian Stocks', baseCurrency: 'INR' },
  TCS: { name: 'Tata Consultancy Services', category: 'Indian Stocks', baseCurrency: 'INR' },
  HDFCBANK: { name: 'HDFC Bank Ltd', category: 'Indian Stocks', baseCurrency: 'INR' },
  INFY: { name: 'Infosys Ltd', category: 'Indian Stocks', baseCurrency: 'INR' },
  ICICIBANK: { name: 'ICICI Bank Ltd', category: 'Indian Stocks', baseCurrency: 'INR' },
  AAPL: { name: 'Apple Inc.', category: 'US Stocks', baseCurrency: 'USD' },
  MSFT: { name: 'Microsoft Corp.', category: 'US Stocks', baseCurrency: 'USD' },
  TSLA: { name: 'Tesla, Inc.', category: 'US Stocks', baseCurrency: 'USD' },
  GOOGL: { name: 'Alphabet Inc.', category: 'US Stocks', baseCurrency: 'USD' },
  NVDA: { name: 'NVIDIA Corp.', category: 'US Stocks', baseCurrency: 'USD' },
  SPY: { name: 'SPDR S&P 500 ETF Trust', category: 'ETFs', baseCurrency: 'USD' },
  NIFTYBEES: { name: 'Nippon India Nifty ETF', category: 'ETFs', baseCurrency: 'INR' },
};

// ─── Helper: Get unique symbols from portfolio + watchlist ──────────────
async function getUserStocks(email: string): Promise<Set<string>> {
  const symbols = new Set<string>();

  try {
    const portfolio = await getPortfolio(email);
    portfolio.holdings.forEach((h) => symbols.add(h.symbol));
  } catch (error) {
    console.error('Error getting portfolio:', error);
  }

  try {
    const watchlist = await getWatchlist(email);
    watchlist.forEach((s) => symbols.add(s));
  } catch (error) {
    console.error('Error getting watchlist:', error);
  }

  return symbols;
}

// ─── GET /api/markets ────────────────────────────────────────────────
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const email = req.user!.email;
    const knownSymbols = Object.keys(stockMetadata);

    console.log(`📊 Fetching quotes for ${knownSymbols.length} known stocks...`);

    // Fetch quotes for all known symbols (cached first)
    const quotePromises = knownSymbols.map(async (symbol) => {
      try {
        const quote = await cacheService.getOrFetch(
          symbol,
          'quote',
          () => alphaVantageClient.getGlobalQuote(symbol),
          email
        );
        return quote ? { symbol, quote } : null;
      } catch (err) {
        console.warn(`⚠️ Failed to fetch quote for ${symbol}`);
        return null;
      }
    });

    const results = await Promise.all(quotePromises);

    const marketData = results
      .filter((r) => r !== null)
      .map((r) => {
        const metadata = stockMetadata[r!.symbol];
        return {
          symbol: r!.symbol,
          name: metadata.name,
          price: r!.quote.price || 0,
          change: r!.quote.change || 0,
          percent: r!.quote.changePercent || 0,
          lastUpdated: r!.quote.lastUpdated || new Date().toISOString(),
          isCached: r!.quote.isCached || false,
          category: metadata.category,
          baseCurrency: metadata.baseCurrency,
        };
      });

    console.log(
      `📈 Stock quotes fetched: ${marketData.length} results | Requests today: ${alphaVantageClient.getRequestsToday()} / ${process.env.ALPHA_VANTAGE_DAILY_LIMIT || '25'}`
    );

    res.json(marketData);
  } catch (error: any) {
    console.error('Markets error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch market data',
      remaining: alphaVantageClient.getRemainingRequests(),
    });
  }
});

// ─── GET /api/markets/:symbol ────────────────────────────────────────
router.get('/:symbol', authMiddleware, async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const email = req.user!.email;

    console.log(`📈 Fetching details for ${symbol}`);

    // Get quote
    const quote = await cacheService.getOrFetch(
      symbol,
      'quote',
      () => alphaVantageClient.getGlobalQuote(symbol),
      email
    );

    if (!quote) {
      return res.status(404).json({ error: `No data available for ${symbol}` });
    }

    const metadata = stockMetadata[symbol] || {
      name: symbol,
      category: 'Other',
      baseCurrency: 'USD',
    };

    // Get historical data (optional - only if user specifically requests chart)
    const chartData = await cacheService.getOrFetch(
      symbol,
      'daily',
      () => alphaVantageClient.getDaily(symbol),
      email
    );

    res.json({
      symbol,
      name: metadata.name,
      price: quote.price,
      change: quote.change,
      percent: quote.changePercent,
      lastUpdated: quote.lastUpdated,
      isCached: quote.isCached,
      category: metadata.category,
      baseCurrency: metadata.baseCurrency,
      chart: chartData?.timeSeries || [],
    });

    console.log(
      `📈 Requests today: ${alphaVantageClient.getRequestsToday()} / ${process.env.ALPHA_VANTAGE_DAILY_LIMIT || '25'}`
    );
  } catch (error: any) {
    console.error('Stock detail error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch stock details',
      remaining: alphaVantageClient.getRemainingRequests(),
    });
  }
});

// ─── GET /api/markets/:symbol/chart ──────────────────────────────────
router.get('/:symbol/chart', authMiddleware, async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const { interval } = req.query;
    const email = req.user!.email;

    const dataType = interval === 'intraday' ? 'intraday' : 'daily';

    console.log(`📊 Fetching ${dataType} chart for ${symbol}`);

    const chartData = await cacheService.getOrFetch(
      symbol,
      dataType,
      () =>
        dataType === 'intraday'
          ? alphaVantageClient.getIntraday(symbol, '5min')
          : alphaVantageClient.getDaily(symbol),
      email
    );

    if (!chartData) {
      return res.status(404).json({ error: `No chart data for ${symbol}` });
    }

    res.json(chartData);

    console.log(
      `📈 Requests today: ${alphaVantageClient.getRequestsToday()} / ${process.env.ALPHA_VANTAGE_DAILY_LIMIT || '25'}`
    );
  } catch (error: any) {
    console.error('Chart error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch chart data',
      remaining: alphaVantageClient.getRemainingRequests(),
    });
  }
});

export default router;
