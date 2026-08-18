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

  return (
    <AuthLayout 
      title={<span>Create an account <span className="inline-block">✨</span></span>}
      subtitle="Join Depayhub in under 2 minutes"
    >
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              name="fullName" 
              type="text" 
              required 
              value={formData.fullName} 
              onChange={handleChange} 
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-gray-900" 
              placeholder="e.g. John Doe" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <AtSign className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                name="username" 
                type="text" 
                required 
                value={formData.username} 
                onChange={handleChange} 
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-gray-900" 
                placeholder="johndoe" 
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                name="phone" 
                type="tel" 
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-gray-900" 
                placeholder="08012345678" 
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              name="email" 
              type="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-gray-900" 
              placeholder="Enter your email" 
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              minLength={8} 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-12 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-gray-900" 
              placeholder="Minimum 8 characters" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
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
                <Hash className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                name="pin" 
                type="text" 
                required 
                maxLength={4} 
                pattern="\d{4}" 
                value={formData.pin} 
                onChange={handleChange} 
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-gray-900 tracking-[0.2em] font-bold" 
                placeholder="1234" 
              />
            </div>
          </div>

          {/* Referral */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Referral Code</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                name="referralCode" 
                type="text" 
                value={formData.referralCode} 
                onChange={handleChange} 
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-gray-900" 
                placeholder="Optional" 
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-semibold py-4 rounded-xl shadow-md hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            {isLoading ? 'Creating account...' : 'Next Step'}
            {!isLoading && <span className="text-lg">→</span>}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};
