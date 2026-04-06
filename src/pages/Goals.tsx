import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Calendar, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Card, Button, Dialog, Input } from '@/components/ui/Common';
import { useStore, Goal } from '@/store/useStore';
import { cn, formatCurrency, convertValue } from '@/lib/utils';
import { toast } from 'sonner';
import { goalsApi } from '@/services/api';

const EMOJI_OPTIONS = ['🎯', '🚗', '🏠', '👴', '🎓', '💎', '✈️', '🏖️', '💻', '📱', '🎮', '🏋️', '💰', '🎉', '🧳', '📦'];

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
        goals: state.goals.filter(g => g.id !== goalId),
      }));
      toast.success(`"${goalTitle}" goal deleted`);
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
          <p className="text-text-muted mt-1">Track your progress towards major life milestones.</p>
        </div>
        <Button className="gap-2" onClick={openCreateDialog}>
          <Plus className="w-4 h-4" />
          Create Goal
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
          const remaining = goal.target - goal.current;
          const monthsLeft = goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : 0;
          const yearsLeft = (monthsLeft / 12).toFixed(1);

          return (
            <Card 
              key={goal.id} 
              className="group cursor-pointer relative"
              onClick={() => openEditDialog(goal)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-surface-elevated rounded-xl flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors">
                  {goal.icon}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-danger/10 hover:text-danger rounded-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(goal.id, goal.title);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-1">{goal.title}</h3>
              <p className="text-sm text-text-muted mb-6 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Target: {formatCurrency(convertValue(goal.target, goal.baseCurrency, user?.currency || 'INR'), user?.currency)}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text-secondary">Progress</span>
                  <span className="font-bold text-primary">{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{formatCurrency(convertValue(goal.current, goal.baseCurrency, user?.currency || 'INR'), user?.currency)} saved</span>
                  <span>{formatCurrency(convertValue(Math.max(remaining, 0), goal.baseCurrency, user?.currency || 'INR'), user?.currency)} left</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-xs font-bold text-text-secondary">{formatCurrency(convertValue(goal.monthlyContribution, goal.baseCurrency, user?.currency || 'INR'), user?.currency)}/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-text-muted" />
                  <span className="text-xs font-bold text-text-secondary">Est. {yearsLeft} years</span>
                </div>
              </div>
            </Card>
          );
        })}

        <button 
          onClick={openCreateDialog}
          className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <p className="font-bold text-text-secondary group-hover:text-primary transition-all">Add New Goal</p>
          <p className="text-xs text-text-muted mt-1">Plan for your future today</p>
        </button>
      </div>

      {/* Create / Edit Goal Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); resetForm(); }}
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
                    "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                    formIcon === emoji 
                      ? "bg-primary/20 border-2 border-primary scale-110" 
                      : "bg-surface-elevated hover:bg-primary/10 border-2 border-transparent"
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
            </div>
          )}

          {/* Monthly Contribution */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Monthly Contribution ({user?.currency || 'INR'})
            </label>
            <Input
              type="number"
              placeholder={formTarget ? `Auto: ${Math.round(parseFloat(formTarget || '0') / 60)}` : 'Optional'}
              value={formMonthly}
              onChange={(e) => setFormMonthly(e.target.value)}
              min="0"
              step="100"
            />
            <p className="text-xs text-text-muted mt-1">
              Leave empty to auto-calculate based on a 5-year plan.
            </p>
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
                <span className="font-numbers font-bold">{formatCurrency(parseFloat(formTarget), user?.currency)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Monthly</span>
                <span className="font-numbers font-bold">
                  {formatCurrency(formMonthly ? parseFloat(formMonthly) : Math.round(parseFloat(formTarget) / 60), user?.currency)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Est. Duration</span>
                <span className="font-numbers font-bold">
                  {((parseFloat(formTarget) / (formMonthly ? parseFloat(formMonthly) : Math.round(parseFloat(formTarget) / 60))) / 12).toFixed(1)} years
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => { setIsDialogOpen(false); resetForm(); }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSave}
            >
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
