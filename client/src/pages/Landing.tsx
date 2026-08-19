import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PublicHeader } from '../components/PublicHeader';

export const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <PublicHeader />

      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Column - Text */}
          <div className="lg:w-1/2 flex flex-col items-start text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Platform is live & operational</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Boost, Recharge & <br />
              <span className="text-indigo-500">Grow Digitally</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg text-slate-500 max-w-xl mb-10 leading-relaxed font-medium">
              Boost your social media presence, get virtual SMS numbers, buy data, airtime and pay bills — all from one futuristic platform built for speed and reliability.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-16">
              {user ? (
                <Link to="/dashboard" className="bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all flex items-center gap-2">
                   Enter Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Launch Dashboard
                  </Link>
                  <Link to="/services" className="bg-white text-slate-700 border border-gray-200 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                    Explore Services →
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-12 border-t border-gray-100 pt-8 w-full max-w-xl">
              <div>
                <h4 className="text-3xl font-black text-slate-900">500+</h4>
                <p className="text-sm font-medium text-slate-400">Active Users</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-slate-900">99.9%</h4>
                <p className="text-sm font-medium text-slate-400">Uptime</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-slate-900">24/7</h4>
                <p className="text-sm font-medium text-slate-400">Support Team</p>
              </div>
            </div>
            
          </div>

          {/* Right Column - Mockup Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Abstract decorative background behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-50 rounded-full blur-3xl -z-10" />
              
              {/* Phone Mockup Frame */}
              <div className="w-[320px] h-[650px] bg-white rounded-[2.5rem] border-[8px] border-slate-100 shadow-2xl relative overflow-hidden flex flex-col">
                
                {/* Mockup Header */}
                <div className="bg-indigo-500 text-white p-6 pb-8 rounded-b-3xl">
                  <p className="text-sm text-indigo-200 mb-1">Total Balance</p>
                  <h3 className="text-3xl font-bold">₦324,500.00</h3>
                  <div className="flex gap-2 mt-4">
                    <div className="w-1/2 bg-white/20 h-10 rounded-lg flex items-center justify-center text-xs font-semibold backdrop-blur-sm">+ Add Money</div>
                  </div>
                </div>

                {/* Mockup Quick Actions */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: '📱', label: 'Airtime', color: 'bg-rose-50 text-rose-500' },
                      { icon: '📶', label: 'Data', color: 'bg-blue-50 text-blue-500' },
                      { icon: '📺', label: 'Cable TV', color: 'bg-orange-50 text-orange-500' },
                      { icon: '⚡', label: 'Electric', color: 'bg-emerald-50 text-emerald-500' },
                      { icon: '💰', label: 'Transfer', color: 'bg-purple-50 text-purple-500' },
                      { icon: '•••', label: 'More', color: 'bg-gray-50 text-gray-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${item.color}`}>
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mockup Transactions */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-800">Recent Transactions</h4>
                      <span className="text-xs font-semibold text-indigo-500">See all</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: 'MTN Data - 5GB', date: 'Today, 10:45 AM', amount: '-₦1,500', isNegative: true },
                        { title: 'Wallet Funding', date: 'Yesterday, 2:30 PM', amount: '+₦50,000', isNegative: false },
                        { title: 'DSTV Subscription', date: 'Oct 12, 09:15 AM', amount: '-₦9,800', isNegative: true },
                      ].map((tx, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${tx.isNegative ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                              {tx.isNegative ? '↑' : '↓'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{tx.title}</p>
                              <p className="text-[10px] text-slate-400">{tx.date}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold ${tx.isNegative ? 'text-slate-800' : 'text-emerald-500'}`}>
                            {tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
