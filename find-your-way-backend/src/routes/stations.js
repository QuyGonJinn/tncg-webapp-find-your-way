const express = require('express');
const router = express.Router();
const { prepare } = require('../db');
const STATIONS = require('../stations');

// GET all station codes
router.get('/codes', (req, res) => {
  try {
    const codes = prepare(`
      SELECT station_id, code FROM station_codes
    `).all();
    
    const codesMap = {};
    codes.forEach(row => {
      codesMap[row.station_id] = row.code;
    });
    
    // Fill in defaults for stations without custom codes
    STATIONS.forEach(station => {
      if (station.code && !codesMap[station.id]) {
        codesMap[station.id] = station.code;
      }
    });
    
    res.json(codesMap);
  } catch (error) {
    console.error('Error fetching codes:', error);
    res.status(500).json({ error: 'Failed to fetch codes' });
  }
});

// POST update station code
router.post('/codes', (req, res) => {
  try {
    const { stationId, code } = req.body;
    
    if (!stationId || !code) {
      return res.status(400).json({ error: 'Missing stationId or code' });
    }
    
    // Check if code already exists for this station
    const existing = prepare(`
      SELECT id FROM station_codes WHERE station_id = ?
    `).get(stationId);
    
    if (existing) {
      prepare(`
        UPDATE station_codes SET code = ? WHERE station_id = ?
      `).run(code, stationId);
    } else {
      prepare(`
        INSERT INTO station_codes (station_id, code) VALUES (?, ?)
      `).run(stationId, code);
    }
    
    res.json({ success: true, stationId, code });
  } catch (error) {
    console.error('Error updating code:', error);
    res.status(500).json({ error: 'Failed to update code' });
  }
});

module.exports = router;
