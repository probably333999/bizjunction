const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server is alive!');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
