import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoiaXNtYWlsMDUiLCJhIjoiY204bHNxNGY4MGxoZzJqc2dra2RvYXk3biJ9.F1VB-Z0d_IrnWrJGz4juvQ';

const Map = () => {
  const mapContainerRef = useRef(null);
  const [flights, setFlights] = useState([]);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map once
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // You can change this to another style if needed
      center: [114.05, 22.55], // Adjust to the desired location
      zoom: 5, // Adjust zoom level
    });

    mapRef.current = map; // Store the map reference

    const fetchFlights = async () => {
      try {
        const response = await axios.get('https://opensky-network.org/api/states/all');
        setFlights(response.data.states);
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    fetchFlights();
    const intervalId = setInterval(fetchFlights, 10000); // Fetch data every 10 seconds

    return () => {
      map.remove();
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && flights.length > 0) {
      // Remove old markers if they exist
      markers.forEach((marker) => marker.remove());

      const newMarkers = flights.map((flight) => {
        const [icao24, callsign, originCountry, timePosition, lastContact, longitude, latitude, baroAltitude, onGround] = flight;

        if (latitude && longitude) {
          const marker = new mapboxgl.Marker({ color: 'yellow' })
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <strong>${callsign.trim() || 'N/A'}</strong><br>
              Country: ${originCountry}<br>
              Altitude: ${baroAltitude ? (baroAltitude * 3.28084).toFixed(0) + ' ft' : 'N/A'}
            `))
            .addTo(mapRef.current);
          return marker;
        }
        return null;
      }).filter(Boolean); // Remove null markers from the list

      setMarkers(newMarkers); // Update markers state to avoid re-creating markers every time
    }
  }, [flights]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
