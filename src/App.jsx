import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchWeatherApi } from "openmeteo";
import DashboardPilot from "./Pages/TopDashboard";
import BottomDashboard from "./Pages/BottomDashboard";


const API_KEY = "fea9b6cd12a559d291134b1904bc1281";

const App = () => {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [uvIndex, setUvIndex] = useState("N/A");
  const [dewPoint, setDewPoint] = useState("N/A");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Fetch current weather
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);

        // Fetch hourly and daily forecast
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        setHourlyForecast(forecastResponse.data.list.slice(0, 5));
        setDailyForecast(forecastResponse.data.list.filter((_, index) => index % 8 === 0));

        // Get lat/lon for UV Index and Dew Point
        const { lat, lon } = response.data.coord;
        const open_meteo_url = "https://api.open-meteo.com/v1/forecast";

        // Fetch UV index
        try {
          const uvParams = { latitude: lat, longitude: lon, daily: "uv_index_max", timezone: "auto" };
          const uvResponse = await fetchWeatherApi(open_meteo_url, uvParams);
          if (uvResponse.length > 0) {
            const daily = uvResponse[0].daily?.();
            const uvArray = daily?.variables?.(0)?.valuesArray?.();
            if (uvArray && uvArray.length > 0) {
              setUvIndex(Math.round(uvArray[0]));
            }
          }
        } catch (err) {
          console.warn("⚠️ UV index fetch failed:", err);
        }

        // Fetch dew point
        try {
          const dewParams = { latitude: lat, longitude: lon, daily: "dew_point_2m", timezone: "auto" };
          const dewResponse = await fetchWeatherApi(open_meteo_url, dewParams);
          if (dewResponse.length > 0) {
            const daily = dewResponse[0].daily?.();
            const dewArray = daily?.variables?.(0)?.valuesArray?.();
            if (dewArray && dewArray.length > 0) {
              setDewPoint(Math.round(dewArray[0]));
            }
          }
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

  return (
    <div className="bg-[#161f2c] text-white relative bg-[radial-gradient(ellipse_50.00%_50.00%_at_50.00%_50.00%,_#253244_0%,_#141D2A_100%)] overflow-hidden font-normal font-['Inter']">
      <DashboardPilot
        weather={weather}
        hourlyForecast={hourlyForecast}
        dailyForecast={dailyForecast}
        uvIndex={uvIndex}
        dewPoint={dewPoint}
        loading={loading}
        city={city}
        setCity={setCity}
      />
      <BottomDashboard city={city} setCity={setCity}/>
    </div>
  );
};

export default App;
