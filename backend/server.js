const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint examples
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the API' });
});

// Add 39 more endpoint examples as necessary...

// 40 QFN Nodes Manifest placeholder
const qfnNodesManifest = [
    // Fill with actual QFN nodes data as per requirement...
];

// API endpoint to retrieve QFN node manifest
app.get('/api/qfn-nodes', (req, res) => {
    res.json(qfnNodesManifest);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
