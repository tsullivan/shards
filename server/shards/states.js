const { groupBy } = require('lodash');

module.exports = function getStates(shards) {
  const stateGroups = groupBy(shards, (s) => s.prirep + '-' + s.state);
  const stateGroupsSummary = Object.keys(stateGroups).reduce((accum, state) => {
    return accum.concat([
      { state, shards: stateGroups[state] }
    ]);
  }, []);

  return stateGroupsSummary;
};
