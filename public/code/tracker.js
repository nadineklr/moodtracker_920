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
    <div>${entry.mood}</div>`

    document.querySelector('section').append(container)


    });
}