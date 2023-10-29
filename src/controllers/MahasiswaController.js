const { PrismaClient } = require("@prisma/client")
const generateKodeUnik = require("../functions/random")
const { totalQuery, filterQuery, pagedQuery } = require("../functions/datatable")
const prisma = new PrismaClient()

const MahasiswaController = {}

MahasiswaController.inputMahasiswaPage = async (req, res) => {
  const kampus = await prisma.kampus.findMany()

  res.render("admin/mahasiswa/input", { kampus })
}

MahasiswaController.inputMahasiswa = async (req, res) => {
  const { nama, namaKampus, jenis_kelamin } = req.body

  const kode_unik = generateKodeUnik()

  try {
    const mahasiswa = await prisma.magang.create({
      data: {
        nama,
        jenis_kelamin,
        kode_unik,
        nama_kampus: namaKampus,
      },
    })

    res.status(200).end()
  } catch (error) {
    res.status(420).end()
  }
}

MahasiswaController.daftarMahasiswa = async (req, res) => {
  if (typeof req.query.order == "undefined") {
    var column_name = "nomor"
    var column_sort_order = "desc"
  } else {
    var column_index = req.query.order[0]["column"]
    var column_name = req.query.columns[column_index]["data"]
    var column_sort_order = req.query.order[0]["dir"]
  }

  const search_value = req.query.search["value"]
  const search = `AND (nama LIKE '%${search_value}%')`

  const { start, length, draw } = req.query

  const total = await totalQuery("magang", "nomor")
  const filtered = await filterQuery("magang", search, "nomor")
  const paged = await pagedQuery("magang", search, start, length, "nomor", column_sort_order)

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

MahasiswaController.editMahasiswa = async (req, res) => {
  const { id } = req.params

  const mahasiswa = await prisma.magang.findFirst({
    where: {
      id,
    },
  })

  const kampus = await prisma.kampus.findMany()

  res.render("admin/mahasiswa/edit", { mahasiswa, kampus })
}

MahasiswaController.updateMahasiswa = async (req, res) => {
  const { nama, nama_kampus, jenis_kelamin } = req.body
  const { id } = req.params

  try {
    const update = await prisma.magang.update({
      where: {
        id,
      },
      data: {
        nama,
        nama_kampus,
        jenis_kelamin,
      },
    })

    console.log(update)

    res.status(200).end()
  } catch (error) {
    res.status(403).end()
  }
}

module.exports = MahasiswaController
