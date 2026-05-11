export default function Table({ data }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Regional</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td>{row.name}</td>
            <td>{row.total}</td>
            <td>{row.total > 1000 ? "High" : "Normal"}</td>
          </tr>
        ))}
		{data.total > 3000 && (
			<div style={{ background: "red", color: "white", padding: "10px" }}>
				⚠️ Volume kiriman tinggi!
			</div>
		)}
      </tbody>
    </table>
  );
}