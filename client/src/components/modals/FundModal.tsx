import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface FundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FundModal = ({ isOpen, onClose }: FundModalProps) => {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  const virtualAccounts = [
    { provider: 'PalmPay (PaymentPoint)', accountName: 'Depayhub - John Doe', accountNumber: '8012345678' },
    { provider: 'Paga (Aspify)', accountName: 'Depayhub - John Doe', accountNumber: '9087654321' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Fund Wallet</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">Transfer funds to any of your dedicated accounts below to instantly credit your Depayhub wallet.</p>
        <div className="space-y-4">
          {virtualAccounts.map((acc, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
              <p className="text-xs font-semibold text-primary uppercase mb-3">{acc.provider}</p>
              <div>
                <p className="text-xs text-gray-500">Account Name</p>
                <p className="font-medium text-gray-800">{acc.accountName}</p>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="text-2xl font-bold tracking-wider text-gray-900">{acc.accountNumber}</p>
                </div>
                <button onClick={() => copyToClipboard(acc.accountNumber)} className="flex items-center gap-1.5 text-accent font-medium text-sm hover:text-orange-600 transition p-2 rounded-lg hover:bg-orange-50">
                  {copied === acc.accountNumber ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied === acc.accountNumber ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-primary w-full mt-6">I have transferred the money</button>
      </div>
    </div>
  );
};
