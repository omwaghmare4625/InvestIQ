import { advisorApi } from './api';

export async function getInvestmentAdvice(prompt: string, portfolioContext: string) {
  try {
    const data = await advisorApi.chat(prompt, portfolioContext);
    return data.response;
  } catch (error: any) {
    console.error('Advisor API Error:', error);
    
    if (error.message && (error.message.includes('429') || error.message.includes('503'))) {
      if (error.message.includes('503')) {
        return "I can't connect to my local brain (Ollama). Please make sure Ollama is running on your machine.";
      }
      return "I'm currently receiving too many requests. Please wait a few moments before asking another question.";
    }
    
    return "I'm sorry, I'm having trouble connecting to my financial brain right now. Please try again later.";
  }
}

export async function streamInvestmentAdvice(
  prompt: string, 
  portfolioContext: string,
  currency: string,
  history: { role: string, content: string }[] = [],
  onChunk: (chunk: string) => void
) {
  try {
    const token = localStorage.getItem('investiq_token');
    
    const response = await fetch('/api/advisor/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ prompt, portfolioContext, currency, history }),
    });

    if (!response.ok || !response.body) throw new Error('Stream failed');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    let buffer = '';

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // The last element is either an empty string (if ended with \n) or an incomplete line
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '[DONE]') return;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) throw new Error(data.error);
              if (data.chunk) onChunk(data.chunk);
            } catch (e) {
               // ignore incomplete JSON
            }
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Streaming error:', error);
    onChunk('\n\n⚠️ Connection interrupted. Please try again.');
  }
}
