import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, authMiddleware } from '../middleware/auth.ts';
import { getUser, createUser, updateUser, type StoredUser, getPortfolio, savePortfolio } from '../store.ts';

const router = Router();

// ─── POST /api/auth/signup ───────────────────────────────────────────
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, currency = 'INR' } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    const existingUser = await getUser(email);
    if (existingUser) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const EXCHANGE_RATE = 83.12;
    const baseBalance = 50000; // INR
    const initialBalance = currency === 'USD' ? baseBalance / EXCHANGE_RATE : baseBalance;

    const newUser: StoredUser = {
      email,
      name,
      passwordHash,
      currency,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date().toISOString(),
    };

    await createUser(newUser);

    // Initialize portfolio with the correct balance for currency
    const portfolio = await getPortfolio(email);
    portfolio.balance = initialBalance;
    await savePortfolio(email, portfolio);

    const token = generateToken({ email, name });

    res.status(201).json({
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        currency: newUser.currency,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = await getUser(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({ email: user.email, name: user.name });

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        currency: user.currency,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── GET /api/auth/me ────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await getUser(req.user!.email);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({
      name: user.name,
      email: user.email,
      currency: user.currency,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── PUT /api/auth/profile ───────────────────────────────────────────
router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, currency } = req.body;
    const updates: Partial<StoredUser> = {};

    if (name) updates.name = name;
    if (currency && (currency === 'INR' || currency === 'USD')) updates.currency = currency;

    const updated = await updateUser(req.user!.email, updates);
    if (!updated) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.json({
      name: updated.name,
      email: updated.email,
      currency: updated.currency,
      avatar: updated.avatar,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
