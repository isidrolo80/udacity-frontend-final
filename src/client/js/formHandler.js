function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let city = document.getElementById('city').value 
    let summarySize = document.getElementById('summarySize').value
    //Check if the URL provided is valid
    
    
    fetch('http://localhost:8081/makeSummary', {
        method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({city: city, summarySize: summarySize}),
    })

    .then(res => {
        return res.json()
    })
    .then(function(data) {
        document.getElementById('location').innerHTML = '<b>Latitud: </b>'+data.lat+'<br><b>Longitud: </b>'+data.lng
    })

}



export { handleSubmit }
