import React, { useState, useEffect } from "react";
import styles from "./Weather.module.css";
import search_icon from "../assets/search.png";

const WeatherApp = () => {
  const api_key = "536266bfffb7f5362a9cacd09cc0720a";
  const [icon_url, setIconUrl] = useState("http://openweathermap.org/img/wn/01d@2x.png");
  const [city, setCity] = useState("Hyderabad");
  const [humidity, setHumidity] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [description, setDescription] = useState(null);
  const [feelsLike, setFeelsLike] = useState(null);
  const [temp, setTemp] = useState(null);
  const [tempMin, setTempMin] = useState(null);
  const [tempMax, setTempMax] = useState(null);
  const [location, setLocation] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [phrase, setPhrase] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

  function getWindDirection(degrees) {
    const directions = ["North", "N-E", "East", "S-E", "South", "S-W", "West", "N-W"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  const search = async (lat, long) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${api_key}`;
      if (lat) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=Metric&appid=${api_key}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setCity("");
      const windDirection = getWindDirection(data.wind.deg);
      setLocation(data.name + ", " + data.sys.country);
      setHumidity(data.main.humidity);
      setPressure(data.main.pressure);
      setVisibility(Number(data.visibility) / 1000);
      setTempMax(Math.round(data.main.temp_max));
      setTempMin(Math.round(data.main.temp_min));
      setPhrase(data.weather[0].main);
      setWindSpeed(Math.round(data.wind.speed) + " km/h " + windDirection);
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

      const sunriseTimestamp = data.sys.sunrise;
      const sunsetTimestamp = data.sys.sunset;

      const sunriseDate = new Date(sunriseTimestamp * 1000);
      const sunsetDate = new Date(sunsetTimestamp * 1000);

      const sunriseTime = sunriseDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const sunsetTime = sunsetDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setSunrise(sunriseTime);
      setSunset(sunsetTime);
      setTemp(Math.round(data.main.temp));
      setFeelsLike(Math.round(data.main.feels_like));
      setDescription(data.weather[0].description);
      setIconUrl("http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    search();
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          search(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const getWeatherMessage = () => {
    if (!phrase) return "";
    const messages = {
      Clear: "It's a clear and sunny day, enjoy the sunshine!",
      Clouds: "It's a bit cloudy today, a good day for a walk!",
      Rain: "Don't forget your umbrella, it's raining!",
      Thunderstorm: "Stay indoors, there's a thunderstorm!",
      Snow: "It's snowing, stay warm!",
      Mist: "Visibility is low due to mist.",
      Fog: "Drive carefully, it's foggy.",
      Drizzle: "Light rain, might need a light jacket.",
    };
    return messages[phrase] || "Weather looks fine today!";
  };

  return (
    <div className={styles.weatherApp}>
      <div className={styles.weatherContainer}>
        <div className={styles.weatherAppTopBar}>
          <h1>{location}</h1>
          <h1>{time}</h1>
        </div>
        <div className={styles.weatherTopBar}>
            <input
              type="text"
              style={{ color: 'black' }}
              className={styles.cityInput}
              placeholder="Search..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className={styles.weatherSearchIcon} onClick={getLocation}>
              <img
                src="https://img.icons8.com/material-outlined/24/marker.png"
                alt="Locate"
              />
            </div>
          </div>
        <div className={styles.weatherAppBottomBar}>
          <div className={styles.currentWeather}>
            <div className={styles.currentWeatherInfo}>
              <img src={icon_url} alt="WeatherIcon" className={styles.weatherIcon} />
              <div className={styles.temp}>
                <div className={styles.displayTemp}>
                  {temp}
                  <sup> o</sup>
                  <span className={styles.weatherSub}>C</span>
                </div>
              </div>
            </div>
            
          </div>
          <div className={styles.weatherPhrase}>{phrase}</div>
          <div className={styles.weatherMessage}>{getWeatherMessage()}</div>
          <div className={styles.weatherDetails}>
            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Feels Like</div>
              <div className={styles.weatherItemValue} id="feels-like">
                {feelsLike} <sup>o</sup>c
              </div>
            </div>

            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Description</div>
              <div className={styles.weatherItemValue} id="description">
                {description}
              </div>
            </div>
          
            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Pressure</div>
              <div className={styles.weatherItemValue} id="pressure">
                {pressure} hPa
              </div>
            </div>

            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Humidity</div>
              <div className={styles.weatherItemValue} id="humidity-percent">
                {humidity} %
              </div>
            </div>
          
            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Wind Speed</div>
              <div className={styles.weatherItemValue} id="wind-speed">
                {windSpeed}
              </div>
            </div>

            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Visibility</div>
              <div className={styles.weatherItemValue} id="visibility">
                {visibility} km
              </div>
            </div>
          
            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Max Temperature</div>
              <div className={styles.weatherItemValue} id="max-temp">
                {tempMax} <sup>o</sup>c
              </div>
            </div>

            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Min Temperature</div>
              <div className={styles.weatherItemValue} id="min-temp">
                {tempMin} <sup>o</sup>c
              </div>
            </div>
          
            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Sunrise</div>
              <div className={styles.weatherItemValue} id="sunrise">
                {sunrise}
              </div>
            </div>

            <div className={styles.weatherItems}>
              <div className={styles.weatherItemName}>Sunset</div>
              <div className={styles.weatherItemValue} id="sunset">
                {sunset}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
