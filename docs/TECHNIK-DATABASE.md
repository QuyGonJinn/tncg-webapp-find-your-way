# Find Your Way - Datenbank-Dokumentation

## 📊 Datenbank-Übersicht

SQLite Datenbank mit 4 Haupttabellen:
- `game_state` - Globale Spiel-Einstellungen
- `teams` - Team-Informationen
- `completions` - Station-Abschlüsse
- `messages` - Chat-Nachrichten

---

## 🗂️ Tabellen-Schema

### 1. `game_state`

Speichert globale Spiel-Konfiguration (Timer, etc.)

```sql
CREATE TABLE game_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

**Spalten:**
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `key` | TEXT | Eindeutiger Schlüssel (z.B. "timer_running") |
| `value` | TEXT | Wert als String |

**Beispiel-Daten:**
```
key                  | value
---------------------|--------
timer_running        | false
timer_started_at     | 1704067200000
timer_duration       | 7200
timer_elapsed        | 0
```

**Verwendung:**
- Timer-Status verwalten
- Globale Einstellungen speichern

---

### 2. `teams`

Speichert Team-Informationen und Login-Daten

```sql
CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  pin TEXT NOT NULL DEFAULT '0000',
  created_at INTEGER NOT NULL
);
```

**Spalten:**
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `id` | TEXT | UUID (z.B. "550e8400-e29b-41d4-a716-446655440000") |
| `name` | TEXT | Team-Name (z.B. "Die Wellen") |
| `icon` | TEXT | Emoji (z.B. "🌊") |
| `pin` | TEXT | 4-stelliger Code (z.B. "A3KX") |
| `created_at` | INTEGER | Timestamp in Millisekunden |

**Beispiel-Daten:**
```
id                                   | name        | icon | pin  | created_at
-------------------------------------|-------------|------|------|---------------
550e8400-e29b-41d4-a716-446655440000 | Die Wellen  | 🌊   | A3KX | 1704067200000
550e8400-e29b-41d4-a716-446655440001 | Die Löwen   | 🦁   | B7MN | 1704067300000
```

**Verwendung:**
- Team-Registrierung
- PIN-basierter Login
- Team-Verwaltung (Admin)

**Constraints:**
- `id` ist eindeutig (PRIMARY KEY)
- `name` wird normalisiert (lowercase, trim, collapse spaces)
- Duplikate werden verhindert

---

### 3. `completions`

Speichert Station-Abschlüsse pro Team

```sql
CREATE TABLE completions (
  team_id TEXT NOT NULL,
  station_id INTEGER NOT NULL,
  completed_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'done',
  PRIMARY KEY (team_id, station_id)
);
```

**Spalten:**
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `team_id` | TEXT | Referenz zu `teams.id` |
| `station_id` | INTEGER | Station ID (1-12) |
| `completed_at` | INTEGER | Timestamp in Millisekunden |
| `status` | TEXT | "done" oder "pending" |

**Status-Erklärung:**
- `done` - Station abgeschlossen, XP vergeben
- `pending` - Aktive Station wartet auf Admin-Genehmigung

**Beispiel-Daten:**
```
team_id                              | station_id | completed_at   | status
-------------------------------------|------------|----------------|--------
550e8400-e29b-41d4-a716-446655440000 | 1          | 1704067300000  | done
550e8400-e29b-41d4-a716-446655440000 | 3          | 1704067400000  | pending
550e8400-e29b-41d4-a716-446655440001 | 1          | 1704067350000  | done
```

**Verwendung:**
- Fortschritt pro Team tracken
- XP berechnen
- Admin-Genehmigungen verwalten

**Constraints:**
- Composite PRIMARY KEY: (team_id, station_id)
- Verhindert Duplikate pro Team/Station

---

### 4. `messages`

Speichert Chat-Nachrichten

```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  team_icon TEXT NOT NULL,
  text TEXT NOT NULL,
  from_admin INTEGER NOT NULL DEFAULT 0,
  sent_at INTEGER NOT NULL,
  read_at INTEGER
);
```

**Spalten:**
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `id` | TEXT | UUID (eindeutig) |
| `team_id` | TEXT | Referenz zu `teams.id` |
| `team_name` | TEXT | Team-Name (Snapshot) |
| `team_icon` | TEXT | Team-Icon (Snapshot) |
| `text` | TEXT | Nachricht-Text (max 200 Zeichen) |
| `from_admin` | INTEGER | 0 = Team, 1 = Admin |
| `sent_at` | INTEGER | Timestamp in Millisekunden |
| `read_at` | INTEGER | Timestamp wenn gelesen (NULL = ungelesen) |

**Beispiel-Daten:**
```
id                                   | team_id | team_name | team_icon | text              | from_admin | sent_at        | read_at
-------------------------------------|---------|-----------|-----------|-------------------|------------|----------------|---------------
550e8400-e29b-41d4-a716-446655440100 | ...     | Die Wellen| 🌊        | Hallo Admin!      | 0          | 1704067300000  | 1704067310000
550e8400-e29b-41d4-a716-446655440101 | ...     | Die Wellen| 🌊        | Hallo Team!       | 1          | 1704067320000  | NULL
```

**Verwendung:**
- Chat-Verlauf speichern
- Read-Receipts tracken
- Admin-Nachrichten verwalten

---

## 📈 Daten-Beziehungen

```
teams (1)
  │
  ├─── (N) completions
  │         └─ station_id → STATIONS[id]
  │
  └─── (N) messages
        └─ team_id → teams.id
