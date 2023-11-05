require("dotenv").config()

const { log } = require("console")
const { Pool } = require("pg")

const { DATABASE_URL } = process.env

const pool = new Pool({
  connectionString: DATABASE_URL,
})

function dbConnect() {
  pool.connect((err) => {
    if (err) throw err
  })
}

module.exports = { pool, dbConnect }
