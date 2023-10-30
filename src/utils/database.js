require("dotenv").config()

const { log } = require("console")
const { Pool } = require("pg")

const { DATABASE_URL } = process.env

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    require: true,
  },
})

function dbConnect() {
  const empat_menit = 240000

  pool.connect((err) => {
    if (err) throw err

    log("Terhubung ke database")
  })
}

module.exports = { pool, dbConnect }
