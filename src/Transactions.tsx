import type { Asset, Transaction } from './types';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

interface Props {
  assets: Asset[];
  transactions: Transaction[];
  onAdd: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, amount: number, purchasePrice: number) => void;
}

export default function Transactions({ assets, transactions, onAdd, onDelete, onUpdate }: Props) {
  return (
    <div className="max-w-4xl">
      <header className="mb-10 border-b border-surface pb-6">
        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Transações</h1>
        <p className="text-textSecondary mt-1">Gere o teu histórico de compras</p>
      </header>
      <TransactionForm assets={assets} onAdd={onAdd} />
      <TransactionList 
        transactions={transactions} 
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </div>
  );
}