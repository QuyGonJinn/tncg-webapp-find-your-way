const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'game.db');
const db = new Database(DB_PATH);

console.log('🧹 Cleaning up all submissions...\n');

// Get all submissions
const bibelpose = db.prepare('SELECT * FROM bibelpose_submissions').all();
const heilige = db.prepare('SELECT * FROM heilige_buchstabenjagd_submissions').all();

console.log(`📊 Found ${bibelpose.length} Bibelpose submissions`);
console.log(`📊 Found ${heilige.length} Heilige Buchstabenjagd submissions\n`);

let deletedPhotos = 0;

// Delete Bibelpose photos
console.log('🗑️ Deleting Bibelpose photos...');
bibelpose.forEach(submission => {
  const photoPath = path.join(__dirname, submission.photo_path);
  if (fs.existsSync(photoPath)) {
    fs.unlinkSync(photoPath);
    deletedPhotos++;
    console.log(`  ✓ Deleted: ${submission.photo_path}`);
  }
});

// Delete Heilige Buchstabenjagd photos
console.log('\n🗑️ Deleting Heilige Buchstabenjagd photos...');
heilige.forEach(submission => {
  const photoPath = path.join(__dirname, submission.photo_path);
  if (fs.existsSync(photoPath)) {
    fs.unlinkSync(photoPath);
    deletedPhotos++;
    console.log(`  ✓ Deleted: ${submission.photo_path}`);
  }
});

// Delete all submissions from database
console.log('\n🗑️ Deleting submissions from database...');
db.prepare('DELETE FROM bibelpose_submissions').run();
db.prepare('DELETE FROM heilige_buchstabenjagd_submissions').run();

console.log('\n✅ Cleanup complete!');
console.log(`   - Deleted ${deletedPhotos} photos`);
console.log(`   - Deleted ${bibelpose.length} Bibelpose submissions`);
console.log(`   - Deleted ${heilige.length} Heilige Buchstabenjagd submissions`);

db.close();
