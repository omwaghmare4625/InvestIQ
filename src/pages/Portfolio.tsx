import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Settings, MoreHorizontal, TrendingUp, Wallet, PieChart as PieIcon, ArrowUpRight, History, ArrowDownRight, Eye, Pencil } from 'lucide-react';
import { Card, Button, Dialog, Input } from '@/components/ui/Common';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency, convertValue } from '@/lib/utils';
import { toast } from 'sonner';

const allocationData = [
  { name: 'Stocks', value: 60, color: '#3B82F6' },
  { name: 'ETFs', value: 25, color: '#8B5CF6' },
  { name: 'Crypto', value: 10, color: '#10B981' },
  { name: 'Mutual Funds', value: 5, color: '#F59E0B' },
];

export default function Portfolio() {
  const navigate = useNavigate();
  const { user, portfolio, balance, transactions, addFunds, updateHoldingQty } = useStore();
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('10000');
  
  // Edit holding state
  const [isEditHoldingOpen, setIsEditHoldingOpen] = useState(false);
  const [editSymbol, setEditSymbol] = useState('');
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');
  
  const totalValue = portfolio.reduce((acc, item) => acc + (item.qty * convertValue(item.currentPrice, item.baseCurrency, user?.currency || 'INR')), 0);
  const totalCost = portfolio.reduce((acc, item) => acc + (item.qty * convertValue(item.avgCost, item.baseCurrency, user?.currency || 'INR')), 0);
  const totalPL = totalValue - totalCost;
  const plPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (!isNaN(amount) && amount > 0) {
      addFunds(amount);
      toast.success(`${formatCurrency(amount, user?.currency)} added to your balance`);
      setIsAddFundsOpen(false);
      setFundAmount('10000');
    } else {
      toast.error('Please enter a valid amount');
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
      toast.error('Please enter a valid quantity (0 or more)');
      return;
    }
    updateHoldingQty(editSymbol, qty);
    if (qty === 0) {
      toast.success(`${editSymbol} removed from your portfolio`);
    } else {
      toast.success(`${editSymbol} quantity updated to ${qty}`);
    }
    setIsEditHoldingOpen(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Portfolio</h1>
          <p className="text-text-muted mt-1">Comprehensive view of all your assets and performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Available Balance</p>
            <p className="text-xl font-bold font-numbers text-primary">{formatCurrency(balance, user?.currency)}</p>
          </div>
          <Button className="gap-2" onClick={() => setIsAddFundsOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Funds
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col justify-center p-8 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Total Assets</span>
          </div>
          <h2 className="text-4xl font-bold font-numbers">{formatCurrency(totalValue, user?.currency)}</h2>
          <div className="flex items-center gap-2 mt-4">
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold",
              totalPL >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            )}>
              {totalPL >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatCurrency(totalPL, user?.currency)} ({plPercent.toFixed(1)}%)
            </div>
            <span className="text-text-muted text-sm">since Jan 1</span>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b border-border/30 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-accent" />
              Asset Allocation
            </h3>
            <Button variant="ghost" size="sm">Details</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center p-6 gap-8">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#131B2E', border: '1px solid #2A3657', borderRadius: '8px' }}
                    itemStyle={{ color: '#F8FAFC' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold font-numbers">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border/30 flex items-center justify-between">
          <h3 className="font-bold text-lg">Holdings</h3>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="p-2">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/30 text-text-muted uppercase text-[10px] font-bold tracking-widest">
                <th className="py-4 px-6">Asset</th>
                <th className="py-4 px-6">Quantity</th>
                <th className="py-4 px-6">Avg Cost</th>
                <th className="py-4 px-6">Current</th>
                <th className="py-4 px-6">P/L</th>
                <th className="py-4 px-6">% Return</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {portfolio.map((item) => {
                const currentVal = item.qty * convertValue(item.currentPrice, item.baseCurrency, user?.currency || 'INR');
                const costVal = item.qty * convertValue(item.avgCost, item.baseCurrency, user?.currency || 'INR');
                const pl = currentVal - costVal;
                const ret = costVal > 0 ? (pl / costVal) * 100 : 0;

                return (
                  <tr key={item.symbol} className="hover:bg-surface-elevated/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center font-bold text-xs">
                          {item.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.symbol}</p>
                          <p className="text-xs text-text-muted">{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-numbers text-sm">{item.qty}</td>
                    <td className="py-4 px-6 font-numbers text-sm">{formatCurrency(convertValue(item.avgCost, item.baseCurrency, user?.currency || 'INR'), user?.currency)}</td>
                    <td className="py-4 px-6 font-numbers text-sm">{formatCurrency(convertValue(item.currentPrice, item.baseCurrency, user?.currency || 'INR'), user?.currency)}</td>
                    <td className={cn(
                      "py-4 px-6 font-numbers text-sm font-bold",
                      pl >= 0 ? "text-success" : "text-danger"
                    )}>
                      {pl >= 0 ? '+' : ''}{formatCurrency(pl, user?.currency)}
                    </td>
                    <td className="py-4 px-6">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold",
                        ret >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      )}>
                        {ret >= 0 ? <TrendingUp className="w-3 h-3" /> : <MoreHorizontal className="w-3 h-3" />}
                        {Math.abs(ret).toFixed(1)}%
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="p-2"
                          onClick={() => navigate(`/stock/${item.symbol}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="p-2"
                          onClick={() => openEditHolding(item.symbol, item.name, item.qty)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border/30 flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Transaction History
          </h3>
          <Button variant="ghost" size="sm">Export CSV</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/30 text-text-muted uppercase text-[10px] font-bold tracking-widest">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Symbol</th>
                <th className="py-4 px-6">Quantity</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted text-sm">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-elevated/30 transition-colors">
                    <td className="py-4 px-6 text-sm text-text-muted">
                      {tx.timestamp.toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                        tx.type === 'BUY' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      )}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-sm">{tx.symbol}</td>
                    <td className="py-4 px-6 font-numbers text-sm">{tx.qty}</td>
                    <td className="py-4 px-6 font-numbers text-sm">{formatCurrency(convertValue(tx.price, tx.baseCurrency, user?.currency || 'INR'), user?.currency)}</td>
                    <td className="py-4 px-6 text-right font-numbers font-bold text-sm">
                      {formatCurrency(convertValue(tx.total, tx.baseCurrency, user?.currency || 'INR'), user?.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Funds Dialog */}
      <Dialog
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        title="Add Funds"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Amount ({user?.currency || 'INR'})
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
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsAddFundsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddFunds}
            >
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
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Quantity
            </label>
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
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleUpdateHolding}
            >
              Update Quantity
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
