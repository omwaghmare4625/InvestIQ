import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  MessageSquare, 
  BookOpen, 
  Bell, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Star, 
  Menu, 
  X,
  Twitter, 
  Linkedin, 
  Github,
  BarChart3,
  Wallet,
  Sun,
  Moon
} from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { 
  Button, 
  Input, 
  Card, 
  Badge, 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/landing/UI';
import { cn } from '@/lib/utils';

const snappyTransition: any = { type: 'tween', ease: 'easeOut', duration: 0.1 };

// --- Components ---

const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (!document.documentElement.classList.contains('dark')) {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleTheme} 
      className="px-3 !py-2 shrink-0 bg-surface-hover border-[var(--border-width)]"
    >
      {theme === 'light' ? <Moon className="w-5 h-5 shrink-0" /> : <Sun className="w-5 h-5 shrink-0" />}
    </Button>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-100 border-b-[var(--border-width)] border-border bg-background",
      isScrolled ? "py-2 shadow-[var(--shadow-elevated)]" : "py-4"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 90 }}
            transition={snappyTransition}
            className="w-10 h-10 bg-primary border-[var(--border-width)] border-border flex items-center justify-center shadow-[var(--shadow-block)]"
          >
            <TrendingUp className="text-text-base w-6 h-6 stroke-[3]" />
          </motion.div>
          <span className="text-2xl font-black tracking-tighter uppercase ml-2">Invest<span className="text-primary tracking-tighter">IQ</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {['Markets', 'Portfolio', 'Advisor', 'Learn'].map((item) => (
            <Link 
              key={item} 
              to={`/${item.toLowerCase()}`} 
              className="text-sm font-black uppercase tracking-widest text-text-muted hover:text-text-base hover:-translate-y-1 transition-all"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button 
            className="p-2 border-[var(--border-width)] border-border bg-surface text-text-base shadow-[var(--shadow-block)] hover:bg-surface-hover active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="stroke-[3]"/> : <Menu className="stroke-[3]"/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="md:hidden absolute top-full left-0 right-0 bg-background border-b-[var(--border-width)] border-border p-6 flex flex-col gap-4 shadow-[var(--shadow-elevated)] overflow-hidden"
        >
          {['Markets', 'Portfolio', 'Advisor', 'Learn'].map((item) => (
            <Link 
              key={item} 
              to={`/${item.toLowerCase()}`} 
              className="text-lg font-black uppercase tracking-widest text-text-base border-[var(--border-width)] border-border bg-surface p-4 shadow-[var(--shadow-block)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t-[var(--border-width)] border-border">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full h-14">Login</Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full h-14">Get Started</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={snappyTransition}
        >
          <Badge className="mb-6 rotate-[-2deg] hover:rotate-2 transition-transform cursor-default">AI-Powered Wealth</Badge>
          <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter leading-[0.95] mb-8 uppercase text-text-base drop-shadow-[5px_5px_0px_var(--primary)]">
            Solid.<br />
            Smart.<br />
            Secure.
          </h1>
          <p className="text-xl font-bold text-text-muted mb-10 max-w-xl leading-snug border-l-[var(--border-width)] border-primary pl-4">
            Financial analytics and AI advice without the fluff. Straight-up data, fast execution, and zero clutter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-12">
            <Link to="/signup">
              <Button size="lg" className="h-16 w-full sm:w-auto text-lg" rightIcon={<ArrowRight className="w-6 h-6 stroke-[3]" />}>
                START NOW
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-16 w-full sm:w-auto text-lg" leftIcon={<Play className="w-6 h-6 fill-text-base stroke-text-base" />}>
              SEE ACTION
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            {['Zero hidden fees', 'Real-time sync', 'AI predictions'].map((text) => (
              <div key={text} className="flex items-center gap-2 text-sm font-black uppercase bg-surface-hover border-[var(--border-width)] border-border px-3 py-1 shadow-[var(--shadow-block-hover)]">
                <CheckCircle2 className="w-5 h-5 text-success stroke-[3]" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Interactive Diagram */}
        <motion.div
          initial={{ x: '100vw' }}
          animate={{ x: 0 }}
          transition={snappyTransition}
          className="relative perspective-1000 hidden md:block"
        >
          <div className="bg-accent border-[var(--border-width)] border-border p-6 shadow-[12px_12px_0px_0px_var(--shadow-color)] w-full h-[450px] flex flex-col justify-between relative">
            <div className="flex justify-between items-center bg-surface border-[var(--border-width)] border-border p-3 shadow-[var(--shadow-block)]">
              <div className="w-16 h-4 bg-primary border-[var(--border-width)] border-border" />
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-primary border-[2px] border-border" />
                <div className="w-4 h-4 bg-success border-[2px] border-border" />
              </div>
            </div>

            <div className="flex gap-4 h-full py-4 pt-8">
              {/* Bar 1 */}
              <div className="flex-1 flex flex-col justify-end gap-2">
                 <motion.div 
                   animate={{ height: ['40%', '80%', '40%'] }} 
                   transition={{ duration: 2, repeat: Infinity, type: 'tween', ease: 'linear' }}
                   className="w-full bg-surface border-[var(--border-width)] border-border shadow-[var(--shadow-block-hover)]"
                 />
              </div>
              {/* Bar 2 */}
              <div className="flex-1 flex flex-col justify-end gap-2">
                 <motion.div 
                   animate={{ height: ['70%', '30%', '70%'] }} 
                   transition={{ duration: 1.5, repeat: Infinity, type: 'tween', ease: 'linear' }}
                   className="w-full bg-primary border-[var(--border-width)] border-border shadow-[var(--shadow-block-hover)]"
                 />
              </div>
              {/* Bar 3 */}
              <div className="flex-1 flex flex-col justify-end gap-2">
                 <motion.div 
                   animate={{ height: ['90%', '50%', '90%'] }} 
                   transition={{ duration: 1.8, repeat: Infinity, type: 'tween', ease: 'linear' }}
                   className="w-full bg-surface-hover border-[var(--border-width)] border-border shadow-[var(--shadow-block-hover)]"
                 />
              </div>
               {/* Bar 4 */}
               <div className="flex-1 flex flex-col justify-end gap-2">
                 <motion.div 
                   animate={{ height: ['50%', '100%', '50%'] }} 
                   transition={{ duration: 2.2, repeat: Infinity, type: 'tween', ease: 'linear' }}
                   className="w-full bg-danger border-[var(--border-width)] border-border shadow-[var(--shadow-block-hover)]"
                 />
              </div>
            </div>

            {/* Floating blocks */}
            <motion.div 
              drag dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              className="absolute -top-8 -right-8 bg-success border-[var(--border-width)] border-border p-4 shadow-[var(--shadow-elevated)] cursor-move active:scale-95"
            >
              <TrendingUp className="text-text-base w-10 h-10 stroke-[3]" />
            </motion.div>
            <motion.div 
              drag dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              className="absolute -bottom-8 -left-8 bg-primary border-[var(--border-width)] border-border p-4 shadow-[var(--shadow-elevated)] cursor-move active:scale-95"
            >
              <Zap className="text-text-base w-10 h-10 stroke-[3]" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: <BarChart3 className="stroke-[3]"/>, title: 'Live Data', desc: 'Raw market feeds injected straight to your screen.' },
    { icon: <MessageSquare className="stroke-[3]"/>, title: 'AI Advisor', desc: 'Cold, hard facts combined with intelligent predictive models.' },
    { icon: <Target className="stroke-[3]"/>, title: 'Strict Goals', desc: 'Set rigid roadmaps and algorithmic achievement tracking.' },
    { icon: <Wallet className="stroke-[3]"/>, title: 'Solid Portfolio', desc: 'A dense vault of all your assets in one unified grid.' },
    { icon: <Bell className="stroke-[3]"/>, title: 'Instant Alerts', desc: 'Flash updates triggered the millisecond a threshold breaks.' },
    { icon: <BookOpen className="stroke-[3]"/>, title: 'Market Playbook', desc: 'Tactical manuals and heavy technical analysis breakdowns.' },
  ];

  return (
    <section className="py-24 border-t-[var(--border-width)] border-border bg-surface-hover">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter drop-shadow-[4px_4px_0px_var(--primary)]">Heavy Duty Tools</h2>
          <p className="font-bold text-text-muted max-w-2xl mx-auto text-xl uppercase">
            Designed to execute fast. Built to build wealth. No distractions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ...snappyTransition }}
              key={i}
            >
              <Card className="group h-full flex flex-col bg-background hover:bg-accent/10 transition-colors cursor-default">
                <div className="w-16 h-16 bg-primary border-[var(--border-width)] border-border flex items-center justify-center text-text-base mb-6 shadow-[var(--shadow-block)] group-hover:-translate-y-2 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">{f.title}</h3>
                <p className="text-text-dim font-bold leading-relaxed flex-1">{f.desc}</p>
                
                {/* Micro animation block */}
                <div className="w-full h-2 bg-surface-hover mt-6 border-[2px] border-border overflow-hidden">
                   <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1, type: 'tween' }}
                   />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DashboardPreview = () => {
  return (
    <section className="py-24 border-t-[var(--border-width)] border-b-[var(--border-width)] border-border bg-primary">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-black mb-16 uppercase tracking-tighter text-background dark:text-surface">Command Center</h2>
        
        <motion.div
          initial={{ y: 100 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={snappyTransition}
          className="relative mx-auto w-full max-w-5xl"
        >
          <div className="bg-background border-[var(--border-width)] border-border p-4 shadow-[16px_16px_0px_0px_var(--shadow-color)] text-text-primary">
            {/* Fake Dashboard Header */}
            <div className="flex justify-between items-center border-[var(--border-width)] border-border p-4 mb-6 bg-surface-hover">
               <div className="flex gap-4">
                 <div className="w-6 h-6 bg-danger border-[var(--border-width)] border-border hover:bg-danger-hover transition-colors" />
                 <div className="w-6 h-6 bg-warning border-[var(--border-width)] border-border hover:bg-warning-hover transition-colors" />
                 <div className="w-6 h-6 bg-success border-[var(--border-width)] border-border hover:bg-success-hover transition-colors" />
               </div>
               <div className="font-black uppercase tracking-widest text-xl">Overview</div>
               <div className="h-8 w-24 bg-primary border-[var(--border-width)] border-border hidden sm:block" />
            </div>

            {/* Fake Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="md:col-span-2 border-[var(--border-width)] border-border p-6 bg-surface h-[350px] flex flex-col justify-end gap-2 relative overflow-hidden group hover:bg-surface-hover transition-colors">
                <div className="absolute top-4 left-4 font-black uppercase tracking-tight text-2xl z-10 bg-background/80 px-2">Net Worth</div>
                <div className="absolute top-4 right-4 font-black text-primary text-2xl z-10 bg-background/80 px-2">+14.2%</div>
                <div className="flex gap-3 h-[85%] items-end justify-between px-2 w-full mt-auto">
                  {[20, 30, 25, 50, 45, 60, 55, 80, 75, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 0.3, type: 'tween' }}
                      className="flex-1 bg-primary border-[2px] border-border origin-bottom group-hover:bg-accent transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* Side Panels */}
              <div className="flex flex-col gap-6">
                 <div className="border-[var(--border-width)] border-border p-6 bg-success/30 h-full flex flex-col items-center justify-center shadow-[var(--shadow-block-hover)] hover:bg-success/50 transition-colors cursor-pointer">
                    <div className="font-black uppercase tracking-widest text-sm mb-2">Total Assets</div>
                    <div className="font-black text-4xl truncate w-full flex justify-center">$84,000</div>
                 </div>
                 <div className="border-[var(--border-width)] border-border p-6 bg-danger/30 h-full flex flex-col items-center justify-center shadow-[var(--shadow-block-hover)] hover:bg-danger/50 transition-colors cursor-pointer">
                    <div className="font-black uppercase tracking-widest text-sm mb-2">Liabilities</div>
                    <div className="font-black text-4xl truncate w-full flex justify-center">$12,400</div>
                 </div>
              </div>
            </div>
            
            {/* Bottom Panel */}
            <div className="mt-6 border-[var(--border-width)] border-border p-6 bg-surface w-full overflow-hidden whitespace-nowrap">
              <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="font-mono font-black text-xl text-primary"
              >
                TICKER: AAPL +1.2% • MSFT -0.5% • TSLA +4.3% • NVDA +2.1% • GOOGL +0.8% • AMZN +1.1% • META -1.2% • BTC +5.4% • ETH +3.2%
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: '01', title: 'Start', desc: 'Plug into the system.' },
    { num: '02', title: 'Load', desc: 'Sync your accounts.' },
    { num: '03', title: 'Win', desc: 'Deploy capital fast.' },
  ];

  return (
    <section className="py-24 bg-background border-b-[var(--border-width)] border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Execute Priority 3</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ...snappyTransition }}
              className="flex flex-col items-center text-center bg-surface border-[var(--border-width)] border-border p-10 hover:-translate-y-4 hover:shadow-[var(--shadow-elevated)] transition-all shadow-[var(--shadow-block)]"
            >
              <div className="w-20 h-20 bg-primary border-[var(--border-width)] border-border flex items-center justify-center text-3xl font-black text-white mb-8 transform -rotate-[5deg]">
                {s.num}
              </div>
              <h3 className="text-3xl font-black uppercase mb-3 tracking-tight">{s.title}</h3>
              <p className="text-text-muted font-bold text-lg">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const plans = [
    { name: 'FREE CODE', price: '$0', features: ['Core Tracking', 'Basic Sync', 'Standard UI'], btn: 'Boot System' },
    { name: 'PRO OVERRIDE', price: '$29', features: ['AI Oracle', 'Deep Analytics', 'Priority Alerts'], btn: 'Upgrade Matrix', popular: true },
  ];

  return (
    <section className="py-24 bg-surface-hover border-b-[var(--border-width)] border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tighter drop-shadow-[5px_5px_0px_var(--primary)] text-text-base">Select Modifiers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {plans.map((p, i) => (
            <Card key={i} className={cn(
              "p-10 flex flex-col h-full",
              p.popular ? "bg-primary border-border shadow-[16px_16px_0px_0px_var(--shadow-color)] transform md:-translate-y-4" : "bg-background"
            )}>
              {p.popular && <Badge className="self-start mb-6 bg-surface text-text-primary border-border shadow-none">Max Power</Badge>}
              <h3 className={cn("text-3xl font-black uppercase tracking-tight mb-2", p.popular && "text-white")}>{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className={cn("text-6xl font-black drop-shadow-[2px_2px_0px_#000]", p.popular ? "text-white" : "text-text-primary")}>{p.price}</span>
                <span className={cn("font-bold", p.popular ? "text-white/80" : "text-text-muted")}>/mo</span>
              </div>
              <ul className="space-y-6 mb-12 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className={cn("flex items-center gap-4 text-xl font-bold uppercase", p.popular ? "text-white" : "text-text-primary")}>
                    <CheckCircle2 className={cn("w-6 h-6 stroke-[4]", p.popular ? "text-white" : "text-success")} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-auto block">
                <Button variant={p.popular ? 'outline' : 'default'} className={cn(
                  "w-full h-16 text-xl",
                  p.popular && "bg-white text-primary border-border shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-surface hover:text-text-primary active:shadow-none"
                )}>
                  {p.btn}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    { q: 'Is it encrypted?', a: 'Everything travels through heavy SSL pipes. Your data is isolated and fortified.' },
    { q: 'How fast is AI sync?', a: 'Sub-second. The AI engine runs on dedicated clustered nodes providing instant answers.' },
    { q: 'Can I integrate brokers?', a: 'Broker connections are actively being built. Currently functions as an unattached tracking oracle.' },
  ];

  return (
    <section className="py-24 bg-background border-b-[var(--border-width)] border-border">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-black mb-16 text-center uppercase tracking-tighter shadow-none">Interrogation</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-24 px-6 bg-surface-hover border-t-[var(--border-width)] border-border">
      <div className="max-w-6xl mx-auto border-[var(--border-width)] border-border bg-accent p-12 md:p-24 text-center relative shadow-[20px_20px_0px_0px_var(--shadow-color)]">
        <div className="relative z-10 w-full flex flex-col items-center">
          <h2 className="text-6xl md:text-8xl font-black text-text-base mb-8 uppercase tracking-tighter drop-shadow-[5px_5px_0px_var(--background)]">
            Initialize
          </h2>
          <p className="text-text-primary font-bold text-2xl md:text-3xl mb-12 max-w-2xl mx-auto border-[var(--border-width)] border-border p-4 bg-background shadow-[var(--shadow-block)]">
            Join the grid. Connect the data. Dominate the markets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 max-w-3xl w-full mx-auto bg-surface p-6 border-[var(--border-width)] border-border shadow-[var(--shadow-elevated)]">
            <Input 
              placeholder="ENTER SECURE EMAIL" 
              className="h-16 text-lg placeholder:text-text-muted/50 placeholder:font-black uppercase shadow-none border-[var(--border-width)] focus:-translate-y-0 focus:-translate-x-0" 
            />
            <Link to="/signup" className="shrink-0 w-full sm:w-auto">
              <Button className="h-16 w-full px-12 text-xl bg-primary text-text-base hover:bg-primary-hover shadow-[var(--shadow-block)]">
                DEPLOY
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-24 pb-12 bg-surface border-t-[var(--border-width)] border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16 border-b-[var(--border-width)] border-border pb-16">
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-2 mb-6 pointer-events-none">
              <div className="w-12 h-12 bg-primary border-[var(--border-width)] border-border flex items-center justify-center">
                <TrendingUp className="text-white w-8 h-8 stroke-[4]" />
              </div>
              <span className="text-4xl font-black tracking-tighter uppercase text-text-primary">InvestIQ</span>
            </Link>
            <p className="text-text-muted font-bold text-xl uppercase leading-tight border-l-[var(--border-width)] border-primary pl-4 py-2">
              Hard data. Solid interfaces. No compromise. Built for operators.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-black uppercase text-xl mb-6 text-primary tracking-widest">Network</h4>
              <ul className="space-y-4 font-bold text-sm uppercase">
                <li className="hover:text-primary cursor-pointer hover:ml-2 transition-all">About Source</li>
                <li className="hover:text-primary cursor-pointer hover:ml-2 transition-all">Specs</li>
                <li className="hover:text-primary cursor-pointer hover:ml-2 transition-all">Pricing Model</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black uppercase text-xl mb-6 text-accent tracking-widest">Protocols</h4>
              <ul className="space-y-4 font-bold text-sm uppercase">
                <li className="hover:text-accent cursor-pointer hover:ml-2 transition-all">Privacy Rule</li>
                <li className="hover:text-accent cursor-pointer hover:ml-2 transition-all">Terms of Use</li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 border-[var(--border-width)] border-border bg-background p-4 flex flex-col items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all text-text-primary cursor-pointer">
              <span className="font-black tracking-widest uppercase">Connect</span>
              <div className="flex gap-4">
                <Twitter className="w-6 h-6 stroke-[3]" />
                <Github className="w-6 h-6 stroke-[3]" />
                <Linkedin className="w-6 h-6 stroke-[3]" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 text-center font-black uppercase tracking-widest text-text-muted border-border border-[2px] py-2 mx-auto max-w-lg shadow-[4px_4px_0px_var(--shadow-color)] transform -rotate-1">
          <p>VERIFIED ✓ 2026 INVESTIQ SECURE SYSTEMS.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page ---

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white font-sans overflow-x-hidden">
      {/* Heavy Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-2 bg-primary z-[60] origin-left border-b-[2px] border-border" 
        style={{ scaleX }} 
      />

      <Navbar />
      
      <main className="mt-24 sm:mt-20">
        <Hero />
        <Features />
        <DashboardPreview />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
