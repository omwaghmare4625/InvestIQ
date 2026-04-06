import { MarketCache } from '../models/marketCache.ts';

class CacheService {
  async getCachedData(
    symbol: string,
    dataType: 'quote' | 'intraday' | 'daily' | 'indicator',
    email?: string
  ) {
    try {
      const cache = await MarketCache.findOne({
        symbol: symbol.toUpperCase(),
        dataType,
        ...(email && { email }),
      });

      // Check if cache exists and is not expired
      if (cache && new Date() < cache.expiresAt) {
        const minutesOld = Math.floor((Date.now() - cache.lastUpdated.getTime()) / 60000);
        console.log(
          `✅ Cache hit for ${symbol}/${dataType} (${minutesOld} min old)`
        );
        return cache.data;
      }

      if (cache) {
        console.log(`⏰ Cache expired for ${symbol}/${dataType}`);
      }
      return null;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  async setCacheData(
    symbol: string,
    dataType: 'quote' | 'intraday' | 'daily' | 'indicator',
    data: Record<string, any>,
    email?: string
  ): Promise<void> {
    try {
      const cacheHours = parseInt(process.env.ALPHA_VANTAGE_CACHE_HOURS || '4');
      const expiresAt = new Date(Date.now() + cacheHours * 60 * 60 * 1000);

      await MarketCache.findOneAndUpdate(
        {
          symbol: symbol.toUpperCase(),
          dataType,
          ...(email && { email }),
        },
        {
          symbol: symbol.toUpperCase(),
          dataType,
          email,
          data,
          lastUpdated: new Date(),
          expiresAt,
        },
        { upsert: true, new: true }
      );

      console.log(
        `💾 Cached ${symbol}/${dataType} (expires in ${cacheHours}h)`
      );
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  async getOrFetch(
    symbol: string,
    dataType: 'quote' | 'intraday' | 'daily' | 'indicator',
    fetchFunction: () => Promise<any>,
    email?: string
  ): Promise<any> {
    // Try cache first
    const cached = await this.getCachedData(symbol, dataType, email);
    if (cached) {
      return { ...cached, isCached: true };
    }

    // Cache miss - fetch fresh data
    const freshData = await fetchFunction();
    if (freshData) {
      await this.setCacheData(symbol, dataType, freshData, email);
      return { ...freshData, isCached: false };
    }

    // Both cache and fetch failed
    console.warn(`⚠️ No data available for ${symbol}/${dataType}`);
    return null;
  }

  async cleanupExpiredCache(): Promise<number> {
    try {
      const result = await MarketCache.deleteMany({ expiresAt: { $lt: new Date() } });
      const count = result.deletedCount || 0;
      if (count > 0) {
        console.log(`🧹 Cleaned up ${count} expired cache entries`);
      }
      return count;
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }
}

export const cacheService = new CacheService();
