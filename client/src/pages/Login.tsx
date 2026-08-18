import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Fingerprint, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedUser, setSavedUser] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('depayhub_saved_user');
    if (user) {
      setSavedUser(user);
    }
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        data: {
          email: identifier.includes('@') ? identifier : undefined,
          username: !identifier.includes('@') ? identifier : undefined,
          password
        }
      });

      localStorage.setItem('depayhub_saved_user', res.user.username);
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await apiFetch('/auth/pin-login', {
        method: 'POST',
        data: {
          username: savedUser,
          pin
        }
      });

      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid PIN');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBiometricUnlock = () => {
    alert('Biometric login is currently a stub for PWA environments. Please use your 4-digit PIN.');
  };

  if (savedUser) {
    return (
      <AuthLayout 
        title={<span>Welcome back <span className="inline-block animate-wave">👋</span></span>}
        subtitle={`Sign in to your account.`}
      >
        <div className="text-center mb-6">
          <p className="text-gray-900 font-medium">Welcome back, <strong>{savedUser}</strong></p>
          <button onClick={() => { setSavedUser(null); localStorage.removeItem('depayhub_saved_user'); }} className="text-primary text-sm font-semibold mt-1 hover:underline">
            Not you? Sign in with a different account
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">{error}</div>}

        <form onSubmit={handlePinLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transaction PIN</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition text-lg tracking-[0.5em] font-bold shadow-sm" 
                placeholder="••••" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-semibold py-4 rounded-xl shadow-md hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            {isLoading ? 'Unlocking...' : 'Sign In'}
            {!isLoading && <span className="text-lg">→</span>}
          </button>
          
          <button type="button" onClick={handleBiometricUnlock} className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition active:scale-[0.98]">
            <Fingerprint className="w-5 h-5" />
            Use Biometrics
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title={<span>Welcome back <span className="inline-block animate-wave">👋</span></span>}
      subtitle="Sign in to your Depayhub account"
    >
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">{error}</div>}

      <form onSubmit={handlePasswordLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-gray-900" 
              placeholder="Enter your email or username" 
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
            <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-12 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-gray-900" 
              placeholder="Enter your password" 
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

        <div className="flex items-center pt-2 pb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-semibold py-4 rounded-xl shadow-md hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          {isLoading ? 'Signing In...' : 'Sign In'}
          {!isLoading && <span className="text-lg">→</span>}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Create one free</Link>
        </p>
      </form>
    </AuthLayout>
  );
};
