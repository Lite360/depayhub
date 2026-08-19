import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Download, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const PublicHeader = () => {
  const { user } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed w-full bg-white z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">N</span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              DEPAYHUB
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/services" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Services</Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link to="/faq" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">FAQ</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Contact</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden lg:flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" /> Install App
            </button>
            <button className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors">
              <Sun className="w-4 h-4" />
            </button>
            
            {user ? (
              <Link to="/dashboard" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors border border-gray-200 px-4 py-2 rounded-lg">
                  Sign In
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20">
                  Get Started →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
