const { PrismaClient } = require("@prisma/client")
const moment = require("moment")
const prisma = new PrismaClient()

async function presensi(req, res) {
  var code = req.body.code

  const kode_unik = parseInt(code)

  const pkl = await prisma.pkl.findFirst({
    where: {
      kode_unik,
    },
  })

  // Jika terdapat siswa pkl dengan kode unik tersebut
  if (pkl) {
    pklHandler(pkl, req, res)
  }

  const magang = await prisma.magang.findFirst({
    where: {
      kode_unik,
    },
  })

  // Jika terdapat mahasiswa magang dengan kode unik tersebut
  if (magang) {
    magangHandler(magang, req, res)
  }

  // Jika tidak ada siswa pkl dan mahasiswa magang dengan kode unik tersebut
  if (!pkl && !magang) {
    res.status(401).json({ message: "Wrong Personal Code" })
  }
}

// Function Handler untuk presensi pkl
async function pklHandler(pkl, req, res) {
  let { nama: nama_siswa } = pkl

  const waktu = moment().format("HH:mm")
  const tanggal = moment().format("YYYY-MM-DD")

  const presensi_pkl = await prisma.presensi_pkl.findFirst({
    where: {
      nama_siswa,
      tanggal,
    },
  })

  // Jika belum terdapat presensi hari ini dengan nama siswa tersebut
  if (!presensi_pkl) {
    await prisma.presensi_pkl.create({
      data: {
        nama_siswa,
        waktu_datang: waktu,
        waktu_pulang: "-",
        tanggal,
        status: "Tidak hadir",
      },
    })

    res.status(200).json({ message: "Success input attendance" })
  }

  // Jika sudah terdapat presensi dan status tidak hadir
  if (presensi_pkl && presensi_pkl.status == "Tidak hadir") {
    let { id } = presensi_pkl

    await prisma.presensi_pkl.update({
      where: {
        id,
      },
      data: {
        waktu_pulang: waktu,
        status: "Hadir",
      },
    })

    res.status(200).json({ message: "Success input attendance" })
  }

  // Jika sudah terdapat presensi dan status telah hadir
  if (presensi_pkl && presensi_pkl.status == "Hadir") {
    res.status(401).json({ message: "You have been attend two times today" })
  }
}

async function magangHandler(magang, req, res) {
  let { nama: nama_mahasiswa } = magang

  const waktu = moment().format("HH:mm")
  const tanggal = moment().format("YYYY-MM-DD")

  const presensi_magang = await prisma.presensi_magang.findFirst({
    where: {
      nama_mahasiswa,
      tanggal,
    },
  })

  // Jika belum terdapat presensi hari ini dengan nama siswa tersebut
  if (!presensi_magang) {
    await prisma.presensi_magang.create({
      data: {
        nama_mahasiswa,
        waktu_datang: waktu,
        waktu_pulang: "-",
        tanggal,
        status: "Tidak hadir",
      },
    })

    res.status(200).json({ message: "Success input attendance" })
  }

  // Jika sudah terdapat presensi dan status tidak hadir
  if (presensi_magang && presensi_magang.status == "Tidak hadir") {
    let { id } = presensi_magang

    await prisma.presensi_magang.update({
      where: {
        id,
      },
      data: {
        waktu_pulang: waktu,
        status: "Hadir",
      },
    })

    res.status(200).json({ message: "Success input attendance" })
  }

  // Jika sudah terdapat presensi dan status telah hadir
  if (presensi_magang && presensi_magang.status == "Hadir") {
    res.status(401).json({ message: "You have been attend two times today" })
  }
}

module.exports = presensi
