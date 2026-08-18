import { X, Download, Share2 } from 'lucide-react';

interface Transaction {
  title: string;
  date: string;
  amount: string;
  isDebit: boolean;
  reference: string;
  service: string;
  status: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const ReceiptModal = ({ isOpen, onClose, transaction }: ReceiptModalProps) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Receipt</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Card */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50 relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <span className="text-6xl font-black text-primary transform -rotate-12">DEPAYHUB</span>
          </div>

          <div className="text-center mb-5">
            <h4 className="text-lg font-bold text-primary">DEPAYHUB</h4>
            <p className="text-[10px] text-gray-400">Digital Payment & VTU Platform</p>
          </div>

          <div className="text-center mb-5">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${transaction.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {transaction.status}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            {[
              ['Service', transaction.service],
              ['Description', transaction.title],
              ['Amount', transaction.amount],
              ['Reference', transaction.reference],
              ['Date', transaction.date],
            ].map(([label, value], idx) => (
              <div key={idx} className="flex justify-between py-1.5 border-b border-dashed border-gray-200 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-secondary transition active:scale-95">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition active:scale-95">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};
