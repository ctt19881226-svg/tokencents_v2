import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCard, Loader2 } from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';
import { supabase } from '../lib/supabase';

export function Usage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ cost: 0, tokens: 0, requests: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [modelData, setModelData] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [logsRes, userRes] = await Promise.all([
      supabase.from('usage_logs').select('*').eq('user_id', user.id),
      supabase.from('users').select('balance').eq('id', user.id).single()
    ]);

    if (userRes.data) {
      setBalance(Number(userRes.data.balance) || 0);
    }

    const logs = logsRes.data || [];
    let totalCost = 0;
    let totalTokens = 0;
    let totalRequests = logs.length;

    const dailyUsage: Record<string, number> = {};
    const modelUsage: Record<string, number> = {};

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyUsage[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
    }

    logs.forEach(log => {
      totalCost += Number(log.cost || 0);
      totalTokens += Number(log.total_tokens || 0);

      const logDate = new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short' });
      if (dailyUsage[logDate] !== undefined) {
        dailyUsage[logDate] += Number(log.total_tokens || 0);
      }

      const modelName = log.model || 'Unknown';
      modelUsage[modelName] = (modelUsage[modelName] || 0) + Number(log.total_tokens || 0);
    });

    const formattedChartData = Object.keys(dailyUsage).map(key => ({ 
      name: key, 
      tokens: dailyUsage[key] 
    }));

    const modelColors = ['bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-rose-500'];
    const formattedModelData = Object.keys(modelUsage).map((key, index) => ({
      name: key,
      percentage: totalTokens > 0 ? Math.round((modelUsage[key] / totalTokens) * 100) : 0,
      color: modelColors[index % modelColors.length]
    })).sort((a, b) => b.percentage - a.percentage);

    setStats({ cost: totalCost, tokens: totalTokens, requests: totalRequests });
    setChartData(formattedChartData);
    setModelData(formattedModelData);
    setIsLoading(false);
  };

  const handlePaymentSuccess = async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const newBalance = balance + amount;
    await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
    setBalance(newBalance);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Usage & Billing</h1>
          <p className="text-zinc-400 mt-1">Monitor your API consumption and costs.</p>
        </div>
        <button 
          onClick={() => setIsPaymentModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <CreditCard size={16} />
          Add Funds
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Cost (All Time)</h3>
          <div className="text-3xl font-semibold text-zinc-100">${stats.cost.toFixed(4)}</div>
        </div>
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Tokens</h3>
          <div className="text-3xl font-semibold text-zinc-100">
            {stats.tokens >= 1000000 ? `${(stats.tokens / 1000000).toFixed(1)}M` : 
             stats.tokens >= 1000 ? `${(stats.tokens / 1000).toFixed(1)}k` : 
             stats.tokens}
          </div>
        </div>
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Requests</h3>
          <div className="text-3xl font-semibold text-zinc-100">{stats.requests.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-zinc-100 mb-6">Token Consumption (Last 7 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fafafa' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line type="monotone" dataKey="tokens" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#18181b', stroke: '#6366f1', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Breakdown */}
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-zinc-100 mb-6">Model Breakdown</h3>
          {modelData.length === 0 ? (
            <div className="text-zinc-500 text-sm text-center py-8">No usage data available yet.</div>
          ) : (
            <div className="space-y-6">
              {modelData.map((model) => (
                <div key={model.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-300 truncate pr-2">{model.name}</span>
                    <span className="text-zinc-400 shrink-0">{model.percentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className={`${model.color} h-2 rounded-full`} style={{ width: `${model.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onSuccess={handlePaymentSuccess} />
    </div>
  );
}
