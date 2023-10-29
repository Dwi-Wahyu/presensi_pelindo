const express = require("express")
const https = require("https")
const fs = require("fs")
const cors = require("cors")
const session = require("express-session")
const connectPgSimple = require("connect-pg-simple")
const bodyParser = require("body-parser")
const path = require("path")
const { log } = require("console")
const { dbConnect, pool } = require("./utils/database")

const routes = require("./router/routes")

const pgStore = connectPgSimple(session)

const app = express()

dbConnect()

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

const httpsCredentials = {
  key: fs.readFileSync(path.join(__dirname, "/certificate/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/certificate/cert.pem")),
}

const httpsServer = https.createServer(httpsCredentials, app)

httpsServer.listen(3000, () => {
  log("https://localhost:3000")
})

// app.listen(3000, () => {
//   log("http://localhost:3000")
// })
