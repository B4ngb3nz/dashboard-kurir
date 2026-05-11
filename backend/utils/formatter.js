function formatDashboard(raw) {

  const agg =
    raw.responses?.[0]?.aggregations?.["2"];

  if (!agg) {
    return {
      regional: [],
      total: 0
    };
  }

  const regional =
    agg.buckets.map(item => ({
      name: item.key,
      total: item.doc_count
    }));

  const total =
    regional.reduce(
      (sum, x) => sum + x.total,
      0
    );

  return {
    regional,
    total
  };
}

module.exports = {
  formatDashboard
};