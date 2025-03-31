import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "mapbox-gl-leaflet";
import "mapbox-gl/dist/mapbox-gl.css";
import planeImg from "../assets/plane.png"; // Your plane icon

const MapboxLayer = () => {
  const map = useMap();
  useEffect(() => {
    L.mapboxGL({
      accessToken: "pk.eyJ1IjoiaXNtYWlsMDUiLCJhIjoiY204bHNxNGY4MGxoZzJqc2dra2RvYXk3biJ9.F1VB-Z0d_IrnWrJGz4juvQ",
      style: "mapbox://styles/mapbox/navigation-night-v1",
    }).addTo(map);
  }, [map]);
  return null;
};

const Map = () => {
  const [planes, setPlanes] = useState([]);
  const planesRef = useRef([]);
  const retryDelayRef = useRef(10000); // Start with 10 seconds

  useEffect(() => {
    let interval;

    const fetchPlanes = async () => {
      try {
        const response = await axios.get("https://opensky-network.org/api/states/all");
        const data = response.data.states || [];

        const newPlaneData = data
          .filter((plane) => plane[5] !== null && plane[6] !== null && plane[10] !== null)
          .slice(0, 100) // Limit to 100 planes
          .map((plane) => ({
            callsign: plane[1]?.trim() || "Unknown",
            lat: plane[6],
            lon: plane[5],
            altitude: plane[7],
            velocity: plane[9],
            heading: plane[10],
          }));

        if (JSON.stringify(planesRef.current) !== JSON.stringify(newPlaneData)) {
          planesRef.current = newPlaneData;
          setPlanes([...newPlaneData]);
        }

        retryDelayRef.current = 30000; // Reset delay to 30 sec on success
      } catch (error) {
        console.error("Error fetching planes:", error);
        if (error.response?.status === 429) {
          // Exponential backoff on rate limit error
          retryDelayRef.current = Math.min(retryDelayRef.current * 2, 300000); // Max 5 min
        }
      }

      interval = setTimeout(fetchPlanes, retryDelayRef.current);
    };

    fetchPlanes();

    return () => clearTimeout(interval);
  }, []);

  return (
    <MapContainer center={[51.5, -0.1]} zoom={5} style={{ height: "500px", width: "100%" }}>
      <MapboxLayer />

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
