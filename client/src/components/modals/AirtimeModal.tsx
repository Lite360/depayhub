import { useState } from 'react';
import { X, Smartphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';

interface AirtimeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AirtimeModal = ({ isOpen, onClose }: AirtimeModalProps) => {
  const { user } = useAuth();
  const role = user?.role || 'SUBSCRIBER';
  
  const [network, setNetwork] = useState('MTN');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const chargeAmount = amount
    ? role === 'VENDOR' ? (Number(amount) * 0.97).toFixed(2) : amount
    : '0';

  const handlePurchase = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await apiFetch('/services/purchase', {
        method: 'POST',
        data: {
          serviceCategory: 'AIRTIME',
          planCode: network,
          phone,
          amount: Number(amount),
          pin
        }
      });
      setSuccess('Airtime purchased successfully!');
      setTimeout(() => {
        onClose();
        setSuccess('');
        setPhone('');
        setAmount('');
        setPin('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Buy Airtime</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm mb-4">{success}</div>}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
            <div className="grid grid-cols-4 gap-2">
              {['MTN', 'Airtel', 'Glo', '9Mobile'].map((net) => (
                <button 
                  key={net} 
                  onClick={() => setNetwork(net)}
                  className={`py-2 border rounded-xl text-sm font-medium transition ${network === net ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-700 hover:border-primary'}`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="h-5 w-5 text-gray-400" />
              </div>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" placeholder="e.g. 08012345678" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" placeholder="50 - 50,000" />
          </div>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100">
            You will be charged exactly <strong>₦{chargeAmount}</strong> from your wallet.
            {role === 'VENDOR' && <span className="text-green-600 ml-1">(3% vendor discount)</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction PIN</label>
            <input 
              type="password" 
              maxLength={4}
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              className="w-full text-center tracking-[1em] font-bold border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
              placeholder="••••" 
            />
          </div>
        </div>
        <button onClick={handlePurchase} className="btn-primary w-full mt-6" disabled={!phone || !amount || pin.length !== 4 || loading}>
          {loading ? 'Processing...' : `Pay ₦${chargeAmount}`}
        </button>
      </div>
    </div>
  );
};
