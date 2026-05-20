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
  
  // Serve uploaded files
  app.use('/data', express.static(require('path').join(__dirname, '..', 'data')));

  const PORT = process.env.PORT || 3001;
  const ADMIN_PIN = process.env.ADMIN_PIN || '1234'; // Change in production!

  app.use('/api/teams', require('./routes/teams'));
  app.use('/api/game',  require('./routes/game'));
  app.use('/api/chat',  require('./routes/chat'));
  app.use('/api/stats', require('./routes/stats'));
  app.use('/api/participants', require('./routes/participants'));
  app.use('/api/stations', require('./routes/stations'));
  app.use('/api/bibelpose', require('./routes/bibelpose'));
  app.use('/api/heilige-buchstabenjagd', require('./routes/heilige-buchstabenjagd'));
  
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

  server.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket ready on ws://localhost:${PORT}`);
  });
}

main().catch(err => { console.error(err); process.exit(1); });
