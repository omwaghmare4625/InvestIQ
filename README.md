# InvestIQ Financial Advisor

InvestIQ is a premium, full-stack financial advisor web application. It combines data visualizations, clean layout design, and AI-powered intelligence to provide a comprehensive wealth management experience.

---

## Core Features

- AI Advisor: Ollama-powered assistant providing strategic capital deployment advice and risk assessment using streaming responses.
- Dynamic Portfolio: Real-time tracking of holdings, average cost basis, cash balance, and asset allocation.
- Market Terminal: Price tracking for US and Indian stocks using live data from Yahoo Finance.
- Transaction Logging: Seamless logging of buy and sell transactions with automatic balance adjustment.
- Price Alerts: Multi-layer price and trend alerts configured per stock symbol.
- Secure Session Management: JWT-based authentication with password hashing and cookies.

---

## Technical Stack

### Frontend
- Core: React 19, TypeScript, Vite 6.
- Styling: Tailwind CSS v4, Motion (Framer), Radix UI (Dialog, Radio Group).
- Data Visualization: Recharts, Lightweight Charts.
- State Management: Zustand (with persistence support).
- Queries: TanStack Query.

### Backend
- Framework: Express.js 4, Node.js, TypeScript execution via tsx.
- Database: MongoDB (Mongoose v9).
- Third-Party APIs: Yahoo Finance (for real-time stock pricing and charts).
- AI Engine: Ollama (supporting local LLM execution).

---

## Project Structure

```
investiq-financial-advisor/
├── server/                     # Express Backend
│   ├── index.ts                # Server entry point & MongoDB connection
│   ├── db.ts                   # Database connection helper
│   ├── store.ts                # Database query adapters
│   ├── models/                 # Mongoose Schemas (User, Portfolio, Goal, Transaction, Alert, Watchlist, MarketCache)
│   ├── routes/                 # Express API routes (auth, portfolio, goals, markets, watchlist, advisor, alerts)
│   └── services/               # Caching & external API integrations
│
├── src/                        # React Frontend
│   ├── components/
│   │   ├── landing/            # Landing page sub-components
│   │   ├── layout/             # App Shell and sidebar navigation
│   │   └── ui/                 # Shared UI elements and chart components
│   ├── pages/                  # Route views (Dashboard, Markets, Portfolio, Advisor, Goals, Alerts, Settings, Learn, Login, Signup, Landing)
│   ├── services/               # Frontend API client and advisor streaming wrappers
│   ├── store/                  # Zustand state stores
│   └── lib/                    # Shared utility functions
│
├── public/                     # Static media and assets
├── .env.example                # Template for environment variables
└── package.json                # Dependencies and project scripts
```

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB v6 or higher
- Ollama running locally (configured with a model like llama3.2:3b)

### 1. Setup Environment
Clone the repository and copy the environment template to create a local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your MongoDB connection string, local Ollama server URL, and JWT secret key. Example configuration:

```env
JWT_SECRET="your-jwt-secret-key"
APP_URL="http://localhost:3000"
MONGODB_URI="mongodb://localhost:27017/investiq"
SERVER_PORT="5000"
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="llama3.2:3b"
MARKET_DATA_CACHE_HOURS="4"
```

### 2. Install Dependencies
Install the required packages using npm:

```bash
npm install --legacy-peer-deps
```

### 3. Run the Application
Start both the Express backend server and Vite dev frontend server concurrently:

```bash
npm run dev:full
```

- Frontend client runs on: http://localhost:3000
- Backend server runs on: http://localhost:5000

---

## Architecture and Performance

- Database Caching: Stock quotes and chart histories are cached in MongoDB (for 4 hours and 24 hours respectively) to avoid exceeding Yahoo Finance API limits and to guarantee fast response times.
- AI SSE Streaming: The AI advisor backend processes chat requests asynchronously, utilizing Server-Sent Events (SSE) to stream words directly to the frontend.
- Optimistic Updates: The frontend Zustand store performs optimistic state updates for trades and watchlist items, sending HTTP updates in the background to ensure a zero-latency user experience.
