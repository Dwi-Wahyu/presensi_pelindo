const moment = require("moment")

function getDaysInWeek(date) {
  const momentDates = moment(date, "YYYY-MM-DD")

  function getDaysRange(weekStartDate, weekEndDate, date) {
    const range = []

    for (let i = weekStartDate; i <= weekEndDate; i++) {
      const formattedDate = moment(date, "YYYY-MM-DD")
      formattedDate.set("date", i)

      range.push(formattedDate.format("YYYY-MM-DD"))
    }

    return range
  }

  const weekStartDate = momentDates.get("date") - momentDates.get("day") + 1
  const weekEndDate = weekStartDate + 4

  const weekDaysRange = getDaysRange(weekStartDate, weekEndDate, date)

  return weekDaysRange
}

function getDaysInMonth(tanggalInput) {
  const tanggalAwal = new Date(tanggalInput)
  const tahun = tanggalAwal.getFullYear()
  const bulan = tanggalAwal.getMonth()
  const jumlahHariDalamBulan = new Date(tahun, bulan + 1, 0).getDate()

  const tanggalDanHari = []

  for (let hari = 1; hari <= jumlahHariDalamBulan; hari++) {
    const tanggal = new Date(tahun, bulan, hari)
    const tempTanggal = new Date(tahun, bulan, hari)
    tempTanggal.setDate(tempTanggal.getDate() + 1)
    const tanggalFormatted = tempTanggal.toISOString().slice(0, 10) // Mengambil bagian YYYY-MM-DD
    const hariDalamSeminggu = tanggal.toLocaleString("id-ID", { weekday: "long" })
    tanggalDanHari.push({ tanggal: tanggalFormatted, hari: hariDalamSeminggu })
  }

  return tanggalDanHari
}

module.exports = { getDaysInMonth, getDaysInWeek }
