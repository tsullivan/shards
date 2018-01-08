const cluster_info = require('./cluster_info');
const shard_allocation = require('./shard_allocation');

//eslint-disable-next-line no-console
console.log( JSON.stringify({ cluster_info, shard_allocation }));
