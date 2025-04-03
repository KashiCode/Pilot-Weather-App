import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import planeImg from "../assets/plane.png";

const Map = ({ showPrecipitation, showWind, showStorms }) => {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    let interval;

    const fetchPlanes = async () => {
      try {
        const response = await axios.get("https://opensky-network.org/api/states/all");
        const data = response.data.states || [];

        const newPlaneData = data
          .filter((plane) => plane[5] !== null && plane[6] !== null && plane[10] !== null)
          .slice(0, 1000)
          .map((plane) => ({
            callsign: plane[1]?.trim() || "Unknown",
            lat: plane[6],
            lon: plane[5],
            altitude: plane[7],
            velocity: plane[9],
            heading: plane[10],
          }));

        setPlanes(newPlaneData);
        interval = setTimeout(fetchPlanes, 30000);
      } catch (error) {
        console.error("Error fetching planes:", error);
        interval = setTimeout(fetchPlanes, 6000);
      }
    };

    fetchPlanes();

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={[51.5, -0.1]} zoom={5} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {showPrecipitation && (
        <TileLayer
          url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=894ce4eff574614484ed47f94fccd765`}
          opacity={0.7}
          attribution="Precipitation data by OpenWeatherMap"
        />
      )}

      {showWind && (
        <TileLayer
          url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=894ce4eff574614484ed47f94fccd765`}
          opacity={0.7}
          attribution="Wind data by OpenWeatherMap"
        />
      )}

      {showStorms && (
        <TileLayer
          url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=894ce4eff574614484ed47f94fccd765`}
          opacity={0.7}
          attribution="Storm data by OpenWeatherMap"
        />
      )}

      {planes.map((plane, index) => {
        const planeIcon = new L.divIcon({
          html: `<img src="${planeImg}" style="width:30px; height:30px; transform: rotate(${plane.heading}deg); transition: filter 0.2s ease-in-out;" 
                    class="plane-icon" onmouseover="this.style.filter='hue-rotate(180deg)'" 
                    onmouseout="this.style.filter='none'"/>`,
          className: "leaflet-plane-marker",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        return (
          <Marker key={index} position={[plane.lat, plane.lon]} icon={planeIcon}>
            <Popup>
              <b>{plane.callsign}</b>
              <br /> Altitude: {plane.altitude}m
              <br /> Speed: {plane.velocity} m/s
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;