const { PrismaClient } = require("@prisma/client")
const moment = require("moment")
const prisma = new PrismaClient()

const apiController = {}

apiController.presensi = async (req, res) => {
  const { code } = req.body

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
}

apiController.izin = async (req, res) => {
  const { tanggal, keterangan, status, code } = req.body

  const kode_unik = parseInt(code)

  const pkl = await prisma.pkl.findFirst({
    where: {
      kode_unik,
    },
  })

  const magang = await prisma.magang.findFirst({
    where: {
      kode_unik,
    },
  })

  if (pkl || magang) {
    const cekIzin = await prisma.perizinan.findFirst({
      where: {
        kode_unik,
        tanggal,
      },
    })

    if (cekIzin) {
      const izinSeharian = cekIzin.status == "seharian"
      const izinDatang = cekIzin.status == "datang"
      const izinPulang = cekIzin.status == "pulang"

      console.log(izinSeharian, izinDatang, izinPulang)

      // Todo: Buat perkondisian jika sudah terdapat izin datang dan menambahkan izin pulang gabungkan kedua izin tersebut jadi 1 izin seharian

      if (izinSeharian) {
        res.status(400).json({ message: "You already made permission for one day" })
      }

      if (!izinSeharian && !izinDatang && !izinPulang) {
        buatPerizinan()
      }

      if (!izinSeharian && !izinPulang && izinDatang) {
        if (status == "datang") {
          res.status(400).json({
            message: "You already made permission for arrive attendance",
          })
        } else {
          buatPerizinan()
        }
      }

      if (!izinSeharian && !izinDatang && izinPulang) {
        if (status == "pulang") {
          res.status(400).json({
            message: "You already made permission for leaving attendance",
          })
        } else {
          buatPerizinan()
        }
      }
    } else {
      buatPerizinan()
    }

    async function buatPerizinan() {
      const perizinan = await prisma.perizinan.create({
        data: {
          kode_unik,
          tanggal,
          keterangan,
          status,
        },
      })
      console.log(perizinan)

      res.status(200).end()
    }
  }

  if (!pkl && !magang) {
    res.status(401).json({ error: "Wrong Personal Code" })
  }
}

module.exports = apiController
