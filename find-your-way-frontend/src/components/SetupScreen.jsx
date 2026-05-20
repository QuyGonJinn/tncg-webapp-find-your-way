import { useState, useEffect } from 'react';
import { TEAM_ICONS } from '../data/stations';
import { useI18n } from '../hooks/useI18n';
import LanguageSwitcherDropdown from './LanguageSwitcherDropdown';
import PrivacyPolicyModal from './PrivacyPolicyModal';

export default function SetupScreen({ onStart, onLogin, error }) {
  const { t } = useI18n();
  const [tab, setTab] = useState('new');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(TEAM_ICONS[0]);
  const [pin, setPin] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Check if privacy policy has been accepted
  useEffect(() => {
    const privacyAccepted = localStorage.getItem('fyw_privacy_accepted');
    if (!privacyAccepted) {
      setShowPrivacy(true);
    }
  }, []);

  function handlePrivacyAccept(socialMediaAccepted) {
    localStorage.setItem('fyw_privacy_accepted', 'true');
    localStorage.setItem('fyw_social_media_accepted', socialMediaAccepted ? 'true' : 'false');
    setShowPrivacy(false);
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onStart({ name: name.trim(), icon, participants: [] });
  }

  function handleLogin(e) {
    e.preventDefault();
    if (pin.trim().length < 4) return;
    onLogin(pin.trim());
  }

  if (showPrivacy) {
    return <PrivacyPolicyModal onAccept={handlePrivacyAccept} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900 flex flex-col items-center justify-center p-6">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcherDropdown />
      </div>

      <div className="text-center mb-8">
        <div className="text-6xl mb-3">🗺️</div>
        <h1 className="text-4xl font-black text-amber-100 tracking-tight">Find Your Way</h1>
        <p className="text-amber-300 mt-2 text-lg">{t('welcome.subtitle')}</p>
      </div>

      <div className="bg-amber-50 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border-2 border-amber-300">
        {/* Tabs */}
        <div className="flex border-b border-amber-200 bg-amber-100">
          <button
            onClick={() => setTab('new')}
            className={`flex-1 py-3 font-bold text-sm transition-all ${tab === 'new' ? 'text-amber-900 border-b-2 border-amber-700' : 'text-stone-400'}`}
          >
            🆕 {t('setup.createTeam')}
          </button>
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 font-bold text-sm transition-all ${tab === 'login' ? 'text-amber-900 border-b-2 border-amber-700' : 'text-stone-400'}`}
          >
            🔑 {t('setup.loginWithPin')}
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {tab === 'new' ? (
            <form onSubmit={handleCreate}>
              <label className="block text-amber-900 font-bold mb-2 text-lg">{t('setup.teamName')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('setup.teamNamePlaceholder')}
                maxLength={20}
                className="w-full border-2 border-amber-300 rounded-2xl px-4 py-3 text-xl font-semibold focus:outline-none focus:border-amber-600 bg-white mb-5"
              />

              <label className="block text-amber-900 font-bold mb-3 text-lg">{t('setup.selectIcon')}</label>
              <div className="grid grid-cols-6 gap-3 mb-6">
                {TEAM_ICONS.map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`text-4xl p-3 rounded-2xl transition-all aspect-square flex items-center justify-center ${icon === ic ? 'bg-amber-200 ring-2 ring-amber-600 scale-110' : 'hover:bg-amber-100 bg-amber-50'}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>

              <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 mb-6">
                <p className="text-amber-900 font-bold text-sm">ℹ️ {t('setup.registration')}</p>
                <p className="text-stone-700 text-sm mt-2">
                  {t('setup.registrationDescription')}
                </p>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-amber-700 disabled:bg-stone-300 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
              >
                {t('setup.createTeam')} 🗺️
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <p className="text-stone-500 text-sm mb-4">{t('setup.pinHint')}</p>
              <label className="block text-amber-900 font-bold mb-2 text-lg">{t('setup.pin')}</label>
              <input
                type="text"
                value={pin}
                onChange={e => setPin(e.target.value.toUpperCase().slice(0, 4))}
                placeholder={t('setup.pinPlaceholder')}
                maxLength={4}
                className="w-full border-2 border-amber-300 rounded-2xl px-4 py-4 text-3xl font-black text-center tracking-widest focus:outline-none focus:border-amber-600 bg-white mb-6"
              />
              <button
                type="submit"
                disabled={pin.trim().length < 4}
                className="w-full bg-amber-700 disabled:bg-stone-300 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
              >
                {t('setup.login')} 🔑
              </button>
            </form>
          )}

          {error && <p className="text-red-700 text-sm text-center mt-3 font-semibold">{error}</p>}
        </div>
      </div>
    </div>
  );
}
