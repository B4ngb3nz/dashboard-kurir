import {
  useEffect,
  useState
} from "react";

import Chart from "../components/Chart";

import {
  getOutgoingData
} from "../services/api";

export default function OutgoingPage() {

  const [chartLabels, setChartLabels] =
    useState([]);

  const [chartValues, setChartValues] =
    useState([]);

  const [total, setTotal] =
    useState(0);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

      const response =
        await getOutgoingData();

      console.log(
        "API RESPONSE:",
        response
      );

      const regional =
        response.regional || [];

      const labels =
        regional.map(item =>
          item.name
        );

      const values =
        regional.map(item =>
          item.total
        );

      setChartLabels(labels);

      setChartValues(values);

      setTotal(response.total || 0);

    } catch (err) {

      console.error(
        "LOAD DATA ERROR:",
        err
      );

    }
  }

  return (

    <div
      style={{
        padding: 20
      }}
    >

      <h1>
        Dashboard Outgoing
      </h1>

      <div
        style={{
          marginBottom: 20,
          fontSize: 24,
          fontWeight: "bold"
        }}
      >

        Total:
        {" "}
        {
          Number(total)
          .toLocaleString("id-ID")
        }

      </div>

      <Chart
        labels={chartLabels}
        data={chartValues}
        title="Kiriman Outgoing"
      />

    </div>
  );
}