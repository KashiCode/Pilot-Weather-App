import React, { useEffect, useState } from "react";
import WeatherDetails from "../Components/WeatherDetails";


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
      <nav className="bg-[#1D2837] flex justify-between items-center p-8 shadow-2xl h-[85px] border-b-[1px] border-[#2D3C4C]"> 
        <div className="text-neutral-100 text-xl font-bold">
            <p>Aviation WX</p>
        </div>
        {/* Airport DropDown Menu */}
        <div className="flex items-center gap-4 ml-30">
            <label className="text-neutral-200 text-md font-medium font-['Inter']">Select Airport: </label>
            <select className="bg-[#2C3C54] border border-white/20 rounded-lg px-4 py-2 text-base cursor-pointer outline-none transition-background duration-300 ease-in-out" onChange={(e) => setSelectedAirport(e.target.value)}>
                {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                    {airport.name}
                </option>
                ))}
            </select>
        </div>
        <div className="flex gap-10 text-neutral-300 text-md font-medium">
          <a href="#">Overview</a>
          <a href="#">Weather Map</a>
          <a href="#">Reports</a>
        </div>
      </nav>
      <div className="p-4">
        <p className="text-2xl font-medium p-3">Current Airport Weather</p>
      </div>

      <div className="grid grid-cols-3 grid-rows-[200px_300px_300px] gap-6 pt-0 p-6">
      {/* Weather Overview */}
      {loading ? (
        <p className="loading-text">Loading weather data.</p>
      ) : weather ? (
        <section className="row-span-3 flex flex-col gap-5">
            <div className="border border-gray-600 p-6 flex flex-col pb-20 gap-3 shadow-[0px_6px_20px_0px_rgba(0,0,0,0.20)] backdrop-blur-2xl rounded-2xl bg-[#1D2837]">
                <h2 className="font-semibold text-3xl">{airports.find(a => a.code === selectedAirport)?.name} ({selectedAirport})</h2>
                <div className="flex items-center gap-5 pl-5">
                <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] w-25" />
                <div className="font-light text-6xl">{Math.round(weather.temp)}°C</div>
                </div>
                <div className="flex font-light text-neutral-300">
                    <p>Feels like: {weather.feelsLike}°C</p>
                    <p>{weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</p>
                </div>
            </div>
            <div className="border border-gray-600 rounded-[16px] bg-[#1D2837] p-[32px] flex flex-col shadow-2xl text-2xl font-light gap-5">
                <div className="flex justify-between">
                    <div className="time">NOW</div>
                    <div className="time">10AM</div>
                    <div className="time">11AM</div>
                    <div className="time">12PM</div>
                </div>
                <div className="flex justify-between">
                    <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="" />

                </div>
                <div className="flex justify-between">
                    <div className="temp">{Math.round(weather.temp)}°C</div>
                    <div className="temp"></div>
                    <div className="temp"></div>
                    <div className="temp"></div>
                </div>
            </div>
            <div className="border border-gray-600 rounded-[16px] bg-[#1D2837] p-[32px] shadow-2xl font-light text-2xl">
                <div className="flex flex-col gap-5">
                    <div className="">Today</div>
                    <div className="">Tuesday</div>
                    <div className="">Wednesday</div>
                    <div className="">Thursday</div>
                </div>  
            </div>
        </section>

        ) : (
            <p className="error-text"> ⚠️ Weather data unavailable ⚠️</p>
            )}

      {/* Weather Details */}
      <section className="flex justify-between gap-4 col-span-2 h-min">

        <div className="flex flex-col border border-gray-600 rounded-[16px] bg-[radial-gradient(ellipse_50.00%_50.00%_at_50.00%_50.00%,_#2E3D55_0%,_#1D2837_100%)] w-full shadow-2xl gap-4 p-4 backdrop-blur-3xl">
            <div className='font-medium text-2xl text-neutral-200 flex gap-3'>
                Humidity
                <img src="./src/assets/Droplet.svg" className=""/>
            </div>
            <div className='font-light text-5xl text-neutral-200'>
                {weather ? `${weather.humidity}%` : "N/A"}
            </div>
            <div className='font-light text-sm text-neutral-300 flex'>
                {weather ? "Moderate" : ""}
            </div>

        </div>
        <div className="flex flex-col border border-gray-600 rounded-[16px] bg-[radial-gradient(ellipse_50.00%_50.00%_at_50.00%_50.00%,_#2E3D55_0%,_#1D2837_100%)] w-full shadow-2xl gap-4 p-4">
            <div className='font-medium text-2xl text-neutral-200 flex gap-3'>
                Wind Speed
                <img src="./src/assets/polygon.svg" className=""/>
            </div>
            <div className='font-light text-5xl text-neutral-200'>
                {weather ? <img src="./src/assets/windspeed.png" className="w-full p-6"/> : "N/A"}
            </div>
            <div className='font-light text-sm text-neutral-300 flex'>
                {weather ? `${weather.windSpeed}km/h` + `9:00` : "N/A"}
            </div>

        </div>
        <div className="flex flex-col border border-gray-600 rounded-[16px] bg-[radial-gradient(ellipse_50.00%_50.00%_at_50.00%_50.00%,_#2E3D55_0%,_#1D2837_100%)] w-full shadow-2xl gap-4 p-4">
            <div className='font-medium text-2xl text-neutral-200 flex gap-3'>
                UV Index
                <img src="./src/assets/Sun.svg" className=""/>
            </div>
            <div className='font-light text-5xl text-neutral-200'>
                {weather ? `${weather.uvIndex}` : "N/A"}
            </div>
            <div className='font-light text-sm text-neutral-300 flex'>
                {weather ? "Moderate" : ""}
            </div>
        </div>
        <div className="flex flex-col border border-gray-600 rounded-[16px] bg-[radial-gradient(ellipse_50.00%_50.00%_at_50.00%_50.00%,_#2E3D55_0%,_#1D2837_100%)] w-full shadow-2xl gap-4 p-4">
            <div className='font-medium text-2xl text-neutral-200 flex gap-3'>
                Visibility
                <img src="./src/assets/eye.svg" className=""/>
            </div>
            <div className='flex font-light text-5xl text-neutral-200'>
                {weather ? (
                    <>
                    <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    {weather.visibility}km
                    </>
                ) : "N/A"}
            </div>
            <div className='font-light text-sm text-neutral-300 flex'>
                {weather ? "Similar to the actual temputature" : ""}
            </div>
        </div>
        {/* <WeatherDetails
            title="Humidity"
            details={weather ? `${weather.humidity}%` : "N/A"}
            moreDetails={weather ? "Moderate" : ""}
        />
        <WeatherDetails
            title="Wind Speed"
            details={weather ? <img src="./src/assets/windspeed.png" className="w-full p-6"/> : "N/A"}
            moreDetails={weather ? `${weather.windSpeed}km/h` + `9:00` : "N/A"}
        />
        <WeatherDetails
            title="UV Index"
            details={weather ? `${weather.uvIndex}` : "N/A"}
            moreDetails={weather ? "Moderate" : ""}
        />
        <WeatherDetails
            title="Visibility"
            details={weather ? (
                <>
                {weather.visibility}km
                <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </>
            ) : "N/A"}
            moreDetails={weather ? "Good" : ""}
        /> */}
      </section>



      {/* Runway Conditions */}
      <section className="border border-gray-600 rounded-[16px] bg-[#1D2837] p-5 col-span-2 shadow-2xl overflow-hidden relative=">
        {/* <div className="overflow-hidden"> */}
            <h3 className="font-medium text-2xl text-neutral-200">Runway Conditions</h3>
            <img src="./src/assets/plane.svg" className="absolute "></img>
        {/* </div> */}
      </section>


      {/* Active Alerts */}
      <section className="border border-gray-600 rounded-[16px] bg-[#1D2837] p-[32px] col-span-2 shadow-2xl">
        <h3>Active Alerts</h3>
        <p className="alert">⚠️ Strong turbulence expected, reroute advised.</p>
        <p>Time: 09:00 UTC | Region: London FIR</p>
      </section>
      </div>
    </div>
  );
};

export default DashboardPilot;
