import { create } from 'zustand';
import { authApi, portfolioApi, goalsApi, watchlistApi, alertsApi, setToken, clearToken } from '@/services/api';

export interface User {
  name: string;
  email: string;
  avatar: string;
  currency: 'INR' | 'USD';
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  monthlyContribution: number;
  icon: string;
  baseCurrency: 'INR' | 'USD';
}

export interface Holding {
  symbol: string;
  name: string;
  qty: number;
  avgCost: number;
  currentPrice: number;
  baseCurrency: 'INR' | 'USD';
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  qty: number;
  price: number;
  total: number;
  timestamp: Date;
  baseCurrency: 'INR' | 'USD';
}

export interface AlertItem {
  id: string;
  name: string;
  symbol: string;
  alertType: 'price_above' | 'price_below' | 'percent_change';
  targetValue: number;
  isActive: boolean;
  createdAt: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  goals: Goal[];
  portfolio: Holding[];
  balance: number;
  transactions: Transaction[];
  watchlist: string[];
  alerts: AlertItem[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, currency: 'INR' | 'USD') => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  toggleWatchlist: (symbol: string) => void;
  executeTrade: (trade: Omit<Transaction, 'id' | 'timestamp' | 'baseCurrency'>) => void;
  addFunds: (amount: number) => void;
  updateHoldingQty: (symbol: string, qty: number) => void;
  addAlert: (alert: Omit<AlertItem, 'id' | 'createdAt'>) => Promise<void>;
  removeAlert: (id: string) => void;
  hydrateFromServer: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  goals: [],
  portfolio: [],
  balance: 0,
  transactions: [],
  watchlist: [],
  alerts: [],

  login: async (email: string, password: string) => {
    const { token, user } = await authApi.login({ email, password });
    setToken(token);
    set({
      user: { ...user },
      isAuthenticated: true,
    });
    // Hydrate the rest of the state from the server
    await get().hydrateFromServer();
  },

  signup: async (email: string, name: string, password: string, currency: 'INR' | 'USD') => {
    const { token, user } = await authApi.signup({ name, email, password, currency });
    setToken(token);
    set({
      user: { ...user },
      isAuthenticated: true,
    });
    await get().hydrateFromServer();
  },

  hydrateFromServer: async () => {
    try {
      const [portfolioData, goalsData, watchlistData, alertsData] = await Promise.all([
        portfolioApi.get(),
        goalsApi.get(),
        watchlistApi.get(),
        alertsApi.get(),
      ]);

      set({
        portfolio: portfolioData.holdings || [],
        balance: portfolioData.balance || 0,
        transactions: (portfolioData.transactions || []).map((tx: any) => ({
          ...tx,
          timestamp: new Date(tx.timestamp),
        })),
        goals: goalsData || [],
        watchlist: watchlistData || [],
        alerts: alertsData || [],
      });
    } catch (error) {
      console.error('Failed to hydrate state from server:', error);
    }
  },

