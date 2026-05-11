import {
  Link
} from "react-router-dom";

export default function Sidebar() {

  return (

    <div className="sidebar">

      <h2>MILE CONTROL</h2>

      <Link to="/">Dashboard</Link>

      <Link to="/outgoing">
        Kiriman Outgoing
      </Link>

      <Link to="/kcu">
        Per KCU
      </Link>

      <Link to="/detail">
        Detail Kiriman
      </Link>

    </div>
  );
}