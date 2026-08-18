import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    pin: '',
    referralCode: ''
  });
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary mb-2">DEPAYHUB</h1>
          <p className="text-gray-500 text-sm">Create an account to get started.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition" placeholder="e.g. John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input name="username" type="text" required value={formData.username} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition" placeholder="e.g. johndoe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition" placeholder="e.g. john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" required minLength={8} value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction PIN (4 digits)</label>
            <input name="pin" type="text" required maxLength={4} pattern="\d{4}" value={formData.pin} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition" placeholder="1234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code (Optional)</label>
            <input name="referralCode" type="text" value={formData.referralCode} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition" placeholder="Referrer username" />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="text-accent font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};
