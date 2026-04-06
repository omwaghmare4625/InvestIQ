import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { X, Minus, Plus, Info } from 'lucide-react';
import { Button } from './Common';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency, getCurrencySymbol, convertValue } from '@/lib/utils';
import { toast } from 'sonner';

interface TradeDialogProps {
  symbol: string;
  currentPrice: number;
  baseCurrency: 'INR' | 'USD';
  isOpen: boolean;
  onClose: () => void;
}

export const TradeDialog: React.FC<TradeDialogProps> = ({ symbol, currentPrice, baseCurrency, isOpen, onClose }) => {
  const { user, balance, portfolio, executeTrade } = useStore();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [qty, setQty] = useState(1);
  const [orderType, setOrderType] = useState('Market');
  
  const initialLimitPrice = convertValue(currentPrice, baseCurrency, user?.currency || 'INR');
  const [limitPrice, setLimitPrice] = useState(initialLimitPrice);

  React.useEffect(() => {
    setLimitPrice(initialLimitPrice);
  }, [initialLimitPrice]);

  const holding = portfolio.find(h => h.symbol === symbol);
  const displayPrice = orderType === 'Market' ? initialLimitPrice : limitPrice;
  const totalValue = displayPrice * qty;
  const brokerage = totalValue * 0.001;
  const grandTotal = totalValue + brokerage;

  const handleExecute = () => {
    // Convert back to base currency for storage
    const basePrice = orderType === 'Market' ? currentPrice : convertValue(limitPrice, user?.currency || 'INR', baseCurrency);
    const baseTotal = basePrice * qty * 1.001; // Including brokerage in base currency

    if (tradeType === 'buy' && grandTotal > balance) {
      toast.error('Insufficient balance');
      return;
    }
    if (tradeType === 'sell' && (!holding || holding.qty < qty)) {
      toast.error('Insufficient holdings');
      return;
    }

    executeTrade({
      symbol,
      type: tradeType.toUpperCase() as 'BUY' | 'SELL',
      qty,
      price: basePrice,
      total: baseTotal,
    });

    toast.success(`${tradeType.toUpperCase()} order executed for ${qty} shares of ${symbol}`);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-modal z-50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold">Trade {symbol}</Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-surface-elevated rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* Buy/Sell Toggle */}
            <div className="flex p-1 bg-background rounded-xl border border-border">
              <button
                onClick={() => setTradeType('buy')}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                  tradeType === 'buy' ? "bg-success text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                )}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType('sell')}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                  tradeType === 'sell' ? "bg-danger text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                )}
              >
                Sell
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Current Price</span>
              <span className="text-lg font-bold font-numbers">{formatCurrency(initialLimitPrice, user?.currency)}</span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Quantity</label>
              <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" className="p-2" onClick={() => setQty(q => Math.max(1, q - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <input
                  type="number"
                  value={qty}
                  onChange={e => setQty(parseInt(e.target.value) || 0)}
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-center font-numbers text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button variant="secondary" size="sm" className="p-2" onClick={() => setQty(q => q + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Order Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Order Type</label>
              <RadioGroup.Root 
                className="grid grid-cols-4 gap-2" 
                value={orderType} 
                onValueChange={setOrderType}
              >
                {['Market', 'Limit', 'Stop', 'SL-M'].map(type => (
                  <RadioGroup.Item
                    key={type}
                    value={type}
                    className={cn(
                      "py-2 rounded-lg text-xs font-bold border transition-all",
                      orderType === type 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-surface border-border text-text-muted hover:border-text-muted"
                    )}
                  >
                    {type}
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </div>

            {orderType !== 'Market' && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <label className="text-sm font-medium text-text-secondary">
                  {orderType === 'Stop' ? 'Trigger Price' : 'Limit Price'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{getCurrencySymbol(user?.currency)}</span>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={e => setLimitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="rounded-xl bg-surface-elevated p-4 space-y-3 border border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Estimated Total</span>
                <span className="font-numbers text-text-primary">{formatCurrency(totalValue, user?.currency)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Brokerage (0.1%)</span>
                <span className="font-numbers text-text-primary">{formatCurrency(brokerage, user?.currency)}</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex justify-between text-sm font-bold">
                <span>Total Amount</span>
                <span className="font-numbers text-primary">{formatCurrency(grandTotal, user?.currency)}</span>
              </div>
            </div>

            <Button
              onClick={handleExecute}
              className={cn(
                "w-full py-4 text-base font-bold shadow-lg",
                tradeType === 'buy' ? "bg-success hover:bg-success/90 shadow-success/20" : "bg-danger hover:bg-danger/90 shadow-danger/20"
              )}
            >
              Execute {tradeType.toUpperCase()} Order
            </Button>

            <div className="flex items-center gap-2 text-[10px] text-text-muted justify-center">
              <Info className="w-3 h-3" />
              <span>Delivery orders settle in T+2 days</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
