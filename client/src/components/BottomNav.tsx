import { Home, History, Wallet, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-surface border-t border-gray-100 px-6 py-4 flex justify-between items-center z-40 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      
      {/* Home Link */}
      <Link to="/dashboard" className={`flex flex-col items-center gap-1 transition ${location.pathname === '/dashboard' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      {/* History Link */}
      <Link to="/history" className={`flex flex-col items-center gap-1 transition ${location.pathname === '/history' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
        <History className="w-6 h-6" />
        <span className="text-[10px] font-medium">History</span>
      </Link>
      
      {/* Wallet Action Button (Center) */}
      <div className="relative -top-6">
        <button className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 text-white hover:scale-105 transition-transform active:scale-95">
          <Wallet className="w-6 h-6" />
        </button>
      </div>
      
      {/* Profile Link */}
      <Link to="/profile" className={`flex flex-col items-center gap-1 transition ${location.pathname === '/profile' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
        <User className="w-6 h-6" />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>

    </nav>
  );
};
