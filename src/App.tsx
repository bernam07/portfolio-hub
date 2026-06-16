import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { fetchMarketData } from './api';
import type { Coin, Transaction } from './types';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import PortfolioStats from './PortfolioStats';

export default function App() {
  const [assets, setAssets] = useState<Coin[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        setTransactions([]);
      }
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMarketData();
        setAssets(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados do mercado.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'date'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    
    const updated = [...transactions, transaction];
    setTransactions(updated);
    localStorage.setItem('portfolio_transactions', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgDark flex items-center justify-center">
        <p className="text-textSecondary text-lg font-medium">A sincronizar mercado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bgDark flex items-center justify-center">
        <p className="text-danger text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgDark p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-10 flex items-center justify-between border-b border-surface pb-6">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Portfólio</h1>
          <p className="text-textSecondary mt-1">Dashboard e Mercado em tempo real</p>
        </div>
        <div className="bg-surface p-3 rounded-2xl">
          <Wallet className="w-6 h-6 text-accent" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <PortfolioStats transactions={transactions} assets={assets} />
        
        <TransactionForm coins={assets} onAdd={handleAddTransaction} />
        
        <TransactionList transactions={transactions} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {assets.map((coin) => {
            const price = coin.quotes.USD.price;
            const change24h = coin.quotes.USD.percent_change_24h;
            const isPositive = change24h >= 0;

            return (
              <div key={coin.id} className="bg-surface rounded-2xl p-5 hover:bg-opacity-80 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-textPrimary">{coin.name}</h2>
                    <span className="text-sm text-textSecondary uppercase">{coin.symbol}</span>
                  </div>
                  <span className="text-xs font-bold bg-bgDark px-2 py-1 rounded-md text-textSecondary">
                    #{coin.rank}
                  </span>
                </div>
                
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-textPrimary">
                    ${price < 1 ? price.toFixed(4) : price.toFixed(2)}
                  </span>
                  <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {Math.abs(change24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}