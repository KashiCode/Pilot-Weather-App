import React, { useEffect, useState } from "react";
import WeatherDetails from "../Components/WeatherDetails";
import SideBar from "../Components/SideBar";
import Dropdown from "../Components/Dropdown";

const API_KEY = "fea9b6cd12a559d291134b1904bc1281";
const airports = [
  { code: "London", name: "London Heathrow" },
  { code: "Paris", name: "Paris Charles de Gaulle" },
  { code: "Frankfurt", name: "Frankfurt Airport" },
  { code: "Dubai", name: "Dubai International" },
  { code: "Tokyo", name: "Tokyo Haneda" },
];

const DashboardPilot = () => {
  const [selectedAirport, setSelectedAirport] = useState(airports[0].code);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const [weatherRes, forecastRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedAirport}&appid=${API_KEY}&units=metric`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedAirport}&appid=${API_KEY}&units=metric`)
        ]);

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        if (weatherData.cod === 200 && weatherData.main) {
          setWeather({
            temp: weatherData.main.temp,
            feelsLike: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            uvIndex: 4,
            visibility: weatherData.visibility ? weatherData.visibility / 1000 : "N/A",
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
          });
        } else {
          setWeather(null);
        }

        if (forecastData.cod === "200") {
          setForecast(forecastData.list);
        } else {
          setForecast([]);
        }
      } catch (error) {
        console.error("Error fetching weather/forecast data:", error);
        setWeather(null);
        setForecast([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedAirport]);

  const formatHour = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit" });

  const formatDay = (timestamp) =>
    new Date(timestamp * 1000).toLocaleDateString("en-US", { weekday: "long" });

  const hourlyForecast = forecast.slice(0, 4);
  const dailyForecast = forecast.filter((_, i) => i % 8 === 0).slice(0, 4);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar__logo">
          <p>Aviation WX</p>
        </div>
        <div className="navbar__dropdown">
          <Dropdown airports={airports} setSelectedAirport={setSelectedAirport} />
        </div>
        <div className="navbar__nav-links">
          <a href="#" className="navbar__link">Overview</a>
          <a href="#" className="navbar__link">Weather Map</a>
          <a href="#" className="navbar__link">Reports</a>
        </div>
        <SideBar />
      </nav>

      <div className="weather-header">
        <p className="weather-header__title">Current Airport Weather</p>
        <div className="weather-header__dropdown-container">
          <Dropdown airports={airports} setSelectedAirport={setSelectedAirport} />
        </div>
      </div>

      <div className="weather-dashboard">
        {loading ? (
          <p className="weather-dashboard__loading">Loading weather data.</p>
        ) : weather ? (
          <section className="weather-dashboard__overview">
            <div className="weather-card-current">
              <div className="navy-box">
                <h2 className="weather-card__title">{airports.find(a => a.code === selectedAirport)?.name} ({selectedAirport})</h2>
                <div className="weather-card__temp-container">
                  <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} className="weather-card__icon" alt="Weather icon" />
                  <div className="weather-card__temp-value">{Math.round(weather.temp)}°C</div>
                </div>
                <div className="weather-card__details">
                  <p>Feels like: {weather.feelsLike}°C</p>
                  <p>{weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</p>
                </div>
              </div>
            </div>

            <div className="weather-card-hourly">
              <div className="navy-box">
                <div className="hourly-forecast__times">
                  {hourlyForecast.map((h, i) => (
                    <div className="hourly-forecast__time" key={i}>{i === 0 ? "NOW" : formatHour(h.dt)}</div>
                  ))}
                </div>
                <div className="hourly-forecast__icons">
                  {hourlyForecast.map((h, i) => (
                    <img key={i} src={`https://openweathermap.org/img/wn/${h.weather[0].icon}.png`} alt={h.weather[0].description} />
                  ))}
                </div>
                <div className="hourly-forecast__temps">
                  {hourlyForecast.map((h, i) => (
                    <div className="hourly-forecast__temp" key={i}>{Math.round(h.main.temp)}°C</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="weather-card-daily">
              <div className="navy-box">
                <div className="daily-forecast">
                  {dailyForecast.map((d, i) => (
                    <div className="daily-forecast__row" key={i}>
                      <span className="daily-forecast__day">{i === 0 ? "Today" : formatDay(d.dt)}</span>
                      <img className="daily-forecast__icon" src={`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`} alt={d.weather[0].description} />
                      <span className="daily-forecast__temp">{Math.round(d.main.temp)}°C</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <p className="weather-dashboard__error">⚠️ Weather data unavailable ⚠️</p>
        )}

            {/* Weather Details */}
            {/* Humidity Card */}
            <div className="weather-details-humidity">
                <div className="navy-box">
                <div className="weather-details__header">
                    <span>Humidity</span>
                        <img src="./src/assets/Droplet.svg" className="weather-details__icon" alt="Humidity icon"/>
                    </div>
                    <div className="weather-details__value">
                        {weather ? `${weather.humidity}%` : "N/A"}
                    </div>
                    <div className="weather-details__description">
                        {weather ? "Moderate" : ""}
                </div>
                </div>
            </div>

            {/* Wind Speed Card */}
            <div className="weather-details-wind">
                <div className="navy-box">
                <div className="weather-details__header">
                    <span>Wind Speed</span>
                        <img src="./src/assets/polygon.svg" className="weather-details__icon" alt="Wind icon"/>
                    </div>
                    <div className="weather-details__value">
                        {weather ? <img src="./src/assets/windspeed.png" className="weather-details__wind-graphic"/> : "N/A"}
                    </div>
                    <div className="weather-details__description">
                        {weather ? `${weather.windSpeed}km/h 9:00` : "N/A"}
                    </div>
                </div>
            </div>

            {/* UV Index Card */}
            <div className="weather-details-uv">
                <div className="navy-box">
                <div className="weather-details__header">
                    <span>UV Index</span>
                    <img src="./src/assets/Sun.svg" className="weather-details__icon" alt="UV icon"/>
                </div>
                <div className="weather-details__value">
                    {weather ? `${weather.uvIndex}` : "N/A"}
                </div>
                <div className="weather-details__description">
                    {weather ? "Moderate" : ""}
                </div>
                </div>
            </div>

            {/* Visibility Card */}
            <div className="weather-details-visibility">
                <div className="navy-box">
                <div className="weather-details__header">
                    <span>Visibility</span>
                    <img src="./src/assets/eye.svg" className="weather-details__icon" alt="Visibility icon"/>
                </div>
                <div className="weather-details__value">
                    {weather ? (
                    <>
                    <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} className="weather-details__weather-icon" />
                    {weather.visibility}km
                    </>
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
                                <img src="./src/assets/plane.svg" className="runway-conditions__plane" alt="Plane illustration"/>
                            </div>
                        </div>
                    </div>
                </section>

                    {/* Active Alerts */}
                    <section className="active-alerts">
                    <div className="navy-box">
                        <h3 className="active-alerts__title">Active Alerts</h3>
                        <p className="active-alerts__warning">⚠️ Strong turbulence expected, reroute advised.</p>
                        <p className="active-alerts__meta">Time: 09:00 UTC | Region: London FIR</p>
                    </div>
                    </section>
            </div>
        </div>
  );
};

export default DashboardPilot;
