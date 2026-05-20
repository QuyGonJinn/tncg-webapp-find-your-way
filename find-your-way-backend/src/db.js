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
  CREATE TABLE IF NOT EXISTS station_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id INTEGER NOT NULL UNIQUE,
    code TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );
  CREATE TABLE IF NOT EXISTS bibelpose_submissions (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    team_name TEXT NOT NULL,
    scene_id INTEGER NOT NULL,
    scene_name TEXT NOT NULL,
    photo_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    code TEXT,
    submitted_at INTEGER NOT NULL,
    confirmed_at INTEGER,
    FOREIGN KEY (team_id) REFERENCES teams(id)
  );
  CREATE TABLE IF NOT EXISTS heilige_buchstabenjagd_submissions (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    team_name TEXT NOT NULL,
    photo_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    code TEXT,
    submitted_at INTEGER NOT NULL,
    confirmed_at INTEGER,
    FOREIGN KEY (team_id) REFERENCES teams(id)
  );
  CREATE TABLE IF NOT EXISTS anchor_of_hope_submissions (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    team_name TEXT NOT NULL,
    photo_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    code TEXT,
    submitted_at INTEGER NOT NULL,
    confirmed_at INTEGER,
    rejected_at INTEGER,
    FOREIGN KEY (team_id) REFERENCES teams(id)
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

// Migration: add rejected_at column to bibelpose_submissions if missing
try {
  const hasRejectedAt = db.prepare(`PRAGMA table_info(bibelpose_submissions)`).all().some(col => col.name === 'rejected_at');
  if (!hasRejectedAt) {
    db.exec(`ALTER TABLE bibelpose_submissions ADD COLUMN rejected_at INTEGER`);
    console.log('✅ Added rejected_at column to bibelpose_submissions');
  }
} catch (e) {
  console.log('rejected_at column already exists or error:', e.message);
}

// Migration: add rejected_at column to heilige_buchstabenjagd_submissions if missing
try {
  const hasRejectedAt = db.prepare(`PRAGMA table_info(heilige_buchstabenjagd_submissions)`).all().some(col => col.name === 'rejected_at');
  if (!hasRejectedAt) {
    db.exec(`ALTER TABLE heilige_buchstabenjagd_submissions ADD COLUMN rejected_at INTEGER`);
    console.log('✅ Added rejected_at column to heilige_buchstabenjagd_submissions');
  }
} catch (e) {
  console.log('rejected_at column already exists or error:', e.message);
}

// Init game state defaults
const initState = db.prepare(`INSERT OR IGNORE INTO game_state (key, value) VALUES (?, ?)`);
initState.run('timer_running', 'false');
initState.run('timer_started_at', '0');
initState.run('timer_duration', String(2 * 60 * 60));
initState.run('timer_elapsed', '0');
initState.run('waiting_room_enabled', 'true');
initState.run('game_duration', '120'); // in minutes
initState.run('reminder_interval', '15'); // in minutes

// Migration: add waiting_room_enabled if missing
try {
  const hasWaitingRoom = db.prepare(`SELECT value FROM game_state WHERE key = 'waiting_room_enabled'`).get();
  if (!hasWaitingRoom) {
    db.prepare(`INSERT INTO game_state (key, value) VALUES (?, ?)`).run('waiting_room_enabled', 'true');
    console.log('✅ Added waiting_room_enabled to game_state');
  }
} catch (e) {
  console.log('waiting_room_enabled already exists or error:', e.message);
}

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

module.exports = { getDb, all, get, run, prepare: (sql) => db.prepare(sql) };
