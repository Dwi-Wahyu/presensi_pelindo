const { PrismaClient } = require("@prisma/client")
const generateKodeUnik = require("../functions/random")
const { totalQuery, filterQuery, pagedQuery } = require("../functions/datatable")
const prisma = new PrismaClient()

const SiswaController = {}

SiswaController.inputSiswaPage = async (req, res) => {
  const sekolah = await prisma.sekolah.findMany()

  res.render("admin/siswa/input", { sekolah })
}

SiswaController.inputSiswa = async (req, res) => {
  const { nama, namaSekolah, jenis_kelamin } = req.body

  const kode_unik = generateKodeUnik()

  await prisma.pkl.create({
    data: {
      nama,
      nama_sekolah: namaSekolah,
      jenis_kelamin,
      kode_unik,
    },
  })

  res.status(200).end()
}

SiswaController.daftarSiswa = async (req, res) => {
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

  const total = await totalQuery("pkl", "nomor")
  const filtered = await filterQuery("pkl", search, "nomor")
  const paged = await pagedQuery("pkl", search, start, length, "nomor", column_sort_order)

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

SiswaController.editSiswa = async (req, res) => {
  const { id } = req.params

  const siswa = await prisma.pkl.findFirst({
    where: {
      id,
    },
  })

  const sekolah = await prisma.sekolah.findMany()

  res.render("admin/siswa/edit", { siswa, sekolah })
}

SiswaController.updateSiswa = async (req, res) => {
  const { nama, nama_sekolah, jenis_kelamin } = req.body
  const { id } = req.params

  try {
    await prisma.pkl.update({
      where: {
        id,
      },
      data: {
        nama,
        nama_sekolah,
        jenis_kelamin,
      },
    })

    res.status(200).end()
  } catch (error) {
    res.status(403).end()
  }
}

module.exports = SiswaController
