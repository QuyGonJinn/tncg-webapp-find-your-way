# Find Your Way - Architektur-Dokumentation

## 🏗️ System-Übersicht

Find Your Way ist eine verteilte Web-Anwendung bestehend aus:
- **Frontend**: React + Vite + Tailwind CSS (SPA)
- **Backend**: Node.js + Express + SQLite
- **Kommunikation**: REST API + WebSocket
- **Deployment**: Docker Compose

---

## 📊 Docker Compose Architektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET (HTTPS)                         │
│                    https://fyw.tncg.de                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Traefik Proxy  │
                    │  (Reverse Proxy)│
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        │         ┌──────────▼──────────┐         │
        │         │   FRONTEND (nginx)  │         │
        │         │   Port: 80 → 80     │         │
        │         │  (fyw-frontend)     │         │
        │         └──────────┬──────────┘         │
        │                    │                    │
        │         ┌──────────▼──────────┐         │
        │         │  BACKEND (Node.js)  │         │
        │         │  Port: 3001 → 3001  │         │
        │         │  (fyw-backend)      │         │
        │         └──────────┬──────────┘         │
        │                    │                    │
        │         ┌──────────▼──────────┐         │
        │         │   SQLite Database   │         │
        │         │  (fyw-data volume)  │         │
        │         │  /app/data/game.db  │         │
        │         └─────────────────────┘         │
        │                                         │
        └─────────────────────────────────────────┘
                    Docker Network
```

---

## 🔄 Kommunikations-Flow

### 1. **HTTP/REST API Kommunikation**

```
┌─────────────────┐                    ┌──────────────────┐
│   FRONTEND      │                    │    BACKEND       │
│   (React SPA)   │                    │  (Express.js)    │
└────────┬────────┘                    └────────┬─────────┘
         │                                      │
         │  POST /api/teams                     │
         │  (Team erstellen)                    │
         ├─────────────────────────────────────►│
         │                                      │
         │                                      │ DB Query
         │                                      ├──────────┐
         │                                      │          │
         │                                      │◄─────────┘
         │                                      │
         │  201 { id, name, icon, pin, ... }   │
         │◄─────────────────────────────────────┤
         │                                      │
         │  GET /api/teams/:id                  │
         ├─────────────────────────────────────►│
         │                                      │
         │  200 { completed, pending, totalXP }│
         │◄─────────────────────────────────────┤
         │                                      │
```

### 2. **WebSocket Real-Time Kommunikation**

```
┌─────────────────┐                    ┌──────────────────┐
│   FRONTEND      │                    │    BACKEND       │
│   (React SPA)   │                    │  (WebSocket)     │
└────────┬────────┘                    └────────┬─────────┘
         │                                      │
         │  WS Connection                       │
         ├─────────────────────────────────────►│
         │  (Persistent)                        │
         │                                      │
         │                                      │ Event: NEW_MESSAGE
         │  { type: 'NEW_MESSAGE',              │
         │    payload: { ... } }                │
         │◄─────────────────────────────────────┤
         │                                      │
         │                                      │ Event: TEAM_UPDATED
         │  { type: 'TEAM_UPDATED',             │
         │    payload: { ... } }                │
         │◄─────────────────────────────────────┤
         │                                      │
         │                                      │ Event: GAME_STATE
         │  { type: 'GAME_STATE',               │
         │    payload: { timeLeft, ... } }      │
         │◄─────────────────────────────────────┤
         │                                      │
```

### 3. **Polling Fallback (bei WebSocket-Fehler)**

```
Frontend (ChatBox)
    │
    ├─► WebSocket (Echtzeit)
    │
    └─► Polling (Fallback)
        └─► GET /api/chat/:teamId
            └─► Alle 2 Sekunden
                └─► Nachrichten aktualisieren
