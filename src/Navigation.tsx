import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, LineChart, LogOut, Sun, Moon, DollarSign, Euro } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';

export default function Navigation() {
  const { logout } = useAuth();
  const { theme, toggleTheme, currency, toggleCurrency } = useSettings();

  return (
    <nav className="w-full md:w-64 bg-surface border-r border-bgDark flex flex-col justify-between h-auto md:h-screen p-6 transition-colors">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-accent w-8 h-8 rounded-lg flex items-center justify-center">
            <LineChart className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-textPrimary tracking-tight">PortfolioHub</h1>
        </div>

        <div className="flex flex-col gap-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-accent text-white' : 'text-textSecondary hover:bg-bgDark hover:text-textPrimary'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-accent text-white' : 'text-textSecondary hover:bg-bgDark hover:text-textPrimary'}`}>
            <ArrowRightLeft className="w-5 h-5" /> Transações
          </NavLink>
          <NavLink to="/market" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-accent text-white' : 'text-textSecondary hover:bg-bgDark hover:text-textPrimary'}`}>
            <LineChart className="w-5 h-5" /> Mercado
          </NavLink>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8 md:mt-0">
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-bgDark text-textSecondary hover:text-textPrimary transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={toggleCurrency} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-bgDark text-textSecondary hover:text-textPrimary transition-colors">
            {currency === 'USD' ? <Euro className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
          </button>
        </div>
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-textSecondary hover:bg-danger/10 hover:text-danger transition-all font-medium w-full text-left">
          <LogOut className="w-5 h-5" /> Terminar Sessão
        </button>
      </div>
    </nav>
  );
}