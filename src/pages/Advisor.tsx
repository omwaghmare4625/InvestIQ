import React from 'react';
import { useLocation } from 'react-router';
import {
  Send,
  Sparkles,
  History,
  Trash2,
  User,
  Bot,
  Loader2,
  Lightbulb,
  TrendingUp,
  Target,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card, Button, Skeleton } from '@/components/ui/Common';
import { useStore } from '@/store/useStore';
import { getInvestmentAdvice, streamInvestmentAdvice } from '@/services/advisor';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  {
    label: 'Portfolio Analysis',
    prompt: 'Analyze my current portfolio and suggest improvements.',
    icon: TrendingUp,
  },
  {
    label: 'Market Outlook',
    prompt: 'What is the current market outlook for the next quarter?',
    icon: Lightbulb,
  },
  { label: 'Goal Strategy', prompt: 'How can I reach my house fund goal faster?', icon: Target },
];

export default function Advisor() {
  const location = useLocation();
  const { user, portfolio, goals, advisorMessages, setAdvisorMessages, clearAdvisorMessages } =
    useStore();

  const defaultMessage: Message = {
    id: '1',
    role: 'assistant',
    content: `Hello ${user?.name.split(' ')[0] || 'there'}! I am your strategic wealth advisor. I have updated your portfolio context and goal targets. How can I assist with your investment strategy today?`,
    timestamp: new Date(),
  };

  // Initialize from store or fallback to welcome message
  const [messages, setMessages] = React.useState<Message[]>(() => {
    if (advisorMessages.length > 0) {
      return advisorMessages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [defaultMessage];
  });
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync messages to store whenever they change
  React.useEffect(() => {
    setAdvisorMessages(messages.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() })));
  }, [messages]);

  // Handle incoming insight from Dashboard
  React.useEffect(() => {
    if (location.state?.insightPrompt) {
      setInput(location.state.insightPrompt);
      // Clear the state so it doesn't repopulate on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const portfolioContext = React.useMemo(() => {
    const holdings = portfolio
      .map((h) => `${h.name} (${h.symbol}): ${h.qty} shares at avg cost ${h.avgCost}`)
      .join(', ');
    const goalList = goals
      .map((g) => `${g.title}: Target ${g.target}, Current ${g.current}`)
      .join(', ');
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

    const historyToPass = messages.map(m => ({ role: m.role, content: m.content }));

    const assistantMsgId = (Date.now() + 1).toString();
    const emptyAssistantMessage: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, emptyAssistantMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(false);

    try {
      let currentContent = '';
      
      await streamInvestmentAdvice(text, portfolioContext, user?.currency || 'USD', historyToPass, (chunk) => {
        currentContent += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === assistantMsgId 
              ? { ...msg, content: currentContent } 
              : msg
          )
        );
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== assistantMsgId),
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '⚠️ ERROR: Connection failed. Please check your network and try again.',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-sans font-bold tracking-tight text-text-primary mb-0.5">
              Strategic Advisor
            </h1>
            <p className="text-text-dim text-xs font-bold uppercase tracking-wider">
              AI Powered Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-[11px] font-bold uppercase tracking-wider text-text-dim hover:text-text-primary hover:bg-surface-high transition-all"
            onClick={() => toast.info('History access available in Pro')}
          >
            <History className="w-3.5 h-3.5" />
            Archive
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-danger/5 border border-danger/10 text-[11px] font-bold uppercase tracking-wider text-danger hover:bg-danger/10 transition-all"
            onClick={() => {
              clearAdvisorMessages();
              setMessages([defaultMessage]);
              toast.success('Conversation history cleared.');
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </header>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden shadow-lg">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 scroll-smooth bg-surface-low/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-4 sm:gap-6 max-w-[95%] sm:max-w-[85%]',
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-sm border',
                  msg.role === 'user'
                    ? 'bg-primary text-white border-primary-hover'
                    : 'bg-surface border-border text-text-dim'
                )}
              >
                {msg.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
              </div>
              <div
                className={cn(
                  'p-5 sm:p-6 rounded-2xl text-[15px] leading-relaxed font-normal shadow-sm relative border',
                  msg.role === 'user'
                    ? 'bg-primary/5 text-text-primary rounded-tr-none border-primary/20'
                    : 'bg-surface text-text-primary rounded-tl-none border-border'
                )}
              >
                <div className="markdown-body prose prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <div
                  className={cn(
                    'text-[10px] mt-4 font-bold uppercase tracking-widest opacity-30',
                    msg.role === 'user' ? 'text-right' : 'text-left'
                  )}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && !messages[messages.length - 1].content && (
            <div className="flex gap-4 sm:gap-6 mr-auto">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-text-dim flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="p-6 rounded-2xl rounded-tl-none border border-border bg-surface shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 border-t border-border bg-surface">
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {suggestions.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => handleSend(s.prompt)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-high border border-border text-[11px] font-bold uppercase tracking-wider text-text-dim hover:border-primary/40 hover:text-primary transition-all shadow-sm"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Query advisor regarding market strategy..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="w-full bg-surface-high border border-border rounded-xl pl-6 pr-16 py-4 text-sm text-text-primary placeholder:text-text-dim/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center shadow-md hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <Send className="w-4.5 h-4.5" />
              )}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
