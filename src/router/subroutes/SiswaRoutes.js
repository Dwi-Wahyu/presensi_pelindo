const {
  inputSiswaPage,
  editSiswa,
  daftarSiswa,
  updateSiswa,
  inputSiswa,
} = require("../../controllers/SiswaController")

const Router = require("express").Router

const siswaRoutes = Router()

siswaRoutes.get("/input", inputSiswaPage)

siswaRoutes.get("/daftar", (req, res) => {
  res.render("admin/siswa/daftar")
})

siswaRoutes.get("/edit/:id", editSiswa)

siswaRoutes.get("/daftar/data", daftarSiswa)

siswaRoutes.patch("/:id", updateSiswa)

siswaRoutes.post("/", inputSiswa)

module.exports = siswaRoutes
