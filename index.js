const { groupBy, last } = require('lodash');
const shards = require('./shards');

const sizeGroups = groupBy(shards, (s) => {
  const gb = s.store / 1000 / 1000 / 1000; // convert bytes to gb
  const group = Math.ceil(gb / 50) * 50; // round s.store to the nearest 50gb
  return group + 'gb';
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

const sizeKeys = Object.keys(sizeGroups).map((k) => parseInt(k, 10));
sizeKeys.sort();

const numShardsPerGroup = sizeKeys.reduce((accum, curr) => {
  const currGroup = curr + 'gb';
  return Object.assign({},
    accum,
    { [currGroup]: sizeGroups[currGroup].length }
  );
}, {});

const biggest = {
  group: last(sizeKeys) + 'gb',
  shards: sizeGroups[last(sizeKeys) + 'gb'],
};

//eslint-disable-next-line no-console
console.log(
  JSON.stringify({
    num_shards_total: shards.length,
    shards_by_group: sizeGroups,
    nodes: nodeGroupsSummary,
    states: stateGroups,
    num_shards_per_group: numShardsPerGroup,
    biggest,
  })
);
