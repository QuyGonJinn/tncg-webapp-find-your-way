const express = require('express');
const router = express.Router();
const db = require('../db');
const { randomUUID } = require('crypto');

const MAX_PARTICIPANTS = 6;

// GET all participants for a team
router.get('/:teamId', (req, res) => {
  try {
    const team = db.get(`SELECT * FROM teams WHERE id = ?`, [req.params.teamId]);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const participants = db.all(
      `SELECT * FROM participants WHERE team_id = ? ORDER BY created_at ASC`,
      [req.params.teamId]
    );

    res.json(participants);
  } catch (err) {
    console.error('Get participants error:', err);
    res.status(500).json({ error: 'Failed to get participants' });
  }
});

// POST add participant to team
router.post('/:teamId', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name required' });
    }

    const team = db.get(`SELECT * FROM teams WHERE id = ?`, [req.params.teamId]);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Check max participants
    const count = db.get(
      `SELECT COUNT(*) as count FROM participants WHERE team_id = ?`,
      [req.params.teamId]
    );
    if (count.count >= MAX_PARTICIPANTS) {
      return res.status(400).json({ error: `Max ${MAX_PARTICIPANTS} participants per team` });
    }

    // Check for duplicate names (case-insensitive)
    const existing = db.get(
      `SELECT id FROM participants WHERE team_id = ? AND LOWER(name) = LOWER(?)`,
      [req.params.teamId, name.trim()]
    );
    if (existing) {
      return res.status(400).json({ error: 'Participant name already exists' });
    }

    const id = randomUUID();
    db.run(
      `INSERT INTO participants (id, team_id, name, created_at) VALUES (?, ?, ?, ?)`,
      [id, req.params.teamId, name.trim(), Date.now()]
    );

    const participant = { id, team_id: req.params.teamId, name: name.trim(), created_at: Date.now() };
    res.status(201).json(participant);
  } catch (err) {
    console.error('Add participant error:', err);
    res.status(500).json({ error: 'Failed to add participant' });
  }
});

// PUT update participant name
router.put('/:teamId/:participantId', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name required' });
    }

    const participant = db.get(
      `SELECT * FROM participants WHERE id = ? AND team_id = ?`,
      [req.params.participantId, req.params.teamId]
    );
    if (!participant) return res.status(404).json({ error: 'Participant not found' });

    // Check for duplicate names (case-insensitive, excluding self)
    const existing = db.get(
      `SELECT id FROM participants WHERE team_id = ? AND LOWER(name) = LOWER(?) AND id != ?`,
      [req.params.teamId, name.trim(), req.params.participantId]
    );
    if (existing) {
      return res.status(400).json({ error: 'Participant name already exists' });
    }

    db.run(
      `UPDATE participants SET name = ? WHERE id = ?`,
      [name.trim(), req.params.participantId]
    );

    res.json({ id: req.params.participantId, team_id: req.params.teamId, name: name.trim() });
  } catch (err) {
    console.error('Update participant error:', err);
    res.status(500).json({ error: 'Failed to update participant' });
  }
});

// DELETE participant
router.delete('/:teamId/:participantId', (req, res) => {
  try {
    const participant = db.get(
      `SELECT * FROM participants WHERE id = ? AND team_id = ?`,
      [req.params.participantId, req.params.teamId]
    );
    if (!participant) return res.status(404).json({ error: 'Participant not found' });

    db.run(`DELETE FROM participants WHERE id = ?`, [req.params.participantId]);

    res.json({ ok: true });
  } catch (err) {
    console.error('Delete participant error:', err);
    res.status(500).json({ error: 'Failed to delete participant' });
  }
});

module.exports = router;
