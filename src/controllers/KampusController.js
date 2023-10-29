const { PrismaClient } = require("@prisma/client")
const { totalQuery, filterQuery, pagedQuery } = require("../functions/datatable")
const prisma = new PrismaClient()

const KampusController = {}

KampusController.inputKampus = async (req, res) => {
  const { nama } = req.body

  try {
    await prisma.kampus.create({
      data: {
        nama,
      },
    })

    res.status(200).end()
  } catch (err) {
    res.status(420).end()
  }
}

KampusController.daftarKampus = async (req, res) => {
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

  const total = await totalQuery("kampus", "nama")
  const filtered = await filterQuery("kampus", search, "nama")
  const paged = await pagedQuery("kampus", search, start, length, "nama", column_sort_order)

  const row = {
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data: paged,
  }

  res.json(row)
}

KampusController.editKampus = async (req, res) => {
  const { nama, id } = req.body

  try {
    await prisma.kampus.update({
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

KampusController.hapusKampus = async (req, res) => {
  const { id } = req.body

  await prisma.kampus.delete({
    where: {
      id,
    },
  })

  res.status(200).end()
}

module.exports = KampusController
