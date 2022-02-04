// Daten von der Datenbank holen
fetchData()


async function fetchData() {
  // user fetch to get Data from Api
  const response = await fetch('/api')
  const data = await response.json()


  // Test 
  // console.log(data)


  // HGenerate a template for the data                       
  data.forEach( entry => {
    const container = document.createElement('div')
    container.innerHTML = `
    <div class="moodbox">
      <p class="mood-title">Mood: ${entry.mood}</p>
      <img src="${entry.image64}" alt="">
      <div class="weatherdata">
        <div class="air">Air Quality Index: ${entry.aqi}</div>
        <div class="temp">Temperature: ${entry.temperature}</div>
        <div class="weather">Weather: ${entry.description}</div>
      </div>
    </div>`

    document.querySelector('section').append(container)


    });
}