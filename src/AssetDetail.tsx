import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Newspaper, History } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo, useState, useEffect } from 'react';
import type { Asset, Transaction } from './types';
import { useSettings } from './SettingsContext';

interface Props {
  assets: Asset[];
  transactions: Transaction[];
}

export default function AssetDetail({ assets, transactions }: Props) {
  const { id } = useParams<{ id: string }>();
  const asset = assets.find(a => a.id === id);
  const [news, setNews] = useState<any[]>([]);
  const { currency, exchangeRate } = useSettings();

  const formatCurrency = (val: number) => {
    const finalVal = currency === 'EUR' ? val * exchangeRate : val;
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency }).format(finalVal);
  };

  const assetTransactions = transactions.filter(tx => tx.assetId === id);
  const totalInvested = assetTransactions.reduce((acc, tx) => acc + (tx.amount * tx.purchasePrice), 0);
  const totalAmount = assetTransactions.reduce((acc, tx) => acc + tx.amount, 0);

  useEffect(() => {
    if (asset?.type === 'stock') {
      const fetchNews = async () => {
        try {
          const today = new Date().toISOString().split('T')[0];
          const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
          const res = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${asset.symbol}&from=${lastMonth}&to=${today}&token=${apiKey}`);
          const data = await res.json();
          setNews(data.slice(0, 3));
        } catch (e) {
          console.error('Erro ao carregar notícias', e);
        }
      };
      fetchNews();
    }
  }, [asset]);

  const mockHistory = useMemo(() => {
    if (!asset) return [];
    let current = asset.quotes.USD.price * (asset.quotes.USD.percent_change_24h > 0 ? 0.9 : 1.1);
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const convertedPrice = currency === 'EUR' ? current * exchangeRate : current;
      data.push({
        date: date.toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' }),
        price: Number(convertedPrice.toFixed(2))
      });
      current += (asset.quotes.USD.price - current) * 0.15 + (Math.random() - 0.5) * (asset.quotes.USD.price * 0.05);
    }
    const finalConvertedPrice = currency === 'EUR' ? asset.quotes.USD.price * exchangeRate : asset.quotes.USD.price;
    data[data.length - 1].price = Number(finalConvertedPrice.toFixed(2));
    return data;
  }, [asset, currency, exchangeRate]);

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-textSecondary mb-4">Ativo não encontrado.</p>
        <Link to="/market" className="text-accent hover:underline">Voltar ao Mercado</Link>
      </div>
    );
  }

  const isPositive = asset.quotes.USD.percent_change_24h >= 0;
  const symbol = currency === 'EUR' ? '€' : '$';

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Link to="/market" className="inline-flex items-center text-textSecondary hover:text-textPrimary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Mercado
      </Link>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-textPrimary tracking-tight">{asset.name}</h1>
            <span className="bg-surface px-3 py-1 rounded-lg text-textSecondary font-semibold uppercase">
              {asset.symbol}
            </span>
          </div>
          <p className="text-textSecondary capitalize">{asset.type === 'crypto' ? 'Criptomoeda' : 'Ação'}</p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-4xl font-bold text-textPrimary mb-2">
            {formatCurrency(asset.quotes.USD.price)}
          </p>
          <div className={`flex items-center md:justify-end font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
            {Math.abs(asset.quotes.USD.percent_change_24h).toFixed(2)}% (24h)
          </div>
        </div>
      </header>

      <div className="bg-surface p-6 rounded-2xl mb-8 w-full" style={{ height: '400px' }}>
        <h3 className="text-lg font-semibold text-textPrimary mb-6">Desempenho (Últimos 30 dias)</h3>
        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockHistory} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#32D74B' : '#FF453A'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? '#32D74B' : '#FF453A'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#A0A0A0" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
              <YAxis stroke="#A0A0A0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${symbol}${val}`} domain={['auto', 'auto']} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#1E1E1E', borderRadius: '8px', color: '#FFFFFF' }}
                itemStyle={{ color: isPositive ? '#32D74B' : '#FF453A', fontWeight: 600 }}
                formatter={(value: any) => [`${symbol}${value}`, 'Preço']}
              />
              <Area type="monotone" dataKey="price" stroke={isPositive ? '#32D74B' : '#FF453A'} strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-textPrimary">O Teu Histórico</h3>
          </div>
          
          <div className="bg-surface rounded-2xl p-6 mb-4 flex justify-between items-center">
            <div>
              <p className="text-textSecondary text-sm">Quantidade Total</p>
              <p className="text-xl font-bold text-textPrimary">{totalAmount.toFixed(4)} {asset.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-textSecondary text-sm">Total Investido</p>
              <p className="text-xl font-bold text-textPrimary">{formatCurrency(totalInvested)}</p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl overflow-hidden">
            {assetTransactions.length > 0 ? (
              <table className="w-full text-left">
                <tbody>
                  {assetTransactions.map(tx => (
                    <tr key={tx.id} className="border-b border-bgDark last:border-0 hover:bg-bgDark transition-colors">
                      <td className="p-4 text-sm text-textSecondary">{new Date(tx.date).toLocaleDateString('pt-PT')}</td>
                      <td className="p-4 text-textPrimary font-medium">{tx.amount}</td>
                      <td className="p-4 text-textPrimary text-right">{formatCurrency(tx.purchasePrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-textSecondary text-center">Sem transações registadas.</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <Newspaper className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-textPrimary">Notícias Recentes</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {asset.type === 'crypto' ? (
              <div className="bg-surface p-6 rounded-2xl text-textSecondary text-center">
                Feed de notícias indisponível para criptomoedas no plano atual.
              </div>
            ) : news.length > 0 ? (
              news.map((item, index) => (
                <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="bg-surface p-5 rounded-2xl hover:bg-bgDark transition-colors group block">
                  <h4 className="font-semibold text-textPrimary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {item.headline}
                  </h4>
                  <div className="flex justify-between items-center text-xs text-textSecondary">
                    <span>{item.source}</span>
                    <span>{new Date(item.datetime * 1000).toLocaleDateString('pt-PT')}</span>
                  </div>
                </a>
              ))
            ) : (
              <div className="bg-surface p-6 rounded-2xl text-textSecondary text-center">
                A carregar notícias...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}