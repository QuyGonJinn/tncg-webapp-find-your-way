# Find Your Way – Die ultimative Glaubensjagd

Eine gamifizierte, mobile-first Web-App für eine Schnitzeljagd mit Glaubensthema. Teams sammeln XP, erledigen Stationen und kommunizieren live mit dem Admin.

---

## Projektstruktur

```
find-your-way/          # React Frontend (Vite + Tailwind CSS)
find-your-way-backend/  # Node.js Backend (Express + WebSockets + SQLite)
```

---

## Voraussetzungen

- Node.js (v18+)
- npm

---

## Setup & Start

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

## Seiten

| URL | Beschreibung |
|-----|-------------|
| `localhost:5173` | Teilnehmer-App |
| `localhost:5173/admin` | Admin-Bereich |

---

## Features

### Teilnehmer
- Team erstellen mit Name und Icon (18 Emojis zur Auswahl)
- 12 Stationen mit Titel, Beschreibung und Typ (aktiv / passiv)
- Stationen abhaken → XP sammeln (+50 aktiv, +20 passiv)
- Animiertes XP-Feedback beim Abhaken
- Fortschrittsbalken und Countdown-Timer (2 Stunden)
- Hinweis-System basierend auf Fortschritt
- Live-Chat mit dem Admin
- Finale-Seite mit Rang und Auswertung nach Zeitablauf

### Admin (`/admin`)
- Live-Übersicht aller Teams mit XP und Fortschritt
- Rangliste
- Timer starten, pausieren, zurücksetzen
- Einzelne Stationen eines Teams zurücksetzen
- Teams löschen
- Chat: Nachrichten aller Teams lesen und antworten
- Alle Updates in Echtzeit via WebSocket

---

## Stationen

| # | Name | Typ | XP |
|---|------|-----|----|
| 1 | Holymoji | Passiv | 20 |
| 2 | Geoguesser | Passiv | 20 |
| 3 | Fake or Fact | Aktiv | 50 |
| 4 | David und Goliath | Aktiv | 50 |
| 5 | Anchor of Hope | Passiv | 20 |
| 6 | Krüge von Kana | Aktiv | 50 |
| 7 | Lochkarte | Passiv | 20 |
| 8 | Heilige Buchstabenjagd | Passiv | 20 |
| 9 | Glaubenssprung | Aktiv | 50 |
| 10 | Der Gute Hirte | Aktiv | 50 |
| 11 | Wer bin Ich / Standbild | Passiv | 20 |
| 12 | Kennst du mich | Passiv | 20 |

**Max. erreichbar: 390 XP**

---

## Technik

| Bereich | Stack |
|---------|-------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express, sql.js (SQLite) |
| Echtzeit | WebSockets (`ws`) |
| Routing | React Router |
| Persistenz | SQLite (`game.db`) |
