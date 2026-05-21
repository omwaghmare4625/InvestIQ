import React, { Component } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button, Card } from '@/components/ui/Common';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = { hasError: false, error: undefined };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-danger/20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-text-muted text-sm mb-6 max-w-[280px]">
              We hit an unexpected snag while loading this page. Our team has been notified.
            </p>

            <div className="flex gap-3 w-full justify-center">
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
