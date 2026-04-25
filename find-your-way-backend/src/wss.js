const { WebSocketServer } = require('ws');

let wss;

function initWss(server) {
  wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    ws.on('error', console.error);
  });
  return wss;
}

function broadcast(type, payload) {
  if (!wss) return;
  const msg = JSON.stringify({ type, payload });
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

module.exports = { initWss, broadcast };
