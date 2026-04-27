import { useState } from 'react';

export default function AdminLogin({ onLogin, error }) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (pin.length < 4) return;
    setLoading(true);
    await onLogin(pin);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">🛠️</div>
        <h1 className="text-4xl font-black text-white tracking-tight">Admin-Bereich</h1>
        <p className="text-blue-100 mt-2 text-lg">Gib deinen PIN ein</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <label className="block text-blue-900 font-bold mb-4 text-lg">Admin-PIN</label>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value.slice(0, 6))}
          placeholder="••••"
          maxLength={6}
          className="w-full border-2 border-blue-200 rounded-2xl px-4 py-4 text-3xl font-black text-center tracking-widest focus:outline-none focus:border-blue-500 mb-6"
          autoFocus
        />

        {error && <p className="text-red-500 text-sm text-center font-semibold mb-4">{error}</p>}

        <button
          type="submit"
          disabled={pin.length < 4 || loading}
          className="w-full bg-blue-600 disabled:bg-blue-200 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          {loading ? '...' : 'Einloggen 🔑'}
        </button>
      </form>
    </div>
  );
}
