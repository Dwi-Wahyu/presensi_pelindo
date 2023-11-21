const moment = require("moment")

moment.locale("id")

function getDays(month, year) {
  var date = new Date(year, month, 1)

  var dateInMonth = []

  while (date.getMonth() === month) {
    const tanggal = moment(date)

    dateInMonth.push({
      tanggal: tanggal.format("YYYY-MM-DD"),
      hari: tanggal.format("dddd"),
    })

    date.setDate(date.getDate() + 1)
  }
  return dateInMonth
}

function getDaysName(month, year) {
  const bulan = month - 1

  var date = new Date(year, month, 1)

  var days = []
  while (date.getMonth() === month) {
    const tanggal = moment(date)
    days.push(tanggal.format("dddd"))

    date.setDate(date.getDate() + 1)
  }
  return days
}

module.exports = { getDaysName, getDays }
