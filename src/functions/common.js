const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function cek_kode_absen(kode) {
  const kode_unik = parseInt(kode)

  const adaPKL = await prisma.pkl.findFirst({
    where: {
      kode_unik,
    },
  })

  if (adaPKL) {
    return "pkl"
  }

  const adaMagang = await prisma.magang.findFirst({
    where: {
      kode_unik,
    },
  })

  if (adaMagang) {
    return "magang"
  }
}

module.exports = cek_kode_absen
