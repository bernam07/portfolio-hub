import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchMarketData } from './api';
import { supabase } from './supabase';
import type { Asset, Transaction } from './types';
import { AuthProvider, useAuth } from './AuthContext';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Navigation from './Navigation';
import Login from './Login';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Market from './Market';
import AssetDetail from './AssetDetail';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingMarket, setLoadingMarket] = useState<boolean>(true);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } catch (err) {
        toast.error('Erro ao carregar transações.');
      } finally {
        setLoadingTransactions(false);
      }
    }

    fetchTransactions();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadData() {
      try {
        const data = await fetchMarketData();
        setAssets(data);
      } catch (err) {
        toast.error('Erro ao carregar dados do mercado.');
      } finally {
        setLoadingMarket(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleAddTransaction = async (newTx: Omit<Transaction, 'id' | 'date'>) => {
    if (!user) return;
    const toastId = toast.loading('A adicionar transação...');
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            assetId: newTx.assetId,
            symbol: newTx.symbol,
            amount: newTx.amount,
            purchasePrice: newTx.purchasePrice
          }
        ])
        .select();

      if (error) throw error;
      if (data) {
        setTransactions([data[0], ...transactions]);
        toast.success('Transação adicionada!', { id: toastId });
      }
    } catch (err) {
      toast.error('Erro ao adicionar transação.', { id: toastId });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const toastId = toast.loading('A eliminar...');
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(transactions.filter(tx => tx.id !== id));
      toast.success('Transação eliminada.', { id: toastId });
    } catch (err) {
      toast.error('Erro ao eliminar transação.', { id: toastId });
    }
  };

  const handleUpdateTransaction = async (id: string, amount: number, purchasePrice: number) => {
    const toastId = toast.loading('A atualizar...');
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ amount, purchasePrice })
        .eq('id', id);

      if (error) throw error;
      setTransactions(transactions.map(tx => 
        tx.id === id ? { ...tx, amount, purchasePrice } : tx
      ));
      toast.success('Transação atualizada!', { id: toastId });
    } catch (err) {
      toast.error('Erro ao atualizar transação.', { id: toastId });
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#1E1E1E', color: '#fff', borderRadius: '12px' } }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  if (loadingMarket || loadingTransactions) {
    return (
      <div className="min-h-screen bg-bgDark flex items-center justify-center">
        <p className="text-textSecondary text-lg font-medium">A sincronizar com o Supabase...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgDark flex flex-col md:flex-row">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1E1E1E', color: '#fff', borderRadius: '12px' } }} />
      <Navigation />
      <main className="flex-1 p-6 md:p-12 h-screen overflow-y-auto">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard transactions={transactions} assets={assets} />
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions 
                assets={assets}
                transactions={transactions}
                onAdd={handleAddTransaction}
                onDelete={handleDeleteTransaction}
                onUpdate={handleUpdateTransaction}
              />
            </ProtectedRoute>
          } />
          <Route path="/market" element={
            <ProtectedRoute>
              <Market assets={assets} />
            </ProtectedRoute>
          } />
          <Route path="/asset/:id" element={
            <ProtectedRoute>
              <AssetDetail assets={assets} transactions={transactions} />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}