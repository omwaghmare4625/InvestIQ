import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { TrendingUp, Mail, Lock, ArrowRight, Github, User } from 'lucide-react';
import { Button, Input, Card } from '@/components/landing/UI';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Signup() {
  const navigate = useNavigate();
  const signup = useStore((state) => state.signup);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [currency, setCurrency] = React.useState<'INR' | 'USD'>('INR');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(email, name, password, currency);
      toast.success('Account created successfully! Welcome to InvestIQ.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Invest<span className="text-primary">IQ</span></span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-text-muted">Join 50,000+ investors today</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                leftIcon={<User className="w-4 h-4" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Preferred Currency</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={cn(
                    "px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all",
                    currency === 'INR' ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-border/80 text-text-muted"
                  )}
                >
                  ₹ Rupees (INR)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={cn(
                    "px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all",
                    currency === 'USD' ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-border/80 text-text-muted"
                  )}
                >
                  $ Dollars (USD)
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-text-muted">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" leftIcon={<Github className="w-4 h-4" />}>
              GitHub
            </Button>
            <Button variant="outline" className="w-full" leftIcon={<TrendingUp className="w-4 h-4" />}>
              Google
            </Button>
          </div>
        </Card>

        <p className="text-center mt-8 text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
