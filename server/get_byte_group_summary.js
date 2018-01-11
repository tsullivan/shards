const { groupBy } = require('lodash');

const GROUP_BY = 10; // groups lists of shards by this many gigabytes

function getByteProperties(shards) {
  const byteGroups = groupBy(shards, (s) => {
    const gb = s.store / 1000 / 1000 / 1000; // convert bytes to gb
    const group = Math.ceil(gb / GROUP_BY) * GROUP_BY;
    return group;
  });

  const byteKeys = Object.keys(byteGroups).map((k) => parseInt(k, 10));
  byteKeys.sort((a, b) => a - b); // ensure numeric not unicode sort

  const byteGroupsSummary = byteKeys.reduce((accum, gb) => {
    return accum.concat([
      { gb, shards: byteGroups[gb] }
    ]);
  }, []);

  return {
    shards_by_gb: byteGroupsSummary
  };
}

module.exports = getByteProperties;
