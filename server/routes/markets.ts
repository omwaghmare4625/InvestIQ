import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { yahooFinanceClient } from '../services/yahooFinance.ts';
import { cacheService } from '../services/cacheService.ts';
import { getPortfolio, getWatchlist } from '../store.ts';

const router = Router();

// ─── Stock Metadata (for reference/display) ───────────────────────────
// Added .NS suffix for Indian stocks to work with Yahoo Finance
const stockMetadata: Record<string, { name: string; category: string; baseCurrency: 'INR' | 'USD'; yahooSymbol: string }> = {
  RELIANCE: { name: 'Reliance Industries', category: 'Indian Stocks', baseCurrency: 'INR', yahooSymbol: 'RELIANCE.NS' },
  TCS: { name: 'Tata Consultancy Services', category: 'Indian Stocks', baseCurrency: 'INR', yahooSymbol: 'TCS.NS' },
  HDFCBANK: { name: 'HDFC Bank Ltd', category: 'Indian Stocks', baseCurrency: 'INR', yahooSymbol: 'HDFCBANK.NS' },
  INFY: { name: 'Infosys Ltd', category: 'Indian Stocks', baseCurrency: 'INR', yahooSymbol: 'INFY.NS' },
  ICICIBANK: { name: 'ICICI Bank Ltd', category: 'Indian Stocks', baseCurrency: 'INR', yahooSymbol: 'ICICIBANK.NS' },
  AAPL: { name: 'Apple Inc.', category: 'US Stocks', baseCurrency: 'USD', yahooSymbol: 'AAPL' },
  MSFT: { name: 'Microsoft Corp.', category: 'US Stocks', baseCurrency: 'USD', yahooSymbol: 'MSFT' },
  TSLA: { name: 'Tesla, Inc.', category: 'US Stocks', baseCurrency: 'USD', yahooSymbol: 'TSLA' },
  GOOGL: { name: 'Alphabet Inc.', category: 'US Stocks', baseCurrency: 'USD', yahooSymbol: 'GOOGL' },
  NVDA: { name: 'NVIDIA Corp.', category: 'US Stocks', baseCurrency: 'USD', yahooSymbol: 'NVDA' },
  SPY: { name: 'SPDR S&P 500 ETF Trust', category: 'ETFs', baseCurrency: 'USD', yahooSymbol: 'SPY' },
  NIFTYBEES: { name: 'Nippon India Nifty ETF', category: 'ETFs', baseCurrency: 'INR', yahooSymbol: 'NIFTYBEES.NS' },
};

// Helper to get Yahoo symbol from local symbol
function getYahooSymbol(symbol: string): string {
  return stockMetadata[symbol.toUpperCase()]?.yahooSymbol || symbol;
}

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

    console.log(`📊 Fetching quotes for ${knownSymbols.length} known stocks via Yahoo Finance...`);

    // Fetch quotes for all known symbols (cached first)
    const quotePromises = knownSymbols.map(async (symbol) => {
      try {
        const yahooSymbol = getYahooSymbol(symbol);
        const quote = await cacheService.getOrFetch(
          symbol,
          'quote',
          () => yahooFinanceClient.getQuote(yahooSymbol),
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

    console.log(`📈 Stock quotes fetched: ${marketData.length} results`);

    res.json(marketData);
  } catch (error: any) {
    console.error('Markets error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch market data'
    });
  }
});

// ─── GET /api/markets/:symbol ────────────────────────────────────────
router.get('/:symbol', authMiddleware, async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const email = req.user!.email;
    const yahooSymbol = getYahooSymbol(symbol);

    console.log(`📈 Fetching details for ${symbol} (${yahooSymbol})`);

    // Get quote
    const quote = await cacheService.getOrFetch(
      symbol,
      'quote',
      () => yahooFinanceClient.getQuote(yahooSymbol),
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

    // Get historical data (last 100 days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 150); // Get more than 100 to be safe

    const chartData = await cacheService.getOrFetch(
      symbol,
      'daily',
      () => yahooFinanceClient.getHistory(yahooSymbol, startDate, '1d'),
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
  } catch (error: any) {
    console.error('Stock detail error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch stock details'
    });
  }
});

// ─── GET /api/markets/:symbol/chart ──────────────────────────────────
router.get('/:symbol/chart', authMiddleware, async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const { interval } = req.query;
    const email = req.user!.email;
    const yahooSymbol = getYahooSymbol(symbol);

    const dataType = interval === 'intraday' ? 'intraday' : 'daily';
    const yahooInterval = interval === 'intraday' ? '5m' : '1d';

    console.log(`📊 Fetching ${dataType} chart for ${symbol} (${yahooSymbol})`);

    const startDate = new Date();
    if (dataType === 'intraday') {
      startDate.setDate(startDate.getDate() - 7); // Last 7 days for intraday
    } else {
      startDate.setDate(startDate.getDate() - 365); // Last year for daily
    }

    const chartData = await cacheService.getOrFetch(
      symbol,
      dataType,
      () => yahooFinanceClient.getHistory(yahooSymbol, startDate, yahooInterval as any),
      email
    );

    if (!chartData) {
      return res.status(404).json({ error: `No chart data for ${symbol}` });
    }

    res.json(chartData);
  } catch (error: any) {
    console.error('Chart error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch chart data'
    });
  }
});

export default router;
