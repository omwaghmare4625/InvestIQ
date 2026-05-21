import YahooFinance from 'yahoo-finance2';

// Create a new instance as required by the latest version of the library
const yahooFinance = new YahooFinance();

export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface MarketTimeSeries {
  symbol: string;
  timeSeries: Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  interval?: string;
}

class YahooFinanceClient {
  private instanceId = Math.random().toString(36).substring(7);

  constructor() {
    console.log(`📡 Yahoo Finance Client Initialized [Instance: ${this.instanceId}]`);
  }

  async getQuote(symbol: string): Promise<MarketQuote | null> {
    try {
      console.log(`📡 Fetching quote for ${symbol} from Yahoo Finance...`);
      const result = await yahooFinance.quote(symbol);

      if (!result) {
        console.warn(`⚠️ No quote data for ${symbol}`);
        return null;
      }

      return {
        symbol: symbol.toUpperCase(),
        price: result.regularMarketPrice || 0,
        change: result.regularMarketChange || 0,
        changePercent: result.regularMarketChangePercent || 0,
        lastUpdated: result.regularMarketTime?.toISOString() || new Date().toISOString(),
      };
    } catch (error) {
      console.error(`❌ Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  async getHistory(
    symbol: string,
    period1: string | Date,
    interval: '1d' | '5d' | '1wk' | '1mo' | '3mo' = '1d'
  ): Promise<MarketTimeSeries | null> {
    try {
      console.log(`📡 Fetching history for ${symbol} from Yahoo Finance...`);
      const result = await yahooFinance.chart(symbol, {
        period1,
        interval: interval as any,
      });

      if (!result || !result.quotes) {
        console.warn(`⚠️ No historical data for ${symbol}`);
        return null;
      }

      const series = result.quotes
        .filter(q => q.date && q.close !== null)
        .map((q: any) => ({
          timestamp: q.date.toISOString(),
          open: q.open || 0,
          high: q.high || 0,
          low: q.low || 0,
          close: q.close || 0,
          volume: q.volume || 0,
        }));

      return {
        symbol: symbol.toUpperCase(),
        timeSeries: series,
        interval,
      };
    } catch (error) {
      console.error(`❌ Error fetching history for ${symbol}:`, error);
      return null;
    }
  }

  async getTrendingStocks(): Promise<MarketQuote[]> {
    try {
      console.log(`📡 Fetching trending stocks from Yahoo Finance...`);
      // Yahoo Finance doesn't have a direct "top gainers" easily in the free tier of the package
      // but we can use trendingSymbols for a start or just return empty for now
      // Actually, trendingSymbols is available
      const result = await yahooFinance.trendingSymbols('US');
      
      if (!result || !result.trending || !Array.isArray(result.trending)) {
        return [];
      }

      const quotes = await Promise.all(
        (result.trending as Array<{ symbol: string }>).slice(0, 10).map(t => this.getQuote(t.symbol))
      );

      return quotes.filter((q): q is MarketQuote => q !== null);
    } catch (error) {
      console.error(`❌ Error fetching trending stocks:`, error);
      return [];
    }
  }
}

export const yahooFinanceClient = new YahooFinanceClient();
