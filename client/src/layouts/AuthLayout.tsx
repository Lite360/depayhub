import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Phone, Tv } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title?: React.ReactNode, subtitle?: string }) => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen flex font-sans bg-[#0A0A0A] text-white selection:bg-primary/30">
      
      {/* Left side - Form Area */}
      <div className="w-full lg:w-[45%] flex flex-col p-6 sm:p-12 xl:p-16 z-10 overflow-y-auto border-r border-white/5">
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex justify-center lg:justify-start items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-black border border-white/10 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">DEPAYHUB</span>
          </div>

          {/* Toggle Tabs */}
          <div className="bg-[#111111] p-1.5 rounded-xl flex items-center mb-10 border border-white/5 shadow-inner">
            <Link 
              to="/login" 
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-[#1a1a1a] shadow-lg text-white border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-[#1a1a1a] shadow-lg text-white border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Create Account
            </Link>
          </div>

          {/* Title Area */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">{title}</h1>
            {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right side - Features Area */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#111111] flex-col justify-center p-12 xl:p-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full mix-blend-screen filter blur-[100px] translate-x-1/3 -translate-y-1/3 opacity-70" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full mix-blend-screen filter blur-[100px] -translate-x-1/3 translate-y-1/3 opacity-70" />

        <div className="max-w-xl relative z-10 ml-8">
          <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center mb-8 shadow-2xl">
             <Shield className="w-6 h-6 text-accent" />
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Your digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">command center</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed font-medium">
            Boost social media, get virtual numbers, buy data & airtime, and more — all from one dashboard.
          </p>

          <div className="space-y-8">
            {/* Feature 1 */}
            <div className="flex gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                <Tv className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h3 className="text-gray-200 font-bold mb-1 group-hover:text-white transition-colors">Instant Bill Payments</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Seamlessly pay for DSTV, GOTV, and electricity across all major providers instantly.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:border-accent/50 transition-colors">
                <Shield className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors" />
              </div>
              <div>
                <h3 className="text-gray-200 font-bold mb-1 group-hover:text-white transition-colors">Secure Wallet System</h3>
                <p className="text-gray-500 text-sm leading-relaxed">PIN-protected transactions with real-time balance and bank-grade encryption.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                <Phone className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-gray-200 font-bold mb-1 group-hover:text-white transition-colors">Airtime & Data</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Automated top-ups for MTN, Airtel, Glo, and 9mobile with huge discounts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
