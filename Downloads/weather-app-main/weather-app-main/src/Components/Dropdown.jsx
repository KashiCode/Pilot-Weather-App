import React from 'react';
import '/src/style.css';

const Dropdown = ({ airports, setSelectedAirport }) => {
  return (
    <div className="dropdown">
      <label className="dropdown__label">
        Select Airport:
      </label>
      <select
        className="dropdown__select"
        onChange={(e) => setSelectedAirport(e.target.value)}
      >
        {airports.map((airport) => (
          <option key={airport.code} value={airport.code}>
            {airport.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;