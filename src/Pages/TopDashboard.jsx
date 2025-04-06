import React, { useEffect, useState } from "react";
import WeatherDetails from "../Components/WeatherDetails";
import SideBar from "../Components/SideBar";
import Dropdown from "../Components/Dropdown";

  return (
    <div>
      {/* Navbar */}
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

      <p className="weather-header__title">Current Airport Weather</p>

      <div className="weather-dashboard">
        <div className="weather-header__dropdown-container">
          <Dropdown airports={airports} setSelectedAirport={setSelectedAirport} />
        </div>

        {loading ? (
          <p className="weather-dashboard__loading">Loading weather data...</p>
        ) : weather ? (
          <section className="weather-dashboard__overview">
            {/* Current Weather Card */}
            <div className="weather-card-current">
              <div className="navy-box">
                <h2 className="weather-card__title">
                  {selectedAirport.name} ({selectedAirport.code})
                </h2>
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
            </div>

            {/* Hourly Forecast Card */}
            <div className="weather-card-hourly">
              <div className="navy-box">
                <div className="weather-card-hourly-inner">
                  <div className="hourly-forecast__times">
                    <div className="hourly-forecast__time">NOW</div>
                    <div className="hourly-forecast__time">10AM</div>
                    <div className="hourly-forecast__time">11AM</div>
                    <div className="hourly-forecast__time">12PM</div>
                  </div>
                  <div className="hourly-forecast__icons">
                    <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="Hourly" />
                  </div>
                  <div className="hourly-forecast__temps">
                    <div className="hourly-forecast__temp">{Math.round(weather.temp)}°C</div>
                    <div className="hourly-forecast__temp">--</div>
                    <div className="hourly-forecast__temp">--</div>
                    <div className="hourly-forecast__temp">--</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Forecast Card */}
            <div className="weather-card-daily">
              <div className="navy-box">
                <div className="daily-forecast">
                  <div className="daily-forecast__day">Today</div>
                  <div className="daily-forecast__day">Tuesday</div>
                  <div className="daily-forecast__day">Wednesday</div>
                  <div className="daily-forecast__day">Thursday</div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <p className="weather-dashboard__error">⚠️ Weather data unavailable ⚠️</p>
        )}

        {/* Humidity Card */}
        <div className="weather-details-humidity">
          <div className="navy-box">
            <div className="weather-details__header">
              <span>Humidity</span>
              <img src="./src/assets/Droplet.svg" className="weather-details__icon" alt="Humidity icon" />
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
              <img src="./src/assets/polygon.svg" className="weather-details__icon" alt="Wind icon" />
            </div>
            <div className="weather-details__value">
              {weather ? <img src="./src/assets/windspeed.png" className="weather-details__wind-graphic" /> : "N/A"}
            </div>
            <div className="weather-details__description">
              {weather ? `${weather.windSpeed} km/h` : "N/A"}
            </div>
          </div>
        </div>

        {/* UV Index Card */}
        <div className="weather-details-uv">
          <div className="navy-box">
            <div className="weather-details__header">
              <span>UV Index</span>
              <img src="./src/assets/Sun.svg" className="weather-details__icon" alt="UV icon" />
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
              <img src="./src/assets/eye.svg" className="weather-details__icon" alt="Visibility icon" />
            </div>
            <div className="weather-details__value">
              {weather ? (
                <>
                  <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} className="weather-details__weather-icon" alt="Weather icon" />
                  {weather.visibility} km
                </>
              ) : "N/A"}
            </div>
            <div className="weather-details__description">
              {weather ? "Visibility based on current METAR report" : ""}
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
            <p className="active-alerts__warning">⚠️ Strong turbulence expected, reroute advised.</p>
            <p className="active-alerts__meta">Time: 09:00 UTC | Region: {selectedAirport.city} FIR</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPilot;
