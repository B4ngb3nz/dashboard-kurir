import { useState } from "react";
import Table from "../components/Table";

export default function DetailKirimanPage() {

  const [data] = useState([
    {
      awb: "POS123456",
      regional: "REG 1",
      kcu: "JAKARTA",
      status: "DELIVERED"
    },
    {
      awb: "POS999999",
      regional: "REG 2",
      kcu: "BANDUNG",
      status: "ON PROCESS"
    }
  ]);

  return (

    <div className="page">

      <h1>Detail Kiriman</h1>

      <Table
        columns={[
          "awb",
          "regional",
          "kcu",
          "status"
        ]}
        data={data}
      />

    </div>
  );
}