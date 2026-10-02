// For this demo, the API that we will be using is from 'https://openweathermap.org/'
// Paste the API key you generated from your OpenWeatherMap account below:
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

// The preventDefault method stops the form from reloading the page,
// allowing us to handle the submission with JavaScript instead.
weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.replace(/[^a-zA-Z\s]/g, "");   

    if(city){
        try{
            const weatherData = await getweatherData(city);
            displayweatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error.message);
        }    
    }
    else{
        displayError("Please enter a place name; it must only contain letters and spaces.");
    }
});

async function getweatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Could not fetch weather data. Please check the place name or try again later.");
    }
    return response.json();
}


function displayweatherInfo(data){
    // 1. Extracting the exact pieces of information you asked for:
    const { 
        coord: { lon, lat }, // Coordinates (longitude and latitude)
        dt,                  // Date time timestamp
        id,                  // City ID
        name,                // Name of the place (e.g., "Miami")
        timezone,            // Timezone offset
        visibility,          // Visibility depth
        main: { temp, humidity, grnd_level, feels_like }, // Temperature and humidity from main
        sys: { sunrise, sunset }, // Country code from sys
        wind: { speed, deg }, // Wind speed and direction from wind
        weather: [{ description, id: weatherId }] // Weather info (renamed id to weatherId so it doesn't clash)
    } = data;


    // 3. Updating your HTML Web Card Card interface
    card.textContent = "";
    card.style.display = "flex";

    const placeDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const coordDisplay = document.createElement("p");
    const vsisbilityDisplay = document.createElement("p");
    const detailDisplay = document.createElement("p");
    const descriptionDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const moreDisplay = document.createElement("p");

    // Fix: textContent must target the variable you created (placeDisplay)
    placeDisplay.textContent = (`${name} (ID: ${id})`);
    placeDisplay.classList.add("placeDisplay");
    card.appendChild(placeDisplay);

    // Celsius Display
    tempDisplay.textContent = `${temp} °C`;
    tempDisplay.classList.add("tempDisplay");
    card.appendChild(tempDisplay);

    //Coordinates Display
    coordDisplay.textContent = (`Latitude: ${lat}; Longitude: ${lon}`);
    coordDisplay.classList.add("coordDisplay");
    card.appendChild(coordDisplay);

    // Visibility Display
    vsisbilityDisplay.textContent = (`Visibility: this is how far your eyes can see in meters- ${visibility}`);
    vsisbilityDisplay.classList.add("visibilityDisplay");
    card.appendChild(vsisbilityDisplay);


    // Humidity Display
    detailDisplay.textContent = (`Timezone Offset from Greenwhich Meridian: ${timezone} seconds`);
    detailDisplay.classList.add("detailDisplay");
    card.appendChild(detailDisplay);

    // Description Display
    descriptionDisplay.textContent = (`Description: ${description} (Weather Code: ${weatherId})`);
    descriptionDisplay.classList.add("descriptionDisplay");
    card.appendChild(descriptionDisplay);

    // Weather Emoji Display
    weatherEmoji.textContent = getweatherEmoji(weatherId);
    weatherEmoji.classList.add("weatherEmoji");
    card.appendChild(weatherEmoji);

    // Humidity Display
    humidityDisplay.textContent = (`Sunrise: ${new Date(sunrise * 1000).toLocaleTimeString()}; Sunset: ${new Date(sunset * 1000).toLocaleTimeString()}; Humidity: ${humidity}% ;Feels Like: ${feels_like} °C;
        Time-Checked: ${new Date(dt * 1000).toLocaleTimeString()}; `) ;
    humidityDisplay.classList.add("humidityDisplay");
    card.appendChild(humidityDisplay);
    
    // More Display
    moreDisplay.textContent = (`  Wind Speed: ${speed} m/s; Wind Direction: ${deg}°; Ground Level Pressure: ${grnd_level} hPa;  Raw Timestamp (dt): ${dt}`);
    moreDisplay.classList.add("moreDisplay");
    card.appendChild(moreDisplay);
}

function getweatherEmoji(weatherId){
    // Code for weather emojis based on weather ID condition codes
    switch(true){
        case (weatherId >= 200 && weatherId < 300): return "⛈️"; // Thunderstorm
        case (weatherId >= 300 && weatherId < 400): return "🌦️"; // Drizzle
        case (weatherId >= 500 && weatherId < 600): return "🌧️"; // Rain
        case (weatherId >= 600 && weatherId < 700): return "❄️"; // Snow
        case (weatherId === 800): return "☀️"; // Clear sky
        case (weatherId > 800 && weatherId < 900): return "🌤️"; // Clouds
        default: return "🌈"; // Default emoji for other conditions
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;  
    errorDisplay.classList.add("errorDisplay");  

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}

