import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export function Docs() {
  const [copied, setCopied] = useState(false);

  const curlCode = `curl https://api.oneapi.example.com/v1/chat/completions \\
  -H "Authorization: Bearer $YOUR_KEY" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Hello, world!"
      }
    ]
  }'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100">Documentation</h1>
        <p className="text-zinc-400 mt-1">Learn how to integrate our unified API into your application.</p>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-medium text-zinc-200 mb-4">Authentication</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            Authenticate your API requests by including your secret key in the <code className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-xs">Authorization</code> HTTP header. 
            You can manage your API keys in the Dashboard.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300">
            Authorization: Bearer YOUR_API_KEY
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium text-zinc-200 mb-4">Chat Completions</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            Given a list of messages comprising a conversation, the model will return a response.
            Our API is fully compatible with the OpenAI format, allowing you to drop it into existing SDKs.
          </p>
          
          <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
            <div className="bg-zinc-900/80 border-b border-zinc-800 px-4 py-2 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <Terminal size={14} />
                cURL
              </div>
              <button 
                onClick={handleCopy}
                className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-xs"
              >
                {copied ? <><Check size={14} className="text-green-500"/> Copied</> : <><Copy size={14}/> Copy</>}
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-zinc-300 font-mono text-sm">
                <code>{curlCode}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
