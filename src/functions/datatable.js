const { pool } = require("../utils/database")

function totalQuery(dbColumn, count_column) {
  const sql = `SELECT COUNT(${count_column}) AS total FROM ${dbColumn}`
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) reject(err)

      try {
        resolve(result[0].total)
      } catch (err) {
        resolve(0)
      }
    })
  })
}

function filterQuery(dbColumn, search, count_column) {
  const sql = `SELECT COUNT(${count_column}) AS total FROM ${dbColumn} WHERE true ${search}`
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) reject(err)

      try {
        resolve(result[0].total)
      } catch (err) {
        resolve(0)
      }
    })
  })
}

function pagedQuery(dbColumn, search, start, length, orderBy, column_sort_order) {
  const sql = `SELECT * FROM ${dbColumn} WHERE true ${search} 
    ORDER BY ${orderBy} ${column_sort_order} LIMIT ${length} OFFSET ${start}`
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) reject(err)
      resolve(result.rows)
    })
  })
}

module.exports = {
  totalQuery,
  filterQuery,
  pagedQuery,
}
