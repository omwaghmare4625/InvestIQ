import { advisorApi } from './api';

export async function getInvestmentAdvice(prompt: string, portfolioContext: string) {
  try {
    const data = await advisorApi.chat(prompt, portfolioContext);
    return data.response;
  } catch (error) {
    console.error("Advisor API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my financial brain right now. Please try again later.";
  }
}
