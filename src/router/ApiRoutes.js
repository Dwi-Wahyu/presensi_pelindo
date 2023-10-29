const presensi = require("../controllers/ApiController")

const Router = require("express").Router

const apiRoutes = Router()

apiRoutes.post("/absen", presensi)

module.exports = apiRoutes
