const express = require('express');
const router = express.Router();
const db = require('../db');
const STATIONS = require('../stations');
const { broadcast } = require('../wss');
const { randomUUID } = require('crypto');

function buildTeamPayload(team) {
  const completions = db.all(
    `SELECT station_id, completed_at FROM completions WHERE team_id = ?`, [team.id]
  );
  const completed = {};
  completions.forEach(c => { completed[c.station_id] = c.completed_at; });

  const totalXP = completions.reduce((sum, c) => {
    const s = STATIONS.find(s => s.id === Number(c.station_id));
    return sum + (s ? s.points : 0);
  }, 0);

  return { ...team, completed, totalXP };
}

// GET all teams
router.get('/', (req, res) => {
  const teams = db.all(`SELECT * FROM teams ORDER BY created_at ASC`);
  res.json(teams.map(buildTeamPayload));
});

// POST register team
router.post('/', (req, res) => {
  const { name, icon } = req.body;
  if (!name || !icon) return res.status(400).json({ error: 'name and icon required' });

  const id = randomUUID();
  db.run(`INSERT INTO teams (id, name, icon, created_at) VALUES (?, ?, ?, ?)`, [id, name, icon, Date.now()]);

  const team = buildTeamPayload({ id, name, icon, created_at: Date.now() });
  broadcast('TEAM_JOINED', team);
  res.status(201).json(team);
});

// GET single team
router.get('/:id', (req, res) => {
  const team = db.get(`SELECT * FROM teams WHERE id = ?`, [req.params.id]);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json(buildTeamPayload(team));
});

// POST complete a station
router.post('/:id/complete/:stationId', (req, res) => {
  const { id, stationId } = req.params;
  const team = db.get(`SELECT * FROM teams WHERE id = ?`, [id]);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  const station = STATIONS.find(s => s.id === Number(stationId));
  if (!station) return res.status(404).json({ error: 'Station not found' });

  db.run(
    `INSERT OR IGNORE INTO completions (team_id, station_id, completed_at) VALUES (?, ?, ?)`,
    [id, Number(stationId), Date.now()]
  );

  const updated = buildTeamPayload(team);
  broadcast('TEAM_UPDATED', updated);
  res.json(updated);
});

// DELETE uncomplete a station (admin)
router.delete('/:id/complete/:stationId', (req, res) => {
  const { id, stationId } = req.params;
  db.run(`DELETE FROM completions WHERE team_id = ? AND station_id = ?`, [id, Number(stationId)]);

  const team = db.get(`SELECT * FROM teams WHERE id = ?`, [id]);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  const updated = buildTeamPayload(team);
  broadcast('TEAM_UPDATED', updated);
  res.json(updated);
});

// DELETE team (admin)
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM completions WHERE team_id = ?`, [req.params.id]);
  db.run(`DELETE FROM teams WHERE id = ?`, [req.params.id]);
  broadcast('TEAM_DELETED', { id: req.params.id });
  res.json({ ok: true });
});

module.exports = router;
