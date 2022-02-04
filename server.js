

const express = require('express')  // express aus nodejs modules ordner holen
const Datastore = require('nedb')
const fetch = require('node-fetch') // node fetch holen, immer die Vesion, die installiert wurde(hier v2)
require('dotenv').config()


// Start express
const app = express()



// zuhören - es brauche einen Port, callback function
// Port definieren
const port = process.env.port|| 3000; // falls es im server schon eine port variable gibt, wird diese verwendet. Sonst 3000.

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`)
})

// Public ordner definieren ( bwo befinden sich die Files?)
app.use(express.static('public'))
app.use(express.json({
  limit: '300mb'
}))

// define and load the database
const database = new Datastore('database/database.db') // neue Instanz
// database ladem
database.loadDatabase()



// Responsible for getting weather ans AQI (air quality) data and sending it to the client
app.get('/weather/:latlon', async (req, res) => {
  const latlon = req.params.latlon.split(',')
  console.log(latlon)

  // Api keys
  const weatherApiKey = process.env.API_KEY_WEATHER
  const airApiKey = process.env.API_KEY_AQI

  // api requests
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latlon[0]}&lon=${latlon[1]}&appid=${weatherApiKey}`
  const airUrl = `https://api.waqi.info/feed/geo:${latlon[0]};${latlon[1]}/?token=${airApiKey}`

  const weatherResponse = await fetch(weatherUrl)
  const weatherData = await weatherResponse.json()

  const aqiResponse = await fetch(airUrl)
  const aqiData = await aqiResponse.json()

  console.log(weatherData)


  

  const data = {
    weather: weatherData,
    aqi: aqiData
  }

    res.json(data)



  

})


// Responsible for database API POST / insert data into database
app.post('/api', (req, res) => {
  const data = req.body
   console.log(data)

  data.timestamp = Date.now()


  // alles speichern in DB
  database.insert(data)
  data.success = true
  
  res.json(data)

})
// Responsible for database API get / read data into database
app.get('/api', (req, res) => {
  // send information from the database to the client
  database.find({}, (err, data) => {
    if (err) {
      console.log(err)
      res.end()
    } else if (data) {
      console.log('Server is sending the data to the client')
      res.json(data)
    }
  })


})