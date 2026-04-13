import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number) => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [amount, setAmount] = useState<number>(25);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  if (!isOpen) return null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    // Mock payment processing delay
    setTimeout(() => {
      setStatus('success');
      if (onSuccess) onSuccess(amount);
      // Auto close after success
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {status === 'success' ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="text-green-500 w-16 h-16 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Payment Successful</h2>
            <p className="text-zinc-400">Your balance has been updated with ${amount}.00</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <CreditCard size={20} className="text-indigo-500" />
                Top Up Balance
              </h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePayment} className="p-6 space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3">Select Amount</label>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 25, 50].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                        amount === val 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                          : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Card Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="0000 0000 0000 0000" 
                    className="w-full bg-black border border-zinc-800 text-zinc-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Expiry Date</label>
                    <input 
                      type="text" 
                      required
                      placeholder="MM/YY" 
                      className="w-full bg-black border border-zinc-800 text-zinc-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">CVC</label>
                    <input 
                      type="text" 
                      required
                      placeholder="123" 
                      className="w-full bg-black border border-zinc-800 text-zinc-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === 'processing'}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${amount}.00`
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
