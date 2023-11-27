const { PrismaClient } = require("@prisma/client")
const generateKodeUnik = require("../functions/random")
const {
  totalQuery,
  filterQuery,
  pagedQuery,
} = require("../functions/datatable")
const supabase = require("../utils/supabase")
const prisma = new PrismaClient()

const PenggunaController = {}

PenggunaController.inputPengguna = async (req, res) => {
  const { nama, namaAsal, jenis_kelamin, status } = req.body

  const kode_unik = generateKodeUnik()

  const pasanganTerakhir = await prisma.pengguna.findFirst({
    where: {
      namaAsal,
    },
    orderBy: {
      pasangan: "desc",
    },
  })

  if (pasanganTerakhir) {
    const jumlahPasangan = await prisma.pengguna.count({
      where: {
        pasangan: pasanganTerakhir.pasangan,
        namaAsal,
      },
    })

    if (jumlahPasangan === 2) {
      createPengguna(pasanganTerakhir.pasangan + 1)
    } else {
      createPengguna(pasanganTerakhir.pasangan)
    }
  } else {
    createPengguna(1)
  }

  async function createPengguna(pasangan) {
    try {
      await prisma.pengguna.create({
        data: {
          nama,
          namaAsal,
          jenis_kelamin,
          kode_unik,
          status,
          pasangan,
        },
      })
      res.status(200).end()
    } catch (error) {
      console.log(error)
      res.status(400).end()
    }
  }
}

PenggunaController.editPengguna = async (req, res) => {
  const { id } = req.params

  const pengguna = await prisma.pengguna.findFirst({
    where: {
      id,
    },
  })

  const pkl = pengguna.status === "pkl"
  const magang = pengguna.status === "magang"

  if (pkl) {
    const sekolah = await prisma.asal.findMany({
      where: {
        tipe: "sekolah",
      },
    })

    res.render("admin/siswa/edit", { pengguna, sekolah })
  }

  if (magang) {
    const kampus = await prisma.asal.findMany({
      where: {
        tipe: "kampus",
      },
    })

    res.render("admin/mahasiswa/edit", { pengguna, kampus })
  }
}

PenggunaController.updatePengguna = async (req, res) => {
  const { id } = req.params

  const { nama, jenis_kelamin, namaAsal } = req.body

  try {
    await prisma.pengguna.update({
      where: {
        id,
      },
      data: {
        nama,
        jenis_kelamin,
        namaAsal,
      },
    })

    res.status(200).end()
  } catch (error) {
    res.status(420).end()
  }
}

PenggunaController.inputSiswaPage = async (req, res) => {
  const sekolah = await prisma.asal.findMany({ where: { tipe: "sekolah" } })

  res.render("admin/siswa/input", { sekolah })
}

PenggunaController.daftarSiswa = async (req, res) => {
  if (typeof req.query.order == "undefined") {
    var column_name = "nomor"
    var column_sort_order = "desc"
  } else {
    var column_index = req.query.order[0]["column"]
    var column_name = req.query.columns[column_index]["data"]
    var column_sort_order = req.query.order[0]["dir"]
  }

  const search_value = req.query.search["value"]
  const search = `AND (
    nama LIKE '%${search_value}%'
    AND status = 'pkl'
  )`

  const { start, length, draw } = req.query

  const total = await totalQuery("pengguna", "nama")
  const filtered = await filterQuery("pengguna", search, "nama")
  const paged = await pagedQuery(
    "pengguna",
    search,
    start,
    length,
    "nama",
    column_sort_order
  )

  // const startAt = parseInt(start)
  // const stopAt = parseInt(length)

  // const { data: total } = await supabase
  //   .from("pengguna")
  //   .select()
  //   .eq("status", "pkl")

  // const { data: filtered } = await supabase
  //   .from("pengguna")
  //   .select()
  //   .eq("status", "pkl")
  //   .like("nama", search_value)

  // const { data } = await supabase
  //   .from("pengguna")
  //   .select()
  //   .eq("status", "pkl")
  //   .like("nama", search_value)
  //   .range(startAt, stopAt)

  // console.log(filtered)

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

PenggunaController.inputMahasiswaPage = async (req, res) => {
  const kampus = await prisma.asal.findMany({ where: { tipe: "kampus" } })

  res.render("admin/mahasiswa/input", { kampus })
}

PenggunaController.daftarMahasiswa = async (req, res) => {
  if (typeof req.query.order == "undefined") {
    var column_name = "nomor"
    var column_sort_order = "desc"
  } else {
    var column_index = req.query.order[0]["column"]
    var column_name = req.query.columns[column_index]["data"]
    var column_sort_order = req.query.order[0]["dir"]
  }

  const search_value = req.query.search["value"]
  const search = `AND (
    nama LIKE '%${search_value}%'
    AND status = 'magang'
  )`

  const { start, length, draw } = req.query

  const total = await totalQuery("pengguna", "nama")
  const filtered = await filterQuery("pengguna", search, "nama")
  const paged = await pagedQuery(
    "pengguna",
    search,
    start,
    length,
    "nama",
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

module.exports = PenggunaController
