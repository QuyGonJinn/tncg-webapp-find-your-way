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
  app.get('/health', (_, res) => res.json({ ok: true }));

  const server = http.createServer(app);
  initWss(server);

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket ready on ws://localhost:${PORT}`);
  });
}

main().catch(err => { console.error(err); process.exit(1); });
