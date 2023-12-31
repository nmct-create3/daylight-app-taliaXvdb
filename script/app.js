let sunrise;
let sunset;
let now;

let htmlSunrise;
let htmlSunset;
let htmlTimeLeft;
let htmlLocation;
let htmlSun;

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
let updateSun = (leftOff, bottomOff) => {
  // Zoek het bestaande zon-element in de DOM.
  htmlSun.style.left = leftOff + '%';
  htmlSun.style.bottom = bottomOff + '%';

  htmlSun.setAttribute(
    'data-time',
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, minutesPassed) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  // Bepaal het aantal minuten dat de zon al op is.
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  // Vergeet niet om het resterende aantal minuten in te vullen.
  // Nu maken we een functie die de zon elke minuut zal updaten
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
  document.querySelector('html', 'body').classList.add('is-day');
  var percentage = (minutesPassed / totalMinutes) * 100;
  console.info(percentage);
  var sunLeft = percentage;
  var sunBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2;
  updateSun(sunLeft, sunBottom);

  setInterval(() => {
    today = new Date();

    minutesPassed++;

    let percentage = (100 / totalMinutes) * minutesPassed,
      sunLeft = percentage,
      sunBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2;

    const minutesLeft = (sunset - now) / 1000 / 60;
    const minutes = Math.floor(minutesLeft);
    htmlTimeLeft.innerHTML = minutes;

    updateSun(sunLeft, sunBottom);

    if (percentage >= 100) {
      clearInterval();
      document.querySelector('html', 'body').classList.add('is-night');
    }
  }, 6000);
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (weatherInfo) => {
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  document.querySelector('html', 'body').classList.add('is-loaded');

  sunrise = new Date(weatherInfo.city.sunrise * 1000);
  sunset = new Date(weatherInfo.city.sunset * 1000);
  now = new Date();

  const sunriseTime = `${formatTime(sunrise.getHours())}:${formatTime(
    sunrise.getMinutes()
  )}`;
  const sunsetTime = `${formatTime(sunset.getHours())}:${formatTime(
    sunset.getMinutes()
  )}`;

  // Toon de geformatteerde tijd
  console.log(`Sunrise time: ${sunriseTime}`);
  htmlSunrise.innerHTML = sunriseTime;
  console.log(`Sunset time: ${sunsetTime}`);
  htmlSunset.innerHTML = sunsetTime;

  //calculate the percentage of the day that has passed
  const totalMinutes = (sunset - sunrise) / 1000 / 60;
  console.info(totalMinutes);
  const minutesPassed = (now - sunrise) / 1000 / 60;
  console.info(minutesPassed);
  const minutesLeft = (sunset - now) / 1000 / 60;
  const minutes = Math.floor(minutesLeft);

  const location = `${weatherInfo.city.name}, ${weatherInfo.city.country}`;

  htmlTimeLeft.innerHTML = minutes;
  htmlLocation.innerHTML = location;

  placeSunAndStartMoving(totalMinutes, minutesPassed, minutesLeft);
};

const formatTime = (time) => {
  if (time < 10) {
    return `0${time}`;
  } else {
    return `${time}`;
  }
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  const weatherInfo = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5f0f86a4d70f6105b5ad52f7e18ef4b7&units=metric&lang=nl&cnt=1`
  ).then((response) => response.json());

  console.info(weatherInfo);

  return weatherInfo;
};

document.addEventListener('DOMContentLoaded', function () {
  // 1 We will query the API with longitude and latitude.
  htmlSunrise = document.querySelector('.js-sunrise');
  htmlSunset = document.querySelector('.js-sunset');
  htmlTimeLeft = document.querySelector('.js-time-left');
  htmlLocation = document.querySelector('.js-location');
  htmlSun = document.querySelector('.js-sun');
  getAPI(50.8027841, 3.2097454).then((weatherInfo) => showResult(weatherInfo));
});
