const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

// home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});

// cluster_info route
app.get('/cluster_info', (req, res) => {
  const cluster_info = require('./cluster_info');
  res.json(cluster_info);
});

// shard allocation route
app.get('/shard_allocation', (req, res) => {
  const shard_allocation = require('./shard_allocation');
  res.json(shard_allocation);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!'); // eslint-disable-line no-console
});
