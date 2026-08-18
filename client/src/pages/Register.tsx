import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Phone, AtSign, Eye, EyeOff, Hash } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    pin: '',
    referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.pin.length !== 4) {
      setError('Transaction PIN must be exactly 4 digits');
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        data: {
          ...formData,
          referralCode: formData.referralCode || undefined
        }
      });

      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-white placeholder-gray-500";

  return (
    <AuthLayout 
      title={<span>Create an account <span className="inline-block">✨</span></span>}
      subtitle="Join Depayhub in under 2 minutes"
    >
      {/* Multi-step visual header (from screenshot) */}
      <div className="flex items-center justify-between mb-8 mt-2 relative">
        <div className="absolute left-0 top-1/2 w-full h-[1px] bg-white/10 -z-10 -translate-y-1/2" />
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-orange-500/20 ring-4 ring-[#0a0a0a]">1</div>
          <span className="text-[10px] font-bold text-accent tracking-widest">PERSONAL</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 text-gray-500 flex items-center justify-center text-sm font-bold ring-4 ring-[#0a0a0a]">2</div>
          <span className="text-[10px] font-bold text-gray-600 tracking-widest">SECURITY</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 text-gray-500 flex items-center justify-center text-sm font-bold ring-4 ring-[#0a0a0a]">3</div>
          <span className="text-[10px] font-bold text-gray-600 tracking-widest">FINALIZE</span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#1a1a1a] border border-white/5 p-4 rounded-xl mb-6">
        <User className="w-5 h-5 text-accent" />
        <span className="text-sm text-gray-400 font-medium">Let's start with your basic info</span>
      </div>

      {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-6 border border-red-500/20">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="Enter your full name" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <AtSign className="h-4 w-4 text-gray-500" />
              </div>
              <input name="username" type="text" required value={formData.username} onChange={handleChange} className={inputClass} placeholder="Choose a username" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-500" />
              </div>
              <input name="phone" type="tel" className={inputClass} placeholder="08012345678" />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="Enter your email" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input name="password" type={showPassword ? "text" : "password"} required minLength={8} value={formData.password} onChange={handleChange} className={inputClass} placeholder="Minimum 8 characters" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* PIN */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Txn PIN (4 digits)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Hash className="h-4 w-4 text-gray-500" />
              </div>
              <input name="pin" type="text" required maxLength={4} pattern="\d{4}" value={formData.pin} onChange={handleChange} className={`${inputClass} tracking-[0.2em] font-bold`} placeholder="1234" />
            </div>
          </div>

          {/* Referral */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Referral Code</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <input name="referralCode" type="text" value={formData.referralCode} onChange={handleChange} className={inputClass} placeholder="Optional" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full bg-accent text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            {isLoading ? 'Creating account...' : 'Next Step'}
            {!isLoading && <span className="text-lg">→</span>}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          Already have an account? <Link to="/login" className="text-accent font-bold hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};
