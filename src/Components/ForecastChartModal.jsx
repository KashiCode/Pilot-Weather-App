import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ForecastChartModal = ({ data, onClose }) => {
  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((d) => d.temperature),
        borderColor: "#00bfff",
        backgroundColor: "rgba(0, 191, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
        ticks: { stepSize: 2 },
      },
    },
  };

  return (
    <div className="forecast-chart-modal__overlay">
      <div className="forecast-chart-modal__box">
        <button className="forecast-chart-modal__close" onClick={onClose}>✖</button>
        <h2>24-Hour Temperature Forecast</h2>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ForecastChartModal;
