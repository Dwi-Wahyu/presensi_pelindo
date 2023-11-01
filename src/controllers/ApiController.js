require("moment-timezone")

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

    const sekarang = moment()

    sekarang.tz("Asia/Makassar")

    const waktu = sekarang.format("HH:mm")
    const tanggal = sekarang.format("YYYY-MM-DD")

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

    const sekarang = moment()

    sekarang.tz("Asia/Makassar")

    const waktu = sekarang.format("HH:mm")
    const tanggal = sekarang.format("YYYY-MM-DD")

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
  const { tanggal, keterangan, waktu_izin, code } = req.body
  var nama

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
    // Jika merupakan siswa pkl cari nama dari model pkl
    if (pkl) {
      nama = pkl.nama
    }

    // Jika merupakan mahasiswa magang cari nama dari model magang
    if (magang) {
      nama = magang.nama
    }

    const cekIzin = await prisma.perizinan.findFirst({
      where: {
        kode_unik,
        tanggal,
      },
    })

    // Jika sudah terdapat izin
    if (cekIzin) {
      const izinSeharian = cekIzin.waktu_izin == "seharian"
      const izinDatang = cekIzin.waktu_izin == "datang"
      const izinPulang = cekIzin.waktu_izin == "pulang"

      // Jika telah membuat izin selama satu hari
      if (izinSeharian) {
        res.status(400).json({ message: "You already made permission for one day" })
      }

      // Jika terdapat izin datang
      if (!izinSeharian && !izinPulang && izinDatang) {
        if (waktu_izin == "datang") {
          res.status(400).json({
            message: "You already made permission for arrive attendance",
          })
        } else {
          // Jika ingin membuat izin pulang dan sudah terdapat izin datang
          // Maka Hapus izin datang dan buat izin seharian

          const { id } = cekIzin
          await prisma.perizinan.delete({
            where: {
              id,
            },
          })

          buatPerizinan("seharian")
        }
      }

      // Jika terdapat izin pulang
      if (!izinSeharian && !izinDatang && izinPulang) {
        if (waktu_izin == "pulang") {
          res.status(400).json({
            message: "You already made permission for leaving attendance",
          })
        } else {
          // Jika ingin membuat izin datang dan sudah terdapat izin pulang
          // Maka Hapus izin pulang dan buat izin seharian

          const { id } = cekIzin
          await prisma.perizinan.delete({
            where: {
              id,
            },
          })

          buatPerizinan("seharian")
        }
      }
    }

    // Jika belum ada izin
    if (!cekIzin) {
      buatPerizinan(waktu_izin)
    }

    async function buatPerizinan(waktu_izin) {
      const perizinan = await prisma.perizinan.create({
        data: {
          nama,
          kode_unik,
          tanggal,
          keterangan,
          waktu_izin,
          status: "Belum approve",
        },
      })

      res.status(200).end()
    }
  }

  if (!pkl && !magang) {
    res.status(401).json({ error: "Wrong Personal Code" })
  }
}

module.exports = apiController
