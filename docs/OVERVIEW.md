# Find Your Way – Überblick

## Was ist Find Your Way?

**Find Your Way** ist eine gamifizierte Web-App für eine Schnitzeljagd mit Glaubensthema. Teams durchlaufen 12 Stationen, sammeln Punkte (XP) und konkurrieren um die höchste Punktzahl.

---

## Wie funktioniert es?

### Für Teilnehmer

1. **Team erstellen** → Name + Icon wählen → Team-Code erhalten
2. **Stationen erledigen:**
   - **Passive Stationen** (7 Stück): Code eingeben → sofort freigeschaltet
   - **Aktive Stationen** (5 Stück): Aufgabe erledigen → Admin bestätigt
3. **XP sammeln:** +50 für aktive, +20 für passive Stationen
4. **Chat nutzen:** Live mit dem Admin kommunizieren
5. **Nach 2 Stunden:** Finale-Seite mit Rang und Auswertung

### Für Admins

1. **Admin-Bereich öffnen** → PIN eingeben
2. **Live-Dashboard:** Alle Teams, Fortschritt, Rangliste
3. **Aktive Stationen bestätigen/ablehnen** (gelbe Box)
4. **Timer verwalten:** Start, Pause, Reset
5. **Codes anschauen:** Tab "📋 Codes" zum Ausdrucken
6. **Chat moderieren:** Nachrichten lesen und antworten

---

## Spielmechanik

### Passive Stationen (7 Stück)
- Team löst die Aufgabe
- Findet einen 4-stelligen Code
- Gibt den Code in der App ein
- **Sofort:** Station freigeschaltet, XP gutgeschrieben

### Aktive Stationen (5 Stück)
- Team löst die Aufgabe (mit Betreuer vor Ort)
- Drückt "Erledigt melden"
- Station zeigt "⏳ Wartet auf Bestätigung"
- **Admin sieht:** Gelbe Box mit Bestätigen/Ablehnen-Button
- **Nach Bestätigung:** XP gutgeschrieben, animiertes Feedback

---

## Punkte & Ränge

| Rang | Punkte | Beschreibung |
|------|--------|-------------|
| Legendär 🏆 | 90%+ | Alle oder fast alle Stationen |
| Meister 🥇 | 70%+ | Großteil der Stationen |
| Fortgeschritten 🥈 | 50%+ | Hälfte der Stationen |
| Einsteiger 🥉 | <50% | Weniger als die Hälfte |

**Max. XP:** 390 (alle Stationen erledigt)

---

## Team-Codes

Jedes Team bekommt beim Erstellen einen **4-stelligen Code** (z.B. `A3KX`).

**Wozu?**
- Einloggen auf jedem Gerät
- Falls der Browser geschlossen wird
- Kein Datenverlust

**Wie?**
- Tab "Mit Code einloggen" → Code eingeben → fertig

---

## Technische Highlights

- **Mobile-first:** Optimiert für Smartphones
- **Live-Sync:** WebSockets für Echtzeit-Updates
- **Offline-Persistenz:** localStorage für Teilnehmer
- **Docker:** Ein Befehl zum Starten
- **Keine Abhängigkeiten:** Läuft lokal, kein Internet nötig

---

## Zeitablauf

| Zeit | Was passiert |
|------|-------------|
| Start | Admin startet Timer (2 Stunden) |
| 0-120 Min | Teams erledigen Stationen |
| 119 Min | Timer wird rot (letzte 10 Minuten) |
| 120 Min | Timer läuft ab → Finale-Seite für alle Teams |

---

## Häufige Fragen

**F: Was passiert wenn ein Team seinen Code vergisst?**
A: Sie können sich mit dem Code erneut einloggen. Der Admin sieht den Code im Dashboard.

**F: Können Teams alle Stationen auf einmal abhaken?**
A: Nein. Passive Stationen brauchen den Code, aktive brauchen Admin-Bestätigung.

**F: Was ist wenn der Admin eine Station versehentlich ablehnt?**
A: Der Admin kann die Station im Dashboard zurücksetzen.

**F: Funktioniert es ohne Internet?**
A: Ja, wenn alles lokal läuft. Aber WebSockets brauchen eine Verbindung zwischen Frontend und Backend.

**F: Wie viele Teams können gleichzeitig spielen?**
A: Theoretisch unbegrenzt. Praktisch getestet bis 50+ Teams.
