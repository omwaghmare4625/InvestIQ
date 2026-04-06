import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { Alert } from '../models/alert.ts';

const router = Router();

// ─── GET /api/alerts ─────────────────────────────────────────────────
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const alerts = await Alert.find({ email: req.user!.email }).sort({ createdAt: -1 });
    res.json(alerts.map(a => ({
      id: a._id?.toString() || '',
      name: a.name,
      symbol: a.symbol,
      alertType: a.alertType,
      targetValue: a.targetValue,
      isActive: a.isActive,
      createdAt: a.createdAt,
    })));
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── POST /api/alerts ────────────────────────────────────────────────
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, symbol, alertType, targetValue } = req.body;

    if (!name || !symbol || !alertType || targetValue === undefined) {
      res.status(400).json({ error: 'name, symbol, alertType, and targetValue are required.' });
      return;
    }

    const alert = await Alert.create({
      email: req.user!.email,
      name,
      symbol,
      alertType,
      targetValue,
      isActive: true,
    });

    res.status(201).json({
      id: alert._id?.toString() || '',
      name: alert.name,
      symbol: alert.symbol,
      alertType: alert.alertType,
      targetValue: alert.targetValue,
      isActive: alert.isActive,
      createdAt: alert.createdAt,
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── DELETE /api/alerts/:id ──────────────────────────────────────────
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await Alert.findOneAndDelete({
      _id: req.params.id,
      email: req.user!.email,
    });

    if (!result) {
      res.status(404).json({ error: 'Alert not found.' });
      return;
    }

    res.json({ message: 'Alert deleted.' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
