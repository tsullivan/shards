/*eslint-disable no-console*/
const { groupBy, last } = require('lodash');
const shards = require('./shards');

const sizes = groupBy(shards, (s) => {
  const gb = s.store / 1000 / 1000 / 1000; // convert bytes to gb
  return Math.ceil(gb / 50) * 50; // round s.store to the nearest 50gb
});
const states = groupBy(shards, (s) => {
  return s.prirep + '-' + s.state;
});

const sizeKeys = Object.keys(sizes);

console.log(JSON.stringify({
  biggest: sizes[last(sizeKeys)],
  sizes,
  states,
}));
