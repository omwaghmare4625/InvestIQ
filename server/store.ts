import { User } from './models/user.ts';
import { Portfolio } from './models/portfolio.ts';
import { Goal as GoalModel } from './models/goal.ts';
import { Transaction as TransactionModel } from './models/transaction.ts';
import { Watchlist } from './models/watchlist.ts';

// ─── Type Definitions (exported for route compatibility) ────────────

export interface StoredUser {
  email: string;
  name: string;
  passwordHash: string;
  currency: 'INR' | 'USD';
  avatar: string;
  createdAt: string;
}

export interface Holding {
  symbol: string;
  name: string;
  qty: number;
  avgCost: number;
  currentPrice: number;
  baseCurrency: 'INR' | 'USD';
}

export interface PortfolioData {
  holdings: Holding[];
  balance: number;
}

export interface GoalData {
  id: string;
  title: string;
  target: number;
  current: number;
  monthlyContribution: number;
  icon: string;
  baseCurrency: 'INR' | 'USD';
}

export interface TransactionData {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  qty: number;
  price: number;
  total: number;
  timestamp: string;
  baseCurrency: 'INR' | 'USD';
}

// ─── Default Values ──────────────────────────────────────────────────

const DEFAULT_PORTFOLIO: PortfolioData = {
  holdings: [
    { symbol: 'AAPL', name: 'Apple Inc.', qty: 10, avgCost: 150, currentPrice: 178.45, baseCurrency: 'USD' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', qty: 5, avgCost: 140, currentPrice: 152.12, baseCurrency: 'USD' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', qty: 8, avgCost: 320, currentPrice: 415.50, baseCurrency: 'USD' },
    { symbol: 'RELIANCE', name: 'Reliance Industries', qty: 50, avgCost: 2400, currentPrice: 2856.00, baseCurrency: 'INR' },
  ],
  balance: 50000,
};

const DEFAULT_GOALS: GoalData[] = [
  { id: '1', title: 'New Car', target: 50000, current: 12000, monthlyContribution: 400, icon: '🚗', baseCurrency: 'USD' },
  { id: '2', title: 'House Fund', target: 20000000, current: 4500000, monthlyContribution: 80000, icon: '🏠', baseCurrency: 'INR' },
  { id: '3', title: 'Retirement', target: 1000000, current: 400000, monthlyContribution: 2000, icon: '👴', baseCurrency: 'USD' },
];

const DEFAULT_WATCHLIST = ['AAPL', 'GOOGL', 'TSLA', 'BTC'];

// ─── Users ───────────────────────────────────────────────────────────

export async function getUsers(): Promise<Record<string, StoredUser>> {
  const users = await User.find({});
  const result: Record<string, StoredUser> = {};
  users.forEach((user) => {
    result[user.email] = {
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      currency: user.currency,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  });
  return result;
}

export async function getUser(email: string): Promise<StoredUser | undefined> {
  const user = await User.findOne({ email });
  if (!user) return undefined;
  return {
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash,
    currency: user.currency,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

export async function createUser(user: StoredUser): Promise<void> {
  await User.create(user);
}

export async function updateUser(email: string, updates: Partial<StoredUser>): Promise<StoredUser | undefined> {
  const updated = await User.findOneAndUpdate({ email }, updates, { new: true });
  if (!updated) return undefined;
  return {
    email: updated.email,
    name: updated.name,
    passwordHash: updated.passwordHash,
    currency: updated.currency,
    avatar: updated.avatar,
    createdAt: updated.createdAt,
  };
}

// ─── Portfolios ──────────────────────────────────────────────────────

export async function getPortfolio(email: string): Promise<PortfolioData> {
  let portfolio = await Portfolio.findOne({ email });
  
  if (!portfolio) {
    // Create empty portfolio for new user
    portfolio = await Portfolio.create({
      email,
      holdings: [],
      balance: 50000,
    });
  }

  return {
    holdings: portfolio.holdings,
    balance: portfolio.balance,
  };
}

export async function savePortfolio(email: string, data: PortfolioData): Promise<void> {
  await Portfolio.findOneAndUpdate(
    { email },
    {
      holdings: data.holdings,
      balance: data.balance,
    },
    { upsert: true, new: true }
  );
}

// ─── Goals ───────────────────────────────────────────────────────────

export async function getGoals(email: string): Promise<GoalData[]> {
  let goalDoc = await GoalModel.findOne({ email });
  
  if (!goalDoc) {
    // Create empty goals for new user
    goalDoc = await GoalModel.create({
      email,
      goals: [],
    });
  }

  return goalDoc.goals;
}

export async function saveGoals(email: string, goals: GoalData[]): Promise<void> {
  await GoalModel.findOneAndUpdate(
    { email },
    { goals },
    { upsert: true, new: true }
  );
}

// ─── Transactions ────────────────────────────────────────────────────

export async function getTransactions(email: string): Promise<TransactionData[]> {
  const transactions = await TransactionModel.find({ email }).sort({ timestamp: -1 });
  return transactions.map((txn) => ({
    id: txn._id?.toString() || '',
    symbol: txn.symbol,
    type: txn.type,
    qty: txn.qty,
    price: txn.price,
    total: txn.total,
    timestamp: txn.timestamp,
    baseCurrency: txn.baseCurrency,
  }));
}

export async function saveTransactions(email: string, txns: TransactionData[]): Promise<void> {
  // Note: This method is used to update existing transactions
  // In practice, new transactions are created via the trade endpoint
  // For now, we'll clear and re-insert (not efficient, but maintains API compatibility)
  await TransactionModel.deleteMany({ email });
  if (txns.length > 0) {
    const docsToInsert = txns.map((txn) => ({
      email,
      symbol: txn.symbol,
      type: txn.type,
      qty: txn.qty,
      price: txn.price,
      total: txn.total,
      timestamp: txn.timestamp,
      baseCurrency: txn.baseCurrency,
    }));
    await TransactionModel.insertMany(docsToInsert);
  }
}

// ─── Watchlists ──────────────────────────────────────────────────────

export async function getWatchlist(email: string): Promise<string[]> {
  let watchlist = await Watchlist.findOne({ email });
  
  if (!watchlist) {
    // Create empty watchlist for new user
    watchlist = await Watchlist.create({
      email,
      symbols: [],
    });
  }

  return watchlist.symbols;
}

export async function saveWatchlist(email: string, symbols: string[]): Promise<void> {
  await Watchlist.findOneAndUpdate(
    { email },
    { symbols },
    { upsert: true, new: true }
  );
}
