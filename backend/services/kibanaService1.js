async function getKibanaData(filters) {
  console.log("FILTER MASUK:", filters);

  // sementara ignore filter dulu
  return {
    responses: [
      {
        aggregations: {
          "2": {
            buckets: {
              "REG 1": { doc_count: 100 },
              "REG 2": { doc_count: 200 }
            }
          }
        }
      },
      {
        aggregations: {
          "2": {
            buckets: [
              { key: "13000", doc_count: 300 },
              { key: "14000", doc_count: 50 }
            ]
          }
        }
      }
    ]
  };
}