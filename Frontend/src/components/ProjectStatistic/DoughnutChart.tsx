import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);


export interface PieChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}
function PieChart({ labels, datasets }: PieChartData) {
  return (
    <Doughnut
      data={{
        labels,
        datasets: datasets.map(dataset => ({
          ...dataset,
          borderWidth: 0,
          hoverBorderWidth: 0,
          spacing: 0,
        })),
      }}
      options={{
        cutout: "70%",
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      }}
    />
  );
}

export default PieChart;