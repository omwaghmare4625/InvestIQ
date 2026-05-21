import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Calendar, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Card, Button, Dialog, Input } from '@/components/ui/Common';
import { useStore, Goal } from '@/store/useStore';
import { cn, formatCurrency, convertValue } from '@/lib/utils';
import { toast } from 'sonner';
import { goalsApi } from '@/services/api';
import { motion } from 'motion/react';

const EMOJI_OPTIONS = [
  '🎯',
  '🚗',
  '🏠',
  '👴',
  '🎓',
  '💎',
  '✈️',
  '🏖️',
  '💻',
  '📱',
  '🎮',
  '🏋️',
  '💰',
  '🎉',
  '🧳',
  '📦',
];

export default function Goals() {
  const { user, goals, addGoal, updateGoal } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [formIcon, setFormIcon] = useState('🎯');
  const [formCurrent, setFormCurrent] = useState('0');
  const [formMonthly, setFormMonthly] = useState('');

  const resetForm = () => {
    setFormTitle('');
    setFormTarget('');
    setFormIcon('🎯');
    setFormCurrent('0');
    setFormMonthly('');
    setEditingGoal(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormTarget(goal.target.toString());
    setFormIcon(goal.icon);
    setFormCurrent(goal.current.toString());
    setFormMonthly(goal.monthlyContribution.toString());
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error('Please enter a goal name');
      return;
    }

    const target = parseFloat(formTarget);
    if (isNaN(target) || target <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }

    const current = parseFloat(formCurrent) || 0;
    const monthly = formMonthly ? parseFloat(formMonthly) : Math.round(target / 60);

    if (editingGoal) {
      // Update existing goal
      const updatedGoal: Goal = {
        ...editingGoal,
        title: formTitle.trim(),
        target,
        icon: formIcon,
        current,
        monthlyContribution: monthly,
      };
      updateGoal(updatedGoal);
      toast.success(`"${formTitle}" goal updated`);
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: Math.random().toString(36).substr(2, 9),
        title: formTitle.trim(),
        target,
        current,
        monthlyContribution: monthly,
        icon: formIcon,
        baseCurrency: user?.currency || 'INR',
      };
      addGoal(newGoal);
      toast.success(`"${formTitle}" goal created`);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (goalId: string, goalTitle: string) => {
    try {
      await goalsApi.delete(goalId);
      // Remove from local state by forcing a re-render through hydration
      useStore.setState((state) => ({
        goals: state.goals.filter((g) => g.id !== goalId),
      }));
      toast.success(`"${goalTitle}" goal deleted`);
    } catch (error) {
      toast.error('Failed to delete goal');
    }
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
            Strategy Map
          </h1>
          <p className="text-text-dim text-sm font-medium text-text-muted">Financial Goals</p>
        </div>
        <Button
          className="gap-2.5 px-8 py-6 bg-primary text-background hover:shadow-glow transition-all duration-300 rounded-md"
          onClick={openCreateDialog}
        >
          <Plus className="w-4 h-4" />
          <span className="text-[10px] font-semibold tracking-wide">Map New Utility</span>
        </Button>
      </header>

      {goals.length === 0 ? (
        <Card className="p-24 flex flex-col items-center justify-center text-center glass-card border-border bg-surface-low/30 backdrop-blur-3xl shadow-glow-sm">
          <div className="w-20 h-20 bg-surface-elevated border border-border rounded-full flex items-center justify-center mb-10 opacity-50 shadow-glow-sm">
            <Target className="w-10 h-10 text-text-dim" />
          </div>
          <h3 className="font-display font-semibold text-text-primary mb-4 tracking-wide text-sm">
            No Active Projections
          </h3>
          <p className="text-[14px] text-text-dim/50 max-w-[340px] font-medium leading-relaxed mb-10">
            Define your financial synthesis. Initialize your first wealth trajectory to begin
            monitoring capital accrual.
          </p>
          <Button
            onClick={openCreateDialog}
            className="gap-2.5 px-10 py-6 bg-primary text-background rounded-md"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-semibold tracking-wide">
              Initialize First Trajectory
            </span>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.map((goal) => {
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            const remaining = goal.target - goal.current;
            const monthsLeft =
              goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : 0;
            const yearsLeft = (monthsLeft / 12).toFixed(1);

            return (
              <Card
                key={goal.id}
                className="group cursor-pointer relative p-8 glass-card border-border bg-surface-low/20 backdrop-blur-2xl transition-all duration-500 hover:bg-surface-low/40 hover:border-primary/20"
                onClick={() => openEditDialog(goal)}
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="w-14 h-14 bg-surface-elevated border border-border rounded-xl flex items-center justify-center text-3xl group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
                    {goal.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-3 opacity-0 group-hover:opacity-100 bg-surface-elevated border border-border hover:bg-danger/10 hover:text-danger hover:border-danger/30 rounded-md transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            `Purge "${goal.title}" trajectory? Data will be non-retrievable.`
                          )
                        ) {
                          handleDelete(goal.id, goal.title);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-3 opacity-0 group-hover:opacity-100 bg-surface-elevated border border-border hover:text-primary hover:border-primary/30 rounded-md transition-all duration-300">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-display font-semibold text-text-primary tracking-normal mb-2">
                  {goal.title}
                </h3>
                <p className="text-[10px] font-semibold text-text-dim/40 tracking-wide mb-8 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" />
                  Threshold:{' '}
                  {formatCurrency(
                    convertValue(goal.target, goal.baseCurrency, user?.currency || 'INR'),
                    user?.currency
                  )}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-wide text-text-dim">
                      Analysis Rate
                    </span>
                    <span className="text-sm font-display font-semibold text-primary">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000 shadow-glow-sm"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-text-primary/80">
                      {formatCurrency(
                        convertValue(goal.current, goal.baseCurrency, user?.currency || 'INR'),
                        user?.currency
                      )}{' '}
                      Accrued
                    </span>
                    <span className="text-text-dim/40">
                      {formatCurrency(
                        convertValue(
                          Math.max(remaining, 0),
                          goal.baseCurrency,
                          user?.currency || 'INR'
                        ),
                        user?.currency
                      )}{' '}
                      Gap
                    </span>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-tertiary" />
                    <span className="text-[10px] font-semibold tracking-wide text-text-primary/90">
                      {formatCurrency(
                        convertValue(
                          goal.monthlyContribution,
                          goal.baseCurrency,
                          user?.currency || 'INR'
                        ),
                        user?.currency
                      )}{' '}
                      / Velocity
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-text-dim/40" />
                    <span className="text-[10px] font-semibold tracking-wide text-text-primary/90">
                      E.T.A {yearsLeft} Cycles
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}

          <button
            onClick={openCreateDialog}
            className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-border hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 group"
          >
            <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-[11px] font-semibold tracking-wide text-text-dim group-hover:text-text-primary transition-all">
              Initialize New Vector
            </p>
            <p className="text-[9px] font-medium text-text-dim/30 mt-2 tracking-wide leading-relaxed text-center max-w-[160px]">
              Strategize for future capital allocation
            </p>
          </button>
        </div>
      )}

      {/* Create / Edit Goal Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
      >
        <div className="space-y-5">
          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Goal Icon</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormIcon(emoji)}
                  className={cn(
                    'w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all',
                    formIcon === emoji
                      ? 'bg-primary/20 border-2 border-primary scale-110'
                      : 'bg-surface-elevated hover:bg-primary/10 border-2 border-transparent'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Goal Name</label>
            <Input
              type="text"
              placeholder="e.g., Dream Home, New Car, Vacation..."
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Target Amount ({user?.currency || 'INR'})
            </label>
            <Input
              type="number"
              placeholder="e.g., 1000000"
              value={formTarget}
              onChange={(e) => setFormTarget(e.target.value)}
              min="1"
              step="1000"
            />
            {formTarget && !isNaN(parseFloat(formTarget)) && (
              <p className="text-xs text-primary mt-1.5 font-bold font-numbers tracking-normal pl-1">
                = {formatCurrency(parseFloat(formTarget), user?.currency)}
              </p>
            )}
          </div>

          {/* Current Savings (only shown when editing) */}
          {editingGoal && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Current Savings ({user?.currency || 'INR'})
              </label>
              <Input
                type="number"
                placeholder="Amount saved so far"
                value={formCurrent}
                onChange={(e) => setFormCurrent(e.target.value)}
                min="0"
                step="1000"
              />
              {formCurrent && !isNaN(parseFloat(formCurrent)) && (
                <p className="text-xs text-primary mt-1.5 font-bold font-numbers tracking-normal pl-1">
                  = {formatCurrency(parseFloat(formCurrent), user?.currency)}
                </p>
              )}
            </div>
          )}

          {/* Monthly Contribution */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Monthly Contribution ({user?.currency || 'INR'})
            </label>
            <Input
              type="number"
              placeholder={
                formTarget ? `Auto: ${Math.round(parseFloat(formTarget || '0') / 60)}` : 'Optional'
              }
              value={formMonthly}
              onChange={(e) => setFormMonthly(e.target.value)}
              min="0"
              step="100"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-text-muted">
                Leave empty to auto-calculate based on a 5-year plan.
              </p>
              {formMonthly && !isNaN(parseFloat(formMonthly)) && (
                <p className="text-xs text-primary font-bold font-numbers tracking-normal">
                  = {formatCurrency(parseFloat(formMonthly), user?.currency)}
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          {formTarget && parseFloat(formTarget) > 0 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border/50 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{formIcon}</span>
                <span className="font-bold">{formTitle || 'Your Goal'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Target</span>
                <span className="font-numbers font-bold">
                  {formatCurrency(parseFloat(formTarget), user?.currency)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Monthly</span>
                <span className="font-numbers font-bold">
                  {formatCurrency(
                    formMonthly ? parseFloat(formMonthly) : Math.round(parseFloat(formTarget) / 60),
                    user?.currency
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Est. Duration</span>
                <span className="font-numbers font-bold">
                  {(
                    parseFloat(formTarget) /
                    (formMonthly
                      ? parseFloat(formMonthly)
                      : Math.round(parseFloat(formTarget) / 60)) /
                    12
                  ).toFixed(1)}{' '}
                  years
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSave}>
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </div>
      </Dialog>
    </motion.div>
  );
}
