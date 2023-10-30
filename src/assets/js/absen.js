$("#form-absen").on("submit", (e) => {
  e.preventDefault()

  navigator.geolocation.getCurrentPosition(permissionGranted, permissionRefused)

  function permissionGranted(position) {
    const code = $("#code").val()

    const { latitude, longitude } = position.coords

    const latitudeKantor = "-5.123984683586162"
    const longitudeKantor = "119.40869803863679"

    const endpoint = `
      https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${latitude},${longitude}&destinations=${latitudeKantor},${longitudeKantor}&key=wt6TXkXxZ0HMGSdEEEdC6alBwgniyFDTgRMSALohI7bK5PYclDtVi39ADSS5R7aK
    `

    fetch(endpoint, {
      method: "GET",
    })
      .then((result) => result.json())
      .then((data) => {
        const { text, value } = data.rows[0].elements[0].distance

        fetch("/api/absen", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }).then(async (result) => {
          if (!result.ok) {
            const err = await result.json()
            const { message } = err
            if (message == "Wrong Personal Code") {
              location.href = "/wrong-code"
            }
          } else {
            location.href = "/success"
          }
        })

        // if (value > 200) {
        //   location.href = "/location-far"
        // } else {
        //   fetch("/api/absen", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ code }),
        //   }).then(async (result) => {
        //     if (!result.ok) {
        //       const err = await result.json()
        //       const { message } = err
        //       if (message == "Wrong Personal Code") {
        //         location.href = "/wrong-code"
        //       }
        //     } else {
        //       $("#absen-wrapper").addClass("d-none")
        //       $("#success-wrapper").removeClass("d-none")
        //     }
        //   })
        // }
      })
  }

  function permissionRefused(err) {
    location.href = "/enable-location"
  }
})
