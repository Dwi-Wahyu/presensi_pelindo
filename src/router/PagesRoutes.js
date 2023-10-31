const Router = require("express").Router

const pagesRouter = Router()

pagesRouter.get("/login", (req, res) => {
  res.render("web/login-admin")
})

pagesRouter.get("/", (req, res) => {
  res.render("web/absen")
})

pagesRouter.get("/wrong-code", (req, res) => {
  res.render("web/error_page/wrong_code")
})

pagesRouter.get("/enable-location", (req, res) => {
  res.render("web/error_page/enable_location")
})

pagesRouter.get("/location-far", (req, res) => {
  res.render("web/error_page/location_far")
})

pagesRouter.get("/already-attended", (req, res) => {
  res.render("web/error_page/already-attended")
})

pagesRouter.get("/location", (req, res) => {
  res.render("web/location")
})

pagesRouter.get("/success", (req, res) => {
  res.render("web/success-page")
})

pagesRouter.get("/izin", (req, res) => {
  res.render("web/izin")
})

pagesRouter.post("/login", (req, res) => {
  const { username, password } = req.body

  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env

  if (username != ADMIN_USERNAME && password != ADMIN_PASSWORD) {
    res.status(401).json({ error: "Username dan password salah" })
  }

  if (username == ADMIN_USERNAME && password != ADMIN_PASSWORD) {
    res.status(401).json({ error: "Password salah" })
  }

  if (username != ADMIN_USERNAME && password == ADMIN_PASSWORD) {
    res.status(401).json({ error: "Username salah" })
  }

  if (username == ADMIN_USERNAME && password == ADMIN_PASSWORD) {
    req.session.isAuthenticated = true
    req.session.save((err) => {
      if (err) throw err

      res.status(200).end()
    })
  }
})

pagesRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err

    res.redirect = "/login"
  })
})

module.exports = pagesRouter
