const express = require('express');
const app = express();
const registerRoutes = require('./server/routes');

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});

registerRoutes(app);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!'); // eslint-disable-line no-console
});
