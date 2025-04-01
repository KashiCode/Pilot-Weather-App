import React from 'react';
import SearchBar from '../Components/SearchBar';
import QuickReports from "../Components/QuickReports";  //Quickreports imported from components.

const BottomDashboard = () => {
  return (
    <div className="bottom-dashboard">
      {/* Live Weather Map */}
      <nav className="weather-map-nav">
        <div className="weather-map-nav__header">
          <div className="weather-map-nav__title">
            <p>Live Weather Map</p>
          </div>
          <div className="weather-map-nav__search-container">
            <SearchBar />
          </div>
        </div>
        <div className="weather-map-nav__links">
          <a href="#" className="weather-map-nav__link">Overview</a>
          <a href="#" className="weather-map-nav__link">Weather Map</a>
          <a href="#" className="weather-map-nav__link">Reports</a>
        </div>
        <div className="weather-map-content">
          {/* Map content would go here */}
        </div>
      </nav>



      {/* Quick Reports Section */}
      <QuickReports selectedAirport={selectedAirport} />
     
    </div>
  );
};

export default BottomDashboard;