function formatDashboard(data) {
  const regionalBuckets = data.responses[0].aggregations["2"].buckets;
  const kantorBuckets = data.responses[1].aggregations["2"].buckets;

  const regional = Object.keys(regionalBuckets).map(key => ({
    name: key,
    total: regionalBuckets[key].doc_count
  }));

  const kantor = kantorBuckets.map(item => ({
    kode: item.key,
    total: item.doc_count
  }));

  const total = regional.reduce((sum, r) => sum + r.total, 0);

  return { regional, kantor, total };
}

module.exports = { formatDashboard };