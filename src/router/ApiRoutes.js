const { presensi, izin, login } = require("../controllers/ApiController")

const Router = require("express").Router

const apiRoutes = Router()

apiRoutes.post("/login", login)

apiRoutes.post("/absen", presensi)

apiRoutes.post("/izin", izin)

module.exports = apiRoutes
