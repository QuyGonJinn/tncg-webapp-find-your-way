# Find Your Way – Überblick & Dokumentation

## 🎮 Was ist Find Your Way?

**Find Your Way** ist eine gamifizierte Web-App für eine interaktive Schnitzeljagd mit Glaubensthema. Teams durchlaufen 12 Stationen, sammeln Punkte (XP), arbeiten zusammen und konkurrieren um die höchste Punktzahl.

**Ideal für:**
- Jugendgruppen und Gemeinden
- Schulen und Bildungseinrichtungen
- Kirchliche Events und Freizeiten
- Teambuilding-Aktivitäten

**Spielzeit:** 2 Stunden  
**Teams:** Unbegrenzt (getestet bis 100+ Teams)  
**Geräte:** Smartphone, Tablet, Computer  
**Anforderung:** Nur eine Internetverbindung

---

## 📚 Dokumentation – Schnelle Navigation

### 👥 Für Teilnehmer
**→ [ANLEITUNG-TEILNEHMER.md](./ANLEITUNG-TEILNEHMER.md)**
- Team erstellen und einloggen
- Passive und aktive Stationen erledigen
- Chat mit Admin nutzen
- Punkte sammeln und Ränge erreichen
- Häufige Fragen und Probleme lösen

### 🎮 Für Admins
**→ [ANLEITUNG-ADMINS.md](./ANLEITUNG-ADMINS.md)**
- Admin-Bereich bedienen
- Timer und Spiel verwalten
- Stationen bestätigen
- Teams und Teilnehmer verwalten
- Chat moderieren
- Control Board nutzen

### 🏗️ Für Entwickler & Techniker
- **[TECHNIK-ARCHITECTURE.md](./TECHNIK-ARCHITECTURE.md)** – System-Architektur, API, WebSocket
- **[TECHNIK-DATABASE.md](./TECHNIK-DATABASE.md)** – Datenbank-Schema, Queries
- **[TECHNIK-DEPLOYMENT.md](./TECHNIK-DEPLOYMENT.md)** – Installation, Docker, Deployment

---

## 🎯 Wie funktioniert das Spiel?

### Für Teilnehmer – Der Spielablauf

```
1. Team erstellen
   ↓
2. Team-Code erhalten & merken
   ↓
3. Stationen erledigen (12 Stück)
   ├─ Passive Stationen (7): Code eingeben → sofort freigeschaltet
   └─ Aktive Stationen (5): Mit Betreuer erledigen → Admin bestätigt
   ↓
4. XP sammeln
   ├─ Passive: +20 XP pro Station
   └─ Aktive: +50 XP pro Station
   ↓
5. Chat mit Admin nutzen (bei Fragen/Problemen)
   ↓
6. Nach 2 Stunden: Finale-Seite mit Rang & Statistiken
```

### Für Admins – Die Kontrolle

```
1. Admin-Bereich öffnen (PIN eingeben)
   ↓
2. Timer starten (2 Stunden)
   ↓
3. Live-Dashboard überwachen
   ├─ Alle Teams sehen
   ├─ Fortschritt tracken
   └─ Rangliste anschauen
   ↓
4. Aktive Stationen bestätigen/ablehnen
   ├─ Gelbe Box = Wartet auf Bestätigung
   ├─ ✓ OK = Station freigeschaltet
   └─ ✕ Nein = Station zurückgesetzt
   ↓
5. Mit Teams chatten (Fragen beantworten)
   ↓
6. Nach 2 Stunden: Finale-Seite für alle Teams
```

---

## 🎮 Spielmechanik im Detail

### Passive Stationen (7 Stück)

**Was sind passive Stationen?**
- Teams lösen die Aufgabe **ohne Betreuer**
- Finden einen **4-stelligen Code** bei der Station
- Geben den Code in der App ein
- **Sofort freigeschaltet** → +20 XP

**Beispiele:**
- Holymoji (HM42)
- Geoguesser (GG17)
- Anchor of Hope (AH85)
- Lochkarte (LK63)
- Heilige Buchstabenjagd (BJ29)
- Wer bin Ich / Standbild (WI54)
- Kennst du mich (KM91)

### Aktive Stationen (5 Stück)

**Was sind aktive Stationen?**
- Teams lösen die Aufgabe **mit Betreuer vor Ort**
- Drücken "Erledigt melden" in der App
- Station zeigt "⏳ Wartet auf Bestätigung"
- **Admin überprüft** und bestätigt
- **Nach Bestätigung** → +50 XP (2,5x mehr!)

**Beispiele:**
- Fake or Fact
- David und Goliath
- Krüge von Kana
- Glaubenssprung
- Der Gute Hirte

---

## 🏆 Punkte & Ränge

### Rang-System

| Rang | Punkte | Beschreibung |
|------|--------|-------------|
| 🏆 **Legendär** | 351+ XP (90%+) | Alle oder fast alle Stationen erledigt |
| 🥇 **Meister** | 273+ XP (70%+) | Großteil der Stationen erledigt |
| 🥈 **Fortgeschritten** | 195+ XP (50%+) | Hälfte der Stationen erledigt |
| 🥉 **Einsteiger** | <195 XP (<50%) | Weniger als die Hälfte erledigt |

