import { useState } from 'react';
import { FileText, Search } from 'lucide-react';
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

const allTransactions: Transaction[] = [
  { title: 'MTN 1GB Data', date: 'Today, 10:30 AM', amount: '-₦350.00', isDebit: true, reference: 'TXN-1692345678', service: 'DATA', status: 'SUCCESSFUL' },
  { title: 'Wallet Funding', date: 'Yesterday, 2:15 PM', amount: '+₦5,000.00', isDebit: false, reference: 'FUND-1692245678', service: 'FUNDING', status: 'SUCCESSFUL' },
  { title: 'DSTV Subscription', date: '15 Aug, 9:00 AM', amount: '-₦12,500.00', isDebit: true, reference: 'TXN-1692145678', service: 'CABLE', status: 'SUCCESSFUL' },
  { title: 'Airtel ₦500 Airtime', date: '14 Aug, 3:45 PM', amount: '-₦500.00', isDebit: true, reference: 'TXN-1692045678', service: 'AIRTIME', status: 'SUCCESSFUL' },
  { title: 'Wallet Funding', date: '13 Aug, 11:00 AM', amount: '+₦20,000.00', isDebit: false, reference: 'FUND-1691945678', service: 'FUNDING', status: 'SUCCESSFUL' },
  { title: 'IKEDC Electricity', date: '12 Aug, 8:30 AM', amount: '-₦3,000.00', isDebit: true, reference: 'TXN-1691845678', service: 'ELECTRICITY', status: 'SUCCESSFUL' },
  { title: 'Referral Bonus', date: '11 Aug, 6:00 PM', amount: '+₦500.00', isDebit: false, reference: 'REF-1691745678', service: 'REFERRAL', status: 'SUCCESSFUL' },
];

export const HistoryPage = () => {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filterOptions = ['ALL', 'FUNDING', 'AIRTIME', 'DATA', 'CABLE', 'ELECTRICITY'];

  const filteredTransactions = allTransactions.filter(tx => {
    const matchesFilter = filter === 'ALL' || tx.service === filter;
    const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase()) || tx.reference.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <header className="p-6 bg-surface rounded-b-3xl shadow-sm">
        <h1 className="text-xl font-bold text-primary mb-4">Transaction History</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-gray-50"
            placeholder="Search by description or reference..."
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                filter === opt
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx, i) => (
              <div
                key={i}
                onClick={() => { setSelectedTx(tx); setShowReceiptModal(true); }}
                className="card py-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              >
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
        )}
      </main>

      <ReceiptModal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} transaction={selectedTx} />
    </>
  );
};
