# Find Your Way - Deployment & Operations

## 🚀 Schnellstart

### Voraussetzungen
- Docker & Docker Compose installiert
- Git installiert
- Raspberry Pi oder Linux-Server (optional)

### Installation

```bash
# Repository klonen
git clone https://github.com/your-repo/find-your-way.git
cd find-your-way

# Docker Compose starten
docker compose up --build -d

# Logs überprüfen
docker compose logs -f
```

**Fertig!** App läuft auf:
- Frontend: http://localhost
- Backend: http://localhost:3001
- Admin: http://localhost/admin

---

## 🔧 Konfiguration

### docker-compose.yml

```yaml
services:
  backend:
    build: ./find-your-way-backend
    container_name: fyw-backend
    ports:
      - "3001:3001"
    volumes:
      - fyw-data:/app/data
    environment:
      PORT: 3001
      ADMIN_PIN: "1234"              # ⚠️ ÄNDERN!
    restart: unless-stopped

  frontend:
    build:
      context: ./find-your-way
      args:
        VITE_API_URL: https://fyw.tncg.de    # ⚠️ ÄNDERN!
        VITE_WS_URL: wss://fyw.tncg.de       # ⚠️ ÄNDERN!
    container_name: fyw-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  fyw-data:
```

### Wichtige Einstellungen

| Variable | Beschreibung | Beispiel |
|----------|-------------|---------|
| `ADMIN_PIN` | Admin-Login PIN | "1234" |
| `VITE_API_URL` | Backend API URL | "https://fyw.tncg.de" |
| `VITE_WS_URL` | WebSocket URL | "wss://fyw.tncg.de" |
| `PORT` | Backend Port | "3001" |

---

## 🌐 Traefik Integration (Reverse Proxy)

Für HTTPS mit Let's Encrypt:

```yaml
# docker-compose.yml
services:
  backend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.fyw-backend.rule=Host(`fyw.tncg.de`) && PathPrefix(`/api`)"
      - "traefik.http.routers.fyw-backend.entrypoints=websecure"
      - "traefik.http.routers.fyw-backend.tls.certresolver=homelab-le-resolver"
      - "traefik.http.services.fyw-backend.loadbalancer.server.port=3001"

  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.fyw-frontend.rule=Host(`fyw.tncg.de`)"
      - "traefik.http.routers.fyw-frontend.entrypoints=websecure"
      - "traefik.http.routers.fyw-frontend.tls.certresolver=homelab-le-resolver"
      - "traefik.http.services.fyw-frontend.loadbalancer.server.port=80"
```

---

## 📝 Häufige Aufgaben

### Admin-PIN ändern

```bash
# 1. docker-compose.yml bearbeiten
nano docker-compose.yml

# 2. ADMIN_PIN ändern
ADMIN_PIN: "5678"

# 3. Backend neu starten
docker compose up --build -d fyw-backend
```

### Datenbank zurücksetzen

```bash
# ⚠️ WARNUNG: Löscht alle Teams, Stationen, Nachrichten!

docker compose down
docker volume rm fyw-data
docker compose up --build -d
```

### Logs anschauen

```bash
# Alle Logs
docker compose logs -f

# Nur Backend
docker compose logs fyw-backend -f

# Nur Frontend
docker compose logs fyw-frontend -f

# Letzte 50 Zeilen
docker compose logs --tail 50
```

### Container neu starten

```bash
# Alle
docker compose restart

# Nur Backend
docker compose restart fyw-backend

# Nur Frontend
docker compose restart fyw-frontend
```

### Datenbank inspizieren

```bash
# SQLite CLI öffnen
docker exec -it fyw-backend sqlite3 /app/data/game.db

# Beispiel-Queries
sqlite> SELECT * FROM teams;
sqlite> SELECT * FROM completions;
sqlite> SELECT * FROM messages;
sqlite> .quit
```

### Backup erstellen

```bash
# Datenbank-Datei kopieren
docker cp fyw-backend:/app/data/game.db ./backup-$(date +%Y%m%d-%H%M%S).db

# Alle Daten (Docker Volume)
docker run --rm -v fyw-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/fyw-backup-$(date +%Y%m%d-%H%M%S).tar.gz /data
```

### Backup wiederherstellen

```bash
# Datenbank-Datei
docker cp ./backup-game.db fyw-backend:/app/data/game.db
docker compose restart fyw-backend

# Oder: Komplettes Volume
docker volume rm fyw-data
docker run --rm -v fyw-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/fyw-backup-*.tar.gz -C /
docker compose restart
```

---

## 🔍 Troubleshooting

### Problem: "Unexpected token '<'. <!DOCTYPE ... is not valid JSON"

**Ursache**: Backend gibt HTML-Fehler statt JSON zurück

**Lösung**:
```bash
# 1. Backend-Logs überprüfen
docker compose logs fyw-backend

# 2. Datenbank-Migration überprüfen
docker exec fyw-backend sqlite3 /app/data/game.db ".schema messages"

# 3. Backend neu bauen
docker compose up --build -d fyw-backend
```

### Problem: "Connection refused" auf Port 3001

**Ursache**: Backend läuft nicht

