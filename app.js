const express = require('express');
const cors = require('cors');
const path = require('path');
const pekerjaanRoutes = require('./routes/pekerjaan.routes');

const app = express();

// CORS Configuration
const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers
    credentials: true, // Allow cookies or authentication headers
};

app.use(cors(corsOptions)); // Enable CORS with options

// Middleware
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', pekerjaanRoutes);

// Handle 404 Not Found
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found.' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server on defined port or default 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
