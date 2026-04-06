import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { authMiddleware } from '../middleware/auth.ts';

const router = Router();

// ─── POST /api/advisor/chat ──────────────────────────────────────────
router.post('/chat', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { prompt, portfolioContext } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'prompt is required.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.0-flash';

    const systemInstruction = `
      You are InvestIQ AI Advisor, a premium financial assistant. 
      Your goal is to provide professional, data-driven, and personalized investment advice.
      
      Context about the user's portfolio:
      ${portfolioContext || 'No portfolio context provided.'}
      
      Guidelines:
      - Be professional yet approachable.
      - Use financial terminology correctly.
      - Always include a disclaimer that this is not official financial advice.
      - Format your response using Markdown for readability.
      - If asked about specific stocks, provide a balanced view (risks vs rewards).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    res.json({ response: response.text });
  } catch (error) {
    console.error('Advisor API error:', error);
    res.json({
      response: "I'm sorry, I'm having trouble connecting to my financial brain right now. Please try again later.",
    });
  }
});

export default router;
