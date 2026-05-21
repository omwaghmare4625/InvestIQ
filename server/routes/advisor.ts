import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { yahooFinanceClient } from '../services/yahooFinance.ts';

const router = Router();

// ─── POST /api/advisor/chat ──────────────────────────────────────────
router.post('/chat', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, portfolioContext, currency, history = [] } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'prompt is required.' });
      return;
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // 1. Extract symbols from portfolioContext
    const symbolRegex = /\(([A-Z]{1,5})\)/g;
    let match;
    const symbols = new Set<string>();
    while ((match = symbolRegex.exec(portfolioContext || '')) !== null) {
      symbols.add(match[1]);
    }

    // 2. Fetch live market data
    let liveMarketContext = '';
    if (symbols.size > 0) {
      const quotes = await Promise.all(Array.from(symbols).map(sym => yahooFinanceClient.getQuote(sym)));
      const validQuotes = quotes.filter(q => q !== null);
      if (validQuotes.length > 0) {
        liveMarketContext = '\nLive Market Data (Real-Time snapshot):\n' + 
          validQuotes.map(q => `- ${q?.symbol}: Price ${q?.price}, Change ${q?.changePercent?.toFixed(2)}%`).join('\n');
      }
    }

    let rawHost = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';

    // Ensure protocol for URL parsing
    if (!rawHost.startsWith('http')) {
      rawHost = `http://${rawHost}`;
    }
    
    // Normalize: 0.0.0.0 is for binding; use 127.0.0.1 for connecting
    rawHost = rawHost.replace('0.0.0.0', '127.0.0.1');

    const url = new URL(rawHost);
    // Default to Ollama's 11434 if no port is specified for local connections
    if (!url.port && (url.hostname === '127.0.0.1' || url.hostname === 'localhost')) {
      url.port = '11434';
    }
    
    const ollamaHost = url.origin;
    console.log(`🤖 Advisor Chat: Sending request to Ollama (${ollamaModel}) at ${ollamaHost}`);

    const systemInstruction = `
      You are InvestIQ AI Advisor, a premium financial assistant. 
      Your goal is to provide professional, data-driven, and personalized investment advice.
      
      User Preferences:
      - Preferred Currency: ${currency || 'USD'}
      
      Context about the user's portfolio:
      ${portfolioContext || 'No portfolio context provided.'}
      ${liveMarketContext}
      
      Guidelines:
      - Be professional yet approachable.
      - Use financial terminology correctly.
      - IMPORTANT: Always use ${currency || 'USD'} as the currency unit for any prices, targets, or financial values mentioned.
      - Incorporate the Live Market Data into your reasoning if relevant.
      - Wrap any stock ticker symbols in double brackets like [[AAPL]] or [[TSLA]] so our UI can highlight them.
      - Always include a disclaimer that this is not official financial advice.
      - Do not guarantee returns or promise unrealistic gains.
      - Format your response using Markdown for readability.
    `;

    const formattedHistory = Array.isArray(history) 
      ? history.map((msg: any) => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content }))
      : [];

    const messages = [
      { role: 'system', content: systemInstruction },
      ...formattedHistory,
      { role: 'user', content: prompt }
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    const response = await fetch(`${ollamaHost}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: messages,
        stream: true,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok || !response.body) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Ollama API error response:', errorData);
      res.write(`data: ${JSON.stringify({ error: `Ollama API error: ${response.status} ${response.statusText}` })}\n\n`);
      res.end();
      return;
    }

    let buffer = '';
    const decoder = new TextDecoder('utf-8');
    for await (const chunk of response.body as any) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            res.write(`data: ${JSON.stringify({ chunk: json.message.content })}\n\n`);
          }
        } catch (e) {
          // Ignore partial JSON parsing errors
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error: any) {
    console.error('Advisor API error:', error);
    
    if (error.message?.includes('ECONNREFUSED')) {
      res.write(`data: ${JSON.stringify({ error: `I can't connect to my local brain (Ollama). Please make sure Ollama is running at ${process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'}.` })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ error: `Advisor Engine Error: ${error.message || 'Unknown internal error'}` })}\n\n`);
    }
    res.end();
  }
});

export default router;

