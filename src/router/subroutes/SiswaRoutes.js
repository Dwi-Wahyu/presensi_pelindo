const Router = require("express").Router

const {
  inputPengguna,
  daftarSiswa,
  editPengguna,
  updatePengguna,
  inputSiswaPage,
} = require("../../controllers/PenggunaController")

const siswaRoutes = Router()

siswaRoutes.get("/input", inputSiswaPage)

siswaRoutes.get("/daftar", (req, res) => {
  res.render("admin/siswa/daftar")
})

siswaRoutes.get("/edit/:id", editPengguna)

siswaRoutes.get("/daftar/data", daftarSiswa)

siswaRoutes.patch("/:id", updatePengguna)

siswaRoutes.post("/", inputPengguna)

module.exports = siswaRoutes
