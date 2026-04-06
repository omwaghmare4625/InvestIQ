<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# InvestIQ — AI-Powered Financial Advisor

InvestIQ is a full-stack financial advisor web application that helps users manage their investment portfolio, track financial goals, monitor live markets, and get AI-powered investment advice — all in a stunning, modern dark-themed UI.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Signup & Login with JWT-based auth and bcrypt password hashing |
| 📊 **Dashboard** | Portfolio overview with interactive charts, market indices, and AI insights |
| 💼 **Portfolio** | Track holdings, P/L, asset allocation, and edit quantities |
| 📈 **Markets** | Browse Indian & US stocks with real-time API data from Alpha Vantage |
| 🎯 **Goals** | Create, edit, and track financial goals with a beautiful interactive UI |
| 🔔 **Alerts** | Set price and percentage change alerts for your favorite stocks |
| 🤖 **AI Advisor** | Chat with a Gemini-powered financial AI advisor for personalized advice |
| ⭐ **Watchlist** | Add/remove stocks to your personal watchlist |
| 💰 **Trading** | Execute BUY/SELL trades with real-time price synchronization |
| ⚙️ **Settings** | Profile management, theme, notifications, and currency preferences |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript**
- **Vite 6** (dev server + build)
- **Tailwind CSS 4**
- **Zustand** (state management)
- **TanStack Query** (data fetching)
- **React Router 7** (routing)
- **Recharts** + **Lightweight Charts** (data visualization)
- **Framer Motion** (animations)
- **Radix UI** (accessible components)
- **Sonner** (toast notifications)
- **Lucide React** (icons)

### Backend
- **Express.js 4** + **TypeScript**
- **MongoDB** + **Mongoose v8** (data persistence with async/await)
- **JWT** (jsonwebtoken) for authentication
- **bcryptjs** for password hashing
- **Alpha Vantage API** (real-time stock market data)
- **Google Gemini AI** (`@google/genai`) for the AI advisor
- **CORS** configured for the frontend origin
- **tsx** for running TypeScript directly (with watch mode)

---

## 📁 Project Structure

```
investiq-financial-advisor/
├── server/                     # ⚙️ Express Backend
│   ├── index.ts                # Server entry point with MongoDB connection
│   ├── db.ts                   # MongoDB connection management
│   ├── store.ts                # Async Mongoose data store
│   ├── tsconfig.json           # Server TypeScript config
│   ├── middleware/
│   │   └── auth.ts             # JWT authentication middleware
│   ├── models/
│   │   ├── user.ts             # Mongoose User schema
│   │   ├── portfolio.ts        # Mongoose Portfolio schema
│   │   ├── goal.ts             # Mongoose Goal schema
│   │   ├── transaction.ts      # Mongoose Transaction schema
│   │   ├── watchlist.ts        # Mongoose Watchlist schema
│   │   ├── alert.ts            # Mongoose Alert schema (price alerts)
│   │   └── marketCache.ts      # Mongoose MarketCache schema (Alpha Vantage caching)
│   ├── routes/
│   │   ├── auth.ts             # Signup, Login, Profile
│   │   ├── portfolio.ts        # Holdings, Trades, Funds, Qty Updates
│   │   ├── goals.ts            # Financial Goals CRUD (Create, Update, Delete)
│   │   ├── alerts.ts           # Price Alert Management CRUD
│   │   ├── markets.ts          # Market data via Alpha Vantage with caching
│   │   ├── watchlist.ts        # Watchlist management
│   │   └── advisor.ts          # AI Advisor (Gemini API)
│   └── services/
│       ├── alphavantage.ts     # Alpha Vantage API client with request counting
│       └── cacheService.ts     # MongoDB cache management layer
│
├── src/                        # ⚛️ React Frontend
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   ├── components/
│   │   ├── landing/UI.tsx      # Landing page components
│   │   ├── layout/AppShell.tsx # Sidebar + layout shell
│   │   └── ui/                 # Common UI, StockChart, TradeDialog
│   ├── pages/                  # All page components
│   ├── services/
│   │   ├── api.ts              # API client with JWT management
│   │   └── gemini.ts           # AI advisor service wrapper
│   ├── store/
│   │   └── useStore.ts         # Zustand global state
│   └── lib/
│       └── utils.ts            # Utility functions
│
├── .env.example                # Environment variables template
├── .env.local                  # Local environment (git-ignored)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- **MongoDB** v4 or later (running locally or Atlas connection string)
- **Google Gemini API key** (get one from [Google AI Studio](https://aistudio.google.com/apikey))
- **Alpha Vantage API key** (get one from [Alpha Vantage](https://www.alphavantage.co/api/))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/investiq-financial-advisor.git
cd investiq-financial-advisor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# MongoDB Configuration
MONGODB_URI="mongodb://localhost:27017/investiq"

# Server
SERVER_PORT="5000"
APP_URL="http://localhost:3000"

# Authentication
JWT_SECRET="your-secret-key-here"

# AI - Google Gemini
GEMINI_API_KEY="your-gemini-api-key-here"

# Stock Market Data - Alpha Vantage
ALPHA_VANTAGE_API_KEY="your-alpha-vantage-api-key-here"
ALPHA_VANTAGE_CACHE_HOURS="4"          # Cache TTL in hours (default: 4)
ALPHA_VANTAGE_DAILY_LIMIT="25"         # Daily request quota (free tier: 25)
```