```

---

## 🔌 API Endpoints

### Teams
```
POST   /api/teams                    # Team erstellen
GET    /api/teams                    # Alle Teams abrufen
GET    /api/teams/:id                # Team Details
POST   /api/teams/login              # Mit PIN einloggen
POST   /api/teams/:id/complete/:stationId    # Station erledigen
POST   /api/teams/:id/approve/:stationId     # Station genehmigen (Admin)
POST   /api/teams/:id/reject/:stationId      # Station ablehnen (Admin)
DELETE /api/teams/:id/complete/:stationId    # Station rückgängig (Admin)
DELETE /api/teams/:id                        # Team löschen (Admin)
```

### Chat
```
GET    /api/chat                     # Alle Nachrichten (Admin)
GET    /api/chat/:teamId             # Team-Nachrichten
POST   /api/chat/:teamId             # Nachricht senden
POST   /api/chat/:teamId/reply       # Admin-Antwort
POST   /api/chat/:teamId/mark-read   # Nachrichten als gelesen
DELETE /api/chat                     # Alle Nachrichten löschen (Admin)
```

### Game
```
GET    /api/game/state               # Game State abrufen
POST   /api/game/timer/start         # Timer starten (Admin)
POST   /api/game/timer/pause         # Timer pausieren (Admin)
POST   /api/game/timer/reset         # Timer zurücksetzen (Admin)
```

### Admin
```
POST   /api/admin/login              # Admin-Login mit PIN
```

---

## 🌐 WebSocket Events

### Server → Client

| Event | Payload | Beschreibung |
|-------|---------|-------------|
| `NEW_MESSAGE` | `{ id, team_id, text, from_admin, sent_at, read_at }` | Neue Nachricht |
| `TEAM_UPDATED` | `{ id, name, icon, completed, pending, totalXP }` | Team-Status aktualisiert |
| `TEAM_JOINED` | `{ id, name, icon, pin, ... }` | Neues Team beigetreten |
| `TEAM_DELETED` | `{ id }` | Team gelöscht |
| `GAME_STATE` | `{ timeLeft, timerRunning }` | Game-State aktualisiert |
| `CHAT_CLEARED` | `{}` | Chat geleert |

---

## 📁 Verzeichnis-Struktur

```
find-your-way/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminTimer.jsx
│   │   │   ├── AdminChat.jsx
│   │   │   ├── TeamCard.jsx
│   │   │   └── StationCodes.jsx
│   │   ├── ChatBox.jsx
│   │   ├── GameScreen.jsx
│   │   ├── StationCard.jsx
│   │   ├── SetupScreen.jsx
│   │   ├── Timer.jsx
│   │   ├── HintBox.jsx
│   │   ├── FinalScreen.jsx
│   │   └── PinDisplay.jsx
│   ├── hooks/
│   │   ├── useGameState.js
│   │   └── useAdmin.js
│   ├── data/
│   │   └── stations.js
│   ├── pages/
│   │   └── AdminPage.jsx
│   ├── api.js
│   ├── App.jsx
│   └── main.jsx
├── Dockerfile
├── nginx.conf
└── vite.config.js

find-your-way-backend/
├── src/
│   ├── routes/
│   │   ├── teams.js
│   │   ├── chat.js
│   │   └── game.js
│   ├── db.js
│   ├── index.js
│   ├── wss.js
│   └── stations.js
├── Dockerfile
├── package.json
└── data/
    └── game.db (SQLite)

docker-compose.yml
```

---

## 🚀 Deployment Flow

```
1. git clone / git pull
   ↓
2. docker compose up --build -d
   ↓
3. Backend Container startet
   ├─ db.js: Datenbank initialisieren
   ├─ Migrations durchführen
   └─ Express Server auf Port 3001
   ↓
4. Frontend Container startet
   ├─ Vite Build
   ├─ nginx konfigurieren
   └─ Auf Port 80 lauschen
   ↓
5. Traefik Proxy
   ├─ https://fyw.tncg.de → nginx:80
   └─ SSL/TLS (Let's Encrypt)
   ↓
6. Bereit für Benutzer!
```

---

## 🔐 Sicherheit

### Admin-PIN
- Gespeichert in `docker-compose.yml` als `ADMIN_PIN` Environment Variable
- Wird bei jedem `/api/admin/login` überprüft
- Frontend speichert Session in `localStorage` (`fyw_admin_authenticated`)

### Team-PIN
- 4-stelliger alphanumerischer Code (z.B. "A3KX")
- Generiert beim Team-Erstellen
- Ermöglicht Re-Login auf anderen Geräten
- Gespeichert in der `teams` Tabelle

### Datenbank
- SQLite mit WAL Mode (Write-Ahead Logging)
- Persistent Volume in Docker
- Keine Authentifizierung nötig (nur lokal erreichbar)

---

## 📈 Performance-Optimierungen

1. **SQLite WAL Mode**: Schnellere Writes, sichere Reads
2. **WebSocket + Polling Hybrid**: Zuverlässige Echtzeit-Updates
3. **Optimistic Updates**: UI reagiert sofort, Backend folgt nach
4. **localStorage Caching**: Team-ID und Admin-Session persistent
5. **Lazy Loading**: Stationen und Nachrichten on-demand

---

## 🐛 Debugging

### Backend Logs
```bash
docker compose logs fyw-backend -f
```

### Frontend Logs
```bash
docker compose logs fyw-frontend -f
```

### Datenbank inspizieren
```bash
docker exec fyw-backend sqlite3 /app/data/game.db
```

### Container neu starten
```bash
docker compose restart fyw-backend
docker compose restart fyw-frontend
```

---

## 📝 Umgebungsvariablen

### Backend
```
PORT=3001                    # Express Server Port
ADMIN_PIN=1234              # Admin-Login PIN
DB_PATH=/app/data/game.db   # SQLite Datenbank Pfad
```

### Frontend
```
VITE_API_URL=https://fyw.tncg.de      # Backend API URL
VITE_WS_URL=wss://fyw.tncg.de         # WebSocket URL
```

---

## 🔄 Lifecycle

```
User öffnet App
    ↓
SetupScreen: Team erstellen oder mit PIN einloggen
    ↓
PinDisplay: PIN anzeigen (nur bei Erstellung)
    ↓
GameScreen: Stationen spielen
    ├─ Passive: Code eingeben
    ├─ Aktive: "Erledigt melden" → Admin genehmigt
    └─ Chat: Mit Admin kommunizieren
    ↓
Timer läuft ab (2 Stunden)
    ↓
FinalScreen: Endergebnis anzeigen
```

---

## 🎯 Nächste Schritte

- Monitoring & Logging (z.B. mit ELK Stack)
- Backup-Strategie für Datenbank
- Load Testing für mehrere Teams
- Mobile App (React Native)
