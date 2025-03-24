import React, { useEffect, useState } from "react";
import WeatherDetails from "../Components/WeatherDetails";
import SideBar from "../Components/SideBar";
import Dropdown from "../Components/Dropdown";



const API_KEY = "fea9b6cd12a559d291134b1904bc1281"; // OpenWeather API key goes here. 
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedAirport}&appid=${API_KEY}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === 200 && data.main) {
            setWeather({
                temp: data.main.temp,
                feelsLike: data.main.feels_like,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                uvIndex: 4, // Placeholder, OpenWeather requires a separate API for UV
                visibility: data.visibility ? data.visibility / 1000 : "N/A", // Convert meters to km
                description: data.weather[0].description,
                icon: data.weather[0].icon,
            });
            } else {
            setWeather(null);
            }
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            setWeather(null);
            setLoading(false);
        });
    }, [selectedAirport]);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar"> 
        <div className="navbar__logo">
            <p>Aviation WX</p>
        </div>
        {/* Airport DropDown Menu */}
        <div className="navbar__dropdown">
            <Dropdown airports={airports} setSelectedAirport={setSelectedAirport} />
        </div>
        <div className="navbar__nav-links">
          <a href="#" className="navbar__link">Overview</a>
          <a href="#" className="navbar__link">Weather Map</a>
          <a href="#" className="navbar__link">Reports</a>
        </div>
        <SideBar/>
      </nav>
      <div className="weather-header">
        <p className="weather-header__title">Current Airport Weather</p>
        <div className="weather-header__dropdown-container">
            <Dropdown airports={airports} setSelectedAirport={setSelectedAirport}/>
        </div>
    </div>

        <div className="weather-dashboard">
            {/* Weather Overview */}
            {loading ? (
                <p className="weather-dashboard__loading">Loading weather data.</p>
            ) : weather ? (
                <section className="weather-dashboard__overview">
                {/* Current Weather Card */}
                <div className="weather-card weather-card--current">
                    <h2 className="weather-card__title">{airports.find(a => a.code === selectedAirport)?.name} ({selectedAirport})</h2>
                    <div className="weather-card__temp-container">
                    <img 
                        src={`https://openweathermap.org/img/wn/${weather.icon}.png`} 
                        className="weather-card__icon" 
                        alt="Weather icon"
                    />
                    <div className="weather-card__temp-value">{Math.round(weather.temp)}°C</div>
                    </div>
                    <div className="weather-card__details">
                    <p>Feels like: {weather.feelsLike}°C</p>
                    <p>{weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</p>
                    </div>
                </div>

                {/* Hourly Forecast Card */}
                <div className="weather-card weather-card--hourly">
                    <div className="hourly-forecast__times">
                    <div className="hourly-forecast__time">NOW</div>
                    <div className="hourly-forecast__time">10AM</div>
                    <div className="hourly-forecast__time">11AM</div>
                    <div className="hourly-forecast__time">12PM</div>
                    </div>
                    <div className="hourly-forecast__icons">
                    <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="" />
                    </div>
                    <div className="hourly-forecast__temps">
                    <div className="hourly-forecast__temp">{Math.round(weather.temp)}°C</div>
                    <div className="hourly-forecast__temp"></div>
                    <div className="hourly-forecast__temp"></div>
                    <div className="hourly-forecast__temp"></div>
                    </div>
                </div>

                {/* Daily Forecast Card */}
                <div className="weather-card weather-card--daily">
                    <div className="daily-forecast">
                    <div className="daily-forecast__day">Today</div>
                    <div className="daily-forecast__day">Tuesday</div>
                    <div className="daily-forecast__day">Wednesday</div>
                    <div className="daily-forecast__day">Thursday</div>
                    </div>  
                </div>
                </section>
            ) : (
                <p className="weather-dashboard__error">⚠️ Weather data unavailable ⚠️</p>
            )}

      {/* Weather Details */}
        <section className="weather-details">
        {/* Humidity Card */}
        <div className="weather-details__card weather-details__card--humidity">
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

        {/* Wind Speed Card */}
        <div className="weather-details__card weather-details__card--wind">
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

        {/* UV Index Card */}
        <div className="weather-details__card weather-details__card--uv">
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

        {/* Visibility Card */}
        <div className="weather-details__card weather-details__card--visibility">
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
        </section>


      {/* Runway Conditions */}
        <section className="runway-conditions">
            <div className="runway-conditions__container">
                <h3 className="runway-conditions__title">Runway Conditions</h3>
                <img src="./src/assets/plane.svg" className="runway-conditions__plane" alt="Plane illustration"/>
            </div>
            </section>

            {/* Active Alerts */}
            <section className="active-alerts">
                <h3 className="active-alerts__title">Active Alerts</h3>
                <p className="active-alerts__warning">⚠️ Strong turbulence expected, reroute advised.</p>
                <p className="active-alerts__meta">Time: 09:00 UTC | Region: London FIR</p>
        </section>
      </div>
      </div>
  );
};

export default DashboardPilot;
