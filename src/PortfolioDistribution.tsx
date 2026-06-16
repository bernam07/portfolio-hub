import type { Asset, Transaction } from './types';

interface Props {
  transactions: Transaction[];
  assets: Asset[];
}

export default function PortfolioDistribution({ transactions, assets }: Props) {
  if (transactions.length === 0) return null;

  const assetValues = transactions.reduce((acc, tx) => {
    const asset = assets.find(a => a.id === tx.assetId);
    const currentPrice = asset ? asset.quotes.USD.price : tx.purchasePrice;
    const value = tx.amount * currentPrice;
    
    if (!acc[tx.symbol]) {
      acc[tx.symbol] = 0;
    }
    acc[tx.symbol] += value;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = Object.values(assetValues).reduce((sum, val) => sum + val, 0);

  const distribution = Object.entries(assetValues)
    .map(([symbol, value]) => ({
      symbol,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-surface p-6 rounded-2xl mb-8">
      <h3 className="text-lg font-semibold text-textPrimary mb-4">Distribuição do Portfólio</h3>
      
      <div className="w-full h-3 bg-bgDark rounded-full overflow-hidden flex mb-4">
        {distribution.map((item, index) => {
          const colors = ['bg-accent', 'bg-success', 'bg-danger', 'bg-textSecondary', 'bg-white'];
          const colorClass = colors[index % colors.length];
          return (
            <div 
              key={item.symbol} 
              className={`h-full ${colorClass}`} 
              style={{ width: `${item.percentage}%` }}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {distribution.map((item, index) => {
          const colors = ['text-accent', 'text-success', 'text-danger', 'text-textSecondary', 'text-white'];
          const colorClass = colors[index % colors.length];
          return (
            <div key={item.symbol} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colorClass.replace('text-', 'bg-')}`} />
              <div>
                <p className="text-sm font-medium text-textPrimary">{item.symbol}</p>
                <p className="text-xs text-textSecondary">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}