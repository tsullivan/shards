const { groupBy } = require('lodash');

module.exports = function getSettings(shards) {
  const indicesGroups = groupBy(shards, s => s.index);
  const shardsByIndex = Object.keys(indicesGroups).reduce((accum, index) => {
    return accum.concat([{
      index,
      shards: indicesGroups[index]
    }]);
  }, []);
  const shardsBySettingKeys = groupBy(shardsByIndex, (obj) => {
    const setShards = obj.shards.map(({ prirep, shard, state }) => {
      return `${prirep}${shard}-${state}`;
    });
    setShards.sort();
    return setShards.join('/');
  });
  const shardsBySetting = Object.keys(shardsBySettingKeys).reduce((accum, setting) => {
    return accum.concat([{
      setting,
      indices: shardsBySettingKeys[setting]
    }]);
  }, []);

  return shardsBySetting;
};
