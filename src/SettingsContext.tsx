import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SettingsContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currency: 'USD' | 'EUR';
  toggleCurrency: () => void;
  exchangeRate: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const exchangeRate = 0.92;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleCurrency = () => setCurrency(prev => prev === 'USD' ? 'EUR' : 'USD');

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, currency, toggleCurrency, exchangeRate }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}