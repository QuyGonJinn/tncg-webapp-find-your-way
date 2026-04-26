const express = require('express');
const router = express.Router();
const db = require('../db');
const STATIONS = require('../stations');
const { broadcast } = require('../wss');
const { randomUUID } = require('crypto');

function generatePin() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function buildTeamPayload(team) {
  const completions = db.all(
    `SELECT station_id, completed_at, status FROM completions WHERE team_id = ?`, [team.id]
  );
  const completed = {};
  const pending = {};
  completions.forEach(c => {
    if (c.status === 'done') completed[c.station_id] = c.completed_at;
    if (c.status === 'pending') pending[c.station_id] = c.completed_at;
  });

  const totalXP = completions
    .filter(c => c.status === 'done')
    .reduce((sum, c) => {
      const s = STATIONS.find(s => s.id === Number(c.station_id));
      return sum + (s ? s.points : 0);
    }, 0);

  return { ...team, completed, pending, totalXP };
}

// POST login with PIN
router.post('/login', (req, res) => {
  const { pin } = req.body;
  if (!pin) return res.status(400).json({ error: 'pin required' });
  const team = db.get(`SELECT * FROM teams WHERE pin = ?`, [pin.toUpperCase()]);
  if (!team) return res.status(404).json({ error: 'Ungültiger Code' });
  res.json(buildTeamPayload(team));
});

// GET all teams
router.get('/', (req, res) => {
  const teams = db.all(`SELECT * FROM teams ORDER BY created_at ASC`);
  res.json(teams.map(buildTeamPayload));
});

// Normalize team name: lowercase, trim, collapse multiple spaces
function normalizeTeamName(name) {
  if (!name || typeof name !== 'string') return '';
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
}

// POST register team
router.post('/', (req, res) => {
  const { name, icon } = req.body;
  if (!name || !icon) return res.status(400).json({ error: 'name and icon required' });
  
  // Check if team name already exists (normalized comparison)
  const normalized = normalizeTeamName(name);
  const allTeams = db.all(`SELECT id, name FROM teams`);
  const existing = allTeams.find(t => normalizeTeamName(t.name) === normalized);
  if (existing) return res.status(409).json({ error: 'Teamname existiert bereits' });
  
  const id = randomUUID();
  const pin = generatePin();
  db.run(`INSERT INTO teams (id, name, icon, pin, created_at) VALUES (?, ?, ?, ?, ?)`, [id, name, icon, pin, Date.now()]);
  const team = buildTeamPayload({ id, name, icon, pin, created_at: Date.now() });
  broadcast('TEAM_JOINED', team);
  res.status(201).json(team);
});

// GET single team
router.get('/:id', (req, res) => {
  const team = db.get(`SELECT * FROM teams WHERE id = ?`, [req.params.id]);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json(buildTeamPayload(team));
});

// POST complete a station (passiv = code check, aktiv = pending)
router.post('/:id/complete/:stationId', (req, res) => {
  const { id, stationId } = req.params;
  const { code } = req.body;

  const team = db.get(`SELECT * FROM teams WHERE id = ?`, [id]);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  const station = STATIONS.find(s => s.id === Number(stationId));
  if (!station) return res.status(404).json({ error: 'Station not found' });

  // Check if already done or pending
  const existing = db.get(
    `SELECT status FROM completions WHERE team_id = ? AND station_id = ?`, [id, Number(stationId)]
  );
  if (existing) return res.status(400).json({ error: 'Bereits erledigt oder ausstehend' });

  if (station.type === 'passiv') {
    // Validate code
    if (!code || code.toUpperCase() !== station.code) {
      return res.status(400).json({ error: 'Falscher Code' });
    }
    db.run(
      `INSERT INTO completions (team_id, station_id, completed_at, status) VALUES (?, ?, ?, 'done')`,
      [id, Number(stationId), Date.now()]
    );
  } else {
    // Active station → pending, needs admin approval
    db.run(
      `INSERT INTO completions (team_id, station_id, completed_at, status) VALUES (?, ?, ?, 'pending')`,
      [id, Number(stationId), Date.now()]
    );
  }

  const updated = buildTeamPayload(team);
  broadcast('TEAM_UPDATED', updated);
  res.json(updated);
});

// POST admin approve a pending station
router.post('/:id/approve/:stationId', (req, res) => {
  const { id, stationId } = req.params;
  db.run(
    `UPDATE completions SET status = 'done' WHERE team_id = ? AND station_id = ? AND status = 'pending'`,
    [id, Number(stationId)]
  );
  const team = db.get(`SELECT * FROM teams WHERE id = ?`, [id]);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  const updated = buildTeamPayload(team);
  broadcast('TEAM_UPDATED', updated);
  res.json(updated);
});

// POST admin reject a pending station
router.post('/:id/reject/:stationId', (req, res) => {
  const { id, stationId } = req.params;
  db.run(
    `DELETE FROM completions WHERE team_id = ? AND station_id = ? AND status = 'pending'`,
    [id, Number(stationId)]
  );
  const team = db.get(`SELECT * FROM teams WHERE id = ?`, [id]);
  if (!team) return res.status(404).json({ error: 'Team not found' });
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
