# Anleitung für Admins – Find Your Way

## 🎮 Willkommen im Admin-Bereich!

Als Admin seid ihr die **Kontrollzentrale** des Spiels. Ihr verwaltet Teams, bestätigt Stationen, moderiert den Chat und überwacht den Timer. Diese Anleitung zeigt euch alles, was ihr wissen müsst.

**Wichtige Rollen:**
- 🎮 **Spielleitung:** Timer starten, Fortschritt überwachen
- ✅ **Stationen-Bestätigung:** Aktive Stationen überprüfen und freigeben
- 💬 **Chat-Moderation:** Mit Teams kommunizieren
- 👥 **Teilnehmer-Verwaltung:** Teams und Spieler verwalten

---

## 1️⃣ Anmelden – Admin-Bereich

### Schritt für Schritt

1. **Admin-Seite öffnen**
   - Öffnet einen Browser auf eurem Computer
   - Gebt die Adresse ein: `https://fyw.tncg.de/admin`
   - Die Admin-Anmeldung sollte erscheinen

   ![Anmeldebereich #1](./images/admin/anmeldebereich_1.png)

2. **PIN eingeben**
   - Standard-PIN: `1234`
   - Gebt die PIN in das Eingabefeld ein
   - **Wichtig:** Die PIN kann in der Konfiguration geändert werden

   ![Anmeldebereich #2](./images/admin/anmeldebereich_2.png)

3. **"Einloggen 🔑" drücken**
   - Klickt auf den Button
   - Der Admin-Bereich lädt

   ![Anmeldebereich #3](./images/admin/anmeldebereich_3.png)

4. **Ihr seid angemeldet!**
   - Ihr seht das Admin-Dashboard
   - Die Uhr und die Rangliste sind sichtbar

   ![Anmeldebereich #4](./images/admin/anmeldebereich_4.png)

### ⚠️ Sicherheit

- **PIN schützen:** Teilt die PIN nicht mit Teilnehmern!
- **Admin-Bereich sperren:** Wenn ihr nicht am Computer seid, loggt euch aus

---

## 2️⃣ Das Admin-Dashboard verstehen

### Oben: Die Uhr

![dasboard #1](./images/admin/dashboard_1.png)

```
⏱ 2:00:00
```

- **Zeigt die verbleibende Spielzeit**
- **Grün:** Alles normal (mehr als 10 Minuten)
- **Gelb:** Warnung (5-10 Minuten)
- **Rot:** Letzte 10 Minuten! 🔴

### Timer-Buttons

```
[▶ Start] [⏸ Pause] [🔄 Reset]
```

| Button | Funktion | Wann nutzen |
|--------|----------|-----------|
| **▶ Start** | Startet den 2-Stunden-Timer | Am Anfang des Spiels |
| **⏸ Pause** | Pausiert den Timer | Bei technischen Problemen |
| **🔄 Reset** | Setzt den Timer auf 2:00:00 zurück | Wenn ihr neu starten wollt |

<div style="display: flex; gap: 10px;">
  <img src="./images/admin/dashboard_2.png" width="250">
  <img src="./images/admin/dashboard_3.png" width="250">
  <img src="./images/admin/dashboard_4.png" width="250">
</div>

### Statistik-Boxen

```
📊 Teams: 5
👥 Teilnehmer: 23
✅ Fertig: 1
📈 Ø Fortschritt: 42%
```

- **Teams:** Wie viele Teams spielen gerade
- **Teilnehmer:** Gesamtzahl aller Spieler
- **Fertig:** Wie viele Teams alle Stationen erledigt haben
- **Ø Fortschritt:** Durchschnittlicher Fortschritt aller Teams

### Rangliste

Die Rangliste zeigt alle Teams sortiert nach Punkten (Hierbei handelt es sich hier um Beispiele)

![dasboard #1](./images/admin/dashboard_1.png)

```
1. 🏆 Team C (90 XP) – 3/12 Stationen
2. 🥇 Team B (70 XP) – 2/12 Stationen
3. 🥈 Team A (40 XP) – 2/12 Stationen
```

- **Platz:** Aktuelle Rangliste
- **Team-Name + Icon:** Der Name und das Icon des Teams
- **Punkte:** Aktuelle XP des Teams
- **Stationen:** Wie viele Stationen erledigt / gesamt

### Team-Karten

Unter der Rangliste seht ihr **Team-Karten** mit Details:

```
🌊 Team C (6 Spieler)
Fortschritt: 3/12 (25%)
Punkte: 90/390 XP

![teamkarte #1](./images/admin/teamkarte_1.png)

[▼ Expandieren]
```

- **Team-Name + Icon:** Der Name und das Icon
- **Spieler:** Wie viele Spieler im Team sind
- **Fortschritt:** Stationen erledigt / gesamt
- **Punkte:** Aktuelle XP
- **▼ Expandieren:** Klickt hier, um mehr Details zu sehen

![teamkarte #2](./images/admin/teamkarte_2.png)

---

## 3️⃣ Wartezimmer – Spielstart kontrollieren

### Was ist das Wartezimmer?

Das Wartezimmer ist ein **Kontrollmechanismus**, um den Spielstart zu steuern:

- **Wartezimmer aktiv:** Teams sehen einen Wartebildschirm, können sich anmelden, aber nicht spielen
- **Wartezimmer inaktiv:** Teams können sofort spielen
- **Automatische Deaktivierung:** Wenn ihr den Timer startet, wird das Wartezimmer automatisch deaktiviert

### Wann nutzen?

- ✅ **Vor dem Event:** Alle Teams melden sich an, während ihr noch vorbereitet
- ✅ **Synchroner Start:** Alle Teams starten gleichzeitig
- ✅ **Ordnung:** Verhindert, dass Teams zu früh spielen

### Wartezimmer-Kontrolle im Admin-Dashboard

![Waitingroom #1](./images/admin/waitingroom_1.png)

**Die Wartezimmer-Kontrolle zeigt:**

1. **Status-Anzeige**
   - 🟡 **Wartend:** Wartezimmer ist aktiv
   - 🟢 **Läuft:** Spiel hat gestartet

2. **Wartende Teams**
   - Live-Zähler der angemeldeten Teams
   - Aktualisiert sich alle 2 Sekunden

3. **Aktivitäts-Log**
   - Zeigt die letzten 3 Aktionen
   - Mit Timestamps
   - Farbcodiert (Grün = Erfolg, Gelb = Warnung, Rot = Fehler)

4. **Spiel starten Button**
   - 🟡 **"⏸ Wartezimmer aktiv"** – Klick zum Deaktivieren
   - 🟢 **"▶ Spiel starten"** – Klick zum Aktivieren

### Schritt-für-Schritt: Spiel starten

![Waitingroom #2](./images/admin/waitingroom_2.png)

**So startet ihr das Spiel:**

1. **Teams warten lassen**
   - Wartezimmer ist standardmäßig **aktiv**
   - Teams sehen den Wartebildschirm
   - Ihr seht die Anzahl der Teams

2. **Alle Teams sind angemeldet?**
   - Überprüft die Anzahl im Aktivitäts-Log
   - Wartet, bis alle Teams da sind

3. **"Spiel starten" drücken**
   - Klickt auf den grünen Button
   - Das Wartezimmer wird deaktiviert
   - Alle Teams sehen sofort den Spielbereich

4. **Timer starten**
   - Klickt auf "▶ Start" beim Timer
   - Das Spiel läuft jetzt
   - Alle Teams können Stationen erledigen

### Aktivitäts-Log verstehen

Das Log zeigt die letzten 3 Aktionen:

| Aktion | Bedeutung |
|--------|-----------|
| ✅ Wartezimmer aktiviert | Wartezimmer wurde eingeschaltet |
| 🎮 Spiel gestartet - Wartezimmer deaktiviert | Spiel wurde gestartet |
| ❌ Fehler beim Umschalten | Technisches Problem |
| 5 Team(s) warten | Aktuelle Anzahl Teams |

### Teilnehmer-Perspektive: Wartebildschirm

Während das Wartezimmer aktiv ist, sehen die Teams:

- **Team-Name + Icon**
- **Team-Code** (zum Merken!)
- **Anzahl wartender Teams**
- **Warteanimation** (animierte Punkte)
- **Tipps** (Akku überprüfen, WLAN testen, etc.)

### ⚠️ Wichtig

- **Wartezimmer ist standardmäßig aktiv** – Ihr müsst es deaktivieren, um das Spiel zu starten
- **Auto-Deaktivierung:** Wenn ihr den Timer startet, wird das Wartezimmer automatisch deaktiviert
- **Keine Punkte im Wartezimmer:** Teams können keine Stationen erledigen, während sie warten
- **Logs sind lokal:** Die Logs werden nicht gespeichert, nur während der Session angezeigt

---

## 4️⃣ Aktive Stationen bestätigen

### Die gelbe Box

Wenn ein Team eine aktive Station erledigt hat, seht ihr eine **gelbe Box** auf der Team-Karte:

```
⏳ Station "David gegen Goliath" wartet auf Bestätigung
[✓ OK] [✕ Nein]
```

![bestätigung #2](./images/admin/bestätigung.png)

Das bedeutet: Das Team hat die Aufgabe erledigt und wartet auf eure Bestätigung.

### Bestätigung – Schritt für Schritt

1. **Überprüft die Lösung**
   - Der Betreuer vor Ort überprüft die Lösung des Teams
   - Ist die Lösung richtig?

2. **"✓ OK" drücken** (wenn richtig)
   - Klickt auf den grünen Button "✓ OK"
   - Die Station wird freigeschaltet
   - Das Team bekommt +50 XP
   - Die gelbe Box verschwindet
   - Die Karte wird grün

3. **"✕ Nein" drücken** (wenn falsch)
   - Klickt auf den roten Button "✕ Nein"
   - Die Station wird zurückgesetzt
   - Das Team bekommt keine Punkte
   - Das Team kann die Station nochmal versuchen
   - Die gelbe Box verschwindet

---

## 5️⃣ Codes-Tab – Station-Codes verwalten & ausdrucken

### Zugang zum Codes-Tab

1. **Oben im Admin-Bereich:** Klickt auf den Tab "📋 Codes"
2. **Alle Codes werden angezeigt**

![codes #1](./images/admin/codes_1.png)

### Codes für passive Stationen

Diese Codes können **ausgedruckt und bei den Stationen ausgelegt** oder **in den Stationen am Ende integriert** werden:

![codes #2](./images/admin/codes_2.png)

### Codes bearbeiten – Neue Codes vergeben

**Warum Codes ändern?**
- Ihr wollt schwierigere Codes verwenden
- Ihr wollt Codes personalisieren (z.B. mit Initialen)
- Ihr wollt Codes für mehrere Events unterschiedlich machen

**So ändert ihr einen Code:**

1. **Auf eine Code-Karte klicken**
   - Klickt auf die Karte einer passiven Station (z.B. "Holymoji")
   - Ein Modal-Fenster öffnet sich

2. **Neuen Code eingeben**
   - Das Eingabefeld zeigt den aktuellen Code
   - Löscht den alten Code
   - Gebt einen neuen 4-stelligen Code ein
   - Beispiel: `HM99` oder `HOPE`

3. **"✓ Speichern" drücken**
   - Klickt auf den grünen Button
   - Der Code wird in der Datenbank gespeichert
   - Eine Bestätigungsmeldung erscheint: "✅ Code gespeichert!"

4. **"✕ Abbrechen" drücken** (falls ihr es nicht speichern wollt)
   - Das Modal schließt sich
   - Der Code wird nicht geändert

### Codes für aktive Stationen

Diese Stationen haben **keinen Code** – ein Betreuer steht vor Ort:

- Fake or Fact
- David und Goliath
- Krüge von Kana
- Glaubenssprung
- Der Gute Hirte

![codes #3](./images/admin/codes_3.png)

### ⚠️ Wichtig bei Code-Änderungen

- **Codes müssen 4 Zeichen lang sein** (Buchstaben oder Zahlen)
- **Großbuchstaben verwenden** (z.B. `HM99` statt `hm99`)
- **Keine Leerzeichen oder Sonderzeichen**
- **Codes sollten eindeutig sein** (nicht zweimal der gleiche Code)
- **Codes ausdrucken:** Nach dem Ändern solltet ihr die neuen Codes ausdrucken und bei den Stationen auslegen
- **Teams sehen die neuen Codes sofort:** Wenn ein Team die Station besucht, sieht es den neuen Code

### Tipps für gute Codes

| Typ | Beispiel | Vorteil |
|-----|----------|---------|
| **Kurz & einfach** | `HM42` | Leicht zu merken |
| **Thematisch** | `HOPE` | Passt zum Thema |
| **Mit Zahlen** | `HM99` | Schwieriger zu erraten |
| **Personalisiert** | `TEAM` | Lustig und einprägsam |

---

## 6️⃣ Chat-Tab – Mit Teams kommunizieren

### Zugang zum Chat

1. **Oben im Admin-Bereich:** Klickt auf den Tab "💬 Chat"
2. **Liste aller Teams wird angezeigt**

![chat #1](./images/admin/chat_1.png)

### Mit einem Team chatten

1. **Team auswählen**
   - Klickt auf ein Team in der Liste
   - Die Chat-Nachrichten des Teams werden angezeigt

2. **Nachrichten lesen**
   - Ihr seht alle Nachrichten des Teams
   - Neue Nachrichten erscheinen automatisch

3. **Antwort schreiben**
   - Klickt in das Eingabefeld unten
   - Schreibt eure Antwort (max. 200 Zeichen)
   - Beispiel: "Schaut nochmal bei der Station nach!"

4. **"➤" drücken zum Senden**
   - Klickt auf den Pfeil-Button
   - Die Nachricht wird sofort gesendet
   - Das Team sieht die Antwort sofort

### Alle Nachrichten löschen

1. **Oben rechts:** Klickt auf "🗑 Alle löschen"
2. **Bestätigung erforderlich**
3. **Alle Chat-Nachrichten werden gelöscht**

![chat #2](./images/admin/chat_2.png)


**Wann nutzen?**
- Am Ende des Events
- Wenn der Chat zu voll wird
- Zur Datenschutz-Hygiene

---

## 9️⃣ Foto-Stationen moderieren – Bibelpose, Heilige Buchstabenjagd, Anchor of Hope

### Was sind Foto-Stationen?

Diese 3 Stationen funktionieren anders als normale aktive Stationen:

- **Teams laden Fotos hoch** (z.B. Standbild, Alphabet-Blatt, Armband)
- **Admins überprüfen die Fotos** im Admin-Dashboard
- **Admins bestätigen oder lehnen ab**
- **Teams bekommen einen Code** oder müssen es nochmal versuchen

**Punkte:** +50 XP pro Station  
**Anzahl:** 3 Stationen  
**Gesamtpunkte:** 150 XP

### Die 3 Foto-Stationen

| Station | Aufgabe | Was wird hochgeladen |
|---------|---------|---------------------|
| **🎭 Bibelpose** | Team stellt eine biblische Szene dar | Foto des Standbildes |
| **📜 Heilige Buchstabenjagd** | Team füllt Alphabet mit christlichen Wörtern | Foto des Alphabet-Blattes |
| **⚓ Anchor of Hope** | Team findet Anker und macht Foto | Foto des Armbands/der Botschaft |

### Admin-Bereich: Foto-Moderator

#### Zugang

1. **Admin-Dashboard öffnen**
2. **Oben auf den Tab "📋 Codes" klicken**
3. **Unter "Station Codes" seht ihr die 3 Foto-Stationen:**
   - 🎭 Bibelpose
   - 📜 Heilige Buchstabenjagd
   - ⚓ Anchor of Hope

#### Foto-Moderator öffnen

1. **Auf die Station klicken** (z.B. "🎭 Bibelpose")
2. **Der Moderator öffnet sich**
3. **Ihr seht alle eingereichten Fotos**

#### Fotos überprüfen

**Für jedes Foto seht ihr:**

```
Team: 🌊 Team C
Status: ⏳ Ausstehend
Foto: [Bild anzeigen]
Eingereicht: 14:32 Uhr

[✓ Bestätigen] [✕ Ablehnen]
```

- **Team-Name + Icon:** Welches Team das Foto eingereicht hat
- **Status:** Ausstehend / Bestätigt / Abgelehnt
- **Foto:** Das hochgeladene Bild (klickt zum Vergrößern)
- **Zeitstempel:** Wann das Foto eingereicht wurde

#### Foto bestätigen

**Wenn das Foto gut ist:**

1. **Foto anschauen**
   - Überprüft, ob die Aufgabe richtig gelöst wurde
   - Ist das Standbild erkennbar? Ist das Alphabet vollständig? Ist das Armband sichtbar?

2. **"✓ Bestätigen" drücken**
   - Klickt auf den grünen Button
   - Ein Modal öffnet sich

3. **Code eingeben**
   - Gebt einen 4-stelligen Code ein (z.B. `BP42`)
   - Dieser Code wird dem Team angezeigt
   - Das Team trägt den Code in der Hauptapp ein

4. **"✓ Speichern" drücken**
   - Der Code wird gespeichert
   - Das Team bekommt sofort den Code angezeigt
   - Das Foto wird grün markiert
   - Das Team bekommt +50 XP

#### Foto ablehnen

**Wenn das Foto nicht gut genug ist:**

1. **"✕ Ablehnen" drücken**
   - Klickt auf den roten Button
   - Das Foto wird rot markiert

2. **Team sieht Fehlermeldung**
   - Das Team sieht: "❌ Foto abgelehnt"
   - Das Team kann es nochmal versuchen
   - Das Team bekommt keine Punkte

3. **Team kann nochmal hochladen**
   - Das Team kann ein neues Foto hochladen
   - Der Prozess beginnt von vorne

#### Fotos löschen

**Wenn ihr alle bestätigten Fotos löschen wollt:**

1. **"🗑️ Alle löschen" Button** (oben rechts)
2. **Bestätigung erforderlich**
3. **Alle bestätigten Fotos werden gelöscht**
4. **Die Fotos werden auch vom Server gelöscht**

**Wann nutzen?**
- Am Ende des Events
- Zur Datenschutz-Hygiene
- Wenn der Speicher voll wird

### ⚠️ Wichtig bei Foto-Stationen

- **Fotos sind zeitlich begrenzt:** Teams können nur während des Events Fotos hochladen
- **Fotos werden nach dem Event gelöscht:** Alle Fotos werden automatisch nach 24 Stunden gelöscht
- **Social Media Nutzung:** Falls ein Team der Social Media Nutzung zugestimmt hat, könnt ihr die Fotos für Social Media verwenden
- **Codes sind eindeutig:** Jedes Foto bekommt einen eigenen Code
- **Teams sehen den Code sofort:** Nach der Bestätigung sieht das Team den Code auf der Seite

---

## 🔟 Wort des Glaubens – Gebärden-Rätsel moderieren

### Was ist Wort des Glaubens?

**Wort des Glaubens** ist eine spezielle passive Station mit Gebärden-Videos:

- **Teams schauen 5 Gebärden-Videos an**
- **Teams lösen 7 verdrehte Wörter (Anagramme)**
- **Mindestanforderung:** 2 Videos + 3 Wörter richtig
- **Teams klicken "Bestätigen"**
- **Wenn erfüllt:** Code wird angezeigt
- **Wenn nicht erfüllt:** Fehlermeldung, Team kann weitermachen

**Punkte:** +20 XP  
**Besonderheit:** Automatische Validierung (kein Admin nötig!)

### Wie funktioniert es?

1. **Team öffnet die Wort des Glaubens Seite**
   - Separate Webseite: `https://fyw.tncg.de/wort-des-glaubens`
   - Team meldet sich mit PIN an

2. **Team schaut Videos und löst Rätsel**
   - 5 Gebärden-Videos
   - 7 verdrehte Wörter
   - Eingabefelder für jedes Wort

3. **Team klickt "Bestätigen"**
   - Am Ende der Seite
   - Die App überprüft automatisch

4. **Validierung**
   - Wenn 2+ Videos + 3+ Wörter richtig: ✅ Code anzeigen
   - Wenn nicht erfüllt: ❌ Fehlermeldung, weitermachen

5. **Team trägt Code in Hauptapp ein**
   - Team geht zurück zur Hauptapp
   - Team trägt den Code bei der Station ein
   - Station wird freigeschaltet

### Admin-Aufgaben

**Admins müssen hier NICHTS tun!** 🎉

- ✅ Keine Fotos zu überprüfen
- ✅ Keine Codes zu vergeben
- ✅ Keine Bestätigungen nötig
- ✅ Alles läuft automatisch

**Einzige Admin-Aufgabe:**
- Falls ein Team Probleme hat, könnt ihr im Chat helfen
- Falls die Videos nicht laden, könnt ihr dem Team helfen, die Seite neu zu laden

### Lösungswörter (für Admins)

Falls ein Team fragt, welche Wörter richtig sind:

**5 Gebärden-Videos:**
1. GLAUBE
2. HOFFNUNG
3. LIEBE
4. FREUDE
5. FRIEDE

**7 Verdrehte Wörter:**
1. UABLEG → GLAUBE
2. NFNUGFHO → HOFFNUNG
3. EIBEL → LIEBE
4. UERFDE → FREUDE
5. EFDREI → FRIEDE
6. TGUO → GOTT
7. NAGES → SEGEN

**Mindestanforderung:** 2 Videos + 3 Wörter = 5 von 12 Items

---

## 7️⃣ Häufige Aufgaben

### Spiel starten

1. **Admin-Dashboard öffnen**
2. **"▶ Start" drücken**
3. **Timer läuft** (2 Stunden)
4. **Teams können spielen**

### Spiel pausieren

1. **"⏸ Pause" drücken**
2. **Timer stoppt**
3. **Teams können nicht mehr spielen**
4. **"▶ Start" drücken zum Weitermachen**

### Spiel neu starten

1. **"🔄 Reset" drücken**
2. **Timer wird auf 2:00:00 zurückgesetzt**
3. **"▶ Start" drücken zum Starten**

### Station bestätigen

1. **Gelbe Box sehen**
2. **Lösung überprüfen**
3. **"✓ OK" oder "✕ Nein" drücken**

### Mit Team chatten

1. **Chat-Tab öffnen**
2. **Team auswählen**
3. **Nachricht schreiben**
4. **"➤" drücken**

### Team löschen

1. **Control Board öffnen**
2. **Team expandieren**
3. **"Team löschen" drücken**
4. **Bestätigung erforderlich**

---

## 8️⃣ Häufige Probleme & Lösungen

| Problem | Ursache | Lösung |
|---------|--------|--------|
| Admin-Bereich lädt nicht | Verbindungsproblem | Browser neu laden (F5) |
| PIN funktioniert nicht | Falsche PIN | PIN überprüfen (Standard: `1234`) |
| Codes nicht sichtbar | Falscher Tab | Auf "📋 Codes" Tab klicken |
| Code-Änderung funktioniert nicht | Fehler beim Speichern | Seite neu laden und nochmal versuchen |
| Team gibt Code ein, aber "Falscher Code" Fehler | Code wurde geändert | Überprüfen, ob der neue Code korrekt eingegeben wurde |
| Chat-Nachrichten kommen nicht an | Verbindungsproblem | Seite neu laden |
| Timer läuft nicht | Timer nicht gestartet | "▶ Start" drücken |
| Gelbe Box verschwindet nicht | Bestätigung nicht registriert | Seite neu laden |
| Team wird nicht angezeigt | Team hat sich nicht angemeldet | Warten oder Team-Code überprüfen bei einem Admin |
| Spelling Bee Code funktioniert nicht | Code wurde geändert | Neuen Code im Codes-Tab überprüfen |

### Schnelle Hilfe

**Etwas funktioniert nicht?**

1. **Seite neu laden** (F5)
2. **Browser neu starten**
3. **Warten und nochmal versuchen**
4. **Backend neu starten** (falls nötig)

Wenn das nicht hilft, kontaktiert den technischen Support.

---

Viel Erfolg beim Event! 🌊⚓
