import { useState, useEffect, useRef } from 'react';
import { registerTeam, fetchTeam, loginWithPin, completeStation as completeStationApi, createWebSocket, fetchGameState } from '../api';
import { STATIONS } from '../data/stations';

const STORAGE_KEY = 'fyw_team_id';

export function useGameState() {
  const [screen, setScreen] = useState('welcome'); // welcome | setup | game | final | waiting
  const [team, setTeam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(7200);
  const [timerRunning, setTimerRunning] = useState(false);
  const [waitingRoomEnabled, setWaitingRoomEnabled] = useState(true);
  const [xpPopups, setXpPopups] = useState([]);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const timerRef = useRef(null);

  // Restore from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId) {
      fetchTeam(savedId)
        .then(t => { 
          setTeam(t); 
          // Check if waiting room is enabled
          fetchGameState().then(state => {
            if (state.waiting_room_enabled === 'true') {
              setWaitingRoomEnabled(true);
              setScreen('waiting');
            } else {
              setWaitingRoomEnabled(false);
              setScreen('game');
            }
          });
        })
        .catch(() => localStorage.removeItem(STORAGE_KEY));
    }
    fetchGameState().then(state => {
      setTimeLeft(state.timeLeft);
      setTimerRunning(state.timerRunning);
      setWaitingRoomEnabled(state.waiting_room_enabled === 'true');
      if (state.timeLeft === 0) setScreen('final');
    }).catch(() => {});
  }, []);

  // WebSocket
  useEffect(() => {
    wsRef.current = createWebSocket(handleWsMessage);
    return () => wsRef.current?.close();
  }, []);

  function handleWsMessage({ type, payload }) {
    if (type === 'TEAM_UPDATED' && team && payload.id === team.id) {
      // Check if a pending station was approved → show XP popup
      const wasPending = Object.keys(team.pending || {});
      const nowCompleted = Object.keys(payload.completed || {});
      const newlyApproved = nowCompleted.filter(id => wasPending.includes(id));
      
      if (newlyApproved.length > 0) {
        newlyApproved.forEach(stationId => {
          const station = STATIONS.find(s => s.id === Number(stationId));
          if (station) {
            const id = Date.now() + Math.random();
            setXpPopups(prev => [...prev, { id, points: station.points }]);
            setTimeout(() => setXpPopups(prev => prev.filter(p => p.id !== id)), 1400);
          }
        });
      }
      
      setTeam(payload);
    }
    if (type === 'GAME_STATE') {
      setTimeLeft(payload.timeLeft);
      setTimerRunning(payload.timerRunning);
      setWaitingRoomEnabled(payload.waiting_room_enabled === 'true');
      if (payload.timeLeft === 0) setScreen('final');
      // If waiting room is disabled, move to game
      if (payload.waiting_room_enabled === 'false' && screen === 'waiting') {
        setScreen('game');
      }
    }
  }

  // Local countdown tick
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!timerRunning || screen !== 'game') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); setScreen('final'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerRunning, screen]);

  async function startGame(teamData) {
    try {
      setError(null);
      const t = await registerTeam(teamData.name, teamData.icon);
      localStorage.setItem(STORAGE_KEY, t.id);
      setTeam(t);
      // Check if waiting room is enabled
      const state = await fetchGameState();
      if (state.waiting_room_enabled === 'true') {
        setWaitingRoomEnabled(true);
        setScreen('waiting');
      } else {
        setScreen('pin'); // show PIN before game
      }
    } catch (e) {
      setError(e.message || 'Server nicht erreichbar. Läuft das Backend?');
    }
  }

  async function loginGame(pin) {
    try {
      setError(null);
      const t = await loginWithPin(pin);
      localStorage.setItem(STORAGE_KEY, t.id);
      setTeam(t);
      // Check if waiting room is enabled
      const state = await fetchGameState();
      if (state.waiting_room_enabled === 'true') {
        setWaitingRoomEnabled(true);
        setScreen('waiting');
      } else {
        setScreen('game');
      }
    } catch (e) {
      setError(e.message || 'Ungültiger Code');
    }
  }

  async function completeStation(station, code = null) {
    if (!team || team.completed?.[station.id] || team.pending?.[station.id]) return;
    const updated = await completeStationApi(team.id, station.id, code);
    setTeam(updated);
    // Only show XP popup if immediately done (passive with correct code)
    if (updated.completed?.[station.id]) {
      const id = Date.now();
      setXpPopups(prev => [...prev, { id, points: station.points }]);
      setTimeout(() => setXpPopups(prev => prev.filter(p => p.id !== id)), 1400);
    }
  }

  function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('fyw_active_tab');
    setTeam(null);
    setScreen('welcome');
    setXpPopups([]);
    setError(null);
  }

  const totalXP = team?.totalXP ?? 0;
  const completed = team?.completed ?? {};
  const pending = team?.pending ?? {};

  return { screen, setScreen, team, completed, pending, timeLeft, timerRunning, waitingRoomEnabled, xpPopups, error, startGame, loginGame, completeStation, resetGame, totalXP };
}
