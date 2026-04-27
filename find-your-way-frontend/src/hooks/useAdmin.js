import { useState, useEffect, useRef } from 'react';
import { fetchAllTeams, fetchGameState, timerStart, timerPause, timerReset, uncompleteStation, deleteTeam, approveStation, rejectStation, createWebSocket } from '../api';

export function useAdmin() {
  const [teams, setTeams] = useState([]);
  const [gameState, setGameState] = useState({ timeLeft: 7200, timerRunning: false });
  const wsRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchAllTeams().then(setTeams).catch(() => {});
    fetchGameState().then(setGameState).catch(() => {});

    wsRef.current = createWebSocket(({ type, payload }) => {
      if (type === 'TEAM_JOINED') setTeams(prev => [...prev, payload]);
      if (type === 'TEAM_UPDATED') setTeams(prev => prev.map(t => t.id === payload.id ? payload : t));
      if (type === 'TEAM_DELETED') setTeams(prev => prev.filter(t => t.id !== payload.id));
      if (type === 'GAME_STATE') setGameState(payload);
    });

    return () => { wsRef.current?.close(); clearInterval(timerRef.current); };
  }, []);

  // Local tick
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!gameState.timerRunning) return;
    timerRef.current = setInterval(() => {
      setGameState(prev => ({ ...prev, timeLeft: Math.max(0, prev.timeLeft - 1) }));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState.timerRunning]);

  async function handleTimerStart() { const s = await timerStart(); setGameState(s); }
  async function handleTimerPause() { const s = await timerPause(); setGameState(s); }
  async function handleTimerReset() { const s = await timerReset(); setGameState(s); }

  async function handleApprove(teamId, stationId) {
    const updated = await approveStation(teamId, stationId);
    setTeams(prev => prev.map(t => t.id === teamId ? updated : t));
  }

  async function handleReject(teamId, stationId) {
    const updated = await rejectStation(teamId, stationId);
    setTeams(prev => prev.map(t => t.id === teamId ? updated : t));
  }

  async function handleUncomplete(teamId, stationId) {
    const updated = await uncompleteStation(teamId, stationId);
    setTeams(prev => prev.map(t => t.id === teamId ? updated : t));
  }

  async function handleDeleteTeam(teamId) {
    await deleteTeam(teamId);
    setTeams(prev => prev.filter(t => t.id !== teamId));
  }

  return { teams, gameState, handleTimerStart, handleTimerPause, handleTimerReset, handleUncomplete, handleDeleteTeam, handleApprove, handleReject };
}
