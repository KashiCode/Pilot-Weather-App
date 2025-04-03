import React, { useState } from "react";
import axios from "axios";
import airportData from "../data/airports.json"; // Adjust path as needed

const SearchBar = ({ setCity, setGpsCode }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_KEY = "fea9b6cd12a559d291134b1904bc1281";

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInput(value);

    const isMatch = airportData.find(airport => airport.gps_code === value.toUpperCase());
    if (isMatch) {
      setSuggestions([]);
      return;
    }

    if (value.trim()) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );
        setSuggestions(response.data.list || []);
      } catch (error) {
        console.error("Error fetching city suggestions", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setCity(cityName);
    setInput(cityName);
    setSuggestions([]);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmedInput = input.trim();
    const match = airportData.find((a) => a.gps_code === trimmedInput.toUpperCase());

    if (match) {
      setGpsCode(match.gps_code);   // for AVWX
      setCity(match.city);          // for OpenWeather
    } else {
      setGpsCode(trimmedInput);     // fallback
      setCity(trimmedInput);
    }
    setSuggestions([]);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Enter GPS code (e.g. KJFK)"
          value={input}
          onChange={handleInputChange}
          className="search-bar__input"
        />

        {suggestions.length > 0 && (
          <ul className="search-bar__suggestions">
            {suggestions.map((city) => (
              <li
                key={city.id}
                className="search-bar__suggestion"
                onClick={() => handleSuggestionClick(city.name)}
              >
                {city.name}, {city.sys.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p>Loading suggestions...</p>}
    </form>
  );
};

export default SearchBar;
