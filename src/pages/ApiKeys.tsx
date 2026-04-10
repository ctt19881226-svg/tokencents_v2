import React from 'react';
import { Copy, Check, Plus, Eye, EyeOff } from "lucide-react";

export function ApiKeys() {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [showKey, setShowKey] = React.useState<string | null>(null);

  const keys = [
    { id: "1", name: "Dev-App", key: "sk-5128a8c9b2e4d7f6x92a", created: "2023-10-01", usage: "125k tokens", status: "Active" },
    { id: "2", name: "Prod-App", key: "sk-9z1a8c9b2e4d7f6x92a", created: "2023-10-15", usage: "890k tokens", status: "Active" },
  ];

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleShowKey = (id: string) => {
    setShowKey(showKey === id ? null : id);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 3) + "••••••••••••••••" + key.substring(key.length - 4);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100">API Keys</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} />
          Create New Key
        </button>
      </header>

      {/* Quota Card */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-1">Current Plan: Pro</h3>
            <div className="text-2xl font-semibold text-zinc-100">$12.50 <span className="text-sm font-normal text-zinc-500">/ $50.00 limit</span></div>
          </div>
          <div className="text-sm text-zinc-400">25% used</div>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
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
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {keys.map((item) => (
              <tr key={item.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                <td className="p-4 text-zinc-200 font-medium">{item.name}</td>
                <td className="p-4 font-mono text-zinc-400 flex items-center gap-2">
                  {showKey === item.id ? item.key : maskKey(item.key)}
                  <button onClick={() => toggleShowKey(item.id)} className="text-zinc-500 hover:text-zinc-300">
                    {showKey === item.id ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </td>
                <td className="p-4 text-zinc-400">{item.created}</td>
                <td className="p-4 text-zinc-400">{item.usage}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleCopy(item.key)}
                    className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedKey === item.key ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
