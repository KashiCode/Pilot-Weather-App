import React from 'react';
import SearchBar from '../Components/SearchBar';
import Map from '../Components/Map';

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
          <a href="#" className="weather-map-nav__link">Wind Patterns</a>
          <a href="#" className="weather-map-nav__link">Percipitation</a>
          <a href="#" className="weather-map-nav__link">Storm Tracking</a>
        </div>
        <div className="weather-map-content">
          {/* <Map/> */}
        </div>
      </nav>

      {/* Quick Reports */}
      <section className="quick-reports">
        <h3 className="quick-reports__title">Quick Reports</h3>
        <div className="quick-reports__tabs">
          <button className="quick-reports__tab">METAR</button>
          <button className="quick-reports__tab">TAF</button>
          <button className="quick-reports__tab">SIGMET</button>
          <button className="quick-reports__tab">AIRMET</button>
          <button className="quick-reports__tab">PIREP</button>
        </div>
        <div className="quick-reports__content">
          <h4 className="quick-reports__report-title">Latest METAR for EGLL</h4>
          <p className="quick-reports__report-text">EGLL 251450Z 22015KT 9999 BKN020 12/08 Q1013 NOSIG</p>
        </div>
      </section>
    </div>
  );
};

export default BottomDashboard;