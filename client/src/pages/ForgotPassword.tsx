import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const inputClass = "w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm text-white placeholder-gray-500";

  return (
    <AuthLayout 
      title={<span>Forgot Password <Lock className="inline-block w-6 h-6 text-accent ml-1 mb-1" /></span>}
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      {isSubmitted ? (
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
          <p className="text-sm text-gray-400 mb-6">
            We've sent password reset instructions to <strong className="text-gray-200">{email}</strong>
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-primary font-semibold hover:underline text-sm"
          >
            Try another email address
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="Enter your email address" 
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-accent text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            {isLoading ? 'Sending...' : 'Send Reset Link'}
            {!isLoading && <span className="text-lg">→</span>}
          </button>
        </form>
      )}

      <div className="mt-8 text-center space-y-2">
        <p className="text-sm text-gray-500 font-medium">
          Remember your password? <Link to="/login" className="text-accent font-bold hover:underline">Sign in</Link>
        </p>
        <p className="text-sm text-gray-500 font-medium">
          Don't have an account? <Link to="/register" className="text-accent font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </AuthLayout>
  );
};
