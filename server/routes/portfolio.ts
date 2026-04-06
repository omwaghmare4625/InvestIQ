import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { getPortfolio, savePortfolio, getTransactions, saveTransactions, type TransactionData } from '../store.ts';

const router = Router();

// ─── GET /api/portfolio ──────────────────────────────────────────────
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const portfolio = await getPortfolio(req.user!.email);
    const transactions = await getTransactions(req.user!.email);
    res.json({ ...portfolio, transactions });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── POST /api/portfolio/trade ───────────────────────────────────────
router.post('/trade', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { symbol, type, qty, price, total } = req.body;

    if (!symbol || !type || !qty || !price || total === undefined) {
      res.status(400).json({ error: 'symbol, type, qty, price, and total are required.' });
      return;
    }

    if (type !== 'BUY' && type !== 'SELL') {
      res.status(400).json({ error: 'type must be BUY or SELL.' });
      return;
    }

    const email = req.user!.email;
    const portfolio = await getPortfolio(email);

    const usStocks = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'NVDA', 'SPY'];
    const baseCurrency = usStocks.includes(symbol) ? 'USD' : 'INR';

    if (type === 'BUY') {
      if (portfolio.balance < total) {
        res.status(400).json({ error: 'Insufficient balance.' });
        return;
      }
      portfolio.balance -= total;

      const existing = portfolio.holdings.find(h => h.symbol === symbol);
      if (existing) {
        const totalQty = existing.qty + qty;
        const totalCost = (existing.qty * existing.avgCost) + (qty * price);
        existing.avgCost = totalCost / totalQty;
        existing.qty = totalQty;
      } else {
        portfolio.holdings.push({
          symbol,
          name: symbol, // In production we'd look this up
          qty,
          avgCost: price,
          currentPrice: price,
          baseCurrency,
        });
      }
    } else {
      // SELL
      const existing = portfolio.holdings.find(h => h.symbol === symbol);
      if (!existing || existing.qty < qty) {
        res.status(400).json({ error: 'Insufficient holdings to sell.' });
        return;
      }

      portfolio.balance += total;
      existing.qty -= qty;

      if (existing.qty <= 0) {
        portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);
      }
    }

    await savePortfolio(email, portfolio);

    // Save the transaction
    const transactions = await getTransactions(email);
    const newTx: TransactionData = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      type,
      qty,
      price,
      total,
      timestamp: new Date().toISOString(),
      baseCurrency,
    };
    transactions.unshift(newTx);
    await saveTransactions(email, transactions);

    res.json({ portfolio, transaction: newTx });
  } catch (error) {
    console.error('Trade error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── PUT /api/portfolio/holding ──────────────────────────────────────
router.put('/holding', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { symbol, qty } = req.body;

    if (!symbol || qty === undefined || typeof qty !== 'number' || qty < 0) {
      res.status(400).json({ error: 'symbol and a non-negative qty are required.' });
      return;
    }

    const email = req.user!.email;
    const portfolio = await getPortfolio(email);

    if (qty === 0) {
      // Remove the holding entirely
      portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);
    } else {
      const existing = portfolio.holdings.find(h => h.symbol === symbol);
      if (!existing) {
        res.status(404).json({ error: `Holding ${symbol} not found.` });
        return;
      }
      existing.qty = qty;
    }

    await savePortfolio(email, portfolio);
    res.json({ holdings: portfolio.holdings, balance: portfolio.balance });
  } catch (error) {
    console.error('Update holding error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── POST /api/portfolio/funds ───────────────────────────────────────
router.post('/funds', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ error: 'A positive amount is required.' });
      return;
    }

    const email = req.user!.email;
    const portfolio = await getPortfolio(email);
    portfolio.balance += amount;
    await savePortfolio(email, portfolio);

    res.json({ balance: portfolio.balance });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
