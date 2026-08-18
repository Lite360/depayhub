import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Fingerprint } from 'lucide-react';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  
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
      navigate('/');
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
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid PIN');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBiometricUnlock = () => {
    // Stub for WebAuthn
    alert('Biometric login is currently a stub for PWA environments. Please use your 4-digit PIN.');
  };

  if (savedUser) {
    // Welcome Back Screen
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-4">
              {savedUser[0].toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {savedUser}</h1>
            <p className="text-gray-500 text-sm">Enter your PIN or use biometrics to continue.</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100 text-center">{error}</div>}

          <form onSubmit={handlePinLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center tracking-[1em] text-2xl font-bold border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                placeholder="••••" 
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Unlocking...' : 'Unlock'}
            </button>
            
            <button type="button" onClick={handleBiometricUnlock} className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
              <Fingerprint className="w-5 h-5" />
              Use Biometrics
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Not {savedUser}? <button onClick={() => { setSavedUser(null); localStorage.removeItem('depayhub_saved_user'); }} className="text-accent font-bold hover:underline">Switch account</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary mb-2">DEPAYHUB</h1>
          <p className="text-gray-500 text-sm">Welcome back! Log in to your account.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">{error}</div>}

        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
            <input 
              type="text" 
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition" 
              placeholder="e.g. johndoe" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition" 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <Link to="/register" className="text-accent font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
