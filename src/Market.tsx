import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { Asset } from './types';
import { useSettings } from './SettingsContext';

interface Props {
  assets: Asset[];
}

export default function Market({ assets }: Props) {
  const [activeTab, setActiveTab] = useState<'crypto' | 'stock'>('crypto');
  const { currency, exchangeRate } = useSettings();

  const formatCurrency = (val: number) => {
    const finalVal = currency === 'EUR' ? val * exchangeRate : val;
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency }).format(finalVal);
  };

  const filteredAssets = assets.filter(asset => asset.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10 border-b border-surface pb-6">
        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Mercado</h1>
      </header>
      
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('crypto')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'crypto' ? 'bg-accent text-white' : 'bg-surface text-textSecondary hover:text-textPrimary'}`}
        >
          Criptomoedas
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'stock' ? 'bg-accent text-white' : 'bg-surface text-textSecondary hover:text-textPrimary'}`}
        >
          Ações
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => {
          const change24h = asset.quotes.USD.percent_change_24h;
          const isPositive = change24h >= 0;

          return (
            <Link key={asset.id} to={`/asset/${asset.id}`} className="bg-surface rounded-2xl p-5 hover:bg-bgDark border border-transparent hover:border-surface transition-all cursor-pointer block">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-textPrimary truncate max-w-[150px]">{asset.name}</h2>
                  <span className="text-sm text-textSecondary uppercase">{asset.symbol}</span>
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-textPrimary">
                  {formatCurrency(asset.quotes.USD.price)}
                </span>
                <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {Math.abs(change24h).toFixed(2)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}