$("#form-absen").on("submit", (e) => {
  e.preventDefault()

  navigator.geolocation.getCurrentPosition(permissionGranted, permissionRefused)

  $("#popup-loading").removeClass("d-none")
})

function permissionRefused(err) {
  location.href = "/enable-location"
}

async function permissionGranted(position) {
  const code = $("#code").val()

  const { latitude, longitude } = position.coords

  const latitudeKantor = "-5.123984683586162"
  const longitudeKantor = "119.40869803863679"

  const apiUrl = `
    https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${latitude},${longitude}&destinations=${latitudeKantor},${longitudeKantor}&key=wt6TXkXxZ0HMGSdEEEdC6alBwgniyFDTgRMSALohI7bK5PYclDtVi39ADSS5R7aK
  `

  try {
    const fetchDistance = await fetch(apiUrl, { method: "GET" })
    const dataDistance = await fetchDistance.json()

    const { text, value } = dataDistance.rows[0].elements[0].distance

    if (value > 300) {
      location.href = "/location-far"
    } else {
      const absenUrl = "/api/absen"

      const fetchAbsen = await fetch(absenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (fetchAbsen.ok) {
        location.href = "/success"
      } else {
        const absenError = await fetchAbsen.json()
        const { message } = absenError

        if (message == "Wrong Personal Code") {
          location.href = "/wrong-code"
        } else {
          location.href = "/already-attended"
        }
      }
    }
  } catch (err) {
    console.log(err)
  }

  // fetch(endpoint, {
  //   method: "GET",
  // })
  //   .then((result) => result.json())
  //   .then((data) => {
  //     const { text, value } = data.rows[0].elements[0].distance

  //     fetch("/api/absen", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ code }),
  //     }).then(async (result) => {
  //       $("#popup-loading").addClass("d-none")

  //       if (!result.ok) {
  //         const err = await result.json()
  //         const { message } = err
  //         if (message == "Wrong Personal Code") {
  //           location.href = "/wrong-code"
  //         }
  //       } else {
  //         location.href = "/success"
  //       }
  //     })

  //     // if (value > 200) {
  //     //   location.href = "/location-far"
  //     // } else {
  //     //   fetch("/api/absen", {
  //     //     method: "POST",
  //     //     headers: {
  //     //       "Content-Type": "application/json",
  //     //     },
  //     //     body: JSON.stringify({ code }),
  //     //   }).then(async (result) => {
  //     //     if (!result.ok) {
  //     //       const err = await result.json()
  //     //       const { message } = err
  //     //       if (message == "Wrong Personal Code") {
  //     //         location.href = "/wrong-code"
  //     //       }
  //     //     } else {
  //     //       $("#absen-wrapper").addClass("d-none")
  //     //       $("#success-wrapper").removeClass("d-none")
  //     //     }
  //     //   })
  //     // }
  //   })
}
