import {
  Bar
} from "react-chartjs-2";

import "chart.js/auto";

export default function Chart({
  labels = [],
  data = [],
  title = ""
}) {

  console.log(
    "CHART LABELS:",
    labels
  );

  console.log(
    "CHART DATA:",
    data
  );

  const chartData = {

    labels,

    datasets: [

      {

        label: title,

        data,

        borderWidth: 1

      }

    ]

  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    scales: {

      y: {

        beginAtZero: true,

        ticks: {

          callback: function(value) {

            return Number(value)
              .toLocaleString("id-ID");

          }

        }

      }

    }

  };

  return (

    <div
      style={{
        height: 500,
        background: "#fff",
        padding: 20,
        borderRadius: 12
      }}
    >

      {
        labels.length === 0
        ? (
          <p>
            Tidak ada data chart
          </p>
        )
        : (
          <Bar
            data={chartData}
            options={options}
          />
        )
      }

    </div>
  );
}