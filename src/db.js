const { Pool } = require("pg");

const pgPool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

function convertPlaceholders(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

const pool = {
  query: async (sql, params = []) => {
    const pgSql = convertPlaceholders(sql);
    const result = await pgPool.query(pgSql, params);
    return [result.rows, result.fields];
  }
};

const connect = async () => {
  try {
    const client = await pgPool.connect();
    console.log("✅ Product Service DB connected");
    client.release();
  } catch (err) {
    console.error("❌ Product Service DB connection failed:", err.message);
  }
};

module.exports = { pool, connect };
