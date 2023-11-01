const Router = require("express").Router

const {
  rekapitulasiPKL,
  rekapitulasiMagang,
  editRekapPKL,
  updateRekapPKL,
  cetakRekapitulasiPKL,
  editRekapMagang,
  updateRekapMagang,
  cetakRekapitulasiMagang,
  daftarIzin,
  approveIzin,
  tolakIzin,
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

rekapitulasiRoutes.get("/pkl/edit/:id", editRekapPKL)

rekapitulasiRoutes.get("/magang/edit/:id", editRekapMagang)

rekapitulasiRoutes.get("/pkl/cetak/:id", cetakRekapitulasiPKL)

rekapitulasiRoutes.get("/magang/cetak/:id", cetakRekapitulasiMagang)

rekapitulasiRoutes.get("/izin", (req, res) => {
  res.render("admin/rekapitulasi/izin")
})

rekapitulasiRoutes.get("/izin/data", daftarIzin)

rekapitulasiRoutes.post("/izin/approve", approveIzin)

rekapitulasiRoutes.post("/izin/tolak", tolakIzin)

rekapitulasiRoutes.patch("/pkl/update/:id", updateRekapPKL)

rekapitulasiRoutes.patch("/magang/update/:id", updateRekapMagang)

module.exports = rekapitulasiRoutes
