/**
 * Newsletter Signup
 * Email signup form for newsletter
 */

'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-400 rounded-xl p-6">
      <h3 className="font-bold text-lg text-gray-900 mb-2">📧 Stay Updated</h3>
      <p className="text-gray-700 text-sm mb-4">
        Get the latest crypto news delivered to your inbox daily.
      </p>
      
      {status === 'success' ? (
        <div className="bg-white/50 rounded-lg p-4 text-center">
          <span className="text-green-700 font-medium">✓ Thanks for subscribing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-2 rounded-lg border-2 border-transparent focus:border-black focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-black text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
          </button>
        </form>
      )}
      
      <p className="text-gray-600 text-xs mt-3 text-center">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
