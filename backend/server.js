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


# Dentro del bloque server {} o http {}
server {
    listen 80;
    server_name www.su-dominio.com;

    # ... otras configuraciones ...

    # Redirección 301 para un recurso movido
    location = /productos/viejo-item {
        return 301 /catalogo/nuevo-item;
    }

    # Redirección 301 para una categoría completa si se movió
    location ~ ^/old-category/(.*)$ {
        return 301 /new-category/$1;
    }

    # Página de error 404 personalizada
    error_page 404 /custom_404.html;
    location = /custom_404.html {
        root /usr/share/nginx/html; # O la ruta donde esté su página 404
        internal;
    }

    # ... otras configuraciones ...
}
