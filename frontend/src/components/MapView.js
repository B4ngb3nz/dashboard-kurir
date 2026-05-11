import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function MapView() {

  return (

    <div className="chart-box">

      <MapContainer
        center={[-6.2,106.8]}
        zoom={5}
        style={{
          height: "500px"
        }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[-6.2,106.8]}>

          <Popup>
            Jakarta Hub
          </Popup>

        </Marker>

      </MapContainer>

    </div>
  );
}