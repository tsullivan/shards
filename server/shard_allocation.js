const { groupBy } = require('lodash');
const shardsJson = require('../diagnostic/shards');
const getByteProperties = require('./get_byte_group_summary');

const stringToKeyword = (string) => {
  if (!string) {
    return string; // for nulls (unassigned shards)
  }
  const keywordMatches = string.match(/[a-zA-Z0-9]+/g);
  return keywordMatches.join(''); // join matches from the regex to make a clean keyword string
};

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
    return accum.concat([
      {
        node,
        node_key: stringToKeyword(node),
        shards: nodeGroups[node]
      }
    ]);
  }, []);

  const stateGroups = groupBy(shards, (s) => s.prirep + '-' + s.state);
  const stateGroupsSummary = Object.keys(stateGroups).reduce((accum, state) => {
    return accum.concat([
      { state, shards: stateGroups[state] }
    ]);
  }, []);

  return Object.assign(
    {
      num_shards_total: shards.length,
      shards_by_node: nodeGroupsSummary,
      shards_by_state: stateGroupsSummary,
    },
    getByteProperties(shards)
  );
}

module.exports = getAllocation();
