import { motion, useScroll } from 'motion/react';
import { Link } from 'react-router';
import React from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Markets', href: '#markets' },
  { label: 'Intelligence', href: '#platform' },
  { label: 'Pricing', href: '#membership' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const unsub = scrollY.on('change', (y) => setScrolled(y > 20));
    return unsub;
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.png" 
            alt="InvestIQ Logo" 
            className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105" 
          />
          <span className="text-lg font-bold tracking-tight text-text-primary">
            Invest<span className="text-primary">IQ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-bold tracking-wider text-text-dim hover:text-primary uppercase transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/login">
            <button className="text-xs font-bold tracking-wider text-text-dim hover:text-text-primary uppercase transition-colors">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-5 py-2.5 bg-primary text-white text-xs font-bold tracking-wider uppercase rounded-lg hover:bg-primary-hover transition-all shadow-sm">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={cn('w-5 h-0.5 bg-text-primary transition-all duration-300', isOpen && 'rotate-45 translate-y-2')} />
          <span className={cn('w-5 h-0.5 bg-text-primary transition-all duration-300', isOpen && 'opacity-0')} />
          <span className={cn('w-5 h-0.5 bg-text-primary transition-all duration-300', isOpen && '-rotate-45 -translate-y-2')} />
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden bg-surface border-t border-border px-6 py-8 flex flex-col gap-6 shadow-xl"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold tracking-wide text-text-muted hover:text-primary uppercase"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-6 border-t border-border flex flex-col gap-4">
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <button className="w-full text-left text-sm font-bold text-text-dim uppercase tracking-wide">
                Login
              </button>
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-primary py-4 text-sm font-bold text-white uppercase tracking-wider rounded-lg">
                Get Started
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
