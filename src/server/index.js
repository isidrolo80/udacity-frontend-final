let geonames = require('geonames.js');
//Dependency to fetch data
const fetch = require("node-fetch");
//Configure dotenv to be able to use environment variables found in the .env file at the root folder
const dotenv = require('dotenv');
dotenv.config();
//Configure https reuquests 
const https = require('https');
geonames = new geonames({username: process.env.geonames_username, lan: 'en', encoding: 'JSON', type: 'json'});
var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const app = express()
app.use(cors())
// to use json
app.use(bodyParser.json())
// to use url encoded values
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('dist'))


let showConsole1 = showConsole();
// designates what port the app will listen to for incoming requests
function showConsole() {
	module.exports = app
	app.listen(8081, function () {
    console.log('CAPSTONE project listening on port 8081!')
	})
}




app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})



app.post('/cityInfo', async(req, res)=>{

	var city = req.body.city;

	try{
	  const continents = await geonames.search({
	  q: city,
	  method: "POST"
	  }) //get continents
	  res.send(JSON.stringify(continents.geonames[0]))
	}catch(err){
	  console.error(err);
	}
    
})




app.get('/weather', async (req, res)=> {
	var lat = req.query.lat
	var long = req.query.long
	var differenceDays = parseInt(req.query.differenceDays, 10);
	let URL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat='+lat+'&lon='+long+'&key='+process.env.weatherbit_api;
	let myData1;

if(differenceDays >= 1) {

	try{

		await https.get(URL, (resp) => {
		  let data = '';

		  // Received chunck of data
		  resp.on('data', (chunk) => {
		    data += chunk;
		  });

		  // We have received the entire data
		  resp.on('end', () => {
		  	//We get the last value so we know the latest date of which we can get the weather. 
		    myData1 = JSON.parse(data).data[15].datetime;
		    latestDate = new Date(myData1)

		    if (differenceDays <= 15) { 
		    res.send(JSON.parse(data).data[differenceDays])
			} else {
			res.send('{ "result": "Cant get weather for trips that are 16 days or further in the future"}')
			}

		  });

		})

	}catch(err){
		console.log(err);
	}

} else {
	res.send('{ "result": "The date is in the past"}')
}
})


app.get('/requestImage', async (req, res) => {
	var city = req.query.city
	let URL = 'https://pixabay.com/api/?key='+process.env.pixabay_api+'&q='+city;

	try{
		await https.get(URL, (resp) => {
			let data ='';

			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				let myData = JSON.parse(data)
				let totalHits = parseInt(myData.totalHits, 10)
				let randomImage
				//The API returns a maximum of 20 photos per query. We set a max of 20 for the random image
				if(totalHits > 20) {
					    randomImage = Math.floor(Math.random() * 20);
					} else {
					    randomImage = Math.floor(Math.random() * totalHits);
					}
				if (typeof(randomImage) != "undefined") {
					res.send(myData.hits[randomImage])
				} else {
					res.send('{ "result": "There are no images for this city"}')
				}
			})
		})
	} catch(err){
		console.log(err);
	}

})

