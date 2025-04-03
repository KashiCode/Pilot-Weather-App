import React, { useState } from 'react';
import QuickReports from "../Components/QuickReports";
import Map from '../Components/Map';

const BottomDashboard = ({ city, setCity, selectedAirport }) => {
  const [activeLayer, setActiveLayer] = useState(null);

  const handleLayerClick = (layer) => {
    setActiveLayer(activeLayer === layer ? null : layer);
  };
  return (
    <div className="bottom-dashboard">
      <nav className="weather-map-nav">
        <div className="weather-map-nav__header">
          <div className="weather-map-nav__title">
            <p>Live Weather Map</p>
          </div>
        </div>
        <div className="weather-map-nav__links">
        <a
          onClick={(e) => {
            e.preventDefault();
            handleLayerClick('wind');
          }}
          href="#"
          className={`weather-map-nav__link ${activeLayer === 'wind' ? 'active' : ''}`}
        >
          Wind Patterns
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            handleLayerClick('precipitation');
          }}
          href="#"
          className={`weather-map-nav__link ${activeLayer === 'precipitation' ? 'active' : ''}`}
        >
          Precipitation
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            handleLayerClick('storm');
          }}
          href="#"
          className={`weather-map-nav__link ${activeLayer === 'storm' ? 'active' : ''}`}
          data-layer="storm"
        >
          Storm Tracking
        </a>
        </div>
        <div className="weather-map-content">
          {/* <Map showWind={activeLayer === 'wind'}
          showPrecipitation={activeLayer === 'precipitation'}
          showStorms={activeLayer === 'storm'}/> */}
        </div>
      </nav>

      {/* Quick Reports */}
      {selectedAirport ? (
        <QuickReports selectedAirport={selectedAirport} />
      ) : (
        <p className="quick-reports__title">No valid ICAO airport selected</p>
      )}
    </div>
  );
};

export default BottomDashboard;
