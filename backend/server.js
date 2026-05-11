const express = require("express");
const cors = require("cors");

const dashboardRoute =
  require("./routes/dashboard");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/api/dashboard",
  dashboardRoute
);

app.listen(3001, () => {

  console.log(
    "server running on 3001"
  );

});