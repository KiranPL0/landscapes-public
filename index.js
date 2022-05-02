//Requires&Variables
const express = require("express")
const rateLimit = require('express-rate-limit')
const app = express()
const port = 8000
const htmldir = __dirname + '/public/html/'
const axios = require('axios')
const config = require('./config.json')

const weatherLimiter = rateLimit({
    windowMs: 5*60*1000,
    max: 60,
    message: 'r'
})

//Static
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use('/weather', weatherLimiter)

//Routes
app.get('/', (req, res) => {

    res.render('index')
})


app.get('/weather/:city/:unit', (req, res) => {
    const city = req.params.city
    const unit = req.params.unit
    axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${config.apitoken}`)
        .then(function (response) {
            if (response.data.length < 1){
                res.send("No city exists with that name.")
            }else{
                if (unit == "f"){
                    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=915f372ac3d7b93216158e357cd0bae9&units=imperial`)
                    .then(function (response){
                        res.json({
                            temp: response.data.main.temp,
                            weather: response.data.weather[0].main,
                            city: response.data.name,
                            country: response.data.sys.country
                        })
                    })

                    .catch(function (err){
                        res.send("error")
                        console.log(err)
                    })

                }else{
                    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=915f372ac3d7b93216158e357cd0bae9&units=metric`)
                    .then(function (response){
                        res.json({
                            temp: response.data.main.temp,
                            weather: response.data.weather[0].main,
                            city: response.data.name,
                            country: response.data.sys.country
                        })
                    })

                    .catch(function (err){
                        res.send("error")
                        console.log(err)
                    })

                }
                // response.data[0].lat
            }
        })
        .catch(function(error) {
            console.log(error)
            res.send("error")
        })
})

//Listeners
app.listen(port, () =>{
    console.log(`listening at http://localhost:${port}`)
    console.log(config.apitoken)
})