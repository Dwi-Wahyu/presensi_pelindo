require("moment-timezone")

const { PrismaClient } = require("@prisma/client")
const moment = require("moment")
const prisma = new PrismaClient()

const apiController = {}

// moment.tz("Asia/Makassar")

apiController.login = async (req, res) => {
  const { code } = req.body

  const kode_unik = parseInt(code)

  const pengguna = await prisma.pengguna.findFirst({
    where: {
      kode_unik,
    },
  })

  if (pengguna) {
    const infoPengguna = {
      nama: pengguna.nama,
      asal: pengguna.namaAsal,
      jenis_kelamin: pengguna.jenis_kelamin,
      code,
    }

    res.status(200).json({ infoPengguna })
  }

  if (!pengguna) {
    res.status(401).json({ message: "Wrong Personal Code" })
  }
}

apiController.presensi = async (req, res) => {
  const { code } = req.body

  const kode_unik = parseInt(code)

  const sekarang = moment()
  sekarang.tz("Asia/Makassar")

  const tanggal = sekarang.format("YYYY-MM-DD")
  const waktu = sekarang.format("HH:mm")

  const pengguna = await prisma.pengguna.findFirst({
    where: {
      kode_unik,
    },
  })

  if (!pengguna) {
    res.status(401).json({ message: "Wrong Personal Code" })
  }

  const adaIzin = await prisma.perizinan.findFirst({
    where: {
      kode_unik,
      tanggal,
      status: "Approve",
    },
  })

  const cekAbsen = await prisma.rekapitulasi.findFirst({
    where: {
      pengguna,
      tanggal,
    },
  })

  if (pengguna && !adaIzin && !cekAbsen) {
    const { nama, status } = pengguna

    await prisma.rekapitulasi.create({
      data: {
        namaPengguna: nama,
        waktu_datang: waktu,
        waktu_pulang: "-",
        tanggal,
        status: status,
        kehadiran: "Tidak hadir",
      },
    })

    res.status(200).end()
  }

  if (pengguna && !adaIzin && cekAbsen) {
    const telahHadir = waktu_datang != "-" && waktu_pulang != "-"

    if (telahHadir) {
      res.status(400).json({ message: "You have been attend two times today" })
    } else {
      await prisma.rekapitulasi.update({
        where: {
          id: cekAbsen.id,
        },
        data: {
          waktu_pulang: waktu,
          kehadiran: "Hadir",
        },
      })

      res.status(200).end()
    }

    // const { waktu_datang, waktu_pulang } = cekAbsen

    // const telahHadir = waktu_datang != "-" && waktu_pulang != "-"

    // const momentDatang = moment(waktu_datang, "HH:mm")

    // const momentBisaAbsen = momentDatang.add(4, "hour")
    // const waktuAbsen = momentBisaAbsen.format("HH:mm")

    // const bisaAbsen = sekarang.isAfter(momentBisaAbsen)

    // if (telahHadir) {
    //   res.status(400).json({ message: "You have been attend two times today" })
    // }

    // if (!bisaAbsen) {
    //   res.status(400).json({ message: "Please wait several time", waktuAbsen })
    // }

    // if (!telahHadir && bisaAbsen) {
    //   console.log("bisami")

    //   await prisma.rekapitulasi.update({
    //     where: {
    //       id: cekAbsen.id,
    //     },
    //     data: {
    //       waktu_pulang: waktu,
    //       kehadiran: "Hadir",
    //     },
    //   })

    //   res.status(200).end()
    // }
  }

  if (pengguna && adaIzin && !cekAbsen) {
    const { nama, status } = pengguna

    const izinSeharian = adaIzin.waktu_izin == "seharian"
    const izinDatang = adaIzin.waktu_izin == "datang"
    const izinPulang = adaIzin.waktu_izin == "pulang"

    if (izinSeharian) {
      res.status(400).json({ message: "You have applied for a one-day permit" })
    }

    if (izinDatang) {
      await prisma.rekapitulasi.create({
        data: {
          namaPengguna: nama,
          waktu_datang: "Izin",
          waktu_pulang: waktu,
          tanggal,
          status,
          kehadiran: "Hadir",
        },
      })

      res.status(200).end()

      await prisma.perizinan.delete({
        where: {
          id: adaIzin.id,
        },
      })
    }

    if (izinPulang) {
      await prisma.rekapitulasi.create({
        data: {
          namaPengguna: nama,
          waktu_datang: waktu,
          waktu_pulang: "Izin",
          tanggal,
          status,
          kehadiran: "Hadir",
        },
      })

      res.status(200).end()

      await prisma.perizinan.delete({
        where: {
          id: adaIzin.id,
        },
      })
    }
  }
}

apiController.izin = async (req, res) => {
  const { tanggal, keterangan, waktu_izin, code } = req.body

  const kode_unik = parseInt(code)

  const pengguna = await prisma.pengguna.findFirst({
    where: {
      kode_unik,
    },
  })

  if (!pengguna) {
    res.status(401).json({ message: "Wrong Personal Code" })
  }

  const cekIzin = await prisma.perizinan.findFirst({
    where: {
      tanggal,
      kode_unik,
    },
  })

  if (pengguna && !cekIzin) {
    const { nama } = pengguna

    await prisma.perizinan.create({
      data: {
        nama,
        kode_unik,
        status: "Belum approve",
        tanggal,
        keterangan,
        waktu_izin,
      },
    })

    res.status(200).end()
  }

  if (pengguna && cekIzin) {
    const sudah_izin_seharian = cekIzin.waktu_izin == "seharian"
    const sudah_izin_datang = cekIzin.waktu_izin == "datang"
    const sudah_izin_pulang = cekIzin.waktu_izin == "pulang"

    const { id } = cekIzin

    if (sudah_izin_seharian) {
      res
        .status(400)
        .json({ message: "Anda telah mengajukan izin untuk satu hari" })
    }

    if (sudah_izin_datang && waktu_izin == "datang") {
      res
        .status(400)
        .json({ message: "Anda telah mengajukan izin absen masuk" })
    }

    if (sudah_izin_pulang && waktu_izin == "pulang") {
      res
        .status(400)
        .json({ message: "Anda telah mengajukan izin absen pulang" })
    }

    if (
      (sudah_izin_datang && waktu_izin == "pulang") ||
      (sudah_izin_pulang && waktu_izin == "datang")
    ) {
      await prisma.perizinan.update({
        where: {
          id,
        },
        data: {
          waktu_izin: "seharian",
        },
      })

      res.status(200).end()
    }
  }
}

module.exports = apiController
