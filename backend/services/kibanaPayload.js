const axios = require("axios");
const { getKibanaCookie } = require("./kibanaPuppeteer");

async function getKibanaData(filters = {}) {

  const cookie = await getKibanaCookie();

  const payload = `
{"index":"expos.package_connote.pos.*","ignore_unavailable":true}
{"size":0,"aggs":{"2":{"terms":{"field":"location_data_created.custom_field.regional_name.keyword","size":10}}}}
`;

  const response = await axios.post(
    "https://board.mile.app/elasticsearch/_msearch?rest_total_hits_as_int=true&ignore_throttled=true",
    payload,
    {
      headers: {
        "Content-Type": "application/x-ndjson",
        "kbn-version": "7.4.2",
        "Cookie": cookie
      },
      timeout: 60000
    }
  );

  return response.data;
}

module.exports = {
  getKibanaData
};