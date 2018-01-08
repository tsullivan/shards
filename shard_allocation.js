const { groupBy } = require('lodash');
const shardsJson = require('./shards');
const getByteProperties = require('./get_byte_group_summary');

function getAllocation() {
  if (shardsJson.error) {
    return {
      unavailable: true,
      unavailableReason: shardsJson.error.root_cause,
    };
  }

  // eslint-disable-next-line no-unused-vars
  const shards = shardsJson.filter((s) => {
    // NOTE add optional filter condition here
    // return s.node && s.node.indexOf('cortez') !== -1;
    return true;
  });

  const nodeGroups = groupBy(shards, (s) => s.node);
  const nodeGroupsSummary = Object.keys(nodeGroups).reduce((accum, node) => {
    return accum.concat([ `${node}: ${nodeGroups[node].length}` ]);
  }, []);

  const stateGroups = groupBy(shards, (s) => s.prirep + '-' + s.state);

  return Object.assign({},
    {
      num_shards_total: shards.length,
      shards_by_node_summary: nodeGroupsSummary,
      shards_by_node: nodeGroups,
      states: stateGroups,
    },
    getByteProperties(shards)
  );
}

module.exports = getAllocation();