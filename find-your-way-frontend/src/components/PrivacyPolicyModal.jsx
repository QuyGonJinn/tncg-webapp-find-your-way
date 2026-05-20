import { useState } from 'react';
import { useI18n } from '../hooks/useI18n';

export default function PrivacyPolicyModal({ onAccept }) {
  const { t } = useI18n();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-amber-900 text-white px-6 py-4">
          <h2 className="text-2xl font-black">{t('privacy.title')}</h2>
          <p className="text-amber-200 text-sm mt-1">{t('privacy.subtitle')}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 text-sm text-stone-700">
          {/* Section 1 */}
          <div>
            <h3 className="font-bold text-amber-900 mb-2">📋 {t('privacy.section1Title')}</h3>
            <p className="text-stone-600 leading-relaxed">{t('privacy.section1Content')}</p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="font-bold text-amber-900 mb-2">🔒 {t('privacy.section2Title')}</h3>
            <p className="text-stone-600 leading-relaxed">{t('privacy.section2Content')}</p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="font-bold text-amber-900 mb-2">📸 {t('privacy.section3Title')}</h3>
            <p className="text-stone-600 leading-relaxed">{t('privacy.section3Content')}</p>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="font-bold text-amber-900 mb-2">⏱️ {t('privacy.section4Title')}</h3>
            <p className="text-stone-600 leading-relaxed">{t('privacy.section4Content')}</p>
          </div>

          {/* Section 5 */}
          <div>
            <h3 className="font-bold text-amber-900 mb-2">✋ {t('privacy.section5Title')}</h3>
            <p className="text-stone-600 leading-relaxed">{t('privacy.section5Content')}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 px-6 py-4 bg-stone-50 space-y-3">
          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-2 border-amber-300 accent-amber-700"
            />
            <span className="text-sm text-stone-700 font-semibold">
              {t('privacy.acceptCheckbox')}
            </span>
          </label>

          {/* Button */}
          <button
            onClick={() => onAccept()}
            disabled={!accepted}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white font-black py-3 rounded-2xl transition-all"
          >
            {t('privacy.acceptButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
