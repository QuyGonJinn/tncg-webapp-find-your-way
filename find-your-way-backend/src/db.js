const Database = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'game.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let db;

async function initDb() {
  const SQL = await Database();
  
  // Try to load existing DB
  let data;
  try {
    data = fs.readFileSync(DB_PATH);
  } catch {
    data = null;
  }
  
  db = new SQL.Database(data);
  
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS game_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      pin TEXT NOT NULL DEFAULT '0000',
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS completions (
      team_id TEXT NOT NULL,
      station_id INTEGER NOT NULL,
      completed_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'done',
      PRIMARY KEY (team_id, station_id)
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL,
      team_name TEXT NOT NULL,
      team_icon TEXT NOT NULL,
      text TEXT NOT NULL,
      from_admin INTEGER NOT NULL DEFAULT 0,
      sent_at INTEGER NOT NULL,
      read_at INTEGER
    );
  `);

  // Init game state defaults
  db.run(`INSERT OR IGNORE INTO game_state (key, value) VALUES (?, ?)`, ['timer_running', 'false']);
  db.run(`INSERT OR IGNORE INTO game_state (key, value) VALUES (?, ?)`, ['timer_started_at', '0']);
  db.run(`INSERT OR IGNORE INTO game_state (key, value) VALUES (?, ?)`, ['timer_duration', String(2 * 60 * 60)]);
  db.run(`INSERT OR IGNORE INTO game_state (key, value) VALUES (?, ?)`, ['timer_elapsed', '0']);
  
  saveDb();
}

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function get(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

function run(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
  saveDb();
}

async function getDb() { 
  if (!db) await initDb();
  return db; 
}

module.exports = { getDb, all, get, run };
