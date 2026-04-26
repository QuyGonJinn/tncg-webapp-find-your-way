# Find Your Way – Die ultimative Glaubensjagd

Eine gamifizierte, mobile-first Web-App für eine Schnitzeljagd mit Glaubensthema. Teams sammeln XP, erledigen Stationen und kommunizieren live mit dem Admin.

---

## 📋 Dokumentation

- **[Überblick](docs/OVERVIEW.md)** — Was ist Find Your Way?
- **[Anleitung für Teilnehmer](docs/TEILNEHMER.md)** — Wie spielen Teams?
- **[Anleitung für Admins](docs/ADMIN.md)** — Wie verwaltet ihr das Event?

---

## Projektstruktur

```
find-your-way/          # React Frontend (Vite + Tailwind CSS)
find-your-way-backend/  # Node.js Backend (Express + WebSockets + SQLite)
docker-compose.yml      # Docker Setup
docs/                   # Dokumentation
```

---

## Voraussetzungen

- Node.js (v18+) – für lokale Entwicklung
- Docker + Docker Compose – für Deployment

---

## Option 1: Lokal starten (Entwicklung)

### Backend

```bash
cd find-your-way-backend
npm install
node src/index.js
```

Läuft auf `http://localhost:3001`

### Frontend

```bash
cd find-your-way
npm install
npm run dev
```

Läuft auf `http://localhost:5173`

---

## Option 2: Docker (Empfohlen für Deployment)

### Voraussetzungen auf dem Server / Raspberry Pi

```bash
# Docker installieren
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Neu einloggen danach
```

### Starten

```bash
git clone <repo-url>
cd tncg-webapp-find-your-way
docker compose up --build -d
```

### Erreichbar unter

| URL | Beschreibung |
|-----|-------------|
| `http://<server-ip>` | Teilnehmer-App |
| `http://<server-ip>/admin` | Admin-Bereich (PIN-geschützt) |

IP des Raspberry Pi herausfinden:
```bash
hostname -I
```

### Nützliche Befehle

```bash
docker compose logs -f        # Logs live anschauen
docker compose down           # Stoppen
docker compose up -d          # Wieder starten
docker compose up --build -d  # Nach Code-Änderungen neu bauen
```

> Die Datenbank wird im Docker Volume `fyw-data` gespeichert und überlebt Neustarts. Durch `restart: unless-stopped` startet die App automatisch wenn der Server neu bootet.

---

## Konfiguration

### Admin-PIN ändern

In `docker-compose.yml`:
```yaml
environment:
  ADMIN_PIN: "1234"  # Hier ändern
```

Dann neu starten:
```bash
docker compose up --build -d
```

### Station-Codes ändern

In `find-your-way-backend/src/stations.js` und `find-your-way/src/data/stations.js`:
```javascript
{ id: 1, title: "Holymoji", code: "HM42" }  // Code hier ändern
```

---

## Features

### Teilnehmer
- Team erstellen mit Name und Icon (18 Emojis zur Auswahl)
- 12 Stationen mit Titel, Beschreibung und Typ (aktiv / passiv)
- **Passive Stationen:** Code eingeben → sofort freigeschaltet
- **Aktive Stationen:** "Erledigt melden" → wartet auf Admin-Bestätigung
- Stationen abhaken → XP sammeln (+50 aktiv, +20 passiv)
- Animiertes XP-Feedback beim Abhaken
- Fortschrittsbalken und Countdown-Timer (2 Stunden)
- Hinweis-System basierend auf Fortschritt
- Live-Chat mit dem Admin
- Finale-Seite mit Rang und Auswertung nach Zeitablauf
- **Team-Code:** Einloggen auf jedem Gerät ohne Datenverlust

### Admin (`/admin`)
- PIN-geschützter Zugang
- Live-Übersicht aller Teams mit XP und Fortschritt
- Rangliste
- Timer starten, pausieren, zurücksetzen
- **Pending Approvals:** Aktive Stationen bestätigen/ablehnen
- Einzelne Stationen eines Teams zurücksetzen
- Teams löschen
- **📋 Codes-Tab:** Alle Station-Codes zum Ausdrucken
- Chat: Nachrichten aller Teams lesen und antworten
- Alle Chatnachrichten auf einmal löschen
- Alle Updates in Echtzeit via WebSocket

---

## Stationen

| # | Name | Typ | XP | Code |
|---|------|-----|----|------|
| 1 | Holymoji | Passiv | 20 | HM42 |
| 2 | Geoguesser | Passiv | 20 | GG17 |
| 3 | Fake or Fact | Aktiv | 50 | — |
| 4 | David und Goliath | Aktiv | 50 | — |
| 5 | Anchor of Hope | Passiv | 20 | AH85 |
| 6 | Krüge von Kana | Aktiv | 50 | — |
| 7 | Lochkarte | Passiv | 20 | LK63 |
| 8 | Heilige Buchstabenjagd | Passiv | 20 | BJ29 |
| 9 | Glaubenssprung | Aktiv | 50 | — |
| 10 | Der Gute Hirte | Aktiv | 50 | — |
| 11 | Wer bin Ich / Standbild | Passiv | 20 | WI54 |
| 12 | Kennst du mich | Passiv | 20 | KM91 |

**Max. erreichbar: 390 XP**

---

## Technik

| Bereich | Stack |
|---------|-------|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router |
| Backend | Node.js, Express, better-sqlite3 (SQLite) |
| Echtzeit | WebSockets (`ws`) |
| Persistenz | SQLite via Docker Volume |
| Deployment | Docker + nginx |

---

## Support

Bei Fragen oder Problemen: Siehe die Dokumentation in `docs/`
