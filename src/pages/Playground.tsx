import React, { useState } from 'react';
import { Play, Settings2, Clock } from 'lucide-react';

export function Playground() {
  const [prompt, setPrompt] = useState('Write a short poem about coding in the dark.');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [model, setModel] = useState('openai/gpt-4o-mini');

  const handleRun = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setLatency(null);
    setOutput('');
    
    const startTime = Date.now();
    
    try {
      const response = await fetch("http://13.211.211.10:8000/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);
      setOutput(content);
    } catch (error: any) {
      setOutput(`Error: ${error.message}\n\nNote: Since the API is HTTP (http://13.211.211.10:8000) and this site is HTTPS, your browser might block the request due to "Mixed Content" security policies.\n\nTo test this, you may need to allow insecure content for this site in your browser settings (e.g., clicking the site settings icon in the URL bar and allowing insecure content).`);
    } finally {
      setIsLoading(false);
      setLatency(Date.now() - startTime);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Playground</h1>
          <p className="text-zinc-400 mt-1 text-sm">Test prompts and models interactively.</p>
        </div>
        <button 
          onClick={handleRun}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Play size={16} className={isLoading ? "animate-pulse" : ""} />
          {isLoading ? 'Running...' : 'Run'}
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Config */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-[#18181b] border border-zinc-800 rounded-lg p-5 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center gap-2 text-zinc-100 font-medium pb-2 border-b border-zinc-800">
            <Settings2 size={18} />
            Configuration
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Model</label>
            <select 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
            >
              <option value="openai/gpt-4o-mini">gpt-4o-mini</option>
              <option value="openai/gpt-4o">gpt-4o</option>
              <option value="anthropic/claude-3-5-sonnet">claude-3-5-sonnet</option>
              <option value="google/gemini-1.5-pro">gemini-1.5-pro</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-zinc-400">Temperature</label>
              <span className="text-sm text-zinc-500">0.7</span>
            </div>
            <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Max Tokens</label>
            <input type="number" defaultValue="1024" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none" />
          </div>
        </div>

        {/* Right Content (Input/Output) */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {/* Input Area */}
          <div className="flex-1 flex flex-col bg-[#18181b] border border-zinc-800 rounded-lg overflow-hidden">
            <div className="bg-zinc-900/50 border-b border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
              System / User Prompt
            </div>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 w-full bg-transparent text-zinc-200 p-4 resize-none outline-none focus:ring-0 font-sans text-sm"
              placeholder="Enter your prompt here..."
            />
          </div>

          {/* Output Area */}
          <div className="flex-1 flex flex-col bg-black border border-zinc-800 rounded-lg overflow-hidden relative">
            <div className="bg-zinc-900/80 border-b border-zinc-800 px-4 py-2 flex justify-between items-center">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Output</span>
              {latency && (
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock size={12} />
                  {latency}ms
                </span>
              )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {output ? (
                <pre className="text-zinc-300 font-mono text-sm whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-600 text-sm italic">
                  Run a prompt to see the output here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
