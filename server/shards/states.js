const { groupBy } = require('lodash');

module.exports = function getSettings(shards) {
  const indicesGroups = groupBy(shards, s => s.index);
  const shardsByIndex = Object.keys(indicesGroups).reduce((accum, index) => {
    return accum.concat([{
      index,
      shards: indicesGroups[index]
    }]);
  }, []);
  const shardsBySetting = groupBy(shardsByIndex, (obj) => {
    const setShards = obj.shards.map(({ prirep, shard, state }) => {
      return `${prirep}${shard}-${state}`;
    });
    setShards.sort();
    return setShards.join('/');
  });

  return shardsBySetting;
};
