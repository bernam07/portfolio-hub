export interface AssetQuote {
  price: number;
  percent_change_24h: number;
}

export interface AssetQuotes {
  USD: AssetQuote;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  type: 'crypto' | 'stock';
  quotes: AssetQuotes;
}

export interface Transaction {
  id: string;
  assetId: string;
  symbol: string;
  amount: number;
  purchasePrice: number;
  date: string;
}