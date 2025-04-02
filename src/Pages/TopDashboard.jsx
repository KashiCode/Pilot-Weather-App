import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherDetails from "../Components/WeatherDetails";
import SideBar from "../Components/SideBar";
import SearchBar from "../Components/Search";

const API_KEY = "fea9b6cd12a559d291134b1904bc1281";

const DashboardPilot = () => {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

      const fetchWeather = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          setWeather(response.data);
          const forecastResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
          );
          setHourlyForecast(forecastResponse.data.list.slice(0, 5));
          setDailyForecast(forecastResponse.data.list.filter((_, index) => index % 8 === 0));
        } catch (error) {
          console.error("Error fetching weather data", error);
        }

        setLoading(false);
      };
      fetchWeather();
  }, [city]);

  const formatHour = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit" });

  const formatDay = (timestamp) =>
    new Date(timestamp * 1000).toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div>
      <nav className="navbar">
        <div className="navbar__logo">
          <p>Aviation WX</p>
        </div>
        <div className="navbar__dropdown">
          <SearchBar setCity={setCity} />
        </div>
        <div className="navbar__nav-links">
          <a href="#" className="navbar__link">Overview</a>
          <a href="#" className="navbar__link">Weather Map</a>
          <a href="#" className="navbar__link">Reports</a>
        </div>
        <SideBar />
      </nav>
  
      <div className="weather-header">
        <p className="weather-header__title">Current Weather</p>
        <div className="weather-header__dropdown-container">
          {/* <Dropdown airports={airports} setSelectedAirport={setSelectedAirport} /> */}
        </div>
      </div>
  
      <div className="weather-dashboard">
        {loading ? (
          <p className="weather-dashboard__loading">Loading weather data...</p>
        ) : weather ? (
          <section className="weather-dashboard__overview">
            <div className="weather-card-current">
              <div className="navy-box">
                <h2 className="weather-card__title">{weather.name} ({weather.sys.country})</h2>
                <div className="weather-card__temp-container">
                  <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} className="weather-card__icon" alt="Weather icon" />
                  <div className="weather-card__temp-value">{Math.round(weather.main.temp)}°C</div>
                </div>
                <div className="weather-card__details">
                  <p>Feels like: {weather.main.feels_like}°C</p>
                  <p>{weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}</p>
                </div>
              </div>
            </div>
  
            <div className="weather-card-hourly">
              <div className="navy-box">
                <div className="hourly-forecast__times">
                  {hourlyForecast.map((h, i) => (
                    <div className="hourly-forecast__time" key={i}>
                      {i === 0 ? "NOW" : formatHour(h.dt)}
                    </div>
                  ))}
                </div>
                <div className="hourly-forecast__icons">
                  {hourlyForecast.map((h, i) => (
                    <img
                      key={i}
                      src={`https://openweathermap.org/img/wn/${h.weather[0].icon}.png`}
                      alt={h.weather[0].description}
                    />
                  ))}
                </div>
                <div className="hourly-forecast__temps">
                  {hourlyForecast.map((h, i) => (
                    <div className="hourly-forecast__temp" key={i}>
                      {Math.round(h.main.temp)}°C
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            <div className="weather-card-daily">
              <div className="navy-box">
                <div className="daily-forecast">
                  {dailyForecast.map((d, i) => (
                    <div className="daily-forecast__row" key={i}>
                      <span className="daily-forecast__day">
                        {i === 0 ? "Today" : formatDay(d.dt)}
                      </span>
                      <img
                        className="daily-forecast__icon"
                        src={`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`}
                        alt={d.weather[0].description}
                      />
                      <span className="daily-forecast__temp">
                        {Math.round(d.main.temp)}°C
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <p className="weather-dashboard__error">Error loading weather data</p>
        )}
  
        {/* Weather Details */}
          <div className="weather-details-humidity">
            <div className="navy-box">
              <div className="weather-details__header">
                <span>Humidity</span>
                <img src="./src/assets/Droplet.svg" className="weather-details__icon" alt="Humidity icon" />
              </div>
              <div className="weather-details__value">
                {weather ? `${weather.main.humidity}%` : "N/A"}
              </div>
              <div className="weather-details__description">
                        {weather ? "Moderate" : ""}
                </div>
            </div>
          </div>
  
          <div className="weather-details-wind">
            <div className="navy-box">
              <div className="weather-details__header">
                <span>Wind Speed</span>
                <img src="./src/assets/polygon.svg" className="weather-details__icon" alt="Wind icon" />
              </div>
              <div className="weather-details__value">
                        {weather ? <img src="./src/assets/windspeed.png" className="weather-details__wind-graphic"/> : "N/A"}
                </div>
              <div className="weather-details__description">
                {weather ? `${weather.wind.speed} km/h` : "N/A"}
              </div>
            </div>
          </div>
  
          <div className="weather-details-uv">
            <div className="navy-box">
              <div className="weather-details__header">
                <span>UV Index</span>
                <img src="./src/assets/Sun.svg" className="weather-details__icon" alt="UV icon" />
              </div>
              <div className="weather-details__value">
                {weather ? `${weather.main.uvi}` : "N/A"}
              </div>
              <div className="weather-details__description">
                    {weather ? "Moderate" : ""}
                </div>
            </div>
          </div>
  
          <div className="weather-details-visibility">
            <div className="navy-box">
              <div className="weather-details__header">
                <span>Visibility</span>
                <img src="./src/assets/eye.svg" className="weather-details__icon" alt="Visibility icon" />
              </div>
              <div className="weather-details__value">
              {weather ? (
                <>
              <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} className="weather-details__weather-icon" />
                 {weather.visibility / 1000} km </>
                ) : "N/A"}
              </div>
              <div className="weather-details__description">
                    {weather ? "Similar to the actual temperature" : ""}
                </div>
            </div>
          </div>
  
        {/* Runway Conditions */}
        <section className="runway-conditions">
          <div className="navy-box">
            <div className="runway-conditions__container">
              <h3 className="runway-conditions__title">Runway Conditions</h3>
              <div className="svg-plane-img-container">
                <img src="./src/assets/plane.svg" className="runway-conditions__plane" alt="Plane illustration" />
              </div>
            </div>
          </div>
        </section>
  
        {/* Active Alerts */}
        <section className="active-alerts">
          <div className="navy-box">
            <h3 className="active-alerts__title">Active Alerts</h3>
            <p className="active-alerts__warning">
              ⚠️ Strong turbulence expected, reroute advised.
            </p>
            <p className="active-alerts__meta">Time: 09:00 UTC | Region: London FIR</p>
          </div>
        </section>
      </div>
    </div>
  );
  
};

export default DashboardPilot;
