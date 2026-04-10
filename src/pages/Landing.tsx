import React from 'react';
import { Activity, Zap, Network, Key, ChevronRight, Check } from 'lucide-react';

interface LandingProps {
  onEnterDashboard: () => void;
}

export function Landing({ onEnterDashboard }: LandingProps) {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-y-auto">
      {/* Navbar */}
      <nav className="border-b border-zinc-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Activity className="text-indigo-500" />
            <span>TokenCents</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onEnterDashboard} className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
              Sign In
            </button>
            <button onClick={onEnterDashboard} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Get API Key
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-32 px-6 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500">
            One API for multiple AI models <br className="hidden md:block"/> at lower cost
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Access GPT-4, Claude 3, and Gemini through a single unified endpoint. Save money with intelligent routing and pay-as-you-go pricing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onEnterDashboard} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-base font-medium flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">
              Get API Key <ChevronRight size={18} />
            </button>
            <button className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 px-8 py-3 rounded-md text-base font-medium transition-colors w-full sm:w-auto">
              Read Documentation
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 border-t border-zinc-900 bg-[#09090b]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black border border-zinc-800/50 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cheaper than OpenAI</h3>
                <p className="text-zinc-400 leading-relaxed">
                  We aggregate volume and optimize requests to offer you rates up to 30% lower than direct API access.
                </p>
              </div>
              <div className="bg-black border border-zinc-800/50 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center mb-6">
                  <Network size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-model routing</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Automatically route requests to the fastest or cheapest model based on your custom latency and cost constraints.
                </p>
              </div>
              <div className="bg-black border border-zinc-800/50 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center mb-6">
                  <Key size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">One API key</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Stop managing dozens of billing accounts. Use a single TokenCents key to access every major foundation model.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-32 px-6 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-400 mb-12">No monthly fees. Pay only for the tokens you consume.</p>
            
            <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-8 md:p-12 text-left flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Pay as you go</h3>
                <p className="text-zinc-400 mb-6">Access all models with a single unified balance.</p>
                <ul className="space-y-4">
                  {[
                    'No minimum commitment or subscription', 
                    'Volume discounts applied automatically', 
                    'Set hard limits to prevent overspend'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-300">
                      <div className="bg-indigo-500/20 p-1 rounded-full">
                        <Check size={14} className="text-indigo-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-black border border-zinc-800 rounded-xl p-8 min-w-[280px] text-center shadow-xl">
                <div className="text-zinc-400 text-sm font-medium mb-2">Starting at</div>
                <div className="text-5xl font-bold text-zinc-100 mb-2">$0.15</div>
                <div className="text-zinc-500 text-sm mb-8">per 1M tokens</div>
                <button onClick={onEnterDashboard} className="w-full bg-zinc-100 hover:bg-white text-black px-4 py-3 rounded-md text-sm font-semibold transition-colors">
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 text-center text-zinc-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Activity size={16} />
          <span className="font-semibold text-zinc-400">TokenCents</span>
        </div>
        <p>© 2026 TokenCents Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
