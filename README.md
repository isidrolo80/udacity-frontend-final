# CAPSTONE PROJECT

Use Multiple APIs to get trip information and show it to the user. The APIs used are: 

### Geonames
Used to get information about a specific location like lattitud and longitude 

### Weatherbit
Used to get weather data based on a geographical location (lat, long)

### Pixabay
Used to get a random image of the chosen city


## Installation

Install dependencies by using the following commands. Node must be installed. 

```bash
npm i
```

You should create a file at the root folder called ".env" and it's content should be 

```bash
geonames_username = "MyGeonamesUsername"
weatherbit_api = "MyWeatherbitAPI"
pixabay_api = "MyPixaBayAPI"
```


## Usage

```bash
npm run dev //to run in development mode
npm run build //To update list files
npm run start //Starts the service on port 8081 
```
npm run start should be used on a different terminal window if using the development environment as it initializes a service needed to run the API

## Contributing
This is a project and not meant for contribution

## NOTE 
The additional feature added is the weather icon.