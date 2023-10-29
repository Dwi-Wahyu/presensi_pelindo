function generateKodeUnik() {
  var kode = ""

  for (let i = 1; i <= 5; i++) {
    const random = Math.floor(Math.random() * 10)

    kode = `${kode}${random}`
  }

  const kode_unik = parseInt(kode)

  return kode_unik
}

module.exports = generateKodeUnik
