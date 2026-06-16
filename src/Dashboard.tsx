import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { Asset, Transaction } from './types';
import PortfolioChart from './PortfolioChart';
import { useSettings } from './SettingsContext';

interface Props {
  transactions: Transaction[];
  assets: Asset[];
}

export default function Dashboard({ transactions, assets }: Props) {
  const { currency, exchangeRate } = useSettings();

  const formatCurrency = (val: number) => {
    const finalVal = currency === 'EUR' ? val * exchangeRate : val;
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency }).format(finalVal);
  };

  const { totalInvested, currentBalance } = useMemo(() => {
    let invested = 0;
    let balance = 0;
    
    transactions.forEach(tx => {
      invested += tx.amount * tx.purchasePrice;
      const asset = assets.find(a => a.id === tx.assetId);
      const currentPrice = asset ? asset.quotes.USD.price : tx.purchasePrice;
      balance += tx.amount * currentPrice;
    });
    
    return { totalInvested: invested, currentBalance: balance };
  }, [transactions, assets]);

  const profit = currentBalance - totalInvested;
  const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
  const isPositive = profit >= 0;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-textPrimary tracking-tight mb-2">Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-2xl border border-transparent hover:border-surface transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-bgDark p-3 rounded-xl text-accent"><Wallet className="w-6 h-6" /></div>
            <h2 className="text-textSecondary font-medium">Saldo Atual</h2>
          </div>
          <p className="text-4xl font-bold text-textPrimary mb-2">{formatCurrency(currentBalance)}</p>
          <p className="text-textSecondary text-sm">Investido: {formatCurrency(totalInvested)}</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-transparent hover:border-surface transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-bgDark p-3 rounded-xl text-accent"><Activity className="w-6 h-6" /></div>
            <h2 className="text-textSecondary font-medium">Lucro / Prejuízo</h2>
          </div>
          <p className={`text-4xl font-bold mb-2 ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? '+' : ''}{formatCurrency(profit)}
          </p>
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(profitPercentage).toFixed(2)}%
          </div>
        </div>
      </div>

      <PortfolioChart transactions={transactions} assets={assets} />
    </div>
  );
}