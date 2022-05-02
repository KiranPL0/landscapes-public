//Variables
var isloaded = false
var colour = "black"
var use24hr = true
var weatherShown = false
var weatherUnit = "c"
var weatherLocation = "fgdfgkgkfgkkfkkgofodfodofkogfkodkg"
var isbarhidden = false
var isfs = false
// importdata
//Functions
function load() {
    weatherLocation = window.localStorage.getItem("pref-city")
    weatherUnit = window.localStorage.getItem("pref-unit")
    if (window.localStorage.getItem('bar') == 'no'){
        isbarhidden = true
        $('.prefwrap').hide()

    }else{
        isbarhidden = false
        $('.prefwrap').show()
    }

    if (window.localStorage.getItem('img') !== null){
        document.getElementById('body').style.backgroundImage = `url('${window.localStorage.getItem('img')}')`
    }
    isloaded = true

    if (window.localStorage.getItem('colour') == 'black'){
        var e = document.getElementsByClassName('colourable')
        for (var i=0;i<e.length;i++){
            e[i].style.color = "black";
        }
        colour = "black"
    }else{
        var e = document.getElementsByClassName('colourable')
        for (var i=0;i<e.length;i++){
            e[i].style.color = "white";
        }
        colour = "white"
    }

    document.getElementById('wrapper').setAttribute("title", Intl.DateTimeFormat().resolvedOptions().timeZone)
    if (window.localStorage.getItem('time') == "12hr"){
        use24hr = false
    }else{
        use24hr = true
    }

    if (window.localStorage.getItem('banner') !== 'hidden'){
        document.getElementById('banner').classList.remove('hidden')
    }


    if (window.localStorage.getItem('weather') == "true"){
        weatherShown = true
        document.getElementById('weather').classList.remove('hidden')
    }else{
        weatherShown = false
    }

}

function validateURL(url){
    var url

    try {
        url = new  URL(url)
    }catch (err){
        return false
    }

    return url.protocol === "http:" || url.protocol === "https:"
}

function getMonth(num) {
    switch (num) {
        case 0:
            return "January"
            break
        case 1:
            return "February"
            break
        case 2:
            return "March"
            break
        case 3:
            return "April"
            break
        case 4:
            return "May"
            break
        case 5:
            return "June"
            break
        case 6:
            return "July"
            break
        case 7:
            return "August"
            break
        case 8:
            return "September"
            break
        case 9:
            return "October"
            break
        case 10:
            return "November"
            break
        case 11:
            return "December"
            break
        default:
            return "What are you on??"
    }

}

function hours12(date) { return (date.getHours() + 24) % 12 || 12; }

// Update the time & dateevery .1 second.

setInterval(() => {
    if (!isloaded == false) {
        //Set Variables
        const d = new Date()
        const time = document.getElementById("time")
        const date = document.getElementById("date")
        const hours = d.getHours()
        const month = getMonth(d.getMonth())
        const day = d.getDate()
        const year = d.getFullYear()
        var datecall = "st"

        if (d.getDate() == 1) {
            datecall = "st"
        } else if (d.getDate() == 2) {
            datecall = "nd"
        } else if (d.getDate() == 3) {
            datecall = "rd"
        } else {
            datecall = "th"
        }
        var seconds
        if (d.getMinutes() < 10) {
            minutes = "0" + d.getMinutes()
        } else {
            minutes = d.getMinutes()
        }
        if (d.getSeconds() < 10) {
            seconds = "0" + d.getSeconds()
        } else {
            seconds = d.getSeconds()
        }

        if (use24hr == true){
            const timeString = `${hours}:${minutes}:${seconds}`
            const dateString = `${month} ${day}${datecall}, ${year}`
            time.innerText = timeString
            date.innerText = dateString    
        }else{
            var pmam = ""
            if (d.getHours() >= 12){
                pmam = "PM"
            }else{
                pmam = "AM"
            }
            const timeString = `${hours12(d)}:${minutes}:${seconds} ${pmam}`
            const dateString = `${month} ${day}${datecall}, ${year}`
            time.innerText = timeString
            date.innerText = dateString
    
        }
    }
}, 100);

function getWeatherData(){
    if (weatherShown == true){
        $.get(`/weather/${weatherLocation}/${weatherUnit}`, function( data ) {
            if (data == "error"){
                Swal.fire({
                    title: "Unknown error weather fetching data.",
                    icon: "error"
                })
            }else if (data == "r"){
                document.getElementById('weather').innerText = "You've requested the weather too many times (refreshing the page). Please try again in 5 minutes. (RateLimitError)"
            }else{
                var temp = data.temp.toString().split('.')[0]
                var weather = data.weather
                var location = `${data.city}, ${data.country}`
                if (weatherUnit == "c"){
                    document.getElementById('weather').innerText = `${temp}°C • ${weather} • ${location}`
                }else{
                    document.getElementById('weather').innerText = `${temp}°F • ${weather} • ${location}`
                }
            }
        })

    }

}

setInterval(() => {
    getWeatherData()
}, 600000)

