const siswaRoutes = require("./subroutes/SiswaRoutes")
const mahasiswaRoutes = require("./subroutes/MahasiswaRoutes")
const rekapitulasiRoutes = require("./subroutes/RekapitulasiRoutes")
const settingsRoutes = require("./subroutes/SettingsRoutes")
const {
  getJumlahSiswa,
  getJumlahMahasiswa,
  getJumlahIzin,
} = require("../controllers/DashboardController")

const Router = require("express").Router

const adminRoutes = Router()

adminRoutes.get("/", async (req, res) => {
  const jumlahSiswa = await getJumlahSiswa()
  const jumlahMahasiswa = await getJumlahMahasiswa()
  const jumlahIzin = await getJumlahIzin()

  res.render("admin/dashboard", { jumlahSiswa, jumlahMahasiswa, jumlahIzin })
})

adminRoutes.use("/siswa", siswaRoutes)

adminRoutes.use("/mahasiswa", mahasiswaRoutes)

adminRoutes.use("/rekapitulasi", rekapitulasiRoutes)

adminRoutes.use("/settings", settingsRoutes)

module.exports = adminRoutes
