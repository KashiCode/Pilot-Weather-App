import React from "react";

const ForecastChartButton = ({ onClick }) => {
  return (
    <button className="forecast-chart-button" onClick={onClick}>
      See more
    </button>
  );
};

export default ForecastChartButton;
