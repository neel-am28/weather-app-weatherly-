
const searchCity = document.querySelector('#search-city')

searchCity.addEventListener('keypress', function (e) {
    // if user presses enter after writing a city name
    if (e.keyCode === 13) {
        const city = this.value.trim();
        updateUI(city)
    }
});
// check to see if there's city present in localstorage, if it is, update initial render UI with that city
if (localStorage.getItem('city')) {
    updateUI(localStorage.getItem('city'))
}

function updateUI(city) {
    axios.post('/weather', { city: city })
        .then((response) => {
            const weather = JSON.parse(response.data)
            localStorage.setItem('city', weather.city)
            searchCity.value = ''
            document.querySelector('.container').classList.remove('hide')
            const city = weather.city
            const country = weather.country
            const icon = weather.icon
            const temperature = weather.temperature
            const description = weather.description
            const time = weather.time
            const dayTime = weather.day_time

            const timeTail = time.slice(9)
            const formattedTime = time.slice(0, 5) + ` ${timeTail}`
            // const 

            const formattedDayTime = dayTime.substring(0, dayTime.lastIndexOf(" "))
            const newData = {
                timeTail, city, country, icon, temperature, description, formattedDayTime, formattedTime, time, dayTime
            }
            if (weather.date > weather.sunrise && weather.date < weather.sunset) {
                document.body.style.backgroundColor = `#62879b`;
                document.querySelector('#search-city').style.backgroundColor = `#62879b`;
                document.querySelector('.head').style.color = `white`;
                document.querySelector('.msg').style.color = `white`;
                document.querySelector('.container-image').setAttribute('src', './images/day.jpg')
            }
            else {
                document.body.style.backgroundColor = `rgb(18, 56, 72)`;
                document.querySelector('#search-city').style.backgroundColor = `rgb(18, 56, 72)`;
                document.querySelector('.container-image').setAttribute('src', './images/night.jpg')
            }
            document.querySelector('.city-country').innerHTML = `${newData.city}, ${newData.country}`;
            document.querySelector('.calender').innerHTML = `${newData.formattedDayTime}`;
            document.querySelector('.img-move').setAttribute('src', `http://openweathermap.org/img/wn/${newData.icon}@2x.png`);
            document.querySelector('.time').innerHTML = `${newData.formattedTime}`;
            document.querySelector('.temp').innerHTML = `${newData.temperature} \xB0C,  ${newData.description}`;
        })
        .catch((error) => {
            console.log(error);
        })
}
