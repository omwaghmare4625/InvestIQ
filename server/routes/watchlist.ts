import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { getWatchlist, saveWatchlist } from '../store.ts';

const router = Router();

// ─── GET /api/watchlist ──────────────────────────────────────────────
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const watchlist = await getWatchlist(req.user!.email);
    res.json(watchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── POST /api/watchlist/toggle ──────────────────────────────────────
router.post('/toggle', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      res.status(400).json({ error: 'symbol is required.' });
      return;
    }

    const email = req.user!.email;
    const watchlist = await getWatchlist(email);

    const index = watchlist.indexOf(symbol);
    if (index === -1) {
      watchlist.push(symbol);
    } else {
      watchlist.splice(index, 1);
    }

    await saveWatchlist(email, watchlist);
    res.json(watchlist);
  } catch (error) {
    console.error('Toggle watchlist error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