setTimeout(() => {
    getWeatherData()
}, 100)
function changeImg(){
    Swal.fire({
        title: 'Enter the link of your custom image',
        input: 'url',
        showCancelButton: true,
        confirmButtonText: 'Save 🎉',

    }).then((result) => {

        if (validateURL(result.value) == true){
            const url = result.value
            window.localStorage.setItem('img', url)
            document.getElementById('body').style.backgroundImage = `url('${url}')`        
            Swal.fire({
                title: "Success!",
                icon: "success",
                imageUrl: url
            })    
        }else if (validateURL(result.value) == false || validateURL(result) == false){
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "You did not supply a valid url."
            })
        }
    })


}

function changeColour(){
    if (colour == "black"){
        var e = document.getElementsByClassName('colourable')
        for (var i=0;i<e.length;i++){
            e[i].style.color = "white";
        }
        colour = "white"
        window.localStorage.setItem('colour', 'white')
    }else{
        var e = document.getElementsByClassName('colourable')
        for (var i=0;i<e.length;i++){
            e[i].style.color = "black";
        }
        colour = "black"
        window.localStorage.setItem('colour', 'black')
    }
}

function closeBanner(){
    var banner = document.getElementById('banner')
    banner.classList.add('hidden')
    window.localStorage.setItem('banner', 'hidden')
}

function timeFormat(){
    if (use24hr == true){
        use24hr = false
        window.localStorage.setItem('time', '12hr')
    }else{
        use24hr = true
        window.localStorage.setItem('time', '24hr')
    }
}

function weatherToggle(){
    if (weatherShown == true){
        document.getElementById("weather").classList.add("hidden")
        window.localStorage.setItem('weather', false)
        weatherShown = false
    }else{
        document.getElementById("weather").classList.remove("hidden")
        window.localStorage.setItem('weather', true)
        weatherShown = true
        weatherPrefs()
    }
}

function weatherPrefs(){
    Swal.fire({
        title: 'What\'s the name of your city?',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Next',

    }).then((result) => {
        if (result.dismiss == undefined){
            var city = result.value
            Swal.fire({
                title: "What unit would you like to use?",
                input: 'select',
                inputOptions: {
                    '1': 'Metric',
                    '2': 'Imperial'
                },
                
            }).then((result) => {
                if (result.value == '1'){
                    $.get(`/weather/${city}/c`, function( data ) {
                        if (data == "error" || data == "No city exists with that name." ){
                            Swal.fire({
                                title: "Unknown error fetching data.",
                                icon: "error"
                            })
                        }else{
                            window.localStorage.setItem("pref-city", city)
                            window.localStorage.setItem("pref-unit", 'c')
                            weatherLocation = city
                            weatherUnit = 'c'
                            location.reload()
                        }
                    })
                }else{
                    $.get(`/weather/${city}/f`, function( data ) {
                        if (data == "error" || data == "No city exists with that name."){
                            Swal.fire({
                                title: "Unknown error fetching data.",
                                icon: "error"
                            })
                        }else{
                            window.localStorage.setItem("pref-city", city)
                            window.localStorage.setItem("pref-unit", 'f')
                            weatherLocation = city
                            weatherUnit = 'f'
                            location.reload()
                        }
                    })

                }
            })
        }
    })
}

function hidemenu(){
    if (isbarhidden == true){
        weatherLocation = window.localStorage.setItem("bar", 'yes')
        $('.prefwrap').show()
        isbarhidden = false
    }else{
        weatherLocation = window.localStorage.setItem("bar", 'no')
        $('.prefwrap').hide()
        isbarhidden = true
    }

}

$(document).on("keypress", function (e){
    if (e.which == 104){
        hidemenu()
    }
})

function exportData(){
    Swal.fire({
        title: "Exported Data",
        html: `<code>
        {
            "banner": "${window.localStorage.getItem('banner')}",
            "colour": "${window.localStorage.getItem('colour')}",
            "img": "${window.localStorage.getItem('img')}",
            "prefcity": "${window.localStorage.getItem('pref-city')}",
            "prefunit": "${window.localStorage.getItem('pref-unit')}",
            "time": "${window.localStorage.getItem('time')}",
            "weather": "${window.localStorage.getItem('weather')}"
        }
        </code>`,
        footer: "Please note that this includes your weather data, which includes the city you picked."
    })
}

function importData(){
    Swal.fire({
        title: "Enter your imported data",
        input: 'text'

    }).then(function(result){
        if (result.dismiss == undefined){
            var obj = undefined
            try {
                obj = JSON.parse(result.value)
            }catch(err){
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: err
                })
            }

            window.localStorage.setItem('banner', obj.banner)
            window.localStorage.setItem('colour', obj.colour)
            window.localStorage.setItem('img', obj.img)
            window.localStorage.setItem('pref-city', obj.prefcity)
            window.localStorage.setItem('pref-unit', obj.prefunit)
            window.localStorage.setItem('time', obj.time)
            window.localStorage.setItem('weather', obj.weather)
            location.reload()
        }
    })
}


function handlefs(){
    if(isfs == false){
        fs()
        document.getElementById('togglefs').innerText = "Exit Fullscreen"
        isfs = true
    }else{
        leavefs()
        document.getElementById('togglefs').innerText = "Enter Fullscreen"
        isfs = false
    }
}

function fs(){
    var doc = document.documentElement
    if (doc.requestFullscreen){
        doc.requestFullscreen()
    }else if (doc.webkitRequestFullscreen){
        doc.webkitRequestFullscreen()
    }else if (doc.msRequestFullscreen){
        doc.msRequestFullscreen()
    }
}

function leavefs(){
    var doc = document.documentElement
    if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }    
}