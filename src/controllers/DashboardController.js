const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const DashboardController = {}

DashboardController.getJumlahSiswa = async (req, res) => {
  const jumlahSiswa = await prisma.pengguna.count({
    where: {
      status: "pkl",
    },
  })

  return jumlahSiswa
}

DashboardController.getJumlahMahasiswa = async (req, res) => {
  const jumlahMahasiswa = await prisma.pengguna.count({
    where: {
      status: "magang",
    },
  })

  return jumlahMahasiswa
}

DashboardController.getJumlahIzin = async (req, res) => {
  const jumlahIzin = await prisma.perizinan.count({
    where: {
      status: "Belum approve",
    },
  })

  return jumlahIzin
}

module.exports = DashboardController
