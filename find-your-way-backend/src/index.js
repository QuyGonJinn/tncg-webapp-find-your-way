const express = require('express');
const http = require('http');
const cors = require('cors');
const { getDb } = require('./db');
const { initWss, broadcast } = require('./wss');

async function main() {
  await getDb(); // init DB first

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/teams', require('./routes/teams'));
  app.use('/api/game',  require('./routes/game'));
  app.use('/api/chat',  require('./routes/chat'));
  app.use('/api/stats', require('./routes/stats'));
  app.use('/api/participants', require('./routes/participants'));
  
  // Admin auth
  app.post('/api/admin/login', (req, res) => {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: 'pin required' });
    if (pin === ADMIN_PIN) {
      res.json({ ok: true, token: 'admin-' + Date.now() });
    } else {
      res.status(401).json({ error: 'Falscher PIN' });
    }
  });
  
  app.get('/health', (_, res) => res.json({ ok: true }));

  const server = http.createServer(app);
  initWss(server);

  const PORT = process.env.PORT || 3001;
  const ADMIN_PIN = process.env.ADMIN_PIN || '1234'; // Change in production!
  
  server.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket ready on ws://localhost:${PORT}`);
  });

  // Reminder system - send time remaining every X minutes
  setInterval(() => {
    const db = getDb();
    const gameState = db.all(`SELECT key, value FROM game_state`);
    const stateMap = {};
    gameState.forEach(r => { stateMap[r.key] = r.value; });
    
    const timerRunning = stateMap.timer_running === 'true';
    if (!timerRunning) return;
    
    const timerStartedAt = Number(stateMap.timer_started_at);
    const timerDuration = Number(stateMap.timer_duration);
    const timerElapsed = Number(stateMap.timer_elapsed);
    const reminderInterval = Number(stateMap.reminder_interval) || 20;
    
    const elapsed = timerElapsed + Math.floor((Date.now() - timerStartedAt) / 1000);
    const timeLeft = Math.max(0, timerDuration - elapsed);
    
    // Check if we should send a reminder (every reminderInterval minutes)
    const lastReminder = Number(stateMap.last_reminder_time) || 0;
    const timeSinceLastReminder = Math.floor((Date.now() - lastReminder) / 1000);
    const reminderIntervalSeconds = reminderInterval * 60;
    
    if (timeSinceLastReminder >= reminderIntervalSeconds) {
      const minutesLeft = Math.ceil(timeLeft / 60);
      broadcast('REMINDER', {
        message: `⏰ Das Spiel ist in ${minutesLeft} Minuten vorbei!`,
        timeLeft,
        minutesLeft,
      });
      
      // Update last reminder time
      db.run(`UPDATE game_state SET value = ? WHERE key = 'last_reminder_time'`, [Date.now()]);
    }
  }, 10000); // Check every 10 seconds
}

main().catch(err => { console.error(err); process.exit(1); });
