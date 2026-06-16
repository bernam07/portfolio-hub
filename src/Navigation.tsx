import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Navigation() {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transações', icon: ArrowRightLeft },
    { path: '/market', label: 'Mercado', icon: TrendingUp },
  ];

  return (
    <nav className="w-full md:w-64 bg-surface border-r border-bgDark flex flex-col md:min-h-screen">
      <div className="p-6 border-b border-bgDark">
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">PortfolioHub</h1>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-2 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-accent text-white' : 'text-textSecondary hover:bg-bgDark hover:text-textPrimary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-bgDark">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-bgDark transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </nav>
  );
}