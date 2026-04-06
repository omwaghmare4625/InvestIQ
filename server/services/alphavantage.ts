export interface AlphaVantageQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface AlphaVantageTimeSeries {
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

const BASE_URL = 'https://www.alphavantage.co/query';

class AlphaVantageClient {
  private requestsToday = 0;
  private lastResetTime = new Date();
  private instanceId = Math.random().toString(36).substring(7);

  constructor() {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    console.log(`🔑 Alpha Vantage API Key: ${apiKey ? `✅ (${apiKey.substring(0, 4)}...)` : '❌ (missing)'} [Instance: ${this.instanceId}]`);
  }

  private getApiKey(): string {
    const key = process.env.ALPHA_VANTAGE_API_KEY || '';
    if (!key) {
      console.warn('⚠️ ALPHA_VANTAGE_API_KEY not set in environment');
    }
    return key;
  }

  async getGlobalQuote(symbol: string): Promise<AlphaVantageQuote | null> {
    try {
      this.checkDailyLimit();

      const params = new URLSearchParams({
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: this.getApiKey(),
      });

      console.log(`📡 Fetching quote for ${symbol} from Alpha Vantage...`);
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      const data = (await response.json()) as any;

      // Debug logging
      console.log(`Response for ${symbol}:`, JSON.stringify(data).substring(0, 200));

      if (data.Note) {
        console.warn('⚠️ Alpha Vantage rate limit reached:', data.Note);
        return null;
      }

      if (!data['Global Quote']) {
        console.warn(`⚠️ No Global Quote in response for ${symbol}`);
        return null;
      }

      const quote = data['Global Quote'];
      const quoteKeys = Object.keys(quote);

      if (quoteKeys.length === 0) {
        console.warn(`⚠️ Global Quote is empty for ${symbol}`);
        return null;
      }

      this.requestsToday++;
      console.log(`✅ Quote fetched for ${symbol} (requests today: ${this.requestsToday} - instance ID: ${(this as any).instanceId})`);

      return {
        symbol: symbol.toUpperCase(),
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        lastUpdated: quote['07. latest trading day'] || new Date().toISOString(),
      };
    } catch (error) {
      console.error(`❌ Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  async getIntraday(
    symbol: string,
    interval: string = '5min'
  ): Promise<AlphaVantageTimeSeries | null> {
    try {
      this.checkDailyLimit();

      const params = new URLSearchParams({
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol.toUpperCase(),
        interval,
        apikey: this.getApiKey(),
      });

      console.log(`📡 Fetching intraday (${interval}) for ${symbol}...`);
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      const data = (await response.json()) as any;

      if (data.Note) {
        console.warn('⚠️ Alpha Vantage rate limit reached:', data.Note);
        return null;
      }

      const timeSeriesKey = `Time Series (${interval})`;
      const timeSeries = data[timeSeriesKey];

      if (!timeSeries) {
        console.warn(`⚠️ No intraday data for ${symbol}`);
        return null;
      }

      this.requestsToday++;
      console.log(
        `✅ Intraday fetched for ${symbol} (requests today: ${this.requestsToday})`
      );

      const series = Object.entries(timeSeries)
        .slice(0, 100)
        .map(([timestamp, values]: [string, any]) => ({
          timestamp,
          open: parseFloat(values['1. open']) || 0,
          high: parseFloat(values['2. high']) || 0,
          low: parseFloat(values['3. low']) || 0,
          close: parseFloat(values['4. close']) || 0,
          volume: parseInt(values['5. volume']) || 0,
        }));

      return {
        symbol: symbol.toUpperCase(),
        timeSeries: series.reverse(),
        interval,
      };
    } catch (error) {
      console.error(`❌ Error fetching intraday for ${symbol}:`, error);
      return null;
    }
  }

  async getDaily(symbol: string): Promise<AlphaVantageTimeSeries | null> {
    try {
      this.checkDailyLimit();

      const params = new URLSearchParams({
        function: 'TIME_SERIES_DAILY',
        symbol: symbol.toUpperCase(),
        apikey: this.getApiKey(),
      });

      console.log(`📡 Fetching daily data for ${symbol}...`);
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      const data = (await response.json()) as any;

      if (data.Note) {
        console.warn('⚠️ Alpha Vantage rate limit reached:', data.Note);
        return null;
      }

      const timeSeries = data['Time Series (Daily)'];

      if (!timeSeries) {
        console.warn(`⚠️ No daily data for ${symbol}`);
        return null;
      }

      this.requestsToday++;
      console.log(`✅ Daily data fetched for ${symbol} (requests today: ${this.requestsToday})`);

      const series = Object.entries(timeSeries)
        .slice(0, 100)
        .map(([timestamp, values]: [string, any]) => ({
          timestamp,
          open: parseFloat(values['1. open']) || 0,
          high: parseFloat(values['2. high']) || 0,
          low: parseFloat(values['3. low']) || 0,
          close: parseFloat(values['4. close']) || 0,
          volume: parseInt(values['5. volume']) || 0,
        }));

      return {
        symbol: symbol.toUpperCase(),
        timeSeries: series.reverse(),
      };
    } catch (error) {
      console.error(`❌ Error fetching daily for ${symbol}:`, error);
      return null;
    }
  }

  async getTrendingStocks(): Promise<AlphaVantageQuote[]> {
    try {
      this.checkDailyLimit();

      const params = new URLSearchParams({
        function: 'TOP_GAINERS_LOSERS',
        apikey: this.getApiKey(),
      });

      console.log(`📡 Fetching top trending stocks...`);
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      const data = (await response.json()) as any;

      if (data.Note) {
        console.warn('⚠️ Alpha Vantage rate limit reached:', data.Note);
        return [];
      }

      const trendingData = data['top_gainers'] || [];
      this.requestsToday++;

      console.log(`✅ Trending stocks fetched (${trendingData.length} results)`);

      return trendingData.slice(0, 10).map((stock: any) => ({
        symbol: stock.ticker || stock.symbol || '',
        price: parseFloat(stock.price) || 0,
        change: parseFloat(stock.change_amount) || 0,
        changePercent: parseFloat(stock.change_percentage?.replace('%', '')) || 0,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error(`❌ Error fetching trending stocks:`, error);
      return [];
    }
  }

  getRequestsToday(): number {
    return this.requestsToday;
  }

  getRemainingRequests(): number {
    const limit = parseInt(process.env.ALPHA_VANTAGE_DAILY_LIMIT || '25');
    return Math.max(0, limit - this.requestsToday);
  }

  private checkDailyLimit(): void {
    const now = new Date();
    const daysSinceReset = (now.getTime() - this.lastResetTime.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceReset >= 1) {
      this.requestsToday = 0;
      this.lastResetTime = now;
      console.log('🔄 Daily request counter reset');
    }

    const limit = parseInt(process.env.ALPHA_VANTAGE_DAILY_LIMIT || '25');
    if (this.requestsToday >= limit) {
      throw new Error(
        `Alpha Vantage daily limit reached (${limit} requests). Please try again tomorrow.`
      );
    }
  }
}

let clientInstance: AlphaVantageClient | null = null;

function getAlphaVantageClient(): AlphaVantageClient {
  if (!clientInstance) {
    clientInstance = new AlphaVantageClient();
  }
  return clientInstance;
}

// Export as both function and direct instance for flexibility
export { getAlphaVantageClient };

// Create a proxy that lazy-loads the client
const handler = {
  get(target: any, prop: string | symbol) {
    const client = getAlphaVantageClient();
    const value = (client as any)[prop];
    // If it's a method, bind it to ensure 'this' context is preserved
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
};

export const alphaVantageClient = new Proxy({}, handler) as AlphaVantageClient;
