const Router = require("express").Router

const {
  inputMahasiswa,
  daftarMahasiswa,
  inputMahasiswaPage,
  editMahasiswa,
  updateMahasiswa,
} = require("../../controllers/MahasiswaController")

const MahasiswaRoutes = Router()

MahasiswaRoutes.get("/input", inputMahasiswaPage)

MahasiswaRoutes.get("/daftar", (req, res) => {
  res.render("admin/mahasiswa/daftar")
})

MahasiswaRoutes.get("/daftar/data", daftarMahasiswa)

MahasiswaRoutes.get("/edit/:id", editMahasiswa)

MahasiswaRoutes.patch("/:id", updateMahasiswa)

MahasiswaRoutes.post("/", inputMahasiswa)

module.exports = MahasiswaRoutes
