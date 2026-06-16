import type { Transaction } from './types';

interface Props {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: Props) {
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
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-bgDark last:border-0 hover:bg-bgDark transition-colors">
              <td className="p-4 font-semibold text-textPrimary">{tx.symbol}</td>
              <td className="p-4 text-sm text-textSecondary">
                {new Date(tx.date).toLocaleDateString('pt-PT')}
              </td>
              <td className="p-4 text-textPrimary">{tx.amount}</td>
              <td className="p-4 text-textPrimary">${tx.purchasePrice.toFixed(2)}</td>
              <td className="p-4 text-textPrimary font-medium">
                ${(tx.amount * tx.purchasePrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}