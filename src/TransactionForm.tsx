import { useState } from 'react';
import type { Coin, Transaction } from './types';
import { Plus } from 'lucide-react';

interface Props {
  coins: Coin[];
  onAdd: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

export default function TransactionForm({ coins, onAdd }: Props) {
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coinId || !amount || !purchasePrice) return;

    const selectedCoin = coins.find(c => c.id === coinId);
    if (!selectedCoin) return;

    onAdd({
      coinId,
      symbol: selectedCoin.symbol,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice)
    });

    setCoinId('');
    setAmount('');
    setPurchasePrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-5 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-textSecondary mb-1">Ativo</label>
        <select
          value={coinId}
          onChange={(e) => setCoinId(e.target.value)}
          className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-2 focus:outline-none focus:border-accent"
        >
          <option value="" disabled>Selecionar moeda...</option>
          {coins.map(coin => (
            <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol})</option>
          ))}
        </select>
      </div>
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-textSecondary mb-1">Quantidade</label>
        <input
          type="number"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-2 focus:outline-none focus:border-accent"
          placeholder="0.00"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-textSecondary mb-1">Preço de Compra ($)</label>
        <input
          type="number"
          step="any"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-2 focus:outline-none focus:border-accent"
          placeholder="0.00"
        />
      </div>
      <button
        type="submit"
        className="w-full md:w-auto bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Adicionar
      </button>
    </form>
  );
}