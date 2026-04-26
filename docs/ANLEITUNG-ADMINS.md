# Anleitung für Admins

## 🛠️ Admin-Bereich

---

## 1️⃣ Zugang zum Admin-Dashboard

### Admin-Bereich öffnen

1. **URL:** `http://<server-ip>/admin` (oder `https://fyw.tncg.de/admin`)
2. **PIN eingeben** (Standard: `1234`)
3. **"Einloggen 🔑" drücken**

---

## 2️⃣ Dashboard-Tabs

### 📊 Übersicht (Standard-Tab)

**Oben: Timer-Kontrolle**
- **▶ Start:** Timer startet (2 Stunden)
- **⏸ Pause:** Timer pausiert
- **🔄 Reset:** Timer zurücksetzen

**Mitte: Rangliste**
- Alle Teams sortiert nach XP
- Fortschrittsbalken pro Team
- Zeigt: Teilnehmer • Stationen • ⚡ Aktive Stationen
- **Expandieren (▼):** Zeigt:
  - **Zugangscode:** Der PIN des Teams (z.B. "A3KX")
  - **Aktive Stationen:** Anzahl der aktiven Stationen
  - **Angemeldete Teilnehmer:** Liste der registrierten Teilnehmer (bearbeitbar)
  - **Stats:** Erledigt/Ausstehend/XP

**Unten: Team-Details**
- Jedes Team als Karte
- **Gelbe Box:** Aktive Stationen warten auf Bestätigung
  - **✓ OK:** Station bestätigen → XP gutgeschrieben
  - **✕ Nein:** Station ablehnen → zurückgesetzt
- **▼ Stationen anzeigen:** Alle Stationen des Teams sehen
- **Team löschen:** Team komplett entfernen

### 📋 Codes

**Alle Station-Codes zum Ausdrucken:**

**Passive Stationen (mit Codes):**
- Holymoji: `HM42`
- Geoguesser: `GG17`
- Anchor of Hope: `AH85`
- Lochkarte: `LK63`
- Heilige Buchstabenjagd: `BJ29`
- Wer bin Ich / Standbild: `WI54`
- Kennst du mich: `KM91`

**Aktive Stationen (ohne Codes):**
- Fake or Fact
- David und Goliath
- Krüge von Kana
- Glaubenssprung
- Der Gute Hirte

**Wie verwenden?**
1. Codes ausdrucken
2. Bei jeder passiven Station auslegen
3. Teams müssen die Aufgabe lösen um den Code zu finden

### 💬 Chat

**Alle Team-Nachrichten sehen:**
- Linke Seite: Liste aller Teams
- Mitte: Chat-Verlauf
- Rechts: Antwort-Feld

**Nachrichten beantworten:**
1. Team in der Liste anklicken
2. Nachricht eingeben
3. **"➤" drücken** zum Senden
4. Nachricht erscheint sofort beim Team

**Alle Nachrichten löschen:**
- Button **"🗑 Alle löschen"** oben rechts
- Bestätigung erforderlich

---

## 3️⃣ Control Board (für Admins)

Das Control Board ist ein separates Dashboard für Admins zur Verwaltung von Teams und Teilnehmern.

### Zugang zum Control Board

1. **URL:** `http://<server-ip>/control` (oder `https://fyw.tncg.de/control`)
2. **Keine PIN erforderlich** (öffentlich für Admins)

### Control Board Features

**Header mit Live-Timer:**
- ⏱️ Verbleibende Zeit in HH:MM:SS Format
- ▶️ Läuft / ⏸️ Pausiert Status
- Wird rot und pulsiert bei < 5 Minuten

**Statistik-Karten:**
- 📊 **Teams:** Anzahl registrierter Gruppen
- 👥 **Teilnehmer:** Gesamtzahl aller Teilnehmer
- ✅ **Fertig:** Anzahl abgeschlossener Teams
- 📈 **Ø Fortschritt:** Durchschnittlicher Fortschritt aller Teams

**Chat-Aktivität:**
- 💬 **Nachrichten gesamt:** Alle Nachrichten
- 🔴 **Ungelesen:** Ungelesene Nachrichten

