require("dotenv").config()

const postgres = require("postgres")

const { PG_HOST, PG_USER, PG_NAME, PG_PASS, ENDPOINT_ID } = process.env

const sql = postgres({
  host: PG_HOST,
  user: PG_USER,
  database: PG_NAME,
  password: PG_PASS,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
})

async function main() {
  const result = await sql`select * from pkl`
  console.log(result)
}

main()