### Punkte-Berechnung

| Stationstyp | Punkte | Anzahl | Gesamt |
|-------------|--------|--------|--------|
| Passive Stationen | +20 XP | 7 | 140 XP |
| Aktive Stationen | +50 XP | 5 | 250 XP |
| **Gesamt möglich** | — | **12** | **390 XP** |

**Strategie-Tipp:** Aktive Stationen bringen 2,5x mehr Punkte! Wenn Zeit knapp wird, konzentriert euch auf die aktiven Stationen.

### Ranking: Wie werden Teams sortiert?

**Primär:** Nach XP (absteigend)
- Team mit meisten XP = Platz 1 🥇
- Team mit wenigsten XP = Letzter Platz

**Tie-Breaker:** Wenn zwei Teams gleich viele XP haben
- Das Team, das schneller die erste Station erledigt hat, gewinnt
- Beispiel: Team A (250 XP in 45 Min) vor Team B (250 XP in 90 Min)

**Wichtig:** Die Zeit ist nur relevant, wenn Teams gleich viele Punkte haben!

---

## 🔑 Team-Codes & Login

### Team-Code

Jedes Team bekommt beim Erstellen einen **eindeutigen 4-stelligen Code** (z.B. `A3KX`).

**Wozu?**
- ✅ Einloggen auf jedem Gerät
- ✅ Falls der Browser geschlossen wird
- ✅ Kein Datenverlust
- ✅ Mehrere Geräte pro Team möglich

**Wie einloggen?**
1. App öffnen
2. Tab "🔑 Mit Code einloggen"
3. Code eingeben (z.B. `A3KX`)
4. "Einloggen 🔑" drücken
5. Alle Fortschritte sind noch da!

---

## ⏱️ Zeitablauf & Timer

### 2-Stunden-Spielzeit

| Zeit | Status | Was passiert |
|------|--------|-------------|
| **Start** | — | Admin startet Timer |
| **0-110 Min** | 🟢 Grün | Alles normal, Teams spielen |
| **110-120 Min** | 🟡 Gelb | Warnung: Letzte 10 Minuten! |
| **120 Min** | 🔴 Rot | Timer läuft ab |
| **Nach 120 Min** | ⏹️ Stopp | Finale-Seite für alle Teams |

**Wichtig:**
- Der Timer läuft kontinuierlich (keine Pausen)
- Wenn der Timer abläuft, können keine neuen Stationen mehr erledigt werden
- Alle Teams sehen die Finale-Seite gleichzeitig

---

## 💬 Chat & Kommunikation

### Team-Admin Chat

**Wann nutzen?**
- ❓ Fragen zur Aufgabe
- 🔧 Technische Probleme
- 💡 Hinweise anfordern
- 📍 Fragen zum Standort

**Wie funktioniert's?**
1. Tab "💬 Chat" öffnen
2. Nachricht eingeben (max. 200 Zeichen)
3. "➤" drücken zum Senden
4. Admin antwortet sofort

**Admin-Perspektive:**
- Alle Team-Nachrichten sehen
- Schnell antworten (Teams warten!)
- Hinweise geben (aber nicht zu viel verraten)
- Probleme lösen

---

## 🌐 Technische Highlights

### Architektur
- **Frontend:** React + Vite + Tailwind CSS (Mobile-First)
- **Backend:** Node.js + Express + SQLite
- **Kommunikation:** REST API + WebSocket (Echtzeit)
- **Deployment:** Docker Compose (Ein Befehl!)

### Features
- ✅ **Mobile-optimiert:** Perfekt für Smartphones
- ✅ **Live-Sync:** WebSockets für Echtzeit-Updates
- ✅ **Offline-Persistenz:** localStorage für Teilnehmer
- ✅ **Skalierbar:** Getestet bis 100+ Teams
- ✅ **Lokal:** Läuft ohne Internet (nur lokal nötig)
- ✅ **Datenschutz:** DSGVO-konform, keine persönlichen Daten

### Deployment
```bash
# Ein Befehl zum Starten:
docker compose up --build -d

# Fertig! App läuft auf:
# - Frontend: http://localhost
# - Admin: http://localhost/admin
# - Backend: http://localhost:3001
```

---

## 📊 Datenbank & Persistenz

### Was wird gespeichert?

| Daten | Speicherort | Zweck |
|------|------------|--------|
| Teams | SQLite DB | Team-Verwaltung |
| Stationen-Status | SQLite DB | Fortschritt tracken |
| Chat-Nachrichten | SQLite DB | Kommunikation |
| Team-ID | localStorage | Schneller Login |
| Admin-Session | localStorage | Admin-Authentifizierung |

### Datenschutz
- ✅ Keine persönlichen Daten (nur Team-Namen)
- ✅ Keine Passwörter (nur PINs)
- ✅ Keine IP-Adressen
- ✅ Keine Tracking-Daten
- ✅ Daten können jederzeit gelöscht werden