**Rangliste (Expandierbar):**
- Alle Teams sortiert nach XP
- **Übersicht zeigt:**
  - Rang (1, 2, 3, ...)
  - Team-Icon und Name
  - Teilnehmer-Anzahl
  - Stationen-Fortschritt (z.B. 5/12)
  - ⚡ Aktive Stationen
  - XP-Punkte
  - Status-Badge (✅ Fertig / ⏳ Ausstehend / 🎮 Aktiv)

- **Beim Expandieren (▼) sehen Sie:**
  - **Zugangscode:** Der PIN des Teams (z.B. "A3KX") - zum Weitergeben an Teams
  - **Aktive Stationen:** Anzahl der aktiven Stationen (z.B. "⚡ 5")
  - **Angemeldete Teilnehmer:** 
    - Liste der registrierten Teilnehmer
    - ✏️ Bearbeiten: Namen ändern
    - 🗑️ Löschen: Teilnehmer entfernen
    - ➕ Hinzufügen: Neue Teilnehmer eintragen (max. 6)
  - **Stats:** Erledigt/Ausstehend/XP

**Zusammenfassung (unten):**
- 📈 Gruppen gesamt
- 👥 Teilnehmer gesamt
- 📊 Abschlussquote (%)
- ⚡ Durchschn. XP

### Teilnehmer-Verwaltung im Control Board

**Teilnehmer hinzufügen:**
1. Team expandieren (▼)
2. Im Feld "Weitere Teilnehmer hinzufügen" Namen eingeben
3. ➕ Button drücken
4. Teilnehmer wird sofort hinzugefügt (max. 6 pro Team)

**Teilnehmer bearbeiten:**
1. Team expandieren (▼)
2. ✏️ Button neben dem Namen drücken
3. Namen ändern
4. ✓ Button drücken zum Speichern
5. ✕ Button zum Abbrechen

**Teilnehmer löschen:**
1. Team expandieren (▼)
2. 🗑️ Button neben dem Namen drücken
3. Bestätigung erforderlich
4. Teilnehmer wird gelöscht

### Workflow: Teilnehmer-Anmeldung

1. **Team erstellt sich** mit Teamnamen + Icon (keine Teilnehmer erforderlich)
2. **Team erhält Zugangscode** (z.B. "A3KX")
3. **Team geht zum Caféstand** zur Anmeldung
4. **Admin trägt Teilnehmer-Namen im Control Board ein:**
   - Team expandieren
   - Namen in "Weitere Teilnehmer hinzufügen" eingeben
   - ➕ drücken
5. **Anmeldung abgeschlossen** - Team kann spielen

---

## 4️⃣ Spielablauf

### Vor dem Spiel

1. **Codes ausdrucken** (Tab "📋 Codes")
2. **Codes bei passiven Stationen auslegen**
3. **Betreuer an aktiven Stationen positionieren**
4. **PIN ändern** (optional, für Sicherheit)

### Spiel starten

1. **Teams registrieren sich** (App öffnen, Team erstellen)
2. **Admin-Dashboard öffnen** → Alle Teams sehen
3. **"▶ Start" drücken** → Timer läuft (2 Stunden)

### Während des Spiels

**Aktive Stationen bestätigen:**
- Gelbe Box mit "⏳ Wartet auf Bestätigung"
- **✓ OK:** Team hat die Aufgabe richtig erledigt → XP gutgeschrieben
- **✕ Nein:** Team hat nicht richtig erledigt → zurückgesetzt

**Chat moderieren:**
- Teams können Fragen stellen
- Ihr antwortet im Chat
- Nachrichten erscheinen sofort

**Probleme lösen:**
- Team hat falschen Code eingegeben? → Im Chat helfen
- Station versehentlich bestätigt? → "▼ Stationen anzeigen" → "✕ Zurücksetzen"
- Team braucht Hinweis? → Im Chat schreiben

### Nach 2 Stunden

1. **Timer läuft ab** → Finale-Seite erscheint automatisch bei allen Teams
2. **Rangliste ist final** → Gewinner steht fest
3. **Optional:** Neue Runde starten → "🔄 Reset" drücken

---

## 5️⃣ Häufige Admin-Aufgaben

### Station bestätigen

1. **Gelbe Box sehen** mit "⏳ Wartet auf Bestätigung"
2. **Team hat Aufgabe erledigt?** → **✓ OK** drücken
3. **Team hat nicht erledigt?** → **✕ Nein** drücken

