const { PrismaClient } = require("@prisma/client")
const { totalQuery, filterQuery, pagedQuery } = require("../functions/datatable")
const prisma = new PrismaClient()

const SekolahController = {}

SekolahController.inputSekolah = async (req, res) => {
  const { nama } = req.body

  try {
    await prisma.sekolah.create({
      data: {
        nama,
      },
    })

    res.status(200).end()
  } catch (err) {
    res.status(420).end()
  }
}

SekolahController.daftarSekolah = async (req, res) => {
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

  const total = await totalQuery("sekolah", "nama")
  const filtered = await filterQuery("sekolah", search, "nama")
  const paged = await pagedQuery("sekolah", search, start, length, "nama", column_sort_order)

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

SekolahController.editSekolah = async (req, res) => {
  const { id, nama } = req.body

  try {
    await prisma.sekolah.update({
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

SekolahController.hapusSekolah = async (req, res) => {
  const { id } = req.body

  await prisma.sekolah.delete({
    where: {
      id,
    },
  })

  res.status(200).end()
}

module.exports = SekolahController
