const { groupBy } = require('lodash');

module.exports = function getNodes(shards) {
  const nodeGroups = groupBy(shards, (s) => s.node);
  const nodeGroupsSummary = Object.keys(nodeGroups).reduce((accum, node) => {
    return accum.concat([
      { node, shards: nodeGroups[node] }
    ]);
  }, []);

  return nodeGroupsSummary;
};
