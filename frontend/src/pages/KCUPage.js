import { useEffect, useState } from "react";
import { getOutgoingData } from "../services/api";
import Chart from "../components/Chart";

export default function KCUPage() {

  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const res =
        await getOutgoingData();

      setData(res.regional || []);

    } catch (err) {

      console.error(err);

    }
  }

  return (

    <div className="page">

      <h1>Dashboard KCU</h1>

      <Chart
        labels={data.map(x => x.name)}
        data={data.map(x => x.total)}
        title="KCU"
      />

    </div>
  );
}