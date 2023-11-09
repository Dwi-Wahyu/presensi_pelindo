const moment = require("moment")

const waktu = "17:51"

const waktu_datang = moment(waktu, "HH:mm")

console.log(waktu_datang.format("HH:mm"))
