import { useState, useMemo } from 'react';
import { Plus, Trash2, Search, ArrowUpDown, X } from 'lucide-react';
import type { Asset, Transaction } from './types';
import { useSettings } from './SettingsContext';

interface Props {
  assets: Asset[];
  transactions: Transaction[];
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, amount: number, price: number) => void;
}

export default function Transactions({ assets, transactions, onAdd, onDelete }: Props) {
  const [assetId, setAssetId] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  // Novo estado para a data, começa por defeito no dia de hoje
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { currency, exchangeRate } = useSettings();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'crypto' | 'stock'>('crypto');

  const formatCurrency = (val: number) => {
    const finalVal = currency === 'EUR' ? val * exchangeRate : val;
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency }).format(finalVal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find(a => a.id === assetId);
    if (!asset || !amount || !purchasePrice || !txDate) return;
    
    onAdd({ 
      assetId, 
      symbol: asset.symbol, 
      amount: Number(amount), 
      purchasePrice: Number(purchasePrice),
      date: new Date(txDate).toISOString() 
    });
    
    setAssetId('');
    setAmount('');
    setPurchasePrice('');
    setTxDate(new Date().toISOString().split('T')[0]); // Faz reset para hoje
  };

  const filteredAndSortedTransactions = useMemo(() => {
    return transactions
      .filter(tx => tx.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'amount') {
          comparison = a.amount - b.amount;
        } else if (sortBy === 'price') {
          comparison = a.purchasePrice - b.purchasePrice;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [transactions, searchTerm, sortBy, sortOrder]);

  const toggleSort = (field: 'date' | 'amount' | 'price') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const selectedAsset = assets.find(a => a.id === assetId);

  return (
    <div className="max-w-6xl mx-auto">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-bgDark">
              <h3 className="text-xl font-bold text-textPrimary">Selecionar Ativo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-textSecondary hover:text-textPrimary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex gap-4 p-4 border-b border-bgDark shrink-0">
              <button
                onClick={() => setModalTab('crypto')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${modalTab === 'crypto' ? 'bg-accent text-white' : 'bg-bgDark text-textSecondary hover:text-textPrimary'}`}
              >
                Criptomoedas
              </button>
              <button
                onClick={() => setModalTab('stock')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${modalTab === 'stock' ? 'bg-accent text-white' : 'bg-bgDark text-textSecondary hover:text-textPrimary'}`}
              >
                Ações
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.filter(a => a.type === modalTab).map(a => (
                <button
                  key={a.id}
                  onClick={() => {
                    setAssetId(a.id);
                    setIsModalOpen(false);
                  }}
                  className="bg-bgDark p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-accent border border-transparent transition-all text-center"
                >
                  <span className="font-bold text-textPrimary text-lg">{a.symbol}</span>
                  <span className="text-xs text-textSecondary line-clamp-1">{a.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="mb-10 border-b border-surface pb-6">
        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Transações</h1>
      </header>

      <div className="bg-surface p-6 rounded-2xl mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">Ativo</label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-3 text-left outline-none flex justify-between items-center transition-colors hover:border-textSecondary h-[48px]"
            >
              <span className={selectedAsset ? "text-textPrimary truncate" : "text-textSecondary truncate"}>
                {selectedAsset ? `${selectedAsset.name} (${selectedAsset.symbol})` : 'Selecionar Ativo...'}
              </span>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">Quantidade</label>
            <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-3 outline-none h-[48px]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">Preço de Compra</label>
            <input type="number" step="any" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-3 outline-none h-[48px]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">Data da Compra</label>
            <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-3 outline-none h-[48px]" required />
          </div>
          <button type="submit" className="bg-accent text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors h-[48px]">
            <Plus className="w-5 h-5 shrink-0" /> Adicionar
          </button>
        </form>
      </div>

      <div className="bg-surface rounded-2xl overflow-hidden p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
            <input
              type="text"
              placeholder="Pesquisar símbolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg py-2 pl-10 pr-4 outline-none"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => toggleSort('date')} className="flex items-center gap-2 px-3 py-2 bg-bgDark rounded-lg text-textSecondary hover:text-textPrimary text-sm">
              Data <ArrowUpDown className="w-4 h-4" />
            </button>
            <button onClick={() => toggleSort('amount')} className="flex items-center gap-2 px-3 py-2 bg-bgDark rounded-lg text-textSecondary hover:text-textPrimary text-sm">
              Quantidade <ArrowUpDown className="w-4 h-4" />
            </button>
            <button onClick={() => toggleSort('price')} className="flex items-center gap-2 px-3 py-2 bg-bgDark rounded-lg text-textSecondary hover:text-textPrimary text-sm">
              Preço <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-bgDark">
                <th className="p-4 text-sm font-medium text-textSecondary">Data</th>
                <th className="p-4 text-sm font-medium text-textSecondary">Ativo</th>
                <th className="p-4 text-sm font-medium text-textSecondary">Quantidade</th>
                <th className="p-4 text-sm font-medium text-textSecondary">Preço de Compra</th>
                <th className="p-4 text-sm font-medium text-textSecondary text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTransactions.map(tx => (
                <tr key={tx.id} className="border-b border-bgDark last:border-0 hover:bg-bgDark transition-colors group">
                  <td className="p-4 text-sm text-textSecondary">{new Date(tx.date).toLocaleDateString('pt-PT')}</td>
                  <td className="p-4 font-medium text-textPrimary">{tx.symbol}</td>
                  <td className="p-4 text-textPrimary">{tx.amount}</td>
                  <td className="p-4 text-textPrimary">{formatCurrency(tx.purchasePrice)}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => onDelete(tx.id)} className="text-textSecondary hover:text-danger p-2 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}