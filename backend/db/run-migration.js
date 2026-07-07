const fs = require('fs');
const path = require('path');
require('dotenv').config();
const pool = require('./pool');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node run-migration.js <path-to-sql-file>');
  process.exit(1);
}

const sql = fs.readFileSync(path.resolve(file), 'utf8');

pool.query(sql)
  .then(() => {
    console.log(`Migration applied: ${file}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:');
    console.error(err);
    process.exit(1);
  });
