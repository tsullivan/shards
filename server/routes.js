function runShardRoute(routePath) {
  const shards = require('../diagnostic/shards');
  if (shards.error) {
    return {
      unavailable: true,
      unavailableReason: shards.error.root_cause,
    };
  }

  const shardHandler = require(routePath);
  return shardHandler(shards);
}

module.exports = function registerRoutes(app) {
  // cluster routes
  app.get('/cluster', (req, res) => {
    res.json({ not_implemented: true });
  });

  // shard allocation routes
  app.get('/shards/nodes', (req, res) => {
    const json = runShardRoute('./shards/nodes');
    res.json(json);
  });

  app.get('/shards/states', (req, res) => {
    const json = runShardRoute('./shards/states');
    res.json(json);
  });

  app.get('/shards/bytes', (req, res) => {
    const json = runShardRoute('./shards/bytes');
    res.json(json);
  });

  app.get('/shards/settings', (req, res) => {
    const json = runShardRoute('./shards/settings');
    res.json(json);
  });

  // segment routes
};
