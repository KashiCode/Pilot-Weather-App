import React, { useState } from "react";
import TopDashboard from "./Pages/TopDashboard";
import BottomDashboard from "./Pages/BottomDashboard";

const airports = [
  { code: "EGLL", city: "London", name: "London Heathrow" },
  { code: "LFPG", city: "Paris", name: "Paris Charles de Gaulle" },
  { code: "EDDF", city: "Frankfurt", name: "Frankfurt Airport" },
  { code: "OMDB", city: "Dubai", name: "Dubai International" },
  { code: "RJTT", city: "Tokyo", name: "Tokyo Haneda" },
];

const App = () => {
  const [selectedAirport, setSelectedAirport] = useState(airports[0]);

  return (
    <div className="bg-[#161f2c] text-white relative bg-[radial-gradient(ellipse_50.00%_50.00%_at_50.00%_50.00%,_#253244_0%,_#141D2A_100%)] overflow-hidden font-normal font-['Inter']">
      <TopDashboard
        selectedAirport={selectedAirport}
        setSelectedAirport={setSelectedAirport}
        airports={airports}
      />
      <hr />
      <BottomDashboard selectedAirport={selectedAirport} />
    </div>
  );
};

export default App;
