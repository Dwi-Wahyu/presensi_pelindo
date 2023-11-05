const Router = require("express").Router

const {
  daftarMahasiswa,
  editPengguna,
  updatePengguna,
  inputPengguna,
  inputMahasiswaPage,
} = require("../../controllers/PenggunaController")

const MahasiswaRoutes = Router()

MahasiswaRoutes.get("/input", inputMahasiswaPage)

MahasiswaRoutes.get("/daftar", (req, res) => {
  res.render("admin/mahasiswa/daftar")
})

MahasiswaRoutes.get("/daftar/data", daftarMahasiswa)

MahasiswaRoutes.get("/edit/:id", editPengguna)

MahasiswaRoutes.patch("/:id", updatePengguna)

MahasiswaRoutes.post("/", inputPengguna)

module.exports = MahasiswaRoutes
