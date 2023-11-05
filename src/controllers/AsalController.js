const { PrismaClient } = require("@prisma/client")
const { totalQuery, filterQuery, pagedQuery } = require("../functions/datatable")
const prisma = new PrismaClient()

const AsalController = {}

//
// Sekolah
//

AsalController.inputSekolah = async (req, res) => {
  const { nama } = req.body

  try {
    await prisma.asal.create({
      data: {
        nama,
        tipe: "sekolah",
      },
    })

    res.status(200).end()
  } catch (error) {
    res.status(420).end()
  }
}

AsalController.daftarSekolah = async (req, res) => {
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
    AND tipe = 'sekolah'
  )`

  const { start, length, draw } = req.query

  const total = await totalQuery("asal", "nama")
  const filtered = await filterQuery("asal", search, "nama")
  const paged = await pagedQuery("asal", search, start, length, "nama", column_sort_order)

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

//
// Kampus
//

AsalController.inputKampus = async (req, res) => {
  const { nama } = req.body

  try {
    await prisma.asal.create({
      data: {
        nama,
        tipe: "kampus",
      },
    })

    res.status(200).end()
  } catch (error) {
    res.status(420).end()
  }
}

AsalController.daftarKampus = async (req, res) => {
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
    AND tipe = 'kampus'
  )`

  const { start, length, draw } = req.query

  const total = await totalQuery("asal", "nama")
  const filtered = await filterQuery("asal", search, "nama")
  const paged = await pagedQuery("asal", search, start, length, "nama", column_sort_order)

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

AsalController.updateAsal = async (req, res) => {
  const { id, nama } = req.body

  try {
    await prisma.asal.update({
      where: {
        id,
      },
      data: {
        nama,
      },
    })

    res.status(200).end()
  } catch (err) {
    res.status(420).end()
  }
}

AsalController.hapusAsal = async (req, res) => {
  const { id } = req.body

  await prisma.asal.delete({
    where: {
      id,
    },
  })

  res.status(200).end()
}

module.exports = AsalController
