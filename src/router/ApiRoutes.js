const { presensi, izin } = require("../controllers/ApiController")

const Router = require("express").Router

const apiRoutes = Router()

apiRoutes.post("/absen", presensi)

apiRoutes.post("/izin", izin)

module.exports = apiRoutes
