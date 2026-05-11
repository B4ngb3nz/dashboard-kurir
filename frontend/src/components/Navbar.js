import {
  useEffect,
  useState
} from "react";

export default function Navbar() {

  const [time, setTime] =
    useState("");

  useEffect(() => {

    const interval =
      setInterval(() => {

        setTime(
          new Date()
            .toLocaleString()
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="navbar">

      <div>

        <h2>
          Realtime Kurir Dashboard
        </h2>

        <p>
          Monitoring Nasional
        </p>

      </div>

      <div>

        <div className="live-status">

          <span className="live-dot"></span>

          LIVE

        </div>

        <p>
          {time}
        </p>

      </div>

    </div>
  );
}