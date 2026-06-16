import type { Coin } from './types';

const API_URL = 'https://api.coinpaprika.com/v1/tickers';

export async function fetchMarketData(): Promise<Coin[]> {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error('Failed to fetch market data');
  }
  
  const data = await response.json();
  return data.slice(0, 50);
}