```

**Beispiel-Query:**
```sql
-- Alle Stationen eines Teams mit Status
SELECT 
  s.id,
  s.title,
  c.status,
  c.completed_at
FROM stations s
LEFT JOIN completions c ON s.id = c.station_id
WHERE c.team_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY s.id;
```

---

## 🔢 Daten-Typen & Formate

### IDs
- **UUID v4**: `550e8400-e29b-41d4-a716-446655440000`
- Generiert mit `crypto.randomUUID()`

### Timestamps
- **Millisekunden seit Epoch**: `1704067200000`
- Generiert mit `Date.now()`
- Konvertierung: `new Date(1704067200000).toLocaleString()`

### Team-PIN
- **Format**: 4 Zeichen alphanumerisch
- **Zeichen**: A-Z (ohne I, O, S, Z), 2-9
- **Beispiele**: "A3KX", "B7MN", "C2PQ"

### Station-IDs
- **Range**: 1-12
- **Typen**: "passiv" oder "aktiv"

### XP-Punkte
- **Passiv**: 20 XP pro Station
- **Aktiv**: 50 XP pro Station
- **Max**: 12 × 20 + 5 × 50 = 490 XP

---

## 💾 Datenbank-Operationen

### Team erstellen
```javascript
db.run(
  `INSERT INTO teams (id, name, icon, pin, created_at) VALUES (?, ?, ?, ?, ?)`,
  [uuid, name, icon, pin, Date.now()]
);
```

### Station abschließen (Passiv)
```javascript
db.run(
  `INSERT INTO completions (team_id, station_id, completed_at, status) 
   VALUES (?, ?, ?, 'done')`,
  [teamId, stationId, Date.now()]
);
```

### Station genehmigen (Admin)
```javascript
db.run(
  `UPDATE completions SET status = 'done' 
   WHERE team_id = ? AND station_id = ? AND status = 'pending'`,
  [teamId, stationId]
);
```

### Nachricht senden
```javascript
db.run(
  `INSERT INTO messages 
   (id, team_id, team_name, team_icon, text, from_admin, sent_at) 
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [uuid, teamId, teamName, teamIcon, text, 0, Date.now()]
);
```

### Nachricht als gelesen markieren
```javascript
db.run(
  `UPDATE messages SET read_at = ? WHERE id = ? AND team_id = ?`,
  [Date.now(), messageId, teamId]
);
```

---

## 🔍 Häufige Queries

### Team-Fortschritt abrufen
```sql
SELECT 
  COUNT(*) as total_stations,
  SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
FROM completions
WHERE team_id = ?;
```

### XP berechnen
```sql
SELECT 
  SUM(s.points) as totalXP
FROM completions c
JOIN stations s ON c.station_id = s.id
WHERE c.team_id = ? AND c.status = 'done';
```

### Ungelesene Nachrichten
```sql
SELECT COUNT(*) as unread
FROM messages
WHERE team_id = ? AND from_admin = 1 AND read_at IS NULL;
```

### Rangliste
```sql
SELECT 
  t.id,
  t.name,
  t.icon,
  SUM(s.points) as totalXP
FROM teams t
LEFT JOIN completions c ON t.id = c.team_id AND c.status = 'done'
LEFT JOIN stations s ON c.station_id = s.id
GROUP BY t.id
ORDER BY totalXP DESC;
```

---

## 📁 Datenbank-Datei

**Pfad**: `/app/data/game.db` (im Container)

**Größe**: Typisch < 1 MB (abhängig von Anzahl Teams/Nachrichten)

**Backup**: 
```bash
docker cp fyw-backend:/app/data/game.db ./backup-game.db
```

**Restore**:
```bash
docker cp ./backup-game.db fyw-backend:/app/data/game.db
docker compose restart fyw-backend
```

---

## 🔄 Migrations

Die Datenbank führt automatische Migrations durch:

1. **Spalte `pin` in `teams`**: Ermöglicht Team-Login
2. **Spalte `status` in `completions`**: Unterscheidet done/pending
3. **Spalte `read_at` in `messages`**: Trackt gelesene Nachrichten

Alle Migrations sind idempotent (können mehrfach ausgeführt werden).

---

## ⚡ Performance-Tipps

1. **Indizes**: Für häufige Queries (team_id, station_id)
2. **WAL Mode**: Bereits aktiviert für schnellere Writes
3. **Pagination**: Bei vielen Nachrichten implementieren
4. **Archivierung**: Alte Daten in separate Tabelle verschieben

---

## 🔐 Datenschutz

- Keine persönlichen Daten (nur Team-Namen)
- Keine Passwörter (nur PINs)
- Keine IP-Adressen
- Keine Tracking-Daten

**DSGVO-konform**: Daten können jederzeit gelöscht werden
```bash
docker compose down
docker volume rm fyw-data
```
