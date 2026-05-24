import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

const LoginPopup = ({ onSignupClick, onLoginSuccess }) => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setErrorMsg(err || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl shadow-xl p-8 relative border border-slate-800 animate-scale-in">
      {/* Decorative ambient light */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-100">Welcome Back</h3>
        <p className="text-xs text-slate-400 mt-1">Access BDA dashboard & workspace tools</p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-950/30 border border-red-800/50 text-red-400 text-sm rounded-lg animate-fade-in">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="bda@manufacture.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input form-input-with-icon"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
          <div className="relative">
            <div className="absolute inset-y-3 left-3 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input form-input-with-icon form-input-with-right-icon"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              Login to Dashboard <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Alert Tip */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p className="bg-slate-900/60 p-2 rounded border border-slate-800/50">
          Demo BDA: <span className="text-slate-300">rajesh@manufacture.com</span> <br />
          Password: <span className="text-slate-300">password123</span>
        </p>
      </div>

      {/* Switch to Signup */}
      <div className="mt-4 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <button
          onClick={onSignupClick}
          className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-4 transition-colors"
        >
          Register here
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
