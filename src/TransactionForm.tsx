import { useState } from 'react';
import type { Asset, Transaction } from './types';
import { Plus } from 'lucide-react';

interface Props {
  assets: Asset[];
  onAdd: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

export default function TransactionForm({ assets, onAdd }: Props) {
  const [assetId, setAssetId] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const cryptos = assets.filter(a => a.type === 'crypto');
  const stocks = assets.filter(a => a.type === 'stock');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !amount || !purchasePrice) return;

    const selectedAsset = assets.find(a => a.id === assetId);
    if (!selectedAsset) return;

    onAdd({
      assetId,
      symbol: selectedAsset.symbol,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice)
    });

    setAssetId('');
    setAmount('');
    setPurchasePrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-5 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-textSecondary mb-1">Ativo</label>
        <select
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-2 focus:outline-none focus:border-accent"
        >
          <option value="" disabled>Selecionar ativo...</option>
          <optgroup label="Criptomoedas">
            {cryptos.map(asset => (
              <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
            ))}
          </optgroup>
          <optgroup label="Ações">
            {stocks.map(asset => (
              <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
            ))}
          </optgroup>
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