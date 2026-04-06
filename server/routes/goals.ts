import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { getGoals, saveGoals, type GoalData } from '../store.ts';

const router = Router();

// ─── GET /api/goals ──────────────────────────────────────────────────
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const goals = await getGoals(req.user!.email);
    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── POST /api/goals ─────────────────────────────────────────────────
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, target, icon, baseCurrency } = req.body;

    if (!title || !target) {
      res.status(400).json({ error: 'title and target are required.' });
      return;
    }

    const email = req.user!.email;
    const goals = await getGoals(email);

    const newGoal: GoalData = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      target,
      current: 0,
      monthlyContribution: Math.round(target / 60),
      icon: icon || '🎯',
      baseCurrency: baseCurrency || 'INR',
    };

    goals.push(newGoal);
    await saveGoals(email, goals);

    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── PUT /api/goals/:id ─────────────────────────────────────────────
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const email = req.user!.email;
    const goals = await getGoals(email);
    const goalIndex = goals.findIndex(g => g.id === req.params.id);

    if (goalIndex === -1) {
      res.status(404).json({ error: 'Goal not found.' });
      return;
    }

    const { title, target, icon, current, monthlyContribution } = req.body;

    if (title !== undefined) goals[goalIndex].title = title;
    if (target !== undefined) goals[goalIndex].target = target;
    if (icon !== undefined) goals[goalIndex].icon = icon;
    if (current !== undefined) goals[goalIndex].current = current;
    if (monthlyContribution !== undefined) goals[goalIndex].monthlyContribution = monthlyContribution;

    await saveGoals(email, goals);
    res.json(goals[goalIndex]);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── DELETE /api/goals/:id ───────────────────────────────────────────
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const email = req.user!.email;
    const goals = await getGoals(email);
    const filtered = goals.filter(g => g.id !== req.params.id);

    if (filtered.length === goals.length) {
      res.status(404).json({ error: 'Goal not found.' });
      return;
    }

    await saveGoals(email, filtered);
    res.json({ message: 'Goal deleted.' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
