import type { Coin, Transaction } from './types';

interface Props {
  transactions: Transaction[];
  assets: Coin[];
}

export default function PortfolioStats({ transactions, assets }: Props) {
  const totalInvested = transactions.reduce((acc, tx) => acc + (tx.amount * tx.purchasePrice), 0);
  
  const currentValue = transactions.reduce((acc, tx) => {
    const coin = assets.find(c => c.id === tx.coinId);
    const currentPrice = coin ? coin.quotes.USD.price : tx.purchasePrice;
    return acc + (tx.amount * currentPrice);
  }, 0);

  const profitLoss = currentValue - totalInvested;
  const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
  const isPositive = profitLoss >= 0;

  if (transactions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-surface p-5 rounded-2xl">
        <p className="text-textSecondary text-sm mb-1">Total Investido</p>
        <p className="text-2xl font-bold text-textPrimary">${totalInvested.toFixed(2)}</p>
      </div>
      <div className="bg-surface p-5 rounded-2xl">
        <p className="text-textSecondary text-sm mb-1">Valor Atual</p>
        <p className="text-2xl font-bold text-textPrimary">${currentValue.toFixed(2)}</p>
      </div>
      <div className="bg-surface p-5 rounded-2xl">
        <p className="text-textSecondary text-sm mb-1">Lucro / Prejuízo</p>
        <div className="flex items-end gap-2">
          <p className={`text-2xl font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? '+' : ''}{profitLoss.toFixed(2)}
          </p>
          <p className={`text-sm mb-1 font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
            ({isPositive ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
          </p>
        </div>
      </div>
    </div>
  );
}