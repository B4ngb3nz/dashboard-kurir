import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  ModuleRegistry,
  AllCommunityModule
} from "ag-grid-community";

import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import Select from "react-select";

import { getDashboard } from "../services/api";

import KpiCard from "../components/KpiCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

ModuleRegistry.registerModules([
  AllCommunityModule
]);

function Dashboard() {

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({});
  const [kcuList, setKcuList] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 50;

  const [status, setStatus] = useState("");
  const [kcu, setKcu] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [connoteSearch, setConnoteSearch] = useState("");

  const totalPages = Math.ceil(total / limit);

  const kcuOptions = kcuList.map((item) => ({
    value: item,
    label: item
  }));

  const loadData = useCallback(async () => {

    try {

      const res = await getDashboard({
        page,
        limit,
        status,
        kcu,
        startDate,
        endDate,
        connote: connoteSearch
      });

      setRows(res.data || []);
      setTotal(res.total || 0);
      setSummary(res.summary || {});
      setKcuList(res.kcuList || []);

    } catch (err) {

      console.log(err);

    }

  }, [
    page,
    status,
    kcu,
    startDate,
    endDate,
    connoteSearch
  ]);

  useEffect(() => {

    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);

  }, [loadData]);

  const statusMap = {};

  rows.forEach((row) => {

    if (!statusMap[row.status]) {
      statusMap[row.status] = 0;
    }

    statusMap[row.status]++;

  });

  const chartData = Object.keys(statusMap).map((key) => ({
    name: key,
    total: statusMap[key]
  }));

  const paid = statusMap["PAID"] || 0;
  const delivered = statusMap["DELIVERED"] || 0;
  const onprocess = statusMap["ONPROCESS"] || 0;
  const inlocation = statusMap["INLOCATION"] || 0;
  const invehicle = statusMap["INVEHICLE"] || 0;
  const inbag = statusMap["INBAG"] || 0;
  const unbag = statusMap["UNBAG"] || 0;

  function exportExcel() {

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Dashboard"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    );

    saveAs(blob, "dashboard.xlsx");

  }

  return (

    <div
      style={{
        background: "#071739",
        minHeight: "100vh",
        padding: 20,
        color: "white"
      }}
    >

      <h1>Realtime Dashboard</h1>

      {/* FILTER */}

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap"
        }}
      >

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >

          <option value="">Semua Status</option>
          <option value="PAID">PAID</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="ONPROCESS">ONPROCESS</option>
          <option value="INLOCATION">INLOCATION</option>
          <option value="INVEHICLE">INVEHICLE</option>
          <option value="INBAG">INBAG</option>
          <option value="UNBAG">UNBAG</option>

        </select>

        <div
          style={{
            minWidth: 300,
            color: "black"
          }}
        >

          <Select
            options={kcuOptions}
            value={
              kcuOptions.find(
                (item) => item.value === kcu
              ) || null
            }
            onChange={(selected) => {

              setPage(1);

              setKcu(
                selected
                  ? selected.value
                  : ""
              );

            }}
            isClearable
            placeholder="Pilih atau ketik KCU..."
          />

        </div>

        <input
          type="text"
          placeholder="Cari Connote..."
          value={connoteSearch}
          onChange={(e) => {

            setPage(1);

            setConnoteSearch(
              e.target.value
            );

          }}
          style={{
            padding: 10,
            borderRadius: 8
          }}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => {

            setPage(1);

            setStartDate(
              e.target.value
            );

          }}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => {

            setPage(1);

            setEndDate(
              e.target.value
            );

          }}
        />

        <button onClick={loadData}>
          Filter
        </button>

        <button onClick={exportExcel}>
          Export Excel
        </button>

      </div>

      {/* KPI */}

      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 20,
          flexWrap: "wrap"
        }}
      >

        <KpiCard
          title="TOTAL DATA"
          value={total}
          color="#2563eb"
        />

        <KpiCard
          title="PAID"
          value={paid}
          color="#16a34a"
        />

        <KpiCard
          title="DELIVERED"
          value={delivered}
          color="#9333ea"
        />

        <KpiCard
          title="ON PROCESS"
          value={onprocess}
          color="#ea580c"
        />

        <KpiCard
          title="INLOCATION"
          value={inlocation}
          color="#aa880c"
        />

        <KpiCard
          title="INBAG"
          value={inbag}
          color="#ba680c"
        />

        <KpiCard
          title="UNBAG"
          value={unbag}
          color="#ca780c"
        />

        <KpiCard
          title="INVEHICLE"
          value={invehicle}
          color="#da480c"
        />

      </div>

      {/* CHART */}

      <div
        style={{
          width: "100%",
          height: 300,
          background: "white",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20
        }}
      >

        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* TABLE */}

      <div
        className="ag-theme-quartz-dark"
        style={{
          height: 600,
          width: "100%"
        }}
      >

        <AgGridReact
          rowData={rows || []}
          pagination={true}
          paginationPageSize={50}
          animateRows={true}
          defaultColDef={{
            sortable: true,
            filter: true,
            floatingFilter: true,
            resizable: true
          }}
          columnDefs={[
            {
              headerName: "Connote",
              field: "connote",
              flex: 1
            },
            {
              headerName: "Status",
              field: "status",
              flex: 1
            },
            {
              headerName: "KCU",
              field: "kcu",
              flex: 2
            },
            {
              headerName: "Tanggal",
              field: "created_at",
              flex: 1
            }
          ]}
        />

      </div>

      {/* PAGINATION */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          marginTop: 20
        }}
      >

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Halaman {page} dari {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </div>

  );

}

export default Dashboard;