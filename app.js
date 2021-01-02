const axios = require('axios')
const express = require('express')
require('dotenv').config()
const app = express()

const PORT = process.env.PORT || 3000
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY
const IP_GEOLOCATION_API = process.env.IP_GEOLOCATION_API
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather?q'

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/weather', (req, res) => {
    const url = `${BASE_URL}=${req.body.city}&units=metric&APPID=${OPEN_WEATHER_API_KEY}`
    axios.get(url).then((response) => {
        axios.get(`https://api.ipgeolocation.io/timezone?apiKey=${IP_GEOLOCATION_API}&location=${req.body.city}`)
            .then((time) => {
                const weatherData = {
                    temperature: response.data.main.temp,
                    country: response.data.sys.country,
                    city: response.data.name,
                    description: response.data.weather[0].description,
                    icon: response.data.weather[0].icon,
                    date: response.data.dt,
                    sunrise: response.data.sys.sunrise,
                    sunset: response.data.sys.sunset,
                    time: time.data.time_12,
                    day_time: time.data.date_time_txt
                }
                res.json(JSON.stringify(weatherData))
            })
    }).catch((err) => {
        console.log(err);
    })
})

app.get('*', (req, res) => {
    res.send(`Sorry, we can't find what you're looking for :(`)
})

app.listen(PORT, () => console.log(`Weather app listening on port ${PORT}!`))