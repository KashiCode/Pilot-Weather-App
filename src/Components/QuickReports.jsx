import React, { useEffect, useState } from "react";

const AVWX_API_KEY = "dAh-ig3xFgYlUkcr_9TB3FUJJPuD43llMV9lAXuS2XA";
const BASE_URL = "https://avwx.rest/api";

const QuickReports = ({ selectedAirport }) => {
  const [activeTab, setActiveTab] = useState("METAR");
  const [reportData, setReportData] = useState(null);

  const fetchReport = async (type) => {
    try {
      let url = "";

      if (type === "SIGMET") {
        url = `${BASE_URL}/airsigmet?format=json`;
      } else {
        const location = selectedAirport.gps_code;
        url = `${BASE_URL}/${type.toLowerCase()}/${location}?options=info,translate&format=json`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AVWX_API_KEY}`,
        },
      });

      const data = await response.json();

      if (type === "SIGMET") {
        setReportData(Array.isArray(data) ? data.filter(r => r.report_type === "SIGMET") : []);
      } else {
        setReportData(data);
      }

    } catch (error) {
      console.error(`Failed to fetch ${type} data:`, error);
      setReportData(null);
    }
  };

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab, selectedAirport]);

  const renderReport = () => {
    if (!reportData) return <p>Loading {activeTab} data...</p>;

    const {
      raw, sanitized, time, wind_direction, wind_speed,
      visibility, clouds, temperature, dewpoint,
      altimeter, other, flight_rules
    } = reportData;

    return (
      <div className="quick-reports__report-box">
        <h4 className="quick-reports__report-title">
          Latest {activeTab} for {selectedAirport.name} ({selectedAirport.gps_code})
        </h4>

        {["METAR", "TAF"].includes(activeTab) && <p className="quick-reports__report-text">{raw}</p>}

        {activeTab === "METAR" && (
          <>
            <p><strong>Observation Time:</strong> {time?.dt || "N/A"}</p>
            <p><strong>Wind:</strong> {wind_direction?.repr}&deg; at {wind_speed?.repr} knots</p>
            <p><strong>Visibility:</strong> {visibility?.repr}</p>
            <p><strong>Cloud Cover:</strong> {clouds?.map(c => `${c.type} clouds at ${c.altitude * 100} ft`).join(", ")}</p>
            <p><strong>Temperature:</strong> {temperature?.value}&deg;C, Dew Point: {dewpoint?.value}&deg;C</p>
            <p><strong>Pressure:</strong> {altimeter?.value} hPa</p>
            <p><strong>Significant Weather:</strong> {other?.join(", ") || "None"}</p>
            <p><strong>Flight Rules:</strong> {flight_rules}</p>
          </>
        )}

        {activeTab === "TAF" && (
          <>
            <p><strong>Sanitized Forecast:</strong> {sanitized}</p>
            {reportData.forecast?.map((f, i) => (
              <div key={i} className="forecast-block">
                <p><strong>From:</strong> {f.start_time?.repr} <strong>To:</strong> {f.end_time?.repr}</p>
                {f.wind_direction?.repr && f.wind_speed?.repr && (
                  <p><strong>Wind:</strong> {f.wind_direction.repr}&deg; at {f.wind_speed.repr} knots</p>
                )}
                {f.visibility?.repr && (
                  <p><strong>Visibility:</strong> {f.visibility.repr}</p>
                )}
                {f.clouds?.length > 0 && (
                  <p><strong>Clouds:</strong> {f.clouds.map(c => `${c.type} clouds at ${c.altitude * 100} ft`).join(", ")}</p>
                )}
                {f.other?.length > 0 && (
                  <p><strong>Other:</strong> {f.other.join(", ")}</p>
                )}
              </div>
            ))}
          </>
        )}

        {activeTab === "SIGMET" && (
          <>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              reportData.map((sigmet, i) => (
                <div key={i} className="sigmet-block">
                  <p><strong>Issued:</strong> {sigmet.issued || "N/A"}</p>
                  <p><strong>Valid:</strong> {sigmet.valid || "N/A"}</p>
                  <p><strong>Hazard:</strong> {sigmet.hazard || "N/A"}</p>
                  <p><strong>Raw Text:</strong> {sigmet.raw || "N/A"}</p>
                  <p><strong>Description:</strong> {sigmet.description || "No details provided"}</p>
                </div>
              ))
            ) : (
              <p>No SIGMETs active.</p>
            )}
          </>
        )}

        {activeTab === "PIREP" && (
          <>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              reportData.map((pirep, i) => (
                <div key={i} className="pirep-block">
                  <p><strong>Received:</strong> {pirep.received || "N/A"}</p>
                  <p><strong>Aircraft:</strong> {pirep.aircraft || "N/A"}</p>
                  <p><strong>Altitude:</strong> {pirep.altitude_ft || "N/A"} ft</p>
                  <p><strong>Location:</strong> {pirep.location?.repr || "N/A"}</p>
                  <p><strong>Weather:</strong> {pirep.wx_phenomena?.map(w => w.value).join(", ") || "N/A"}</p>
                  <p><strong>Raw Report:</strong> {pirep.raw || "N/A"}</p>
                </div>
              ))
            ) : (
              <p>No PIREPs available.</p>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <section className="quick-reports">
      <h3 className="quick-reports__title">Quick Reports</h3>
      <div className="quick-reports__tabs">
        {["METAR", "TAF", "SIGMET", "PIREP"].map((type) => (
          <button
            key={type}
            className={`quick-reports__tab ${activeTab === type ? "active" : ""}`}
            onClick={() => setActiveTab(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="quick-reports__content">
        {renderReport()}
      </div>
    </section>
  );
};

export default QuickReports;
