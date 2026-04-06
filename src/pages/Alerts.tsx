import React, { useState } from 'react';
import { Bell, BellOff, Info, AlertTriangle, CheckCircle, Plus, Trash2, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, Button, Dialog, Input } from '@/components/ui/Common';
import { useStore, AlertItem } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STOCK_OPTIONS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
  'AAPL', 'MSFT', 'TSLA', 'GOOGL', 'NVDA', 'SPY',
];

const ALERT_TYPE_CONFIG = {
  price_above: {
    label: 'Price Above',
    icon: TrendingUp,
    color: 'text-success',
    bg: 'bg-success/10',
    description: 'Alert when price goes above target',
  },
  price_below: {
    label: 'Price Below',
    icon: TrendingDown,
    color: 'text-danger',
    bg: 'bg-danger/10',
    description: 'Alert when price drops below target',
  },
  percent_change: {
    label: '% Change',
    icon: BarChart3,
    color: 'text-warning',
    bg: 'bg-warning/10',
    description: 'Alert on percentage change',
  },
};

export default function Alerts() {
  const { alerts, addAlert, removeAlert } = useStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSymbol, setFormSymbol] = useState('AAPL');
  const [formAlertType, setFormAlertType] = useState<'price_above' | 'price_below' | 'percent_change'>('price_above');
  const [formTargetValue, setFormTargetValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormName('');
    setFormSymbol('AAPL');
    setFormAlertType('price_above');
    setFormTargetValue('');
  };

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast.error('Please enter an alert name');
      return;
    }
    if (!formTargetValue || isNaN(parseFloat(formTargetValue)) || parseFloat(formTargetValue) <= 0) {
      toast.error('Please enter a valid target value');
      return;
    }

    setIsSubmitting(true);
    try {
      await addAlert({
        name: formName.trim(),
        symbol: formSymbol,
        alertType: formAlertType,
        targetValue: parseFloat(formTargetValue),
        isActive: true,
      });
      toast.success(`Alert "${formName}" created`);
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    removeAlert(id);
    toast.success(`Alert "${name}" deleted`);
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-text-muted mt-1">Stay updated with price movements and account activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2">
            <BellOff className="w-4 h-4" />
            Mute All
          </Button>
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Alert
          </Button>
        </div>
      </header>

      {alerts.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="font-bold text-lg mb-2">No alerts yet</h3>
          <p className="text-sm text-text-muted max-w-[300px] mb-6">
            Create price alerts to get notified when your favorite stocks hit your target.
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Your First Alert
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const config = ALERT_TYPE_CONFIG[alert.alertType];
            const IconComponent = config.icon;

            return (
              <Card key={alert.id} className="p-4 flex gap-4 items-start group transition-all">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  config.bg
                )}>
                  <IconComponent className={cn("w-5 h-5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm">{alert.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                        config.bg, config.color
                      )}>
                        {config.label}
                      </span>
                      <span className="text-[10px] text-text-muted font-medium">
                        {alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {alert.alertType === 'price_above' && `Alert when ${alert.symbol} goes above $${alert.targetValue}`}
                    {alert.alertType === 'price_below' && `Alert when ${alert.symbol} drops below $${alert.targetValue}`}
                    {alert.alertType === 'percent_change' && `Alert when ${alert.symbol} changes by ${alert.targetValue}%`}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-bold bg-surface-elevated px-2 py-1 rounded">{alert.symbol}</span>
                    <span className="text-xs text-text-muted">Target: {alert.targetValue}</span>
                  </div>
                </div>
                <button 
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-danger/10 hover:text-danger rounded-lg transition-all shrink-0"
                  onClick={() => handleDelete(alert.id, alert.name)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Alert Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); resetForm(); }}
        title="Create Alert"
      >
        <div className="space-y-5">
          {/* Alert Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Alert Name</label>
            <Input
              type="text"
              placeholder="e.g., AAPL Target Hit"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Stock Symbol */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Stock / Asset</label>
            <div className="grid grid-cols-4 gap-2">
              {STOCK_OPTIONS.map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setFormSymbol(sym)}
                  className={cn(
                    "py-2 rounded-lg text-xs font-bold border transition-all",
                    formSymbol === sym 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-surface border-border text-text-muted hover:border-text-muted"
                  )}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Type */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Alert Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ALERT_TYPE_CONFIG) as Array<keyof typeof ALERT_TYPE_CONFIG>).map((type) => {
                const config = ALERT_TYPE_CONFIG[type];
                const IconComponent = config.icon;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormAlertType(type)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                      formAlertType === type 
                        ? "bg-primary/10 border-primary" 
                        : "bg-surface border-border hover:border-text-muted"
                    )}
                  >
                    <IconComponent className={cn("w-5 h-5", formAlertType === type ? "text-primary" : "text-text-muted")} />
                    <span className={cn(
                      "text-[10px] font-bold",
                      formAlertType === type ? "text-primary" : "text-text-muted"
                    )}>
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Value */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {formAlertType === 'percent_change' ? 'Percentage (%)' : 'Target Price ($)'}
            </label>
            <Input
              type="number"
              placeholder={formAlertType === 'percent_change' ? 'e.g., 5' : 'e.g., 200'}
              value={formTargetValue}
              onChange={(e) => setFormTargetValue(e.target.value)}
              min="0"
              step={formAlertType === 'percent_change' ? '0.1' : '1'}
            />
          </div>

          {/* Preview */}
          {formName && formTargetValue && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border/50">
              <p className="text-sm text-text-secondary">
                {formAlertType === 'price_above' && `🔔 You'll be alerted when ${formSymbol} goes above $${formTargetValue}`}
                {formAlertType === 'price_below' && `🔔 You'll be alerted when ${formSymbol} drops below $${formTargetValue}`}
                {formAlertType === 'percent_change' && `🔔 You'll be alerted when ${formSymbol} changes by ${formTargetValue}%`}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => { setIsCreateOpen(false); resetForm(); }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Alert'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
