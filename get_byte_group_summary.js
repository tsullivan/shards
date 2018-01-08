const { groupBy, last } = require('lodash');

const GROUP_BY = 10; // groups lists of shards by this many gigabytes

function getByteProperties(shards) {
  const byteGroups = groupBy(shards, (s) => {
    const gb = s.store / 1000 / 1000 / 1000; // convert bytes to gb
    const group = Math.ceil(gb / GROUP_BY) * GROUP_BY;
    return group;
  });

  const byteKeys = Object.keys(byteGroups).map((k) => parseInt(k, 10));
  byteKeys.sort((a, b) => a - b); // ensure numeric not unicode sort

  const byteGroupsSummary = byteKeys.reduce((accum, key) => {
    return accum.concat([ `${key}: ${byteGroups[key].length}` ]);
  }, []);

  const biggest = {
    bytes: last(byteKeys),
    shards: byteGroups[last(byteKeys)],
  };

  return {
    shards_by_gb_summary: byteGroupsSummary,
    shards_by_gb: byteGroups,
    biggest,
  };
}

module.exports = getByteProperties;
