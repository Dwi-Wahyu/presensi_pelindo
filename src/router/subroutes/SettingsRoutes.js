const {
  inputSekolah,
  daftarSekolah,
  updateAsal,
  hapusAsal,
  daftarKampus,
  inputKampus,
} = require("../../controllers/AsalController")

const Router = require("express").Router

const settingsRoutes = Router()

settingsRoutes.get("/sekolah", (req, res) => {
  res.render("admin/settings/sekolah")
})

settingsRoutes.get("/sekolah/data", daftarSekolah)

settingsRoutes.get("/kampus", (req, res) => {
  res.render("admin/settings/kampus")
})

settingsRoutes.get("/kampus/data", daftarKampus)

settingsRoutes.post("/sekolah", inputSekolah)

settingsRoutes.patch("/sekolah", updateAsal)

settingsRoutes.post("/kampus", inputKampus)

settingsRoutes.patch("/kampus", updateAsal)

settingsRoutes.delete("/sekolah", hapusAsal)

settingsRoutes.delete("/kampus", hapusAsal)

module.exports = settingsRoutes
