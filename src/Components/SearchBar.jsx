import React, { useState, useEffect } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchFlights = async () => {
      try {
        const response = await fetch('https://opensky-network.org/api/states/all');
        const data = await response.json();
        const flights = data.states
          .map((flight) => flight[1]) // Flight callsign
          .filter((callsign) => callsign && callsign.toLowerCase().includes(query.toLowerCase()));

        setSuggestions(flights.slice(0, 10)); // Limit results
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    const timeoutId = setTimeout(fetchFlights, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search flight route"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {suggestions.map((flight, index) => (
          <li key={index}>{flight}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
