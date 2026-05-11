const express = require("express");

const router =
  express.Router();

const {
  getDashboardData
} = require(
  "../services/kibanaService"
);

router.get(
  "/",
  async (req, res) => {

    try {

      const data =
        await getDashboardData({

          status:
            req.query.status,

          kcu:
            req.query.kcu,

          startDate:
            req.query.startDate,

          endDate:
            req.query.endDate,

          page:
            req.query.page,

          limit:
            req.query.limit

        });

      res.json(data);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);

module.exports = router;