import React, { useState } from "react";
import './App.css';
import snow from "./assets/snow.svg"
import storm from "./assets/storm.svg"
import rain from "./assets/rain.svg"
import haze from "./assets/haze.svg"
import cloud from "./assets/cloud.svg"
import clear from "./assets/clear.svg"




const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [infoText, setInfoText] = useState("");
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const apiKey = "a07c7793169c3b7171c260ca5b9e3667";

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter" && city !== "") {
      requestApi(city);
    }
  };

  const requestApi = (city) => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData(api);
  };

  const getDeviceLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert("Your browser does not support geolocation API");
    }
  };

  const onSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData(api);
  };

  const onError = (error) => {
    setInfoText(error.message);
    setError(true);
  };

  const fetchData = (api) => {
    setIsPending(true);
    setInfoText("Getting weather details...");
    fetch(api)
      .then((res) => res.json())
      .then((result) => {
        if (result.cod === "404") {
          setInfoText(`${city} isn't a valid city name`);
          setError(true);
        } else {
          weatherDetails(result);
          setError(false);
        }
        setIsPending(false);
      })
      .catch(() => {
        setInfoText("Something went wrong");
        setError(true);
        setIsPending(false);
      });
  };

  const weatherDetails = (info) => {
    const { name: city, sys: { country }, weather, main: { temp, feels_like, humidity } } = info;
    const { description, id } = weather[0];
    let iconSrc = "";

    if (id === 800) {
      iconSrc = { clear };
    } else if (id >= 200 && id <= 232) {
      iconSrc = { storm };
    } else if (id >= 600 && id <= 622) {
      iconSrc = { snow };
    } else if (id >= 701 && id <= 781) {
      iconSrc = { haze };
    } else if (id >= 801 && id <= 804) {
      iconSrc = { cloud };
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      iconSrc = { rain };
    }

    setWeatherData({
      temp: Math.floor(temp),
      feels_like: Math.floor(feels_like),
      humidity: `${humidity}%`,
      description,
      city,
      country,
      icon: iconSrc,
    });
    setInfoText("");
  };

  return (
    <div className={`wrapper ${weatherData ? "active" : ""}`}>
      <header><i className='bx bx-left-arrow-alt'></i>Weather App</header>

      <section className="input-part">
        <p className={`info-txt ${error ? "error" : isPending ? "pending" : ""}`}>{infoText}</p>
        <div className="content">
          <input
            type="text"
            spellCheck="false"
            placeholder="Enter city name"
            value={city}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            required
          />
          <div className="separator"></div>
          <button onClick={getDeviceLocation}>Get Device Location</button>
        </div>
      </section>

      {weatherData && (
        <section className="weather-part">
          <img src={weatherData.icon} alt="Weather Icon" />
          <div className="temp">
            <span className="numb">{weatherData.temp}</span>
            <span className="deg">°</span>C
          </div>
          <div className="weather">{weatherData.description}</div>
          <div className="location">
            <i className='bx bx-map'></i>
            <span>{weatherData.city}, {weatherData.country}</span>
          </div>
          <div className="bottom-details">
            <div className="column feels">
              <i className='bx bxs-thermometer'></i>
              <div className="details">
                <div className="temp">
                  <span className="numb-2">{weatherData.feels_like}</span>
                  <span className="deg">°</span>C
                </div>
                <p>Feels like</p>
              </div>
            </div>
            <div className="column humidity">
              <i className='bx bxs-droplet-half'></i>
              <div className="details">
                <span>{weatherData.humidity}</span>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default App;
