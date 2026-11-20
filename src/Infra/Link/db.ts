const { Pool } = require('pg');

export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'your_password',
  database: 'my_app_db',
  // --- Pooling-specific configuration ---
  max: 20,                     // Maximum number of clients in the pool
  min: 4,                      // Minimum number of clients kept alive
  idleTimeoutMillis: 30000,    // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000 // Error if a connection can't be acquired in 5s
});