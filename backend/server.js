const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample QFN manifest with 40 nodes
const qfnManifest = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `Node ${i + 1}`,
  status: 'active', // Example property
  // More properties can be added as needed
}));

// API endpoint to retrieve the QFN manifest
app.get('/api/qfn-manifest', (req, res) => {
  res.json(qfnManifest);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;