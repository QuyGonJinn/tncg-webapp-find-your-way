import { useState, useEffect } from 'react';

export default function ReminderBox({ reminder, onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!reminder) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [reminder, onDismiss]);

  if (!visible || !reminder) return null;

  return (
    <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl shadow-lg p-4 z-40 animate-pulse">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⏰</span>
        <div className="flex-1">
          <p className="font-bold text-sm">{reminder.message}</p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className="text-white hover:text-orange-100 font-bold text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
