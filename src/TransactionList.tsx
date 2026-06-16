import { useState } from 'react';
import type { Transaction } from './types';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, amount: number, purchasePrice: number) => void;
}

export default function TransactionList({ transactions, onDelete, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const startEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setEditAmount(tx.amount.toString());
    setEditPrice(tx.purchasePrice.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
    setEditPrice('');
  };

  const saveEdit = (id: string) => {
    const amount = parseFloat(editAmount);
    const price = parseFloat(editPrice);
    if (!isNaN(amount) && !isNaN(price)) {
      onUpdate(id, amount, price);
    }
    cancelEdit();
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-2xl overflow-hidden mb-12">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-bgDark">
            <th className="p-4 text-sm font-medium text-textSecondary">Ativo</th>
            <th className="p-4 text-sm font-medium text-textSecondary">Data</th>
            <th className="p-4 text-sm font-medium text-textSecondary">Qtd</th>
            <th className="p-4 text-sm font-medium text-textSecondary">Preço</th>
            <th className="p-4 text-sm font-medium text-textSecondary">Total</th>
            <th className="p-4 text-sm font-medium text-textSecondary text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isEditing = editingId === tx.id;

            return (
              <tr key={tx.id} className="border-b border-bgDark last:border-0 hover:bg-bgDark transition-colors">
                <td className="p-4 font-semibold text-textPrimary">{tx.symbol}</td>
                <td className="p-4 text-sm text-textSecondary">
                  {new Date(tx.date).toLocaleDateString('pt-PT')}
                </td>
                <td className="p-4">
                  {isEditing ? (
                    <input
                      type="number"
                      step="any"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-20 bg-bgDark border border-surface text-textPrimary rounded p-1 text-sm focus:outline-none focus:border-accent"
                    />
                  ) : (
                    <span className="text-textPrimary">{tx.amount}</span>
                  )}
                </td>
                <td className="p-4">
                  {isEditing ? (
                    <input
                      type="number"
                      step="any"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-24 bg-bgDark border border-surface text-textPrimary rounded p-1 text-sm focus:outline-none focus:border-accent"
                    />
                  ) : (
                    <span className="text-textPrimary">${tx.purchasePrice.toFixed(2)}</span>
                  )}
                </td>
                <td className="p-4 text-textPrimary font-medium">
                  {isEditing 
                    ? `$${(parseFloat(editAmount || '0') * parseFloat(editPrice || '0')).toFixed(2)}`
                    : `$${(tx.amount * tx.purchasePrice).toFixed(2)}`
                  }
                </td>
                <td className="p-4 flex justify-end gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={() => saveEdit(tx.id)} className="text-success p-2 rounded-lg hover:bg-bgDark">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={cancelEdit} className="text-danger p-2 rounded-lg hover:bg-bgDark">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(tx)} className="text-textSecondary hover:text-accent transition-colors p-2 rounded-lg hover:bg-bgDark">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(tx.id)} className="text-textSecondary hover:text-danger transition-colors p-2 rounded-lg hover:bg-bgDark">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}