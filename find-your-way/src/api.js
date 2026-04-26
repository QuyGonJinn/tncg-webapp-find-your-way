const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3001';

export async function registerTeam(name, icon) {
  const res = await fetch(`${BASE}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, icon }),
  });
  if (!res.ok) throw new Error('Team konnte nicht erstellt werden');
  return res.json();
}

export async function fetchTeam(id) {
  const res = await fetch(`${BASE}/teams/${id}`);
  if (!res.ok) throw new Error('Team nicht gefunden');
  return res.json();
}

export async function fetchAllTeams() {
  const res = await fetch(`${BASE}/teams`);
  return res.json();
}

export async function completeStation(teamId, stationId) {
  const res = await fetch(`${BASE}/teams/${teamId}/complete/${stationId}`, { method: 'POST' });
  return res.json();
}

export async function uncompleteStation(teamId, stationId) {
  const res = await fetch(`${BASE}/teams/${teamId}/complete/${stationId}`, { method: 'DELETE' });
  return res.json();
}

export async function deleteTeam(teamId) {
  await fetch(`${BASE}/teams/${teamId}`, { method: 'DELETE' });
}

export async function fetchGameState() {
  const res = await fetch(`${BASE}/game/state`);
  return res.json();
}

export async function timerStart() {
  const res = await fetch(`${BASE}/game/timer/start`, { method: 'POST' });
  return res.json();
}

export async function timerPause() {
  const res = await fetch(`${BASE}/game/timer/pause`, { method: 'POST' });
  return res.json();
}

export async function timerReset() {
  const res = await fetch(`${BASE}/game/timer/reset`, { method: 'POST' });
  return res.json();
}

export async function clearAllMessages() {
  await fetch(`${BASE}/chat`, { method: 'DELETE' });
}

export async function fetchMessages(teamId) {
  const res = await fetch(`${BASE}/chat/${teamId}`);
  return res.json();
}

export async function fetchAllMessages() {
  const res = await fetch(`${BASE}/chat`);
  return res.json();
}

export async function sendMessage(teamId, text) {
  const res = await fetch(`${BASE}/chat/${teamId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function sendAdminReply(teamId, text) {
  const res = await fetch(`${BASE}/chat/${teamId}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export function createWebSocket(onMessage) {
  const ws = new WebSocket(WS_URL);
  ws.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)); } catch {}
  };
  ws.onerror = (e) => console.warn('WS error', e);
  return ws;
}
