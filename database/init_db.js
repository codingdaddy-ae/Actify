#!/usr/bin/env node
/**
 * database/init_db.js
 *
 * Node script to initialize the Actify PostgreSQL database.
 * - Creates `actify_db` if it doesn't exist
 * - Runs `02_create_tables.sql` and `03_seed_data.sql`
 *
 * Usage:
 * 1) Install dependencies: `npm install pg dotenv`
 * 2) Create a `.env` file in the `database/` folder (or set env vars):
 *    PGHOST=localhost
 *    PGPORT=5432
 *    PGUSER=postgres
 *    PGPASSWORD=your_password
 *    DB_NAME=actify_db
 *
 * 3) Run: `node init_db.js` (from `database/` folder)
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const HOST = process.env.PGHOST || 'localhost';
const PORT = process.env.PGPORT ? Number(process.env.PGPORT) : 5432;
const USER = process.env.PGUSER || 'postgres';
const PASSWORD = process.env.PGPASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'actify_db';

function validateDbName(name){
  // simple validation: allow letters, numbers, dash, underscore
  return /^[A-Za-z0-9_-]+$/.test(name);
}

async function runSqlFile(client, filePath){
  const sql = fs.readFileSync(filePath, 'utf8');
  if(!sql || sql.trim().length === 0) return;
  console.log(`Executing SQL file: ${path.basename(filePath)}...`);
  try{
    await client.query(sql);
    console.log(`Finished: ${path.basename(filePath)}`);
  }catch(err){
    console.error(`Error executing ${path.basename(filePath)}:`);
    throw err;
  }
}

async function main(){
  if(!validateDbName(DB_NAME)){
    console.error('Invalid DB name. Use only letters, numbers, dashes and underscores.');
    process.exit(1);
  }

  const adminConfig = {
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: process.env.PGDATABASE || 'postgres'
  };

  const adminClient = new Client(adminConfig);
  try{
    console.log('Connecting to Postgres as admin...');
    await adminClient.connect();

    const check = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
    if(check.rowCount === 0){
      console.log(`Database '${DB_NAME}' does not exist — creating...`);
      // create database (must not be parameterized for name in CREATE DATABASE; ensure validated)
      await adminClient.query(`CREATE DATABASE "${DB_NAME}" OWNER "${USER}" ENCODING 'UTF8'`);
      console.log(`Database '${DB_NAME}' created.`);
    }else{
      console.log(`Database '${DB_NAME}' already exists.`);
    }
  }catch(err){
    console.error('Error while creating/checking database:', err.message || err);
    await adminClient.end().catch(()=>{});
    process.exit(1);
  }

  await adminClient.end();

  const dbClient = new Client({ host: HOST, port: PORT, user: USER, password: PASSWORD, database: DB_NAME });
  try{
    console.log(`Connecting to database '${DB_NAME}'...`);
    await dbClient.connect();

    // Paths to SQL files
    const base = __dirname;
    const tablesFile = path.join(base, '02_create_tables.sql');
    const seedFile = path.join(base, '03_seed_data.sql');

    if(!fs.existsSync(tablesFile)) throw new Error('Missing file: 02_create_tables.sql');
    if(!fs.existsSync(seedFile)) throw new Error('Missing file: 03_seed_data.sql');

    // Run schema then seed
    await runSqlFile(dbClient, tablesFile);
    await runSqlFile(dbClient, seedFile);

    console.log('\nDatabase initialization complete!');
  }catch(err){
    console.error('Error during DB initialization:', err.message || err);
    process.exitCode = 1;
  }finally{
    await dbClient.end().catch(()=>{});
  }
}

main();
