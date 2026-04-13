import React, { useState, useEffect } from 'react';
import { Copy, Check, Plus, CreditCard, AlertCircle, X, Loader2 } from "lucide-react";
import { PaymentModal } from '../components/PaymentModal';
import { supabase } from '../lib/supabase';

export function ApiKeys() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [keys, setKeys] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [keysRes, userRes] = await Promise.all([
      supabase.from('api_keys').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('users').select('balance').eq('id', user.id).single()
    ]);

    if (keysRes.data) setKeys(keysRes.data);
    if (userRes.data) setBalance(Number(userRes.data.balance) || 0);
    setIsLoading(false);
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate key
      const randomBytes = new Uint8Array(16);
      crypto.getRandomValues(randomBytes);
      const randomHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      const rawKey = `sk-or-${randomHex}`;
      
      // Hash key
      const msgBuffer = new TextEncoder().encode(rawKey);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      const keyPrefix = rawKey.substring(0, 10);

      const { error } = await supabase.from('api_keys').insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        name: newKeyName || 'Untitled Key',
        key_prefix: keyPrefix,
        key_hash: keyHash,
        total_requests: 0,
        total_tokens: 0,
        is_active: true
      });

      if (error) throw error;

      setNewlyCreatedKey(rawKey);
      setShowCreateModal(false);
      setNewKeyName('');
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePaymentSuccess = async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const newBalance = balance + amount;
    await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
    setBalance(newBalance);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100">API Keys</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Create New Key
        </button>
      </header>

      {/* Quota Card */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-1">Current Plan: Pay as you go</h3>
            <div className="text-2xl font-semibold text-zinc-100">${balance.toFixed(2)} <span className="text-sm font-normal text-zinc-500">balance</span></div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <CreditCard size={14} />
              Top Up
            </button>
          </div>
        </div>
      </div>

      {/* API Key Table */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400 text-sm">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Secret Key</th>
              <th className="p-4 font-medium">Created</th>
              <th className="p-4 font-medium">Usage</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  <Loader2 className="animate-spin w-6 h-6 mx-auto mb-2" />
                  Loading keys...
                </td>
              </tr>
            ) : keys.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  No API keys found. Create one to get started.
                </td>
              </tr>
            ) : (
              keys.map((item) => (
                <tr key={item.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4 text-zinc-200 font-medium">{item.name}</td>
                  <td className="p-4 font-mono text-zinc-400">
                    {item.key_prefix}••••••••••••••••
                  </td>
                  <td className="p-4 text-zinc-400">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-zinc-400">{item.total_tokens || 0} tokens</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {item.is_active ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onSuccess={handlePaymentSuccess} />

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-white">Create new secret key</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateKey} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Name</label>
                <input 
                  type="text" 
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="My Test Key" 
                  className="w-full bg-black border border-zinc-800 text-zinc-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreating}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {isCreating && <Loader2 size={14} className="animate-spin" />}
                  Create secret key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show New Key Modal */}
      {newlyCreatedKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-white mb-2">Save your secret key</h2>
              <div className="flex items-start gap-3 text-amber-500/80 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>Please save this secret key somewhere safe and accessible. For security reasons, <strong>you won't be able to view it again</strong> through your account.</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative">
                <input 
                  type="text" 
                  readOnly
                  value={newlyCreatedKey}
                  className="w-full bg-black border border-zinc-800 text-zinc-200 text-sm rounded-md block p-3 pr-12 outline-none font-mono"
                />
                <button 
                  onClick={() => handleCopy(newlyCreatedKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                >
                  {copiedKey === newlyCreatedKey ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <button 
                onClick={() => setNewlyCreatedKey(null)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                I've saved it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
