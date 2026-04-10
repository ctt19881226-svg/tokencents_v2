import React, { useState } from 'react';
import { Activity, ArrowLeft, Github } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
  onBack: () => void;
}

export function Auth({ onLogin, onBack }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    onLogin();
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex flex-col selection:bg-indigo-500/30">
      {/* Header */}
      <header className="p-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <Activity className="text-indigo-500" size={24} />
            </div>
          </div>

          {/* Card */}
          <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-2xl font-semibold text-center mb-2">
              {isSignUp ? 'Create your account' : 'Sign in to TokenCents'}
            </h1>
            <p className="text-zinc-400 text-sm text-center mb-8">
              {isSignUp 
                ? 'Start building with unified AI models today.' 
                : 'Welcome back! Please enter your details.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-zinc-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-zinc-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {!isSignUp && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </a>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-md text-sm font-medium transition-colors mt-2"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-px bg-zinc-800 flex-1"></div>
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Or continue with</span>
              <div className="h-px bg-zinc-800 flex-1"></div>
            </div>

            <div className="mt-6 space-y-3">
              <button 
                type="button"
                onClick={onLogin}
                className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button 
                type="button"
                onClick={onLogin}
                className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-8">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
