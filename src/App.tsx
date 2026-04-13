/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ApiKeys } from './pages/ApiKeys';
import { Usage } from './pages/Usage';
import { Playground } from './pages/Playground';
import { Docs } from './pages/Docs';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Menu, Activity, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [route, setRoute] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activePage, setActivePage] = useState('keys');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setRoute('dashboard');
      }
      setIsInitializing(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setRoute('dashboard');
      } else {
        setRoute('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Inactivity timeout effect
  useEffect(() => {
    if (!session) return;

    let timeoutId: number;

    const logout = async () => {
      await supabase.auth.signOut();
      alert("You have been logged out due to 10 minutes of inactivity.");
    };

    const resetTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(logout, 10 * 60 * 1000); // 10 minutes
    };

    resetTimer();

    let isThrottled = false;
    const handleActivity = () => {
      if (!isThrottled) {
        resetTimer();
        isThrottled = true;
        setTimeout(() => { isThrottled = false; }, 1000); // Throttle to 1s
      }
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-indigo-500">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (route === 'landing' && !session) {
    return <Landing onEnterDashboard={() => setRoute('auth')} />;
  }

  if (route === 'auth' && !session) {
    return <Auth onLogin={() => setRoute('dashboard')} onBack={() => setRoute('landing')} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'keys':
        return <ApiKeys />;
      case 'usage':
        return <Usage />;
      case 'playground':
        return <Playground />;
      case 'docs':
        return <Docs />;
      default:
        return <ApiKeys />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <Sidebar 
          activePage={activePage} 
          setActivePage={(page) => {
            setActivePage(page);
            setIsMobileMenuOpen(false);
          }} 
          onLogout={handleLogout} 
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#000000]">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 font-bold text-zinc-100">
            <Activity className="text-indigo-500" size={20} />
            <span>TokenCents</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-zinc-400 hover:text-zinc-100">
            <Menu size={24} />
          </button>
        </div>
        
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
