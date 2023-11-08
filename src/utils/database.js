require("dotenv").config()

const { Pool } = require("pg")

const { supabasePoolURL } = process.env

const pool = new Pool({
  connectionString: supabasePoolURL,
})

module.exports = { pool }
