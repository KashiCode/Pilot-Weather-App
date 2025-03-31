import React from "react";
import TopDashboard from "./Pages/TopDashboard";
import BottomDashboard from "./Pages/BottomDashboard";

const App = () => {
  return (
    <div className="bg-[#161f2c] text-white relative bg-[radial-gradient(ellipse_50.00%_50.00%_at_50.00%_50.00%,_#253244_0%,_#141D2A_100%)] overflow-hidden font-normal font-['Inter']">
      <TopDashboard/>
      <hr/>
      <BottomDashboard/>
    </div>
  )
}

export default App
