var Geonames = require('geonames.js');
//Dependency to fetch data
const fetch = require("node-fetch");
//Configure dotenv to be able to use environment variables found in the .env file at the root folder
const dotenv = require('dotenv');
dotenv.config();

//Configure https reuquests 
const https = require('https');

const request = require('request');

/*
const geonames = Geonames({
  username: process.env.geonames_username,
  lan: 'en',
  encoding: 'JSON'
});
*/

geonames = new Geonames({username: process.env.geonames_username, lan: 'en', encoding: 'JSON', type: 'json'});

var path = require('path')
const express = require('express')
var APIResponse = require('./API.js')
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




app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})



app.get('/textClassification', function (req, res) {
    res.sendFile('dist/textClassification.html')
})



app.post('/makeSummary', async(req, res)=>{

	var city = req.body.city;

	// async/await
	try{
	  const continents = await geonames.search({
	  q: city,
	  method: "POST"
	  }) //get continents
	  res.send(JSON.stringify(continents.geonames[0]))
	  //console.log(JSON.stringify(continents.geonames[0]))
	}catch(err){
	  console.error(err);
	}
    
})




app.get('/weather', async (req, res)=> {
	var lat = req.query.lat
    //let lat = req.body.lat;
	//let long = req.body.long;
	var long = req.query.long
	var differenceDays = parseInt(req.query.differenceDays, 10);
	let URL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat='+lat+'&lon='+long+'&key='+process.env.weatherbit_api;
	let myData1;

if(differenceDays >= 1) {

	try{

		await https.get(URL, (resp) => {
		  let data = '';

		  // A chunk of data has been received.
		  resp.on('data', (chunk) => {
		    data += chunk;
		  });

		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
		    myData1 = JSON.parse(data).data[15].datetime;
		    latestDate = new Date(myData1)
		    console.log(latestDate)

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
						console.log("inside totalits+20")
					    randomImage = Math.floor(Math.random() * 20);
					} else {
						console.log("inside else")
					    randomImage = Math.floor(Math.random() * totalHits);
					}
					console.log(randomImage)
				if (typeof(randomImage) != "undefined") {
					//console.log("randomeimage: "+randomImage)
					//console.log(myData.hits[30])
					res.send(myData.hits[randomImage])
				} else {
					res.send('{ "result": "There are no images for this city"}')
				}
				//console.log("Image Info: "+myData.hits[randomImage].webformatURL)
				
			})
		})
	} catch(err){
		console.log(err);
	}

})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
    console.log('Your License key is '+process.env.license_key);
})
