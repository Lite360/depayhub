import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, FileText, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { FundModal } from '../components/modals/FundModal';
import { AirtimeModal } from '../components/modals/AirtimeModal';
import { ReceiptModal } from '../components/modals/ReceiptModal';

interface Transaction {
  title: string;
  date: string;
  amount: string;
  isDebit: boolean;
  reference: string;
  service: string;
  status: string;
}

const transactions: Transaction[] = [
  { title: 'MTN 1GB Data', date: 'Today, 10:30 AM', amount: '-₦350.00', isDebit: true, reference: 'TXN-1692345678', service: 'DATA', status: 'SUCCESSFUL' },
  { title: 'Wallet Funding', date: 'Yesterday, 2:15 PM', amount: '+₦5,000.00', isDebit: false, reference: 'FUND-1692245678', service: 'FUNDING', status: 'SUCCESSFUL' },
  { title: 'DSTV Subscription', date: '15 Aug, 9:00 AM', amount: '-₦12,500.00', isDebit: true, reference: 'TXN-1692145678', service: 'CABLE', status: 'SUCCESSFUL' },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role || 'SUBSCRIBER';
  const name = user?.fullName || user?.username || 'User';

  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const [showFundModal, setShowFundModal] = useState(false);
  const [showAirtimeModal, setShowAirtimeModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await apiFetch('/wallet/balance');
        setBalance(res.balance);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingBalance(false);
      }
    };
    if (user) fetchBalance();
  }, [user]);

  const initials = name.split(' ').map((n: string) => n[0]).join('');

  const openReceipt = (tx: Transaction) => {
    setSelectedTx(tx);
    setShowReceiptModal(true);
  };

  return (
    <>
      {/* Header */}
      <header className="p-6 bg-surface rounded-b-3xl shadow-sm z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-sm font-medium">Welcome back,</p>
              {role === 'VENDOR' && (
                <span className="bg-orange-100 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Vendor</span>
              )}
            </div>
            <h1 className="text-xl font-bold text-primary">{name}</h1>
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">{initials}</div>
        </div>

        {/* Wallet Card */}
        <div className="wallet-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <p className="text-white/80 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            {isLoadingBalance ? <Loader className="w-6 h-6 animate-spin text-white/70" /> : `₦ ${balance.toLocaleString()}.00`}
          </h2>
          <div className="flex gap-3">
            <button onClick={() => setShowFundModal(true)} className="flex-1 bg-white text-primary font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition active:scale-95">Fund Wallet</button>
            <button className="flex-1 bg-white/20 text-white font-semibold py-2.5 rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/30 transition active:scale-95">Transfer</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Vendor Banner (Subscriber) */}
        {role === 'SUBSCRIBER' && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-sm transition">
            <div>
              <h4 className="font-bold text-orange-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-orange-500" />Become a Vendor</h4>
              <p className="text-xs text-orange-700 mt-1">Get discounted rates & earn on every VTU sale.</p>
            </div>
            <button className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm">Apply</button>
          </div>
        )}

        {/* Profit Widget (Vendor) */}
        {role === 'VENDOR' && (
          <div className="mb-6 bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500"><TrendingUp className="w-5 h-5" /></div>
              <div><p className="text-xs text-gray-500 font-medium">Estimated Profit (Today)</p><h4 className="font-bold text-gray-900 text-lg">₦ 1,250.00</h4></div>
            </div>
          </div>
        )}

        {/* Quick Services */}
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Quick Services</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: 'Airtime', icon: '📱', color: 'bg-blue-50 text-blue-600', action: () => setShowAirtimeModal(true) },
            { name: 'Data', icon: '🌐', color: 'bg-green-50 text-green-600', action: () => {} },
            { name: 'Cable TV', icon: '📺', color: 'bg-purple-50 text-purple-600', action: () => {} },
            { name: 'Electricity', icon: '⚡', color: 'bg-yellow-50 text-yellow-600', action: () => {} },
          ].map((service) => (
            <div key={service.name} onClick={service.action} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${service.color} group-hover:scale-105 transition-transform shadow-sm`}>{service.icon}</div>
              <span className="text-xs font-medium text-gray-600">{service.name}</span>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Recent Transactions</h3>
            <button className="text-accent text-sm font-medium hover:underline">See all</button>
          </div>
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} onClick={() => openReceipt(tx)} className="card py-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.isDebit ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {tx.isDebit ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{tx.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${tx.isDebit ? 'text-gray-800' : 'text-green-600'}`}>{tx.amount}</span>
                  <FileText className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      <FundModal isOpen={showFundModal} onClose={() => setShowFundModal(false)} />
      <AirtimeModal isOpen={showAirtimeModal} onClose={() => setShowAirtimeModal(false)} />
      <ReceiptModal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} transaction={selectedTx} />
    </>
  );
};
