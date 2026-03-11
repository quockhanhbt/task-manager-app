import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const isLocal = process.env.DATABASE_URL?.includes('localhost') ||
                process.env.DATABASE_URL?.includes('127.0.0.1');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
  process.exit(-1);
});

export default pool;
