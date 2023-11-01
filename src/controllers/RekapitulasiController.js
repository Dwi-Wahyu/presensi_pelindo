const { PrismaClient } = require("@prisma/client")
const { totalQuery, filterQuery, pagedQuery } = require("../functions/datatable")
const { log } = require("console")
const { getDaysInMonth, getDaysInWeek } = require("../functions/date")
const cek_kode_absen = require("../functions/common")
const prisma = new PrismaClient()

const RekapitulasiController = {}

RekapitulasiController.rekapitulasiPKL = async (req, res) => {
  if (typeof req.query.order == "undefined") {
    var column_name = "nomor"
    var column_sort_order = "desc"
  } else {
    var column_index = req.query.order[0]["column"]
    var column_name = req.query.columns[column_index]["data"]
    var column_sort_order = req.query.order[0]["dir"]
  }

  const search_value = req.query.search["value"]

  const splitSearch = search_value.split("::")
  let tanggal = splitSearch[0]
  let nama = splitSearch[1]

  if (nama == undefined) {
    nama = ""
  }

  const search = `
    AND (tanggal LIKE '%${tanggal}%'
    AND nama_siswa LIKE '%${nama}%')
  `

  const { start, length, draw } = req.query
  const total = await totalQuery("presensi_pkl", "tanggal")
  const filtered = await filterQuery("presensi_pkl", search, "tanggal")
  const paged = await pagedQuery(
    "presensi_pkl",
    search,
    start,
    length,
    "tanggal",
    column_sort_order
  )

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

RekapitulasiController.rekapitulasiMagang = async (req, res) => {
  if (typeof req.query.order == "undefined") {
    var column_name = "nomor"
    var column_sort_order = "desc"
  } else {
    var column_index = req.query.order[0]["column"]
    var column_name = req.query.columns[column_index]["data"]
    var column_sort_order = req.query.order[0]["dir"]
  }

  const search_value = req.query.search["value"]

  const splitSearch = search_value.split("::")
  let tanggal = splitSearch[0]
  let nama = splitSearch[1]

  if (nama == undefined) {
    nama = ""
  }

  const search = `
    AND (tanggal LIKE '%${tanggal}%'
    AND nama_mahasiswa LIKE '%${nama}%')
  `

  const { start, length, draw } = req.query
  const total = await totalQuery("presensi_magang", "tanggal")
  const filtered = await filterQuery("presensi_magang", search, "tanggal")
  const paged = await pagedQuery(
    "presensi_magang",
    search,
    start,
    length,
    "tanggal",
    column_sort_order
  )

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

RekapitulasiController.editRekapPKL = async (req, res) => {
  const { id } = req.params

  const rekapitulasiPKL = await prisma.presensi_pkl.findFirst({
    where: {
      id,
    },
  })

  res.render("admin/rekapitulasi/siswa/edit", { rekapitulasiPKL })
}

RekapitulasiController.editRekapMagang = async (req, res) => {
  const { id } = req.params

  const rekapitulasiMagang = await prisma.presensi_magang.findFirst({
    where: {
      id,
    },
  })

  res.render("admin/rekapitulasi/mahasiswa/edit", { rekapitulasiMagang })
}

RekapitulasiController.updateRekapPKL = async (req, res) => {
  const { id } = req.params
  let { waktu_datang, waktu_pulang } = req.body

  let kehadiran = "Hadir"

  const kosong_datang = waktu_datang == ""
  const kosong_pulang = waktu_pulang == ""

  if (kosong_datang) {
    waktu_datang = "-"
    kehadiran = "Tidak Hadir"
  }

  if (kosong_pulang) {
    waktu_pulang = "-"
    kehadiran = "Tidak Hadir"
  }

  if (!kosong_datang && !kosong_pulang) {
    kehadiran = "Hadir"
  }

  const updateRekap = await prisma.presensi_pkl.update({
    where: {
      id,
    },
    data: {
      waktu_datang,
      waktu_pulang,
      status: kehadiran,
    },
  })

  log(updateRekap)

  res.status(200).end()
}

RekapitulasiController.updateRekapMagang = async (req, res) => {
  const { id } = req.params
  let { waktu_datang, waktu_pulang } = req.body

  let kehadiran = "Hadir"

  const kosong_datang = waktu_datang == ""
  const kosong_pulang = waktu_pulang == ""

  if (kosong_datang) {
    waktu_datang = "-"
    kehadiran = "Tidak Hadir"
  }

  if (kosong_pulang) {
    waktu_pulang = "-"
    kehadiran = "Tidak Hadir"
  }

  if (!kosong_datang && !kosong_pulang) {
    kehadiran = "Hadir"
  }

  const updateRekap = await prisma.presensi_magang.update({
    where: {
      id,
    },
    data: {
      waktu_datang,
      waktu_pulang,
      status: kehadiran,
    },
  })

  log(updateRekap)

  res.status(200).end()
}

RekapitulasiController.cetakRekapitulasiPKL = async (req, res) => {
  const { id } = req.params

  async function getPresensi(daysRange) {
    const presensi = []

    for (const item of daysRange) {
      const splitTanggal = item.tanggal.split("-")
      const tanggal = splitTanggal[2]

      const presensiTanggal = await prisma.presensi_pkl.findFirst({
        where: {
          tanggal: item.tanggal,
        },
      })

      if (!presensiTanggal) {
        presensi.push({
          tanggal,
          hari: item.hari,
          waktu_datang: "-",
          waktu_pulang: "-",
          status: "Tidak Hadir",
        })
      } else {
        const { waktu_datang, waktu_pulang, status } = presensiTanggal
        presensi.push({
          tanggal,
          hari: item.hari,
          waktu_datang,
          waktu_pulang,
          status,
        })
      }
    }

    return presensi
  }

  const presensi_pkl = await prisma.presensi_pkl.findFirst({
    where: {
      id,
    },
    include: {
      pkl: true,
    },
  })

  const { tanggal } = presensi_pkl

  const daysInMonth = getDaysInMonth(tanggal)

  const presensi = await getPresensi(daysInMonth)

  const { nama_sekolah, nama } = presensi_pkl.pkl

  res.render("admin/rekapitulasi/siswa/cetak", { presensi, nama_sekolah, nama })
}

RekapitulasiController.cetakRekapitulasiMagang = async (req, res) => {
  const { id } = req.params

  async function getPresensi(daysRange) {
    const presensi = []

    for (const item of daysRange) {
      const splitTanggal = item.tanggal.split("-")
      const tanggal = splitTanggal[2]

      const presensiTanggal = await prisma.presensi_magang.findFirst({
        where: {
          tanggal: item.tanggal,
        },
      })

      if (!presensiTanggal) {
        presensi.push({
          tanggal,
          hari: item.hari,
          waktu_datang: "-",
          waktu_pulang: "-",
          status: "Tidak Hadir",
        })
      } else {
        const { waktu_datang, waktu_pulang, status } = presensiTanggal
        presensi.push({
          tanggal,
          hari: item.hari,
          waktu_datang,
          waktu_pulang,
          status,
        })
      }
    }

    return presensi
  }

  const presensi_magang = await prisma.presensi_magang.findFirst({
    where: {
      id,
    },
    include: {
      magang: true,
    },
  })

  const { tanggal } = presensi_magang

  const daysInMonth = getDaysInMonth(tanggal)

  const presensi = await getPresensi(daysInMonth)

  const { nama_kampus, nama } = presensi_magang.magang

  res.render("admin/rekapitulasi/mahasiswa/cetak", { presensi, nama_kampus, nama })
}

RekapitulasiController.daftarIzin = async (req, res) => {
  if (typeof req.query.order == "undefined") {
    var column_name = "nomor"
    var column_sort_order = "desc"
  } else {
    var column_index = req.query.order[0]["column"]
    var column_name = req.query.columns[column_index]["data"]
    var column_sort_order = req.query.order[0]["dir"]
  }

  const search_value = req.query.search["value"]

  const search = `
    AND (tanggal LIKE '%${search_value}%')
  `

  const { start, length, draw } = req.query
  const total = await totalQuery("perizinan", "tanggal")
  const filtered = await filterQuery("perizinan", search, "tanggal")
  const paged = await pagedQuery("perizinan", search, start, length, "tanggal", column_sort_order)

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

RekapitulasiController.approveIzin = async (req, res) => {
  const { id, nama, tanggal, status, kode_unik } = req.body

  const seharian = status == "seharian"
  const datang = status == "datang"
  const pulang = status == "pulang"

  const absen = await cek_kode_absen(kode_unik)

  const absenPKL = absen == "pkl"
  const absenMagang = absen == "magang"

  if (seharian && absenPKL) {
    await prisma.presensi_pkl.create({
      data: {
        nama_siswa: nama,
        waktu_datang: "Izin",
        waktu_pulang: "Izin",
        tanggal,
        status: "Izin seharian",
      },
    })
  }

  if (seharian && absenMagang) {
    await prisma.presensi_magang.create({
      data: {
        nama_mahasiswa: nama,
        waktu_datang: "Izin",
        waktu_pulang: "Izin",
        tanggal,
        status: "Izin seharian",
      },
    })
  }

  // Todo: buat logic izin absen datang
  if (datang && absenPKL) {
  }

  // Jika izin pulang dan absen pkl
  if (pulang && absenPKL) {
    const cek_absen_datang = await prisma.presensi_pkl.findFirst({
      where: {
        nama_siswa: nama,
        tanggal,
      },
    })

    // Jika terdapat absen datang
    if (cek_absen_datang) {
      const { id } = cek_absen_datang
      const updateAbsen = await prisma.presensi_pkl.update({
        where: {
          id,
        },
        data: {
          waktu_pulang: "Izin",
          status: "Izin pulang",
        },
      })

      log(updateAbsen)
    }

    // Jika belum terdapat absen datang
    if (!cek_absen_datang) {
      const absen = await prisma.presensi_pkl.create({
        data: {
          waktu_datang: "-",
          waktu_pulang: "Izin",
          status: "Izin",
        },
      })

      log(absen)
    }
  }

  // await prisma.perizinan.delete({
  //   where: {
  //     id,
  //   },
  // })

  res.status(200).end()
}

RekapitulasiController.tolakIzin = async (req, res) => {
  const { id } = req.body

  await prisma.perizinan.delete({
    where: {
      id,
    },
  })

  res.status(200).end()
}

module.exports = RekapitulasiController
