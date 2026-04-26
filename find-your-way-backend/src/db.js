const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'game.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let db;

async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS game_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS completions (
      team_id TEXT NOT NULL,
      station_id INTEGER NOT NULL,
      completed_at INTEGER NOT NULL,
      PRIMARY KEY (team_id, station_id)
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL,
      team_name TEXT NOT NULL,
      team_icon TEXT NOT NULL,
      text TEXT NOT NULL,
      from_admin INTEGER NOT NULL DEFAULT 0,
      sent_at INTEGER NOT NULL
    );
  `);

  // Init defaults
  db.run(`INSERT OR IGNORE INTO game_state (key, value) VALUES ('timer_running', 'false')`);
  db.run(`INSERT OR IGNORE INTO game_state (key, value) VALUES ('timer_started_at', '0')`);
  db.run(`INSERT OR IGNORE INTO game_state (key, value) VALUES ('timer_duration', '${2 * 60 * 60}')`);
  db.run(`INSERT OR IGNORE INTO game_state (key, value) VALUES ('timer_elapsed', '0')`);

  persist();
  return db;
}

function persist() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Helpers that mimic better-sqlite3 sync API but wrap sql.js
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function get(sql, params = []) {
  return all(sql, params)[0] || null;
}

function run(sql, params = []) {
  db.run(sql, params);
  persist();
}

module.exports = { getDb, all, get, run };
