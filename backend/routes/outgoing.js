const express = require("express");

const router = express.Router();

const {
  getOutgoingData
} = require("../services/kibanaService");

router.get("/", async (req, res) => {

  try {

    const data =
      await getOutgoingData();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;