function countdown(tripDate) {
    let newDate = new Date()
    console.log("right now: "+newDate)
    console.log("trip date: "+tripDate)

    //let today = new Date().toISOString().slice(0, 10)
    var difference = new Date(tripDate.getTime() - newDate.getTime());
    //difference.setHours(0, 0, 0, 0);
    console.log('difference '+difference)
    //console.log(difference.getFullYear() - 1970) //The date starts in 1970 so the result will always show as 1970 and we have to substract this value
    //console.log(difference.getMonth())
    //console.log(difference.getDate())
    return difference
}

function countdown1(tripDate) {
    let newDate = new Date()
    var difference = new Date(tripDate.getTime() - newDate.getTime());
    var dayTransform=1000*60*60*24; //We transform from milisecond to second, to hour to days. 
    var numberOfdays = Math.ceil(difference/dayTransform)
    console.log("numberOfdays: "+numberOfdays)
    return numberOfdays
}



function requestWeather(lat, long, differenceDays) {
    fetch('http://localhost:8081/weather?lat='+lat+'&long='+long+'&differenceDays='+differenceDays, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    .then(res => {
        return res.json()
    })

    .then(function(data) {
        //console.log("my data: "+ JSON.stringify(data))
        console.log(data)
        document.getElementById("weather").innerHTML = "<b>High: </b> "+data.app_max_temp+"<br><b>Low: </b>"+data.app_min_temp+"<br><b>"+data.weather.description+"</b><br><img src='https://www.weatherbit.io/static/img/icons/"+data.weather.icon+".png'>"


    })
}

function requestImage(city) {
    fetch('http://localhost:8081/requestImage/?city='+city, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    
    .then(res => {
        return res.json()
    })

    .then(function(data) {
        document.getElementById("cityImage").innerHTML = '<img src="'+data.webformatURL+'" alt="City image" width="500" height="600">'
    })
}



function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let city = document.getElementById('city').value 
    let date = document.getElementById('date').value
    //Check if the URL provided is valid
    let tripDate = new Date(date)
    tripDate = new Date(tripDate.setDate(tripDate.getDate() + 1))
    //console.log('dateOnEvent: '+tripDate);
    let difference = countdown(tripDate)
    let differenceDays = countdown1(tripDate)
    
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
        if (differenceDays > 0) { //If a date in the future is selected
            document.getElementById('countdown').innerHTML = (difference.getFullYear() - 1970)+'<b> Years</b><br>'+difference.getMonth()+'<b> Months</b><br>'+difference.getDate()+'<b> Days</b><br>Away<br><br><b>This is a total of '+differenceDays+' days until your trip'
        } else { //If a past date is selected
            document.getElementById('countdown').innerHTML = "The trip has already passed"
        }
            requestWeather(data.lat, data.lng, differenceDays)
            requestImage(city)
    })


}



export { handleSubmit }