### Team zurücksetzen

1. **Team-Karte öffnen** → "▼ Stationen anzeigen"
2. **Station anklicken** → "✕ Zurücksetzen"
3. **Station ist wieder offen** → Team kann nochmal versuchen

### Team löschen

1. **Team-Karte öffnen**
2. **"Team löschen" drücken**
3. **Bestätigung erforderlich**
4. **Team ist weg** → Alle Daten gelöscht

### Chat-Nachricht beantworten

1. **Tab "💬 Chat"**
2. **Team in der Liste anklicken**
3. **Nachricht eingeben**
4. **"➤" drücken**
5. **Nachricht erscheint sofort beim Team**

### Alle Nachrichten löschen

1. **Tab "💬 Chat"**
2. **"🗑 Alle löschen" oben rechts**
3. **Bestätigung erforderlich**
4. **Alle Nachrichten sind weg**

---

## 6️⃣ Technische Tipps

### Codes ändern

**Datei:** `find-your-way-backend/src/stations.js`

```javascript
{ id: 1, title: "Holymoji", code: "HM42" }  // Code hier ändern
```

Dann neu deployen:
```bash
git pull
docker compose up --build -d
```

### Spielzeit ändern

**Datei:** `find-your-way-backend/src/db.js`

```javascript
db.run(`INSERT OR IGNORE INTO game_state (key, value) VALUES ('timer_duration', '${2 * 60 * 60}')`);
// 2 * 60 * 60 = 2 Stunden in Sekunden
// Für 1 Stunde: 1 * 60 * 60
// Für 3 Stunden: 3 * 60 * 60
```

### Stationen hinzufügen/ändern

**Datei:** `find-your-way-backend/src/stations.js`

```javascript
{ id: 13, title: "Neue Station", type: "passiv", points: 20, emoji: "🎯", code: "NS99" }
```

Dann neu deployen.

---

## 7️⃣ Problembehebung

### Admin-Bereich lädt nicht

- Browser neu laden (F5)
- PIN überprüfen
- Backend läuft? → `docker compose logs -f`

### Teams sehen Bestätigung nicht sofort

- Normalerweise sofort via WebSocket
- Falls nicht: Team-Seite neu laden
- Sollte nicht vorkommen — Backend-Logs prüfen

### Chat-Nachrichten kommen nicht an

- WebSocket-Verbindung prüfen
- Backend-Logs: `docker compose logs -f`
- Team-Seite neu laden

### Timer läuft nicht

- "▶ Start" drücken
- Backend-Logs prüfen
- Neu starten: `docker compose restart`

### Datenbank-Fehler

- Logs anschauen: `docker compose logs -f`
- Neu starten: `docker compose restart`
- Im Notfall: `docker compose down && docker compose up -d`

---

## 8️⃣ Best Practices

### Vor dem Event

✅ Codes ausdrucken und laminieren  
✅ Betreuer an aktiven Stationen einweisen  
✅ PIN ändern (nicht `1234`)  
✅ Test-Team erstellen und durchspielen  
✅ Backup der Datenbank machen (optional)

### Während des Events

✅ Regelmäßig Dashboard checken  
✅ Chat-Nachrichten zeitnah beantworten  
✅ Aktive Stationen schnell bestätigen  
✅ Bei Problemen: Team im Chat helfen  
✅ Finale-Seite nicht zu früh schließen

### Nach dem Event

✅ Rangliste fotografieren/speichern  
✅ Gewinner-Team ankündigen  
✅ Optional: Datenbank exportieren  
✅ Für nächstes Event: Codes/Stationen anpassen

---

## 🆘 Support

**Häufige Fehler:**

| Problem | Lösung |
|---------|--------|
| PIN funktioniert nicht | In docker-compose.yml überprüfen |
| Codes nicht sichtbar | Tab "📋 Codes" öffnen |
| Team-Bestätigung funktioniert nicht | Backend-Logs prüfen, neu starten |
| Chat-Nachrichten kommen nicht an | WebSocket-Verbindung prüfen |
| Timer läuft nicht | "▶ Start" drücken, Backend-Logs prüfen |

---

Viel Erfolg beim Event! 🌊⚓
