var Geonames = require('geonames.js');
//Dependency to fetch data
const fetch = require("node-fetch");
//Configure dotenv to be able to use environment variables found in the .env file at the root folder
const dotenv = require('dotenv');
dotenv.config();

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

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
    console.log('Your License key is '+process.env.license_key);
})
