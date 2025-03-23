import React from 'react'
import SearchBar from '../Components/SearchBar'
import Map from '../Components/Map'

const BottomDashboard = () => {
  return (
    <div>
      {/* Live Weather Map */}
      <nav className='p-10 flex flex-col gap-10'>
        <div className='flex justify-between'>
            <div className='text-neutral-100 text-2xl font-medium'>
                <p>Live Weather Map</p>
            </div>
            <div className='w-[35%] pl-4 pt-1 text-sm font-light bg-slate-700 rounded-2xl shadow-[0px_6px_20px_0px_rgba(0,0,0,0.20)] border border-gray-600 rounded-[16px]'>
                <SearchBar />
            </div>
        </div>
        <div>
            <div className="flex gap-10 text-neutral-300 text-md font-medium">
            <a href="#">Overview</a>
            <a href="#">Weather Map</a>
            <a href="#">Reports</a>
            </div>
        </div>
        <div className="">
            {/* <Map/> */}
        </div>
      </nav>

      {/* Quick Reports */}
      <section className="quick-reports">
        <h3>Quick Reports</h3>
        <div className="tabs">
          <button>METAR</button>
          <button>TAF</button>
          <button>SIGMET</button>
          <button>AIRMET</button>
          <button>PIREP</button>
        </div>
        <div className="report">
          <h4>Latest METAR for EGLL</h4>
          <p>EGLL 251450Z 22015KT 9999 BKN020 12/08 Q1013 NOSIG</p>
        </div>
      </section>
    </div>
  );
};

export default BottomDashboard