---

## ❓ Häufige Fragen

### Für Teilnehmer

**F: Was passiert wenn ein Team seinen Code vergisst?**
A: Der Admin kann den Code im Control Board sehen und euch helfen. Oder ihr fragt im Chat!

**F: Können Teams alle Stationen auf einmal abhaken?**
A: Nein. Passive Stationen brauchen den Code, aktive brauchen Admin-Bestätigung. Das ist gewollt!

**F: Was ist wenn der Timer abläuft während wir eine Station erledigen?**
A: Die Finale-Seite erscheint sofort. Versucht, vor Ablauf fertig zu sein!

**F: Kann ich mit meinem Handy und Tablet gleichzeitig spielen?**
A: Ja, mit dem gleichen Team-Code. Aber nur ein Gerät sollte aktiv sein.

**F: Funktioniert es offline?**
A: Nein, ihr braucht eine Verbindung zum Server. Aber der Server läuft lokal!

### Für Admins

**F: Wie viele Teams können gleichzeitig spielen?**
A: Theoretisch unbegrenzt. Praktisch getestet bis 100+ Teams ohne Probleme.

**F: Was ist wenn der Admin eine Station versehentlich ablehnt?**
A: Kein Problem! Der Admin kann die Station im Dashboard zurücksetzen.

**F: Können wir den Timer pausieren?**
A: Ja! Der Admin kann den Timer pausieren, starten und zurücksetzen.

**F: Wie sichern wir die Daten?**
A: Automatisch in Docker Volume. Backups können mit `docker cp` erstellt werden.

**F: Ist die App DSGVO-konform?**
A: Ja! Es werden keine persönlichen Daten gespeichert. Daten können jederzeit gelöscht werden.

---

## 🚀 Schnellstart

### Für Teilnehmer
1. **App öffnen:** `http://<server-ip>`
2. **Team erstellen:** Name + Icon wählen
3. **Team-Code merken:** Foto machen!
4. **Spielen:** Stationen erledigen und Punkte sammeln

### Für Admins
1. **Admin-Bereich:** `http://<server-ip>/admin`
2. **PIN eingeben:** `1234` (Standard)
3. **Timer starten:** "▶ Start" drücken
4. **Überwachen:** Dashboard anschauen, Stationen bestätigen, Chat moderieren

### Für Techniker
1. **Repository klonen:** `git clone ...`
2. **Docker starten:** `docker compose up --build -d`
3. **Logs überprüfen:** `docker compose logs -f`
4. **Fertig!** App läuft auf `http://localhost`

---

## 📖 Weitere Dokumentation

### Benutzer-Dokumentation
- **[ANLEITUNG-TEILNEHMER.md](./ANLEITUNG-TEILNEHMER.md)** – Komplette Anleitung für Spieler
- **[ANLEITUNG-ADMINS.md](./ANLEITUNG-ADMINS.md)** – Komplette Anleitung für Admins

### Technische Dokumentation
- **[TECHNIK-ARCHITECTURE.md](./TECHNIK-ARCHITECTURE.md)** – System-Architektur, API, WebSocket
- **[TECHNIK-DATABASE.md](./TECHNIK-DATABASE.md)** – Datenbank-Schema, Queries, Operationen
- **[TECHNIK-DEPLOYMENT.md](./TECHNIK-DEPLOYMENT.md)** – Installation, Docker, Deployment, Troubleshooting

---

## 🎯 Checkliste für ein Event

### Vorbereitung
- [ ] App auf Server installiert
- [ ] Admin-PIN geändert (nicht "1234"!)
- [ ] Alle Codes ausgedruckt und laminiert
- [ ] Codes bei den Stationen ausgelegt
- [ ] Betreuer an aktiven Stationen positioniert
- [ ] WLAN getestet
- [ ] Alle Geräte geladen

### Während des Events
- [ ] Timer pünktlich starten
- [ ] Dashboard regelmäßig überprüfen
- [ ] Stationen zeitnah bestätigen
- [ ] Chat-Nachrichten beantworten
- [ ] Betreuer koordinieren

### Nach dem Event
- [ ] Chat-Nachrichten löschen (Datenschutz)
- [ ] Statistiken speichern (falls gewünscht)
- [ ] Backup erstellen
- [ ] Aus Admin-Bereich ausloggen

---

## 🆘 Support & Hilfe

### Probleme?
- **Teilnehmer:** Siehe [ANLEITUNG-TEILNEHMER.md](./ANLEITUNG-TEILNEHMER.md) → Probleme & Lösungen
- **Admins:** Siehe [ANLEITUNG-ADMINS.md](./ANLEITUNG-ADMINS.md) → Häufige Probleme
- **Techniker:** Siehe [TECHNIK-DEPLOYMENT.md](./TECHNIK-DEPLOYMENT.md) → Troubleshooting

### Kontakt
Bei technischen Fragen oder Bugs: Kontaktiert den technischen Support oder öffnet ein Issue im Repository.

---

Viel Spaß mit Find Your Way! 🌊⚓
