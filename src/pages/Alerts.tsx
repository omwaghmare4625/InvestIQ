import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  Info,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from 'lucide-react';
import { Card, Button, Dialog, Input } from '@/components/ui/Common';
import { useStore, AlertItem } from '@/store/useStore';
import { cn, formatCurrency, getCurrencySymbol } from '@/lib/utils';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const STOCK_OPTIONS = [
  'RELIANCE',
  'TCS',
  'HDFCBANK',
  'INFY',
  'ICICIBANK',
  'AAPL',
  'MSFT',
  'TSLA',
  'GOOGL',
  'NVDA',
  'SPY',
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
  const { alerts, addAlert, removeAlert, user } = useStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSymbol, setFormSymbol] = useState('AAPL');
  const [formAlertType, setFormAlertType] = useState<
    'price_above' | 'price_below' | 'percent_change'
  >('price_above');
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
    if (
      !formTargetValue ||
      isNaN(parseFloat(formTargetValue)) ||
      parseFloat(formTargetValue) <= 0
    ) {
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
    <motion.div
      className="space-y-12 pb-20"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-normal text-text-primary mb-2">
            Tactical Monitors
          </h1>
          <p className="text-text-dim text-sm font-medium text-text-muted">
            Alerts & Notifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="gap-2.5 px-6 py-5 bg-surface-elevated border border-border text-text-primary hover:bg-surface-hover rounded-md"
            onClick={() => toast.info('Universal suppression coming soon')}
          >
            <BellOff className="w-4 h-4" />
            <span className="text-[10px] font-semibold tracking-wide">Universal Suppression</span>
          </Button>
          <Button
            className="gap-2.5 px-8 py-5 bg-primary text-background hover:shadow-glow rounded-md"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-semibold tracking-wide">Initialize Monitor</span>
          </Button>
        </div>
      </header>

      {alerts.length === 0 ? (
        <Card className="p-24 flex flex-col items-center justify-center text-center glass-card border-border bg-surface-low/30 backdrop-blur-3xl shadow-glow-sm">
          <div className="w-20 h-20 bg-surface-elevated border border-border rounded-full flex items-center justify-center mb-10 opacity-50 shadow-glow-sm">
            <Bell className="w-10 h-10 text-text-dim" />
          </div>
          <h3 className="font-display font-semibold text-text-primary mb-4 tracking-wide text-sm">
            No Active Surveillance
          </h3>
          <p className="text-[14px] text-text-dim/50 max-w-[340px] font-medium leading-relaxed mb-10">
            Define tactical thresholds. Initialize your first telemetry bridge to monitor asset
            trajectory benchmarks.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2.5 px-10 py-6 bg-primary text-background rounded-md"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-semibold tracking-wide">Deploy First Monitor</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {alerts.map((alert) => {
            const config = ALERT_TYPE_CONFIG[alert.alertType];
            const IconComponent = config.icon;

            return (
              <Card
                key={alert.id}
                className="p-6 flex gap-6 items-start group glass-card border-border bg-surface-low/20 backdrop-blur-3xl hover:bg-surface-low/30 hover:border-border transition-all duration-300"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-border',
                    config.bg
                  )}
                >
                  <IconComponent className={cn('w-6 h-6', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-medium text-sm tracking-normal text-text-primary">
                      {alert.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          'text-[9px] font-semibold tracking-wide px-3 py-1 rounded-sm border',
                          config.bg,
                          config.color,
                          'border-current/10'
                        )}
                      >
                        {config.label}
                      </span>
                      <span className="text-[10px] text-text-dim/30 font-semibold tracking-wide">
                        {alert.createdAt
                          ? new Date(alert.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : ''}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] text-text-dim/80 leading-relaxed font-medium">
                    {alert.alertType === 'price_above' &&
                      `Tactical trigger active for ${alert.symbol} exceeding ${formatCurrency(alert.targetValue, user?.currency)} baseline.`}
                    {alert.alertType === 'price_below' &&
                      `Tactical trigger active for ${alert.symbol} cascading below ${formatCurrency(alert.targetValue, user?.currency)} baseline.`}
                    {alert.alertType === 'percent_change' &&
                      `Tactical trigger active for ${alert.symbol} volatility exceeding ${alert.targetValue}% threshold.`}
                  </p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold text-text-dim/40 tracking-wide">
                        Identity:
                      </span>
                      <span className="text-[11px] font-display font-semibold text-text-primary">
                        {alert.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold text-text-dim/40 tracking-wide">
                        Baseline:
                      </span>
                      <span className="text-[11px] font-display font-semibold text-tertiary">
                        {alert.targetValue}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="p-3 opacity-0 group-hover:opacity-100 bg-surface-elevated border border-border hover:bg-danger/10 hover:text-danger hover:border-danger/30 rounded-md transition-all duration-300 shrink-0"
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
        onClose={() => {
          setIsCreateOpen(false);
          resetForm();
        }}
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
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Stock / Asset
            </label>
            <select
              value={formSymbol}
              onChange={(e) => setFormSymbol(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
            >
              {STOCK_OPTIONS.map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          </div>

          {/* Alert Type */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Alert Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ALERT_TYPE_CONFIG) as Array<keyof typeof ALERT_TYPE_CONFIG>).map(
                (type) => {
                  const config = ALERT_TYPE_CONFIG[type];
                  const IconComponent = config.icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormAlertType(type)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all',
                        formAlertType === type
                          ? 'bg-primary/10 border-primary'
                          : 'bg-surface border-border hover:border-text-muted'
                      )}
                    >
                      <IconComponent
                        className={cn(
                          'w-5 h-5',
                          formAlertType === type ? 'text-primary' : 'text-text-muted'
                        )}
                      />
                      <span
                        className={cn(
                          'text-[10px] font-bold',
                          formAlertType === type ? 'text-primary' : 'text-text-muted'
                        )}
                      >
                        {config.label}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Target Value */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {formAlertType === 'percent_change'
                ? 'Percentage (%)'
                : `Target Price (${getCurrencySymbol(user?.currency || 'INR')})`}
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
                {formAlertType === 'price_above' &&
                  `🔔 You'll be alerted when ${formSymbol} goes above ${formatCurrency(formTargetValue, user?.currency)}`}
                {formAlertType === 'price_below' &&
                  `🔔 You'll be alerted when ${formSymbol} drops below ${formatCurrency(formTargetValue, user?.currency)}`}
                {formAlertType === 'percent_change' &&
                  `🔔 You'll be alerted when ${formSymbol} changes by ${formTargetValue}%`}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
              }}
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
    </motion.div>
  );
}
