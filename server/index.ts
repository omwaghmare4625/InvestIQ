// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express from 'express';
import cors from 'cors';
import { connectDB, disconnectDB } from './db.ts';

import authRoutes from './routes/auth.ts';
import portfolioRoutes from './routes/portfolio.ts';
import goalsRoutes from './routes/goals.ts';
import marketsRoutes from './routes/markets.ts';
import watchlistRoutes from './routes/watchlist.ts';
import advisorRoutes from './routes/advisor.ts';
import alertsRoutes from './routes/alerts.ts';

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/markets', marketsRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/advisor', advisorRoutes);
app.use('/api/alerts', alertsRoutes);

// ─── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start Server ────────────────────────────────────────────────────
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`\n  🚀 InvestIQ Backend Server`);
      console.log(`  ─────────────────────────`);
      console.log(`  ✅ Running on http://localhost:${PORT}`);
      console.log(`  📡 API available at http://localhost:${PORT}/api`);
      console.log(`  🔑 JWT auth enabled`);
      console.log(`  🗄️  MongoDB connected\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n⏹️  SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\n⏹️  SIGINT received, shutting down gracefully...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
