// Step 4 & 5: server.js
const express = require('express');
const app = express();
const port = 3000;

// Step 6: Serve your HTML file
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});