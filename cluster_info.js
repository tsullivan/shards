const allocation = require('./allocation_explain_disk');
const getByteProperties = require('./get_byte_group_summary');

function getClusterInfo() {
  const nodeInfo = allocation.cluster_info.nodes;
  const nodes = Object.keys(nodeInfo).reduce((accum, nodeId) => {
    return Object.assign({},
      accum,
      { [nodeId]: nodeInfo[nodeId] }
    );
  }, {});
  const nodesByName = Object.keys(nodeInfo).reduce((accum, nodeId) => {
    const node = Object.assign({}, nodeInfo[nodeId]); // clone object
    node.node_uuid = nodeId;
    const nodeName = node.node_name;
    delete node.node_name;

    return Object.assign({},
      accum,
      { [nodeName]: node }
    );
  }, {});

  const shardPaths = allocation.cluster_info.shard_paths;
  const pathKeys = Object.keys(shardPaths);
  const shardsByNodes = pathKeys.reduce((accum, shardPath) => {
    const match_array = shardPath.match(/^\[(\S+)]\[([0-9]+)], node\[(\S+)], \[.], s\[(\S+)],/);
    const [ match, index, shard, node, state ] = match_array; // eslint-disable-line no-unused-vars
    return Object.assign({},
      accum,
      {
        [`${index}-${shard}`]: {
          node: nodes[node].node_name,
          state,
        }
      }
    );
  }, {});

  const shardSizes = allocation.cluster_info.shard_sizes;
  const shardKeys = Object.keys(shardSizes);
  const shardBytes = shardKeys.reduce((accum, shardBytes) => {
    const match_array = shardBytes.match(/^\[(\S+)]\[([0-9]+)]\[(.)]_bytes$/);
    const [ match, index, shard, prirep ] = match_array; // eslint-disable-line no-unused-vars
    const indexShard = `${index}-${shard}`;
    return accum.concat([
      {
        index,
        shard,
        prirep,
        store: shardSizes[shardBytes],
        node: shardsByNodes[indexShard].node,
        state: shardsByNodes[indexShard].state
      }
    ]);
  }, []);

  return Object.assign({},
    {
      num_shards_total: shardKeys.length,
      nodes: nodesByName,
    },
    getByteProperties(shardBytes)
  );
}

module.exports = getClusterInfo();
