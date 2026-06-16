import { useState } from 'react';
import { supabase } from './supabase';
import { Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error('Preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Conta criada com sucesso! Podes fazer login.');
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error('Erro ao iniciar sessão.');
      } else {
        toast.success('Sessão iniciada com sucesso!');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center p-6 w-full">
      <div className="bg-surface p-8 rounded-2xl w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-bgDark p-4 rounded-full">
            <Wallet className="w-10 h-10 text-accent" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-textPrimary text-center mb-8">
          {isSignUp ? 'Criar Conta' : 'Entrar no Portfolio'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-3 focus:outline-none focus:border-accent"
              placeholder="exemplo@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">Palavra-passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bgDark border border-surface text-textPrimary rounded-lg p-3 focus:outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'A processar...' : isSignUp ? 'Registar' : 'Entrar'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
            }}
            className="text-sm text-textSecondary hover:text-accent transition-colors"
          >
            {isSignUp ? 'Já tens conta? Entra aqui' : 'Não tens conta? Cria uma aqui'}
          </button>
        </div>
      </div>
    </div>
  );
}