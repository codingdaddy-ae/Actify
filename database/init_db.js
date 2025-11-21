/*
  Database initializer: creates DB if missing, runs schema + seed.
  Usage: node database/init_db.js
*/
require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_NAME = process.env.DB_NAME || 'actify_db';

async function ensureDatabaseExists() {
  const adminClient = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres',
  });
  await adminClient.connect();
  try {
    const res = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
    if (res.rowCount === 0) {
      console.log(`Creating database ${DB_NAME}...`);
      await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
    } else {
      console.log(`Database ${DB_NAME} already exists.`);
    }
  } finally {
    await adminClient.end();
  }
}

async function runSqlFile(client, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`Running ${path.basename(filePath)}...`);
  await client.query(sql);
}

async function main() {
  try {
    await ensureDatabaseExists();

    const client = new Client({
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
    });
    await client.connect();

    try {
      // Ensure uuid-ossp extension is available
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

      const schemaPath = path.join(__dirname, '02_create_tables.sql');
      const seedPath = path.join(__dirname, '03_seed_data.sql');
      await runSqlFile(client, schemaPath);
      await runSqlFile(client, seedPath);

      console.log('Database initialized successfully.');
    } finally {
      await client.end();
    }
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
// End of file – single initializer flow above.
