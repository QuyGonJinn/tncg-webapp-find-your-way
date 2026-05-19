import { useState, useEffect } from 'react';
import { loadGameSettings } from '../data/gameSettings';
import { useI18n } from '../hooks/useI18n';

export default function ReminderNotification({ timeLeft }) {
  const { t } = useI18n();
  const [reminders, setReminders] = useState([]);
  const [lastReminderTime, setLastReminderTime] = useState(null);

  useEffect(() => {
    const settings = loadGameSettings();
    const reminderInterval = settings.reminderInterval * 60; // In Sekunden

    // Prüfe ob ein neuer Reminder angezeigt werden soll
    if (timeLeft > 0 && timeLeft % reminderInterval === 0 && timeLeft !== lastReminderTime) {
      const minutes = Math.floor(timeLeft / 60);
      const newReminder = {
        id: Date.now(),
        message: `⏰ ${t('admin.minutesRemaining', { minutes })}`,
        timeLeft,
      };
      setReminders(prev => [...prev, newReminder]);
      setLastReminderTime(timeLeft);

      // Auto-remove nach 5 Sekunden
      setTimeout(() => {
        setReminders(prev => prev.filter(r => r.id !== newReminder.id));
      }, 5000);
    }
  }, [timeLeft, lastReminderTime, t]);

  const dismissReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2">
      {reminders.map(reminder => (
        <div
          key={reminder.id}
          className="bg-amber-100 border-2 border-amber-500 rounded-xl p-4 shadow-lg max-w-xs"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-amber-900 font-bold text-sm">{reminder.message}</p>
            <button
              onClick={() => dismissReminder(reminder.id)}
              className="text-amber-700 hover:text-amber-900 font-bold text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
