const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'game.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);

// WAL mode = much faster writes, safe for concurrent reads
db.pragma('journal_mode = WAL');

db.exec(`
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
  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Migration: add pin column if missing
try {
  const hasPin = db.prepare(`PRAGMA table_info(teams)`).all().some(col => col.name === 'pin');
  if (!hasPin) {
    db.exec(`ALTER TABLE teams ADD COLUMN pin TEXT NOT NULL DEFAULT '0000'`);
    console.log('✅ Added pin column to teams');
  }
} catch (e) {
  console.log('pin column already exists or error:', e.message);
}

// Migration: add status column if missing
try {
  const hasStatus = db.prepare(`PRAGMA table_info(completions)`).all().some(col => col.name === 'status');
  if (!hasStatus) {
    db.exec(`ALTER TABLE completions ADD COLUMN status TEXT NOT NULL DEFAULT 'done'`);
    console.log('✅ Added status column to completions');
  }
} catch (e) {
  console.log('status column already exists or error:', e.message);
}

// Migration: add read_at column if missing
try {
  const hasReadAt = db.prepare(`PRAGMA table_info(messages)`).all().some(col => col.name === 'read_at');
  if (!hasReadAt) {
    db.exec(`ALTER TABLE messages ADD COLUMN read_at INTEGER`);
    console.log('✅ Added read_at column to messages');
  }
} catch (e) {
  console.log('read_at column already exists or error:', e.message);
}

// Init game state defaults
const initState = db.prepare(`INSERT OR IGNORE INTO game_state (key, value) VALUES (?, ?)`);
initState.run('timer_running', 'false');
initState.run('timer_started_at', '0');
initState.run('timer_duration', String(2 * 60 * 60));
initState.run('timer_elapsed', '0');
initState.run('reminder_interval', '20');
initState.run('last_reminder_time', '0');

function all(sql, params = []) {
  return db.prepare(sql).all(...params);
}

function get(sql, params = []) {
  return db.prepare(sql).get(...params);
}

function run(sql, params = []) {
  return db.prepare(sql).run(...params);
}

async function getDb() { return db; }

module.exports = { getDb, all, get, run };