**Note**: Get your Alpha Vantage API key from https://www.alphavantage.co/api/

### 4. Start the application

#### Option A: Run both frontend & backend together (recommended)

```bash
npm run dev:full
```

This starts:
- 🖥️ **Frontend** at `http://localhost:3000` (Vite dev server)
- ⚙️ **Backend** at `http://localhost:5000` (Express server)

The Vite dev server automatically proxies `/api/*` requests to the backend.

#### Option B: Run separately (two terminals)

**Terminal 1 — Backend:**
```bash
npm run server
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

### 5. Open in browser

Navigate to **http://localhost:3000**

---

## 📡 API Reference

All API endpoints are prefixed with `/api`. Protected endpoints require a `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | ❌ | Create a new account |
| `POST` | `/api/auth/login` | ❌ | Login with credentials |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `PUT` | `/api/auth/profile` | ✅ | Update name/currency |

### Portfolio
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/portfolio` | ✅ | Get holdings, balance, transactions |
| `POST` | `/api/portfolio/trade` | ✅ | Execute a BUY/SELL trade |
| `POST` | `/api/portfolio/funds` | ✅ | Add funds to account |
| `PUT` | `/api/portfolio/holding` | ✅ | Update holding quantity or remove |

### Goals
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/goals` | ✅ | Get all financial goals |
| `POST` | `/api/goals` | ✅ | Create a new goal |
| `PUT` | `/api/goals/:id` | ✅ | Update an existing goal |
| `DELETE` | `/api/goals/:id` | ✅ | Delete a goal |

### Alerts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/alerts` | ✅ | Get all active user alerts |
| `POST` | `/api/alerts` | ✅ | Create a new price/percent alert |
| `DELETE` | `/api/alerts/:id` | ✅ | Remove an alert |

### Markets
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/markets` | ✅ | List stocks from portfolio + watchlist (with real-time quotes & cache info) |
| `GET` | `/api/markets/:symbol` | ✅ | Get detailed stock info with cached quote |
| `GET` | `/api/markets/:symbol/chart` | ✅ | Get intraday/daily historical chart data |

### Watchlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/watchlist` | ✅ | Get user's watchlist |
| `POST` | `/api/watchlist/toggle` | ✅ | Add/remove a symbol |

