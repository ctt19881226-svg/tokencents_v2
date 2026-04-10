import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Usage() {
  const data = [
    { name: 'Mon', tokens: 4000 },
    { name: 'Tue', tokens: 3000 },
    { name: 'Wed', tokens: 2000 },
    { name: 'Thu', tokens: 2780 },
    { name: 'Fri', tokens: 1890 },
    { name: 'Sat', tokens: 2390 },
    { name: 'Sun', tokens: 3490 },
  ];

  const models = [
    { name: 'GPT-4o', percentage: 60, color: 'bg-indigo-500' },
    { name: 'Claude 3.5 Sonnet', percentage: 30, color: 'bg-emerald-500' },
    { name: 'Gemini 1.5 Pro', percentage: 10, color: 'bg-blue-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100">Usage & Billing</h1>
        <p className="text-zinc-400 mt-1">Monitor your API consumption and costs.</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Cost (This Month)</h3>
          <div className="text-3xl font-semibold text-zinc-100">$12.50</div>
        </div>
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Tokens</h3>
          <div className="text-3xl font-semibold text-zinc-100">1.2M</div>
        </div>
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Requests</h3>
          <div className="text-3xl font-semibold text-zinc-100">8,432</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-zinc-100 mb-6">Token Consumption (Last 7 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
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
          <div className="space-y-6">
            {models.map((model) => (
              <div key={model.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-300">{model.name}</span>
                  <span className="text-zinc-400">{model.percentage}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className={`${model.color} h-2 rounded-full`} style={{ width: `${model.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
