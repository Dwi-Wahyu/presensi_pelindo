const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
})

async function getPostgresVersion() {
  const client = await pool.connect()
  try {
    const response = await client.query("SELECT * FROM sekolah")
    console.log(response.rows)
  } finally {
    client.release()
  }
}

getPostgresVersion()