**Lösung**:
```bash
# 1. Container-Status überprüfen
docker compose ps

# 2. Logs anschauen
docker compose logs fyw-backend

# 3. Container neu starten
docker compose restart fyw-backend
```

### Problem: "WebSocket connection failed"

**Ursache**: WebSocket-URL falsch oder Firewall blockiert

**Lösung**:
```bash
# 1. VITE_WS_URL überprüfen
docker compose logs fyw-frontend | grep VITE_WS_URL

# 2. Firewall-Ports öffnen
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3001/tcp

# 3. Frontend neu bauen
docker compose up --build -d fyw-frontend
```

### Problem: "Team not found" beim Login

**Ursache**: PIN falsch oder Team gelöscht

**Lösung**:
```bash
# 1. Teams in DB überprüfen
docker exec fyw-backend sqlite3 /app/data/game.db "SELECT id, name, pin FROM teams;"

# 2. PIN korrekt eingeben (Großbuchstaben!)
# 3. Neues Team erstellen
```

---

## 📊 Monitoring

### Container-Ressourcen

```bash
# Live-Übersicht
docker stats

# Spezifisch
docker stats fyw-backend fyw-frontend
```

### Disk-Nutzung

```bash
# Docker-Volumes
docker system df

# Datenbank-Größe
docker exec fyw-backend du -sh /app/data/game.db
```

### Netzwerk-Verbindungen

```bash
# Offene Ports
docker exec fyw-backend netstat -tlnp

# Verbindungen
docker exec fyw-backend ss -tlnp
```

---

## 🔐 Sicherheit

### Best Practices

1. **Admin-PIN**: Starker PIN (nicht "1234")
   ```bash
   ADMIN_PIN: "$(openssl rand -hex 4)"  # z.B. "a7f3c2e1"
   ```

2. **HTTPS**: Immer mit Traefik/Let's Encrypt
   ```
   ✅ https://fyw.tncg.de
   ❌ http://fyw.tncg.de
   ```

3. **Firewall**: Nur notwendige Ports öffnen
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw deny 3001/tcp  # Backend nicht direkt erreichbar
   ```

4. **Updates**: Regelmäßig Dependencies aktualisieren
   ```bash
   docker compose pull
   docker compose up --build -d
   ```

---

## 📈 Skalierung

### Mehrere Instanzen

```yaml
# docker-compose.yml
services:
  backend-1:
    build: ./find-your-way-backend
    environment:
      PORT: 3001
  
  backend-2:
    build: ./find-your-way-backend
    environment:
      PORT: 3002
  
  nginx:
    image: nginx:latest
    ports:
      - "3001:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
```

### Load Balancing

```nginx
# nginx-lb.conf
upstream backend {
  server backend-1:3001;
  server backend-2:3002;
}

server {
  listen 80;
  location / {
    proxy_pass http://backend;
  }
}
```

---

## 🔄 Updates & Maintenance

### Code-Update

```bash
# 1. Repository aktualisieren
git pull origin main

# 2. Neu bauen und starten
docker compose up --build -d

# 3. Logs überprüfen
docker compose logs -f
```

### Datenbank-Cleanup

```bash
# Alte Nachrichten löschen (älter als 30 Tage)
docker exec fyw-backend sqlite3 /app/data/game.db \
  "DELETE FROM messages WHERE sent_at < $(date -d '30 days ago' +%s)000;"

# Abgelehnte Stationen löschen
docker exec fyw-backend sqlite3 /app/data/game.db \
  "DELETE FROM completions WHERE status = 'rejected';"
```

### Datenbank-Optimierung

```bash
# VACUUM: Datenbank-Datei verkleinern
docker exec fyw-backend sqlite3 /app/data/game.db "VACUUM;"

# ANALYZE: Query-Optimizer trainieren
docker exec fyw-backend sqlite3 /app/data/game.db "ANALYZE;"
```

---

## 📞 Support

### Logs sammeln für Support

```bash
# Alle Logs exportieren
docker compose logs > logs-$(date +%Y%m%d-%H%M%S).txt

# Datenbank-Schema exportieren
docker exec fyw-backend sqlite3 /app/data/game.db ".schema" > schema.sql

# System-Info
docker version > system-info.txt
docker compose version >> system-info.txt
```

### Häufige Fragen

**F: Wie viele Teams können gleichzeitig spielen?**
A: Theoretisch unbegrenzt. Praktisch getestet bis 100 Teams ohne Probleme.

**F: Wie lange dauert ein Spiel?**
A: Standard 2 Stunden (konfigurierbar in `stations.js`).

**F: Können Teams ihre Daten exportieren?**
A: Ja, über die Admin-API (noch nicht implementiert).

**F: Ist die App DSGVO-konform?**
A: Ja, es werden keine persönlichen Daten gespeichert.

---

## 🎯 Checkliste für Production

- [ ] Admin-PIN geändert
- [ ] HTTPS/SSL konfiguriert
- [ ] Firewall konfiguriert
- [ ] Backup-Strategie implementiert
- [ ] Monitoring eingerichtet
- [ ] Logs konfiguriert
- [ ] Updates geplant
- [ ] Disaster-Recovery Plan erstellt