### AI Advisor
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/advisor/chat` | ✅ | Get AI investment advice |

### Health Check
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | ❌ | Server health status |

---

## 🏗️ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

---

## � Real-Time Market Data Integration

InvestIQ now integrates with **Alpha Vantage** for real-time stock market quotes and historical data.

### Alpha Vantage Features
- ✅ **Real quotes**: AAPL, GOOGL, MSFT, TSLA, BTC, and 500+ stocks
- ✅ **Intelligent caching**: 4-hour TTL for quotes, 24-hour for daily data (stored in MongoDB)
- ✅ **Request throttling**: Sequential fetching with 1.2-second delays to respect 1 req/sec rate limit
- ✅ **Rate limit tracking**: Monitor daily quota (default 25 requests/day)
- ✅ **Cache-aware responses**: API returns `isCached: true` flag to indicate cache hits
- ✅ **Portfolio-first optimization**: Only fetches data for user's portfolio + watchlist

### How It Works
1. When you request market data, the app checks MongoDB cache first
2. If data is expired or missing, it fetches from Alpha Vantage API
3. Fresh data is cached with automatic expiry
4. Sequential requests prevent rate limit violations
5. Daily request counter ensures you don't exceed API quota

**Example Response:**
```json
{
  "symbol": "AAPL",
  "price": 253.79,
  "change": 7.16,
  "changePercent": 2.9031,
  "lastUpdated": "2026-03-31",
  "isCached": true,
  "category": "US Stocks"
}
```

---

## �📝 Notes

- **Data Persistence**: All user data (profiles, holdings, goals, transactions, watchlists) is stored in **MongoDB** with Mongoose ODM. Fully async/await architecture ensures optimal performance.
- **Market Data**: Real stock quotes come from **Alpha Vantage API**. Free tier limited to 25 requests/day. Caching layer in MongoDB minimizes quota usage.
- **Request Rate Limiting**: The backend enforces sequential fetching with smart delays to stay within Alpha Vantage's 1 request/second rate limit.
- **Cache Strategy**: 
  - Quote data cached for 4 hours (configurable via `ALPHA_VANTAGE_CACHE_HOURS`)
  - Historical data (intraday/daily) cached for 24 hours
  - Automatic expiry cleanup via MongoDB TTL indexes
- **API Key Security**: All sensitive API keys (Gemini, Alpha Vantage) are used exclusively server-side. Never exposed to browser.
- **Password Security**: All passwords are hashed with bcrypt (10 salt rounds) before MongoDB storage.
- **JWT Authentication**: Stateless token-based auth with 7-day expiration.

---

## 🔄 Architecture Highlights

```
┌─────────────────────────────────────────────────┐
│           React Frontend (Vite)                  │
│      http://localhost:3000                      │
└────────────────┬────────────────────────────────┘
                 │ JWT Token in Authorization header
                 │
┌────────────────▼────────────────────────────────┐
│         Express Backend (TypeScript)             │
│      http://localhost:5000                      │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │      Routes (Auth, Portfolio, etc.)      │   │
│  └────────┬──────────────────────┬──────────┘   │
│           │                      │              │
│    ┌──────▼──────┐      ┌───────▼──────────┐   │
│    │  Mongoose   │      │ Alpha Vantage    │   │
│    │   Models    │      │  API + Caching   │   │
│    └──────┬──────┘      └────────┬─────────┘   │
│           │                      │              │
└───────────┼──────────────────────┼──────────────┘
            │                      │
    ┌───────▼──────────────────────▼──────┐
    │      MongoDB Local/Atlas             │
    │  (Users, Portfolios, Cache, etc.)    │
    └──────────────────────────────────────┘
```

---

## � Troubleshooting

### MongoDB Connection Issues
**Error**: `MongoServerError: connect ECONNREFUSED`
- **Solution**: Ensure MongoDB is running (`mongod`) or update `MONGODB_URI` to your Atlas connection string

### Alpha Vantage Rate Limiting
**Error**: `{"Information": "Thank you for using Alpha Vantage..."}`
- **Solution**: This is a free-tier rate limit. Wait a few minutes before making more requests. The cache layer helps minimize this.

### API Key Errors
**Error**: `"apikey is invalid or missing"`
- **Solution**: 
  - Verify `ALPHA_VANTAGE_API_KEY` is set in `.env.local`
  - Restart the server after updating `.env` variables
  - Check that the key is valid at [Alpha Vantage Dashboard](https://www.alphavantage.co/support/#api-key)

### CORS Issues
**Error**: `Access to XMLHttpRequest blocked by CORS policy`
- **Solution**: Ensure `APP_URL` in `.env.local` matches your frontend origin (should be `http://localhost:3000` for local dev)

---

## �📄 License

This project is licensed under the **Apache License 2.0** — an open-source license that allows broad usage with minimal restrictions.

### 📋 What You Can Do
- ✅ **Use commercially** — Build commercial products with InvestIQ code
- ✅ **Modify** — Change and adapt the code for your needs
- ✅ **Distribute** — Share the code, modified or not
- ✅ **Private use** — Use privately without sharing
- ✅ **Patent use** — Use any patent claims in the code
- ✅ **Sublicense** — Include in your own projects with the same license

### ⚠️ What You Must Do
- 📋 **Include license** — Provide a copy of the Apache 2.0 license
- ✏️ **State changes** — Document what you modified from the original
- 📝 **Keep notices** — Retain the original copyright notice

### ⛔ What You Cannot Do
- ❌ **Use trademarks** — Can't use InvestIQ name/logo without permission
- ❌ **Hold liable** — Can't hold authors responsible for issues

### Full License Text
For the complete Apache License 2.0 text, see:
- 📖 [Apache License 2.0 Official](https://www.apache.org/licenses/LICENSE-2.0)
- 📄 Create a `LICENSE` file in your repo root with the full text

### Disclaimer
THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
