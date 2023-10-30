const express = require("express")
const cors = require("cors")
const session = require("express-session")
const connectPgSimple = require("connect-pg-simple")
const bodyParser = require("body-parser")
const path = require("path")
const { log } = require("console")
const { dbConnect, pool } = require("./utils/database")

const routes = require("./router/routes")

const port = process.env.PORT || 3000

const pgStore = connectPgSimple(session)

const app = express()

dbConnect()

setInterval(async () => {
  const version = await pool.query("SELECT VERSION()")

  log(version.rows)
}, 240000)

// Static file configuration
app.use("/src", express.static("src"))
app.use("/public", express.static(path.join(process.cwd(), "public")))

// Middlewares
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(cors())
app.use(
  session({
    store: new pgStore({
      pool,
      tableName: "sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  })
)

// Routes
app.use(routes)

app.listen(port, () => {
  log("http://localhost:" + port)
})
