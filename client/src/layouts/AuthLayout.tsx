import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Zap, Phone, Tv } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title?: React.ReactNode, subtitle?: string }) => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen flex bg-background font-sans">
      
      {/* Left side - Form Area */}
      <div className="w-full lg:w-[45%] flex flex-col p-6 sm:p-12 xl:p-16 bg-surface shadow-2xl z-10 overflow-y-auto">
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">DEPAYHUB</span>
          </div>

          {/* Toggle Tabs */}
          <div className="bg-gray-50/50 p-1 rounded-xl flex items-center mb-10 border border-gray-100 shadow-inner">
            <Link 
              to="/login" 
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${isLogin ? 'bg-white shadow-sm text-primary border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLogin ? 'bg-white shadow-sm text-primary border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Create Account
            </Link>
          </div>

          {/* Title Area */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right side - Features Area */}
      <div className="hidden lg:flex lg:w-[55%] bg-background flex-col justify-center p-12 xl:p-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-xl relative z-10">
          <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Your digital <br />
            <span className="text-primary">command center</span>
          </h2>
          <p className="text-gray-600 text-lg mb-12 max-w-md leading-relaxed">
            Bbuy data & airtime, and more — all from one dashboard.
          </p>

          <div className="space-y-8">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Tv className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold mb-1">Instant Bill Payments</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Seamlessly pay for DSTV, GOTV, and electricity across all major providers instantly.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold mb-1">Secure Wallet System</h3>
                <p className="text-gray-500 text-sm leading-relaxed">PIN-protected transactions with real-time balance and bank-grade encryption.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold mb-1">Airtime & Data</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Automated top-ups for MTN, Airtel, Glo, and 9mobile with huge discounts.</p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold mb-1">Blazing Fast</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Transactions are completed and verified in milliseconds, never wait again.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
