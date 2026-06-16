import type { Asset } from './types';

const CRYPTO_API_URL = 'https://api.coinpaprika.com/v1/tickers';
const FINNHUB_API_URL = 'https://finnhub.io/api/v1/quote';
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const STOCK_SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms' }
];

export async function fetchMarketData(): Promise<Asset[]> {
  const cryptoResponse = await fetch(CRYPTO_API_URL);
  if (!cryptoResponse.ok) throw new Error('Failed to fetch crypto data');
  const cryptoData = await cryptoResponse.json();
  
  const cryptos: Asset[] = cryptoData.slice(0, 50).map((item: any) => ({
    ...item,
    type: 'crypto'
  }));

  let stocks: Asset[] = [];
  if (FINNHUB_KEY) {
    const stockPromises = STOCK_SYMBOLS.map(async (company) => {
      const res = await fetch(`${FINNHUB_API_URL}?symbol=${company.symbol}&token=${FINNHUB_KEY}`);
      const data = await res.json();
      
      return {
        id: `stock-${company.symbol.toLowerCase()}`,
        name: company.name,
        symbol: company.symbol,
        rank: 0,
        type: 'stock',
        quotes: { 
          USD: { 
            price: data.c || 0,
            percent_change_24h: data.dp || 0
          } 
        }
      } as Asset;
    });
    
    stocks = await Promise.all(stockPromises);
  }

  return [...cryptos, ...stocks];
}