function countdown(tripDate) {
    let newDate = new Date()
    //let today = new Date().toISOString().slice(0, 10)
    var difference = new Date(tripDate.getTime() - newDate.getTime());
    console.log(difference.getFullYear() - 1970) //The date starts in 1970 so the result will always show as 1970 and we have to substract this value
    console.log(difference.getMonth())
    console.log(difference.getDate())
    return difference
}

function requestWeather(lat, long) {
    fetch('http://localhost:8081/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({lat: lat, long: long}),
    })
}

function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let city = document.getElementById('city').value 
    let date = document.getElementById('date').value
    //Check if the URL provided is valid
    let tripDate = new Date(date)
    
    let difference = countdown(tripDate)
    
    fetch('http://localhost:8081/makeSummary', {
        method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({city: city}),
    })

    .then(res => {
        return res.json()
    })
    .then(function(data) {
        console.log(data)
        document.getElementById('naturalLocation').innerHTML = data.toponymName+', '+data.countryName+' is'
        document.getElementById('location').innerHTML = '<b>Latitud: </b>'+data.lat+'<br><b>Longitud: </b>'+data.lng
        requestWeather(data.lat, data.lng)
        if ((difference.getFullYear() - 1970) >= 0) { //If a date in the future is selected
            document.getElementById('countdown').innerHTML = (difference.getFullYear() - 1970)+'<b> Years</b><br>'+difference.getMonth()+'<b> Months</b><br>'+difference.getDate()+'<b> Days</b><br>Away'
        } else { //If a past date is selected
            document.getElementById('countdown').innerHTML = "The trip has already passed"
        }
    })


}



export { handleSubmit }
