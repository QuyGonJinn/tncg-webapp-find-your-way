const express = require('express');
const router = express.Router();
const db = require('../db');
const { broadcast } = require('../wss');
const { randomUUID } = require('crypto');

// GET all messages (admin)
router.get('/', (req, res) => {
  const messages = db.all(`SELECT * FROM messages ORDER BY sent_at ASC`);
  res.json(messages.map(m => ({ ...m, from_admin: !!m.from_admin })));
});

// GET messages for a specific team
router.get('/:teamId', (req, res) => {
  const messages = db.all(
    `SELECT * FROM messages WHERE team_id = ? ORDER BY sent_at ASC`,
    [req.params.teamId]
  );
  res.json(messages.map(m => ({ ...m, from_admin: !!m.from_admin })));
});

// POST send message from team
router.post('/:teamId', (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text required' });

  const team = db.get(`SELECT * FROM teams WHERE id = ?`, [req.params.teamId]);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  const msg = {
    id: randomUUID(),
    team_id: team.id,
    team_name: team.name,
    team_icon: team.icon,
    text: text.trim(),
    from_admin: 0,
    sent_at: Date.now(),
  };
  db.run(
    `INSERT INTO messages (id, team_id, team_name, team_icon, text, from_admin, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [msg.id, msg.team_id, msg.team_name, msg.team_icon, msg.text, msg.from_admin, msg.sent_at]
  );

  const out = { ...msg, from_admin: false };
  broadcast('NEW_MESSAGE', out);
  res.status(201).json(out);
});

// POST admin reply to a team
router.post('/:teamId/reply', (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text required' });

  const team = db.get(`SELECT * FROM teams WHERE id = ?`, [req.params.teamId]);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  const msg = {
    id: randomUUID(),
    team_id: team.id,
    team_name: 'Admin',
    team_icon: '🛠️',
    text: text.trim(),
    from_admin: 1,
    sent_at: Date.now(),
  };
  db.run(
    `INSERT INTO messages (id, team_id, team_name, team_icon, text, from_admin, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [msg.id, msg.team_id, msg.team_name, msg.team_icon, msg.text, msg.from_admin, msg.sent_at]
  );

  const out = { ...msg, from_admin: true };
  broadcast('NEW_MESSAGE', out);
  res.status(201).json(out);
});

module.exports = router;
