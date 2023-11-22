require("moment-timezone")

const { PrismaClient } = require("@prisma/client")
const {
  totalQuery,
  filterQuery,
  pagedQuery,
} = require("../functions/datatable")
const { log } = require("console")
const { getDaysInMonth } = require("../functions/date")
const supabase = require("../utils/supabase")
const prisma = new PrismaClient()
const moment = require("moment")
const { getDays, getDaysName } = require("../functions/calendar")

moment.locale("id")

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

  const { start, length, draw } = req.query

  const startAt = parseInt(start)
  const stopAt = parseInt(length)

  const { data: total } = await supabase
    .from("rekapitulasi")
    .select()
    .eq("status", "pkl")

  const { data: filtered } = await supabase
    .from("rekapitulasi")
    .select()
    .eq("status", "pkl")
    .like("tanggal", `%${tanggal}%`)
    .like("namaPengguna", `%${nama}%`)

  const { data } = await supabase
    .from("rekapitulasi")
    .select()
    .eq("status", "pkl")
    .like("tanggal", `%${tanggal}%`)
    .like("namaPengguna", `%${nama}%`)
    .range(startAt, stopAt)

  const recordsTotal = total?.length ?? 0
  const recordsFiltered = filtered?.length ?? 0

  const row = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
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

  const { start, length, draw } = req.query

  const startAt = parseInt(start)
  const stopAt = parseInt(length)

  const { data: total, error } = await supabase
    .from("rekapitulasi")
    .select()
    .eq("status", "magang")

  const { data: filtered } = await supabase
    .from("rekapitulasi")
    .select()
    .eq("status", "magang")
    .like("tanggal", `%${tanggal}%`)
    .like("namaPengguna", `%${nama}%`)

  const { data } = await supabase
    .from("rekapitulasi")
    .select()
    .eq("status", "magang")
    .like("tanggal", `%${tanggal}%`)
    .like("namaPengguna", `%${nama}%`)
    .range(startAt, stopAt)

  const recordsTotal = total.length
  const recordsFiltered = filtered.length

  const row = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  }

  res.json(row)
}

RekapitulasiController.editRekapitulasi = async (req, res) => {
  const { id } = req.params

  const rekapitulasi = await prisma.rekapitulasi.findFirst({
    where: {
      id,
    },
  })

  res.render("admin/rekapitulasi/siswa/edit", { rekapitulasi })
}

RekapitulasiController.updateRekapitulasi = async (req, res) => {
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

  const updateRekap = await prisma.rekapitulasi.update({
    where: {
      id,
    },
    data: {
      waktu_datang,
      waktu_pulang,
      kehadiran,
    },
  })

  res.status(200).end()
}

RekapitulasiController.cetakRekapitulasi = async (req, res) => {
  const { id } = req.params

  const rekapitulasi = await prisma.rekapitulasi.findFirst({
    where: {
      id,
    },
    include: {
      pengguna: true,
    },
  })

  const { tanggal } = rekapitulasi

  const bulan = moment(tanggal, "YYYY-MM-DD").format("MMMM")

  const { namaAsal, nama } = rekapitulasi.pengguna

  const daysInMonth = getDaysInMonth(tanggal)

  const presensi = await getPresensi(daysInMonth)

  res.render("admin/rekapitulasi/siswa/cetak", {
    presensi,
    namaAsal,
    nama,
    bulan,
  })

  async function getPresensi(daysRange) {
    const presensi = []

    for (const item of daysRange) {
      const splitTanggal = item.tanggal.split("-")
      const tanggal = splitTanggal[2]

      const presensiTanggal = await prisma.rekapitulasi.findFirst({
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
    AND (
      tanggal LIKE '%${search_value}%' 
      AND status = 'Belum approve'
    )
  `

  const { start, length, draw } = req.query
  const total = await totalQuery("perizinan", "tanggal")
  const filtered = await filterQuery("perizinan", search, "tanggal")
  const paged = await pagedQuery(
    "perizinan",
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

RekapitulasiController.lihatIzin = async (req, res) => {
  const izin = await prisma.perizinan.findUnique({
    where: {
      id: req.params.id,
    },
  })

  res.render("admin/rekapitulasi/izin/lihat", { izin })
}

RekapitulasiController.approveIzin = async (req, res) => {
  const { id, nama: namaPengguna, tanggal, waktu_izin } = req.body

  const cekAbsen = await prisma.rekapitulasi.findFirst({
    where: {
      namaPengguna,
      tanggal,
    },
  })

  if (!cekAbsen) {
    await prisma.perizinan.update({
      where: {
        id,
      },
      data: {
        status: "Approve",
      },
    })

    res.status(200).end()
  }

  if (cekAbsen) {
    const izinSeharian = waktu_izin == "seharian"
    const izinDatang = waktu_izin == "datang"
    const izinPulang = waktu_izin == "pulang"

    const absenDatang = cekAbsen.waktu_datang != "-"
    const absenPulang = cekAbsen.waktu_pulang != "-"

    if (izinSeharian) {
      res.status(400).json({ message: "Pengguna telah absen" })
    }

    if (izinDatang && absenDatang) {
      res.status(400).json({ message: "Pengguna telah absen datang" })
    }

    if (izinPulang && absenPulang) {
      res.status(400).json({ message: "Pengguna telah absen pulang" })
    }

    if (izinPulang && absenDatang) {
      await prisma.rekapitulasi.update({
        where: {
          id: cekAbsen.id,
        },
        data: {
          waktu_pulang: "Izin",
          kehadiran: "Hadir",
        },
      })

      res.status(200).end()

      await prisma.perizinan.delete({
        where: {
          id,
        },
      })
    }
  }
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

RekapitulasiController.cetak = async (req, res) => {
  const date = new Date()

  const { nomor, id } = req.params

  const asal = await prisma.asal.findFirst({
    where: {
      id,
    },
    include: {
      pengguna: true,
    },
  })

  const bulan = moment().format("MMMM")

  const daysInMonth = getDays(date.getMonth(), date.getFullYear())

  const kelompokPengguna = await prisma.pengguna.findMany({
    where: {
      namaAsal: asal.nama,
      pasangan: parseInt(nomor),
    },
  })

  const presensiMerged = await getPresensi()

  res.render("admin/rekapitulasi/cetak", {
    bulan,
    asal,
    nomor,
    daysInMonth,
    presensiMerged,
    kelompokPengguna,
  })

  async function getPresensi() {
    const presensiMerged = []

    for (const pengguna of kelompokPengguna) {
      const presensiPerbulan = []

      for (const item of daysInMonth) {
        const presensiPerorang = await prisma.rekapitulasi.findFirst({
          where: {
            namaPengguna: pengguna.nama,
            tanggal: item.tanggal,
          },
        })

        if (!presensiPerorang) {
          presensiPerbulan.push({
            hari: item.hari,
            tanggal: item.tanggal,
            waktu_datang: "-",
            waktu_pulang: "-",
          })
        } else {
          const { waktu_datang, waktu_pulang } = presensiPerorang

          presensiPerbulan.push({
            hari: item.hari,
            tanggal: item.tanggal,
            waktu_datang,
            waktu_pulang,
          })
        }
      }

      presensiMerged.push(presensiPerbulan)
    }

    return presensiMerged
  }
}

module.exports = RekapitulasiController
