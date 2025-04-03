import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchWeatherApi } from "openmeteo";
import DashboardPilot from "./Pages/TopDashboard";
import BottomDashboard from "./Pages/BottomDashboard";
import ForecastChartModal from "./Components/ForecastChartModal";
import airportData from "./data/airports.json";

const API_KEY = "fea9b6cd12a559d291134b1904bc1281";

const App = () => {
  const [gpsCode, setGpsCode] = useState("EGLL"); // used for AVWX
  const [city, setCity] = useState("London");   // u
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [uvIndex, setUvIndex] = useState("N/A");
  const [dewPoint, setDewPoint] = useState("N/A");
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(null);

  // Fetch weather for OpenWeather
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
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

        const { lat, lon } = response.data.coord;

        try {
          const uvParams = { latitude: lat, longitude: lon, daily: "uv_index_max", timezone: "auto" };
          const uvResponse = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", uvParams);
          const uvArray = uvResponse[0]?.daily?.()?.variables?.(0)?.valuesArray?.();
          if (uvArray?.length > 0) setUvIndex(Math.round(uvArray[0]));
        } catch (err) {
          console.warn("⚠️ UV index fetch failed:", err);
        }

        try {
          const dewParams = { latitude: lat, longitude: lon, daily: "dew_point_2m", timezone: "auto" };
          const dewResponse = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", dewParams);
          const dewArray = dewResponse[0]?.daily?.()?.variables?.(0)?.valuesArray?.();
          if (dewArray?.length > 0) setDewPoint(Math.round(dewArray[0]));
        } catch (err) {
          console.warn("⚠️ Dew point fetch failed:", err);
        }

      } catch (error) {
        console.error("Error fetching weather data", error);
      }
      setLoading(false);
    };

    fetchWeather();
  }, [city]);

  // Match airport using gpsCode
  useEffect(() => {
    const matchedAirport = airportData.find(
      (a) => a.gps_code?.toUpperCase() === gpsCode.toUpperCase()
    );
    setSelectedAirport(matchedAirport || null);
  }, [gpsCode]);

  // Generate alerts from weather conditions
  useEffect(() => {
    if (weather && uvIndex !== "N/A" && hourlyForecast.length > 0) {
      generateFlightAlerts(weather, uvIndex, hourlyForecast);
    }
  }, [weather, uvIndex, hourlyForecast]);

  // Load temp chart
  const loadChartData = async () => {
    if (!weather) return;
    const { lat, lon } = weather.coord;
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=auto`
      );
      const data = await response.json();
      const formatted = data.hourly?.time?.slice(0, 24).map((t, i) => ({
        time: new Date(t).toLocaleTimeString([], { hour: "2-digit" }),
        temperature: Math.round(data.hourly.temperature_2m[i])
      }));
      setChartData(formatted);
      setShowChart(true);
    } catch (err) {
      console.error("📉 Failed to load chart data:", err);
    }
  };

  const generateFlightAlerts = (weather, uvIndex, forecast) => {
    const alerts = [];
    if (weather.wind.speed > 12) alerts.push("🛫 Crosswind alert");
    if (weather.visibility < 1500) alerts.push("🌫️ Low visibility");
    if (weather.main.temp > 38) alerts.push("🌡️ Extreme heat");
    if (weather.main.temp < 0) alerts.push("❄️ Freezing conditions");
    if (uvIndex >= 8) alerts.push("☀️ High UV index");
    setActiveAlerts(alerts);
  };

  return (
    <div className="bg-[#161f2c] text-white font-['Inter']">
      <DashboardPilot
        weather={weather}
        hourlyForecast={hourlyForecast}
        dailyForecast={dailyForecast}
        uvIndex={uvIndex}
        dewPoint={dewPoint}
        loading={loading}
        city={city}
        setCity={setCity}
        setGpsCode={setGpsCode}
        loadChartData={loadChartData}
        activeAlerts={activeAlerts}
        selectedAirport={selectedAirport}
      />
      <BottomDashboard
        city={city}
        setCity={setCity}
        selectedAirport={selectedAirport}
      />
      {showChart && <ForecastChartModal data={chartData} onClose={() => setShowChart(false)} />}
    </div>
  );
};

export default App;
