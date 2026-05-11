export default function FilterBar({ onFilter }) {

  const handleChange = (e) => {
    const value = e.target.value;

    if (!value) return;

    if (onFilter) {
      onFilter({
        [e.target.name]: value
      });
    }
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <input type="date" name="start" onChange={handleChange} />
      <input type="date" name="end" onChange={handleChange} />

      <select name="regional" onChange={handleChange}>
        <option value="">All Regional</option>
        <option value="REG 1">REG 1</option>
        <option value="REG 2">REG 2</option>
      </select>
    </div>
  );
}