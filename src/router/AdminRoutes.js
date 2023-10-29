const siswaRoutes = require("./subroutes/SiswaRoutes")
const mahasiswaRoutes = require("./subroutes/MahasiswaRoutes")
const rekapitulasiRoutes = require("./subroutes/RekapitulasiRoutes")
const settingsRoutes = require("./subroutes/SettingsRoutes")

const Router = require("express").Router

const adminRoutes = Router()

adminRoutes.get("/", (req, res) => {
  res.render("admin/dashboard")
})

adminRoutes.use("/siswa", siswaRoutes)

adminRoutes.use("/mahasiswa", mahasiswaRoutes)

adminRoutes.use("/rekapitulasi", rekapitulasiRoutes)

adminRoutes.use("/settings", settingsRoutes)

module.exports = adminRoutes
