import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Plus,
  Settings,
  MoreHorizontal,
  TrendingUp,
  Wallet,
  PieChart as PieIcon,
  ArrowUpRight,
  History,
  ArrowDownRight,
  Eye,
  Pencil,
} from 'lucide-react';
import { Card, Button, Dialog, Input } from '@/components/ui/Common';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency, convertValue } from '@/lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];
export default function Portfolio() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const portfolio = useStore((state) => state.portfolio);
  const balance = useStore((state) => state.balance);
  const transactions = useStore((state) => state.transactions);
  const addFunds = useStore((state) => state.addFunds);
  const updateHoldingQty = useStore((state) => state.updateHoldingQty);


  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('10000');

  // Edit holding state
  const [isEditHoldingOpen, setIsEditHoldingOpen] = useState(false);
  const [editSymbol, setEditSymbol] = useState('');
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');

  const { totalValue, totalCost, totalPL, plPercent } = React.useMemo(() => {
    if (!user) return { totalValue: 0, totalCost: 0, totalPL: 0, plPercent: 0 };

    const totalValue = portfolio.reduce(
      (acc, item) =>
        acc + item.qty * convertValue(item.currentPrice, item.baseCurrency, user.currency),
      0
    );
    const totalCost = portfolio.reduce(
      (acc, item) => acc + item.qty * convertValue(item.avgCost, item.baseCurrency, user.currency),
      0
    );
    const totalPL = totalValue - totalCost;
    const plPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

    return { totalValue, totalCost, totalPL, plPercent };
  }, [portfolio, user]);

  const dynamicAllocationData = React.useMemo(() => {
    if (portfolio.length === 0 || !user) {
      return [{ name: 'No Assets', value: 100, color: '#2A3657' }];
    }

    const sorted = [...portfolio].sort((a, b) => {
      const valA = a.qty * convertValue(a.currentPrice, a.baseCurrency, user.currency);
      const valB = b.qty * convertValue(b.currentPrice, b.baseCurrency, user.currency);
      return valB - valA;
    });

    return sorted.map((item, idx) => {
      const val = item.qty * convertValue(item.currentPrice, item.baseCurrency, user.currency);
      return {
        name: item.symbol,
        value: Number(((val / (totalValue || 1)) * 100).toFixed(1)),
        color: COLORS[idx % COLORS.length],
      };
    });
  }, [portfolio, totalValue, user]);

  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (!isNaN(amount) && amount > 0) {
      addFunds(amount);
      toast.success(`${formatCurrency(amount, user?.currency)} infused`, {
        description: 'Asset liquidity re-initialized',
      });
      setIsAddFundsOpen(false);
      setFundAmount('10000');
    } else {
      toast.error('Invalid amount', { description: 'Please enter a valid amount' });
    }
  };

  const openEditHolding = (symbol: string, name: string, currentQty: number) => {
    setEditSymbol(symbol);
    setEditName(name);
    setEditQty(currentQty.toString());
    setIsEditHoldingOpen(true);
  };

  const handleUpdateHolding = () => {
    const qty = parseInt(editQty);
    if (isNaN(qty) || qty < 0) {
      toast.error('Invalid quantity', { description: 'Please enter a valid number (0 or more)' });
      return;
    }
    updateHoldingQty(editSymbol, qty);
    if (qty === 0) {
      toast.success('Asset liquidated', { description: `${editSymbol} position closed` });
    } else {
      toast.success('Vector adjusted', {
        description: `${editSymbol} quantity re-indexed to ${qty}`,
      });
    }
    setIsEditHoldingOpen(false);
  };

  if (!user) return null;

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
            Wealth Portfolio
          </h1>
          <p className="text-text-dim text-sm font-medium text-text-muted">Asset Management</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-semibold text-text-dim tracking-wide mb-1">
              Liquid Capital
            </p>
            <p className="text-2xl font-display font-semibold text-primary tracking-normal">
              {formatCurrency(balance, user?.currency)}
            </p>
          </div>
          <Button
            className="gap-2.5 px-6 py-6 bg-primary text-background hover:shadow-glow transition-all duration-300 rounded-md"
            onClick={() => setIsAddFundsOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-semibold tracking-wide">Infuse Capital</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 flex flex-col justify-center p-10 glass-card bg-surface-low/30 backdrop-blur-3xl border-border shadow-glow">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-glow-sm">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-semibold text-text-dim tracking-wide">
              Aggregate Assets
            </span>
          </div>
          <h2 className="text-5xl font-display font-semibold text-text-primary tracking-normal mb-6">
            {formatCurrency(totalValue, user?.currency)}
          </h2>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] font-semibold',
                totalPL >= 0
                  ? 'text-tertiary bg-tertiary/5 border border-tertiary/10'
                  : 'text-danger bg-danger/5 border border-danger/10'
              )}
            >
              {totalPL >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {formatCurrency(Math.abs(totalPL), user?.currency)} ({plPercent.toFixed(1)}%)
            </div>
            <span className="text-text-dim/40 text-[10px] font-semibold tracking-wide">
              Intrinsic Alpha
            </span>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-0 overflow-hidden glass-card border-border bg-surface-low/50 backdrop-blur-2xl">
          <div className="p-8 border-b border-border flex items-center justify-between bg-surface-hover">
            <h3 className="font-display font-semibold text-lg flex items-center gap-3 text-text-primary">
              <PieIcon className="w-5 h-5 text-primary" />
              Capital Allocation
            </h3>
            <button className="text-[10px] font-semibold tracking-wide text-text-dim hover:text-text-primary transition-colors">
              Analytical View
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center p-10 gap-12">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dynamicAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {dynamicAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131313',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '800' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-5">
              {dynamicAllocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-glow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] font-semibold tracking-wide text-text-dim/70 hover:text-text-primary transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-display font-semibold text-text-primary tracking-normal">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden glass-card border-border bg-surface-low/50 backdrop-blur-2xl">
        <div className="p-8 border-b border-border flex items-center justify-between bg-surface-hover">
          <h3 className="font-display font-semibold text-xl text-text-primary tracking-normal">
            Current Holdings
          </h3>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-surface-elevated border border-border rounded-md text-text-dim hover:text-text-primary transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Premium Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-text-dim text-[10px] font-semibold tracking-wide bg-surface-hover">
                <th className="py-6 px-10">Asset</th>
                <th className="py-6 px-8">Weight</th>
                <th className="py-6 px-8">Avg Cost</th>
                <th className="py-6 px-8">Current Price</th>
                <th className="py-6 px-8">Performance</th>
                <th className="py-6 px-8">Return</th>
                <th className="py-6 px-10 text-right">Deployment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {portfolio.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-8">
                      <div className="w-20 h-20 bg-surface-elevated border border-border rounded-full flex items-center justify-center opacity-50 shadow-glow-sm">
                        <Wallet className="w-10 h-10 text-text-dim" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-text-primary mb-2 tracking-wide text-xs">
                          No Vectors Initialized
                        </h4>
                        <p className="text-[13px] text-text-dim/50 max-w-[280px] font-medium leading-relaxed mx-auto">
                          Redeploy capital through the market dashboard to initialize
                          holdings.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-border text-[10px] font-semibold tracking-wide px-8 py-5"
                        onClick={() => navigate('/markets')}
                      >
                        Browse Markets
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                portfolio.map((item) => {
                  const currentVal =
                    item.qty * convertValue(item.currentPrice, item.baseCurrency, user.currency);
                  const costVal =
                    item.qty * convertValue(item.avgCost, item.baseCurrency, user.currency);
                  const pl = currentVal - costVal;
                  const ret = costVal > 0 ? (pl / costVal) * 100 : 0;

                  return (
                    <tr key={item.symbol} className="hover:bg-surface-elevated transition-colors group">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-surface-elevated rounded-lg border border-border flex items-center justify-center font-medium text-sm text-primary group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                            {item.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-text-primary tracking-normal">
                              {item.symbol}
                            </p>
                            <p className="text-[11px] text-text-dim/50 font-medium tracking-wide">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8 text-text-primary font-medium text-sm tracking-normal">
                        {item.qty} units
                      </td>
                      <td className="py-6 px-8 text-text-dim font-medium text-[13px]">
                        {formatCurrency(
                          convertValue(item.avgCost, item.baseCurrency, user.currency),
                          user?.currency
                        )}
                      </td>
                      <td className="py-6 px-8 text-text-primary font-medium text-sm tracking-normal">
                        {formatCurrency(
                          convertValue(item.currentPrice, item.baseCurrency, user.currency),
                          user?.currency
                        )}
                      </td>
                      <td
                        className={cn(
                          'py-6 px-8 font-medium text-sm tracking-normal',
                          pl >= 0 ? 'text-tertiary' : 'text-danger'
                        )}
                      >
                        {pl >= 0 ? '+' : ''}
                        {formatCurrency(pl, user?.currency)}
                      </td>
                      <td className="py-6 px-8">
                        <div
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-semibold',
                            ret >= 0
                              ? 'bg-tertiary/5 text-tertiary border border-tertiary/10'
                              : 'bg-danger/5 text-danger border border-danger/10'
                          )}
                        >
                          {ret >= 0 ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          )}
                          {Math.abs(ret).toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            className="p-3 bg-surface-elevated border border-border rounded-md text-text-dim hover:text-text-primary hover:border-primary/40 transition-all"
                            onClick={() => navigate(`/stock/${item.symbol}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-3 bg-surface-elevated border border-border rounded-md text-text-dim hover:text-text-primary hover:border-primary/40 transition-all focus:outline-none"
                            onClick={() => openEditHolding(item.symbol, item.name, item.qty)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Log */}
      <Card className="p-0 overflow-hidden glass-card border-border bg-surface-low/50 backdrop-blur-2xl">
        <div className="p-8 border-b border-border flex items-center justify-between bg-surface-hover">
          <h3 className="font-display font-semibold text-xl text-text-primary tracking-normal flex items-center gap-4">
            <History className="w-6 h-6 text-primary" />
            Transaction History
          </h3>
          <button
            className="text-[10px] font-semibold tracking-wide text-text-dim hover:text-text-primary transition-colors"
            onClick={() => toast.info('Export request queued...')}
          >
            Export Protocol
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-text-dim text-[10px] font-semibold tracking-wide bg-surface-hover">
                <th className="py-6 px-10">Timestamp</th>
                <th className="py-6 px-8">Transaction Type</th>
                <th className="py-6 px-8">Asset Vector</th>
                <th className="py-6 px-8">Allocation</th>
                <th className="py-6 px-8">Unit Value</th>
                <th className="py-6 px-10 text-right">Aggregate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-[11px] text-text-dim/40 font-semibold tracking-wide"
                  >
                    Log Cache Empty
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-elevated transition-colors">
                    <td className="py-6 px-10 text-[12px] text-text-dim font-medium">
                      {tx.timestamp.toLocaleDateString()}
                    </td>
                    <td className="py-6 px-8">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-sm text-xs font-medium',
                          tx.type === 'BUY'
                            ? 'bg-tertiary/10 text-tertiary border border-tertiary/10'
                            : 'bg-danger/10 text-danger border border-danger/10'
                        )}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-6 px-8 font-semibold text-text-primary text-[13px] tracking-normal">
                      {tx.symbol}
                    </td>
                    <td className="py-6 px-8 text-text-dim font-medium text-[13px]">
                      {tx.qty} units
                    </td>
                    <td className="py-6 px-8 text-text-dim font-medium text-[13px]">
                      {formatCurrency(
                        convertValue(tx.price, tx.baseCurrency, user.currency),
                        user?.currency
                      )}
                    </td>
                    <td className="py-6 px-10 text-right font-semibold text-text-primary text-[14px] tracking-normal">
                      {formatCurrency(
                        convertValue(tx.total, tx.baseCurrency, user.currency),
                        user?.currency
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Premium Dialogs - Stylized to match */}
      {/* (Skipping detailed update for simple Dialog contents as they use Common UI, but terminology is updated in methods) */}

      {/* Add Funds Dialog */}
      <Dialog isOpen={isAddFundsOpen} onClose={() => setIsAddFundsOpen(false)} title="Add Funds">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Amount ({user.currency})
            </label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              min="0"
              step="100"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsAddFundsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleAddFunds}>
              Add Funds
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Edit Holding Quantity Dialog */}
      <Dialog
        isOpen={isEditHoldingOpen}
        onClose={() => setIsEditHoldingOpen(false)}
        title={`Edit ${editSymbol} Quantity`}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-surface-elevated rounded-lg">
            <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center font-bold text-xs">
              {editSymbol.slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-sm">{editSymbol}</p>
              <p className="text-xs text-text-muted">{editName}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Quantity</label>
            <Input
              type="number"
              placeholder="Enter new quantity"
              value={editQty}
              onChange={(e) => setEditQty(e.target.value)}
              min="0"
              step="1"
              autoFocus
            />
            <p className="text-xs text-text-muted mt-2">
              Set to 0 to remove this holding from your portfolio.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsEditHoldingOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleUpdateHolding}>
              Update Quantity
            </Button>
          </div>
        </div>
      </Dialog>
    </motion.div>
  );
}
