const express = require('express');
const http = require('http');
const cors = require('cors');
const { getDb } = require('./db');
const { initWss } = require('./wss');

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
}

main().catch(err => { console.error(err); process.exit(1); });
