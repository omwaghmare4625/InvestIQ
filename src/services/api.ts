/**
 * InvestIQ API Client
 * Centralized fetch wrapper with JWT token management
 */

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('investiq_token');
}

export function setToken(token: string): void {
  localStorage.setItem('investiq_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('investiq_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth API ────────────────────────────────────────────────────────

export const authApi = {
  signup: (data: { name: string; email: string; password: string; currency: string }) =>
    request<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<any>('/auth/me'),

  updateProfile: (data: { name?: string; currency?: string }) =>
    request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ─── Portfolio API ───────────────────────────────────────────────────

export const portfolioApi = {
  get: () => request<any>('/portfolio'),

  trade: (data: { symbol: string; type: string; qty: number; price: number; total: number }) =>
    request<any>('/portfolio/trade', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  addFunds: (amount: number) =>
    request<any>('/portfolio/funds', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  updateHolding: (data: { symbol: string; qty: number }) =>
    request<any>('/portfolio/holding', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ─── Goals API ───────────────────────────────────────────────────────

export const goalsApi = {
  get: () => request<any[]>('/goals'),

  create: (data: { title: string; target: number; icon?: string; baseCurrency?: string }) =>
    request<any>('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { title?: string; target?: number; icon?: string; current?: number; monthlyContribution?: number }) =>
    request<any>(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<any>(`/goals/${id}`, { method: 'DELETE' }),
};

// ─── Markets API ─────────────────────────────────────────────────────

export const marketsApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return request<any[]>(`/markets${qs ? `?${qs}` : ''}`);
  },

  getBySymbol: (symbol: string) => request<any>(`/markets/${symbol}`),

  getChart: (symbol: string, interval?: string) => {
    const query = interval ? `?interval=${interval}` : '';
    return request<any>(`/markets/${symbol}/chart${query}`);
  },
};

// ─── Watchlist API ───────────────────────────────────────────────────

export const watchlistApi = {
  get: () => request<string[]>('/watchlist'),

  toggle: (symbol: string) =>
    request<string[]>('/watchlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    }),
};

// ─── Advisor API ─────────────────────────────────────────────────────

export const advisorApi = {
  chat: (prompt: string, portfolioContext: string) =>
    request<{ response: string }>('/advisor/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, portfolioContext }),
    }),
};

// ─── Alerts API ──────────────────────────────────────────────────────

export const alertsApi = {
  get: () => request<any[]>('/alerts'),

  create: (data: { name: string; symbol: string; alertType: string; targetValue: number }) =>
    request<any>('/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<any>(`/alerts/${id}`, { method: 'DELETE' }),
};

