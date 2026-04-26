const express = require('express');
const router = express.Router();
const db = require('../db');
const STATIONS = require('../stations');

// GET overall statistics
router.get('/', (req, res) => {
  try {
    const teams = db.all(`SELECT * FROM teams ORDER BY created_at ASC`);
    
    // Get game state for timer
    const timerRunningRow = db.get(`SELECT value FROM game_state WHERE key = 'timer_running'`);
    const timerDurationRow = db.get(`SELECT value FROM game_state WHERE key = 'timer_duration'`);
    const timerStartedAtRow = db.get(`SELECT value FROM game_state WHERE key = 'timer_started_at'`);
    
    const timerRunning = timerRunningRow?.value === 'true';
    const timerDuration = timerDurationRow ? Number(timerDurationRow.value) : 7200;
    const timerStartedAt = timerStartedAtRow ? Number(timerStartedAtRow.value) : null;
    
    let timeLeft = timerDuration;
    if (timerRunning && timerStartedAt) {
      const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
      timeLeft = Math.max(0, timerDuration - elapsed);
    }
    
    // Build team stats
    const teamStats = teams.map(team => {
      const completions = db.all(
        `SELECT station_id, status FROM completions WHERE team_id = ?`,
        [team.id]
      );
      
      const participants = db.all(
        `SELECT id, name FROM participants WHERE team_id = ? ORDER BY created_at ASC`,
        [team.id]
      );
      
      const completed = completions.filter(c => c.status === 'done').length;
      const pending = completions.filter(c => c.status === 'pending').length;
      
      // Count active stations (type === 'aktiv')
      const activeStations = STATIONS.filter(s => s.type === 'aktiv').length;
      
      const totalXP = completions
        .filter(c => c.status === 'done')
        .reduce((sum, c) => {
          const station = STATIONS.find(s => s.id === Number(c.station_id));
          return sum + (station ? station.points : 0);
        }, 0);
      
      const progress = Math.round((completed / STATIONS.length) * 100);
      
      return {
        id: team.id,
        name: team.name,
        icon: team.icon,
        pin: team.pin,
        completed,
        pending,
        totalXP,
        progress,
        created_at: team.created_at,
        participants,
        participantCount: participants.length,
        activeStations,
      };
    });
    
    // Overall stats
    const totalTeams = teams.length;
    const totalParticipants = teamStats.reduce((sum, t) => sum + t.participantCount, 0);
    const teamsFinished = teamStats.filter(t => t.completed === STATIONS.length).length;
    const totalMessages = db.get(`SELECT COUNT(*) as count FROM messages`)?.count || 0;
    const unreadMessages = db.get(
      `SELECT COUNT(*) as count FROM messages WHERE read_at IS NULL`
    )?.count || 0;
    
    const avgProgress = totalTeams > 0
      ? Math.round(teamStats.reduce((sum, t) => sum + t.progress, 0) / totalTeams)
      : 0;
    
    const maxXP = STATIONS.reduce((sum, s) => sum + s.points, 0);
    const avgXP = totalTeams > 0
      ? Math.round(teamStats.reduce((sum, t) => sum + t.totalXP, 0) / totalTeams)
      : 0;
    
    res.json({
      timestamp: Date.now(),
      gameState: {
        timerRunning,
        timeLeft,
      },
      overall: {
        totalTeams,
        totalParticipants,
        teamsFinished,
        avgProgress,
        avgXP,
        maxXP,
        totalMessages,
        unreadMessages,
      },
      teams: teamStats,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// GET stats for a specific team
router.get('/:teamId', (req, res) => {
  try {
    const team = db.get(`SELECT * FROM teams WHERE id = ?`, [req.params.teamId]);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    
    const completions = db.all(
      `SELECT station_id, status FROM completions WHERE team_id = ?`,
      [team.id]
    );
    
    const stationDetails = STATIONS.map(station => {
      const completion = completions.find(c => c.station_id === station.id);
      return {
        id: station.id,
        title: station.title,
        type: station.type,
        points: station.points,
        status: completion?.status || 'not_started', // not_started, pending, done
      };
    });
    
    const completed = completions.filter(c => c.status === 'done').length;
    const pending = completions.filter(c => c.status === 'pending').length;
    
    const totalXP = completions
      .filter(c => c.status === 'done')
      .reduce((sum, c) => {
        const station = STATIONS.find(s => s.id === Number(c.station_id));
        return sum + (station ? station.points : 0);
      }, 0);
    
    const progress = Math.round((completed / STATIONS.length) * 100);
    
    res.json({
      team: {
        id: team.id,
        name: team.name,
        icon: team.icon,
        created_at: team.created_at,
      },
      stats: {
        completed,
        pending,
        totalXP,
        progress,
      },
      stations: stationDetails,
    });
  } catch (err) {
    console.error('Team stats error:', err);
    res.status(500).json({ error: 'Failed to get team stats' });
  }
});

module.exports = router;
