const { groupBy, last } = require('lodash');
const shardsJson = require('./shards');

// eslint-disable-next-line no-unused-vars
const shards = shardsJson.filter((s) => {
  // NOTE add optional filter condition here
  // return s.node && s.node.indexOf('cortez') !== -1;
  return true;
});

const nodeGroups = groupBy(shards, (s) => s.node);
const nodeGroupsSummary = Object.keys(nodeGroups).reduce((accum, node) => {
  return Object.assign({},
    accum,
    {
      [node]: {
        num_shards: nodeGroups[node].length,
        shards: nodeGroups[node],
      }
    }
  );
}, {});

const stateGroups = groupBy(shards, (s) => s.prirep + '-' + s.state);

const byteGroups = groupBy(shards, (s) => {
  const gb = s.store / 1000 / 1000 / 1000; // convert bytes to gb
  const group = Math.ceil(gb / 50) * 50; // round s.store to the nearest 50gb
  return group;
});

const byteKeys = Object.keys(byteGroups).map((k) => parseInt(k, 10));
byteKeys.sort((a, b) => a - b); // ensure numeric not unicode sort

const byteGroupsSummary = [];
byteKeys.forEach((key) => {
  const currGroup = key;
  byteGroupsSummary.push(`${currGroup}: ${byteGroups[currGroup].length}`);
});

const biggest = {
  bytes: last(byteKeys),
  shards: byteGroups[last(byteKeys)],
};

//eslint-disable-next-line no-console
console.log(
  JSON.stringify({
    num_shards_total: shards.length,
    nodes: nodeGroupsSummary,
    states: stateGroups,
    shards_by_gb_full: byteGroups,
    shards_by_gb_summary: byteGroupsSummary,
    biggest,
  })
);
