const Router = require("express").Router

const {
  rekapitulasiPKL,
  rekapitulasiMagang,
  cetakRekapitulasiMagang,
  daftarIzin,
  approveIzin,
  tolakIzin,
  editRekapitulasi,
  updateRekapitulasi,
  cetakRekapitulasi,
} = require("../../controllers/RekapitulasiController")

const rekapitulasiRoutes = Router()

rekapitulasiRoutes.get("/pkl", (req, res) => {
  res.render("admin/rekapitulasi/siswa/daftar")
})

rekapitulasiRoutes.get("/magang", (req, res) => {
  res.render("admin/rekapitulasi/mahasiswa/daftar")
})

rekapitulasiRoutes.get("/pkl/data", rekapitulasiPKL)

rekapitulasiRoutes.get("/magang/data", rekapitulasiMagang)

rekapitulasiRoutes.get("/pkl/edit/:id", editRekapitulasi)

rekapitulasiRoutes.get("/magang/edit/:id", editRekapitulasi)

rekapitulasiRoutes.get("/pkl/cetak/:id", cetakRekapitulasi)

rekapitulasiRoutes.get("/magang/cetak/:id", cetakRekapitulasi)

rekapitulasiRoutes.get("/izin", (req, res) => {
  res.render("admin/rekapitulasi/izin")
})

rekapitulasiRoutes.get("/izin/data", daftarIzin)

rekapitulasiRoutes.post("/izin/approve", approveIzin)

rekapitulasiRoutes.post("/izin/tolak", tolakIzin)

rekapitulasiRoutes.patch("/pkl/update/:id", updateRekapitulasi)

rekapitulasiRoutes.patch("/magang/update/:id", updateRekapitulasi)

module.exports = rekapitulasiRoutes
