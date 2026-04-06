import React from 'react';
import { Send, Sparkles, History, Trash2, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card, Button } from '@/components/ui/Common';
import { useStore } from '@/store/useStore';
import { getInvestmentAdvice } from '@/services/gemini';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  { label: '📈 Portfolio Analysis', prompt: 'Analyze my current portfolio and suggest improvements.' },
  { label: '📊 Market Outlook', prompt: 'What is the current market outlook for the next quarter?' },
  { label: '🎯 Goal Strategy', prompt: 'How can I reach my house fund goal faster?' },
];

export default function Advisor() {
  const { user, portfolio, goals } = useStore();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user.name}! I'm your InvestIQ AI Advisor. I've analyzed your portfolio and goals. How can I help you optimize your investments today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const portfolioContext = React.useMemo(() => {
    const holdings = portfolio.map(h => `${h.name} (${h.symbol}): ${h.qty} shares at avg cost ${h.avgCost}`).join(', ');
    const goalList = goals.map(g => `${g.title}: Target ${g.target}, Current ${g.current}`).join(', ');
    return `Portfolio: [${holdings}]. Goals: [${goalList}].`;
  }, [portfolio, goals]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const advice = await getInvestmentAdvice(text, portfolioContext);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: advice || "I'm sorry, I couldn't generate a response.",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Advisor</h1>
            <p className="text-text-muted text-sm">Personalized investment intelligence powered by Gemini.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <History className="w-4 h-4" />
            History
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-danger hover:text-danger" onClick={() => setMessages([])}>
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </header>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-surface/30 backdrop-blur-sm">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                msg.role === 'user' ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-surface-elevated text-text-primary rounded-tl-none border border-border/50"
              )}>
                <div className="markdown-body prose prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <p className={cn(
                  "text-[10px] mt-2 font-medium opacity-50",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 mr-auto">
              <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-surface-elevated p-4 rounded-2xl rounded-tl-none border border-border/50 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-sm text-text-muted">Advisor is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border/30 bg-surface/50">
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSend(s.prompt)}
                className="px-3 py-1.5 rounded-full bg-surface-elevated border border-border/50 text-xs font-medium hover:border-primary hover:text-primary transition-all"
              >
                {s.label}
              </button>
            ))}
          </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <input 
              type="text" 
              placeholder="Type your question about investments, markets, or your portfolio..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-4 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
