const {
  daftarKampus,
  editKampus,
  hapusKampus,
  inputKampus,
} = require("../../controllers/KampusController")

const {
  daftarSekolah,
  editSekolah,
  hapusSekolah,
  inputSekolah,
} = require("../../controllers/SekolahController")

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

settingsRoutes.patch("/sekolah", editSekolah)

settingsRoutes.post("/kampus", inputKampus)

settingsRoutes.patch("/kampus", editKampus)

settingsRoutes.delete("/sekolah", hapusSekolah)

settingsRoutes.delete("/kampus", hapusKampus)

module.exports = settingsRoutes
