import { Navigate, Link } from 'react-router';
import { useStore } from '@/store/useStore';
import intelligencePreview from '@/image/d1dad215-038c-42e2-9e3e-9b74a81237eb-clean.png';

// Modular Components
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { FeatureStack } from '@/components/landing/FeatureStack';
import { Pricing } from '@/components/landing/Pricing';
import { Terminal } from '@/components/landing/Terminal';

export default function Landing() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="dark min-h-screen text-text-primary relative bg-background selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* ── Navigation ──────────────────────────────────── */}
      <Navbar />

      <main className="relative z-10">
        {/* ── Hero Section ────────────────────────────────── */}
        <Hero />

        {/* ── Professional Data Section ───────────────────── */}
        <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-y border-border/50 bg-surface-low/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-sans text-[clamp(2rem,4vw,3rem)] leading-tight text-text-primary font-bold mb-8 tracking-tight">
                Advanced <br />
                Market Intelligence.
              </h2>
              <p className="text-base font-normal text-text-dim leading-relaxed max-w-md mb-10">
                Our AI analyzes millions of market data points per second, 
                delivering actionable insights and identifying opportunities 
                before they reach the mainstream.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time Market Analysis',
                  'Predictive Risk Modeling',
                  'Institutional Grade Data'
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-xs font-medium tracking-wide text-primary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative p-2 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
              <img
                src={intelligencePreview}
                alt="Market Intelligence Visualizer"
                className="w-full h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </section>

        {/* ── Terminal Experience ─────────────────────────── */}
        <Terminal />

        {/* ── Core Value Props ────────────────────────────── */}
        <FeatureStack />

        {/* ── Pricing & Membership ────────────────────────── */}
        <Pricing />

        {/* ── Final Call to Action ────────────────────────── */}
        <section className="py-32 px-6 text-center relative">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-sans text-[clamp(2.5rem,5vw,4.5rem)] leading-tight text-text-primary font-bold mb-8 tracking-tight">
              Institutional Power <br />
              <span className="text-text-dim">In Your Hands.</span>
            </h2>
            <p className="text-lg font-normal text-text-dim mb-12 max-w-xl mx-auto">
              Join thousands of sophisticated investors using AI to build and protect their wealth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="btn-premium px-10 py-4 text-sm font-semibold tracking-wide w-full sm:w-auto text-center">
                GET STARTED NOW
              </Link>
              <button className="px-10 py-4 rounded-lg border border-border text-sm font-semibold text-text-primary hover:bg-surface-elevated transition-all w-full sm:w-auto">
                VIEW DOCUMENTATION
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="py-16 px-8 border-t border-border bg-surface-lowest">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="InvestIQ" className="w-8 h-8 object-contain" />
            <span className="text-sm font-bold tracking-tight text-text-primary">
              INVEST<span className="text-primary">IQ</span>
            </span>
          </div>
          
          <div className="flex justify-center gap-8 text-xs font-medium text-text-dim">
            <button className="hover:text-primary transition-colors">TERMS</button>
            <button className="hover:text-primary transition-colors">PRIVACY</button>
            <button className="hover:text-primary transition-colors">SECURITY</button>
          </div>
          
          <div className="text-right text-[10px] font-mono text-text-dim/50 tracking-widest uppercase">
            Built for Precision — v4.2.0
          </div>
        </div>
      </footer>
    </div>
  );
}
