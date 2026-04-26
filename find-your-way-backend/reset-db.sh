#!/bin/bash

# Reset database script
# This removes the old database and lets the app recreate it

echo "🗑️  Removing old database..."
rm -f /app/data/game.db
rm -f /app/data/game.db-shm
rm -f /app/data/game.db-wal

echo "✅ Database reset complete!"
echo "The app will recreate the database on next start."
