const axios = require("axios");

const {
  getKibanaCookie
} = require(
  "./kibanaPuppeteer"
);

async function getDashboardData(
  filters = {}
) {

  try {

    const cookie =
      await getKibanaCookie();

    const page =
      Number(
        filters.page || 1
      );

    const limit =
      Number(
        filters.limit || 50
      );

    const from =
      (page - 1) * limit;

    // =========================
    // FILTER
    // =========================

    const must = [];

    // STATUS

    if (
      filters.status
    ) {

      must.push({

        term: {

          "connote.connote_state.keyword":
            filters.status

        }

      });

    }

    // KCU

    if (
      filters.kcu
    ) {

      must.push({

        term: {

          "location_data_created.location_name.keyword":
            filters.kcu

        }

      });

    }
 // CONNOTE SEARCH

	if (
		filters.connote
	) {

	must.push({

		wildcard: {

      "connote.connote_code.keyword":
        `*${filters.connote}*`

		}

	});

	}
    // DATE

    if (
      filters.startDate &&
      filters.endDate
    ) {

      must.push({

        range: {

          created_at: {

            gte:
              `${filters.startDate}T00:00:00+0000`,

            lte:
              `${filters.endDate}T23:59:59+0000`

          }

        }

      });

    }

    // =========================
    // SUMMARY + TOTAL + KCU
    // =========================

    const summaryPayload = {

      size: 0,

      track_total_hits: true,

      query: {

        bool: {

          must

        }

      },

      aggs: {

        status_count: {

          terms: {

            field:
              "connote.connote_state.keyword",

            size: 20

          }

        },

        kcu_list: {

          terms: {

            field:
              "location_data_created.location_name.keyword",

            size: 1000

          }

        }

      }

    };

    // =========================
    // DETAIL TABLE
    // =========================

    const detailPayload = {

      from,

      size: limit,

      track_total_hits: true,

      sort: [
        {
          created_at: {
            order: "desc"
          }
        }
      ],

      query: {

        bool: {

          must

        }

      }

    };

    // =========================
    // REQUEST SUMMARY
    // =========================

    const summaryRes =
      await axios.post(

        "https://board.mile.app/elasticsearch/expos.package_connote.pos.*/_search",

        summaryPayload,

        {

          headers: {

            Cookie: cookie,

            "kbn-xsrf":
              "true",

            "Content-Type":
              "application/json"

          },

          timeout: 60000

        }

      );

    // =========================
    // REQUEST DETAIL
    // =========================

    const detailRes =
      await axios.post(

        "https://board.mile.app/elasticsearch/expos.package_connote.pos.*/_search",

        detailPayload,

        {

          headers: {

            Cookie: cookie,

            "kbn-xsrf":
              "true",

            "Content-Type":
              "application/json"

          },

          timeout: 60000

        }

      );

    // =========================
    // SUMMARY
    // =========================

    const statusBuckets =
      summaryRes.data
        ?.aggregations
        ?.status_count
        ?.buckets || [];

    const summary = {};

    statusBuckets.forEach((item) => {

      summary[item.key] =
        item.doc_count;

    });

    // =========================
    // KCU LIST
    // =========================

    const kcuBuckets =
      summaryRes.data
        ?.aggregations
        ?.kcu_list
        ?.buckets || [];

    const kcuList =
      kcuBuckets.map(
        (item) => item.key
      );

    // =========================
    // DETAIL TABLE
    // =========================

    const hits =
      detailRes.data
        ?.hits?.hits || [];

    const rows =
      hits.map((item) => {

        const source =
          item._source || {};

        return {

          connote:
            source.connote
              ?.connote_code || "-",

          status:
            source.connote
              ?.connote_state || "-",

          kcu:
            source
              .location_data_created
              ?.location_name || "-",

          created_at:
            source.created_at || "-"

        };

      });

    return {

      total:
        summaryRes.data
          ?.hits?.total?.value || 0,

      summary,

      kcuList,

      data: rows

    };

  } catch (err) {

    console.log(
      "❌ ERROR ELASTIC"
    );

    console.log(
      err.message
    );

    if (err.response) {

      console.log(
        JSON.stringify(
          err.response.data,
          null,
          2
        )
      );

    }

    return {

      total: 0,

      summary: {},

      kcuList: [],

      data: []

    };

  }

}

module.exports = {
  getDashboardData
};