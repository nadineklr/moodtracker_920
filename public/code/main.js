// Main JS File for all clientsided JS for main page

// wird ganz am Anfang ausgeführt bei p5js
function setup () {

  // diisable p5js canvas
  noCanvas()

  // capture vide
  const video = createCapture()
  video.parent('main-container') // hier sieht man das Video
  video.size(230, 240) // video Fenstergrösse


  let lat, lon, city, temperature, description
  // test if geolocation is avaliable
  if ('geolocation' in navigator) {
    // console.log(navigator)


    // callback funktion muss async sein! bei callback mitgeben
    navigator.geolocation.getCurrentPosition( async position => {
       // console.log(position)





      try {
          // Location of the user
          lat = position.coords.latitude
          lon = position.coords.longitude

        //  console.log(lon)

          

          // location wird als get parameter gesendet
          // prepare url for the weather endpoint
          const apiUrl = `weather/${lat},${lon}`


          // Gather response from server
          const response = await fetch(apiUrl)
          const json = await response.json()

          console.log(json)
          city = json.weather.name
          temperature = json.weather.main.temp
          description = json.weather.weather[0].description
          aqi = json.aqi.data.aqi


          const template = `
          <div class="more-info">
          <div class="temperature">Temperature: ${temperature}</div>
          <div class="description">${description}</div>
          <hr>
          <div class="city">City: ${city}</div>
          <div class="location"><span>Lat: ${lat} </span><span>Lon: ${lon} </span></div>
          <div class="aqi">Air Quality Index: ${aqi} </div>
          </div>
          `

          const weatherDiv = document.createElement('div')
          weatherDiv.innerHTML = template
          document.querySelector('main').append(weatherDiv)

      } catch(error) {
        console.error('error')
      }
      

    })

  } else {
    console.error('Geolocation is not supported')
  } 

  // Click Event after user clicks send
  document.querySelector('form button').addEventListener('click', async e => {
    e.preventDefault // seite soll nicht neu geladen werden


    // Reset messages
    if (document.querySelector('.success-message')) document.querySelector('.success-message').remove()
    if (document.querySelector('.error-message')) document.querySelector('.error-message').remove()

    // read input text
    const mood = document.querySelector('form input').value // mood input value


    // Get current image
    video.loadPixels()
    const image64 = video.canvas.toDataURL()

    const data = { // packet wird mit fetch an den Server gesendet
      mood,
      city,
      temperature,
      description,
      image64
    }



    // Fetch post für Datensendung (post wegen Sicherheit und Privatsphäre)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    } // Objekt, dass wir mitsenden können
    const response = await fetch('/api', options) // endpoint 
    const json = await response.json()

   // console.log(json)



// success and error message for user
   if(json.success) {
     const message = document.createElement('span')
     message.classList.add('success-message')
     message.innerText = 'Your mood has been added'
     document.querySelector('form').after(message)
   } else {
    const message = document.createElement('span')
    message.classList.add('error-message')
    message.innerText = 'There was an error please try again'
    document.querySelector('form').after(message)
   }
  })

  








}







