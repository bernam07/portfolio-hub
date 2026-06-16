import type { Asset, Transaction } from './types';
import PortfolioStats from './PortfolioStats';
import PortfolioDistribution from './PortfolioDistribution';
import PortfolioChart from './PortfolioChart';

interface Props {
  transactions: Transaction[];
  assets: Asset[];
}

export default function Dashboard({ transactions, assets }: Props) {
  return (
    <div className="max-w-4xl">
      <header className="mb-10 border-b border-surface pb-6">
        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Visão Geral</h1>
        <p className="text-textSecondary mt-1">O teu progresso financeiro</p>
      </header>
      <PortfolioStats transactions={transactions} assets={assets} />
      <PortfolioChart transactions={transactions} />
      <PortfolioDistribution transactions={transactions} assets={assets} />
    </div>
  );
}