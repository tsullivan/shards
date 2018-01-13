const { groupBy } = require('lodash');

module.exports = function getSettings(shards) {
  const settingGroups = groupBy(shards, (s) => `${s.prirep}-${s.shard}`);
  const settingGroupsSummary = Object.keys(settingGroups).reduce((accum, setting) => {
    return accum.concat([
      { setting, shards: settingGroups[setting] }
    ]);
  }, []);

  return settingGroupsSummary;
};