  logout: () => {
    clearToken();
    set({
      user: null,
      isAuthenticated: false,
      goals: [],
      portfolio: [],
      balance: 0,
      transactions: [],
      watchlist: [],
      alerts: [],
    });
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;

      let newBalance = state.balance;
      if (updates.currency && updates.currency !== state.user.currency) {
        const EXCHANGE_RATE = 83.12;
        if (updates.currency === 'USD') {
          newBalance = state.balance / EXCHANGE_RATE;
        } else {
          newBalance = state.balance * EXCHANGE_RATE;
        }
      }

      // Fire-and-forget server update
      authApi.updateProfile(updates as any).catch(console.error);

      return {
        user: { ...state.user, ...updates },
        balance: newBalance,
      };
    });
  },

  addGoal: (goal) => {
    set((state) => ({ goals: [...state.goals, goal] }));
    // Fire-and-forget server sync
    goalsApi.create({
      title: goal.title,
      target: goal.target,
      icon: goal.icon,
      baseCurrency: goal.baseCurrency,
    }).catch(console.error);
  },

  updateGoal: (goal) => {
    set((state) => ({
      goals: state.goals.map(g => g.id === goal.id ? goal : g),
    }));
    // Fire-and-forget server sync
    goalsApi.update(goal.id, {
      title: goal.title,
      target: goal.target,
      icon: goal.icon,
      current: goal.current,
      monthlyContribution: goal.monthlyContribution,
    }).catch(console.error);
  },

  toggleWatchlist: (symbol) => {
    set((state) => ({
      watchlist: state.watchlist.includes(symbol)
        ? state.watchlist.filter((s) => s !== symbol)
        : [...state.watchlist, symbol],
    }));
    // Fire-and-forget server sync
    watchlistApi.toggle(symbol).catch(console.error);
  },

  addFunds: (amount) => {
    set((state) => ({ balance: state.balance + amount }));
    // Fire-and-forget server sync
    portfolioApi.addFunds(amount).catch(console.error);
  },

  updateHoldingQty: (symbol: string, qty: number) => {
    set((state) => {
      if (qty <= 0) {
        return { portfolio: state.portfolio.filter(h => h.symbol !== symbol) };
      }
      return {
        portfolio: state.portfolio.map(h =>
          h.symbol === symbol ? { ...h, qty } : h
        ),
      };
    });
    // Fire-and-forget server sync
    portfolioApi.updateHolding({ symbol, qty }).catch(console.error);
  },

  addAlert: async (alertData) => {
    try {
      const created = await alertsApi.create({
        name: alertData.name,
        symbol: alertData.symbol,
        alertType: alertData.alertType,
        targetValue: alertData.targetValue,
      });
      set((state) => ({ alerts: [created, ...state.alerts] }));
    } catch (error) {
      console.error('Failed to create alert:', error);
      throw error;
    }
  },

  removeAlert: (id: string) => {
    set((state) => ({ alerts: state.alerts.filter(a => a.id !== id) }));
    // Fire-and-forget server sync
    alertsApi.delete(id).catch(console.error);
  },

  executeTrade: (trade: Omit<Transaction, 'id' | 'timestamp' | 'baseCurrency'>) => {
    // Optimistic local update
    set((state) => {
      const baseCurrency = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'NVDA', 'SPY'].includes(trade.symbol) ? 'USD' : 'INR';
      const newTransaction: Transaction = {
        ...trade,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        baseCurrency,
      };

      let newBalance = state.balance;
      let newPortfolio = [...state.portfolio];

      if (trade.type === 'BUY') {
        newBalance -= trade.total;
        const existing = newPortfolio.find(h => h.symbol === trade.symbol);
        if (existing) {
          const totalQty = existing.qty + trade.qty;
          const totalCost = (existing.qty * existing.avgCost) + (trade.qty * trade.price);
          existing.avgCost = totalCost / totalQty;
          existing.qty = totalQty;
        } else {
          newPortfolio.push({
            symbol: trade.symbol,
            name: trade.symbol,
            qty: trade.qty,
            avgCost: trade.price,
            currentPrice: trade.price,
            baseCurrency,
          });
        }
      } else {
        newBalance += trade.total;
        const existing = newPortfolio.find(h => h.symbol === trade.symbol);
        if (existing) {
          existing.qty -= trade.qty;
          if (existing.qty <= 0) {
            newPortfolio = newPortfolio.filter(h => h.symbol !== trade.symbol);
          }
        }
      }

      return {
        balance: newBalance,
        portfolio: newPortfolio,
        transactions: [newTransaction, ...state.transactions],
      };
    });

    // Fire-and-forget server sync
    portfolioApi.trade({
      symbol: trade.symbol,
      type: trade.type,
      qty: trade.qty,
      price: trade.price,
      total: trade.total,
    }).catch(console.error);
  },
}));
