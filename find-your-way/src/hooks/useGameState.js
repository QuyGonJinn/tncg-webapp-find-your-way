import { useState, useEffect, useRef } from 'react';
import { GAME_DURATION, STATIONS } from '../data/stations';

const STORAGE_KEY = 'fyw_game_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  const [screen, setScreen] = useState('setup'); // setup | game | final
  const [team, setTeam] = useState({ name: '', icon: '🦁' });
  const [completed, setCompleted] = useState({}); // { stationId: true }
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [startedAt, setStartedAt] = useState(null);
  const [xpPopups, setXpPopups] = useState([]);
  const timerRef = useRef(null);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setTeam(saved.team || { name: '', icon: '🦁' });
      setCompleted(saved.completed || {});
      setStartedAt(saved.startedAt || null);
      setScreen(saved.screen || 'setup');
      if (saved.startedAt) {
        const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
        const remaining = Math.max(0, GAME_DURATION - elapsed);
        setTimeLeft(remaining);
        if (remaining === 0 && saved.screen === 'game') {
          setScreen('final');
        }
      }
    }
  }, []);

  // Persist on change
  useEffect(() => {
    saveState({ team, completed, startedAt, screen });
  }, [team, completed, startedAt, screen]);

  // Timer
  useEffect(() => {
    if (screen !== 'game') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setScreen('final');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen]);

  function startGame(teamData) {
    const now = Date.now();
    setTeam(teamData);
    setStartedAt(now);
    setCompleted({});
    setTimeLeft(GAME_DURATION);
    setScreen('game');
  }

  function completeStation(station) {
    if (completed[station.id]) return;
    setCompleted(prev => ({ ...prev, [station.id]: true }));
    // XP popup
    const id = Date.now();
    setXpPopups(prev => [...prev, { id, points: station.points }]);
    setTimeout(() => setXpPopups(prev => prev.filter(p => p.id !== id)), 1400);
  }

  function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    setScreen('setup');
    setTeam({ name: '', icon: '🦁' });
    setCompleted({});
    setTimeLeft(GAME_DURATION);
    setStartedAt(null);
  }

  const totalXP = Object.keys(completed).reduce((sum, id) => {
    const s = STATIONS.find(s => s.id === Number(id));
    return sum + (s ? s.points : 0);
  }, 0);

  return { screen, team, completed, timeLeft, xpPopups, startGame, completeStation, resetGame, totalXP };
}
