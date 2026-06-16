import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Transaction, Asset } from './types';
import { useSettings } from './SettingsContext';

interface Props {
  transactions: Transaction[];
  assets: Asset[];
}

export default function PortfolioChart({ transactions, assets }: Props) {
  const { currency, exchangeRate } = useSettings();

  const data = useMemo(() => {
    if (transactions.length === 0) return [];

    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let cumulative = 0;
    return sorted.map(tx => {
      const asset = assets.find(a => a.id === tx.assetId);
      const currentPrice = asset ? asset.quotes.USD.price : tx.purchasePrice;
      
      cumulative += tx.amount * currentPrice;
      const finalValue = currency === 'EUR' ? cumulative * exchangeRate : cumulative;

      return {
        date: new Date(tx.date).toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' }),
        value: Number(finalValue.toFixed(2))
      };
    });
  }, [transactions, assets, currency, exchangeRate]);

  if (transactions.length === 0) return null;

  const symbol = currency === 'EUR' ? '€' : '$';

  return (
    <div className="bg-surface p-6 rounded-2xl mb-8 w-full" style={{ height: '350px' }}>
      <h3 className="text-lg font-semibold text-textPrimary mb-6">Evolução do Portfólio</h3>
      <div style={{ width: '100%', height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0A84FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#A0A0A0" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#A0A0A0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${symbol}${value}`} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#1E1E1E', borderRadius: '8px', color: '#FFFFFF' }}
              itemStyle={{ color: '#0A84FF', fontWeight: 600 }}
              formatter={(value: any) => [`${symbol}${value}`, 'Valor']}
            />
            <Area type="monotone" dataKey="value" stroke="#0A84FF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}