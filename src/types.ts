export interface CoinQuote {
  price: number;
  percent_change_24h: number;
}

export interface CoinQuotes {
  USD: CoinQuote;
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  quotes: CoinQuotes;
}

export interface Transaction {
  id: string;
  coinId: string;
  symbol: string;
  amount: number;
  purchasePrice: number;
  date: string;
}