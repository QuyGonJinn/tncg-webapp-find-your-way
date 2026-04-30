const express = require('express');
const router = express.Router();
const db = require('../db');
const { broadcast } = require('../wss');

function getState() {
  const rows = db.all(`SELECT key, value FROM game_state`);
  const map = {};
  rows.forEach(r => { map[r.key] = r.value; });
  return {
    timerRunning: map.timer_running === 'true',
    timerStartedAt: Number(map.timer_started_at),
    timerDuration: Number(map.timer_duration),
    timerElapsed: Number(map.timer_elapsed),
  };
}

function computeTimeLeft(state) {
  if (state.timerRunning) {
    const elapsed = state.timerElapsed + Math.floor((Date.now() - state.timerStartedAt) / 1000);
    return Math.max(0, state.timerDuration - elapsed);
  }
  return Math.max(0, state.timerDuration - state.timerElapsed);
}

function setState(key, value) {
  db.run(`UPDATE game_state SET value = ? WHERE key = ?`, [String(value), key]);
}

router.get('/state', (req, res) => {
  const state = getState();
  res.json({ ...state, timeLeft: computeTimeLeft(state) });
});

router.post('/timer/start', (req, res) => {
  const state = getState();
  if (state.timerRunning) return res.json({ ...state, timeLeft: computeTimeLeft(state) });

  setState('timer_running', 'true');
  setState('timer_started_at', Date.now());

  const newState = getState();
  const payload = { ...newState, timeLeft: computeTimeLeft(newState) };
  broadcast('GAME_STATE', payload);
  res.json(payload);
});

router.post('/timer/pause', (req, res) => {
  const state = getState();
  if (!state.timerRunning) return res.json({ ...state, timeLeft: computeTimeLeft(state) });

  const elapsed = state.timerElapsed + Math.floor((Date.now() - state.timerStartedAt) / 1000);
  setState('timer_running', 'false');
  setState('timer_elapsed', elapsed);

  const newState = getState();
  const payload = { ...newState, timeLeft: computeTimeLeft(newState) };
  broadcast('GAME_STATE', payload);
  res.json(payload);
});

router.post('/timer/reset', (req, res) => {
  setState('timer_running', 'false');
  setState('timer_started_at', '0');
  setState('timer_elapsed', '0');

  const newState = getState();
  const payload = { ...newState, timeLeft: computeTimeLeft(newState) };
  broadcast('GAME_STATE', payload);
  res.json(payload);
});

module.exports = router;
